import express from 'express';
import { register, login, getProfile, updateProfile, getActivityLogs } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);
router.get('/activity-logs', auth, getActivityLogs);

export default router; 