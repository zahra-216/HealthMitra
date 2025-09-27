// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err); // Always log for debugging
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
