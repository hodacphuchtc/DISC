/**
 * CỬA KIỂM CỦA `27.1` — mảng nhấn tối "Aurora".
 *
 * Quy ước thương hiệu cấm nền tối toàn trang; chủ dự án chốt ngoại lệ HẸP ngày 30/10/2026
 * (xem `docs/decisions/nhat-ky-quyet-dinh.md`). Ngoại lệ chỉ an toàn khi bốn điều còn đúng:
 *  1. chữ đặt lên nền tối đọc được ở CẢ chỗ sáng nhất của gradient,
 *  2. token CSS và token TypeScript không lệch nhau,
 *  3. bản in trả mảng về nền sáng (không in nền tối, không in chữ trắng lên giấy trắng),
 *  4. chuyển động của mảng chỉ chạy khi người dùng không bật "Giảm chuyển động".
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { MAU } from "../config/thuong-hieu";

const CSS = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function sang([r, g, b]: readonly number[]): number {
  const k = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * k(r) + 0.7152 * k(g) + 0.0722 * k(b);
}

function tuongPhan(a: readonly number[], b: readonly number[]): number {
  const [x, y] = [sang(a), sang(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Trộn `mau` (độ đặc `a`) lên `nen` — đúng phép của radial-gradient trong suốt. */
function tron(nen: readonly number[], mau: readonly number[], a: number): number[] {
  return nen.map((v, i) => Math.round(v * (1 - a) + mau[i] * a));
}

describe("27.1 — mảng nhấn tối", () => {
  const nen = rgb(MAU.nenToi);
  // Hai điểm sáng nhất của gradient trong globals.css: quầng tím (160,60,220 @ .5) và cam (255,111,0 @ .3).
  const diemSang = {
    nen: nen,
    quangTim: tron(nen, [160, 60, 220], 0.5),
    quangCam: tron(nen, [255, 111, 0], 0.3),
  };

  for (const [ten, nenDo] of Object.entries(diemSang)) {
    it(`chữ chính đạt ≥ 4,5:1 trên ${ten}`, () => {
      expect(tuongPhan(rgb(MAU.chuTrenToi), nenDo)).toBeGreaterThanOrEqual(4.5);
    });
    it(`chữ mờ đạt ≥ 4,5:1 trên ${ten}`, () => {
      expect(tuongPhan(rgb(MAU.chuMoTrenToi), nenDo)).toBeGreaterThanOrEqual(4.5);
    });
  }

  it("token CSS khớp token TypeScript", () => {
    const lay = (ten: string) =>
      new RegExp(`--color-${ten}:\\s*(#[0-9a-f]{6})`, "iu").exec(CSS)?.[1]?.toUpperCase();
    expect(lay("nen-toi")).toBe(MAU.nenToi.toUpperCase());
    expect(lay("chu-tren-toi")).toBe(MAU.chuTrenToi.toUpperCase());
    expect(lay("chu-mo-tren-toi")).toBe(MAU.chuMoTrenToi.toUpperCase());
  });

  it("bản in trả mảng nhấn về nền sáng, chữ đen, bỏ lưới và chip", () => {
    const khoiIn = /@media print \{([\s\S]*?)\n\}\n\n\/\* ── Chuyển động nhẹ/u.exec(CSS)?.[1] ?? "";
    expect(khoiIn).toMatch(/\[data-nhan-toi\]\s*\{[^}]*background:\s*#fff\s*!important/u);
    expect(khoiIn).toMatch(/\[data-nhan-toi\]\s*\{[^}]*color:\s*#171717\s*!important/u);
    expect(khoiIn).toMatch(/\[data-nhan-toi\] \*\s*\{[^}]*color:\s*inherit\s*!important/u);
    expect(khoiIn).toMatch(/\[data-chip-disc\][^{]*\{[^}]*display:\s*none\s*!important/u);
  });

  it("mọi animation của mảng nằm trong nhánh no-preference", () => {
    const ra = CSS.replace(
      /@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*?\n\}\n/gu,
      "",
    );
    expect(ra).not.toMatch(/animation:\s*(luoi-troi|chip-tho|radar-bung)/u);
    expect(CSS).toMatch(/@media \(prefers-reduced-motion: no-preference\)[\s\S]*radar-bung/u);
    expect(CSS).toMatch(/@media \(prefers-reduced-motion: no-preference\)[\s\S]*luoi-troi/u);
  });
});
