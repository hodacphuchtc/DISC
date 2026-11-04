/**
 * CỬA KIỂM bản PDF sức khoẻ (30.5, ADR-010): nội dung dòng, hàng rào an toàn, và việc PDF
 * thật sự sinh ra được dưới Node (jsPDF + font Việt).
 *
 * 🔴 Mọi người ở đây là BỊA.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { dongChoSucKhoe } from "../modules/report/noi-dung-suc-khoe";
import { quenFontDaTai, xuatPdfSucKhoe } from "../modules/report/xuat-pdf";
import type { NguoiSucKhoe } from "../modules/core/suc-khoe/kieu";
import { themMocDo } from "../modules/core/suc-khoe/so-suc-khoe";

let dem = 0;
const taoId = () => `p-${++dem}`;

function nguoi(
  ten: string,
  ngaySinh: string,
  kg: number,
  cm: number,
  nhieuBan = false,
): NguoiSucKhoe {
  let ds: readonly NguoiSucKhoe[] = [];
  const them = (ngayDo: string, canNangKg: number) => {
    const r = themMocDo(
      ds,
      {
        ten,
        ngaySinh,
        gioiTinh: "nu",
        moc: { ngayDo, canNangKg, chieuCaoCm: cm },
      },
      "2026-11-03T09:00:00+07:00",
      taoId,
    );
    if (r.kq !== "ok") throw new Error("phải ok");
    ds = r.ds;
  };
  if (nhieuBan) them("2026-08-03", kg - 1.5);
  them("2026-11-03", kg);
  return ds[0]!;
}

describe("nội dung dòng PDF sức khoẻ", () => {
  it("có tên người, bản mới nhất, lời khuyên theo tuổi và TOÀN VĂN lời nhắn quan trọng", () => {
    const chu = dongChoSucKhoe(nguoi("Bé Bịa", "2017-02-20", 28, 132, true))
      .map((d) => d.chu)
      .join("\n");
    expect(chu).toContain("Bé Bịa");
    expect(chu).toContain("03/11/2026");
    expect(chu).toContain("Các bản cũ hơn");
    expect(chu).toContain("Đừng bỏ bữa sáng");
    expect(chu).toContain("115");
    expect(chu).toContain("SATA ROBO không chịu trách nhiệm");
  });

  it("🔴 phần LỜI KHUYÊN trong PDF của trẻ em KHÔNG có chữ giảm cân/ăn kiêng/béo phì", () => {
    const tatCa = dongChoSucKhoe(nguoi("Bé Bịa", "2017-02-20", 70, 132))
      .map((d) => d.chu)
      .join("\n");
    // Lời nhắn quan trọng (cuối tờ) CÓ nhắc "giảm cân" — để CẤM tự ý áp dụng cho trẻ — nên chỉ
    // quét phần đứng TRƯỚC nó, tức phần lời khuyên thật sự.
    const loiKhuyen = tatCa
      .slice(0, tatCa.indexOf("Lời nhắn quan trọng"))
      .replace(/Không cần đếm calo cho bé\./u, "");
    expect(tatCa).toContain("Lời nhắn quan trọng");
    expect(loiKhuyen).not.toMatch(/giảm cân|ăn kiêng|béo phì|thừa cân/iu);
  });

  it("🔴 không có emoji (font Be Vietnam Pro không có glyph — ra ô vuông)", () => {
    const chu = dongChoSucKhoe(nguoi("Mẹ Bịa", "1990-03-15", 54, 158))
      .map((d) => d.chu)
      .join("\n");
    expect(chu).not.toMatch(/\p{Extended_Pictographic}/u);
  });
});

describe("sinh PDF thật", () => {
  beforeEach(() => {
    quenFontDaTai();
    // Trong Node không có máy chủ phục vụ /fonts/: đọc thẳng tệp font thật, như trình duyệt sẽ tải.
    const font = readFileSync(
      join(process.cwd(), "public/fonts/BeVietnamPro-Regular.ttf"),
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        arrayBuffer: async () =>
          font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength),
      })),
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("ra một tệp PDF hợp lệ, tên tệp không dấu", async () => {
    const tep = await xuatPdfSucKhoe(
      nguoi("Bé Bịa", "2017-02-20", 28, 132, true),
      new Date("2026-11-03T09:00:00+07:00"),
    );
    expect(tep.ten).toMatch(/^suc-khoe-Be-Bia-2026-11-03-\d{2}h\d{2}\.pdf$/u);
    expect(new TextDecoder().decode(tep.duLieu.slice(0, 5))).toBe("%PDF-");
    expect(tep.duLieu.byteLength).toBeGreaterThan(5000);
  }, 30000);
});
