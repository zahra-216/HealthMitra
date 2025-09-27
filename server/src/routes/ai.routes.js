// server/src/routes/ai.routes.js
const express = require("express");
const aiController = require("../controllers/ai.controller");

const router = express.Router();

// AI Insights Routes
router.get("/insights", aiController.getInsights);
router.patch("/insights/:id/read", aiController.markInsightAsRead);
router.post("/assess-risk", aiController.assessHealthRisk);
router.post("/generate-insights", aiController.generateInsights);

module.exports = router;
