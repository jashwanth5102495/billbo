import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { bookingService, Booking } from '../../services/bookingService';

export default function OwnerBookingsScreen() {
  const router = useRouter();
  const { billboardId, billboardName } = useLocalSearchParams<{ billboardId: string, billboardName: string }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [billboardId]);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getOwnerBookings(billboardId);
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusColor = (status: string, moderationStatus?: string) => {
    if (moderationStatus === 'rejected') return '#EF4444';
    if (moderationStatus === 'pending') return '#F59E0B';
    
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'completed': return '#3B82F6';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getDisplayStatus = (item: Booking) => {
    if (item.content?.type === 'video' && item.status !== 'cancelled') {
      if (item.content.moderationStatus === 'rejected') return 'REJECTED';
      if (item.content.moderationStatus === 'pending') return 'AI REVIEW';
      if (item.content.moderationStatus === 'approved' && item.status === 'confirmed') return 'APPROVED';
    }
    return item.status.toUpperCase();
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const displayStatus = getDisplayStatus(item);
    const statusColor = getStatusColor(item.status, item.content?.moderationStatus);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.billboardName}>{item.billboardName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {displayStatus}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.userId?.name || 'Unknown User'}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.userId?.phoneNumber || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.startTime} - {item.endTime}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="wallet-outline" size={16} color="#666" />
            <Text style={styles.detailText}>₹{item.price} • {item.paymentStatus.toUpperCase()}</Text>
          </View>
          
          {item.content && (
            <View style={styles.contentContainer}>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Ad Content</Text>
              <View style={styles.row}>
                <Ionicons 
                  name={item.content.type === 'video' ? "videocam-outline" : "image-outline"} 
                  size={16} 
                  color="#666" 
                />
                <Text style={styles.detailText}>
                  Type: {item.content.type.toUpperCase()}
                </Text>
              </View>
              
              {item.content.url && (
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={() => item.content.url && Linking.openURL(item.content.url)}
                >
                  <Text style={styles.linkText}>View Content</Text>
                  <Ionicons name="open-outline" size={14} color="#4ADE80" />
                </TouchableOpacity>
              )}

              {item.content.moderationStatus && (
                <View style={styles.row}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    AI Status: {item.content.moderationStatus.toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {billboardName ? `${billboardName} Bookings` : 'My Bookings'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4ADE80" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ADE80" />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billboardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  contentContainer: {
    gap: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  linkText: {
    color: '#4ADE80',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
