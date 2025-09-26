// shared/utils/formatters.js
const formatDate = (date, locale = "en-US", options = {}) => {
  if (!date) return "";

  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString(locale, defaultOptions);
};

const formatDateTime = (date, locale = "en-US") => {
  if (!date) return "";

  return new Date(date).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTime = (date, locale = "en-US") => {
  if (!date) return "";

  return new Date(date).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPhoneNumber = (phone) => {
  if (!phone) return "";

  // Format +94XXXXXXXXX to +94 XX XXX XXXX
  if (phone.startsWith("+94") && phone.length === 12) {
    return `${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(
      5,
      8
    )} ${phone.slice(8)}`;
  }

  return phone;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatBloodPressure = (systolic, diastolic) => {
  if (!systolic || !diastolic) return "";
  return `${systolic}/${diastolic} mmHg`;
};

const formatBloodSugar = (value, unit = "mg/dL") => {
  if (!value) return "";
  return `${value} ${unit}`;
};

const formatBMI = (weight, height) => {
  if (!weight || !height) return "";

  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  return bmi.toFixed(1);
};

const formatCurrency = (amount, currency = "LKR") => {
  if (!amount) return "";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
};

const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return "";
  return `${(value * 100).toFixed(decimals)}%`;
};

const truncateText = (text, maxLength = 100, suffix = "...") => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + suffix;
};

const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return "";
  if (!lastName) return firstName;
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

module.exports = {
  formatDate,
  formatDateTime,
  formatTime,
  formatPhoneNumber,
  formatFileSize,
  formatBloodPressure,
  formatBloodSugar,
  formatBMI,
  formatCurrency,
  formatPercentage,
  truncateText,
  capitalizeFirst,
  formatName,
};
