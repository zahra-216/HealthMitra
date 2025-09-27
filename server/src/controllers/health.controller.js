// server/src/controllers/health.controller.js
const { HealthRecord, AIInsight } = require("../models");
const { uploadToCloudinary } = require("../middleware/upload.middleware");
const { ocrService, aiService } = require("../services");

/**
 * Create a new health record
 */
const createHealthRecord = async (req, res) => {
  try {
    const { type, title, description, recordDate, tags, metadata } = req.body;
    const files = req.files || [];
    const uploadedFiles = [];

    // Upload files to Cloudinary + run OCR if image
    for (const file of files) {
      try {
        const uploadResult = await uploadToCloudinary(file.buffer, {
          public_id: `health_records/${req.user._id}/${Date.now()}_${
            file.originalname
          }`,
        });

        let ocrText = null;
        if (file.mimetype?.startsWith("image/")) {
          try {
            ocrText = await ocrService.extractText(file.buffer);
          } catch (ocrError) {
            console.error("OCR extraction failed:", ocrError.message);
          }
        }

        uploadedFiles.push({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          ocrText,
        });
      } catch (uploadError) {
        console.error("File upload failed:", uploadError.message);
      }
    }

    // Create health record
    const healthRecord = new HealthRecord({
      userId: req.user._id,
      type,
      title,
      description,
      files: uploadedFiles,
      metadata: metadata ? JSON.parse(metadata) : {},
      recordDate: recordDate || new Date(),
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    });

    await healthRecord.save();

    // Generate AI insights (non-blocking)
    try {
      aiService.generateHealthInsights(req.user._id, healthRecord);
    } catch (aiError) {
      console.error("AI insight generation failed:", aiError.message);
    }

    await healthRecord.populate("doctorId", "firstName lastName");

    res.status(201).json({
      success: true,
      message: "Health record created successfully",
      record: healthRecord,
    });
  } catch (error) {
    console.error("Error in createHealthRecord:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error creating health record",
    });
  }
};

/**
 * Get all health records with filters & pagination
 */
const getHealthRecords = async (req, res) => {
  try {
    const { type, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [records, total] = await Promise.all([
      HealthRecord.find(query)
        .populate("doctorId", "firstName lastName")
        .sort({ recordDate: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      HealthRecord.countDocuments(query),
    ]);

    res.json({
      success: true,
      records,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Error in getHealthRecords:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching health records",
    });
  }
};

/**
 * Get a single health record by ID
 */
const getHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("doctorId", "firstName lastName");

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Health record not found" });
    }

    res.json({ success: true, record });
  } catch (error) {
    console.error("Error in getHealthRecord:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching health record",
    });
  }
};

/**
 * Update a health record
 */
const updateHealthRecord = async (req, res) => {
  try {
    const updates = req.body;
    const record = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("doctorId", "firstName lastName");

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Health record not found" });
    }

    res.json({
      success: true,
      message: "Health record updated successfully",
      record,
    });
  } catch (error) {
    console.error("Error in updateHealthRecord:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error updating health record",
    });
  }
};

/**
 * Delete a health record
 */
const deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Health record not found" });
    }

    // TODO: Delete files from Cloudinary (if needed)

    res.json({ success: true, message: "Health record deleted successfully" });
  } catch (error) {
    console.error("Error in deleteHealthRecord:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting health record",
    });
  }
};

/**
 * Get health summary with counts, recent vitals, and AI insights
 */
const getHealthSummary = async (req, res) => {
  try {
    const summary = await HealthRecord.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          latest: { $max: "$recordDate" },
        },
      },
    ]);

    const recentVitals = await HealthRecord.findOne({
      userId: req.user._id,
      type: "vital_signs",
    }).sort({ recordDate: -1 });

    const insights = await AIInsight.find({
      userId: req.user._id,
      isActive: true,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      summary,
      recentVitals: recentVitals?.metadata?.vitals || null,
      insights,
    });
  } catch (error) {
    console.error("Error in getHealthSummary:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching health summary",
    });
  }
};

module.exports = {
  createHealthRecord,
  getHealthRecords,
  getHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  getHealthSummary,
};
