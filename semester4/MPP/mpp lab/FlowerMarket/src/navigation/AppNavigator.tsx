import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// @ts-ignore
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import EventBouquetsScreen from '../screens/EventBouquetsScreen';
import FlowerDetailScreen from '../screens/FlowerDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import ChatScreen from '../screens/ChatScreen';
import SignInScreen from '../screens/SignInScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminFlowerListScreen from '../screens/AdminFlowerListScreen';
import AdminAddFlowerScreen from '../screens/AdminAddFlowerScreen';
import AdminEditFlowerScreen from '../screens/AdminEditFlowerScreen';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FlowerListScreen from '../screens/FlowerListScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
type MainTabParamList = {
  HomeTab: undefined;
  CartTab: undefined;
  TrackOrderTab: { orderId: string };
  ChatTab: undefined;
  ProfileTab: undefined;
  FlowerList: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName;
          
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CartTab') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'TrackOrderTab') {
            iconName = focused ? 'location' : 'location-outline';
          } else if (route.name === 'ChatTab') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen 
        name="TrackOrderTab" 
        component={TrackOrderScreen} 
        initialParams={{ orderId: '' }}
        options={{ tabBarLabel: 'Track' }}
      />
      <Tab.Screen 
        name="ChatTab" 
        component={ChatScreen}
        options={{ tabBarLabel: 'Chat' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
        backgroundColor: 'white',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
        fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="FlowerList" 
          component={FlowerListScreen}
          options={{
            title: 'Flowers',
            headerShown: true
          }}
        />
        <Stack.Screen 
          name="EventBouquets" 
          component={EventBouquetsScreen}
          options={({ route }) => ({ 
        title: route.params.event,
        headerShown: true
          })}
        />
        <Stack.Screen 
          name="FlowerDetail" 
          component={FlowerDetailScreen} 
          options={{ headerShown: true, title: '' }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{ title: 'Cart' }}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen} 
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen 
          name="TrackOrder" 
          component={TrackOrderScreen} 
          options={{ title: 'Track Order' }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'Customer Support' }}
        />
        <Stack.Screen 
          name="SignIn" 
          component={SignInScreen} 
          options={{ 
        headerShown: false,
        presentation: 'modal'
          }}
        />
        <Stack.Screen 
          name="CreateAccount" 
          component={CreateAccountScreen} 
          options={{ 
        headerShown: false,
        presentation: 'modal'
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
        headerShown: false
          }}
        />
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboardScreen} 
          options={{ 
        title: 'Admin Dashboard',
        headerShown: true
          }}
        />
        <Stack.Screen 
          name="AdminFlowerList" 
          component={AdminFlowerListScreen} 
          options={{ 
        title: 'Flower Management',
        headerShown: true
          }}
        />
        <Stack.Screen 
          name="AdminAddFlower" 
          component={AdminAddFlowerScreen} 
          options={{ 
        title: 'Add New Flower',
        headerShown: true
          }}
        />
        <Stack.Screen 
          name="AdminEditFlower" 
          component={AdminEditFlowerScreen} 
          options={{ 
        title: 'Edit Flower',
        headerShown: true
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 