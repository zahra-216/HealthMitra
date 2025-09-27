// server/src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { jwt: jwtConfig } = require("../config");

// -------- Authentication middleware --------
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided. Access denied." });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token: user not found." });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res
      .status(500)
      .json({ message: "Server error during authentication." });
  }
};

// -------- Role-based access middleware --------
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions." });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
