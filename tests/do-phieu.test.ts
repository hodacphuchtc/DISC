import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { timKhoaCam } from "../modules/core/lien-he/kieu";
import {
  MOC,
  NGUON_MAC_DINH,
  chuanHoaNguon,
  datCachGhiMoc,
  demTheoMoc,
  docNguonTuUrl,
  docPhieu,
  ghiMoc,
  ghiMocTrenMay,
  xoaPhieu,
} from "../modules/core/do-phieu";

const LUC = "2026-08-27T07:00:00+07:00";

beforeEach(() => {
  xoaPhieu();
  datCachGhiMoc(ghiMocTrenMay);
});
afterEach(() => {
  xoaPhieu();
  vi.restoreAllMocks();
});

describe("nguồn", () => {
  it("đọc được từ tham số ?nguon=", () => {
    expect(docNguonTuUrl("?nguon=lop-3a")).toBe("lop-3a");
    expect(docNguonTuUrl("?a=1&nguon=hoi-cho")).toBe("hoi-cho");
  });

  it("thiếu tham số ⇒ rơi về mặc định", () => {
    expect(docNguonTuUrl("")).toBe(NGUON_MAC_DINH);
    expect(docNguonTuUrl("?a=1")).toBe(NGUON_MAC_DINH);
  });

  it("lọc sạch ký tự lạ, không cho nguồn thành chỗ nhét dữ liệu", () => {
    expect(chuanHoaNguon("Lớp 3A <script>")).toBe("lp3ascript");
    expect(chuanHoaNguon("0912345678")).toBe("0912345678");
    expect(chuanHoaNguon("!!!")).toBe(NGUON_MAC_DINH);
    expect(chuanHoaNguon("x".repeat(40))).toBe(NGUON_MAC_DINH);
  });

  it("không phải chuỗi ⇒ mặc định", () => {
    for (const rac of [null, undefined, 7, {}]) expect(chuanHoaNguon(rac)).toBe(NGUON_MAC_DINH);
  });
});

describe("ghi mốc", () => {
  it("có ĐÚNG bốn mốc, không hơn", () => {
    expect([...MOC]).toEqual(["mo", "batDau", "xong", "deLaiSo"]);
  });

  it("ghi rồi đọc lại đúng thứ tự", () => {
    ghiMoc("mo", "lop-3a", LUC);
    ghiMoc("batDau", "lop-3a", LUC);
    expect(docPhieu().map((b) => b.moc)).toEqual(["mo", "batDau"]);
  });

  it("mỗi bản ghi mang theo nguồn", () => {
    ghiMoc("xong", "hoi-cho", LUC);
    expect(docPhieu()[0]).toEqual({ moc: "xong", nguon: "hoi-cho", luc: LUC });
  });

  it("🔴 bản ghi KHÔNG chứa câu trả lời hay điểm số", () => {
    for (const m of MOC) ghiMoc(m, "lop-3a", LUC);
    for (const b of docPhieu()) {
      expect(timKhoaCam(b)).toEqual([]);
      expect(Object.keys(b).sort()).toEqual(["luc", "moc", "nguon"]);
    }
  });

  it("đếm đúng theo từng mốc", () => {
    ghiMoc("mo", "a", LUC);
    ghiMoc("mo", "a", LUC);
    ghiMoc("batDau", "a", LUC);
    expect(demTheoMoc(docPhieu())).toEqual({ mo: 2, batDau: 1, xong: 0, deLaiSo: 0 });
  });

  it("đội dev nối được cách ghi riêng", () => {
    const cua = vi.fn();
    datCachGhiMoc(cua);
    ghiMoc("xong", "lop-3a", LUC);
    expect(cua).toHaveBeenCalledWith({ moc: "xong", nguon: "lop-3a", luc: LUC });
    expect(docPhieu()).toEqual([]); // không ghi vào localStorage nữa
  });

  it("🔴 localStorage bị chặn ⇒ mất khả năng ĐO, không mất khả năng DÙNG", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Chặn", "SecurityError");
    });
    expect(() => ghiMoc("mo", "a", LUC)).not.toThrow();
  });

  it("dữ liệu hỏng trong localStorage ⇒ đọc ra mảng rỗng, không nổ", () => {
    window.localStorage.setItem("disc:phieu", "{ không phải mảng");
    expect(docPhieu()).toEqual([]);
  });

  it("giữ tối đa 500 bản ghi gần nhất", () => {
    for (let i = 0; i < 520; i += 1) ghiMoc("mo", "a", LUC);
    expect(docPhieu()).toHaveLength(500);
  });
});
