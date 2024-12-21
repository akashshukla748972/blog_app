const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { genJsonWebToken } = require("../services/jsonwebtoken");
const {
  handleSigninFromUser,
  handleSingupFromUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.post("/signin", handleSigninFromUser);

router.post("/signup", handleSingupFromUser);

router.get("/logout", (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    })
    .redirect("/users/signin");
});

module.exports = router;
