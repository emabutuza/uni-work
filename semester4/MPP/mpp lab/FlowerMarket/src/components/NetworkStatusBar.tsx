import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { API_CONFIG } from '../config/api';

type NetworkStatus = 'online' | 'offline' | 'server-down';

const NetworkStatusBar = () => {
  const [status, setStatus] = useState<NetworkStatus>('online');
  const [visible, setVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Setup network status listener
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (!state.isConnected) {
        setStatus('offline');
        showStatusBar();
      } else {
        // Check if server is reachable
        try {
          const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (response.ok) {
            setStatus('online');
            // Only hide the status bar if we're transitioning from offline/server-down
            if (status !== 'online') {
              // Show "Back Online" briefly before hiding
              showStatusBar();
              setTimeout(() => hideStatusBar(), 2000);
            }
          } else {
            setStatus('server-down');
            showStatusBar();
          }
        } catch (error) {
          setStatus('server-down');
          showStatusBar();
        }
      }
    });

    // Check initial status
    checkNetworkStatus();

    return () => {
      unsubscribe();
    };
  }, [status]);

  const checkNetworkStatus = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      setStatus('offline');
      showStatusBar();
    } else {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);
        if (response.ok) {
          setStatus('online');
          hideStatusBar();
        } else {
          setStatus('server-down');
          showStatusBar();
        }
      } catch (error) {
        setStatus('server-down');
        showStatusBar();
      }
    }
  };

  const showStatusBar = () => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideStatusBar = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  if (!visible && status === 'online') {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        status === 'online' ? styles.online : status === 'offline' ? styles.offline : styles.serverDown,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={styles.text}>
        {status === 'online'
          ? 'Back Online - Syncing data...'
          : status === 'offline'
          ? 'You are offline - Changes will be saved locally'
          : 'Server is unreachable - Using cached data'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  online: {
    backgroundColor: '#4CAF50',
  },
  offline: {
    backgroundColor: '#FF9800',
  },
  serverDown: {
    backgroundColor: '#F44336',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NetworkStatusBar; 