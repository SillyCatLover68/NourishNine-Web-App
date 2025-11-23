import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Globe, DollarSign } from 'lucide-react';
import { culturalFoods, getAllCultures } from '../data/culturalFoods';

export default function CulturalFoods() {
  const [selectedCulture, setSelectedCulture] = useState<string | null>(null);

  const selectedFoods = selectedCulture 
    ? culturalFoods.find(cf => cf.culture === selectedCulture)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-pink-600" />
            <h1 className="text-3xl font-bold">Cultural Nutrition Foods</h1>
          </div>
          <p className="text-gray-600">
            Traditional foods from different cultures that are safe and nutritious during pregnancy
          </p>
        </div>

        {/* Culture Selector */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select a Culture</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getAllCultures().map((culture) => (
              <button
                key={culture}
                onClick={() => setSelectedCulture(culture)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCulture === culture
                    ? 'border-pink-600 bg-pink-50'
                    : 'border-gray-300 hover:border-pink-300 bg-white'
                }`}
              >
                <h3 className="font-semibold">{culture}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Food List */}
        {selectedFoods && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{selectedFoods.culture} Foods</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {selectedFoods.foods.map((food, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                    food.safeDuringPregnancy
                      ? 'border-green-500'
                      : 'border-red-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{food.name}</h3>
                    {food.safeDuringPregnancy ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4">{food.description}</p>

                  {food.notes && (
                    <div className={`mb-4 p-3 rounded-lg ${
                      food.safeDuringPregnancy
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className={`text-sm ${
                        food.safeDuringPregnancy ? 'text-blue-800' : 'text-red-800'
                      }`}>
                        <strong>Note:</strong> {food.notes}
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Key Nutrients:</p>
                    <div className="flex flex-wrap gap-2">
                      {food.nutrients.map((nutrient, i) => (
                        <span
                          key={i}
                          className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs"
                        >
                          {nutrient}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {food.budgetFriendly && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span>Budget-friendly</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-1">Preparation:</p>
                    <p className="text-sm text-gray-700">{food.preparation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedCulture && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">Select a culture above to see traditional foods</p>
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

