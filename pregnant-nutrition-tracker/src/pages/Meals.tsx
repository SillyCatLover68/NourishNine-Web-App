import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Utensils } from 'lucide-react';
import { getMealSuggestions, mealSuggestions } from '../data/meals';
import { addProgress, subtractProgress } from '../lib/nutrientProgress';
import getCurrentIdToken from '../lib/firebaseAuth';
import { nutrients as nutrientDefs } from '../data/nutrients';

export default function Meals() {
  const [meals, setMeals] = useState(mealSuggestions);
  const [filters, setFilters] = useState({
    cookingMethod: '',
    maxCost: '',
    nutrients: [] as string[]
  });
  const [foodLog, setFoodLog] = useState<{ id: number; name: string; mealType: string; notes?: string; time: string; calories?: number; nutrientAmounts?: Record<string, number> }[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCalories, setEditCalories] = useState<string>('');
  const [editNutrientsRaw, setEditNutrientsRaw] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [newFoodName, setNewFoodName] = useState('');
  const [newMealType, setNewMealType] = useState('Breakfast');
    // const [newNotes, setNewNotes] = useState('');

  const handleLogFood = async () => {
    const name = newFoodName.trim();
    if (!name) return;

      const entry: any = { id: Date.now(), name, mealType: newMealType, time: new Date().toISOString() };

    const updated = [entry, ...foodLog];
    setFoodLog(updated);
    localStorage.setItem('foodLog', JSON.stringify(updated));

    if (entry.nutrientAmounts) addProgress(entry.nutrientAmounts as Record<string, number>);

      setNewFoodName('');
    // Try to persist the food log to server (will write to Firestore if server has Admin SDK and token is valid)
    try {
      const token = await getCurrentIdToken();
      await fetch('/api/foodlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(entry)
      });
    } catch (e) {
      // ignore - best-effort persistence
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      const userData = JSON.parse(saved);
      if (userData.cookingAccess) {
        setFilters(prev => ({ ...prev, cookingMethod: userData.cookingAccess }));
      }
    }
  }, []);

  useEffect(() => {
    const savedLog = localStorage.getItem('foodLog');
    if (savedLog) setFoodLog(JSON.parse(savedLog));
  }, []);

  useEffect(() => {
    const filtered = getMealSuggestions({
      cookingMethod: filters.cookingMethod || undefined,
      nutrients: filters.nutrients.length > 0 ? filters.nutrients : undefined
    });
    setMeals(filtered);
  }, [filters]);

  

  // intake summary for today (aggregate nutrient-based)
  const todays = foodLog.filter(e => new Date(e.time).toLocaleDateString() === new Date().toLocaleDateString());
  const mealsCount = todays.filter(e => e.mealType !== 'Snack').length;
  const snacksCount = todays.filter(e => e.mealType === 'Snack').length;

  // compute today's nutrient totals from logged entries (only entries with nutrientAmounts)
  const todaysNutrientTotals: Record<string, number> = {};
  todays.forEach(e => {
    const na = (e as any).nutrientAmounts as Record<string, number> | undefined;
    if (na) {
      Object.keys(na).forEach(k => {
        todaysNutrientTotals[k] = (todaysNutrientTotals[k] || 0) + (na[k] || 0);
      });
    }
  });

  // compute today's total calories as fallback for intake assessment
  // compute today's total calories is computed later as todaysCaloriesVal

  // compute an average percent across tracked nutrients (clamped)
  let avgPercent = 0;
  let nutrientCount = 0;
  if (nutrientDefs && nutrientDefs.length > 0) {
    let sum = 0;
    let count = 0;
    nutrientDefs.forEach(n => {
      if (n.target && n.target > 0) {
        const cur = todaysNutrientTotals[n.name] || 0;
        sum += Math.min(1, cur / n.target);
        count += 1;
      }
    });
    avgPercent = count > 0 ? sum / count : 0;
    nutrientCount = count;
  }
  // If there are no nutrient targets tracked today, fall back to calories-based assessment
  const todaysCaloriesVal = todays.reduce((s, e) => s + (Number((e as any).calories) || 0), 0);
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
  const parsedUser = savedUser ? JSON.parse(savedUser) : ({} as any);
  let recommendedCalories = 2000;
  if (parsedUser.trimester === 2) recommendedCalories += 340;
  if (parsedUser.trimester === 3) recommendedCalories += 450;

  let effectivePercent = avgPercent;
  if (nutrientCount === 0 && todaysCaloriesVal > 0) {
    effectivePercent = Math.min(1, todaysCaloriesVal / Math.max(1, recommendedCalories));
  }

  const intakeLabel = effectivePercent >= 0.75 ? 'Good' : effectivePercent >= 0.4 ? 'Medium' : 'Poor';
  const intakeColor = effectivePercent >= 0.75 ? 'bg-green-600' : effectivePercent >= 0.4 ? 'bg-yellow-500' : 'bg-red-600';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meal Log</h1>
          <p className="text-gray-600">Log meals and view suggestions based on your budget and cooking access</p>
        </div>

        {/* Filters */}
        {/* Quick Food Log */}
        {/* Intake summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Search or Log a Food</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search for a food (e.g. kiwi, canned salmon)"
              value={newFoodName}
              onChange={(e) => setNewFoodName(e.target.value)}
              className="px-4 py-2 border rounded-lg md:col-span-2"
            />
            <select
              value={newMealType}
              onChange={(e) => setNewMealType(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { (document.activeElement as HTMLElement)?.blur(); handleLogFood(); }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Log Food
              </button>
            </div>
          </div>
          {/* Manual nutrient & calorie entry is used when logging foods now */}
        </div>

        {/* Today's Intake */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Today's Intake</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">{mealsCount} meal(s), {snacksCount} snack(s) logged today</div>
            </div>
            <div>
              <Link to="/profile" className="text-pink-600 hover:text-pink-700">View Profile →</Link>
            </div>
          </div>
        </div>

        {/* Today's Log */}
        {todays.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="font-semibold mb-2">Today's Log</h3>
            <ul className="space-y-2">
              {todays.map(entry => (
                <li key={entry.id} className="p-2 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{entry.name} <span className="text-xs text-gray-500">({entry.mealType})</span></div>
                      {entry.notes && <div className="text-sm text-gray-600">{entry.notes}</div>}
                      {entry.calories !== undefined && <div className="text-sm text-gray-700">Calories: {entry.calories}</div>}
                      {entry.nutrientAmounts && <div className="text-sm text-gray-700">Nutrients: {Object.entries(entry.nutrientAmounts).map(([k,v]) => `${k}:${v}`).join(', ')}</div>}
                      <div className="text-xs text-gray-400">{new Date(entry.time).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {editingId === entry.id ? (
                        <div className="flex flex-col items-end gap-2">
                          <input className="w-40 px-2 py-1 border rounded" type="number" placeholder="Calories" value={editCalories} onChange={e => setEditCalories(e.target.value)} />
                          <input className="w-40 px-2 py-1 border rounded" type="text" placeholder="Notes (optional)" value={editNotes} onChange={e => setEditNotes(e.target.value)} />
                          <input className="w-40 px-2 py-1 border rounded" type="text" placeholder="Nutrients (Protein:10, Iron:2)" value={editNutrientsRaw} onChange={e => setEditNutrientsRaw(e.target.value)} />
                          <div className="flex gap-2">
                            <button onClick={() => {
                              // Save edits
                              const updatedLog = foodLog.map(f => {
                                if (f.id !== entry.id) return f;
                                const origNutrients = (f as any).nutrientAmounts as Record<string, number> | undefined;
                                // subtract original progress
                                if (origNutrients) {
                                  try { subtractProgress(origNutrients); } catch (e) {}
                                }
                                // parse new nutrients
                                let newNutrients: Record<string, number> | undefined = undefined;
                                if (editNutrientsRaw.trim()) {
                                  newNutrients = {};
                                  editNutrientsRaw.split(',').forEach(part => {
                                    const [k, v] = part.split(':').map(s => s.trim());
                                    const num = Number(v);
                                    if (k && !isNaN(num)) newNutrients![k] = num;
                                  });
                                }
                                const newEntry: any = { ...f };
                                if (editNotes && editNotes.trim()) newEntry.notes = editNotes.trim(); else delete newEntry.notes;
                                if (newNutrients) newEntry.nutrientAmounts = newNutrients; else delete newEntry.nutrientAmounts;
                                if (editCalories && !isNaN(Number(editCalories))) newEntry.calories = Number(editCalories); else delete newEntry.calories;
                                // add new progress
                                if (newEntry.nutrientAmounts) {
                                  try { addProgress(newEntry.nutrientAmounts as Record<string, number>); } catch (e) {}
                                }
                                return newEntry;
                              });
                              setFoodLog(updatedLog);
                              localStorage.setItem('foodLog', JSON.stringify(updatedLog));
                              setEditNotes('');
                              setEditingId(null);
                            }} className="px-3 py-1 bg-pink-600 text-white rounded text-sm">Save</button>
                            <button onClick={() => { setEditingId(null); }} className="px-3 py-1 bg-gray-100 rounded text-sm">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          <button onClick={() => {
                            setEditingId(entry.id);
                            setEditCalories(((entry as any).calories || '').toString());
                            setEditNutrientsRaw(((entry as any).nutrientAmounts) ? Object.entries((entry as any).nutrientAmounts).map(([k,v]) => `${k}:${v}`).join(', ') : '');
                            setEditNotes(((entry as any).notes) || '');
                          }} className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded">Edit</button>
                          <button
                            onClick={() => {
                              if ((entry as any).nutrientAmounts) {
                                try { subtractProgress((entry as any).nutrientAmounts as Record<string, number>); } catch (e) {}
                              }
                              const updated = foodLog.filter(f => f.id !== entry.id);
                              setFoodLog(updated);
                              localStorage.setItem('foodLog', JSON.stringify(updated));
                            }}
                            className="text-sm text-red-600 hover:text-red-700"
                          >Remove</button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Meal Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
              <p className="text-gray-600 mb-4">{meal.description}</p>
              
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Ingredients:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {meal.ingredients.map((ingredient, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{meal.timeMinutes} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{meal.cost}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Utensils className="w-4 h-4" />
                  <span className="capitalize">{meal.cookingMethod}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold mb-1">Why it's good:</p>
                <p className="text-sm text-gray-700">{meal.whyGood}</p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1">Nutrients:</p>
                <div className="flex flex-wrap gap-1">
                  {meal.nutrients.map((nutrient, i) => (
                    <span
                      key={i}
                      className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs"
                    >
                      {nutrient}
                    </span>
                  ))}
                </div>
              </div>

              {meal.calories !== undefined && (
                <div className="text-sm text-gray-700 mt-2">Calories: {meal.calories}</div>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={async () => {
                    const entry: any = { id: Date.now(), name: meal.name, mealType: newMealType || 'Meal', notes: meal.ingredients.join(', '), time: new Date().toISOString() };
                    if ((meal as any).nutrientAmounts) entry.nutrientAmounts = (meal as any).nutrientAmounts;
                    if ((meal as any).calories !== undefined) entry.calories = (meal as any).calories;
                    const updated = [entry, ...foodLog];
                    setFoodLog(updated);
                    localStorage.setItem('foodLog', JSON.stringify(updated));
                    if (entry.nutrientAmounts) addProgress(entry.nutrientAmounts as Record<string, number>);
                    // best-effort server persist
                    try {
                      const token = await getCurrentIdToken();
                      await fetch('/api/foodlog', { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(entry) });
                    } catch (e) {}
                  }}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Add to Log
                </button>
              </div>
            </div>
          ))}
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
