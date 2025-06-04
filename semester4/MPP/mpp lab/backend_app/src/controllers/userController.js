import jwt from 'jsonwebtoken';
import { User, ActivityLog } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user.id }, JWT_SECRET);

    await ActivityLog.create({
      userId: user.id,
      action: 'register',
      entityType: 'user',
      entityId: user.id,
      details: 'User registered successfully',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      throw new Error('Invalid login credentials');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    user.lastLogin = new Date();
    await user.save();

    await ActivityLog.create({
      userId: user.id,
      action: 'login',
      entityType: 'user',
      entityId: user.id,
      details: 'User logged in successfully',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (username) user.username = username;
    if (email) user.email = email;
    
    await user.save();

    await ActivityLog.create({
      userId: user.id,
      action: 'update_profile',
      entityType: 'user',
      entityId: user.id,
      details: 'User profile updated',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 