# Quick Start Guide

## Prerequisites: Install Node.js

You need Node.js installed to run this application. Choose one method:

### Method 1: Download from nodejs.org (Easiest)
1. Visit https://nodejs.org/
2. Download the **LTS version** for macOS
3. Run the installer
4. Restart your terminal

### Method 2: Install Homebrew, then Node.js
```bash
# Install Homebrew (requires password)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

### Method 3: Use nvm (Node Version Manager)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js
nvm install --lts
nvm use --lts
```

## After Node.js is Installed

1. **Navigate to the project:**
   ```bash
   cd /Users/josephlee/Downloads/pregnant-women/pregnant-nutrition-tracker
   ```

2. **Run the setup script:**
   ```bash
   ./setup.sh
   ```
   
   Or manually:
   ```bash
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at `http://localhost:5173`
   - Or check the terminal for the exact URL

## Verify Installation

Check if Node.js is installed:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

## Troubleshooting

- **"command not found: node"** → Node.js is not installed or not in PATH
- **"permission denied"** → You may need to use `sudo` (not recommended) or install via the official installer
- **Port already in use** → Vite will automatically use the next available port

## Need Help?

If you encounter issues:
1. Make sure Node.js is installed: `node --version`
2. Make sure you're in the correct directory
3. Try deleting `node_modules` and running `npm install` again

