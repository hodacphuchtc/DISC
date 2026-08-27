import { describe, expect, it } from "vitest";

import { CHU_THE, DIEN_GIAI, type MaKieu } from "../config/disc-dien-giai";
import { CHU_KET_QUA } from "../config/disc-tu-dien";
import { MA_BO_DE, MA_TRUC, type MaTruc } from "../modules/core/bo-de/kieu";
import type { Kieu } from "../modules/report/cham";
import { LoiDienGiai, layDienGiai, maKieuTu, thayChuThe } from "../modules/report/dien-giai";

/** Đủ 11 kiểu: 4 đơn + 6 pha + 1 đều. */
const MOI_KIEU: Kieu[] = [
  ...MA_TRUC.map((truc) => ({ loai: "don", truc }) as const),
  { loai: "pha", cap: ["D", "I"] },
  { loai: "pha", cap: ["D", "S"] },
  { loai: "pha", cap: ["D", "C"] },
  { loai: "pha", cap: ["I", "S"] },
  { loai: "pha", cap: ["I", "C"] },
  { loai: "pha", cap: ["S", "C"] },
  { loai: "deu" },
];

describe("maKieuTu", () => {
  it("kiểu đơn ⇒ đúng mã trục", () => {
    expect(maKieuTu({ loai: "don", truc: "S" })).toBe("S");
  });

  it("phổ đều ⇒ DEU", () => {
    expect(maKieuTu({ loai: "deu" })).toBe("DEU");
  });

  it("cặp pha luôn ra khoá theo thứ tự D-I-S-C dù truyền vào thứ tự nào", () => {
    expect(maKieuTu({ loai: "pha", cap: ["C", "D"] })).toBe("DC");
    expect(maKieuTu({ loai: "pha", cap: ["D", "C"] })).toBe("DC");
    expect(maKieuTu({ loai: "pha", cap: ["C", "S"] })).toBe("SC");
  });
});

describe("🔴 phủ kín — không khoá nào trỏ vào chỗ trống", () => {
  it("có đúng 11 kiểu, và MỌI kiểu đều có văn bản", () => {
    expect(Object.keys(DIEN_GIAI)).toHaveLength(11);
    for (const kieu of MOI_KIEU) {
      const ma = maKieuTu(kieu);
      expect(DIEN_GIAI[ma], `Kiểu ${ma} không có văn bản`).toBeDefined();
    }
  });

  it.each(Object.keys(DIEN_GIAI) as MaKieu[])("kiểu %s: cả bốn khối đều có nội dung", (ma) => {
    const k = DIEN_GIAI[ma];
    expect(k.trongNhuTheNao.trim().length).toBeGreaterThan(30);
    expect(k.diemManh.trim().length).toBeGreaterThan(30);
    expect(k.choCanDeY.trim().length).toBeGreaterThan(30);
    expect(k.cauHoiToiNay).toHaveLength(3);
    for (const c of k.cauHoiToiNay) expect(c.trim().length).toBeGreaterThan(10);
  });

  it("🔴 MỖI kiểu bắt buộc có khối 'chỗ cần để ý' — báo cáo toàn lời khen là dấu hiệu không đo gì cả", () => {
    for (const ma of Object.keys(DIEN_GIAI) as MaKieu[]) {
      expect(DIEN_GIAI[ma].choCanDeY.trim(), `Kiểu ${ma} thiếu 'chỗ cần để ý'`).not.toBe("");
    }
  });

  it("mọi bộ đề đều khai đại từ", () => {
    for (const ma of MA_BO_DE) expect(CHU_THE[ma]).toBeDefined();
  });
});

describe("🔴 luật viết nội dung §9.2", () => {
  const moiVanBan = Object.values(DIEN_GIAI).flatMap((k) => [
    k.trongNhuTheNao,
    k.diemManh,
    k.choCanDeY,
    ...k.cauHoiToiNay,
  ]);

  it("KHÔNG tiên đoán nghề nghiệp", () => {
    for (const t of moiVanBan) {
      expect(t, `"${t.slice(0, 40)}…"`).not.toMatch(
        /hợp làm|nghề nghiệp|sau này làm|trở thành (lãnh đạo|kế toán|bác sĩ|kỹ sư)/iu,
      );
    }
  });

  it("KHÔNG so sánh với trẻ khác", () => {
    for (const t of moiVanBan) {
      expect(t).not.toMatch(/hơn \d+ ?%|so với các bạn cùng lớp|top \d/iu);
    }
  });

  it("KHÔNG gắn với học lực", () => {
    for (const t of moiVanBan) {
      expect(t).not.toMatch(/học giỏi|học kém|điểm cao|điểm thấp|giỏi toán|giỏi văn/iu);
    }
  });

  it("KHÔNG nói bản chất kiểu 'LÀ người ...'", () => {
    for (const t of moiVanBan) {
      expect(t, `"${t.slice(0, 50)}…"`).not.toMatch(/\b(là|LÀ) (một )?(người|đứa trẻ) (chủ động|cẩn trọng|ổn định|ảnh hưởng)/u);
    }
  });
});

describe("thayChuThe", () => {
  it("thay đúng đại từ theo bộ đề", () => {
    expect(thayChuThe("{ChuThe} quyết nhanh, {chuThe} nói thẳng.", "QS")).toBe(
      "Con quyết nhanh, con nói thẳng.",
    );
    expect(thayChuThe("{ChuThe} quyết nhanh.", "THCS")).toBe("Bạn quyết nhanh.");
    expect(thayChuThe("{ChuThe} quyết nhanh.", "MN")).toBe("Bé quyết nhanh.");
    expect(thayChuThe("{ChuThe} quyết nhanh.", "TH")).toBe("Em quyết nhanh.");
  });

  it("bộ đề chưa khai đại từ ⇒ NÉM lỗi đọc được", () => {
    // @ts-expect-error — cố tình truyền mã sai để kiểm hành vi ở biên.
    expect(() => thayChuThe("{chuThe}", "KHONG-CO")).toThrow(LoiDienGiai);
  });
});

describe("layDienGiai", () => {
  it("trả về bốn khối đã thay hết chỗ giữ chỗ — không còn dấu ngoặc nhọn nào", () => {
    for (const kieu of MOI_KIEU) {
      for (const ma of MA_BO_DE) {
        const dg = layDienGiai(kieu, ma);
        for (const t of [dg.trongNhuTheNao, dg.diemManh, dg.choCanDeY, ...dg.cauHoiToiNay]) {
          expect(t, `Còn chỗ giữ chỗ chưa thay: "${t}"`).not.toMatch(/\{[A-Za-z]+\}/u);
        }
      }
    }
  });

  it("cùng một kiểu nhưng bộ khác nhau cho ra đại từ khác nhau", () => {
    const kieu: Kieu = { loai: "don", truc: "D" as MaTruc };
    expect(layDienGiai(kieu, "QS").trongNhuTheNao).toContain("Con");
    expect(layDienGiai(kieu, "THCS").trongNhuTheNao).toContain("Bạn");
  });
});

describe("🔴 HỒI QUY: không gõ cứng đại từ", () => {
  /**
   * Lỗi đã trả giá 27/08/2026: ba câu hỏi gợi chuyện được viết cho PHỤ HUYNH HỎI CON
   * ("Hôm nay có điều gì con muốn nói…"), nhưng cùng bộ văn bản đó được dùng cho cả bộ
   * THCS — nơi người đọc là chính học sinh. Một em 13 tuổi đọc báo cáo của mình mà bị
   * gọi là "con" là sai. Tiêu đề khối đã đổi đúng, ruột thì chưa — kiểu lỗi mà test cũ
   * không thấy vì nó chỉ đếm độ dài chuỗi.
   *
   * Dùng `(?<!\p{L})…(?!\p{L})` thay cho `\b`: `\b` không khớp sau ký tự tiếng Việt
   * nếu thiếu cờ `u` (rule R9).
   */
  const DAI_TU_CAM = ["con", "bé", "em", "bạn", "cháu", "mình em", "bố mẹ ơi"];

  it.each(Object.entries(DIEN_GIAI))(
    "kiểu %s: ba câu hỏi dùng {chuThe}, không gõ cứng đại từ",
    (ma, khoi) => {
      for (const cau of khoi.cauHoiToiNay) {
        for (const dt of DAI_TU_CAM) {
          const re = new RegExp(`(?<!\\p{L})${dt}(?!\\p{L})`, "iu");
          expect(
            re.test(cau),
            `Kiểu ${ma} — câu "${cau}" gõ cứng đại từ "${dt}". Dùng {chuThe}/{ChuThe} ` +
              `để cùng một câu chạy được cho cả người tự đánh giá lẫn người quan sát.`,
          ).toBe(false);
        }
      }
    },
  );

  it("mỗi câu hỏi PHẢI có ít nhất một chỗ giữ chỗ, hoặc không nhắc tới ai cả", () => {
    for (const [ma, khoi] of Object.entries(DIEN_GIAI)) {
      for (const cau of khoi.cauHoiToiNay) {
        const coGiuCho = /\{chuThe\}|\{ChuThe\}/u.test(cau);
        const nhacToiAi = /(?<!\p{L})(ai|người khác|mọi người)(?!\p{L})/iu.test(cau);
        expect(
          coGiuCho || nhacToiAi,
          `Kiểu ${ma} — câu "${cau}" không có chủ thể rõ ràng.`,
        ).toBe(true);
      }
    }
  });

  it("câu hỏi sau khi thay cho bộ THCS KHÔNG còn chữ 'con'", () => {
    for (const kieu of MOI_KIEU) {
      for (const cau of layDienGiai(kieu, "THCS").cauHoiToiNay) {
        expect(/(?<!\p{L})con(?!\p{L})/iu.test(cau), `"${cau}"`).toBe(false);
      }
    }
  });

  it("câu hỏi sau khi thay cho bộ QS thì DÙNG chữ 'con'", () => {
    const coCon = MOI_KIEU.flatMap((k) => layDienGiai(k, "QS").cauHoiToiNay).filter((c) =>
      /(?<!\p{L})con(?!\p{L})/iu.test(c),
    );
    expect(coCon.length).toBeGreaterThan(20);
  });
});

describe("🔴 HỒI QUY: văn bản dùng chung không được gõ cứng đại từ", () => {
  /**
   * Lỗi đã trả giá 27/08/2026 (thấy ở bản in bộ QS): màn kết quả in ra HAI câu gần giống
   * nhau — một câu lấy từ `CHU_KET_QUA.phoDeu` gõ cứng "bạn", một câu lấy từ `DIEN_GIAI`
   * thay đúng thành "con". Người đọc thấy sản phẩm tự mâu thuẫn về chính mình.
   */
  it("CHU_KET_QUA không chứa đại từ chỉ người làm bài", () => {
    // MIỄN TRỪ có chủ đích: `cauRaoTre` là văn bản BA doc §3.2 bắt buộc NGUYÊN VĂN, và
    // nó nói với PHỤ HUYNH ("trò chuyện với con"), không nói với người làm bài. Chỉ hiện
    // ở bộ MN và TH — hai bộ mà người đọc báo cáo luôn là người lớn.
    const van = [CHU_KET_QUA.phang, CHU_KET_QUA.thieuCau, CHU_KET_QUA.phoDeu];
    for (const t of van) {
      expect(
        /(?<!\p{L})(bạn|con|bé|em)(?!\p{L})/iu.test(t),
        `"${t}" gõ cứng đại từ. Văn bản dùng cho MỌI bộ đề thì phải viết trung tính, ` +
          `hoặc chuyển sang DIEN_GIAI để được thay {chuThe}.`,
      ).toBe(false);
    }
  });
});
