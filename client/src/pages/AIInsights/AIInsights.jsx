// client/src/pages/AIInsights/AIInsights.jsx
import React, { useEffect, useState } from "react";
import {
  Brain,
  AlertCircle,
  TrendingUp,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchInsights, markInsightAsRead } from "@/store/slices/aiSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import RiskBadge from "@/components/common/RiskBadge";

const AIInsights = () => {
  const dispatch = useAppDispatch();
  const { insights, isLoading, unreadCount } = useAppSelector(
    (state) => state.ai
  );

  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    dispatch(
      fetchInsights({
        severity: selectedSeverity || undefined,
        isRead: showUnreadOnly ? false : undefined,
      })
    );
  }, [dispatch, selectedSeverity, showUnreadOnly]);

  const handleMarkAsRead = (insightId) => {
    dispatch(markInsightAsRead(insightId));
  };

  const getInsightIcon = (type) => {
    const icons = {
      health_risk: AlertCircle,
      trend_analysis: TrendingUp,
      medication_alert: Info,
      general_advice: Brain,
    };
    return icons[type] || Brain;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading AI insights..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Health Insights</h1>
        <p className="mt-1 text-sm text-gray-600">
          Personalized health analysis and recommendations based on your records
        </p>
      </div>

      {/* Disclaimer */}
      <Alert variant="warning">
        <strong>Medical Disclaimer:</strong> These AI insights are for
        informational purposes only and should not replace professional medical
        advice. Always consult with qualified healthcare providers for medical
        decisions.
      </Alert>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Filter by severity:
          </label>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="input min-w-[120px]"
          >
            <option value="">All Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Unread only ({unreadCount})
          </span>
        </label>
      </div>

      {/* Insights List */}
      {insights.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No insights available
            </h3>
            <p className="text-gray-600">
              Add some health records to get personalized AI insights and
              recommendations
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);

            return (
              <Card
                key={insight._id}
                className={`${!insight.isRead ? "ring-2 ring-primary-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full flex-shrink-0 risk-${insight.severity}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <RiskBadge risk={insight.severity} showIcon={false} />
                          <span className="text-xs text-gray-500">
                            Confidence: {Math.round(insight.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {!insight.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(insight._id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 mb-4">{insight.message}</p>

                  {insight.recommendations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Recommendations:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {insight.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insight.dataUsed.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Based on:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.dataUsed.map((data, idx) => (
                          <Badge key={idx} variant="default">
                            {data.dataType}: {data.value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
