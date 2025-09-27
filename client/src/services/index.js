// client/src/services/index.js

const apiService = require("./api");
const { authService } = require("./auth.service");
const { healthService } = require("./health.service");
const { aiService } = require("./ai.service");
const { notificationService } = require("./notification.service");

module.exports = {
  apiService,
  authService,
  healthService,
  aiService,
  notificationService,
};
