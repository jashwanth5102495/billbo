import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../(tabs)/ThemeContext';
import { LogOut, MapPin, Plus, Calendar } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import { billboardService, Billboard } from '../../services/billboardService';

export default function BillboardOwnerWelcomeScreen() {
  const { isDarkMode } = useTheme();
  const { logout, user } = useAuth();
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBillboards = async () => {
    try {
      setIsLoading(true);
      const data = await billboardService.getMyBillboards();
      console.log('Fetched billboards:', data);
      setBillboards(data);
    } catch (error) {
      console.error('Failed to fetch billboards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBillboards();
    }, [])
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const renderProperty = ({ item }: { item: Billboard }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: '/billboard-owner/bookings',
        params: { 
          billboardId: item._id,
          billboardName: item.name 
        }
      })}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.cardImage} 
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.propertyName} numberOfLines={1}>{item.name}</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'Active' ? styles.statusActive : styles.statusInactive
          ]}>
            <Text style={[
              styles.statusText,
              item.status === 'Active' ? styles.statusTextActive : styles.statusTextInactive
            ]}>{item.status || 'Active'}</Text>
          </View>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>
        
        <Text style={styles.priceText}>₹{item.price} / day</Text>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#F8FAFC',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    subtitle: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    iconButton: {
      padding: 8,
      backgroundColor: isDarkMode ? '#1F2937' : '#E5E7EB',
      borderRadius: 50,
    },
    sectionHeader: {
      marginBottom: 0,
    },
    listContent: {
      paddingHorizontal: 24,
      paddingBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 16,
      paddingHorizontal: 24,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      height: 100,
    },
    cardImage: {
      width: 100,
      height: '100%',
    },
    cardContent: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    propertyName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      flex: 1,
      marginRight: 8,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    locationText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginLeft: 4,
      flex: 1,
    },
    priceText: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: 'bold',
      color: '#9333EA',
    },
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#9333EA',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusActive: {
      backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#D1FAE5',
    },
    statusInactive: {
      backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
    },
    statusText: {
      fontSize: 10,
      fontWeight: '600',
    },
    statusTextActive: {
      color: isDarkMode ? '#34D399' : '#059669',
    },
    statusTextInactive: {
      color: isDarkMode ? '#F87171' : '#DC2626',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>{user?.username || 'Owner'}</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => router.push('/billboard-owner/bookings')}
          >
            <Calendar size={20} color={isDarkMode ? '#FFFFFF' : '#111827'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
            <LogOut size={20} color={isDarkMode ? '#FFFFFF' : '#111827'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Properties</Text>
      </View>

      <FlatList
        data={billboards}
        renderItem={renderProperty}
        keyExtractor={item => item._id || item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
              {isLoading ? 'Loading billboards...' : 'No billboards found'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
