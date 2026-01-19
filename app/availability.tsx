import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from './(tabs)/ThemeContext';

interface Billboard {
  _id: string;
  name: string;
  location: string;
  image: string;
  type: 'Digital' | 'Static';
  price?: number;
  slotPricing?: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
  dimensions?: string;
}

export default function AvailabilityScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const date = params.date ? new Date(params.date as string) : null;
  
  const API_ROOT = Platform.OS === 'android' 
    ? 'http://10.0.2.2:3000' 
    : 'http://localhost:3000';
  
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillboards();
  }, []);

  const fetchBillboards = async () => {
    try {
      const response = await fetch(`${API_ROOT}/api/billboards`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setBillboards(data);
      } else {
        console.error('Invalid data format:', data);
        Alert.alert('Error', 'Failed to load billboards');
      }
    } catch (error) {
      console.error('Error fetching billboards:', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#111' : '#F8FAFC',
      paddingTop: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
      marginHorizontal: 20,
      marginBottom: 20,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: isDarkMode ? '#18181b' : '#fff',
      borderRadius: 20,
      marginHorizontal: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      overflow: 'hidden',
      padding: 12,
      alignItems: 'center',
    },
    slotImage: {
      width: 80,
      height: 80,
      borderRadius: 12,
      marginRight: 16,
      backgroundColor: '#ccc',
    },
    slotContent: {
      flex: 1,
    },
    slotTitle: {
      color: isDarkMode ? '#fff' : '#222',
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
    },
    slotLocation: {
      color: isDarkMode ? '#d1d5db' : '#6B7280',
      fontSize: 14,
      marginBottom: 4,
    },
    slotPrice: {
      color: isDarkMode ? '#fff' : '#222',
      fontWeight: 'bold',
      fontSize: 14,
      marginTop: 4,
    },
    badge: {
      backgroundColor: '#2563eb',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      alignSelf: 'flex-start',
      marginBottom: 4,
    },
    badgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    bookButton: {
      backgroundColor: isDarkMode ? '#333' : '#eee',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginTop: 8,
      alignItems: 'center',
    },
    bookButtonText: {
      color: isDarkMode ? '#fff' : '#333',
      fontWeight: 'bold',
      fontSize: 12,
    }
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>
        Available Locations for {date ? date.toLocaleDateString() : 'selected date'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} style={{ marginTop: 20 }} />
      ) : billboards.length === 0 ? (
        <Text style={{ textAlign: 'center', color: isDarkMode ? '#aaa' : '#666', marginTop: 20 }}>
          No billboards found.
        </Text>
      ) : (
        billboards.map(billboard => {
          const imageUri = billboard.image
            ? (billboard.image.startsWith('http') ? billboard.image : `${API_ROOT}${billboard.image}`)
            : 'https://via.placeholder.com/150';

          return (
            <TouchableOpacity 
              key={billboard._id} 
              style={styles.card}
              activeOpacity={0.7}
              onPress={() => router.push({ 
                pathname: '/book-slot', 
                params: { 
                  billboardId: billboard._id,
                  date: date?.toISOString()
                } 
              })}
            >
              <Image 
                source={{ uri: imageUri }} 
                style={styles.slotImage} 
              />
              <View style={styles.slotContent}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{billboard.type}</Text>
                </View>
                <Text style={styles.slotTitle}>{billboard.name}</Text>
                <Text style={styles.slotLocation}>{billboard.location}</Text>
                <Text style={styles.slotPrice}>
                  {billboard.type === 'Static' 
                    ? `₹${billboard.price}/day` 
                    : 'View Packages'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
} 
