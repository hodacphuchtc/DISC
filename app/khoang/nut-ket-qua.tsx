"use client";

/**
 * BỐN NÚT HÀNH ĐỘNG của màn kết quả — tách khỏi `ket-qua.tsx` để giữ luật
 * "không file > 500 dòng".
 *
 * Cả bốn đều mang `data-khong-in`: giấy không bấm được, in ra là rác.
 */

import { useRef, useState } from "react";

import { CHU_M4, CHU_M6 } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { MaBoDe } from "@modules/core/bo-de/kieu";
import { xoaBai } from "@modules/core/luu-tru/kho-bai";
import { hoFontDangDung, veAnhKetQua } from "@modules/report/xuat-anh";

import { MoiLamNot, useDoiChieu } from "./vung-lech";

/**
 * 🔴 QĐ7 — MÁY DÙNG CHUNG.
 * Kênh "giáo viên đưa tận tay" nghĩa là một máy đi qua nhiều gia đình. Không có nút này
 * thì hồ sơ hành vi của từng đứa trẻ cứ tích lại trên một cái máy tính bảng đi mượn.
 */
export function NutKetThucVaXoa({
  idBai,
  onXong,
}: {
  readonly idBai: string;
  readonly onXong: () => void;
}) {
  const [daXoa, datDaXoa] = useState(false);

  async function xoa() {
    if (!window.confirm(CHU_M6.hoiXoaBai)) return;
    await xoaBai(idBai);
    datDaXoa(true);
    onXong();
  }

  if (daXoa) {
    return (
      <p role="status" className="basis-full text-[13px] text-neutral-600">
        {CHU_M6.daXoaBai}
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void xoa()}
      className="min-h-[48px] rounded-xl px-4 text-[14px] text-neutral-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: MAU.timCongNghe }}
    >
      {CHU_M6.nutKetThucVaXoa}
    </button>
  );
}

export function NutTaiAnh({
  noiDung,
  tenTep,
}: {
  readonly noiDung: Parameters<typeof veAnhKetQua>[1];
  readonly tenTep: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dangVe, datDangVe] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [biCat, datBiCat] = useState(false);

  async function taiVe() {
    const canvas = canvasRef.current;
    if (!canvas || dangVe) return;
    datDangVe(true);
    datLoi(null);
    try {
      const { anh, ketQua } = await veAnhKetQua(canvas, noiDung, hoFontDangDung());
      datBiCat(ketQua.biCat);
      const url = URL.createObjectURL(anh);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tenTep}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      datLoi(e instanceof Error ? e.message : CHU_M4.loiVeAnh);
    } finally {
      datDangVe(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void taiVe()}
        disabled={dangVe}
        className="min-h-[48px] rounded-xl px-6 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
        style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
      >
        {dangVe ? CHU_M4.dangVeAnh : CHU_M4.nutTaiAnh}
      </button>
      {/* Canvas ẩn — chỉ là mặt bàn để vẽ, không phải thứ người dùng nhìn. */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      {biCat && (
        <p role="status" className="basis-full text-[13px] text-amber-800">
          {CHU_M4.anhBiCat}
        </p>
      )}
      {loi && (
        <p role="alert" className="basis-full text-[13px] text-red-700">
          {loi}
        </p>
      )}
    </>
  );
}

/**
 * 🔴 QĐ6 — CHUYỀN TAY CHỦ ĐỘNG.
 *
 * Vùng lệch ghép cặp trong IndexedDB CÙNG MỘT TRÌNH DUYỆT. Nếu để phụ huynh tự đi tìm
 * màn đối chiếu thì mũi nhọn của sản phẩm không bao giờ bật lên — và KHÔNG CÓ GÌ BÁO ĐỎ,
 * vì mọi thứ vẫn "chạy đúng". Nên ngay sau kết quả, nói thẳng còn thiếu bài nào.
 */
export function KhoiChuyenTay({
  maTre,
  onXem,
  onLamBo,
}: {
  readonly maTre: string;
  readonly onXem: (maTre: string) => void;
  readonly onLamBo: (ma: MaBoDe) => void;
}) {
  const { ketQua } = useDoiChieu(maTre);
  if (!ketQua) return null;

  if (ketQua.ghepDuoc) {
    return (
      <button
        type="button"
        onClick={() => onXem(maTre)}
        className="min-h-[48px] w-full rounded-xl border-l-4 px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ backgroundColor: MAU.timRatNhat, borderColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
      >
        <span className="block text-[15px] font-semibold" style={{ color: MAU.timCongNghe }}>
          Xem hai góc nhìn về {maTre}
        </span>
        <span className="mt-0.5 block text-[13px] text-neutral-700">
          Đã đủ cả bài của con và bài của bố mẹ.
        </span>
      </button>
    );
  }

  return <MoiLamNot lyDo={ketQua.lyDo} onLamBo={onLamBo} />;
}

export function NutLamLai({ onLamLai }: { readonly onLamLai: () => void }) {
  return (
    <button
      type="button"
      onClick={onLamLai}
      className="min-h-[48px] rounded-xl border border-neutral-300 px-5 text-[15px] font-medium text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: MAU.timCongNghe }}
    >
      {CHU_M4.nutLamLai}
    </button>
  );
}

/**
 * NÚT IN — một nút khi trang chỉ có một người đọc, hai nút khi có hai.
 *
 * 🔴 Cờ `data-in-ban` gắn THẲNG lên `<html>` bằng DOM, KHÔNG qua state React.
 * `window.print()` chặn luồng đồng bộ: đặt state rồi gọi print ngay thì React chưa kịp vẽ
 * lại, và hộp thoại in mở ra với DOM cũ — tức là in nhầm bản, im lặng, không lỗi nào.
 *
 * Gỡ cờ ở `afterprint`. Nếu vì lý do nào đó sự kiện không bắn, cờ nằm lại cũng vô hại:
 * luật dùng nó sống trong `@media print` nên màn hình không đổi gì, và lần in sau luôn
 * ghi đè hoặc gỡ cờ ngay đầu hàm.
 */
export function NutIn({ ban, nhan }: { readonly ban?: "con" | "boMe"; readonly nhan: string }) {
  function in_() {
    const goc = document.documentElement;
    if (ban) goc.setAttribute("data-in-ban", ban);
    else goc.removeAttribute("data-in-ban");

    const don = () => {
      goc.removeAttribute("data-in-ban");
      window.removeEventListener("afterprint", don);
    };
    window.addEventListener("afterprint", don);
    window.print();
  }

  return (
    <button
      type="button"
      onClick={in_}
      className="min-h-[48px] rounded-xl border border-neutral-300 px-5 text-[15px] font-medium text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: MAU.timCongNghe }}
    >
      {nhan}
    </button>
  );
}
