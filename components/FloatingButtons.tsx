"use client";

import { useState } from "react";
import CameraModal from "./CameraModal";

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="absolute right-5 bottom-28 z-[1000] flex flex-col gap-4">

        <button
          className="w-14 h-14 rounded-full bg-white shadow-xl"
        >
          📍
        </button>

        <button
          onClick={() => setOpen(true)}
          className="w-16 h-16 rounded-full bg-green-600 text-white text-3xl shadow-xl"
        >
          📷
        </button>

        <button
          className="w-14 h-14 rounded-full bg-blue-600 text-white"
        >
          🤖
        </button>

      </div>

      <CameraModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}