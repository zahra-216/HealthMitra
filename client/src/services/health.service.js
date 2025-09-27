// client/src/services/health.service.js
const apiService = require("./api");

class HealthService {
  async createHealthRecord(data) {
    const formData = new FormData();

    // Append text fields
    formData.append("type", data.type);
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.recordDate) formData.append("recordDate", data.recordDate);
    if (data.tags) formData.append("tags", data.tags);
    if (data.metadata) formData.append("metadata", data.metadata);

    // Append files
    if (data.files) {
      Array.from(data.files).forEach((file) => {
        formData.append("files", file);
      });
    }

    return apiService.uploadFiles("/health/records", formData);
  }

  async getHealthRecords(params) {
    return apiService.get("/health/records", params);
  }

  async getHealthRecord(id) {
    return apiService.get(`/health/records/${id}`);
  }

  async updateHealthRecord(id, data) {
    return apiService.put(`/health/records/${id}`, data);
  }

  async deleteHealthRecord(id) {
    return apiService.delete(`/health/records/${id}`);
  }

  async getHealthSummary() {
    return apiService.get("/health/summary");
  }
}

module.exports = {
  healthService: new HealthService(),
};
