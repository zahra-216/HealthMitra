// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("express-async-errors");
require("dotenv").config();

// Import routes
const authRoutes = require("./src/routes/authentication.routes");
const userRoutes = require("./src/routes/user.routes");
const healthRoutes = require("./src/routes/health.routes");
const aiRoutes = require("./src/routes/ai.routes");
const notificationRoutes = require("./src/routes/notification.routes");

// Import middleware
const errorMiddleware = require("./src/middleware/error.middleware");
const { authMiddleware } = require("./src/middleware/auth.middleware");

// Import services
const cronService = require("./src/services/cron.service");

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------- Security Middleware -------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'"],
        connectSrc: [
          "'self'",
          process.env.CLIENT_URL || "http://localhost:5173",
        ],
      },
    },
  })
);

// ------------------- Rate Limiting -------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // limit each IP to 5 requests per window
  message: "Too many authentication attempts, please try again later.",
  skipSuccessfulRequests: true,
});

// ------------------- Middleware -------------------
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ------------------- Health Check -------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ------------------- Routes -------------------
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/health", authMiddleware, healthRoutes);
app.use("/api/ai", authMiddleware, aiRoutes);
app.use("/api/notifications", authMiddleware, notificationRoutes);

// ------------------- Error Handling -------------------
app.use(errorMiddleware);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ------------------- Database Connection -------------------
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/healthmitra")
  .then(() => {
    console.log("Connected to MongoDB");

    // Start cron jobs after DB connection
    cronService.startCronJobs();

    // Start server
    app.listen(PORT, () => {
      console.log(`HealthMitra server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1);
  });

// ------------------- Graceful Shutdown -------------------
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    process.exit(0);
  });
});

module.exports = app;
