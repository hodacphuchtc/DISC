/**
 * XƯNG HÔ CHO NỘI DUNG THEO MỐI QUAN HỆ (29.1) — thay `{xungTre}` và `{goiNguoiKia}`.
 *
 * Vì sao cần: nội dung sâu cho cặp có trẻ phải đúng với bố/mẹ LẪN ông/bà mà không viết hai
 * bản. Sản phẩm cố ý không thu giới tính nên không thể suy "anh/chị/cô/chú"; nhưng vai trong
 * sổ (bố, mẹ, ông, bà) cho đủ để xưng đúng:
 *
 *  · `{xungTre}` / `{XungTre}` — cách TRẺ tự xưng khi nói với người kia:
 *      bố, mẹ ⇒ "con" · ông, bà ⇒ "cháu" · người khác ⇒ "em".
 *  · `{goiNguoiKia}` / `{GoiNguoiKia}` — cách trẻ GỌI người kia:
 *      bố/mẹ/ông/bà ⇒ "Bố"/"Mẹ"/"Ông"/"Bà" · người khác ⇒ TÊN trong sổ ("Cô Hoa").
 *
 * Người lớn nói với trẻ thì dùng "mình" và gọi bé bằng TÊN (`{nguoiKia}`) — né hẳn chuyện phải
 * biết người lớn ấy tự xưng là bố, mẹ, ông hay bà.
 *
 * Nạp lười cùng nội dung (chỉ `noi-dung-doi.tsx` import file này) — gói chính chỉ còn dư rất
 * ít so với trần 300 KB.
 */

import { CHU_VAI, type VaiGiaDinh } from "./disc-gia-dinh";
import { thayDaiTuCap, type TheQuyen } from "./disc-lech-cap";

/** Vai mà trẻ gọi bằng chính chức danh, không gọi bằng tên. */
const GOI_BANG_CHUC_DANH: readonly VaiGiaDinh[] = ["me", "bo", "ong", "ba"];

export function xungTreTheoVai(vaiNguoiKia: VaiGiaDinh | undefined): "con" | "cháu" | "em" {
  if (vaiNguoiKia === "me" || vaiNguoiKia === "bo") return "con";
  if (vaiNguoiKia === "ong" || vaiNguoiKia === "ba") return "cháu";
  return "em";
}

export function goiNguoiKiaTheoVai(vaiNguoiKia: VaiGiaDinh | undefined, ten: string): string {
  return vaiNguoiKia && GOI_BANG_CHUC_DANH.includes(vaiNguoiKia) ? CHU_VAI[vaiNguoiKia] : ten;
}

const VIET_HOA = (c: string) => c.charAt(0).toLocaleUpperCase("vi") + c.slice(1);

/**
 * Thay mọi chỗ giữ của nội dung cặp: `{toi}`, `{Toi}`, `{nguoiKia}`, `{NguoiKia}` (như
 * `thayDaiTuCap`) cộng `{xungTre}`, `{XungTre}`, `{goiNguoiKia}`, `{GoiNguoiKia}`.
 */
export function thayXungHo(
  chuoi: string,
  theQuyen: TheQuyen,
  tenNguoiKia: string,
  ngucanh: { readonly vaiNguoiKia?: VaiGiaDinh },
): string {
  const xung = xungTreTheoVai(ngucanh.vaiNguoiKia);
  const goi = goiNguoiKiaTheoVai(ngucanh.vaiNguoiKia, tenNguoiKia);
  return thayDaiTuCap(
    chuoi
      .split("{XungTre}")
      .join(VIET_HOA(xung))
      .split("{xungTre}")
      .join(xung)
      .split("{GoiNguoiKia}")
      .join(VIET_HOA(goi))
      .split("{goiNguoiKia}")
      .join(goi),
    theQuyen,
    tenNguoiKia,
  );
}
