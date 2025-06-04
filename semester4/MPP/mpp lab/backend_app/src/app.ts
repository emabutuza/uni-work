import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';

// Import routes
import flowerRoutes from './routes/flowerRoutes.ts';
import uploadRoutes from './routes/uploadRoutes.ts';

// Import error handling middleware
import { notFound, errorHandler } from './middleware/errorHandler.ts';

// Load environment variables
config();

// Create Express app
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

// API Routes
app.use('/api/flowers', flowerRoutes);
app.use('/api/upload', uploadRoutes);

// API health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Flower Market API is running',
    timestamp: new Date()
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app; 