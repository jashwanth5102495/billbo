import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Star, MapPin, Calendar } from 'lucide-react-native';
import { useTheme } from './ThemeContext';

export default function FavoritesScreen() {
  const { isDarkMode } = useTheme();
  const [favorites, setFavorites] = useState([]);
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
    favoriteCard: {
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
    heartButton: {
      padding: 4,
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
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Load favorites from backend
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {favorites.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={64} color={isDarkMode ? '#6B7280' : '#9CA3AF'} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Start exploring and add your favorite billboards and locations to see them here.
            </Text>
          </View>
        ) : (
          favorites.map((favorite, index) => (
            <View key={index} style={styles.favoriteCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{favorite.title}</Text>
                <TouchableOpacity style={styles.heartButton}>
                  <Heart size={20} color="#EF4444" fill="#EF4444" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={16} color={isDarkMode ? '#9CA3AF' : '#6B7280'} />
                  <Text style={styles.detailText}>{favorite.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Star size={16} color="#F59E0B" />
                  <Text style={styles.detailText}>{favorite.rating} rating</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}