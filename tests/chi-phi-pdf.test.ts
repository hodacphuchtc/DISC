/**
 * HẠNG MỤC `17.1` — ĐO TRƯỚC, KHÔNG XÂY GÌ CẢ.
 *
 * 🔴 VÌ SAO ĐÂY LÀ HẠNG MỤC ĐẦU TIÊN CỦA CẢ GÓI. GĐ 17B định gói **một tệp PDF cho mỗi
 * bài của mỗi người, CỘNG mỗi người một tờ cho mỗi lần phân tích**. Trường hợp xấu nhất
 * là 6 người × 2 bài + 5 lần phân tích × 6 bản = **42 tệp trong một lần bấm**, mỗi tệp
 * nhúng trọn font 133 KB. Nếu con số đó ra vài MB và cả chục giây thì cả hình dạng của
 * GĐ 17B phải đổi — và đo muộn nghĩa là đập đi làm lại.
 *
 * File này **không thêm tính năng nào**. Nó lấy SỐ, in ra, và ghim hai cái trần. Trần vượt
 * thì đỏ, cố ý: một phép đo không có ngưỡng thì chỉ là một dòng log không ai đọc.
 *
 * 🔴 Mọi tên là BỊA.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import JSZip from "jszip";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { phanTichGiaDinh } from "../modules/report/phan-tich-gia-dinh";
import type { BanPhanTich } from "../modules/report/phan-tich-gia-dinh";
import { DUONG_FONT, quenFontDaTai, xuatPdfMoiNguoi } from "../modules/report/xuat-pdf";

/* ── Hai cái trần. Vượt là ĐỎ, và là tín hiệu phải đổi thiết kế, không phải nới trần ── */

/** Quá mốc này thì người dùng nghĩ máy treo. */
const TRAN_GIAY_XAU_NHAT = 10;
/** Quá mốc này thì tệp tải về thành gánh nặng, nhất là trên 4G. */
const TRAN_MB_XAU_NHAT = 8;

const TEN = ["Zozo", "Kiki", "Momo", "Nono", "Papa", "Quuu"] as const;

/** Sáu bộ điểm KHÁC NHAU — hai người y hệt nhau thì lát cắt rỗng và tệp ngắn giả tạo. */
const DIEM = [
  { D: 80, I: 30, S: 40, C: 55 },
  { D: 25, I: 78, S: 62, C: 33 },
  { D: 45, I: 40, S: 85, C: 28 },
  { D: 35, I: 55, S: 25, C: 82 },
  { D: 62, I: 68, S: 35, C: 40 },
  { D: 30, I: 45, S: 70, C: 66 },
];

function banCuaNha(soNguoi: number): readonly BanPhanTich[] {
  const kq = phanTichGiaDinh(
    Array.from({ length: soNguoi }, (_, i) => ({
      id: `tv-${i}`,
      ten: TEN[i],
      laTre: i % 2 === 1,
      diem: DIEM[i],
    })),
  );
  if (!kq.phanTichDuoc) throw new Error("dữ liệu bịa phải phân tích được");
  return kq.ban;
}

const LUC = new Date("2026-08-28T20h30".replace("h", ":") + ":00+07:00");

beforeEach(() => {
  quenFontDaTai();
  const ttf = readFileSync(join(process.cwd(), "public/fonts/BeVietnamPro-Regular.ttf"));
  vi.stubGlobal(
    "fetch",
    vi.fn(async (duong: string) => {
      if (String(duong) !== DUONG_FONT) throw new Error(`không mong đợi fetch ${duong}`);
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () =>
          ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength),
      };
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  quenFontDaTai();
});

type Doi = {
  readonly ten: string;
  readonly soTep: number;
  readonly giay: number;
  readonly thoMB: number;
  readonly zipMB: number;
  readonly trungBinhKB: number;
};

/** Sinh `soTep` tệp PDF rồi gói lại — đúng việc mà nút *Sao lưu* sẽ làm ở GĐ 17B. */
async function do1(ten: string, soTep: number): Promise<Doi> {
  const ban = banCuaNha(6);
  const batDau = performance.now();

  const tep: { ten: string; duLieu: Uint8Array }[] = [];
  let i = 0;
  while (tep.length < soTep) {
    const lo = await xuatPdfMoiNguoi(ban.slice(0, Math.min(6, soTep - tep.length)), LUC);
    for (const t of lo) tep.push({ ten: `${i}-${t.ten}`, duLieu: t.duLieu });
    i += 1;
  }

  const zip = new JSZip();
  for (const t of tep) zip.file(t.ten, t.duLieu);
  const goi = await zip.generateAsync({ type: "uint8array" });
  const giay = (performance.now() - batDau) / 1000;

  const tho = tep.reduce((n, t) => n + t.duLieu.length, 0);
  return {
    ten,
    soTep: tep.length,
    giay,
    thoMB: tho / 1024 / 1024,
    zipMB: goi.length / 1024 / 1024,
    trungBinhKB: tho / tep.length / 1024,
  };
}

function inBang(ds: readonly Doi[]): void {
  const d = (n: number, s = 1) => n.toFixed(s).padStart(7);
  console.log("\n┌── CHI PHÍ SINH PDF (17.1) ──────────────────────────────────────┐");
  console.log("│ trường hợp          tệp    giây   thô MB   zip MB   TB KB/tệp   │");
  for (const x of ds) {
    console.log(
      `│ ${x.ten.padEnd(18)} ${String(x.soTep).padStart(4)} ${d(x.giay, 2)} ` +
        `${d(x.thoMB, 2)}  ${d(x.zipMB, 2)}  ${d(x.trungBinhKB, 0)}     │`,
    );
  }
  console.log("└─────────────────────────────────────────────────────────────────┘");
  console.log(`  Trần đã ghim: ${TRAN_GIAY_XAU_NHAT}s · ${TRAN_MB_XAU_NHAT} MB (trường hợp xấu nhất)\n`);
}

describe("🔴 17.1 — chi phí sinh nhiều tệp PDF", () => {
  it("đo TRƯỜNG HỢP HAY GẶP và TRƯỜNG HỢP XẤU NHẤT, rồi ghim trần", async () => {
    // Hay gặp: nhà 3 người, mỗi người 1 bài, chạy phân tích 1 lần ⇒ 3 + 3 = 6 tệp.
    const hayGap = await do1("hay gặp (3 người)", 6);
    // Xấu nhất: 6 người × 2 bài + 5 lần phân tích × 6 bản = 12 + 30 = 42 tệp.
    const xauNhat = await do1("xấu nhất (6 người)", 42);

    inBang([hayGap, xauNhat]);

    for (const x of [hayGap, xauNhat]) {
      expect(x.soTep, `${x.ten}: thiếu tệp`).toBeGreaterThan(0);
      expect(x.zipMB, `${x.ten}: gói rỗng`).toBeGreaterThan(0);
    }

    // 🔴 Hai cái trần. Vượt ⇒ DỪNG và báo chủ dự án; ba lối thoát đã ghi trong PLAN_V2.md
    // hạng mục 17.1. Nới trần là lựa chọn CUỐI, và phải nói ra vì sao người dùng nên chịu.
    expect(
      xauNhat.giay,
      `Sinh 42 tệp mất ${xauNhat.giay.toFixed(1)}s — quá trần ${TRAN_GIAY_XAU_NHAT}s. ` +
        `Đổi thiết kế: gộp 2 bản/người vào một tệp nhiều trang, hoặc chỉ xuất lần phân tích mới nhất.`,
    ).toBeLessThan(TRAN_GIAY_XAU_NHAT);
    expect(
      xauNhat.zipMB,
      `Gói 42 tệp nặng ${xauNhat.zipMB.toFixed(1)} MB — quá trần ${TRAN_MB_XAU_NHAT} MB. ` +
        `Đổi thiết kế, hoặc cắt font xuống bộ ký tự thật sự dùng.`,
    ).toBeLessThan(TRAN_MB_XAU_NHAT);
  }, 180_000);

  it("mọi tệp sinh ra là PDF thật, không phải tệp rỗng đo cho đẹp số", async () => {
    const tep = await xuatPdfMoiNguoi(banCuaNha(6), LUC);
    expect(tep).toHaveLength(6);
    for (const t of tep) {
      expect(new TextDecoder().decode(t.duLieu.subarray(0, 5))).toBe("%PDF-");
      expect(t.duLieu.length).toBeGreaterThan(1000);
    }
  }, 60_000);

  /**
   * 🔴 KẾT LUẬN QUAN TRỌNG NHẤT CỦA CẢ HẠNG MỤC 17.1.
   *
   * Lo ban đầu là mỗi tệp nhúng TRỌN font 133 KB ⇒ 42 tệp thành vài chục MB. Đo ra thì
   * một tệp chỉ **48 KB — NHỎ HƠN chính tệp font gốc**. Nghĩa là jsPDF **tự cắt font
   * xuống bộ ký tự thật sự dùng**, không nhúng cả bảng glyph.
   *
   * ⇒ Việc "cắt font" trong danh sách lối thoát của 17.1 là **thừa** — nó đã được làm sẵn.
   * Cửa dưới đây khoá lại phát hiện đó: ngày nào một tệp PDF phình to hơn font gốc thì
   * hoặc thư viện đã đổi hành vi, hoặc ai đó vừa tắt mất cơ chế cắt.
   */
  it("🔴 jsPDF TỰ CẮT FONT — một tệp PDF phải NHỎ HƠN tệp font gốc", async () => {
    const mot = (await xuatPdfMoiNguoi(banCuaNha(2), LUC))[0];
    const font = readFileSync(join(process.cwd(), "public/fonts/BeVietnamPro-Regular.ttf"));
    console.log(
      `\n  Một tệp PDF: ${(mot.duLieu.length / 1024).toFixed(0)} KB · ` +
        `font gốc ${(font.length / 1024).toFixed(0)} KB · ` +
        `nén gzip còn ${(gzipSync(mot.duLieu).length / 1024).toFixed(0)} KB` +
        ` ⇒ jsPDF có cắt font\n`,
    );
    expect(
      mot.duLieu.length,
      "Tệp PDF to hơn cả font gốc — cơ chế cắt font đã hỏng hoặc bị tắt.",
    ).toBeLessThan(font.length);
  }, 60_000);
});
