import { describe, expect, it } from "vitest";

import { hienNgay, hienNgayGio, laChuoiIso, ngayTuIso, soNgayGiua } from "../modules/core/tien-ich/ngay";

describe("laChuoiIso", () => {
  it("nhận chuỗi ISO", () => {
    expect(laChuoiIso("2026-08-27")).toBe(true);
    expect(laChuoiIso("2026-08-27T06:30:00+07:00")).toBe(true);
  });

  it("🔴 TỪ CHỐI dd/mm/yyyy — đây là chỗ new Date() đoán bừa theo lối Mỹ", () => {
    expect(laChuoiIso("01/08/2026")).toBe(false);
    expect(laChuoiIso("27/08/2026")).toBe(false);
  });

  it("từ chối mọi thứ không phải chuỗi", () => {
    for (const rac of [null, undefined, 0, {}, [], new Date()]) {
      expect(laChuoiIso(rac)).toBe(false);
    }
  });
});

describe("ngayTuIso", () => {
  it("dựng đúng ngày từ chuỗi ISO", () => {
    expect(ngayTuIso("2026-08-27T00:00:00+07:00")?.getFullYear()).toBe(2026);
  });

  it("🔴 chuỗi kiểu Việt Nam trả null, KHÔNG lẳng lặng ra ngày 8 tháng 1", () => {
    expect(ngayTuIso("01/08/2026")).toBeNull();
    // Chứng minh cái bẫy có thật:
    expect(new Date("01/08/2026").getMonth()).toBe(0); // tháng 1, không phải tháng 8
  });

  it("chuỗi ISO nhưng ngày không tồn tại ⇒ null", () => {
    expect(ngayTuIso("2026-13-45")).toBeNull();
  });
});

describe("hienNgay", () => {
  it("hiển thị dd/mm/yyyy", () => {
    expect(hienNgay("2026-08-27T10:00:00+07:00")).toMatch(/^\d{2}\/\d{2}\/2026$/u);
  });

  it("chuỗi hỏng ⇒ dấu gạch, KHÔNG ra 'Invalid Date'", () => {
    expect(hienNgay("rác")).toBe("—");
    expect(hienNgay(undefined)).toBe("—");
    expect(hienNgay("rác", "chưa rõ")).toBe("chưa rõ");
  });

  it("hienNgayGio thêm giờ 24h", () => {
    expect(hienNgayGio("2026-08-27T14:05:00")).toMatch(/^27\/08\/2026 14:05$/u);
  });
});

describe("soNgayGiua", () => {
  it("đếm đúng số ngày", () => {
    expect(soNgayGiua("2026-08-01T00:00:00Z", "2026-08-27T00:00:00Z")).toBe(26);
  });

  it("không phụ thuộc thứ tự, không bao giờ âm", () => {
    expect(soNgayGiua("2026-08-27T00:00:00Z", "2026-08-01T00:00:00Z")).toBe(26);
  });

  it("cùng ngày ⇒ 0", () => {
    expect(soNgayGiua("2026-08-27T01:00:00Z", "2026-08-27T23:00:00Z")).toBe(0);
  });

  it("🔴 chuỗi hỏng ⇒ null chứ KHÔNG phải 0 — nơi gọi phải tự quyết", () => {
    expect(soNgayGiua("01/08/2026", "2026-08-27")).toBeNull();
    expect(soNgayGiua(null, "2026-08-27")).toBeNull();
  });
});

describe("🔴 HỒI QUY: ngày phụ thuộc múi giờ", () => {
  /**
   * Lỗi đã trả giá 27/08/2026 — CI đỏ ngay lần chạy đầu tiên.
   *
   * `hienNgay()` đọc ngày theo múi giờ của MÁY ĐANG CHẠY. Đó là hành vi ĐÚNG với người
   * dùng: họ thấy ngày theo giờ của chính họ. Nhưng nó biến một ngày gõ cứng trong test
   * thành trò may rủi — máy dev ở +07 thì xanh, GitHub Actions chạy ở UTC thì đỏ.
   *
   * `vitest.config.mts` ghim TZ = Asia/Ho_Chi_Minh. Test này canh cái ghim đó còn sống.
   */
  it("môi trường test phải được ghim vào múi giờ +07", () => {
    const lech = new Date("2026-08-27T00:00:00Z").getTimezoneOffset();
    expect(lech, "TZ chưa được ghim — thêm env.TZ vào vitest.config.mts").toBe(-420);
  });

  it("mốc 06:08 giờ Việt Nam hiển thị là NGÀY HÔM ĐÓ, không lùi một ngày", () => {
    // Cùng mốc này ở UTC là 26/08 lúc 23:08 — sai một ngày.
    expect(hienNgay("2026-08-27T06:08:00+07:00")).toBe("27/08/2026");
  });

  it("mốc sát nửa đêm giờ Việt Nam vẫn ra đúng ngày", () => {
    expect(hienNgay("2026-08-27T00:30:00+07:00")).toBe("27/08/2026");
    expect(hienNgay("2026-08-27T23:30:00+07:00")).toBe("27/08/2026");
  });
});
