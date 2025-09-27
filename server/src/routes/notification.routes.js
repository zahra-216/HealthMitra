// server/src/routes/notification.routes.js
const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  validateRequest,
  reminderSchema,
} = require("../middleware/validation.middleware");
const notificationController = require("../controllers/notification.controller");

const router = express.Router();

router.use(authMiddleware);

// Reminders
router.get("/reminders", notificationController.getReminders);
router.post(
  "/reminders",
  validateRequest(reminderSchema),
  notificationController.createReminder
);
router.put("/reminders/:id", notificationController.updateReminder);
router.delete("/reminders/:id", notificationController.deleteReminder);

// Test SMS
router.post("/test-sms", notificationController.sendTestSMS);

// Notification preferences
router.put("/preferences", notificationController.updatePreferences);

module.exports = router;
