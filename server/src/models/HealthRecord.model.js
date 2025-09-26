// server/src/models/HealthRecord.model.js
const mongoose = require("mongoose");

// Sub-schema for files (uploaded to Cloudinary)
const FileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    originalName: String,
    mimeType: String,
    size: Number,
    ocrText: String, // Stored OCR text from health.controller.js
  },
  { _id: false }
);

// Sub-schema for sharing data (used in user.controller.js)
const SharedWithSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedAt: { type: Date, default: Date.now },
    accessLevel: { type: String, enum: ["read", "edit"], default: "read" },
  },
  { _id: false }
);

const HealthRecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Used for population in health.controller.js
    },
    type: {
      type: String,
      enum: [
        "VITAL",
        "LAB_RESULT",
        "MEDICATION",
        "APPOINTMENT",
        "DIAGNOSIS",
        "OTHER",
        "vital_signs",
      ], // Added 'vital_signs' from health.controller.js
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    recordDate: {
      type: Date,
      required: true,
    },
    tags: [String],
    metadata: mongoose.Schema.Types.Mixed, // Stores specific data like Vitals
    files: [FileSchema], // Array of uploaded files
    isPrivate: {
      type: Boolean,
      default: true, // Used in user.controller.js logic
    },
    sharedWith: [SharedWithSchema], // Used in user.controller.js logic
  },
  {
    timestamps: true,
  }
);

const HealthRecord = mongoose.model("HealthRecord", HealthRecordSchema);

module.exports = HealthRecord;
