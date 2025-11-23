#!/bin/bash

# Complete setup script - run this after Node.js is installed

echo "🔧 Completing Pregnancy Nutrition Tracker setup..."

# Load nvm if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install it first:"
    echo "   Visit: https://nodejs.org/ and download the LTS version"
    echo "   Or run: brew install node (if Homebrew is installed)"
    exit 1
fi

echo "✅ Found Node.js: $(node --version)"
echo "✅ Found npm: $(npm --version)"

# Navigate to project
cd "$(dirname "$0")"

# Install dependencies
echo ""
echo "📦 Installing project dependencies..."
npm install

# Install Tailwind CSS if not already installed
if ! npm list tailwindcss &> /dev/null; then
    echo "📦 Installing Tailwind CSS..."
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo ""
npm run dev

