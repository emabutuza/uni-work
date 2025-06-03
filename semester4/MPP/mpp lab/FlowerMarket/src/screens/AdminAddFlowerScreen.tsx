import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';
import { 
  Text,
  TextInput,
  Button,
  Divider,
  useTheme,
  HelperText,
  SegmentedButtons,
  Modal,
  RadioButton
} from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { FlowerFormData } from '../models/Flower';
import { FlowerService } from '../services/FlowerService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { ImageSourcePropType } from 'react-native';

type AdminAddFlowerScreenProps = NativeStackScreenProps<RootStackParamList, 'AdminAddFlower'>;

// Define available images for selection
const availableImages: {id: string, source: ImageSourcePropType, name: string}[] = [
  { id: 'img1', source: require('../../_ (5).jpeg'), name: 'Bouquet 1' },
  { id: 'img2', source: require('../../_ (6).jpeg'), name: 'Bouquet 2' },
  { id: 'img3', source: require('../../_ (7).jpeg'), name: 'Bouquet 3' },
  { id: 'img4', source: require('../../_ (9).jpeg'), name: 'Bouquet 4' },
  { id: 'img5', source: require('../../_ (10).jpeg'), name: 'Bouquet 5' },
  { id: 'img6', source: require('../../_ (11).jpeg'), name: 'Bouquet 6' },
  { id: 'img7', source: require('../../_ (12).jpeg'), name: 'Bouquet 7' },
  { id: 'img8', source: require('../../_ (13).jpeg'), name: 'Bouquet 8' },
  { id: 'img9', source: require('../../_ (15).jpeg'), name: 'Bouquet 9' },
  { id: 'img10', source: require('../../_ (16).jpeg'), name: 'Bouquet 10' },
];

export default function AdminAddFlowerScreen({ navigation }: AdminAddFlowerScreenProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<FlowerFormData, 'imageUrl'> & { imageUrl?: ImageSourcePropType }>({
    name: '',
    price: 0,
    description: '',
    category: 'Bestsellers',
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
    
    if (!selectedImageId) {
      newErrors.imageUrl = 'Please select an image';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(error => error);
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }
    
    setLoading(true);
    console.log("Starting flower creation process");
    
    try {
      // Find the selected image from availableImages
      const selectedImage = availableImages.find(img => img.id === selectedImageId);
      console.log("Selected image:", selectedImage?.id, selectedImage?.name);
      
      if (!selectedImage) {
        console.error("Selected image not found, selectedImageId:", selectedImageId);
        throw new Error('Selected image not found');
      }
      
      // Create new flower with the selected image
      const flowerData = {
        ...formData,
        imageUrl: selectedImage.source,
        category: 'Bestsellers' // Set default category
      };
      
      console.log("Creating flower with data:", {
        ...flowerData,
        imageUrl: "[Image source object]" // Don't log the actual image source object
      });
      
      try {
        const newFlower = await FlowerService.createFlower(flowerData as FlowerFormData);
        if (newFlower) {
          console.log("Flower created successfully:", newFlower.id);
          Alert.alert(
            'Success',
            `Flower "${newFlower.name}" has been added successfully!`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        } else {
          throw new Error('Failed to create flower. Please try again.');
        }
      } catch (createError) {
        console.error("Error in FlowerService.createFlower:", createError);
        throw createError;
      }
    } catch (error) {
      console.error("Error adding flower:", error);
      
      let errorMessage = 'Failed to add flower. Please try again.';
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      Alert.alert(
        'Error',
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Add New Flower</Text>
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
            value={formData.price.toString()}
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
          
          <Text style={styles.sectionTitle}>Select Image</Text>
          <TouchableOpacity 
            style={[styles.imageSelector, errors.imageUrl ? styles.imageError : null]}
            onPress={() => setImageModalVisible(true)}
          >
            {selectedImageId ? (
              <Image 
                source={availableImages.find(img => img.id === selectedImageId)?.source} 
                style={styles.selectedImage}
              />
            ) : (
              <Text style={styles.imagePlaceholder}>Tap to select image</Text>
            )}
          </TouchableOpacity>
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
              Add Flower
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Image Selection Modal */}
      <Modal 
        visible={imageModalVisible} 
        onDismiss={() => setImageModalVisible(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select an Image</Text>
          <ScrollView>
            {availableImages.map((image) => (
              <TouchableOpacity
                key={image.id}
                style={[
                  styles.imageOption,
                  selectedImageId === image.id && styles.selectedImageOption
                ]}
                onPress={() => setSelectedImageId(image.id)}
              >
                <View style={styles.radioContainer}>
                  <View style={styles.radioOuter}>
                    {selectedImageId === image.id && <View style={styles.radioInner} />}
                  </View>
                </View>
                <Image source={image.source} style={styles.thumbnailImage} />
                <Text style={styles.imageName}>{image.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button 
            mode="contained" 
            onPress={() => setImageModalVisible(false)}
            style={styles.selectButton}
          >
            Confirm Selection
          </Button>
        </View>
      </Modal>
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
    paddingBottom: 40,
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
    marginHorizontal: 8,
  },
  imageSelector: {
    height: 150,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  imageError: {
    borderColor: 'red',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    color: '#888',
  },
  modalContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalContent: {
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedImageOption: {
    backgroundColor: '#f5f5f5',
  },
  radioContainer: {
    marginRight: 10,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF98B7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#FF98B7',
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 4,
  },
  imageName: {
    flex: 1,
  },
  selectButton: {
    marginTop: 16,
  }
}); 