const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, props => (`Field '${props.path}' must be filled in`)],
            unique: true,
            validate: {
                validator: async value => {
                    const user = await User.findOne({ username: value });
                    if (user) return false;
                },
                message: "This user is already registered"
            }
        },
        email: {
            type: String,
            required: [true, props => (`Field '${props.path}' must be filled in`)],
            unique: true,
            validate: [
                {
                    validator: value => {
                        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!regex.test(value)) return false;
                    },
                    message: "You have entered an incorrect email"
                },
                {
                    validator: async value => {
                        const email = await User.findOne({ email: value });
                        if (email) return false;
                    },
                    message: "This email is already registered"
                }]
        },
        password: {
            type: String,
            required: [true, props => (`Field '${props.path}' must be filled in`)],
            minlength: [8, "Password must have at least 8 characters"],
            validate: {
                validator: value => {
                    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    if (!regex.test(value)) return false;
                },
                message: "Enter a more complex password"
            },
        },
        token: {
            type: String,
            required: true,
        }
    },
    {
        versionKey: false
    }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;

    next();
});

UserSchema.set("toJSON", {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;