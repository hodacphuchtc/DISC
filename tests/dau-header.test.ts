/**
 * ĐẦU HTTP CHO BẢN DEPLOY — `out/_headers` (24.1).
 *
 * 🔴 VÌ SAO CỬA NÀY QUAN TRỌNG HƠN VẺ NGOÀI CỦA NÓ. Đây là loại lỗi **chỉ lộ ra sau khi
 * deploy**: máy chủ chạy thử (`scripts/xem-ban-phat-hanh.mjs`) KHÔNG gửi `_headers`, nên
 * một CSP sai vẫn để `npm run kiem` xanh, `npm run build` xanh, và trang ở `localhost:3100`
 * chạy bình thường — rồi trang thật **trắng trơn** và không ai biết vì sao.
 *
 * Nên cửa này không đếm suông. Nó **tính lại băm từ chính HTML** rồi đối chiếu: mỗi
 * `<script>` nội tuyến trong `out/` phải có băm tương ứng trong `script-src`. Thiếu một
 * cái là trang trắng.
 *
 * Chưa build thì bỏ qua (`npm run kiem` chạy test mà không build).
 */

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const RA = join(process.cwd(), "out");
const TEP_DAU = join(RA, "_headers");

function quet(thuMuc: string, gom: string[] = []): string[] {
  for (const ten of readdirSync(thuMuc)) {
    const day = join(thuMuc, ten);
    if (statSync(day).isDirectory()) quet(day, gom);
    else gom.push(day);
  }
  return gom;
}

const coBanDung = () => existsSync(TEP_DAU);
const doc = () => readFileSync(TEP_DAU, "utf8");

/** Băm SHA-256 dạng CSP cho một đoạn script nội tuyến — cùng công thức với script build. */
const bamCsp = (than: string) =>
  `'sha256-${createHash("sha256").update(than, "utf8").digest("base64")}'`;

/** Mọi script nội tuyến trong mọi trang HTML của bản dựng. */
function scriptNoiTuyen(): string[] {
  const than: string[] = [];
  for (const tep of quet(RA).filter((d) => d.endsWith(".html"))) {
    const trang = readFileSync(tep, "utf8");
    for (const m of trang.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gu)) {
      than.push(m[1]);
    }
  }
  return than;
}

describe("out/_headers — đầu bảo mật cho bản deploy", () => {
  it("🔴 có tệp _headers — thiếu nó là deploy ra một trang không mặc gì", () => {
    if (!existsSync(RA)) return; // chưa build
    expect(coBanDung(), "chạy `npm run build` rồi mới có out/_headers").toBe(true);
  });

  it("có đủ bốn đầu, áp cho mọi đường dẫn", () => {
    if (!coBanDung()) return;
    const d = doc();

    expect(d.split("\n")[0], "phải áp cho mọi đường dẫn").toBe("/*");
    expect(d).toContain("Content-Security-Policy:");
    expect(d).toContain("X-Content-Type-Options: nosniff");
    expect(d).toContain("Referrer-Policy: no-referrer");
    expect(d).toContain("Permissions-Policy:");
  });

  it("🔴 MỌI script nội tuyến đều có băm trong script-src — thiếu một cái là trang TRẮNG", () => {
    if (!coBanDung()) return;
    const d = doc();
    const than = scriptNoiTuyen();

    expect(than.length, "không tìm thấy script nội tuyến nào ⇒ phép đo này đã hỏng").toBeGreaterThan(0);

    const thieu = [...new Set(than.map(bamCsp))].filter((b) => !d.includes(b));
    expect(thieu, `thiếu ${thieu.length} băm ⇒ trình duyệt chặn script ⇒ trang trắng`).toEqual([]);
  });

  it("🔴 KHÔNG hạ script-src xuống 'unsafe-inline' — băm được thì không có lý do nới cửa", () => {
    if (!coBanDung()) return;
    const scriptSrc = /script-src ([^;]*)/u.exec(doc())?.[1] ?? "";

    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc, "hạ xuống unsafe-inline là mở lại đúng cửa vừa đóng").not.toContain(
      "'unsafe-inline'",
    );
    expect(scriptSrc).toMatch(/'sha256-/u);
  });

  it("style-src CÓ 'unsafe-inline' — cố ý, vì thuộc tính style không băm được", () => {
    if (!coBanDung()) return;
    // 8 thuộc tính `style="..."` do React đặt từ `MAU.*`. Băm chỉ áp cho phần tử `<style>`,
    // không áp cho thuộc tính. Cửa này tồn tại để người sau khỏi tưởng là bỏ sót rồi đi "sửa".
    const styleSrc = /style-src ([^;]*)/u.exec(doc())?.[1] ?? "";
    expect(styleSrc).toContain("'unsafe-inline'");
  });

  it("🔴 có frame-ancestors — trang này giữ hồ sơ DISC của trẻ trong IndexedDB", () => {
    if (!coBanDung()) return;
    const d = doc();

    expect(d, "thiếu frame-ancestors là mở cửa cho clickjacking").toContain("frame-ancestors");
    expect(d).toContain("object-src 'none'");
    expect(d).toContain("base-uri 'none'");
  });

  it("connect-src khoá ở 'self' — ADR-001: sản phẩm không gọi ra ngoài", () => {
    if (!coBanDung()) return;
    const connect = /connect-src ([^;]*)/u.exec(doc())?.[1] ?? "";

    expect(connect.trim()).toBe("'self'");
  });
});
