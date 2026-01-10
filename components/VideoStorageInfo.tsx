import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Folder, HardDrive, Info, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../app/(tabs)/ThemeContext';
import { videoStorageService } from '../services/videoStorageService';

export const VideoStorageInfo: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [storageStats, setStorageStats] = useState({
    totalVideos: 0,
    totalSize: 0,
    approvedVideos: 0,
    rejectedVideos: 0,
    pendingVideos: 0,
  });

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
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginLeft: 12,
      flex: 1,
    },
    refreshButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
    },
    folderStructure: {
      backgroundColor: isDarkMode ? '#2A2A2A' : '#F9FAFB',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    folderItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    folderText: {
      fontSize: 14,
      fontFamily: 'monospace',
      color: isDarkMode ? '#D1D5DB' : '#374151',
      marginLeft: 8,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    statItem: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#111827',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: isDarkMode ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    infoButton: {
      backgroundColor: '#4A90E2',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    infoButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    try {
      const stats = await videoStorageService.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const showStorageInfo = () => {
    const videosFolderPath = videoStorageService.getVideosFolderPath();
    const tempFolderPath = videoStorageService.getTempFolderPath();
    
    Alert.alert(
      'Video Storage Information',
      `📁 Videos Folder:\n${videosFolderPath}\n\n📁 Temp Folder:\n${tempFolderPath}\n\n📊 Storage Stats:\n• Total Videos: ${storageStats.totalVideos}\n• Total Size: ${formatFileSize(storageStats.totalSize)}\n• Approved: ${storageStats.approvedVideos}\n• Rejected: ${storageStats.rejectedVideos}\n• Pending: ${storageStats.pendingVideos}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HardDrive size={24} color="#4A90E2" />
        <Text style={styles.title}>Video Storage</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={loadStorageStats}>
          <RefreshCw size={16} color={isDarkMode ? '#D1D5DB' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      <View style={styles.folderStructure}>
        <View style={styles.folderItem}>
          <Folder size={16} color="#F59E0B" />
          <Text style={styles.folderText}>📁 /videos/</Text>
        </View>
        <View style={styles.folderItem}>
          <Text style={styles.folderText}>   ├── metadata.json</Text>
        </View>
        <View style={styles.folderItem}>
          <Text style={styles.folderText}>   ├── booking_123_video.mp4</Text>
        </View>
        <View style={styles.folderItem}>
          <Text style={styles.folderText}>   └── booking_456_video.mov</Text>
        </View>
        <View style={styles.folderItem}>
          <Folder size={16} color="#F59E0B" />
          <Text style={styles.folderText}>📁 /temp/</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{storageStats.totalVideos}</Text>
          <Text style={styles.statLabel}>Total Videos</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{formatFileSize(storageStats.totalSize)}</Text>
          <Text style={styles.statLabel}>Storage Used</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{storageStats.approvedVideos}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{storageStats.rejectedVideos}</Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.infoButton} onPress={showStorageInfo}>
        <Info size={16} color="#FFFFFF" />
        <Text style={styles.infoButtonText}>View Storage Details</Text>
      </TouchableOpacity>
    </View>
  );
};