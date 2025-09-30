import Link from "next/link";
import { usePathname } from "next/navigation";

const SwitchMode = () => {
  const pathName = usePathname();

  return (
    <div className="w-full bg-white p-2">
      <div className="flex">
        <div className="flex w-1/2 justify-center px-4 text-black">
          <Link
            className={`px-4 py-2 ${pathName === "/" ? "border-b-4 border-orange-400" : "border-b-4 border-white"}`}
            href={"/"}
          >
            レシピ
          </Link>
        </div>

        <div className="flex w-1/2 justify-center px-4 text-black">
          <Link
            className={`px-4 py-2 ${pathName === "/favorites" ? "border-b-4 border-orange-500" : "border-b-4 border-white"}`}
            href={"/favorites"}
          >
            お気に入り
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SwitchMode;
