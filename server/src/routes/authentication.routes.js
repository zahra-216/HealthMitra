const express = require("express");
const {
  validateRequest,
  userRegistrationSchema,
  userLoginSchema,
} = require("../middleware/validation.middleware");
const { authMiddleware } = require("../middleware/auth.middleware");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Public routes
router.post(
  "/register",
  validateRequest(userRegistrationSchema),
  authController.register
);
router.post("/login", validateRequest(userLoginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
