import mongoose from 'mongoose';
import http from 'http';
import { config } from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from './app.ts';
import { initWebSocket } from './utils/websocket.ts';
import { startBackgroundWorker } from './utils/backgroundWorker.ts';

// Load environment variables
config();

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
initWebSocket(server);

// Server port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    
    // If we're in a local development environment and no MongoDB is available,
    // use MongoMemoryServer as a fallback
    if (!uri || uri.includes('testuser:testpassword')) {
      console.log('Using MongoDB Memory Server for local development');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      
      // Add cleanup on server close
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
        process.exit(0);
      });
    }
    
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Start background worker for real-time data generation (Gold tier)
    // This will generate random flowers and update chart data
    if (process.env.NODE_ENV === 'development') {
      startBackgroundWorker();
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`API is available at http://localhost:${PORT}/api/health`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Start the server
startServer(); 