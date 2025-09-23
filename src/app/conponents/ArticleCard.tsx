import Image from "next/image";
import Link from "next/link";

import { FiCameraOff } from "react-icons/fi";

import { Recipe } from "@/app/types";

type ArticleCardProps = {
  recipe: Recipe;
  from?: string;
};

const ArticleCard = ({ recipe, from }: ArticleCardProps) => {
  return (
    <Link
      href={{
        pathname: "/recipes",
        query: { recipeId: recipe.id, from: from },
      }}
      className="block overflow-hidden rounded-xl border border-orange-200"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-gray-100">
        {recipe.image_url ? (
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover"
            onError={() => console.error("Image failed to load")}
          />
        ) : (
          <FiCameraOff size={30} stroke="#737373" />
        )}
      </div>
      <div className="flex min-h-14 flex-col justify-center bg-white px-2">
        <p
          className="truncate text-sm font-semibold text-orange-700"
          title={recipe.name}
        >
          {recipe.name}
        </p>
        <p className="truncate text-xs text-gray-500">{recipe.user_name}</p>
      </div>
    </Link>
  );
};

export default ArticleCard;
