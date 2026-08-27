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

/**
 * 🔴 GĐ10 — IN TÁCH BẢN.
 *
 * Cơ chế mới: mỗi dải là một `<section data-ban>`, và `ket-qua.tsx` gắn cờ `data-in-ban`
 * lên `<html>` ngay trước `window.print()`. Bốn luật dưới đây khoá đúng bốn cách nó hỏng.
 */
describe("🔴 in tách bản — ba dải, mỗi dải một người đọc", () => {
  /** Đếm bộ chọn thuộc tính `[…]` — đủ để so độ đặc hiệu giữa hai luật ở đây. */
  function demThuocTinh(boChon: string): number {
    return (boChon.match(/\[[^\]]+\]/gu) ?? []).length;
  }

  function luatCua(bam: RegExp): { boChon: string; than: string } {
    const than = thanKhoiIn();
    const m = than.match(bam);
    expect(m, `không còn luật nào khớp ${String(bam)} trong @media print`).not.toBeNull();
    const cum = m![0];
    return { boChon: cum.slice(0, cum.indexOf("{")), than: cum };
  }

  it("dải bị đóng trên màn hình vẫn được ép hiện khi in", () => {
    // Cách hỏng: dải của bố mẹ đóng sau dải chắn (trẻ cầm máy). Không ép mở khi in thì bố
    // mẹ bấm In ra tờ giấy thiếu đúng phần lời khuyên viết cho họ.
    expect(thanKhoiIn()).toMatch(/\[data-ban\]\s*\{[^}]*display:\s*block\s*!important/u);
  });

  it("in bản của con KHÔNG kéo theo chữ của bố mẹ, và ngược lại", () => {
    // Cách hỏng: chỉ ẩn trên màn hình rồi quên máy in — bố mẹ đưa con tờ giấy có nguyên
    // đoạn người lớn bàn về con. Chặn ở màn hình mà hở ở giấy thì coi như không chặn.
    const than = thanKhoiIn();
    expect(than).toMatch(
      /\[data-in-ban="con"\]\s+\[data-ban="boMe"\][\s\S]{0,80}display:\s*none\s*!important/u,
    );
    expect(than).toMatch(
      /\[data-in-ban="boMe"\]\s+\[data-ban="con"\][\s\S]{0,80}display:\s*none\s*!important/u,
    );
  });

  it("🔴 luật loại trừ phải ĐẶC HIỆU HƠN luật ép mở", () => {
    // Cách hỏng tinh vi nhất: cả hai luật đều `!important`, nên `!important` không phân
    // định được ai thắng — ĐỘ ĐẶC HIỆU mới phân định. Ai đó rút gọn bộ chọn loại trừ
    // xuống một thuộc tính là "ép mở" thắng, và mọi bản in lại dính chữ của cả hai người.
    const epMo = luatCua(/\[data-ban\]\s*\{[^}]*\}/u);
    const loaiTru = luatCua(/\[data-in-ban="con"\][^{]*\{[^}]*\}/u);
    expect(
      demThuocTinh(loaiTru.boChon),
      `bộ chọn loại trừ "${loaiTru.boChon.trim()}" phải nhiều thuộc tính hơn "${epMo.boChon.trim()}"`,
    ).toBeGreaterThan(demThuocTinh(epMo.boChon));
  });

  it("luật tách bản nằm TRONG @media print, không rò ra màn hình", () => {
    // Cách hỏng: đặt ngoài `@media print` thì lúc gắn cờ, nội dung biến mất ngay trên màn
    // hình — người dùng thấy trang nháy trắng rồi mới hiện hộp thoại in.
    const truocKhoiIn = CSS.slice(0, CSS.indexOf("@media print"));
    expect(truocKhoiIn).not.toMatch(/\[data-in-ban/u);
  });
});
