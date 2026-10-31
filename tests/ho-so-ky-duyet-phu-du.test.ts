/**
 * `27.4` — hồ sơ ký duyệt phải PHỦ ĐỦ nội dung cặp.
 *
 * Bài học: 56 đoạn của `config/disc-noi-dung-cap.ts` từng không nằm trong hồ sơ ký nào vì
 * `scripts/xuat-noi-dung-ky-duyet.mjs` không import file đó — nội dung về trẻ và bạn đời đi
 * ra người dùng mà không ai ký. Test này lấy từng đoạn, cắt bỏ chỗ giữ `{...}`, và đòi phần
 * chữ dài nhất còn lại phải có mặt trong một trong hai hồ sơ. Thêm đoạn mới mà quên chạy
 * `node scripts/xuat-noi-dung-ky-duyet.mjs` thì test đỏ.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  DONG_HANH_CHUNG,
  DONG_HANH_THEO_BAC,
  DONG_HANH_TRUNG_KHOP,
} from "../config/disc-dong-hanh";
import { CUNG_NHIP } from "../config/disc-noi-dung-cung-nhip";
import { thayXungHo } from "../config/disc-xung-ho";
import { KE_HOACH_BAY_NGAY, MOI_QUAN_HE, TINH_HUONG_DOI } from "../config/disc-noi-dung-doi";
import { CHU_AN_TOAN_TRE, KE_HOACH_TRE_VOI_NL, TINH_HUONG_TRE_VOI_NL } from "../config/disc-noi-dung-tre-voi-nl";
import { KE_HOACH_VOI_TRE, TINH_HUONG_VOI_TRE } from "../config/disc-noi-dung-voi-tre";
import { MO_TA_LECH, THOA_THUAN, TRUNG_KHOP, VIEC_CUA_TOI } from "../config/disc-noi-dung-cap";

const doc = (f: string) => readFileSync(join(process.cwd(), f), "utf8");
const HO_SO = doc("docs/noi-dung-cho-ky-duyet.md") + "\n" + doc("docs/noi-dung-cho-ky-duyet-goi-b.md");

/** Cùng phép thay xưng hô mà `scripts/xuat-noi-dung-ky-duyet.mjs` dùng cho phần trẻ → người lớn. */
const veNl = (c: string) => thayXungHo(c, "tre-voi-nguoi-lon", "[tên người lớn]", { vaiNguoiKia: "me" });

/** Chuỗi có NHIỀU chỗ giữ xưng hô (không còn đoạn chữ liền nào đủ dài): so TOÀN CÂU sau khi thay. */
const NGUYEN_CAU = /^(TRE_VOI_NL|KE_HOACH_TRE_VOI_NL|CHU_AN_TOAN_TRE|CUNG_NHIP\.tre-voi-nguoi-lon)/u;

function doanDai(chuoi: string): string {
  return chuoi
    .split(/\{[^}]+\}/u)
    .map((s) => s.trim())
    .sort((a, b) => b.length - a.length)[0];
}

function tatCa(): { nhan: string; chuoi: string }[] {
  const ra: { nhan: string; chuoi: string }[] = [];
  for (const [t, h] of Object.entries(MO_TA_LECH))
    for (const [huong, k] of Object.entries(h)) {
      ra.push({ nhan: `MO_TA_LECH.${t}.${huong}.veToi`, chuoi: k.veToi });
      ra.push({ nhan: `MO_TA_LECH.${t}.${huong}.veNguoiKia`, chuoi: k.veNguoiKia });
    }
  for (const [t, h] of Object.entries(THOA_THUAN))
    for (const [huong, c] of Object.entries(h)) ra.push({ nhan: `THOA_THUAN.${t}.${huong}`, chuoi: c });
  for (const [t, h] of Object.entries(VIEC_CUA_TOI))
    for (const [huong, q] of Object.entries(h))
      for (const [quyen, c] of Object.entries(q))
        ra.push({ nhan: `VIEC_CUA_TOI.${t}.${huong}.${quyen}`, chuoi: c });
  for (const [t, h] of Object.entries(TRUNG_KHOP))
    for (const [kieu, c] of Object.entries(h)) ra.push({ nhan: `TRUNG_KHOP.${t}.${kieu}`, chuoi: c });
  for (const [tr, h] of Object.entries(TINH_HUONG_DOI))
    for (const [huong, q] of Object.entries(h))
      for (const [qh, o] of Object.entries(q)) {
        ra.push({ nhan: `TINH_HUONG_DOI.${tr}.${huong}.${qh}.tinhHuong`, chuoi: o.tinhHuong });
        ra.push({ nhan: `TINH_HUONG_DOI.${tr}.${huong}.${qh}.nenNoi`, chuoi: o.nenNoi });
        ra.push({ nhan: `TINH_HUONG_DOI.${tr}.${huong}.${qh}.nenTranh`, chuoi: o.nenTranh });
      }
  for (const [t, h] of Object.entries(DONG_HANH_CHUNG))
    for (const [huong, c] of Object.entries(h))
      for (const [k2, v] of Object.entries(c)) ra.push({ nhan: `DONG_HANH_CHUNG.${t}.${huong}.${k2}`, chuoi: v });
  for (const [t, h] of Object.entries(DONG_HANH_THEO_BAC))
    for (const [huong, b] of Object.entries(h))
      for (const [bac, o] of Object.entries(b))
        for (const [k2, v] of Object.entries(o))
          ra.push({ nhan: `DONG_HANH_THEO_BAC.${t}.${huong}.${bac}.${k2}`, chuoi: v });
  for (const [t, o] of Object.entries(DONG_HANH_TRUNG_KHOP)) {
    ra.push({ nhan: `DONG_HANH_TRUNG_KHOP.${t}.giu`, chuoi: o.giu });
    ra.push({ nhan: `DONG_HANH_TRUNG_KHOP.${t}.nuoiTiep`, chuoi: o.nuoiTiep });
  }
  for (const [t, h] of Object.entries(TINH_HUONG_VOI_TRE))
    for (const [huong, b] of Object.entries(h))
      for (const [bac, o] of Object.entries(b))
        for (const [k2, v] of Object.entries(o)) ra.push({ nhan: `VOI_TRE.${t}.${huong}.${bac}.${k2}`, chuoi: v });
  for (const [t, h] of Object.entries(TINH_HUONG_TRE_VOI_NL))
    for (const [huong, b] of Object.entries(h))
      for (const [bac, o] of Object.entries(b))
        for (const [k2, v] of Object.entries(o)) ra.push({ nhan: `TRE_VOI_NL.${t}.${huong}.${bac}.${k2}`, chuoi: v });
  ra.push({ nhan: "CHU_AN_TOAN_TRE", chuoi: CHU_AN_TOAN_TRE });
  for (const [bac, ds] of Object.entries(KE_HOACH_VOI_TRE))
    ds.forEach((c, i) => ra.push({ nhan: `KE_HOACH_VOI_TRE.${bac}.${i + 1}`, chuoi: c }));
  for (const [bac, ds] of Object.entries(KE_HOACH_TRE_VOI_NL))
    ds.forEach((c, i) => ra.push({ nhan: `KE_HOACH_TRE_VOI_NL.${bac}.${i + 1}`, chuoi: c }));
  for (const [q, d] of Object.entries(CUNG_NHIP))
    for (const [t, kk] of Object.entries(d))
      for (const [kieu, o] of Object.entries(kk)) {
        ra.push({ nhan: `CUNG_NHIP.${q}.${t}.${kieu}.tinhHuong`, chuoi: o.tinhHuong });
        ra.push({ nhan: `CUNG_NHIP.${q}.${t}.${kieu}.nuoiTiep`, chuoi: o.nuoiTiep });
      }
  for (const q of MOI_QUAN_HE)
    KE_HOACH_BAY_NGAY[q].forEach((c, i) => ra.push({ nhan: `KE_HOACH_BAY_NGAY.${q}.${i + 1}`, chuoi: c }));
  return ra;
}

describe("hồ sơ ký duyệt phủ đủ nội dung cặp", () => {
  const doan = tatCa();

  it("có đúng 544 đoạn cần phủ", () => {
    // 56 cặp + 72 tình huống (3 loại) + 21 ngày thử (3 loại) + 128 đồng hành
    // + 93 người lớn→trẻ + 93 trẻ→người lớn + 80 cùng nhịp
    expect(doan).toHaveLength(56 + 72 + 21 + 128 + 93 + 93 + 80 + 1);
  });

  it.each(doan.map((d) => [d.nhan, d.chuoi] as const))("%s có trong hồ sơ", (nhan, chuoi) => {
    if (NGUYEN_CAU.test(nhan)) {
      expect(HO_SO).toContain(veNl(chuoi));
      return;
    }
    const mau = doanDai(chuoi);
    expect(mau.length, "đoạn không còn chữ thật sau khi bỏ chỗ giữ").toBeGreaterThan(15);
    expect(HO_SO).toContain(mau);
  });
});
