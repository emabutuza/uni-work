# Flower Market Backend

This is the backend server for the Flower Market mobile app, built with Node.js, Express, TypeScript, and MongoDB.

## Features

### Bronze Tier
- ✅ RESTful API with full CRUD operations for flowers
- ✅ Filtering and sorting capabilities
- ✅ Unit tests
- ✅ Server-side validation

### Silver Tier
- ✅ Ready for offline support integration with the mobile app

### Gold Tier
- ✅ Real-time updates with WebSockets
- ✅ Background worker for generating asynchronous chart data
- ✅ File uploads for images and videos

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local instance or MongoDB Atlas)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables (copy `.env.example` to `.env` and adjust values)
4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Flowers

- `GET /api/flowers` - Get all flowers with pagination, filtering, and sorting
  - Query parameters:
    - `page` (default: 1)
    - `limit` (default: 10)
    - `category`
    - `event`
    - `minPrice`
    - `maxPrice`
    - `sortBy` (e.g., 'price', 'name')
    - `sortOrder` ('asc' or 'desc')
    - `search` (search in name and description)

- `GET /api/flowers/:id` - Get a specific flower
- `POST /api/flowers` - Create a new flower
- `PATCH /api/flowers/:id` - Update an existing flower
- `DELETE /api/flowers/:id` - Delete a flower
- `GET /api/flowers/category/:category` - Get flowers by category

### File Upload

- `POST /api/upload` - Upload a single file
- `POST /api/upload/multiple` - Upload multiple files

## WebSocket Events

The backend provides real-time updates via WebSocket:

- `flower:created` - Emitted when a new flower is created
- `flower:updated` - Emitted when a flower is updated
- `flower:deleted` - Emitted when a flower is deleted
- `chart:update` - Emitted with chart data updates

## Project Structure

```
backend_app/
├── src/
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Express middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── tests/         # Unit tests
│   ├── utils/         # Utility functions
│   ├── app.ts         # Express app setup
│   └── index.ts       # Server entry point
├── uploads/           # Uploaded files
├── .env               # Environment variables
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

## Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the project for production
- `npm start` - Start the production server
- `npm test` - Run tests 