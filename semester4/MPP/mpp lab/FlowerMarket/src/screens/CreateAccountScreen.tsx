import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText } from 'react-native-paper';
import { CreateAccountScreenProps } from '../navigation/types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function CreateAccountScreen({ navigation }: CreateAccountScreenProps) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleCreateAccount = () => {
    // Implement account creation logic
    // For now, just navigate to Home
    navigation.navigate('Home');
  };
  
  const isEmailValid = () => {
    return email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const isPasswordValid = () => {
    return password === '' || password.length >= 6;
  };
  
  const doPasswordsMatch = () => {
    return confirmPassword === '' || password === confirmPassword;
  };
  
  const isFormValid = () => {
    return (
      name.trim() &&
      email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password.length >= 6 &&
      password === confirmPassword
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Join FlowerMarket</Text>
        <Text style={styles.subtitle}>Create an account to start shopping for beautiful flowers</Text>
        
        <TextInput
          mode="outlined"
          label="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          outlineStyle={{ borderRadius: 8 }}
          left={<TextInput.Icon icon="account" />}
        />
        
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          outlineStyle={{ borderRadius: 8 }}
          left={<TextInput.Icon icon="email" />}
          error={email.trim() !== '' && !isEmailValid()}
        />
        {email.trim() !== '' && !isEmailValid() && (
          <HelperText type="error" visible={true}>
            Please enter a valid email address
          </HelperText>
        )}
        
        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          outlineStyle={{ borderRadius: 8 }}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          error={password !== '' && !isPasswordValid()}
        />
        {password !== '' && !isPasswordValid() && (
          <HelperText type="error" visible={true}>
            Password must be at least 6 characters
          </HelperText>
        )}
        
        <TextInput
          mode="outlined"
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={styles.input}
          outlineStyle={{ borderRadius: 8 }}
          left={<TextInput.Icon icon="lock-check" />}
          right={
            <TextInput.Icon
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          error={confirmPassword !== '' && !doPasswordsMatch()}
        />
        {confirmPassword !== '' && !doPasswordsMatch() && (
          <HelperText type="error" visible={true}>
            Passwords do not match
          </HelperText>
        )}
        
        <Button
          mode="contained"
          onPress={handleCreateAccount}
          style={styles.createButton}
          contentStyle={styles.buttonContent}
          disabled={!isFormValid()}
        >
          Create Account
        </Button>
        
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By creating an account, you agree to our{' '}
            <Text style={styles.link}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#FF98B7', // Light pink color
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  createButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  termsContainer: {
    marginTop: 24,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  link: {
    color: '#FF98B7',
    fontWeight: '500',
  },
}); 