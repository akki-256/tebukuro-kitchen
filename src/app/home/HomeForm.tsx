"use client";

import Footer from "@/app/conponents/Footer";
import Header from "../conponents/Header/Header";
import AddRecipeCords from "../conponents/AddRecipeCords";
import { randomFetcher, searchFeatcher } from "../utils/supabase/recipe";
import { useSearchKW } from "../utils/useStore";

export default function HomeForm() {
  const searchKW = useSearchKW((state) => state.searchKW);

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF4] contain-paint">
      <div className={`sticky top-0 z-20`}>
        <Header />
      </div>

      <AddRecipeCords
        materialKey={"Recipe"}
        fetcher={searchKW === "" ? randomFetcher : searchFeatcher}
      />

      <Footer pathName="/" />
    </div>
  );
}
