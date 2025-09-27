// server/src/models/Notification.model.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimizes queries by user
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["system", "alert", "reminder", "insight"],
      default: "system",
    },
    link: {
      type: String,
      trim: true, // Optional deep link within app
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true, // For filtering unread notifications
    },
    scheduledTime: {
      type: Date, // For reminders or time-sensitive notifications
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Optional: compound index for faster filtering by user and unread status
NotificationSchema.index({ userId: 1, isRead: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
