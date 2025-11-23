import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function QuickQuiz() {
  const navigate = useNavigate();
  const [craving, setCraving] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (craving.trim()) {
      navigate(`/craving-result?q=${encodeURIComponent(craving)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-4">
          What are you craving? 🍕
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Type anything - we'll tell you if it's safe and suggest healthier alternatives!
        </p>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3">
              Your Craving:
            </label>
            <input
              type="text"
              value={craving}
              onChange={(e) => setCraving(e.target.value)}
              placeholder="e.g., hot Cheetos, ice cream, sushi, tacos..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg focus:border-pink-600 focus:outline-none"
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
          >
            Check if it's safe
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-pink-600 hover:text-pink-700"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}

