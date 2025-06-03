import { Flower, FlowerFormData, CartItem, Order } from '../models/Flower';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG } from '../config/api';

// API configuration
const API_URL = API_CONFIG.BASE_URL;

// Cache keys
const CACHE_KEYS = {
  FLOWERS: 'flowers_cache',
  PENDING_OPERATIONS: 'pending_operations'
};

// Local operation types for offline support
type OperationType = 'CREATE' | 'UPDATE' | 'DELETE';
type PendingOperation = {
  type: OperationType;
  id?: string;
  data?: any;
  timestamp: number;
};

// Convert image URLs from backend to ImageSourcePropType
const convertImageUrl = (imageUrl: string) => {
  if (imageUrl.startsWith('https://example.com/')) {
    // For demo images, map to local assets
    const imageNumber = parseInt(imageUrl.split('flower')[1]?.split('.')[0] || '1');
    switch (imageNumber) {
      case 1: return API_CONFIG.FALLBACK_IMAGES.FLOWER_1;
      case 2: return API_CONFIG.FALLBACK_IMAGES.FLOWER_2;
      case 3: return API_CONFIG.FALLBACK_IMAGES.FLOWER_3;
      default: return API_CONFIG.FALLBACK_IMAGES.FLOWER_4;
    }
  }
  // Real image URLs would be used as is with { uri: imageUrl }
  return { uri: imageUrl };
};

// Mock cart and orders (unchanged as they're not yet connected to backend)
let cart: CartItem[] = [];
let orders: Order[] = [];

// Utility function to check network & server status
const isOnline = async (): Promise<boolean> => {
  try {
    // Check network connectivity
    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isConnected) {
      return false;
    }
    
    // Check if API server is reachable
    const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Process any pending operations when back online
const syncPendingOperations = async (): Promise<void> => {
  const isNetworkAvailable = await isOnline();
  if (!isNetworkAvailable) return;
  
  try {
    const pendingOpsJSON = await AsyncStorage.getItem(CACHE_KEYS.PENDING_OPERATIONS);
    if (!pendingOpsJSON) return;
    
    const pendingOps: PendingOperation[] = JSON.parse(pendingOpsJSON);
    const newPendingOps: PendingOperation[] = [];
    
    for (const op of pendingOps) {
      try {
        switch (op.type) {
          case 'CREATE':
            await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(op.data)
            });
            break;
          
          case 'UPDATE':
            if (op.id) {
              await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}/${op.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(op.data)
              });
            }
            break;
          
          case 'DELETE':
            if (op.id) {
              await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}/${op.id}`, {
                method: 'DELETE'
              });
            }
            break;
        }
      } catch (error) {
        // If operation still fails, keep it for next sync
        newPendingOps.push(op);
      }
    }
    
    // Update pending operations list
    if (newPendingOps.length > 0) {
      await AsyncStorage.setItem(CACHE_KEYS.PENDING_OPERATIONS, JSON.stringify(newPendingOps));
    } else {
      await AsyncStorage.removeItem(CACHE_KEYS.PENDING_OPERATIONS);
    }
    
    // Refresh the cache after syncing
    await FlowerService.getFlowers();
  } catch (error) {
    console.error('Error syncing pending operations:', error);
  }
};

// Store pending operation for offline support
const addPendingOperation = async (type: OperationType, id?: string, data?: any): Promise<void> => {
  try {
    const pendingOpsJSON = await AsyncStorage.getItem(CACHE_KEYS.PENDING_OPERATIONS);
    const pendingOps: PendingOperation[] = pendingOpsJSON ? JSON.parse(pendingOpsJSON) : [];
    
    pendingOps.push({
      type,
      id,
      data,
      timestamp: Date.now()
    });
    
    await AsyncStorage.setItem(CACHE_KEYS.PENDING_OPERATIONS, JSON.stringify(pendingOps));
  } catch (error) {
    console.error('Error adding pending operation:', error);
  }
};

export const FlowerService = {
  // Get all flowers with optional filtering
  getFlowers: async (
    filters?: {
      category?: string;
      event?: string;
      priceMin?: number;
      priceMax?: number;
    },
    sortBy?: {
      field: keyof Flower;
      order: 'asc' | 'desc';
    },
    forceRefresh = false
  ): Promise<Flower[]> => {
    try {
      // Try to sync pending operations first
      await syncPendingOperations();
      
      // Check if online
      const networkAvailable = await isOnline();
      
      // Build query parameters for API call
      let queryParams = '';
      if (filters || sortBy) {
        const params = new URLSearchParams();
        
        if (filters) {
          if (filters.category) params.append('category', filters.category);
          if (filters.event) params.append('event', filters.event);
          if (filters.priceMin !== undefined) params.append('minPrice', filters.priceMin.toString());
          if (filters.priceMax !== undefined) params.append('maxPrice', filters.priceMax.toString());
        }
        
        if (sortBy) {
          params.append('sortBy', sortBy.field.toString());
          params.append('sortOrder', sortBy.order);
        }
        
        queryParams = `?${params.toString()}`;
      }
      
      // Try to get from network if available
      if (networkAvailable && forceRefresh) {
        const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}${queryParams}`);
        const data = await response.json();
        
        if (data.success) {
          // Convert the data to match our Flower model
          const flowersWithProperImages = data.data.map((flower: any) => ({
            ...flower,
            imageUrl: convertImageUrl(flower.imageUrl),
            createdAt: new Date(flower.createdAt)
          }));
          
          // Cache the result
          await AsyncStorage.setItem(CACHE_KEYS.FLOWERS, JSON.stringify(flowersWithProperImages));
          
          return flowersWithProperImages;
        }
      }
      
      // Get from cache if offline or network request failed
      const cachedFlowersJSON = await AsyncStorage.getItem(CACHE_KEYS.FLOWERS);
      if (cachedFlowersJSON) {
        let cachedFlowers: Flower[] = JSON.parse(cachedFlowersJSON).map((flower: any) => ({
          ...flower,
          createdAt: new Date(flower.createdAt)
        }));
        
        // Apply filters locally
        if (filters) {
          if (filters.category) {
            cachedFlowers = cachedFlowers.filter(f => f.category === filters.category);
          }
          if (filters.event) {
            cachedFlowers = cachedFlowers.filter(f => f.event === filters.event);
          }
          if (filters.priceMin !== undefined) {
            cachedFlowers = cachedFlowers.filter(f => f.price >= filters.priceMin!);
          }
          if (filters.priceMax !== undefined) {
            cachedFlowers = cachedFlowers.filter(f => f.price <= filters.priceMax!);
          }
        }
        
        // Apply sorting locally
        if (sortBy) {
          const { field, order } = sortBy;
          cachedFlowers.sort((a, b) => {
            const valueA = a[field];
            const valueB = b[field];
            
            if (typeof valueA === 'string' && typeof valueB === 'string') {
              return order === 'asc' 
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
            } else {
              const numA = valueA as number;
              const numB = valueB as number;
              return order === 'asc' ? numA - numB : numB - numA;
            }
          });
        }
        
        return cachedFlowers;
      }
      
      // If no cache, fetch from API (try again)
      if (networkAvailable) {
        const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}${queryParams}`);
        const data = await response.json();
        
        if (data.success) {
          const flowersWithProperImages = data.data.map((flower: any) => ({
            ...flower,
            imageUrl: convertImageUrl(flower.imageUrl),
            createdAt: new Date(flower.createdAt)
          }));
          
          await AsyncStorage.setItem(CACHE_KEYS.FLOWERS, JSON.stringify(flowersWithProperImages));
          return flowersWithProperImages;
        }
      }
      
      // Fallback to empty array if all fails
      return [];
    } catch (error) {
      console.error('Error in getFlowers:', error);
      // Fallback to empty array
      return [];
    }
  },

  // Get bestsellers
  getBestsellers: async (): Promise<Flower[]> => {
    const flowers = await FlowerService.getFlowers({ category: 'Bestsellers' });
    return flowers;
  },

  // Get flowers by event type
  getFlowersByEvent: async (event: string): Promise<Flower[]> => {
    const flowers = await FlowerService.getFlowers({ event });
    return flowers;
  },

  // Get a single flower by ID
  getFlowerById: async (id: string): Promise<Flower | undefined> => {
    try {
      // Try to sync pending operations first
      await syncPendingOperations();
      
      // Check if online
      const networkAvailable = await isOnline();
      
      // Try to get from network if available
      if (networkAvailable) {
        const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            return {
              ...data.data,
              imageUrl: convertImageUrl(data.data.imageUrl),
              createdAt: new Date(data.data.createdAt)
            };
          }
        }
      }
      
      // Get from cache if offline or network request failed
      const cachedFlowersJSON = await AsyncStorage.getItem(CACHE_KEYS.FLOWERS);
      if (cachedFlowersJSON) {
        const cachedFlowers: Flower[] = JSON.parse(cachedFlowersJSON).map((flower: any) => ({
          ...flower,
          createdAt: new Date(flower.createdAt)
        }));
        
        return cachedFlowers.find(f => f.id === id);
      }
      
      return undefined;
    } catch (error) {
      console.error('Error in getFlowerById:', error);
      return undefined;
    }
  },

  // Create a new flower
  createFlower: async (flowerData: FlowerFormData): Promise<Flower | null> => {
    try {
      const networkAvailable = await isOnline();
      
      // Generate a temporary ID for offline use
      const tempId = 'temp_' + Date.now();
      
      // Prepare the data
      const newFlowerData = {
        ...flowerData,
        // Convert ImageSourcePropType to string URL for backend
        imageUrl: 'https://example.com/default.jpg', // Default if no URL conversion possible
      };
      
      // Create the flower object for frontend use
      const newFlower: Flower = {
        ...flowerData,
        id: tempId,
        createdAt: new Date()
      };
      
      if (networkAvailable) {
        // Send to API
        const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFlowerData)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Update local cache
            await FlowerService.getFlowers({}, undefined, true);
            
            // Return the created flower with server ID
            return {
              ...data.data,
              imageUrl: convertImageUrl(data.data.imageUrl),
              createdAt: new Date(data.data.createdAt)
            };
          }
        }
      }
      
      // If offline, store for later sync
      await addPendingOperation('CREATE', tempId, newFlowerData);
      
      // Add to local cache
      const cachedFlowersJSON = await AsyncStorage.getItem(CACHE_KEYS.FLOWERS);
      const cachedFlowers: Flower[] = cachedFlowersJSON ? JSON.parse(cachedFlowersJSON) : [];
      
      cachedFlowers.push(newFlower);
      await AsyncStorage.setItem(CACHE_KEYS.FLOWERS, JSON.stringify(cachedFlowers));
      
      return newFlower;
    } catch (error) {
      console.error('Error in createFlower:', error);
      return null;
    }
  },

  // Update an existing flower
  updateFlower: async (id: string, flowerData: Partial<FlowerFormData>): Promise<Flower | null> => {
    try {
      const networkAvailable = await isOnline();
      
      // Prepare the data
      const updateData = {
        ...flowerData,
        // Convert ImageSourcePropType to string URL for backend if needed
        ...(flowerData.imageUrl ? { imageUrl: 'https://example.com/updated.jpg' } : {})
      };
      
      if (networkAvailable) {
        // Send to API
        const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Update local cache
            await FlowerService.getFlowers({}, undefined, true);
            
            // Return the updated flower
            return {
              ...data.data,
              imageUrl: convertImageUrl(data.data.imageUrl),
              createdAt: new Date(data.data.createdAt)
            };
          }
        }
      }
      
      // If offline, store for later sync
      await addPendingOperation('UPDATE', id, updateData);
      
      // Update local cache
      const cachedFlowersJSON = await AsyncStorage.getItem(CACHE_KEYS.FLOWERS);
      if (cachedFlowersJSON) {
        const cachedFlowers: Flower[] = JSON.parse(cachedFlowersJSON).map((flower: any) => ({
          ...flower,
          createdAt: new Date(flower.createdAt)
        }));
        
        const flowerIndex = cachedFlowers.findIndex(f => f.id === id);
        if (flowerIndex !== -1) {
          // Update the cached flower
          cachedFlowers[flowerIndex] = {
            ...cachedFlowers[flowerIndex],
            ...flowerData,
          };
          
          await AsyncStorage.setItem(CACHE_KEYS.FLOWERS, JSON.stringify(cachedFlowers));
          return cachedFlowers[flowerIndex];
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error in updateFlower:', error);
      return null;
    }
  },

  // Delete a flower
  deleteFlower: async (id: string): Promise<boolean> => {
    try {
      const networkAvailable = await isOnline();
      
      if (networkAvailable) {
        // Send to API
        const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.FLOWERS}/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Update local cache
          await FlowerService.getFlowers({}, undefined, true);
          return true;
        }
      }
      
      // If offline, store for later sync
      await addPendingOperation('DELETE', id);
      
      // Update local cache
      const cachedFlowersJSON = await AsyncStorage.getItem(CACHE_KEYS.FLOWERS);
      if (cachedFlowersJSON) {
        let cachedFlowers: Flower[] = JSON.parse(cachedFlowersJSON);
        cachedFlowers = cachedFlowers.filter(f => f.id !== id);
        await AsyncStorage.setItem(CACHE_KEYS.FLOWERS, JSON.stringify(cachedFlowers));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error in deleteFlower:', error);
      return false;
    }
  },

  // Cart functions (unchanged for now)
  getCart: (): CartItem[] => {
    return [...cart];
  },

  addToCart: (flowerId: string, quantity: number = 1): CartItem[] => {
    console.log("Adding to cart - flowerId:", flowerId, "quantity:", quantity);
    
    // Use async function internally for getFlowerById
    const addToCartAsync = async () => {
      const flower = await FlowerService.getFlowerById(flowerId);
      console.log("Flower found:", flower ? "yes" : "no", flower);
      
      if (!flower) {
        console.log("Flower not found, returning cart:", cart);
        return cart;
      }
      
      const existingItemIndex = cart.findIndex(item => item.flower.id === flowerId);
      console.log("Existing item index:", existingItemIndex);
      
      if (existingItemIndex >= 0) {
        console.log("Updating existing item quantity from", cart[existingItemIndex].quantity, "to", cart[existingItemIndex].quantity + quantity);
        cart[existingItemIndex].quantity += quantity;
      } else {
        console.log("Adding new item to cart:", { flower, quantity });
        cart.push({ flower, quantity });
      }
      
      console.log("Cart after update:", cart);
      return [...cart];
    };
    
    // Start the async process but return current cart immediately
    addToCartAsync().catch(error => console.error("Error in addToCart:", error));
    return cart;
  },

  updateCartItemQuantity: (flowerId: string, quantity: number): CartItem[] => {
    const itemIndex = cart.findIndex(item => item.flower.id === flowerId);
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
    }
    return [...cart];
  },

  removeFromCart: (flowerId: string): CartItem[] => {
    cart = cart.filter(item => item.flower.id !== flowerId);
    return [...cart];
  },

  clearCart: (): void => {
    cart = [];
  },

  // Order functions (unchanged for now)
  getOrders: (): Order[] => {
    return [...orders];
  },

  createOrder: (
    items: CartItem[],
    shippingAddress: string,
    deliveryMethod: string,
    paymentMethod: string
  ): Order => {
    const totalAmount = items.reduce(
      (sum, item) => sum + item.flower.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: 'order_' + Date.now(),
      items: [...items],
      totalAmount,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      status: 'pending',
      createdAt: new Date()
    };

    orders.push(newOrder);
    cart = []; // Clear cart after order
    return newOrder;
  },
  getOrderById: async (orderId: string) => {
    // Dummy implementation, replace with real API call
    // Example: return fetch(`/api/orders/${orderId}`).then(res => res.json());
    return {
      id: orderId,
      status: 'In Delivery',
      estimatedDelivery: '5:40 PM',
      address: '123 Main Street, Cluj-Napoca',
      total: 49.99,
    };
  },
}; 
