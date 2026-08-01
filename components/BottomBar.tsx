"use client";

import {
  Camera,
  House,
  User,
} from "lucide-react";

interface Props {

  onCamera: () => void;

}

export default function BottomBar({

  onCamera,

}: Props) {

  return (

    <div
      className="
      fixed
      bottom-5
      left-1/2
      z-[900]
      flex
      -translate-x-1/2
      items-center
      gap-5
      rounded-full
      bg-white
      px-6
      py-3
      shadow-2xl
      "
    >

      <button
        className="
        text-gray-600
        transition
        hover:text-green-600
        "
      >

        <House
          size={26}
        />

      </button>

      <button

        onClick={onCamera}

        className="
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        bg-green-600
        text-white
        shadow-lg
        transition
        hover:scale-105
        hover:bg-green-700
        active:scale-95
        "

      >

        <Camera
          size={30}
        />

      </button>

      <button
        className="
        text-gray-600
        transition
        hover:text-green-600
        "
      >

        <User
          size={26}
        />

      </button>

    </div>

  );

}