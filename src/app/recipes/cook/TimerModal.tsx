import {
  SetStateAction,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import { num2TimerText, str2TimerText } from "./timerFunc";

const ModalContainer = ({ children }: { children: React.JSX.Element }) => {
  const container = document.getElementById("container");
  if (!container) {
    return null;
  }
  return createPortal(children, container);
};

const TimerModal = ({
  timerModalOpen,
  modalClose,
  inputTime,
  setInputTime,
  start,
  setStart,
  timerReset,
}: {
  timerModalOpen: boolean;
  modalClose: () => void;
  inputTime: string;
  setInputTime: React.Dispatch<SetStateAction<string>>;
  start: boolean;
  setStart: React.Dispatch<SetStateAction<boolean>>;
  timerReset: boolean;
}) => {
  const [timerDisp, setTimerDisp] = useState(""); // タイマーのテキスト

  const [inUse, setInUse] = useState(false); // タイマーの使用中判定（左下表示判定用）
  const [update, setUpdate] = useState(false); // 値更新検出用

  const [min, setMin] = useState(0); // 分
  const [sec, setSec] = useState(0); // 秒

  const alarm = useRef<HTMLAudioElement>(); // アラーム用変数
  // アラームの初期化
  useEffect(() => {
    alarm.current = new Audio("/TimerAlarm.mp3");
  }, []);

  // 音声入力での初期化、入力処理
  useEffect(() => {
    if (inputTime != "") {
      const { m, s } = str2TimerText(inputTime);
      setMin(m);
      setSec(s);
      setInUse(true);
      setUpdate((prev) => !prev);
      setInputTime(""); //一旦毎回リセットするようにする
    }
  }, [inputTime, setInputTime]);

  // タイマー更新関数
  useEffect(() => {
    if (min > 999) {
      setTimerDisp(num2TimerText(999, 59, setMin, setSec, true));
    } else {
      setTimerDisp(num2TimerText(min, sec, setMin, setSec, true));
    }

    if (min === 0 && sec === 0 && !start) {
      setInUse(false);
    } else {
      setInUse(true);
    }
  }, [update, setInUse, min, sec, start]);

  // アラーム終了時の処理（終了するまではstart判定はtrueのまま）
  if (alarm.current) {
    alarm.current.onended = () => {
      setStart(false);
      reset();
    };
  }

  // リセットボタン
  const reset = useCallback(() => {
    if (alarm.current) {
      alarm.current.pause();
      alarm.current.currentTime = 0;
    }
    setMin(0);
    setSec(0);
    setStart(false);
    setUpdate((prev) => !prev); // ← こう書くと依存に update を入れなくてOK
  }, [alarm, setMin, setSec, setStart, setUpdate]);

  // タイマーのインターバル処理
  useEffect(() => {
    setTimerDisp(num2TimerText(min, sec, setMin, setSec, false));
    let manager: NodeJS.Timeout;
    if (start) {
      manager = setInterval(() => {
        if (sec <= 0 && min == 0) {
          clearInterval(manager);
          if (alarm.current) {
            alarm.current.play().catch((/*error*/) => {
              setTimeout(() => {
                reset();
              }, 8000);
            });
          }
        } else {
          setSec((prev) => prev - 1);
          if (sec == 0) {
            setSec(59);
            setMin((prev) => prev - 1);
          }
        }
        setTimerDisp(num2TimerText(min, sec, setMin, setSec, false));
      }, 1000);
    }
    return () => {
      if (manager) {
        clearInterval(manager);
      }
    };
  }, [setTimerDisp, start, min, sec, reset]);

  // スタート、ストップボタン
  const start_stop = () => {
    if (min !== 0 || sec !== 0) setStart(!start);
    else reset();
  };

  // 音声認識でのリセット検出
  useEffect(() => {
    reset();
  }, [timerReset, reset]);

  // 背景押したら閉じるやつ
  const bgClickClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      modalClose();
    }
  };

  return (
    <>
      {timerModalOpen && (
        <ModalContainer>
          <div className={timerModalOpen ? "block" : "hidden"}>
            <div className="fixed inset-x-0 bottom-0 top-0 bg-black bg-opacity-50">
              <div
                onClick={bgClickClose}
                className="flex h-full items-center justify-center"
              >
                <div className="mx-3 rounded-2xl bg-white p-3 text-black shadow-lg sm:mx-5 sm:p-4 md:mx-20">
                  <div className="mb-1 flex w-full justify-end sm:mb-3">
                    <IoMdClose
                      onClick={modalClose}
                      className="m-1 h-6 w-6 text-gray-400 sm:m-2 sm:h-8 sm:w-8 md:h-10 md:w-10"
                    />
                  </div>
                  <div className="mb-4 text-center font-sans text-8xl font-black sm:mb-5 sm:text-[84px] md:text-8xl">
                    {timerDisp}
                  </div>
                  <div className="mb-2 w-full font-bold">
                    <div className="mx-2 mb-4 flex justify-between leading-none sm:mx-4 sm:mb-5 md:mx-5">
                      <button
                        onClick={() => {
                          setMin(min + 60);
                          setUpdate(!update);
                          if (start) setStart(false);
                        }}
                        className="h-12 w-12 rounded-full bg-orange-400 text-sm text-white sm:h-14 sm:w-14 sm:text-base md:h-16 md:w-16"
                      >
                        +60分
                      </button>
                      <button
                        onClick={() => {
                          setMin(min + 10);
                          setUpdate(!update);
                          if (start) setStart(false);
                        }}
                        className="h-12 w-12 rounded-full bg-orange-400 text-sm text-white sm:h-14 sm:w-14 sm:text-base md:h-16 md:w-16"
                      >
                        +10分
                      </button>
                      <button
                        onClick={() => {
                          setMin(min + 1);
                          setUpdate(!update);
                          if (start) setStart(false);
                        }}
                        className="h-12 w-12 rounded-full bg-orange-400 text-sm text-white sm:h-14 sm:w-14 sm:text-base md:h-16 md:w-16"
                      >
                        +1分
                      </button>
                      <button
                        onClick={() => {
                          setSec(sec + 10);
                          setUpdate(!update);
                          if (start) setStart(false);
                        }}
                        className="h-12 w-12 rounded-full bg-orange-400 text-sm text-white sm:h-14 sm:w-14 sm:text-base md:h-16 md:w-16"
                      >
                        +10秒
                      </button>
                    </div>
                    <div className="mx-2 mb-4 flex justify-between sm:mx-4 sm:mb-5 md:mx-5">
                      <button
                        onClick={() => start_stop()}
                        className="mr-2 h-14 w-28 rounded-full bg-orange-400 text-base leading-none tracking-tighter text-white sm:mr-3 sm:h-16 sm:w-36 sm:text-xl md:h-20 md:w-40 md:text-2xl"
                      >
                        {start ? "ストップ" : "スタート"}
                      </button>
                      <button
                        onClick={() => reset()}
                        className="h-14 w-28 rounded-full bg-orange-100 text-base tracking-tighter text-orange-400 sm:h-16 sm:w-36 sm:text-xl md:h-20 md:w-40 md:text-2xl"
                      >
                        リセット
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalContainer>
      )}

      {/* 左下のミニタイマー */}
      {inUse ? (
        <div className="fixed left-1/2 top-[85px] z-10 -translate-x-1/2">
          <div className="w-48 rounded-full bg-orange-400 px-1 py-0.5 text-center font-sans text-2xl text-white shadow-lg">
            {timerDisp}
          </div>
          <div className="mt-2 flex justify-between">
            <div
              className="ml-4 cursor-pointer rounded-full bg-orange-400 px-2 py-1 text-sm font-semibold text-white shadow-lg"
              onClick={() => start_stop()}
            >
              {start ? "ストップ" : "スタート"}
            </div>
            <div
              className="mr-4 cursor-pointer rounded-full bg-orange-400 px-2 py-1 text-sm font-semibold text-white shadow-lg"
              onClick={() => reset()}
            >
              リセット
            </div>
          </div>
        </div>
      ) : (
        <span></span>
      )}
    </>
  );
};

export default TimerModal;
