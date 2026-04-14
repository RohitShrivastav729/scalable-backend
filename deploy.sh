
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project directory
cd ~/scalable-backend

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Restart app using PM2
pm2 restart scalable-app || pm2 start server.js --name scalable-app

echo "✅ Deployment completed"