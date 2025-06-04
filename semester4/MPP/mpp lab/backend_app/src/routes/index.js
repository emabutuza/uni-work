import express from 'express';
import userRoutes from './userRoutes.js';
import flowerRoutes from './flowerRoutes.js';
import orderRoutes from './orderRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/flowers', flowerRoutes);
router.use('/orders', orderRoutes);

export default router; 