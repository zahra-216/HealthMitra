// client/src/components/common/HealthChart.jsx
const React = require("react");
const {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  ReferenceLine
} = require("recharts");

const { Card, CardContent, CardHeader, CardTitle } = require("../ui/Card");
const { TrendingUp, TrendingDown, Minus } = require("lucide-react");
const { formatDate } = require("../../utils/formatters");

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return React.createElement(
      "div",
      { className: "bg-white p-3 border border-gray-200 rounded-lg shadow-lg" },
      React.createElement("p", { className: "text-sm font-medium text-gray-900" }, formatDate(label)),
      payload.map((entry, index) =>
        React.createElement(
          "p",
          { key: index, className: "text-sm", style: { color: entry.color } },
          `${entry.name}: ${entry.value}${unit ? ` ${unit}` : ""}`
        )
      )
    );
  }
  return null;
};

// Calculate trend from data
const calculateTrend = (data) => {
  if (data.length < 2) return "neutral";

  const recent = data.slice(-3);
  const older = data.slice(-6, -3);

  if (recent.length < 2 || older.length < 2) return "neutral";

  const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length;
  const olderAvg = older.reduce((sum, d) => sum + d.value, 0) / older.length;

  const change = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (change > 5) return "up";
  if (change < -5) return "down";
  return "neutral";
};

const HealthChart = ({
  data,
  title,
  type = "line",
  dataKey,
  unit = "",
  color = "#0ea5e9",
  targetValue,
  normalRange,
  showTrend = true,
  height = 300,
  className = ""
}) => {
  const trend = calculateTrend(data);
  const latestValue = data.length > 0 ? data[data.length - 1].value : null;
  const previousValue = data.length > 1 ? data[data.length - 2].value : null;
  const changePercent = latestValue && previousValue
    ? ((latestValue - previousValue) / previousValue) * 100
    : 0;

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600";

  const renderChart = () => {
    switch (type) {
      case "line":
        return React.createElement(
          ResponsiveContainer,
          { width: "100%", height },
          React.createElement(
            LineChart,
            { data, margin: { top: 5, right: 30, left: 20, bottom: 5 } },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
            React.createElement(XAxis, { 
              dataKey: "date", 
              tickFormatter: (value) => formatDate(value, "en-US", { month: "short", day: "numeric" }),
              stroke: "#666",
              fontSize: 12
            }),
            React.createElement(YAxis, { stroke: "#666", fontSize: 12, tickFormatter: (value) => `${value}${unit}` }),
            React.createElement(Tooltip, { content: React.createElement(CustomTooltip, { unit }) }),
            normalRange && React.createElement(React.Fragment, null,
              React.createElement(ReferenceLine, { y: normalRange.min, stroke: "#22c55e", strokeDasharray: "5 5" }),
              React.createElement(ReferenceLine, { y: normalRange.max, stroke: "#22c55e", strokeDasharray: "5 5" })
            ),
            targetValue && React.createElement(ReferenceLine, { y: targetValue, stroke: "#f59e0b", strokeDasharray: "3 3" }),
            React.createElement(Line, { type: "monotone", dataKey: "value", stroke: color, strokeWidth: 3, dot: { fill: color, strokeWidth: 2, r: 4 }, activeDot: { r: 6, stroke: color, strokeWidth: 2 } })
          )
        );
      case "area":
        return React.createElement(
          ResponsiveContainer,
          { width: "100%", height },
          React.createElement(
            AreaChart,
            { data, margin: { top: 5, right: 30, left: 20, bottom: 5 } },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
            React.createElement(XAxis, { 
              dataKey: "date", 
              tickFormatter: (value) => formatDate(value, "en-US", { month: "short", day: "numeric" }),
              stroke: "#666",
              fontSize: 12
            }),
            React.createElement(YAxis, { stroke: "#666", fontSize: 12, tickFormatter: (value) => `${value}${unit}` }),
            React.createElement(Tooltip, { content: React.createElement(CustomTooltip, { unit }) }),
            targetValue && React.createElement(ReferenceLine, { y: targetValue, stroke: "#f59e0b", strokeDasharray: "3 3" }),
            React.createElement(Area, { type: "monotone", dataKey: "value", stroke: color, fill: `${color}20`, strokeWidth: 2 })
          )
        );
      case "bar":
        return React.createElement(
          ResponsiveContainer,
          { width: "100%", height },
          React.createElement(
            BarChart,
            { data, margin: { top: 5, right: 30, left: 20, bottom: 5 } },
            React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
            React.createElement(XAxis, { 
              dataKey: "date", 
              tickFormatter: (value) => formatDate(value, "en-US", { month: "short", day: "numeric" }),
              stroke: "#666",
              fontSize: 12
            }),
            React.createElement(YAxis, { stroke: "#666", fontSize: 12, tickFormatter: (value) => `${value}${unit}` }),
            React.createElement(Tooltip, { content: React.createElement(CustomTooltip, { unit }) }),
            targetValue && React.createElement(ReferenceLine, { y: targetValue, stroke: "#f59e0b", strokeDasharray: "3 3" }),
            React.createElement(Bar, { dataKey: "value", fill: color, radius: [4, 4, 0, 0] })
          )
        );
      default:
        return null;
    }
  };

  if (!data || data.length === 0) {
    return React.createElement(
      Card,
      { className },
      React.createElement(CardContent, { className: "flex items-center justify-center h-64" },
        React.createElement("div", { className: "text-center text-gray-500" },
          React.createElement("div", { className: "text-4xl mb-2" }, "📊"),
          React.createElement("p", null, "No data available")
        )
      )
    );
  }

  return React.createElement(
    Card,
    { className },
    React.createElement(CardHeader, null,
      React.createElement("div", { className: "flex items-center justify-between" },
        React.createElement(CardTitle, { className: "text-lg" }, title),
        showTrend && latestValue && React.createElement("div", { className: "flex items-center space-x-2" },
          React.createElement("div", { className: "text-right" },
            React.createElement("div", { className: "text-lg font-semibold" }, `${latestValue}${unit}`),
            previousValue && React.createElement("div", { className: `text-sm flex items-center ${trendColor}` },
              React.createElement(TrendIcon, { className: "h-3 w-3 mr-1" }),
              `${Math.abs(changePercent).toFixed(1)}%`
            )
          )
        )
      )
    ),
    React.createElement(CardContent, null, renderChart())
  );
};

// Specialized charts

const BloodPressureChart = ({ data, className }) => {
  const chartData = data.map(d => ({
    date: d.date,
    systolic: d.systolic,
    diastolic: d.diastolic
  }));

  return React.createElement(
    Card,
    { className },
    React.createElement(CardHeader, null,
      React.createElement(CardTitle, null, "Blood Pressure Trend")
    ),
    React.createElement(CardContent, null,
      React.createElement(ResponsiveContainer, { width: "100%", height: 300 },
        React.createElement(LineChart, { data: chartData },
          React.createElement(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }),
          React.createElement(XAxis, { dataKey: "date", tickFormatter: (value) => formatDate(value, "en-US", { month: "short", day: "numeric" }), stroke: "#666", fontSize: 12 }),
          React.createElement(YAxis, { stroke: "#666", fontSize: 12 }),
          React.createElement(Tooltip, {
            formatter: (value, name) => [`${value} mmHg`, name === "systolic" ? "Systolic" : "Diastolic"],
            labelFormatter: (label) => formatDate(label)
          }),
          React.createElement(Legend, null),
          React.createElement(ReferenceLine, { y: 120, stroke: "#22c55e", strokeDasharray: "5 5" }),
          React.createElement(ReferenceLine, { y: 80, stroke: "#22c55e", strokeDasharray: "5 5" }),
          React.createElement(ReferenceLine, { y: 140, stroke: "#f59e0b", strokeDasharray: "5 5" }),
          React.createElement(ReferenceLine, { y: 90, stroke: "#f59e0b", strokeDasharray: "5 5" }),
          React.createElement(Line, { type: "monotone", dataKey: "systolic", stroke: "#ef4444", strokeWidth: 2, name: "Systolic", dot: { fill: "#ef4444", strokeWidth: 2, r: 4 } }),
          React.createElement(Line, { type: "monotone", dataKey: "diastolic", stroke: "#3b82f6", strokeWidth: 2, name: "Diastolic", dot: { fill: "#3b82f6", strokeWidth: 2, r: 4 } })
        )
      )
    )
  );
};

const WeightChart = ({ data, targetWeight, className }) =>
  React.createElement(HealthChart, { data, title: "Weight Progress", type: "area", dataKey: "weight", unit: "kg", color: "#22c55e", targetValue: targetWeight, className });

const BloodSugarChart = ({ data, className }) =>
  React.createElement(HealthChart, { data, title: "Blood Sugar Levels", type: "line", dataKey: "bloodSugar", unit: "mg/dL", color: "#f59e0b", normalRange: { min: 70, max: 140 }, targetValue: 100, className });

const HeartRateChart = ({ data, className }) =>
  React.createElement(HealthChart, { data, title: "Heart Rate", type: "line", dataKey: "heartRate", unit: "BPM", color: "#ec4899", normalRange: { min: 60, max: 100 }, className });

module.exports = {
  HealthChart,
  BloodPressureChart,
  WeightChart,
  BloodSugarChart,
  HeartRateChart
};
