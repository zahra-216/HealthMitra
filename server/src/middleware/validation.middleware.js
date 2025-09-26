// server/src/middleware/validation.middleware.js
const Joi = require("joi");

/**
 * Validates request body using provided Joi schema
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        message: "Validation error",
        details: errorMessage,
      });
    }

    next();
  };
};

// Validation schemas
const userRegistrationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+94\d{9}$/)
    .required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("patient", "doctor", "volunteer").default("patient"),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const healthRecordSchema = Joi.object({
  type: Joi.string()
    .valid("prescription", "lab_report", "scan", "visit_note", "vital_signs")
    .required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().max(1000),
  recordDate: Joi.date(),
  tags: Joi.array().items(Joi.string()),
  metadata: Joi.object(),
});

const reminderSchema = Joi.object({
  type: Joi.string()
    .valid("medication", "appointment", "checkup", "test")
    .required(),
  title: Joi.string().max(200).required(),
  description: Joi.string(),
  scheduledTime: Joi.date().required(),
  frequency: Joi.string()
    .valid("once", "daily", "weekly", "monthly")
    .default("once"),
  endDate: Joi.date(),
  methods: Joi.array().items(Joi.string().valid("sms", "email", "push")),
});

module.exports = {
  validateRequest,
  userRegistrationSchema,
  userLoginSchema,
  healthRecordSchema,
  reminderSchema,
};
