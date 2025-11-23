import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Droplet, Activity, Sun } from 'lucide-react';
import type { User } from '../types';

export default function MoodTracker() {
  const [user, setUser] = useState<Partial<User>>({});
  const [selectedMood, setSelectedMood] = useState<'😄' | '😐' | '😣' | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      const userData = JSON.parse(saved);
      setUser(userData);
      if (userData.mood) {
        setSelectedMood(userData.mood);
      }
    }
  }, []);

  const handleMoodSelect = (mood: '😄' | '😐' | '😣') => {
    setSelectedMood(mood);
    const updated = { ...user, mood };
    setUser(updated);
    localStorage.setItem('userData', JSON.stringify(updated));
  };

  const getRecommendations = () => {
    if (selectedMood === '😣') {
      return {
        nutrients: ['Vitamin D foods (eggs, fortified milk)', 'Omega-3 (salmon, walnuts)', 'Complex carbs (oatmeal, whole grains)'],
        hydration: 'Aim for 8-10 cups of water today',
        exercise: 'Light 5-10 minute walk can boost mood',
        tips: ['Low mood can be linked to nutrient deficiencies', 'Try getting some sunlight', 'Small, frequent meals help stabilize energy']
      };
    } else if (selectedMood === '😐') {
      return {
        nutrients: ['Balanced meals with protein and carbs', 'Stay hydrated'],
        hydration: 'Continue with 8-10 cups daily',
        exercise: 'Light stretching or 10-minute walk',
        tips: ['Maintain regular meal schedule', 'Get adequate sleep']
      };
    } else {
      return {
        nutrients: ['Keep up the great nutrition!', 'Continue balanced meals'],
        hydration: 'Maintain 8-10 cups daily',
        exercise: 'Great time for light exercise!',
        tips: ['You\'re doing great!', 'Keep up the healthy habits']
      };
    }
  };

  const recommendations = getRecommendations();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mood & Energy Tracker</h1>
          <p className="text-gray-600">Track how you're feeling and get personalized recommendations</p>
        </div>

        {/* Mood Selector */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6 text-center">How are you feeling today?</h2>
          <div className="flex justify-center gap-6">
            {(['😄', '😐', '😣'] as const).map((mood) => (
              <button
                key={mood}
                onClick={() => handleMoodSelect(mood)}
                className={`text-6xl p-6 rounded-lg border-4 transition-all hover:scale-110 ${
                  selectedMood === mood
                    ? 'border-pink-600 bg-pink-50 scale-110'
                    : 'border-gray-300 hover:border-pink-300'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {selectedMood && (
          <div className="space-y-4">
            {/* Nutrient Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
                <h3 className="text-xl font-semibold">Nutrient Recommendations</h3>
              </div>
              <ul className="space-y-2">
                {recommendations.nutrients.map((nutrient, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700">{nutrient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hydration */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Droplet className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold">Hydration</h3>
              </div>
              <p className="text-gray-700">{recommendations.hydration}</p>
            </div>

            {/* Exercise */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-green-500" />
                <h3 className="text-xl font-semibold">Exercise Suggestion</h3>
              </div>
              <p className="text-gray-700">{recommendations.exercise}</p>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sun className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-semibold">Tips</h3>
              </div>
              <ul className="space-y-2">
                {recommendations.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">💡</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!selectedMood && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Select your mood above to get personalized recommendations</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/dashboard"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

