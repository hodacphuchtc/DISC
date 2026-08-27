import { describe, expect, it } from "vitest";

import { NGUONG_VUNG_LECH } from "../config/disc-nguong";
import type { KetQua, MaBoDe, MaTruc } from "../modules/core/bo-de/kieu";
import {
  doiChieuPhongCach,
  timBaiBoMeMoiNhat,
  type BaiPhongCach,
} from "../modules/report/doi-chieu-phong-cach";

function ketQua(diem: Record<MaTruc, number>): KetQua {
  const xepHang = (["D", "I", "S", "C"] as MaTruc[]).sort((a, b) => diem[b] - diem[a]);
  return { hopLe: true, diem, xepHang, kieu: { loai: "don", truc: xepHang[0] }, canhBao: [] };
}

function bai(
  id: string,
  boDe: MaBoDe,
  diem: Record<MaTruc, number>,
  ketThuc = "2026-08-20T10:00:00.000Z",
): BaiPhongCach {
  return { id, boDe, maTre: `nguoi-${id}`, ketThuc, ketQua: ketQua(diem) };
}

/** Bố mẹ nhóm S trội, giống mẫu 05 ở tests/DATA_TEST. */
const BO_ME = bai("bm", "PH", { D: 29.2, I: 45.8, S: 75, C: 54.2 });
/** Con nhóm C trội, giống mẫu 03. */
const CON = { D: 37.5, I: 45.8, S: 54.2, C: 79.2 };

describe("timBaiBoMeMoiNhat", () => {
  it("chỉ nhận bộ PH", () => {
    const ds = [bai("a", "THCS", CON), BO_ME];
    expect(timBaiBoMeMoiNhat(ds)?.id).toBe("bm");
  });

  it("lấy bài PH mới nhất khi có nhiều bài", () => {
    const cu = bai("cu", "PH", { D: 50, I: 50, S: 50, C: 50 }, "2026-01-01T00:00:00.000Z");
    const moi = bai("moi", "PH", { D: 80, I: 20, S: 30, C: 40 }, "2026-08-26T00:00:00.000Z");
    expect(timBaiBoMeMoiNhat([cu, moi])?.id).toBe("moi");
  });

  it("bỏ qua bài PH không hợp lệ", () => {
    const hong: BaiPhongCach = {
      ...BO_ME,
      id: "hong",
      ketQua: { hopLe: false, lyDo: "PHANG" },
    };
    expect(timBaiBoMeMoiNhat([hong])).toBeNull();
  });

  it("không có bài PH nào thì trả null, không ném", () => {
    expect(timBaiBoMeMoiNhat([bai("a", "THCS", CON)])).toBeNull();
  });
});

describe("doiChieuPhongCach", () => {
  it("ghép được khi có bài bố mẹ và bài con hợp lệ", () => {
    const kq = doiChieuPhongCach([BO_ME], ketQua(CON), "THCS");
    expect(kq.ghepDuoc).toBe(true);
    if (!kq.ghepDuoc) return;
    expect(kq.bang).toHaveLength(4);
    expect(kq.baiBoMe.id).toBe("bm");
  });

  it("bảng giữ thứ tự D-I-S-C để đọc cùng nhịp với biểu đồ", () => {
    const kq = doiChieuPhongCach([BO_ME], ketQua(CON), "THCS");
    if (!kq.ghepDuoc) throw new Error("phải ghép được");
    expect(kq.bang.map((r) => r.truc)).toEqual(["D", "I", "S", "C"]);
  });

  it("lệch mang dấu: dương = bố mẹ cao hơn con", () => {
    const kq = doiChieuPhongCach([BO_ME], ketQua(CON), "THCS");
    if (!kq.ghepDuoc) throw new Error("phải ghép được");
    const s = kq.bang.find((r) => r.truc === "S");
    const c = kq.bang.find((r) => r.truc === "C");
    expect(s?.lech).toBeCloseTo(75 - 54.2, 1);
    expect(s?.huong).toBe("bo-me-cao-hon");
    expect(c?.lech).toBeCloseTo(54.2 - 79.2, 1);
    expect(c?.huong).toBe("bo-me-thap-hon");
  });

  it("🔴 diễn giải tối đa hai trục, và bỏ trục trùng khớp", () => {
    const kq = doiChieuPhongCach([BO_ME], ketQua(CON), "THCS");
    if (!kq.ghepDuoc) throw new Error("phải ghép được");
    expect(kq.dienGiai.length).toBeLessThanOrEqual(NGUONG_VUNG_LECH.soTrucDienGiaiToiDa);
    for (const d of kq.dienGiai) {
      expect(kq.bang.find((r) => r.truc === d.truc)?.mucLech).not.toBe("trungKhop");
      expect(d.than.length).toBeGreaterThan(40);
    }
  });

  it("hai hồ sơ gần y hệt nhau ⇒ vẫn ghép được nhưng không diễn giải trục nào", () => {
    const kq = doiChieuPhongCach([BO_ME], ketQua({ D: 30, I: 46, S: 74, C: 55 }), "THCS");
    if (!kq.ghepDuoc) throw new Error("phải ghép được");
    expect(kq.dienGiai).toHaveLength(0);
    expect(kq.bang.every((r) => r.mucLech === "trungKhop")).toBe(true);
  });

  it("chưa có bài bố mẹ ⇒ nói rõ lý do để giao diện mời làm nốt", () => {
    const kq = doiChieuPhongCach([], ketQua(CON), "THCS");
    expect(kq).toEqual({ ghepDuoc: false, lyDo: "THIEU_BAI_BO_ME" });
  });

  it("🔴 KHÔNG so bài PH với chính nó", () => {
    // Bố mẹ tự đánh giá rồi mở lại bài của chính mình — so với chính mình thì mọi trục
    // lệch 0 và màn hình nói một câu vô nghĩa.
    const kq = doiChieuPhongCach([BO_ME], BO_ME.ketQua, "PH");
    expect(kq).toEqual({ ghepDuoc: false, lyDo: "THIEU_BAI_BO_ME" });
  });

  it("bài con không hợp lệ thì không ghép", () => {
    const kq = doiChieuPhongCach([BO_ME], { hopLe: false, lyDo: "PHANG" }, "MN");
    expect(kq).toEqual({ ghepDuoc: false, lyDo: "BAI_CON_KHONG_HOP_LE" });
  });

  it("ghép được với cả bài bố mẹ QUAN SÁT con (bộ MN/QS), không chỉ bài con tự làm", () => {
    for (const bo of ["MN", "QS", "TH", "THCS"] as const) {
      expect(doiChieuPhongCach([BO_ME], ketQua(CON), bo).ghepDuoc, bo).toBe(true);
    }
  });
});
