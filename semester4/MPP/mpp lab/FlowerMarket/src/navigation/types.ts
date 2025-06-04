import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  HomeTab: undefined;
  CartTab: undefined;
  TrackOrderTab: { orderId: string };
  ChatTab: undefined;
  ProfileTab: undefined;
  EventBouquets: { event: string };
  FlowerDetail: { flowerId: string };
  Cart: undefined;
  Checkout: undefined;
  TrackOrder: { orderId: string };
  Chat: undefined;
  SignIn: undefined;
  CreateAccount: undefined;
  Profile: undefined;
  
  // Admin screens
  AdminDashboard: undefined;
  AdminFlowerList: undefined;
  AdminAddFlower: undefined;
  AdminEditFlower: { flowerId: string };
  FlowerList: { title: string; initialFlowers: import('../models/Flower').Flower[] };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeTab' | 'Home'>;
export type EventBouquetsScreenProps = NativeStackScreenProps<RootStackParamList, 'EventBouquets'>;
export type FlowerDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'FlowerDetail'>;
export type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'CartTab' | 'Cart'>;
export type CheckoutScreenProps = NativeStackScreenProps<RootStackParamList, 'Checkout'>;
export type TrackOrderScreenProps = NativeStackScreenProps<RootStackParamList, 'TrackOrderTab' | 'TrackOrder'>;
export type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'ChatTab' | 'Chat'>;
export type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;
export type CreateAccountScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateAccount'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileTab' | 'Profile'>;

// Admin screen props
export type AdminDashboardScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminDashboard'>;
export type AdminFlowerListScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminFlowerList'>;
export type AdminAddFlowerScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminAddFlower'>;
export type AdminEditFlowerScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminEditFlower'>; 