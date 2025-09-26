// server/src/services/sms.service.js
const { client, phoneNumber } = require("../config/twilio");

const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: phoneNumber,
      to: to,
    });

    console.log(`SMS sent successfully: ${result.sid}`);
    return result;
  } catch (error) {
    console.error("SMS sending failed:", error);
    throw error;
  }
};

const sendBulkSMS = async (recipients, message) => {
  const results = [];

  for (const recipient of recipients) {
    try {
      const result = await sendSMS(recipient, message);
      results.push({ phone: recipient, success: true, sid: result.sid });
    } catch (error) {
      results.push({ phone: recipient, success: false, error: error.message });
    }
  }

  return results;
};

const sendMedicationReminder = async (phone, medicationName, dosage, time) => {
  const message = `🏥 HealthMitra Reminder: Time to take your ${medicationName} (${dosage}) at ${time}. Take care of your health! Reply STOP to opt out.`;
  return await sendSMS(phone, message);
};

const sendAppointmentReminder = async (
  phone,
  doctorName,
  appointmentTime,
  location
) => {
  const message = `🏥 HealthMitra: Appointment reminder with Dr. ${doctorName} at ${appointmentTime}, ${location}. Please arrive 15 minutes early. Reply STOP to opt out.`;
  return await sendSMS(phone, message);
};

const sendHealthAlert = async (phone, alertMessage, severity = "medium") => {
  const urgencyPrefix =
    severity === "high" || severity === "critical" ? "🚨 URGENT" : "⚠️";
  const message = `${urgencyPrefix} HealthMitra Health Alert: ${alertMessage}. Please consult your healthcare provider. This is an automated message.`;
  return await sendSMS(phone, message);
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendMedicationReminder,
  sendAppointmentReminder,
  sendHealthAlert,
};
