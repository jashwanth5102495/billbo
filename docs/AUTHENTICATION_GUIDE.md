# Authentication System Guide

This document explains the complete authentication system implemented for the Billboard Booking App.

## Overview

The app now includes a comprehensive authentication system with:
- Mobile OTP-based login
- Business profile management
- User profile system
- MongoDB integration ready
- Secure token-based authentication

## Features Implemented

### 1. Authentication Flow
- **Login Screen**: Mobile number input with validation
- **OTP Verification**: 6-digit OTP verification with resend functionality
- **Business Setup**: Multi-step business profile creation
- **Auto-login**: Persistent authentication using AsyncStorage

### 2. User Management
- User registration with phone number
- Business profile creation and management
- Profile editing capabilities
- Secure logout functionality

### 3. Navigation Updates
- Updated tab navigation to show only: Home, Favorites, History
- Hidden Bookings and Videos tabs from navigation
- Profile icon in home screen header
- Authentication guards for protected routes

### 4. Database Integration
- MongoDB service ready for backend integration
- User, Business Profile, Favorites, and Bookings collections
- Complete API endpoint documentation

## File Structure

```
app/
├── auth/
│   ├── login.tsx                 # Mobile number input screen
│   ├── otp-verification.tsx      # OTP verification screen
│   └── business-setup.tsx        # Business profile setup
├── profile/
│   └── index.tsx                 # User profile screen
├── (tabs)/
│   ├── favorites.tsx             # Favorites screen
│   ├── history.tsx               # Booking history screen
│   └── _layout.tsx               # Updated navigation
├── _layout.tsx                   # App root with auth provider
└── index.tsx                     # Auth routing logic

contexts/
└── AuthContext.tsx               # Authentication context

services/
├── authService.ts                # Authentication API service
└── mongoService.ts               # MongoDB integration service

components/
└── AuthGuard.tsx                 # Route protection component

docs/
├── AUTHENTICATION_GUIDE.md       # This guide
└── BACKEND_SETUP.md              # Backend setup instructions
```

## Usage

### 1. First Time User Flow
1. User opens app → Redirected to login screen
2. Enter mobile number → OTP sent
3. Verify OTP → Login successful
4. Complete business profile (3 steps)
5. Access main app features

### 2. Returning User Flow
1. User opens app → Auto-login if token valid
2. Direct access to home screen
3. Profile accessible via header icon

### 3. Profile Management
- View business information
- Edit profile details
- Logout functionality
- Settings access

## Development Setup

### 1. Install Dependencies
```bash
npm install @react-native-async-storage/async-storage
```

### 2. Configure Environment
Create `.env` file:
```env
EXPO_PUBLIC_API_URL=https://your-backend-api.com/api
EXPO_PUBLIC_OTP_SERVICE=development
```

### 3. Development Mode
- In development, any OTP `123456` will work
- Mock user data is created automatically
- No real SMS sending required

## Production Setup

### 1. Backend API
- Set up backend server (see BACKEND_SETUP.md)
- Configure MongoDB database
- Implement OTP service (Twilio, AWS SNS, etc.)

### 2. Update Configuration
```typescript
// In services/authService.ts
const API_BASE_URL = 'https://your-production-api.com/api';
```

### 3. Security Considerations
- Use HTTPS for all API calls
- Implement rate limiting for OTP requests
- Add proper error handling
- Use environment variables for sensitive data

## API Integration

### Authentication Endpoints
```typescript
POST /api/auth/send-otp
POST /api/auth/verify-otp
```

### User Management
```typescript
GET /api/users/:userId
PUT /api/users/:userId
DELETE /api/users/:userId
```

### Business Profiles
```typescript
POST /api/business-profiles
GET /api/business-profiles/user/:userId
PUT /api/business-profiles/user/:userId
```

## Testing

### 1. Development Testing
- Use phone number: Any 10-digit number
- Use OTP: `123456`
- All features work in mock mode

### 2. Production Testing
- Test with real phone numbers
- Verify OTP delivery
- Test profile creation and updates
- Verify persistent login

## Customization

### 1. Styling
- All screens use theme-aware styling
- Dark/light mode support
- Consistent design system

### 2. Business Logic
- Modify validation rules in auth screens
- Update profile fields in business setup
- Customize user data structure

### 3. Navigation
- Add/remove tabs in `_layout.tsx`
- Modify authentication flow
- Update route protection

## Troubleshooting

### Common Issues

1. **AsyncStorage not working**
   ```bash
   npx expo install @react-native-async-storage/async-storage
   ```

2. **Navigation issues**
   - Ensure AuthGuard is properly implemented
   - Check route names match file structure

3. **OTP not working**
   - Verify backend API is running
   - Check OTP service configuration
   - Use development OTP `123456` for testing

4. **Profile not saving**
   - Check MongoDB connection
   - Verify API endpoints
   - Check authentication token

### Debug Mode
Enable debug logging:
```typescript
// In authService.ts
console.log('Auth debug:', { user, token, profile });
```

## Next Steps

1. **Backend Integration**
   - Set up production backend server
   - Configure MongoDB database
   - Implement real OTP service

2. **Enhanced Features**
   - Add profile picture upload
   - Implement social login options
   - Add two-factor authentication

3. **Analytics**
   - Track user registration flow
   - Monitor authentication success rates
   - Add user behavior analytics

4. **Testing**
   - Write unit tests for auth flow
   - Add integration tests
   - Implement E2E testing

## Support

For issues or questions:
1. Check this documentation
2. Review backend setup guide
3. Check console logs for errors
4. Verify API endpoint configuration

The authentication system is now fully functional and ready for production use with proper backend integration.