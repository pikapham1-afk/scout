"use client";

import { useState } from "react";

interface Props {
  onSearch: (keyword: string) => void;
}

export default function SearchBar({
  onSearch,
}: Props) {

  const [keyword, setKeyword] = useState("");

  return (

    <div
      className="
      absolute
      top-4
      left-1/2
      z-[999]
      flex
      -translate-x-1/2
      gap-2
      "
    >

      <input
        value={keyword}
        onChange={(e) =>
          setKeyword(e.target.value)
        }
        onKeyDown={(e) => {

          if (e.key === "Enter") {

            onSearch(keyword);

          }

        }}
        placeholder="🔍 Hỏi Scout..."
        className="
        w-80
        rounded-full
        border
        bg-white
        px-5
        py-3
        shadow
        outline-none
        "
      />

      <button

        onClick={() => onSearch(keyword)}

        className="
        rounded-full
        bg-blue-600
        px-5
        text-white
        shadow
        "

      >

        Tìm

      </button>

    </div>

  );

}