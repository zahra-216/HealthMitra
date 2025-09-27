// client/src/config/axios.ts
import axios from "axios";

// ✅ Use Vite env instead of process.env
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// Request interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("healthmitra_token"); // consistent with apiService
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("healthmitra_token");
      localStorage.removeItem("healthmitra_refresh_token");
      window.location.href = "/auth/login";
    }
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axios;
