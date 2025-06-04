import { User, Flower, Order, ActivityLog } from '../models/index.js';
import { Op } from 'sequelize';

// Get sales analytics with optimized query
export const getSalesAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    // Build where clause
    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    // Optimized query using includes and attributes
    const salesData = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('Order.createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalSales'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
        [sequelize.fn('AVG', sequelize.col('totalPrice')), 'averageOrderValue']
      ],
      include: [{
        model: Flower,
        as: 'flower',
        attributes: ['category'],
        where: category ? { category } : {}
      }],
      where,
      group: [
        sequelize.fn('DATE_TRUNC', 'month', sequelize.col('Order.createdAt')),
        'flower.category'
      ],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('Order.createdAt')), 'ASC']],
      raw: true
    });

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user activity analytics
export const getUserActivityAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const activityData = await ActivityLog.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt')), 'date'],
        'action',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where,
      group: [
        sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt')),
        'action'
      ],
      order: [[sequelize.fn('DATE_TRUNC', 'day', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    res.json(activityData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get inventory analytics
export const getInventoryAnalytics = async (req, res) => {
  try {
    const inventoryData = await Flower.findAll({
      attributes: [
        'category',
        [sequelize.fn('SUM', sequelize.col('stock')), 'totalStock'],
        [sequelize.fn('AVG', sequelize.col('price')), 'averagePrice'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'productCount']
      ],
      group: ['category'],
      raw: true
    });

    res.json(inventoryData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 