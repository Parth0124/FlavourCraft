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
