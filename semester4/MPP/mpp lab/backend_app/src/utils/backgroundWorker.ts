import Flower from '../models/Flower.ts';
import { emitChartData, emitFlowerCreated } from './websocket.ts';

const CATEGORIES = ['Bestsellers', 'New', 'Specials', 'Collections'];
const EVENTS = ['Wedding', 'Anniversaries', 'Holidays', 'Other'];
const BRANDS = ['FlowerLux', 'BloomArt', 'EcoFlora', 'NatureBlossom'];

let isRunning = false;
let interval: NodeJS.Timeout | null = null;

// Generate a random flower
const generateRandomFlower = () => {
  const randomName = `${['Spring', 'Summer', 'Autumn', 'Winter'][Math.floor(Math.random() * 4)]} ${['Bouquet', 'Arrangement', 'Bundle', 'Collection'][Math.floor(Math.random() * 4)]}`;
  const randomPrice = (Math.random() * 100 + 20).toFixed(2);
  
  return {
    name: randomName,
    price: parseFloat(randomPrice),
    description: `Beautiful ${randomName.toLowerCase()} with fresh seasonal flowers`,
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    imageUrl: `https://example.com/placeholder-${Math.floor(Math.random() * 10) + 1}.jpg`,
    brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
    event: EVENTS[Math.floor(Math.random() * EVENTS.length)] as 'Wedding' | 'Anniversaries' | 'Holidays' | 'Other',
    createdAt: new Date()
  };
};

// Generate chart data based on current flowers
const generateChartData = async () => {
  // Count flowers by category
  const categoryData = await Flower.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  // Get price ranges
  const priceRanges = await Flower.aggregate([
    {
      $facet: {
        under50: [{ $match: { price: { $lt: 50 } } }, { $count: 'count' }],
        between50And100: [{ $match: { price: { $gte: 50, $lt: 100 } } }, { $count: 'count' }],
        over100: [{ $match: { price: { $gte: 100 } } }, { $count: 'count' }]
      }
    }
  ]);
  
  // Events distribution
  const eventData = await Flower.aggregate([
    { $group: { _id: '$event', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  return {
    categories: categoryData.map(item => ({ name: item._id, count: item.count })),
    prices: {
      under50: priceRanges[0].under50[0]?.count || 0,
      between50And100: priceRanges[0].between50And100[0]?.count || 0,
      over100: priceRanges[0].over100[0]?.count || 0
    },
    events: eventData.map(item => ({ name: item._id, count: item.count }))
  };
};

// Start background worker
export const startBackgroundWorker = (intervalMs = 15000) => {
  if (isRunning) return;
  
  isRunning = true;
  console.log('Background worker started');
  
  interval = setInterval(async () => {
    try {
      // Generate and save a new random flower
      const randomFlower = generateRandomFlower();
      const newFlower = await Flower.create(randomFlower);
      
      // Emit real-time updates
      emitFlowerCreated(newFlower);
      
      // Generate and emit chart data
      const chartData = await generateChartData();
      emitChartData(chartData);
      
      console.log('Generated new flower and updated chart data');
    } catch (error) {
      console.error('Error in background worker:', error);
    }
  }, intervalMs);
};

// Stop background worker
export const stopBackgroundWorker = () => {
  if (!isRunning) return;
  
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  
  isRunning = false;
  console.log('Background worker stopped');
}; 