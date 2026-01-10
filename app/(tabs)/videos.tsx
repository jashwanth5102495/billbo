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
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Video, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload,
  HardDrive,
  BarChart3,
  Play
} from 'lucide-react-native';
import { useTheme } from './ThemeContext';
import { videoStorageService, VideoMetadata } from '../../services/videoStorageService';

export default function VideosScreen() {
  const { isDarkMode } = useTheme();
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [storageStats, setStorageStats] = useState({
    totalVideos: 0,
    totalSize: 0,
    approvedVideos: 0,
    rejectedVideos: 0,
    pendingVideos: 0,
  });
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
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginRight: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    videoCard: {
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
    videoHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    videoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      flex: 1,
      marginRight: 12,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    approvedBadge: {
      backgroundColor: '#10B981',
    },
    rejectedBadge: {
      backgroundColor: '#EF4444',
    },
    pendingBadge: {
      backgroundColor: '#F59E0B',
    },
    uploadedBadge: {
      backgroundColor: '#6B7280',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#FFFFFF',
      marginLeft: 4,
    },
    videoDetails: {
      marginBottom: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 14,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600',
      color: isDarkMode ? '#FFFFFF' : '#111827',
    },
    videoActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    playButton: {
      backgroundColor: '#4A90E2',
    },
    deleteButton: {
      backgroundColor: '#EF4444',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 4,
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
    cleanupButton: {
      backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    cleanupButtonText: {
      color: isDarkMode ? '#D1D5DB' : '#6B7280',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const [allVideos, stats] = await Promise.all([
        videoStorageService.getAllVideos(),
        videoStorageService.getStorageStats(),
      ]);
      
      setVideos(allVideos.reverse()); // Show newest first
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  const handleDeleteVideo = (videoId: string, videoName: string) => {
    Alert.alert(
      'Delete Video',
      `Are you sure you want to delete "${videoName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await videoStorageService.deleteVideo(videoId);
            if (success) {
              Alert.alert('Success', 'Video deleted successfully');
              loadVideos();
            } else {
              Alert.alert('Error', 'Failed to delete video');
            }
          },
        },
      ]
    );
  };

  const handlePlayVideo = async (videoId: string) => {
    const videoPath = await videoStorageService.getVideoForPlayback(videoId);
    if (videoPath) {
      Alert.alert('Play Video', `Video path: ${videoPath}\n\nIn a real app, this would open the video player.`);
    } else {
      Alert.alert('Error', 'Video not available for playback');
    }
  };

  const handleCleanupOldVideos = () => {
    Alert.alert(
      'Cleanup Old Videos',
      'This will delete videos older than 30 days. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Cleanup',
          onPress: async () => {
            const deletedCount = await videoStorageService.cleanupOldVideos(30);
            Alert.alert('Cleanup Complete', `Deleted ${deletedCount} old videos`);
            loadVideos();
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: VideoMetadata['status']) => {
    switch (status) {
      case 'approved':
        return (
          <View style={[styles.statusBadge, styles.approvedBadge]}>
            <CheckCircle size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>Approved</Text>
          </View>
        );
      case 'rejected':
        return (
          <View style={[styles.statusBadge, styles.rejectedBadge]}>
            <XCircle size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>Rejected</Text>
          </View>
        );
      case 'analyzing':
        return (
          <View style={[styles.statusBadge, styles.pendingBadge]}>
            <Clock size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>Analyzing</Text>
          </View>
        );
      default:
        return (
          <View style={[styles.statusBadge, styles.uploadedBadge]}>
            <Upload size={12} color="#FFFFFF" />
            <Text style={styles.statusText}>Uploaded</Text>
          </View>
        );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stored Videos</Text>
      </View>

      {/* Storage Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{storageStats.totalVideos}</Text>
          <Text style={styles.statLabel}>Total Videos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{storageStats.approvedVideos}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{storageStats.rejectedVideos}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{formatFileSize(storageStats.totalSize)}</Text>
          <Text style={styles.statLabel}>Storage Used</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {videos.length === 0 ? (
          <View style={styles.emptyState}>
            <Video size={64} color={isDarkMode ? '#6B7280' : '#9CA3AF'} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No Videos Stored</Text>
            <Text style={styles.emptyText}>
              Upload videos through Personal Wishes or Play Ad to see them here.
            </Text>
          </View>
        ) : (
          videos.map((video) => (
            <View key={video.id} style={styles.videoCard}>
              <View style={styles.videoHeader}>
                <Text style={styles.videoTitle}>{video.originalName}</Text>
                {getStatusBadge(video.status)}
              </View>

              <View style={styles.videoDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>File Name:</Text>
                  <Text style={styles.detailValue}>{video.fileName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Size:</Text>
                  <Text style={styles.detailValue}>{formatFileSize(video.fileSize)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Uploaded:</Text>
                  <Text style={styles.detailValue}>{formatDate(video.uploadDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking ID:</Text>
                  <Text style={styles.detailValue}>{video.bookingId}</Text>
                </View>
                {video.status === 'rejected' && video.moderationResult && video.moderationResult.reason && (
                  <View style={{ marginTop: 8, padding: 8, backgroundColor: '#FEF2F2', borderRadius: 8 }}>
                    <Text style={{ color: '#EF4444', fontSize: 12 }}>Reason: {video.moderationResult.reason}</Text>
                  </View>
                )}
              </View>

              <View style={styles.videoActions}>
                {video.status === 'approved' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.playButton]}
                    onPress={() => handlePlayVideo(video.id)}
                  >
                    <Play size={16} color="#FFFFFF" />
                    <Text style={styles.actionButtonText}>Play</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeleteVideo(video.id, video.originalName)}
                >
                  <Trash2 size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {videos.length > 0 && (
          <TouchableOpacity style={styles.cleanupButton} onPress={handleCleanupOldVideos}>
            <Text style={styles.cleanupButtonText}>Cleanup Old Videos (30+ days)</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}