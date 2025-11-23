# OpenAI Integration Setup Guide

## Overview
This application now uses the OpenAI API to automatically fetch nutrient information for meals logged in the meal log and craving sections. The API provides accurate nutritional data and helpful meal suggestions.

## What Was Fixed

1. **Server Configuration**: Updated `server/index.cjs` to properly load the `.env` file from the parent directory
2. **API Integration**: The server now correctly uses the OpenAI API key from `.env`
3. **Frontend Proxy**: Added Vite proxy configuration to route API calls to the backend server
4. **Dependencies**: Updated to use Express's built-in JSON parser instead of body-parser
5. **File Cleanup**: Removed corrupted content from Meals.tsx

## How It Works

### Meal Log Section (Meals Page)
1. Enter a food name in the search field (e.g., "grilled salmon", "spinach salad", "apple")
2. Click "Lookup & Suggest" to:
   - Get nutritional information from OpenAI
   - Receive AI-powered meal suggestions
3. Click "Log Food" to save the entry with nutrient data
4. AI suggestions appear as clickable buttons that can be logged instantly

### Craving Section (Craving Result Page)
1. Search for a craving or food
2. Click "Log this food" button
3. The system automatically:
   - Fetches nutrient information via OpenAI
   - Saves the entry with complete nutritional data
   - Updates your daily nutrient progress

## API Endpoints

### POST /api/nutrients
Fetches nutritional information for a food item.

**Request:**
```json
{
  "name": "grilled salmon"
}
```

**Response:**
```json
{
  "nutrientAmounts": {
    "Iron": 0.5,
    "Protein": 25,
    "Calcium": 15,
    "Folate": 25,
    "DHA": 1200,
    "Vitamin C": 0,
    "Fiber": 0
  }
}
```

### POST /api/suggest
Gets AI-powered meal suggestions related to a food.

**Request:**
```json
{
  "name": "salmon"
}
```

**Response:**
```json
{
  "suggestions": [
    "Grilled salmon with vegetables",
    "Salmon salad with quinoa",
    "Baked salmon with sweet potato",
    "Salmon tacos with cabbage slaw",
    "Salmon and avocado bowl"
  ]
}
```

## Running the Application

### Option 1: Use the Startup Script (Recommended)
```bash
cd pregnant-nutrition-tracker
./start.sh
```

This script will:
1. Start the backend server on port 4000
2. Start the frontend development server
3. Automatically clean up when you stop it

### Option 2: Manual Start
In two separate terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd pregnant-nutrition-tracker
npm run start-server
```

**Terminal 2 - Frontend:**
```bash
cd pregnant-nutrition-tracker
npm run dev
```

## Environment Configuration

Your `.env` file should contain:
```
OPENAI_API_KEY=sk-your-api-key-here
```

**IMPORTANT:** 
- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template for other developers

## Testing the Integration

1. **Start the application** using `./start.sh`
2. **Navigate to the Meals page** from the dashboard
3. **Test nutrient lookup:**
   - Enter "grilled chicken" in the search field
   - Click "Lookup & Suggest"
   - You should see nutrient data in the notes field
   - AI suggestions should appear below
4. **Test logging:**
   - Click "Log Food"
   - Check the Today's Log section to see the entry
   - Verify nutrient progress updates on the Nutrients page
5. **Test craving section:**
   - Go to the Dashboard
   - Search for a food in the craving search
   - Click "Log this food" on the result page
   - Verify the entry appears in the meal log with nutrients

## Troubleshooting

### Server won't start
- Check if port 4000 is already in use: `lsof -i :4000`
- Kill any processes using port 4000: `kill -9 <PID>`

### API calls fail
- Verify the server is running on port 4000
- Check browser console for error messages
- Ensure `.env` file exists and contains valid OpenAI API key
- Check server logs for OpenAI API errors

### No nutrient data appearing
- Open browser DevTools Network tab
- Check if `/api/nutrients` requests are successful
- Verify the server console shows "OPENAI_API_KEY present: true"
- Check OpenAI API usage limits

### Dependencies missing
```bash
cd pregnant-nutrition-tracker
npm install
```

## Features

✅ Automatic nutrient lookup using OpenAI GPT-3.5
✅ AI-powered meal suggestions
✅ Real-time nutrient tracking
✅ Integration with existing meal log system
✅ Fallback handling when server is unavailable
✅ Smart caching with localStorage

## API Key Security

The OpenAI API key is:
- Stored only in the `.env` file
- Never exposed to the frontend
- Only used on the backend server
- Properly loaded from the parent directory

## Future Enhancements

- Add caching to reduce API calls
- Implement rate limiting
- Add user-specific API preferences
- Support multiple AI providers
- Add nutritional database fallback
