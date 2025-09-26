// server/src/routes/notification.routes.js
const express = require("express");
const { Reminder, User } = require("../models");
const {
  validateRequest,
  reminderSchema,
} = require("../middleware/validation.middleware");
const smsService = require("../services/sms.service");

const router = express.Router();

// Get reminders
router.get("/reminders", async (req, res) => {
  try {
    const { page = 1, limit = 10, type, isActive } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };

    if (type) {
      query.type = type;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const reminders = await Reminder.find(query)
      .sort({ scheduledTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reminder.countDocuments(query);

    res.json({
      reminders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching reminders",
      error: error.message,
    });
  }
});

// Create reminder
router.post("/reminders", validateRequest(reminderSchema), async (req, res) => {
  try {
    const reminderData = {
      ...req.body,
      userId: req.user._id,
    };

    const reminder = new Reminder(reminderData);
    await reminder.save();

    res.status(201).json({
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error creating reminder",
      error: error.message,
    });
  }
});

// Update reminder
router.put("/reminders/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({
      message: "Reminder updated successfully",
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error updating reminder",
      error: error.message,
    });
  }
});

// Delete reminder
router.delete("/reminders/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error deleting reminder",
      error: error.message,
    });
  }
});

// Send test SMS
router.post("/test-sms", async (req, res) => {
  try {
    const { message } = req.body;

    if (!req.user.phone) {
      return res
        .status(400)
        .json({ message: "Phone number not found in profile" });
    }

    const result = await smsService.sendSMS(
      req.user.phone,
      message || "This is a test message from HealthMitra!"
    );

    res.json({
      message: "Test SMS sent successfully",
      sid: result.sid,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send test SMS",
      error: error.message,
    });
  }
});

// Update notification preferences
router.put("/preferences", async (req, res) => {
  try {
    const { notifications, reminderTimes } = req.body;

    const updateData = {};
    if (notifications) {
      updateData["preferences.notifications"] = notifications;
    }
    if (reminderTimes) {
      updateData["preferences.reminderTimes"] = reminderTimes;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Notification preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error updating preferences",
      error: error.message,
    });
  }
});

module.exports = router;
