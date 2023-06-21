import { useState, type FormEvent, type ChangeEvent } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";
import Link from "next/link";
type Recipe = RouterOutputs["recipe"]["getAll"][0];

export default function MyRecipesPage() {
  const { data: sessionData } = useSession();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
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
          Total Calories: {selectedRecipe?.calories}g
        </div>
        <div>
          <button
            className="btn-warning btn-xs btn px-5"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            onClick={handleDeleteRecipe}
          >
            Delete
          </button>
        </div>
        {comments?.map((comment) => (
          <div key={comment.id} className="mt-5">
            <CommentCard
              comment={comment}
              onDelete={() => void deleteComment.mutate({ id: comment.id })}
            />
          </div>
        ))}
      </div>
      <CommentEditor
        onSave={({ title, content }) => {
          void createComment.mutate({
            title,
            content,
            recipeId: selectedRecipe?.id ?? "",
          });
        }}
      />
      <Link href="/createRecipe">Add a Recipe!</Link>
    </div>
  );
}
