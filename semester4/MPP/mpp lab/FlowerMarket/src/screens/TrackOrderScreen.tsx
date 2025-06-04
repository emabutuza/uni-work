import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme, Button, Divider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { TrackOrderScreenProps } from '../navigation/types';
import { FlowerService } from '../services/FlowerService';

export default function TrackOrderScreen({ route, navigation }: TrackOrderScreenProps) {
  const theme = useTheme();
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, this would make an API call to get order details
    if (orderId) {
      FlowerService.getOrderById(orderId).then((orderData: any) => {
        if (orderData) {
          setOrder(orderData);
        }
      });
    }
  }, [orderId]);
  
  if (!order && orderId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <Text style={styles.searchText}>Order #{orderId || "123456"}</Text>
        </View>
        <TouchableOpacity style={styles.dateContainer}>
          <Text style={styles.dateText}>Today, 23 Mar</Text>
          <Ionicons name="calendar-outline" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map View</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            (Map visualization is currently unavailable)
          </Text>
        </View>
      </View>
      
      <View style={styles.infoCard}>
        <View style={styles.deliveryInfo}>
          <View style={styles.deliveryStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>In Delivery</Text>
          </View>
          <Text style={styles.deliveryTime}>Estimated delivery: 5:40 PM</Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
          <View style={styles.addressInfo}>
            <Text style={styles.addressTitle}>Delivery Address</Text>
            <Text style={styles.addressText}>123 Main Street, Cluj-Napoca</Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceTitle}>Total</Text>
          <Text style={styles.priceValue}>$49.99</Text>
        </View>
        
        <Button 
          mode="contained" 
          style={styles.button}
          onPress={() => navigation.navigate('Chat')}
        >
          Contact Driver
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchText: {
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginRight: 6,
    fontSize: 14,
  },
  mapContainer: {
    height: 250,
    width: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  infoCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
    padding: 20,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
  },
  deliveryInfo: {
    marginBottom: 16,
  },
  deliveryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 18,
  },
  divider: {
    marginVertical: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressInfo: {
    marginLeft: 12,
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 8,
  },
}); 