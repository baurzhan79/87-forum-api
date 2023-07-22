const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config");

const users = require("./app/users");
const posts = require("./app/posts");
const comments = require("./app/comments");

const app = express();
const port = 8000;

const corsOption = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOption));
app.use(express.json());
app.use(express.static("public"));

const runMongoose = async () => {
    await mongoose.connect(config.db.url + "/" + config.db.name, { useNewUrlParser: true });
    console.log("mongoose connected");

    app.use("/users", users());
    app.use("/posts", posts());
    app.use("/comments", comments());

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

};

runMongoose();