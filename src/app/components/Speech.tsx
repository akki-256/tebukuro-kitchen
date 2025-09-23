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
  setVoiceEnabled,
  voiceSpeed,
  setVoiceSpeed,
  voiceVolume,
  setVoiceVolume,
  setRepeatFlag,
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
  setVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  voiceSpeed: number;
  setVoiceSpeed: React.Dispatch<React.SetStateAction<number>>;
  voiceVolume: number;
  setVoiceVolume: React.Dispatch<React.SetStateAction<number>>;
  setRepeatFlag: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [response, setResponse] = useState("");

  const commands = [
    {
      command: /.*(進んで|進む|次へ|次).*/,
      callback: () => {
        next(num, length, setPage);
        resetTranscript();
        setResponse("進みます");
      },
      matchInterim: true,
    },
    {
      command: /.*(戻って|戻る|前へ|前).*/,
      callback: () => {
        back(num, setPage);
        resetTranscript();
        setResponse("戻ります");
      },
      matchInterim: true,
    },
    {
      command: /.*(材料).*/,
      callback: () => {
        setIngModalOpen(true);
        resetTranscript();
        setResponse("材料を表示します");
      },
      matchInterim: true,
    },
    {
      command: /.*(閉じて|閉じる).*/,
      callback: () => {
        setIngModalOpen(false);
        setYtModalOpen(false);
        setGuideModalOpen(false);
        setTimerModalOpen(false);
        resetTranscript();
        setResponse("表示を閉じます");
      },
      matchInterim: true,
    },
    {
      command: /.*(スタート).*/,
      callback: () => {
        setTimerStart(true);
        resetTranscript();
        setResponse("タイマーをスタートします");
      },
      matchInterim: true,
    },
    {
      command: /.*(ストップ).*/,
      callback: () => {
        setTimerStart(false);
        resetTranscript();
        setResponse("タイマーをストップします");
      },
      matchInterim: true,
    },
    {
      command: /.*(リセット).*/,
      callback: () => {
        setTimerReset((prev) => !prev);
        resetTranscript();
        setResponse("タイマーをリセットします");
      },
      matchInterim: true,
    },
    {
      command: /タイマー(.*)セット.*/,
      callback: (material: string) => {
        const timeRelatedString = material.replace(
          /[^0-9０-９一二三四五六七八九十百秒分時間半\s]/g,
          "",
        );
        const time = timeRelatedString.replace(/\s+/g, "");
        setInputTime(time);
        resetTranscript();
        setResponse(`タイマーを"${time}"に設定しました`);
      },
      matchInterim: true,
    },
    {
      command: /(.*)ってどうするの.*/,
      callback: (material: string) => {
        setKeyword(material);
        setYtModalOpen(true);
        resetTranscript();
        setResponse(`"${material}"の動画を表示します`);
      },
      matchInterim: true,
    },
    {
      command: /.*(ガイド).*/,
      callback: () => {
        setGuideModalOpen(true);
        resetTranscript();
        setResponse("ガイドを表示します");
      },
      matchInterim: true,
    },
    {
      command: /.*(もう一度).*/,
      callback: () => {
        setRepeatFlag((prev) => !prev);
        resetTranscript();
        setResponse("もう一度読み上げます");
      },
      matchInterim: true,
    },
    {
      command: /.*(読み上げて).*/,
      callback: () => {
        setVoiceEnabled(true);
        resetTranscript();
        setResponse("音声読み上げをONにしました");
      },
      matchInterim: true,
    },
    {
      command: /.*(読み上げないで).*/,
      callback: () => {
        setVoiceEnabled(false);
        resetTranscript();
        setResponse("音声読み上げをOFFにしました");
      },
      matchInterim: true,
    },
    {
      command: /.*(早口で).*/,
      callback: () => {
        setVoiceSpeed((prev) => (prev < 2 ? prev + 0.25 : prev));
        resetTranscript();
        setResponse(
          `読み上げ速度を${voiceSpeed < 2 ? voiceSpeed + 0.25 : voiceSpeed}に設定しました`,
        );
      },
      matchInterim: true,
    },
    {
      command: /.*(ゆっくりで).*/,
      callback: () => {
        setVoiceSpeed((prev) => (prev > 0.25 ? prev - 0.25 : prev));
        resetTranscript();
        setResponse(
          `読み上げ速度を${voiceSpeed > 0.25 ? voiceSpeed - 0.25 : voiceSpeed}に設定しました`,
        );
      },
      matchInterim: true,
    },
    {
      command: /.*(大きくして).*/,
      callback: () => {
        setVoiceVolume((prev) => (prev < 100 ? prev + 10 : prev));
        resetTranscript();
        setResponse(
          `読み上げ音量を${voiceVolume < 100 ? voiceVolume + 10 : voiceVolume}%に設定しました`,
        );
      },
      matchInterim: true,
    },
    {
      command: /.*(小さくして).*/,
      callback: () => {
        setVoiceVolume((prev) => (prev > 0 ? prev - 10 : prev));
        resetTranscript();
        setResponse(
          `読み上げ音量を${voiceVolume > 0 ? voiceVolume - 10 : voiceVolume}%に設定しました`,
        );
      },
      matchInterim: true,
    },
  ];

  const { transcript, listening, resetTranscript } = useSpeechRecognition({
    commands,
  });

  // アンマウント時に停止
  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  // 認識の再開処理
  useEffect(() => {
    if (!listening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [resetTranscript, listening]);

  // 数秒後に response を消す処理
  useEffect(() => {
    if (!response) return;
    const timer = setTimeout(() => {
      setResponse("");
    }, 2500);
    return () => clearTimeout(timer);
  }, [response]);

  return (
    <>
      {transcript && (
        <div className="ml-4 flex w-full font-mono">
          <div className="fixed bottom-[4.5rem] z-10 flex max-w-[80vw] rounded-md border border-orange-200 bg-orange-50 p-2 pl-1">
            <FiMic className="mr-1 h-5 w-5 text-orange-400" />
            <span className="my-auto flex max-w-[65vw] justify-end overflow-hidden whitespace-nowrap text-sm text-gray-400">
              {transcript}
            </span>
          </div>
        </div>
      )}
      {response && (
        <div className="flex w-full items-center justify-center">
          <div
            className={`fixed bottom-0 z-10 mb-16 flex max-w-[80vw] items-center rounded-md border border-orange-200 bg-orange-50 p-2 pl-1 shadow-lg ${
              response ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src="/tebukuro.svg"
              alt="tebukuroicon"
              className="mr-1 h-5 w-5 text-orange-400"
            />
            <span className="my-auto flex max-w-[65vw] justify-end overflow-hidden whitespace-nowrap text-sm font-thin text-black">
              「{response}」
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Speech;
