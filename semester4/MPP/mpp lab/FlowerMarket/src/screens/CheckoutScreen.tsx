import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, TextInput, Divider, useTheme } from 'react-native-paper';
import { CheckoutScreenProps } from '../navigation/types';
import { FlowerService } from '../services/FlowerService';
import { CartItem } from '../models/Flower';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutScreen({ navigation }: CheckoutScreenProps) {
  const theme = useTheme();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Free\nStandard | 3-4 days');
  const [paymentMethod, setPaymentMethod] = useState('Visa *1234');
  
  useEffect(() => {
    // Get cart items
    setCart(FlowerService.getCart());
  }, []);
  
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.flower.price * item.quantity), 0);
  };
  
  const calculateShipping = () => {
    return 0; // Free shipping
  };
  
  const calculateTax = () => {
    return 2; // Fixed $2 tax
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };
  
  const handlePlaceOrder = () => {
    console.log("Attempting to place order with:", {
      cartItems: cart.length,
      shippingAddress,
      deliveryMethod,
      paymentMethod
    });
    
    if (cart.length === 0) {
      console.error("Cannot place order: Cart is empty");
      Alert.alert("Error", "Your cart is empty. Please add items before checking out.");
      return;
    }
    
    if (!shippingAddress) {
      console.error("Cannot place order: No shipping address provided");
      Alert.alert("Error", "Please provide a shipping address.");
      return;
    }
    
    try {
      const order = FlowerService.createOrder(
        cart,
        shippingAddress,
        deliveryMethod,
        paymentMethod
      );
      
      console.log("Order created successfully:", order);
      
      if (order) {
        Alert.alert(
          "Order Placed Successfully",
          "Your order has been placed and will be processed shortly.",
          [
            { 
              text: "Track Order", 
              onPress: () => navigation.navigate('TrackOrder', { orderId: order.id }) 
            }
          ]
        );
      } else {
        throw new Error("Order creation returned null");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert(
        "Order Failed",
        "There was a problem processing your order. Please try again."
      );
    }
  };
  
  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Shipping Section */}
        <View style={styles.section}>
          {renderSectionHeader('SHIPPING')}
          <TouchableOpacity style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>Add shipping address</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
          <TextInput
            mode="outlined"
            value={shippingAddress}
            onChangeText={setShippingAddress}
            placeholder="Enter your address"
            style={styles.addressInput}
            outlineStyle={{ borderRadius: 8 }}
          />
        </View>
        
        {/* Delivery Section */}
        <View style={styles.section}>
          {renderSectionHeader('DELIVERY')}
          <TouchableOpacity style={styles.sectionItem}>
            <View>
              <Text style={styles.deliveryLabel}>{deliveryMethod}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        </View>
        
        {/* Payment Section */}
        <View style={styles.section}>
          {renderSectionHeader('PAYMENT')}
          <TouchableOpacity style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>{paymentMethod}</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        </View>
        
        {/* Promo Code Section */}
        <View style={styles.section}>
          {renderSectionHeader('PROMOS')}
          <TouchableOpacity style={styles.sectionItem}>
            <Text style={styles.sectionItemLabel}>Apply promo code</Text>
            <Ionicons name="chevron-forward" size={18} color="#888" />
          </TouchableOpacity>
        </View>
        
        {/* Items Section */}
        <View style={styles.section}>
          {renderSectionHeader('ITEMS')}
          
          {cart.map((item) => (
            <View key={item.flower.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemDescription}>
                  <Text style={{ fontWeight: 'bold' }}>{item.flower.brand}{'\n'}</Text>
                  {item.flower.name}{'\n'}
                  <Text style={{ color: '#888' }}>Quantity: {item.quantity}</Text>
                </Text>
              </View>
              <Text style={styles.itemPrice}>${(item.flower.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          
          <Divider style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({cart.length})</Text>
            <Text style={styles.summaryValue}>${calculateSubtotal().toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping total</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxes</Text>
            <Text style={styles.summaryValue}>${calculateTax().toFixed(2)}</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handlePlaceOrder}
            style={styles.placeOrderButton}
            disabled={!shippingAddress || cart.length === 0}
          >
            Place order
          </Button>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionItemLabel: {
    fontSize: 14,
  },
  addressInput: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  deliveryLabel: {
    fontSize: 14,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  summaryValue: {
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 16,
  },
  placeOrderButton: {
    borderRadius: 4,
    paddingVertical: 6,
  },
}); 