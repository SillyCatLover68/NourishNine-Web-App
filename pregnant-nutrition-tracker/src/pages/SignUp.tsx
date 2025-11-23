import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ArrowRight } from 'lucide-react';
import type { User } from '../types';

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialMode = params.get('action') === 'login' ? 'login' : 'signup';
  const [mode, setMode] = useState<'signup' | 'login'>(initialMode);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<User>>({});
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [weightError, setWeightError] = useState('');
  const [heightError, setHeightError] = useState('');

  const handleInputChange = (field: keyof User, value: any) => {
    setUserData({ ...userData, [field]: value });
  };

  const calculateTrimester = (week: number): 1 | 2 | 3 => {
    if (week <= 13) return 1;
    if (week <= 27) return 2;
    return 3;
  };

  const calculateBMI = (weight?: number, height?: number) => {
    if (typeof weight === 'number' && typeof height === 'number' && weight > 0 && height > 0) {
      const heightMeters = height / 100;
      return (weight / (heightMeters * heightMeters)).toFixed(1);
    }
    return undefined;
  };

  const handleNext = () => {
    if (step === 1 && userData.pregnancyWeek) {
      handleInputChange('trimester', calculateTrimester(userData.pregnancyWeek));
    }
    if (step === 2 && userData.weight && userData.height) {
      handleInputChange('bmi', parseFloat(calculateBMI(userData.weight, userData.height) || '0'));
    }
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Finalize signup: ensure numeric fields are positive, create Firebase user if configured,
      // otherwise fallback to localStorage. Sanitize weight/height to avoid zero/negative values.
      const sanitizeNumeric = (n: any) => (typeof n === 'number' && n > 0 ? n : undefined);
      const sanitizedUser = { ...userData, weight: sanitizeNumeric(userData.weight), height: sanitizeNumeric(userData.height) };

      (async () => {
        setAuthError('');
        if (isFirebaseConfigured && auth) {
          try {
            setLoading(true);
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            // Set a sensible displayName: use the email local part if available
            if (email) {
              const displayName = String(email).split('@')[0];
              try { await updateProfile(cred.user, { displayName }); } catch (e) { /* ignore */ }
            }
            localStorage.setItem('userData', JSON.stringify(sanitizedUser));
            navigate('/dashboard');
          } catch (e: any) {
            setAuthError(e?.message || 'Failed to create account');
          } finally { setLoading(false); }
        } else {
          localStorage.setItem('userData', JSON.stringify(sanitizedUser));
          navigate('/dashboard');
        }
      })();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Step {step} of 4</span>
              <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full transition-all"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{mode === 'signup' ? 'Create Your Account' : 'Log In'}</h1>
            <div className="flex rounded-lg overflow-hidden border">
              <button
                onClick={() => setMode('signup')}
                className={`px-4 py-2 ${mode === 'signup' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'}`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setMode('login')}
                className={`px-4 py-2 ${mode === 'login' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'}`}
              >
                Log In
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              {authError && <p className="text-sm text-red-600 mt-2">{authError}</p>}
            </div>
          )}

          {mode === 'login' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Sign in with your email and password. If you don't have an account yet, switch to Sign Up.</p>
              {!isFirebaseConfigured && (
                <p className="text-sm text-yellow-700">Firebase is not configured. The app will use a local fallback. To enable real auth, set the Vite `VITE_FIREBASE_*` env vars.</p>
              )}
              <div>
                <label className="block font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              {authError && <p className="text-sm text-red-600">{authError}</p>}
              <div className="flex justify-end">
                <button
                  onClick={async () => {
                    setAuthError('');
                    if (isFirebaseConfigured && auth) {
                      try {
                        setLoading(true);
                        await signInWithEmailAndPassword(auth, email, password);
                        navigate('/dashboard');
                      } catch (e: any) {
                        setAuthError(e?.message || 'Sign in failed');
                      } finally { setLoading(false); }
                    } else {
                      // local fallback: check localStorage existence and sanitize numeric fields
                      const saved = localStorage.getItem('userData');
                      if (saved) {
                        try {
                          const parsed = JSON.parse(saved);
                          const sanitizeNumeric = (n: any) => (typeof n === 'number' && n > 0 ? n : undefined);
                          parsed.weight = sanitizeNumeric(parsed.weight);
                          parsed.height = sanitizeNumeric(parsed.height);
                          localStorage.setItem('userData', JSON.stringify(parsed));
                        } catch (e) {
                          // if parse fails, just proceed to dashboard
                        }
                        navigate('/dashboard');
                      } else {
                        setAuthError('No local account found. Please sign up.');
                        setMode('signup');
                      }
                    }
                  }}
                  disabled={loading}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2"
                >
                  {loading ? 'Signing in...' : 'Log In'}
                  <span className="sr-only">Log in and go to dashboard</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div>
                <label className="block font-semibold mb-2">Age *</label>
                <input
                  type="number"
                  min={1}
                  value={userData.age || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val)) {
                      handleInputChange('age', undefined);
                    } else {
                      // Prevent 0 or negative ages
                      handleInputChange('age', Math.max(1, val));
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Pregnancy Week *</label>
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={userData.pregnancyWeek || ''}
                  onChange={(e) => handleInputChange('pregnancyWeek', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'signup' && step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Health Information (Optional)</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2">Weight (lbs)</label>
                  <input
                    type="number"
                    value={userData.weight ?? ''}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (isNaN(v) || v <= 0) {
                        setWeightError('Please enter a positive weight');
                        handleInputChange('weight', undefined);
                      } else {
                        setWeightError('');
                        handleInputChange('weight', v);
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {weightError && <p className="text-sm text-red-600 mt-1">{weightError}</p>}
                </div>
                <div>
                  <label className="block font-semibold mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={userData.height ?? ''}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (isNaN(v) || v <= 0) {
                        setHeightError('Please enter a positive height');
                        handleInputChange('height', undefined);
                      } else {
                        setHeightError('');
                        handleInputChange('height', v);
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  {heightError && <p className="text-sm text-red-600 mt-1">{heightError}</p>}
                </div>
              </div>
              {typeof userData.bmi === 'number' && (
                <p className="text-sm text-gray-600">BMI: {userData.bmi}</p>
              )}
            </div>
          )}

          {mode === 'signup' && step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Dietary Preferences</h2>
              <div>
                <label className="block font-semibold mb-2">Dietary Restrictions</label>
                <div className="space-y-2">
                  {['Halal', 'Kosher', 'Vegetarian', 'Vegan', 'Lactose Intolerant', 'Gluten Free'].map((restriction) => (
                    <label key={restriction} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={userData.dietaryRestrictions?.includes(restriction)}
                        onChange={(e) => {
                          const current = userData.dietaryRestrictions || [];
                          if (e.target.checked) {
                            handleInputChange('dietaryRestrictions', [...current, restriction]);
                          } else {
                            handleInputChange('dietaryRestrictions', current.filter(r => r !== restriction));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span>{restriction}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2">Access to Cooking</label>
                <select
                  value={userData.cookingAccess || ''}
                  onChange={(e) => handleInputChange('cookingAccess', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select...</option>
                  <option value="full-kitchen">Full Kitchen</option>
                  <option value="microwave">Microwave Only</option>
                  <option value="no-kitchen">No Kitchen</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Budget Per Week</label>
                <select
                  value={userData.budgetPerWeek || ''}
                  onChange={(e) => handleInputChange('budgetPerWeek', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select...</option>
                  <option value="$20-40">$20-40</option>
                  <option value="$40-80">$40-80</option>
                  <option value=">$80">$80+</option>
                </select>
              </div>
            </div>
          )}

          {mode === 'signup' && step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Daily Habits</h2>
              <div>
                <label className="block font-semibold mb-2">Current Cravings (type anything)</label>
                <input
                  type="text"
                  value={userData.cravings?.join(', ') || ''}
                  onChange={(e) => handleInputChange('cravings', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="e.g., ice cream, hot Cheetos, tacos"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Hydration (cups per day)</label>
                <input
                  type="number"
                  min={0}
                  max={8}
                  value={userData.hydrationCups || ''}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    if (isNaN(v)) {
                      handleInputChange('hydrationCups', undefined);
                    } else {
                      // cap hydration cups to reasonable daily goal (8)
                      handleInputChange('hydrationCups', Math.max(0, Math.min(8, v)));
                    }
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">How are you feeling today?</label>
                <div className="flex gap-4">
                  {(['😄', '😐', '😣'] as const).map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => handleInputChange('mood', mood)}
                      className={`text-4xl p-4 rounded-lg border-2 ${
                        userData.mood === mood ? 'border-pink-600 bg-pink-50' : 'border-gray-300'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center gap-2"
              >
                {step === 4 ? 'Complete' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

