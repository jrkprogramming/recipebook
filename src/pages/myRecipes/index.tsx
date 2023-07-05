import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
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
    ingredients: [""],
    instructions: [""],
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

  const handleIngredientChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedIngredients = [...prevState.ingredients];
      updatedIngredients[index] = value;
      return {
        ...prevState,
        ingredients: updatedIngredients,
      };
    });
  };

  const handleInstructionChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = e.target;
    setFormData((prevState) => {
      const updatedInstructions = [...prevState.instructions];
      updatedInstructions[index] = value;
      return {
        ...prevState,
        instructions: updatedInstructions,
      };
    });
  };

  const handleAddIngredient = () => {
    setFormData((prevState) => {
      const updatedIngredients = [...prevState.ingredients, ""];
      return {
        ...prevState,
        ingredients: updatedIngredients,
      };
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prevState) => {
      const updatedIngredients = [...prevState.ingredients];
      updatedIngredients.splice(index, 1);
      return {
        ...prevState,
        ingredients: updatedIngredients,
      };
    });
  };

  const handleAddInstruction = () => {
    setFormData((prevState) => {
      const updatedInstructions = [...prevState.instructions, ""];
      return {
        ...prevState,
        instructions: updatedInstructions,
      };
    });
  };

  const handleRemoveInstruction = (index: number) => {
    setFormData((prevState) => {
      const updatedInstructions = [...prevState.instructions];
      updatedInstructions.splice(index, 1);
      return {
        ...prevState,
        instructions: updatedInstructions,
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    if (selectedRecipe !== null) {
      editRecipe.mutate({
        id: selectedRecipe.id,
        mealName: formData.mealName,
        notes: formData.notes,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
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

  useEffect(() => {
    if (selectedRecipe !== null) {
      setFormData({
        mealName: selectedRecipe.mealName,
        notes: selectedRecipe.notes,
        ingredients: selectedRecipe.ingredients,
        instructions: selectedRecipe.instructions,
        protein: selectedRecipe.protein,
        fat: selectedRecipe.fat,
        carbs: selectedRecipe.carbs,
        calories: selectedRecipe.calories,
      });
    } else {
      setFormData({
        mealName: "",
        notes: "",
        ingredients: [""],
        instructions: [""],
        protein: 0,
        fat: 0,
        carbs: 0,
        calories: 0,
      });
    }
  }, [selectedRecipe]);
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: "rgb(69, 67, 67)" }}
    >
      <div className="container mx-auto">
        <div className="mx-5 my-5 w-full max-w-2xl rounded-lg bg-black bg-opacity-50 p-20">
          <h2 className="text-3xl">Welcome, {sessionData?.user.name}! </h2>
          <br />
          <div className="mt-4">
            <Link href="/">
              <button className="bg-gold btn-primary btn rounded px-4 py-2 text-black">
                Back to Home
              </button>
            </Link>
            <Link href="/createRecipe">
              <button className="bg-gold btn-primary btn rounded px-4 py-2 text-black">
                Add a Recipe
              </button>
            </Link>
            <button
              className="bg-gold btn-primary btn ml-4 rounded px-4 py-2 text-black"
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
          </div>
          <br />
          <h2 className="text-xl">My Recipes:</h2>
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
          <br />
          <div className="divider"></div>
          <div className="mt-4 text-white">
            {selectedRecipe && (
              <div>
                <h2 className="text-7xl font-bold">
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
                <p className="mt-4 break-words text-base">
                  About: {selectedRecipe?.notes}
                </p>
                <br />
                <div className="break-words">
                  {/* Content that needs word wrapping */}
                </div>
                <div>
                  <p className="mt-4 break-words text-base">Ingredients:</p>
                  <div className="break-words">
                    {formData.ingredients.map((ingredient, index) => (
                      <ul key={index}>
                        <li key={index}>
                          {ingredient ? `• ${ingredient}` : ""}
                          {/* <div className="flex">
                          <input
                            type="text"
                            name={`ingredients[${index}]`}
                            value={ingredient}
                            onChange={handleChange}
                            className="input"
                          />
                          <button
                            className="ml-2 rounded bg-red-500 px-2 py-1 text-white"
                            onClick={() => handleRemoveIngredient(index)}
                          >
                            Remove
                          </button>
                        </div> */}
                        </li>
                      </ul>
                    ))}
                  </div>
                  {/* <button
                      className="mt-2 rounded bg-green-500 px-2 py-1 text-white"
                      onClick={handleAddIngredient}
                    >
                      Add Ingredient
                    </button> */}
                </div>
                <br />
                <div>
                  <p>Instructions:</p>
                  {formData.instructions.map((instruction, index) => (
                    <ol key={index}>
                      <li key={index}>
                        {index + 1}: {instruction}
                      </li>
                    </ol>
                    // <div key={index} className="flex">
                    //   <input
                    //     type="text"
                    //     name={`instructions[${index}]`}
                    //     value={instruction}
                    //     onChange={handleChange}
                    //     className="input"
                    //   />
                    //   <button
                    //     className="ml-2 rounded bg-red-500 px-2 py-1 text-white"
                    //     onClick={() => handleRemoveInstruction(index)}
                    //   >
                    //     Remove
                    //   </button>
                    // </div>
                  ))}
                  {/* <button
                    className="mt-2 rounded bg-green-500 px-2 py-1 text-white"
                    onClick={handleAddInstruction}
                  >
                    Add Instruction
                  </button> */}
                </div>
                <br />
                <div className="divider"></div>
                <br />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-base">Protein: {formData.protein} g</p>
                  </div>
                  <div>
                    <p className="text-base">Fat: {formData.fat} g</p>
                  </div>
                  <div>
                    <p className="text-base">Carbs: {formData.carbs} g</p>
                  </div>
                  <div>
                    <p className="text-base">
                      Calories: {formData.calories} kcal
                    </p>
                  </div>
                </div>
                <br />
                <div>
                  <button
                    className="mt-4 rounded bg-green-500 px-4 py-2 text-white"
                    onClick={handleToggle}
                  >
                    Edit Recipe
                  </button>
                  <button
                    className="ml-4 mt-4 rounded bg-red-500 px-4 py-2 text-white"
                    onClick={handleDeleteRecipe}
                  >
                    Delete Recipe
                  </button>
                </div>
                {/* <div>
                  <h2 className="mt-8 text-3xl">Comments</h2>
                  <div className="mt-4">
                    {comments?.map((comment) => (
                      <CommentCard
                        key={comment.id}
                        comment={comment}
                        onDelete={deleteComment.mutate}
                      />
                    ))}
                    <h2 className="mt-8 text-3xl">Add a Comment!</h2>
                    <CommentEditor
                      onCreate={createComment.mutate}
                      disabled={!sessionData?.user}
                    />
                  </div>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
      <EditRecipeModal open={open}>
        <div className=" w-full max-w-2xl rounded-lg bg-black bg-opacity-50 p-8">
          <h2 className="text-3xl">Edit Recipe</h2>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="text-xl">Recipe Name:</label>
              <br></br>
              <br></br>
              <input
                type="text"
                name="mealName"
                value={formData.mealName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div className="mt-4">
              <label className="text-xl">Description:</label>
              <br></br>
              <br></br>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input"
              ></textarea>
            </div>
            <div className="mt-4">
              <p>Ingredients:</p>
              <ul>
                {formData.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <div className="flex">
                      <input
                        type="text"
                        name={`ingredients[${index}]`}
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(e, index)}
                        className="input"
                      />
                      <button
                        className="ml-2 rounded bg-red-500 px-2 py-1 text-white"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
                <button
                  className="mt-2 rounded bg-green-500 px-2 py-1 text-white"
                  onClick={handleAddIngredient}
                >
                  Add Ingredient
                </button>
              </ul>
            </div>
            <div className="mt-4">
              <p>Instructions:</p>
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex">
                  <textarea
                    name={`instructions[${index}]`}
                    value={instruction}
                    onChange={(e) => handleInstructionChange(e, index)}
                    className="input"
                  />
                  <button
                    className="ml-2 rounded bg-red-500 px-2 py-1 text-white"
                    onClick={() => handleRemoveInstruction(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="mt-2 rounded bg-green-500 px-2 py-1 text-white"
                onClick={handleAddInstruction}
              >
                Add Instruction
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xl">Protein:</label>
                <input
                  type="number"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  className="input px-2"
                />
              </div>
              <div>
                <label className="text-xl">Fat:</label>
                <input
                  type="number"
                  name="fat"
                  value={formData.fat}
                  onChange={handleChange}
                  className="input px-2"
                />
              </div>
              <div>
                <label className="text-xl">Carbs:</label>
                <input
                  type="number"
                  name="carbs"
                  value={formData.carbs}
                  onChange={handleChange}
                  className="input px-2"
                />
              </div>
              <div>
                <label className="text-xl">Calories:</label>
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  className="input px-2"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="mt-4 rounded bg-green-500 px-4 py-2 text-white"
              >
                Save Changes
              </button>
              <button
                className="ml-4 mt-4 rounded bg-red-500 px-4 py-2 text-white"
                onClick={handleToggle}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </EditRecipeModal>
    </div>
  );
}
