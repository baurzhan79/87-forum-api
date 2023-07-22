const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: async value => {
                    const post = await Post.findOne({ title: value });
                    if (post) return false;
                },
                message: "Post with this title is already exists"
            }
        },
        description: String,
        image: String,
        datetime: {
            type: Date,
            default: new Date()
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        versionKey: false
    }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
