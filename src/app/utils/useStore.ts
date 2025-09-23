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
    selecting:boolean;
    recipeId : string[];
    setRecipeId :( addRecipeId : string) => void;
}
export const selectingRecipeStore = create<recipeIdtype>((set)=>({
    selecting :false,
    recipeId:[],
    setRecipeId : ( addRecipeId : string ) =>
        set((state)=> ({
            recipeId:[...state.recipeId,addRecipeId]
        }))
}))