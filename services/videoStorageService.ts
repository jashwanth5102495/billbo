import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export interface VideoStorageResult {
  success: boolean;
  id?: string;
  localPath?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export interface VideoMetadata {
  id: string;
  originalName: string;
  fileName: string;
  localPath: string;
  fileSize: number;
  duration?: number;
  resolution?: string;
  uploadDate: string;
  userId: string;
  bookingId: string;
  status: 'uploaded' | 'analyzing' | 'approved' | 'rejected';
  moderationResult?: any;
}

class VideoStorageService {
  private readonly VIDEOS_FOLDER = `${FileSystem.documentDirectory}videos/`;
  private readonly TEMP_FOLDER = `${FileSystem.documentDirectory}temp/`;
  private readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly ALLOWED_FORMATS = ['mp4', 'mov', 'avi', 'mkv', 'm4v'];

  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage folders
   */
  private async initializeStorage(): Promise<void> {
    try {
      // Skip initialization on web platform
      if (typeof window !== 'undefined') {
        console.log('📱 Video storage: Skipping initialization on web platform');
        return;
      }

      // Create videos folder if it doesn't exist
      const videosInfo = await FileSystem.getInfoAsync(this.VIDEOS_FOLDER);
      if (!videosInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.VIDEOS_FOLDER, { intermediates: true });
        console.log('✅ Videos folder created:', this.VIDEOS_FOLDER);
      }

      // Create temp folder if it doesn't exist
      const tempInfo = await FileSystem.getInfoAsync(this.TEMP_FOLDER);
      if (!tempInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.TEMP_FOLDER, { intermediates: true });
        console.log('✅ Temp folder created:', this.TEMP_FOLDER);
      }

      // Create metadata file if it doesn't exist
      await this.initializeMetadataFile();

    } catch (error) {
      console.error('❌ Storage initialization error:', error);
    }
  }

  /**
   * Initialize metadata storage file
   */
  private async initializeMetadataFile(): Promise<void> {
    try {
      // Skip on web platform
      if (typeof window !== 'undefined') {
        return;
      }

      const metadataPath = `${this.VIDEOS_FOLDER}metadata.json`;
      const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
      
      if (!metadataInfo.exists) {
        await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify([]));
        console.log('✅ Metadata file created');
      }
    } catch (error) {
      console.error('❌ Metadata initialization error:', error);
    }
  }

  /**
   * Store uploaded video in local folder
   */
  async storeVideo(
    videoUri: string,
    userId: string,
    bookingId: string,
    originalName?: string
  ): Promise<VideoStorageResult> {
    try {
      console.log('📁 Storing video:', videoUri);

      // Validate video file
      const validation = await this.validateVideo(videoUri);
      if (!validation.success) {
        return validation;
      }

      // Generate unique filename
      const fileExtension = this.getFileExtension(videoUri);
      const fileName = `${bookingId}_${Date.now()}.${fileExtension}`;
      const localPath = `${this.VIDEOS_FOLDER}${fileName}`;

      // Copy video to local storage
      await FileSystem.copyAsync({
        from: videoUri,
        to: localPath,
      });

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(localPath);
      const fileSize = fileInfo.size || 0;

      // Create metadata entry
      const videoId = `video_${Date.now()}`;
      const metadata: VideoMetadata = {
        id: videoId,
        originalName: originalName || 'uploaded_video',
        fileName,
        localPath,
        fileSize,
        uploadDate: new Date().toISOString(),
        userId,
        bookingId,
        status: 'uploaded',
      };

      // Save metadata
      await this.saveVideoMetadata(metadata);

      console.log('✅ Video stored successfully:', fileName);

      return {
        success: true,
        id: videoId,
        localPath,
        fileName,
        fileSize,
      };

    } catch (error) {
      console.error('❌ Video storage error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Storage failed',
      };
    }
  }

  /**
   * Validate video file before storage
   */
  private async validateVideo(videoUri: string): Promise<VideoStorageResult> {
    try {
      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(videoUri);
      if (!fileInfo.exists) {
        return {
          success: false,
          error: 'Video file not found',
        };
      }

      // Check file size
      const fileSize = fileInfo.size || 0;
      if (fileSize > this.MAX_FILE_SIZE) {
        return {
          success: false,
          error: `File too large. Maximum size is ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`,
        };
      }

      if (fileSize === 0) {
        return {
          success: false,
          error: 'File is empty',
        };
      }

      // Check file format
      const extension = this.getFileExtension(videoUri);
      if (!this.ALLOWED_FORMATS.includes(extension.toLowerCase())) {
        return {
          success: false,
          error: `Unsupported format. Allowed: ${this.ALLOWED_FORMATS.join(', ')}`,
        };
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        error: 'Validation failed',
      };
    }
  }

  /**
   * Get file extension from URI
   */
  private getFileExtension(uri: string): string {
    const parts = uri.split('.');
    return parts[parts.length - 1] || 'mp4';
  }

  /**
   * Save video metadata to JSON file
   */
  private async saveVideoMetadata(metadata: VideoMetadata): Promise<void> {
    try {
      const metadataPath = `${this.VIDEOS_FOLDER}metadata.json`;
      
      // Read existing metadata
      const existingData = await FileSystem.readAsStringAsync(metadataPath);
      const metadataList: VideoMetadata[] = JSON.parse(existingData);
      
      // Add new metadata
      metadataList.push(metadata);
      
      // Write back to file
      await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadataList, null, 2));
      
      console.log('✅ Metadata saved for:', metadata.fileName);
      
    } catch (error) {
      console.error('❌ Metadata save error:', error);
    }
  }

  /**
   * Get all stored videos metadata
   */
  async getAllVideos(): Promise<VideoMetadata[]> {
    try {
      const metadataPath = `${this.VIDEOS_FOLDER}metadata.json`;
      const data = await FileSystem.readAsStringAsync(metadataPath);
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Get videos error:', error);
      return [];
    }
  }

  /**
   * Get videos by user ID
   */
  async getVideosByUser(userId: string): Promise<VideoMetadata[]> {
    const allVideos = await this.getAllVideos();
    return allVideos.filter(video => video.userId === userId);
  }

  /**
   * Get video by booking ID
   */
  async getVideoByBooking(bookingId: string): Promise<VideoMetadata | null> {
    const allVideos = await this.getAllVideos();
    return allVideos.find(video => video.bookingId === bookingId) || null;
  }

  /**
   * Update video status after moderation
   */
  async updateVideoStatus(
    videoId: string, 
    status: VideoMetadata['status'], 
    moderationResult?: any
  ): Promise<void> {
    try {
      const metadataPath = `${this.VIDEOS_FOLDER}metadata.json`;
      const data = await FileSystem.readAsStringAsync(metadataPath);
      const metadataList: VideoMetadata[] = JSON.parse(data);
      
      const videoIndex = metadataList.findIndex(video => video.id === videoId);
      if (videoIndex !== -1) {
        metadataList[videoIndex].status = status;
        if (moderationResult) {
          metadataList[videoIndex].moderationResult = moderationResult;
        }
        
        await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadataList, null, 2));
        console.log('✅ Video status updated:', videoId, status);
      }
      
    } catch (error) {
      console.error('❌ Status update error:', error);
    }
  }

  /**
   * Delete video and its metadata
   */
  async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const metadataPath = `${this.VIDEOS_FOLDER}metadata.json`;
      const data = await FileSystem.readAsStringAsync(metadataPath);
      const metadataList: VideoMetadata[] = JSON.parse(data);
      
      const videoIndex = metadataList.findIndex(video => video.id === videoId);
      if (videoIndex !== -1) {
        const video = metadataList[videoIndex];
        
        // Delete physical file
        const fileInfo = await FileSystem.getInfoAsync(video.localPath);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(video.localPath);
        }
        
        // Remove from metadata
        metadataList.splice(videoIndex, 1);
        await FileSystem.writeAsStringAsync(metadataPath, JSON.stringify(metadataList, null, 2));
        
        console.log('✅ Video deleted:', videoId);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('❌ Delete video error:', error);
      return false;
    }
  }

  /**
   * Clean up old videos (older than specified days)
   */
  async cleanupOldVideos(daysOld: number = 30): Promise<number> {
    try {
      const allVideos = await this.getAllVideos();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      let deletedCount = 0;
      
      for (const video of allVideos) {
        const uploadDate = new Date(video.uploadDate);
        if (uploadDate < cutoffDate) {
          const deleted = await this.deleteVideo(video.id);
          if (deleted) deletedCount++;
        }
      }
      
      console.log(`✅ Cleaned up ${deletedCount} old videos`);
      return deletedCount;
      
    } catch (error) {
      console.error('❌ Cleanup error:', error);
      return 0;
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats(): Promise<{
    totalVideos: number;
    totalSize: number;
    approvedVideos: number;
    rejectedVideos: number;
    pendingVideos: number;
  }> {
    try {
      const allVideos = await this.getAllVideos();
      
      const stats = {
        totalVideos: allVideos.length,
        totalSize: allVideos.reduce((sum, video) => sum + video.fileSize, 0),
        approvedVideos: allVideos.filter(v => v.status === 'approved').length,
        rejectedVideos: allVideos.filter(v => v.status === 'rejected').length,
        pendingVideos: allVideos.filter(v => v.status === 'analyzing' || v.status === 'uploaded').length,
      };
      
      return stats;
      
    } catch (error) {
      console.error('❌ Stats error:', error);
      return {
        totalVideos: 0,
        totalSize: 0,
        approvedVideos: 0,
        rejectedVideos: 0,
        pendingVideos: 0,
      };
    }
  }

  /**
   * Export video for playback
   */
  async getVideoForPlayback(videoId: string): Promise<string | null> {
    try {
      const allVideos = await this.getAllVideos();
      const video = allVideos.find(v => v.id === videoId);
      
      if (video && video.status === 'approved') {
        const fileInfo = await FileSystem.getInfoAsync(video.localPath);
        if (fileInfo.exists) {
          return video.localPath;
        }
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Get video for playback error:', error);
      return null;
    }
  }

  /**
   * Get videos folder path
   */
  getVideosFolderPath(): string {
    return this.VIDEOS_FOLDER;
  }

  /**
   * Get temp folder path
   */
  getTempFolderPath(): string {
    return this.TEMP_FOLDER;
  }
}

export const videoStorageService = new VideoStorageService();