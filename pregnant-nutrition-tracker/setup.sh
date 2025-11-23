#!/bin/bash

# Setup script for Pregnancy Nutrition Tracker

echo "🚀 Setting up Pregnancy Nutrition Tracker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo ""
    echo "Please install Node.js using one of these methods:"
    echo ""
    echo "Option 1: Install via Homebrew (recommended)"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "  brew install node"
    echo ""
    echo "Option 2: Download from nodejs.org"
    echo "  Visit: https://nodejs.org/"
    echo "  Download and install the LTS version"
    echo ""
    echo "Option 3: Use nvm (if already installed)"
    echo "  nvm install --lts"
    echo "  nvm use --lts"
    echo ""
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Tailwind is installed
if ! npm list tailwindcss &> /dev/null; then
    echo "📦 Installing Tailwind CSS..."
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""

