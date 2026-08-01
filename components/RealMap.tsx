"use client";

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
  const [searchPosition, setSearchPosition] = useState<
  [number, number] | null
>(null);
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

  } catch {

    alert("Không thể tìm kiếm.");

  }

}

 return (

  <>

    <SearchBar
      onSearch={searchLocation}
    />

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

      {reports.map((item) => (

       <Marker
  key={item.id}
  position={[
    Number(item.latitude),
    Number(item.longitude),
  ]}
>

<Popup>

  <div className="w-64">

    <img
      src={item.image}
      alt="Weather"
      className="w-full rounded-xl shadow"
    />

    {/* Caption */}

    <div className="mt-3 rounded-lg bg-gray-100 p-3">

      <div className="text-xs font-bold text-gray-500">
        👤 Người dùng
      </div>

      <div className="mt-1 text-sm">
        {item.caption}
      </div>

    </div>

    {/* AI */}

    <h2 className="mt-4 text-lg font-bold">
      🤖 Scout AI
    </h2>

    <div className="mt-3 space-y-2">

      {item.conditions.map((condition, index) => (

        <div
          key={index}
          className="rounded-lg bg-green-50 p-2"
        >
          {condition}
        </div>

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

      ))}

    </MapContainer>

</>

);

}