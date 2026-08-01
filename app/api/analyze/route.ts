import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const { image, caption } = await req.json();

    console.log("📷 Image:", !!image);
    console.log("💬 Caption:", caption);

    const text = (caption || "").toLowerCase();

    let summary = "";
    let conditions: string[] = [];
    let confidence = 95;

    // NẮNG

    if (
      text.includes("nắng") ||
      text.includes("mặt trời") ||
      text.includes("sun")
    ) {

      summary =
        "Scout AI xác nhận khu vực có thời tiết nắng.";

      conditions = [
        "☀️ Nắng",
        "🌡 Nhiệt độ cao",
      ];

      confidence = 98;

    }

    // MƯA

    else if (
      text.includes("mưa") ||
      text.includes("rain")
    ) {

      summary =
        "Scout AI phát hiện khu vực đang có mưa.";

      conditions = [
        "🌧 Mưa",
        "☁️ Nhiều mây",
      ];

      confidence = 97;

    }

    // NGẬP

    else if (
      text.includes("ngập") ||
      text.includes("lụt")
    ) {

      summary =
        "Scout AI phát hiện khu vực có dấu hiệu ngập.";

      conditions = [
        "🌊 Ngập",
        "🚗 Di chuyển khó khăn",
      ];

      confidence = 98;

    }

    // GIÓ

    else if (
      text.includes("gió")
    ) {

      summary =
        "Scout AI phát hiện gió mạnh.";

      conditions = [
        "💨 Gió mạnh",
      ];

      confidence = 95;

    }

    // SƯƠNG

    else if (
      text.includes("sương")
    ) {

      summary =
        "Scout AI phát hiện sương mù.";

      conditions = [
        "🌫 Sương mù",
      ];

      confidence = 94;

    }

    // KẸT XE

    else if (
      text.includes("kẹt") ||
      text.includes("tắc")
    ) {

      summary =
        "Scout AI phát hiện ùn tắc giao thông.";

      conditions = [
        "🚗 Kẹt xe",
      ];

      confidence = 96;

    }

    // CÂY ĐỔ

    else if (
      text.includes("cây")
    ) {

      summary =
        "Scout AI phát hiện cây đổ hoặc cản trở giao thông.";

      conditions = [
        "🌳 Cây đổ",
      ];

      confidence = 95;

    }

    // MẶC ĐỊNH

    else {

      summary =
        "Scout AI chưa phát hiện hiện tượng nổi bật.";

      conditions = [
        "🌤 Thời tiết ổn định",
      ];

      confidence = 90;

    }

    return NextResponse.json({

      valid: true,

      summary,

      conditions,

      confidence,

    });

  }

  catch (error) {

    console.error(error);

    return NextResponse.json(

      {
        valid: false,
        error: "Scout AI Error",
      },

      {
        status: 500,
      }

    );

  }

}