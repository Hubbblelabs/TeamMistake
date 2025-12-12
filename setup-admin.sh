#!/bin/bash

# Admin Dashboard Setup Script
# This script helps you create your first admin user

echo "🚀 TeamMistake Admin Dashboard Setup"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please copy .env.example to .env.local and fill in the values:"
    echo "  cp .env.example .env.local"
    exit 1
fi

# Load environment variables
source .env.local

# Check if required variables are set
if [ -z "$ADMIN_SETUP_SECRET" ]; then
    echo "❌ Error: ADMIN_SETUP_SECRET not set in .env.local"
    exit 1
fi

echo "📝 Please enter your admin details:"
echo ""

# Get admin details
read -p "Admin Email: " ADMIN_EMAIL_INPUT
read -p "Admin Name: " ADMIN_NAME
read -sp "Admin Password: " ADMIN_PASSWORD
echo ""
echo ""

# Confirm
echo "Creating admin user with:"
echo "  Email: $ADMIN_EMAIL_INPUT"
echo "  Name: $ADMIN_NAME"
echo ""
read -p "Is this correct? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Check if server is running
echo ""
echo "🔍 Checking if development server is running..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "⚠️  Development server not running!"
    echo "Please start it with: npm run dev"
    echo ""
    read -p "Start server now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Starting server..."
        npm run dev > /dev/null 2>&1 &
        SERVER_PID=$!
        echo "Waiting for server to start..."
        sleep 5
    else
        exit 1
    fi
fi

# Create admin user
echo ""
echo "📤 Creating admin user..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$ADMIN_EMAIL_INPUT\",
    \"password\": \"$ADMIN_PASSWORD\",
    \"name\": \"$ADMIN_NAME\",
    \"secret\": \"$ADMIN_SETUP_SECRET\"
  }")

# Check response
if echo "$RESPONSE" | grep -q "success"; then
    echo ""
    echo "✅ Admin user created successfully!"
    echo ""
    echo "🎉 You can now login at: http://localhost:3000/admin/login"
    echo ""
    echo "📧 Email: $ADMIN_EMAIL_INPUT"
    echo "🔑 Password: (the one you entered)"
    echo ""
    echo "⚠️  Important: For security, consider disabling the /api/admin/setup"
    echo "   endpoint after creating your admin user."
else
    echo ""
    echo "❌ Failed to create admin user"
    echo "Response: $RESPONSE"
    echo ""
    echo "Common issues:"
    echo "  - Admin user might already exist"
    echo "  - ADMIN_SETUP_SECRET might be incorrect"
    echo "  - Server might not be running"
fi

# Cleanup
if [ ! -z "$SERVER_PID" ]; then
    echo ""
    read -p "Stop the development server? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kill $SERVER_PID
        echo "Server stopped."
    fi
fi
