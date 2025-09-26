// shared/types/common.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    timestamp: string;
    version: string;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchQuery extends PaginationQuery {
  search?: string;
  filters?: Record<string, any>;
}

export interface HealthThreshold {
  min?: number;
  max?: number;
  range?: [number, number];
  categories: Record<string, number | [number, number]>;
}

export interface RiskLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  description: string;
  recommendations: string[];
}

export interface NotificationPayload {
  type: 'sms' | 'email' | 'push';
  recipient: string;
  subject?: string;
  message: string;
  data?: Record<string, any>;
  scheduledAt?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}