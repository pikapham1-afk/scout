"use client";

import { useEffect, useState } from "react";

import MapView from "@/components/MapView";
import BottomBar from "@/components/BottomBar";
import CameraModal from "@/components/CameraModal";

import type { Report } from "@/components/type/report";

import { listenReports } from "@/lib/firestore";

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = listenReports((data) => {
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
      <MapView reports={reports} />

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