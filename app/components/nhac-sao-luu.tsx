"use client";

/**
 * NHẮC SAO LƯU (V4.2) — đúng một lần, đúng khoảnh khắc.
 *
 * 🔴 VÌ SAO Ở ĐÂY, VÌ SAO LÚC NÀY. Mọi thứ nằm trong IndexedDB của một trình duyệt: xoá
 * dữ liệu duyệt web, đổi điện thoại, chế độ ẩn danh — mất sạch, không khôi phục được. Nút
 * sao lưu `.zip` có từ GĐ8 nhưng nằm im ở cuối màn và chưa bao giờ chủ động nhắc.
 *
 * Nhắc khi người THỨ HAI làm xong: đó là khoảnh khắc ĐẦU TIÊN gia đình có thứ đáng để mất.
 * Một bài lẻ thì làm lại mất tám phút; hai bài trở lên là một bức tranh không dựng lại
 * được. Nhắc sớm hơn thì phiền và bị bỏ qua, muộn hơn thì đã có người mất.
 *
 * 🔴 NHẮC MỘT LẦN RỒI THÔI. Nhắc mãi thì nó thành nền, và cái gì thành nền thì không ai
 * đọc — kể cả lần nó quan trọng thật.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useEffect, useState } from "react";

import { CHU_NHAC_SAO_LUU, KHOA_DA_NHAC_SAO_LUU } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { taiBanSaoLuuVeMay } from "@/app/tai-sao-luu";

/** Đã nhắc lần nào chưa. localStorage bị chặn thì coi như CHƯA — thà nhắc thừa còn hơn sót. */
export function daNhacSaoLuu(): boolean {
  try {
    return window.localStorage.getItem(KHOA_DA_NHAC_SAO_LUU) === "1";
  } catch {
    return false;
  }
}

function ghiDaNhac(): void {
  try {
    window.localStorage.setItem(KHOA_DA_NHAC_SAO_LUU, "1");
  } catch {
    // Cửa sổ ẩn danh chặn localStorage — cùng lắm là nhắc lại lần sau, không hại ai.
  }
}

export function NhacSaoLuu({
  hien,
  onDong,
}: {
  /** Đã đủ điều kiện nhắc chưa (người thứ hai vừa làm xong). */
  readonly hien: boolean;
  readonly onDong: () => void;
}) {
  const [trangThai, datTrangThai] = useState<"cho" | "dangTai" | "xong" | "hong">("cho");

  // Đánh dấu đã nhắc NGAY LÚC HIỆN RA, không đợi họ bấm gì. Người đóng đi mà không tải
  // cũng là đã được nhắc — hỏi lại lần nữa là không nghe câu trả lời của họ.
  useEffect(() => {
    if (hien) ghiDaNhac();
  }, [hien]);

  if (!hien) return null;

  async function tai() {
    datTrangThai("dangTai");
    try {
      // 🔴 ĐI QUA CỬA DÙNG CHUNG, KHÔNG TỰ GỌI `saoLuuTatCa()`. Nút này từng tự gọi hàm
      // đó và vì thế đẩy xuống một tệp .zip TOÀN JSON — không thư mục tên người, không
      // PDF — trong khi nút ở bước 1 thì đủ. Người dùng bấm đúng cái nút tự bật lên
      // trước mặt mình nên nhận đúng bản thiếu. Vì sao đầy đủ: `app/tai-sao-luu.ts`.
      datTrangThai((await taiBanSaoLuuVeMay()) ? "xong" : "hong");
    } catch {
      datTrangThai("hong");
    }
  }

  return (
    <section
      data-thu="nhac-sao-luu"
      className="rounded-2xl border px-4 py-4"
      style={{ borderColor: MAU.timCongNghe, backgroundColor: MAU.timRatNhat }}
    >
      <h3 className="text-[16px] font-bold text-neutral-900">{CHU_NHAC_SAO_LUU.tieuDe}</h3>
      <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-700">
        {CHU_NHAC_SAO_LUU.than}
      </p>

      <div className="mt-3.5 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={trangThai === "dangTai"}
          onClick={() => void tai()}
          className="min-h-[44px] rounded-xl px-4 text-[15px] font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: MAU.timCongNghe }}
        >
          {CHU_NHAC_SAO_LUU.nut}
        </button>
        <button
          type="button"
          onClick={onDong}
          className="min-h-[44px] rounded-xl px-3.5 text-[15px] text-neutral-600"
        >
          {CHU_NHAC_SAO_LUU.nutBoQua}
        </button>
      </div>

      {trangThai === "xong" && (
        <p role="status" className="mt-2.5 text-[14px]" style={{ color: MAU.timCongNghe }}>
          {CHU_NHAC_SAO_LUU.daTai}
        </p>
      )}
      {trangThai === "hong" && (
        <p role="alert" className="mt-2.5 text-[14px]" style={{ color: MAU.camDamChoChu }}>
          {CHU_NHAC_SAO_LUU.loiTai}
        </p>
      )}
    </section>
  );
}
