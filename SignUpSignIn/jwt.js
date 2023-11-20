const jwt = require("jsonwebtoken");
const User = require("./user.js");

const createToken = (id) => {
    return jwt.sign({ id }, "secret_key", { expiresIn: "1h" });
};

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "secret_key", (error, decodedToken) => {
            if (error) {
                console.log(error.message);
                res.redirect("/login");
            } else {
                console.log(decodedToken);
                next();
            }
        });
    } else {
        res.redirect("/login");
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, "secret_key", async (error, decodedToken) => {
            if (error) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { createToken, requireAuth, checkUser };
