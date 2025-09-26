// client/src/services/auth.service.ts
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User 
} from '@/types';
import { apiService } from './api';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/register', data);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  }

  async getProfile(): Promise<{ user: User }> {
    return apiService.get<{ user: User }>('/auth/profile');
  }

  async updateProfile(data: Partial<User>): Promise<{ user: User; message: string }> {
    return apiService.put<{ user: User; message: string }>('/auth/profile', data);
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    return apiService.post<{ token: string; refreshToken: string }>('/auth/refresh-token', {
      refreshToken,
    });
  }

  // Local storage helpers
  setTokens(token: string, refreshToken: string) {
    localStorage.setItem('healthmitra_token', token);
    localStorage.setItem('healthmitra_refresh_token', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('healthmitra_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('healthmitra_refresh_token');
  }

  setUser(user: User) {
    localStorage.setItem('healthmitra_user', JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('healthmitra_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  clearAuth() {
    localStorage.removeItem('healthmitra_token');
    localStorage.removeItem('healthmitra_refresh_token');
    localStorage.removeItem('healthmitra_user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();