import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useRouter } from 'expo-router';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  LogOut,
  Settings,
  FileText,
  Globe,
  ArrowRight,
  ArrowLeft
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../(tabs)/ThemeContext';

export default function ProfileScreen() {
  const { isDarkMode } = useTheme();
  const { user, businessProfile, logout, refreshProfile, isAuthenticated } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const routerHook = useRouter();

  // Monitor authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Profile: User logged out, should be redirected to login');
      // The main index.tsx should handle this, but as a fallback
      router.replace('/auth/login');
    }
  }, [isAuthenticated]);

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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      flex: 1,
    },
    content: {
      flex: 1,
    },
    profileCard: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#9333EA',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    avatarText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    profilePhone: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
    },
    editButton: {
      padding: 8,
    },
    businessCard: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    infoText: {
      fontSize: 14,
      color: isDarkMode ? '#D1D5DB' : '#374151',
      marginLeft: 12,
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginLeft: 12,
      marginBottom: 2,
    },
    infoValue: {
      fontSize: 14,
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginLeft: 12,
      fontWeight: '500',
    },
    setupButton: {
      backgroundColor: '#9333EA',
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    setupButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginRight: 8,
    },
    menuCard: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#374151' : '#F3F4F6',
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuItemText: {
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginLeft: 12,
      flex: 1,
    },
    logoutItem: {
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#374151' : '#F3F4F6',
    },
    logoutText: {
      color: '#EF4444',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
      marginTop: 16,
    },
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    console.log('🔴 LOGOUT BUTTON PRESSED!');
    
    try {
      console.log('🔴 Logging out user...');
      await logout();
      console.log('🔴 Logout successful, navigating to login...');
      router.replace('/auth/login');
    } catch (error) {
      console.error('🔴 Logout error:', error);
      // Fallback: Clear storage manually and navigate
      try {
        await AsyncStorage.clear();
        router.replace('/auth/login');
      } catch (fallbackError) {
        console.error('🔴 Fallback logout error:', fallbackError);
        // Force navigation even if everything fails
        router.replace('/auth/login');
      }
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color={isDarkMode ? '#FFFFFF' : '#111827'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(businessProfile?.ownerName || user?.name)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {businessProfile?.ownerName || user?.name || 'User'}
              </Text>
              <Text style={styles.profilePhone}>{user?.phoneNumber}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                // TODO: Implement edit profile functionality
                Alert.alert('Coming Soon', 'Edit profile functionality will be available soon.');
              }}
            >
              <Edit3 size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Business Profile Card */}
        {businessProfile ? (
          <View style={styles.businessCard}>
            <Text style={styles.cardTitle}>Business Information</Text>
            
            <View style={styles.infoRow}>
              <Building2 size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Business Name</Text>
                <Text style={styles.infoValue}>{businessProfile.businessName}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Building2 size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Business Type</Text>
                <Text style={styles.infoValue}>{businessProfile.businessType}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <User size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Owner Name</Text>
                <Text style={styles.infoValue}>{businessProfile.ownerName}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Mail size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{businessProfile.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>
                  {businessProfile.address}, {businessProfile.city}, {businessProfile.state} - {businessProfile.pincode}
                </Text>
              </View>
            </View>

            {businessProfile.gstNumber && (
              <View style={styles.infoRow}>
                <FileText size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>GST Number</Text>
                  <Text style={styles.infoValue}>{businessProfile.gstNumber}</Text>
                </View>
              </View>
            )}

            {businessProfile.panNumber && (
              <View style={styles.infoRow}>
                <FileText size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>PAN Number</Text>
                  <Text style={styles.infoValue}>{businessProfile.panNumber}</Text>
                </View>
              </View>
            )}

            {businessProfile.businessDescription && (
              <View style={styles.infoRow}>
                <FileText size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Business Description</Text>
                  <Text style={styles.infoValue}>{businessProfile.businessDescription}</Text>
                </View>
              </View>
            )}

            {businessProfile.website && (
              <View style={styles.infoRow}>
                <Globe size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Website</Text>
                  <Text style={styles.infoValue}>{businessProfile.website}</Text>
                </View>
              </View>
            )}

            {businessProfile.socialMedia && (
              <>
                {businessProfile.socialMedia.facebook && (
                  <View style={styles.infoRow}>
                    <Globe size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Facebook</Text>
                      <Text style={styles.infoValue}>{businessProfile.socialMedia.facebook}</Text>
                    </View>
                  </View>
                )}

                {businessProfile.socialMedia.instagram && (
                  <View style={styles.infoRow}>
                    <Globe size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Instagram</Text>
                      <Text style={styles.infoValue}>{businessProfile.socialMedia.instagram}</Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.setupButton}
            onPress={() => router.push('/auth/business-setup')}
          >
            <Text style={styles.setupButtonText}>Complete Business Profile</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Menu Items */}
        <View style={styles.menuCard}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              // TODO: Implement edit profile functionality
              Alert.alert('Coming Soon', 'Edit profile functionality will be available soon.');
            }}
          >
            <Edit3 size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <ArrowRight size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              // TODO: Implement settings functionality
              Alert.alert('Coming Soon', 'Settings functionality will be available soon.');
            }}
          >
            <Settings size={20} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
            <Text style={styles.menuItemText}>Settings</Text>
            <ArrowRight size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.menuItemLast, styles.logoutItem]}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}