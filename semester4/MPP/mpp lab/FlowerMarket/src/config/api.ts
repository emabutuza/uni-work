// API Configuration
// 172.30.245.48

export const API_CONFIG = {
  // Base URL for API requests - change this when deploying to production
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.onrender.com'  // Replace with your actual Render backend URL
    : 'http://localhost:3000',

  // Fallback images for when API images are not available
  FALLBACK_IMAGES: {
    FLOWER_1: require('../assets/flower1.png'),
    FLOWER_2: require('../assets/flower2.png'),
    FLOWER_3: require('../assets/flower3.png'),
    FLOWER_4: require('../assets/flower4.png'),
    DEFAULT: require('../../_ (5).jpeg'),
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Endpoints
  ENDPOINTS: {
    FLOWERS: '/api/flowers',
    HEALTH: '/api/health',
    UPLOAD: '/upload',
    AUTH: '/api/auth',
    ORDERS: '/api/orders',
    CART: '/api/cart'
  }
}; 