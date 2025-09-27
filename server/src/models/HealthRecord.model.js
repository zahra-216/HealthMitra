// server/src/models/HealthRecord.model.js
const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: String,
    originalName: String,
    mimeType: String,
    size: Number,
    ocrText: String, // OCR text if extracted
  },
  { _id: false }
);

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
      default: null,
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
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    recordDate: { type: Date, required: true },
    tags: [String],
    metadata: mongoose.Schema.Types.Mixed,
    files: [FileSchema],
    isPrivate: { type: Boolean, default: true },
    sharedWith: [SharedWithSchema],
  },
  { timestamps: true }
);

const HealthRecord = mongoose.model("HealthRecord", HealthRecordSchema);
module.exports = HealthRecord;
