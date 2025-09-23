import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Descript, DetailRecipe, Ingredient, Recipe } from "../types";
import { supabase } from "../utils/supabase";
import { arrayShuffle } from "./supabaseFncUpdate";
import {
  DescriptSchemaType,
  IngredientSchemaType,
  RecipeObjectSchemaType,
} from "../validations/schema";
import { Dispatch, SetStateAction } from "react";
import imageCompression from "browser-image-compression";


// 全レシピ取得
export const getAllRecipes = async () => {
  const recipes = await supabase.from("recipes").select("*");
  if (recipes.error) {
    console.error("すべてのレシピ取得中にエラー", recipes.error);
  }
  // 強制的にRecipe[]として認識させる
  return recipes.data as Recipe[];
};
export const getAllUserRecipes = async () => {
  const recipes = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", await getCurrentUserID());
  if (recipes.error) {
    console.error("ユーザーのレシピ取得中にエラー", recipes.error);
  }
  return recipes.data as Recipe[];
};
// // 全レシピランダム取得
export const getAllRandomRecipes = async () => {
  const recipes = await supabase.from("recipes").select("*");
  if (recipes.data !== null) {
    return arrayShuffle(recipes.data) as Recipe[];
  }
  if (recipes.error) {
    console.error("supabaseエラー", recipes.error);
  }
  // 強制的にRecipe[]として認識させる
  return [] as Recipe[];
};
const PAGE_SIZE = 10;
export const getPageRecipes = async (
  pageNumber: number,
  pageRecipe: Recipe[],
  setPageRecipe: Dispatch<SetStateAction<Recipe[]>>,
  setAllRecipesRetrieved: Dispatch<SetStateAction<boolean>>,
) => {
  const recipes = await supabase
    .from("recipes")
    .select("*")
    .range((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE - 1);
  // if (recipes.data !== null) {
  //     recipes.data = arrayShuffle(recipes.data) as Recipe[];
  // }
  if (recipes.error) {
    console.error("supabaseエラー", recipes.error);
  } else {
    if (recipes.data.length !== PAGE_SIZE) {
      // もしレシピが全部取れていたならtrueをセット
      setAllRecipesRetrieved(true);
    }
  }
  setPageRecipe([...pageRecipe, ...(recipes.data as Recipe[])] as Recipe[]);
};

// レシピのidより1つのレシピ取得
export const getRecipesbyId = async (id: string) => {
  const recipe = await supabase.from("recipes").select("*").eq("id", id);
  if (recipe.error) {
    console.error("supabaseエラー", recipe.error);
  }
  // 強制的にRecipe[]として認識させる
  return recipe.data as Recipe[];
};
// レシピ作成
export const addRecipe = async (recipe: RecipeObjectSchemaType) => {
  const { data, error } = await supabase
    .from("recipes")
    .insert({
      name: recipe.recipe_name,
      image_url: recipe?.recipe_image,
      howmany: recipe?.how_many,
      time: recipe?.time,
      comment: recipe?.recipe_comment,
      user_id: await getCurrentUserID(),
    })
    .select(); // 挿入されたデータを取得するために select() を使用

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    // 挿入されたデータのIDを取得
    return data[0].id as number;
  }
};
// レシピ更新
export const updateRecipe = async (
  id: number,
  recipe: RecipeObjectSchemaType,
) => {
  const { error } = await supabase
    .from("recipes")
    .update({
      name: recipe.recipe_name,
      image_url: recipe?.recipe_image,
      howmany: recipe?.how_many,
      time: recipe?.time,
      comment: recipe?.recipe_comment,
    })
    .eq("id", id);

  if (error) {
    console.error("Error inserting data:", error);
  }
};
// レシピ削除
export const deleteRecipe = async (id: number) => {
  await supabase.from("recipes").delete().eq("id", id);
};
// レシピのidより材料取得
export const getByIngredientId = async (recipe_id: string) => {
  const ingredients: PostgrestSingleResponse<Ingredient[]> = await supabase
    .from("ingredients")
    .select("*")
    .eq("recipe_id", recipe_id);
  if (ingredients.data !== null) {
    ingredients.data.sort((firstItem: Ingredient, secondItem: Ingredient) => {
      if (firstItem.index !== undefined && secondItem.index !== undefined) {
        return firstItem.index - secondItem.index;
      } else {
        return -1;
      }
    });
  }
  if (ingredients.error) {
    console.error("supabaseエラー", ingredients.error);
  }
  return ingredients.data as Ingredient[];
};
// 材料作成
export const addIngredient = async (
  recipe_id: number,
  index: number,
  name: string,
  amount: string,
) => {
  const { error } = await supabase
    .from("ingredients")
    .insert({
      recipe_id: recipe_id,
      index: index,
      name: name,
      amount: amount,
    })
    .select(); // 挿入されたデータを取得するために select() を使用
  if (error) {
    console.error("supabaseエラー", error);
  }
};
// 材料作成
export const upsertIngredient = async (
  recipe_id: number,
  index: number,
  name: string,
  amount: string,
) => {
  const { error } = await supabase
    .from("ingredients")
    .upsert(
      {
        recipe_id: recipe_id,
        index: index,
        name: name,
        amount: amount,
      },
      {
        onConflict: "recipe_id,index",
      },
    )
    .select(); // 挿入されたデータを取得するために select() を使用
  if (error) {
    console.error("supabaseエラー", error);
  }
};
// 複数個の材料作成
export const addSomeIngredient = async (
  recipe_id: number,
  inputIngredients: IngredientSchemaType,
) => {
  inputIngredients.forEach((e, index) => {
    addIngredient(recipe_id, index, e.name, e.amount);
  });
};
export const updateSomeIngredient = async (
  recipe_id: number,
  inputIngredients: IngredientSchemaType,
) => {
  inputIngredients.forEach((e, index) => {
    upsertIngredient(recipe_id, index, e.name, e.amount);
  });
};
export const deleteIngredient = async (id: number) => {
  await supabase.from("ingredients").delete().eq("id", id);
};

// レシピのidより作り方取得
export const getByDescriptId = async (recipe_id: string) => {
  const descripts: PostgrestSingleResponse<Descript[]> = await supabase
    .from("descripts")
    .select("*")
    .eq("recipe_id", recipe_id);
  if (descripts.data !== null) {
    descripts.data.sort((firstItem: Descript, secondItem: Descript) => {
      if (firstItem.index !== undefined && secondItem.index !== undefined) {
        return firstItem.index - secondItem.index;
      } else {
        return -1;
      }
    });
  }
  if (descripts.error) {
    console.error("supabaseエラー", descripts.error);
  }
  return descripts.data as Descript[];
};
// 材料作成
export const addDescript = async (
  recipe_id: number,
  index: number,
  image_url?: string,
  text?: string,
) => {
  await supabase.from("descripts").insert({
    recipe_id: recipe_id,
    index: index,
    image_url: image_url,
    text: text,
  });
};
// 材料更新
export const upsertDescript = async (
  recipe_id: number,
  index: number,
  image_url?: string,
  text?: string,
) => {
  await supabase.from("descripts").upsert(
    {
      recipe_id: recipe_id,
      index: index,
      image_url: image_url,
      text: text,
    },
    {
      onConflict: "recipe_id,index",
    },
  );
};
// 複数個の作り方を作成
export const addSomeDescript = async (
  recipe_id: number,
  descripts: DescriptSchemaType,
) => {
  descripts.map(async (e, index) => {
    if (e.imageFile !== undefined) {
      const descriptImagePath = `${recipe_id}/Descripts/${index}.jpg`;
      const image = await compressImage(e.imageFile);
      await uploadImage(image, descriptImagePath);
      const image_url = await getImageUrl(descriptImagePath);
      console.log("image_url", image_url);
      // await addDescript(recipe_id,index, image_url, e.text);
      await addDescript(recipe_id, index, image_url, e.text);
    } else if (e.text !== "") {
      await addDescript(recipe_id, index, undefined, e.text);
    }
  });
};
export const deleteAllDescripts = async (recipe_id: number) => {
  const { error } = await supabase
    .from("descripts")
    .delete()
    .eq("recipe_id", recipe_id);
  if (error) {
    console.error("supabaseエラー", error.message);
  }
};
export const deleteAllDescriptImages = async (recipe_id: number) => {
  // レシピの説明画像を削除
  const { data: files, error: listError } = await supabase.storage
    .from("images")
    .list(`${recipe_id}/Descripts`, { limit: 1000 });
  if (listError) {
    console.error("画像リスト取得中にエラー", listError);
    return;
  }
  if (!files || files.length === 0) {
    console.log("削除対象のフォルダは空です。");
    return;
  }
};
// 複数個の作り方を更新
export const updateSomeDescript = async (
  recipe_id: number,
  descripts: DescriptSchemaType,
) => {
  await deleteAllDescriptImages(recipe_id);
  await deleteAllDescripts(recipe_id);
  for (const [index, e] of descripts.entries()) {
    if (e.imageFile !== undefined) {
      const descriptImagePath = `${recipe_id}/Descripts/${index}.jpg`;
      const image = await compressImage(e.imageFile);
      await updateImage(image, descriptImagePath);
      const image_url = await getImageUrl(descriptImagePath);
      console.log("image_url", image_url);
      await upsertDescript(recipe_id, index, image_url, e.text);
    } else if (e.text !== "") {
      await upsertDescript(recipe_id, index, undefined, e.text);
    }
  }
};
export const deleteDescripts = async (id: number) => {
  await supabase.from("descripts").delete().eq("id", id);
};
// レシピ画像アップロード用
export const uploadImage = async (
  file: File,
  filePath: string,
  // recipe_id: number
) => {
  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file);
  if (error) {
    console.error("supabaseエラー", error);
  }
};
// レシピ画像更新用
export const updateImage = async (
  file: File,
  filePath: string,
  // recipe_id: number
) => {
  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, {
      upsert: true,
    });
  if (error) {
    console.error("supabaseエラー", error);
  }
};
// 画像圧縮関数
export const compressImage = async (file: File) => {
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    exifOrientation: 0.9, // 圧縮品質
    fileType: "image/jpeg",
  });
  return compressedFile;
};
// id指定で画像の削除
export const deleteImage = async (id: number) => {
  await deleteImageByPath(`${id}/`); // レシピの画像
  await deleteImageByPath(`${id}/Descripts/`); // 説明の画像
};

// path指定で画像の削除
export const deleteImageByPath = async (folderPath: string) => {
  // フォルダ内のファイル一覧を取得
  const { data: files, error: listError } = await supabase.storage
    .from("images")
    .list(folderPath, { limit: 1000 });
  console.log(files);
  if (listError) {
    console.error("画像リスト取得中にエラー", listError);
    return;
  }

  if (!files || files.length === 0) {
    console.log("削除対象のフォルダは空です。");
    return;
  }

  // 削除対象のファイルパスを作成
  const filePaths = files.map((file) => `${folderPath}${file.name}`);

  // ファイルの削除
  const { error: deleteError } = await supabase.storage
    .from("images")
    .remove(filePaths);

  if (deleteError) {
    console.error("画像削除中にエラー", deleteError);
  } else {
    console.log("画像を削除しました:", filePaths);
  }
};

// 画像名より画像のurl取得
export const getImageUrl = async (filePath: string) => {
  const { data } = supabase.storage.from("images").getPublicUrl(filePath);
  if (data === null) {
    console.error("画像が見つかりません");
    return "";
  }
  const imageUrl = data.publicUrl;
  // supabase側のキャッシュによる更新の遅延を防ぐため、タイムスタンプをURLに付加する
  const timeStamp = Date.now();
  return imageUrl + "?v=" + timeStamp;
};
// レシピのidより1つのレシピ詳細取得
export const getDetailRecipebyId = async (id: string) => {
  console.log("recipeId",id)
  const detailRecipe: PostgrestSingleResponse<DetailRecipe> = await supabase
    .from("recipes")
    .select("*, descripts(*), ingredients(*), profiles(name, avatar_url,id)")
    .eq("id", id)
    .single();
  if (detailRecipe.error) {
    const catchError:any = new Error("レシピが見つかりません");
    switch(detailRecipe.error.code){
      case "PGRST116":
        catchError.name = "NotFound";
        catchError.code = "404";
        catchError.info = detailRecipe.error
        throw catchError;
        break;
      default:
        catchError.name = "SupabaseError";
        catchError.code = "500";
        catchError.info = detailRecipe.error
        throw catchError;
    }
  }
  console.log(detailRecipe.data);
  if (detailRecipe.data?.descripts !== undefined) {
    detailRecipe.data?.descripts.sort(
      (firstItem: Descript, secondItem: Descript) => {
        // 数値の比較で安全なデフォルト値を設定
        const firstIndex = Number(firstItem.index ?? Number.MAX_SAFE_INTEGER);
        const secondIndex = Number(secondItem.index ?? Number.MAX_SAFE_INTEGER);

        console.log(firstIndex - secondIndex);
        return firstIndex - secondIndex;
      },
    );
  }
  console.log("sortDes", detailRecipe.data?.descripts);
  // sort
  if (detailRecipe.data?.ingredients !== undefined) {
    detailRecipe.data?.ingredients.sort(
      (firstItem: Ingredient, secondItem: Ingredient) => {
        const firstIndex = Number(firstItem.index ?? Number.MAX_SAFE_INTEGER);
        const secondIndex = Number(secondItem.index ?? Number.MAX_SAFE_INTEGER);
        console.log(firstIndex - secondIndex);
        return firstIndex - secondIndex;
      },
    );
    console.log("sortING", detailRecipe.data?.ingredients);
  }
  return detailRecipe.data as DetailRecipe;
};
// 現在のログインセッションのユーザーのIDを取得
export const getCurrentUserID = async () => {
  const userData = await supabase.auth.getUser();
  if (userData.error) {
    console.error("ユーザーID取得中にエラー", userData.error);
  }
  return userData.data.user?.id;
};
// ユーザーIDからユーザー名とアイコンを取得
export const getUserData = async (user_id: string) => {
  const userData = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user_id)
    .single();
  if (userData.error) {
    console.error("ユーザーデータ取得中にエラー", userData.error);
  }
  return {
    name: userData.data?.["name"],
    avatar_url: userData.data?.["avatar_url"],
  };
};
// favorites追加関数
export const addFavorites = async (recipe_id: number) => {
  const res = await supabase.from("favorites").insert({
    user_id: await getCurrentUserID(),
    recipe_id: recipe_id,
  });
  if (res.error) {
    console.error("favorites追加中にエラー", res.error);
  }
};
// favorites取得関数
export const getFavoriteRecipes = async () => {
  const res = (await supabase
    .from("favorites")
    .select("recipes(*)")
    .eq("user_id", await getCurrentUserID())) as PostgrestSingleResponse<
    { recipes: Recipe }[]
  >;
  if (res.error) {
    console.error("favorites取得中にエラー", res.error);
  }
  console.log(res.data);
  const favoriteRecipes: Recipe[] = [];
  res.data?.forEach((favo) => {
    console.log(favo.recipes);
    favoriteRecipes.push(favo.recipes);
  });
  return favoriteRecipes;
};

// favorites登録判定関数
export const isFavorited = async (recipe_id: number) => {
  const res = await supabase
    .from("favorites")
    .select("recipe_id")
    .eq("recipe_id", recipe_id)
    .limit(1);
  if (res.error) {
    console.error("favorites登録判定中にエラー", res.error);
  }
  return res.data !== null && res.data.length > 0;
};
// favorites削除関数
export const deleteFavorites = async (recipe_id: number) => {
  await supabase.from("favorites").delete().eq("recipe_id", recipe_id);
};

export const PAGE_SIZE_SWR = 10;
//無限スクロール用のfetcher関数
//addRecipeCords.tsxのfetcher関数に渡す
// export const Homefetcher_SWR = async (key: string): Promise<Recipe[]> => {
//   // console.log(`fetcher key: ${key}`);

//   //keyは`${kw}-${materialKey}-${pageIndex}`の形式
//   //kwは検索キーワード
//   //materialKeyは表示管理用の一意のキー:指定することで、複数のキーでdataを保存可能．fetther関数で使うことはない
//   //pageIndexはページ番号：supabaseのrange関数で使う
//   const [, kw, pageIndexStr] = key.split("-");
//   const pageIndex = Number(pageIndexStr);

//   // console.log("fetcher kw", kw);
//   // console.log("fetcher kwType", typeof kw);
//   if (kw === "") {
//     const { data, error } = await supabase
//       .from("recipes")
//       .select("*")
//       .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

//     if (error) throw error;
//     return data ?? [];
//   } else {
//     const { data, error } = await supabase
//       .from("recipes")
//       .select()
//       .ilike("name", `%${kw}%`)
//       .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);
//     //簡単な部分一致検索(参考:https://zenn.dev/417/scraps/b494b081c2c33b)
//     if (error) console.error(error);
//     return data ?? ([] as Recipe[]);
//   }
// };

// export const getRecipes_tst = async (key: string) => {
//   const [, pageIndexStr] = key.split("-");
//   const pageIndex = Number(pageIndexStr);
//   const { data, error } = await supabase
//     .from("recipes")
//     .select("*")
//     .range(pageIndex * PAGE_SIZE_SWR, (pageIndex + 1) * PAGE_SIZE_SWR - 1);
//   if (error) {
//     console.error("supabaseエラー", error);
//   }
//   // 強制的にRecipe[]として認識させる
//   return data ?? ([] as Recipe[]);
// };

// export const searchFetcher_tst = async (key: string) => {
//   const [, kw, pageIndexStr] = key.split("-");
//   const pageIndex = Number(pageIndexStr);
//   const { data, error } = await supabase
//     .from("recipes")
//     .select("*")
//     .ilike("name", `%${kw}%`)
//     .range(pageIndex * PAGE_SIZE_SWR, (pageIndex + 1) * PAGE_SIZE_SWR - 1);

//   if (error) {
//     console.error("supabaseエラー", error);
//   }
//   return data ?? ([] as Recipe[]);
// };

export const favoritesFetcher = async (key: string): Promise<Recipe[]> => {
  console.log(`fetcher key: ${key}`);
  const pageIndexStr = key.split("-").pop();
  const pageIndex = Number(pageIndexStr);
  const res = (await supabase
    .from("favorites")
    .select("recipes(*)")
    .range(pageIndex * PAGE_SIZE_SWR, (pageIndex + 1) * PAGE_SIZE_SWR - 1)
    .eq("user_id", await getCurrentUserID())) as PostgrestSingleResponse<
    { recipes: Recipe }[]
  >;

  if (res.error) {
    console.error("favorites取得中にエラー", res.error);
  }
  if (res.data?.length === 0) {
    console.log("お気に入りのレシピはありません");
  }
  return res.data?.map((favo) => favo.recipes) ?? ([] as Recipe[]);
};

export const searchfavoritesFetcher = async (
  key: string,
): Promise<Recipe[]> => {
  const [, kw, pageIndexStr] = key.split("-");
  const pageIndex = Number(pageIndexStr);
  const res = (await supabase
    .from("favorites")
    .select("recipes(*)")
    .range(pageIndex * PAGE_SIZE_SWR, (pageIndex + 1) * PAGE_SIZE_SWR - 1)
    .eq("user_id", await getCurrentUserID())
    .ilike("recipes.name", `%${kw}%`)) as PostgrestSingleResponse<
    { recipes: Recipe }[]
  >;
  if (res.error) {
    console.error("favorites取得中にエラー", res.error);
  }
  console.log(res.data);
  const favoriteRecipes: Recipe[] = [];
  res.data?.forEach((favo) => {
    console.log(favo.recipes);
    favoriteRecipes.push(favo.recipes);
  });
  return favoriteRecipes;
};

// recipe, descripts, ingredientsをまとめて削除する関数
export const deleteRecipeDatas = async (recipe_id: number) => {
  await supabase.from("descripts").delete().eq("recipe_id", recipe_id);
  await supabase.from("ingredients").delete().eq("recipe_id", recipe_id);
  await deleteFavorites(recipe_id);
  await deleteRecipe(recipe_id);
  await deleteImage(recipe_id);
};
