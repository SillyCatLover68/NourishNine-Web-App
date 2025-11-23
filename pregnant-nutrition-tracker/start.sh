#!/bin/bash

# Start the backend server in the background
echo "Starting backend server on port 4000..."
cd "$(dirname "$0")"
npm run start-server &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Start the frontend development server
echo "Starting frontend development server..."
npm run dev

# Cleanup: kill the server when the script exits
trap "kill $SERVER_PID" EXIT
