// server/src/utils/constants.js
module.exports = {
  // User roles
  USER_ROLES: {
    PATIENT: "patient",
    DOCTOR: "doctor",
    VOLUNTEER: "volunteer",
    ADMIN: "admin",
  },

  // Health record types
  RECORD_TYPES: {
    PRESCRIPTION: "prescription",
    LAB_REPORT: "lab_report",
    SCAN: "scan",
    VISIT_NOTE: "visit_note",
    VITAL_SIGNS: "vital_signs",
  },

  // AI insight types
  INSIGHT_TYPES: {
    HEALTH_RISK: "health_risk",
    TREND_ANALYSIS: "trend_analysis",
    MEDICATION_ALERT: "medication_alert",
    GENERAL_ADVICE: "general_advice",
  },

  // Risk severity levels
  RISK_LEVELS: {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    CRITICAL: "critical",
  },

  // Reminder types
  REMINDER_TYPES: {
    MEDICATION: "medication",
    APPOINTMENT: "appointment",
    CHECKUP: "checkup",
    TEST: "test",
  },

  // Health thresholds
  HEALTH_THRESHOLDS: {
    BLOOD_PRESSURE: {
      NORMAL: { systolic: [90, 120], diastolic: [60, 80] },
      ELEVATED: { systolic: [120, 129], diastolic: [60, 80] },
      HIGH_1: { systolic: [130, 139], diastolic: [80, 89] },
      HIGH_2: { systolic: [140, 180], diastolic: [90, 120] },
      CRISIS: { systolic: 180, diastolic: 120 },
    },
    BLOOD_SUGAR: {
      NORMAL: { fasting: [70, 100], random: [70, 140] },
      PREDIABETES: { fasting: [100, 125], random: [140, 199] },
      DIABETES: { fasting: 126, random: 200 },
    },
    BMI: {
      UNDERWEIGHT: 18.5,
      NORMAL: [18.5, 24.9],
      OVERWEIGHT: [25, 29.9],
      OBESE: 30,
    },
  },
};
