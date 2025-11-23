import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuickQuiz from "./pages/QuickQuiz";
import CravingResult from "./pages/CravingResult";
import Nutrients from "./pages/Nutrients";
import FoodSafety from "./pages/FoodSafety";
import Trimesters from "./pages/Trimesters";
import Meals from "./pages/Meals";
import Profile from "./pages/Profile";
import MoodTracker from "./pages/MoodTracker";
import Conditions from "./pages/Conditions";
import CulturalFoods from "./pages/CulturalFoods";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quick-quiz" element={<QuickQuiz />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/craving-result" element={<CravingResult />} />
        <Route path="/nutrients" element={<Nutrients />} />
        <Route path="/food-safety" element={<FoodSafety />} />
        <Route path="/trimesters" element={<Trimesters />} />
  <Route path="/meals" element={<Meals />} />
  <Route path="/profile" element={<Profile />} />
        <Route path="/mood-tracker" element={<MoodTracker />} />
        <Route path="/conditions" element={<Conditions />} />
        <Route path="/cultural-foods" element={<CulturalFoods />} />
      </Routes>
    </Router>
  );
}

export default App;
