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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Monitor, Calendar, User, Phone, Upload, MapPin } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE_URL } from '../../config/env';

export default function ConnectScreenScreen() {
  // Force reload
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [brand, setBrand] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleModalClose = () => {
    setShowModal(false);
    if (isSuccess) {
      router.back();
    }
  };

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
    infoCard: {
      backgroundColor: '#10B981',
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
    },
    infoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9,
      lineHeight: 20,
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
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#111827',
      paddingVertical: 16,
    },
    imageUploadSection: {
      marginBottom: 20,
    },
    uploadButton: {
      backgroundColor: '#000000',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    uploadButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      marginLeft: 8,
    },
    imageCount: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    submitButton: {
      backgroundColor: '#10B981',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalContentDark: {
      backgroundColor: '#1F2937',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      color: '#111827',
      textAlign: 'center',
    },
    modalMessage: {
      fontSize: 16,
      color: '#4B5563',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24,
    },
    textDark: {
      color: '#FFFFFF',
    },
    modalButton: {
      backgroundColor: '#10B981',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    modalButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const handleUploadImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      setModalTitle('Permission Required');
      setModalMessage('Please allow access to your media library to upload images.');
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const handleSubmit = async () => {
    if (!brand || !purchaseDate || !contactPerson || !contactNumber || !address) {
      setModalTitle('Missing Information');
      setModalMessage('Please fill in all required fields.');
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting request to:', API_BASE_URL);
      console.log('Data:', { brand, purchaseDate, contactPerson, contactNumber, address });

      const response = await fetch(`${API_BASE_URL}/requests/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand,
          purchaseDate,
          contactPerson,
          contactNumber,
          address,
          images
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setModalTitle('Request Submitted');
        setModalMessage('Our technician will reach you out soon and examin the billboard');
        setIsSuccess(true);
        setShowModal(true);
      } else {
        const errorMsg = data.message || 'Failed to submit request';
        setModalTitle('Error');
        setModalMessage(errorMsg);
        setIsSuccess(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Submit request error:', error);
      const errorMsg = 'Failed to submit request. Please try again. ' + (error instanceof Error ? error.message : String(error));
      setModalTitle('Error');
      setModalMessage(errorMsg);
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color={isDark ? '#FFFFFF' : '#111827'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connect Screen</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Join Our Network</Text>
          <Text style={styles.infoText}>
            Already have a digital display? Connect it to our advertising network and 
            start earning revenue by displaying ads from our partners.
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Screen Brand & Model *</Text>
            <View style={styles.inputContainer}>
              <Monitor size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Samsung LED 55 inch"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={brand}
                onChangeText={setBrand}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Purchase Date *</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="MM/YYYY"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={purchaseDate}
                onChangeText={setPurchaseDate}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Screen Address *</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter screen location address"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>
          </View>

          <View style={styles.imageUploadSection}>
            <Text style={styles.inputLabel}>Screen Images</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImages}>
              <Upload size={20} color="#FFFFFF" />
              <Text style={styles.uploadButtonText}>Upload Screen Photos</Text>
            </TouchableOpacity>
            <Text style={styles.imageCount}>
              {images.length} image{images.length !== 1 ? 's' : ''} selected
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Person *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter contact person name"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={contactPerson}
                onChangeText={setContactPerson}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Number *</Text>
            <View style={styles.inputContainer}>
              <Phone size={20} color={isDark ? '#9CA3AF' : '#6B7280'} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter contact number"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && { opacity: 0.7 }]} 
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>{modalTitle}</Text>
            <Text style={[styles.modalMessage, isDark && styles.textDark]}>{modalMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}