import { apiService } from './api';
import { User, LoginCredentials, RegisterCredentials } from '../types/user.types';
import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../utils/constants';

interface AuthResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  message: string;
}

interface ForgotPasswordResponse {
  message: string;
}

class AuthService {
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiService.post<{ access_token: string; user: User }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return {
      user: response.user,
      token: response.access_token,
    };
  } catch (error) {
    throw error;
  }
}

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const response = await apiService.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        credentials
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await apiService.post<ForgotPasswordResponse>(
        API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token: string): Promise<User> {
    try {
      const response = await apiService.get<{ user: User }>(
        API_ENDPOINTS.AUTH.PROFILE,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.user;
    } catch (error) {
      throw error;
    }
  }

  // Note: The backend doesn't have a refresh token endpoint
  // This method is kept for future implementation
  async refreshToken(): Promise<AuthResponse> {
    try {
      // For now, we'll just verify the existing token
      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      if (!token) {
        throw new Error('No token found');
      }
      const user = await this.verifyToken(token);
      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout failed on server:', error);
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.patch<{ user: User }>(
        API_ENDPOINTS.USERS.UPDATE,
        userData
      );
      return response.user;
    } catch (error) {
      throw error;
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await apiService.get<{ user: User }>(
        API_ENDPOINTS.USERS.PROFILE
      );
      return response.user;
    } catch (error) {
      throw error;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await apiService.post('/auth/reset-password', { email });
    } catch (error) {
      throw error;
    }
  }

  async confirmResetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/confirm-reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const authService = new AuthService();
