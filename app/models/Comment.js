const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
    {
        text: {
            type: String,
            required: true
        },
        datetime: {
            type: Date,
            default: new Date()
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
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

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
