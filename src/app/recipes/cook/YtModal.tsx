"use client";

import youtube from "@/app/utils/youtube";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

// 動画取得用のtype ほぼエラー対策用
type Thumbnail = {
  url: string;
  width: number;
  height: number;
};
type Snippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
  };
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: string;
};
type Video = {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  snippet: Snippet;
};

const YtModal = ({
  modalClose,
  keyword,
}: {
  modalClose: () => void;
  keyword: string;
}) => {
  const [video, setVideo] = useState<Video | null>(null); // 動画のデータ

  // 背景押したら閉じるやつ
  const bgClickClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      modalClose();
    }
  };

  // 検索関数
  useEffect(() => {
    if (keyword !== "") {
      const handleSearch = async () => {
        try {
          const result = await youtube(keyword);
          setVideo(result);
          console.log(result);
        } catch (error) {
          console.error("Error fetching video:", error);
        }
      };
      handleSearch();
    }
  }, [keyword]);

  return (
    <>
      <div className="fixed inset-x-0 -top-10 bottom-0 bg-black bg-opacity-50">
        <div
          onClick={bgClickClose}
          className="flex h-full items-center justify-center"
        >
          <div>
            <div className="flex w-full justify-end">
              <IoMdClose onClick={modalClose} className="m-2 h-10 w-10" />
            </div>
            <div>
              {video === null ? (
                <div className="flex h-[30vh] w-[90vw] flex-col justify-center bg-white text-center text-black">
                  動画をロード中です
                  <div className="flex justify-center">
                    <div className="mt-5 h-10 w-10 animate-spin rounded-full border-4 border-orange-400 border-t-transparent"></div>
                  </div>
                </div>
              ) : (
                <iframe
                  className="h-[30vh] w-[90vw]"
                  src={`https://www.youtube.com/embed/${video?.id.videoId}?autoplay=1&mute=1`}
                  title="YouTube video player"
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default YtModal;
