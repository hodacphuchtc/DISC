import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * 🔴 HÀNG RÀO CHO BẢN IN.
 *
 * jsdom không tính `@media print`, nên không có cách nào chạy thật luật in trong test đơn
 * vị. Nhưng ba luật dưới đây đã được đo bằng trình duyệt thật (Chromium, 27/08/2026) và
 * mỗi luật đều gắn với một cách hỏng CỤ THỂ đã biết. Khoá bằng cách soi chính file CSS:
 * rẻ, và đủ để chặn việc ai đó vô tình gỡ mất.
 *
 * Đo được trên trình duyệt thật: màn hình 0/5 lớp mở · bản in 5/5 lớp mở · bản in có
 * tầng lời khuyên · 5 tiêu đề chỉ-in hiện ra · 0 nút bấm lọt vào giấy.
 */
const CSS = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

/** Thân khối `@media print { … }`. */
function thanKhoiIn(): string {
  const bd = CSS.indexOf("@media print");
  expect(bd, "không còn khối @media print nào trong globals.css").toBeGreaterThan(-1);
  return CSS.slice(bd);
}

describe("🔴 bản in — ba luật đã trả giá mới tìm ra", () => {
  it("lớp bóc sâu được ép hiện khi in", () => {
    // Cách hỏng: nội dung nằm sau `{mo && <div/>}` thì lúc in nó KHÔNG tồn tại trong DOM,
    // và bản PDF mất đúng phần sâu nhất — phần lời khuyên mà cả tính năng này sinh ra vì nó.
    expect(thanKhoiIn()).toMatch(/\[data-lop-sau\]\s*\{[^}]*display:\s*block\s*!important/u);
  });

  it("tiêu đề chỉ-in được bật khi in", () => {
    // Cách hỏng: tiêu đề mỗi lớp nằm TRONG nút bấm, mà nút thì `data-khong-in`. In ra là
    // mất tiêu đề, còn lại mấy đoạn văn không biết thuộc mục nào.
    expect(CSS).toMatch(/\.chi-in\s*\{\s*display:\s*none/u);
    expect(thanKhoiIn()).toMatch(/\.chi-in\s*\{[^}]*display:\s*block\s*!important/u);
  });

  it("🔴 KHÔNG cấm tách trang cho MỌI `section`", () => {
    // Cách hỏng: luật cũ áp `break-inside: avoid-page` cho mọi `section`. Chạy tốt chừng
    // nào màn kết quả còn ngắn; từ lúc có lớp bóc sâu, một section cao hơn một trang giấy
    // mà lại cấm tách sẽ đẩy cả khối sang trang sau — in ra một trang gần trắng.
    const than = thanKhoiIn();
    const luat = than.match(/([^{}]*)\{[^}]*break-inside:\s*avoid-page[^}]*\}/gu) ?? [];
    for (const l of luat) {
      const boChon = l.slice(0, l.indexOf("{"));
      expect(
        /(^|[\s,])section([\s,]|$)/u.test(boChon),
        `bộ chọn "${boChon.trim()}" áp break-inside cho mọi section — sẽ sinh trang gần trắng`,
      ).toBe(false);
    }
    // Vẫn phải giữ luật ở mức khối nhỏ, nếu không đoạn văn bị cắt đôi giữa hai trang.
    expect(than).toMatch(/\.khoi-in/u);
  });

  it("nút bấm và thanh bên không lọt vào giấy", () => {
    expect(thanKhoiIn()).toMatch(/\[data-khong-in\]\s*,?[\s\S]{0,40}\{[^}]*display:\s*none/u);
  });
});
