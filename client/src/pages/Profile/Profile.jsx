// client/src/pages/Profile/Profile.jsx
const React = require("react");
const { useState } = React;
const { User, Shield, Bell } = require("lucide-react");
const { useAppDispatch, useAppSelector } = require("@/hooks/redux");
const { updateProfile } = require("@/store/slices/authSlice");
const { Card, CardContent, CardHeader, CardTitle } = require("@/components/ui/Card");
const Button = require("@/components/ui/Button");
const Tabs = require("@/components/ui/Tabs");
const ProfileForm = require("@/components/forms/ProfileForm");

const Profile = function () {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(state => state.auth);

  const handleProfileUpdate = async function (data) {
    try {
      await dispatch(updateProfile(data)).unwrap();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleTestSMS = async function () {
    try {
      console.log("Sending test SMS...");
    } catch (error) {
      console.error("Failed to send test SMS:", error);
    }
  };

  if (!user) {
    return React.createElement("div", { className: "flex justify-center items-center h-64" },
      React.createElement("div", { className: "text-center" },
        React.createElement(User, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }),
        React.createElement("p", { className: "text-gray-500" }, "User not found")
      )
    );
  }

  // ---------------- Security Items ----------------
  const securityItems = [
    {
      title: "Password",
      desc: "Last changed 30 days ago",
      btn: React.createElement(Button, { variant: "outline", size: "sm" }, "Change Password")
    },
    {
      title: "Two-Factor Authentication",
      desc: "Add extra security to your account",
      btn: React.createElement(Button, { variant: "outline", size: "sm" }, "Enable 2FA")
    },
    {
      title: "Email Verification",
      desc: user.emailVerified ? "Email verified" : "Email not verified",
      btn: !user.emailVerified && React.createElement(Button, { variant: "outline", size: "sm" }, "Verify Email")
    },
    {
      title: "Phone Verification",
      desc: user.phoneVerified ? "Phone verified" : "Phone not verified",
      btn: !user.phoneVerified && React.createElement(Button, { variant: "outline", size: "sm" }, "Verify Phone")
    }
  ];

  // ---------------- Privacy Settings ----------------
  const privacyItems = [
    {
      title: "Profile Visibility",
      desc: "Control who can see your profile information",
      options: ["Private", "Doctors Only", "Public"]
    },
    {
      title: "Health Records Sharing",
      desc: "Default sharing setting for new health records",
      options: ["Private", "Shared"]
    },
    {
      title: "Data Analytics",
      desc: "Allow anonymized data to improve healthcare insights",
      toggle: true
    }
  ];

  // ---------------- Data Management ----------------
  const dataItems = [
    {
      title: "Export Data",
      desc: "Download all your health data",
      btn: React.createElement(Button, { variant: "outline", size: "sm" }, "Export Data")
    },
    {
      title: "Delete Account",
      desc: "Permanently delete your account and all data",
      btn: React.createElement(Button, { variant: "danger", size: "sm" }, "Delete Account"),
      danger: true
    }
  ];

  // ---------------- Notifications ----------------
  const notificationTypes = [
    {
      label: "Medication Reminders",
      desc: "Get notified when it's time for your medications"
    },
    {
      label: "Appointment Reminders",
      desc: "Get reminded about upcoming appointments"
    },
    {
      label: "Health Insights",
      desc: "Get notified about new AI health insights"
    }
  ];

  // ---------------- Activity Stats ----------------
  const recentActivity = [
    { title: "Profile updated", time: "Today at 2:30 PM", color: "green" },
    { title: "New health record added", time: "Yesterday at 9:15 AM", color: "blue" },
    { title: "AI insight generated", time: "2 days ago at 11:45 AM", color: "purple" },
    { title: "Reminder created", time: "3 days ago at 4:20 PM", color: "orange" },
    { title: "Account verified", time: "1 week ago", color: "green" }
  ];

  const accountStats = [
    { value: 12, label: "Health Records", color: "blue" },
    { value: 8, label: "AI Insights", color: "green" },
    { value: 5, label: "Active Reminders", color: "purple" },
    { value: 30, label: "Days Active", color: "orange" }
  ];

  // ---------------- Tabs ----------------
  const profileTabs = [
    {
      id: "profile",
      label: "Profile Information",
      content: React.createElement("div", { className: "max-w-4xl" },
        React.createElement(ProfileForm, { user, onSubmit: handleProfileUpdate, isLoading })
      )
    },
    {
      id: "security",
      label: "Security & Privacy",
      content: React.createElement("div", { className: "space-y-6" },
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, { className: "flex items-center" },
              React.createElement(Shield, { className: "h-5 w-5 mr-2" }),
              "Account Security"
            )
          ),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "space-y-4" },
              securityItems.map((item, idx) =>
                React.createElement("div", { key: idx, className: `flex items-center justify-between p-4 border rounded-lg` },
                  React.createElement("div", null,
                    React.createElement("h4", { className: "font-medium" }, item.title),
                    React.createElement("p", { className: "text-sm text-gray-600" }, item.desc)
                  ),
                  item.btn || null
                )
              )
            )
          )
        ),
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Privacy Settings")
          ),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "space-y-4" },
              privacyItems.map((item, idx) =>
                React.createElement("div", { key: idx, className: "flex items-center justify-between" },
                  React.createElement("div", null,
                    React.createElement("h4", { className: "font-medium" }, item.title),
                    React.createElement("p", { className: "text-sm text-gray-600" }, item.desc)
                  ),
                  item.toggle ?
                    React.createElement("label", { className: "relative inline-flex items-center cursor-pointer" },
                      React.createElement("input", { type: "checkbox", className: "sr-only peer", defaultChecked: true }),
                      React.createElement("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" })
                    )
                    :
                    React.createElement("select", { className: "input w-40" },
                      item.options.map((opt, i) => React.createElement("option", { key: i, value: opt.toLowerCase() }, opt))
                    )
                )
              )
            )
          )
        ),
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Data Management")
          ),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "space-y-4" },
              dataItems.map((item, idx) =>
                React.createElement("div", { key: idx, className: `flex items-center justify-between p-4 border rounded-lg ${item.danger ? "border-red-200" : ""}` },
                  React.createElement("div", null,
                    React.createElement("h4", { className: `font-medium ${item.danger ? "text-red-800" : ""}` }, item.title),
                    React.createElement("p", { className: `text-sm ${item.danger ? "text-red-600" : "text-gray-600"}` }, item.desc)
                  ),
                  item.btn
                )
              )
            )
          )
        )
      )
    },
    {
      id: "notifications",
      label: "Notifications",
      content: React.createElement("div", { className: "space-y-6" },
        React.createElement(Card, null,
          React.createElement(CardHeader, null,
            React.createElement(CardTitle, { className: "flex items-center" },
              React.createElement(Bell, { className: "h-5 w-5 mr-2" }),
              "Notification Settings"
            )
          ),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "space-y-6" },
              notificationTypes.map((item, idx) =>
                React.createElement("div", { key: idx, className: "flex items-center justify-between" },
                  React.createElement("div", null,
                    React.createElement("span", { className: "font-medium" }, item.label),
                    React.createElement("p", { className: "text-sm text-gray-600" }, item.desc)
                  ),
                  React.createElement("div", { className: "flex space-x-4" },
                    ["SMS", "Email"].map((method, mIdx) =>
                      React.createElement("label", { className: "flex items-center", key: mIdx },
                        React.createElement("input", {
                          type: "checkbox",
                          defaultChecked: user.preferences?.notifications?.sms,
                          className: "rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        }),
                        React.createElement("span", { className: "ml-2 text-sm" }, method)
                      )
                    )
                  )
                )
              ),
              React.createElement("div", null,
                React.createElement("h4", { className: "font-medium mb-4" }, "Quiet Hours"),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                  ["Start Time", "End Time"].map((label, idx) =>
                    React.createElement("div", { key: idx },
                      React.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, label),
                      React.createElement("input", { type: "time", defaultValue: label === "Start Time" ? "22:00" : "07:00", className: "input" })
                    )
                  )
                ),
                React.createElement("p", { className: "text-sm text-gray-600 mt-2" }, "No non-urgent notifications will be sent during quiet hours")
              ),
              React.createElement("div", { className: "border-t pt-4" },
                React.createElement(Button, { variant: "outline", onClick: handleTestSMS, className: "mr-4" }, "Send Test SMS"),
                React.createElement(Button, { variant: "primary" }, "Save Notification Settings")
              )
            )
          )
        )
      )
    },
    {
      id: "activity",
      label: "Activity Log",
      content: React.createElement("div", { className: "space-y-6" },
        React.createElement(Card, null,
          React.createElement(CardHeader, null, React.createElement(CardTitle, null, "Recent Activity")),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "space-y-4" },
              recentActivity.map((act, idx) =>
                React.createElement("div", { key: idx, className: "flex items-start space-x-3 p-3 bg-gray-50 rounded-lg" },
                  React.createElement("div", { className: `w-2 h-2 bg-${act.color}-500 rounded-full mt-2` }),
                  React.createElement("div", { className: "flex-1" },
                    React.createElement("p", { className: "text-sm font-medium" }, act.title),
                    React.createElement("p", { className: "text-xs text-gray-500" }, act.time)
                  )
                )
              ),
              React.createElement("div", { className: "mt-6 text-center" },
                React.createElement(Button, { variant: "outline" }, "Load More Activity")
              )
            )
          )
        ),
        React.createElement(Card, null,
          React.createElement(CardHeader, null, React.createElement(CardTitle, null, "Account Statistics")),
          React.createElement(CardContent, null,
            React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4" },
              accountStats.map((stat, idx) =>
                React.createElement("div", { key: idx, className: `text-center p-4 bg-${stat.color}-50 rounded-lg` },
                  React.createElement("div", { className: `text-2xl font-bold text-${stat.color}-600` }, stat.value),
                  React.createElement("div", { className: `text-sm text-${stat.color}-800` }, stat.label)
                )
              )
            )
          )
        )
      )
    }
  ];

  return React.createElement("div", { className: "space-y-6" },
    React.createElement("div", { className: "flex items-center space-x-4" },
      React.createElement("div", { className: "h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center" },
        React.createElement(User, { className: "h-8 w-8 text-white" })
      ),
      React.createElement("div", null,
        React.createElement("h1", { className: "text-2xl font-bold text-gray-900" },
          user.firstName + " " + user.lastName
        ),
        React.createElement("p", { className: "text-gray-600 capitalize" }, user.role)
      )
    ),
    React.createElement(Tabs, { tabs: profileTabs, defaultTab: "profile" })
  );
};

module.exports = Profile;
