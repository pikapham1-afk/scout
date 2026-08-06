"use client";

import { addReport } from "@/lib/firestore";

import { useEffect, useRef, useState } from "react";

import type { Report } from "./type/report";

interface Props {

  open: boolean;

  onClose: () => void;

}

type Step =
  | "camera"
  | "loading"
  | "confirm";

export default function CameraModal({

  open,

  onClose,

}: Props) {

  const videoRef =

    useRef<HTMLVideoElement>(null);

  const canvasRef =

    useRef<HTMLCanvasElement>(null);

  const [stream, setStream] =

    useState<MediaStream | null>(null);

  const [step, setStep] =

    useState<Step>("camera");

  const [preview, setPreview] =

    useState("");

    const [caption, setCaption] =

    useState("");

    const WEATHER_OPTIONS = [
  "☀️ Nắng",
  "☁️ Nhiều mây",
  "🌧 Mưa",
  "⛈ Giông",
  "🌫 Sương mù",
  "💨 Gió mạnh",
  "🌊 Ngập",
  "🚗 Kẹt xe",
  "🌳 Cây đổ",
  "⚠️ Đường trơn",
  "🔥 Nắng nóng",
  "❄️ Lạnh",
];

  const [conditions, setConditions] =

    useState<string[]>([]);

    const [selectedConditions, setSelectedConditions] =
  useState<string[]>([]);

  const [confidence, setConfidence] =

    useState(0);

  const [latitude, setLatitude] =

    useState<number | null>(null);

  const [longitude, setLongitude] =

    useState<number | null>(null);

  async function startCamera() {

    try {

      const media =

        await navigator.mediaDevices.getUserMedia({

          video: {

            facingMode: "environment",

          },

          audio: false,

        });

      

      setStream(media);

      if (videoRef.current) {

        videoRef.current.srcObject = media;

      }

    } catch {

      alert("Không thể mở camera.");

    }

  }

  function stopCamera() {

    stream?.getTracks().forEach((track) => {

      track.stop();

    });

  }

  function getLocation() {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(

          position.coords.latitude

        );

        setLongitude(

          position.coords.longitude

        );

      },

      () => {

        console.log(

          "Không lấy được GPS"

        );

      },

      {

        enableHighAccuracy: true,

      }

    );

  }

  function resetState() {

    stopCamera();

    setPreview("");

    setCaption("");

    setConditions([]);

     setSelectedConditions([]);

    setConfidence(0);

    setStep("camera");

  }
    useEffect(() => {

    if (open) {

      resetState();

      startCamera();

      getLocation();

    }

    return () => {

      stopCamera();

    };

  }, [open]);

  async function capture() {

    if (
      !videoRef.current ||
      !canvasRef.current
    ) {

      return;

    }

    const video = videoRef.current;

    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {

      return;

    }

    context.drawImage(

      video,

      0,

      0,

      canvas.width,

      canvas.height

    );

    const image =

      canvas.toDataURL(

        "image/jpeg",

        0.9

      );

    setPreview(image);

    stopCamera();

    await analyze(image);

  }

  async function retake() {

    resetState();

    await startCamera();

  }

  async function analyze(
    image: string
  ) {

    try {

      setStep("loading");

      const response =

      
        await fetch(

          "/api/analyze",

          {

            method: "POST",

            headers: {

              "Content-Type":

                "application/json",

            },

            body: JSON.stringify({

              image,

              caption,

            }),

          }

        );

      const text =
        await response.text();

      const data =
        text
          ? JSON.parse(text)
          : {};

      if (!response.ok) {

        alert(

          data.error ??

            "Scout AI không phản hồi."

        );

        await retake();

        return;

      }

     const aiConditions =

  Array.isArray(data.conditions)

    ? data.conditions

    : [];

setConditions(aiConditions);

// 🤖 AI tự tick sẵn
setSelectedConditions(aiConditions);

setConfidence(

  typeof data.confidence === "number"

    ? data.confidence

    : 0

);
      setStep("confirm");

    } catch (error) {

      console.error(error);

      alert(

        "Không thể kết nối tới Scout AI."

      );

      await retake();

    }

  }
    async function upload() {

    if (
      latitude === null ||
      longitude === null
    ) {

      alert("Không lấy được vị trí.");

      return;

    }

    try {

    const now = Date.now();

const report = {
  image: preview,
  caption,
 conditions: selectedConditions,
  confidence,
  latitude,
  longitude,
  createdAt: now,
  expiresAt: now + 60 * 60 * 1000, // Hết hạn sau 1 giờ
};

      console.log("📤 Report:", report);

      await addReport(report);

      console.log("✅ Đã ghi Firestore");

      alert("🚀 Đã đăng lên bản đồ");

      stopCamera();

      resetState();

      onClose();

    } catch (error) {

      console.error(
        "❌ Firestore Error:",
        error
      );

      alert(
        "Không thể đăng báo cáo."
      );

    }

  }

  function save() {

   const report: Report = {

  id: crypto.randomUUID(),

  image: preview,

  caption,

  conditions: selectedConditions,

  confidence,

  latitude: latitude ?? 0,

  longitude: longitude ?? 0,

  createdAt: Date.now(),

  expiresAt: Date.now() + 60 * 60 * 1000,

};

    console.log(
      "📁 SAVE:",
      report
    );

    alert(
      "📁 Đã lưu cá nhân"
    );

  }

  if (!open) {

    return null;

  }

  return (

    <div
      className="
      fixed
      inset-0
      z-[999]
      flex
      items-center
      justify-center
      bg-black/70
      "
    >

      <div
        className="
        relative
        w-[380px]
        rounded-2xl
        bg-white
        p-5
        shadow-xl
        "
      >

        <button

          onClick={() => {

            stopCamera();

            resetState();

            onClose();

          }}

          className="
          absolute
          right-4
          top-4
          h-9
          w-9
          rounded-full
          bg-gray-100
          text-xl
          font-bold
          text-gray-600
          hover:bg-red-500
          hover:text-white
          "

        >

          ✕

        </button>
                {step === "camera" && (

          <>

            <video

              ref={videoRef}

              autoPlay

              playsInline

              className="
              w-full
              rounded-xl
              bg-black
              "

            />

            <button

              onClick={capture}

              className="
              mt-4
              w-full
              rounded-xl
              bg-green-600
              py-3
              text-white
              hover:bg-green-700
              "

            >

              📷 Chụp ảnh

            </button>

            <button

              onClick={() => {

                stopCamera();

                resetState();

                onClose();

              }}

              className="
              mt-3
              w-full
              rounded-xl
              bg-red-500
              py-3
              text-white
              hover:bg-red-600
              "

            >

              ❌ Hủy

            </button>

          </>

        )}

        {step === "loading" && (

          <div
            className="
            flex
            flex-col
            items-center
            justify-center
            py-16
            "
          >

            <div
              className="
              h-12
              w-12
              animate-spin
              rounded-full
              border-4
              border-green-500
              border-t-transparent
              "
            />

            <p
              className="
              mt-6
              text-lg
              font-semibold
              "
            >

              🤖 Scout AI đang phân tích...

            </p>

          </div>

        )}

        {step === "confirm" && (

  <div
    style={{
      opacity: 1,
      filter: "none",
      color: "#000",
    }}
  >

           <div className="relative">

  <img
    src={preview}
    alt=""
    className="
w-full
max-h-[42vh]
object-cover
rounded-xl
shadow
"
  />

  <div
    className="
      absolute
      bottom-0
      left-0
      right-0
      rounded-b-xl
      bg-gradient-to-t
      from-black/70
      to-transparent
      p-4
    "
  >

    <textarea

      value={caption}

      onChange={(e)=>
        setCaption(e.target.value)
      }

      placeholder="Thêm mô tả..."

      rows={2}

      className="
        w-full
        resize-none
        bg-transparent
        text-white
        placeholder:text-gray-300
        outline-none
      "

    />

  </div>

</div>

            <h2
              className="
              mt-4
              text-xl
              font-bold
              "
            >

              🤖 Scout AI

            </h2>

            <div
              className="
              mt-4
              space-y-2
              "
            >

              {conditions.map(

                (condition, index) => (

                  <div

                    key={index}

                    className="
                    rounded-lg
                    bg-green-50
                    p-3
                    "

                  >

                    {condition}

                  </div>

                )

              )}

            </div>

            <div
  className="
  mt-4
  rounded-lg
  bg-blue-50
  p-3
  "
>

  ⭐ Độ tin cậy <b>{confidence}%</b>

</div>

<div className="mt-4">

  <p className="mb-2 font-semibold">
    🌤 Chỉnh sửa nếu AI sai
  </p>

  <div
    className="
    flex
    gap-2
    overflow-x-auto
    pb-2
    "
  >

    {WEATHER_OPTIONS.map((item) => {

      const active =
        selectedConditions.includes(item);

      return (

        <button
          key={item}
          onClick={() => {

            if (active) {

              setSelectedConditions(
                selectedConditions.filter(
                  (x) => x !== item
                )
              );

            } else {

              setSelectedConditions([
                ...selectedConditions,
                item,
              ]);

            }

          }}
          className={`whitespace-nowrap rounded-full px-3 py-2 border transition ${
            active
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300"
          }`}
        >
          {item}
        </button>

      );

    })}

  </div>

</div>

<button

  onClick={retake}

  className="
  mt-4
  w-full
  rounded-xl
  bg-yellow-500
  py-3
  text-white
  hover:bg-yellow-600
  "

>

  🔄 Chụp lại

</button>

<div className="mt-3 grid grid-cols-2 gap-3">

  <button

    onClick={save}

    className="
    rounded-xl
    bg-gray-200
    py-3
    font-semibold
    hover:bg-gray-300
    "

  >

    📁 Lưu

  </button>

  <button

    onClick={upload}

    className="
    rounded-xl
    bg-green-600
    py-3
    font-semibold
    text-white
    hover:bg-green-700
    "

  >

    🚀 Đăng

  </button>

</div>

          </div>

        )}

        <canvas

          ref={canvasRef}

          className="hidden"

        />

      </div>

    </div>

  );

}