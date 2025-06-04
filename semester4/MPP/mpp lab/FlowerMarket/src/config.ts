export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000',
  },
  production: {
    baseURL: 'https://your-backend-url.onrender.com', // Replace with your actual Render backend URL
  },
};

export const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG[env as keyof typeof API_CONFIG];
}; 