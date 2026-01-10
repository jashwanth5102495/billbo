#!/bin/bash

echo "Installing Maps and Location dependencies..."

# Install required packages
npx expo install react-native-maps expo-location

echo "Maps and Location dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Run this script: ./install-maps-deps.sh"
echo "2. For Android: Add Google Maps API key to app.json"
echo "3. For iOS: Maps should work out of the box"
echo ""
echo "Note: You'll need to get a Google Maps API key from Google Cloud Console"
echo "and add it to your app.json under expo.android.config.googleMaps.apiKey"