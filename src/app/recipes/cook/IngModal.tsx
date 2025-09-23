import { Ingredient } from "@/app/types";
import { IoMdClose } from "react-icons/io";

// ハイライトする材料の配列番号を検出する関数
const highLight = (descript: string, ingredient: Ingredient[]) => {
  const foundIndex: number[] = [];
  for (let i = 0; i < ingredient.length; i++) {
    const regex = new RegExp(ingredient[i].name);
    const match = regex.exec(descript);
    if (match !== null) {
      foundIndex.push(i);
    }
  }
  return foundIndex;
};

const IngModal = ({
  modalClose,
  ingredient,
  descript,
  howMany,
}: {
  modalClose: () => void;
  ingredient: Ingredient[];
  descript?: string;
  howMany: string;
}) => {
  // 背景押したら閉じるやつ
  const bgClickClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) modalClose();
  };

  // ハイライトする配列番号の取得
  let highLightWord: number[] = [-1];
  if (descript) {
    highLightWord = highLight(descript, ingredient);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50">
      <div
        onClick={bgClickClose}
        className="flex h-full items-center justify-center"
      >
        <div className="mx-10 w-full max-w-sm rounded-2xl bg-white p-3 text-gray-400 shadow-lg sm:max-w-md md:max-w-lg">
          <div className="mb-4 flex items-end justify-between border-b-2 border-orange-600 pb-1">
            <div className="text-xl font-bold text-orange-600">
              {howMany ? `材料（${howMany}）` : "材料"}
            </div>
            <button
              onClick={modalClose}
              className="flex flex-col items-center text-xs text-neutral-400 hover:text-neutral-600"
            >
              <IoMdClose className="size-7" />
              <span className="text-sm">閉じて</span>
            </button>
          </div>
          <div className="mb-2 space-y-2">
            {ingredient.map((ing: Ingredient) => (
              <div
                key={ing.index}
                className={`flex justify-between ${
                  ing.index === ingredient.length - 1
                    ? ""
                    : "border-b-2 border-dotted border-neutral-300"
                } `}
              >
                {highLightWord.includes(ing.index ?? -1) ? (
                  <span
                    key={ing.index}
                    className="mb-1 font-bold text-orange-400"
                  >
                    {ing.name}
                  </span>
                ) : (
                  <span key={ing.index} className="mb-1 text-black">
                    {ing.name}
                  </span>
                )}
                <span className="text-black">{ing.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngModal;
