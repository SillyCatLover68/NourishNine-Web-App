import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Info } from 'lucide-react';
import { nutrients } from '../data/nutrients';
import { getProgress, setProgress } from '../lib/nutrientProgress';

export default function Nutrients() {
  const [selectedNutrient, setSelectedNutrient] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, number>>({});

  const nutrient = nutrients.find(n => n.name === selectedNutrient);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = () => setProgressMap(getProgress());
    load();
    const handler = () => load();
    window.addEventListener('nutrientsUpdated', handler);
    return () => window.removeEventListener('nutrientsUpdated', handler);
  }, []);

  const handleInputChange = (name: string, value: string) => {
    const n = parseFloat(value);
    setEditedValues(prev => ({ ...prev, [name]: isNaN(n) ? 0 : n }));
  };

  const handleSave = () => {
    const current = getProgress();
    const merged = { ...current };
    Object.keys(editedValues).forEach(k => { merged[k] = editedValues[k]; });
    setProgress(merged);
  };

  const handleReset = () => {
    // reset progress for all tracked nutrients
    const empty: Record<string, number> = {};
    setProgress(empty);
    setEditedValues({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Daily Nutrient Tracker</h1>
          <p className="text-gray-600">Track 8 essential nutrients for a healthy pregnancy</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Nutrient List */}
          <div className="lg:col-span-2 space-y-4">
            {nutrients.map((nutrient) => {
              const currentVal = Math.round((progressMap[nutrient.name] || nutrient.current) as number || 0);
              const progress = nutrient.target ? (currentVal / nutrient.target) * 100 : 0;
              const isComplete = progress >= 100;

              return (
                <div
                  key={nutrient.name}
                  className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedNutrient(nutrient.name)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {isComplete ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{nutrient.name}</h3>
                        <p className="text-sm text-gray-600">{nutrient.rda}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {editMode ? (
                        <input type="number" min={0} className="w-24 px-2 py-1 border rounded" defaultValue={currentVal} onChange={(e) => handleInputChange(nutrient.name, e.target.value)} />
                      ) : (
                        `${currentVal} / ${nutrient.target} ${nutrient.unit}`
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isComplete ? 'bg-green-500' : 'bg-pink-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">{nutrient.importance}</p>
                </div>
              );
            })}
          </div>

          {/* Nutrient Details Sidebar */}
          <div className="lg:col-span-1">
            {nutrient ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-4">{nutrient.name}</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Recommended Daily Allowance</p>
                    <p className="text-lg font-bold">{nutrient.rda}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Why It Matters</p>
                    <p className="text-gray-700">{nutrient.importance}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Budget-Friendly Sources</p>
                    <ul className="space-y-1">
                      {nutrient.budgetSources.map((source, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          <span>{source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Signs of Deficiency</p>
                    <ul className="space-y-1">
                      {nutrient.deficiencySigns.map((sign, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNutrient(null)}
                  className="mt-6 w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Info className="w-5 h-5" />
                  <p className="font-semibold">Select a nutrient</p>
                </div>
                <p className="text-sm text-gray-600">
                  Click on any nutrient card to see detailed information, budget-friendly sources, and deficiency signs.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          <button onClick={() => setEditMode(!editMode)} className="px-4 py-2 bg-pink-100 text-pink-700 rounded">{editMode ? 'Exit Edit' : 'Edit Amounts'}</button>
          {editMode && (
            <>
              <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              <button onClick={handleReset} className="px-4 py-2 bg-red-100 text-red-700 rounded">Reset All</button>
            </>
          )}
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

