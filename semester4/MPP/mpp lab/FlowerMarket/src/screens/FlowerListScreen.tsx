import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { 
  Text, 
  Card, 
  Searchbar, 
  Chip, 
  Button, 
  IconButton, 
  Menu, 
  Divider,
  Dialog,
  Portal,
  RadioButton,
  Switch,
  useTheme
} from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type FlowerListScreenProps = NativeStackScreenProps<RootStackParamList, 'FlowerList'>;
import { FlowerService } from '../services/FlowerService';
import { Flower } from '../models/Flower';

const categories = [
  'All', 'Roses', 'Tulips', 'Lilies', 'Sunflowers', 'Orchids', 'Plants'
];

const sizes = ['All', 'small', 'medium', 'large'];
const colors = ['All', 'red', 'white', 'yellow', 'pink', 'purple', 'blue', 'orange', 'mixed'];

type SortOption = {
  field: keyof Flower;
  order: 'asc' | 'desc';
  label: string;
};

const sortOptions: SortOption[] = [
  { field: 'name', order: 'asc', label: 'Name (A-Z)' },
  { field: 'name', order: 'desc', label: 'Name (Z-A)' },
  { field: 'price', order: 'asc', label: 'Price (Low to High)' },
  { field: 'price', order: 'desc', label: 'Price (High to Low)' },
  { field: 'rating', order: 'desc', label: 'Rating (High to Low)' },
  { field: 'createdAt', order: 'desc', label: 'Newest First' },
  { field: 'createdAt', order: 'asc', label: 'Oldest First' },
];

export default function FlowerListScreen({ navigation, route }: FlowerListScreenProps) {
  const theme = useTheme();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>(sortOptions[0]);
  const [isFilterDialogVisible, setIsFilterDialogVisible] = useState(false);
  
  // Get initial flowers
  useEffect(() => {
    refreshFlowers();
  }, []);
  
  const refreshFlowers = async () => {
    // Build filters
    const filters: any = {};
    if (selectedCategory !== 'All') filters.category = selectedCategory;
    if (selectedSize !== 'All') filters.size = selectedSize;
    if (selectedColor !== 'All') filters.color = selectedColor;
    if (inStockOnly) filters.inStock = true;
    
    // Get flowers with filters and sorting
    let result = await FlowerService.getFlowers(
      Object.keys(filters).length > 0 ? filters : undefined,
      { field: currentSort.field, order: currentSort.order }
    );
    
    // Apply search if needed
    if (searchQuery.trim() !== '') {
      result = result.filter(flower => 
        flower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flower.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flower.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFlowers(result);
  };
  
  // Apply filters whenever they change
  useEffect(() => {
    refreshFlowers();
  }, [selectedCategory, selectedSize, selectedColor, inStockOnly, currentSort]);
  
  // Handle search
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      refreshFlowers();
    } else {
      // Filter the currently loaded flowers by search query
      setFlowers(prevFlowers =>
        prevFlowers.filter(flower =>
          flower.name.toLowerCase().includes(query.toLowerCase()) ||
          flower.description.toLowerCase().includes(query.toLowerCase()) ||
          flower.category.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };
  
  const handleSort = (option: SortOption) => {
    setCurrentSort(option);
    setShowSortMenu(false);
  };
  
  const handleFlowerPress = (flowerId: string) => {
    navigation.navigate('FlowerDetail', { flowerId });
  };
  
  const handleDelete = (flowerId: string) => {
    Alert.alert(
      'Delete Flower',
      'Are you sure you want to delete this flower?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            const deleted = await FlowerService.deleteFlower(flowerId);
            if (deleted) {
              Alert.alert('Success', 'Flower deleted successfully');
              refreshFlowers();
            } else {
              Alert.alert('Error', 'Failed to delete flower');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setInStockOnly(false);
    setIsFilterDialogVisible(false);
  };
  
  const renderFlowerItem = ({ item }: { item: Flower }) => (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => handleFlowerPress(item.id)}>
        <Card.Cover source={{ uri: String(item.imageUrl) }} style={styles.cardImage} />
      </TouchableOpacity>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" numberOfLines={1} style={styles.flowerName}>
            {item.name}
          </Text>
          <Text variant="titleMedium" style={styles.price}>
            ${item.price}
          </Text>
        </View>
        <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
        <View style={styles.chipContainer}>
          <Chip 
            style={[styles.chip, { backgroundColor: theme.colors.surfaceVariant }]}
            textStyle={{ fontSize: 12 }}
          >
            {item.category}
          </Chip>
          {item.inStock ? (
            <Chip style={[styles.chip, { backgroundColor: '#E8F5E9' }]} textStyle={{ fontSize: 12 }}>
              In Stock
            </Chip>
          ) : (
            <Chip style={[styles.chip, { backgroundColor: '#FFEBEE' }]} textStyle={{ fontSize: 12 }}>
              Out of Stock
            </Chip>
          )}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
          <View style={styles.actionsContainer}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => navigation.navigate('AdminEditFlower', { flowerId: item.id })}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor={theme.colors.error}
              onPress={() => handleDelete(item.id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search flowers"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <View style={styles.filterControls}>
          <Button 
            mode="outlined" 
            icon="filter-variant" 
            onPress={() => setIsFilterDialogVisible(true)}
            style={styles.filterButton}
          >
            Filter
          </Button>
          <Menu
            visible={showSortMenu}
            onDismiss={() => setShowSortMenu(false)}
            anchor={
              <Button 
                mode="outlined" 
                icon="sort" 
                onPress={() => setShowSortMenu(true)}
                style={styles.sortButton}
              >
                Sort
              </Button>
            }
          >
            {sortOptions.map((option, index) => (
              <React.Fragment key={index}>
                <Menu.Item
                  title={option.label}
                  onPress={() => handleSort(option)}
                  leadingIcon={currentSort === option ? 'check' : undefined}
                />
                {index < sortOptions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Menu>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && { backgroundColor: theme.colors.primary }
              ]}
              textStyle={selectedCategory === category ? { color: 'white' } : {}}
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={flowers}
        renderItem={renderFlowerItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text variant="titleMedium">No flowers found</Text>
            <Text variant="bodyMedium">Try adjusting your filters or search</Text>
          </View>
        }
      />
      
      <Portal>
        <Dialog visible={isFilterDialogVisible} onDismiss={() => setIsFilterDialogVisible(false)}>
          <Dialog.Title>Filter Flowers</Dialog.Title>
          <Dialog.Content>
            <Text variant="titleSmall" style={styles.filterTitle}>Size</Text>
            <RadioButton.Group onValueChange={value => setSelectedSize(value)} value={selectedSize}>
              {sizes.map((size) => (
                <RadioButton.Item key={size} label={size} value={size} />
              ))}
            </RadioButton.Group>
            
            <Divider style={styles.dialogDivider} />
            
            <Text variant="titleSmall" style={styles.filterTitle}>Color</Text>
            <RadioButton.Group onValueChange={value => setSelectedColor(value)} value={selectedColor}>
              {colors.map((color) => (
                <RadioButton.Item key={color} label={color} value={color} />
              ))}
            </RadioButton.Group>
            
            <Divider style={styles.dialogDivider} />
            
            <View style={styles.switchContainer}>
              <Text variant="bodyLarge">In Stock Only</Text>
              <Switch
                value={inStockOnly}
                onValueChange={setInStockOnly}
                color={theme.colors.primary}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={resetFilters}>Reset</Button>
            <Button onPress={() => setIsFilterDialogVisible(false)}>Apply</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    padding: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    marginBottom: 10,
    borderRadius: 8,
  },
  filterControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    marginRight: 5,
    borderRadius: 8,
  },
  sortButton: {
    flex: 1,
    marginLeft: 5,
    borderRadius: 8,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 8,
  },
  listContent: {
    padding: 10,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardImage: {
    height: 180,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  flowerName: {
    flex: 1,
    fontWeight: 'bold',
  },
  price: {
    color: '#2E8B57',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  description: {
    marginBottom: 8,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    marginRight: 8,
    height: 24,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  emptyList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  filterTitle: {
    marginBottom: 8,
    marginTop: 16,
    fontWeight: 'bold',
  },
  dialogDivider: {
    marginVertical: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
}); 