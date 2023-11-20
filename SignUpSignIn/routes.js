const express = require("express");
const router = express.Router();
const { requireAuth } = require("./jwt.js");
const controller = require("./controller.js");

// signup new account
router.get("/signup", controller.signup_get);

router.post("/signup", controller.signup_post);

// login an account
router.get("/", controller.login_get);
router.get("/login", controller.login_get);

router.post("/login", controller.login_post);

// Dashboard
router.get("/dashboard", requireAuth, controller.dashboard);

// Logout
router.get("/logout", controller.logout);

module.exports = router;
