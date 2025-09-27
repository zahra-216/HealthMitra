// server/src/controllers/notification.controller.js
const { notificationService, smsService } = require("../services");

const getReminders = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, isActive } = req.query;
    const filters = {};
    if (type) filters.type = type;
    if (isActive !== undefined) filters.isActive = isActive === "true";

    const data = await notificationService.getReminders(
      req.user._id,
      filters,
      page,
      limit
    );

    res.json({
      reminders: data.reminders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(data.total / limit),
        total: data.total,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reminders", error: error.message });
  }
};

const createReminder = async (req, res) => {
  try {
    const reminder = await notificationService.createReminder(
      req.user._id,
      req.body
    );
    res
      .status(201)
      .json({ message: "Reminder created successfully", reminder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating reminder", error: error.message });
  }
};

const updateReminder = async (req, res) => {
  try {
    const reminder = await notificationService.updateReminder(
      req.user._id,
      req.params.id,
      req.body
    );
    if (!reminder)
      return res.status(404).json({ message: "Reminder not found" });
    res.json({ message: "Reminder updated successfully", reminder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating reminder", error: error.message });
  }
};

const deleteReminder = async (req, res) => {
  try {
    const reminder = await notificationService.deleteReminder(
      req.user._id,
      req.params.id
    );
    if (!reminder)
      return res.status(404).json({ message: "Reminder not found" });
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting reminder", error: error.message });
  }
};

const sendTestSMS = async (req, res) => {
  try {
    if (!req.user.phone)
      return res.status(400).json({ message: "Phone number not found" });

    const result = await smsService.sendSMS(
      req.user.phone,
      req.body.message || "This is a test message from HealthMitra!"
    );

    res.json({ message: "Test SMS sent successfully", sid: result.sid });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send SMS", error: error.message });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const preferences = await notificationService.updatePreferences(
      req.user._id,
      req.body
    );
    res.json({ message: "Preferences updated successfully", preferences });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating preferences", error: error.message });
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  sendTestSMS,
  updatePreferences,
};
