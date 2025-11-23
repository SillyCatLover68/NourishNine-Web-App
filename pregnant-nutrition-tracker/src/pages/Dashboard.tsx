import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, CheckCircle, Circle, Search, Utensils, BookOpen, Heart, Stethoscope, Shield, Globe } from 'lucide-react';
import type { User } from '../types';
import { nutrients } from '../data/nutrients';
import { getMealSuggestions } from '../data/meals';

export default function Dashboard() {
  const [user, setUser] = useState<Partial<User>>({});
  const [craving, setCraving] = useState('');
  const [meals, setMeals] = useState(getMealSuggestions({}));

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      const userData = JSON.parse(saved);
      setUser(userData);
      if (userData.cookingAccess) {
        setMeals(getMealSuggestions({ cookingMethod: userData.cookingAccess }));
      }
    }
  }, []);

  const handleCravingSearch = () => {
    if (craving.trim()) {
      window.location.href = `/craving-result?q=${encodeURIComponent(craving)}`;
    }
  };

  const topNutrients = nutrients.slice(0, 5);
  const hydrationCups = user.hydrationCups || 0;
  const hydrationGoal = 8;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {user.trimester ? `Week ${user.pregnancyWeek} — You're doing great! 👶` : 'Welcome!'}
          </h1>
          <p className="text-gray-600">Your personalized pregnancy nutrition dashboard</p>
        </div>

        {/* Hydration Tracker */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Droplet className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Hydration Tracker</h2>
          </div>
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Today: {hydrationCups} / {hydrationGoal} cups</span>
              <span className="text-sm text-gray-500">
                {hydrationCups < hydrationGoal 
                  ? `Aim for ${hydrationGoal - hydrationCups} more cups today!` 
                  : 'Great job! 🎉'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((hydrationCups / hydrationGoal) * 100, 100)}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              const current = user.hydrationCups || 0;
              const newCups = Math.min(current + 1, hydrationGoal);
              if (newCups === current) return; // already at or above goal
              const updated = { ...user, hydrationCups: newCups };
              setUser(updated);
              localStorage.setItem('userData', JSON.stringify(updated));
            }}
            disabled={(user.hydrationCups || 0) >= hydrationGoal}
            className={`text-sm font-medium ${((user.hydrationCups || 0) >= hydrationGoal) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700'}`}
          >
            + Add 1 cup
          </button>
        </div>

        {/* Top 5 Nutrients Checklist */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Top 5 Nutrients for Your Trimester</h2>
          <div className="space-y-3">
            {topNutrients.map((nutrient) => (
              <div key={nutrient.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {Math.random() > 0.5 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium">{nutrient.name}</span>
                </div>
                <span className="text-sm text-gray-600">{nutrient.rda}</span>
              </div>
            ))}
          </div>
          <Link
            to="/nutrients"
            className="block text-center mt-4 text-pink-600 hover:text-pink-700 font-medium"
          >
            View Full Nutrient Tracker →
          </Link>
        </div>

        {/* Craving Converter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-pink-600" />
            <h2 className="text-xl font-semibold">Craving Converter</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={craving}
              onChange={(e) => setCraving(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCravingSearch()}
              placeholder="What are you craving? (e.g., ice cream, hot Cheetos)"
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-600 focus:outline-none"
            />
            <button
              onClick={handleCravingSearch}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Meal Log */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Utensils className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-semibold">Today's Meal Log</h2>
            </div>
            <Link to="/meals" className="text-pink-600 hover:text-pink-700 text-sm font-medium">
              Open meal log →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {meals.slice(0, 4).map((meal, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">{meal.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>⏱ {meal.timeMinutes} min</span>
                  <span>💰 {meal.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            to="/food-safety"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Shield className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="font-semibold mb-2">Food Safety Guide</h3>
            <p className="text-sm text-gray-600">Check if foods are safe</p>
          </Link>
          <Link
            to="/trimesters"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <BookOpen className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="font-semibold mb-2">Trimester Tips</h3>
            <p className="text-sm text-gray-600">Week-by-week guidance</p>
          </Link>
          <Link
            to="/mood-tracker"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <Heart className="w-8 h-8 text-pink-500 mb-3" />
            <h3 className="font-semibold mb-2">Mood Tracker</h3>
            <p className="text-sm text-gray-600">Track your energy & mood</p>
          </Link>
        </div>

        {/* Additional Quick Links */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Link
            to="/conditions"
            className="inline-flex items-center gap-2 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <Stethoscope className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">Common Pregnancy Conditions & Nutrition Fixes</span>
          </Link>
          <Link
            to="/cultural-foods"
            className="inline-flex items-center gap-2 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <Globe className="w-5 h-5 text-purple-500" />
            <span className="font-semibold">Cultural Nutrition Foods</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

