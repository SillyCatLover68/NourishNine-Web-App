import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { foodSafetyDatabase, searchFoodSafety } from '../data/foodSafety';

export default function FoodSafety() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(searchFoodSafety(''));

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const result = searchFoodSafety(searchQuery);
      setSearchResult(result);
    }
  };

  const avoidFoods = foodSafetyDatabase.filter(f => f.category === 'avoid');
  const limitFoods = foodSafetyDatabase.filter(f => f.category === 'limit');
  const safeFoods = foodSafetyDatabase.filter(f => f.category === 'safe');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Food Safety Guide</h1>
          <p className="text-gray-600">Search any food to know if it's safe during pregnancy</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Can I eat...? (e.g., sushi, kombucha, deli meat)"
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-pink-600 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Result */}
        {searchResult && searchQuery && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">"{searchResult.name}"</h2>
            <div className={`rounded-lg p-4 mb-4 ${
              searchResult.safe ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {searchResult.safe ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className="font-semibold">
                    {searchResult.safe ? 'Safe' : 'Not Safe'} / {searchResult.category.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600">Risk: {searchResult.riskLevel}</p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{searchResult.why}</p>
            {searchResult.servingSize && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Serving Size:</strong> {searchResult.servingSize}
              </p>
            )}
            <div>
              <p className="font-semibold mb-2">Safer Swaps:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {searchResult.saferSwaps.map((swap, idx) => (
                  <li key={idx}>{swap}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Categorized Lists */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Avoid Completely */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-600" />
              Avoid Completely
            </h2>
            <div className="space-y-3">
              {avoidFoods.map((food, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
                  <h3 className="font-semibold mb-1">{food.name}</h3>
                  <p className="text-sm text-gray-600">{food.why}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Limit */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              Limit
            </h2>
            <div className="space-y-3">
              {limitFoods.map((food, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                  <h3 className="font-semibold mb-1">{food.name}</h3>
                  <p className="text-sm text-gray-600">{food.why}</p>
                  {food.servingSize && (
                    <p className="text-xs text-orange-600 mt-1 font-medium">{food.servingSize}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safe Alternatives */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Safe Alternatives
            </h2>
            <div className="space-y-3">
              {safeFoods.map((food, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                  <h3 className="font-semibold mb-1">{food.name}</h3>
                  <p className="text-sm text-gray-600">{food.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sources */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="font-semibold mb-2">Sources:</p>
          <p className="text-sm text-gray-700">
            Information reviewed by registered dietitians and based on guidelines from ACOG, CDC, WHO, 
            NIH Office of Dietary Supplements, and March of Dimes.
          </p>
          <p className="text-xs text-gray-600 mt-4">
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and 
            is not a substitute for professional medical advice. Always consult with your healthcare provider.
          </p>
        </div>

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

