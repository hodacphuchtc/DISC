/**
 * NÉT VẼ BỐN NHÂN VẬT — NGUỒN DUY NHẤT.
 *
 * 🔴 Vì sao file này tồn tại: nhân vật xuất hiện ở HAI nơi — trên màn hình (React/SVG) và
 * trong tấm ảnh PNG chia sẻ (Canvas). Nếu mỗi nơi có một bản vẽ riêng thì hai bản chỉ
 * lệch nhau vào đúng ngày ai đó sửa một bên — và người sửa sẽ không biết mình vừa làm
 * lệch cái kia.
 *
 * Ở đây chỉ có DỮ LIỆU hình. Cách hiển thị do nơi gọi quyết định.
 * Thuộc TẦNG LÕI: không React, không DOM.
 */

import type { MaTruc } from "@modules/core/bo-de/kieu";

export type Net =
  | { readonly loai: "path"; readonly d: string }
  | { readonly loai: "circle"; readonly cx: number; readonly cy: number; readonly r: number }
  | {
      readonly loai: "rect";
      readonly x: number;
      readonly y: number;
      readonly rong: number;
      readonly cao: number;
      readonly rx: number;
    };

export const KHUNG_NHAN_VAT = { rong: 130, cao: 140, doDamNet: 3.2 } as const;

/** Ăng-ten · đầu · cổ · thân · chân — phần chung của cả bốn con. */
const BO_KHUNG: readonly Net[] = [
  { loai: "circle", cx: 60, cy: 12, r: 4 },
  { loai: "path", d: "M60 16v10" },
  { loai: "rect", x: 32, y: 26, rong: 56, cao: 44, rx: 13 },
  { loai: "path", d: "M60 70v7" },
  { loai: "rect", x: 36, y: 77, rong: 48, cao: 39, rx: 11 },
  { loai: "path", d: "M49 116v12M71 116v12" },
];

const RIENG: Readonly<Record<MaTruc, readonly Net[]>> = {
  // Rô Xung Phong — luôn giơ tay trước, tay cầm cờ.
  D: [
    { loai: "circle", cx: 48, cy: 45, r: 4 },
    { loai: "circle", cx: 72, cy: 45, r: 4 },
    { loai: "path", d: "M51 59h18" },
    { loai: "path", d: "M84 88l14-20" },
    { loai: "path", d: "M98 68V34" },
    { loai: "path", d: "M98 37l20 8-20 8z" },
    { loai: "path", d: "M36 88L22 100" },
    { loai: "path", d: "M44 128h12M66 128h14" },
  ],
  // Rô Kể Chuyện — miệng loa, bong bóng thoại.
  I: [
    { loai: "circle", cx: 48, cy: 45, r: 4 },
    { loai: "circle", cx: 72, cy: 45, r: 4 },
    { loai: "path", d: "M52 53v14l22 7V46z" },
    { loai: "circle", cx: 99, cy: 40, r: 8 },
    { loai: "circle", cx: 112, cy: 24, r: 4.5 },
    { loai: "path", d: "M84 88l13-9M36 88l-13-9" },
    { loai: "path", d: "M43 128h12M65 128h12" },
  ],
  // Rô Giữ Nhịp — mắt hiền, tay đỡ, chân đứng vững.
  S: [
    { loai: "path", d: "M43 47q5-7 10 0M67 47q5-7 10 0" },
    { loai: "path", d: "M51 60q9 7 18 0" },
    { loai: "path", d: "M84 90l12 6q4 2 2-3" },
    { loai: "path", d: "M36 90l-12 6q-4 2-2-3" },
    { loai: "path", d: "M38 128h20M62 128h20" },
  ],
  // Rô Tỉ Mỉ — kính lúp, bảng kiểm.
  C: [
    { loai: "circle", cx: 48, cy: 45, r: 3.4 },
    { loai: "circle", cx: 72, cy: 45, r: 3.4 },
    { loai: "path", d: "M53 59h14" },
    { loai: "path", d: "M84 90l8 2" },
    { loai: "circle", cx: 104, cy: 76, r: 11 },
    { loai: "path", d: "M96 85l-5 6" },
    { loai: "path", d: "M36 90l-9 3" },
    { loai: "rect", x: 8, y: 72, rong: 22, cao: 30, rx: 3 },
    { loai: "path", d: "M13 81l3 3 5-6M13 91l3 3 5-6" },
  ],
};

export function netNhanVat(truc: MaTruc): readonly Net[] {
  return [...BO_KHUNG, ...RIENG[truc]];
}

/** Dựng chuỗi SVG hoàn chỉnh — dùng cho Canvas (nạp qua data URI) và cho việc xuất file. */
export function chuoiSvgNhanVat(truc: MaTruc, mau: string): string {
  const than = netNhanVat(truc)
    .map((n) => {
      if (n.loai === "path") return `<path d="${n.d}"/>`;
      if (n.loai === "circle") return `<circle cx="${n.cx}" cy="${n.cy}" r="${n.r}"/>`;
      return `<rect x="${n.x}" y="${n.y}" width="${n.rong}" height="${n.cao}" rx="${n.rx}"/>`;
    })
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${KHUNG_NHAN_VAT.rong} ${KHUNG_NHAN_VAT.cao}" ` +
    `width="${KHUNG_NHAN_VAT.rong}" height="${KHUNG_NHAN_VAT.cao}" fill="none" stroke="${mau}" ` +
    `stroke-width="${KHUNG_NHAN_VAT.doDamNet}" stroke-linecap="round" stroke-linejoin="round">${than}</svg>`
  );
}
