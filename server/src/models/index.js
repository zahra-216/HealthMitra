// server/src/models/index.js

const User = require("./User.model");
const HealthRecord = require("./HealthRecord.model");
const AIInsight = require("./AIInsight.model");
const Notification = require("./Notification.model");

// Export all models
module.exports = {
  User,
  HealthRecord,
  AIInsight,
  Notification,
  Reminder: require("./reminder.model"),
};
