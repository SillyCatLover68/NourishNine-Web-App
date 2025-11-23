import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Lightbulb, AlertCircle } from 'lucide-react';
import { trimesterTips } from '../data/trimesterTips';

export default function Trimesters() {
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3 | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      const userData = JSON.parse(saved);
      if (userData.trimester) {
        setSelectedTrimester(userData.trimester);
      }
    }
  }, []);

  const currentTip = selectedTrimester ? trimesterTips.find(t => t.trimester === selectedTrimester) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trimester Tips</h1>
          <p className="text-gray-600">Week-by-week nutrition guidance for each stage of pregnancy</p>
        </div>

        {/* Trimester Selector */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {trimesterTips.map((tip) => (
            <button
              key={tip.trimester}
              onClick={() => setSelectedTrimester(tip.trimester)}
              className={`bg-white rounded-lg shadow-md p-6 text-left hover:shadow-lg transition-shadow border-2 ${
                selectedTrimester === tip.trimester
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-8 h-8 text-pink-600" />
                <h2 className="text-xl font-bold">
                  {tip.trimester === 1 ? '1st' : tip.trimester === 2 ? '2nd' : '3rd'} Trimester
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Focus:</strong> {tip.focus}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Calories:</strong> {tip.calories}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Trimester Details */}
        {currentTip && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">
                {currentTip.trimester === 1 ? '1st' : currentTip.trimester === 2 ? '2nd' : '3rd'} Trimester Guide
              </h2>
              <p className="text-gray-600">
                <strong>Focus:</strong> {currentTip.focus} | <strong>Calories:</strong> {currentTip.calories}
              </p>
            </div>

            {/* Key Nutrients */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Key Nutrients
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentTip.keyNutrients.map((nutrient, idx) => (
                  <span
                    key={idx}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {nutrient}
                  </span>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Tips & Recommendations</h3>
              <ul className="space-y-2">
                {currentTip.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid */}
            <div>
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Foods to Avoid
              </h3>
              <ul className="space-y-2">
                {currentTip.avoid.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!selectedTrimester && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Select a trimester above to see detailed guidance</p>
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

