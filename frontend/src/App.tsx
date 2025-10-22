import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Info from "./components/Info";
import Navbar from "./components/Navbar";
import IngredientUploadPage from "./pages/Ingrident";
import FavoritesPage from "./pages/Favorites";
import CollectionsPage from "./pages/Collections";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import EditProfilePage from "./pages/EditProfile";
import UserPreferences from "./components/UserPreference";
import About from "./pages/About";
import Blog from "./pages/Blog";
import PrivacyPolicy from "./pages/PrivacyPolicy";
// ✅ Import the new Login Page

// Layout wrapper to handle conditional Footer
const Layout = () => {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Info />
            </>
          }
        />

        {/* Ingredient Upload Page */}
        <Route
          path="/upload"
          element={<IngredientUploadPage onNavigate={() => {}} />}
        />

        {/* Favorites Page */}
        <Route path="/favorites" element={<FavoritesPage />} />

        {/* Collections Page */}
        <Route path="/collections" element={<CollectionsPage />} />

        {/* ✅ New Login Route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/preferences" element={<UserPreferences />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog/>}/>
        <Route path="*" element={<div className="p-10">Page Not Found</div>} />
        <Route path="/privacy" element={<PrivacyPolicy/>} />
      </Routes>

      {/* Hide footer only on /upload */}
      {location.pathname !== "/upload" && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
