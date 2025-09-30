"use client";

import Footer from "@/app/components/Footer";
import Header from "../components/Header/Header";
import AddRecipeCords from "../components/AddRecipeCords";
import { favoriteFetcher, searchFavFeatcher } from "../utils/supabase/recipe";
import { useSearchKW } from "../utils/useStore";

export default function HomeForm() {
  const searchKW = useSearchKW((state) => state.searchKW);

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF4] contain-paint">
      <div className={`sticky top-0 z-20`}>
        <Header />
      </div>

      <AddRecipeCords
        materialKey="favorites"
        fetcher={searchKW === "" ? favoriteFetcher : searchFavFeatcher}
      />
      <Footer pathName="/" />
    </div>
  );
}
