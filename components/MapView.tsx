"use client";

import dynamic from "next/dynamic";

import type { Report } from "./type/report";

const RealMap = dynamic(
  () => import("./RealMap"),
  {
    ssr: false,
    loading: () => (
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
    ),
  }
);

interface Props {
  reports: Report[];
}

export default function MapView({
  reports,
}: Props) {

  return (

    <div
      className="
      h-screen
      w-screen
      "
    >

      <RealMap
        reports={reports}
      />

    </div>

  );

}