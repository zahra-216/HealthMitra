// client/src/services/api.js
const axios = require("axios");
const { toast } = require("react-hot-toast");

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.VITE_API_BASE_URL || "http://localhost:5000/api",
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("healthmitra_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

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
            this.handleAuthError();
          }
        }

        this.handleApiError(error);
        return Promise.reject(error);
      }
    );
  }

  handleAuthError() {
    localStorage.removeItem("healthmitra_token");
    localStorage.removeItem("healthmitra_refresh_token");
    localStorage.removeItem("healthmitra_user");
    window.location.href = "/auth/login";
  }

  handleApiError(error) {
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    if (error.response?.status !== 401) {
      toast.error(message);
    }
  }

  // Generic methods
  async get(url, params) {
    const response = await this.api.get(url, { params });
    return response.data;
  }

  async post(url, data) {
    const response = await this.api.post(url, data);
    return response.data;
  }

  async put(url, data) {
    const response = await this.api.put(url, data);
    return response.data;
  }

  async patch(url, data) {
    const response = await this.api.patch(url, data);
    return response.data;
  }

  async delete(url) {
    const response = await this.api.delete(url);
    return response.data;
  }

  async uploadFiles(url, formData) {
    const response = await this.api.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
}

module.exports = new ApiService();
