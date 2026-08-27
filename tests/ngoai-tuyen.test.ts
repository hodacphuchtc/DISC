import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const GOC = process.cwd();
const SW = join(GOC, "public/sw.js");
const RA = join(GOC, "out");
const DANH_SACH = join(RA, "danh-sach-cache.json");

/**
 * Canh service worker. Hai lỗi đã trả giá 27/08/2026 và cả hai đều IM LẶNG:
 *  1. Chỉ cache "thứ tình cờ thấy" ⇒ mất mạng thì trang lên mà không bấm được gì.
 *  2. Trả vỏ trang cho request .js ⇒ trình duyệt nhận HTML ở chỗ đợi JS, cũng không
 *     bấm được gì, và `requestfailed` báo 0 nên chẳng ai biết hỏng.
 */
describe("service worker — ngoại tuyến", () => {
  const nguon = readFileSync(SW, "utf8");

  it("có file public/sw.js", () => {
    expect(existsSync(SW)).toBe(true);
  });

  it("chỉ nhận GET cùng nguồn — không đụng thứ đi ra ngoài", () => {
    expect(nguon).toMatch(/yc\.method !== "GET"/u);
    expect(nguon).toMatch(/origin !== self\.location\.origin/u);
  });

  it("dọn kho cũ khi đổi phiên bản", () => {
    expect(nguon).toMatch(/caches\.delete/u);
  });

  it("🔴 nạp sẵn theo DANH SÁCH sinh sau build, không dựa vào 'thứ tình cờ thấy'", () => {
    expect(nguon).toMatch(/danh-sach-cache\.json/u);
  });

  it("🔴 CHỈ điều hướng mới được nhận vỏ trang khi mất mạng", () => {
    expect(nguon).toMatch(/yc\.mode === "navigate"/u);
  });

  it("nạp từng mục một — một đường dẫn hỏng không làm hỏng cả mẻ", () => {
    expect(nguon).toMatch(/kho\.add\(d\)\.catch/u);
    // Kiểm LỜI GỌI, không kiểm chữ: chính bình luận cảnh báo trong sw.js có chứa từ này.
    expect(nguon, "addAll ném cả cụm khi một mục hỏng").not.toMatch(/\.addAll\(/u);
  });

  it("chỉ đăng ký ở bản production", () => {
    expect(readFileSync(join(GOC, "app/dang-ky-sw.tsx"), "utf8")).toMatch(
      /NODE_ENV !== "production"/u,
    );
  });

  it("nói rõ với đội dev rằng đây là thứ TOÀN-ỨNG-DỤNG, không thuộc module DISC", () => {
    expect(nguon).toMatch(/TOÀN-ỨNG-DỤNG/u);
    expect(readFileSync(join(GOC, "app/dang-ky-sw.tsx"), "utf8")).toMatch(/TOÀN-ỨNG-DỤNG/u);
  });
});

describe("danh sách nạp sẵn — sinh sau build", () => {
  it("🔴 mọi đường dẫn trong danh sách đều CÓ THẬT trong out/", () => {
    if (!existsSync(DANH_SACH)) return; // chưa build thì bỏ qua
    const ds: string[] = JSON.parse(readFileSync(DANH_SACH, "utf8"));
    expect(ds.length).toBeGreaterThan(3);
    for (const d of ds) {
      const tep = d === "/" ? "index.html" : d.replace(/^\//u, "");
      expect(existsSync(join(RA, tep)), `danh sách trỏ tới "${d}" nhưng out/${tep} không có`).toBe(
        true,
      );
    }
  });

  it("có đủ HTML, JS và CSS — thiếu một loại là mất mạng không dùng được", () => {
    if (!existsSync(DANH_SACH)) return;
    const ds: string[] = JSON.parse(readFileSync(DANH_SACH, "utf8"));
    expect(ds.some((d) => d.endsWith(".js")), "không có JS nào").toBe(true);
    expect(ds.some((d) => d.endsWith(".css")), "không có CSS nào").toBe(true);
    expect(ds).toContain("/");
  });

  it("KHÔNG nạp sẵn trang tạm — chúng bị gỡ ở hạng mục 8.3", () => {
    if (!existsSync(DANH_SACH)) return;
    const ds: string[] = JSON.parse(readFileSync(DANH_SACH, "utf8"));
    expect(ds.filter((d) => d.includes("/thu-"))).toEqual([]);
  });
});
