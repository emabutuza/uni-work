#!/bin/bash

# Make sure mongodb is running (on macOS with Homebrew)
# If you're not using Homebrew or are on a different OS, adjust this command
if command -v brew &> /dev/null; then
    if brew services list | grep -q mongodb; then
        echo "Checking MongoDB status..."
        if ! brew services list | grep mongodb | grep -q "started"; then
            echo "Starting MongoDB..."
            brew services start mongodb-community
        else
            echo "MongoDB is already running."
        fi
    else
        echo "MongoDB might not be installed via Homebrew."
        echo "Please make sure MongoDB is running before starting the server."
    fi
else
    echo "Homebrew not found. Please make sure MongoDB is running before starting the server."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting Flower Market backend server..."
npm run dev 