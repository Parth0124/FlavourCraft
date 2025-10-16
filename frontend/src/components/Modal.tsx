import { X } from "lucide-react";

type Recipe = {
  image: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
};

type RecipeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe | null;
};

const RecipeModal = ({ isOpen, onClose, recipe }: RecipeModalProps) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className="bg-white/90 rounded-2xl shadow-xl w-11/12 max-w-lg relative overflow-hidden h-[80vh] flex flex-col border border-gray-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-black transition"
        >
          <X size={24} />
        </button>

        {/* Image */}
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {recipe.title}
          </h2>
          <p className="text-gray-600 mb-4">{recipe.description}</p>

          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Ingredients:
          </h3>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Instructions:
          </h3>
          <p className="text-gray-600 whitespace-pre-line">
            {recipe.instructions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
