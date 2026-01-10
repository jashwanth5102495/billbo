import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:3000/api' 
  : 'http://localhost:3000/api';

export interface Billboard {
  _id?: string;
  name: string;
  location: string;
  description?: string;
  price: number;
  image: string;
  status?: 'Active' | 'Inactive';
  type?: 'Digital' | 'Static';
  dimensions?: string;
  dailyFootfall?: string;
}

class BillboardService {
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

  async getAllBillboards(): Promise<Billboard[]> {
    return this.makeRequest('/billboards');
  }

  async getMyBillboards(): Promise<Billboard[]> {
    return this.makeRequest('/billboards/my');
  }

  async addBillboard(billboard: Billboard): Promise<Billboard> {
    return this.makeRequest('/billboards', {
      method: 'POST',
      body: JSON.stringify(billboard),
    });
  }
}

export const billboardService = new BillboardService();
