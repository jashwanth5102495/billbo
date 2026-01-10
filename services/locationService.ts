import { billboardService } from './billboardService';

export interface Package {
  id: number;
  name: string;
  time: string;
  duration: string;
  price: number;
  type: 'basic' | 'standard' | 'premium' | 'custom';
  description: string;
}

export interface Location {
  id: string; // Changed from number to string to match MongoDB _id
  name: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  dailyFootfall: string;
  peakHours: string;
  demographics: string;
  visibility: string;
  packages: Package[];
  interactiveFeatures?: string;
  coordinates?: { latitude: number; longitude: number };
  createdAt: Date;
  updatedAt: Date;
}

// ... Order interface ...

class LocationService {
  private readonly LOCATIONS_KEY = 'billboard_locations';
  private readonly ORDERS_KEY = 'billboard_orders';
  
  // Default coordinates for Bangalore if missing
  private readonly DEFAULT_COORDINATES = {
    latitude: 12.9716,
    longitude: 77.5946
  };

  async getLocations(): Promise<Location[]> {
    try {
      const billboards = await billboardService.getAllBillboards();
      
      return billboards.map(billboard => ({
        id: billboard._id || Math.random().toString(),
        name: billboard.name,
        location: billboard.location,
        rating: 4.5, // Mock rating
        reviews: 0, // Mock reviews
        image: billboard.image,
        dailyFootfall: billboard.dailyFootfall || '5000+',
        peakHours: '6 PM - 10 PM',
        demographics: 'Mixed',
        visibility: 'High',
        packages: [
          {
            id: 1,
            name: 'Standard Hour',
            time: '1 Hour',
            duration: '60 mins',
            price: billboard.price,
            type: 'standard',
            description: 'Standard display time'
          }
        ],
        coordinates: this.DEFAULT_COORDINATES, // Add real coordinates later
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error('Error getting locations:', error);
      // Fallback to empty list or cached data
      return [];
    }
  }


  async addLocation(locationData: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
    try {
      // Note: This local addition might not persist to backend if getLocations fetches from backend
      const locations = await this.getLocations();
      const nextId = await this.getNextLocationId();
      
      const newLocation: Location = {
        ...locationData,
        id: nextId.toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      locations.push(newLocation);
      // We can't save to backend via this method yet, so just logging warning
      console.warn('addLocation: Adding locally, but getLocations fetches from backend.');
      
      return newLocation;
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  }

  async updateLocation(id: string, locationData: Partial<Omit<Location, 'id' | 'createdAt'>>): Promise<Location | null> {
    try {
      const locations = await this.getLocations();
      const index = locations.findIndex(loc => loc.id === id);
      
      if (index === -1) {
        return null;
      }

      // Mock update
      return {
        ...locations[index],
        ...locationData,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  async deleteLocation(id: string): Promise<boolean> {
    try {
      const locations = await this.getLocations();
      // Mock delete
      return true;
    } catch (error) {
      console.error('Error deleting location:', error);
      throw error;
    }
  }

  async getLocationById(id: string): Promise<Location | null> {
    try {
      const locations = await this.getLocations();
      return locations.find(loc => loc.id === id) || null;
    } catch (error) {
      console.error('Error getting location by id:', error);
      return null;
    }
  }

  // Order Management
  async getOrders(): Promise<Order[]> {
    try {
      const ordersJson = await AsyncStorage.getItem(this.ORDERS_KEY);
      if (ordersJson) {
        const orders = JSON.parse(ordersJson);
        return orders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  async addOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    try {
      const orders = await this.getOrders();
      const nextId = await this.getNextOrderId();
      
      const newOrder: Order = {
        ...orderData,
        id: nextId.toString(),
        createdAt: new Date()
      };

      orders.push(newOrder);
      await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
      await this.incrementOrderId();
      
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const orders = await this.getOrders();
      const index = orders.findIndex(order => order.id === id);
      
      if (index === -1) {
        return null;
      }

      orders[index].status = status;
      await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
      return orders[index];
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Helper methods for ID generation
  private async getNextLocationId(): Promise<number> {
    try {
      const nextIdStr = await AsyncStorage.getItem(this.NEXT_LOCATION_ID_KEY);
      return nextIdStr ? parseInt(nextIdStr) : 1;
    } catch (error) {
      return 1;
    }
  }

  private async incrementLocationId(): Promise<void> {
    try {
      const currentId = await this.getNextLocationId();
      await AsyncStorage.setItem(this.NEXT_LOCATION_ID_KEY, (currentId + 1).toString());
    } catch (error) {
      console.error('Error incrementing location ID:', error);
    }
  }

  private async getNextOrderId(): Promise<number> {
    try {
      const nextIdStr = await AsyncStorage.getItem(this.NEXT_ORDER_ID_KEY);
      return nextIdStr ? parseInt(nextIdStr) : 1;
    } catch (error) {
      return 1;
    }
  }

  private async incrementOrderId(): Promise<void> {
    try {
      const currentId = await this.getNextOrderId();
      await AsyncStorage.setItem(this.NEXT_ORDER_ID_KEY, (currentId + 1).toString());
    } catch (error) {
      console.error('Error incrementing order ID:', error);
    }
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.LOCATIONS_KEY,
        this.ORDERS_KEY,
        this.NEXT_LOCATION_ID_KEY,
        this.NEXT_ORDER_ID_KEY
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export const locationService = new LocationService();