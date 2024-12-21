const User = require("../models/userModel");
const { genJsonWebToken } = require("../services/jsonwebtoken");
const bcrypt = require("bcryptjs");

const handleSignupFromUser = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req?.body;

    // Check for missing fields
    if (!full_name || !email || !phone || !password) {
      const missingFields = [];
      if (!full_name) missingFields.push("Full Name");
      if (!email) missingFields.push("Email");
      if (!phone) missingFields.push("Phone");
      if (!password) missingFields.push("Password");

      return res.render("signup", {
        error: `${missingFields.join(", ")} is required`,
      });
    }

    // Check if email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      const conflictField = existingUser.email === email ? "Email" : "Phone";
      return res.render("signup", {
        error: `${conflictField} already exists.`,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create({
      full_name,
      email,
      phone,
      password: hashedPassword,
    });

    // Redirect to sign-in page
    return res.redirect("/users/signin");
  } catch (error) {
    console.error("Signup Error:", error); // Log the error
    return res.render("signup", { error: "Internal server error" });
  }
};

const handleSigninFromUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      const missingFields = [];
      if (!email) missingFields.push("Email");
      if (!password) missingFields.push("Password");
      return res.render("signin", {
        error: `${missingFields.join(" and ")} is required!`,
      });
    }

    // Search for user in the database
    const searchUser = await User.findOne({ email });
    if (!searchUser || !(await bcrypt.compare(password, searchUser.password))) {
      return res.render("signin", { error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = await genJsonWebToken(searchUser);

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 24 * 60 * 1000, // 1 day
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "strict",
    });

    // Redirect to the home page
    return res.redirect("/");
  } catch (error) {
    console.error("Signin Error:", error); // Log unexpected errors
    return res.render("signin", { error: "Internal server error!" });
  }
};

module.exports = {
  handleSignupFromUser,
  handleSigninFromUser,
};
