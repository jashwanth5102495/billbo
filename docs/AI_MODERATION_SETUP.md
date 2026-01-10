# AI Video Moderation System Setup Guide

## Overview
This system uses open-source AI models to automatically analyze uploaded videos for inappropriate content. It provides real-time feedback to users about whether their content is approved or rejected.

## Features
- ✅ **Multi-modal Analysis**: Analyzes video, audio, and text content
- ✅ **Real-time Processing**: Results in 30-60 seconds
- ✅ **Open Source Models**: Uses free Hugging Face models
- ✅ **Customizable Thresholds**: Adjust sensitivity levels
- ✅ **User Notifications**: Push notifications and email alerts
- ✅ **Detailed Reporting**: Shows why content was rejected

## Quick Start

### 1. Get API Keys (Free)

#### Hugging Face (Recommended - Free)
1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a free account
3. Generate an API token
4. Add to your `.env` file:
```bash
EXPO_PUBLIC_HUGGING_FACE_TOKEN=your_token_here
```

#### Alternative: Google Perspective API (Free)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Perspective API
3. Create API key
4. Add to `.env`:
```bash
EXPO_PUBLIC_PERSPECTIVE_API_KEY=your_key_here
```

### 2. Install Dependencies
```bash
npm install @huggingface/inference
npm install expo-file-system
npm install expo-av  # for video processing
```

### 3. Environment Variables
Create a `.env` file in your project root:
```bash
# AI Moderation
EXPO_PUBLIC_HUGGING_FACE_TOKEN=your_hugging_face_token
EXPO_PUBLIC_USE_LOCAL_AI=false
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434

# Optional: Other AI Services
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
EXPO_PUBLIC_PERSPECTIVE_API_KEY=your_perspective_key
EXPO_PUBLIC_AZURE_CONTENT_MODERATOR_KEY=your_azure_key
```

### 4. Basic Usage
```typescript
import { useVideoModeration } from '../hooks/useVideoModeration';
import { VideoModerationModal } from '../components/VideoModerationModal';

function MyComponent() {
  const { analyzeVideo, ...moderationState } = useVideoModeration();
  const [showModal, setShowModal] = useState(false);

  const handleVideoUpload = async (videoUri: string) => {
    setShowModal(true);
    
    const result = await analyzeVideo(
      videoUri,
      userDetails,
      bookingDetails
    );
    
    if (result.status === 'approved') {
      // Proceed with booking
    } else {
      // Show rejection reason
    }
  };

  return (
    <VideoModerationModal
      visible={showModal}
      moderationState={moderationState}
      onClose={() => setShowModal(false)}
    />
  );
}
```

## AI Models Used

### 1. Visual Content Analysis
- **CLIP**: General image understanding
- **NSFW Detector**: Adult content detection
- **Violence Detector**: Violence and graphic content

### 2. Audio Analysis
- **Whisper**: Speech-to-text transcription
- **Emotion Recognition**: Detect aggressive speech

### 3. Text Analysis
- **Toxicity Detection**: Harmful language detection
- **Hate Speech**: Discrimination and bias detection
- **Sentiment Analysis**: Overall content tone

## Customization

### Adjust Sensitivity
Edit `config/aiModeration.ts`:
```typescript
THRESHOLDS: {
  VIOLENCE: 0.7,      // 0.0 = very strict, 1.0 = very lenient
  ADULT_CONTENT: 0.8,
  HATE_SPEECH: 0.6,
  // ...
}
```

### Add Custom Models
```typescript
// Add your own model
CUSTOM_MODELS: {
  MY_DETECTOR: 'your-username/your-model-name',
}
```

### Local AI Setup (Advanced)
For complete privacy, run models locally:

1. Install Ollama:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

2. Download models:
```bash
ollama pull llava:latest      # Vision model
ollama pull llama2:latest     # Text model
```

3. Update config:
```bash
EXPO_PUBLIC_USE_LOCAL_AI=true
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434
```

## Content Guidelines

### ✅ Allowed Content
- Personal celebrations (birthdays, weddings)
- Business advertisements
- Educational content
- Community announcements
- Art and creative content

### ❌ Prohibited Content
- Violence or graphic content
- Adult or sexual content
- Hate speech or discrimination
- Harassment or bullying
- Self-harm content
- Spam or misleading information

## Performance Optimization

### 1. Frame Extraction
- Extract 5-10 key frames instead of analyzing entire video
- Use lower resolution for faster processing
- Skip similar consecutive frames

### 2. Caching
- Cache analysis results for identical content
- Store model responses to avoid re-processing

### 3. Batch Processing
- Process multiple videos in parallel
- Use queue system for high volume

## Monitoring & Analytics

### Track Metrics
- Approval/rejection rates
- Processing times
- False positive/negative rates
- User satisfaction

### A/B Testing
- Test different threshold values
- Compare model performance
- Optimize for your use case

## Troubleshooting

### Common Issues

1. **API Rate Limits**
   - Use multiple API keys
   - Implement exponential backoff
   - Cache results

2. **Slow Processing**
   - Reduce video resolution
   - Extract fewer frames
   - Use faster models

3. **False Positives**
   - Lower threshold values
   - Add manual review process
   - Train custom models

### Error Handling
```typescript
try {
  const result = await analyzeVideo(videoUri, userDetails, bookingDetails);
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Handle rate limiting
    await delay(5000);
    return analyzeVideo(videoUri, userDetails, bookingDetails);
  }
  
  // Fallback to manual review
  return { status: 'pending', message: 'Queued for manual review' };
}
```

## Cost Estimation

### Free Tier Limits
- **Hugging Face**: 1000 requests/month free
- **Google Perspective**: 1000 requests/day free
- **Azure Content Moderator**: 5000 requests/month free

### Scaling Costs
- **Hugging Face Pro**: $9/month for 100k requests
- **OpenAI API**: ~$0.01 per video analysis
- **Local Models**: Free after setup (requires GPU)

## Security & Privacy

### Data Protection
- Videos are analyzed but not stored
- Only metadata is kept for analytics
- GDPR compliant processing

### API Security
- Use environment variables for keys
- Rotate API keys regularly
- Monitor usage for anomalies

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review model documentation on Hugging Face
3. Test with sample videos first
4. Monitor API usage and limits

## Future Enhancements

- [ ] Real-time streaming analysis
- [ ] Custom model training
- [ ] Multi-language support
- [ ] Advanced emotion detection
- [ ] Deepfake detection
- [ ] Brand safety analysis