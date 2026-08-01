"use client";

import { useMap } from "react-leaflet";

export default function LocateButton() {
  const map = useMap();

  const locate = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ GPS.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        map.flyTo([lat, lng], 18, {
          duration: 1.5,
        });
      },
      () => {
        alert("Không thể lấy vị trí.");
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <button
      onClick={locate}
      className="
      absolute
      bottom-28
      left-5
      z-[1000]
      w-12
      h-12
      rounded-full
      bg-white
      shadow-xl
      text-2xl
      hover:scale-105
      transition
      "
    >
      📍
    </button>
  );
}