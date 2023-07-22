const express = require("express");
const router = express.Router();
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const myMiddleware = require("./middleware/myMiddleware");

const createRouterMongoose = () => {
    router.post("/", myMiddleware, async (req, res) => {
        const data = req.body;

        if (typeof data["postId"] === "undefined") {
            return res.status(400).send({ error: "'postId' must be present in the request" });
        }

        if (data.postId === "") {
            return res.status(400).send({ error: "'postId' is empty" });
        }

        try {
            const post = await Post.findById(data.postId);
            if (!post) return res.status(401).send({ error: "Post not found" });
            else {
                const comment = new Comment(data);
                comment.datetime = new Date();
                comment.post = post._id;
                comment.author = req.user._id;

                try {
                    const result = await comment.save();
                    res.send(result);
                }
                catch (err) {
                    res.status(400).send(err);
                }
            }
        }
        catch (err) {
            return res.status(400).send(err);
        }
    });

    router.get("/", async (req, res) => {
        let filter = {};
        if (req.query.post) {
            filter.post = req.query.post;
        }

        try {
            const comments = await Comment.find(filter).sort({ "datetime": "desc" }).populate({
                path: "post",
                populate: { path: "author" }
            });
            res.send(comments);
        }
        catch (err) {
            res.status(500).send(err);
        }
    });

    return router;
}

module.exports = createRouterMongoose;
