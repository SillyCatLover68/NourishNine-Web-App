import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, DollarSign, Heart } from 'lucide-react';
import { searchFoodSafety } from '../data/foodSafety';
import { getMealSuggestions } from '../data/meals';
import { addProgress } from '../lib/nutrientProgress';

export default function CravingResult() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [result, setResult] = useState(searchFoodSafety(query));
  const [alternatives] = useState(getMealSuggestions({}));

  useEffect(() => {
    if (query) {
      setResult(searchFoodSafety(query));
    }
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <p className="text-xl mb-4">No craving searched</p>
          <Link to="/dashboard" className="text-pink-600 hover:text-pink-700">
            Go to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold mb-4">You searched: "{query}"</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700">
                We don't have specific information about this food in our database yet. 
                For safety, please consult with your healthcare provider or check our 
                <Link to="/food-safety" className="text-pink-600 hover:underline"> Food Safety Guide</Link>.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">You searched: "{result.name}"</h1>
          
          {/* Safety Status */}
          <div className={`rounded-lg p-6 mb-6 ${getRiskColor(result.riskLevel)}`}>
            <div className="flex items-center gap-3 mb-2">
              {result.safe ? (
                <CheckCircle className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
              <div>
                <h2 className="text-2xl font-bold">
                  {result.safe ? 'Safe' : 'Not Safe'} / {result.category === 'avoid' ? 'Avoid' : result.category === 'limit' ? 'Limit' : 'Safe'}
                </h2>
                <p className="text-sm mt-1">Risk Level: {result.riskLevel.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Why */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Why:
            </h3>
            <p className="text-gray-700">{result.why}</p>
          </div>

          {/* Serving Size */}
          {result.servingSize && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold mb-1">Serving Size Limit:</p>
              <p className="text-gray-700">{result.servingSize}</p>
            </div>
          )}

          {/* Safer Swaps */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Safer & More Nutritious Swaps:
            </h3>
            <ul className="space-y-2">
              {result.saferSwaps.map((swap, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{swap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Budget Alternatives */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Budget Alternatives:
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {alternatives.slice(0, 3).map((meal, idx) => (
                <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                  <p className="font-medium">{meal.name}</p>
                  <p className="text-sm text-gray-600">{meal.cost}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="text-sm text-gray-500 border-t pt-4">
            <p className="font-semibold mb-1">Sources:</p>
            <p>{result.sources.join(', ')}</p>
          </div>

          <div className="mt-6 flex gap-4">
            <Link
              to="/dashboard"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/food-safety"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Browse Food Safety Guide
            </Link>
            <button
              onClick={async () => {
                // Try server-side lookup first
                const entry = { id: Date.now(), name: result.name, mealType: 'Craving', notes: result.why, time: new Date().toISOString() } as any;
                try {
                  const resp = await fetch('/api/nutrients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: result.name })
                  });
                  if (resp.ok) {
                    const j = await resp.json();
                    if (j && j.nutrientAmounts) {
                      entry.nutrientAmounts = j.nutrientAmounts;
                      addProgress(j.nutrientAmounts);
                    }
                  }
                } catch (e) {
                  // If server is not running or network fails, fall back to adding entry without nutrientAmounts
                }
                const saved = localStorage.getItem('foodLog');
                const arr = saved ? JSON.parse(saved) : [];
                arr.unshift(entry);
                localStorage.setItem('foodLog', JSON.stringify(arr));
                // navigate to meals so user sees the log
                window.location.href = '/meals';
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Log this food
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

