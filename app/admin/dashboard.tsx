import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Plus,
  MapPin,
  Users,
  Package,
  TrendingUp,
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react-native';
import { locationService, Location, Order } from '../../services/locationService';

export default function AdminDashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState<'overview' | 'locations' | 'orders'>('overview');
  const [locations, setLocations] = useState<Location[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [locationsData, ordersData] = await Promise.all([
        locationService.getLocations(),
        locationService.getOrders(),
      ]);
      setLocations(locationsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDeleteLocation = (locationId: number) => {
    Alert.alert(
      'Delete Location',
      'Are you sure you want to delete this location? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await locationService.deleteLocation(locationId);
              loadData();
              Alert.alert('Success', 'Location deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete location');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout from admin dashboard?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => router.push('/(tabs)/'),
        },
      ]
    );
  };

  const getOrderStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return '#10B981';
      case 'completed':
        return '#3B82F6';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#F59E0B';
    }
  };

  const renderOverview = () => {
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.price, 0);
    
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;

    return (
      <ScrollView
        style={styles.tabContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <MapPin size={24} color="#3B82F6" />
            <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {locations.length}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Total Locations
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Package size={24} color="#10B981" />
            <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {orders.length}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Total Orders
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <Users size={24} color="#F59E0B" />
            <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              {pendingOrders}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Pending Orders
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
            <TrendingUp size={24} color="#8B5CF6" />
            <Text style={[styles.statNumber, { color: isDark ? '#FFFFFF' : '#111827' }]}>
              ₹{totalRevenue.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Total Revenue
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Recent Orders
          </Text>
          {orders.slice(0, 5).map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={[styles.orderTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {order.type.replace('-', ' ').toUpperCase()}
                </Text>
                <Text style={[styles.orderSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                  {order.customerName} • {order.locationName}
                </Text>
              </View>
              <View style={styles.orderMeta}>
                <Text style={[styles.orderPrice, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  ₹{order.price}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getOrderStatusColor(order.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderLocations = () => (
    <ScrollView
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: '#3B82F6' }]}
        onPress={() => router.push('/admin/add-location')}
      >
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add New Location</Text>
      </TouchableOpacity>

      {locations.map((location) => (
        <View key={location.id} style={[styles.locationCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <View style={styles.locationHeader}>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {location.name}
              </Text>
              <Text style={[styles.locationAddress, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {location.location}
              </Text>
            </View>
            <View style={styles.locationActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                onPress={() => router.push(`/admin/edit-location?id=${location.id}`)}
              >
                <Edit size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                onPress={() => handleDeleteLocation(location.id)}
              >
                <Trash2 size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.locationMeta}>
            <Text style={[styles.locationMetaText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {location.packages.length} packages • Rating: {location.rating} • {location.reviews} reviews
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderOrders = () => (
    <ScrollView
      style={styles.tabContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {orders.map((order) => (
        <View key={order.id} style={[styles.orderCard, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={[styles.orderTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                {order.type.replace('-', ' ').toUpperCase()}
              </Text>
              <Text style={[styles.orderSubtitle, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                Order #{order.id}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getOrderStatusColor(order.status) },
              ]}
            >
              <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.orderDetails}>
            <Text style={[styles.orderDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Customer: {order.customerName}
            </Text>
            <Text style={[styles.orderDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Phone: {order.customerPhone}
            </Text>
            <Text style={[styles.orderDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Location: {order.locationName}
            </Text>
            <Text style={[styles.orderDetailText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              Package: {order.packageName} • {order.packageTime}
            </Text>
            <Text style={[styles.orderPrice, { color: isDark ? '#FFFFFF' : '#111827', marginTop: 8 }]}>
              ₹{order.price}
            </Text>
            <Text style={[styles.orderDate, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {order.createdAt.toLocaleDateString()} {order.createdAt.toLocaleTimeString()}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F8FAFC',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#E5E7EB',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginLeft: 12,
    },
    logoutButton: {
      padding: 8,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#E5E7EB',
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#3B82F6',
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    activeTabText: {
      color: '#3B82F6',
    },
    tabContent: {
      flex: 1,
      padding: 20,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 24,
      gap: 12,
    },
    statCard: {
      width: '48%',
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 8,
    },
    statLabel: {
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
    },
    section: {
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 12,
      marginBottom: 20,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    locationCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    locationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    locationInfo: {
      flex: 1,
    },
    locationName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    locationAddress: {
      fontSize: 14,
      marginTop: 4,
    },
    locationActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
    },
    locationMeta: {
      marginTop: 12,
    },
    locationMetaText: {
      fontSize: 12,
    },
    orderCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    orderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#F3F4F6',
    },
    orderInfo: {
      flex: 1,
    },
    orderTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    orderSubtitle: {
      fontSize: 14,
      marginTop: 2,
    },
    orderMeta: {
      alignItems: 'flex-end',
    },
    orderPrice: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    orderDetails: {
      marginTop: 8,
    },
    orderDetailText: {
      fontSize: 14,
      marginBottom: 4,
    },
    orderDate: {
      fontSize: 12,
      marginTop: 4,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 4,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#111827'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={24} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'locations' && styles.activeTab]}
          onPress={() => setActiveTab('locations')}
        >
          <Text style={[styles.tabText, activeTab === 'locations' && styles.activeTabText]}>
            Locations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'locations' && renderLocations()}
      {activeTab === 'orders' && renderOrders()}
    </SafeAreaView>
  );
}