import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View, StatusBar, SafeAreaView, Platform } from 'react-native';
import NetworkStatusBar from './src/components/NetworkStatusBar';

// Define our custom theme colors based on Figma design
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2E8B57',
    accent: '#f1c40f',
    background: '#f8f8f8',
    surface: '#ffffff',
    error: '#D32F2F',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={theme.colors.background}
        />
        <SafeAreaView style={styles.safeArea}>
          <NetworkStatusBar />
          <AppNavigator />
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
