// server/src/utils/helpers.js
const crypto = require("crypto");

/**
 * Generate a random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString("hex");
};

/**
 * Calculate age from date of birth
 */
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Calculate BMI
 */
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

/**
 * Format phone number
 */
const formatPhoneNumber = (phone) => {
  // Ensure Sri Lankan phone number format
  if (!phone) return null;

  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Check if it starts with 94 (country code)
  if (digits.startsWith("94")) {
    return "+" + digits;
  }

  // If it starts with 0, replace with +94
  if (digits.startsWith("0")) {
    return "+94" + digits.substring(1);
  }

  // If it's 9 digits, assume it's without country code
  if (digits.length === 9) {
    return "+94" + digits;
  }

  return phone; // Return as is if format is unclear
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>?/gm, ""); // Remove HTML tags
};

/**
 * Generate pagination metadata
 */
const getPaginationMeta = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    current: currentPage,
    pages: totalPages,
    total: parseInt(total),
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};

/**
 * Format date for display
 */
const formatDate = (date, locale = "en-US") => {
  if (!date) return null;

  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date and time for display
 */
const formatDateTime = (date, locale = "en-US") => {
  if (!date) return null;

  return new Date(date).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

module.exports = {
  generateRandomString,
  calculateAge,
  calculateBMI,
  formatPhoneNumber,
  sanitizeInput,
  getPaginationMeta,
  formatDate,
  formatDateTime,
};
