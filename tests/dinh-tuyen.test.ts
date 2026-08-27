import { describe, expect, it } from "vitest";

import {
  LOP_CAO_NHAT_DUNG_BAN_QUAN_SAT,
  TUOI_TU_DANH_GIA_TOI_THIEU,
  dinhTuyen,
  type DauVaoDinhTuyen,
} from "../modules/test/dinh-tuyen";

const LOP = [1, 2, 3, 4, 5, 6, 7, 8, 9];

describe("định tuyến — bảng đầy đủ", () => {
  it("Mầm non ⇒ bộ MN, không hỏi thêm gì", () => {
    expect(dinhTuyen({ doiTuong: "mam-non" })).toEqual({ xong: true, boDe: "MN" });
  });

  it("THCS ⇒ bộ THCS, không hỏi thêm gì", () => {
    expect(dinhTuyen({ doiTuong: "thcs" })).toEqual({ xong: true, boDe: "THCS" });
  });

  it("Tiểu học chưa biết lớp ⇒ hỏi lớp, KHÔNG đoán bừa", () => {
    expect(dinhTuyen({ doiTuong: "tieu-hoc" })).toEqual({ xong: false, hoiThem: "lop" });
  });

  it.each([1, 2])("Tiểu học lớp %i ⇒ bộ MN KÈM giải thích", (lop) => {
    expect(dinhTuyen({ doiTuong: "tieu-hoc", lop })).toEqual({
      xong: true,
      boDe: "MN",
      giaiThich: "LOP_1_2",
    });
  });

  it.each([3, 4, 5])("Tiểu học lớp %i ⇒ bộ TH, bé tự làm", (lop) => {
    expect(dinhTuyen({ doiTuong: "tieu-hoc", lop })).toEqual({ xong: true, boDe: "TH" });
  });

  it("🔴 lớp 1 và lớp 2 KHÔNG BAO GIỜ ra bộ TH — quét toàn bộ 9 lớp", () => {
    for (const lop of LOP) {
      const kq = dinhTuyen({ doiTuong: "tieu-hoc", lop });
      if (!kq.xong) throw new Error("phải xong");
      if (lop <= LOP_CAO_NHAT_DUNG_BAN_QUAN_SAT) {
        expect(kq.boDe, `Lớp ${lop} bị đẩy sang bộ ${kq.boDe}`).toBe("MN");
      } else {
        expect(kq.boDe).not.toBe("MN");
      }
    }
  });

  it("chuyển sang bản quan sát thì LUÔN kèm mã giải thích — không chuyển im lặng", () => {
    for (const lop of [1, 2]) {
      const kq = dinhTuyen({ doiTuong: "tieu-hoc", lop });
      if (!kq.xong) throw new Error("phải xong");
      expect(kq.giaiThich).toBeDefined();
    }
    // Còn lớp 3–5 thì không có gì để giải thích.
    for (const lop of [3, 4, 5]) {
      const kq = dinhTuyen({ doiTuong: "tieu-hoc", lop });
      if (!kq.xong) throw new Error("phải xong");
      expect(kq.giaiThich).toBeUndefined();
    }
  });

  it("Phụ huynh chưa chọn mục tiêu ⇒ hỏi mục tiêu", () => {
    expect(dinhTuyen({ doiTuong: "phu-huynh" })).toEqual({ xong: false, hoiThem: "muc-tieu" });
  });

  it("Phụ huynh · về chính mình ⇒ bộ PH, không cần hỏi tuổi con", () => {
    expect(dinhTuyen({ doiTuong: "phu-huynh", mucTieu: "toi" })).toEqual({
      xong: true,
      boDe: "PH",
    });
  });

  it("Phụ huynh · về con nhưng chưa biết tuổi ⇒ hỏi tuổi con", () => {
    expect(dinhTuyen({ doiTuong: "phu-huynh", mucTieu: "con" })).toEqual({
      xong: false,
      hoiThem: "tuoi-con",
    });
  });

  it.each([8, 9, 12, 15])("Phụ huynh · con %i tuổi ⇒ bộ QS", (tuoiCon) => {
    expect(dinhTuyen({ doiTuong: "phu-huynh", mucTieu: "con", tuoiCon })).toEqual({
      xong: true,
      boDe: "QS",
    });
  });

  it.each([3, 5, 7])("Phụ huynh · con %i tuổi ⇒ bộ MN KÈM giải thích, KHÔNG ra QS", (tuoiCon) => {
    expect(dinhTuyen({ doiTuong: "phu-huynh", mucTieu: "con", tuoiCon })).toEqual({
      xong: true,
      boDe: "MN",
      giaiThich: "CON_DUOI_8",
    });
  });

  it("biên tuổi: đúng 8 tuổi thì ra QS, 7 tuổi thì không", () => {
    expect(TUOI_TU_DANH_GIA_TOI_THIEU).toBe(8);
    const o8 = dinhTuyen({ doiTuong: "phu-huynh", mucTieu: "con", tuoiCon: 8 });
    const o7 = dinhTuyen({ doiTuong: "phu-huynh", mucTieu: "con", tuoiCon: 7 });
    if (!o8.xong || !o7.xong) throw new Error("phải xong");
    expect(o8.boDe).toBe("QS");
    expect(o7.boDe).toBe("MN");
  });

  it("🔴 KHÔNG đường nào đưa trẻ dưới 8 tuổi vào bộ tự làm (TH hoặc THCS)", () => {
    const moiDauVao: DauVaoDinhTuyen[] = [
      { doiTuong: "mam-non" },
      ...LOP.map((lop) => ({ doiTuong: "tieu-hoc" as const, lop })),
      ...[3, 4, 5, 6, 7].map((tuoiCon) => ({
        doiTuong: "phu-huynh" as const,
        mucTieu: "con" as const,
        tuoiCon,
      })),
    ];
    for (const dv of moiDauVao) {
      const kq = dinhTuyen(dv);
      if (!kq.xong) continue;
      const treNho =
        dv.doiTuong === "mam-non" ||
        (dv.lop !== undefined && dv.lop <= 2) ||
        (dv.tuoiCon !== undefined && dv.tuoiCon < 8);
      if (treNho) {
        expect(["TH", "THCS"], `${JSON.stringify(dv)} ra bộ ${kq.boDe}`).not.toContain(kq.boDe);
      }
    }
  });
});
