/**
 * SO SÁNH HAI BÀI CỦA CÙNG MỘT NGƯỜI, CÁCH NHAU MỘT KHOẢNG THỜI GIAN.
 *
 * "Bin hồi tháng 3 ↔ Bin bây giờ". Không có toán mới: dùng lại đúng `mucLechTu()` và
 * `NGUONG_VUNG_LECH` của vùng lệch con ↔ cha mẹ. Cùng một phép đo chênh lệch, chỉ khác
 * cái được đem ra so — ở kia là hai người, ở đây là hai thời điểm của một người.
 *
 * 🔴 LUẬT GIỌNG VĂN, KHÔNG THƯƠNG LƯỢNG: **cấm "tiến bộ", cấm "cải thiện"**.
 *
 * DISC không có chiều tốt/xấu, nên KHÔNG CÓ GÌ ĐỂ TIẾN BỘ. Nói "con đã tiến bộ ở nhóm
 * Chủ động" là ngầm khẳng định Chủ động cao thì tốt hơn — một tuyên bố sai về mô hình, và
 * tệ hơn, nó biến một bản mô tả hành vi thành một bảng điểm mà đứa trẻ phải leo.
 *
 * Câu đúng mở một CÂU HỎI thay vì phát một bằng khen:
 *   *"Sáu tháng trước Bin nghiêng về Ổn định rõ hơn. Giờ Chủ động lên gần bằng.
 *     Điều gì đã đổi ở lớp hay ở nhà?"*
 *
 * Thuộc TẦNG LÕI (ADR-004): hàm thuần, không React, không DOM, không đọc đồng hồ.
 *
 * 🔴 NẰM Ở `modules/report`, KHÔNG ở `modules/core/gia-dinh`. Bản đầu đặt nhầm vào core
 * và semgrep chặn ngay: core là module NỀN TẢNG, nó không được import ngược lên module
 * nghiệp vụ. Mà file này cần `mucLechTu()` của report — nên chỗ đúng của nó là report.
 * Diễn giải chênh lệch điểm vốn là việc của module đó ngay từ đầu.
 */

import { NGAY_TOI_THIEU_DE_SO_SANH } from "@config/disc-nguong";
import { MA_TRUC, type MaTruc } from "@modules/core/bo-de/kieu";
import { soNgayGiua } from "@modules/core/tien-ich/ngay";
// `MaMucLech` khai ở config; `doi-chieu` cũng chỉ dùng lại. Lấy từ NGUỒN, không qua trung gian.
import type { MaMucLech } from "@config/disc-doi-chieu";
import { mucLechTu } from "./doi-chieu";

export type BaiDeSoSanh = {
  readonly id: string;
  /** ISO 8601. */
  readonly ketThuc: string;
  readonly diem: Readonly<Record<MaTruc, number>>;
};

export type LechTheoThoiGian = {
  readonly truc: MaTruc;
  readonly diemTruoc: number;
  readonly diemSau: number;
  /** Dương = nay cao hơn. KHÔNG mang nghĩa tốt hơn. */
  readonly lech: number;
  readonly mucLech: MaMucLech;
};

export type LyDoChuaSoSanh =
  | { readonly ma: "THIEU_BAI" }
  | { readonly ma: "QUA_GAN"; readonly soNgay: number };

export type KetQuaSoSanh =
  | { readonly soSanhDuoc: false; readonly lyDo: LyDoChuaSoSanh }
  | {
      readonly soSanhDuoc: true;
      readonly baiTruoc: BaiDeSoSanh;
      readonly baiSau: BaiDeSoSanh;
      readonly soNgay: number;
      /** Bốn trục, giữ thứ tự cố định D-I-S-C. */
      readonly bang: readonly LechTheoThoiGian[];
      /** Những trục đổi rõ nhất, tối đa hai — nói ít mà trúng. */
      readonly trucDoiRo: readonly MaTruc[];
    };

/**
 * So hai bài GẦN NHẤT của một người.
 *
 * Nhận danh sách bài chưa sắp; hàm tự lấy hai bài mới nhất. Ít hơn hai bài, hoặc hai bài
 * cách nhau dưới sàn, thì trả về lý do cụ thể — nơi gọi cần phân biệt *"chưa đủ bài"* với
 * *"làm lại sớm quá"* để nói đúng câu với người dùng.
 */
export function soSanhTheoThoiGian(
  ds: readonly BaiDeSoSanh[],
  ngayToiThieu: number = NGAY_TOI_THIEU_DE_SO_SANH,
): KetQuaSoSanh {
  if (ds.length < 2) return { soSanhDuoc: false, lyDo: { ma: "THIEU_BAI" } };

  const xep = [...ds].sort(
    (a, b) => b.ketThuc.localeCompare(a.ketThuc) || a.id.localeCompare(b.id),
  );
  const baiSau = xep[0];
  const baiTruoc = xep[1];

  const soNgay = soNgayGiua(baiTruoc.ketThuc, baiSau.ketThuc);
  if (soNgay === null) return { soSanhDuoc: false, lyDo: { ma: "THIEU_BAI" } };
  if (soNgay < ngayToiThieu) return { soSanhDuoc: false, lyDo: { ma: "QUA_GAN", soNgay } };

  const bang = MA_TRUC.map((truc) => {
    const diemTruoc = baiTruoc.diem[truc];
    const diemSau = baiSau.diem[truc];
    const lech = Math.round((diemSau - diemTruoc) * 10) / 10;
    return { truc, diemTruoc, diemSau, lech, mucLech: mucLechTu(lech) };
  });

  // Chỉ nêu trục đổi RÕ. Trục nhích vài điểm là nhiễu đo, nói ra chỉ tổ mời người ta
  // đọc ý nghĩa vào một con số không có ý nghĩa nào.
  const trucDoiRo = bang
    .filter((b) => b.mucLech !== "trungKhop")
    .sort((a, b) => Math.abs(b.lech) - Math.abs(a.lech))
    .slice(0, 2)
    .map((b) => b.truc);

  return { soSanhDuoc: true, baiTruoc, baiSau, soNgay, bang, trucDoiRo };
}
