import { create } from "zustand";

// ヘッダーの検索バーに入力されたキーワードをコンポーネント間で共有
type searchStore = {
    searchKW : string|null;
    setSearchKW : (kW:string)=>void;
};

export const useSearchKW =create<searchStore>((set)=>({
    searchKW:"",
    setSearchKW:(kW:string)=>set({searchKW:kW}),
}));

//作るレシピを複数選択する時のrecipeIdを共有
type recipeIdtype = {
    selectingTogether:boolean;
    togetherRecipeId : string[];
    setSelectingTogether:(selecting:boolean)=>void;
    addTogetherRecipeId :( addRecipeId : string) => void;
}
export const cookRecipeTogether = create<recipeIdtype>((set)=>({
    selectingTogether :false,
    togetherRecipeId:[],
    setSelectingTogether : (selecting) => set({ selectingTogether : selecting }),
    addTogetherRecipeId : ( addRecipeId : string ) =>
        set((state)=> ({
            togetherRecipeId:[...state.togetherRecipeId,addRecipeId]
        }))
}))