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
    title: { type: String, required: true },
    message: { type: String, required: true },

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

    isRead: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    readAt: { type: Date },

    dataUsed: [
      {
        dataType: { type: String },
        value: { type: String },
        recordId: { type: mongoose.Schema.Types.ObjectId, ref: "HealthRecord" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIInsight", AIInsightSchema);
