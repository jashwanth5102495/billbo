import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { CartContext } from './cart-context';
import { useTheme } from './ThemeContext';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Upload, CheckCircle, Video } from 'lucide-react-native';

export default function CartScreen() {
  const { isDarkMode } = useTheme();
  const { cart, removeFromCart, updateCartItem } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + parseInt(item.price.replace('₹', '')), 0);

  const handleUploadVideo = async (index: number) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your media library to upload content.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      updateCartItem(index, { videoUri: result.assets[0].uri });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#111' : '#F8FAFC',
      paddingTop: 32,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
      marginHorizontal: 20,
      marginBottom: 20,
    },
    itemCard: {
      backgroundColor: isDarkMode ? '#18181b' : '#fff',
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    itemName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
    },
    itemTime: {
      color: isDarkMode ? '#d1d5db' : '#6B7280',
      marginTop: 2,
    },
    itemDesc: {
      color: isDarkMode ? '#bbb' : '#444',
      marginTop: 4,
      marginBottom: 8,
    },
    itemPrice: {
      color: isDarkMode ? '#fff' : '#222',
      fontWeight: 'bold',
      fontSize: 15,
      marginBottom: 8,
    },
    removeButton: {
      backgroundColor: '#EF4444',
      borderRadius: 8,
      paddingVertical: 6,
      alignItems: 'center',
      marginTop: 8,
      flex: 1,
      marginLeft: 8,
    },
    removeButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    uploadButton: {
      backgroundColor: '#3B82F6',
      borderRadius: 8,
      paddingVertical: 6,
      alignItems: 'center',
      marginTop: 8,
      flex: 1,
      marginRight: 8,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    uploadButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
      marginLeft: 4,
    },
    videoUploaded: {
      backgroundColor: '#10B981',
    },
    actionsRow: {
      flexDirection: 'row',
      marginTop: 8,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 20,
      marginTop: 24,
      marginBottom: 16,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#222',
    },
    checkoutButton: {
      backgroundColor: '#111',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 32,
    },
    checkoutButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 17,
    },
    emptyText: {
      color: isDarkMode ? '#bbb' : '#444',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 60,
    },
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty');
      return;
    }

    // Check if all items have videos
    const missingVideos = cart.some(item => !item.videoUri);
    if (missingVideos) {
      Alert.alert(
        'Missing Videos',
        'Some items in your cart do not have a video uploaded. Please upload a video for each slot before checking out.',
        [
          { text: 'OK' }
        ]
      );
      return;
    }

    router.push(`/razorpay-checkout?cart=${encodeURIComponent(JSON.stringify(cart))}&total=${total}` as any);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty. Add some packages!</Text>
      ) : (
        <>
          {cart.map((item, idx) => (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemTime}>{item.time} | {item.date}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
              
              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  style={[styles.uploadButton, item.videoUri ? styles.videoUploaded : null]} 
                  onPress={() => handleUploadVideo(idx)}
                >
                  {item.videoUri ? (
                    <>
                      <CheckCircle size={16} color="#fff" />
                      <Text style={styles.uploadButtonText}>Video Added</Text>
                    </>
                  ) : (
                    <>
                      <Upload size={16} color="#fff" />
                      <Text style={styles.uploadButtonText}>Upload Video</Text>
                    </>
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(idx)}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹{total}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout & Pay</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
} 