// shared/constants/healthThresholds.js
module.exports = {
  BLOOD_PRESSURE: {
    NORMAL: { systolic: [90, 120], diastolic: [60, 80] },
    ELEVATED: { systolic: [120, 129], diastolic: [60, 80] },
    HIGH_STAGE_1: { systolic: [130, 139], diastolic: [80, 89] },
    HIGH_STAGE_2: { systolic: [140, 180], diastolic: [90, 120] },
    HYPERTENSIVE_CRISIS: { systolic: 180, diastolic: 120 },
  },

  BLOOD_SUGAR: {
    NORMAL: {
      fasting: [70, 100],
      random: [70, 140],
      postMeal: [70, 140],
    },
    PREDIABETES: {
      fasting: [100, 125],
      random: [140, 199],
      postMeal: [140, 199],
    },
    DIABETES: {
      fasting: 126,
      random: 200,
      postMeal: 200,
    },
  },

  BMI: {
    UNDERWEIGHT: 18.5,
    NORMAL_RANGE: [18.5, 24.9],
    OVERWEIGHT: [25, 29.9],
    OBESE_CLASS_1: [30, 34.9],
    OBESE_CLASS_2: [35, 39.9],
    OBESE_CLASS_3: 40,
  },

  HEART_RATE: {
    RESTING: {
      ATHLETE: [40, 60],
      EXCELLENT: [61, 69],
      GOOD: [70, 79],
      FAIR: [80, 89],
      POOR: [90, 100],
      CONCERNING: 100,
    },
  },

  TEMPERATURE: {
    NORMAL_CELSIUS: [36.1, 37.2],
    LOW_GRADE_FEVER: [37.3, 38.0],
    FEVER: [38.1, 39.0],
    HIGH_FEVER: [39.1, 41.0],
    DANGEROUS: 41.0,
  },
};
