import { useEffect, useMemo, useState } from 'react';
import type { User } from '../types';

type LogEntry = { id: number; name: string; mealType: string; notes?: string; time: string };

function scoreIntake(entries: LogEntry[]) {
  // simple keyword-based scoring
  const healthy = ['salmon','tofu','lentil','dal','bean','beans','vegetable','vegetables','spinach','kale','oatmeal','avocado','egg','yogurt','chickpea','chana','rice and peas','rice'];
  const unhealthy = ['soda','chips','fried','ice cream','candy','hot cheetos','pizza'];

  let score = 0;
  entries.forEach(e => {
    const text = (e.name + ' ' + (e.notes||'')).toLowerCase();
    if (healthy.some(k => text.includes(k))) score += 1;
    else if (unhealthy.some(k => text.includes(k))) score -= 1;
    else score += 0; // neutral
  });

  if (score >= 2) return { label: 'Good', color: 'green' };
  if (score >= 0) return { label: 'Medium', color: 'yellow' };
  return { label: 'Poor', color: 'red' };
}

export default function Profile() {
  const [user, setUser] = useState<Partial<User>>({});
  const [entries, setEntries] = useState<LogEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) setUser(JSON.parse(saved));
    const log = localStorage.getItem('foodLog');
    if (log) setEntries(JSON.parse(log));
  }, []);

  const bmi = useMemo(() => {
    if (user.weight && user.height) {
      const m = user.height / 100;
      return (user.weight / (m*m)).toFixed(1);
    }
    return undefined;
  }, [user]);

  // compute recent stats (today)
  const today = new Date().toLocaleDateString();
  const todays = entries.filter(e => new Date(e.time).toLocaleDateString() === today);
  const mealsCount = todays.filter(e => e.mealType !== 'Snack').length;
  const snacksCount = todays.filter(e => e.mealType === 'Snack').length;

  const intake = scoreIntake(todays);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-6 rounded shadow mb-6">
          <h1 className="text-2xl font-bold mb-2">Profile</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <div className="font-medium">{user.age ?? '—'}</div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pregnancy Week</p>
              <div className="font-medium">{user.pregnancyWeek ?? '—'}</div>
            </div>
            <div>
              <p className="text-sm text-gray-600">BMI</p>
              <div className="font-medium">{bmi ?? user.bmi ?? '—'}</div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hydration Today</p>
              <div className="font-medium">{user.hydrationCups ?? 0} cups</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Today's Intake Summary</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className={`px-3 py-2 rounded text-white ${intake.color === 'green' ? 'bg-green-600' : intake.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-600'}`}>
              {intake.label}
            </div>
            <div className="text-sm text-gray-600">{mealsCount} meal(s), {snacksCount} snack(s) logged today</div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Logged Items</h3>
            {todays.length === 0 && <div className="text-gray-600">No items logged today.</div>}
            <ul className="space-y-2">
              {todays.map(e => (
                <li key={e.id} className="p-2 border rounded bg-gray-50">
                  <div className="font-medium">{e.name} <span className="text-xs text-gray-500">({e.mealType})</span></div>
                  {e.notes && <div className="text-sm text-gray-600">{e.notes}</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">Tip: Log meals in Meals → Log this meal or use the Meals page form. Use Profile to review your daily intake and BMI.</p>
        </div>
      </div>
    </div>
  );
}
