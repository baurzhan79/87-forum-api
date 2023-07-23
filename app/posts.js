const express = require("express");
const router = express.Router();
const Post = require("./models/Post");
const myMiddleware = require("./middleware/myMiddleware");

const multer = require("multer");
const path = require("path");
const config = require("../config");
const { nanoid } = require("nanoid");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const createRouterMongoose = () => {
    router.post("/", upload.single("image"), myMiddleware, async (req, res) => {
        const data = req.body;

        if (req.file) {
            data.image = req.file.filename;
            if (typeof data["description"] === "undefined") data.description = "";
        }
        else {
            data.image = null;
            if (typeof data["description"] === "undefined") {
                return res.status(400).send({ error: "Description or image must be present" });
            }
            if (data.description === "") {
                return res.status(400).send({ error: "Description is empty" });
            }
        }

        const post = new Post(data);
        post.author = req.user._id;
        post.datetime = new Date();

        try {
            const result = await post.save();
            res.send(result);
        }
        catch (err) {
            res.status(400).send(err);
        }

    });

    router.get("/", async (req, res) => {
        try {
            const posts = await Post.find().sort({ "datetime": "desc" }).populate("author");
            res.send(posts);
        }
        catch (err) {
            res.status(500).send(err);
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const post = await Post.findById(req.params.id).sort({ "datetime": "desc" }).populate("author");
            res.send(post);
        }
        catch (err) {
            res.status(404).send(err);
        }
    });

    return router;
}

module.exports = createRouterMongoose;
