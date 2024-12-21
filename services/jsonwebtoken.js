const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// genrate token
const genJsonWebToken = async (user) => {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    url: user.profile_image_url,
    name: user.full_name,
  };
  const secret = process.env.JWT_SECRET;

  const token = await jwt.sign(payload, secret);
  return token;
};

// verify token
const verifyJsonWebToken = async (token) => {
  const secret = process.env.JWT_SECRET;

  const payload = await jwt.verify(token, secret);
  if (!payload) return null;
  return payload;
};

module.exports = {
  genJsonWebToken,
  verifyJsonWebToken,
};
