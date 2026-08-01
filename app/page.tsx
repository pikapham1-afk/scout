"use client";

import { useEffect, useState } from "react";

import MapView from "@/components/MapView";
import BottomBar from "@/components/BottomBar";
import CameraModal from "@/components/CameraModal";

import type { Report } from "@/components/type/report";

import { listenReports } from "@/lib/firestore";

export default function Home() {

 useEffect(() => {

  alert("HOME");

}, []);

  const [reports, setReports] = useState<Report[]>([]);

  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {

    alert("Home mounted");

    const unsubscribe = listenReports((data) => {

      alert("Reports: " + data.length);

      setReports(data as Report[]);

    });

    return () => {

      unsubscribe();

    };

  }, []);

  return (

    <main
      className="
      h-screen
      w-screen
      overflow-hidden
      "
    >

      <div
        className="
        fixed
        top-4
        left-4
        z-[9999]
        rounded
        bg-white
        p-2
        shadow
        "
      >
        Reports: {reports.length}
      </div>

      <MapView
        reports={reports}
      />

      <BottomBar
        onCamera={() => {

          setCameraOpen(true);

        }}
      />

      <CameraModal
        open={cameraOpen}
        onClose={() => {

          setCameraOpen(false);

        }}
      />

    </main>

  );

}