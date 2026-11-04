/**
 * LINH VẬT SATA ROBO — dùng ĐÚNG file chính thức (`public/brand/mascot.jpg`, nén từ
 * `MASTER SATA ROBO/config/brand-assets/mascot.png`). 🔴 Brand DNA: KHÔNG vẽ lại, KHÔNG
 * đổi màu, KHÔNG méo dáng, KHÔNG xoay/outline. Chỉ được nhấp nhô quanh vị trí (CSS).
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { CHU_SK } from "@config/suc-khoe-tu-dien";

const DUONG_LINH_VAT = "/brand/mascot.jpg";
export const DUONG_LOGO = "/brand/logo.png";

/** Toàn thân, dùng ở đầu thẻ. */
export function LinhVatToanThan() {
  return (
    <div className="sk-dia">
      {/* eslint-disable-next-line @next/next/no-img-element -- xuất tĩnh, ảnh đã nén sẵn (output:'export') */}
      <img
        src={DUONG_LINH_VAT}
        alt={CHU_SK.hero.altLinhVat}
        width={560}
        height={560}
        decoding="async"
        fetchPriority="low"
      />
    </div>
  );
}

/** Cắt vào KHUÔN MẶT, dùng làm ảnh đại diện nhỏ (bóng thoại, khung lưu ý, hộp thoại). */
export function LinhVatMat() {
  return (
    <div className="sk-av-robo" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- xem trên */}
      <img
        src={DUONG_LINH_VAT}
        alt=""
        width={560}
        height={560}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
