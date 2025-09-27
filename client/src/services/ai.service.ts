// client/src/services/ai.service.ts
import {
  AIInsight,
  PaginatedResponse,
  VitalSigns,
  HealthRiskAssessments,
} from "@/types";
import { apiService } from "./api";

class AIService {
  async getInsights(params?: {
    page?: number;
    limit?: number;
    severity?: string;
    isRead?: boolean;
  }): Promise<PaginatedResponse<AIInsight> & { unreadCount: number }> {
    return apiService.get<
      PaginatedResponse<AIInsight> & { unreadCount: number }
    >("/ai/insights", params);
  }

  async markInsightAsRead(
    id: string
  ): Promise<{ message: string; insight: AIInsight }> {
    return apiService.patch<{ message: string; insight: AIInsight }>(
      `/ai/insights/${id}/read`
    );
  }

  async assessHealthRisk(vitals: VitalSigns): Promise<{
    assessments: HealthRiskAssessments;
    disclaimer: string;
  }> {
    return apiService.post<{
      assessments: HealthRiskAssessments;
      disclaimer: string;
    }>("/ai/assess-risk", { vitals });
  }

  async generateInsights(): Promise<{ message: string; count: number }> {
    return apiService.post<{ message: string; count: number }>(
      "/ai/generate-insights"
    );
  }
}

export const aiService = new AIService();
