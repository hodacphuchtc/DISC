import { describe, expect, it } from "vitest";

import {
  HUONG_LECH_CAP,
  KIEU_TRUNG_KHOP,
  THE_QUYEN,
  XUNG_HO_THEO_THE_QUYEN,
  thayDaiTuCap,
} from "../config/disc-lech-cap";
import {
  MO_TA_LECH,
  THOA_THUAN,
  TRUNG_KHOP,
  VIEC_CUA_TOI,
} from "../config/disc-noi-dung-cap";
import {
  HuongLechPhongCach,
  LECH_PHONG_CACH,
} from "../config/disc-loi-khuyen";
import { MA_TRUC } from "../modules/core/bo-de/kieu";

/**
 * 🔴 14.1 — ĐỔI TRỤC QUY CHIẾU TỪ VAI SANG NGƯỜI ĐỌC.
 *
 * Bảng cũ khoá theo VAI (`bo-me-cao-hon`). Nó đúng khi chỉ có hai người và một trong hai
 * luôn là bố mẹ. Sang phân tích cả nhà thì cặp có thể là *con ↔ anh* hay *bố ↔ mẹ*, và câu
 * hỏi "ai là bố mẹ?" không còn câu trả lời.
 *
 * Cửa kiểm quan trọng nhất của hạng mục này là cửa HỒI QUY: bảng CŨ phải còn nguyên vẹn.
 * Đổi trục quy chiếu mà làm hỏng màn đang chạy là đánh đổi tệ nhất có thể.
 */

/** Gom trọn 56 đoạn về một mảng — dùng cho các cửa kiểm quét toàn bộ. */
function MOI_DOAN(): string[] {
  const ra: string[] = [];
  for (const t of MA_TRUC) {
    for (const h of HUONG_LECH_CAP) {
      ra.push(MO_TA_LECH[t][h].veToi, MO_TA_LECH[t][h].veNguoiKia, THOA_THUAN[t][h]);
      for (const q of THE_QUYEN) ra.push(VIEC_CUA_TOI[t][h][q]);
    }
    for (const k of KIEU_TRUNG_KHOP) ra.push(TRUNG_KHOP[t][k]);
  }
  return ra;
}

describe("🔴 HỒI QUY — bảng CŨ còn nguyên, không sửa tại chỗ", () => {
  it("LECH_PHONG_CACH vẫn khoá theo VAI, đủ 4 trục × 2 hướng", () => {
    const HUONG_CU: readonly HuongLechPhongCach[] = ["bo-me-cao-hon", "bo-me-thap-hon"];
    for (const t of MA_TRUC) {
      for (const h of HUONG_CU) {
        expect(LECH_PHONG_CACH[t]?.[h], `mất ${t}/${h}`).toBeTruthy();
      }
    }
  });

  it("bốn trường của bảng cũ còn đủ — màn so phong cách bộ QS dựa vào chúng", () => {
    for (const t of MA_TRUC) {
      const k = LECH_PHONG_CACH[t]["bo-me-cao-hon"];
      for (const truong of ["choBoMe", "choCon", "boMeTuNhin", "thoaThuan"] as const) {
        expect(typeof k[truong], `${t}.${truong}`).toBe("string");
        expect(k[truong].length).toBeGreaterThan(60);
      }
    }
  });

  it("🔴 bảng MỚI không mang khoá theo vai — nếu không thì chẳng đổi gì cả", () => {
    expect([...HUONG_LECH_CAP]).toEqual(["toi-cao-hon", "toi-thap-hon"]);
    expect(HUONG_LECH_CAP as readonly string[]).not.toContain("bo-me-cao-hon");
  });
});

describe("trục quy chiếu MỚI — soi gương giữa hai người đọc", () => {
  it("đúng HAI hướng, phủ cả hai chiều mọi cặp", () => {
    // Vẫn 8 khoá (4 trục × 2 hướng) chứ không nhân lên theo số quan hệ — đó là cả điểm
    // của việc đổi trục quy chiếu.
    expect(HUONG_LECH_CAP).toHaveLength(2);
    expect(MA_TRUC.length * HUONG_LECH_CAP.length).toBe(8);
  });

  it("đúng BA thế quyền, không hơn", () => {
    expect([...THE_QUYEN]).toEqual(["nguoi-lon-voi-tre", "tre-voi-nguoi-lon", "ngang-vai"]);
  });
});

describe("thayDaiTuCap — xưng hô theo THẾ QUYỀN, không theo bộ đề", () => {
  it("trẻ đọc về người lớn thì tự xưng 'em'", () => {
    expect(thayDaiTuCap("{Toi} thấy {toi} ổn.", "tre-voi-nguoi-lon", "Mẹ Lan")).toBe(
      "Em thấy em ổn.",
    );
  });

  it("người lớn đọc thì tự xưng 'bạn'", () => {
    expect(thayDaiTuCap("{Toi} ổn.", "nguoi-lon-voi-tre", "Bin")).toBe("Bạn ổn.");
    expect(thayDaiTuCap("{Toi} ổn.", "ngang-vai", "Mẹ Lan")).toBe("Bạn ổn.");
  });

  it("🔴 {nguoiKia} thay bằng TÊN đã lưu, không phải một đại từ quan hệ", () => {
    // Tiếng Việt đòi biết giới tính và thứ bậc để chọn đại từ, mà sản phẩm CỐ Ý không thu
    // giới tính. Gọi bằng tên né được việc phải suy ra một thứ chưa ai nhập.
    expect(thayDaiTuCap("{NguoiKia} quyết nhanh hơn {toi}.", "tre-voi-nguoi-lon", "Mẹ Lan")).toBe(
      "Mẹ Lan quyết nhanh hơn em.",
    );
  });

  it("thay HẾT mọi lần xuất hiện, không chỉ lần đầu", () => {
    expect(thayDaiTuCap("{toi} và {toi} và {nguoiKia} với {nguoiKia}", "ngang-vai", "Bin")).toBe(
      "bạn và bạn và Bin với Bin",
    );
  });

  it("chuỗi không có token nào thì trả về y nguyên", () => {
    expect(thayDaiTuCap("Không có gì.", "ngang-vai", "Bin")).toBe("Không có gì.");
  });

  it("bảng xưng hô có ĐÚNG một mục cho mỗi thế quyền — 7 phần tử, không phải 49 ô", () => {
    expect(Object.keys(XUNG_HO_THEO_THE_QUYEN).sort()).toEqual([...THE_QUYEN].sort());
    const soPhanTu =
      Object.keys(XUNG_HO_THEO_THE_QUYEN).length +
      Object.values(XUNG_HO_THEO_THE_QUYEN).flatMap((x) => Object.values(x)).length;
    expect(soPhanTu).toBeLessThanOrEqual(10);
  });
});

/* ────────────────────────────────────────────────────────────────────────────
   14.3 — 56 ĐOẠN NỘI DUNG CẶP
   ──────────────────────────────────────────────────────────────────────────── */

describe("🔴 14.3 — đủ 56 đoạn, không ô nào trống", () => {
  it("MO_TA_LECH: 4 trục × 2 hướng × 2 trường = 16 đoạn", () => {
    let dem = 0;
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        for (const truong of ["veToi", "veNguoiKia"] as const) {
          const chu = MO_TA_LECH[t][h][truong];
          expect(typeof chu, `${t}/${h}/${truong}`).toBe("string");
          expect(chu.length, `${t}/${h}/${truong} quá ngắn`).toBeGreaterThan(80);
          dem += 1;
        }
      }
    }
    expect(dem).toBe(16);
  });

  it("THOA_THUAN: 8 đoạn", () => {
    let dem = 0;
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        expect(THOA_THUAN[t][h].length).toBeGreaterThan(80);
        dem += 1;
      }
    }
    expect(dem).toBe(8);
  });

  it("VIEC_CUA_TOI: 4 trục × 2 hướng × 3 thế quyền = 24 đoạn", () => {
    let dem = 0;
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        for (const q of THE_QUYEN) {
          expect(VIEC_CUA_TOI[t][h][q].length, `${t}/${h}/${q}`).toBeGreaterThan(50);
          dem += 1;
        }
      }
    }
    expect(dem).toBe(24);
  });

  it("TRUNG_KHOP: 8 đoạn", () => {
    let dem = 0;
    for (const t of MA_TRUC) {
      for (const k of KIEU_TRUNG_KHOP) {
        expect(TRUNG_KHOP[t][k].length).toBeGreaterThan(40);
        dem += 1;
      }
    }
    expect(dem).toBe(8);
  });

  it("🔴 TỔNG đúng 56 đoạn, và KHÔNG hai đoạn nào trùng nhau", () => {
    // Cạm bẫy 27/08: một script sửa hàng loạt dồn cả 8 câu vào riêng trục D, và không cửa
    // kiểm nào bắt được vì độ dài vẫn đạt. Soi trùng lặp là cửa duy nhất bắt được.
    const tatCa = MOI_DOAN();
    expect(tatCa).toHaveLength(56);
    expect(new Set(tatCa).size, "có đoạn bị lặp — nhiều khả năng bị dồn nhầm khoá").toBe(56);
  });
});

describe("🔴🔴 veNguoiKia PHẢI LẬT KHUNG — đoạn nguy hiểm nhất sản phẩm", () => {
  /**
   * `{nguoiKia}` là TÊN một người có thật, và người đọc có thể là anh chị em của họ. Một
   * câu mô tả trung tính như *"Tí Nị quyết chậm hơn em"* đọc lên vẫn thành một lời chê.
   *
   * 🔴 Dùng KHẲNG ĐỊNH DƯƠNG (phải CÓ dấu hiệu lật khung) chứ không dùng regex cấm: regex
   * cấm sẽ báo nhầm chính những câu lật khung, đúng bài học chữ "bạn" vừa là đại từ vừa là
   * danh từ.
   */
  const DAU_HIEU_LAT_KHUNG =
    /không phải[\s\S]{0,40}mà|thật ra|dễ bị đọc thành|nhìn từ ngoài|chứ không phải/iu;

  it.each(MA_TRUC)("trục %s: cả hai hướng đều có dấu hiệu lật khung", (t) => {
    for (const h of HUONG_LECH_CAP) {
      expect(
        MO_TA_LECH[t][h].veNguoiKia,
        `${t}/${h} nói về người kia mà không lật khung — đó là một lời chê có vỏ trung tính`,
      ).toMatch(DAU_HIEU_LAT_KHUNG);
    }
  });

  it("mọi veNguoiKia đều gọi người kia bằng TÊN, không bằng đại từ quan hệ", () => {
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        expect(MO_TA_LECH[t][h].veNguoiKia).toMatch(/\{nguoiKia\}|\{NguoiKia\}/u);
      }
    }
  });

  it("veToi nói về chính người đọc, có {toi} hoặc {Toi}", () => {
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        expect(MO_TA_LECH[t][h].veToi).toMatch(/\{toi\}|\{Toi\}/u);
      }
    }
  });
});

describe("🔴🔴 tre-voi-nguoi-lon KHÔNG giao cho trẻ việc của người lớn", () => {
  /**
   * Bảo một đứa trẻ *"hãy đợi mẹ nói hết"* là dạy nó một kỹ năng. Bảo nó *"hãy giúp mẹ
   * chậm lại"* là giao cho nó trách nhiệm điều tiết một người lớn — và khi chuyện trong
   * nhà không đỡ hơn, đứa trẻ sẽ hiểu là nó đã làm hỏng.
   */
  const CAU_GIAO_VIEC_NGUOI_LON =
    /giúp (bố|mẹ|người lớn|\{nguoiKia\})[\s\S]{0,30}(bình tĩnh|chậm lại|thay đổi|sửa)|nhắc (bố|mẹ|\{nguoiKia\})|dạy (bố|mẹ|\{nguoiKia\})|làm cho (bố|mẹ|\{nguoiKia\})/iu;

  it.each(MA_TRUC)("trục %s: không câu nào bảo trẻ đi quản lý người lớn", (t) => {
    for (const h of HUONG_LECH_CAP) {
      expect(
        VIEC_CUA_TOI[t][h]["tre-voi-nguoi-lon"],
        `${t}/${h} giao cho trẻ việc điều tiết người lớn`,
      ).not.toMatch(CAU_GIAO_VIEC_NGUOI_LON);
    }
  });

  it("mọi câu ở thế quyền này đều nói về CÁCH TRẺ NÓI RA điều mình cần", () => {
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        expect(VIEC_CUA_TOI[t][h]["tre-voi-nguoi-lon"]).toMatch(/nói|hỏi|thử/iu);
      }
    }
  });

  it("🔴 ba thế quyền cho ra BA câu khác nhau — không bê nguyên một câu dùng chung", () => {
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        const ba = THE_QUYEN.map((q) => VIEC_CUA_TOI[t][h][q]);
        expect(new Set(ba).size, `${t}/${h} dùng chung một câu cho nhiều thế quyền`).toBe(3);
      }
    }
  });
});

describe("🔴 CẤM so sánh hơn kém trong TOÀN BỘ 56 đoạn", () => {
  it("không có 'tốt hơn / giỏi hơn / đúng hơn / hợp lý hơn'", () => {
    const tatCa = MOI_DOAN().join("\n");
    expect(tatCa).not.toMatch(/tốt hơn|giỏi hơn|đúng hơn|hợp lý hơn|khá hơn|thông minh hơn/iu);
  });

  it("không có từ khuyết thiếu", () => {
    const tatCa = MOI_DOAN().join("\n");
    expect(tatCa).not.toMatch(/khiếm khuyết|điểm yếu|cần bổ sung|khắc phục/iu);
  });

  it("không tiên đoán nghề nghiệp, không gắn học lực (§9.2 luật 3 và 5)", () => {
    const tatCa = MOI_DOAN().join("\n");
    expect(tatCa).not.toMatch(/hợp làm|nghề|học giỏi|học lực|điểm số ở lớp/iu);
  });
});

describe("thoả thuận — luôn có phần cho CẢ HAI phía", () => {
  it("mỗi thoả thuận nhắc tới cả {toi} lẫn {nguoiKia}", () => {
    // Một thoả thuận chỉ đòi một bên đổi thì không phải thoả thuận — nó là một yêu cầu có
    // vỏ lịch sự, và người kia biết ngay.
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        expect(THOA_THUAN[t][h], `${t}/${h}`).toMatch(/\{toi\}|\{Toi\}/u);
        expect(THOA_THUAN[t][h], `${t}/${h}`).toMatch(/\{nguoiKia\}|\{NguoiKia\}/u);
      }
    }
  });

  it("mỗi thoả thuận có THỜI HẠN và cách nhìn lại", () => {
    for (const t of MA_TRUC) {
      for (const h of HUONG_LECH_CAP) {
        expect(THOA_THUAN[t][h]).toMatch(/hai tuần/iu);
        expect(THOA_THUAN[t][h]).toMatch(/hết hai tuần|ngồi lại|xem/iu);
      }
    }
  });
});

describe("🔴 trùng khớp vẫn có chữ — không để trống cho nhà hợp nhau nhất", () => {
  it("mỗi trục có cả cùng-nổi lẫn cùng-nhẹ, và hai câu khác nhau", () => {
    for (const t of MA_TRUC) {
      expect(TRUNG_KHOP[t]["cung-noi"]).not.toBe(TRUNG_KHOP[t]["cung-nhe"]);
    }
  });

  it("mỗi câu trùng khớp nêu CẢ cái được LẪN chỗ cần để ý", () => {
    // Trùng khớp không phải chỉ toàn tin vui: cùng một nhịp cũng nghĩa là cùng một điểm mù.
    for (const t of MA_TRUC) {
      for (const k of KIEU_TRUNG_KHOP) {
        expect(TRUNG_KHOP[t][k], `${t}/${k} chỉ toàn lời khen`).toMatch(/—|nhưng|và cũng/u);
      }
    }
  });
});
