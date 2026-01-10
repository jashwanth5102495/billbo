import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { RefreshCw, MapPin, Star, Info, X, Navigation, Map } from 'lucide-react-native';
import { useTheme } from './ThemeContext';
import { BillboardMarker } from '../../components/BillboardMarker';
import { locationService, Location } from '../../services/locationService';

// Type definitions
interface BillboardPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
}

interface BillboardLocation {
  id: string;
  name: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
  rating: number;
  reviews: number;
  dailyFootfall: string;
  peakHours: string;
  visibility: string;
  demographics: string;
  interactiveFeatures: string;
  packages: BillboardPackage[];
  image: string;
  isBlinking: boolean;
  isAvailable: boolean;
}




export default function MapsScreen() {
  const { isDarkMode } = useTheme();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoLocation, setInfoLocation] = useState<Location | null>(null);
  const [blinkingStates, setBlinkingStates] = useState<Record<string, boolean>>({});

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

  // Blinking animation effect
  useEffect(() => {
    if (locations.length === 0) return;
    
    const interval = setInterval(() => {
      setBlinkingStates(prev => {
        const newStates: Record<string, boolean> = {};
        locations.forEach(location => {
          // Assume all locations can blink for visual effect
          newStates[location.id] = !prev[location.id];
        });
        return newStates;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [locations]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    
    // All locations from locationService are considered available

    Alert.alert(
      'Book Billboard',
      `Would you like to book the ${location.name} billboard?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => {
            // Navigate to booking screen
            Alert.alert('Booking', 'Redirecting to booking screen...');
          }
        }
      ]
    );
  };

  const handleInfoPress = (location: Location) => {
    setInfoLocation(location);
    setShowInfoModal(true);
  };

  const handleRefresh = () => {
    Alert.alert('Refresh', 'Refreshing billboard locations...');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#F8F9FA',
    },
    header: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#404040' : '#E5E7EB',
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginTop: 4,
    },
    refreshButton: {
      backgroundColor: isDarkMode ? '#404040' : '#F3F4F6',
      padding: 12,
      borderRadius: 12,
    },
    mapContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
      margin: 20,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    mapPlaceholder: {
      flex: 1,
      backgroundColor: isDarkMode ? '#404040' : '#F3F4F6',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    mapText: {
      fontSize: 18,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginBottom: 20,
    },
    mapPreview: {
      width: '100%',
      height: 200,
      backgroundColor: isDarkMode ? '#333333' : '#E5E7EB',
      borderRadius: 12,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationList: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    locationCard: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    selectedLocationCard: {
      borderWidth: 2,
      borderColor: '#10B981',
    },
    locationImage: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
    },
    infoButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 8,
      borderRadius: 20,
    },
    locationInfo: {
      padding: 16,
    },
    locationName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 8,
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
    interactiveFeatures: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginBottom: 8,
    },
    priceText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#10B981',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      maxHeight: '80%',
      width: '100%',
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
      padding: 8,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    infoIcon: {
      marginRight: 12,
    },
    infoLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    infoText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
    },
  });

  const getMapHtml = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background-color: ${isDarkMode ? '#2A2A2A' : '#FFFFFF'}; }
        #map { width: 100%; height: 100vh; }
        .leaflet-popup-content-wrapper { border-radius: 8px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([12.9716, 77.5946], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        var locations = ${JSON.stringify(locations)};
        
        locations.forEach(function(loc) {
          if (loc.coordinates) {
            var marker = L.marker([loc.coordinates.latitude, loc.coordinates.longitude]).addTo(map);
            marker.bindPopup("<b>" + loc.name + "</b><br>" + loc.location);
            marker.on('click', function() {
               if (window.ReactNativeWebView) {
                 window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'select', id: loc.id }));
               } else {
                 window.parent.postMessage(JSON.stringify({ type: 'select', id: loc.id }), '*');
               }
            });
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerText}>Billboard Map</Text>
            <Text style={styles.subtitle}>{locations.length} billboards in Bengaluru</Text>
          </View>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <RefreshCw size={20} color={isDarkMode ? '#FFFFFF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={getMapHtml()}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Billboard Map"
          />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: getMapHtml() }}
            style={{ flex: 1 }}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'select') {
                  const location = locations.find(l => l.id === data.id);
                  if (location) handleLocationSelect(location);
                }
              } catch (e) {}
            }}
          />
        )}
      </View>

      {/* Location List */}
      <ScrollView style={styles.locationList} showsVerticalScrollIndicator={false}>
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.locationCard,
              selectedLocation?.id === location.id && styles.selectedLocationCard
            ]}
            onPress={() => handleLocationSelect(location)}
          >
            <View style={{ position: 'relative' }}>
              <View style={{ 
                position: 'absolute', 
                top: 12, 
                left: 12, 
                zIndex: 1 
              }}>
                <BillboardMarker isBlinking={blinkingStates[location.id]} />
              </View>
              <View style={styles.locationImage} />
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
              <Text style={styles.interactiveFeatures}>{location.interactiveFeatures || 'Standard billboard features'}</Text>
              <Text style={styles.priceText}>Starting from ₹{Math.min(...location.packages.map(p => p.price))}/setup</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Info Modal */}
      {showInfoModal && infoLocation && (
        <Modal
          visible={showInfoModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowInfoModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Billboard Details</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowInfoModal(false)}
                >
                  <X size={16} color={isDarkMode ? '#FFFFFF' : '#111827'} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.infoRow}>
                  <MapPin size={20} color="#E74C3C" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Daily Footfall</Text>
                    <Text style={styles.infoText}>{infoLocation.dailyFootfall} people pass daily</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <MapPin size={20} color="#F59E0B" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Peak Hours</Text>
                    <Text style={styles.infoText}>{infoLocation.peakHours}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <MapPin size={20} color="#8B5CF6" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Visibility</Text>
                    <Text style={styles.infoText}>{infoLocation.visibility}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <MapPin size={20} color="#10B981" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Target Demographics</Text>
                    <Text style={styles.infoText}>{infoLocation.demographics}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <MapPin size={20} color="#E74C3C" style={styles.infoIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoLabel}>Interactive Features</Text>
                    <Text style={styles.infoText}>{infoLocation.interactiveFeatures}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#10B981',
                    paddingVertical: 12,
                    borderRadius: 12,
                    marginTop: 20,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setShowInfoModal(false);
                    handleLocationSelect(infoLocation);
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                    Book This Billboard
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
