const User = require("./user.js");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { createToken } = require("./jwt.js");
const jwt = require("jsonwebtoken");

exports.signup_get = (req, res) => {
    res.render("signup");
};

exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        } else {
            if (password.length < 4) {
                return res.status(400).json({
                    message: "Password should be at least 4 characters long",
                });
            } else {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res
                        .status(400)
                        .json({ message: "User already exists" });
                } else {
                    const hashPassword = await bcrypt.hash(password, 10);
                    const user = await User.create({
                        email,
                        password: hashPassword,
                    });

                    const token = createToken(user._id);
                    res.cookie("jwt", token, { httpOnly: true });
                    return res.status(200).json({ user: user._id });
                }
            }
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            const ValidationErrors = Object.values(error.errors).map(
                (err) => err.message
            );
            return res.status(400).json({ error: ValidationErrors });
        } else {
            return res.status(500).json({ error: "Something went wrong" });
        }
    }
};

exports.login_get = (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "secret_key", (error, decodedToken) => {
            if (error) {
                res.render("login");
            } else {
                res.render("dashboard");
            }
        });
    } else {
        res.render("login");
    }
};

exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = createToken(user._id);
                res.cookie("jwt", token, { httpOnly: true });
                return res.status(200).json({ user: user._id });
            } else {
                throw new Error("Incorrect Password");
            }
        } else {
            throw new Error("Email is not registered");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.dashboard = (req, res) => {
    res.render("dashboard");
};

exports.logout = (req, res) => {
    res.cookie("jwt", "", { expiresIn: 1 });
    res.redirect("/");
};
