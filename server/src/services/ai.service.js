// server/src/services/ai.service.js
const { Matrix } = require("ml-matrix");
const { SimpleLinearRegression } = require("ml-regression");
const { HealthRecord, AIInsight } = require("../models");

// Health risk thresholds based on medical guidelines
const HEALTH_THRESHOLDS = {
  bloodPressure: {
    normal: { systolic: [90, 120], diastolic: [60, 80] },
    elevated: { systolic: [120, 129], diastolic: [60, 80] },
    high1: { systolic: [130, 139], diastolic: [80, 89] },
    high2: { systolic: [140, 180], diastolic: [90, 120] },
    crisis: { systolic: 180, diastolic: 120 },
  },
  bloodSugar: {
    normal: { fasting: [70, 100], random: [70, 140] },
    prediabetes: { fasting: [100, 125], random: [140, 199] },
    diabetes: { fasting: 126, random: 200 },
  },
  bmi: {
    underweight: 18.5,
    normal: [18.5, 24.9],
    overweight: [25, 29.9],
    obese: 30,
  },
};

const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const assessBloodPressureRisk = (systolic, diastolic) => {
  const { bloodPressure: bp } = HEALTH_THRESHOLDS;

  if (systolic >= bp.crisis.systolic || diastolic >= bp.crisis.diastolic) {
    return {
      risk: "critical",
      category: "Hypertensive Crisis",
      message:
        "Your blood pressure is critically high. Seek immediate medical attention.",
      recommendations: [
        "Call emergency services or go to ER immediately",
        "Do not delay medical care",
      ],
    };
  }

  if (systolic >= bp.high2.systolic[0] || diastolic >= bp.high2.diastolic[0]) {
    return {
      risk: "high",
      category: "Stage 2 Hypertension",
      message: "Your blood pressure indicates Stage 2 Hypertension.",
      recommendations: [
        "Consult your doctor for medication adjustment",
        "Monitor blood pressure daily",
        "Reduce sodium intake",
        "Exercise regularly as advised by doctor",
      ],
    };
  }

  if (systolic >= bp.high1.systolic[0] || diastolic >= bp.high1.diastolic[0]) {
    return {
      risk: "medium",
      category: "Stage 1 Hypertension",
      message: "Your blood pressure is elevated and needs attention.",
      recommendations: [
        "Schedule appointment with healthcare provider",
        "Monitor blood pressure regularly",
        "Maintain healthy diet and exercise",
        "Limit alcohol and reduce stress",
      ],
    };
  }

  if (systolic >= bp.elevated.systolic[0]) {
    return {
      risk: "low",
      category: "Elevated Blood Pressure",
      message:
        "Your blood pressure is elevated but manageable with lifestyle changes.",
      recommendations: [
        "Maintain healthy lifestyle",
        "Regular exercise",
        "Balanced diet with less sodium",
        "Monitor blood pressure monthly",
      ],
    };
  }

  return {
    risk: "low",
    category: "Normal Blood Pressure",
    message: "Your blood pressure is within normal range.",
    recommendations: ["Continue healthy lifestyle habits"],
  };
};

const assessBloodSugarRisk = (value, type = "random") => {
  const { bloodSugar: bs } = HEALTH_THRESHOLDS;

  if (type === "fasting") {
    if (value >= bs.diabetes.fasting) {
      return {
        risk: "high",
        category: "Possible Diabetes",
        message: "Your fasting blood sugar indicates possible diabetes.",
        recommendations: [
          "Consult endocrinologist immediately",
          "Follow prescribed diabetic diet",
          "Regular blood sugar monitoring",
          "Take prescribed medications",
        ],
      };
    }

    if (value >= bs.prediabetes.fasting[0]) {
      return {
        risk: "medium",
        category: "Prediabetes Risk",
        message: "Your fasting blood sugar indicates prediabetes risk.",
        recommendations: [
          "Consult healthcare provider",
          "Reduce carbohydrate intake",
          "Increase physical activity",
          "Regular monitoring",
        ],
      };
    }
  } else {
    if (value >= bs.diabetes.random) {
      return {
        risk: "high",
        category: "Possible Diabetes",
        message: "Your blood sugar level indicates possible diabetes.",
        recommendations: [
          "Consult healthcare provider immediately",
          "Avoid high-sugar foods",
          "Regular monitoring required",
        ],
      };
    }

    if (value >= bs.prediabetes.random[0]) {
      return {
        risk: "medium",
        category: "Elevated Blood Sugar",
        message: "Your blood sugar is elevated.",
        recommendations: [
          "Limit sugar and refined carbs",
          "Exercise after meals",
          "Regular check-ups",
        ],
      };
    }
  }

  return {
    risk: "low",
    category: "Normal Blood Sugar",
    message: "Your blood sugar is within normal range.",
    recommendations: ["Maintain healthy diet and exercise"],
  };
};

const generateHealthInsights = async (userId, newRecord) => {
  try {
    // Get recent health records for trend analysis
    const recentRecords = await HealthRecord.find({
      userId,
      type: "vital_signs",
      recordDate: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }, // Last 90 days
    })
      .sort({ recordDate: -1 })
      .limit(10);

    if (recentRecords.length === 0) return;

    const insights = [];

    // Analyze current vital signs if available
    if (newRecord.type === "vital_signs" && newRecord.metadata.vitals) {
      const vitals = newRecord.metadata.vitals;

      // Blood pressure assessment
      if (vitals.bloodPressure) {
        const bpAssessment = assessBloodPressureRisk(
          vitals.bloodPressure.systolic,
          vitals.bloodPressure.diastolic
        );

        if (bpAssessment.risk !== "low") {
          insights.push({
            userId,
            type: "health_risk",
            severity: bpAssessment.risk,
            title: `Blood Pressure Alert: ${bpAssessment.category}`,
            message: bpAssessment.message,
            recommendations: bpAssessment.recommendations,
            dataUsed: [
              {
                recordId: newRecord._id,
                dataType: "blood_pressure",
                value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
              },
            ],
            confidence: 0.9,
          });
        }
      }

      // Blood sugar assessment
      if (vitals.bloodSugar) {
        ["fasting", "postMeal", "random"].forEach((type) => {
          if (vitals.bloodSugar[type]) {
            const sugarAssessment = assessBloodSugarRisk(
              vitals.bloodSugar[type],
              type
            );

            if (sugarAssessment.risk !== "low") {
              insights.push({
                userId,
                type: "health_risk",
                severity: sugarAssessment.risk,
                title: `Blood Sugar Alert: ${sugarAssessment.category}`,
                message: sugarAssessment.message,
                recommendations: sugarAssessment.recommendations,
                dataUsed: [
                  {
                    recordId: newRecord._id,
                    dataType: "blood_sugar",
                    value: `${vitals.bloodSugar[type]} (${type})`,
                  },
                ],
                confidence: 0.85,
              });
            }
          }
        });
      }

      // BMI assessment
      if (vitals.weight && vitals.height) {
        const bmi = calculateBMI(vitals.weight, vitals.height);
        if (bmi) {
          let bmiCategory, risk, message, recommendations;

          if (bmi < HEALTH_THRESHOLDS.bmi.underweight) {
            risk = "medium";
            bmiCategory = "Underweight";
            message = "Your BMI indicates you are underweight.";
            recommendations = [
              "Consult nutritionist for healthy weight gain plan",
              "Regular health check-ups",
            ];
          } else if (bmi >= HEALTH_THRESHOLDS.bmi.obese) {
            risk = "high";
            bmiCategory = "Obesity";
            message =
              "Your BMI indicates obesity, which increases health risks.";
            recommendations = [
              "Consult healthcare provider for weight management",
              "Structured diet and exercise plan",
              "Regular monitoring",
            ];
          } else if (bmi >= HEALTH_THRESHOLDS.bmi.overweight[0]) {
            risk = "medium";
            bmiCategory = "Overweight";
            message = "Your BMI indicates you are overweight.";
            recommendations = [
              "Balanced diet with calorie control",
              "Regular physical activity",
              "Monitor weight weekly",
            ];
          }

          if (risk) {
            insights.push({
              userId,
              type: "health_risk",
              severity: risk,
              title: `BMI Alert: ${bmiCategory}`,
              message: message,
              recommendations: recommendations,
              dataUsed: [
                {
                  recordId: newRecord._id,
                  dataType: "bmi",
                  value: `${bmi.toFixed(1)}`,
                },
              ],
              confidence: 0.95,
            });
          }
        }
      }
    }

    // Trend analysis for multiple records
    if (recentRecords.length >= 3) {
      const trends = analyzeTrends(recentRecords);

      trends.forEach((trend) => {
        if (trend.significance > 0.7) {
          // Only significant trends
          insights.push({
            userId,
            type: "trend_analysis",
            severity: trend.risk,
            title: `Health Trend: ${trend.parameter}`,
            message: trend.message,
            recommendations: trend.recommendations,
            dataUsed: trend.dataPoints.map((dp) => ({
              recordId: dp.recordId,
              dataType: trend.parameter,
              value: dp.value.toString(),
            })),
            confidence: trend.significance,
          });
        }
      });
    }

    // Save insights to database
    for (const insight of insights) {
      await AIInsight.create(insight);

      // Send SMS alert for high/critical severity
      if (insight.severity === "high" || insight.severity === "critical") {
        const user = await require("../models").User.findById(userId);
        if (user && user.preferences.notifications.sms) {
          const smsService = require("./sms.service");
          await smsService.sendHealthAlert(
            user.phone,
            insight.message,
            insight.severity
          );
        }
      }
    }

    return insights;
  } catch (error) {
    console.error("AI insight generation failed:", error);
    throw error;
  }
};

const analyzeTrends = (records) => {
  const trends = [];
  const parameters = ["bloodPressure", "bloodSugar", "weight", "heartRate"];

  parameters.forEach((param) => {
    const dataPoints = [];

    records.forEach((record) => {
      if (record.metadata.vitals && record.metadata.vitals[param]) {
        let value;
        if (param === "bloodPressure") {
          value = record.metadata.vitals[param].systolic; // Use systolic for trend
        } else if (param === "bloodSugar") {
          value =
            record.metadata.vitals[param].fasting ||
            record.metadata.vitals[param].random ||
            record.metadata.vitals[param].postMeal;
        } else {
          value = record.metadata.vitals[param];
        }

        if (value) {
          dataPoints.push({
            date: record.recordDate,
            value: value,
            recordId: record._id,
          });
        }
      }
    });

    if (dataPoints.length >= 3) {
      const trend = calculateTrend(dataPoints, param);
      if (trend) {
        trends.push(trend);
      }
    }
  });

  return trends;
};

const calculateTrend = (dataPoints, parameter) => {
  // Sort by date
  dataPoints.sort((a, b) => a.date - b.date);

  // Convert dates to days from first measurement
  const firstDate = dataPoints[0].date.getTime();
  const x = dataPoints.map((dp) =>
    Math.floor((dp.date.getTime() - firstDate) / (24 * 60 * 60 * 1000))
  );
  const y = dataPoints.map((dp) => dp.value);

  // Simple linear regression
  const regression = new SimpleLinearRegression(x, y);
  const slope = regression.slope;
  const rSquared = regression.score(x, y);

  // Determine trend significance and risk
  let significance = Math.min(Math.abs(rSquared), 1);
  let risk = "low";
  let message = "";
  let recommendations = [];

  const avgValue = y.reduce((sum, val) => sum + val, 0) / y.length;
  const changePercent = Math.abs((slope * 30) / avgValue) * 100; // Change over 30 days

  if (parameter === "bloodPressure") {
    if (slope > 2 && avgValue > 130) {
      // Increasing trend in high BP
      risk = "high";
      message = `Your blood pressure shows an increasing trend (${changePercent.toFixed(
        1
      )}% increase over 30 days).`;
      recommendations = [
        "Schedule appointment with cardiologist",
        "Monitor blood pressure daily",
        "Review current medications",
        "Implement stress management techniques",
      ];
    } else if (slope > 1) {
      risk = "medium";
      message = `Your blood pressure is gradually increasing.`;
      recommendations = [
        "Monitor blood pressure more frequently",
        "Review diet and exercise habits",
        "Consult healthcare provider",
      ];
    }
  } else if (parameter === "bloodSugar") {
    if (slope > 5 && avgValue > 140) {
      risk = "high";
      message = `Your blood sugar shows a concerning upward trend.`;
      recommendations = [
        "Consult endocrinologist immediately",
        "Review diabetic medications",
        "Strict dietary monitoring",
        "Check for medication compliance",
      ];
    } else if (slope > 2) {
      risk = "medium";
      message = `Your blood sugar levels are gradually increasing.`;
      recommendations = [
        "Monitor blood sugar more frequently",
        "Review carbohydrate intake",
        "Increase physical activity",
      ];
    }
  } else if (parameter === "weight") {
    if (Math.abs(slope) > 0.5) {
      // Weight change > 0.5kg per measurement interval
      risk = slope > 0 ? "medium" : "low";
      message =
        slope > 0
          ? `You're gaining weight at a rate of ${(slope * 7).toFixed(
              1
            )}kg per week.`
          : `You're losing weight at a rate of ${Math.abs(slope * 7).toFixed(
              1
            )}kg per week.`;
      recommendations =
        slope > 0
          ? [
              "Review caloric intake",
              "Increase physical activity",
              "Consider nutritionist consultation",
            ]
          : [
              "Monitor for underlying health issues",
              "Ensure adequate nutrition",
              "Consult healthcare provider if unintentional",
            ];
    }
  }

  if (significance < 0.3) return null; // Not significant enough

  return {
    parameter,
    slope,
    significance,
    risk,
    message,
    recommendations,
    dataPoints,
  };
};

module.exports = {
  generateHealthInsights,
  assessBloodPressureRisk,
  assessBloodSugarRisk,
  calculateBMI,
  analyzeTrends,
};
