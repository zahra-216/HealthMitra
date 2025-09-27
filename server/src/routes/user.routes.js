//server/src/routes/user.routes.js
const express = require("express");
const {
  getAllUsers,
  getUserById,
  getUserHealthRecords,
} = require("../controllers/user.controller");
const { roleMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

// Routes
router.get("/", roleMiddleware(["admin", "doctor"]), getAllUsers);
router.get("/:id", getUserById);
router.get("/:id/health-records", getUserHealthRecords);

module.exports = router;
