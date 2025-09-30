import { FiSearch } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { CgFileDocument } from "react-icons/cg";
import Link from "next/link";

type Props = {
  pathName: string;
};

const Footer = ({ pathName }: Props) => {
  const iconsize = 22;

  return (
    <div className="sticky bottom-0 z-20 w-full transition-transform duration-200">
      <div className="flex h-16 w-full justify-center border-t-2 border-gray-400 bg-white pt-1">
        <Link className="w-1/3" href={`/`}>
          <FiSearch
            size={iconsize}
            className={`mx-auto w-fit ${pathName === "/" || pathName === "/favorites" ? "text-orange-600" : "text-gray-600"}`}
          />
          <div
            className={`mx-auto w-fit text-xs ${pathName === "/" || pathName === "/favorites" ? "text-orange-600" : "text-gray-600"}`}
          >
            さがす
          </div>
        </Link>

        <Link className="w-1/3" href={"/registration"}>
          <CgFileDocument
            size={iconsize}
            className={`mx-auto w-fit ${pathName === "/registration" ? "text-orange-600" : "text-gray-600"}`}
          />
          <div
            className={`mx-auto w-fit text-xs ${pathName === "/registration" ? "text-orange-600" : "text-gray-600"}`}
          >
            登録
          </div>
        </Link>

        <Link className="w-1/3" href={"/users"}>
          <AiOutlineUser
            size={iconsize}
            className={`mx-auto w-fit ${pathName === "/users" ? "text-orange-600" : "text-gray-600"}`}
          />
          <div
            className={`mx-auto w-fit text-xs ${pathName === "/users" ? "text-orange-600" : "text-gray-600"}`}
          >
            マイページ
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
