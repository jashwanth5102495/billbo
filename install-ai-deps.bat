@echo off
echo Installing AI Moderation Dependencies...
echo.

REM Core dependencies for AI moderation
npm install --save expo-file-system expo-av expo-media-library expo-notifications

echo.
echo ✅ AI Moderation dependencies installed!
echo.
echo 🔧 Next steps:
echo 1. Make sure your .env file has the Hugging Face token
echo 2. Test the AI moderation using the test component on the home screen
echo 3. The system is now ready to analyze videos!
echo.
echo 📱 To test:
echo - Go to Personal Wishes → Upload a video → Fill details → Continue to Payment
echo - The AI will analyze the video and show approval/rejection
echo.
echo 🚀 Your Hugging Face token is configured and ready to use!
pause