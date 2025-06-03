import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { SignInScreenProps } from '../navigation/types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen({ navigation }: SignInScreenProps) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  
  const handleCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };
  
  const handleSignIn = () => {
    // Handle sign in logic
  };
  
  const handleGoogleSignIn = () => {
    // Handle Google sign in
  };
  
  const handleAppleSignIn = () => {
    // Handle Apple sign in
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.content}>
        <Text style={styles.title}>FlowerMarket</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.createAccountText}>Sign In</Text>
          <Text style={styles.subtitle}>Enter your email to sign in to your account</Text>
          
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            outlineStyle={{ borderRadius: 4 }}
            style={styles.input}
          />
          
          <Button
            mode="contained"
            onPress={handleSignIn}
            style={styles.signInButton}
            disabled={!email.trim().includes('@')}
          >
            Continue
          </Button>
          
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.divider} />
          </View>
          
          <TouchableOpacity 
            style={[styles.socialButton, styles.googleButton]}
            onPress={handleGoogleSignIn}
          >
            <Image 
              source={{ uri: 'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, styles.appleButton]}
            onPress={handleAppleSignIn}
          >
            <Ionicons name="logo-apple" size={20} color="#000" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
          
          <Button
            mode="text"
            onPress={handleCreateAccount}
            style={styles.createAccountButton}
          >
            New to FlowerMarket? Create an account
          </Button>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By clicking continue, you agree to our {' '}
              <Text style={styles.link}>Terms of Service</Text>
              {' '} and {' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF98B7', // Light pink color from Figma
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  createAccountText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  signInButton: {
    borderRadius: 4,
    paddingVertical: 8,
    marginBottom: 20,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingVertical: 12,
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: '#fff',
  },
  appleButton: {
    backgroundColor: '#fff',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  createAccountButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  termsContainer: {
    marginTop: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#2E8B57',
    fontWeight: '500',
  },
}); 