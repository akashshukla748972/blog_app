const User = require("../models/userModel");
const { genJsonWebToken } = require("../services/jsonwebtoken");
const bcrypt = require("bcryptjs");

const handleSingupFromUser = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req?.body;

    if (!full_name || !email || !phone || !password) {
      return res.render("signup", {
        error: `${!full_name ? "Full Name, " : ""}${!email ? "Email, " : ""}${
          !phone ? "Phone, " : ""
        }${!password ? "Password, " : ""} Is Required`,
      });
    }

    //   check email or phone exist or not
    const isExistEmail = await User.findOne({ email });
    const isExistPhone = await User.findOne({ phone });
    if (isExistEmail || isExistPhone)
      return res.render("signup", {
        error: `${isExistEmail ? "Email Already Exist ." : ""}${
          isExistPhone ? "Phone Already Exist ." : ""
        }`,
      });

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await User.create({
      full_name,
      email,
      phone,
      password: hashPassword,
    });

    return res.render("signup", {
      message: "Successfully register now you can login",
    });
    return res.redirect("/users/signin", {
      message: "Successfully register now you can login",
    });
  } catch (error) {
    return res.render("signup", { error: "Internal server error" });
  }
};

const handleSigninFromUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check field data not empty
    if (!email || !password) {
      return res.render("signin", {
        error: `${!email ? "Email " : ""}${
          !password ? "Password" : ""
        } Is Required!`,
      });
    }

    const searchUser = await User.findOne({ email });
    if (!searchUser)
      return res.render("signin", { error: "Email or Passwrd wrong" });

    // check password
    const isMatch = await bcrypt.compare(password, searchUser.password);
    if (!isMatch)
      return res.render("signin", { error: "Email or Passwrd wrong" });

    // gen jwt token
    const token = await genJsonWebToken(searchUser);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Internal server error!" });
  }
};

module.exports = {
  handleSingupFromUser,
  handleSigninFromUser,
};
