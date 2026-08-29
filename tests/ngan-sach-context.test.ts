/**
 * NGÂN SÁCH CONTEXT (`25.1`, `25.2`).
 *
 * 🔴 VÌ SAO CÓ CỬA NÀY. `CLAUDE.md` + `.claude/rules/*.md` được nạp lại ở **mọi lượt trao
 * đổi, mọi phiên**. Ngày 29/08/2026 đo được **74.549 byte ≈ 23.300 token** — trả cho từng
 * lượt, mãi mãi. Sau `25.1` còn ~31 KB.
 *
 * Không có cửa thì nó phình lại: mỗi phiên thêm vài dòng "cho chắc", sáu tháng sau lại 53 KB
 * và không ai thấy khoảnh khắc nào là khoảnh khắc sai. Cửa này là thứ giữ cho điều đó
 * không xảy ra — nó không đo chất lượng, nó đo **cái giá**.
 *
 * 🔴 CỬA THỨ HAI ở dưới bắt một lỗi khác hẳn: tài liệu **trỏ vào lệnh `npm` không tồn tại**.
 * Ngày 29/08 tìm được BỐN lệnh như vậy trong `.claude/rules/workflow.md` (`check:plan`,
 * `gop:kien-truc`, `plan:phu-thuoc`, `plan:tien-do`). Tài liệu dạy sai thì nó dạy sai ở
 * **mọi phiên**, và phiên sau gõ theo là gặp lỗi rồi mất thời gian truy.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const GOC = process.cwd();
const HIEN_PHAP = join(GOC, "CLAUDE.md");
const THU_MUC_LUAT = join(GOC, ".claude/rules");

/**
 * Trần cho `CLAUDE.md`. Mốc sau `25.1` là ~11 KB; trần 16 KB cho chỗ thở, nhưng không
 * nhiều tới mức một mục 25 KB lẻn lại vào được.
 */
const TRAN_HIEN_PHAP = 16 * 1024;

/** Trần cho toàn bộ phần nạp cố định mỗi lượt. Mốc sau `25.1` là ~31 KB. */
const TRAN_NAP_CO_DINH = 40 * 1024;

const cỡ = (p: string) => statSync(p).size;
const fileLuat = () =>
  readdirSync(THU_MUC_LUAT)
    .filter((t) => t.endsWith(".md"))
    .map((t) => join(THU_MUC_LUAT, t));

describe("ngân sách context — cái giá trả cho MỌI lượt trao đổi", () => {
  it(`🔴 CLAUDE.md ≤ ${TRAN_HIEN_PHAP / 1024} KB`, () => {
    expect(
      cỡ(HIEN_PHAP),
      "hiến pháp phình lại ⇒ mỗi lượt trao đổi đắt thêm. Kho tra cứu thuộc về " +
        "docs/so-seo.md và docs/decisions/nhat-ky-quyet-dinh.md",
    ).toBeLessThanOrEqual(TRAN_HIEN_PHAP);
  });

  it(`🔴 CLAUDE.md + .claude/rules/*.md ≤ ${TRAN_NAP_CO_DINH / 1024} KB`, () => {
    const tong = cỡ(HIEN_PHAP) + fileLuat().reduce((s, f) => s + cỡ(f), 0);
    expect(tong).toBeLessThanOrEqual(TRAN_NAP_CO_DINH);
  });

  it("hai kho tra cứu tồn tại và không rỗng — tách ra rồi thì phải còn đó", () => {
    for (const f of ["docs/so-seo.md", "docs/decisions/nhat-ky-quyet-dinh.md"]) {
      const day = join(GOC, f);
      expect(existsSync(day), `${f} không còn ⇒ 44 bài học và 52 quyết định đã bốc hơi`).toBe(true);
      expect(cỡ(day)).toBeGreaterThan(5000);
    }
  });

  it("🔴 sổ sẹo giữ ĐỦ bài học, nhật ký giữ ĐỦ quyết định — đếm, không tin", () => {
    const bai = (readFileSync(join(GOC, "docs/so-seo.md"), "utf8").match(/^- /gmu) ?? []).length;
    const qd = (
      readFileSync(join(GOC, "docs/decisions/nhat-ky-quyet-dinh.md"), "utf8").match(
        /^\| \d{2}\/\d{2}\/\d{4}/gmu,
      ) ?? []
    ).length;

    // Số đếm được NGAY TRƯỚC khi tách, ngày 29/08/2026. Chỉ được TĂNG (ghi thêm bài học
    // mới), không được giảm — giảm nghĩa là ai đó vừa xoá một thứ đã trả giá để có.
    expect(bai, "sổ sẹo rụng bài học").toBeGreaterThanOrEqual(44);
    expect(qd, "nhật ký rụng quyết định").toBeGreaterThanOrEqual(52);
  });

  it("CLAUDE.md TRỎ tới hai kho — tách ra mà không để lại đường đi là giấu mất", () => {
    const hp = readFileSync(HIEN_PHAP, "utf8");
    expect(hp).toContain("docs/so-seo.md");
    expect(hp).toContain("docs/decisions/nhat-ky-quyet-dinh.md");
  });
});

describe("🔴 tài liệu không được trỏ vào lệnh npm không tồn tại", () => {
  it("mọi `npm run <x>` trong CLAUDE.md và .claude/** đều có thật trong package.json", () => {
    const co = new Set(
      Object.keys(
        (JSON.parse(readFileSync(join(GOC, "package.json"), "utf8")) as {
          scripts: Record<string, string>;
        }).scripts,
      ),
    );

    /** Mọi file tài liệu được nạp hoặc gọi tay: hiến pháp, luật, và bộ lệnh. */
    function gomMd(thuMuc: string, ra: string[] = []): string[] {
      if (!existsSync(thuMuc)) return ra;
      for (const t of readdirSync(thuMuc)) {
        const day = join(thuMuc, t);
        if (statSync(day).isDirectory()) gomMd(day, ra);
        else if (t.endsWith(".md")) ra.push(day);
      }
      return ra;
    }

    const hong: string[] = [];
    for (const f of [HIEN_PHAP, ...gomMd(join(GOC, ".claude"))]) {
      for (const m of readFileSync(f, "utf8").matchAll(/npm run ([a-z][a-z0-9:-]*)/gu)) {
        if (!co.has(m[1])) hong.push(`${f.replace(`${GOC}/`, "")} → npm run ${m[1]}`);
      }
    }

    expect(
      [...new Set(hong)],
      "tài liệu dạy một lệnh không tồn tại ⇒ phiên sau gõ theo là gặp lỗi",
    ).toEqual([]);
  });
});
