import React, { useCallback, useEffect, useMemo, useRef, useContext, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Platform, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './(tabs)/ThemeContext';
import { CartContext } from './(tabs)/cart-context';
import { useBookings } from './(tabs)/BookingContext';
import { videoStorageService } from '../services/videoStorageService';
import { videoModerationService } from '../services/videoModerationService';

const RAZORPAY_KEY_ID = 'rzp_test_NyLZPzYHIYtxqW';

// Helper to parse time string
const parseTime = (timeStr: string) => {
  if (!timeStr) return { start: '00:00', end: '23:59' };
  if (timeStr.includes('Full Day') || timeStr.includes('24 Hours')) return { start: '00:00', end: '23:59' };
  
  // "6:00 AM - 12:00 PM"
  const parts = timeStr.split('-').map(s => s.trim());
  if (parts.length !== 2) return { start: '00:00', end: '23:59' };
  
  const convertTo24Hour = (t: string) => {
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return '00:00';
    let [_, hours, minutes, period] = match;
    let h = parseInt(hours);
    if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (period.toUpperCase() === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minutes}`;
  };
  
  return {
    start: convertTo24Hour(parts[0]),
    end: convertTo24Hour(parts[1])
  };
};

export default function RazorpayCheckoutScreen() {
  const { isDarkMode } = useTheme();
  const params = useLocalSearchParams();
  const webviewRef = useRef(null);
  const { clearCart } = useContext(CartContext);
  const { addBooking, updateBookingStatus } = useBookings();
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Get booking details from params
  const { pkg, date, slot, cart, total } = params;
  const packageObj = useMemo(() => {
    try {
      return pkg ? JSON.parse(decodeURIComponent(pkg as string)) : null;
    } catch {
      return null;
    }
  }, [pkg]);

  const cartObj = useMemo(() => {
    try {
      return cart ? JSON.parse(decodeURIComponent(cart as string)) : null;
    } catch {
      return null;
    }
  }, [cart]);

  // Calculate amount
  let amount = 10000; // Default
  if (packageObj) {
    amount = parseInt(packageObj.price.replace('₹', '')) * 100;
  } else if (total) {
    amount = parseInt(total as string) * 100;
  }

  // Prepare description
  const description = packageObj ? packageObj.desc : (cartObj ? `${cartObj.length} items in cart` : 'Booking Payment');
  const name = packageObj ? packageObj.name : 'Cart Checkout';

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: isDarkMode ? '#111' : '#F3F4F6',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        },
        card: {
          width: '100%',
          maxWidth: 420,
          borderRadius: 14,
          padding: 18,
          backgroundColor: isDarkMode ? '#0B1220' : '#FFFFFF',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 30,
          elevation: 6,
        },
        title: {
          fontSize: 16,
          fontWeight: '700',
          color: isDarkMode ? '#FFFFFF' : '#111827',
          marginBottom: 8,
        },
        subtitle: {
          fontSize: 13,
          color: isDarkMode ? '#9CA3AF' : '#6B7280',
          marginBottom: 16,
          lineHeight: 18,
        },
        button: {
          width: '100%',
          borderRadius: 10,
          paddingVertical: 12,
          paddingHorizontal: 14,
          backgroundColor: '#2563EB',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
        buttonDisabled: {
          opacity: 0.7,
        },
        buttonText: {
          color: '#FFFFFF',
          fontWeight: '700',
          fontSize: 15,
        },
        spinner: {
          marginRight: 10,
        },
      }),
    [isDarkMode]
  );

  const onPaymentResult = useCallback(
    async (data: { success: boolean; payment_id?: string }) => {
      if (data.success) {
        // Add to history and keep track of booking IDs
        const bookingIds: string[] = [];
        
        // Items to process (either from cart or single package)
        const itemsToProcess = [];
        if (cartObj && Array.isArray(cartObj) && cartObj.length > 0) {
          itemsToProcess.push(...cartObj);
        } else if (packageObj) {
          itemsToProcess.push({
            ...packageObj,
            date: date || '',
            time: slot || '',
          });
        }
        
        console.log('Items to process for backend:', JSON.stringify(itemsToProcess, null, 2));

        // 1. Create Backend Bookings
        try {
          const token = await AsyncStorage.getItem('authToken');
          const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';
          
          console.log('Backend API URL:', API_URL);
          
          for (const item of itemsToProcess) {
             const timeData = parseTime(item.time || item.slotTime || '');
             
             // Clean price - safely parse currency string
             // e.g. "₹444.00" -> 444
             const priceString = (item.price || '0').toString().replace(/[^0-9.]/g, '');
             const priceNum = Math.round(parseFloat(priceString));
             
             // Upload video if present
             let videoUrl = item.videoUri || 'https://example.com/placeholder.mp4';
             let moderationStatus = 'pending';
             let moderationNotes = '';

             if (item.videoUri && item.videoUri.startsWith('file://')) {
                try {
                  const formData = new FormData();
                  formData.append('video', {
                    uri: item.videoUri,
                    name: 'video.mp4',
                    type: 'video/mp4'
                  } as any);

                  console.log('Uploading video...');
                  const uploadRes = await fetch(`${API_URL}/upload/video`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      // 'Content-Type': 'multipart/form-data', // Let fetch set boundary
                    },
                    body: formData
                  });
                  
                  const uploadData = await uploadRes.json();
                  if (uploadData.success) {
                    console.log('Video uploaded successfully:', uploadData);
                    videoUrl = uploadData.url; // Use the server URL (e.g. /uploads/videos/...)
                    // If server returns relative path, prepend API_URL base if needed, 
                    // but usually backend saves relative or absolute URL. 
                    // Let's assume backend returns relative path and we might need to prepend base URL for display,
                    // but for saving in DB, relative path is fine if backend serves it.
                    
                    moderationStatus = uploadData.moderationStatus || 'pending';
                    moderationNotes = uploadData.moderationNotes || '';
                  } else {
                    console.error('Video upload failed:', uploadData);
                    Alert.alert('Upload Error', 'Failed to upload video. Booking will proceed with local reference.');
                  }
                } catch (uploadErr) {
                  console.error('Video upload exception:', uploadErr);
                }
             }

             // Parse Date
             let startDate = new Date();
             if (item.date) {
               startDate = new Date(item.date);
               if (isNaN(startDate.getTime())) {
                 startDate = new Date(); 
               }
             }

             const payload = {
               bookingType: 'play-ad',
               billboardId: item.billboardId,
               billboardName: item.billboardName || item.name || 'Billboard',
               location: item.location || 'Unknown Location',
               startDate: startDate.toISOString(),
               endDate: startDate.toISOString(),
               startTime: timeData.start,
               endTime: timeData.end,
               duration: 1, 
               videoDuration: item.duration || 0,
               reputation: item.reputation || 40,
               price: priceNum,
               content: {
                 type: 'video',
                 url: videoUrl,
                 text: item.desc || '',
                 moderationStatus: moderationStatus,
                 moderationNotes: moderationNotes
               },
               status: 'confirmed',
               paymentStatus: 'paid',
               paymentId: data.payment_id,
               razorpayPaymentId: data.payment_id
             };
             
             console.log('Creating booking:', payload);

             const response = await fetch(`${API_URL}/bookings`, {
               method: 'POST',
               headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify(payload)
             });
             
             const resData = await response.json();
             if (!resData.success) {
               console.error('Backend booking creation failed:', resData);
               Alert.alert('Booking Error', `Failed to save booking: ${resData.message || 'Unknown error'}`);
             } else {
               console.log('Backend booking created:', resData);
             }
          }
        } catch (err) {
           console.error('Failed to sync booking to backend', err);
           Alert.alert('Connection Error', `Failed to connect to server at ${Platform.OS === 'android' ? '10.0.2.2' : 'localhost'}. Check your network or backend.`);
        }

        // 2. Local Context Updates
        if (cartObj && Array.isArray(cartObj) && cartObj.length > 0) {
          cartObj.forEach((item) => {
             const id = addBooking({
               type: 'ad',
               title: item.name || 'Ad Booking',
               location: item.location || 'Selected Location',
               dateRange: `${item.date || ''} ${item.time || ''}`.trim() || 'Scheduled',
               amount: item.price || '₹0',
               status: 'Under Review',
               color: '#F59E0B',
             });
             bookingIds.push(id);
          });
        } else if (packageObj) {
           const id = addBooking({
               type: 'ad',
               title: packageObj.name,
               location: packageObj.location || 'Selected Location',
               dateRange: `${date || ''} ${slot || ''}`.trim() || 'Scheduled',
               amount: packageObj.price,
               status: 'Under Review',
               color: '#F59E0B',
           });
           bookingIds.push(id);
        }

        if (cartObj && Array.isArray(cartObj) && cartObj.length > 0) {
          for (const [index, item] of cartObj.entries()) {
            if (!item?.videoUri) continue;

            if (Platform.OS === 'web') {
              videoModerationService.moderateVideoSimple(item.videoUri).then((modResult) => {
                const status = modResult.approved ? 'Approved' : 'Rejected';
                if (bookingIds[index]) {
                  updateBookingStatus(bookingIds[index], status);
                }
              });
              continue;
            }

            if (!data.payment_id) continue;
            const storageResult = await videoStorageService.storeVideo(
              item.videoUri,
              'current_user',
              `${data.payment_id}_${index}`,
              item.name
            );

            if (storageResult.success && storageResult.id) {
              videoModerationService.moderateVideoSimple(item.videoUri).then(async (modResult) => {
                const status = modResult.approved ? 'Approved' : 'Rejected';
                await videoStorageService.updateVideoStatus(storageResult.id as string, status.toLowerCase() as any, {
                  reason: modResult.reason,
                });
                if (bookingIds[index]) {
                  updateBookingStatus(bookingIds[index], status);
                }
              });
            }
          }
        }

        if (cart || total) {
          clearCart();
        }
        router.replace('/(tabs)/history');
      } else {
        Alert.alert('Cancelled', 'Payment Cancelled');
        router.back();
      }
    },
    [cart, cartObj, clearCart, total, date, slot, packageObj, addBooking, updateBookingStatus]
  );

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const win = window as any;
    if (win?.Razorpay) {
      setIsScriptReady(true);
      return;
    }

    const existing = document.getElementById('razorpay-checkout-js');
    if (existing) {
      existing.addEventListener('load', () => setIsScriptReady(true), { once: true } as any);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptReady(true);
    script.onerror = () => setIsScriptReady(false);
    document.body.appendChild(script);
  }, []);

  const openRazorpayWeb = useCallback(() => {
    if (Platform.OS !== 'web') return;
    const win = window as any;
    if (!win?.Razorpay) {
      Alert.alert('Payment Unavailable', 'Razorpay failed to load. Please try again.');
      return;
    }

    setIsPaying(true);
    const options = {
      key: RAZORPAY_KEY_ID,
      amount,
      currency: 'INR',
      name,
      description,
      prefill: {
        email: 'user@email.com',
        contact: '9999999999',
        name: 'Test User',
      },
      theme: { color: '#111' },
      handler: (response: any) => {
        setIsPaying(false);
        onPaymentResult({ success: true, payment_id: response?.razorpay_payment_id });
      },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
          onPaymentResult({ success: false });
        },
      },
    };

    const rzp = new win.Razorpay(options);
    rzp.open();
  }, [amount, description, name, onPaymentResult]);

  // Prepare HTML for Razorpay Checkout (mobile WebView)
  const htmlContent = `
    <html>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <script src='https://checkout.razorpay.com/v1/checkout.js'></script>
        <style>
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .container { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box; }
          .card { width: 100%; max-width: 420px; border-radius: 14px; padding: 18px; background: ${isDarkMode ? '#0B1220' : '#FFFFFF'}; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
          .title { font-size: 16px; font-weight: 700; color: ${isDarkMode ? '#FFFFFF' : '#111827'}; margin: 0 0 8px 0; }
          .subtitle { font-size: 13px; color: ${isDarkMode ? '#9CA3AF' : '#6B7280'}; margin: 0 0 16px 0; line-height: 18px; }
          .btn { width: 100%; border: 0; border-radius: 10px; padding: 12px 14px; background: #2563EB; color: #FFFFFF; font-weight: 700; font-size: 15px; cursor: pointer; }
          .btn:active { opacity: 0.9; }
        </style>
      </head>
      <body style='background:${isDarkMode ? '#111' : '#F3F4F6'};'>
        <div class="container">
          <div class="card">
            <p class="title">Complete Payment</p>
            <p class="subtitle">${description}</p>
            <button id="payBtn" class="btn">Pay ₹${(amount / 100).toFixed(0)}</button>
          </div>
        </div>
        <script>
          function sendMessage(payload) {
            try {
              var msg = JSON.stringify(payload);
              if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(msg);
              } else if (window.parent && window.parent.postMessage) {
                window.parent.postMessage(msg, '*');
              }
            } catch (e) {}
          }

          function openRazorpay() {
            var options = {
              key: '${RAZORPAY_KEY_ID}',
              amount: ${amount},
              currency: 'INR',
              name: '${name}',
              description: '${description}',
              prefill: {
                email: 'user@email.com',
                contact: '9999999999',
                name: 'Test User'
              },
              theme: { color: '#111' },
              handler: function (response){
                sendMessage({ success: true, payment_id: response.razorpay_payment_id });
              },
              modal: {
                ondismiss: function() {
                  sendMessage({ success: false });
                }
              }
            };
            var rzp = new Razorpay(options);
            rzp.open();
          }
          document.getElementById('payBtn').addEventListener('click', openRazorpay);
        </script>
      </body>
    </html>
  `;

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && typeof data.success === 'boolean') {
        await onPaymentResult(data);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Complete Payment</Text>
            <Text style={styles.subtitle}>{description}</Text>
            <TouchableOpacity
              style={[styles.button, (!isScriptReady || isPaying) ? styles.buttonDisabled : null]}
              onPress={openRazorpayWeb}
              disabled={!isScriptReady || isPaying}
            >
              {isPaying ? <ActivityIndicator style={styles.spinner} size="small" color="#FFFFFF" /> : null}
              <Text style={styles.buttonText}>Pay ₹{(amount / 100).toFixed(0)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          onMessage={handleMessage}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="#111" />
          )}
        />
      )}
    </View>
  );
} 
