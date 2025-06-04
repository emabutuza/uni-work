import express from 'express';
import { createFlower, getFlowers, getFlower, updateFlower, deleteFlower } from '../controllers/flowerController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getFlowers);
router.get('/:id', getFlower);

// Protected routes (require authentication)
router.post('/', auth, adminAuth, createFlower);
router.patch('/:id', auth, adminAuth, updateFlower);
router.delete('/:id', auth, adminAuth, deleteFlower);

export default router; 