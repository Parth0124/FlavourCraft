import { useNavigate } from "react-router-dom";
import { ChefHat, Search, BookOpen, Heart, Users, Utensils } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-lg z-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-orange-400 to-red-400 p-2 rounded-xl">
            <ChefHat className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              FlavorCraft
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="/" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 group">
            <Utensils className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-orange-600">Recipes</span>
          </a>
          <a href="/favorites" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 group">
            <Heart className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-orange-600">Favorites</span>
          </a>
          <a href="/collections" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 group">
            <BookOpen className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-orange-600">Collections</span>
          </a>
          <a href="/community" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-all duration-200 group">
            <Users className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-gray-700 group-hover:text-orange-600">Community</span>
          </a>
        </div>

        {/* Search & CTA */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search recipes..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="bg-gradient-to-r from-orange-300 to-red-900 text-white px-6 py-2 rounded-xl font-medium hover:from-orange-00 hover:to-red-900 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Generate Recipe
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
