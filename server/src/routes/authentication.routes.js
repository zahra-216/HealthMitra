// server/src/routes/authentication.routes.js
const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
} = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  validateRequest,
  userRegistrationSchema,
  userLoginSchema,
} = require("../middleware/validation.middleware");

const router = express.Router();

// ---------- Public Routes ----------
router.post("/register", validateRequest(userRegistrationSchema), register);
router.post("/login", validateRequest(userLoginSchema), login);
router.post("/refresh-token", refreshToken);

// ---------- Protected Routes ----------
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
