import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type LogEntry = { id: number; name: string; mealType: string; notes?: string; time: string };

function groupByDate(entries: LogEntry[]) {
  const map: Record<string, LogEntry[]> = {};
  entries.forEach(e => {
    const d = new Date(e.time).toLocaleDateString();
    map[d] = map[d] || [];
    map[d].push(e);
  });
  return map;
}

export default function FoodLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('foodLog');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('foodLog', JSON.stringify(entries));
  }, [entries]);

  const grouped = groupByDate(entries);

  const remove = (id: number) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
  };

  const clearAll = () => {
    setEntries([]);
    localStorage.removeItem('foodLog');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Food Log</h1>
          <Link to="/meals" className="text-pink-600 hover:text-pink-700">← Back to Meals</Link>
        </div>

        <div className="mb-4">
          <button onClick={clearAll} className="px-4 py-2 bg-red-100 text-red-700 rounded">Clear Entire Log</button>
        </div>

        {Object.keys(grouped).length === 0 && (
          <div className="bg-white p-6 rounded shadow text-gray-600">No entries yet. Use Meals → Log this meal or the Log form on Meals page.</div>
        )}

        {Object.entries(grouped).map(([date, list]) => (
          <div key={date} className="mb-6">
            <h3 className="font-semibold mb-2">{date} — {list.length} item{list.length>1?'s':''}</h3>
            <ul className="space-y-2">
              {list.map(item => (
                <li key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                  <div>
                    <div className="font-medium">{item.name} <span className="text-xs text-gray-500">({item.mealType})</span></div>
                    {item.notes && <div className="text-sm text-gray-600">{item.notes}</div>}
                    <div className="text-xs text-gray-400 mt-1">{new Date(item.time).toLocaleTimeString()}</div>
                  </div>
                  <div>
                    <button onClick={() => remove(item.id)} className="text-sm text-red-600 hover:text-red-700">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
