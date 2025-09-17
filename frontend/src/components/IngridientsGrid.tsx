import { Plus, X } from "lucide-react";
import { useState, useEffect } from "react";

interface UploadedImage {
  id: number;
  file: File;
  preview: string;
  name: string;
}

interface IngredientGridProps {
  uploadedImages: UploadedImage[];
  onRemoveImage: (id: number) => void;
  onAddMore: () => void;
}

const IngredientGrid: React.FC<IngredientGridProps> = ({
  uploadedImages,
  onRemoveImage,
  onAddMore,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());

  // Trigger initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Animate items in sequence
  useEffect(() => {
    if (isVisible && uploadedImages.length > 0) {
      uploadedImages.forEach((image, index) => {
        setTimeout(() => {
          setAnimatedItems(prev => new Set([...prev, image.id]));
        }, index * 150); // Stagger animation by 150ms
      });
    }
  }, [isVisible, uploadedImages]);

  // Add new items with animation
  useEffect(() => {
    const newItems = uploadedImages.filter(image => !animatedItems.has(image.id));
    newItems.forEach((image, index) => {
      setTimeout(() => {
        setAnimatedItems(prev => new Set([...prev, image.id]));
      }, index * 150);
    });
  }, [uploadedImages, animatedItems]);

  return (
    <div className="h-full">
      {/* Header with slide-in animation */}
      <div 
        className={`flex items-center justify-between mb-6 transform transition-all duration-700 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-4 opacity-0'
        }`}
      >
        <h3 className="text-2xl font-bold text-gray-800">
          Your Ingredients ({uploadedImages.length})
        </h3>
        <button
          onClick={onAddMore}
          className="inline-flex items-center px-4 py-2 bg-white border-2 border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-200 hover:scale-105 hover:shadow-md"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add More
        </button>
      </div>

      {/* Grid with staggered animations */}
      <div 
        className={`grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2 transform transition-all duration-500 ease-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-8 opacity-0'
        }`}
      >
        {uploadedImages.map((image, index) => {
          const isAnimated = animatedItems.has(image.id);
          
          return (
            <div 
              key={image.id} 
              className={`relative group transform transition-all duration-500 ease-out ${
                isAnimated 
                  ? 'translate-y-0 opacity-100 scale-100' 
                  : 'translate-y-6 opacity-0 scale-95'
              }`}
              style={{
                transitionDelay: isAnimated ? '0ms' : `${index * 100}ms`
              }}
            >
              <div className="aspect-square bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 relative group hover:scale-105 hover:-translate-y-1">
                <img
                  src={image.preview}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Animated overlay */}
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 pointer-events-none transition-all duration-300 flex items-center justify-center">
                  <div className="transform scale-0 group-hover:scale-100 transition-transform duration-200 bg-white bg-opacity-20 rounded-full p-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Remove button with enhanced animation */}
              <button
                onClick={() => onRemoveImage(image.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 transform hover:scale-110 hover:rotate-90 shadow-lg"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Filename with slide-up animation */}
              <p className={`mt-2 text-sm text-gray-600 truncate text-center transform transition-all duration-300 ${
                isAnimated 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-2 opacity-0'
              }`}>
                {image.name}
              </p>

              {/* Subtle pulse animation on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-200 transition-all duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-100 to-red-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state with bounce animation */}
      {uploadedImages.length === 0 && (
        <div 
          className={`flex flex-col items-center justify-center h-64 text-gray-500 transform transition-all duration-700 ease-out ${
            isVisible 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-8 opacity-0 scale-95'
          }`}
        >
          <div className="animate-bounce mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-red-200 rounded-2xl flex items-center justify-center">
              <Plus className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <p className="text-lg font-medium">No ingredients yet</p>
          <p className="text-sm mt-1">Upload some photos to get started!</p>
        </div>
      )}

      {/* Floating action hint */}
      {uploadedImages.length > 0 && (
        <div 
          className={`absolute bottom-4 right-4 transform transition-all duration-1000 ease-out ${
            isVisible 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-2 rounded-full text-xs font-medium shadow-lg animate-pulse">
            {uploadedImages.length} ready to cook!
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientGrid;