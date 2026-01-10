import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService } from '../../services/bookingService';

export type Booking = {
  id: string;
  type: 'ad' | 'space' | 'screen';
  title: string;
  location: string;
  dateRange: string;
  amount: string;
  status: 'Completed' | 'Under Review' | 'Active' | 'Pending' | 'Approved' | 'Rejected';
  color: string;
  businessName?: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  slotTime?: string;
  createdAt: Date;
  content?: {
    type: 'image' | 'video' | 'text';
    url?: string;
    text?: string;
  };
};

type BookingContextType = {
  bookings: Booking[];
  loading: boolean;
  refreshBookings: () => Promise<void>;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => string;
  getBookingById: (id: string) => Booking | undefined;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
};

const BookingContext = createContext<BookingContextType>({
  bookings: [],
  loading: false,
  refreshBookings: async () => {},
  addBooking: () => '',
  getBookingById: () => undefined,
  updateBookingStatus: () => {},
});

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export function BookingProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    if (authLoading) return;

    if (!user || !user.id) {
        setBookings([]);
        return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching bookings for user:', user.id);
      const data = await bookingService.getUserBookings(user.id);
      console.log('Fetched bookings count:', data.length);
      const mappedBookings: Booking[] = data.map((b: any) => {
        let displayStatus = mapStatus(b.status);
        
        // Override based on AI moderation status
        if (b.content?.type === 'video' && b.status !== 'cancelled') {
             if (b.content.moderationStatus === 'rejected') {
                 displayStatus = 'Rejected'; 
             } else if (b.content.moderationStatus === 'pending') {
                 displayStatus = 'Under Review';
             } else if (b.content.moderationStatus === 'approved' && b.status === 'confirmed') {
                 displayStatus = 'Approved';
             }
        }

        return {
          id: b._id,
          type: b.bookingType === 'play-ad' ? 'ad' : b.bookingType === 'public-wishes' ? 'screen' : 'space',
          title: b.billboardName,
          location: b.location,
          dateRange: `${new Date(b.startDate).toLocaleDateString()} - ${new Date(b.endDate).toLocaleDateString()}`,
          amount: `₹${b.price}`,
          status: displayStatus,
          color: getStatusColor(b.status, displayStatus),
          createdAt: new Date(b.createdAt),
          slotTime: `${b.startTime} - ${b.endTime}`,
          content: b.content 
        };
      });
      setBookings(mappedBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    // This is likely only used for local optimistic updates or mock flow.
    // In a real app, bookings are created via API calls elsewhere.
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newBooking: Booking = {
      ...bookingData,
      id,
      createdAt: new Date(),
    };
    setBookings(prev => [newBooking, ...prev]);
    return id;
  };

  const getBookingById = (id: string) => {
    return bookings.find(booking => booking.id === id);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    ));
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      loading,
      refreshBookings: fetchBookings,
      addBooking, 
      getBookingById, 
      updateBookingStatus 
    }}>
      {children}
    </BookingContext.Provider>
  );
}

function mapStatus(status: string): Booking['status'] {
  switch (status) {
    case 'confirmed': return 'Approved';
    case 'active': return 'Active';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Rejected';
    case 'pending': default: return 'Pending';
  }
}

function getStatusColor(backendStatus: string, displayStatus?: string): string {
  // Priority to display status if provided
  if (displayStatus) {
      if (displayStatus === 'Rejected') return '#EF4444';
      if (displayStatus === 'Under Review') return '#F59E0B';
      if (displayStatus === 'Approved') return '#10B981';
  }

  switch (backendStatus) {
    case 'confirmed': return '#10B981'; // Green
    case 'active': return '#3B82F6'; // Blue
    case 'completed': return '#10B981'; // Green
    case 'cancelled': return '#EF4444'; // Red
    case 'pending': default: return '#F59E0B'; // Yellow
  }
}

export default BookingProvider;