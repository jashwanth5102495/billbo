#!/bin/bash

echo "🧪 Testing Billboard Backend API..."

API_URL="http://localhost:3000/api"

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "$API_URL/health" | jq '.' || echo "❌ Health check failed"

echo ""

# Test skip OTP login
echo "2. Testing skip OTP login..."
RESPONSE=$(curl -s -X POST "$API_URL/auth/skip-otp" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}')

echo "$RESPONSE" | jq '.'

# Extract token for further tests
TOKEN=$(echo "$RESPONSE" | jq -r '.token // empty')
USER_ID=$(echo "$RESPONSE" | jq -r '.user.id // empty')

if [ -n "$TOKEN" ] && [ -n "$USER_ID" ]; then
    echo ""
    echo "3. Testing authenticated endpoints..."
    
    # Test get user profile
    echo "   - Getting user profile..."
    curl -s "$API_URL/users/$USER_ID" \
      -H "Authorization: Bearer $TOKEN" | jq '.'
    
    echo ""
    
    # Test create business profile
    echo "   - Creating business profile..."
    curl -s -X POST "$API_URL/business-profiles" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "businessName": "Test Business",
        "businessType": "Retail Store",
        "ownerName": "Test Owner",
        "email": "test@business.com",
        "address": "123 Test Street",
        "city": "Bangalore",
        "state": "Karnataka",
        "pincode": "560001"
      }' | jq '.'
    
    echo ""
    echo "✅ Backend API tests completed!"
else
    echo "❌ Authentication failed - cannot run authenticated tests"
fi

echo ""
echo "🔗 API Documentation: http://localhost:3000/api/health"
echo "📱 Mobile app should now be able to connect to the backend"