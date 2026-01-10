# Backend Setup Guide

This document provides instructions for setting up the backend API server with MongoDB for the Billboard Booking App.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Backend Architecture

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── businessController.js
│   │   ├── bookingController.js
│   │   └── favoriteController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── BusinessProfile.js
│   │   ├── Booking.js
│   │   └── Favorite.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── business.js
│   │   ├── bookings.js
│   │   └── favorites.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── services/
│   │   ├── otpService.js
│   │   └── smsService.js
│   └── app.js
├── package.json
└── .env
```

## Quick Setup

### 1. Initialize Backend Project

```bash
mkdir billboard-backend
cd billboard-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express mongoose cors helmet morgan dotenv
npm install jsonwebtoken bcryptjs
npm install twilio # for SMS OTP
npm install --save-dev nodemon
```

### 3. Environment Variables

Create `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/billboard-app
JWT_SECRET=your-super-secret-jwt-key
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
NODE_ENV=development
```

### 4. MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  phoneNumber: String, // unique
  name: String,
  email: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Business Profiles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // reference to users
  businessName: String,
  businessType: String,
  ownerName: String,
  email: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  gstNumber: String,
  panNumber: String,
  businessDescription: String,
  website: String,
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Bookings Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  bookingType: String, // 'personal-wishes', 'public-wishes', 'play-ad'
  billboardId: String,
  billboardName: String,
  location: String,
  startDate: Date,
  endDate: Date,
  startTime: String,
  endTime: String,
  duration: Number,
  price: Number,
  status: String, // 'pending', 'confirmed', 'completed', 'cancelled'
  paymentStatus: String, // 'pending', 'paid', 'failed', 'refunded'
  paymentId: String,
  content: {
    type: String, // 'image', 'video', 'text'
    url: String,
    text: String,
    moderationStatus: String // 'pending', 'approved', 'rejected'
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Favorites Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  itemId: String,
  itemType: String, // 'billboard', 'location', 'service'
  itemData: Object,
  createdAt: Date
}
```

#### OTP Verifications Collection
```javascript
{
  _id: ObjectId,
  phoneNumber: String,
  otp: String,
  expiresAt: Date,
  verified: Boolean,
  attempts: Number,
  createdAt: Date
}
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and login

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `DELETE /api/users/:userId` - Delete user account
- `GET /api/users/:userId/stats` - Get user statistics

### Business Profiles
- `POST /api/business-profiles` - Create business profile
- `GET /api/business-profiles/user/:userId` - Get business profile
- `PUT /api/business-profiles/user/:userId` - Update business profile

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - Get user bookings
- `GET /api/bookings/:bookingId` - Get specific booking
- `PUT /api/bookings/:bookingId` - Update booking
- `POST /api/bookings/:bookingId/cancel` - Cancel booking
- `GET /api/bookings/user/:userId/history` - Get booking history

### Favorites
- `POST /api/favorites` - Add to favorites
- `GET /api/favorites/user/:userId` - Get user favorites
- `DELETE /api/favorites/user/:userId/item/:itemId` - Remove from favorites

## Sample Backend Implementation

### Basic Express Server (app.js)

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const businessRoutes = require('./routes/business');
const bookingRoutes = require('./routes/bookings');
const favoriteRoutes = require('./routes/favorites');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/business-profiles', businessRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Deployment Options

### 1. Cloud Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS**: EC2 + RDS/DocumentDB
- **Google Cloud**: App Engine + Cloud Firestore
- **DigitalOcean**: Droplets + Managed MongoDB

### 2. Database Options
- **MongoDB Atlas**: Cloud-hosted MongoDB
- **Local MongoDB**: For development
- **AWS DocumentDB**: MongoDB-compatible
- **Google Cloud Firestore**: NoSQL alternative

## Security Considerations

1. **Authentication**: Use JWT tokens with proper expiration
2. **Rate Limiting**: Implement rate limiting for OTP requests
3. **Input Validation**: Validate all input data
4. **CORS**: Configure CORS properly for production
5. **Environment Variables**: Never commit sensitive data
6. **HTTPS**: Use HTTPS in production
7. **Database Security**: Use MongoDB authentication and encryption

## Testing

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## Monitoring and Logging

- Use services like LogRocket, Sentry, or Winston for logging
- Monitor API performance and errors
- Set up alerts for critical issues

## Next Steps

1. Set up the backend server using the provided structure
2. Configure MongoDB connection
3. Implement OTP service with Twilio or similar
4. Test all API endpoints
5. Deploy to production environment
6. Update the mobile app's API_BASE_URL in `services/authService.ts`

For detailed implementation examples, refer to the individual controller and model files in the backend repository.