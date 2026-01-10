import { useState, useCallback } from 'react';
import { videoModerationService, ModerationResponse } from '../services/videoModerationService';

export interface VideoModerationState {
  isAnalyzing: boolean;
  progress: number;
  status: 'idle' | 'uploading' | 'analyzing' | 'completed' | 'error';
  result: ModerationResponse | null;
  error: string | null;
}

export const useVideoModeration = () => {
  const [state, setState] = useState<VideoModerationState>({
    isAnalyzing: false,
    progress: 0,
    status: 'idle',
    result: null,
    error: null,
  });

  const analyzeVideo = useCallback(async (
    videoUri: string,
    userDetails: any,
    bookingDetails: any
  ) => {
    try {
      setState(prev => ({
        ...prev,
        isAnalyzing: true,
        status: 'analyzing',
        progress: 0,
        error: null,
      }));

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 500);

      // Start video moderation
      const result = await videoModerationService.moderateVideo(
        videoUri,
        userDetails,
        bookingDetails
      );

      clearInterval(progressInterval);

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        status: 'completed',
        progress: 100,
        result,
      }));

      return result;

    } catch (error) {
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Analysis failed',
      }));
      
      throw error;
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      isAnalyzing: false,
      progress: 0,
      status: 'idle',
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    analyzeVideo,
    resetState,
  };
};