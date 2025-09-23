"use client";

import { SetStateAction } from "react";
import { IoMdClose } from "react-icons/io";

type VoiceSettingsModalProps = {
  modalClose: () => void;
  voiceEnabled: boolean;
  setVoiceEnabled: React.Dispatch<SetStateAction<boolean>>;
  voiceVolume: number;
  setVoiceVolume: React.Dispatch<SetStateAction<number>>;
  voiceSpeed: number;
  setVoiceSpeed: React.Dispatch<SetStateAction<number>>;
  // timerAlarmVolume: number;
  // setTimerAlarmVolume: React.Dispatch<SetStateAction<number>>;
};

const VoiceSettingsModal = ({
  modalClose,
  voiceEnabled,
  setVoiceEnabled,
  voiceVolume,
  setVoiceVolume,
  voiceSpeed,
  setVoiceSpeed,
  // timerAlarmVolume,
  // setTimerAlarmVolume,
}: VoiceSettingsModalProps) => {
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
            <div className="text-xl font-bold text-orange-600">音声設定</div>
            <button
              onClick={modalClose}
              className="flex flex-col items-center text-xs text-neutral-400 hover:text-neutral-600"
            >
              <IoMdClose className="size-7" />
              <span className="text-sm">閉じて</span>
            </button>
          </div>
          <div className="space-y-4 text-sm text-orange-700">
            <div className="flex items-center justify-between">
              <p>音声読み上げ</p>

              <label className="inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={voiceEnabled}
                  onChange={() => setVoiceEnabled(!voiceEnabled)}
                />
                <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-orange-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full"></div>
              </label>
            </div>
            <div className="space-y-1">
              <p>読み上げ音量</p>
              <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                <p>小</p>
                <input
                  id="steps-range"
                  type="range"
                  min="0"
                  max="100"
                  value={voiceVolume}
                  step="10"
                  onChange={(e) => setVoiceVolume(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-orange-200 accent-orange-500"
                />
                <p>大</p>
              </div>
              <p className="flex justify-center text-xs text-gray-500">
                {voiceVolume}%
              </p>
            </div>
            <div className="space-y-1">
              <p>読み上げ速度</p>
              <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                <p>遅</p>
                <input
                  id="steps-range"
                  type="range"
                  min="0.25"
                  max="2"
                  value={voiceSpeed}
                  step="0.25"
                  onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-orange-200 accent-orange-500"
                />
                <p>早</p>
              </div>
              <p className="flex justify-center text-xs text-gray-500">
                {voiceSpeed}x
              </p>
            </div>
            {/* <div className="space-y-1">
              <p>タイマー音量</p>
              <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
                <p>小</p>
                <input
                  id="steps-range"
                  type="range"
                  min="0"
                  max="100"
                  value={timerAlarmVolume}
                  step="10"
                  onChange={(e) => setTimerAlarmVolume(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-orange-200 accent-orange-500"
                />
                <p>大</p>
              </div>
              <p className="flex justify-center text-xs text-gray-500">
                {timerAlarmVolume}%
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettingsModal;
