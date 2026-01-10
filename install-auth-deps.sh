#!/bin/bash

echo "📦 Installing authentication and database dependencies..."

# Install React Native AsyncStorage for local storage
npm install @react-native-async-storage/async-storage

# Install MongoDB driver for React Native (if using direct connection)
# Note: For production, you should use a backend API instead of direct MongoDB connection
npm install mongodb

# Install additional utilities
npm install react-native-uuid

echo "✅ Authentication dependencies installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update your MongoDB connection string in services/authService.ts"
echo "2. Replace API_BASE_URL with your actual backend endpoint"
echo "3. Configure your OTP service provider"
echo "4. Test the authentication flow"
echo ""
echo "🔧 For production deployment:"
echo "- Set up a proper backend API server"
echo "- Use environment variables for sensitive data"
echo "- Implement proper error handling and logging"
echo "- Add rate limiting for OTP requests"