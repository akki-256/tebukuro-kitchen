import Image from "next/image";
import { FiCameraOff } from "react-icons/fi";
import { Descript } from "@/app/types";

const DescriptItem = ({ id, text, image_url }: Descript) => {
  return (
    <div className="flex items-start justify-between rounded-xl border border-orange-200 bg-white p-2">
      <div className="flex">
        <p className="flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-400 text-xs font-semibold text-white">
          {id}
        </p>

        <p className="flex-grow break-words px-2 text-sm">{text}</p>
      </div>
      {/* nullのみを判定しているので、url先の画像が見つからない場合に対処できない */}
      {image_url ? (
        <div className="relative size-[72px]">
          <Image
            src={image_url}
            alt={text || ""}
            fill={true}
            className="my-auto rounded-xl object-cover"
            onError={() => console.error("Image failed to load")}
          />
        </div>
      ) : (
        <div className="rounded-xl bg-gray-100 p-6">
          <FiCameraOff size={24} stroke="#737373" />
        </div>
      )}
    </div>
  );
};

export default DescriptItem;
