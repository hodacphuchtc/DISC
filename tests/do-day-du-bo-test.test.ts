/**
 * `28.1` — độ đầy đủ của bộ test: ai đã làm, loại nào, còn thiếu gì.
 *
 * Luật cốt lõi: với bé từ lớp 3, "đủ" PHẢI trùng với việc màn đối chiếu ghép được — không
 * dựng luật thứ hai. Tên bịa.
 */

import { describe, expect, it } from "vitest";

import type { KetQua, MaBoDe } from "../modules/core/bo-de/kieu";
import { tinhDayDu, tongKetDayDu, type BaiDeDem } from "../modules/report/do-day-du-bo-test";
import { doiChieu } from "../modules/report/doi-chieu";

const HOP_LE: KetQua = {
  hopLe: true,
  diem: { D: 60, I: 40, S: 30, C: 70 },
  xepHang: ["C", "D", "I", "S"],
  kieu: { loai: "don", truc: "C" },
  canhBao: [],
} as unknown as KetQua;
const HONG = { ...HOP_LE, hopLe: false } as unknown as KetQua;

let dem = 0;
const bai = (
  boDe: MaBoDe,
  ketThuc: string,
  ghiDe: Partial<BaiDeDem> = {},
): BaiDeDem => {
  dem += 1;
  return {
    id: `b${dem}`,
    boDe,
    maTre: "Zozo",
    ketThuc,
    ketQua: HOP_LE,
    phienBanBoDe: "1.1",
    ...ghiDe,
  };
};
const TV = { id: "tv", ten: "Zozo" } as const;
const LON = { laTre: true, boDeQuanSat: "QS" } as const;

describe("người lớn", () => {
  const nl = { laTre: false, boDeQuanSat: null } as const;
  it("chưa làm ⇒ CHUA_LAM", () => {
    const d = tinhDayDu(TV, [], nl);
    expect(d).toMatchObject({ kieu: "nguoi-lon", daDu: false, viec: { ma: "CHUA_LAM" } });
  });
  it("một bản hợp lệ ⇒ đủ, ghi ngày gần nhất", () => {
    const d = tinhDayDu(TV, [bai("PH", "2026-03-01T00:00:00Z")], nl);
    expect(d.daDu).toBe(true);
    expect(d.ganNhatTuLam).toBe("2026-03-01T00:00:00Z");
  });
  it("chỉ có hồ sơ nhận qua mã mời ⇒ đủ và báo rõ", () => {
    const d = tinhDayDu({ ...TV, nhanQuaMa: { boDe: "PH", diem: HOP_LE.hopLe ? { D: 1, I: 1, S: 1, C: 1 } : { D: 1, I: 1, S: 1, C: 1 }, ngayPhat: "2026-01-01" } }, [], nl);
    expect(d).toMatchObject({ daDu: true, chiCoMaMoi: true });
  });
  it("chỉ có bản hỏng ⇒ chưa đủ, và nói có bản hỏng", () => {
    const d = tinhDayDu(TV, [bai("PH", "2026-03-01T00:00:00Z", { ketQua: HONG })], nl);
    expect(d).toMatchObject({ daDu: false, coBanHong: true, soTuLam: 1 });
  });
});

describe("bé nhỏ (bộ quan sát MN)", () => {
  const nho = { laTre: true, boDeQuanSat: "MN" } as const;
  it("có bản bố mẹ làm ⇒ đủ", () => {
    const d = tinhDayDu(TV, [bai("MN", "2026-03-01T00:00:00Z")], nho);
    expect(d).toMatchObject({ kieu: "tre-nho", daDu: true, soQuanSat: 1 });
  });
  it("chưa làm ⇒ CHUA_LAM", () => {
    expect(tinhDayDu(TV, [], nho).viec).toEqual({ ma: "CHUA_LAM" });
  });
});

describe("bé từ lớp 3 — trùng đúng điều kiện của màn đối chiếu", () => {
  const con = bai("THCS", "2026-03-01T00:00:00Z");
  const boMe = bai("QS", "2026-03-10T00:00:00Z");

  it("chỉ có bản con ⇒ THIEU_BAN_BO_ME", () => {
    expect(tinhDayDu(TV, [con], LON).viec).toEqual({ ma: "THIEU_BAN_BO_ME" });
  });
  it("chỉ có bản bố mẹ ⇒ THIEU_BAN_CON", () => {
    expect(tinhDayDu(TV, [boMe], LON).viec).toEqual({ ma: "THIEU_BAN_CON" });
  });
  it("đủ hai bản, cùng phiên bản, ≤ 60 ngày ⇒ đủ", () => {
    const d = tinhDayDu(TV, [con, boMe], LON);
    expect(d).toMatchObject({ kieu: "tre-lon", daDu: true, viec: null, soTuLam: 1, soQuanSat: 1 });
  });
  it("khác phiên bản ⇒ KHAC_PHIEN_BAN", () => {
    const d = tinhDayDu(TV, [con, { ...boMe, phienBanBoDe: "1.2" }], LON);
    expect(d.viec).toEqual({ ma: "KHAC_PHIEN_BAN" });
  });
  it("🔴 quá 60 ngày ⇒ QUA_HAN kèm số ngày — thẻ KHÔNG hiện ✓✓", () => {
    const xa = bai("QS", "2026-06-01T00:00:00Z");
    const d = tinhDayDu(TV, [con, xa], LON);
    expect(d.daDu).toBe(false);
    expect(d.viec?.ma).toBe("QUA_HAN");
    expect((d.viec as { soNgay: number }).soNgay).toBeGreaterThan(60);
  });
  it("kết quả luôn nhất quán với doiChieu() cho mọi tổ hợp", () => {
    const cacTo = [
      [con],
      [boMe],
      [con, boMe],
      [con, bai("QS", "2026-06-01T00:00:00Z")],
      [con, { ...boMe, phienBanBoDe: "1.2" }],
      [{ ...con, ketQua: HONG }, boMe],
    ];
    for (const ds of cacTo) {
      expect(tinhDayDu(TV, ds, LON).daDu).toBe(doiChieu(ds, "Zozo").ghepDuoc);
    }
  });
  it("đếm theo loại: 2 tự làm + 2 bố mẹ làm", () => {
    const ds = [con, bai("THCS", "2026-04-01T00:00:00Z"), boMe, bai("QS", "2026-04-02T00:00:00Z")];
    const d = tinhDayDu(TV, ds, LON);
    expect(d).toMatchObject({ soTuLam: 2, soQuanSat: 2 });
    expect(d.ganNhatTuLam).toBe("2026-04-01T00:00:00Z");
  });
  it("chưa làm gì ⇒ CHUA_LAM", () => {
    expect(tinhDayDu(TV, [], LON).viec).toEqual({ ma: "CHUA_LAM" });
  });
});

describe("chưa biết bậc học", () => {
  it("trẻ mà không suy được bộ quan sát ⇒ CHUA_BIET_BAC_HOC, không đoán", () => {
    const d = tinhDayDu(TV, [], { laTre: true, boDeQuanSat: null });
    expect(d).toMatchObject({ kieu: "chua-biet-bac", daDu: false, viec: { ma: "CHUA_BIET_BAC_HOC" } });
  });
});

describe("tongKetDayDu", () => {
  it("đếm số người đủ và liệt kê người còn thiếu", () => {
    const du = tinhDayDu(TV, [bai("PH", "2026-03-01T00:00:00Z")], { laTre: false, boDeQuanSat: null });
    const thieu = tinhDayDu({ id: "x", ten: "Bi" }, [], LON);
    const tk = tongKetDayDu([du, thieu]);
    expect(tk).toMatchObject({ tong: 2, soDu: 1 });
    expect(tk.conThieu.map((d) => d.ten)).toEqual(["Bi"]);
  });
});
