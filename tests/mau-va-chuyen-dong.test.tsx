/**
 * CỬA KIỂM CỦA `16.8` — màu chữ phải đọc được, và chuyển động phải tắt được.
 *
 * 🔴 VÌ SAO ĐÂY LÀ MỘT FILE MỚI, KHÔNG PHẢI PHẦN MỞ RỘNG CỦA `do-chu.test.ts`. Sổ kế
 * hoạch ghi *"mở rộng tests/do-chu.test.ts (đo tương phản…)"*, nhưng file đó đo **chữ có
 * vừa khung không** — hoàn toàn không liên quan. Và phép đo tương phản mà `CLAUDE.md` nhắc
 * tới (vẽ màu lên canvas 1×1 rồi đọc pixel) **không còn tồn tại trong repo**: nó là một
 * phép đo Playwright thời GĐ7, chỉ còn lại bài học chứ không còn cửa. Nên ở đây dựng cửa
 * mới, và dựng bằng số học thay vì bằng canvas — jsdom không có canvas thật, mà một cửa
 * kiểm phụ thuộc thứ jsdom giả lập là một cửa kiểm không đáng tin.
 *
 * Hai luật, đọc lên chính là bài học đã trả giá:
 *
 *  1. **Cam thương hiệu `#FF8F2D` KHÔNG BAO GIỜ làm màu chữ** — trên nền trắng nó chỉ đạt
 *     2,28:1, dưới cả ngưỡng chữ to. Viền và mảng màu thì được.
 *  2. **Mọi chuyển động phải có nhánh `motion-reduce`** — thử ở cả hai trạng thái, vì một
 *     hiệu ứng chỉ được thử lúc đang bật thì đúng bằng không có gì để tắt.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { MAU } from "../config/thuong-hieu";
import { TRUC } from "../config/disc-tu-dien";
import { MA_TRUC } from "../modules/core/bo-de/kieu";

const GOC = process.cwd();

/* ── Đo tương phản bằng số học, đúng công thức WCAG 2.x ───────────────────── */

function kenh(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function doSang(hex: string): number {
  const m = /^#([0-9a-f]{6})$/iu.exec(hex.trim());
  if (!m) throw new Error(`Chỉ nhận mã hex 6 số, nhận được "${hex}"`);
  const n = parseInt(m[1], 16);
  return (
    0.2126 * kenh((n >> 16) & 255) + 0.7152 * kenh((n >> 8) & 255) + 0.0722 * kenh(n & 255)
  );
}

export function tuongPhan(a: string, b: string): number {
  const [x, y] = [doSang(a), doSang(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const TRANG = "#FFFFFF";

/* ── Quét nguồn giao diện ─────────────────────────────────────────────────── */

function quet(d: string, ra: string[] = []): string[] {
  for (const t of readdirSync(d)) {
    const p = join(d, t);
    if (statSync(p).isDirectory()) quet(p, ra);
    else if (/\.tsx?$/u.test(t)) ra.push(p);
  }
  return ra;
}

const NGUON = quet(join(GOC, "app")).map((p) => [p.replace(`${GOC}/`, ""), readFileSync(p, "utf8")] as const);

describe("bộ đo tương phản của chính cửa kiểm này", () => {
  it("đen trên trắng = 21:1, trắng trên trắng = 1:1", () => {
    expect(tuongPhan("#000000", TRANG)).toBeCloseTo(21, 1);
    expect(tuongPhan(TRANG, TRANG)).toBeCloseTo(1, 5);
  });

  it("🔴 xác nhận lại con số đã trả giá: cam thương hiệu trên trắng = 2,28:1", () => {
    expect(tuongPhan(MAU.camNangLuong, TRANG)).toBeCloseTo(2.28, 1);
  });
});

describe("màu CHỮ phải đọc được", () => {
  it("`camDamChoChu` đạt ngưỡng chữ thường (4,5:1)", () => {
    expect(tuongPhan(MAU.camDamChoChu, TRANG)).toBeGreaterThanOrEqual(4.5);
  });

  it("`timCongNghe` và `muc` đạt ngưỡng chữ thường", () => {
    expect(tuongPhan(MAU.timCongNghe, TRANG)).toBeGreaterThanOrEqual(4.5);
    expect(tuongPhan(MAU.muc, TRANG)).toBeGreaterThanOrEqual(4.5);
  });

  it("🔴 KHÔNG file nào dùng cam thương hiệu làm màu CHỮ", () => {
    const pham: string[] = [];
    for (const [ten, nguon] of NGUON) {
      // `color: MAU.camNangLuong` — kể cả viết liền hay có xuống dòng.
      if (/\bcolor:\s*MAU\.camNangLuong\b/u.test(nguon)) pham.push(`${ten} (color)`);
    }
    expect(
      pham,
      `Cam thương hiệu chỉ đạt 2,28:1 trên nền trắng. Dùng MAU.camDamChoChu cho CHỮ.\n${pham.join("\n")}`,
    ).toEqual([]);
  });

  it("bốn màu trục dùng làm CHẤM/VIỀN, và mỗi màu là mã hex hợp lệ", () => {
    for (const t of MA_TRUC) {
      expect(TRUC[t].mau, `trục ${t}`).toMatch(/^#[0-9a-fA-F]{6}$/u);
      // Không khẳng định 4,5:1 cho màu trục — chúng là MẢNG MÀU và VIỀN, không phải chữ.
      // Khẳng định nhầm ở đây là ép đổi bảng màu thương hiệu vì một lý do sai.
      expect(tuongPhan(TRUC[t].mau, TRANG)).toBeGreaterThan(1);
    }
  });
});

describe("🔴 chuyển động phải TẮT ĐƯỢC", () => {
  /** Tiện ích Tailwind sinh ra chuyển động. */
  const CO_DONG = /\b(transition-\[?[a-z-]*\]?|animate-\[[^\]]+\]|animate-[a-z]+)\b/u;

  it("mọi className có chuyển động đều mang nhánh `motion-reduce:`", () => {
    const pham: string[] = [];
    for (const [ten, nguon] of NGUON) {
      for (const dong of nguon.split("\n")) {
        if (!CO_DONG.test(dong)) continue;
        if (dong.includes("motion-reduce:")) continue;
        // Dòng chỉ NHẮC tới tên tiện ích trong chú thích thì không tính.
        if (/^\s*(\*|\/\/|\/\*)/u.test(dong)) continue;
        pham.push(`${ten}: ${dong.trim().slice(0, 90)}`);
      }
    }
    expect(
      pham,
      `Thiếu nhánh motion-reduce (người tắt hiệu ứng thường có lý do sức khoẻ):\n${pham.join("\n")}`,
    ).toEqual([]);
  });

  it("🔴 và có LỚP CHẶN THỨ HAI ở globals.css, bắt chỗ ai đó quên", () => {
    const css = readFileSync(join(GOC, "app/globals.css"), "utf8");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toMatch(/animation-duration:\s*0\.01ms\s*!important/u);
    expect(css).toMatch(/transition-duration:\s*0\.01ms\s*!important/u);
  });

  it("khuôn `hien-dan` có thật — một className trỏ vào keyframes không tồn tại thì im lặng", () => {
    const css = readFileSync(join(GOC, "app/globals.css"), "utf8");
    const dung = NGUON.some(([, n]) => n.includes("animate-[hien-dan"));
    expect(dung, "không còn ai dùng hien-dan thì gỡ keyframes đi").toBe(true);
    expect(css).toContain("@keyframes hien-dan");
  });
});
