import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat, BookOpen, Heart, Utensils, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-lg z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          <div className="bg-gradient-to-r from-orange-400 to-red-400 p-2 rounded-xl">
            <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
            FlavorCraft
          </h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 group"
          >
            <Utensils className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-orange-600">
              Recipes
            </span>
          </a>
          <a
            href="/favorites"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 group"
          >
            <Heart className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-orange-600">
              Favorites
            </span>
          </a>
          <a
            href="/collections"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 group"
          >
            <BookOpen className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-orange-600">
              Collections
            </span>
          </a>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Generate Recipe Button */}
          <button
            onClick={() => navigate("/upload")}
            className="bg-gradient-to-r from-orange-400 to-red-600 text-white px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium hover:from-orange-500 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-md whitespace-nowrap"
          >
            <span className="hidden sm:inline">Generate Recipe</span>
            <span className="sm:hidden">Generate</span>
          </button>

          {/* Desktop Auth Section */}
          <div className="hidden sm:flex items-center space-x-2">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-orange-600 font-semibold border border-orange-300 px-5 py-2 rounded-xl hover:bg-orange-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-orange-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-orange-600 transition"
                >
                  Signup
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 bg-orange-100 rounded-full hover:bg-orange-200 transition"
                >
                  <User className="text-orange-600 w-6 h-6" />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                    <button
                      onClick={() => {
                        navigate("/edit-profile");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-gray-700 hover:bg-orange-50 rounded-lg transition"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-orange-100">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Navigation Links */}
            <a
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200"
              onClick={() => setShowMobileMenu(false)}
            >
              <Utensils className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-gray-700">Recipes</span>
            </a>
            <a
              href="/favorites"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200"
              onClick={() => setShowMobileMenu(false)}
            >
              <Heart className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-gray-700">Favorites</span>
            </a>
            <a
              href="/collections"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-orange-50 transition-all duration-200"
              onClick={() => setShowMobileMenu(false)}
            >
              <BookOpen className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-gray-700">Collections</span>
            </a>

            {/* Mobile Auth Section */}
            <div className="pt-3 border-t border-orange-100 space-y-3">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-orange-600 font-semibold border border-orange-300 px-5 py-3 rounded-xl hover:bg-orange-50 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/signup");
                      setShowMobileMenu(false);
                    }}
                    className="w-full bg-orange-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                  >
                    Signup
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/edit-profile");
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-orange-50 text-gray-700 transition"
                  >
                    <User className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Edit Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-orange-50 text-gray-700 font-medium transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;