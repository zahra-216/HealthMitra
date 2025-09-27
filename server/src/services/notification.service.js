// server/src/services/notification.service.js
const { Reminder, User } = require("../models");

const getReminders = async (userId, filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const query = { userId, ...filters };

  const reminders = await Reminder.find(query)
    .sort({ scheduledTime: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Reminder.countDocuments(query);

  return { reminders, total };
};

const createReminder = async (userId, reminderData) => {
  const reminder = new Reminder({ ...reminderData, userId });
  await reminder.save();
  return reminder;
};

const updateReminder = async (userId, reminderId, updates) => {
  const reminder = await Reminder.findOneAndUpdate(
    { _id: reminderId, userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  return reminder;
};

const deleteReminder = async (userId, reminderId) => {
  const reminder = await Reminder.findOneAndDelete({ _id: reminderId, userId });
  return reminder;
};

const updatePreferences = async (userId, preferences) => {
  const updateData = {};
  if (preferences.notifications) {
    updateData["preferences.notifications"] = preferences.notifications;
  }
  if (preferences.reminderTimes) {
    updateData["preferences.reminderTimes"] = preferences.reminderTimes;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password");

  return user.preferences;
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  updatePreferences,
};
