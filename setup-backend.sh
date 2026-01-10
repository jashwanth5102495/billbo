#!/bin/bash

echo "🚀 Setting up Billboard Backend API..."

# Navigate to backend directory
cd backend

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB status..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Starting MongoDB..."
    
    # Try to start MongoDB (different commands for different systems)
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongod
    elif command -v brew &> /dev/null; then
        brew services start mongodb/brew/mongodb-community
    else
        echo "❌ Could not start MongoDB automatically. Please start it manually."
        echo "   Ubuntu/Debian: sudo systemctl start mongod"
        echo "   macOS: brew services start mongodb/brew/mongodb-community"
        echo "   Windows: net start MongoDB"
        exit 1
    fi
    
    # Wait a moment for MongoDB to start
    sleep 3
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Start the server
echo "🚀 Starting backend server..."
echo ""
echo "✅ Backend API is running!"
echo "📊 API URL: http://localhost:3000/api"
echo "🏥 Health check: http://localhost:3000/api/health"
echo "🔐 Skip OTP enabled for development"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev