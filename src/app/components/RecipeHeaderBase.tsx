"use client";
import React, { ReactElement } from "react";

type headerBaseprops = {
  title: string;
  bgColor: string;
  backPageArrow: ReactElement;
  displayGuideButtun?: ReactElement;
};

const RecipeHeaderBase = ({
  title,
  bgColor,
  backPageArrow,
  displayGuideButtun,
}: headerBaseprops) => {
  return (
    <header
      className={`shadow-mdz-40 z-20 bg-${bgColor} sticky top-0 flex min-h-[69px] w-full items-center border-b border-gray-400 p-5`}
    >
      {backPageArrow}
      <p
        className={`flex-1 truncate pl-10 pr-11 text-center text-xl font-semibold`}
      >
        {title}
      </p>
      {displayGuideButtun && displayGuideButtun}
    </header>
  );
};

export default RecipeHeaderBase;
