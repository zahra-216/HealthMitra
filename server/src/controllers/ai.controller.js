// server/src/controllers/ai.controller.js
const { AIInsight } = require("../models");
const aiService = require("../services/ai.service");

// Get AI insights (with filters + pagination)
const getInsights = async (req, res) => {
  try {
    const { page = 1, limit = 10, severity, isRead } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { userId: req.user._id, isActive: true };
    if (severity) query.severity = severity;
    if (isRead !== undefined) query.isRead = isRead === "true";

    const [insights, total, unreadCount] = await Promise.all([
      AIInsight.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("dataUsed.recordId", "title type recordDate"),
      AIInsight.countDocuments(query),
      AIInsight.countDocuments({
        userId: req.user._id,
        isActive: true,
        isRead: false,
      }),
    ]);

    res.json({
      success: true,
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
      success: false,
      message: "Failed to fetch AI insights",
      error: error.message,
    });
  }
};

// Mark an insight as read
const markInsightAsRead = async (req, res) => {
  try {
    const insight = await AIInsight.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!insight) {
      return res
        .status(404)
        .json({ success: false, message: "Insight not found" });
    }

    res.json({ success: true, message: "Insight marked as read", insight });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update insight",
      error: error.message,
    });
  }
};

// Assess health risks based on vitals
const assessHealthRisk = async (req, res) => {
  try {
    const { vitals } = req.body;
    if (!vitals) {
      return res
        .status(400)
        .json({ success: false, message: "Vitals data is required" });
    }

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
      success: true,
      assessments,
      disclaimer:
        "These assessments are for informational purposes only and should not replace professional medical advice.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to perform risk assessment",
      error: error.message,
    });
  }
};

// Generate health insights for a user
const generateInsights = async (req, res) => {
  try {
    const insights = await aiService.generateHealthInsights(req.user._id);
    res.json({
      success: true,
      message: "Health insights generated successfully",
      count: insights.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate insights",
      error: error.message,
    });
  }
};

module.exports = {
  getInsights,
  markInsightAsRead,
  assessHealthRisk,
  generateInsights,
};
