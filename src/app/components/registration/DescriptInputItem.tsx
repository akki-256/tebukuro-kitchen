"use client";

import Image from "next/image";
import {
  FieldErrors,
  UseFormRegister,
  UseFieldArrayReturn,
  UseFormSetValue,
} from "react-hook-form";
import { BiPlus, BiTrash } from "react-icons/bi";
import { TbCameraPlus } from "react-icons/tb";

import { RecipeSchemaType } from "@/app/validations/schema";
import { inputDescript } from "@/app/types";
import { useEffect } from "react";

interface DescriptInputItemProps {
  errors: FieldErrors<RecipeSchemaType>;
  register: UseFormRegister<RecipeSchemaType>;
  fieldArray: UseFieldArrayReturn<RecipeSchemaType, "descript", "id">;
  setValue: UseFormSetValue<RecipeSchemaType>;
  initialData?: inputDescript[]; // ← ここが追加ポイント
}

const DescriptInputItem = ({
  errors,
  register,
  fieldArray,
  initialData,
}: DescriptInputItemProps) => {
  const maxInputs = 6;
  const { fields, append, remove, update } = fieldArray;

  // 初期データを1回だけフィールドに追加
  useEffect(() => {
    if (initialData && initialData.length > 0 && fields.length === 0) {
      initialData.forEach((item) => {
        append({
          text: item.text || "",
          imageFile: undefined,
          imageString: item.image || "",
        });
      });
    }
  }, [initialData, fields, append]);

  const addInput = () => {
    if (fields.length < maxInputs) {
      append({ text: "", imageString: "", imageFile: undefined });
    }
  };

  const handleImageUpload =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
        update(index, {
          ...fields[index],
          imageString: reader.result as string,
          imageFile: file,
        });
      };

      reader.readAsDataURL(file);
    };

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <section key={field.id}>
            <section className="relative space-y-1">
              <div className="relative mb-3 flex h-32 items-center justify-center bg-gray-100 shadow-md">
                {field.imageString ? (
                  <Image
                    src={field.imageString}
                    alt=""
                    className="object-cover"
                    fill
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <TbCameraPlus className="text-3xl text-gray-400" />
                    <p className="pt-1 text-xs text-gray-400">
                      手順の写真を追加
                    </p>
                  </div>
                )}
                <input
                  {...register(`descript.${index}.imageFile`)}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload(index)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute right-0 top-0 m-1 rounded-full bg-orange-primary p-1 text-red-500 shadow hover:text-red-700"
                    title="手順を削除"
                  >
                    <BiTrash className="text-xl" />
                  </button>
                )}
              </div>
              {/* zodのエラー文 */}
              <div className="text-xs text-red-500">
                {errors.descript?.[index]?.imageFile?.message}
              </div>
            </section>

            <section className="space-y-1">
              <div className="flex items-start rounded-md border border-orange-200 bg-white p-1 focus-within:outline focus-within:outline-2 focus-within:outline-orange-600">
                <p className="flex size-4 flex-shrink-0 items-center justify-center rounded-full bg-orange-400 text-xs font-semibold text-white">
                  {index + 1}
                </p>
                <textarea
                  {...register(`descript.${index}.text`)}
                  className="ml-1 h-16 w-full resize-none bg-white text-xs outline-none"
                  placeholder="フライパンに油をひき、卵を割る。白身が白くなったらお米を入れる。"
                  inputMode="text"
                  autoCorrect="off"
                />
              </div>

              {/* zodのエラー文 */}
              <div className="text-xs text-red-500">
                {errors.descript?.[index]?.text?.message}
              </div>
            </section>
          </section>
        ))}
      </div>

      {fields.length < maxInputs && (
        <button
          type="button"
          onClick={addInput}
          disabled={fields.length >= maxInputs}
          className="mx-auto my-5 flex items-center rounded-sm border border-dashed border-orange-400 px-10 py-1 text-orange-400"
        >
          <BiPlus className="text-lg" />
          <p className="text-sm">作り方を追加</p>
        </button>
      )}
    </>
  );
};

export default DescriptInputItem;
