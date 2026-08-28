/**
 * CỬA KIỂM CỦA `16.6` — PDF thật, mỗi người một tệp, tiếng Việt đủ dấu.
 *
 * 🔴 GIỚI HẠN ĐÃ BIẾT, ghi ra để người sau khỏi tưởng cửa này phủ nhiều hơn thực tế:
 * test không mở được PDF bằng mắt. Nó khẳng định được tệp là PDF thật, tên tệp đúng khuôn,
 * và **tờ của người này không mang BẢN của người kia**. Chuyện *"chữ hiện ra đủ dấu, không
 * ô vuông"* thì chỉ mở tệp trên một máy khác mới biết — đó là bước (b) của hạng mục, việc
 * của người.
 *
 * 🔴 Mọi tên là BỊA.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { dongChoBan, tenTepBan } from "../modules/report/noi-dung-ban";
import type { BanPhanTich } from "../modules/report/phan-tich-gia-dinh";
import { phanTichGiaDinh } from "../modules/report/phan-tich-gia-dinh";
import { DUONG_FONT, quenFontDaTai, xuatPdfMoiNguoi } from "../modules/report/xuat-pdf";

/** Nhà ba người BỊA, điểm khác nhau rõ để chắc chắn có lát cắt có chữ. */
const NHA = [
  { id: "tv-a", ten: "Zozo", laTre: false, diem: { D: 80, I: 30, S: 40, C: 55 } },
  { id: "tv-b", ten: "Kiki", laTre: true, diem: { D: 25, I: 78, S: 62, C: 33 } },
  { id: "tv-c", ten: "Momo", laTre: false, diem: { D: 45, I: 40, S: 85, C: 28 } },
];

function banCuaNha(): readonly BanPhanTich[] {
  const kq = phanTichGiaDinh(NHA);
  if (!kq.phanTichDuoc) throw new Error("dữ liệu bịa phải phân tích được");
  return kq.ban;
}

const LUC = new Date("2026-08-28T16:20:00+07:00");

beforeEach(() => {
  quenFontDaTai();
  // Font thật từ `public/` — không giả bằng vài byte rỗng, vì jsPDF phải phân tích được
  // bảng glyph thì mới nhúng nổi, và một font giả sẽ làm cửa này xanh trên một đường đi
  // mà sản phẩm thật không bao giờ chạy.
  const ttf = readFileSync(join(process.cwd(), "public/fonts/BeVietnamPro-Regular.ttf"));
  vi.stubGlobal(
    "fetch",
    vi.fn(async (duong: string) => {
      if (String(duong) !== DUONG_FONT) throw new Error(`không mong đợi fetch ${duong}`);
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () => ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength),
      };
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  quenFontDaTai();
});

describe("xuất PDF", () => {
  it("nhà 3 người ⇒ ĐÚNG 3 tệp, mỗi tệp là PDF thật", async () => {
    const tep = await xuatPdfMoiNguoi(banCuaNha(), LUC);
    expect(tep).toHaveLength(3);
    for (const t of tep) {
      const dau = new TextDecoder().decode(t.duLieu.subarray(0, 5));
      expect(dau, `${t.ten} không bắt đầu bằng %PDF-`).toBe("%PDF-");
      expect(t.duLieu.length).toBeGreaterThan(1000);
    }
  });

  it("tên tệp có đủ TÊN, NGÀY và GIỜ", async () => {
    const tep = await xuatPdfMoiNguoi(banCuaNha(), LUC);
    expect(tep.map((t) => t.ten)).toEqual([
      "Zozo-2026-08-28-16h20.pdf",
      "Kiki-2026-08-28-16h20.pdf",
      "Momo-2026-08-28-16h20.pdf",
    ]);
  });

  it("tên có dấu thì bỏ dấu ở TÊN TỆP, không bỏ ở nội dung", () => {
    expect(tenTepBan("Bé Đường", LUC)).toBe("Be-Duong-2026-08-28-16h20.pdf");
    expect(tenTepBan("  ", LUC)).toBe("nguoi-2026-08-28-16h20.pdf");
  });

  it("🔴 tờ của người A KHÔNG mang BẢN của người B", () => {
    const ban = banCuaNha();
    const cuaZozo = dongChoBan(ban[0]).map((d) => d.chu);
    const tieuDeCuaNguoiKhac = ban
      .slice(1)
      .map((b) => dongChoBan(b)[0].chu);

    for (const td of tieuDeCuaNguoiKhac) {
      expect(cuaZozo, `bản của Zozo lọt tiêu đề "${td}"`).not.toContain(td);
    }
    // Đối chứng: tờ của Zozo PHẢI có tiêu đề của chính Zozo, nếu không cửa trên xanh vì
    // nội dung rỗng chứ không vì nó tách đúng.
    expect(cuaZozo[0]).toContain("Zozo");
    expect(cuaZozo.length).toBeGreaterThan(5);
  });

  it("🔴 tờ của A VẪN nhắc tên B — một lát cắt là chuyện giữa hai người", () => {
    // Ranh giới của luật "mỗi người một tờ" nằm ở BẢN, không nằm ở cái tên. Ghi lại bằng
    // một cửa kiểm để người sau khỏi siết nhầm rồi làm nội dung mất nghĩa.
    const chu = dongChoBan(banCuaNha()[0]).map((d) => d.chu).join(" ");
    expect(chu).toContain("Kiki");
    expect(chu).toContain("Momo");
  });

  it("font tải HỎNG thì ném, KHÔNG trả về một PDF đầy ô vuông", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 404 })));
    quenFontDaTai();
    await expect(xuatPdfMoiNguoi(banCuaNha(), LUC)).rejects.toThrow(/font/iu);
  });

  it("font chỉ tải MỘT lần cho cả N tệp", async () => {
    await xuatPdfMoiNguoi(banCuaNha(), LUC);
    expect(vi.mocked(globalThis.fetch)).toHaveBeenCalledTimes(1);
  });
});
