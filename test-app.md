# App Testing Guide

## Current Status
✅ Backend server started on http://localhost:3000/api
✅ Frontend server started on http://localhost:8083
✅ Maps feature implemented with billboard locations
✅ Navigation bar with exact UI design
✅ Dark theme as default
✅ Custom packages with "Coming Soon" message

## Testing Steps

### 1. Authentication Flow
- Open http://localhost:8083 in your browser
- You should see the login screen first
- Enter any phone number (e.g., 9876543210)
- Click "Send OTP"
- Enter any 4-digit OTP (e.g., 1234)
- Should navigate to home screen

### 2. Navigation Bar
- Check the bottom navigation bar
- Should have dark background (#2A2A2A)
- Active tab should have green circle (#9AFF9A)
- Inactive tabs should have white icons

### 3. Maps Feature
- Click on the Maps tab (4th icon from left)
- Should show "Billboard Locations" screen
- Should display 6 billboard locations in Bengaluru
- Icons should blink every second
- Should show coordinates and status for each location

### 4. Custom Packages
- Go to any booking screen (Play Ad)
- Should see "Custom Package" option with purple styling
- Should show "Coming Soon" message when clicked

### 5. Dark Theme
- Entire app should use dark theme by default
- Background should be black (#000000)
- Text should be white/light colors

## Features Implemented
- ✅ Google Maps-like scrollable maps with billboard icons
- ✅ Back button in maps for navigation
- ✅ Dark theme as default throughout the app
- ✅ Custom package option with "Coming Soon" message
- ✅ Exact navigation bar UI matching provided image
- ✅ Interactive green circle for active tabs
- ✅ Web-compatible maps implementation (no server errors)

## Next Steps
If you encounter any issues:
1. Clear browser cache (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify both servers are running
4. Test authentication flow first