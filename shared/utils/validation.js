// shared/utils/validation.js
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateSriLankanPhone = (phone) => {
  const phoneRegex = /^\+94\d{9}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    hasMinLength: password.length >= 6,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
};

const validateBloodPressure = (systolic, diastolic) => {
  return {
    isValid:
      systolic >= 50 && systolic <= 300 && diastolic >= 30 && diastolic <= 200,
    systolicValid: systolic >= 50 && systolic <= 300,
    diastolicValid: diastolic >= 30 && diastolic <= 200,
    ratio: systolic > diastolic,
  };
};

const validateBloodSugar = (value, type = "random") => {
  const ranges = {
    fasting: { min: 20, max: 400 },
    random: { min: 20, max: 500 },
    postMeal: { min: 20, max: 500 },
  };

  const range = ranges[type] || ranges.random;
  return value >= range.min && value <= range.max;
};

const validateVitalSigns = (vitals) => {
  const errors = {};

  if (vitals.bloodPressure) {
    const bpValidation = validateBloodPressure(
      vitals.bloodPressure.systolic,
      vitals.bloodPressure.diastolic
    );
    if (!bpValidation.isValid) {
      errors.bloodPressure = "Invalid blood pressure values";
    }
  }

  if (vitals.heartRate && (vitals.heartRate < 30 || vitals.heartRate > 220)) {
    errors.heartRate = "Heart rate must be between 30-220 BPM";
  }

  if (
    vitals.temperature &&
    (vitals.temperature < 30 || vitals.temperature > 50)
  ) {
    errors.temperature = "Temperature must be between 30-50°C";
  }

  if (vitals.weight && (vitals.weight < 1 || vitals.weight > 500)) {
    errors.weight = "Weight must be between 1-500 kg";
  }

  if (vitals.height && (vitals.height < 30 || vitals.height > 300)) {
    errors.height = "Height must be between 30-300 cm";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const sanitizeString = (str) => {
  if (typeof str !== "string") return str;

  return str
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .slice(0, 1000); // Limit length
};

const validateFileUpload = (file) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  return {
    isValid: allowedTypes.includes(file.type) && file.size <= maxSize,
    validType: allowedTypes.includes(file.type),
    validSize: file.size <= maxSize,
    actualSize: file.size,
    actualType: file.type,
  };
};

module.exports = {
  validateEmail,
  validateSriLankanPhone,
  validatePassword,
  validateBloodPressure,
  validateBloodSugar,
  validateVitalSigns,
  sanitizeString,
  validateFileUpload,
};
