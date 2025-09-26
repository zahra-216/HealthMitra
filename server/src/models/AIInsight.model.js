// server/src/models/AIInsight.model.js
const mongoose = require("mongoose");

const AIInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    type: {
      type: String,
      enum: [
        "health_risk",
        "trend_analysis",
        "medication_alert",
        "general_advice",
        "system_alert",
      ],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // Used in both health and ai controllers
    },
    isActive: {
      type: Boolean,
      default: true, // Used in health.controller.js for filtering active insights
    },
    readAt: {
      type: Date, // Used in markInsightAsRead in ai.controller.js
    },
    dataUsed: [
      {
        dataType: String,
        value: String,
        recordId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthRecord" }, // Used for population
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AIInsight = mongoose.model("AIInsight", AIInsightSchema);

module.exports = AIInsight;
