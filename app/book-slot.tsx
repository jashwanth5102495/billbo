import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ShoppingCart, Clock, Info, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { useTheme } from './(tabs)/ThemeContext';
import { CartContext } from './(tabs)/cart-context';

export default function BookSlotScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const { billboardId, date } = params;
  const { addToCart, cart } = React.useContext(CartContext);

  const [billboard, setBillboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [slotUsage, setSlotUsage] = useState<any>({});

  useEffect(() => {
    if (billboardId) {
      fetchBillboardDetails();
      fetchAvailability();
    }
  }, [billboardId, date]);

  const fetchAvailability = async () => {
    try {
      const API_URL = Platform.OS === 'android' 
        ? 'http://10.0.2.2:3000/api' 
        : 'http://localhost:3000/api';

      const response = await fetch(`${API_URL}/bookings/check-availability?billboardId=${billboardId}&date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        setBookedSlots(data.bookings);
        if (data.slotUsage) {
            setSlotUsage(data.slotUsage);
        }
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const fetchBillboardDetails = async () => {
    try {
      const API_URL = Platform.OS === 'android' 
        ? 'http://10.0.2.2:3000/api' 
        : 'http://localhost:3000/api';

      const response = await fetch(`${API_URL}/billboards/${billboardId}`);
      const data = await response.json();
      
      if (response.ok) {
        setBillboard(data);
      } else {
        Alert.alert('Error', 'Failed to load billboard details');
      }
    } catch (error) {
      console.error('Error fetching billboard:', error);
      Alert.alert('Error', 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const isSlotBooked = (slotId: string, type: string) => {
    if (type === 'Static') {
        return bookedSlots.length > 0;
    }

    const timeMap: Record<string, { start: string, end: string }> = {
        'morning': { start: '06:00', end: '12:00' },
        'afternoon': { start: '12:00', end: '17:00' },
        'evening': { start: '17:00', end: '21:00' },
        'night': { start: '21:00', end: '06:00' }
    };

    const slotTime = timeMap[slotId];
    if (!slotTime) return false;

    return bookedSlots.some(booking => {
        return booking.startTime === slotTime.start; 
    });
  };

  const getPackages = () => {
    if (!billboard) return [];

    if (billboard.type === 'Static') {
      const isBooked = isSlotBooked('daily', 'Static');
      return [{
        id: 'daily',
        name: 'Daily Booking',
        time: 'Full Day (24 Hours)',
        price: billboard.price, // Keep as number for calculation
        desc: 'Exclusive full day access for maximum visibility.',
        type: 'Static',
        isBooked
      }];
    }

    const slots = [];
    const pricing = billboard.slotPricing || {};

    if (pricing.morning) {
      slots.push({
        id: 'morning',
        name: 'Morning Slot',
        time: '6:00 AM - 12:00 PM',
        price: pricing.morning,
        desc: 'Prime morning hours, high traffic visibility.',
        type: 'Digital',
        isBooked: isSlotBooked('morning', 'Digital')
      });
    }
    if (pricing.afternoon) {
      slots.push({
        id: 'afternoon',
        name: 'Afternoon Slot',
        time: '12:00 PM - 6:00 PM',
        price: pricing.afternoon,
        desc: 'Midday exposure, steady audience.',
        type: 'Digital',
        isBooked: isSlotBooked('afternoon', 'Digital')
      });
    }
    if (pricing.evening) {
      slots.push({
        id: 'evening',
        name: 'Evening Slot',
        time: '6:00 PM - 12:00 AM',
        price: pricing.evening,
        desc: 'Peak evening rush, maximum engagement.',
        type: 'Digital',
        isBooked: isSlotBooked('evening', 'Digital')
      });
    }
    if (pricing.night) {
      slots.push({
        id: 'night',
        name: 'Night Slot',
        time: '12:00 AM - 6:00 AM',
        price: pricing.night,
        desc: 'Night time visibility, cost effective.',
        type: 'Digital',
        isBooked: isSlotBooked('night', 'Digital')
      });
    }

    return slots;
  };

  const toggleSlot = (pkg: any) => {
    if (pkg.isBooked) return;
    if (selectedSlots.includes(pkg.id)) {
      setSelectedSlots(selectedSlots.filter(id => id !== pkg.id));
    } else {
      setSelectedSlots([...selectedSlots, pkg.id]);
    }
  };

  const handleCalculatePrice = () => {
    if (selectedSlots.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one slot to calculate price.');
      return;
    }

    const packages = getPackages();
    const selectedPackages = packages.filter(p => selectedSlots.includes(p.id));
    
    // Calculate Base Price (Sum of selected slots)
    // This assumes the admin set price is the base price for standard repetition (e.g. 40)
    const basePriceTotal = selectedPackages.reduce((sum, pkg) => sum + (pkg.price || 0), 0);
    // const selectedSlotNames = selectedPackages.map(p => p.name);

    router.push({
      pathname: '/calculate-price',
      params: {
        basePrice: basePriceTotal.toString(),
        billboardName: billboard?.name || 'Billboard',
        selectedPackages: JSON.stringify(selectedPackages),
        billboardId: billboardId,
        date: date
      }
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#111' : '#F8FAFC',
      paddingTop: 32,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
      flex: 1,
    },
    subtitle: {
        fontSize: 14,
        color: isDarkMode ? '#aaa' : '#666',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    cartButton: {
      padding: 8,
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: '#EF4444',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    badgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    packageCard: {
      backgroundColor: isDarkMode ? '#18181b' : '#fff',
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedCard: {
      borderColor: '#2563eb',
      backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff',
    },
    disabledCard: {
      opacity: 0.6,
      backgroundColor: isDarkMode ? '#222' : '#f3f4f6',
    },
    packageName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
    },
    packageTime: {
      color: isDarkMode ? '#d1d5db' : '#6B7280',
      marginTop: 2,
      flexDirection: 'row',
      alignItems: 'center',
    },
    packageDesc: {
      color: isDarkMode ? '#bbb' : '#444',
      marginTop: 4,
      marginBottom: 8,
      fontSize: 12,
    },
    calculateButton: {
      backgroundColor: isDarkMode ? '#fff' : '#111',
      margin: 20,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    calculateButtonText: {
      color: isDarkMode ? '#000' : '#fff',
      fontWeight: 'bold',
      fontSize: 18,
    },
    disabledButton: {
      backgroundColor: isDarkMode ? '#333' : '#ccc',
    }
  });

  if (loading) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
          </View>
      );
  }

  if (!billboard) {
      return (
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Billboard not found</Text>
          </View>
      );
  }

  const packages = getPackages();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity 
            style={{ marginRight: 16, padding: 4 }}
            onPress={() => router.push('/(tabs)')}
          >
             <ArrowLeft size={24} color={isDarkMode ? '#fff' : '#222'} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>{billboard.name}</Text>
              <Text style={{ color: isDarkMode ? '#aaa' : '#666', fontSize: 12 }}>{billboard.location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart' as any)}>
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
          <ShoppingCart size={24} color={isDarkMode ? '#fff' : '#222'} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>
          Select slots for {new Date(date as string).toLocaleDateString()}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {packages.length === 0 ? (
            <Text style={{ textAlign: 'center', color: isDarkMode ? '#aaa' : '#666', marginTop: 20 }}>
                No packages available for this billboard type.
            </Text>
        ) : (
            packages.map((pkg) => {
              const isSelected = selectedSlots.includes(pkg.id);
              return (
                <TouchableOpacity 
                  key={pkg.id} 
                  style={[
                    styles.packageCard,
                    isSelected && styles.selectedCard,
                    pkg.isBooked && styles.disabledCard
                  ]}
                  onPress={() => toggleSlot(pkg)}
                  activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.packageName}>{pkg.name}</Text>
                          {isSelected && <CheckCircle size={16} color="#2563eb" style={{ marginLeft: 8 }} />}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Clock size={14} color={isDarkMode ? '#aaa' : '#666'} style={{ marginRight: 4 }} />
                            <Text style={{ color: isDarkMode ? '#aaa' : '#666' }}>{pkg.time}</Text>
                        </View>
                        <Text style={styles.packageDesc}>{pkg.desc}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        {pkg.isBooked ? (
                          <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Sold Out</Text>
                        ) : null}
                    </View>
                    </View>
                </TouchableOpacity>
              );
            })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Calculate Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 20, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)' }}>
        <TouchableOpacity 
          style={[styles.calculateButton, selectedSlots.length === 0 && styles.disabledButton]}
          onPress={handleCalculatePrice}
          disabled={selectedSlots.length === 0}
        >
          <Text style={styles.calculateButtonText}>Calculate Price</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}