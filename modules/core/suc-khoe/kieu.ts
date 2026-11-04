/**
 * KIỂU CỦA THẺ SỨC KHOẺ (ADR-010). Thuộc TẦNG LÕI: chỉ kiểu, không React, không DOM.
 *
 * 🔴 Dữ liệu sức khoẻ của trẻ là dữ liệu cá nhân nhạy cảm (NĐ 13/2023): không rời máy,
 * không vào mã mời, ảnh chia sẻ hay phiếu liên hệ.
 */

import type { NhomTuoi } from "@config/suc-khoe-nguong";

export type GioiTinh = "nam" | "nu";
export type MucVanDong = "it" | "vua" | "nhieu";

/** Một lần đo. Chỉ cân nặng và chiều cao là bắt buộc để ra chỉ số. */
export type MocDo = {
  readonly id: string;
  /** Ngày đo `yyyy-mm-dd`. */
  readonly ngayDo: string;
  readonly canNangKg: number;
  readonly chieuCaoCm: number;
  /** Người lớn / từ 10 tuổi. Không có thì bỏ qua các chỉ số vòng eo. */
  readonly vongEoCm?: number;
  readonly mucVanDong?: MucVanDong;
  /** Đang mang thai hoặc cho con bú ⇒ KHÔNG áp BMI. */
  readonly mangThaiHoacChoBu?: boolean;
  /** Người dùng báo có bệnh nền ⇒ chỉ hiện lời nhắc hỏi bác sĩ. */
  readonly coBenhNen?: boolean;
  readonly taoLuc: string;
};

/**
 * Một người trong sổ sức khoẻ — bản ghi TỰ CHỨA (ngày sinh, giới tính, và tối đa 3 mốc đo
 * mới nhất). Đứng riêng, KHÔNG gắn vào `ThanhVien` của DISC: người ở đây có thể chưa từng
 * làm bài DISC, và dữ liệu sức khoẻ không được lẫn vào bản phân tích tính cách.
 */
export type NguoiSucKhoe = {
  readonly id: string;
  /** Tên hoặc biệt danh — tên thật được phép (ADR-005), không rời máy. */
  readonly ten: string;
  /** `yyyy-mm-dd`. */
  readonly ngaySinh: string;
  readonly gioiTinh: GioiTinh;
  /** MỚI NHẤT đứng đầu. Tối đa `TOI_DA_BAN_MOI_NGUOI` phần tử. */
  readonly moc: readonly MocDo[];
  readonly taoLuc: string;
  readonly suaLuc: string;
};

/** Đầu vào của hàm phân tích: ngày sinh + giới tính của người, kèm một mốc đo. */
export type DauVaoSucKhoe = Pick<
  MocDo,
  | "canNangKg"
  | "chieuCaoCm"
  | "vongEoCm"
  | "mucVanDong"
  | "mangThaiHoacChoBu"
  | "coBenhNen"
> & {
  readonly ngaySinh: string;
  readonly gioiTinh: GioiTinh;
  readonly ngayDo: string;
};

export type LyDoTuChoi =
  | "ngay-sinh-hong"
  | "ngay-do-hong"
  | "do-truoc-khi-sinh"
  | "tuoi-ngoai-khoang"
  | "can-nang-ngoai-khoang"
  | "chieu-cao-ngoai-khoang"
  | "vong-eo-ngoai-khoang";

export type PhanLoaiBmi =
  "thieu-can" | "binh-thuong" | "thua-can" | "beo-phi" | "beo-phi-nang";
export type PhanLoaiZ =
  "thap-nang" | "thap" | "binh-thuong" | "cao" | "cao-nang";

/** Lời nhắc an toàn — giao diện đổi mã này thành câu chữ trong từ điển. */
export type CanhBao =
  | "khong-thay-bac-si"
  | "nen-gap-chuyen-gia"
  | "mang-thai-khong-ap-bmi"
  | "benh-nen-hoi-bac-si"
  | "chua-co-bang-tang-truong";

export type KetQuaSucKhoe =
  | { readonly hopLe: false; readonly lyDo: LyDoTuChoi }
  | {
      readonly hopLe: true;
      readonly tuoiThang: number;
      readonly nhomTuoi: NhomTuoi;
      /** `null` khi không áp BMI (đang mang thai) hoặc người lớn chưa đủ dữ liệu. */
      readonly bmi: number | null;
      /** Chỉ người lớn. Trẻ em dùng `zBmi` khi có bảng. */
      readonly phanLoaiBmi: PhanLoaiBmi | null;
      readonly zBmi: number | null;
      readonly phanLoaiZ: PhanLoaiZ | null;
      readonly tiLeEoChieuCao: number | null;
      readonly eoVuotNguong: boolean | null;
      /** Chỉ người lớn — nhu cầu năng lượng, để THAM KHẢO, không phải chỉ tiêu giảm cân. */
      readonly bmrKcal: number | null;
      readonly tdeeKcal: number | null;
      /** Có được phép gợi ý giảm cân/hạn chế kcal không. Luôn `false` với người dưới 19 tuổi. */
      readonly duocGoiYGiamCan: boolean;
      readonly canhBao: readonly CanhBao[];
    };
