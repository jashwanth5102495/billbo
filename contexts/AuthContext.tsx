import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, User, BusinessProfile } from '../services/authService';

interface AuthContextType {
  user: User | null;
  userType: 'business' | 'billboard' | null;
  businessProfile: BusinessProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, credential: string, userType?: 'business' | 'billboard') => Promise<boolean>;
  sendOTP: (phoneNumber: string) => Promise<boolean>;
  skipOTPLogin: (phoneNumber: string, userType?: 'business' | 'billboard') => Promise<boolean>;
  logout: () => Promise<void>;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'business' | 'billboard' | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      const storedUserType = await AsyncStorage.getItem('userType') as 'business' | 'billboard' | null;
      const profileData = await AsyncStorage.getItem('businessProfile');

      if (token && userData) {
        setUser(JSON.parse(userData));
        setUserType(storedUserType || 'business'); // Default to business for backward compatibility
        if (profileData) {
          setBusinessProfile(JSON.parse(profileData));
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    try {
      return await authService.sendOTP(phoneNumber);
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  };

  const login = async (identifier: string, credential: string, type: 'business' | 'billboard' = 'business'): Promise<boolean> => {
    try {
      const result = await authService.login(identifier, credential, type);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setUserType(type);
        await AsyncStorage.setItem('authToken', result.token);
        await AsyncStorage.setItem('userData', JSON.stringify(result.user));
        await AsyncStorage.setItem('userType', type);
        
        // Load business profile if exists
        if (result.businessProfile) {
          setBusinessProfile(result.businessProfile);
          await AsyncStorage.setItem('businessProfile', JSON.stringify(result.businessProfile));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const skipOTPLogin = async (phoneNumber: string, type: 'business' | 'billboard' = 'business'): Promise<boolean> => {
    try {
      const result = await authService.skipOTP(phoneNumber);
      if (result.success && result.user && result.token) {
        setUser(result.user);
        setUserType(type);
        await AsyncStorage.setItem('authToken', result.token);
        await AsyncStorage.setItem('userData', JSON.stringify(result.user));
        await AsyncStorage.setItem('userType', type);
        
        // Load business profile if exists
        if (result.businessProfile) {
          setBusinessProfile(result.businessProfile);
          await AsyncStorage.setItem('businessProfile', JSON.stringify(result.businessProfile));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Skip OTP login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('AuthContext: Starting logout...');
      console.log('AuthContext: Current user:', user?.phoneNumber);
      
      // Clear all authentication data from AsyncStorage
      await AsyncStorage.multiRemove(['authToken', 'userData', 'businessProfile', 'userType']);
      console.log('AuthContext: AsyncStorage cleared');
      
      // Clear state immediately
      setUser(null);
      setUserType(null);
      setBusinessProfile(null);
      console.log('AuthContext: User and business profile set to null');
      console.log('AuthContext: isAuthenticated should now be:', false);
      
      // Force a small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, clear the state
      setUser(null);
      setUserType(null);
      setBusinessProfile(null);
    }
  };

  const updateBusinessProfile = async (profile: Partial<BusinessProfile>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      console.log('🔄 Updating business profile for user:', user.id);
      console.log('🔄 Profile data:', profile);
      
      const result = await authService.updateBusinessProfile(user.id, profile);
      if (result.success && result.profile) {
        console.log('✅ Business profile updated successfully:', result.profile);
        setBusinessProfile(result.profile);
        await AsyncStorage.setItem('businessProfile', JSON.stringify(result.profile));
        return true;
      }
      console.log('❌ Failed to update business profile:', result.message);
      return false;
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return false;
    }
  };

  const refreshProfile = async (): Promise<void> => {
    try {
      if (!user) return;
      
      console.log('🔄 Refreshing business profile for user:', user.id);
      
      const profile = await authService.getBusinessProfile(user.id);
      if (profile) {
        console.log('✅ Business profile refreshed:', profile);
        setBusinessProfile(profile);
        await AsyncStorage.setItem('businessProfile', JSON.stringify(profile));
      } else {
        console.log('ℹ️ No business profile found for user');
        setBusinessProfile(null);
        await AsyncStorage.removeItem('businessProfile');
      }
    } catch (error) {
      console.error('❌ Refresh profile error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    userType,
    businessProfile,
    isLoading,
    isAuthenticated: !!user,
    login,
    sendOTP,
    skipOTPLogin,
    logout,
    updateBusinessProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};