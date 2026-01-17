import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode } from 'expo-av';
import type { AVPlaybackStatus } from 'expo-av';
import { useTheme } from './(tabs)/ThemeContext';

export default function IntroScreen() {
  const { isDarkMode } = useTheme();
  const videoRef = useRef<Video | null>(null);
  const hasNavigatedRef = useRef(false);
  const [isBuffering, setIsBuffering] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000000' : '#000000',
      justifyContent: 'center',
      alignItems: 'center',
    },
    video: {
      ...StyleSheet.absoluteFillObject,
    },
    loadingOverlay: {
      position: 'absolute',
      bottom: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const navigateToLogin = useCallback(async () => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;
    try {
      await AsyncStorage.setItem('has_seen_intro_v1', 'true');
    } catch (_error) {
      // ignore, still continue to login
    }
    router.replace('/auth/login');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasNavigatedRef.current) {
        navigateToLogin();
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [navigateToLogin]);

  const handleStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsBuffering(true);
      return;
    }

    setIsBuffering(status.isBuffering ?? false);

    if ('didJustFinish' in status && status.didJustFinish) {
      navigateToLogin();
    }
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../public/intro.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={handleStatusUpdate}
      />
      {(isBuffering) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#A855F7" />
        </View>
      )}
    </View>
  );
}
