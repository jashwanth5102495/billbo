import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Monitor } from 'lucide-react-native';

interface BillboardMarkerProps {
  isBlinking?: boolean;
}

export const BillboardMarker: React.FC<BillboardMarkerProps> = ({ isBlinking = false }) => {
  const styles = StyleSheet.create({
    container: {
      width: 40,
      height: 40,
      backgroundColor: isBlinking ? '#EC4899' : '#9333EA',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 8,
    },
    blinking: {
      opacity: isBlinking ? 0.7 : 1,
    },
  });

  return (
    <View style={[styles.container, isBlinking && styles.blinking]}>
      <Monitor size={20} color="#FFFFFF" />
    </View>
  );
};