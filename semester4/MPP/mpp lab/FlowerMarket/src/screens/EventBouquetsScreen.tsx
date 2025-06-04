import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import { EventBouquetsScreenProps } from '../navigation/types';
import { FlowerService } from '../services/FlowerService';
import { Flower } from '../models/Flower';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';

export default function EventBouquetsScreen({ route, navigation }: EventBouquetsScreenProps) {
  const { event } = route.params;
  const theme = useTheme();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useFocusEffect(
    useCallback(() => {
      console.log(`EventBouquetsScreen in focus - loading flowers for event: ${event}`);
      
      const loadFlowers = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          let result: Flower[] = [];
          
          if (event === 'Specials') {
            result = await FlowerService.getFlowers({ category: 'Specials' });
          } else {
            result = await FlowerService.getFlowersByEvent(event);
          }
          
          setFlowers(result);
        } catch (err) {
          console.error("Error loading event flowers:", err);
          setError("Failed to load flowers. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      
      loadFlowers();
      
      return () => {
        // cleanup if needed
      };
    }, [event])
  );
  
  const handleFlowerPress = (flowerId: string) => {
    navigation.navigate('FlowerDetail', { flowerId });
  };
  
  const renderFlowerItem = ({ item, index }: { item: Flower, index: number }) => {
    // Determine if this is the first item in a row (left) or second (right)
    const isLeft = index % 2 === 0;
    
    return (
      <TouchableOpacity 
        style={[
          styles.flowerItem,
          isLeft ? styles.leftItem : styles.rightItem
        ]}
        onPress={() => handleFlowerPress(item.id)}
      >
        <Card style={styles.card}>
          <Card.Cover source={item.imageUrl} style={styles.productImage} />
          <Card.Content style={styles.cardContent}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price ? item.price.toFixed(2) : '0.00'}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <FlatList
        data={flowers}
        renderItem={renderFlowerItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bouquets available for {event}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    padding: 20,
  },
  listContent: {
    padding: 8,
  },
  flowerItem: {
    flex: 1,
    padding: 8,
    maxWidth: '50%',
  },
  leftItem: {
    paddingRight: 4,
  },
  rightItem: {
    paddingLeft: 4,
  },
  card: {
    elevation: 2,
    borderRadius: 8,
  },
  productImage: {
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
}); 