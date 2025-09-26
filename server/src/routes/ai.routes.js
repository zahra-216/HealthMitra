// server/src/routes/ai.routes.js
const express = require("express");
const { AIInsight } = require("../models");
const aiService = require("../services/ai.service");

const router = express.Router();

// Get AI insights for user
router.get("/insights", async (req, res) => {
  try {
    const { page = 1, limit = 10, severity, isRead } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id, isActive: true };

    if (severity) {
      query.severity = severity;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const insights = await AIInsight.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("dataUsed.recordId", "title type recordDate");

    const total = await AIInsight.countDocuments(query);
    const unreadCount = await AIInsight.countDocuments({
      userId: req.user._id,
      isActive: true,
      isRead: false,
    });

    res.json({
      insights,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching AI insights",
      error: error.message,
    });
  }
});

// Mark insight as read
router.patch("/insights/:id/read", async (req, res) => {
  try {
    const insight = await AIInsight.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!insight) {
      return res.status(404).json({ message: "Insight not found" });
    }

    res.json({
      message: "Insight marked as read",
      insight,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error updating insight",
      error: error.message,
    });
  }
});

// Get health risk assessment
router.post("/assess-risk", async (req, res) => {
  try {
    const { vitals } = req.body;
    const assessments = {};

    if (vitals.bloodPressure) {
      assessments.bloodPressure = aiService.assessBloodPressureRisk(
        vitals.bloodPressure.systolic,
        vitals.bloodPressure.diastolic
      );
    }

    if (vitals.bloodSugar) {
      Object.keys(vitals.bloodSugar).forEach((type) => {
        if (vitals.bloodSugar[type]) {
          assessments[`bloodSugar_${type}`] = aiService.assessBloodSugarRisk(
            vitals.bloodSugar[type],
            type
          );
        }
      });
    }

    if (vitals.weight && vitals.height) {
      const bmi = aiService.calculateBMI(vitals.weight, vitals.height);
      assessments.bmi = {
        value: bmi,
        category:
          bmi < 18.5
            ? "Underweight"
            : bmi < 25
            ? "Normal"
            : bmi < 30
            ? "Overweight"
            : "Obese",
        risk: bmi < 18.5 || bmi >= 30 ? "high" : bmi >= 25 ? "medium" : "low",
      };
    }

    res.json({
      assessments,
      disclaimer:
        "These assessments are for informational purposes only and should not replace professional medical advice. Always consult with healthcare providers for medical decisions.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error performing risk assessment",
      error: error.message,
    });
  }
});

// Generate insights for user manually
router.post("/generate-insights", async (req, res) => {
  try {
    const insights = await aiService.generateHealthInsights(req.user._id);
    res.json({
      message: "Health insights generated successfully",
      count: insights.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error generating insights",
      error: error.message,
    });
  }
});

module.exports = router;
