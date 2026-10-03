"use client";

import { useRef } from "react";


import SearchBar from "./SearchBar";

import { useEffect, useState } from "react";

import {
  MapContainer,
  Marker,
  Popup,
  Circle,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
const weatherIcon = (emoji: string) =>
  L.divIcon({
    html: `
      <div
        style="
          font-size:32px;
          line-height:32px;
          text-align:center;
          filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));
        "
      >
        ${emoji}
      </div>
    `,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
const searchIcon = new L.Icon({

  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41],

});

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

import "leaflet/dist/leaflet.css";

import type { Report } from "./type/report";

interface Props {
  reports: Report[];
}



function LocateMe({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {

  const map = useMap();

  useEffect(() => {

    map.flyTo(
      [latitude, longitude],
      16,
      {
        duration: 1.5,
      }
    );

  }, [latitude, longitude, map]);

  return null;

}

export default function RealMap({
  reports,
}: Props) {

  const [latitude, setLatitude] = useState(21.0285);
  const [longitude, setLongitude] = useState(105.8542);
  const [selectedReport, setSelectedReport] =

  useState<Report | null>(null);

  const [selectedIndex, setSelectedIndex] =

  useState(0);
  const [searchPosition, setSearchPosition] = useState<
  [number, number] | null
>(null);
const [areaReports, setAreaReports] =
  useState<Report[]>([]);
  const weatherStats = areaReports.reduce(

  (acc, report) => {

    report.conditions.forEach((condition) => {

      acc[condition] = (acc[condition] || 0) + 1;

    });

    return acc;

  },

  {} as Record<string, number>

);
const totalConditions = Object.values(weatherStats).reduce(
  (a, b) => a + b,
  0
);
const [searchMarker, setSearchMarker] =
  useState<[number, number] | null>(null);
const [searchKeyword, setSearchKeyword] =
  useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {

    if (!navigator.geolocation) {
      setLoaded(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoaded(true);

      },

      () => {

        setLoaded(true);

      },

      {
        enableHighAccuracy: true,
      }

    );

  }, []);

  useEffect(() => {

    console.clear();

    console.log("========== REPORTS ==========");
    console.log(reports);

    reports.forEach((item) => {

      console.log("ID:", item.id);
      console.log("LAT:", Number(item.latitude));
      console.log("LNG:", Number(item.longitude));

    });

  }, [reports]);

  if (!loaded) {

    async function searchLocation(keyword: string) {

  if (!keyword.trim()) return;

  try {

    const res = await fetch(

      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(keyword)}`

    );

    const data = await res.json();

    if (data.length === 0) {

      alert("Không tìm thấy địa điểm.");

      return;

    }

    const lat = Number(data[0].lat);

    const lon = Number(data[0].lon);

    setSearchPosition([lat, lon]);

    const nearby = reports.filter((r) => {

  const d =
    Math.sqrt(
      Math.pow(Number(r.latitude) - lat, 2) +
      Math.pow(Number(r.longitude) - lon, 2)
    );

  return d < 0.01;
});

setAreaReports(nearby);

setSearchMarker([lat, lon]);

setSearchKeyword(keyword);

  }

  catch {

    alert("Không thể tìm kiếm.");

  }

}

    return (

      <div
        className="
        flex
        h-screen
        items-center
        justify-center
        "
      >
        Đang tải bản đồ...
      </div>
      

    );

  }

  async function searchLocation(keyword: string) {

  if (!keyword.trim()) return;

  try {

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(keyword)}`
    );

    const data = await res.json();

    if (data.length === 0) {

      alert("Không tìm thấy địa điểm.");

      return;

    }

    const lat = Number(data[0].lat);
    const lon = Number(data[0].lon);

    setSearchPosition([lat, lon]);

    const nearby = reports.filter((r) => {

  const d =
    Math.sqrt(
      Math.pow(Number(r.latitude) - lat, 2) +
      Math.pow(Number(r.longitude) - lon, 2)
    );

  return d < 0.01;

});

setAreaReports(nearby);

setSearchMarker([lat, lon]);

setSearchKeyword(keyword);

  } catch {

    alert("Không thể tìm kiếm.");

  }

}

 return (

  <>

    <SearchBar
      onSearch={searchLocation}
    />
{areaReports.length > 0 && (

  <div
    className="
    absolute
    top-20
    left-4
    z-[1000]
    w-80
    rounded-2xl
    bg-white
    p-4
    shadow-xl
    "
  >

<div className="flex items-center justify-between">

  <h2 className="text-xl font-extrabold tracking-tight">
    📊 Báo cáo khu vực
  </h2>

  <button
    onClick={() => {
      setAreaReports([]);
      setSearchMarker(null);
      setSearchKeyword("");
    }}
    className="rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-600"
  >
    ✕
  </button>

</div>
    

    <p className="mt-1 text-sm text-gray-500">
      {searchKeyword}
    </p>

    <p className="mt-2 text-sm">
      {areaReports.length} báo cáo
    </p>

    <div className="mt-4 space-y-2">

      {Object.entries(weatherStats).map(([weather, count]) => (

        <div
          key={weather}
          className="
          flex
          justify-between
          rounded-lg
          bg-gray-100
          px-3
          py-2
          "
        >

          <span>{weather}</span>

          <b>

            {Math.round(
              (count / totalConditions) * 100
            )}%

          </b>

        </div>

      ))}

    </div>

  </div>

  

)}
{selectedReport && (

  <div
    className="
      fixed
      inset-0
      z-[2000]
      flex
      items-center
      justify-center
      bg-black/70
    "
     onClick={() => setSelectedReport(null)}
  >

    <div
      className="
        w-[420px]
        rounded-2xl
        bg-white
        p-4
      "
      onClick={(e) => e.stopPropagation()}
    >
      <button
  onClick={() => setSelectedReport(null)}
  className="
    mt-5
    w-full
    rounded-xl
    bg-red-500
    py-2
    text-white
  "
>
  Đóng
</button>

      <img
        src={selectedReport.image}
        className="w-full rounded-xl"
      />
      <div className="mt-3 flex justify-between">

  <button

    onClick={() => {

      if (selectedIndex === 0) return;

      const sorted = [...areaReports].sort(
        (a, b) =>
          Number(b.createdAt) -
          Number(a.createdAt)
      );

      setSelectedIndex(selectedIndex - 1);

      setSelectedReport(
        sorted[selectedIndex - 1]
      );

    }}

    className="
      rounded-lg
      bg-gray-200
      px-4
      py-2
    "
  >

    ⬅ Trước

  </button>

  <button

    onClick={() => {

      const sorted = [...areaReports].sort(
        (a, b) =>
          Number(b.createdAt) -
          Number(a.createdAt)
      );

      if (
        selectedIndex ===
        sorted.length - 1
      )
        return;

      setSelectedIndex(selectedIndex + 1);

      setSelectedReport(
        sorted[selectedIndex + 1]
      );

    }}

    className="
      rounded-lg
      bg-gray-200
      px-4
      py-2
    "
  >

    Sau ➡

  </button>

</div>
<div className="mt-4">

  <h2 className="font-bold text-lg">
    📷 Báo cáo cộng đồng
  </h2>

  <p className="mt-2">
    {selectedReport.caption}
  </p>

  <div className="mt-3 flex flex-wrap gap-2">

    {selectedReport.conditions.map((c, i) => (

      <span
        key={i}
        className="
          rounded-full
          bg-green-100
          px-3
          py-1
        "
      >
        {c}
      </span>

    ))}

  </div>

  <div className="mt-3">

    ⭐ {selectedReport.confidence}%

  </div>

  <div className="mt-2 text-xs text-gray-500">

    🕒 {new Date(
      Number(selectedReport.createdAt)
    ).toLocaleString()}

  </div>

</div>

      <div className="mt-3">

        <h2 className="font-bold">
          📷 Báo cáo cộng đồng
        </h2>

        <p className="mt-2">
          {selectedReport.caption}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">

          {selectedReport.conditions.map((c, i) => (

            <span
              key={i}
              className="
                rounded-full
                bg-green-100
                px-3
                py-1
              "
            >
              {c}
            </span>

          ))}

        </div>

        <div className="mt-3">

          ⭐ {selectedReport.confidence}%

        </div>

        <div className="mt-2 text-xs text-gray-500">

          🕒 {new Date(Number(selectedReport.createdAt)).toLocaleString()}

        </div>

      </div>

      <button
        onClick={() => setSelectedReport(null)}
        className="
          mt-4
          w-full
          rounded-xl
          bg-red-500
          py-2
          text-white
        "
      >
        Đóng
      </button>

    </div>

  </div>

)}
    <MapContainer
    
      center={[latitude, longitude]}
      zoom={15}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocateMe
  latitude={
    searchPosition
      ? searchPosition[0]
      : latitude
  }
  longitude={
    searchPosition
      ? searchPosition[1]
      : longitude
  }
/>
{searchMarker && (

  <Marker

  position={searchMarker}

  icon={searchIcon}

>

    <Popup>

      <div>

        <h2 className="font-bold text-red-600">
          📍 Kết quả tìm kiếm
        </h2>

        <div className="mt-2">
          {searchKeyword}
        </div>

      </div>

    </Popup>

  </Marker>

)}
{searchPosition && (

  <Marker

  position={searchPosition}

  icon={searchIcon}

>

    <Popup>

      <div>

        <b>📍 Kết quả tìm kiếm</b>

        <br />

        {searchKeyword}

      </div>

    </Popup>

  </Marker>

)}

      {/* Marker của bạn */}

     <Marker
  position={[latitude, longitude]}
>

        <Popup>

          📍 Bạn đang ở đây

        </Popup>

      </Marker>

      {/* Marker Firestore */}

      {reports.map((item) => {

  console.log(item.conditions);

  return (

    <Marker
      key={item.id}
      position={[
        Number(item.latitude),
        Number(item.longitude),
      ]}
      icon={weatherIcon(item.conditions[0])}
    >

<Popup>

  <div className="w-64">

   <div className="relative">

  <img
    src={item.image}
    alt="Weather"
    className="w-full rounded-xl shadow"
  />
  <p className="mt-2 text-center text-sm text-gray-500">
  {selectedIndex + 1} / {areaReports.length}
</p>

  {item.caption && (

    <div
      className="
      absolute
      bottom-0
      left-0
      right-0
      rounded-b-xl
      bg-gradient-to-t
      from-black/80
      via-black/40
      to-transparent
      p-3
      "
    >

      <p
        className="
        text-sm
        font-medium
        text-white
        "
      >
        {item.caption}
      </p>

    </div>

  )}

</div>

    {/* AI */}

    <h2 className="mt-4 text-lg font-bold">
      🤖 Scout AI
    </h2>

   <div className="mt-3 flex flex-wrap gap-2">

  {item.conditions.map((condition, index) => (

    <span

      key={index}

      className="
      rounded-full
      bg-green-100
      px-3
      py-1
      text-sm
      font-medium
      "

    >

      {condition}

    </span>

  ))}

</div>

    <div className="mt-3 rounded-lg bg-blue-50 p-2">

      ⭐ Độ tin cậy <b>{item.confidence}%</b>

    </div>

    <div className="mt-3 text-xs text-gray-500">

      🕒 {new Date(Number(item.createdAt)).toLocaleString()}

    </div>

  </div>

</Popup>

      </Marker>

  );

})}

    </MapContainer>

    {areaReports.length > 0 && (

  <div
    className="
    absolute
    bottom-6
    left-6
    z-[999]
    w-[280px]
    rounded-2xl
    bg-white
    p-4
    shadow-xl
    "
  >

   <h2 className="text-lg font-bold">

  📊 Báo cáo khu vực

</h2>

<p className="mt-2 text-sm text-gray-500">

  {areaReports.length} báo cáo gần đây

</p>

<div className="mt-4 space-y-2">

  {Object.entries(weatherStats).map(

    ([weather, count]) => (

      <div
        key={weather}
        className="
        flex
        justify-between
        rounded-lg
        bg-gray-100
        px-3
        py-2
        "
      >

        <span>{weather}</span>

        <b>

  {Math.round(

    (count / totalConditions) * 100

  )}%

</b>

      </div>

    )

  )}

</div>
<div className="mt-5">

  <h3 className="mb-3 text-lg font-extrabold">
    📷 Ảnh cộng đồng
  </h3>

  <div className="grid grid-cols-3 gap-2">

    {areaReports
      .sort(
        (a, b) =>
          Number(b.createdAt) -
          Number(a.createdAt)
      )
      .map((item) => (

  <img
  key={item.id}
  src={item.image}
  alt=""
  onClick={() => {

  const sorted = [...areaReports].sort(
    (a, b) =>
      Number(b.createdAt) -
      Number(a.createdAt)
  );

  setSelectedIndex(
    sorted.findIndex((r) => r.id === item.id)
  );

  setSelectedReport(item);

}}
  className="
    aspect-square
    w-full
    cursor-pointer
    rounded-lg
    object-cover
    shadow
    hover:scale-105
    transition
  "
/>

      ))}

  </div>

</div>

  </div>

)}

</>

);

}