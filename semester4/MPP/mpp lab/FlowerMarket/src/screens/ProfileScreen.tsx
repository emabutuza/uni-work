import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, Avatar, List, Switch, Divider, useTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { ProfileScreenProps } from '../navigation/types';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const theme = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    // In a real app, you would clear the auth token, etc.
    navigation.navigate('SignIn');
  };
  
  const handleLogin = () => {
    navigation.navigate('SignIn');
  };
  
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        <View style={styles.loginContainer}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome to FlowerMarket</Text>
          <Text style={styles.subtitleText}>Sign in to manage your account</Text>
          
          <Button 
            mode="contained" 
            onPress={handleLogin}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('CreateAccount')}
            style={styles.registerButton}
            contentStyle={styles.buttonContent}
          >
            Create Account
          </Button>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Ema Rose</Text>
            <Text style={styles.profileEmail}>emma.rose@gmail.com</Text>
            <TouchableOpacity 
              style={styles.editProfileButton}
              onPress={() => console.log('Edit profile')}
            >
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Account</Text>
          
          <List.Item
            title="My Orders"
            left={props => <List.Icon {...props} icon="shopping" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('My Orders')}
          />
          
          <List.Item
            title="Shipping Addresses"
            left={props => <List.Icon {...props} icon="map-marker" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Shipping Addresses')}
          />
          
          <List.Item
            title="Payment Methods"
            left={props => <List.Icon {...props} icon="credit-card" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Payment Methods')}
          />
          
          <List.Item
            title="My Reviews"
            left={props => <List.Icon {...props} icon="star" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('My Reviews')}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          
          <List.Item
            title="Language"
            description="English"
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Language')}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <List.Item
            title="Help Center"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Help Center')}
          />
          
          <List.Item
            title="Contact Us"
            left={props => <List.Icon {...props} icon="message" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log('Contact Us')}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Admin</Text>
          
          <List.Item
            title="Admin Dashboard"
            left={props => <List.Icon {...props} icon="view-dashboard" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('AdminDashboard')}
          />
          
          <List.Item
            title="Manage Flowers"
            left={props => <List.Icon {...props} icon="flower" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => navigation.navigate('AdminFlowerList')}
          />
        </View>
        
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
        >
          Log Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FF98B7',
  },
  subtitleText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 8,
  },
  registerButton: {
    width: '100%',
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#FF98B7',
    fontWeight: '500',
  },
  divider: {
    marginVertical: 16,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 16,
    borderColor: '#FF98B7',
    borderRadius: 8,
  },
}); 