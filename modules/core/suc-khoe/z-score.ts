/**
 * Z-SCORE THEO PHƯƠNG PHÁP LMS (WHO) — hàm thuần, thuộc TẦNG LÕI (ADR-004).
 *
 * Bảng L/M/S KHÔNG nằm ở đây: nó là dữ liệu, nạp lười và tra qua `TraBang` (ADR-010 mục 8).
 * File này chỉ có công thức, nên kiểm được bằng số bịa mà không cần bảng WHO thật.
 */

import { Z_CAN_THEO_DOI, Z_NGOAI_VUNG } from "@config/suc-khoe-nguong";
import type { GioiTinh, PhanLoaiZ } from "./kieu";

export type Lms = {
  readonly l: number;
  readonly m: number;
  readonly s: number;
};

/** Tra bảng: không có hàng tương ứng ⇒ `null`. Nơi gọi KHÔNG được đoán thay. */
export type TraBang = (
  chiSo: "bmi-theo-tuoi",
  gioiTinh: GioiTinh,
  tuoiThang: number,
) => Lms | null;

/** Z-score thô: ((y/M)^L − 1) / (L·S); L = 0 thì ln(y/M) / S. */
export function zLmsTho(y: number, { l, m, s }: Lms): number {
  if (l === 0) return Math.log(y / m) / s;
  return (Math.pow(y / m, l) - 1) / (l * s);
}

/** Giá trị y tại một z cho trước — dùng để dựng SD2/SD3 cho bước hiệu chỉnh đuôi. */
function yTaiZ(z: number, { l, m, s }: Lms): number {
  return l === 0 ? m * Math.exp(s * z) : m * Math.pow(1 + l * s * z, 1 / l);
}

/**
 * Z-score kèm hiệu chỉnh đuôi của WHO cho chỉ số gắn với cân nặng (BMI): ngoài ±3 thì
 * kéo tuyến tính theo khoảng SD2–SD3, vì phân phối cân nặng lệch ở hai đuôi.
 */
export function zLms(y: number, lms: Lms): number {
  const z = zLmsTho(y, lms);
  if (Math.abs(z) <= Z_NGOAI_VUNG) return z;
  if (z > 0) {
    const sd3 = yTaiZ(3, lms);
    const sd2 = yTaiZ(2, lms);
    return 3 + (y - sd3) / (sd3 - sd2);
  }
  const sd3 = yTaiZ(-3, lms);
  const sd2 = yTaiZ(-2, lms);
  return -3 + (y - sd3) / (sd2 - sd3);
}

export function phanLoaiTheoZ(z: number): PhanLoaiZ {
  if (z < -Z_NGOAI_VUNG) return "thap-nang";
  if (z < -Z_CAN_THEO_DOI) return "thap";
  if (z <= Z_CAN_THEO_DOI) return "binh-thuong";
  if (z <= Z_NGOAI_VUNG) return "cao";
  return "cao-nang";
}
