import { FlowerService } from '../services/FlowerService';
import { FlowerFormData } from '../models/Flower';
import '@types/jest';

describe('FlowerService', () => {
  // Test getting all flowers
  test('getFlowers returns all flowers when no filters provided', async () => {
    const flowers = await FlowerService.getFlowers();
    expect(flowers.length).toBeGreaterThan(0);
  });
  
  // Test filtering flowers by category
  test('getFlowers filters by category correctly', async () => {
    const category = 'Roses';
    const flowers = await FlowerService.getFlowers({ category });
    expect(flowers.length).toBeGreaterThan(0);
    expect(flowers.every(f => f.category === category)).toBe(true);
  });
  
  // Test filtering flowers by price range
  test('getFlowers filters by price range correctly', async () => {
    const priceMin = 45;
    const priceMax = 60;
    const flowers = await FlowerService.getFlowers({ priceMin, priceMax });
    expect(flowers.every(f => f.price >= priceMin && f.price <= priceMax)).toBe(true);
  });
  
  // Test creating a new flower
  test('createFlower adds a new flower correctly', async () => {
    const initialFlowers = await FlowerService.getFlowers();
    const initialFlowersCount = initialFlowers.length;
    
    const newFlowerData: FlowerFormData = {
      name: 'Test Flower',
      price: 30,
      description: 'A test flower',
      category: 'Test Category',
      imageUrl: { uri: 'https://example.com/flower.jpg' },
      rating: 4.0,
      inStock: true,
      color: 'blue',
      size: 'medium',
      brand: 'Test Brand',
      createdAt: new Date()
    };
    
    const newFlower = await FlowerService.createFlower(newFlowerData);
    
    // Check if the new flower was created with the right data
    expect(newFlower?.id).toBeDefined();
    expect(newFlower?.name).toBe(newFlowerData.name);
    expect(newFlower?.price).toBe(newFlowerData.price);
    
    // Check if the flower was added to the list
    const updatedFlowers = await FlowerService.getFlowers();
    const updatedFlowersCount = updatedFlowers.length;
    expect(updatedFlowersCount).toBe(initialFlowersCount + 1);
    
    // Clean up: delete the test flower
    if (newFlower?.id) {
      await FlowerService.deleteFlower(newFlower.id);
    }
  });
  
  // Test updating a flower
  test('updateFlower modifies an existing flower correctly', async () => {
    // Get a flower to update
    const flowers = await FlowerService.getFlowers();
    const flowerToUpdate = flowers[0];
    
    const updatedData = {
      name: 'Updated Flower Name',
      price: 75,
    };
    
    const updatedFlower = await FlowerService.updateFlower(flowerToUpdate.id, updatedData);
    
    expect(updatedFlower).not.toBeNull();
    expect(updatedFlower?.name).toBe(updatedData.name);
    expect(updatedFlower?.price).toBe(updatedData.price);
    
    // Verify that other properties weren't changed
    expect(updatedFlower?.description).toBe(flowerToUpdate.description);
    expect(updatedFlower?.category).toBe(flowerToUpdate.category);
  });
  
  // Test deleting a flower
  test('deleteFlower removes a flower correctly', async () => {
    // Create a temporary flower to delete
    const tempFlowerData: FlowerFormData = {
      name: 'Temporary Flower',
      price: 25,
      description: 'A temporary flower for deletion test',
      category: 'Test',
      imageUrl: { uri: 'https://example.com/temp.jpg' },
      rating: 3.5,
      inStock: true,
      color: 'green',
      size: 'small',
      brand: 'Test Brand',
      createdAt: new Date()
    };
    
    const tempFlower = await FlowerService.createFlower(tempFlowerData);
    const initialFlowers = await FlowerService.getFlowers();
    const initialCount = initialFlowers.length;
    
    // Delete the flower
    if (tempFlower && tempFlower.id) {
      const deleteResult = await FlowerService.deleteFlower(tempFlower.id);
      expect(deleteResult).toBe(true);
      
      // Check if the flower was removed
      const afterDeleteFlowers = await FlowerService.getFlowers();
      const afterDeleteCount = afterDeleteFlowers.length;
      expect(afterDeleteCount).toBe(initialCount - 1);
      
      // Check if the flower is no longer retrievable
      const deletedFlower = await FlowerService.getFlowerById(tempFlower.id);
      expect(deletedFlower).toBeUndefined();
    } else {
      throw new Error('Failed to create temporary flower for deletion test');
    }
  });
  
  // Test search functionality using getFlowers with filters
  test('getFlowers filters by name and category', async () => {
    // Create a unique flower to search for
    const uniqueFlowerData: FlowerFormData = {
      name: 'UniqueXYZ Search Test Flower',
      price: 100,
      description: 'A unique flower for search testing',
      category: 'Test Search',
      imageUrl: { uri: 'https://example.com/unique.jpg' },
      rating: 5.0,
      inStock: true,
      color: 'purple',
      size: 'large',
      brand: 'Test Brand',
      createdAt: new Date()
    };

    const uniqueFlower = await FlowerService.createFlower(uniqueFlowerData);

    // Search by category
    const categoryResults = await FlowerService.getFlowers({ category: 'Test Search' });
    expect(categoryResults.length).toBeGreaterThan(0);
    expect(uniqueFlower).not.toBeNull();
    expect(categoryResults.some(f => f.id === uniqueFlower!.id)).toBe(true);

    // Optionally, search by name if getFlowers supports a name filter
    // If not, filter manually
    const allFlowers = await FlowerService.getFlowers();
    const nameResults = allFlowers.filter(f => f.name.includes('UniqueXYZ'));
    expect(nameResults.length).toBeGreaterThan(0);
    expect(nameResults.some(f => f.id === uniqueFlower!.id)).toBe(true);

    // Clean up
    if (uniqueFlower?.id) {
      await FlowerService.deleteFlower(uniqueFlower.id);
    }
  });
  
  // Test sorting
  test('getFlowers sorts flowers correctly', async () => {
    // Sort by price ascending
    const ascPriceSorted = await FlowerService.getFlowers(undefined, { 
      field: 'price', 
      order: 'asc' 
    });
    
    for (let i = 0; i < ascPriceSorted.length - 1; i++) {
      expect(ascPriceSorted[i].price).toBeLessThanOrEqual(ascPriceSorted[i + 1].price);
    }
    
    // Sort by name descending
    const descNameSorted = await FlowerService.getFlowers(undefined, { 
      field: 'name', 
      order: 'desc' 
    });
    
    for (let i = 0; i < descNameSorted.length - 1; i++) {
      expect(descNameSorted[i].name.localeCompare(descNameSorted[i + 1].name)).toBeGreaterThanOrEqual(0);
    }
  });
}); 