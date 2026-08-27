/**
 * SAO LƯU BÀI ĐÃ LÀM RA FILE .ZIP.
 *
 * 🔴 `saoLuuTatCa()` gọi thẳng `docTatCa()` và KHÔNG nhận tham số lọc nào. Đây là hàng
 * rào chống đúng cái bẫy đã cắn dự án trước: nút Sao lưu đọc danh sách đang hiển thị
 * (đã lọc theo khoang) nên file tải về THIẾU, mà trông thì vẫn đủ.
 *
 * ⚠️ JSZip chạy được ở cả trình duyệt lẫn Node, nhưng kiểu đầu ra khác nhau: trong Node
 * nó KHÔNG dựng được `Blob`. Hàm này luôn trả `Uint8Array` — nơi gọi tự bọc thành `Blob`
 * khi cần tải về. Nhờ vậy test chạy được mà không cần trình duyệt thật.
 */

import JSZip from "jszip";

import { docTatCa, type BaiLamLuu } from "./kho-bai";

export const TEN_TEP_SAO_LUU = "disc-sao-luu";

export type BanKe = {
  readonly phienBanSaoLuu: 1;
  readonly taoLuc: string;
  readonly soBai: number;
  readonly boDe: readonly string[];
  readonly ghiChu: string;
};

/** Tên tệp an toàn cho mọi hệ điều hành, và không lộ biệt danh ra tên tệp. */
function tenTepCuaBai(bai: BaiLamLuu, thuTu: number): string {
  const ngay = bai.ketThuc.slice(0, 10);
  return `bai/${String(thuTu + 1).padStart(3, "0")}-${bai.boDe}-${ngay}.json`;
}

export async function taoNoiDungZip(
  ds: readonly BaiLamLuu[],
  taoLuc: string,
): Promise<Uint8Array> {
  const zip = new JSZip();

  const banKe: BanKe = {
    phienBanSaoLuu: 1,
    taoLuc,
    soBai: ds.length,
    boDe: [...new Set(ds.map((b) => b.boDe))].sort(),
    ghiChu:
      "Bản sao lưu bài làm DISC. Tệp này chứa dữ liệu cá nhân của người làm bài — " +
      "giữ trong máy, đừng gửi qua nhóm chat.",
  };
  zip.file("ban-ke.json", JSON.stringify(banKe, null, 2));

  ds.forEach((bai, i) => zip.file(tenTepCuaBai(bai, i), JSON.stringify(bai, null, 2)));

  // "uint8array" chứ không phải "blob": chạy được cả trong Node lẫn trình duyệt.
  return zip.generateAsync({ type: "uint8array" });
}

/**
 * 🔴 CỬA DUY NHẤT để sao lưu. Không có tham số. Đừng thêm.
 */
export async function saoLuuTatCa(
  taoLuc: string,
): Promise<{ duLieu: Uint8Array; soBai: number }> {
  const ds = await docTatCa();
  return { duLieu: await taoNoiDungZip(ds, taoLuc), soBai: ds.length };
}
