import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { Text, Card, Searchbar, useTheme, ActivityIndicator } from 'react-native-paper';
import { HomeScreenProps } from '../navigation/types';
import { FlowerService } from '../services/FlowerService';
import { Flower } from '../models/Flower';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

type EventItem = {
  id: string;
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

const events: EventItem[] = [
  { id: '1', name: 'Wedding', iconName: 'heart' },
  { id: '2', name: 'Anniversaries', iconName: 'gift' },
  { id: '3', name: 'Holidays', iconName: 'calendar' },
  { id: '4', name: 'Other', iconName: 'flower' },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [bestsellers, setBestsellers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load bestsellers on initial render and when the screen comes into focus
  const loadBestsellers = useCallback(async () => {
    try {
      setLoading(true);
      const bestsellerFlowers = await FlowerService.getBestsellers();
      setBestsellers(bestsellerFlowers);
    } catch (error) {
      console.error("Error loading bestsellers:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Refresh bestsellers list whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("HomeScreen in focus - refreshing bestsellers");
      loadBestsellers();
      return () => {
        // cleanup if needed
      };
    }, [loadBestsellers])
  );
  
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        // In the future, this would use the updated API-based search
        const results = await FlowerService.getFlowers({}, undefined, true);
        
        // For now, we'll just filter locally
        const filteredResults = results.filter(flower => 
          flower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          flower.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Navigate to results page with the filtered results
        navigation.navigate('FlowerList', { 
          title: `Search: ${searchQuery}`,
          initialFlowers: filteredResults 
        });
      } catch (error) {
        console.error("Error searching flowers:", error);
      }
    }
  };
  
  const handleEventPress = (event: string) => {
    navigation.navigate('EventBouquets', { event });
  };
  
  const handleFlowerPress = (flowerId: string) => {
    navigation.navigate('FlowerDetail', { flowerId });
  };
  
  const renderBestseller = ({ item }: { item: Flower }) => (
    <TouchableOpacity 
      onPress={() => handleFlowerPress(item.id)}
      style={styles.bestsellerItem}
    >
      <Card style={styles.card}>
        <Card.Cover source={item.imageUrl} style={styles.productImage} />
        <View style={styles.cardContent}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
          onSubmitEditing={handleSearch}
        />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* March Specials Banner */}
        <TouchableOpacity 
          style={styles.specialsContainer}
          onPress={() => navigation.navigate('EventBouquets', { event: 'Specials' })}
        >
          <Image 
            source={require('../../_ (12).jpeg')} 
            style={styles.specialsImage}
          />
          <View style={styles.specialsOverlay}>
            <Text style={styles.specialsText}>March Specials</Text>
          </View>
        </TouchableOpacity>
        
        {/* Events */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{">"}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.eventsContainer}>
            {events.map((event) => (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventItem}
                onPress={() => handleEventPress(event.name)}
              >
                <View style={styles.eventIconContainer}>
                  <Ionicons name={event.iconName} size={32} color="#FF98B7" />
                </View>
                <Text style={styles.eventName}>{event.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Bestsellers */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Bestsellers</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>{">"}</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : (
            <FlatList
              data={bestsellers}
              renderItem={renderBestseller}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.bestsellersList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text>No bestsellers available right now.</Text>
                </View>
              }
            />
          )}
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
  searchContainer: {
    padding: 10,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    height: 40,
  },
  specialsContainer: {
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: 'hidden',
    height: 170,
  },
  specialsImage: {
    width: '100%',
    height: '100%',
  },
  specialsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
  },
  specialsText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 18,
    color: '#FF98B7',
  },
  eventsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  eventItem: {
    alignItems: 'center',
    width: '23%',
  },
  eventIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF3F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 12,
    textAlign: 'center',
  },
  bestsellersList: {
    paddingLeft: 16,
    paddingBottom: 10,
  },
  bestsellerItem: {
    width: 160,
    marginRight: 16,
  },
  card: {
    overflow: 'hidden',
  },
  productImage: {
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  brand: {
    fontSize: 12,
    color: 'gray',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    color: '#FF98B7',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  }
}); 