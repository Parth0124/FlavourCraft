import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cuisines = [
  "Italian",
  "Indian",
  "Chinese",
  "Mexican",
  "Japanese",
  "French",
  "Thai",
  "Mediterranean",
];

const UserPreferences = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCuisine = (cuisine: string) => {
    if (selected.includes(cuisine)) {
      setSelected(selected.filter((c) => c !== cuisine));
    } else {
      setSelected([...selected, cuisine]);
    }
  };

  const handleSave = () => {
    if (selected.length === 0) {
      alert("Please select at least one cuisine");
      return;
    }
    // Save preferences in localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.preferences = selected;
    localStorage.setItem("user", JSON.stringify(user));

    alert("Preferences saved!");
    navigate("/"); // redirect to homepage
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-red-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
          Select Your Favorite Cuisines
        </h2>
        <p className="text-gray-600 mb-5 text-center">
          We will show recipes based on your preferences
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`px-4 py-2 rounded-xl border transition ${
                selected.includes(cuisine)
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-200"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default UserPreferences;
