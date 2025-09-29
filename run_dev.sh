#!/bin/bash

set -e

echo "Starting Rails API server..."
cd backend
docker-compose run --rm --service-ports web rails s -b 0.0.0.0 -p 3000 &
BACKEND_PID=$!

echo "Starting Frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

trap "echo '🛑 Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" SIGINT

wait