import { Descript } from "@/app/types";
import Image from "next/image";
import React from "react";
import { FiCameraOff } from "react-icons/fi";

type stepType = {
  descript: Descript;
  pageIndex: number;
};

//丸を描画する length=丸の数 page=塗りつぶし判定用ページ数
const DispStepIndex = ({ length, page }: { length: number; page: number }) => {
  return (
    <div className="text-black">
      <span
        className={`m-2 rounded-full bg-orange-400 p-1 text-white ${length <= 10 ? "px-2" : "px-1"}`}
      >
        {page + 1}
      </span>
      /{length}
    </div>
  );
};

export const DisplayStep = ({ descript, pageIndex }: stepType) => {
  return (
    <div className="relative">
      <div className="flex content-center justify-center">
        {descript?.image_url ? (
          <div className="relative h-[42vh] w-[100vw] image-mid:h-[25vh] image-sml:h-[20vh]">
            <Image
              src={descript.image_url}
              alt={descript.text ?? ""} //TODO 説明書きがない場合なんてあってたまるかと
              fill
              className="object-contain shadow-lg"
            />
          </div>
        ) : (
          <div className="h-[42vh] w-[100vw] content-center bg-gray-100 shadow-lg image-mid:h-[25vh] image-sml:h-[20vh]">
            <div className="w-full">
              <FiCameraOff size={40} stroke="#737373" className="mx-auto" />
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 ml-4 mt-6 image-mid:mb-2 image-mid:mt-5 image-sml:mb-0 image-sml:mt-2">
        <DispStepIndex length={descript?.index ?? 0} page={pageIndex} />{" "}
        {/* TODO レシピの長さが設定されない場合とは？ */}
      </div>
      <div
        id="desc"
        className="mx-5 break-words text-left font-mono text-2xl font-black text-black"
      >
        {descript?.text ?? "読み込み中・・・"}
      </div>
    </div>
  );
};
