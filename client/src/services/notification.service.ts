// client/src/services/notification.service.ts
import {
  Reminder,
  CreateReminderData,
  NotificationPreferences,
  PaginatedResponse,
} from "@/types";
import { apiService } from "./api";

class NotificationService {
  async getReminders(params?: {
    page?: number;
    limit?: number;
    type?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse<Reminder>> {
    return apiService.get<PaginatedResponse<Reminder>>(
      "/notifications/reminders",
      params
    );
  }

  async createReminder(
    data: CreateReminderData
  ): Promise<{ message: string; reminder: Reminder }> {
    return apiService.post<{ message: string; reminder: Reminder }>(
      "/notifications/reminders",
      data
    );
  }

  async updateReminder(
    id: string,
    data: Partial<Reminder>
  ): Promise<{ message: string; reminder: Reminder }> {
    return apiService.put<{ message: string; reminder: Reminder }>(
      `/notifications/reminders/${id}`,
      data
    );
  }

  async deleteReminder(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(
      `/notifications/reminders/${id}`
    );
  }

  async updateNotificationPreferences(
    preferences: NotificationPreferences
  ): Promise<{
    message: string;
    preferences: NotificationPreferences;
  }> {
    return apiService.put<{
      message: string;
      preferences: NotificationPreferences;
    }>("/notifications/preferences", preferences);
  }

  async sendTestSMS(
    message?: string
  ): Promise<{ message: string; sid: string }> {
    return apiService.post<{ message: string; sid: string }>(
      "/notifications/test-sms",
      { message }
    );
  }
}

export const notificationService = new NotificationService();
