import { IoMdClose } from "react-icons/io";
import { FiSearch, FiVolumeX, FiVolume2 } from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import { PiNoteDuotone } from "react-icons/pi";
import { FaArrowRotateRight } from "react-icons/fa6";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";

const iconClass = "size-4 text-orange-400";
const commands = [
  {
    icon: <FaArrowRight className={iconClass} />,
    title: "「進んで」",
    desc: "次のページに進む",
  },
  {
    icon: <FaArrowLeft className={iconClass} />,
    title: "「戻って」",
    desc: "前のページに戻る",
  },
  {
    icon: <PiNoteDuotone className={iconClass} strokeWidth={3} />,
    title: "「材料は?」",
    desc: "材料リストを表示",
  },
  {
    icon: <MdOutlineTimer className={iconClass} />,
    title: "「タイマーO分セット」",
    desc: "O分タイマーをセット",
  },
  {
    icon: <FiSearch className={iconClass} />,
    title: "「OOってどうするの?」",
    desc: "OOの切り方の動画を表示",
  },
  {
    icon: <IoMdClose className={iconClass} />,
    title: "「閉じて」",
    desc: "表示を閉じる",
  },
  {
    icon: <FaArrowRotateRight className={iconClass} />,
    title: "「もう一度」",
    desc: "直前の音声を読み上げる",
  },
  {
    icon: <FiVolumeX className={iconClass} />,
    title: "「読み上げて/読み上げないで」",
    desc: "音声読み上げをオン/オフ",
  },
  {
    icon: <HiOutlineChevronDoubleRight className={iconClass} strokeWidth={2} />,
    title: "「早口で/ゆっくりで」",
    desc: "音声の読み上げ速度を変更",
  },
  {
    icon: <FiVolume2 className={iconClass} />,
    title: "「大きくして/小さくして」",
    desc: "音声の読み上げ音量を変更",
  },
];

type GuideModalProps = {
  modalClose: () => void;
};

const GuideModal = ({ modalClose }: GuideModalProps) => {
  const bgClickClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) modalClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50">
      <div
        onClick={bgClickClose}
        className="flex h-full items-center justify-center"
      >
        <div className="mx-10 max-h-[calc(100vh-10rem)] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-3 text-gray-600 shadow-lg sm:max-w-md md:max-w-lg">
          <div className="mb-4 flex items-end justify-between border-b-2 border-orange-600 pb-1">
            <div className="text-xl font-bold text-orange-600">音声ガイド</div>
            <button
              onClick={modalClose}
              className="flex flex-col items-center text-xs text-neutral-400 hover:text-neutral-600"
            >
              <IoMdClose className="size-7" />
              <span className="text-sm">閉じて</span>
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {commands.map(({ icon, title, desc }, id) => (
              <div key={id} className="flex items-start gap-2">
                <div className="rounded-full bg-orange-100 p-2">{icon}</div>
                <div>
                  <p className="font-semibold text-orange-700">{title}</p>
                  <p className="ml-1 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mx-1 mb-1 mt-4 rounded-2xl bg-orange-50 p-3">
            <p className="mb-2 text-sm font-semibold text-orange-700">
              音声認識のコツ
            </p>
            <ul className="ml-4 list-disc space-y-1 text-xs text-orange-800">
              <li>静かな環境で使用すると認識精度が上がります</li>
              <li>はっきりとした声で話しかけてください</li>
              <li>
                コマンドを話す前に少し間を置くとより認識されやすくなります
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
