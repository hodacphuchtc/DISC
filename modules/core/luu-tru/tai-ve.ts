/**
 * TẢI XUỐNG TRƯỚC KHI MẤT.
 *
 * 🔴 Đây là thứ biến "xoá bài của bạn" thành "chuyển bài của bạn ra khỏi máy". Khác nhau
 * hoàn toàn với người dùng, và nó là điều kiện để hạn mức 2 bài/người tồn tại được: bảo
 * người ta rằng một bài sắp mất mà không cho họ giữ lại bản sao thì hạn mức chỉ là một
 * cái nút xoá có thêm câu xin lỗi.
 *
 * KHÔNG thuộc tầng lõi: đụng `URL.createObjectURL` và DOM để kích hoạt tải xuống. Phần
 * đóng gói dữ liệu thì nằm ở `sao-luu.ts` và chạy được trong Node.
 */

import { docTatCa, type BaiLamLuu } from "./kho-bai";
import { taoNoiDungZip } from "./sao-luu";

export const TEN_TEP_THU_MUC = "disc-bai-cua";

/** Gói bài của MỘT thành viên thành `.zip`. Hàm thuần theo nghĩa không đụng DOM. */
export async function goiThuMucThanhVien(
  maThanhVien: string,
  taoLuc: string,
): Promise<{ duLieu: Uint8Array; soBai: number }> {
  const ds = (await docTatCa()).filter((b) => b.maThanhVien === maThanhVien);
  return { duLieu: await taoNoiDungZip(ds, taoLuc), soBai: ds.length };
}

/** Gói ĐÚNG những bài được nêu tên. Dùng cho hộp thoại "bài này sắp mất". */
export async function goiCacBai(
  ds: readonly BaiLamLuu[],
  taoLuc: string,
): Promise<{ duLieu: Uint8Array; soBai: number }> {
  return { duLieu: await taoNoiDungZip(ds, taoLuc), soBai: ds.length };
}

/**
 * Đẩy một mảng byte xuống máy người dùng.
 *
 * 🔴 Tên tệp KHÔNG chứa tên người (hàng rào 2 của ADR-005: tên không vào tệp xuất). Tên
 * tệp hiện lên trong thư mục Tải xuống, trong ảnh chụp màn hình, trong danh sách chia sẻ —
 * đó là chỗ tên rò ra dễ nhất và ít ai nghĩ tới nhất.
 */
export function taiXuong(duLieu: Uint8Array, tenTep: string): boolean {
  try {
    if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") {
      return false;
    }
    // Sao chép sang ArrayBuffer riêng: `Uint8Array` của JSZip có thể là khung nhìn trên
    // một bộ đệm lớn hơn, và `Blob` sẽ ôm trọn phần thừa đó.
    const sao = new Uint8Array(duLieu);
    const url = URL.createObjectURL(new Blob([sao], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = tenTep;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}

/** Tên tệp cho thư mục của một người — theo NGÀY, không theo tên người. */
export function tenTepThuMuc(taoLuc: string): string {
  return `${TEN_TEP_THU_MUC}-${taoLuc.slice(0, 10)}.zip`;
}
