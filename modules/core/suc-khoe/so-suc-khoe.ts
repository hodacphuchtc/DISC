/**
 * SỔ SỨC KHOẺ — luật hạn mức, hàm thuần, thuộc TẦNG LÕI (ADR-004, ADR-010).
 *
 * Tối đa `TOI_DA_NGUOI_SUC_KHOE` người, mỗi người `TOI_DA_BAN_MOI_NGUOI` bản mới nhất.
 *   - Bản thứ 4 của một người ⇒ bản cũ nhất của người đó bị THAY (tự động, báo lại).
 *   - Người thứ 7 ⇒ KHÔNG tự xoá ai: trả `can-xoa-nguoi`, nơi gọi phải hỏi người dùng.
 *
 * Mọi hàm trả bản MỚI, không sửa tại chỗ. Danh sách luôn xếp người VỪA CẬP NHẬT lên đầu.
 */

import {
  DO_DAI_TEN_SUC_KHOE,
  TOI_DA_BAN_MOI_NGUOI,
  TOI_DA_NGUOI_SUC_KHOE,
} from "@config/suc-khoe-nguong";
import type { GioiTinh, MocDo, NguoiSucKhoe } from "./kieu";

/** So tên không phân biệt hoa/thường, dấu cách thừa và dạng Unicode. */
export function khoaTen(ten: string): string {
  return ten.normalize("NFC").replace(/\s+/gu, " ").trim().toLowerCase();
}

export function chuanHoaTen(tho: string): string {
  return [...tho.normalize("NFC").replace(/\s+/gu, " ").trim()]
    .slice(0, DO_DAI_TEN_SUC_KHOE)
    .join("");
}

export type YeuCauThemMoc = {
  readonly ten: string;
  readonly ngaySinh: string;
  readonly gioiTinh: GioiTinh;
  readonly moc: Omit<MocDo, "id" | "taoLuc">;
};

export type KetQuaThemMoc =
  /** Đã thêm. `mocBiThay` có khi người này vượt 3 bản và bản cũ nhất bị thay. */
  | {
      readonly kq: "ok";
      readonly ds: readonly NguoiSucKhoe[];
      readonly nguoi: NguoiSucKhoe;
      readonly mocBiThay?: MocDo;
      readonly laNguoiMoi: boolean;
    }
  /** Đủ 6 người và đây là người mới — phải chọn một người để xoá rồi gọi lại. */
  | { readonly kq: "can-xoa-nguoi"; readonly ds: readonly NguoiSucKhoe[] }
  | { readonly kq: "ten-rong" };

export function timNguoiTheoTen(
  ds: readonly NguoiSucKhoe[],
  ten: string,
): NguoiSucKhoe | undefined {
  const k = khoaTen(ten);
  return ds.find((n) => khoaTen(n.ten) === k);
}

/**
 * Thêm một mốc đo. Người đã có (cùng tên) ⇒ mốc vào đầu danh sách của họ; ngày sinh và
 * giới tính lấy theo lần nhập MỚI NHẤT (người dùng có thể vừa sửa nhầm).
 *
 * @param taoId sinh id — truyền vào để hàm này thuần và test được.
 */
export function themMocDo(
  ds: readonly NguoiSucKhoe[],
  yc: YeuCauThemMoc,
  bayGio: string,
  taoId: () => string,
): KetQuaThemMoc {
  const ten = chuanHoaTen(yc.ten);
  if (ten.length === 0) return { kq: "ten-rong" };

  const co = timNguoiTheoTen(ds, ten);
  if (!co && ds.length >= TOI_DA_NGUOI_SUC_KHOE)
    return { kq: "can-xoa-nguoi", ds };

  const mocMoi: MocDo = { ...yc.moc, id: taoId(), taoLuc: bayGio };
  const tatCa = [mocMoi, ...(co?.moc ?? [])];
  const giu = tatCa.slice(0, TOI_DA_BAN_MOI_NGUOI);
  const mocBiThay =
    tatCa.length > TOI_DA_BAN_MOI_NGUOI ? tatCa[tatCa.length - 1] : undefined;

  const nguoi: NguoiSucKhoe = {
    id: co?.id ?? taoId(),
    ten: co?.ten ?? ten,
    ngaySinh: yc.ngaySinh,
    gioiTinh: yc.gioiTinh,
    moc: giu,
    taoLuc: co?.taoLuc ?? bayGio,
    suaLuc: bayGio,
  };

  const conLai = ds.filter((n) => n.id !== nguoi.id);
  return {
    kq: "ok",
    ds: [nguoi, ...conLai],
    nguoi,
    mocBiThay,
    laNguoiMoi: !co,
  };
}

/** Xoá cả một người (và mọi bản của họ). */
export function xoaNguoi(
  ds: readonly NguoiSucKhoe[],
  id: string,
): readonly NguoiSucKhoe[] {
  return ds.filter((n) => n.id !== id);
}

/**
 * Xoá một bản của một người. Xoá bản cuối cùng ⇒ người đó cũng rời sổ (một người không có
 * bản đo nào thì không còn gì để xem).
 */
export function xoaMocDo(
  ds: readonly NguoiSucKhoe[],
  idNguoi: string,
  idMoc: string,
): readonly NguoiSucKhoe[] {
  return ds.flatMap((n) => {
    if (n.id !== idNguoi) return [n];
    const moc = n.moc.filter((m) => m.id !== idMoc);
    return moc.length === 0 ? [] : [{ ...n, moc }];
  });
}

/** Sắp theo mới cập nhật lên đầu — dùng sau khi đọc từ kho. */
export function sapTheoMoiNhat(ds: readonly NguoiSucKhoe[]): NguoiSucKhoe[] {
  return [...ds].sort((a, b) => b.suaLuc.localeCompare(a.suaLuc));
}

/** Kiểm hình dạng một bản ghi đọc từ tệp/kho — không tin dữ liệu ngoài. */
export function laNguoiSucKhoeHopLe(x: unknown): x is NguoiSucKhoe {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  const soHopLe = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  return (
    typeof o.id === "string" &&
    typeof o.ten === "string" &&
    typeof o.ngaySinh === "string" &&
    (o.gioiTinh === "nam" || o.gioiTinh === "nu") &&
    typeof o.taoLuc === "string" &&
    typeof o.suaLuc === "string" &&
    Array.isArray(o.moc) &&
    o.moc.length >= 1 &&
    o.moc.length <= TOI_DA_BAN_MOI_NGUOI &&
    o.moc.every((m: unknown) => {
      if (typeof m !== "object" || m === null) return false;
      const r = m as Record<string, unknown>;
      return (
        typeof r.id === "string" &&
        typeof r.ngayDo === "string" &&
        soHopLe(r.canNangKg) &&
        soHopLe(r.chieuCaoCm) &&
        typeof r.taoLuc === "string"
      );
    })
  );
}
