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
import { ArrowLeft, Upload, Plus, Heart, Gift, Calendar, Users, Video, MessageSquare } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../(tabs)/ThemeContext';

const publicWishCategories = [
  {
    id: 1,
    title: 'Birthday Video Wishes',
    subtitle: 'Public can record birthday wishes for display',
    icon: Gift,
    color: '#FF6B6B',
    route: '/public-wishes/birthday'
  },
  {
    id: 2,
    title: 'Wedding Invitations',
    subtitle: 'Share wedding invitations with the community',
    icon: Heart,
    color: '#FF69B4',
    route: '/public-wishes/wedding'
  },
  {
    id: 3,
    title: 'Anniversary Messages',
    subtitle: 'Community anniversary celebrations',
    icon: Calendar,
    color: '#9B59B6',
    route: '/public-wishes/anniversary'
  },
  {
    id: 4,
    title: 'Community Events',
    subtitle: 'Public event invitations and announcements',
    icon: Users,
    color: '#3498DB',
    route: '/public-wishes/community'
  },
  {
    id: 5,
    title: 'Video Messages',
    subtitle: 'Let public record video messages for loved ones',
    icon: Video,
    color: '#E74C3C',
    route: '/public-wishes/video-messages'
  },
  {
    id: 6,
    title: 'Open Invitations',
    subtitle: 'Public invitations for events and gatherings',
    icon: MessageSquare,
    color: '#F39C12',
    route: '/public-wishes/open-invitations'
  },
];

export default function PublicWishesScreen() {
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
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    heroSection: {
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
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
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    heroSubtitle: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 20,
      lineHeight: 20,
    },
    uploadArea: {
      borderWidth: 2,
      borderColor: isDark ? '#374151' : '#E5E7EB',
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
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    uploadHint: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    uploadButton: {
      backgroundColor: '#E74C3C',
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
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 16,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '48%',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
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
      color: isDark ? '#FFFFFF' : '#111827',
      textAlign: 'center',
      marginBottom: 4,
    },
    categorySubtitle: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 16,
    },
    continueButton: {
      backgroundColor: '#E74C3C',
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
    publicFeature: {
      backgroundColor: '#E74C3C',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    publicFeatureText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 12,
      flex: 1,
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
        pathname: '/public-wishes/booking',
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
        pathname: '/public-wishes/booking',
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
          <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Public Video Wishes</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.publicFeature}>
          <Video size={24} color="#FFFFFF" />
          <Text style={styles.publicFeatureText}>
            Enable public to record and display video wishes for their loved ones!
          </Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Community Video Wishes & Invitations</Text>
          <Text style={styles.heroSubtitle}>
            Set up interactive billboards where the public can record video messages, birthday wishes, wedding invitations, and special announcements to display on digital screens for everyone to see.
          </Text>

          <View style={styles.uploadArea}>
            <Upload size={48} color={isDark ? '#6B7280' : '#9CA3AF'} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>
              {selectedMedia ? 'Template Selected!' : 'Upload invitation template'}
            </Text>
            <Text style={styles.uploadHint}>
              Upload a template or background for public recordings • JPG, PNG, MP4 • Max size 50MB
            </Text>
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadMedia}>
            <Upload size={16} color="#FFFFFF" />
            <Text style={styles.uploadButtonText}>Browse Template</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Choose Public Wish Type</Text>
        <View style={styles.categoryGrid}>
          {publicWishCategories.map((category) => {
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
          <Text style={styles.continueButtonText}>Setup Public Billboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}