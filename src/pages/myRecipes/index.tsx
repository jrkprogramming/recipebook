import { useState, type FormEvent, type ChangeEvent } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import { CommentEditor } from "~/components/CommentEditor";
import { CommentCard } from "~/components/CommentCard";
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
    </div>
  );
}
