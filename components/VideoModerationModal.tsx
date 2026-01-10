import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { CheckCircle, XCircle, AlertTriangle, Clock, Eye, Shield } from 'lucide-react-native';
import { useTheme } from '../app/(tabs)/ThemeContext';
import { VideoModerationState } from '../hooks/useVideoModeration';

interface VideoModerationModalProps {
  visible: boolean;
  moderationState: VideoModerationState;
  onClose: () => void;
  onRetry?: () => void;
}

export const VideoModerationModal: React.FC<VideoModerationModalProps> = ({
  visible,
  moderationState,
  onClose,
  onRetry,
}) => {
  const { isDarkMode } = useTheme();
  const { isAnalyzing, progress, status, result, error } = moderationState;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 20,
      padding: 24,
      width: '90%',
      maxWidth: 400,
      alignItems: 'center',
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    analyzingIcon: {
      backgroundColor: '#4A90E2',
    },
    approvedIcon: {
      backgroundColor: '#10B981',
    },
    rejectedIcon: {
      backgroundColor: '#EF4444',
    },
    errorIcon: {
      backgroundColor: '#F59E0B',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      textAlign: 'center',
      marginBottom: 12,
    },
    message: {
      fontSize: 16,
      color: isDarkMode ? '#D1D5DB' : '#6B7280',
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 20,
    },
    progressContainer: {
      width: '100%',
      marginBottom: 20,
    },
    progressBar: {
      height: 8,
      backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 8,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#4A90E2',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    analysisSteps: {
      width: '100%',
      marginBottom: 20,
    },
    analysisStep: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: isDarkMode ? '#2A2A2A' : '#F3F4F6',
      borderRadius: 8,
      marginBottom: 8,
    },
    stepIcon: {
      marginRight: 12,
    },
    stepText: {
      fontSize: 14,
      color: isDarkMode ? '#D1D5DB' : '#374151',
      flex: 1,
    },
    stepStatus: {
      fontSize: 12,
      fontWeight: '600',
    },
    stepCompleted: {
      color: '#10B981',
    },
    stepProcessing: {
      color: '#4A90E2',
    },
    stepPending: {
      color: isDarkMode ? '#6B7280' : '#9CA3AF',
    },
    resultDetails: {
      width: '100%',
      backgroundColor: isDarkMode ? '#2A2A2A' : '#F9FAFB',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 12,
    },
    resultItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    resultLabel: {
      fontSize: 14,
      color: isDarkMode ? '#D1D5DB' : '#6B7280',
    },
    resultValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    estimatedTime: {
      backgroundColor: '#10B981',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: 20,
    },
    estimatedTimeText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    button: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: '#4A90E2',
    },
    secondaryButton: {
      backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
    },
    dangerButton: {
      backgroundColor: '#EF4444',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryButtonText: {
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      color: isDarkMode ? '#D1D5DB' : '#6B7280',
    },
  });

  const getAnalysisSteps = () => {
    const steps = [
      { id: 'upload', label: 'Uploading video', icon: Clock },
      { id: 'extract', label: 'Extracting frames', icon: Eye },
      { id: 'analyze', label: 'Analyzing content', icon: Shield },
      { id: 'decision', label: 'Making decision', icon: CheckCircle },
    ];

    return steps.map((step, index) => {
      let stepStatus = 'pending';
      if (progress > index * 25) {
        stepStatus = progress > (index + 1) * 25 ? 'completed' : 'processing';
      }

      return (
        <View key={step.id} style={styles.analysisStep}>
          <step.icon 
            size={16} 
            color={
              stepStatus === 'completed' ? '#10B981' :
              stepStatus === 'processing' ? '#4A90E2' : 
              isDarkMode ? '#6B7280' : '#9CA3AF'
            }
            style={styles.stepIcon}
          />
          <Text style={styles.stepText}>{step.label}</Text>
          <Text style={[
            styles.stepStatus,
            stepStatus === 'completed' && styles.stepCompleted,
            stepStatus === 'processing' && styles.stepProcessing,
            stepStatus === 'pending' && styles.stepPending,
          ]}>
            {stepStatus === 'completed' ? '✓' : 
             stepStatus === 'processing' ? '...' : '○'}
          </Text>
        </View>
      );
    });
  };

  const renderContent = () => {
    if (isAnalyzing) {
      return (
        <>
          <View style={[styles.iconContainer, styles.analyzingIcon]}>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Analyzing Your Video</Text>
          <Text style={styles.message}>
            Our AI is checking your video for content compliance. This usually takes 30-60 seconds.
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[styles.progressFill, { width: `${progress}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{progress}% Complete</Text>
          </View>

          <View style={styles.analysisSteps}>
            {getAnalysisSteps()}
          </View>
        </>
      );
    }

    if (status === 'completed' && result) {
      if (result.status === 'approved') {
        return (
          <>
            <View style={[styles.iconContainer, styles.approvedIcon]}>
              <CheckCircle size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Video Approved! 🎉</Text>
            <Text style={styles.message}>{result.message}</Text>
            
            {result.estimatedPlayTime && (
              <View style={styles.estimatedTime}>
                <Text style={styles.estimatedTimeText}>
                  Estimated play time: {result.estimatedPlayTime}
                </Text>
              </View>
            )}

            {result.analysisResult && (
              <View style={styles.resultDetails}>
                <Text style={styles.resultTitle}>Analysis Results</Text>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Confidence Score</Text>
                  <Text style={styles.resultValue}>
                    {(result.analysisResult.confidence * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.resultItem}>
                  <Text style={styles.resultLabel}>Processing Time</Text>
                  <Text style={styles.resultValue}>
                    {(result.analysisResult.processingTime / 1000).toFixed(1)}s
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onClose}>
                <Text style={[styles.buttonText, styles.primaryButtonText]}>Great!</Text>
              </TouchableOpacity>
            </View>
          </>
        );
      } else {
        return (
          <>
            <View style={[styles.iconContainer, styles.rejectedIcon]}>
              <XCircle size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Video Rejected</Text>
            <Text style={styles.message}>{result.message}</Text>

            {result.analysisResult && (
              <View style={styles.resultDetails}>
                <Text style={styles.resultTitle}>Issues Detected</Text>
                {result.analysisResult.reasons.map((reason, index) => (
                  <Text key={index} style={styles.resultLabel}>• {reason}</Text>
                ))}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Close</Text>
              </TouchableOpacity>
              {onRetry && (
                <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onRetry}>
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>Try Again</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        );
      }
    }

    if (status === 'error') {
      return (
        <>
          <View style={[styles.iconContainer, styles.errorIcon]}>
            <AlertTriangle size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Analysis Failed</Text>
          <Text style={styles.message}>
            {error || 'Something went wrong while analyzing your video. Please try again.'}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Close</Text>
            </TouchableOpacity>
            {onRetry && (
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={onRetry}>
                <Text style={[styles.buttonText, styles.primaryButtonText]}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      );
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};