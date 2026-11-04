/**
 * CHỌN KHUÔN LỜI KHUYÊN từ kết quả phân tích — hàm thuần, thuộc TẦNG LÕI (ADR-010).
 *
 * 🔴 Thứ tự ưu tiên cố ý: trường hợp đặc biệt (mang thai, bệnh nền) THẮNG mọi thứ khác —
 * một người đang mang thai có BMI cao không được nhận khuôn "điều chỉnh cân nặng".
 * Người dưới 19 tuổi KHÔNG BAO GIỜ nhận khuôn người lớn (khuôn nào có chữ giảm cân).
 */

import type { MaKhuon } from "@config/suc-khoe-noi-dung";
import type { DauVaoSucKhoe, KetQuaSucKhoe } from "./kieu";

export function chonKhuon(v: DauVaoSucKhoe, kq: KetQuaSucKhoe): MaKhuon | null {
  if (!kq.hopLe) return null;
  if (kq.nhomTuoi === "duoi-5") return "tre-nho";
  if (kq.nhomTuoi === "5-19") return "tre";
  if (v.mangThaiHoacChoBu || v.coBenhNen) return "dac-biet";
  if (kq.phanLoaiBmi === "thieu-can") return "nl-nhe-can";
  if (
    kq.phanLoaiBmi === "thua-can" ||
    kq.phanLoaiBmi === "beo-phi" ||
    kq.phanLoaiBmi === "beo-phi-nang"
  ) {
    return "nl-can-chu-y";
  }
  return "nl-binh-thuong";
}
