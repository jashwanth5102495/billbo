import React, { useState, createContext, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  FlatList,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Star, Heart, Clock, Sun, Moon, User, Calendar, ChevronLeft, ChevronRight, Info, Plane } from 'lucide-react-native';
import { useTheme } from './ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { locationService, Location } from '../../services/locationService';


const { width } = Dimensions.get('window');

const mainSlides = [
  {
    id: 1,
    title: 'Play your Ad',
    subtitle: 'Showcase your business on premium digital billboards',
    route: '/play-ad',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceInfo: 'Prices starting from ₹3000 only',
    timeInfo: 'Play within 5 to 15 minutes',
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 2,
    title: 'Personal Wishes & Invitations',
    subtitle: 'Share special moments with loved ones on big screens',
    route: '/personal-wishes',
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceInfo: 'Prices starting from ₹299 only',
    timeInfo: 'Display within 2 to 8 hours',
    rating: 4.9,
    reviews: 234,
  },
  {
    id: 3,
    title: 'Connect your existing screen',
    subtitle: 'Join our network with your digital displays',
    route: '/connect-screen',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceInfo: 'Earn starting from ₹5000/month',
    timeInfo: 'Setup within 3 to 7 days',
    rating: 4.6,
    reviews: 98,
  },
  {
    id: 4,
    title: 'Providing space for installing billboard',
    subtitle: 'Monetize your property with billboard installations',
    route: '/provide-space',
    image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
    priceInfo: 'Earn starting from ₹15000/month',
    timeInfo: 'Installation within 15 to 30 days',
    rating: 4.5,
    reviews: 67,
  },
];



export type Place = {
  id: number;
  name: string;
  priceRange: string;
  rating: number;
  reviews: number;
  image: string;
  location: string;
};

type FavoritesContextType = {
  favorites: Place[];
  toggleFavorite: (place: Place) => void;
  isFavorite: (place: Place) => boolean;
};

// Favorites Context
export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Place[]>([]);
  const toggleFavorite = (place: Place) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === place.id)) {
        return prev.filter((p) => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };
  const isFavorite = (place: Place) => favorites.some((p) => p.id === place.id);
  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export default function HomeScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, businessProfile } = useAuth();
  const [search, setSearch] = useState('');
  const { favorites, toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showServiceInfoModal, setShowServiceInfoModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create circular data for infinite scrolling
  const circularMainSlides = [...mainSlides, ...mainSlides, ...mainSlides];
  const [servicesScrollRef, setServicesScrollRef] = useState<FlatList | null>(null);

  // Load locations on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        const fetchedLocations = await locationService.getLocations();
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Failed to load locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  const availableTimeSlots = [
    '12:48 PM',
    '2:30 PM',
    '4:45 PM',
    '6:20 PM',
    '8:15 PM',
    '10:30 PM'
  ];

  // Helper functions for calendar
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 0);
      const prevMonthDays = getDaysInMonth(prevMonth);
      days.push({
        day: prevMonthDays - firstDay + i + 1,
        isCurrentMonth: false,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - firstDay + i + 1)
      });
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      });
    }

    // Add days from next month to fill the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 cells
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day)
      });
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // setDateTime(now.toLocaleString(undefined, {
      //   weekday: 'short',
      //   year: 'numeric',
      //   month: 'short',
      //   day: 'numeric',
      //   hour: '2-digit',
      //   minute: '2-digit',
      // }));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll effect for services
  useEffect(() => {
    if (servicesScrollRef) {
      let currentIndex = mainSlides.length; // Start from middle set
      const scrollInterval = setInterval(() => {
        currentIndex += 1;
        if (currentIndex >= circularMainSlides.length - mainSlides.length) {
          // Reset to beginning of middle set when reaching end
          currentIndex = mainSlides.length;
          servicesScrollRef.scrollToIndex({
            index: currentIndex,
            animated: false,
          });
        } else {
          servicesScrollRef.scrollToIndex({
            index: currentIndex,
            animated: true,
          });
        }
      }, 3000); // Scroll every 3 seconds

      return () => clearInterval(scrollInterval);
    }
  }, [servicesScrollRef]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#F8FAFC',
    },
    heroSection: {
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#000000' : '#222',
      marginBottom: 16,
      height: 320, // Increased height for more space
      position: 'relative',
    },
    heroImage: {
      width: '100%',
      height: 320, // Match heroSection height
      position: 'absolute',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.45)',
    },
    heroContent: {
      flex: 1,
      paddingTop: 32,
      paddingHorizontal: 20,
      paddingBottom: 90,
      minHeight: 320,
      justifyContent: 'flex-start',
    },
    heroRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    rightIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    profileIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    themeToggle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#111',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '500',
      marginLeft: 8,
    },
    heroTitle: {
      color: '#fff',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 20,
      marginTop: 8, // Move text a bit higher
    },
    searchBarWrapper: {
      marginTop: 0,
      alignItems: 'flex-start',
      zIndex: 2,
      width: '100%',
      paddingHorizontal: 20,
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 24,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(36,36,36,0.7)',
      borderRadius: 18,
      paddingHorizontal: 18,
      paddingVertical: 14,
      width: '100%',
    },
    searchTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    searchMainText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    searchSubText: {
      color: '#d1d5db',
      fontSize: 13,
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
      marginHorizontal: 20,
      marginBottom: 12,
      marginTop: 24,
    },
    cardList: {
      paddingLeft: 20,
      paddingBottom: 8,
    },
    card: {
      width: 280,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#fff',
      borderRadius: 16,
      marginRight: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
      overflow: 'hidden',
    },
    cardImage: {
      width: '100%',
      height: 180,
      position: 'relative',
    },
    cardImageOverlay: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardContent: {
      padding: 16,
    },
    cardHeader: {
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
      marginBottom: 4,
      lineHeight: 22,
    },
    cardSubtitle: {
      fontSize: 13,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      lineHeight: 18,
      marginBottom: 8,
    },
    cardRatingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardRating: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#222',
      marginLeft: 4,
    },
    cardReviews: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginLeft: 4,
    },
    cardPriceInfo: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#222',
      marginBottom: 2,
    },
    cardTimeInfo: {
      fontSize: 13,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginBottom: 12,
    },
    heartButton: {
      padding: 4,
    },
    cardDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    cardLocation: {
      fontSize: 13,
      color: isDarkMode ? '#d1d5db' : '#6B7280',
      marginLeft: 4,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    rating: {
      fontSize: 13,
      fontWeight: '600',
      color: isDarkMode ? '#fff' : '#222',
      marginLeft: 4,
    },
    reviews: {
      fontSize: 13,
      color: isDarkMode ? '#d1d5db' : '#6B7280',
      marginLeft: 4,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    price: {
      fontSize: 15,
      color: isDarkMode ? '#fff' : '#222',
      fontWeight: 'bold',
      marginRight: 8,
    },
    discoverSection: {
      marginTop: 18,
    },
    discoverList: {
      paddingLeft: 20,
      paddingBottom: 24,
    },
    // Flight Card Style for Discover Places
    flightCard: {
      width: 340,
      height: 180,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 20,
      marginRight: 16,
      overflow: 'hidden',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    flightCardImage: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    flightCardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    flightCardContent: {
      flex: 1,
      padding: 16,
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 2,
    },
    flightCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    flightCardBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backdropFilter: 'blur(10px)',
    },
    flightCardBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 6,
    },
    flightCardPrice: {
      backgroundColor: '#9ACD32',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    flightCardPriceText: {
      color: '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
    flightCardBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    flightCardTimeSection: {
      flex: 1,
    },
    flightCardTime: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    flightCardCode: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 2,
    },
    flightCardLocation: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 12,
      fontWeight: '500',
    },
    flightCardCenter: {
      alignItems: 'center',
      paddingHorizontal: 20,
      flex: 0.5,
    },
    flightCardRoute: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    flightCardDots: {
      width: 4,
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderRadius: 2,
      marginHorizontal: 3,
    },
    flightCardPlane: {
      marginHorizontal: 8,
    },
    // Calendar Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    calendarModal: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5',
      borderRadius: 20,
      padding: 20,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#333',
      textAlign: 'center',
      marginBottom: 20,
    },
    dateInputContainer: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#FF8C00',
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateInputText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4A90E2',
    },
    calendarContainer: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    monthNavButton: {
      padding: 8,
    },
    monthNavText: {
      fontSize: 24,
      color: '#666',
    },
    monthYearText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#333',
    },
    weekDaysContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    weekDayText: {
      flex: 1,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#9CA3AF' : '#666',
      paddingVertical: 8,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayButton: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    dayText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#333',
    },
    inactiveDayText: {
      color: isDarkMode ? '#6B7280' : '#CCC',
    },
    selectedDay: {
      backgroundColor: '#FF8C00',
      borderRadius: 20,
    },
    selectedDayText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    timeSlotsContainer: {
      marginBottom: 20,
    },
    timeSlotsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    timeSlotButton: {
      backgroundColor: isDarkMode ? '#3A3A3A' : '#FFF',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDarkMode ? '#555555' : '#DDD',
      minWidth: '30%',
      alignItems: 'center',
    },
    selectedTimeSlot: {
      backgroundColor: '#FF8C00',
      borderColor: '#FF8C00',
    },
    timeSlotText: {
      fontSize: 14,
      color: isDarkMode ? '#FFFFFF' : '#333',
    },
    selectedTimeSlotText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: isDarkMode ? '#3A3A3A' : '#DDD',
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontSize: 16,
      color: isDarkMode ? '#D1D5DB' : '#666',
      fontWeight: '600',
    },
    bookButton: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#333',
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    bookButtonText: {
      fontSize: 16,
      color: '#FFF',
      fontWeight: 'bold',
    },
    seeAvailabilityButton: {
      backgroundColor: '#4A90E2',
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    seeAvailabilityText: {
      fontSize: 16,
      color: '#FFF',
      fontWeight: 'bold',
    },
    // Service Info Modal Styles
    serviceInfoModal: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      width: '90%',
      maxWidth: 400,
    },
    serviceInfoTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#333',
      marginBottom: 16,
    },
    serviceInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 4,
    },
    serviceInfoIcon: {
      marginRight: 12,
      width: 20,
    },
    serviceInfoText: {
      fontSize: 16,
      color: isDarkMode ? '#D1D5DB' : '#666',
      flex: 1,
    },
    serviceInfoLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#9CA3AF' : '#888',
      marginBottom: 4,
    },
    serviceInfoValue: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#333',
    },
    closeInfoButton: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#E5E7EB',
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    closeInfoButtonText: {
      fontSize: 16,
      color: isDarkMode ? '#D1D5DB' : '#666',
      fontWeight: '600',
    },
    // Loading and Empty State Styles
    loadingContainer: {
      paddingVertical: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      fontStyle: 'italic',
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      fontStyle: 'italic',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.heroSection}>
          <Image
            source={require('../../public/bg.png')}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroRow}>
              <View style={styles.locationRow}>
                <Calendar size={18} color="#fff" />
                <Text style={styles.locationText}>{selectedDate ? selectedDate.toLocaleDateString() : 'Search date'}</Text>
              </View>
              <View style={styles.rightIcons}>
                <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                  {isDarkMode ? (
                    <Sun size={22} color="#fff" />
                  ) : (
                    <Moon size={22} color="#fff" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileIcon} onPress={() => router.push('/profile' as any)}>
                  <User size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.heroTitle}>
              Hey, {businessProfile?.ownerName || user?.name || 'there'}! Tell us where you want to go
            </Text>
            <View style={styles.searchBarWrapper}>
              <TouchableOpacity style={styles.searchBar} onPress={() => setShowDateModal(true)} activeOpacity={0.8}>
                <Search size={20} color="#fff" />
                <View style={styles.searchTextContainer}>
                  <Text style={styles.searchMainText}>{selectedDate ? selectedDate.toLocaleDateString() : 'Search date'}</Text>
                  <Text style={styles.searchSubText}>Tap to select a date</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Enhanced Calendar Modal */}
        <Modal
          visible={showDateModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.calendarModal}>
              <Text style={styles.modalTitle}>Select a date</Text>
              
              {/* Date Input Display */}
              <View style={styles.dateInputContainer}>
                <Text style={styles.dateInputText}>
                  {tempDate.toLocaleDateString('en-GB')}
                </Text>
                <Calendar size={20} color="#666" />
              </View>

              {/* Calendar */}
              <View style={styles.calendarContainer}>
                {/* Calendar Header */}
                <View style={styles.calendarHeader}>
                  <TouchableOpacity 
                    style={styles.monthNavButton}
                    onPress={() => navigateMonth('prev')}
                  >
                    <ChevronLeft size={24} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.monthYearText}>
                    {getMonthName(currentMonth)}
                  </Text>
                  <TouchableOpacity 
                    style={styles.monthNavButton}
                    onPress={() => navigateMonth('next')}
                  >
                    <ChevronRight size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Week Days */}
                <View style={styles.weekDaysContainer}>
                  {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
                    <Text key={day} style={styles.weekDayText}>{day}</Text>
                  ))}
                </View>

                {/* Calendar Grid */}
                <View style={styles.calendarGrid}>
                  {generateCalendarDays().map((dayInfo, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        isSameDay(dayInfo.date, tempDate) && styles.selectedDay
                      ]}
                      onPress={() => {
                        setTempDate(dayInfo.date);
                        if (!dayInfo.isCurrentMonth) {
                          setCurrentMonth(dayInfo.date);
                        }
                      }}
                    >
                      <Text style={[
                        styles.dayText,
                        !dayInfo.isCurrentMonth && styles.inactiveDayText,
                        isSameDay(dayInfo.date, tempDate) && styles.selectedDayText
                      ]}>
                        {dayInfo.day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Time Slots */}
              <View style={styles.timeSlotsContainer}>
                <View style={styles.timeSlotsGrid}>
                  {availableTimeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlotButton,
                        selectedTimeSlot === time && styles.selectedTimeSlot
                      ]}
                      onPress={() => setSelectedTimeSlot(time)}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        selectedTimeSlot === time && styles.selectedTimeSlotText
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* See Availability Button */}
              <TouchableOpacity
                style={styles.seeAvailabilityButton}
                onPress={() => {
                  setSelectedDate(tempDate);
                  setShowDateModal(false);
                  router.push(`/availability?date=${tempDate.toISOString().split('T')[0]}&time=${selectedTimeSlot || ''}`);
                }}
              >
                <Text style={styles.seeAvailabilityText}>See Availability</Text>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.cancelButton, { width: '100%' }]}
                  onPress={() => setShowDateModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Service Info Modal */}
        <Modal
          visible={showServiceInfoModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowServiceInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.serviceInfoModal}>
              <Text style={styles.serviceInfoTitle}>
                {selectedService?.title}
              </Text>
              
              <View style={styles.serviceInfoRow}>
                <Star size={20} color="#FCD34D" style={styles.serviceInfoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceInfoLabel}>Rating & Reviews</Text>
                  <Text style={styles.serviceInfoValue}>
                    {selectedService?.rating} ({selectedService?.reviews} reviews)
                  </Text>
                </View>
              </View>

              <View style={styles.serviceInfoRow}>
                <Text style={[styles.serviceInfoIcon, { fontSize: 20, textAlign: 'center' }]}>₹</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceInfoLabel}>Pricing</Text>
                  <Text style={styles.serviceInfoValue}>{selectedService?.priceInfo}</Text>
                </View>
              </View>

              <View style={styles.serviceInfoRow}>
                <Clock size={20} color={isDarkMode ? '#9CA3AF' : '#666'} style={styles.serviceInfoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceInfoLabel}>Timeline</Text>
                  <Text style={styles.serviceInfoValue}>{selectedService?.timeInfo}</Text>
                </View>
              </View>

              <View style={styles.serviceInfoRow}>
                <Info size={20} color={isDarkMode ? '#9CA3AF' : '#666'} style={styles.serviceInfoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceInfoLabel}>Description</Text>
                  <Text style={styles.serviceInfoText}>{selectedService?.subtitle}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.closeInfoButton}
                onPress={() => setShowServiceInfoModal(false)}
              >
                <Text style={styles.closeInfoButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Our Services</Text>
        <FlatList
          ref={(ref) => setServicesScrollRef(ref)}
          data={circularMainSlides}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.9}
            >
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <TouchableOpacity 
                  style={styles.cardImageOverlay}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedService(item);
                    setShowServiceInfoModal(true);
                  }}
                >
                  <Info size={16} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                
                <View style={styles.cardRatingRow}>
                  <Star size={14} color="#FCD34D" fill="#FCD34D" />
                  <Text style={styles.cardRating}>{item.rating}</Text>
                  <Text style={styles.cardReviews}>({item.reviews})</Text>
                </View>
                
                <Text style={styles.cardPriceInfo}>{item.priceInfo}</Text>
                <Text style={styles.cardTimeInfo}>{item.timeInfo}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
          snapToInterval={296} // card width (280) + margin (16)
          decelerationRate="fast"
          pagingEnabled={false}
          getItemLayout={(data, index) => ({
            length: 296,
            offset: 296 * index,
            index,
          })}
          initialScrollIndex={mainSlides.length} // Start from the middle set
          onScrollToIndexFailed={() => {}}
        />
        <View style={styles.discoverSection}>
          <Text style={styles.sectionTitle}>Discover new places</Text>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading locations...</Text>
            </View>
          ) : locations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No locations available</Text>
            </View>
          ) : (
            <FlatList
              data={locations}
              renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.flightCard}
                onPress={() => console.log('Navigate to:', item.name)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.image }} style={styles.flightCardImage} />
                <View style={styles.flightCardOverlay} />
                
                <View style={styles.flightCardContent}>
                  {/* Header with badge and price */}
                  <View style={styles.flightCardHeader}>
                    <View style={styles.flightCardBadge}>
                      <Heart size={12} color="#FFFFFF" />
                      <Text style={styles.flightCardBadgeText}>Billboard booking</Text>
                    </View>
                    <View style={styles.flightCardPrice}>
                      <Text style={styles.flightCardPriceText}>{item.price}</Text>
                    </View>
                  </View>

                  {/* Bottom section with times and location codes */}
                  <View style={styles.flightCardBottom}>
                    {/* Start time and location */}
                    <View style={styles.flightCardTimeSection}>
                      <Text style={styles.flightCardTime}>{item.startTime}</Text>
                      <Text style={styles.flightCardCode}>
                        {item.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 3).toUpperCase()}
                      </Text>
                      <Text style={styles.flightCardLocation}>{item.name}</Text>
                    </View>

                    {/* Center with plane and route */}
                    <View style={styles.flightCardCenter}>
                      <View style={styles.flightCardRoute}>
                        <View style={styles.flightCardDots} />
                        <View style={styles.flightCardDots} />
                        <View style={styles.flightCardDots} />
                        <Plane size={16} color="#FFFFFF" style={styles.flightCardPlane} />
                        <View style={styles.flightCardDots} />
                        <View style={styles.flightCardDots} />
                        <View style={styles.flightCardDots} />
                      </View>
                    </View>

                    {/* End time and location */}
                    <View style={[styles.flightCardTimeSection, { alignItems: 'flex-end' }]}>
                      <Text style={styles.flightCardTime}>{item.endTime}</Text>
                      <Text style={styles.flightCardCode}>BLR</Text>
                      <Text style={styles.flightCardLocation}>Bangalore, India</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoverList}
          />
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
