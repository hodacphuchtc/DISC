/**
 * NGƯỠNG VÀ CỜ CỦA THẺ "SỨC KHOẺ GIA ĐÌNH" (ADR-010).
 *
 * Mọi hằng số nghiệp vụ nằm ở đây, không gõ thẳng vào hàm tính (rule 4 của
 * `.claude/rules/module-boundaries.md`). Thuộc TẦNG LÕI: chỉ dữ liệu, không React, không DOM.
 */

/**
 * 🔴 CỜ BẬT THẺ SỨC KHOẺ. Nội dung lời khuyên là BẢN NHÁP, chưa có chữ ký Gói C
 * (nhi khoa / dinh dưỡng) ⇒ BẬT từ 04/11/2026 theo quyết định của chủ dự án (tab trên thanh bên); đổi lại `false` trước khi phát cho người dùng thật nếu Gói C chưa ký. Đặt `false`, dựng lại là thẻ
 * biến mất; dữ liệu đã nhập vẫn còn trong IndexedDB.
 */
export const MO_SUC_KHOE = true;

/**
 * Địa chỉ `?suc-khoe=1` mở thẻ để XEM THỬ khi cờ còn tắt.
 *
 * 🔴 ĐẶT Ở ĐÂY, KHÔNG ĐẶT Ở `suc-khoe-tu-dien.ts`: `app/page.tsx` (gói chính) import hằng này,
 * mà từ điển chữ thì rất nặng — import chung một file là kéo cả từ điển vào gói chính và vượt
 * trần 300 KB (đã đo 03/11/2026: +6 KB gzip).
 */
export const THAM_SO_SUC_KHOE = "suc-khoe";

/** Tuổi (năm) từ đây trở lên được xếp là người lớn (WHO: 19). */
export const TUOI_NGUOI_LON = 19;
/** Dưới mốc này (tháng) dùng chuẩn WHO 2006; từ mốc này đến hết tuổi trẻ dùng WHO 2007. */
export const THANG_CHUAN_2006 = 60;

/** BMI người lớn theo ngưỡng châu Á – Thái Bình Dương (WHO WPRO 2000). */
export const NGUONG_BMI_CHAU_A = {
  thieuCan: 18.5,
  thuaCan: 23,
  beoPhi: 25,
  beoPhiNang: 30,
} as const;

/** Tỉ lệ vòng eo / chiều cao: từ ngưỡng này trở lên là nên chú ý. */
export const NGUONG_EO_CHIEU_CAO = 0.5;
/** Vòng eo (cm) cho người lớn châu Á: từ ngưỡng này trở lên là nên chú ý. */
export const NGUONG_VONG_EO_CM = { nam: 90, nu: 80 } as const;

/** Hệ số vận động nhân với BMR để ra nhu cầu năng lượng mỗi ngày (TDEE). */
export const HE_SO_VAN_DONG = { it: 1.2, vua: 1.55, nhieu: 1.725 } as const;

/** Khoảng số đo hợp lý — ngoài khoảng này là nhập nhầm, KHÔNG tính bừa. */
export const KHOANG_HOP_LY = {
  canNangKg: { min: 2, max: 300 },
  chieuCaoCm: { min: 40, max: 250 },
  vongEoCm: { min: 30, max: 250 },
} as const;

/** Số tuổi tối đa chấp nhận (năm). */
export const TUOI_TOI_DA = 120;

/** z-score ngoài ±ngưỡng này ⇒ chỉ khuyên gặp chuyên gia, không phân loại thêm. */
export const Z_NGOAI_VUNG = 3;
/** z-score ngoài ±ngưỡng này ⇒ ghi nhận "cần theo dõi". */
export const Z_CAN_THEO_DOI = 2;

/** Nhóm tuổi quyết định chuẩn nào được dùng. */
export type NhomTuoi = "duoi-5" | "5-19" | "nguoi-lon";

/**
 * 🔴 HẠN MỨC CỦA SỔ SỨC KHOẺ (chủ dự án chốt 03/11/2026) — để KHÔNG làm nặng bộ nhớ máy.
 *
 * Tối đa 6 người trong sổ; mỗi người giữ 3 BẢN MỚI NHẤT. Lưu bản thứ 4 thì bản cũ nhất của
 * người đó bị thay (tự động, có báo). Thêm người thứ 7 thì người dùng PHẢI tự chọn xoá một
 * người — xoá cả một người là mất nhiều dữ liệu hơn, nên không tự quyết thay họ.
 */
export const TOI_DA_NGUOI_SUC_KHOE = 6;
export const TOI_DA_BAN_MOI_NGUOI = 3;

/** Độ dài tối đa của tên/biệt danh (ký tự). */
export const DO_DAI_TEN_SUC_KHOE = 40;
