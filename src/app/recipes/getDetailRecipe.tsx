"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiCameraOff } from "react-icons/fi";
import Footer from "@/app/components/Footer";
import { Descript, DetailRecipe, Ingredient } from "@/app/types";
import Cook from "./cook/Cook";
import { WiTime4 } from "react-icons/wi";
import FavoriteButton from "../components/FavoriteButton";
import IngredientItem from "../components/IngredientItem";
import DescriptItem from "../components/DescriptItem";
import { PiMicrophoneBold } from "react-icons/pi";
import LoadingComponent from "../components/LoadingDataFetch";
import { cookRecipeTogether } from "../utils/useStore";
import RecipeHeaderBase from "../components/RecipeHeaderBase";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function RecipeDetailClient({
  recipe,
  recipeId,
  from,
}: {
  recipe: DetailRecipe;
  recipeId: string;
  from: string;
}) {
  const [inCook, setInCook] = useState(false);
  const {
    // selectingTogether,
    // togetherRecipeId,
    setSelectingTogether,
    addTogetherRecipeId,
  } = cookRecipeTogether();
  const list = recipe;
  const router = useRouter();

  const backHereArrow = (
    <button className="absolute left-5 text-3xl" onClick={() => router.back()}>
      <IoIosArrowBack fill={"black"} />
    </button>
  );

  if (!list) return <LoadingComponent />;

  return (
    <>
      {!inCook ? (
        // <div className="contain-paint [&_header]:bg-orange-primary">こういうbgの指定の仕方もある
        <div className="contain-paint [&_header]:bg-orange-primary">
          <RecipeHeaderBase
            title={list.name}
            bgColor="orange-primary"
            backPageArrow={backHereArrow}
          />

          <main className="min-h-[calc(100vh-150px)] pb-10">
            <figure className="relative flex aspect-[3/2] items-center justify-center border-b border-gray-400 bg-gray-100 shadow-md">
              {/* nullのみを判定しているので、url先の画像が見つからない場合に対処できない */}
              {list.image_url ? (
                <Image
                  src={list.image_url}
                  alt={list.name}
                  sizes="100vw"
                  fill
                  className="object-cover"
                  onError={() => console.error("Image failed to load")}
                />
              ) : (
                <FiCameraOff size={40} stroke="#737373" />
              )}
            </figure>

            <div className="m-4 pb-2">
              <div className="flex justify-between gap-2">
                <Link href={`/users/mypage/${list["profiles"].id}`}>
                  <p className="text-2xl font-semibold text-orange-700">
                    {list.name}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <Image
                      src={list.profiles.avatar_url}
                      alt={list.profiles.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={() => console.error("Image failed to load")}
                    />

                    <p>{list.profiles.name}</p>
                  </div>
                </Link>

                <FavoriteButton
                  recipe={{
                    id: list.id,
                    name: list.name,
                    image_url: list.image_url,
                    time: list.time,
                    comment: list.comment,
                    howmany: list.howmany,
                  }}
                />
              </div>

              {list.time && (
                <div className="max-w mt-3 inline-flex h-auto min-h-6 items-center gap-1 rounded-full bg-orange-100 px-2">
                  <WiTime4 className="size-4 shrink-0 text-orange-500" />

                  <p className="break-words text-xs text-orange-700">
                    {list.time}
                  </p>
                </div>
              )}

              {list.comment && (
                <p className="pt-3 text-sm text-gray-600">{list.comment}</p>
              )}
            </div>

            <div className="items-start text-black lg:flex">
              <section className="mx-4 flex-1 pb-7 lg:max-w-md">
                <div className="border-b border-orange-600 pb-1 text-lg font-semibold text-orange-600">
                  {list.howmany ? <p>材料（{list.howmany}）</p> : <p>材料</p>}
                </div>

                <div className="mt-4 divide-y divide-dashed divide-neutral-400 rounded-xl border border-orange-200 bg-orange-secondary">
                  {list.ingredients.map((ingredient: Ingredient) => (
                    <IngredientItem
                      key={ingredient.id}
                      id={ingredient.id}
                      name={ingredient.name}
                      amount={ingredient.amount}
                      recipe_id={ingredient.recipe_id}
                    />
                  ))}
                </div>
              </section>

              <section className="mx-4 flex-1">
                <p className="mb-4 border-b border-orange-600 pb-1 text-lg font-semibold text-orange-600">
                  作り方
                </p>

                <div className="space-y-3">
                  {list.descripts.map((descript: Descript, index) => (
                    <DescriptItem
                      key={descript.id}
                      id={index + 1}
                      text={descript.text}
                      image_url={descript.image_url}
                      recipe_id={descript.recipe_id}
                    />
                  ))}
                </div>
              </section>
            </div>

            <button
              onClick={() => setInCook(true)}
              className="mx-auto mt-8 flex w-64 items-center justify-center gap-1 rounded-xl bg-orange-400 py-3 font-semibold text-white shadow-md hover:bg-orange-500"
            >
              <PiMicrophoneBold className="size-[18px]" />
              調理を開始する
            </button>

            <Link
              className="mx-auto mt-8 flex w-64 items-center justify-center gap-1 rounded-xl bg-blue-500 py-3 font-semibold text-white shadow-md hover:bg-blue-600"
              onClick={() => {
                setSelectingTogether(true);
                addTogetherRecipeId(recipeId);
              }}
              href={"/"}
            >
              TODO選択したレシピを解放すること
              {/* 他の料理と一緒に調理する */}
            </Link>
          </main>

          <Footer pathName="/" />
        </div>
      ) : (
        <Cook recipeId={recipeId} from={from} setInCook={setInCook} />
      )}
    </>
  );
}
