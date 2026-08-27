"use client";

/**
 * VẼ MÃ QR LÊN CANVAS.
 *
 * Phần tính toán (lưới ô đen/trắng) nằm trọn ở `modules/core/gia-dinh/qr.ts` — tầng lõi,
 * hàm thuần, test được không cần trình duyệt. File này chỉ đổ lưới đó ra pixel.
 *
 * 🔴 VIỀN TRẮNG 4 Ô LÀ BẮT BUỘC, không phải trang trí. Chuẩn gọi nó là "vùng yên tĩnh";
 * thiếu nó thì máy quét không tìm ra mép mã và mã trông vẫn đẹp nhưng không quét được.
 */

import { useEffect, useRef } from "react";

import { veLuoiQr } from "@modules/core/gia-dinh/qr";

const VIEN_TRANG = 4;

export function MaQr({ chuoi, canhO = 8 }: { readonly chuoi: string; readonly canhO?: number }) {
  const khungRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const khung = khungRef.current;
    if (!khung) return;
    const but = khung.getContext("2d");
    if (!but) return;

    let luoi: boolean[][];
    try {
      luoi = veLuoiQr(chuoi);
    } catch {
      // Chuỗi vượt tầm mã QR — thà không vẽ gì còn hơn vẽ một mã quét ra nửa hồ sơ.
      return;
    }

    const canh = (luoi.length + VIEN_TRANG * 2) * canhO;
    khung.width = canh;
    khung.height = canh;

    but.fillStyle = "#FFFFFF";
    but.fillRect(0, 0, canh, canh);
    but.fillStyle = "#000000";
    for (let hang = 0; hang < luoi.length; hang += 1) {
      for (let cot = 0; cot < luoi.length; cot += 1) {
        if (!luoi[hang][cot]) continue;
        but.fillRect((cot + VIEN_TRANG) * canhO, (hang + VIEN_TRANG) * canhO, canhO, canhO);
      }
    }
  }, [chuoi, canhO]);

  return (
    <canvas
      ref={khungRef}
      data-thu="ma-qr"
      role="img"
      aria-label={`Mã QR của chuỗi ${chuoi}`}
      className="max-w-full"
    />
  );
}
