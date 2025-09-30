"use client";

import Footer from "@/app/components/Footer";
import UserProfile from "../../UserProfile";
import UserRecipeList from "../../UserRecipeList";
import useSWR from "swr";
import { getOtherUserPage } from "../../getPageElements";
import { notFound } from "next/navigation";
import Loading from "@/app/loading";
import UserHeader from "../../UserHeader";

const UserId = ({ params }: { params: { user_id: string } }) => {
  const {
    data: pageElements,
    error,
    isLoading,
  } = useSWR(`${params.user_id}`, getOtherUserPage, {
    revalidateOnFocus: false, // windowをフォーカスすると再検証しない
  });

  if (error) {
    switch (error.status) {
      case 404:
        notFound();
        break;
      default:
        throw error;
    }
  }

  if (isLoading || !pageElements) return <Loading />;

  return (
    <div>
      <div className="flex min-h-screen flex-col bg-[#FFFBF4]">
        <UserHeader showBack />
        <section className="flex justify-between bg-white p-3">
          <UserProfile
            name={pageElements.profile.name}
            avatar={pageElements.profile.avatar_url}
          />
        </section>
        <p className="mb-4 mt-8 pl-2 text-xl font-semibold">レシピ一覧</p>
        <section className="mx-2 rounded-xl bg-white">
          <UserRecipeList
            user_id={params.user_id}
            userRecipe={pageElements.created_recipes}
            pageType="other"
          />
        </section>
      </div>
      <Footer pathName="/" />
    </div>
  );
};

export default UserId;
