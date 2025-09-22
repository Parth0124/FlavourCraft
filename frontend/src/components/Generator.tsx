import { ChefHat, Clock, Users, Star } from "lucide-react";
import { useState, useEffect } from "react";

interface RecipeGeneratorProps {
  ingredientCount: number;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ ingredientCount }) => {
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <ChefHat className="w-6 h-6 text-orange-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Generating Recipe...</h3>
        <p className="text-gray-600">Analyzing your {ingredientCount} ingredients</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  const GeneratedRecipe = () => (
    <div className="h-full overflow-y-auto pr-2">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-orange-300 to-red-900 p-2 rounded-lg mr-3">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Mediterranean Pasta Delight</h2>
        </div>
        
        <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>25 mins</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>4 servings</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />
            <span>4.8/5</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Ingredients</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "12 oz pasta (penne or rigatoni)",
            "2 large tomatoes, diced",
            "1 medium onion, chopped",
            "3 cloves garlic, minced",
            "1 bell pepper, sliced",
            "1/4 cup olive oil",
            "1/2 cup fresh basil leaves",
            "Salt and pepper to taste"
          ].map((ingredient, index) => (
            <div key={index} className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-gray-700">{ingredient}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Instructions</h3>
        <div className="space-y-4">
          {[
            "Bring a large pot of salted water to boil. Cook pasta according to package directions until al dente.",
            "While pasta cooks, heat olive oil in a large skillet over medium heat. Add onion and cook until softened, about 5 minutes.",
            "Add garlic and bell pepper to the skillet. Cook for another 3-4 minutes until fragrant.",
            "Add diced tomatoes to the pan and season with salt and pepper. Cook for 5-7 minutes until tomatoes break down.",
            "Drain pasta and add it to the skillet with the vegetable mixture. Toss to combine.",
            "Remove from heat and stir in fresh basil leaves. Taste and adjust seasoning as needed.",
            "Serve immediately with grated Parmesan cheese if desired. Enjoy your homemade Mediterranean delight!"
          ].map((step, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-300 to-red-900 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                {index + 1}
              </div>
              <p className="text-gray-700 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button className="bg-gradient-to-r from-orange-300 to-red-900 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200">
          Generate Another Recipe
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {isGenerating ? <LoadingSpinner /> : <GeneratedRecipe />}
    </div>
  );
};

export default RecipeGenerator;