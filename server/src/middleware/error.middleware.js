// server/src/middleware/error.middleware.js
const errorMiddleware = (error, req, res, next) => {
  console.error(error.stack);

  // MongoDB duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`,
      error: "Duplicate field value",
    });
  }

  // MongoDB validation error
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    return res.status(400).json({
      message: "Validation Error",
      errors: messages,
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  // Default error
  res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorMiddleware;
