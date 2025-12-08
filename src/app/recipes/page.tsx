import { notFound } from "next/navigation";
import { getDetailRecipebyId } from "@/app/utils/supabaseFunctionsNew";
import RecipeDetailClient from "./getDetailRecipe";

export default async function RecipeIdPage({
  searchParams,
}: {
  searchParams: { recipeId: string; from: "/" }; //常にホームから来てることになってる？
}) {
  let recipeData;
  try {
    recipeData = await getDetailRecipebyId(searchParams.recipeId);
  } catch (error: any) {
    if (error.code === "404") {
      notFound();
    }
    throw error;
  }

  return (
    <RecipeDetailClient
      recipe={recipeData}
      recipeId={searchParams.recipeId}
      from={searchParams.from}
    />
  );
}
