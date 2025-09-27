// client/src/services/notification.service.js

const apiService = require("./api");

class NotificationService {
  async getReminders(params) {
    return apiService.get("/notifications/reminders", params);
  }

  async createReminder(data) {
    return apiService.post("/notifications/reminders", data);
  }

  async updateReminder(id, data) {
    return apiService.put(`/notifications/reminders/${id}`, data);
  }

  async deleteReminder(id) {
    return apiService.delete(`/notifications/reminders/${id}`);
  }

  async updateNotificationPreferences(preferences) {
    return apiService.put("/notifications/preferences", preferences);
  }

  async sendTestSMS(message) {
    return apiService.post("/notifications/test-sms", { message });
  }
}

module.exports = {
  notificationService: new NotificationService(),
};
