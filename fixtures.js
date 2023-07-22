const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const config = require("./config");

const User = require("./app/models/User");
const Post = require("./app/models/Post");
const Comment = require("./app/models/Comment");

mongoose.connect(config.db.url + "/" + config.db.name);
const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("comments");
        await db.dropCollection("posts");
        await db.dropCollection("users");
    }
    catch (e) {
        console.log("Collections were not present, skipping drop...");
    }

    const [UserAdmin, UserUser] = await User.create(
        {
            username: "admin",
            email: "admin@forum.kz",
            password: "123",
            token: nanoid()
        },
        {
            username: "user",
            email: "user@forum.kz",
            password: "456",
            token: nanoid()
        }
    );

    const [Post1, Post2, Post3, Post4] = await Post.create(
        {
            title: "новость №1",
            description: "Нефть подорожала из-за решения ОПЕК+ сократить добычу",
            image: "petroleum.jpg",
            datetime: new Date(),
            author: UserAdmin._id,
        },
        {
            title: "новость №2",
            description: "Масштабный книжный фестиваль KitapFest состоялся в Астане",
            datetime: new Date(),
            author: UserAdmin._id,
        },
        {
            title: "новость №3",
            description: "Школа айти направления на 300 мест откроется в Кокшетау",
            datetime: new Date(),
            author: UserUser._id,
        },
        {
            title: "новость №4",
            description: "Глобальное потепление: ООН заявляет, что изменение климата вышло из-под контроля",
            image: "Global-warming.jpg",
            datetime: new Date(),
            author: UserUser._id,
        }
    );

    await Comment.create(
        {
            text: "Comment 1 for post 1",
            datetime: new Date(),
            post: Post1._id,
            author: UserAdmin._id,
        },
        {
            text: "Comment 2 for post 1",
            datetime: new Date(),
            post: Post1._id,
            author: UserAdmin._id,
        },
        {
            text: "Comment 1 for post 2",
            datetime: new Date(),
            post: Post2._id,
            author: UserAdmin._id,
        },
        {
            text: "Comment 2 for post 2",
            datetime: new Date(),
            post: Post2._id,
            author: UserAdmin._id,
        },
        {
            text: "Comment 1 for post 3",
            datetime: new Date(),
            post: Post3._id,
            author: UserUser._id,
        },
        {
            text: "Comment 2 for post 3",
            datetime: new Date(),
            post: Post3._id,
            author: UserUser._id,
        },
        {
            text: "Comment 1 for post 4",
            datetime: new Date(),
            post: Post4._id,
            author: UserUser._id,
        },
        {
            text: "Comment 2 for post 4",
            datetime: new Date(),
            post: Post4._id,
            author: UserUser._id,
        }
    );

    db.close();
    console.log("Connect closed");
});
