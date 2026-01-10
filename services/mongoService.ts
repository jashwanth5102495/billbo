// MongoDB Service for Backend Integration
// Note: This is a template for backend integration. 
// In production, use a proper backend API server instead of direct MongoDB connection from mobile app.

export interface MongoUser {
  _id?: string;
  phoneNumber: string;
  name?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoBusinessProfile {
  _id?: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoFavorite {
  _id?: string;
  userId: string;
  itemId: string;
  itemType: 'billboard' | 'location' | 'service';
  itemData: any;
  createdAt: Date;
}

export interface MongoBooking {
  _id?: string;
  userId: string;
  bookingType: 'personal-wishes' | 'public-wishes' | 'play-ad';
  billboardId: string;
  billboardName: string;
  location: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  content?: {
    type: 'image' | 'video' | 'text';
    url?: string;
    text?: string;
    moderationStatus?: 'pending' | 'approved' | 'rejected';
  };
  createdAt: Date;
  updatedAt: Date;
}

// Backend API Configuration
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://your-backend-api.com/api',
  MONGODB_URI: process.env.EXPO_PUBLIC_MONGODB_URI || 'mongodb://localhost:27017/billboard-app',
  JWT_SECRET: process.env.EXPO_PUBLIC_JWT_SECRET || 'your-jwt-secret',
};

class MongoService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Generic API request method
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('MongoDB API request error:', error);
      throw error;
    }
  }

  // User Management
  async createUser(userData: Omit<MongoUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoUser> {
    return this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });
  }

  async getUserByPhone(phoneNumber: string): Promise<MongoUser | null> {
    try {
      return await this.makeRequest(`/users/phone/${encodeURIComponent(phoneNumber)}`);
    } catch (error) {
      return null;
    }
  }

  async updateUser(userId: string, userData: Partial<MongoUser>): Promise<MongoUser> {
    return this.makeRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...userData,
        updatedAt: new Date(),
      }),
    });
  }

  // Business Profile Management
  async createBusinessProfile(profileData: Omit<MongoBusinessProfile, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoBusinessProfile> {
    return this.makeRequest('/business-profiles', {
      method: 'POST',
      body: JSON.stringify({
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });
  }

  async getBusinessProfile(userId: string): Promise<MongoBusinessProfile | null> {
    try {
      return await this.makeRequest(`/business-profiles/user/${userId}`);
    } catch (error) {
      return null;
    }
  }

  async updateBusinessProfile(userId: string, profileData: Partial<MongoBusinessProfile>): Promise<MongoBusinessProfile> {
    return this.makeRequest(`/business-profiles/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...profileData,
        updatedAt: new Date(),
      }),
    });
  }

  // Favorites Management
  async addToFavorites(favoriteData: Omit<MongoFavorite, '_id' | 'createdAt'>): Promise<MongoFavorite> {
    return this.makeRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify({
        ...favoriteData,
        createdAt: new Date(),
      }),
    });
  }

  async getFavorites(userId: string): Promise<MongoFavorite[]> {
    return this.makeRequest(`/favorites/user/${userId}`);
  }

  async removeFromFavorites(userId: string, itemId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/favorites/user/${userId}/item/${itemId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Booking Management
  async createBooking(bookingData: Omit<MongoBooking, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoBooking> {
    return this.makeRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        ...bookingData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    });
  }

  async getBookings(userId: string): Promise<MongoBooking[]> {
    return this.makeRequest(`/bookings/user/${userId}`);
  }

  async getBooking(bookingId: string): Promise<MongoBooking | null> {
    try {
      return await this.makeRequest(`/bookings/${bookingId}`);
    } catch (error) {
      return null;
    }
  }

  async updateBooking(bookingId: string, bookingData: Partial<MongoBooking>): Promise<MongoBooking> {
    return this.makeRequest(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...bookingData,
        updatedAt: new Date(),
      }),
    });
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Analytics and Statistics
  async getUserStats(userId: string): Promise<{
    totalBookings: number;
    totalSpent: number;
    favoriteCount: number;
    completedBookings: number;
  }> {
    return this.makeRequest(`/users/${userId}/stats`);
  }

  async getBookingHistory(userId: string, limit: number = 10, offset: number = 0): Promise<{
    bookings: MongoBooking[];
    total: number;
    hasMore: boolean;
  }> {
    return this.makeRequest(`/bookings/user/${userId}/history?limit=${limit}&offset=${offset}`);
  }
}

export const mongoService = new MongoService();

// Backend API Endpoints Documentation
/*
Required Backend API Endpoints:

POST /api/users
GET /api/users/phone/:phoneNumber
PUT /api/users/:userId

POST /api/business-profiles
GET /api/business-profiles/user/:userId
PUT /api/business-profiles/user/:userId

POST /api/favorites
GET /api/favorites/user/:userId
DELETE /api/favorites/user/:userId/item/:itemId

POST /api/bookings
GET /api/bookings/user/:userId
GET /api/bookings/:bookingId
PUT /api/bookings/:bookingId
POST /api/bookings/:bookingId/cancel

GET /api/users/:userId/stats
GET /api/bookings/user/:userId/history

MongoDB Collections:
- users
- businessProfiles
- favorites
- bookings
- otpVerifications (for OTP management)
- sessions (for JWT token management)
*/