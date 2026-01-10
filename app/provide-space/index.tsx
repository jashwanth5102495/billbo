import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Upload, DollarSign, Type, Ruler } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { billboardService } from '../../services/billboardService';

export default function AddBillboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    formSection: {
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
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#111827',
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#111827' : '#F9FAFB',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      paddingHorizontal: 16,
      height: 56,
    },
    inputContainerMultiline: {
      height: 120,
      alignItems: 'flex-start',
      paddingTop: 16,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
      height: '100%',
    },
    imageUploadSection: {
      marginBottom: 20,
      alignItems: 'center',
    },
    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#9333EA',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      marginBottom: 8,
    },
    uploadButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    previewImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginTop: 16,
    },
    submitButton: {
      backgroundColor: '#9333EA',
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 40,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    disabledButton: {
      opacity: 0.7,
    },
  });

  const handleUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your media library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name || !location || !price || !image) {
      Alert.alert('Missing Information', 'Please fill in all required fields and upload an image.');
      return;
    }

    setIsLoading(true);
    try {
      const imageBase64 = `data:image/jpeg;base64,${image.base64}`;
      
      await billboardService.addBillboard({
        name,
        location,
        price: Number(price),
        description,
        dimensions,
        image: imageBase64,
      });

      Alert.alert(
        'Success',
        'Billboard added successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to add billboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Billboard</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          
          <View style={styles.imageUploadSection}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>
                {image ? 'Change Photo' : 'Upload Billboard Photo'}
              </Text>
            </TouchableOpacity>
            {image && (
              <Image source={{ uri: image.uri }} style={styles.previewImage} resizeMode="cover" />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Billboard Name *</Text>
            <View style={styles.inputContainer}>
              <Type size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. Downtown Digital Screen"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location *</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Address or Location"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price per Day (₹) *</Text>
            <View style={styles.inputContainer}>
              <DollarSign size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 5000"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Dimensions</Text>
            <View style={styles.inputContainer}>
              <Ruler size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 20x10 ft"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={dimensions}
                onChangeText={setDimensions}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={[styles.inputContainer, styles.inputContainerMultiline]}>
              <TextInput
                style={[styles.input, { textAlignVertical: 'top' }]}
                placeholder="Describe your billboard visibility, traffic, etc."
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

        </View>

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Add Billboard</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
