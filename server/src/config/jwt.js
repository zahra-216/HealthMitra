// server/src/config/jwt.js
module.exports = {
  secret:
    process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
};
