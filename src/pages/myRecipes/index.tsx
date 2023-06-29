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
  const [commentsState, setCommentsState] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    mealName: "",
    notes: "",
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
  });
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);
  const { data: recipes, refetch: refetchRecipes } = api.recipe.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        console.log("recipes rendered!");
      },
    }
  );

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
      window.location.reload();
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
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "rgb(69, 67, 67)" }}
    >
      <div className="container mx-auto">
        <div className="mx-5 my-5 w-full max-w-2xl rounded-lg bg-black bg-opacity-50 p-8">
          <h2 className="text-3xl">Welcome, {sessionData?.user.name}! </h2>
          <br />
          <ul className="bg-gold menu rounded-box w-56 p-2">
            {recipes?.map((recipe) => (
              <li key={recipe.id}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedRecipe(recipe);
                  }}
                  className="hover:text-gold text-white"
                >
                  {recipe.mealName} <br /> {recipe.calories} kcal
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-white">
            {selectedRecipe && (
              <div>
                <h2 className="text-5xl font-bold">
                  {selectedRecipe?.mealName}
                </h2>
                <p className="mt-8 text-base">
                  Created On:{" "}
                  {selectedRecipe?.createdAt
                    ? new Date(selectedRecipe.createdAt).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "long",
                          timeStyle: "short",
                        }
                      )
                    : ""}
                </p>
                <p className="mt-4 text-base">Notes: {selectedRecipe?.notes}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-base">
                      Protein: {selectedRecipe?.protein}g
                    </p>
                  </div>
                  <div>
                    <p className="text-base">Fat: {selectedRecipe?.fat}g</p>
                  </div>
                  <div>
                    <p className="text-base">Carbs: {selectedRecipe?.carbs}g</p>
                  </div>
                  <div>
                    <p className="text-base">
                      Total Calories: {selectedRecipe?.calories}g
                    </p>
                  </div>
                </div>
                <button
                  className="bg-gold mt-4 rounded px-4 py-2 text-white"
                  onClick={handleDeleteRecipe}
                >
                  Delete Recipe
                </button>
                <div className="mt-4">
                  <button
                    className="bg-gold rounded px-4 py-2 text-white"
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
                        className="bg-gold mt-4 rounded px-4 py-2 text-white"
                        onClick={handleSubmit}
                      >
                        UPDATE
                      </button>
                    </form>
                    <button
                      className="bg-gold mt-4 rounded px-4 py-2 text-white"
                      onClick={handleToggle}
                    >
                      CLOSE
                    </button>
                  </EditRecipeModal>
                </div>
                {commentsState && (
                  <div>
                    {comments?.map((comment) => (
                      <div key={comment.id} className="mt-5">
                        <CommentCard
                          comment={comment}
                          onDelete={() =>
                            void deleteComment.mutate({ id: comment.id })
                          }
                        />
                      </div>
                    ))}
                    <CommentEditor
                      onSave={({ title, content }) => {
                        void createComment.mutate({
                          title,
                          content,
                          recipeId: selectedRecipe.id,
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <br></br>
          <br></br>
          {commentsState == true ? (
            <button onClick={() => setCommentsState(false)}>
              Close Comments
            </button>
          ) : null}
          {commentsState == false && selectedRecipe ? (
            <button onClick={() => setCommentsState(true)}>
              View Comments
            </button>
          ) : null}
          {/* <div className="mt-4">
            <Link href="/">
              <button className="bg-gold rounded px-4 py-2 text-white">
                Back to Home
              </button>
            </Link>
            <button
              className="bg-gold ml-4 rounded px-4 py-2 text-white"
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
