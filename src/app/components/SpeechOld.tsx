"use client";

import "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useState } from "react";
import { FiMic } from "react-icons/fi";

type screenController = {
  next: (
    num: number,
    length: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
  ) => void;
  back: (
    num: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
  ) => void;
};

const Speech = ({
  next,
  back,
  num,
  length,
  setPage,
  setIngModalOpen,
  setYtModalOpen,
  setKeyword,
  setGuideModalOpen,
  setTimerModalOpen,
  setInputTime,
  setTimerStart,
  setTimerReset,
}: {
  next: screenController["next"];
  back: screenController["back"];
  num: number;
  length: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setIngModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setYtModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  setGuideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setInputTime: React.Dispatch<React.SetStateAction<string>>;
  setTimerStart: React.Dispatch<React.SetStateAction<boolean>>;
  setTimerReset: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [response, setResponse] = useState("");

  // useStateすごい
  // const [lastModalStateAction, setLastModalStateAction] = useState<
  //   React.Dispatch<React.SetStateAction<boolean>> | undefined
  // >(undefined);
  // useEffect(() => {
  //   setLastModalStateAction(() => setIngModalOpen);
  //   if (lastModalStateAction) {
  //     lastModalStateAction(true);
  //   }
  // }, [lastModalStateAction, setLastModalStateAction, setIngModalOpen]);

  const commands = [
    {
      command: /.*(進んで|進む|次へ|次).*/,
      // *印は、雑音に影響されないよう命令の前後の文言を許容するため。起こる恐れのあるバグが不明のため、要検証
      callback: () => {
        next(num, length, setPage);
        resetTranscript();
        setResponse("進みます");
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /.*(戻って|戻る|前へ|前).*/,
      callback: () => {
        back(num, setPage);
        resetTranscript();
        setResponse("戻ります");
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /.*(材料).*/,
      callback: () => {
        setIngModalOpen(true);
        resetTranscript();
        setResponse("材料を表示します");
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /.*(閉じて|閉じる).*/,
      callback: () => {
        // TODO 最前面のモーダルだけ閉じるようにしたい
        setIngModalOpen(false);
        setYtModalOpen(false);
        setGuideModalOpen(false);
        setTimerStart(false);
        setTimerModalOpen(false);
        resetTranscript();
        setResponse("表示を閉じます");
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /.*(スタート).*/,
      callback: () => {
        setTimerStart(true);
        resetTranscript();
        setResponse("タイマーをスタートします");
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /.*(ストップ).*/,
      callback: () => {
        setTimerStart(false);
        resetTranscript();
        setResponse("タイマーをストップします");
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /.*(リセット).*/,
      callback: () => {
        setTimerReset((prev) => !prev);
        resetTranscript();
        setResponse("タイマーをリセットします");
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /タイマー(.*)セット.*/,
      callback: (material: string) => {
        setInputTime(material.replace(/\s+/g, "")); //スペース削除
        resetTranscript();
        setResponse(
          `タイマーを"${material.replace(/\s+/g, "")}"に設定しました`,
        );
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /(.*)ってどうするの.*/,
      callback: (material: string) => {
        // FIXME いちょう切りが胃腸切りになっちゃう
        setKeyword(material);
        setYtModalOpen(true);
        // setResponse(`${material}`);
        console.log("[get]", material);
        resetTranscript();
        setResponse(`"${material}"の動画を表示します`);
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
    {
      command: /.*(ガイド).*/,
      callback: () => {
        setGuideModalOpen(true);
        resetTranscript();
        setResponse("ガイドを表示します");
        SpeechRecognition.startListening({ continuous: true });
      },
      matchInterim: true,
    },
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    // browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  // ここの処理はなくても良さそう。認識が止まることがあれば戻す。
  // const [lastTranscript, setLastTranscript] = useState(""); // 最後に処理したtranscript
  // useEffect(() => {
  //   if (transcript && transcript !== lastTranscript) {
  //     // コマンドで処理されなかった場合の処理
  //     // 認識停止予防
  //     if (response === "") {
  //       SpeechRecognition.startListening({ continuous: true });
  //     }
  //     setLastTranscript(transcript);
  //   }
  // }, [transcript, lastTranscript, response]);

  // 音声認識が停止したときに再スタートする処理
  // 認識停止予防
  useEffect(() => {
    if (!listening) {
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening]);

  // デバッグ用
  // useEffect(() => {
  //   console.log("[input] " + transcript);
  // }, [transcript]);

  // if (!browserSupportsSpeechRecognition) {
  //   console.log("Speech conponent ERROR");
  // }

  return (
    <div className="flex w-full items-center justify-center font-mono">
      {transcript && (
        <div className="fixed bottom-20 z-10 mb-16 flex max-w-[80vw] rounded-sm border border-orange-200 bg-orange-50 p-2 pl-1 shadow-md">
          <FiMic className="mr-1 h-5 w-5 text-orange-400" />
          <span className="my-auto flex max-w-[65vw] justify-end overflow-hidden whitespace-nowrap text-sm text-black">
            {transcript}
          </span>
        </div>
      )}
      <div className="fixed bottom-0 z-10 mb-16 flex max-w-[80vw] rounded-md border border-orange-200 bg-orange-50 p-2 pl-1 shadow-lg">
        <img
          src="/tebukuro.svg"
          alt="tebukuroicon"
          className="mr-2 h-5 w-5 text-orange-400"
        />
        <span className="my-auto flex max-w-[65vw] justify-end overflow-hidden whitespace-nowrap text-sm text-gray-400">
          {response != "" ? response : "ここには認識結果が表示されます"}
        </span>
      </div>
    </div>
  );
};

export default Speech;
