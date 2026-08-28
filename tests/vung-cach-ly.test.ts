import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * VÙNG CÁCH LY `cu/` (V5.1).
 *
 * 🔴 MỘT THƯ MỤC TÊN "CŨ" MÀ KHÔNG CÓ CỬA CANH THÌ CHỈ LÀ MỘT CÁI TÊN. Ngày mai ai đó cần
 * một hàm trong đó, import một phát là xong — và thế là đồ đã nghỉ quay lại đường chạy
 * chính mà không ai chủ ý, mang theo cả những giả định đã lỗi thời của nó.
 *
 * Luật MỘT CHIỀU: `cu/` được đọc `config/` và `modules/`; không chiều ngược lại.
 */

const GOC = process.cwd();

function moiFileMa(thuMuc: string): string[] {
  const ra: string[] = [];
  const di = (d: string) => {
    for (const ten of readdirSync(d)) {
      const p = join(d, ten);
      if (statSync(p).isDirectory()) {
        if (ten === "node_modules" || ten.startsWith(".")) continue;
        di(p);
      } else if (/\.(ts|tsx|mjs)$/u.test(ten)) {
        ra.push(p);
      }
    }
  };
  di(join(GOC, thuMuc));
  return ra;
}

describe("luật một chiều của vùng cách ly", () => {
  it("🔴 KHÔNG file nào đang chạy được import từ `cu/`", () => {
    const pham: string[] = [];
    for (const thuMuc of ["app", "modules", "config", "scripts"]) {
      for (const p of moiFileMa(thuMuc)) {
        const ma = readFileSync(p, "utf8");
        // Bắt cả `from "@/cu/..."`, `from "../cu/..."`, `from "../../cu/..."`.
        if (/from\s+["'][^"']*\bcu\/[^"']*["']/u.test(ma)) {
          pham.push(p.slice(GOC.length + 1));
        }
      }
    }
    expect(
      pham,
      `Đồ đã cách ly bị kéo lại đường chạy chính: ${pham.join(", ")}`,
    ).toEqual([]);
  });

  it("vùng cách ly có README nói rõ đang giữ gì và vì sao", () => {
    const doc = readFileSync(join(GOC, "cu/README.md"), "utf8");
    expect(doc).toMatch(/Đang cách ly/u);
    // Mỗi file trong `cu/` phải có tên trong bảng — cách ly mà không ghi lại thì sáu tháng
    // sau không ai biết nó từng là gì và vì sao nghỉ.
    for (const p of moiFileMa("cu")) {
      const ten = p.slice(p.lastIndexOf("/") + 1);
      expect(doc, `${ten} nằm trong cu/ mà README không nhắc tới`).toContain(ten);
    }
  });
});
