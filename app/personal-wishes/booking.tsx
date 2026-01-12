import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Star, Info, X, Users, Eye, TrendingUp, Heart } from 'lucide-react-native';
import { useTheme } from '../(tabs)/ThemeContext';
import { locationService, Location } from '../../services/locationService';



export default function PersonalWishesBookingScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [infoLocation, setInfoLocation] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      const locationData = await locationService.getLocations();
      setLocations(locationData);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#111827' : '#F9FAFB',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 16,
      marginTop: 8,
    },
    categoryBanner: {
      backgroundColor: '#FF6B6B',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    categoryText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 12,
    },
    locationCard: {
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: 'hidden',
    },
    selectedLocationCard: {
      borderWidth: 2,
      borderColor: '#FF6B6B',
    },
    locationImage: {
      width: '100%',
      height: 120,
    },
    locationInfo: {
      padding: 16,
    },
    locationName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    locationDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    locationText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginLeft: 4,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    rating: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginLeft: 4,
    },
    reviews: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginLeft: 4,
    },
    priceText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FF6B6B',
    },
    infoButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      width: '100%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    infoIcon: {
      marginRight: 12,
    },
    infoText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#111827',
      flex: 1,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginBottom: 4,
    },
    packageCard: {
      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedPackage: {
      borderColor: '#FF6B6B',
      backgroundColor: isDarkMode ? '#7F1D1D' : '#FEE2E2',
    },
    packageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    packageName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    packageType: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    basicType: {
      backgroundColor: '#6B7280',
    },
    standardType: {
      backgroundColor: '#F59E0B',
    },
    premiumType: {
      backgroundColor: '#EF4444',
    },
    packageDetails: {
      marginBottom: 8,
    },
    packageTime: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    packageDuration: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginBottom: 4,
    },
    packageDescription: {
      fontSize: 13,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginBottom: 8,
    },
    packagePrice: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FF6B6B',
      textAlign: 'right',
    },
    continueButton: {
      backgroundColor: '#FF6B6B',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginTop: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
  });

  const handleLocationSelect = (location) => {
    // Navigate to Book Slot Screen directly, bypassing packages
    router.push({
      pathname: '/book-slot',
      params: {
        billboardId: location.id,
        date: params.date,
        mediaUri: params.mediaUri,
        isPersonalWish: 'true',
      }
    });
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleInfoPress = (location) => {
    setInfoLocation(location);
    setShowInfoModal(true);
  };

  const getPackageTypeStyle = (type) => {
    switch (type) {
      case 'basic':
        return styles.basicType;
      case 'standard':
        return styles.standardType;
      case 'premium':
        return styles.premiumType;
      default:
        return styles.basicType;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={isDarkMode ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Location</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {params.category && (
          <View style={styles.categoryBanner}>
            <Heart size={20} color="#FFFFFF" />
            <Text style={styles.categoryText}>{params.category}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Available Locations</Text>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading locations...</Text>
          </View>
        ) : locations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No locations available</Text>
            <Text style={styles.emptySubText}>Please contact admin to add locations</Text>
          </View>
        ) : (
          locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.locationCard,
              selectedLocation?.id === location.id && styles.selectedLocationCard
            ]}
            onPress={() => handleLocationSelect(location)}
          >
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: location.image }} style={styles.locationImage} />
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => handleInfoPress(location)}
              >
                <Info size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationName}>{location.name}</Text>
              <View style={styles.locationDetails}>
                <MapPin size={14} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <Text style={styles.locationText}>{location.location}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Star size={14} color="#FCD34D" fill="#FCD34D" />
                <Text style={styles.rating}>{location.rating}</Text>
                <Text style={styles.reviews}>({location.reviews} reviews)</Text>
              </View>
              <Text style={styles.priceText}>Starting from ₹{Math.min(...location.packages.map(p => p.price))}/wish</Text>
            </View>
          </TouchableOpacity>
          ))
        )}

        {/* Info Modal */}
        <Modal
          visible={showInfoModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Location Details</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowInfoModal(false)}
                >
                  <X size={16} color={isDarkMode ? '#FFFFFF' : '#111827'} />
                </TouchableOpacity>
              </View>

              {infoLocation && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.infoRow}>
                    <Users size={20} color="#FF6B6B" style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Daily Footfall</Text>
                      <Text style={styles.infoText}>{infoLocation.dailyFootfall} people pass daily</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <TrendingUp size={20} color="#F59E0B" style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Peak Hours</Text>
                      <Text style={styles.infoText}>{infoLocation.peakHours}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Eye size={20} color="#8B5CF6" style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Visibility</Text>
                      <Text style={styles.infoText}>{infoLocation.visibility}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Users size={20} color="#EF4444" style={styles.infoIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Target Demographics</Text>
                      <Text style={styles.infoText}>{infoLocation.demographics}</Text>
                    </View>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>

        {/* Package Selection Modal */}
        <Modal
          visible={showPackageModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPackageModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Wish Package</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPackageModal(false)}
                >
                  <X size={16} color={isDarkMode ? '#FFFFFF' : '#111827'} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {selectedLocation?.packages.map((pkg) => (
                  <TouchableOpacity
                    key={pkg.id}
                    style={[
                      styles.packageCard,
                      selectedPackage?.id === pkg.id && styles.selectedPackage
                    ]}
                    onPress={() => handlePackageSelect(pkg)}
                  >
                    <View style={styles.packageHeader}>
                      <Text style={styles.packageName}>{pkg.name}</Text>
                      <Text style={[styles.packageType, getPackageTypeStyle(pkg.type)]}>
                        {pkg.type.toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.packageDetails}>
                      <Text style={styles.packageTime}>{pkg.time}</Text>
                      <Text style={styles.packageDuration}>Duration: {pkg.duration}</Text>
                      <Text style={styles.packageDescription}>{pkg.description}</Text>
                    </View>
                    <Text style={styles.packagePrice}>₹{pkg.price}</Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[
                    styles.continueButton, 
                    { marginTop: 16, opacity: selectedPackage ? 1 : 0.5 }
                  ]}
                  onPress={() => {
                    if (selectedPackage && selectedLocation) {
                      setShowPackageModal(false);
                      router.push({
                        pathname: '/personal-wishes/details',
                        params: {
                          locationId: selectedLocation.id,
                          locationName: selectedLocation.name,
                          packageId: selectedPackage.id,
                          packageName: selectedPackage.name,
                          packageTime: selectedPackage.time,
                          packageDuration: selectedPackage.duration,
                          price: selectedPackage.price,
                          category: params.category || 'Personal Wish',
                          mediaUri: params.mediaUri,
                        }
                      });
                    }
                  }}
                  disabled={!selectedPackage}
                >
                  <Text style={styles.continueButtonText}>Proceed</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}