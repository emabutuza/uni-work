import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 