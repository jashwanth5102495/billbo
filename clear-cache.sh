#!/bin/bash

echo "🧹 Clearing Metro cache and restarting..."

# Clear Metro cache
npx expo start --clear

echo "✅ Cache cleared and app restarted!"