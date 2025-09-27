// client/src/services/auth.service.js
// Fully CommonJS-aligned Auth service

const apiService = require("./api");

class AuthService {
  async register(data) {
    return apiService.post("/auth/register", data);
  }

  async login(credentials) {
    return apiService.post("/auth/login", credentials);
  }

  async getProfile() {
    return apiService.get("/auth/profile");
  }

  async updateProfile(data) {
    return apiService.put("/auth/profile", data);
  }

  async refreshToken(refreshToken) {
    return apiService.post("/auth/refresh-token", { refreshToken });
  }

  // Local storage helpers
  setTokens(token, refreshToken) {
    localStorage.setItem("healthmitra_token", token);
    localStorage.setItem("healthmitra_refresh_token", refreshToken);
  }

  getToken() {
    return localStorage.getItem("healthmitra_token");
  }

  getRefreshToken() {
    return localStorage.getItem("healthmitra_refresh_token");
  }

  setUser(user) {
    localStorage.setItem("healthmitra_user", JSON.stringify(user));
  }

  getUser() {
    const userStr = localStorage.getItem("healthmitra_user");
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth() {
    localStorage.removeItem("healthmitra_token");
    localStorage.removeItem("healthmitra_refresh_token");
    localStorage.removeItem("healthmitra_user");
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

module.exports = {
  authService: new AuthService(),
};
