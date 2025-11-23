import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield, Utensils } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    const userData = localStorage.getItem('userData');
    if (userData) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Healthy Pregnancy Nutrition,{' '}
            <span className="text-pink-600">Made Easy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A web-app to help pregnant women in making safe, affordable and healthy food choices. 
            We connect what you want with what your body actually needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/signup"
              className="bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-700 transition-colors shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/signup?action=login"
              className="bg-white text-pink-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg border-2 border-pink-600"
            >
              Log In
            </Link>
          </div>

          <Link
            to="/quick-quiz"
            className="inline-block text-pink-600 hover:text-pink-700 font-semibold text-lg mb-16"
          >
            Tell us your cravings! →
          </Link>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nutrient Tracker</h3>
              <p className="text-gray-600">
                Track 8 essential nutrients daily with visual progress bars
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Shield className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Food Safety Guide</h3>
              <p className="text-gray-600">
                Search any food to know if it's safe, with doctor-reviewed answers
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Utensils className="w-12 h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Budget Meals</h3>
              <p className="text-gray-600">
                Get meal suggestions based on your budget and cooking access
              </p>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-16 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-gray-700">
            <p className="font-semibold mb-2">Medical Disclaimer:</p>
            <p>
              This app provides general nutrition information and is not a substitute for professional medical advice. 
              Always consult with your healthcare provider for personalized guidance. Information based on ACOG, CDC, 
              WHO, and NIH guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

