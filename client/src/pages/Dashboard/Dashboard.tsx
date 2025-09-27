// client/src/pages/Dashboard/Dashboard.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, Brain, Bell, TrendingUp } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchHealthRecords } from "@/store/slices/healthSlice";
import { fetchInsights } from "@/store/slices/aiSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Helper to format Date | string
const formatDateString = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString();
};

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { records, isLoading } = useAppSelector((state) => state.health);
  const { insights, unreadCount } = useAppSelector((state) => state.ai);

  useEffect(() => {
    // Fetch latest 5 records for summary
    dispatch(fetchHealthRecords({ page: 1, limit: 5 } as any));
    dispatch(fetchInsights({}));
  }, [dispatch]);

  // Aggregate summary counts by recordType
  const summary = records.reduce<Record<string, number>>((acc, record) => {
    acc[record.recordType] = (acc[record.recordType] || 0) + 1;
    return acc;
  }, {});

  // Quick action cards
  const quickActions = [
    {
      title: "Add Health Record",
      description: "Upload prescription, lab report, or scan",
      icon: Plus,
      href: "/health-records/new",
      color: "bg-blue-500",
    },
    {
      title: "View Records",
      description: "Browse your medical history",
      icon: FileText,
      href: "/health-records",
      color: "bg-green-500",
    },
    {
      title: "AI Insights",
      description: `${unreadCount} new health insights`,
      icon: Brain,
      href: "/ai-insights",
      color: "bg-purple-500",
      badge: unreadCount > 0 ? unreadCount.toString() : undefined,
    },
    {
      title: "Reminders",
      description: "Manage medication & appointments",
      icon: Bell,
      href: "/reminders",
      color: "bg-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's an overview of your health journey
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} to={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">
                          {action.title}
                        </h3>
                        {action.badge && (
                          <Badge variant="danger">{action.badge}</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Records Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Health Records Overview</CardTitle>
            <CardDescription>
              Your recent medical records summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(summary).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(summary).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">
                      {type}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No health records yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Vital Signs (Sample Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure Trend</CardTitle>
            <CardDescription>Last 5 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={[
                  { date: "2024-01", systolic: 120, diastolic: 80 },
                  { date: "2024-02", systolic: 125, diastolic: 82 },
                  { date: "2024-03", systolic: 118, diastolic: 78 },
                  { date: "2024-04", systolic: 122, diastolic: 81 },
                  { date: "2024-05", systolic: 119, diastolic: 79 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#06b6d4"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent AI Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent AI Insights</CardTitle>
                <CardDescription>
                  Latest health analysis and recommendations
                </CardDescription>
              </div>
              <Link to="/ai-insights">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight) => (
                  <div
                    key={insight._id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`p-1 rounded-full flex-shrink-0 risk-${insight.severity}`}
                    >
                      <Brain className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {insight.message}
                      </p>
                      <div className="mt-2">
                        <Badge
                          variant={
                            insight.severity === "low"
                              ? "success"
                              : insight.severity === "medium"
                              ? "warning"
                              : "danger"
                          }
                        >
                          {insight.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No AI insights yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add some health records to get personalized insights
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Health Tip</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <strong>Stay Hydrated:</strong> Drink at least 8 glasses of
                  water daily to maintain optimal health and support your body's
                  vital functions.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
