/**
 * CÁC CHỈ SỐ CƠ THỂ — hàm thuần, thuộc TẦNG LÕI (ADR-004). Ngưỡng đọc từ
 * `config/suc-khoe-nguong.ts`, không gõ thẳng ở đây.
 *
 * 🔴 Chỉ số cho NGƯỜI LỚN. Trẻ em không dùng ngưỡng cố định: phải so với bảng tăng trưởng
 * theo tuổi và giới (xem `z-score.ts`).
 */

import {
  HE_SO_VAN_DONG,
  NGUONG_BMI_CHAU_A,
  NGUONG_EO_CHIEU_CAO,
  NGUONG_VONG_EO_CM,
} from "@config/suc-khoe-nguong";
import type { GioiTinh, MucVanDong, PhanLoaiBmi } from "./kieu";

/** BMI = kg / m². Làm tròn 1 chữ số ở nơi hiển thị, không ở đây. */
export function tinhBmi(canNangKg: number, chieuCaoCm: number): number {
  const m = chieuCaoCm / 100;
  return canNangKg / (m * m);
}

/** Phân loại BMI người lớn theo ngưỡng châu Á – Thái Bình Dương. */
export function phanLoaiBmiChauA(bmi: number): PhanLoaiBmi {
  if (bmi < NGUONG_BMI_CHAU_A.thieuCan) return "thieu-can";
  if (bmi < NGUONG_BMI_CHAU_A.thuaCan) return "binh-thuong";
  if (bmi < NGUONG_BMI_CHAU_A.beoPhi) return "thua-can";
  if (bmi < NGUONG_BMI_CHAU_A.beoPhiNang) return "beo-phi";
  return "beo-phi-nang";
}

/** Vòng eo / chiều cao (cùng đơn vị cm). */
export function tiLeEoChieuCao(vongEoCm: number, chieuCaoCm: number): number {
  return vongEoCm / chieuCaoCm;
}

export function eoChieuCaoVuotNguong(tiLe: number): boolean {
  return tiLe >= NGUONG_EO_CHIEU_CAO;
}

export function vongEoVuotNguong(
  vongEoCm: number,
  gioiTinh: GioiTinh,
): boolean {
  return vongEoCm >= NGUONG_VONG_EO_CM[gioiTinh];
}

/**
 * BMR theo Mifflin–St Jeor (kcal/ngày). Chỉ dùng cho người lớn: công thức xây từ mẫu
 * người trưởng thành, đưa cho trẻ em là sai số không kiểm soát được.
 */
export function tinhBmr(
  canNangKg: number,
  chieuCaoCm: number,
  tuoiNam: number,
  gioiTinh: GioiTinh,
): number {
  const co = 10 * canNangKg + 6.25 * chieuCaoCm - 5 * tuoiNam;
  return gioiTinh === "nam" ? co + 5 : co - 161;
}

export function tinhTdee(bmr: number, muc: MucVanDong): number {
  return bmr * HE_SO_VAN_DONG[muc];
}
