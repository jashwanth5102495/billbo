import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/env';

export interface Booking {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
  };
  billboardId: string;
  billboardName: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';
  content: {
    type: 'image' | 'video' | 'text';
    url?: string;
    text?: string;
    moderationStatus?: 'pending' | 'approved' | 'rejected';
    moderationNotes?: string;
  };
  reputation?: number;
  videoDuration?: number;
  createdAt: string;
}

class BookingService {
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async getOwnerBookings(billboardId?: string): Promise<Booking[]> {
    const endpoint = billboardId 
      ? `/bookings/owner?billboardId=${billboardId}` 
      : '/bookings/owner';
    const response = await this.makeRequest(endpoint);
    return response.bookings;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    const response = await this.makeRequest(`/bookings/user/${userId}?limit=50`);
    return response.bookings;
  }
}

export const bookingService = new BookingService();
