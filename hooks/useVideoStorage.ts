import { useState, useCallback } from 'react';
import { videoStorageService, VideoMetadata } from '../services/videoStorageService';

export interface UseVideoStorageReturn {
  videos: VideoMetadata[];
  isLoading: boolean;
  error: string | null;
  storeVideo: (videoUri: string, userId: string, bookingId: string, originalName?: string) => Promise<{ success: boolean; localPath?: string; fileName?: string; fileSize?: number; error?: string }>;
  getAllVideos: () => Promise<void>;
  getVideosByUser: (userId: string) => Promise<VideoMetadata[]>;
  getVideoByBooking: (bookingId: string) => Promise<VideoMetadata | null>;
  updateVideoStatus: (videoId: string, status: 'uploaded' | 'analyzing' | 'approved' | 'rejected', moderationResult?: any) => Promise<void>;
  deleteVideo: (videoId: string) => Promise<void>;
  getStorageStats: () => Promise<{ totalVideos: number; totalSize: number; approvedVideos: number; rejectedVideos: number; pendingVideos: number }>;
}

export const useVideoStorage = (): UseVideoStorageReturn => {
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storeVideo = useCallback(async (
    videoUri: string,
    userId: string,
    bookingId: string,
    originalName?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await videoStorageService.storeVideo(videoUri, userId, bookingId, originalName);
      if (result.success) {
        await getAllVideos(); // Refresh the videos list
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to store video';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allVideos = await videoStorageService.getAllVideos();
      setVideos(allVideos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load videos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getVideosByUser = useCallback(async (userId: string) => {
    try {
      return await videoStorageService.getVideosByUser(userId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get user videos';
      setError(errorMessage);
      return [];
    }
  }, []);

  const getVideoByBooking = useCallback(async (bookingId: string) => {
    try {
      return await videoStorageService.getVideoByBooking(bookingId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get booking video';
      setError(errorMessage);
      return null;
    }
  }, []);

  const updateVideoStatus = useCallback(async (
    videoId: string,
    status: 'uploaded' | 'analyzing' | 'approved' | 'rejected',
    moderationResult?: any
  ) => {
    try {
      setError(null);
      await videoStorageService.updateVideoStatus(videoId, status, moderationResult);
      await getAllVideos(); // Refresh the videos list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update video status';
      setError(errorMessage);
    }
  }, [getAllVideos]);

  const deleteVideo = useCallback(async (videoId: string) => {
    try {
      setError(null);
      await videoStorageService.deleteVideo(videoId);
      await getAllVideos(); // Refresh the videos list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete video';
      setError(errorMessage);
    }
  }, [getAllVideos]);

  const getStorageStats = useCallback(async () => {
    try {
      return await videoStorageService.getStorageStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get storage stats';
      setError(errorMessage);
      return {
        totalVideos: 0,
        totalSize: 0,
        approvedVideos: 0,
        rejectedVideos: 0,
        pendingVideos: 0,
      };
    }
  }, []);

  return {
    videos,
    isLoading,
    error,
    storeVideo,
    getAllVideos,
    getVideosByUser,
    getVideoByBooking,
    updateVideoStatus,
    deleteVideo,
    getStorageStats,
  };
};