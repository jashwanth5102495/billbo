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
import { ArrowLeft, Upload, Plus, Play } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function PlayAdScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#111827' : '#F9FAFB',
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
    uploadSection: {
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
    uploadTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    uploadSubtitle: {
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
      backgroundColor: '#000000',
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
    createAdSection: {
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
    createAdTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 12,
    },
    createAdText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      lineHeight: 20,
      marginBottom: 20,
    },
    createAdButton: {
      backgroundColor: '#10B981',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
    createAdButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      marginLeft: 8,
    },
    continueButton: {
      backgroundColor: '#000000',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
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

  const handleCreateAd = () => {
    router.push('/play-ad/create');
  };

  const handleContinue = () => {
    if (selectedMedia) {
      router.push({
        pathname: '/play-ad/booking',
        params: {
          videoUri: selectedMedia.uri
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Play Your Ad</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.uploadSection}>
          <Text style={styles.uploadTitle}>Upload Your Ad</Text>
          <Text style={styles.uploadSubtitle}>
            Upload your video or image advertisement to display on digital billboards.
          </Text>

          <View style={styles.uploadArea}>
            <Upload size={48} color={isDark ? '#6B7280' : '#9CA3AF'} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>
              {selectedMedia ? 'Media Selected!' : 'Drop your files here'}
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

        <View style={styles.createAdSection}>
          <Text style={styles.createAdTitle}>Need Help Creating an Ad?</Text>
          <Text style={styles.createAdText}>
            You don&apos;t have an Ad to play? Don&apos;t worry! We can create advertisements for you. 
            Our creative team will design a professional ad for your business.
          </Text>
          <TouchableOpacity style={styles.createAdButton} onPress={handleCreateAd}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.createAdButtonText}>Create Ad</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={!selectedMedia}
        >
          <Text style={styles.continueButtonText}>Continue with Upload</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
