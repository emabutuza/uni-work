import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  ImageSourcePropType
} from 'react-native';
import { 
  Text,
  TextInput,
  Button,
  Divider,
  useTheme,
  HelperText,
  SegmentedButtons
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Flower, FlowerFormData } from '../models/Flower';
import { FlowerService } from '../services/FlowerService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { API_CONFIG } from '../config/api';

type AdminEditFlowerScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminEditFlower'>;

// Modified form data to handle imageUrl as string for the form
interface EditFlowerFormData extends Omit<FlowerFormData, 'imageUrl'> {
  imageUrl: string;
  imageObject?: ImageSourcePropType;
}

export default function AdminEditFlowerScreen({ navigation, route }: AdminEditFlowerScreenProps) {
  const { flowerId } = route.params;
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState<EditFlowerFormData>({
    name: '',
    price: 0,
    description: '',
    category: 'Bestsellers',
    imageUrl: '',
    brand: '',
    event: undefined,
    createdAt: new Date(),
    inStock: true,
    color: '',
    size: '',
    rating: 0
  });
  
  const [errors, setErrors] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    brand: ''
  });
  
  // Load flower data when component mounts
  useEffect(() => {
    const loadFlower = async () => {
      try {
        const flower = await FlowerService.getFlowerById(flowerId);
        if (flower) {
          // Store the image object separately and use a placeholder URL for the form
          setFormData({
            name: flower.name || '',
            price: flower.price || 0,
            description: flower.description || '',
            category: flower.category || 'Bestsellers',
            imageUrl: 'https://example.com/placeholder.jpg', // Placeholder for the form
            imageObject: flower.imageUrl, // Store the actual image object
            brand: flower.brand || '',
            event: flower.event,
            createdAt: flower.createdAt || new Date(),
            inStock: typeof flower.inStock === 'boolean' ? flower.inStock : true,
            color: flower.color || '',
            size: flower.size || '',
            rating: flower.rating || 0
          });
        } else {
          Alert.alert(
            'Error',
            'Flower not found',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        }
      } catch (error) {
        console.error('Error loading flower details:', error);
        Alert.alert(
          'Error',
          'Failed to load flower details',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadFlower();
  }, [flowerId, navigation]);
  
  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      brand: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // When submitting, we need to use the imageObject if available, or convert the URL to an image object
      const updatedFormData: FlowerFormData = {
        ...formData,
        imageUrl: formData.imageObject || API_CONFIG.FALLBACK_IMAGES.FLOWER_1,
      };
      
      const updatedFlower = await FlowerService.updateFlower(flowerId, updatedFormData);
      if (updatedFlower) {
        Alert.alert(
          'Success',
          `Flower "${updatedFlower.name}" has been updated successfully!`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        throw new Error('Failed to update flower');
      }
    } catch (error) {
      console.error('Error updating flower:', error);
      Alert.alert(
        'Error',
        'Failed to update flower. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading flower data...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Edit Flower</Text>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <TextInput
            label="Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            mode="outlined"
            error={!!errors.name}
            style={styles.input}
          />
          {errors.name ? <HelperText type="error">{errors.name}</HelperText> : null}
          
          <TextInput
            label="Brand"
            value={formData.brand}
            onChangeText={(text) => setFormData({ ...formData, brand: text })}
            mode="outlined"
            error={!!errors.brand}
            style={styles.input}
          />
          {errors.brand ? <HelperText type="error">{errors.brand}</HelperText> : null}
          
          <TextInput
            label="Price ($)"
            value={formData.price !== undefined ? formData.price.toString() : '0'}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              setFormData({ ...formData, price: value });
            }}
            mode="outlined"
            keyboardType="numeric"
            error={!!errors.price}
            style={styles.input}
          />
          {errors.price ? <HelperText type="error">{errors.price}</HelperText> : null}
          
          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            mode="outlined"
            multiline
            numberOfLines={3}
            error={!!errors.description}
            style={styles.input}
          />
          {errors.description ? <HelperText type="error">{errors.description}</HelperText> : null}
          
          <TextInput
            label="Image URL"
            value={formData.imageUrl}
            onChangeText={(text) => setFormData({ ...formData, imageUrl: text })}
            mode="outlined"
            error={!!errors.imageUrl}
            style={styles.input}
          />
          {errors.imageUrl ? <HelperText type="error">{errors.imageUrl}</HelperText> : null}
          
          <Text style={styles.sectionTitle}>Category</Text>
          <SegmentedButtons
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            buttons={[
              { value: 'Bestsellers', label: 'Bestsellers' },
              { value: 'Specials', label: 'Specials' },
              { value: 'New', label: 'New' }
            ]}
            style={styles.segmentedButtons}
          />
          
          <Text style={styles.sectionTitle}>Event (Optional)</Text>
          <SegmentedButtons
            value={formData.event || ''}
            onValueChange={(value) => 
              setFormData({ 
                ...formData, 
                event: value ? (value as 'Wedding' | 'Anniversaries' | 'Holidays' | 'Other') : undefined 
              })
            }
            buttons={[
              { value: 'Wedding', label: 'Wedding' },
              { value: 'Anniversaries', label: 'Anniversaries' },
              { value: 'Holidays', label: 'Holidays' },
              { value: 'Other', label: 'Other' }
            ]}
            style={styles.segmentedButtons}
          />
          
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={styles.button}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Update Flower
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 