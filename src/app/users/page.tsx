"use client";
import Footer from "@/app/components/Footer";
import UserProfile from "./UserProfile";
import UserRecipeList from "./UserRecipeList";
import UserLogoutButton from "./UserLogoutButton";
import useSWR from "swr";
import { getMyPage } from "./getPageElements";
import Loading from "../loading";
import UserHeader from "./UserHeader";

const UserId = () => {
  const { data: pageElements, error } = useSWR("/userPage", getMyPage, {
    revalidateOnFocus: false, // windowをフォーカスすると再検証しない
  });

  if (error) return <div>{error}</div>;
  if (!pageElements) return <Loading />;

  return (
    <div>
      <div className="flex min-h-screen flex-col bg-[#FFFBF4] text-black">
        <UserHeader />
        <section className="flex justify-between bg-white p-3">
          <UserProfile
            name={pageElements.profile.name}
            avatar={pageElements.profile.avatar_url}
          />
          <UserLogoutButton />
        </section>
        <p className="mb-4 mt-8 pl-2 text-xl font-semibold">マイレシピ一覧</p>
        <UserRecipeList
          user_id={pageElements.user_id}
          userRecipe={pageElements.created_recipes}
          pageType="self"
        />
      </div>
      <Footer pathName="/users" />
    </div>
  );
};

export default UserId;
