// server/src/routes/health.routes.js
const express = require("express");
const { upload } = require("../middleware/upload.middleware");
const { authMiddleware } = require("../middleware/auth.middleware");
const healthController = require("../controllers/health.controller");

const router = express.Router();

// Health records
router.post(
  "/records",
  authMiddleware,
  upload.array("files", 5),
  healthController.createHealthRecord
);

router.get("/records", authMiddleware, healthController.getHealthRecords);
router.get("/records/:id", authMiddleware, healthController.getHealthRecord);
router.put("/records/:id", authMiddleware, healthController.updateHealthRecord);
router.delete(
  "/records/:id",
  authMiddleware,
  healthController.deleteHealthRecord
);

// Health summary
router.get("/summary", authMiddleware, healthController.getHealthSummary);

module.exports = router;
