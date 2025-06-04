import express from 'express';
import { getSalesAnalytics, getUserActivityAnalytics, getInventoryAnalytics } from '../controllers/analyticsController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// All analytics routes require authentication and admin privileges
router.get('/sales', auth, adminAuth, getSalesAnalytics);
router.get('/user-activity', auth, adminAuth, getUserActivityAnalytics);
router.get('/inventory', auth, adminAuth, getInventoryAnalytics);

export default router; 