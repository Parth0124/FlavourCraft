import Footer from "@/components/Footer";
import RecipeGenerator from "@/components/Generator";
import IngredientGrid from "@/components/IngridientsGrid";
import { Camera, ChefHat, FileImage, Plus, Upload, X } from "lucide-react";
import { useState } from "react";


// Define types
interface IngredientUploadPageProps {
  onNavigate: (page: string) => void;
}

interface UploadedImage {
  id: number;
  file: File;
  preview: string;
  name: string;
}

const IngredientUploadPage: React.FC<IngredientUploadPageProps> = ({
  onNavigate,
}) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  // Drag handler
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // File input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // File handler
  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (event.target?.result) {
            const newImage: UploadedImage = {
              id: Date.now() + Math.random(),
              file,
              preview: event.target.result as string,
              name: file.name,
            };
            setUploadedImages((prev) => [...prev, newImage]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove image
  const removeImage = (id: number) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Add more images
  const addMoreImages = () => {
    document.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  };

  // Generate recipe
  const generateRecipe = () => {
    if (uploadedImages.length === 0) {
      alert("Please upload at least one ingredient image!");
      return;
    }
    setIsGeneratingRecipe(true);
  };

  // Reset to upload state
  const resetToUpload = () => {
    setIsGeneratingRecipe(false);
  };

  if (isGeneratingRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={resetToUpload}
              className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
            >
              ← Back to Upload
            </button>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Your{" "}
              <span className="bg-gradient-to-r from-orange-300 to-red-900 bg-clip-text text-transparent">
                Recipe
              </span>
            </h1>
          </div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-280px)]">
            {/* Left Side - Ingredient Grid */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <IngredientGrid
                uploadedImages={uploadedImages}
                onRemoveImage={removeImage}
                onAddMore={addMoreImages}
              />
            </div>

            {/* Right Side - Recipe Generator */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <RecipeGenerator ingredientCount={uploadedImages.length} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-24">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Upload Your{" "}
            <span className="bg-gradient-to-r from-orange-300 to-red-900 bg-clip-text text-transparent">
              Ingredients
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take photos of your ingredients and let our AI create amazing
            recipes tailored just for you!
          </p>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 mb-8 ${
            dragActive
              ? "border-orange-400 bg-orange-50"
              : "border-gray-300 hover:border-orange-400 hover:bg-orange-25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <div className="bg-gradient-to-r from-orange-300 to-red-900 p-4 rounded-xl">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="bg-gradient-to-r from-orange-300 to-red-900 p-4 rounded-xl">
                <FileImage className="w-8 h-8 text-white" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Drop your ingredient photos here
              </h3>
              <p className="text-gray-500 mb-4">
                or click to browse from your device
              </p>
              <div className="flex justify-center">
                <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-300 to-red-900 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  Choose Photos
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Supports: JPG, PNG, GIF • Max file size: 10MB each
            </p>
          </div>
        </div>

        {/* Uploaded Images Grid */}
        {uploadedImages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Your Ingredients ({uploadedImages.length})
              </h3>
              <button
                onClick={addMoreImages}
                className="inline-flex items-center px-4 py-2 bg-white border-2 border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uploadedImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 relative group">
                    <img
                      src={image.preview}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay only on hover */}
                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 pointer-events-none transition-all duration-200"></div>
                  </div>

                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <p className="mt-2 text-sm text-gray-600 truncate text-center">
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Recipe Button */}
        <div className="text-center">
          <button
            onClick={generateRecipe}
            disabled={uploadedImages.length === 0}
            className={`inline-flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
              uploadedImages.length > 0
                ? "bg-gradient-to-r from-orange-300 to-red-900 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105 shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ChefHat className="w-6 h-6 mr-3" />
            Generate My Recipe
            {uploadedImages.length > 0 && (
              <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                {uploadedImages.length}
              </span>
            )}
          </button>

          {uploadedImages.length === 0 && (
            <p className="text-gray-500 mt-3">
              Upload ingredient photos to generate your recipe
            </p>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default IngredientUploadPage;