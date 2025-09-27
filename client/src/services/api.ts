// client/src/services/api.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { toast } from "react-hot-toast";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("healthmitra_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem(
              "healthmitra_refresh_token"
            );
            if (refreshToken) {
              const response = await this.api.post("/auth/refresh-token", {
                refreshToken,
              });

              const { token, refreshToken: newRefreshToken } = response.data;
              localStorage.setItem("healthmitra_token", token);
              localStorage.setItem(
                "healthmitra_refresh_token",
                newRefreshToken
              );

              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthError();
          }
        }

        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleAuthError() {
    localStorage.removeItem("healthmitra_token");
    localStorage.removeItem("healthmitra_refresh_token");
    localStorage.removeItem("healthmitra_user");
    window.location.href = "/auth/login";
  }

  private handleApiError(error: AxiosError) {
    const message =
      (error.response?.data as any)?.message || "An unexpected error occurred";

    if (error.response?.status !== 401) {
      toast.error(message);
    }
  }

  // Generic methods
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete(url);
    return response.data;
  }

  // File upload method
  async uploadFiles<T>(url: string, formData: FormData): Promise<T> {
    const response = await this.api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
