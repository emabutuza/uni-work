import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, IconButton, Divider, useTheme } from 'react-native-paper';
import { CartScreenProps } from '../navigation/types';
import { FlowerService } from '../services/FlowerService';
import { CartItem } from '../models/Flower';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

export default function CartScreen({ navigation }: CartScreenProps) {
  const theme = useTheme();
  const [cart, setCart] = useState<CartItem[]>([]);
  
  useFocusEffect(
    React.useCallback(() => {
      console.log("Cart screen in focus - refreshing cart");
      refreshCart();
      return () => {
        // Cleanup function when screen goes out of focus (optional)
      };
    }, [])
  );
  
  const refreshCart = () => {
    const currentCart = FlowerService.getCart();
    console.log("Refreshing cart, current items:", currentCart);
    setCart(currentCart);
  };
  
  const handleRemoveItem = (flowerId: string) => {
    FlowerService.removeFromCart(flowerId);
    refreshCart();
  };
  
  const handleUpdateQuantity = (flowerId: string, quantity: number) => {
    FlowerService.updateCartItemQuantity(flowerId, quantity);
    refreshCart();
  };
  
  const handleCheckout = () => {
    if (cart.length > 0) {
      navigation.navigate('Checkout');
    }
  };
  
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.flower.price * item.quantity), 0);
  };
  
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image 
        source={item.flower.imageUrl} 
        style={styles.itemImage}
      />
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.flower.name}</Text>
        <Text style={styles.itemPrice}>${item.flower.price.toFixed(2)}</Text>
        
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(item.flower.id, item.quantity - 1)}
            style={styles.quantityButton}
            disabled={item.quantity <= 1}
          >
            <Text style={[styles.quantityButtonText, item.quantity <= 1 && styles.disabledButton]}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            onPress={() => handleUpdateQuantity(item.flower.id, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <IconButton
        icon="close"
        size={20}
        onPress={() => handleRemoveItem(item.flower.id)}
        style={styles.removeButton}
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.itemsCount}>{cart.length} items</Text>
      </View>
      
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.flower.id}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
            </View>
            
            <Button 
              mode="contained" 
              onPress={handleCheckout}
              style={styles.checkoutButton}
            >
              Checkout
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Home')}
            style={styles.shopButton}
          >
            Browse Flowers
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemsCount: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  listContent: {
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    color: '#ccc',
  },
  quantityText: {
    fontSize: 14,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    margin: 0,
  },
  divider: {
    marginLeft: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  checkoutButton: {
    borderRadius: 4,
    paddingVertical: 6,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyCartText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  shopButton: {
    borderRadius: 4,
    paddingVertical: 6,
  }
}); 