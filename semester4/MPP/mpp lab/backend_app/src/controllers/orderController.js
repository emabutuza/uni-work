import { Order, Flower, ActivityLog } from '../models/index.js';

export const createOrder = async (req, res) => {
  try {
    const { flowerId, quantity, shippingAddress } = req.body;
    const flower = await Flower.findByPk(flowerId);

    if (!flower) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    if (flower.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const totalPrice = flower.price * quantity;
    const order = await Order.create({
      userId: req.user.id,
      flowerId,
      quantity,
      totalPrice,
      shippingAddress,
      status: 'pending'
    });

    flower.stock -= quantity;
    await flower.save();

    await ActivityLog.create({
      userId: req.user.id,
      action: 'create',
      entityType: 'order',
      entityId: order.id,
      details: 'Order created successfully',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: Flower, as: 'flower' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Flower, as: 'flower' }]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await order.update({ status });

    await ActivityLog.create({
      userId: req.user.id,
      action: 'update_status',
      entityType: 'order',
      entityId: order.id,
      details: `Order status updated to ${status}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 