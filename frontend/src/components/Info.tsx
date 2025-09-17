
import { ChefHat, Search, Heart, Users } from "lucide-react";

const Info = () => {
  const features = [
    {
      icon: <ChefHat className="w-8 h-8 text-orange-500" />,
      title: "AI-Powered Generation",
      description: "Our advanced AI analyzes your ingredients and dietary preferences to create unique, delicious recipes tailored just for you."
    },
    {
      icon: <Search className="w-8 h-8 text-orange-500" />,
      title: "Smart Ingredient Search",
      description: "Simply input what's in your pantry, and we'll suggest amazing recipes that make the most of your available ingredients."
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      title: "Personalized Recommendations",
      description: "Get recipe suggestions based on your taste preferences, dietary restrictions, and cooking skill level."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Community Favorites",
      description: "Discover trending recipes from our cooking community and share your own culinary creations."
    }
  ];

  return (
    <div className="py-20 " style={{ backgroundColor: "#FAF6F1" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
              Why Choose FlavorCraft?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of cooking with our intelligent recipe generator. From quick weeknight dinners to gourmet weekend projects, we've got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="bg-white rounded-xl p-4 w-fit mb-6 group-hover:shadow-lg transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-orange-300 to-red-900 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-orange-100">Recipes Generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25,000+</div>
              <div className="text-orange-100">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-orange-100">Meals Cooked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-orange-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;