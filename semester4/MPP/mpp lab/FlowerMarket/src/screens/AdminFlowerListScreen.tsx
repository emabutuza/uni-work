import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { 
  Text, 
  Searchbar, 
  Button, 
  Card, 
  Chip, 
  Menu, 
  Divider, 
  IconButton, 
  List, 
  Badge,
  useTheme 
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Flower } from '../models/Flower';
import { FlowerService } from '../services/FlowerService';
import { AdminFlowerListScreenProps } from '../navigation/types';

type SortField = 'name' | 'price' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export default function AdminFlowerListScreen({ navigation }: AdminFlowerListScreenProps) {
  const theme = useTheme();
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [filteredFlowers, setFilteredFlowers] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 5;
  
  // Statistics calculations
  const maxPrice = flowers.length > 0 ? Math.max(...flowers.map(f => f.price || 0)) : 0;
  const minPrice = flowers.length > 0 ? Math.min(...flowers.map(f => f.price || 0)) : 0;
  const averagePrice = flowers.length > 0 
    ? flowers.reduce((acc, f) => acc + (f.price || 0), 0) / flowers.length
    : 0;
  
  const loadFlowers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allFlowers = await FlowerService.getFlowers();
      if (Array.isArray(allFlowers)) {
        setFlowers(allFlowers);
        applyFiltersAndSort(allFlowers);
      } else {
        setFlowers([]);
        setFilteredFlowers([]);
        setError('No flowers available');
      }
    } catch (error) {
      console.error('Failed to load flowers:', error);
      setError('Failed to load flowers. Please try again.');
      setFlowers([]);
      setFilteredFlowers([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadFlowers();
    setRefreshing(false);
  }, [loadFlowers]);
  
  // Apply filters and sorting
  const applyFiltersAndSort = useCallback((data = flowers) => {
    if (!Array.isArray(data) || data.length === 0) {
      setFilteredFlowers([]);
      return;
    }
    
    let result = [...data];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(f => f.category === selectedCategory);
    }
    
    // Apply event filter
    if (selectedEvent) {
      result = result.filter(f => f.event === selectedEvent);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.description.toLowerCase().includes(query) ||
        f.brand.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (valueA instanceof Date && valueB instanceof Date) {
        return sortOrder === 'asc' 
          ? valueA.getTime() - valueB.getTime() 
          : valueB.getTime() - valueA.getTime();
      } else {
        const numA = valueA as number;
        const numB = valueB as number;
        return sortOrder === 'asc' ? numA - numB : numB - numA;
      }
    });
    
    setFilteredFlowers(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [flowers, searchQuery, selectedCategory, selectedEvent, sortField, sortOrder]);
  
  // Load flowers on mount
  useEffect(() => {
    loadFlowers();
  }, [loadFlowers]);
  
  // Update filtered flowers when filters or sorting changes
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort, sortField, sortOrder, selectedCategory, selectedEvent, searchQuery]);
  
  const handleEdit = (flower: Flower) => {
    navigation.navigate('AdminEditFlower', { flowerId: flower.id });
  };
  
  const handleDelete = async (flower: Flower) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${flower.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await FlowerService.deleteFlower(flower.id);
              if (success) {
                await loadFlowers();
                Alert.alert('Success', 'Flower deleted successfully');
              } else {
                Alert.alert('Error', 'Failed to delete flower');
              }
            } catch (error) {
              console.error('Error deleting flower:', error);
              Alert.alert('Error', 'Failed to delete flower');
            }
          }
        }
      ]
    );
  };
  
  const toggleSortOrder = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  
  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedEvent(null);
    setSearchQuery('');
    setSortField('name');
    setSortOrder('asc');
    setFilterMenuVisible(false);
  };
  
  const getPriceColorStyle = (price: number) => {
    if (price === maxPrice) return { color: '#E53935' }; // Most expensive: red
    if (Math.abs(price - averagePrice) < 0.01) return { color: '#FB8C00' }; // Average price: orange
    if (price === minPrice) return { color: '#43A047' }; // Least expensive: green
    return {};
  };
  
  // Get current page items
  const currentItems = filteredFlowers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredFlowers.length / itemsPerPage);
  
  const renderFlowerItem = ({ item }: { item: Flower }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEdit(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item)}
            />
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <List.Item
          title="Price"
          description={
            <Text style={getPriceColorStyle(item.price || 0)}>
              ${item.price ? item.price.toFixed(2) : '0.00'}
              {item.price === maxPrice && maxPrice > 0 && ' (Highest)'}
              {item.price === minPrice && minPrice > 0 && ' (Lowest)'}
              {Math.abs((item.price || 0) - averagePrice) < 0.01 && ' (Average)'}
            </Text>
          }
          left={props => <List.Icon {...props} icon="tag" />}
        />
        
        <List.Item
          title="Category"
          description={item.category}
          left={props => <List.Icon {...props} icon="folder" />}
        />
        
        {item.event && (
          <List.Item
            title="Event"
            description={item.event}
            left={props => <List.Icon {...props} icon="calendar" />}
          />
        )}
        
        <List.Item
          title="Created"
          description={item.createdAt.toLocaleDateString()}
          left={props => <List.Icon {...props} icon="clock" />}
        />
      </Card.Content>
    </Card>
  );
  
  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <Button
        icon="chevron-left"
        mode="text"
        disabled={currentPage === 1}
        onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
      >
        Previous
      </Button>
      
      <Text style={styles.paginationText}>
        Page {currentPage} of {totalPages}
      </Text>
      
      <Button
        icon="chevron-right"
        mode="text"
        contentStyle={{ flexDirection: 'row-reverse' }}
        disabled={currentPage >= totalPages}
        onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
      >
        Next
      </Button>
    </View>
  );
  
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="flower-outline" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No flowers found</Text>
      <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
      <Button 
        mode="outlined" 
        onPress={resetFilters}
        style={styles.resetButton}
      >
        Reset Filters
      </Button>
    </View>
  );
  
  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{flowers.length}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Min Price</Text>
          <Text style={[styles.statValue, { color: '#43A047' }]}>
            ${minPrice.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={[styles.statValue, { color: '#FB8C00' }]}>
            ${averagePrice.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max Price</Text>
          <Text style={[styles.statValue, { color: '#E53935' }]}>
            ${maxPrice.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.filtersRow}>
        <View style={styles.chipContainer}>
          {selectedCategory && (
            <Chip 
              icon="folder" 
              onClose={() => setSelectedCategory(null)}
              style={styles.chip}
            >
              {selectedCategory}
            </Chip>
          )}
          
          {selectedEvent && (
            <Chip 
              icon="calendar" 
              onClose={() => setSelectedEvent(null)}
              style={styles.chip}
            >
              {selectedEvent}
            </Chip>
          )}
        </View>
        
        {(selectedCategory || selectedEvent || searchQuery) && (
          <Button
            compact
            mode="text"
            onPress={resetFilters}
          >
            Clear All
          </Button>
        )}
      </View>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Flower Management</Text>
        <Button 
          mode="contained" 
          icon="plus" 
          onPress={() => navigation.navigate('AdminAddFlower')}
          style={styles.addButton}
        >
          Add New
        </Button>
      </View>
      
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search flowers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterActions}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setSortMenuVisible(true)}
              >
                <Ionicons name="funnel-outline" size={18} color={theme.colors.primary} />
                <Text style={{ color: theme.colors.primary }}>Sort</Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item 
              title="Name (A-Z)" 
              leadingIcon="sort-alphabetical-ascending"
              onPress={() => {
                setSortField('name');
                setSortOrder('asc');
                setSortMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Name (Z-A)" 
              leadingIcon="sort-alphabetical-descending"
              onPress={() => {
                setSortField('name');
                setSortOrder('desc');
                setSortMenuVisible(false);
              }}
            />
            <Divider />
            <Menu.Item 
              title="Price (Low to High)" 
              leadingIcon="sort-numeric-ascending"
              onPress={() => {
                setSortField('price');
                setSortOrder('asc');
                setSortMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Price (High to Low)" 
              leadingIcon="sort-numeric-descending"
              onPress={() => {
                setSortField('price');
                setSortOrder('desc');
                setSortMenuVisible(false);
              }}
            />
            <Divider />
            <Menu.Item 
              title="Newest First" 
              leadingIcon="clock"
              onPress={() => {
                setSortField('createdAt');
                setSortOrder('desc');
                setSortMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Oldest First" 
              leadingIcon="clock-outline"
              onPress={() => {
                setSortField('createdAt');
                setSortOrder('asc');
                setSortMenuVisible(false);
              }}
            />
          </Menu>
          
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setFilterMenuVisible(true)}
              >
                <Ionicons name="options-outline" size={18} color={theme.colors.primary} />
                <Text style={{ color: theme.colors.primary }}>Filter</Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item 
              title="All Categories" 
              leadingIcon={selectedCategory === null ? "check" : "folder-outline"}
              onPress={() => {
                setSelectedCategory(null);
                setFilterMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Bestsellers" 
              leadingIcon={selectedCategory === 'Bestsellers' ? "check" : "star-outline"}
              onPress={() => {
                setSelectedCategory('Bestsellers');
                setFilterMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Specials" 
              leadingIcon={selectedCategory === 'Specials' ? "check" : "ticket-outline"}
              onPress={() => {
                setSelectedCategory('Specials');
                setFilterMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="New" 
              leadingIcon={selectedCategory === 'New' ? "check" : "new-box"}
              onPress={() => {
                setSelectedCategory('New');
                setFilterMenuVisible(false);
              }}
            />
            <Divider />
            <Menu.Item 
              title="All Events" 
              leadingIcon={selectedEvent === null ? "check" : "calendar-outline"}
              onPress={() => {
                setSelectedEvent(null);
                setFilterMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Wedding" 
              leadingIcon={selectedEvent === 'Wedding' ? "check" : "heart-outline"}
              onPress={() => {
                setSelectedEvent('Wedding');
                setFilterMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Anniversaries" 
              leadingIcon={selectedEvent === 'Anniversaries' ? "check" : "gift-outline"}
              onPress={() => {
                setSelectedEvent('Anniversaries');
                setFilterMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Holidays" 
              leadingIcon={selectedEvent === 'Holidays' ? "check" : "calendar"}
              onPress={() => {
                setSelectedEvent('Holidays');
                setFilterMenuVisible(false);
              }}
            />
            <Menu.Item 
              title="Other" 
              leadingIcon={selectedEvent === 'Other' ? "check" : "flower-outline"}
              onPress={() => {
                setSelectedEvent('Other');
                setFilterMenuVisible(false);
              }}
            />
          </Menu>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading flowers...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={currentItems}
            keyExtractor={(item) => item.id}
            renderItem={renderFlowerItem}
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={renderEmptyList}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
              />
            }
          />
          
          {filteredFlowers.length > 0 && renderPagination()}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    borderRadius: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  filterActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    marginTop: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brand: {
    fontSize: 12,
    color: '#666',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  paginationText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginTop: 24,
    backgroundColor: 'white',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  resetButton: {
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
}); 