/**
 * LUẬT ĐỊNH TUYẾN — chọn bộ đề từ đối tượng người dùng (DISC_BA.md §4.2).
 *
 * 🔴 Đây là chỗ mà một sản phẩm DISC cho trẻ em hoặc đứng vững, hoặc bịa số.
 *
 * Bằng chứng: phương sai do "gật bừa" ở trẻ em lớn gấp đôi người lớn; công cụ chuẩn cho
 * lứa 3–7 tuổi trên thế giới (CBQ của Rothbart) là bảng do PHỤ HUYNH điền, không tồn tại
 * bản trẻ mẫu giáo tự làm. 8 tuổi là sàn thực dụng cho tự đánh giá. (ADR-002)
 *
 * Hàm thuần: không React, không DOM. Đổi luật ở đây thì `tests/dinh-tuyen.test.ts` đỏ —
 * cố ý.
 */

import type { MaBoDe } from "@modules/core/bo-de/kieu";

export type MucTieuPhuHuynh = "toi" | "con";

export type DauVaoDinhTuyen = {
  readonly doiTuong: "mam-non" | "tieu-hoc" | "thcs" | "phu-huynh";
  /** Chỉ dùng ĐỊNH TUYẾN. Không đưa vào kết quả, không lưu kèm báo cáo. */
  readonly lop?: number;
  readonly mucTieu?: MucTieuPhuHuynh;
  readonly tuoiCon?: number;
};

/** Lý do người làm bị chuyển sang bản quan sát — luôn phải HIỆN RA, không chuyển im lặng. */
export type MaGiaiThich = "LOP_1_2" | "CON_DUOI_8";

export type KetQuaDinhTuyen =
  | { readonly xong: false; readonly hoiThem: "lop" | "muc-tieu" | "tuoi-con" }
  | { readonly xong: true; readonly boDe: MaBoDe; readonly giaiThich?: MaGiaiThich };

/** Tuổi tối thiểu để một đứa trẻ TỰ đánh giá được. Dưới mức này ⇒ người lớn quan sát. */
export const TUOI_TU_DANH_GIA_TOI_THIEU = 8;

/** Lớp cao nhất vẫn phải dùng bản quan sát (lớp 1 và lớp 2). */
export const LOP_CAO_NHAT_DUNG_BAN_QUAN_SAT = 2;

export function dinhTuyen(dv: DauVaoDinhTuyen): KetQuaDinhTuyen {
  switch (dv.doiTuong) {
    case "mam-non":
      return { xong: true, boDe: "MN" };

    case "thcs":
      return { xong: true, boDe: "THCS" };

    case "tieu-hoc": {
      if (dv.lop === undefined) return { xong: false, hoiThem: "lop" };
      // 🔴 Lớp 1–2 KHÔNG BAO GIỜ được ra bộ TH. Đọc được chữ nhưng vẫn gật bừa nặng.
      if (dv.lop <= LOP_CAO_NHAT_DUNG_BAN_QUAN_SAT) {
        return { xong: true, boDe: "MN", giaiThich: "LOP_1_2" };
      }
      return { xong: true, boDe: "TH" };
    }

    case "phu-huynh": {
      if (dv.mucTieu === undefined) return { xong: false, hoiThem: "muc-tieu" };
      if (dv.mucTieu === "toi") return { xong: true, boDe: "PH" };
      if (dv.tuoiCon === undefined) return { xong: false, hoiThem: "tuoi-con" };
      // Bộ QS chỉ mở khi con ≥ 8 tuổi — nó cần con tự làm bài kia để đối chiếu.
      if (dv.tuoiCon < TUOI_TU_DANH_GIA_TOI_THIEU) {
        return { xong: true, boDe: "MN", giaiThich: "CON_DUOI_8" };
      }
      return { xong: true, boDe: "QS" };
    }
  }
}
