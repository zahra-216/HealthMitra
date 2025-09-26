// server/src/controllers/health.controller.js
const { HealthRecord, AIInsight } = require("../models");
const { uploadToCloudinary } = require("../middleware/upload.middleware");
const { ocrService, aiService } = require("../services");

const createHealthRecord = async (req, res) => {
  try {
    const { type, title, description, recordDate, tags, metadata } = req.body;
    const files = req.files || [];

    // Upload files to Cloudinary and extract OCR text
    const uploadedFiles = [];

    for (const file of files) {
      try {
        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(file.buffer, {
          public_id: `health_records/${req.user._id}/${Date.now()}_${
            file.originalname
          }`,
        });

        let ocrText = null;

        // Extract text using OCR for images
        if (file.mimetype.startsWith("image/")) {
          try {
            ocrText = await ocrService.extractText(file.buffer);
          } catch (ocrError) {
            console.error("OCR extraction failed:", ocrError);
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
        console.error("File upload failed:", uploadError);
      }
    }

    // Create health record
    const healthRecord = new HealthRecord({
      userId: req.user._id,
      type,
      title,
      description,
      files: uploadedFiles,
      metadata: JSON.parse(metadata || "{}"),
      recordDate: recordDate || new Date(),
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    });

    await healthRecord.save();

    // Generate AI insights for the new record
    try {
      await aiService.generateHealthInsights(req.user._id, healthRecord);
    } catch (aiError) {
      console.error("AI insight generation failed:", aiError);
    }

    await healthRecord.populate("doctorId", "firstName lastName");

    res.status(201).json({
      message: "Health record created successfully",
      record: healthRecord,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error creating health record",
      error: error.message,
    });
  }
};

const getHealthRecords = async (req, res) => {
  try {
    const { type, page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { userId: req.user._id };

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const records = await HealthRecord.find(query)
      .populate("doctorId", "firstName lastName")
      .sort({ recordDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await HealthRecord.countDocuments(query);

    res.json({
      records,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching health records",
      error: error.message,
    });
  }
};

const getHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("doctorId", "firstName lastName");

    if (!record) {
      return res.status(404).json({ message: "Health record not found" });
    }

    res.json({ record });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching health record",
      error: error.message,
    });
  }
};

const updateHealthRecord = async (req, res) => {
  try {
    const updates = req.body;

    const record = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("doctorId", "firstName lastName");

    if (!record) {
      return res.status(404).json({ message: "Health record not found" });
    }

    res.json({
      message: "Health record updated successfully",
      record,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error updating health record",
      error: error.message,
    });
  }
};

const deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: "Health record not found" });
    }

    // TODO: Delete files from Cloudinary
    // This would require implementing cloudinary deletion

    res.json({ message: "Health record deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error deleting health record",
      error: error.message,
    });
  }
};

const getHealthSummary = async (req, res) => {
  try {
    const pipeline = [
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          latest: { $max: "$recordDate" },
        },
      },
    ];

    const summary = await HealthRecord.aggregate(pipeline);

    // Get recent vital signs
    const recentVitals = await HealthRecord.findOne({
      userId: req.user._id,
      type: "vital_signs",
    }).sort({ recordDate: -1 });

    // Get active AI insights
    const insights = await AIInsight.find({
      userId: req.user._id,
      isActive: true,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      summary,
      recentVitals: recentVitals?.metadata?.vitals || null,
      insights,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching health summary",
      error: error.message,
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
