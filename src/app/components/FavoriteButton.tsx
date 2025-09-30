"use client";

import { RecipeOldType } from "@/app/types";
import {
  addFavorites,
  isFavorited,
  deleteFavorites,
} from "../utils/supabaseFunctionsNew";
import { isLoggedIn } from "../utils/supabaseLogin";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { FiHeart } from "react-icons/fi";
import { useRouter } from "next/navigation";
// import useGetFavorite from "../favorites/useGetFavorite";
import { useSWRConfig } from "swr";
import { cache } from "swr/_internal";
import { free_favoriteFetchedId } from "../utils/supabase/recipe";

type FavoriteButtonProps = {
  recipe: RecipeOldType;
};

const FavoriteButton = ({ recipe }: FavoriteButtonProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const recipe_id: number = recipe.id; // パラメータのrecipe_idを取得
  const router = useRouter();
  const { mutate } = useSWRConfig();

  // 既にお気に入りにしているか確認
  useEffect(() => {
    const checkFavorite = async () => {
      const isFavo = await isFavorited(recipe_id);
      setIsFavorite(isFavo);
      setLoading(false);
    };
    checkFavorite();
  }, [recipe_id]);

  // クリックイベント: お気に入りの状態を切り替え、localStorageを更新
  const handleFavoriteClick = async () => {
    if (isFavorite) {
      // お気に入りから削除
      await deleteFavorites(recipe_id);
    } else {
      // お気に入りに追加
      if (await isLoggedIn()) {
        await addFavorites(recipe_id);
      } else {
        router.push(
          `/login?cancelRedirect=true&callbackUrl=${encodeURIComponent(`/${recipe_id}`)}`,
        );
      }
    }

    for (const key of cache.keys()) {
      if (typeof key === "string" && key.startsWith("$inf$favorites")) {
        await mutate(key, undefined, { revalidate: true });
      }
    }
    free_favoriteFetchedId();

    // isFavoriteの状態を反転
    setIsFavorite(await isFavorited(recipe_id));
  };

  if (loading) {
    return null;
  }

  return (
    <div className="space-y-1 text-center" onClick={handleFavoriteClick}>
      <FiHeart
        fill={isFavorite ? "#fa003f" : "#FFFBF4"}
        stroke={isFavorite ? "#fa003f" : "#6b7280"}
        className="mx-auto size-9"
      />
      <p
        className={clsx(
          "break-keep text-xs font-light",
          isFavorite ? "text-[#fa003f]" : "text-gray-500",
        )}
      >
        お気に入り
      </p>
    </div>
  );
};

export default FavoriteButton;
