const { verifyJsonWebToken } = require("../services/jsonwebtoken");

const checkAuthenticationCookie = (cookieName) => {
  return async (req, res, next) => {
    const tokenCookieValue = req?.cookies[cookieName];
    if (!tokenCookieValue) {
      console.log("Token not found");
      return next(); // Exit after calling next
    }

    try {
      console.log("Validating token...");
      const payload = await verifyJsonWebToken(tokenCookieValue);
      req.user = payload; // Attach decoded token payload to the request
    } catch (error) {
      console.error("Invalid token:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" }); // Respond with an error
    }

    next(); // Proceed to the next middleware if token is valid
  };
};

module.exports = {
  checkAuthenticationCookie,
};
