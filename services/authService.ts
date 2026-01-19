import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/env';

export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  ownerName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  panNumber?: string;
  businessDescription?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  businessProfile?: BusinessProfile;
  token?: string;
  message?: string;
}

export interface ProfileResponse {
  success: boolean;
  profile?: BusinessProfile;
  message?: string;
}

class AuthService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      console.log(`🌐 Making API request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      console.log(`📡 API Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API Response success:`, data);
      return data;
    } catch (error) {
      console.error('❌ API request error:', error);
      
      // Check if it's a connection error
      if (error.message.includes('fetch') || error.message.includes('Network')) {
        throw new Error('Cannot connect to server. Please check your network connection.');
      }
      
      throw error;
    }
  }

  /**
   * Login with identifier (phone or username) and credential (otp or password)
   */
  async login(identifier: string, credential: string, type: 'business' | 'billboard'): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          type,
          identifier,
          [type === 'billboard' ? 'password' : 'otp']: credential
        }),
      });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phoneNumber: string): Promise<boolean> {
    try {
      const response = await this.makeRequest('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber }),
      });
      
      return response.success;
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  }

  /**
   * Verify OTP
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    return this.login(phoneNumber, otp, 'business');
  }

  /**
   * Skip OTP for development
   */
  async skipOTP(phoneNumber: string): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest('/auth/skip-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber }),
      });

      return response;
    } catch (error) {
      console.error('Skip OTP error:', error);
      return { success: false, message: 'Skip OTP failed' };
    }
  }


  /**
   * Get user's business profile
   */
  async getBusinessProfile(userId: string): Promise<BusinessProfile | null> {
    try {
      const response = await this.makeRequest(`/business-profiles/user/${userId}`);
      return response.success ? response.profile : null;
    } catch (error) {
      console.error('Get business profile error:', error);
      return null;
    }
  }

  /**
   * Create or update business profile
   */
  async updateBusinessProfile(userId: string, profile: Partial<BusinessProfile>): Promise<ProfileResponse> {
    try {
      console.log('🏢 Saving business profile for user:', userId);
      console.log('🏢 Profile data:', profile);

      // Check if profile already exists
      let existingProfile: BusinessProfile | null = null;
      try {
        existingProfile = await this.getBusinessProfile(userId);
      } catch (checkError) {
        console.warn('⚠️ Could not check existing business profile:', checkError);
      }

      let response: ProfileResponse;

      if (existingProfile) {
        console.log('🏢 Existing profile found, updating via PUT');
        response = await this.makeRequest(`/business-profiles/user/${userId}`, {
          method: 'PUT',
          body: JSON.stringify(profile),
        });
      } else {
        console.log('🏢 No existing profile, creating via POST');
        response = await this.makeRequest('/business-profiles', {
          method: 'POST',
          body: JSON.stringify(profile),
        });
      }

      console.log('🏢 Business profile save response:', response);
      return response;
    } catch (error) {
      console.error('❌ Update business profile error:', error);
      return { success: false, message: 'Profile update failed' };
    }
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, userData: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      return response;
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, message: 'User update failed' };
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(`/users/${userId}`, {
        method: 'DELETE',
      });

      return response.success;
    } catch (error) {
      console.error('Delete account error:', error);
      return false;
    }
  }

  /**
   * Get user favorites
   */
  async getFavorites(userId: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/users/${userId}/favorites`);
      return response.success ? response.favorites : [];
    } catch (error) {
      console.error('Get favorites error:', error);
      return [];
    }
  }

  /**
   * Add to favorites
   */
  async addToFavorites(userId: string, itemId: string, itemType: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(`/users/${userId}/favorites`, {
        method: 'POST',
        body: JSON.stringify({ itemId, itemType }),
      });

      return response.success;
    } catch (error) {
      console.error('Add to favorites error:', error);
      return false;
    }
  }

  /**
   * Remove from favorites
   */
  async removeFromFavorites(userId: string, itemId: string): Promise<boolean> {
    try {
      const response = await this.makeRequest(`/users/${userId}/favorites/${itemId}`, {
        method: 'DELETE',
      });

      return response.success;
    } catch (error) {
      console.error('Remove from favorites error:', error);
      return false;
    }
  }

  /**
   * Get user booking history
   */
  async getBookingHistory(userId: string): Promise<any[]> {
    try {
      const response = await this.makeRequest(`/users/${userId}/bookings`);
      return response.success ? response.bookings : [];
    } catch (error) {
      console.error('Get booking history error:', error);
      return [];
    }
  }
}

export const authService = new AuthService();
