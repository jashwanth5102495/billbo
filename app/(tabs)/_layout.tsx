import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, Star, CreditCard, Map, Search, ShoppingCart } from 'lucide-react-native';
import { useTheme } from './ThemeContext';
import { AuthGuard } from '../../components/AuthGuard';

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#2A2A2A',
            borderTopWidth: 0,
            height: 64,
            position: 'absolute',
            left: 20,
            right: 20,
            bottom: 16,
            borderRadius: 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 30,
            paddingHorizontal: 10,
            paddingVertical: 4,
          },
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, size }) => {
            let IconComponent;
            let iconColor = '#FFFFFF';

            switch (route.name) {
              case 'index':
                IconComponent = Home;
                break;
              case 'favorites':
                IconComponent = Star;
                break;
              case 'history':
                IconComponent = CreditCard;
                break;
              case 'maps':
                IconComponent = Map;
                break;
              case 'cart':
                IconComponent = ShoppingCart;
                break;
              default:
                IconComponent = Search;
            }

            if (focused) {
              return (
                <View style={{
                  width: 54,
                  height: 54,
                  borderRadius: 27,
                  backgroundColor: 'rgba(168, 85, 247, 0.95)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#A855F7',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                  <IconComponent size={24} color="#000000" />
                </View>
              );
            } else {
              return (
                <View style={{
                  width: 44,
                  height: 44,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <IconComponent size={24} color={iconColor} />
                </View>
              );
            }
          },
        })}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="maps"
          options={{
            title: 'Maps',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="videos"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="book-slot"
          options={{
            href: null, // This hides the tab from the tab bar
          }}
        />
        <Tabs.Screen
          name="availability"
          options={{
            href: null, // This hides the tab from the tab bar
          }}
        />
        <Tabs.Screen
          name="cart-context"
          options={{
            href: null, // This hides the tab from the tab bar
          }}
        />
        <Tabs.Screen
          name="ThemeContext"
          options={{
            href: null, // This hides the tab from the tab bar
          }}
        />
        <Tabs.Screen
          name="BookingContext"
          options={{
            href: null, // This hides the tab from the tab bar
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
