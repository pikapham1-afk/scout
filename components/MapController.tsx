"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface Props {
  position: [number, number];
}

export default function MapController({ position }: Props) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 17, {
      duration: 1.5,
    });
  }, [position, map]);

  return null;
}