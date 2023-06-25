import { useState, type FormEvent, type ChangeEvent } from "react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CreateRecipePage() {
  const { data: sessionData } = useSession();
  const [formData, setFormData] = useState({
    mealName: "",
    notes: "",
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValue = isNaN(Number(value)) ? value : Number(value);
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: newValue,
      };
    });
  };

  const createRecipe = api.recipe.create.useMutation({
    onSuccess: () => {
      // Redirect to the show page after creating the recipe
      // Replace the Link component with:
      window.location.href = "/myRecipes";
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createRecipe.mutate({
      mealName: formData.mealName,
      notes: formData.notes,
      protein: formData.protein,
      fat: formData.fat,
      carbs: formData.carbs,
      calories: formData.calories,
    });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "rgb(69, 67, 67)" }}
    >
      <div className="mx-5 my-5 w-full max-w-2xl rounded-lg bg-stone-500 p-10 shadow-lg">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Create a New Recipe!
        </h2>
        <div className="divider"></div>
        <form onSubmit={handleSubmit}>
          <div className="my-4">
            <label
              htmlFor="mealName"
              className="mb-1 block font-bold text-white"
            >
              Recipe Name
            </label>
            <input
              type="text"
              id="mealName"
              name="mealName"
              value={formData.mealName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div className="my-4">
            <label htmlFor="notes" className="mb-1 block font-bold text-white">
              Notes
            </label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label
                htmlFor="protein"
                className="mb-1 block font-bold text-white"
              >
                Protein
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={formData.protein}
                onChange={handleChange}
                placeholder="Protein"
                style={smallInputStyle}
              />{" "}
              g
            </div>
            <div>
              <label htmlFor="fat" className="mb-1 block font-bold text-white">
                Fat
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={formData.fat}
                onChange={handleChange}
                placeholder="Fat"
                style={smallInputStyle}
              />{" "}
              g
            </div>
            <div>
              <label
                htmlFor="carbs"
                className="mb-1 block font-bold text-white"
              >
                Carbs
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.carbs}
                onChange={handleChange}
                placeholder="Carbs"
                style={smallInputStyle}
              />{" "}
              g
            </div>
            <div>
              <label
                htmlFor="calories"
                className="mb-1 block font-bold text-white"
              >
                Calories
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                placeholder="Calories"
                style={smallInputStyle}
              />{" "}
              g
            </div>
          </div>
          <input
            type="submit"
            value="CREATE MEAL"
            className="bg-gold text-red hover:bg-silver mx-auto mt-6 block cursor-pointer rounded px-6 py-3 font-bold"
            style={buttonStyle}
          />
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "0.5rem",
  borderRadius: "0.25rem",
  border: "1px solid #ccc",
  width: "100%", // Add this line to make the input fields longer
};

const smallInputStyle = {
  padding: "0.15rem",
  borderRadius: "0.25rem",
  border: "1px solid #ccc",
  width: "60%", // Adjust the width value to make the fields smaller or larger as needed
};

const buttonStyle = {
  padding: "12px 24px", // Adjust the padding values to increase/decrease the button size
  fontSize: "2rem", // Adjust the font-size value to change the text size
};
