import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import app from '../app'; // We'll create this next

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Set up MongoDB Memory Server for testing
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Flower API', () => {
  // Test data
  const testFlower = {
    name: 'Test Bouquet',
    price: 49.99,
    description: 'A beautiful test bouquet for unit testing',
    category: 'Bestsellers',
    imageUrl: 'https://example.com/test.jpg',
    brand: 'TestBrand',
    event: 'Wedding'
  };

  let flowerId: string;

  // Test POST /api/flowers
  test('POST /api/flowers - Create a new flower', async () => {
    const response = await request(app)
      .post('/api/flowers')
      .send(testFlower);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe(testFlower.name);
    expect(response.body.data.price).toBe(testFlower.price);

    // Save ID for later tests
    flowerId = response.body.data.id;
  });

  // Test GET /api/flowers
  test('GET /api/flowers - Get all flowers', async () => {
    const response = await request(app).get('/api/flowers');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  // Test GET /api/flowers/:id
  test('GET /api/flowers/:id - Get flower by ID', async () => {
    const response = await request(app).get(`/api/flowers/${flowerId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id', flowerId);
    expect(response.body.data.name).toBe(testFlower.name);
  });

  // Test PATCH /api/flowers/:id
  test('PATCH /api/flowers/:id - Update flower', async () => {
    const updateData = {
      name: 'Updated Test Bouquet',
      price: 59.99
    };

    const response = await request(app)
      .patch(`/api/flowers/${flowerId}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(updateData.name);
    expect(response.body.data.price).toBe(updateData.price);
    expect(response.body.data.description).toBe(testFlower.description); // This should remain unchanged
  });

  // Test GET /api/flowers with filtering
  test('GET /api/flowers?category=Bestsellers - Filter flowers by category', async () => {
    const response = await request(app).get('/api/flowers?category=Bestsellers');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].category).toBe('Bestsellers');
  });

  // Test GET /api/flowers with sorting
  test('GET /api/flowers?sortBy=price&sortOrder=desc - Sort flowers by price descending', async () => {
    const response = await request(app).get('/api/flowers?sortBy=price&sortOrder=desc');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Check if array is sorted by price in descending order
    const prices = response.body.data.map((flower: any) => flower.price);
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  // Test DELETE /api/flowers/:id
  test('DELETE /api/flowers/:id - Delete flower', async () => {
    const response = await request(app).delete(`/api/flowers/${flowerId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Verify flower is actually deleted
    const getResponse = await request(app).get(`/api/flowers/${flowerId}`);
    expect(getResponse.status).toBe(404);
  });

  // Test validation
  test('POST /api/flowers - Validation error for invalid price', async () => {
    const invalidFlower = {
      ...testFlower,
      price: -10 // Invalid negative price
    };

    const response = await request(app)
      .post('/api/flowers')
      .send(invalidFlower);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeTruthy();
  });
}); 