"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

// import { BiBookmark } from "react-icons/bi";
import { SubmitHandler } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
// import Link from "next/link";
import DescriptInputItem from "./DescriptInputItem";
import IngredientInputItem from "./IngredientInputItem";
import Footer from "@/app/components/Footer";
import { updateRecipeImage } from "../../../utils/supabaseFncUpdate";
import {
  compressImage,
  getImageUrl,
  updateImage,
  updateRecipe,
  updateSomeDescript,
  updateSomeIngredient,
} from "../../../utils/supabaseFunctionsNew";
import { RecipeSchemaType } from "../../../validations/schema";
import { useRecipeFormTop } from "../../../validations/useFormUtils";
import { useRouter } from "next/navigation";
import {
  getRecipesbyId,
  getByIngredientId,
  getByDescriptId,
} from "../../../utils/supabaseFunctionsNew";
import { TbCameraPlus } from "react-icons/tb";

const Edit = ({ params }: { params: { recipe_id: number } }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    ingredientFieldArray,
    descriptFieldArray,
  } = useRecipeFormTop();

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  useEffect(() => {
    const init = async () => {
      const recipe = await getRecipesbyId(params.recipe_id);
      const ingredients = await getByIngredientId(params.recipe_id);
      const descripts = await getByDescriptId(params.recipe_id);

      const ingData = ingredients.map((ing) => ({
        name: ing.name,
        amount: ing.amount,
      }));

      const descData = await Promise.all(
        descripts.map(async (desc, index) => ({
          text: desc.text,
          imageString: desc.image_url || "",
          imageFile: desc.image_url
            ? await urlToFile(desc.image_url, `${index}.jpg`)
            : undefined,
        })),
      );

      const recipeImageFile = recipe[0].image_url
        ? await urlToFile(recipe[0].image_url, "recipe.jpg")
        : undefined;

      // フォームの全体を初期化
      reset({
        recipe: {
          recipe_name: recipe[0].name,
          time: recipe[0].time ?? "",
          how_many: recipe[0].howmany ?? "",
          recipe_comment: recipe[0].comment ?? "",
          recipe_image: recipeImageFile, // File型は初期化しない（再アップロードが必要なので）
        },
        ingredient: ingData,
        descript: descData,
      });

      // 画像URLは state で管理（フォームとは別に）
      setSelectedImage(recipe[0].image_url ?? "");
    };

    init();
  }, [params.recipe_id, reset]);

  const router = useRouter();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file !== undefined) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
      setValue("recipe.recipe_image", file, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const onSubmit: SubmitHandler<RecipeSchemaType> = async (data) => {
    await updateRecipe(params.recipe_id, data.recipe);
    console.log("data.recipe.recipe_image", data.recipe.recipe_image);
    if (params.recipe_id !== undefined) {
      if (data.recipe.recipe_image !== undefined) {
        const imagePath = `${params.recipe_id}/recipe.jpg`;
        const image = await compressImage(data.recipe.recipe_image);
        await updateImage(image, imagePath);
        const recipeImageUrl = await getImageUrl(imagePath);
        await updateRecipeImage(params.recipe_id, recipeImageUrl);
      }
      await updateSomeDescript(params.recipe_id, data.descript);
      await updateSomeIngredient(params.recipe_id, data.ingredient);
    }

    router.replace(`/users`);
    return true;
  };

  useEffect(() => {
    return () => {
      console.log(errors);
    };
  }, [errors]);

  return (
    <div className="flex min-h-screen flex-col bg-orange-primary text-black contain-paint">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <main className="p-4">
          <p className="pt-4 text-center text-xl font-semibold text-orange-700">
            レシピを編集
          </p>
          <div className="mb-4 text-xs italic text-orange-600">
            <span className="font-bold text-red-500">*</span> は必須項目です
          </div>

          {/* 画像アップロード */}
          <section className="relative mx-auto mb-12 mt-4 flex h-56 w-9/12 flex-col items-center justify-center gap-y-4 rounded-xl bg-gray-100 shadow-lg">
            {selectedImage ? (
              <>
                <Image
                  src={selectedImage}
                  alt=""
                  className="rounded-xl object-cover"
                  fill
                />
                <button
                  type="button"
                  title="画像を削除"
                  aria-label="画像を削除"
                  className="absolute right-0 top-0 m-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-400 shadow-lg"
                  onClick={() => setSelectedImage(null)}
                >
                  <BiPlus className="rotate-45 text-2xl text-white" />
                </button>
              </>
            ) : (
              <>
                <TbCameraPlus className="text-6xl text-gray-400" />
                <p className="text-gray-400">料理の写真を選択してください</p>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleImageChange}
                  title="料理の写真を選択してください"
                  placeholder="料理の写真を選択してください"
                />
              </>
            )}
            {/* zodのエラー文 */}
            <div className="text-xs text-red-500">
              {errors.recipe?.recipe_image?.message}
            </div>
          </section>

          <section className="mb-4 space-y-1">
            <label htmlFor="recipe_name" className="mb-2 text-orange-700">
              タイトル<span className="ml-1 text-red-500">*</span>
            </label>
            <input
              {...register("recipe.recipe_name")}
              type="text"
              id="recipe_name"
              placeholder="基本のチャーハン"
              className="h-10 w-full rounded-md border border-orange-200 p-2"
              autoCapitalize="off"
              autoCorrect="off"
            />
            <div className="text-xs text-red-500">
              {errors.recipe?.recipe_name?.message}
            </div>
          </section>

          <section className="mb-3">
            <label htmlFor="recipe_comment" className="text-orange-700">
              説明
            </label>
            <textarea
              {...register("recipe.recipe_comment")}
              id="recipe_comment"
              className="mt-1 w-full rounded-md border border-orange-200 p-2"
              placeholder="忙しい日でも簡単に作れる、香ばしい風味漂う絶品チャーハンです。"
              rows={3}
              autoCapitalize="off"
              autoCorrect="off"
            ></textarea>
            {/* zodのエラー文 */}
            <div className="text-xs text-red-500">
              {errors.recipe?.recipe_comment?.message}
            </div>
          </section>

          <div className="mb-6 flex gap-2">
            <section className="flex-1 space-y-1">
              <label htmlFor="time" className="text-orange-700">
                調理時間
              </label>
              <input
                {...register("recipe.time")}
                type="text"
                id="time"
                placeholder="約10分"
                className="h-10 w-full rounded-md border border-orange-200 p-2"
                autoCapitalize="off"
                autoCorrect="off"
              />
              {/* zodのエラー文 */}
              <div className="text-xs text-red-500">
                {errors.recipe?.time?.message}
              </div>
            </section>

            <section className="flex-1 space-y-1">
              <label htmlFor="how_many" className="text-orange-700">
                人数
              </label>
              <input
                {...register("recipe.how_many")}
                id="how_many"
                placeholder="2人分"
                className="h-10 w-full rounded-md border border-orange-200 p-2"
                autoCapitalize="off"
                autoCorrect="off"
              />
              {/* zodのエラー文 */}
              <div className="text-xs text-red-500">
                {errors.recipe?.how_many?.message}
              </div>
            </section>
          </div>

          <section className="mb-6">
            <p className="border-b border-orange-600 text-lg font-semibold text-orange-600">
              材料<span className="ml-1 text-red-500">*</span>
            </p>
            <IngredientInputItem
              errors={errors}
              setValue={setValue}
              register={register}
              fieldArray={ingredientFieldArray}
            />
          </section>

          <section>
            <p className="border-b border-orange-600 text-lg font-semibold text-orange-600">
              作り方
            </p>
            <DescriptInputItem
              errors={errors}
              register={register}
              setValue={setValue}
              fieldArray={descriptFieldArray}
            />
          </section>

          <button
            type="submit"
            className="mx-auto my-8 flex w-64 justify-center rounded-xl bg-orange-400 py-3 text-lg font-semibold text-white shadow-md hover:bg-orange-400"
          >
            レシピを更新する
          </button>
        </main>
        <Footer pathName="" />
      </form>
    </div>
  );
};

export default Edit;
