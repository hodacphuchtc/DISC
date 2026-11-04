import { describe, expect, it } from "vitest";
import { tuoiTheoThang } from "@modules/core/suc-khoe/tuoi";
import {
  phanLoaiBmiChauA,
  tinhBmi,
  tinhBmr,
  tinhTdee,
} from "@modules/core/suc-khoe/chi-so";
import { phanLoaiTheoZ, zLms, zLmsTho } from "@modules/core/suc-khoe/z-score";
import { phanTichSucKhoe } from "@modules/core/suc-khoe/phan-tich";
import type { DauVaoSucKhoe } from "@modules/core/suc-khoe/kieu";

// Toàn bộ người dưới đây là BỊA (repo công khai, dữ liệu trẻ em).
const NGUOI_LON_NAM: DauVaoSucKhoe = {
  ngaySinh: "1990-05-10",
  gioiTinh: "nam",
  ngayDo: "2026-11-03",
  canNangKg: 70,
  chieuCaoCm: 175,
};
const BE_9_TUOI: DauVaoSucKhoe = {
  ngaySinh: "2017-02-20",
  gioiTinh: "nu",
  ngayDo: "2026-11-03",
  canNangKg: 28,
  chieuCaoCm: 132,
};

describe("tuổi theo tháng", () => {
  it("đếm tháng trọn theo lịch", () => {
    expect(tuoiTheoThang("2026-01-31", "2026-02-28")).toBe(0);
    expect(tuoiTheoThang("2026-01-15", "2026-02-15")).toBe(1);
    expect(tuoiTheoThang("2021-11-04", "2026-11-03")).toBe(59);
    expect(tuoiTheoThang("2021-11-03", "2026-11-03")).toBe(60);
  });
  it("ngày hỏng ⇒ null; đo trước khi sinh ⇒ -1", () => {
    expect(tuoiTheoThang("03/11/2026", "2026-11-03")).toBeNull();
    expect(tuoiTheoThang("2026-02-31", "2026-11-03")).toBeNull();
    expect(tuoiTheoThang("2026-11-04", "2026-11-03")).toBe(-1);
  });
});

describe("chỉ số người lớn", () => {
  it("BMI và phân loại châu Á", () => {
    expect(tinhBmi(70, 175)).toBeCloseTo(22.857, 2);
    expect(phanLoaiBmiChauA(18.4)).toBe("thieu-can");
    expect(phanLoaiBmiChauA(22.9)).toBe("binh-thuong");
    expect(phanLoaiBmiChauA(23)).toBe("thua-can");
    expect(phanLoaiBmiChauA(25)).toBe("beo-phi");
    expect(phanLoaiBmiChauA(30)).toBe("beo-phi-nang");
  });
  it("BMR Mifflin–St Jeor (tính tay: 1648,75 và 1482,75)", () => {
    expect(tinhBmr(70, 175, 30, "nam")).toBeCloseTo(1648.75, 2);
    expect(tinhBmr(70, 175, 30, "nu")).toBeCloseTo(1482.75, 2);
    expect(tinhTdee(1000, "vua")).toBeCloseTo(1550, 5);
  });
});

describe("z-score LMS (bảng bịa, kiểm công thức)", () => {
  const lms = { l: -1, m: 16, s: 0.1 };
  it("y = M ⇒ z = 0", () => {
    expect(zLms(16, lms)).toBeCloseTo(0, 10);
  });
  it("L = 0 dùng logarit", () => {
    expect(zLmsTho(Math.E * 10, { l: 0, m: 10, s: 1 })).toBeCloseTo(1, 10);
  });
  it("y tại +1 SD ⇒ z = 1", () => {
    const y = 16 * Math.pow(1 + -1 * 0.1 * 1, 1 / -1);
    expect(zLms(y, lms)).toBeCloseTo(1, 8);
  });
  it("đuôi: hiệu chỉnh vẫn đơn điệu và qua mốc ±3 liên tục", () => {
    const y3 = 16 * Math.pow(1 + -1 * 0.1 * 3, 1 / -1);
    expect(zLms(y3, lms)).toBeCloseTo(3, 6);
    expect(zLms(y3 + 1, lms)).toBeGreaterThan(3);
  });
  it("phân loại theo z", () => {
    expect(phanLoaiTheoZ(-3.5)).toBe("thap-nang");
    expect(phanLoaiTheoZ(-2.5)).toBe("thap");
    expect(phanLoaiTheoZ(0)).toBe("binh-thuong");
    expect(phanLoaiTheoZ(2.5)).toBe("cao");
    expect(phanLoaiTheoZ(3.5)).toBe("cao-nang");
  });
});

describe("phân tích một lần đo", () => {
  it("người lớn: BMI, phân loại, BMR/TDEE khi có mức vận động", () => {
    const r = phanTichSucKhoe({ ...NGUOI_LON_NAM, mucVanDong: "vua" });
    expect(r.hopLe).toBe(true);
    if (!r.hopLe) return;
    expect(r.nhomTuoi).toBe("nguoi-lon");
    expect(r.phanLoaiBmi).toBe("binh-thuong");
    // Sinh 10/05/1990, đo 03/11/2026 ⇒ 36 tuổi: 700 + 1093,75 − 180 + 5 = 1618,75.
    expect(r.bmrKcal).toBeCloseTo(1618.75, 2);
    expect(r.tdeeKcal).toBeGreaterThan(r.bmrKcal ?? 0);
    expect(r.duocGoiYGiamCan).toBe(false);
    expect(r.canhBao).toContain("khong-thay-bac-si");
  });

  it("🔴 trẻ em KHÔNG BAO GIỜ được gợi ý giảm cân, dù BMI cao", () => {
    const r = phanTichSucKhoe({ ...BE_9_TUOI, canNangKg: 60 });
    expect(r.hopLe && r.duocGoiYGiamCan).toBe(false);
    const rr = phanTichSucKhoe({ ...BE_9_TUOI, canNangKg: 60 }, () => ({ l: -1, m: 16, s: 0.1 }));
    expect(rr.hopLe && rr.duocGoiYGiamCan).toBe(false);
  });

  it("trẻ chưa có bảng ⇒ không bịa phân loại, có cảnh báo", () => {
    const r = phanTichSucKhoe(BE_9_TUOI);
    if (!r.hopLe) throw new Error("phải hợp lệ");
    expect(r.nhomTuoi).toBe("5-19");
    expect(r.bmi).not.toBeNull();
    expect(r.zBmi).toBeNull();
    expect(r.phanLoaiZ).toBeNull();
    expect(r.canhBao).toContain("chua-co-bang-tang-truong");
  });

  it("trẻ có bảng ⇒ ra z và phân loại; ngoài vùng thì khuyên gặp chuyên gia", () => {
    const r = phanTichSucKhoe({ ...BE_9_TUOI, canNangKg: 60 }, () => ({ l: -1, m: 16, s: 0.1 }));
    if (!r.hopLe) throw new Error("phải hợp lệ");
    expect(r.zBmi).not.toBeNull();
    expect(r.phanLoaiZ).toBe("cao-nang");
    expect(r.canhBao).toContain("nen-gap-chuyen-gia");
  });

  it("ranh giới 60 tháng đổi nhóm tuổi", () => {
    const duoi = phanTichSucKhoe({ ...BE_9_TUOI, ngaySinh: "2021-11-04" });
    const tren = phanTichSucKhoe({ ...BE_9_TUOI, ngaySinh: "2021-11-03" });
    expect(duoi.hopLe && duoi.nhomTuoi).toBe("duoi-5");
    expect(tren.hopLe && tren.nhomTuoi).toBe("5-19");
  });

  it("mang thai ⇒ không BMI, không năng lượng, không gợi ý giảm cân", () => {
    const r = phanTichSucKhoe({ ...NGUOI_LON_NAM, gioiTinh: "nu", canNangKg: 95, mangThaiHoacChoBu: true });
    if (!r.hopLe) throw new Error("phải hợp lệ");
    expect(r.bmi).toBeNull();
    expect(r.bmrKcal).toBeNull();
    expect(r.duocGoiYGiamCan).toBe(false);
    expect(r.canhBao).toContain("mang-thai-khong-ap-bmi");
  });

  it("người lớn thừa cân được gợi ý; có bệnh nền thì không, chỉ nhắc hỏi bác sĩ", () => {
    const thua = { ...NGUOI_LON_NAM, canNangKg: 85 };
    const a = phanTichSucKhoe(thua);
    expect(a.hopLe && a.duocGoiYGiamCan).toBe(true);
    const b = phanTichSucKhoe({ ...thua, coBenhNen: true });
    expect(b.hopLe && b.duocGoiYGiamCan).toBe(false);
    expect(b.hopLe && b.canhBao).toContain("benh-nen-hoi-bac-si");
  });

  it("vòng eo chỉ xét với người lớn", () => {
    const nl = phanTichSucKhoe({ ...NGUOI_LON_NAM, vongEoCm: 95 });
    expect(nl.hopLe && nl.eoVuotNguong).toBe(true);
    const tre = phanTichSucKhoe({ ...BE_9_TUOI, vongEoCm: 95 });
    expect(tre.hopLe && tre.eoVuotNguong).toBeNull();
  });

  it("từ chối số đo vô lý thay vì tính bừa", () => {
    const loi = (v: Partial<DauVaoSucKhoe>) => {
      const r = phanTichSucKhoe({ ...NGUOI_LON_NAM, ...v });
      return r.hopLe ? "ok" : r.lyDo;
    };
    expect(loi({ canNangKg: 700 })).toBe("can-nang-ngoai-khoang");
    expect(loi({ canNangKg: Number.NaN })).toBe("can-nang-ngoai-khoang");
    expect(loi({ chieuCaoCm: 17 })).toBe("chieu-cao-ngoai-khoang");
    expect(loi({ ngaySinh: "sai" })).toBe("ngay-sinh-hong");
    expect(loi({ ngayDo: "sai" })).toBe("ngay-do-hong");
    expect(loi({ ngaySinh: "2030-01-01" })).toBe("do-truoc-khi-sinh");
    expect(loi({ ngaySinh: "1800-01-01" })).toBe("tuoi-ngoai-khoang");
    expect(loi({ vongEoCm: 5 })).toBe("vong-eo-ngoai-khoang");
  });
});
