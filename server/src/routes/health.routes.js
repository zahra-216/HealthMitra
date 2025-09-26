// server/src/routes/health.routes.js
const express = require("express");
const { upload } = require("../middleware/upload.middleware");
const {
  validateRequest,
  healthRecordSchema,
} = require("../middleware/validation.middleware");
const healthController = require("../controllers/health.controller");

const router = express.Router();

// Health records
router.post(
  "/records",
  upload.array("files", 5),
  healthController.createHealthRecord
);
router.get("/records", healthController.getHealthRecords);
router.get("/records/:id", healthController.getHealthRecord);
router.put("/records/:id", healthController.updateHealthRecord);
router.delete("/records/:id", healthController.deleteHealthRecord);

// Health summary
router.get("/summary", healthController.getHealthSummary);

module.exports = router;
