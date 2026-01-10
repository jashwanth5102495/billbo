import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin, Star } from 'lucide-react-native';
import { useTheme } from './ThemeContext';

export default function BookingsScreen() {
  const { isDarkMode } = useTheme();

  const bookings = [
    {
      id: 1,
      title: 'Play your Ad',
      location: 'Times Square Billboard',
      date: '2025-02-15',
      time: '2:30 PM',
      status: 'Active',
      price: '₹3000',
    },
    {
      id: 2,
      title: 'Personal Wishes',
      location: 'Mall Road Digital Screen',
      date: '2025-02-10',
      time: '4:45 PM',
      status: 'Completed',
      price: '₹299',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#F8FAFC',
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    bookingCard: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    bookingTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    bookingDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    bookingDetailText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginLeft: 8,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    statusActive: {
      backgroundColor: '#10B981',
    },
    statusCompleted: {
      backgroundColor: '#6B7280',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    priceText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FF6B6B',
      textAlign: 'right',
      marginTop: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {bookings.map((booking) => (
          <TouchableOpacity key={booking.id} style={styles.bookingCard}>
            <Text style={styles.bookingTitle}>{booking.title}</Text>
            
            <View style={styles.bookingDetail}>
              <MapPin size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Text style={styles.bookingDetailText}>{booking.location}</Text>
            </View>
            
            <View style={styles.bookingDetail}>
              <Calendar size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Text style={styles.bookingDetailText}>{booking.date}</Text>
            </View>
            
            <View style={styles.bookingDetail}>
              <Clock size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <Text style={styles.bookingDetailText}>{booking.time}</Text>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={[
                styles.statusBadge,
                booking.status === 'Active' ? styles.statusActive : styles.statusCompleted
              ]}>
                <Text style={styles.statusText}>{booking.status}</Text>
              </View>
              <Text style={styles.priceText}>{booking.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}