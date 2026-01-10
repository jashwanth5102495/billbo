// AI Moderation Configuration
export const AI_MODERATION_CONFIG = {
  // Hugging Face Models (Free tier available)
  HUGGING_FACE: {
    API_URL: 'https://api-inference.huggingface.co/models',
    MODELS: {
      // Vision models for image/video analysis
      CLIP: 'openai/clip-vit-large-patch14',
      NSFW_DETECTOR: 'Falconsai/nsfw_image_detection',
      VIOLENCE_DETECTOR: 'google/vit-base-patch16-224',
      
      // Audio/Speech models
      WHISPER: 'openai/whisper-large-v3',
      SPEECH_EMOTION: 'ehcalabres/wav2vec2-lg-xlsr-en-speech-emotion-recognition',
      
      // Text analysis models
      TOXICITY: 'martin-ha/toxic-comment-model',
      HATE_SPEECH: 'unitary/toxic-bert',
      SENTIMENT: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
    },
    // Get free API key from: https://huggingface.co/settings/tokens
    API_KEY: process.env.EXPO_PUBLIC_HUGGING_FACE_TOKEN || 'your-hugging-face-token',
  },

  // OpenAI Compatible APIs (can use local models)
  OPENAI_COMPATIBLE: {
    API_URL: process.env.EXPO_PUBLIC_AI_API_URL || 'https://api.openai.com/v1',
    API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'your-api-key',
    MODEL: 'gpt-4-vision-preview', // or local model name
  },

  // Local AI Models (using Ollama or similar)
  LOCAL_MODELS: {
    ENABLED: process.env.EXPO_PUBLIC_USE_LOCAL_AI === 'true',
    BASE_URL: process.env.EXPO_PUBLIC_LOCAL_AI_URL || 'http://localhost:11434',
    MODELS: {
      VISION: 'llava:latest',
      TEXT: 'llama2:latest',
      EMBEDDING: 'nomic-embed-text:latest',
    },
  },

  // Content Moderation Thresholds (0-1 scale)
  THRESHOLDS: {
    VIOLENCE: 0.7,
    ADULT_CONTENT: 0.8,
    HATE_SPEECH: 0.6,
    HARASSMENT: 0.7,
    SELF_HARM: 0.8,
    SPAM: 0.5,
    TOXICITY: 0.6,
  },

  // Analysis Settings
  ANALYSIS: {
    MAX_FRAMES: 10, // Number of frames to extract from video
    FRAME_INTERVAL: 2, // Extract frame every N seconds
    MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB max
    MAX_DURATION: 300, // 5 minutes max
    SUPPORTED_FORMATS: ['mp4', 'mov', 'avi', 'mkv'],
  },

  // Notification Settings
  NOTIFICATIONS: {
    PUSH_ENABLED: true,
    EMAIL_ENABLED: true,
    SMS_ENABLED: false,
  },
};

// Alternative Free AI Services
export const FREE_AI_SERVICES = {
  // Google's Perspective API for toxicity detection
  PERSPECTIVE_API: {
    URL: 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze',
    API_KEY: process.env.EXPO_PUBLIC_PERSPECTIVE_API_KEY,
  },

  // Microsoft's Content Moderator (has free tier)
  AZURE_CONTENT_MODERATOR: {
    URL: 'https://your-region.api.cognitive.microsoft.com/contentmoderator',
    API_KEY: process.env.EXPO_PUBLIC_AZURE_CONTENT_MODERATOR_KEY,
  },

  // AWS Rekognition (has free tier)
  AWS_REKOGNITION: {
    REGION: process.env.EXPO_PUBLIC_AWS_REGION || 'us-east-1',
    ACCESS_KEY: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY,
    SECRET_KEY: process.env.EXPO_PUBLIC_AWS_SECRET_KEY,
  },
};

// Model Performance Benchmarks (for choosing best model)
export const MODEL_BENCHMARKS = {
  ACCURACY: {
    'openai/clip-vit-large-patch14': 0.92,
    'Falconsai/nsfw_image_detection': 0.89,
    'martin-ha/toxic-comment-model': 0.87,
  },
  SPEED: {
    'openai/clip-vit-large-patch14': 'fast',
    'Falconsai/nsfw_image_detection': 'very-fast',
    'martin-ha/toxic-comment-model': 'fast',
  },
  COST: {
    'huggingface-free': 0,
    'openai-api': 0.01, // per request
    'local-model': 0, // after setup
  },
};

// Content Guidelines for Users
export const CONTENT_GUIDELINES = {
  ALLOWED: [
    'Personal celebrations and wishes',
    'Business advertisements',
    'Educational content',
    'Community announcements',
    'Art and creative content',
    'Music and entertainment',
  ],
  PROHIBITED: [
    'Violence or graphic content',
    'Adult or sexual content',
    'Hate speech or discrimination',
    'Harassment or bullying',
    'Self-harm content',
    'Spam or misleading information',
    'Copyright infringement',
    'Illegal activities',
  ],
  EXAMPLES: {
    GOOD: [
      'Happy birthday video for a friend',
      'Wedding invitation announcement',
      'Business product showcase',
      'Community event promotion',
    ],
    BAD: [
      'Videos with violence or fighting',
      'Inappropriate or adult content',
      'Hate speech against any group',
      'Copyrighted music without permission',
    ],
  },
};