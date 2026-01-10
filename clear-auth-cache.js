// Clear authentication cache for fresh start
console.log('Clearing authentication cache...');

// For web browsers, clear localStorage
if (typeof window !== 'undefined' && window.localStorage) {
  window.localStorage.removeItem('authToken');
  window.localStorage.removeItem('userData');
  window.localStorage.removeItem('businessProfile');
  console.log('✅ Browser localStorage cleared');
}

// For React Native AsyncStorage (when running on mobile)
if (typeof require !== 'undefined') {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    AsyncStorage.multiRemove(['authToken', 'userData', 'businessProfile'])
      .then(() => console.log('✅ AsyncStorage cleared'))
      .catch(err => console.log('AsyncStorage clear error:', err));
  } catch (e) {
    console.log('AsyncStorage not available (web environment)');
  }
}

console.log('Authentication cache cleared. Please refresh the app.');