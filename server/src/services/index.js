// server/src/services/index.js
module.exports = {
  smsService: require("./sms.service"),
  ocrService: require("./ocr.service"),
  aiService: require("./ai.service"),
  cronService: require("./cron.service"),
};
