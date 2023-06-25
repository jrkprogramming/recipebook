import { useState, type FormEvent, type ChangeEvent } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";
import Link from "next/link";
import EditRecipeModal from "../../components/EditRecipeModal";
import { Header } from "../../components/Header";

type Recipe = RouterOutputs["recipe"]["getAll"][0];

export default function MyRecipesPage() {
  const { data: sessionData } = useSession();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
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
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);
  const { data: recipes, refetch: refetchRecipes } = api.recipe.getAll.useQuery(
    undefined, // no input
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        // setSelectedRecipe(selectedRecipe ?? data[0] ?? null);
        console.log("recipes rendered!");
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  function handleDeleteRecipe() {
    if (selectedRecipe !== null) {
      void deleteRecipe.mutate({ id: selectedRecipe.id });
    }
  }

  // Edit Recipe

  const editRecipe = api.recipe.edit.useMutation({
    onSuccess: () => {
      handleToggle();
      setSelectedRecipe(null);
      void refetchRecipes();
    },
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

  const handleSubmit = (e: FormEvent) => {
    if (selectedRecipe !== null) {
      editRecipe.mutate({
        id: selectedRecipe.id,
        mealName: formData.mealName,
        notes: formData.notes,
        protein: formData.protein,
        fat: formData.fat,
        carbs: formData.carbs,
        calories: formData.calories,
      });
    }
  };

  // Delete Recipe

  const deleteRecipe = api.recipe.delete.useMutation({
    onSuccess: () => {
      void refetchRecipes();
    },
  });

  // Comments Stuff

  const { data: comments, refetch: refetchComments } =
    api.comment.getAll.useQuery(
      {
        recipeId: selectedRecipe?.id ?? "",
      },
      {
        enabled: sessionData?.user !== undefined && selectedRecipe !== null,
      }
    );

  const createComment = api.comment.create.useMutation({
    onSuccess: () => {
      void refetchComments();
    },
  });
  const deleteComment = api.comment.delete.useMutation({
    onSuccess: () => {
      void refetchComments();
    },
  });
  return (
    <div className="text-gold bg-black p-8">
      <ul className="bg-gold menu rounded-box w-56 p-2">
        {recipes?.map((recipe) => (
          <li key={recipe.id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedRecipe(recipe);
              }}
              className="hover:text-gold text-black"
            >
              {recipe.mealName}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-white">
        {selectedRecipe && (
          <div>
            <h2 className="text-2xl font-bold">{selectedRecipe?.mealName}</h2>
            <p className="mt-2 text-base">
              Created: {selectedRecipe?.createdAt?.toString()}
            </p>
            <p className="mt-2 text-base">Notes: {selectedRecipe?.notes}</p>
            <p className="mt-2 text-base">
              Protein: {selectedRecipe?.protein}g
            </p>
            <p className="mt-2 text-base">Fat: {selectedRecipe?.fat}g</p>
            <p className="mt-2 text-base">Carbs: {selectedRecipe?.carbs}g</p>
            <p className="mt-2 text-base">
              Total Calories: {selectedRecipe?.calories}g
            </p>
            <button
              className="bg-gold mt-4 rounded px-4 py-2 text-black"
              onClick={handleDeleteRecipe}
            >
              Delete Recipe
            </button>
            <div className="mt-4">
              {/* opens the modal */}
              <button
                className="bg-gold rounded px-4 py-2 text-black"
                onClick={handleToggle}
              >
                Edit Recipe
              </button>
              <EditRecipeModal open={open}>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="mealName"
                    value={formData.mealName}
                    onChange={handleChange}
                    placeholder="Meal Name"
                    className="input"
                  ></input>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                    className="input"
                  ></input>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    className="input"
                  ></input>
                  <input
                    type="number"
                    name="fat"
                    value={formData.fat}
                    onChange={handleChange}
                    className="input"
                  ></input>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    className="input"
                  ></input>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    className="input"
                  ></input>
                  <button
                    className="bg-gold mt-4 rounded px-4 py-2 text-black"
                    onClick={handleSubmit}
                  >
                    UPDATE
                  </button>
                </form>
                <button
                  className="bg-gold mt-4 rounded px-4 py-2 text-black"
                  onClick={handleToggle}
                >
                  CLOSE
                </button>
              </EditRecipeModal>
            </div>
            {comments?.map((comment) => (
              <div key={comment.id} className="mt-5">
                <CommentCard
                  comment={comment}
                  onDelete={() => void deleteComment.mutate({ id: comment.id })}
                />
              </div>
            ))}
            <CommentEditor
              onSave={({ title, content }) => {
                void createComment.mutate({
                  title,
                  content,
                  recipeId: selectedRecipe?.id ?? "",
                });
              }}
            />
          </div>
        )}
      </div>
      <Link href="/createRecipe">
        <p className="text-gold mt-4">Add a Recipe!</p>
      </Link>
      {/* Add Link here that will take user to everyone's recipes */}
    </div>
  );
}
