import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Calendar, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { useTheme } from './ThemeContext';
import { useBookings } from './BookingContext';

export default function HistoryScreen() {
  const { isDarkMode } = useTheme();
  const { bookings, refreshBookings, loading } = useBookings();
  const [refreshing, setRefreshing] = useState(false);

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
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 20,
    },
    historyCard: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      flex: 1,
      marginRight: 12,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    completedBadge: {
      backgroundColor: '#10B981',
    },
    cancelledBadge: {
      backgroundColor: '#EF4444',
    },
    pendingBadge: {
      backgroundColor: '#F59E0B',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 4,
    },
    cardDetails: {
      gap: 8,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginLeft: 8,
    },
    priceText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#10B981',
      marginTop: 8,
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshBookings();
    setRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'completed':
      case 'Approved':
      case 'Approved & Scheduled':
        return (
          <View style={[styles.statusBadge, styles.completedBadge]}>
            <CheckCircle size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        );
      case 'Rejected':
      case 'cancelled':
        return (
          <View style={[styles.statusBadge, styles.cancelledBadge]}>
            <XCircle size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <AlertCircle size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>{status}</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>History</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading && !refreshing ? (
          <View style={[styles.emptyState, { justifyContent: 'center' }]}>
            <ActivityIndicator size="large" color="#9333EA" />
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={64} color={isDarkMode ? '#6B7280' : '#9CA3AF'} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptyText}>
              Your booking history and activity will appear here once you start using the app.
            </Text>
          </View>
        ) : (
          bookings.map((item, index) => (
            <View key={item.id || index} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {getStatusBadge(item.status)}
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <Text style={styles.detailText}>{item.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Calendar size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <Text style={styles.detailText}>{item.dateRange}</Text>
                </View>
              </View>
              <Text style={styles.priceText}>{item.amount}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}