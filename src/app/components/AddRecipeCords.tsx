import { Recipe } from "../types";
import ArticleCard from "./ArticleCard";
import useSWRInfinite from "swr/infinite";
import { useInView } from "react-intersection-observer";
import LoadingComponent from "./LoadingDataFetch";
import Error from "next/error";
import { PAGE_SIZE_SWR } from "../utils/supabaseFunctionsNew";
import { FiHeart } from "react-icons/fi";
import { useSearchKW } from "../utils/useStore";

type propsType = {
  materialKey: string; //表示管理用 一意のキーを指定する
  fetcher: (key: string) => Promise<Recipe[]>; //データ取得用のfetcher関数
};

const AddRecipeCords = ({ materialKey, fetcher }: propsType) => {
  const SearchKW = useSearchKW((state) => state.searchKW);
  const { ref, inView: isScrollEnd } = useInView();

  const getKey = (pageIndex: number, previousPageData: Recipe[][] | null) => {
    const key = `${materialKey}-${SearchKW}-${pageIndex}`;
    if (previousPageData && previousPageData.length < PAGE_SIZE_SWR)
      return null;
    return key;
  };
  const { data, error, isValidating, size, setSize } = useSWRInfinite<Recipe[]>(
    getKey,
    fetcher,
    {
      revalidateIfStale: false, // キャッシュがあっても再検証しない
      revalidateOnFocus: false, // windowをフォーカスすると再検証しない
      revalidateOnMount: false, // マウント時に再検証しない
      revalidateFirstPage: false, // 2ページ目以降を読み込むとき毎回1ページ目を再検証しない
    },
  );

  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data?.[data?.length - 1]?.length < PAGE_SIZE_SWR);

  if (isScrollEnd && !isValidating && !isReachingEnd) setSize(size + 1);
  if (error)
    return <Error statusCode={500} title="データの取得に失敗しました" />;

  if (isEmpty) {
    return (
      <section className="flex flex-grow flex-col items-center justify-center gap-2 bg-[#FFFBF4] text-black">
        <FiHeart size={55} className="text-gray-500" />
        <p className="text-2xl font-bold text-gray-500">
          お気に入りを
          <br />
          登録しよう！
        </p>
      </section>
    );
  } else if (isEmpty) {
    return (
      <section className="flex flex-grow flex-col items-center justify-center gap-2 bg-[#FFFBF4] text-black">
        <p className="text-center text-2xl font-bold text-gray-500">
          検索したレシピは
          <br />
          見つかりませんでした
        </p>
      </section>
    );
  }

  return (
    <div className="flex-1 border-none">
      <div
        className={`grid flex-grow auto-rows-min grid-cols-2 gap-5 border-none bg-[#FFFBF4] p-5 sm:grid-cols-3 lg:grid-cols-4`}
      >
        {data?.flat().map((recipe: Recipe, index) => (
          <div key={index}>
            <ArticleCard
              recipe={recipe}
              from={materialKey === "favorites" ? "favorites" : ""}
            />
          </div>
        ))}
      </div>

      {/* データ取得時は検知の要素を表示しない */}
      {!isValidating && <div ref={ref} aria-hidden="true" />}
      {/* データ取得時はローダーを表示する */}
      {isValidating && <LoadingComponent />}
    </div>
  );
};

export default AddRecipeCords;
