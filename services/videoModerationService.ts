import * as FileSystem from 'expo-file-system';
import { Alert, Platform } from 'react-native';

// Types for video analysis
export interface VideoAnalysisResult {
  isApproved: boolean;
  confidence: number;
  reasons: string[];
  detectedContent: {
    violence: number;
    adult: number;
    hate: number;
    harassment: number;
    selfHarm: number;
  };
  processingTime: number;
}

export interface ModerationResponse {
  status: 'approved' | 'rejected' | 'pending' | 'error';
  message: string;
  analysisResult?: VideoAnalysisResult;
  estimatedPlayTime?: string;
}

class VideoModerationService {
  private readonly HUGGING_FACE_API = 'https://api-inference.huggingface.co/models';
  private readonly HF_TOKEN = process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN;
  
  // Thresholds for content moderation (0-1 scale)
  private readonly MODERATION_THRESHOLDS = {
    violence: 0.7,
    adult: 0.8,
    hate: 0.6,
    harassment: 0.7,
    selfHarm: 0.8,
  };

  /**
   * Main function to moderate uploaded video
   */
  async moderateVideo(
    videoUri: string,
    userDetails?: any,
    bookingDetails?: any
  ): Promise<ModerationResponse> {
    try {
      console.log('Starting video moderation for:', videoUri);
      
      // Step 1: Extract frames from video
      const frames = await this.extractVideoFrames(videoUri);
      
      // Step 2: Analyze video content using multiple AI models
      const analysisResult = await this.analyzeVideoContent(videoUri, frames);
      
      // Step 3: Make moderation decision
      const moderationDecision = this.makeModerationDecision(analysisResult);
      
      // Step 4: Send notification to user (if details provided)
      if (userDetails && bookingDetails) {
        await this.sendModerationNotification(moderationDecision, userDetails, bookingDetails);
      }
      
      return moderationDecision;
      
    } catch (error) {
      console.error('Video moderation error:', error);
      return {
        status: 'error',
        message: 'Failed to analyze video. Please try again later.',
      };
    }
  }

  /**
   * Simplified moderation for post-payment flow
   */
  async moderateVideoSimple(videoUri: string): Promise<{ approved: boolean; reason?: string }> {
    try {
      const result = await this.moderateVideo(videoUri);
      return {
        approved: result.status === 'approved',
        reason: result.status === 'rejected' ? result.message : undefined
      };
    } catch (error) {
      console.error('Simple video moderation error:', error);
      return {
        approved: false,
        reason: 'Failed to analyze video content'
      };
    }
  }

  /**
   * Extract key frames from video for analysis
   */
  private async extractVideoFrames(videoUri: string): Promise<string[]> {
    try {
      // For React Native, we'll simulate frame extraction
      // In production, you'd use FFmpeg or similar
      const frames: string[] = [];
      
      // Simulate extracting 5 frames at different intervals
      for (let i = 0; i < 5; i++) {
        // In real implementation, extract actual frames
        frames.push(`${videoUri}_frame_${i}`);
      }
      
      return frames;
    } catch (error) {
      console.error('Frame extraction error:', error);
      return [];
    }
  }

  /**
   * Analyze video content using open-source AI models
   */
  private async analyzeVideoContent(
    videoUri: string,
    frames: string[]
  ): Promise<VideoAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Use multiple analysis approaches for better accuracy
      const [
        visualAnalysis,
        audioAnalysis,
        textAnalysis
      ] = await Promise.all([
        this.analyzeVisualContent(frames),
        this.analyzeAudioContent(videoUri),
        this.analyzeTextContent(videoUri) // If video has text/captions
      ]);

      // Combine results from different analyses
      const combinedResult = this.combineAnalysisResults(
        visualAnalysis,
        audioAnalysis,
        textAnalysis
      );

      const processingTime = Date.now() - startTime;

      return {
        ...combinedResult,
        processingTime,
      };

    } catch (error) {
      console.error('Content analysis error:', error);
      
      // Return safe defaults on error
      return {
        isApproved: false,
        confidence: 0,
        reasons: ['Analysis failed - manual review required'],
        detectedContent: {
          violence: 0,
          adult: 0,
          hate: 0,
          harassment: 0,
          selfHarm: 0,
        },
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Analyze visual content using Hugging Face models
   */
  private async analyzeVisualContent(frames: string[]): Promise<any> {
    try {
      // Using multiple models for comprehensive analysis
      const models = [
        'Falconsai/nsfw_image_detection', // NSFW detection
        'google/vit-base-patch16-224', // General image classification
      ];

      const analysisResults = [];

      for (const model of models) {
        const modelEndpoint = `${this.HUGGING_FACE_API}/${model}`;
        
        try {
          // Simulate frame analysis (in production, you'd send actual image data)
          const response = await fetch(modelEndpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.HF_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=", // Minimal test image
            }),
          });

          if (response.ok) {
            const result = await response.json();
            analysisResults.push({ model, result });
          }
        } catch (modelError) {
          console.warn(`Model ${model} failed:`, modelError);
        }
      }
      
      // Process and aggregate results
      return this.aggregateVisualResults(analysisResults);
      
    } catch (error) {
      console.error('Visual analysis error:', error);
      return { violence: 0, adult: 0, hate: 0, harassment: 0, selfHarm: 0 };
    }
  }

  /**
   * Analyze audio content for inappropriate speech
   */
  private async analyzeAudioContent(videoUri: string): Promise<any> {
    try {
      // Use Whisper for speech-to-text, then analyze text
      const transcription = await this.transcribeAudio(videoUri);
      
      if (!transcription) {
        return { violence: 0, adult: 0, hate: 0, harassment: 0, selfHarm: 0 };
      }

      // Analyze transcribed text for harmful content
      return await this.analyzeTextForHarmfulContent(transcription);
      
    } catch (error) {
      console.error('Audio analysis error:', error);
      return { violence: 0, adult: 0, hate: 0, harassment: 0, selfHarm: 0 };
    }
  }

  /**
   * Transcribe audio using Whisper model
   */
  private async transcribeAudio(videoUri: string): Promise<string | null> {
    try {
      const whisperEndpoint = `${this.HUGGING_FACE_API}/openai/whisper-base`;
      
      // For demo purposes, simulate audio transcription
      // In production, you'd extract actual audio from video
      const response = await fetch(whisperEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" // Minimal audio data
        }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.text || "Sample transcribed text for analysis";
      }
      
      return null;
      
    } catch (error) {
      console.error('Audio transcription error:', error);
      return null;
    }
  }

  /**
   * Analyze text content for harmful material
   */
  private async analyzeTextContent(videoUri: string): Promise<any> {
    try {
      // Extract any text/captions from video
      const extractedText = await this.extractTextFromVideo(videoUri);
      
      if (!extractedText) {
        return { violence: 0, adult: 0, hate: 0, harassment: 0, selfHarm: 0 };
      }

      return await this.analyzeTextForHarmfulContent(extractedText);
      
    } catch (error) {
      console.error('Text analysis error:', error);
      return { violence: 0, adult: 0, hate: 0, harassment: 0, selfHarm: 0 };
    }
  }

  /**
   * Analyze text for harmful content using toxicity detection models
   */
  private async analyzeTextForHarmfulContent(text: string): Promise<any> {
    try {
      // Use multiple text analysis models
      const models = [
        'unitary/toxic-bert', // Toxicity detection
        'cardiffnlp/twitter-roberta-base-sentiment-latest', // Sentiment analysis
      ];

      const results = { violence: 0, adult: 0, hate: 0, harassment: 0, selfHarm: 0 };

      for (const model of models) {
        try {
          const response = await fetch(`${this.HUGGING_FACE_API}/${model}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.HF_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              inputs: text || "Sample text for analysis",
            }),
          });

          if (response.ok) {
            const result = await response.json();
            
            // Process different model outputs
            if (Array.isArray(result) && result[0]) {
              const scores = result[0];
              if (scores.label === 'TOXIC' || scores.label === 'NEGATIVE') {
                const toxicityScore = scores.score || 0;
                results.hate = Math.max(results.hate, toxicityScore);
                results.harassment = Math.max(results.harassment, toxicityScore * 0.8);
              }
            }
          }
        } catch (modelError) {
          console.warn(`Text model ${model} failed:`, modelError);
        }
      }
      
      return results;
      
    } catch (error) {
      console.error('Text toxicity analysis error:', error);
      return { violence: 0, adult: 0, hate: 0, harassment: 0, selfHarm: 0 };
    }
  }

  /**
   * Extract text from video (OCR on frames)
   */
  private async extractTextFromVideo(videoUri: string): Promise<string | null> {
    try {
      // Use OCR model to extract text from video frames
      // This is a simplified implementation
      return null; // Return extracted text
    } catch (error) {
      console.error('Text extraction error:', error);
      return null;
    }
  }

  /**
   * Aggregate visual analysis results
   */
  private aggregateVisualResults(results: any[]): any {
    const aggregated = {
      violence: 0,
      adult: 0,
      hate: 0,
      harassment: 0,
      selfHarm: 0,
    };

    results.forEach(({ model, result }) => {
      if (result && Array.isArray(result)) {
        result.forEach((item: any) => {
          if (item.label && item.score) {
            const label = item.label.toLowerCase();
            const score = item.score;
            
            // Map model outputs to our categories
            if (label.includes('nsfw') || label.includes('porn') || label.includes('adult')) {
              aggregated.adult = Math.max(aggregated.adult, score);
            }
            if (label.includes('violence') || label.includes('weapon') || label.includes('blood')) {
              aggregated.violence = Math.max(aggregated.violence, score);
            }
            if (label.includes('hate') || label.includes('discrimin')) {
              aggregated.hate = Math.max(aggregated.hate, score);
            }
            if (label.includes('harassment') || label.includes('bully')) {
              aggregated.harassment = Math.max(aggregated.harassment, score);
            }
            if (label.includes('self') && label.includes('harm')) {
              aggregated.selfHarm = Math.max(aggregated.selfHarm, score);
            }
          }
        });
      }
    });

    // For demo purposes, add some randomness to simulate real analysis
    const demoVariation = Math.random() * 0.3; // 0-30% variation
    (Object.keys(aggregated) as Array<keyof typeof aggregated>).forEach(key => {
      aggregated[key] = Math.min(aggregated[key] + demoVariation, 1.0);
    });

    return aggregated;
  }

  /**
   * Combine results from different analysis methods
   */
  private combineAnalysisResults(
    visualAnalysis: any,
    audioAnalysis: any,
    textAnalysis: any
  ): Omit<VideoAnalysisResult, 'processingTime'> {
    // Weight different analysis methods
    const weights = { visual: 0.4, audio: 0.4, text: 0.2 };
    
    const combined = {
      violence: 0,
      adult: 0,
      hate: 0,
      harassment: 0,
      selfHarm: 0,
    };

    // Combine weighted scores
    (Object.keys(combined) as Array<keyof typeof combined>).forEach(key => {
      combined[key] = (
        (visualAnalysis[key] || 0) * weights.visual +
        (audioAnalysis[key] || 0) * weights.audio +
        (textAnalysis[key] || 0) * weights.text
      );
    });

    // Determine if content should be approved
    const violations = (Object.entries(combined) as [keyof typeof combined, number][]).filter(
      ([key, score]) => score > this.MODERATION_THRESHOLDS[key]
    );

    const isApproved = violations.length === 0;
    const confidence = isApproved ? 
      1 - Math.max(...Object.values(combined)) : 
      Math.max(...violations.map(([, score]) => score));

    const reasons = violations.map(([type, score]) => 
      `${type} content detected (confidence: ${(score * 100).toFixed(1)}%)`
    );

    return {
      isApproved,
      confidence,
      reasons: reasons.length > 0 ? reasons : ['Content approved for display'],
      detectedContent: combined,
    };
  }

  /**
   * Make final moderation decision
   */
  private makeModerationDecision(analysisResult: VideoAnalysisResult): ModerationResponse {
    if (analysisResult.isApproved) {
      return {
        status: 'approved',
        message: 'Your video has been approved and will be played in the next 5 minutes at your selected location!',
        analysisResult,
        estimatedPlayTime: this.calculateEstimatedPlayTime(),
      };
    } else {
      return {
        status: 'rejected',
        message: `Your video has been rejected due to inappropriate content: ${analysisResult.reasons.join(', ')}. Please upload a different video that complies with our content guidelines.`,
        analysisResult,
      };
    }
  }

  /**
   * Calculate estimated play time
   */
  private calculateEstimatedPlayTime(): string {
    const now = new Date();
    const playTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
    return playTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Send moderation notification to user
   */
  private async sendModerationNotification(
    decision: ModerationResponse,
    userDetails: any,
    bookingDetails: any
  ): Promise<void> {
    try {
      // Send push notification
      await this.sendPushNotification(decision, userDetails);
      
      // Send email notification
      await this.sendEmailNotification(decision, userDetails, bookingDetails);
      
      // Update booking status in database
      await this.updateBookingStatus(decision, bookingDetails);
      
    } catch (error) {
      console.error('Notification sending error:', error);
    }
  }

  /**
   * Send push notification to user
   */
  private async sendPushNotification(
    decision: ModerationResponse,
    userDetails: any
  ): Promise<void> {
    try {
      // Implementation for push notifications
      // Using Expo Notifications or Firebase
      console.log('Sending push notification:', decision.message);
      
      // Show local alert for demo
      Alert.alert(
        decision.status === 'approved' ? 'Video Approved! 🎉' : 'Video Rejected ❌',
        decision.message,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Push notification error:', error);
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(
    decision: ModerationResponse,
    userDetails: any,
    bookingDetails: any
  ): Promise<void> {
    try {
      // Implementation for email notifications
      console.log('Sending email notification to:', userDetails.email);
      
      const emailData = {
        to: userDetails.email,
        subject: decision.status === 'approved' ? 
          'Video Approved - Playing Soon!' : 
          'Video Rejected - Action Required',
        body: this.generateEmailBody(decision, userDetails, bookingDetails),
      };
      
      // Send email using your preferred service (SendGrid, AWS SES, etc.)
      
    } catch (error) {
      console.error('Email notification error:', error);
    }
  }

  /**
   * Generate email body for notification
   */
  private generateEmailBody(
    decision: ModerationResponse,
    userDetails: any,
    bookingDetails: any
  ): string {
    if (decision.status === 'approved') {
      return `
        Dear ${userDetails.fullName},
        
        Great news! Your video has been approved and will be displayed on the billboard at ${bookingDetails.locationName}.
        
        Estimated play time: ${decision.estimatedPlayTime}
        Package: ${bookingDetails.packageName}
        
        Thank you for using our service!
        
        Best regards,
        Billboard Team
      `;
    } else {
      return `
        Dear ${userDetails.fullName},
        
        We regret to inform you that your video submission has been rejected due to content policy violations.
        
        Reason: ${decision.message}
        
        Please review our content guidelines and submit a new video that complies with our policies.
        
        Best regards,
        Billboard Team
      `;
    }
  }

  /**
   * Update booking status in database
   */
  private async updateBookingStatus(
    decision: ModerationResponse,
    bookingDetails: any
  ): Promise<void> {
    try {
      // Update booking status in your database
      const status = decision.status === 'approved' ? 'approved' : 'rejected';
      
      console.log('Updating booking status:', {
        bookingId: bookingDetails.id,
        status,
        moderationResult: decision.analysisResult,
      });
      
      // Database update implementation
      
    } catch (error) {
      console.error('Database update error:', error);
    }
  }
}

export const videoModerationService = new VideoModerationService();