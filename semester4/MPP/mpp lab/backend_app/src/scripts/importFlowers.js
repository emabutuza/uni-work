import { Flower } from '../models/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sample flower data with categories and prices
const flowerData = [
  {
    name: "Rose Bouquet",
    price: 49.99,
    description: "Beautiful arrangement of fresh roses",
    category: "Bouquets",
    brand: "Premium Flowers",
    event: "Wedding",
    stock: 10
  },
  {
    name: "Lily Collection",
    price: 39.99,
    description: "Elegant lilies in a stunning arrangement",
    category: "Collections",
    brand: "Garden Fresh",
    event: "Anniversary",
    stock: 15
  },
  {
    name: "Spring Mix",
    price: 45.99,
    description: "Colorful spring flowers in a vibrant arrangement",
    category: "Seasonal",
    brand: "Nature's Best",
    event: "Birthday",
    stock: 20
  },
  {
    name: "Tulip Bundle",
    price: 34.99,
    description: "Fresh tulips in a beautiful bundle",
    category: "Bundles",
    brand: "Dutch Flowers",
    event: "Graduation",
    stock: 12
  },
  {
    name: "Orchid Display",
    price: 59.99,
    description: "Exotic orchids in an elegant display",
    category: "Exotic",
    brand: "Tropical Blooms",
    event: "Corporate",
    stock: 8
  }
];

const importFlowers = async () => {
  try {
    // Get the path to the flower images
    const imagesDir = path.join(__dirname, '../../../FlowerMarket');
    
    // Read all image files
    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => file.match(/\.(jpeg|jpg|png)$/i));

    console.log(`Found ${imageFiles.length} image files`);

    // Create flower entries
    for (let i = 0; i < flowerData.length; i++) {
      const flower = flowerData[i];
      const imageFile = imageFiles[i % imageFiles.length]; // Cycle through available images
      
      // Create the flower entry
      const newFlower = await Flower.create({
        ...flower,
        imageUrl: `/uploads/${imageFile}` // Store the image path
      });

      console.log(`Created flower: ${newFlower.name}`);
    }

    console.log('Flower import completed successfully');
  } catch (error) {
    console.error('Error importing flowers:', error);
  }
};

// Run the import
importFlowers(); 