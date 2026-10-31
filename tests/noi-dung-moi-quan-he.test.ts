/**
 * `29.2`–`29.5` — nội dung sâu cho MỌI loại cặp. Tên người bịa.
 *
 * Bốn nguồn: `disc-noi-dung-doi.ts` (vợ chồng, anh chị em, người lớn khác),
 * `disc-noi-dung-voi-tre.ts` (người lớn → trẻ), `disc-noi-dung-tre-voi-nl.ts` (trẻ → người lớn)
 * và `disc-noi-dung-cung-nhip.ts` (hai người cùng nhịp).
 */

import { describe, expect, it } from "vitest";

import { HUONG_LECH_CAP, KIEU_TRUNG_KHOP, MOI_QUAN_HE_CAP } from "../config/disc-lech-cap";
import { CUNG_NHIP } from "../config/disc-noi-dung-cung-nhip";
import { KE_HOACH_BAY_NGAY, MOI_QUAN_HE, TINH_HUONG_DOI } from "../config/disc-noi-dung-doi";
import { BAC_TRE_DANH_SACH, KE_HOACH_VOI_TRE, TINH_HUONG_VOI_TRE } from "../config/disc-noi-dung-voi-tre";
import {
  CHU_AN_TOAN_TRE,
  KE_HOACH_TRE_VOI_NL,
  TINH_HUONG_TRE_VOI_NL,
} from "../config/disc-noi-dung-tre-voi-nl";
import { MA_TRUC } from "../modules/core/bo-de/kieu";

type Chuoi = { nhan: string; chu: string; nhom: string };
const tatCa: Chuoi[] = [];
const them = (nhom: string, nhan: string, chu: string) => tatCa.push({ nhom, nhan, chu });

for (const t of MA_TRUC)
  for (const h of HUONG_LECH_CAP) {
    for (const q of MOI_QUAN_HE) {
      const o = TINH_HUONG_DOI[t][h][q];
      them(q, `${q}.${t}.${h}.tinhHuong`, o.tinhHuong);
      them(q, `${q}.${t}.${h}.nenNoi`, o.nenNoi);
      them(q, `${q}.${t}.${h}.nenTranh`, o.nenTranh);
    }
    for (const b of BAC_TRE_DANH_SACH) {
      for (const [k, v] of Object.entries(TINH_HUONG_VOI_TRE[t][h][b])) them("nguoi-lon-voi-tre", `voiTre.${t}.${h}.${b}.${k}`, v);
      for (const [k, v] of Object.entries(TINH_HUONG_TRE_VOI_NL[t][h][b])) them("tre-voi-nguoi-lon", `treVoiNl.${t}.${h}.${b}.${k}`, v);
    }
  }
for (const q of MOI_QUAN_HE) KE_HOACH_BAY_NGAY[q].forEach((c, i) => them(q, `keHoach.${q}.${i + 1}`, c));
for (const b of BAC_TRE_DANH_SACH) {
  KE_HOACH_VOI_TRE[b].forEach((c, i) => them("nguoi-lon-voi-tre", `keHoachVoiTre.${b}.${i + 1}`, c));
  KE_HOACH_TRE_VOI_NL[b].forEach((c, i) => them("tre-voi-nguoi-lon", `keHoachTreVoiNl.${b}.${i + 1}`, c));
}
for (const q of MOI_QUAN_HE_CAP)
  for (const t of MA_TRUC)
    for (const k of KIEU_TRUNG_KHOP) {
      const o = CUNG_NHIP[q][t][k];
      them(q, `cungNhip.${q}.${t}.${k}.tinhHuong`, o.tinhHuong);
      them(q, `cungNhip.${q}.${t}.${k}.nuoiTiep`, o.nuoiTiep);
    }

describe("đủ ô, đủ chữ", () => {
  it("nguoi-lon-khac: 8 ô tình huống + 7 ngày, ô nào cũng đủ ba phần", () => {
    let dem = 0;
    for (const t of MA_TRUC)
      for (const h of HUONG_LECH_CAP) {
        const o = TINH_HUONG_DOI[t][h]["nguoi-lon-khac"];
        dem += 1;
        expect(o.tinhHuong.length, `${t}/${h}`).toBeGreaterThan(100);
        expect(o.nenNoi.length).toBeGreaterThan(30);
        expect(o.nenTranh.length).toBeGreaterThan(10);
      }
    expect(dem).toBe(8);
    expect(KE_HOACH_BAY_NGAY["nguoi-lon-khac"]).toHaveLength(7);
  });

  it("người lớn → trẻ và trẻ → người lớn: 24 ô × 3 bậc mỗi loại, mỗi bậc 7 ngày", () => {
    for (const b of BAC_TRE_DANH_SACH) {
      expect(KE_HOACH_VOI_TRE[b], b).toHaveLength(7);
      expect(KE_HOACH_TRE_VOI_NL[b], b).toHaveLength(7);
    }
    for (const t of MA_TRUC)
      for (const h of HUONG_LECH_CAP)
        for (const b of BAC_TRE_DANH_SACH) {
          for (const o of [TINH_HUONG_VOI_TRE[t][h][b], TINH_HUONG_TRE_VOI_NL[t][h][b]]) {
            expect(o.tinhHuong.length, `${t}/${h}/${b}`).toBeGreaterThan(90);
            expect(o.nenNoi.startsWith("“") && o.nenNoi.endsWith("”"), o.nenNoi).toBe(true);
          }
        }
  });

  it("cùng nhịp: đủ 5 loại cặp × 4 trục × 2 kiểu", () => {
    let dem = 0;
    for (const q of MOI_QUAN_HE_CAP) for (const t of MA_TRUC) for (const k of KIEU_TRUNG_KHOP) {
      dem += 1;
      expect(CUNG_NHIP[q][t][k].tinhHuong.length, `${q}.${t}.${k}`).toBeGreaterThan(80);
      expect(CUNG_NHIP[q][t][k].nuoiTiep.length).toBeGreaterThan(30);
    }
    expect(dem).toBe(40);
  });

  it("ngày thử đánh số 1→7 và ngày 7 là ngồi lại, ở mọi bộ", () => {
    const bo = [
      ...MOI_QUAN_HE.map((q) => KE_HOACH_BAY_NGAY[q]),
      ...BAC_TRE_DANH_SACH.map((b) => KE_HOACH_VOI_TRE[b]),
      ...BAC_TRE_DANH_SACH.map((b) => KE_HOACH_TRE_VOI_NL[b]),
    ];
    for (const ds of bo) {
      ds.forEach((c, i) => expect(c).toMatch(new RegExp(`^Ngày ${i + 1} —`, "u")));
      expect(ds[6]).toMatch(/[Nn]gồi lại/u);
    }
  });
});

describe("🔴 luật ngôn ngữ cho TOÀN BỘ chuỗi mới", () => {
  const gop = tatCa.map((x) => x.chu).join("\n");
  it("không so hơn kém", () => {
    expect(gop).not.toMatch(/tốt hơn|giỏi hơn|đúng hơn|hợp lý hơn|khá hơn|thông minh hơn/iu);
  });
  it("không từ khuyết thiếu hay chẩn đoán", () => {
    expect(gop).not.toMatch(/khiếm khuyết|điểm yếu|cần bổ sung|khắc phục|rối loạn|bệnh|chứng/iu);
  });
  it("không tiên đoán nghề, không gắn học lực, không so với trẻ khác", () => {
    expect(gop).not.toMatch(/hợp làm|nghề|học giỏi|học lực|điểm số ở lớp/iu);
    expect(gop).not.toMatch(/hơn (các )?bạn|bằng bạn|như các bạn|con nhà người ta/iu);
  });
  it("không nói bản chất, không đổ lỗi", () => {
    expect(gop).not.toMatch(/bản chất|vốn là|sinh ra đã|lỗi của|tại con|con hư|con hỗn/iu);
  });
  it("không giới tính cứng trong câu mẫu của cặp dùng chung chữ hai chiều", () => {
    const gioiTinh = /(^|[\s“"(])(anh|chị|vợ|chồng)([\s,.?!”")]|$)/iu;
    for (const x of tatCa.filter((c) => ["vo-chong", "anh-chi-em", "nguoi-lon-khac"].includes(c.nhom))) {
      expect(x.chu, x.nhan).not.toMatch(gioiTinh);
    }
  });
  it("không còn chỗ giữ lạ: chỉ {toi} {Toi} {nguoiKia} {NguoiKia} {xungTre} {XungTre} {goiNguoiKia} {GoiNguoiKia}", () => {
    const hop = /\{(toi|Toi|nguoiKia|NguoiKia|xungTre|XungTre|goiNguoiKia|GoiNguoiKia)\}/gu;
    for (const x of tatCa) expect(x.chu.replace(hop, ""), x.nhan).not.toMatch(/[{}]/u);
  });
});

describe("🔴 luật hẹp của trẻ → người lớn (disc-noi-dung-cap.ts luật 2)", () => {
  const tre = tatCa.filter((x) => x.nhom === "tre-voi-nguoi-lon");
  it("không giao bé việc điều chỉnh, làm vui hay chăm sóc người lớn", () => {
    for (const x of tre) {
      expect(x.chu, x.nhan).not.toMatch(
        /giúp (\{goiNguoiKia\}|\{GoiNguoiKia\}|bố|mẹ|ông|bà) (bình tĩnh|chậm lại|đổi|vui|bớt|nghỉ)|làm (\{goiNguoiKia\}|bố|mẹ|ông|bà) (vui|bớt|bình tĩnh)|con phải (nhịn|nhường|chịu)|sửa (bố|mẹ|ông|bà)|dạy (bố|mẹ|ông|bà)/iu,
      );
    }
  });
  it("🔴 lý do của người lớn là 'có thể', KHÔNG phải sự thật khẳng định, và không phụ thuộc việc bé làm", () => {
    for (const x of tre.filter((c) => c.nhan.startsWith("treVoiNl.") && c.nhan.endsWith(".tinhHuong"))) {
      // Lật khung bằng "có thể" (một lý do nhẹ), không "thật ra {…} chỉ muốn / cần …" như một chắc chắn.
      expect(x.chu, x.nhan).not.toMatch(/thật ra/u);
      // Phản ứng của người lớn không được đặt điều kiện vào việc bé nói/đề nghị đủ sớm: nếu người
      // lớn vẫn không nghe, bé sẽ hiểu là mình nói chưa đủ khéo.
      expect(x.chu, x.nhan).not.toMatch(/nếu \{xungTre\}|sẽ nghe nếu|dễ đồng ý hơn nếu|nếu \{XungTre\}/u);
    }
  });
  it("mọi tình huống của bé có vế lật khung 'có thể' về người lớn (hoặc 'chưa biết')", () => {
    for (const x of tre.filter((c) => c.nhan.startsWith("treVoiNl.") && c.nhan.endsWith(".tinhHuong"))) {
      expect(x.chu, x.nhan).toMatch(/có thể|chưa biết/u);
    }
  });
  it("🔴 có DÒNG AN TOÀN cố định: bé biết còn một lối ra là nói với người lớn khác mà bé tin", () => {
    expect(CHU_AN_TOAN_TRE).toMatch(/đau hoặc sợ/u);
    expect(CHU_AN_TOAN_TRE).toMatch(/người lớn khác/u);
  });
  it("kế hoạch bảy ngày của bé không bắt bé 'ôm'/'để người lớn ôm' hay khóc ít đi (tránh gây xấu hổ)", () => {
    const ke = Object.values(KE_HOACH_TRE_VOI_NL).flat().join("\n");
    expect(ke).not.toMatch(/thay vì khóc|để \{goiNguoiKia\} ôm|đừng khóc/iu);
  });
  it("bậc nhỏ ghi rõ người lớn đọc cùng bé", () => {
    // "Người lớn", không phải "bố mẹ": người đọc cùng bé có thể là ông bà.
    expect(KE_HOACH_TRE_VOI_NL.nho[0]).toMatch(/Người lớn đọc cùng/u);
    expect(KE_HOACH_TRE_VOI_NL.nho[0]).not.toMatch(/[Bb]ố mẹ/u);
  });
  it("câu nên nói của bé là LỜI NÓI RA điều mình cần: có {xungTre}", () => {
    for (const t of MA_TRUC) for (const h of HUONG_LECH_CAP) for (const b of BAC_TRE_DANH_SACH) {
      expect(TINH_HUONG_TRE_VOI_NL[t][h][b].nenNoi, `${t}/${h}/${b}`).toMatch(/\{xungTre\}|\{XungTre\}/u);
    }
  });
});

describe("🔴 hai chiều của cùng một cặp không dùng chung câu dài (ban-tong-hop.test)", () => {
  const cat = (c: string) => c.split(/(?<=[.?!])\s+/u).map((s) => s.trim()).filter((s) => s.length >= 60);

  it("CÙNG NHỊP của ba loại cặp dùng chung chữ hai chiều: câu dài nào cũng mang {nguoiKia}", () => {
    // Cả hai chiều đọc CÙNG một ô, nên câu không mang tên người kia sẽ giống hệt nhau ở hai tờ.
    for (const x of tatCa.filter((c) => c.nhan.startsWith("cungNhip.") && ["vo-chong", "anh-chi-em", "nguoi-lon-khac"].includes(c.nhom))) {
      for (const c of cat(x.chu)) expect(c, `${x.nhan}: ${c}`).toMatch(/\{nguoiKia\}|\{NguoiKia\}/u);
    }
  });

  it("phần LỆCH: hai ô đối hướng của cùng một trục không dùng chung câu dài", () => {
    const hop = (nguon: (t: (typeof MA_TRUC)[number], h: (typeof HUONG_LECH_CAP)[number]) => string[]) => {
      for (const t of MA_TRUC) {
        const cao = new Set(nguon(t, "toi-cao-hon").flatMap(cat));
        const chung = nguon(t, "toi-thap-hon").flatMap(cat).filter((c) => cao.has(c));
        expect(chung, `trục ${t} dùng chung: ${JSON.stringify(chung)}`).toHaveLength(0);
      }
    };
    for (const q of MOI_QUAN_HE) {
      hop((t, h) => { const o = TINH_HUONG_DOI[t][h][q]; return [o.tinhHuong, o.nenNoi, o.nenTranh]; });
    }
    for (const b of BAC_TRE_DANH_SACH) {
      hop((t, h) => Object.values(TINH_HUONG_VOI_TRE[t][h][b]));
      hop((t, h) => Object.values(TINH_HUONG_TRE_VOI_NL[t][h][b]));
    }
  });
});
