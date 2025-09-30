import { Recipe } from "@/app/types";
import { supabase } from "../supabase";
import { getCurrentUserID } from "../supabaseFunctionsNew";

const ramdomFetchedIds: number[] = [];
const fetchedIdsMap = new Map<string, number[]>();
let favoriteFetchedIds: number[] = [];
let searchFavFeatchedIds: number[] = [];

export const free_favoriteFetchedId = () => (favoriteFetchedIds = []);
export const free_searchFavFeatchedIds = () => (searchFavFeatchedIds = []);

export const randomFetcher = async () => {
  const { data, error } = await supabase.rpc("get_random_recipes", {
    count: 10,
    exclude_ids: ramdomFetchedIds, // 取得済みID
  });
  if (error) throw error;
  if (data) {
    const newIds = data.map((r: Recipe) => r.id);
    ramdomFetchedIds.push(...newIds);
  }
  return data ?? ([] as Recipe[]);
};

export const searchFeatcher = async (key: string) => {
  const kw = key.substring(key.indexOf("-") + 1, key.lastIndexOf("-"));

  if (!fetchedIdsMap.has(kw)) {
    fetchedIdsMap.set(kw, []);
  }

  const { data, error } = await supabase.rpc("get_random_recipes_keyword", {
    count: 10,
    exclude_ids: fetchedIdsMap.get(kw),
    keyword: kw,
  });

  if (error) throw error;
  if (data) {
    const newIds = data.map((r: Recipe) => r.id);
    fetchedIdsMap.get(kw)!.push(...newIds);
  }
  return data ?? ([] as Recipe[]);
};

export const favoriteFetcher = async (): Promise<Recipe[]> => {
  const { data, error } = await supabase.rpc("get_favorite_recipes", {
    count: 10,
    exclude_ids: favoriteFetchedIds, // 取得済みID
    target_user_id: await getCurrentUserID(),
  });
  if (data) {
    const newIds = data.map((r: Recipe) => r.id);
    favoriteFetchedIds.push(...newIds);
  }
  if (error) console.error(error);
  return data ?? ([] as Recipe[]);
};

export const searchFavFeatcher = async (key: string): Promise<Recipe[]> => {
  const kw = key.substring(key.indexOf("-") + 1, key.lastIndexOf("-"));
  const { data, error } = await supabase.rpc("get_favorite_recipes", {
    count: 10,
    exclude_ids: searchFavFeatchedIds, // 取得済みID
    target_user_id: await getCurrentUserID(),
    keyword: kw,
  });
  if (data) {
    const newIds = data.map((r: Recipe) => r.id);
    searchFavFeatchedIds.push(...newIds);
  }
  if (error) console.error(error);
  return data ?? ([] as Recipe[]);
};
