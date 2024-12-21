const { verifyJsonWebToken } = require("../services/jsonwebtoken");

const userAuthentication = async (req, res, next) => {
  const token = await req?.cookies?.token;
  if (!token) return res.redirect("/users/signin");

  const payload = await verifyJsonWebToken(token);
  if (!payload) return res.redirect("/users/signin");
  req.user = payload;
  next();
};

module.exports = {
  userAuthentication,
};
