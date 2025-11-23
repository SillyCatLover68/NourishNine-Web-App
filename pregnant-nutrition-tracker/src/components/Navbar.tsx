import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Utensils, Shield, BookOpen, Heart, LogIn, Stethoscope, User, LogOut } from "lucide-react";
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("userData");
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-pink-600">
            <span>🌿</span>
            <span>NourishNine</span>
          </Link>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/dashboard" ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <Link to="/nutrients" className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/nutrients" ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">Nutrients</span>
                </Link>
                <Link to="/food-safety" className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/food-safety" ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Safety</span>
                </Link>
                <Link to="/trimesters" className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/trimesters" ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Trimesters</span>
                </Link>
                <Link to="/mood-tracker" className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/mood-tracker" ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Heart className="w-4 h-4" />
                  <span className="hidden sm:inline">Mood</span>
                </Link>
                <Link to="/meals" className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/meals" ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">Meals</span>
                </Link>
                <Link to="/profile" className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/profile" ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                {/* Sign out moved to Profile page; remove duplicate here */}
                <Link to="/conditions" className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors ${location.pathname === "/conditions" ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-gray-100"}`}>
                  <Stethoscope className="w-4 h-4" />
                  <span className="hidden sm:inline">Conditions</span>
                </Link>
              </>
            ) : (
              <Link to="/signup" className="flex items-center gap-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
                <LogIn className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
