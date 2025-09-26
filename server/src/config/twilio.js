// server/src/config/twilio.js
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = {
  client,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER,
};
