# Flower Market Mobile App

A mobile application for an online flower marketplace based on Figma design. This application is built using React Native with Expo.

## Features

- **Browse Flowers**: View all available flowers with details
- **Filter & Sort**: Filter flowers by category, size, color, and sort by various criteria
- **Search**: Search for flowers by name, description, or category
- **CRUD Operations**: Create, read, update, and delete flowers
- **Form Validation**: Validate inputs when adding/editing flowers
- **Responsive UI**: Beautiful user interface following the Figma design

## Screenshots

The application is based on the Figma design: [Online Flower Market](https://www.figma.com/design/oiUII1JYivyRNMtdFuGHGw/OnlineFlowerMarket?node-id=0-1&p=f&t=nPDoGAKD0m6melJ5-0)

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation
- React Native Paper
- Jest for testing

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/flower-market.git
cd flower-market
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open the app on your device:
   - Use the Expo Go app on your phone to scan the QR code
   - Press 'a' to open on Android emulator
   - Press 'i' to open on iOS simulator

## Testing

Run the tests with:
```
npm test
```

## Project Structure

```
FlowerMarket/
├── src/
│   ├── components/      # Reusable UI components
│   ├── models/          # Data models
│   ├── navigation/      # Navigation setup
│   ├── screens/         # App screens
│   ├── services/        # Services for data management
│   ├── tests/           # Unit tests
│   └── utils/           # Utility functions
├── App.tsx              # Main app entry point
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Design inspiration from the provided Figma design
- Built as part of a coding assignment 