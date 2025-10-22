
import { ChefHat, BookOpen, Star, Clock } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative pt-20 bg-gradient-to-b from-orange-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-300 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-red-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-amber-300 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                  Cook Smarter
                </span>
                <br />
                <span className="text-gray-800">with AI Magic</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Transform your ingredients into delicious recipes instantly. Our AI chef creates personalized meals just for you.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">50K+</div>
                <div className="text-sm text-gray-500">Recipes Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">4.9★</div>
                <div className="text-sm text-gray-500">User Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">25K+</div>
                <div className="text-sm text-gray-500">Happy Cooks</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-xl flex items-center justify-center space-x-2">
                <ChefHat className="w-5 h-5" />
                <span>Start Cooking Now</span>
              </button>
              <button className="border-2 border-orange-300 text-orange-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center justify-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Browse Recipes</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Delicious cooking"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Recipe Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">5.0 Rating</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Pasta Carbonara</div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">15 mins</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Quick & Easy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;