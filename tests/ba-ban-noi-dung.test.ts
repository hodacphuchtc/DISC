import { describe, expect, it } from "vitest";

import { LECH_PHONG_CACH, LOI_KHUYEN, TU_MINH, GOI_KY_DUYET } from "../config/disc-loi-khuyen";
import { MA_TRUC, type MaBoDe, type MaTruc } from "../modules/core/bo-de/kieu";
import { layDienGiaiDay, thayChuThe } from "../modules/report/dien-giai";

/**
 * 🔴 HẠNG MỤC 10.7 — NỘI DUNG BA BẢN.
 *
 * Hai luật của đặc tả, và mỗi luật chặn một cách hỏng cụ thể:
 *
 *  1. **Ma trận ba bản không ô nào rỗng.** Thêm một bản mới mà quên đổ chữ vào thì giao
 *     diện vẫn dựng, chỉ là một người đọc mở ra thấy trống. Không có gì đỏ.
 *  2. **Không câu dài nào xuất hiện ở hai bản.** Đây là luật đắt nhất, vì nó chặn đúng lỗi
 *     đã trả giá 27/08/2026: bê chữ viết cho phụ huynh sang bộ THCS rồi chỉ đổi tiêu đề.
 *     Cách hỏng đó KHÔNG làm test nào đỏ và KHÔNG làm trang vỡ — nó chỉ làm một đứa trẻ
 *     đọc phải đoạn văn viết về nó cho người khác.
 */

/** Ngưỡng "câu dài" — dưới mức này thì trùng nhau là trùng ngẫu nhiên, không phải chép. */
const CAU_DAI_TOI_THIEU = 60;

const HUONG = ["bo-me-cao-hon", "bo-me-thap-hon"] as const;
const TRUONG_LECH = ["choBoMe", "choCon", "boMeTuNhin", "thoaThuan"] as const;

const DIEM = { D: 88, I: 42, S: 70, C: 35 } as const;
const XEP_HANG: readonly MaTruc[] = ["D", "S", "I", "C"];

/** Cắt thành câu rồi chỉ giữ câu ĐỦ DÀI để việc trùng nhau có nghĩa. */
function cauDai(chu: string): string[] {
  return chu
    .split(/[.!?…]/u)
    .map((c) => c.replace(/\s+/gu, " ").trim())
    .filter((c) => c.length >= CAU_DAI_TOI_THIEU);
}

describe("🔴 ma trận ba bản — không ô nào rỗng", () => {
  it.each([
    ["MN", { banCon: false, banBoMe: true, banTuMinh: false }],
    ["QS", { banCon: false, banBoMe: true, banTuMinh: false }],
    ["TH", { banCon: true, banBoMe: true, banTuMinh: false }],
    ["THCS", { banCon: true, banBoMe: true, banTuMinh: false }],
    ["PH", { banCon: false, banBoMe: false, banTuMinh: true }],
  ] as const)("bộ %s dựng đúng các bản đã khai", (ma, mong) => {
    const dg = layDienGiaiDay({ diem: DIEM, xepHang: XEP_HANG, maBoDe: ma as MaBoDe });
    for (const [ban, phaiCo] of Object.entries(mong)) {
      expect(Boolean(dg[ban as keyof typeof dg]), `bộ ${ma} — ${ban}`).toBe(phaiCo);
    }
  });

  it.each(["MN", "QS", "TH", "THCS", "PH"] as const)(
    "bộ %s: mọi trường trong mọi bản đều có chữ thật",
    (ma) => {
      const dg = layDienGiaiDay({ diem: DIEM, xepHang: XEP_HANG, maBoDe: ma });
      for (const ban of ["banCon", "banBoMe", "banTuMinh"] as const) {
        const khoi = dg[ban];
        if (!khoi) continue;
        for (const [ten, gt] of Object.entries(khoi)) {
          const chu = Array.isArray(gt) ? gt.join(" ") : String(gt);
          expect(chu.trim().length, `${ma}.${ban}.${ten} rỗng`).toBeGreaterThan(20);
          expect(chu, `${ma}.${ban}.${ten} còn sót ô thay đại từ`).not.toMatch(/\{[Cc]huThe\}/u);
        }
      }
    },
  );

  it.each(MA_TRUC)("trục %s: cả 8 khoá lệch đều đủ BỐN cách kể", (t) => {
    for (const h of HUONG) {
      for (const f of TRUONG_LECH) {
        expect(LECH_PHONG_CACH[t][h][f].trim().length, `${t}.${h}.${f}`).toBeGreaterThan(60);
      }
    }
  });
});

describe("🔴 không câu dài nào xuất hiện ở HAI bản", () => {
  /**
   * So SAU khi thay đại từ, không phải trước. Chép ẩu rồi đổi `{chuThe}` vẫn ra hai đoạn
   * khác nhau về mặt chuỗi thô, nhưng người đọc thì nhận ra ngay là một bài.
   */
  it.each(MA_TRUC)("trục %s: bốn cách kể không dùng chung câu nào", (t) => {
    for (const h of HUONG) {
      const theoTruong = TRUONG_LECH.map((f) => ({
        f,
        cau: new Set(cauDai(thayChuThe(LECH_PHONG_CACH[t][h][f], "TH", "con"))),
      }));
      for (let i = 0; i < theoTruong.length; i += 1) {
        for (let j = i + 1; j < theoTruong.length; j += 1) {
          const chung = [...theoTruong[i].cau].filter((c) => theoTruong[j].cau.has(c));
          expect(
            chung,
            `${t}.${h}: "${theoTruong[i].f}" và "${theoTruong[j].f}" dùng chung câu`,
          ).toHaveLength(0);
        }
      }
    }
  });

  it.each(["TH", "THCS"] as const)(
    "bộ %s: bản của con và bản của bố mẹ không dùng chung câu nào",
    (ma) => {
      const dg = layDienGiaiDay({ diem: DIEM, xepHang: XEP_HANG, maBoDe: ma });
      const gom = (o: object | undefined) =>
        new Set(cauDai(Object.values(o ?? {}).flat().join(" ")));
      const con = gom(dg.banCon);
      const boMe = gom(dg.banBoMe);
      const chung = [...con].filter((c) => boMe.has(c));
      expect(chung, `bộ ${ma}: câu dùng chung giữa hai người đọc`).toHaveLength(0);
      expect(con.size, "bản của con không có câu dài nào — phép kiểm rỗng").toBeGreaterThan(0);
    },
  );

  it("bản tự đọc KHÔNG phải bản dịch của lời khuyên cho bố mẹ", () => {
    // Lỗi đã trả giá 27/08/2026, ghi thẳng trong `disc-loi-khuyen.ts`.
    for (const t of MA_TRUC) {
      const tuMinh = new Set(cauDai(Object.values(TU_MINH[t]).join(" ")));
      const boMe = new Set(cauDai(Object.values(LOI_KHUYEN[t]).flat().join(" ")));
      const chung = [...tuMinh].filter((c) => boMe.has(c));
      expect(chung, `trục ${t}: TU_MINH chép lại LOI_KHUYEN`).toHaveLength(0);
    }
  });
});

describe("🔴 hai gói ký duyệt phải tách rời", () => {
  it("gói B khai đúng nguồn nội dung người lớn tự đọc về mình", () => {
    expect(GOI_KY_DUYET.B.nguon.join(" ")).toContain("boMeTuNhin");
    expect(GOI_KY_DUYET.B.nguon.join(" ")).toContain("TU_MINH");
  });

  it("🔴 nội dung gói B KHÔNG được nằm lẫn trong gói A", () => {
    // Gộp hai gói là ép người ký nhận cả hai mức trách nhiệm, hoặc từ chối cả hai.
    const a = GOI_KY_DUYET.A.nguon.join(" ");
    expect(a).not.toContain("boMeTuNhin");
    expect(a).not.toMatch(/(^|\s)TU_MINH(\s|$)/u);
  });

  it("boMeTuNhin nói về NGƯỜI LỚN, không nhận xét đứa trẻ", () => {
    // Cách hỏng: viết "con bạn hay …" vào đúng khối lẽ ra chỉ soi phong cách của bố mẹ.
    for (const t of MA_TRUC) {
      for (const h of HUONG) {
        const chu = LECH_PHONG_CACH[t][h].boMeTuNhin;
        expect(chu, `${t}.${h}.boMeTuNhin`).toMatch(/bạn/u);
        expect(chu, `${t}.${h}.boMeTuNhin mở đầu phải quay về phía người lớn`).toMatch(
          /^Nhìn về phía bạn/u,
        );
      }
    }
  });
});
