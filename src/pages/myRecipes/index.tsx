import { useState, type FormEvent, type ChangeEvent } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";
import Link from "next/link";
import Modal from "../../components/EditRecipeModal";

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
        console.log("recipes!");
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
    e.preventDefault();
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
    <div className="col-span-3">
      <ul className="menu rounded-box w-56 bg-base-100 p-2">
        {recipes?.map((recipe) => (
          <li key={recipe.id}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setSelectedRecipe(recipe);
              }}
            >
              {recipe.mealName}
            </a>
          </li>
        ))}
      </ul>
      <div>
        {selectedRecipe && (
          <div>
            Recipe Name: {selectedRecipe?.mealName}
            <br></br>
            Created: {selectedRecipe?.createdAt?.toString()}
            <br></br>
            Notes: {selectedRecipe?.notes}
            <br></br>
            Protein: {selectedRecipe?.protein}g<br></br>
            Fat: {selectedRecipe?.fat}g<br></br>
            Carbs: {selectedRecipe?.carbs}g<br></br>
            Total Calories: {selectedRecipe?.calories}g<br></br>
            <button
              className="btn-warning btn-xs btn px-5"
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              onClick={handleDeleteRecipe}
            >
              Delete Recipe
            </button>
            <div className="container">
              {/* opens the modal */}
              <button
                className="btn-warning btn-xs btn px-5"
                onClick={handleToggle}
              >
                Edit Recipe
              </button>
              <Modal open={open}>
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
                  {/* closes the modal */}
                  <button className="btn-primary btn" onClick={handleToggle}>
                    CLOSE
                  </button>
                  <button className="btn-primary btn" onClick={handleSubmit}>
                    UPDATE
                  </button>
                </form>
              </Modal>
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
      <Link href="/createRecipe">Add a Recipe!</Link>
    </div>
  );
}
