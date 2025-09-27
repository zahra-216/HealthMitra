// client/src/pages/Profile/Profile.tsx
import React from "react";
import { User, Shield, Bell } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateProfile } from "@/store/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import ProfileForm from "../../components/forms/ProfileForm";

// Types for user (simplified — extend as needed)
interface UserPreferences {
  notifications?: {
    sms?: boolean;
    email?: boolean;
  };
}

interface UserType {
  firstName: string;
  lastName: string;
  role: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  preferences?: UserPreferences;
}

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state: any) => state.auth) as {
    user: UserType | null;
    isLoading: boolean;
  };

  const handleProfileUpdate = async (data: any) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleTestSMS = async () => {
    try {
      console.log("Sending test SMS...");
    } catch (error) {
      console.error("Failed to send test SMS:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">User not found</p>
        </div>
      </div>
    );
  }

  // ---------------- Security Items ----------------
  const securityItems = [
    {
      title: "Password",
      desc: "Last changed 30 days ago",
      btn: (
        <Button variant="outline" size="sm">
          Change Password
        </Button>
      ),
    },
    {
      title: "Two-Factor Authentication",
      desc: "Add extra security to your account",
      btn: (
        <Button variant="outline" size="sm">
          Enable 2FA
        </Button>
      ),
    },
    {
      title: "Email Verification",
      desc: user.emailVerified ? "Email verified" : "Email not verified",
      btn: !user.emailVerified && (
        <Button variant="outline" size="sm">
          Verify Email
        </Button>
      ),
    },
    {
      title: "Phone Verification",
      desc: user.phoneVerified ? "Phone verified" : "Phone not verified",
      btn: !user.phoneVerified && (
        <Button variant="outline" size="sm">
          Verify Phone
        </Button>
      ),
    },
  ];

  // ---------------- Privacy Settings ----------------
  const privacyItems = [
    {
      title: "Profile Visibility",
      desc: "Control who can see your profile information",
      options: ["Private", "Doctors Only", "Public"],
    },
    {
      title: "Health Records Sharing",
      desc: "Default sharing setting for new health records",
      options: ["Private", "Shared"],
    },
    {
      title: "Data Analytics",
      desc: "Allow anonymized data to improve healthcare insights",
      toggle: true,
    },
  ];

  // ---------------- Data Management ----------------
  const dataItems = [
    {
      title: "Export Data",
      desc: "Download all your health data",
      btn: (
        <Button variant="outline" size="sm">
          Export Data
        </Button>
      ),
    },
    {
      title: "Delete Account",
      desc: "Permanently delete your account and all data",
      btn: (
        <Button variant="danger" size="sm">
          Delete Account
        </Button>
      ),
      danger: true,
    },
  ];

  // ---------------- Notifications ----------------
  const notificationTypes = [
    {
      label: "Medication Reminders",
      desc: "Get notified when it's time for your medications",
    },
    {
      label: "Appointment Reminders",
      desc: "Get reminded about upcoming appointments",
    },
    {
      label: "Health Insights",
      desc: "Get notified about new AI health insights",
    },
  ];

  // ---------------- Activity Stats ----------------
  const recentActivity = [
    { title: "Profile updated", time: "Today at 2:30 PM", color: "green" },
    {
      title: "New health record added",
      time: "Yesterday at 9:15 AM",
      color: "blue",
    },
    {
      title: "AI insight generated",
      time: "2 days ago at 11:45 AM",
      color: "purple",
    },
    {
      title: "Reminder created",
      time: "3 days ago at 4:20 PM",
      color: "orange",
    },
    { title: "Account verified", time: "1 week ago", color: "green" },
  ];

  const accountStats = [
    { value: 12, label: "Health Records", color: "blue" },
    { value: 8, label: "AI Insights", color: "green" },
    { value: 5, label: "Active Reminders", color: "purple" },
    { value: 30, label: "Days Active", color: "orange" },
  ];

  // ---------------- Tabs ----------------
  const profileTabs = [
    {
      id: "profile",
      label: "Profile Information",
      content: (
        <div className="max-w-4xl">
          <ProfileForm
            user={user}
            onSubmit={handleProfileUpdate}
            isLoading={isLoading}
          />
        </div>
      ),
    },
    {
      id: "security",
      label: "Security & Privacy",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    {item.btn}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {privacyItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    {item.toggle ? (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600" />
                      </label>
                    ) : (
                      <select className="input w-40">
                        {item.options?.map((opt, i) => (
                          <option key={i} value={opt.toLowerCase()}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      item.danger ? "border-red-200" : ""
                    }`}
                  >
                    <div>
                      <h4
                        className={`font-medium ${
                          item.danger ? "text-red-800" : ""
                        }`}
                      >
                        {item.title}
                      </h4>
                      <p
                        className={`text-sm ${
                          item.danger ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {item.desc}
                      </p>
                    </div>
                    {item.btn}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notificationTypes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <div className="flex space-x-4">
                      {["SMS", "Email"].map((method, mIdx) => (
                        <label className="flex items-center" key={mIdx}>
                          <input
                            type="checkbox"
                            defaultChecked={
                              user.preferences?.notifications?.sms
                            }
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div>
                  <h4 className="font-medium mb-4">Quiet Hours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Start Time", "End Time"].map((label, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {label}
                        </label>
                        <input
                          type="time"
                          defaultValue={
                            label === "Start Time" ? "22:00" : "07:00"
                          }
                          className="input"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    No non-urgent notifications will be sent during quiet hours
                  </p>
                </div>

                <div className="border-t pt-4">
                  <Button
                    variant="outline"
                    onClick={handleTestSMS}
                    className="mr-4"
                  >
                    Send Test SMS
                  </Button>
                  <Button variant="primary">Save Notification Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "activity",
      label: "Activity Log",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 bg-${act.color}-500 rounded-full mt-2`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{act.title}</p>
                      <p className="text-xs text-gray-500">{act.time}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-6 text-center">
                  <Button variant="outline">Load More Activity</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {accountStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`text-center p-4 bg-${stat.color}-50 rounded-lg`}
                  >
                    <div
                      className={`text-2xl font-bold text-${stat.color}-600`}
                    >
                      {stat.value}
                    </div>
                    <div className={`text-sm text-${stat.color}-800`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600 capitalize">{user.role}</p>
        </div>
      </div>

      <Tabs tabs={profileTabs} defaultTab="profile" />
    </div>
  );
};

export default Profile;
