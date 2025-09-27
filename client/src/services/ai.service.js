// client/src/services/ai.service.js
// Fully CommonJS-aligned AI service

const apiService = require("./api");

class AIService {
  async getInsights(params) {
    return apiService.get("/ai/insights", params);
  }

  async markInsightAsRead(id) {
    return apiService.patch(`/ai/insights/${id}/read`);
  }

  async assessHealthRisk(vitals) {
    return apiService.post("/ai/assess-risk", { vitals });
  }

  async generateInsights() {
    return apiService.post("/ai/generate-insights");
  }
}

module.exports = {
  aiService: new AIService(),
};
