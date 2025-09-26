// client/src/services/health.service.ts
import { 
  HealthRecord, 
  CreateHealthRecordData, 
  HealthSummary,
  PaginatedResponse 
} from '@/types';
import { apiService } from './api';

class HealthService {
  async createHealthRecord(data: CreateHealthRecordData): Promise<{ message: string; record: HealthRecord }> {
    const formData = new FormData();
    
    // Append text fields
    formData.append('type', data.type);
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.recordDate) formData.append('recordDate', data.recordDate);
    if (data.tags) formData.append('tags', data.tags);
    if (data.metadata) formData.append('metadata', data.metadata);
    
    // Append files
    if (data.files) {
      Array.from(data.files).forEach((file) => {
        formData.append('files', file);
      });
    }

    return apiService.uploadFiles<{ message: string; record: HealthRecord }>('/health/records', formData);
  }

  async getHealthRecords(params?: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  }): Promise<PaginatedResponse<HealthRecord>> {
    return apiService.get<PaginatedResponse<HealthRecord>>('/health/records', params);
  }

  async getHealthRecord(id: string): Promise<{ record: HealthRecord }> {
    return apiService.get<{ record: HealthRecord }>(`/health/records/${id}`);
  }

  async updateHealthRecord(id: string, data: Partial<HealthRecord>): Promise<{ message: string; record: HealthRecord }> {
    return apiService.put<{ message: string; record: HealthRecord }>(`/health/records/${id}`, data);
  }

  async deleteHealthRecord(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/health/records/${id}`);
  }

  async getHealthSummary(): Promise<HealthSummary> {
    return apiService.get<HealthSummary>('/health/summary');
  }
}

export const healthService = new HealthService();