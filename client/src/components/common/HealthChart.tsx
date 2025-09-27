// client/src/components/common/HealthChart.tsx
import React from "react";
import {
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
  Legend,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatDate } from "../../utils/formatters";

// ---------------- Types ----------------
export interface ChartDataPoint {
  date: string;
  value: number;
  [key: string]: any; // for specialized charts like BP
}

interface HealthChartProps {
  data: ChartDataPoint[];
  title: string;
  type?: "line" | "area" | "bar";
  dataKey: string;
  unit?: string;
  color?: string;
  targetValue?: number;
  normalRange?: { min: number; max: number };
  showTrend?: boolean;
  height?: number;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string;
}

// ---------------- Custom Tooltip ----------------
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  unit,
}) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{formatDate(label)}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${unit ? ` ${unit}` : ""}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ---------------- Trend Calculation ----------------
const calculateTrend = (data: ChartDataPoint[]): "up" | "down" | "neutral" => {
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

// Helper function to format tick values
const formatTick = (value: string) => {
  try {
    return formatDate(value);
  } catch {
    return value;
  }
};

// ---------------- HealthChart ----------------
export const HealthChart: React.FC<HealthChartProps> = ({
  data,
  title,
  type = "line",
  unit = "",
  color = "#0ea5e9",
  targetValue,
  normalRange,
  showTrend = true,
  height = 300,
  className = "",
}) => {
  const trend = calculateTrend(data);
  const latestValue = data.length > 0 ? data[data.length - 1].value : null;
  const previousValue = data.length > 1 ? data[data.length - 2].value : null;
  const changePercent =
    latestValue && previousValue
      ? ((latestValue - previousValue) / previousValue) * 100
      : 0;

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
      ? "text-red-600"
      : "text-gray-600";

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatTick}
                stroke="#666"
                fontSize={12}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}${unit}`}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              {normalRange && (
                <>
                  <ReferenceLine
                    y={normalRange.min}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                  />
                  <ReferenceLine
                    y={normalRange.max}
                    stroke="#22c55e"
                    strokeDasharray="5 5"
                  />
                </>
              )}
              {targetValue && (
                <ReferenceLine
                  y={targetValue}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                />
              )}
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatTick}
                stroke="#666"
                fontSize={12}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}${unit}`}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              {targetValue && (
                <ReferenceLine
                  y={targetValue}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fill={`${color}20`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={formatTick}
                stroke="#666"
                fontSize={12}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${value}${unit}`}
              />
              <Tooltip content={<CustomTooltip unit={unit} />} />
              {targetValue && (
                <ReferenceLine
                  y={targetValue}
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                />
              )}
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {showTrend && latestValue && (
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-lg font-semibold">{`${latestValue}${unit}`}</div>
                {previousValue && (
                  <div className={`text-sm flex items-center ${trendColor}`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {`${Math.abs(changePercent).toFixed(1)}%`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
};

// ---------------- Specialized Charts ----------------
interface SpecializedChartProps {
  data: any[];
  className?: string;
  targetWeight?: number;
}

export const BloodPressureChart: React.FC<SpecializedChartProps> = ({
  data,
  className,
}) => {
  const chartData = data.map((d) => ({
    date: d.date,
    systolic: d.systolic,
    diastolic: d.diastolic,
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Blood Pressure Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              stroke="#666"
              fontSize={12}
            />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip
              formatter={(value, name) => [
                `${value} mmHg`,
                name === "systolic" ? "Systolic" : "Diastolic",
              ]}
              labelFormatter={(label) => formatDate(label)}
            />
            <Legend />
            <ReferenceLine y={120} stroke="#22c55e" strokeDasharray="5 5" />
            <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="5 5" />
            <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="5 5" />
            <ReferenceLine y={90} stroke="#f59e0b" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="systolic"
              stroke="#ef4444"
              strokeWidth={2}
              name="Systolic"
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="diastolic"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Diastolic"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const WeightChart: React.FC<SpecializedChartProps> = ({
  data,
  targetWeight,
  className,
}) => (
  <HealthChart
    data={data}
    title="Weight Progress"
    type="area"
    dataKey="weight"
    unit="kg"
    color="#22c55e"
    targetValue={targetWeight}
    className={className}
  />
);

export const BloodSugarChart: React.FC<SpecializedChartProps> = ({
  data,
  className,
}) => (
  <HealthChart
    data={data}
    title="Blood Sugar Levels"
    type="line"
    dataKey="bloodSugar"
    unit="mg/dL"
    color="#f59e0b"
    normalRange={{ min: 70, max: 140 }}
    targetValue={100}
    className={className}
  />
);

export const HeartRateChart: React.FC<SpecializedChartProps> = ({
  data,
  className,
}) => (
  <HealthChart
    data={data}
    title="Heart Rate"
    type="line"
    dataKey="heartRate"
    unit="BPM"
    color="#ec4899"
    normalRange={{ min: 60, max: 100 }}
    className={className}
  />
);
