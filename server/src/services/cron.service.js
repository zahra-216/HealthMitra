const cron = require("node-cron");
const { Reminder, User } = require("../models");
const smsService = require("./sms.service");

// This function will be called from server.js after the DB connection is successful
const startCronJobs = () => {
  console.log("Starting cron jobs..."); // Check for reminders every minute

  cron.schedule("* * * * *", async () => {
    await processReminders();
  }); // Daily health insights generation at 8 AM

  cron.schedule("0 8 * * *", async () => {
    await generateDailyInsights();
  }); // Weekly health summary at 9 AM every Sunday

  cron.schedule("0 9 * * 0", async () => {
    await sendWeeklyHealthSummary();
  });
};

const processReminders = async () => {
  try {
    // Check if the Reminder model is defined before using it
    if (!Reminder) {
      console.error("Error: Reminder model is not defined.");
      return;
    }

    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

    const dueReminders = await Reminder.find({
      scheduledTime: { $lte: fiveMinutesFromNow },
      isActive: true,
      isSent: false,
    }).populate("userId", "phone firstName preferences");

    for (const reminder of dueReminders) {
      if (!reminder.userId || !reminder.userId.preferences.notifications.sms) {
        continue;
      }

      try {
        let message;

        switch (reminder.type) {
          case "medication":
            message = `🏥 HealthMitra: Time to take your ${
              reminder.metadata.medicationName || "medication"
            }${
              reminder.metadata.dosage ? ` (${reminder.metadata.dosage})` : ""
            }. Stay healthy! Reply STOP to opt out.`;
            break;
          case "appointment":
            message = `🏥 HealthMitra: Appointment reminder${
              reminder.metadata.doctorName
                ? ` with Dr. ${reminder.metadata.doctorName}`
                : ""
            } at ${reminder.scheduledTime.toLocaleTimeString()}${
              reminder.metadata.appointmentLocation
                ? `, ${reminder.metadata.appointmentLocation}`
                : ""
            }. Reply STOP to opt out.`;
            break;
          case "checkup":
            message = `🏥 HealthMitra: Regular health checkup reminder. It's time to monitor your vitals and update your health records. Reply STOP to opt out.`;
            break;
          default:
            message = `🏥 HealthMitra: ${reminder.title}. ${
              reminder.description || ""
            }`;
        }

        await smsService.sendSMS(reminder.userId.phone, message); // Mark as sent

        reminder.isSent = true;
        reminder.sentAt = new Date();
        await reminder.save(); // Create next reminder if recurring

        if (reminder.frequency !== "once") {
          const nextDate = calculateNextReminderDate(
            reminder.scheduledTime,
            reminder.frequency
          );
          if (!reminder.endDate || nextDate <= reminder.endDate) {
            await Reminder.create({
              userId: reminder.userId._id,
              type: reminder.type,
              title: reminder.title,
              description: reminder.description,
              scheduledTime: nextDate,
              frequency: reminder.frequency,
              endDate: reminder.endDate,
              methods: reminder.methods,
              metadata: reminder.metadata,
            });
          }
        }
      } catch (error) {
        console.error(`Failed to send reminder ${reminder._id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error processing reminders:", error);
  }
};

const calculateNextReminderDate = (currentDate, frequency) => {
  const next = new Date(currentDate);

  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
  }

  return next;
};

const generateDailyInsights = async () => {
  // This would generate daily health insights for all active users
  console.log("Generating daily health insights..."); // Implementation would depend on specific requirements
};

const sendWeeklyHealthSummary = async () => {
  // Send weekly health summaries to users
  console.log("Sending weekly health summaries..."); // Implementation would depend on specific requirements
};

module.exports = {
  startCronJobs,
  processReminders,
  generateDailyInsights,
  sendWeeklyHealthSummary,
};
