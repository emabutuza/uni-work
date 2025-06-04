import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { FlowerDetailScreenProps } from '../navigation/types';
import { FlowerService } from '../services/FlowerService';
import { Flower } from '../models/Flower';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'react-native';

export default function FlowerDetailScreen({ route, navigation }: FlowerDetailScreenProps) {
  const { flowerId } = route.params;
  const theme = useTheme();
  const [flower, setFlower] = useState<Flower | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadFlowerDetails = async () => {
      setIsLoading(true);
      try {
        const flowerData = await FlowerService.getFlowerById(flowerId);
        if (flowerData) {
          setFlower(flowerData);
        } else {
          // Handle flower not found
          Alert.alert("Error", "Flower not found");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Error loading flower details:", error);
        Alert.alert("Error", "Failed to load flower details");
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFlowerDetails();
  }, [flowerId]);
  
  const handleAddToCart = () => {
    console.log("Adding to cart:", flower?.id, "quantity:", quantity);
    if (flower) {
      try {
        const updatedCart = FlowerService.addToCart(flower.id, quantity);
        console.log("Updated cart:", updatedCart);
        Alert.alert(
          "Added to Cart",
          `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
          [
            { 
              text: "View Cart", 
              onPress: () => navigation.navigate('Cart') 
            },
            {
              text: "Continue Shopping",
              style: "cancel"
            }
          ]
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
        Alert.alert("Error", "Failed to add item to cart. Please try again.");
      }
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (isLoading || !flower) {
    return (
      <View style={[styles.container, styles.loading]}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={flower.imageUrl} 
          style={styles.image}
        />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.brand}>{flower.brand}</Text>
          <Text style={styles.name}>{flower.name}</Text>
          <Text style={styles.price}>${flower.price ? flower.price.toFixed(2) : '0.00'}</Text>
          
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{flower.description}</Text>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantityControls}>
              <Button 
                mode="outlined" 
                onPress={decreaseQuantity}
                style={styles.quantityButton}
                contentStyle={styles.quantityButtonContent}
              >
                -
              </Button>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Button 
                mode="outlined"
                onPress={increaseQuantity}
                style={styles.quantityButton}
                contentStyle={styles.quantityButtonContent}
              >
                +
              </Button>
            </View>
          </View>
          
          <Button 
            mode="contained" 
            onPress={handleAddToCart}
            style={styles.addToCartButton}
          >
            Add to Cart
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
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  brand: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderRadius: 4,
    margin: 0,
    width: 40,
    height: 40,
  },
  quantityButtonContent: {
    width: 40,
    height: 40,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartButton: {
    borderRadius: 4,
    paddingVertical: 6,
  }
}); 