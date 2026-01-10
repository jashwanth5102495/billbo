import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../app/(tabs)/ThemeContext';
import { useVideoModeration } from '../hooks/useVideoModeration';
import { VideoModerationModal } from './VideoModerationModal';

export const TestVideoModeration: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { analyzeVideo, resetState, ...moderationState } = useVideoModeration();
  const [showModal, setShowModal] = useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      margin: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 16,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#4A90E2',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginBottom: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    dangerButton: {
      backgroundColor: '#EF4444',
    },
    successButton: {
      backgroundColor: '#10B981',
    },
    infoText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginTop: 16,
      lineHeight: 20,
    },
  });

  const testGoodVideo = async () => {
    setShowModal(true);
    
    const mockUserDetails = {
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
    };

    const mockBookingDetails = {
      id: 'test-123',
      locationName: 'Test Billboard',
      packageName: 'Test Package',
      price: '₹299',
    };

    try {
      await analyzeVideo(
        'mock-good-video-uri',
        mockUserDetails,
        mockBookingDetails
      );
    } catch (error) {
      Alert.alert('Error', 'Test failed: ' + error.message);
    }
  };

  const testBadVideo = async () => {
    setShowModal(true);
    
    const mockUserDetails = {
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '1234567890',
    };

    const mockBookingDetails = {
      id: 'test-456',
      locationName: 'Test Billboard',
      packageName: 'Test Package',
      price: '₹299',
    };

    try {
      // Simulate a video that would be rejected
      await analyzeVideo(
        'mock-bad-video-uri-with-inappropriate-content',
        mockUserDetails,
        mockBookingDetails
      );
    } catch (error) {
      Alert.alert('Error', 'Test failed: ' + error.message);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    resetState();
  };

  const handleRetry = () => {
    setShowModal(false);
    resetState();
    Alert.alert('Retry', 'In a real app, user would upload a new video here.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 AI Moderation Test</Text>
      
      <TouchableOpacity 
        style={[styles.button, styles.successButton]} 
        onPress={testGoodVideo}
      >
        <Text style={styles.buttonText}>Test Good Video (Should Approve)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.dangerButton]} 
        onPress={testBadVideo}
      >
        <Text style={styles.buttonText}>Test Bad Video (Should Reject)</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        This tests the AI moderation system using your Hugging Face token. 
        The system analyzes video content and provides approval/rejection feedback.
      </Text>

      <VideoModerationModal
        visible={showModal}
        moderationState={moderationState}
        onClose={handleClose}
        onRetry={handleRetry}
      />
    </View>
  );
};