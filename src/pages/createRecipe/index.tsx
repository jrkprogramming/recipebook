import { signIn, signOut, useSession } from "next-auth/react";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import Link from "next/link";
import { Header } from "../../components/Header";

export default function CreateRecipePage() {
  const { data: sessionData } = useSession();
  const [formData, setFormData] = useState({
    mealName: "",
    notes: "",
    // ingredients: [""],
    // instructions: [""],
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    //newValue is there to make sure the number values are saved as numbers. Fixes type error.
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
      // void refetchRecipes();
      // we acually want to redirect to the show page
      <Link href="/myRecipes"></Link>;
      console.log("created recipe");
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
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <h2>Create a New Recipe!</h2>
        <div className="divider"></div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="mealName"
            value={formData.mealName}
            onChange={handleChange}
            placeholder="Meal Name"
            aria-label=".form-control-lg example"
          ></input>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Notes"
            aria-label=".form-control-lg example"
          ></input>
          <input
            type="number"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            aria-label=".form-control-lg example"
          ></input>
          <input
            type="number"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            aria-label=".form-control-lg example"
          ></input>
          <input
            type="number"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            aria-label=".form-control-lg example"
          ></input>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            aria-label=".form-control-lg example"
          ></input>
          <input type="submit" value="CREATE MEAL"></input>
        </form>
      </div>
    </div>
  );
}
