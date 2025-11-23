# Pregnancy Nutrition Tracker - MVP

A comprehensive web application to help low-income pregnant women make safe, affordable, nutritious food choices.

## Features

✅ **Landing Page** - Welcome screen with sign-up options  
✅ **User Onboarding** - 4-step survey collecting essential information  
✅ **Dashboard** - Personalized home with daily summary  
✅ **Hydration Tracker** - Track daily water intake  
✅ **Nutrient Tracker** - Visual progress bars for 8 essential nutrients  
✅ **Craving Converter** - Search any food to check safety and get alternatives  
✅ **Food Safety Guide** - Comprehensive database of safe/unsafe foods  
✅ **Trimester Tips** - Week-by-week nutrition guidance  
✅ **Meal Suggestions** - Budget-friendly meal ideas based on cooking access  
✅ **Mood Tracker** - Track mood and get personalized recommendations  
✅ **Pregnancy Conditions** - Nutrition fixes for common conditions  

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **LocalStorage** for data persistence (MVP)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable components (Navbar, etc.)
├── pages/           # Page components
│   ├── Landing.tsx
│   ├── SignUp.tsx
│   ├── Dashboard.tsx
│   ├── Nutrients.tsx
│   ├── FoodSafety.tsx
│   ├── Trimesters.tsx
│   ├── Meals.tsx
│   ├── MoodTracker.tsx
│   └── Conditions.tsx
├── data/            # Data files
│   ├── nutrients.ts
│   ├── foodSafety.ts
│   ├── meals.ts
│   └── trimesterTips.ts
├── types/           # TypeScript type definitions
│   └── index.ts
└── App.tsx          # Main app component
```

## Key Features Explained

### 1. Landing Page
- Hero section with clear value proposition
- Two CTAs: "Create Free Account" or "Continue Without Logging In"
- Quick quiz option for immediate craving check

### 2. Onboarding Survey
4-step process collecting:
- Basic info (age, ZIP, pregnancy week)
- Health info (weight, height, BMI calculation)
- Dietary preferences (restrictions, cooking access, budget)
- Daily habits (cravings, hydration, mood)

### 3. Dashboard
- Hydration tracker with progress bar
- Top 5 nutrients checklist
- Craving converter search
- Meal suggestions
- Quick links to all features

### 4. Nutrient Tracker
- 8 essential nutrients with visual progress bars
- Detailed information for each nutrient
- Budget-friendly sources
- Deficiency signs

### 5. Food Safety Guide
- Search any food item
- Categorized lists (Avoid, Limit, Safe)
- Risk levels and explanations
- Safer alternatives
- Source citations

### 6. Trimester Tips
- Trimester-specific guidance
- Key nutrients for each stage
- Tips and recommendations
- Foods to avoid

### 7. Meal Suggestions
- Filtered by cooking method
- Budget considerations
- Nutrient-focused options
- Quick prep times

### 8. Mood Tracker
- Simple 3-emoji selector
- Personalized recommendations
- Nutrient suggestions
- Exercise tips

### 9. Pregnancy Conditions
- Common conditions (constipation, nausea, heartburn, etc.)
- Foods to eat/avoid
- Recipe ideas
- Tips and recommendations

## Data Sources

All information is based on guidelines from:
- ACOG (American College of Obstetricians and Gynecologists)
- CDC (Centers for Disease Control and Prevention)
- WHO (World Health Organization)
- NIH Office of Dietary Supplements
- March of Dimes

## Medical Disclaimer

⚠️ **Important**: This app provides general nutrition information and is not a substitute for professional medical advice. Always consult with your healthcare provider for personalized guidance.

## Future Enhancements

- [ ] Backend integration (Firebase/Supabase)
- [ ] User authentication
- [ ] Food logging with barcode scanning
- [ ] Integration with USDA FoodData API
- [ ] WIC program integration
- [ ] Recipe collection
- [ ] Progress tracking over time
- [ ] Community features
- [ ] Mobile app version

## Development Notes

- Currently uses localStorage for data persistence (MVP)
- All styling uses Tailwind CSS
- Icons from Lucide React
- Mobile-first responsive design
- TypeScript for type safety

## License

This project is for educational purposes.
