import { Flower, ActivityLog } from '../models/index.js';
import { Op } from 'sequelize';

// Create a new flower
export const createFlower = async (req, res) => {
  try {
    const flower = await Flower.create(req.body);

    // Log the creation
    await ActivityLog.create({
      userId: req.user.id,
      action: 'CREATE',
      entityType: 'Flower',
      entityId: flower.id,
      details: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json(flower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all flowers with filtering and sorting
export const getFlowers = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      brand,
      event,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    const where = {};
    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (event) where.event = event;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await Flower.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Log the read operation
    await ActivityLog.create({
      userId: req.user.id,
      action: 'READ',
      entityType: 'Flower',
      entityId: null,
      details: { filters: req.query },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      flowers: rows
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single flower
export const getFlower = async (req, res) => {
  try {
    const flower = await Flower.findByPk(req.params.id);
    if (!flower) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    // Log the read operation
    await ActivityLog.create({
      userId: req.user.id,
      action: 'READ',
      entityType: 'Flower',
      entityId: flower.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json(flower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a flower
export const updateFlower = async (req, res) => {
  try {
    const flower = await Flower.findByPk(req.params.id);
    if (!flower) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    await flower.update(req.body);

    // Log the update
    await ActivityLog.create({
      userId: req.user.id,
      action: 'UPDATE',
      entityType: 'Flower',
      entityId: flower.id,
      details: req.body,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json(flower);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a flower
export const deleteFlower = async (req, res) => {
  try {
    const flower = await Flower.findByPk(req.params.id);
    if (!flower) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    await flower.destroy();

    // Log the deletion
    await ActivityLog.create({
      userId: req.user.id,
      action: 'DELETE',
      entityType: 'Flower',
      entityId: flower.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ message: 'Flower deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 