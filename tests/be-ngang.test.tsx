/**
 * CỬA KIỂM CỦA `16.9` — dải hẹp 320px.
 *
 * 🔴 GIỚI HẠN PHẢI NÓI TRƯỚC, KHÔNG GIẤU Ở CUỐI FILE. **jsdom KHÔNG có bộ dựng layout.**
 * `offsetWidth` luôn bằng 0, `getBoundingClientRect()` luôn trả về số không. Nên một test
 * kiểu *"khẳng định không phần tử nào rộng hơn 320px"* chạy trong jsdom sẽ **luôn xanh**,
 * kể cả trên một trang tràn ngang thảm hại. Viết nó ra là dựng một cửa kiểm giả — thứ còn
 * tệ hơn không có cửa, vì nó khiến người ta thôi đi kiểm bằng mắt.
 *
 * Nên cửa này canh những thứ jsdom ĐO ĐƯỢC THẬT, và chúng đều là nguyên nhân trực tiếp
 * của cuộn ngang:
 *
 *  1. Không phần tử nào mang bề rộng CỐ ĐỊNH lớn hơn khung, mà không có mốc ngắt màn hình.
 *  2. Nút mang TÊN NGƯỜI phải xuống dòng được — tên dài là thứ người dùng tự nhập, và
 *     không ai kiểm soát được nó dài bao nhiêu.
 *  3. Ô chọn (14 bậc học, các vai) phải `w-full`, không để nội dung tự quyết bề rộng.
 *  4. Nút chạm đủ to (≥44px, ≥56px cho bộ trẻ nhỏ theo `canNutTo()`).
 *
 * 🔴 Việc *"thu cửa sổ còn 320px rồi đi hết luồng, không cuộn ngang một lần nào"* là bước
 * (b) của hạng mục và nó thuộc về NGƯỜI. Cửa này không thay thế được, và không giả vờ thay.
 */

import { render, screen } from "@testing-library/react";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KhoangBangGiaDinh } from "../app/khoang/bang-gia-dinh";
import { ThanhBen } from "../app/components/thanh-ben";
import { CHU_BANG_GIA_DINH } from "../config/disc-tu-dien";
import { luuThanhVien, xoaSachTatCa } from "../modules/core/luu-tru/kho-bai";

const GOC = process.cwd();
const KHUNG_HEP = 320;

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

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  await xoaSachTatCa();
});

describe("🔴 không bề rộng cố định nào vượt khung hẹp", () => {
  it("mọi `w-[Npx]` / `min-w-[Npx]` > 320 đều phải có mốc ngắt màn hình đi kèm", () => {
    const pham: string[] = [];
    for (const [ten, nguon] of NGUON) {
      for (const dong of nguon.split("\n")) {
        for (const m of dong.matchAll(/(\b(?:sm|md|lg|xl):)?((?:min-)?w-)\[(\d+)px\]/gu)) {
          const [, mocNgat, loai, so] = m;
          if (Number(so) <= KHUNG_HEP) continue;
          // Có mốc ngắt (md:w-[264px]) thì chỉ áp ở màn rộng — không phải vi phạm.
          if (mocNgat) continue;
          pham.push(`${ten}: ${loai}[${so}px] không có mốc ngắt — tràn ở 320px`);
        }
      }
    }
    expect(pham.join("\n")).toBe("");
  });

  it("thanh bên chỉ rộng cố định TỪ mốc `md:` trở lên", () => {
    const nguon = NGUON.find(([t]) => t.endsWith("thanh-ben.tsx"))![1];
    expect(nguon).toContain("md:w-[264px]");
    // Ở dải hẹp nó phải là `w-full`, không phải một dải cứng.
    expect(nguon).toContain("w-full");
  });

  it("thanh bên thu thành MỘT DÒNG ở dải hẹp, xếp dọc từ `md:`", () => {
    render(<ThanhBen />);
    const trong = document.querySelector("aside > div")!;
    expect(trong.className).toContain("flex-row");
    expect(trong.className).toContain("md:flex-col");
  });
});

describe("nội dung người dùng tự nhập không được đẩy rộng khung", () => {
  it("🔴 nút mang TÊN NGƯỜI xuống dòng được", async () => {
    await luuThanhVien({
      id: "tv-dai",
      // Tên bịa, cố ý DÀI — người dùng nhập gì là quyền của họ.
      ten: "Zozo Kikimomo Nonopapa Quququququ",
      vaiTro: "con",
      lop: "7",
      thuTu: 0,
      taoLuc: "2026-08-28T09:00:00+07:00",
      suaLuc: "2026-08-28T09:00:00+07:00",
    });
    render(<KhoangBangGiaDinh onLamBai={vi.fn()} onLamBaiQuanSat={vi.fn()} />);
    await screen.findByText("Zozo Kikimomo Nonopapa Quququququ");

    const nut = screen.getByRole("button", {
      name: CHU_BANG_GIA_DINH.nutLamBai,
    });
    expect(nut.className).toContain("break-words");
    expect(nut.className).toContain("max-w-full");
  });

  it("ô chọn vai và bậc học đều `w-full`", () => {
    const nguon = NGUON.find(([t]) => t.endsWith("form-thanh-vien.tsx"))![1];
    const soSelect = [...nguon.matchAll(/<select/gu)].length;
    const soWFull = [...nguon.matchAll(/<select[\s\S]{0,400}?w-full/gu)].length;
    expect(soSelect).toBeGreaterThanOrEqual(2);
    expect(soWFull, "mỗi <select> phải mang w-full").toBe(soSelect);
  });
});

describe("nút chạm đủ to", () => {
  it("mọi nút trên thẻ thành viên có `min-h-[44px]`", async () => {
    await luuThanhVien({
      id: "tv-1",
      ten: "Zozo",
      vaiTro: "con",
      lop: "7",
      thuTu: 0,
      taoLuc: "2026-08-28T09:00:00+07:00",
      suaLuc: "2026-08-28T09:00:00+07:00",
    });
    render(<KhoangBangGiaDinh onLamBai={vi.fn()} onXemBai={vi.fn()} />);
    await screen.findByText("Zozo");

    const the = screen.getByText("Zozo").closest("li")!;
    const nut = [...the.querySelectorAll("button")];
    expect(nut.length).toBeGreaterThan(2);
    for (const n of nut) {
      expect(n.className, `nút "${n.textContent?.trim()}" quá thấp`).toMatch(
        /min-h-\[(4[4-9]|[5-9]\d|\d{3,})px\]/u,
      );
    }
  });
});
