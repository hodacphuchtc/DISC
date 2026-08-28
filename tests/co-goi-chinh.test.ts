/**
 * CỬA NGUỒN CHO `16.6` — thư viện PDF chỉ được vào bằng NẠP LƯỜI.
 *
 * 🔴 Vì sao cửa này nằm ở TẦNG NGUỒN chứ không chỉ ở tầng byte. Cửa byte
 * (`scripts/kiem-co-goi.mjs`) đo `out/` nên phải build trước, mà CI chạy `npm test` TRƯỚC
 * `npm run build` — nếu cửa duy nhất nằm ở đó thì mọi thứ vẫn xanh cho tới mãi cuối. Cửa
 * ở đây bắt đúng cái sai người ta thật sự gây ra (gõ `import ... from "jspdf"` cho tiện),
 * bắt ngay lúc chạy test, và không cần build.
 *
 * Hai cửa canh hai chuyện khác nhau và đều cần: cái này canh CÁCH VIẾT, cái kia canh
 * KẾT QUẢ THẬT sau khi bundler đã gộp xong.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const GOC = process.cwd();

/** Nơi DUY NHẤT được phép nhắc tới `jspdf`, và phải nhắc bằng `await import()`. */
const FILE_DUOC_PHEP = "modules/report/xuat-pdf.ts";

function quet(thuMuc: string, gom: string[] = []): string[] {
  for (const ten of readdirSync(thuMuc)) {
    if (ten === "node_modules" || ten === ".next" || ten === "out") continue;
    const day = join(thuMuc, ten);
    if (statSync(day).isDirectory()) quet(day, gom);
    else if (/\.tsx?$/u.test(ten)) gom.push(day);
  }
  return gom;
}

const NGUON = ["app", "modules", "config"].flatMap((d) => quet(join(GOC, d)));

describe("🔴 thư viện PDF phải NẠP LƯỜI", () => {
  it("có ít nhất một file nguồn để soi — cửa này không được rỗng", () => {
    expect(NGUON.length).toBeGreaterThan(20);
  });

  it("KHÔNG file nào import tĩnh `jspdf`", () => {
    const pham: string[] = [];
    for (const f of NGUON) {
      const nguon = readFileSync(f, "utf8");
      // `import ... from "jspdf"` hoặc `require("jspdf")` — cả hai đều kéo vào gói chính.
      if (/(?:^|\n)\s*import[^\n]*from\s+["']jspdf["']/u.test(nguon)) {
        pham.push(`${f.replace(`${GOC}/`, "")} — import tĩnh`);
      }
      if (/require\(\s*["']jspdf["']\s*\)/u.test(nguon)) {
        pham.push(`${f.replace(`${GOC}/`, "")} — require`);
      }
    }
    expect(pham, `Phải dùng \`await import("jspdf")\`. Vi phạm:\n${pham.join("\n")}`).toEqual(
      [],
    );
  });

  it("chỉ ĐÚNG MỘT file được nhắc tới `jspdf`, và bằng `await import()`", () => {
    const nhac = NGUON.filter((f) => /["']jspdf["']/u.test(readFileSync(f, "utf8"))).map((f) =>
      f.replace(`${GOC}/`, ""),
    );
    expect(nhac).toEqual([FILE_DUOC_PHEP]);

    const nguon = readFileSync(join(GOC, FILE_DUOC_PHEP), "utf8");
    expect(nguon).toMatch(/await import\(["']jspdf["']\)|import\(["']jspdf["']\)/u);
  });

  it("`xuat-pdf` cũng chỉ được vào từ giao diện bằng nạp lười", () => {
    const pham: string[] = [];
    for (const f of NGUON) {
      if (f.endsWith("xuat-pdf.ts")) continue;
      const nguon = readFileSync(f, "utf8");
      if (/(?:^|\n)\s*import[^\n]*from\s+["'][^"']*report\/xuat-pdf["']/u.test(nguon)) {
        pham.push(f.replace(`${GOC}/`, ""));
      }
    }
    // Import tĩnh `xuat-pdf` là import tĩnh `jspdf` qua một lớp trung gian — cùng hậu quả.
    expect(pham, `Import tĩnh xuat-pdf (kéo theo jspdf):\n${pham.join("\n")}`).toEqual([]);
  });
});

describe("cửa byte sau build", () => {
  it("script `kiem-co-goi.mjs` tồn tại và được nối vào `npm run build`", () => {
    const goi = JSON.parse(readFileSync(join(GOC, "package.json"), "utf8"));
    expect(goi.scripts.build).toContain("kiem-co-goi.mjs");
    expect(goi.scripts["check:goi"]).toBeTruthy();
    // Cửa mà không ai gọi thì im lặng y như một tính năng hỏng mà không ai mở.
    expect(readFileSync(join(GOC, "scripts/kiem-co-goi.mjs"), "utf8")).toContain(
      "TRAN_KB_GZIP",
    );
  });
});
