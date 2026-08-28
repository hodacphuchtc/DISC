import { describe, expect, it } from "vitest";

import {
  LOP_LON_NHAT,
  LOP_MAM_NON,
  LOP_NHO_NHAT,
  LOP_TREN_12,
  soLopCua,
  tuyChonLop,
} from "../config/disc-nguong";
import { CHU_BANG_GIA_DINH, nhanLopCua } from "../config/disc-tu-dien";

/**
 * BẬC HỌC CỦA MỘT THÀNH VIÊN (V1.1).
 *
 * 🔴 Vì sao có file này. Trước V1.1, danh sách lớp là `Array.from({length: 12})` gõ lại ở
 * HAI nơi (`chon-doi-tuong.tsx` và `form-thanh-vien.tsx`), và mầm non thì không cửa nào
 * chọn được — dù `dinhTuyen()` đã nhận `doiTuong: "mam-non"` từ lâu. Trẻ mầm non vì thế
 * không có đường nào vào bài, và không một test nào đỏ vì chẳng ai hỏi câu đó.
 *
 * Hai luật file này canh:
 *   1. Đúng 14 mục, đúng thứ tự — đây là bản đặc tả đọc được của yêu cầu.
 *   2. 🔴 KHÔNG mục nào mang giá trị BẰNG SỐ ngoài dải lớp thật. Sentinel bằng số (0 cho
 *      mầm non, 13 cho trên lớp 12) chui vào `ThanhVien.lop` rồi được lưu như thể có
 *      người đang học lớp 0 — sáu tháng sau không ai truy được nó ở đâu ra.
 */
describe("tuyChonLop", () => {
  const ds = tuyChonLop();

  it("trả đúng 14 mục: mầm non + 12 lớp + trên lớp 12", () => {
    expect(ds).toHaveLength(14);
  });

  it("mục đầu là mầm non, mục cuối là trên lớp 12", () => {
    expect(ds[0]?.gia).toBe(LOP_MAM_NON);
    expect(ds.at(-1)?.gia).toBe(LOP_TREN_12);
  });

  it("mười hai mục giữa là lớp 1 tới lớp 12, đúng thứ tự", () => {
    expect(ds.slice(1, 13).map((x) => x.so)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("🔴 hai bậc ngoài phổ thông KHÔNG mang số lớp — không bịa lớp 0 hay lớp 13", () => {
    expect(ds[0]?.so).toBeUndefined();
    expect(ds.at(-1)?.so).toBeUndefined();
    // Và giá trị đem đi lưu phải là chuỗi chữ, không phải chuỗi số.
    expect(Number.isNaN(Number(ds[0]?.gia))).toBe(true);
    expect(Number.isNaN(Number(ds.at(-1)?.gia))).toBe(true);
  });

  it("mọi giá trị lưu đều khác nhau", () => {
    expect(new Set(ds.map((x) => x.gia)).size).toBe(ds.length);
  });
});

describe("soLopCua", () => {
  it("trả số cho lớp phổ thông", () => {
    expect(soLopCua("1")).toBe(LOP_NHO_NHAT);
    expect(soLopCua("7")).toBe(7);
    expect(soLopCua("12")).toBe(LOP_LON_NHAT);
  });

  it("🔴 trả undefined cho mầm non và trên lớp 12 — KHÔNG trả NaN", () => {
    // `Number("mam-non")` ra NaN, và NaN lọt qua mọi phép so sánh mà không ai biết.
    // Đây đúng là lỗi đã khiến `boDeCuaThanhVien()` đá trẻ mầm non về màn hỏi lại.
    expect(soLopCua(LOP_MAM_NON)).toBeUndefined();
    expect(soLopCua(LOP_TREN_12)).toBeUndefined();
  });

  it("trả undefined cho chuỗi rác và chuỗi rỗng từ bản kho cũ", () => {
    expect(soLopCua(undefined)).toBeUndefined();
    expect(soLopCua("")).toBeUndefined();
    expect(soLopCua("lop 7")).toBeUndefined();
    expect(soLopCua("7.5")).toBeUndefined();
  });

  it("trả undefined cho số nằm ngoài dải lớp nhận được", () => {
    expect(soLopCua("0")).toBeUndefined();
    expect(soLopCua("13")).toBeUndefined();
    expect(soLopCua("-3")).toBeUndefined();
  });
});

describe("nhanLopCua", () => {
  it("gọi tên đúng cả 14 bậc, không bậc nào ra chuỗi rỗng", () => {
    for (const x of tuyChonLop()) {
      expect(nhanLopCua(x.gia).trim().length).toBeGreaterThan(0);
    }
  });

  it("mầm non và trên lớp 12 KHÔNG bị gọi thành 'Lớp mam-non'", () => {
    expect(nhanLopCua(LOP_MAM_NON)).toBe(CHU_BANG_GIA_DINH.nhanMamNon);
    expect(nhanLopCua(LOP_TREN_12)).toBe(CHU_BANG_GIA_DINH.nhanTren12);
    expect(nhanLopCua(LOP_MAM_NON)).not.toContain("{so}");
  });

  it("lớp phổ thông gọi là 'Lớp {số}'", () => {
    expect(nhanLopCua("7")).toBe("Lớp 7");
  });

  it("chưa chọn lớp thì nói là chưa chọn, không để trống", () => {
    expect(nhanLopCua(undefined)).toBe(CHU_BANG_GIA_DINH.chuaChonLop);
  });
});
