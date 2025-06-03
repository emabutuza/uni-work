import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme, Switch, Divider } from 'react-native-paper';
import { AdminEditFlowerScreenProps } from '../navigation/types';
import { FlowerService } from '../services/FlowerService';
import { Flower, FlowerFormData } from '../models/Flower';

type FormErrors = {
  [key in keyof FlowerFormData]?: string;
};

export default function EditFlowerScreen({ route, navigation }: AdminEditFlowerScreenProps) {
  const { flowerId } = route.params;
  const theme = useTheme();
  const [flower, setFlower] = useState<Flower | null>(null);
  const [formData, setFormData] = useState<FlowerFormData>({
      name: '',
      price: 0,
      description: '',
      category: '',
      imageUrl: { uri: '' },
      rating: 5,
      inStock: true,
      color: '',
      size: 'medium',
      brand: '',
      createdAt: new Date(),
    });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchFlower = async () => {
      try {
        const flowerData = await FlowerService.getFlowerById(flowerId);
        if (flowerData) {
          setFlower(flowerData);
          const { id, createdAt, ...formFields } = flowerData;
          setFormData({ ...formFields, createdAt });
        } else {
          Alert.alert('Error', 'Flower not found');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch flower data');
        navigation.goBack();
      }
    };
    fetchFlower();
  }, [flowerId]);
  
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Flower name is required';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.description || formData.description.trim() === '') {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category || formData.category.trim() === '') {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.imageUrl || (String(formData.imageUrl).trim() === '')) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (typeof formData.imageUrl !== 'string' || !isValidUrl(String(formData.imageUrl))) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }
    
    if (!formData.color || formData.color.trim() === '') {
      newErrors.color = 'Color is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const updatedFlower = await FlowerService.updateFlower(flowerId, formData);
        if (updatedFlower) {
          Alert.alert(
            'Success',
            'Flower updated successfully!',
            [{
              text: 'OK',
              onPress: () => navigation.goBack()
            }]
          );
        } else {
          throw new Error('Update failed');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update flower. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleChange = (name: keyof FlowerFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  if (!flower) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text variant="headlineSmall" style={styles.title}>
            Edit Flower
          </Text>
          
          <TextInput
            label="Flower Name"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            style={styles.input}
            error={!!errors.name}
          />
          {errors.name && <HelperText type="error">{errors.name}</HelperText>}
          
          <TextInput
            label="Price"
            value={formData.price.toString()}
            onChangeText={(text) => handleChange('price', parseFloat(text) || 0)}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.price}
          />
          {errors.price && <HelperText type="error">{errors.price}</HelperText>}
          
          <TextInput
            label="Description"
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
            multiline
            numberOfLines={4}
            style={styles.input}
            error={!!errors.description}
          />
          {errors.description && <HelperText type="error">{errors.description}</HelperText>}
          
          <TextInput
            label="Category"
            value={formData.category}
            onChangeText={(text) => handleChange('category', text)}
            style={styles.input}
            error={!!errors.category}
          />
          {errors.category && <HelperText type="error">{errors.category}</HelperText>}
          
          <TextInput
            label="Image URL"
            value={typeof formData.imageUrl === 'string' ? formData.imageUrl : ''}
            onChangeText={(text) => handleChange('imageUrl', text)}
            style={styles.input}
            error={!!errors.imageUrl}
          />
          {errors.imageUrl && <HelperText type="error">{errors.imageUrl}</HelperText>}
          
          <TextInput
            label="Rating (0-5)"
            value={formData.rating.toString()}
            onChangeText={(text) => handleChange('rating', parseFloat(text) || 0)}
            keyboardType="numeric"
            style={styles.input}
            error={!!errors.rating}
          />
          {errors.rating && <HelperText type="error">{errors.rating}</HelperText>}
          
          <TextInput
            label="Color"
            value={formData.color}
            onChangeText={(text) => handleChange('color', text)}
            style={styles.input}
            error={!!errors.color}
          />
          {errors.color && <HelperText type="error">{errors.color}</HelperText>}
          
          <Text variant="bodyLarge" style={styles.sectionHeader}>Size</Text>
          <View style={styles.radioGroup}>
            <View style={styles.radioOption}>
              <Button
                mode={formData.size === 'small' ? 'contained' : 'outlined'}
                onPress={() => handleChange('size', 'small')}
                style={styles.radioButton}
              >
                Small
              </Button>
            </View>
            <View style={styles.radioOption}>
              <Button
                mode={formData.size === 'medium' ? 'contained' : 'outlined'}
                onPress={() => handleChange('size', 'medium')}
                style={styles.radioButton}
              >
                Medium
              </Button>
            </View>
            <View style={styles.radioOption}>
              <Button
                mode={formData.size === 'large' ? 'contained' : 'outlined'}
                onPress={() => handleChange('size', 'large')}
                style={styles.radioButton}
              >
                Large
              </Button>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.switchContainer}>
            <Text variant="bodyLarge">In Stock</Text>
            <Switch
              value={formData.inStock}
              onValueChange={(value) => handleChange('inStock', value)}
              color={theme.colors.primary}
            />
          </View>
          
          <View style={styles.buttonContainer}>
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
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Update Flower
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  divider: {
    marginVertical: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  radioOption: {
    flex: 1,
    marginHorizontal: 4,
  },
  radioButton: {
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 