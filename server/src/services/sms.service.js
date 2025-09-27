// server/src/services/sms.service.js
// Dummy SMS service for development (no Twilio needed)

const sendSMS = async (to, message) => {
  try {
    console.log(`[SMS Service] Sending SMS to ${to}: "${message}"`);
    // Simulate async delay
    return { sid: `dummy-${Date.now()}`, to, message };
  } catch (error) {
    console.error("[SMS Service] Failed to send SMS:", error.message);
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
  const message = `🏥 HealthMitra Reminder: Take your ${medicationName} (${dosage}) at ${time}.`;
  return await sendSMS(phone, message);
};

const sendAppointmentReminder = async (
  phone,
  doctorName,
  appointmentTime,
  location
) => {
  const message = `🏥 HealthMitra: Appointment with Dr. ${doctorName} at ${appointmentTime}, ${location}.`;
  return await sendSMS(phone, message);
};

const sendHealthAlert = async (phone, alertMessage, severity = "medium") => {
  const urgencyPrefix =
    severity === "high" || severity === "critical" ? "🚨 URGENT" : "⚠️";
  const message = `${urgencyPrefix} HealthMitra Alert: ${alertMessage}`;
  return await sendSMS(phone, message);
};

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendMedicationReminder,
  sendAppointmentReminder,
  sendHealthAlert,
};
