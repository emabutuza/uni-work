import { faker } from '@faker-js/faker';
import { User, Flower, Order, ActivityLog } from '../models/index.js';
import sequelize from '../config/database.js';

// Configuration
const NUM_USERS = 100000;
const NUM_FLOWERS = 100000;
const NUM_ORDERS = 100000;
const NUM_ACTIVITY_LOGS = 100000;

// Helper function to create users
const createUsers = async () => {
  console.log('Creating users...');
  const users = [];
  const usedUsernames = new Set();
  const usedEmails = new Set();

  for (let i = 0; i < NUM_USERS; i++) {
    let username, email;
    do {
      username = faker.internet.username();
    } while (usedUsernames.has(username));
    
    do {
      email = faker.internet.email();
    } while (usedEmails.has(email));

    usedUsernames.add(username);
    usedEmails.add(email);

    users.push({
      username,
      email,
      password: 'password123', // Will be hashed by the model hook
      role: faker.helpers.arrayElement(['user', 'admin']),
      isMonitored: faker.datatype.boolean(),
      lastLogin: faker.date.recent()
    });
  }
  
  // Batch insert users
  const batches = [];
  const batchSize = 1000;
  for (let i = 0; i < users.length; i += batchSize) {
    batches.push(users.slice(i, i + batchSize));
  }
  
  for (const batch of batches) {
    await User.bulkCreate(batch);
    console.log(`Created ${batch.length} users`);
  }
};

// Helper function to create flowers
const createFlowers = async () => {
  console.log('Creating flowers...');
  const flowers = [];
  const categories = ['Bouquets', 'Collections', 'Seasonal', 'Bundles', 'Exotic'];
  const brands = ['Premium Flowers', 'Garden Fresh', 'Nature\'s Best', 'Dutch Flowers', 'Tropical Blooms'];
  const events = ['Wedding', 'Anniversary', 'Birthday', 'Graduation', 'Corporate'];

  for (let i = 0; i < NUM_FLOWERS; i++) {
    flowers.push({
      name: faker.commerce.productName(),
      price: faker.number.float({ min: 10, max: 200, precision: 2 }),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(categories),
      imageUrl: `/uploads/flower_${faker.number.int({ min: 1, max: 11 })}.jpeg`,
      brand: faker.helpers.arrayElement(brands),
      event: faker.helpers.arrayElement(events),
      stock: faker.number.int({ min: 0, max: 100 })
    });
  }

  // Batch insert flowers
  const batches = [];
  const batchSize = 1000;
  for (let i = 0; i < flowers.length; i += batchSize) {
    batches.push(flowers.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Flower.bulkCreate(batch);
    console.log(`Created ${batch.length} flowers`);
  }
};

// Helper function to create orders
const createOrders = async () => {
  console.log('Creating orders...');
  const orders = [];
  const statuses = ['pending', 'processing', 'completed', 'cancelled'];

  // Get all user and flower IDs
  const users = await User.findAll({ attributes: ['id'] });
  const flowers = await Flower.findAll({ attributes: ['id', 'price'] });

  for (let i = 0; i < NUM_ORDERS; i++) {
    const quantity = faker.number.int({ min: 1, max: 10 });
    const flower = faker.helpers.arrayElement(flowers);
    orders.push({
      userId: faker.helpers.arrayElement(users).id,
      flowerId: flower.id,
      quantity,
      totalPrice: flower.price * quantity,
      status: faker.helpers.arrayElement(statuses),
      shippingAddress: faker.location.streetAddress(),
      createdAt: faker.date.past()
    });
  }

  // Batch insert orders
  const batches = [];
  const batchSize = 1000;
  for (let i = 0; i < orders.length; i += batchSize) {
    batches.push(orders.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await Order.bulkCreate(batch);
    console.log(`Created ${batch.length} orders`);
  }
};

// Helper function to create activity logs
const createActivityLogs = async () => {
  console.log('Creating activity logs...');
  const logs = [];
  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE'];
  const entityTypes = ['User', 'Flower', 'Order'];

  // Get all user IDs
  const users = await User.findAll({ attributes: ['id'] });

  for (let i = 0; i < NUM_ACTIVITY_LOGS; i++) {
    logs.push({
      userId: faker.helpers.arrayElement(users).id,
      action: faker.helpers.arrayElement(actions),
      entityType: faker.helpers.arrayElement(entityTypes),
      entityId: faker.string.uuid(),
      details: faker.lorem.sentence(),
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      createdAt: faker.date.past()
    });
  }

  // Batch insert activity logs
  const batches = [];
  const batchSize = 1000;
  for (let i = 0; i < logs.length; i += batchSize) {
    batches.push(logs.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    await ActivityLog.bulkCreate(batch);
    console.log(`Created ${batch.length} activity logs`);
  }
};

// Main function to generate all data
const generateData = async () => {
  try {
    console.log('Starting data generation...');
    
    // Create tables if they don't exist
    await sequelize.sync({ force: true });
    
    // Generate data in sequence
    await createUsers();
    await createFlowers();
    await createOrders();
    await createActivityLogs();
    
    console.log('Data generation completed successfully!');
  } catch (error) {
    console.error('Error generating data:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the data generation
generateData(); 