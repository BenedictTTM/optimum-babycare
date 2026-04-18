import { apiClient } from '@/api/clients';
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  access_token?: string;
  refresh_token?: string;
  user?: any;
}

export class AuthService {
  /**
   * Login user
   */
  static async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', data);

      if (response.data?.access_token) {
        this.setToken(response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return { success: true, ...response.data };
      }

      return { success: false, message: 'No token received' };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  /**
   * Sign up new user
   */
  static async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/signup', data);

      if (response.data?.access_token) {
        this.setToken(response.data.access_token);
        if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return { success: true, ...response.data };
      }

      return { success: false, ...response.data };
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(data: { email: string }): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', data);
    } catch (error: any) {
      console.error('Password reset request error:', error);
      throw new Error(error.response?.data?.message || 'Failed to request password reset');
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(data: { token: string; newPassword: string }): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }

  /**
   * Logout user — invalidates refresh token on the server,
   * then clears all local auth state and redirects to login.
   */
  static async logout(): Promise<void> {
    try {
      // Call backend to revoke the refresh token
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if the server call fails (e.g. token already expired),
      // we still want to clean up locally.
      console.warn('[AuthService] Server logout failed, cleaning up locally:', error);
    } finally {
      // Clear tokens from storage
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');

      // Reset Zustand stores
      useUserStore.getState().logout();
      useCartStore.getState().setItemCount(0);

      // Redirect to login
      window.location.href = '/auth/login';
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  /**
   * Get current value of access token
   */
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Get current user profile from store.
   * Prefer using `useUserStore()` directly in components.
   */
  static getUser(): any {
    return useUserStore.getState().user;
  }

  /**
   * Set access token
   */
  static setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
  }
}
