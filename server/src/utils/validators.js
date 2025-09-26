// server/src/utils/validators.js
const Joi = require("joi");

// Common validation schemas
const emailSchema = Joi.string().email().required();
const phoneSchema = Joi.string()
  .pattern(/^\+94\d{9}$/)
  .required();
const passwordSchema = Joi.string().min(6).required();
const nameSchema = Joi.string().min(2).max(50).required();

// User validation schemas
const userRegistrationSchema = Joi.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  role: Joi.string().valid("patient", "doctor", "volunteer").default("patient"),
});

const userLoginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required(),
});

const userProfileUpdateSchema = Joi.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  profile: Joi.object({
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
    bloodGroup: Joi.string()
      .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
      .optional(),
    emergencyContact: Joi.object({
      name: Joi.string().optional(),
      phone: Joi.string().optional(),
      relationship: Joi.string().optional(),
    }).optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      district: Joi.string().optional(),
      postalCode: Joi.string().optional(),
    }).optional(),
    allergies: Joi.array().items(Joi.string()).optional(),
    currentMedications: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  preferences: Joi.object({
    language: Joi.string().valid("en", "si", "ta").optional(),
    notifications: Joi.object({
      sms: Joi.boolean().optional(),
      email: Joi.boolean().optional(),
      push: Joi.boolean().optional(),
    }).optional(),
    reminderTimes: Joi.object({
      medication: Joi.array().items(Joi.string()).optional(),
      checkup: Joi.string().optional(),
    }).optional(),
  }).optional(),
});

// Health record validation schemas
const healthRecordSchema = Joi.object({
  type: Joi.string()
    .valid("prescription", "lab_report", "scan", "visit_note", "vital_signs")
    .required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().max(1000).optional(),
  recordDate: Joi.date().optional(),
  tags: Joi.string().optional(), // Will be split into array
  metadata: Joi.string().optional(), // JSON string
  doctorId: Joi.string().optional(),
  hospital: Joi.string().optional(),
});

// Reminder validation schemas
const reminderSchema = Joi.object({
  type: Joi.string()
    .valid("medication", "appointment", "checkup", "test")
    .required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().optional(),
  scheduledTime: Joi.date().required(),
  frequency: Joi.string()
    .valid("once", "daily", "weekly", "monthly")
    .default("once"),
  endDate: Joi.date().optional(),
  methods: Joi.array()
    .items(Joi.string().valid("sms", "email", "push"))
    .optional(),
  metadata: Joi.object({
    medicationName: Joi.string().optional(),
    dosage: Joi.string().optional(),
    doctorName: Joi.string().optional(),
    appointmentLocation: Joi.string().optional(),
  }).optional(),
});

// Vital signs validation schema
const vitalSignsSchema = Joi.object({
  bloodPressure: Joi.object({
    systolic: Joi.number().min(50).max(300).required(),
    diastolic: Joi.number().min(30).max(200).required(),
  }).optional(),
  heartRate: Joi.number().min(30).max(220).optional(),
  temperature: Joi.number().min(30).max(50).optional(),
  weight: Joi.number().min(1).max(500).optional(),
  height: Joi.number().min(30).max(300).optional(),
  bloodSugar: Joi.object({
    fasting: Joi.number().min(20).max(500).optional(),
    postMeal: Joi.number().min(20).max(500).optional(),
    random: Joi.number().min(20).max(500).optional(),
  }).optional(),
  cholesterol: Joi.object({
    total: Joi.number().min(50).max(500).optional(),
    ldl: Joi.number().min(20).max(300).optional(),
    hdl: Joi.number().min(10).max(150).optional(),
    triglycerides: Joi.number().min(20).max(1000).optional(),
  }).optional(),
});

module.exports = {
  userRegistrationSchema,
  userLoginSchema,
  userProfileUpdateSchema,
  healthRecordSchema,
  reminderSchema,
  vitalSignsSchema,
};
