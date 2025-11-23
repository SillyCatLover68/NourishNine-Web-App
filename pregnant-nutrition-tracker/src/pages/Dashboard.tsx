import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, CheckCircle, Circle, Search, Utensils, BookOpen, Heart, Stethoscope, Shield, Globe } from 'lucide-react';
import type { User } from '../types';
import { nutrients } from '../data/nutrients';
import { trimesterTips } from '../data/trimesterTips';
import { getProgress } from '../lib/nutrientProgress';
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
    const handler = () => {
      const s = localStorage.getItem('userData');
      if (s) setUser(JSON.parse(s));
    };
    window.addEventListener('userUpdated', handler);
    return () => window.removeEventListener('userUpdated', handler);
  }, []);

  const handleCravingSearch = () => {
    if (craving.trim()) {
      window.location.href = `/craving-result?q=${encodeURIComponent(craving)}`;
    }
  };

  // Determine trimester-aware top nutrients
  const determineTrimester = (u: Partial<any>) => {
    if (u.trimester) return u.trimester;
    if (typeof u.pregnancyWeek === 'number') {
      const w = u.pregnancyWeek;
      return w <= 13 ? 1 : w <= 27 ? 2 : 3;
    }
    return null;
  };

  const userTrim = determineTrimester(user);
  let topNutrients = nutrients.slice(0, 5);
  if (userTrim) {
    const tip = trimesterTips.find(t => t.trimester === userTrim);
    if (tip && tip.keyNutrients && tip.keyNutrients.length > 0) {
      // Map key nutrient names to nutrient objects when possible
      const mapped = tip.keyNutrients.map(kn => nutrients.find(n => n.name === kn || n.name.includes(kn) || kn.includes(n.name))).filter(Boolean) as typeof nutrients;
      if (mapped.length > 0) topNutrients = mapped.slice(0, 5);
    }
  }

  const progressMap = getProgress();
  const hydrationCups = user.hydrationCups || 0;
  const recommendedHydration = 8;
  const goodHydration = 12;

  // Calories tracker (sum of today's logged calories)
  const rawLog = typeof window !== 'undefined' ? localStorage.getItem('foodLog') : null;
  const parsedLog = rawLog ? JSON.parse(rawLog) : [];
  const todayStr = new Date().toLocaleDateString();
  const todaysCalories = parsedLog.filter((e: any) => new Date(e.time).toLocaleDateString() === todayStr).reduce((sum: number, e: any) => sum + (Number(e.calories) || 0), 0);
  // Recommended calories heuristic (matches Profile page): base 2000, adjust by trimester
  let recommendedCalories = 2000;
  if (user.trimester === 2) recommendedCalories += 340;
  if (user.trimester === 3) recommendedCalories += 450;
  const caloriesPercent = Math.min((todaysCalories / Math.max(1, recommendedCalories)) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {user.trimester ? `Week ${user.pregnancyWeek}${(user as any).weekDay ? ` · Day ${(user as any).weekDay}` : ''} — You're doing great! 👶` : 'Welcome!'}
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
              <span className="text-sm font-medium">Today: {hydrationCups} cups</span>
              <span className="text-sm text-gray-500">
                {hydrationCups < recommendedHydration
                  ? `Aim for ${recommendedHydration - hydrationCups} more cups to reach recommended (${recommendedHydration})` 
                  : hydrationCups < goodHydration
                    ? `Good — ${goodHydration - hydrationCups} more cups to reach ${goodHydration}`
                    : 'Excellent — you reached the good target! 🎉'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${hydrationCups >= goodHydration ? 'bg-green-500' : hydrationCups >= recommendedHydration ? 'bg-yellow-500' : 'bg-blue-500'}`}
                style={{ width: `${Math.min((hydrationCups / goodHydration) * 100, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>Recommended: {recommendedHydration} cups</span>
              <span>Good: {goodHydration} cups</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const current = user.hydrationCups || 0;
                const newCups = Math.min(current + 1, goodHydration);
                const updated = { ...user, hydrationCups: newCups };
                setUser(updated);
                localStorage.setItem('userData', JSON.stringify(updated));
                window.dispatchEvent(new Event('userUpdated'));
              }}
              disabled={(user.hydrationCups || 0) >= goodHydration}
              className={`text-sm font-medium ${((user.hydrationCups || 0) >= goodHydration) ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700'}`}
            >
              + Add 1 cup
            </button>
            <button
              onClick={() => {
                const updated = { ...user, hydrationCups: 0 };
                setUser(updated);
                localStorage.setItem('userData', JSON.stringify(updated));
                window.dispatchEvent(new Event('userUpdated'));
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Calories Tracker */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Utensils className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-semibold">Calories Tracker</h2>
          </div>
          <div className="mb-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Today: {todaysCalories} kcal</span>
              <span className="text-sm text-gray-500">Recommended: {recommendedCalories} kcal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${todaysCalories >= recommendedCalories ? 'bg-green-500' : todaysCalories >= (recommendedCalories * 0.75) ? 'bg-yellow-500' : 'bg-blue-500'}`}
                style={{ width: `${caloriesPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
              <span>Goal: {recommendedCalories} kcal</span>
              <span>{Math.round(caloriesPercent)}%</span>
            </div>
          </div>
        </div>

        {/* Top 5 Nutrients Checklist */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Top 5 Nutrients for Your Trimester</h2>
          <div className="space-y-3">
            {topNutrients.map((nutrient) => {
              const current = Math.round((progressMap[nutrient.name] || nutrient.current) as number || 0);
              const target = nutrient.target || 0;
              const isComplete = target > 0 ? current >= target : false;
              return (
                <div key={nutrient.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                    <span className="font-medium">{nutrient.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{nutrient.rda}</span>
                </div>
              );
            })}
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

