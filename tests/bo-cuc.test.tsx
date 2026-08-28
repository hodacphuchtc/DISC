/**
 * CỬA KIỂM CỦA `17.6` + `17.7` — bố cục máy tính.
 *
 * 🔴 CỬA NÀY CANH HAI CHIỀU, KHÔNG PHẢI MỘT. Chiều thứ nhất là chiều hiển nhiên: khung
 * không được khoá ở 768px nữa, lưới thẻ phải có mốc nhiều cột. Chiều thứ hai quan trọng
 * không kém và dễ quên: **các màn ĐỌC-VÀ-TRẢ-LỜI phải GIỮ khung hẹp**. Chủ dự án nêu đúng
 * vấn đề — màn 1920px thừa hai phần ba — nhưng cách sửa sai là kéo mọi thứ ra full-width.
 * Sản phẩm này nội dung chính là chữ để phụ huynh đọc, và một dòng 200 ký tự làm mắt lạc
 * dòng khi nhảy xuống dòng dưới. Không có cửa chiều thứ hai thì lần sửa sau sẽ nới nốt.
 *
 * ⚠️ GIỚI HẠN PHẢI NÓI TRƯỚC: jsdom **không có bộ dựng layout**. Cửa này soi LỚP CSS trong
 * mã nguồn, không đo pixel. Việc mở trên màn thật để nhìn là bước (b) của hạng mục và nó
 * thuộc về người — xem thêm `tests/be-ngang.test.tsx`.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { KHUNG } from "../config/bo-cuc";

const GOC = process.cwd();

function quet(d: string, ra: string[] = []): string[] {
  for (const t of readdirSync(d)) {
    const p = join(d, t);
    if (statSync(p).isDirectory()) quet(p, ra);
    else if (/\.tsx$/u.test(t)) ra.push(p);
  }
  return ra;
}

const NGUON = quet(join(GOC, "app")).map(
  (p) => [p.replace(`${GOC}/`, ""), readFileSync(p, "utf8")] as const,
);

/**
 * 🔴 Khớp ĐÚNG tên tệp, không dùng `endsWith`. `endsWith("ket-qua.tsx")` bắt trúng cả
 * `chon-ban-ket-qua.tsx` — và cửa kiểm im lặng đi soi nhầm file. Tên ngắn nằm lọt trong
 * tên dài là bẫy đã cắn dự án này một lần rồi (biệt danh "Bi" khớp vào "Biệt danh").
 */
const doc = (ten: string) => NGUON.find(([t]) => t.split("/").pop() === ten)?.[1] ?? "";

describe("bảng bề rộng gom về một chỗ", () => {
  it("`config/bo-cuc.ts` khai đủ những khung mà giao diện cần", () => {
    for (const k of ["trang", "doc", "luoiThe", "haiCot", "dem"] as const) {
      expect(KHUNG[k], `thiếu khung "${k}"`).toBeTruthy();
    }
  });

  it("khung trang căn giữa và có trần — KHÔNG kéo hết bề ngang màn 4K", () => {
    expect(KHUNG.trang).toContain("mx-auto");
    expect(KHUNG.trang).toMatch(/max-w-\[\d+px\]/u);
  });

  it("🔴 khung ĐỌC vẫn hẹp — đây là hàng rào chống nới quá tay", () => {
    // `max-w-2xl` ≈ 672px ≈ 70 ký tự. Con số của ngành in, không phải sở thích.
    expect(KHUNG.doc).toBe("max-w-2xl");
  });
});

describe("🔴 nới cái CẦN nới", () => {
  it("lưới thẻ gia đình có mốc từ 3 cột trở lên", () => {
    const soCot = [...KHUNG.luoiThe.matchAll(/grid-cols-(\d+)/gu)].map((m) => Number(m[1]));
    expect(Math.max(...soCot), "sáu người vẫn phải cuộn trên màn rộng").toBeGreaterThanOrEqual(3);
  });

  it("bảng gia đình DÙNG khung trang và lưới nhiều cột, không gõ cứng nữa", () => {
    const nguon = doc("bang-gia-dinh.tsx");
    expect(nguon).toContain("KHUNG.trang");
    expect(nguon).toContain("KHUNG.luoiThe");
  });

  it("khung các bước dùng khung trang", () => {
    expect(doc("cac-buoc.tsx")).toContain("KHUNG.trang");
  });

  it("bản phân tích cả nhà xếp HAI CỘT ở màn rộng", () => {
    expect(doc("ban-tong-hop.tsx")).toContain("KHUNG.haiCot");
    expect(KHUNG.haiCot).toContain("lg:grid-cols-2");
  });

  it("🔴 mỗi bản trong lưới hai cột VẪN giữ khung đọc bên trong", () => {
    // Nới bố cục mà không giữ khung đọc bên trong thì mỗi cột rộng ~700px vẫn ổn, nhưng
    // trên màn 2560px mỗi cột thành ~1100px và dòng chữ lại dài y như trước khi sửa.
    const nguon = doc("ban-tong-hop.tsx");
    const i = nguon.indexOf('data-thu="ban-tong-hop"');
    expect(i).toBeGreaterThan(-1);
    expect(nguon.slice(i - 200, i + 300)).toContain("KHUNG.doc");
  });

  it("màn kết quả hai cột ở nửa trên, và GỠ grid khi in", () => {
    const nguon = doc("ket-qua.tsx");
    expect(nguon).toContain("xl:grid-cols-2");
    // 🔴 Hợp đồng @media print của màn này có năm lớp; một grid lọt vào bản in là thứ chỉ
    // lộ ra khi xem trước bản in, tức là muộn.
    expect(nguon, "grid phải gỡ khi in").toContain("print:block");
  });
});

describe("🔴 GIỮ cái cần giữ — màn đọc-và-trả-lời không được nới", () => {
  for (const man of [
    "disc.tsx",
    "lam-bai.tsx",
    "truoc-khi-bat-dau.tsx",
    "vung-lech.tsx",
  ] as const) {
    it(`${man} vẫn giữ khung hẹp`, () => {
      const nguon = doc(man);
      expect(nguon, `${man} không còn khung hẹp — dòng chữ sẽ dài ra`).toContain("max-w-2xl");
      expect(nguon, `${man} bị kéo full-width`).not.toContain("max-w-none");
    });
  }

  it("KHÔNG màn nào còn gõ cứng `max-w-3xl` — con số 768px là gốc của cả vấn đề", () => {
    const pham = NGUON.filter(([, n]) => n.includes("max-w-3xl")).map(([t]) => t);
    expect(
      pham,
      `Còn khoá ở 768px: ${pham.join(", ")}. Dùng KHUNG ở config/bo-cuc.ts.`,
    ).toEqual([]);
  });
});
