import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import getCurrentIdToken from '../lib/firebaseAuth';
import { signOut } from 'firebase/auth';
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
  const navigate = useNavigate();
  const [user, setUser] = useState<Partial<User>>({});
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) setUser(JSON.parse(saved));
    const log = localStorage.getItem('foodLog');
    if (log) setEntries(JSON.parse(log));
  }, []);

  useEffect(() => {
    const handler = () => {
      const s = localStorage.getItem('userData');
      if (s) setUser(JSON.parse(s));
      else setUser({});
    };
    window.addEventListener('userUpdated', handler);
    return () => window.removeEventListener('userUpdated', handler);
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-2">Profile</h1>
            <div className="flex gap-2">
              {isFirebaseConfigured && auth && auth.currentUser && (
                <button
                  onClick={async () => {
                    try {
                      if (auth) await signOut(auth);
                    } catch (e) {}
                    localStorage.removeItem('userData');
                    window.dispatchEvent(new Event('userUpdated'));
                    navigate('/');
                  }}
                  className="text-sm px-3 py-1 bg-gray-100 rounded"
                >
                  Log Out
                </button>
              )}
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-sm px-3 py-1 bg-pink-100 text-pink-700 rounded"
              >
                {editMode ? 'Cancel' : 'Edit'}
              </button>
              <button
                onClick={async () => {
                  if (!confirm('Delete your local profile? This will remove stored profile data and (optionally) delete your server profile.')) return;
                  const token = await (isFirebaseConfigured ? getCurrentIdToken() : null);
                  try {
                    if (token) await fetch('/api/profile', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                  } catch (e) {}
                  localStorage.removeItem('userData');
                  window.dispatchEvent(new Event('userUpdated'));
                  try { if (isFirebaseConfigured && auth) await signOut(auth); } catch (e) {}
                  navigate('/');
                }}
                className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded"
              >
                Delete Profile
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Age</p>
              {editMode ? (
                <input type="number" value={user.age ?? ''} onChange={(e) => setUser({ ...user, age: e.target.value ? parseInt(e.target.value) : undefined })} className="w-full px-2 py-1 border rounded" />
              ) : (
                <div className="font-medium">{user.age ?? '—'}</div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Pregnancy Week</p>
              {editMode ? (
                <div className="flex gap-2">
                  <input type="number" min={1} max={42} value={user.pregnancyWeek ?? ''} onChange={(e) => setUser({ ...user, pregnancyWeek: e.target.value ? parseInt(e.target.value) : undefined })} className="w-24 px-2 py-1 border rounded" />
                  <button onClick={() => {
                    const currentWeek = typeof user.pregnancyWeek === 'number' ? user.pregnancyWeek : 1;
                    const nextWeek = Math.min(currentWeek + 1, 42);
                    const updated: Partial<User> = { ...user, pregnancyWeek: nextWeek };
                    const week = nextWeek;
                    const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
                    updated.trimester = trimester;
                    setUser(updated);
                  }} className="px-2 py-1 bg-pink-100 text-pink-700 rounded">Advance</button>
                </div>
              ) : (
                <div className="font-medium">{user.pregnancyWeek ?? '—'}</div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">BMI</p>
              <div className="font-medium">{bmi ?? user.bmi ?? '—'}</div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hydration Today</p>
              {editMode ? (
                <div className="flex gap-2 items-center">
                  <input type="number" min={0} value={user.hydrationCups ?? 0} onChange={(e) => setUser({ ...user, hydrationCups: e.target.value ? parseInt(e.target.value) : 0 })} className="w-24 px-2 py-1 border rounded" />
                  <button onClick={() => setUser({ ...user, hydrationCups: 0 })} className="px-2 py-1 bg-gray-100 rounded">Reset</button>
                </div>
              ) : (
                <div className="font-medium">{user.hydrationCups ?? 0} cups</div>
              )}
            </div>
          </div>
          {editMode && (
            <div className="mt-4 flex gap-2">
              <button onClick={async () => {
                // Save locally and attempt server-side save
                const updated = { ...user };
                // ensure trimester based on week if present
                if (updated.pregnancyWeek) updated.trimester = updated.pregnancyWeek <= 13 ? 1 : updated.pregnancyWeek <= 27 ? 2 : 3;
                setUser(updated);
                localStorage.setItem('userData', JSON.stringify(updated));
                window.dispatchEvent(new Event('userUpdated'));
                // try to persist to server if logged in
                if (isFirebaseConfigured) {
                  try {
                    const token = await getCurrentIdToken();
                    if (token) await fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(updated) });
                  } catch (e) {
                    // ignore server errors
                  }
                }
                setEditMode(false);
              }} className="px-3 py-1 bg-pink-600 text-white rounded">Save</button>
              <button onClick={() => { const s = localStorage.getItem('userData'); setUser(s ? JSON.parse(s) : {}); setEditMode(false); }} className="px-3 py-1 bg-gray-100 rounded">Cancel</button>
            </div>
          )}
          <div className="mt-4">
            <p className="text-sm text-gray-600">Day of Week</p>
            <div className="flex items-center gap-3">
              <div className="font-medium">{(user as any).weekDay ?? 1}</div>
              <button onClick={() => {
                // Advance day, wrap at 7 and advance week
                const current = typeof (user as any).weekDay === 'number' ? (user as any).weekDay : 1;
                let next = current + 1;
                let updated: Partial<User> = { ...user };
                if (next > 7) {
                  next = 1;
                  const currentWeek = typeof user.pregnancyWeek === 'number' ? user.pregnancyWeek : 1;
                  const nextWeek = Math.min(currentWeek + 1, 42);
                  updated.pregnancyWeek = nextWeek;
                  updated.trimester = nextWeek <= 13 ? 1 : nextWeek <= 27 ? 2 : 3;
                }
                (updated as any).weekDay = next;
                setUser(updated);
                localStorage.setItem('userData', JSON.stringify(updated));
                window.dispatchEvent(new Event('userUpdated'));
              }} className="px-3 py-1 bg-pink-100 text-pink-700 rounded">Advance Day</button>
              {editMode && (
                <input type="number" min={1} max={7} value={(user as any).weekDay ?? 1} onChange={(e) => setUser({ ...user, ...( { weekDay: e.target.value ? parseInt(e.target.value) : 1 } as any) })} className="w-20 px-2 py-1 border rounded" />
              )}
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
