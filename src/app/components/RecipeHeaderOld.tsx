import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineQuestionMark } from "react-icons/md";

type RecipeHeaderProps = {
  bgColor: string;
  textColor: string;
  title: string;
  link: string;
  iconFill: string;
  guideModalOpen?: boolean;
  setGuideModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const RecipeHeader = ({
  bgColor,
  textColor,
  title,
  link,
  iconFill,
  guideModalOpen,
  setGuideModalOpen,
}: RecipeHeaderProps) => {
  return (
    <header
      className={`sticky top-0 flex w-full items-center border-b border-gray-400 p-5 shadow-md ${bgColor} z-40 min-h-[69px]`}
    >
      <Link href={link} className="absolute left-5 text-3xl">
        <IoIosArrowBack fill={iconFill} />
      </Link>
      <p
        className={`flex-1 text-center text-xl font-semibold ${textColor} truncate pl-10 pr-11`}
      >
        {title}
      </p>

      {typeof guideModalOpen === "boolean" &&
        typeof setGuideModalOpen === "function" && (
          <button
            onClick={() => setGuideModalOpen(!guideModalOpen)}
            className="absolute right-5 bg-transparent font-bold text-white"
          >
            <MdOutlineQuestionMark className="mx-auto h-6 w-6" />
            <p>ガイド</p>
          </button>
        )}
    </header>
  );
};

export default RecipeHeader;
