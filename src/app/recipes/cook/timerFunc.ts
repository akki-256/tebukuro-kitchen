type unit = {
  [key: string]: number;
};

// 文字列をミリ秒に変換する関数
export const parseStr2sec = (str: string): number => {
  //                      優先度 高->低
  const regex = /(\d+)\s*(秒|分半|分|時間半|時間)/g;
  let match: RegExpExecArray | null;
  let miliSec: number = 0;

  const unitToMs: unit = {
    時間半: 3600000,
    時間: 3600000,
    分半: 60000,
    分: 60000,
    秒: 1000,
  };

  while ((match = regex.exec(str)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2];
    if (unitToMs[unit]) {
      miliSec += value * unitToMs[unit];
      if (unit == "分半" || unit == "時間半") {
        miliSec += unitToMs[unit] / 2;
      }
    }
  }
  return Math.trunc(miliSec / 1000); //小数点以下切り捨て
};

// 分、秒の数字をタイマーのテキストに変換する関数
export const num2TimerText = (
  min: number,
  sec: number,
  setMin: React.Dispatch<React.SetStateAction<number>>,
  setSec: React.Dispatch<React.SetStateAction<number>>,
  init: boolean,
  /* 
    init : 初期化True or 更新False
    初期化の時は値変更ごとにstateを更新する。
    更新の時はstateをここでは書き換えない。
    手動操作による表示される値と内部の値との相違を防止するための引数
  */
) => {
  let timerText: string = "";
  let m = min;
  let s = sec;

  if (s >= 60) {
    const multi: number = Math.floor(s / 60);
    s = s - multi * 60;
    if (multi <= 1) m++;
    else m += multi;
  }
  if (init) {
    setMin(m);
    setSec(s);
  }
  if (m < 10) timerText += `0${m}:`;
  else timerText += `${m}:`;
  if (s < 10) timerText += `0${s}`;
  else timerText += `${s}`;
  return timerText;
};

// 文字列をタイマーのテキストに変換する関数
export const str2TimerText = (str: string) => {
  let s: number = parseStr2sec(str);
  const m = Math.floor(s / 60);
  s -= m * 60;

  return { m, s };
};
