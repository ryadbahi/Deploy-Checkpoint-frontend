import { useEffect, useState } from "react";

interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  steps: string[];
}

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [form, setForm] = useState({ title: "", ingredients: "", steps: "" });

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API}/api/recipes/test`)
      .then((res) => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, [API]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.ingredients || !form.steps) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      userId: "test", // same user ID used in your database
      title: form.title.trim(),
      ingredients: form.ingredients.split(",").map((s) => s.trim()),
      steps: form.steps.split(",").map((s) => s.trim()),
    };

    try {
      const res = await fetch(`${API}/api/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to add recipe");
      }

      const newRecipe = await res.json();
      setRecipes((prev) => [...prev, newRecipe]); // update list with new one
      setForm({ title: "", ingredients: "", steps: "" }); // reset form
    } catch (err) {
      console.error(err);
      alert("An error occurred while adding the recipe.");
    }
  };

  return (
    <div className="min-h-screen text-white px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Form Card */}
        <div className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Add a Recipe</h2>
          <div className="space-y-4 ">
            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              name="ingredients"
              placeholder="Ingredients (comma-separated)"
              value={form.ingredients}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
            />
            <textarea
              name="steps"
              placeholder="Steps (comma-separated)"
              value={form.steps}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={3}
            />
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="w-32 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Add Recipe
              </button>
            </div>
          </div>
        </div>

        {/* Recipe List */}
        <div className="space-y-6">
          {recipes.map((r) => (
            <div
              key={r._id}
              className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-5"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                {r.title}
              </h3>
              <p className="mb-1">
                <span className="font-bold text-gray-700">Ingredients:</span>{" "}
                {r.ingredients.join(", ")}
              </p>
              <p>
                <span className="font-bold text-gray-700">Steps:</span>{" "}
                {r.steps.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
