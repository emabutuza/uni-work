import User from './User.js';
import Flower from './Flower.js';
import Order from './Order.js';
import ActivityLog from './ActivityLog.js';

// Define relationships
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Flower.hasMany(Order, {
  foreignKey: 'flowerId',
  as: 'orders'
});
Order.belongsTo(Flower, {
  foreignKey: 'flowerId',
  as: 'flower'
});

export {
  User,
  Flower,
  Order,
  ActivityLog
}; 