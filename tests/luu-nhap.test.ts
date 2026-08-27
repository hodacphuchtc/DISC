import { afterEach, describe, expect, it, vi } from "vitest";

import { PHIEN_BAN_BO_DE } from "../config/disc-cau-hoi";
import { docNhap, ghiNhap, khoaNhap, xoaNhap, type Nhap } from "../modules/core/luu-tru/nhap";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

const nhapMau = (ghiDe: Partial<Nhap> = {}): Nhap => ({
  boDe: "THCS",
  bietDanh: "Bi",
  traLoi: { "THCS-D1": 4, "THCS-I6": 2 },
  batDau: "2026-08-27T01:20:00+07:00",
  giayDaLam: 42,
  phienBanBoDe: PHIEN_BAN_BO_DE,
  ...ghiDe,
});

describe("lưu nháp — ghi và đọc", () => {
  it("ghi rồi đọc lại đúng nguyên vẹn", () => {
    const n = nhapMau();
    ghiNhap(n);
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).toEqual(n);
  });

  it("chưa có nháp thì trả null, không nổ", () => {
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).toBeNull();
  });

  it("xoá nháp rồi thì đọc ra null", () => {
    ghiNhap(nhapMau());
    xoaNhap("THCS");
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).toBeNull();
  });
});

describe("lưu nháp — không lẫn lộn", () => {
  it("🔴 nháp bộ THCS KHÔNG lẫn sang bộ QS", () => {
    ghiNhap(nhapMau({ boDe: "THCS" }));
    ghiNhap(nhapMau({ boDe: "QS", traLoi: { "QS-D1": 5 } }));

    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)?.traLoi).toEqual({
      "THCS-D1": 4,
      "THCS-I6": 2,
    });
    expect(docNhap("QS", "Bi", PHIEN_BAN_BO_DE)?.traLoi).toEqual({ "QS-D1": 5 });
    expect(khoaNhap("THCS")).not.toBe(khoaNhap("QS"));
  });

  it("🔴 nháp của biệt danh KHÁC thì KHÔNG trả về — máy giáo viên đi qua nhiều nhà", () => {
    ghiNhap(nhapMau({ bietDanh: "Bi" }));
    expect(docNhap("THCS", "Bống", PHIEN_BAN_BO_DE)).toBeNull();
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).not.toBeNull();
  });

  it("khác phiên bản bộ đề thì bỏ nháp — câu đã đổi, đáp án cũ hết nghĩa", () => {
    ghiNhap(nhapMau({ phienBanBoDe: "0.9" }));
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).toBeNull();
  });
});

describe("lưu nháp — chịu đựng dữ liệu hỏng", () => {
  it("JSON hỏng ⇒ trả null, KHÔNG ném lỗi ra ngoài", () => {
    window.localStorage.setItem(khoaNhap("THCS"), "{ đây không phải JSON");
    expect(() => docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).not.toThrow();
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).toBeNull();
  });

  it("JSON đúng nhưng thiếu trường ⇒ trả null", () => {
    window.localStorage.setItem(khoaNhap("THCS"), JSON.stringify({ boDe: "THCS" }));
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).toBeNull();
  });

  it("nháp khai sai bộ đề so với khoá ⇒ trả null", () => {
    window.localStorage.setItem(khoaNhap("THCS"), JSON.stringify(nhapMau({ boDe: "QS" })));
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).toBeNull();
  });
});

describe("lưu nháp — cửa sổ ẩn danh", () => {
  it("🔴 localStorage NÉM khi đọc ⇒ trả null, không làm hỏng bài đang làm", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Chặn bởi chế độ riêng tư", "SecurityError");
    });
    expect(() => docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).not.toThrow();
    expect(docNhap("THCS", "Bi", PHIEN_BAN_BO_DE)).toBeNull();
  });

  it("🔴 localStorage NÉM khi ghi ⇒ nuốt lỗi, bài vẫn làm tiếp được", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Hết dung lượng", "QuotaExceededError");
    });
    expect(() => ghiNhap(nhapMau())).not.toThrow();
  });

  it("🔴 localStorage NÉM khi xoá ⇒ nuốt lỗi", () => {
    vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new DOMException("Chặn", "SecurityError");
    });
    expect(() => xoaNhap("THCS")).not.toThrow();
  });
});
