import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineClose } from "react-icons/ai";
const LoginModal = () => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-96 bg-white p-6 text-center shadow-lg">
        {/* イラスト画像 */}
        <div className="relative -mt-10 h-[230px] w-[240px]">
          <Image
            src="/icon.png"
            alt="アイコン"
            layout="fill"
            objectFit="contain"
          />
        </div>

        <button className="absolute right-3 top-3 text-gray-600 hover:text-black">
          <AiOutlineClose size={24} />
        </button>

        {/* 閉じるボタン */}
        <button className="absolute right-4 top-4 text-black"></button>

        {/* サブタイトル */}
        <p className="text-md mb-2 font-bold text-black">
          この機能はログインが必要です
        </p>

        {/* Googleログインボタン */}
        <button
          type="submit"
          className="mt-12 flex h-12 w-full translate-y-[-20px] cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-solid border-black border-opacity-25 bg-white text-base transition duration-300 hover:border-opacity-50 hover:bg-gray-200"
        >
          <FcGoogle className="h-8 w-8 translate-x-[-20px]" />
          <span className="translate-x-[-10px]">Googleでログイン</span>
        </button>

        {/* キャンセルボタン */}
        <button className="w-20 translate-x-24 translate-y-1 bg-gray-300 py-2 text-sm font-bold text-black hover:bg-gray-400">
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
