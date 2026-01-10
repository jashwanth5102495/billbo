import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Upload, Plus, Heart, Gift, Calendar, Users } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../(tabs)/ThemeContext';

const wishCategories = [
  {
    id: 1,
    title: 'Birthday Wishes',
    subtitle: 'Celebrate birthdays on the big screen',
    icon: Gift,
    color: '#FF6B6B',
    route: '/personal-wishes/birthday'
  },
  {
    id: 2,
    title: 'Wedding Invitations',
    subtitle: 'Share your special day with everyone',
    icon: Heart,
    color: '#FF69B4',
    route: '/personal-wishes/wedding'
  },
  {
    id: 3,
    title: 'Anniversary Celebrations',
    subtitle: 'Mark milestone moments together',
    icon: Calendar,
    color: '#9B59B6',
    route: '/personal-wishes/anniversary'
  },
  {
    id: 4,
    title: 'Family Reunions',
    subtitle: 'Bring families together on screen',
    icon: Users,
    color: '#3498DB',
    route: '/personal-wishes/family'
  },
];

export default function PersonalWishesScreen() {
  const { isDarkMode } = useTheme();
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

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
    heroSection: {
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    heroSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      marginBottom: 20,
      lineHeight: 20,
    },
    uploadArea: {
      borderWidth: 2,
      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
      borderStyle: 'dashed',
      borderRadius: 12,
      padding: 40,
      alignItems: 'center',
      marginBottom: 20,
    },
    uploadIcon: {
      marginBottom: 12,
    },
    uploadText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    uploadHint: {
      fontSize: 12,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    uploadButton: {
      backgroundColor: '#FF6B6B',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
    uploadButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      marginLeft: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 16,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '48%',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      alignItems: 'center',
    },
    categoryIcon: {
      marginBottom: 12,
    },
    categoryTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      textAlign: 'center',
      marginBottom: 4,
    },
    categorySubtitle: {
      fontSize: 12,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 16,
    },
    continueButton: {
      backgroundColor: '#FF6B6B',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
      opacity: selectedMedia ? 1 : 0.5,
    },
    continueButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleUploadMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your media library to upload content.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets[0].uri);
    }
  };

  const handleCategorySelect = (category) => {
    if (selectedMedia) {
      router.push({
        pathname: '/personal-wishes/booking',
        params: {
          category: category.title,
          mediaUri: selectedMedia,
        }
      });
    } else {
      Alert.alert('Upload Required', 'Please upload your video or image first.');
    }
  };

  const handleContinue = () => {
    if (selectedMedia) {
      router.push({
        pathname: '/personal-wishes/booking',
        params: {
          mediaUri: selectedMedia,
        }
      });
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
        <Text style={styles.headerTitle}>Personal Wishes</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Share Your Special Moments</Text>
          <Text style={styles.heroSubtitle}>
            Upload your video or image to display personal wishes, invitations, and celebrations on digital billboards for everyone to see.
          </Text>

          <View style={styles.uploadArea}>
            <Upload size={48} color={isDarkMode ? '#6B7280' : '#9CA3AF'} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>
              {selectedMedia ? 'Media Selected!' : 'Upload your wish'}
            </Text>
            <Text style={styles.uploadHint}>
              Supports JPG, PNG, MP4 • Max size 50MB
            </Text>
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadMedia}>
            <Upload size={16} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Browse Files</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Choose Your Occasion</Text>
        <View style={styles.categoryGrid}>
          {wishCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategorySelect(category)}
                activeOpacity={0.8}
              >
                <IconComponent 
                  size={32} 
                  color={category.color} 
                  style={styles.categoryIcon} 
                />
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={!selectedMedia}
        >
          <Text style={styles.continueButtonText}>Continue to Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}