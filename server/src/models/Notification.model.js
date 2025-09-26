// server/src/models/Notification.model.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["system", "alert", "reminder", "insight"],
      default: "system",
    },
    link: String, // Optional deep link within the app
    isRead: {
      type: Boolean,
      default: false,
    },
    scheduledTime: Date, // For reminders or time-sensitive alerts
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
