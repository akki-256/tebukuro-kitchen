"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SubmitHandler } from "react-hook-form";
import { BiPlus } from "react-icons/bi";
import { TbCameraPlus } from "react-icons/tb";

import DescriptInputItem from "@/app/components/registration/DescriptInputItem";
import IngredientInputItem from "@/app/components/registration/IngredientInputItem";
import Footer from "@/app/components/Footer";
import { updateRecipeImage } from "@/app/utils/supabaseFncUpdate";
import {
  addRecipe,
  addSomeDescript,
  addSomeIngredient,
  compressImage,
  getImageUrl,
  uploadImage,
} from "@/app/utils/supabaseFunctionsNew";
import { RecipeSchemaType } from "@/app/validations/schema";
import { useRecipeFormTop } from "@/app/validations/useFormUtils";

export default function Registration() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    ingredientFieldArray,
    descriptFieldArray,
  } = useRecipeFormTop();

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
    setLoading(true);
    const recipe_id = await addRecipe(data.recipe);

    if (recipe_id) {
      if (data.recipe.recipe_image) {
        const imagePath = `${recipe_id}/recipe.jpg`;
        const image = await compressImage(data.recipe.recipe_image); // 画像を圧縮

        await uploadImage(image, imagePath);
        const recipeImageUrl = await getImageUrl(imagePath);
        await updateRecipeImage(recipe_id, recipeImageUrl);
      }

      await addSomeDescript(recipe_id, data.descript);
      await addSomeIngredient(recipe_id, data.ingredient);
    }

    // window.alert("レシピが登録できました！");
    router.replace("/");
  };

  if (loading) {
    return <div>ロード中です</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-orange-primary text-black contain-paint">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <main className="p-4">
          <p className="pt-4 text-center text-xl font-semibold text-orange-700">
            レシピを登録
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
            レシピを登録する
          </button>
        </main>
        <Footer pathName="/registration" />
      </form>
    </div>
  );
}
