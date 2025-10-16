import { useState } from "react";
import { Filter, Info, Star, Clock, RotateCcw } from "lucide-react";
import RecipeModal from "@/components/Modal";
// Import your modal

type Recipe = {
  id: number;
  title: string;
  image: string;
  cuisine: string;
  state: string;
  type: string;
  difficulty: string;
  rating: number;
  prepTime: string;
  description: string;
  ingredients: string[];
  instructions: string;
};

const allRecipes: Recipe[] = [
  {
    id: 1,
    title: "Paneer Butter Masala",
    image:
      "data:image/jpeg;base64,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",
    cuisine: "Indian",
    state: "Punjab",
    type: "Vegetarian",
    difficulty: "Medium",
    rating: 4.8,
    prepTime: "30 mins",
    description: "Creamy and rich paneer dish cooked in buttery tomato gravy.",
    ingredients: ["Paneer", "Tomatoes", "Butter", "Spices"],
    instructions: "Cook gravy, add paneer cubes, simmer for 10 mins.",
  },
  {
    id: 2,
    title: "Sushi Rolls",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
    cuisine: "Japanese",
    state: "Tokyo",
    type: "Non-Vegetarian",
    difficulty: "Hard",
    rating: 4.6,
    prepTime: "50 mins",
    description: "Traditional sushi rolls with rice, fish, and seaweed.",
    ingredients: ["Rice", "Fish", "Nori", "Vinegar"],
    instructions: "Roll ingredients tightly and slice evenly.",
  },
  {
    id: 3,
    title: "Dosa",
    image:
      "data:image/jpeg;base64,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",
    cuisine: "South Indian",
    state: "Tamil Nadu",
    type: "Vegetarian",
    difficulty: "Easy",
    rating: 4.9,
    prepTime: "25 mins",
    description: "Crispy and golden South Indian crepe made from fermented batter.",
    ingredients: ["Rice", "Urad dal", "Salt", "Oil"],
    instructions: "Spread batter on tawa and cook till golden.",
  },
  {
    id: 4,
    title: "Spaghetti Carbonara",
    image:
      "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
    cuisine: "Italian",
    state: "Rome",
    type: "Non-Vegetarian",
    difficulty: "Medium",
    rating: 4.7,
    prepTime: "35 mins",
    description: "Classic Italian pasta with eggs, cheese, pancetta, and pepper.",
    ingredients: ["Spaghetti", "Eggs", "Parmesan", "Bacon"],
    instructions: "Cook pasta, mix with sauce, and toss well.",
  },
];

const Collections = () => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Rating");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cuisines = ["All", "Indian", "Japanese", "South Indian", "Italian"];
  const types = ["All", "Vegetarian", "Non-Vegetarian", "Vegan"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];
  const sortOptions = ["Rating", "Prep Time", "Newest", "Oldest"];

  const filteredRecipes = allRecipes
    .filter(
      (r) =>
        (selectedCuisine === "All" || r.cuisine === selectedCuisine) &&
        (selectedType === "All" || r.type === selectedType) &&
        (selectedDifficulty === "All" || r.difficulty === selectedDifficulty)
    )
    .sort((a, b) => {
      if (sortOption === "Rating") return b.rating - a.rating;
      if (sortOption === "Prep Time")
        return parseInt(a.prepTime) - parseInt(b.prepTime);
      return 0;
    });

  const resetFilters = () => {
    setSelectedCuisine("All");
    setSelectedType("All");
    setSelectedDifficulty("All");
    setSortOption("Rating");
  };

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-28 px-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-orange-700 mb-2">
          🍽 Explore Our Recipe Collections
        </h1>
        <p className="text-gray-600 text-lg">
          Filter, sort, and discover mouth-watering recipes from all over the world.
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-orange-500" />
          <label className="font-medium text-gray-700">Cuisine:</label>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
          >
            {cuisines.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
           <span title="Select a cuisine type like Indian, Japanese, etc.">
            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <span title="Choose if the dish is Vegetarian, Vegan, or Non-Vegetarian.">
            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
          >
            {difficulties.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
           <span title="Filter based on cooking difficulty level.">
            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Sort By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
          >
            {sortOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span title="Sort recipes by rating, prep time, or latest added.">
            <Info className="w-4 h-4 text-gray-400 cursor-pointer" />
          </span>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-md"
          title="Reset all filters and show all recipes"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Recipe Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => openModal(recipe)}
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {recipe.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {recipe.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-400" />
                  {recipe.prepTime}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">
                {recipe.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <RecipeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={selectedRecipe}
      />
    </div>
  );
};

export default Collections;
