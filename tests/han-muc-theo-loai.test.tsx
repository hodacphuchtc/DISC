/**
 * `28.0` — hạn mức 2 bản MỖI LOẠI (tự làm / bố mẹ làm cho con).
 *
 * Bài học của thiết kế: gộp hai loại vào một hạn mức thì một bé có đủ hai góc nhìn đã đầy
 * hạn mức, và lần test lại sau 6 tháng xoá bản cũ nhất — có thể là bản của góc nhìn còn lại,
 * làm màn đối chiếu biến mất. Tên người bịa.
 */

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GIOI_HAN_BAI_MOI_NGUOI } from "../config/disc-gia-dinh";
import { MA_BO_DE } from "../modules/core/bo-de/kieu";
import { chonBaiPhaiXoa, loaiCuaBoDe } from "../modules/core/gia-dinh/han-muc";
import {
  baiSapMat,
  docTatCa,
  donBaiThanhVien,
  luuBai,
  xoaSach,
  xoaSachThanhVien,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import { laBanQuanSat } from "../modules/test/dinh-tuyen";

let dem = 0;
const bai = (boDe: BaiLamLuu["boDe"], ketThuc: string, maThanhVien = "tv-be"): BaiLamLuu => {
  dem += 1;
  return {
    id: `b-${dem}`,
    boDe,
    maTre: "Zozo",
    maThanhVien,
    nguoiTraLoi: boDe === "TH" || boDe === "THCS" ? "tre" : "nguoi-lon",
    batDau: ketThuc,
    ketThuc,
    traLoi: {},
    ketQua: {
      hopLe: true,
      diem: { D: 60, I: 40, S: 30, C: 70 },
      xepHang: ["C", "D", "I", "S"],
      kieu: { loai: "don", truc: "C" },
      canhBao: [],
    },
    phienBanBoDe: "1.1",
  };
};

describe("loaiCuaBoDe", () => {
  it("khớp laBanQuanSat() của module test cho MỌI bộ đề (core không import được module test)", () => {
    for (const ma of MA_BO_DE) {
      expect(loaiCuaBoDe(ma) === "quan-sat", ma).toBe(laBanQuanSat(ma));
    }
  });
});

describe("chonBaiPhaiXoa có loại", () => {
  const be = [
    bai("THCS", "2026-01-01T00:00:00Z"),
    bai("QS", "2026-01-02T00:00:00Z"),
    bai("THCS", "2026-03-01T00:00:00Z"),
    bai("QS", "2026-03-02T00:00:00Z"),
  ];

  it("hỏi 'quan-sat' thì nạn nhân CHỈ là bài quan sát cũ nhất", () => {
    const nan = chonBaiPhaiXoa(be, GIOI_HAN_BAI_MOI_NGUOI, 1, "quan-sat");
    expect(nan.map((b) => b.boDe)).toEqual(["QS"]);
    expect(nan[0].ketThuc).toBe("2026-01-02T00:00:00Z");
  });

  it("hỏi 'tu-lam' thì nạn nhân CHỈ là bài tự làm cũ nhất", () => {
    const nan = chonBaiPhaiXoa(be, GIOI_HAN_BAI_MOI_NGUOI, 1, "tu-lam");
    expect(nan.map((b) => b.boDe)).toEqual(["THCS"]);
  });

  it("mỗi loại mới có 1 bản thì thêm 1 bản nữa KHÔNG xoá gì, dù tổng đã 2", () => {
    const hai = [bai("THCS", "2026-01-01T00:00:00Z"), bai("QS", "2026-01-02T00:00:00Z")];
    expect(chonBaiPhaiXoa(hai, GIOI_HAN_BAI_MOI_NGUOI, 1, "quan-sat")).toEqual([]);
    expect(chonBaiPhaiXoa(hai, GIOI_HAN_BAI_MOI_NGUOI, 1, "tu-lam")).toEqual([]);
  });

  it("không truyền loại thì giữ hành vi cũ (gộp) — tương thích ngược", () => {
    expect(chonBaiPhaiXoa(be, 2, 1)).toHaveLength(3);
  });

  it("bài thiếu boDe không bao giờ là nạn nhân của một loại cụ thể", () => {
    const thieu = [{ id: "x", ketThuc: "2026-01-01T00:00:00Z" }];
    expect(chonBaiPhaiXoa(thieu, 1, 1, "tu-lam")).toEqual([]);
  });
});

describe("kho thật (fake-indexeddb)", () => {
  beforeEach(async () => {
    await xoaSach();
    await xoaSachThanhVien();
  });
  afterEach(async () => {
    await xoaSach();
  });

  it("🔴 bé đủ 4 bản: làm thêm bản bố mẹ chỉ xoá bản QS cũ nhất, bản tự làm còn nguyên", async () => {
    const cu = bai("QS", "2026-01-02T00:00:00Z");
    for (const b of [
      bai("THCS", "2026-01-01T00:00:00Z"),
      cu,
      bai("THCS", "2026-03-01T00:00:00Z"),
      bai("QS", "2026-03-02T00:00:00Z"),
    ]) {
      await luuBai(b);
    }

    const sap = await baiSapMat("tv-be", GIOI_HAN_BAI_MOI_NGUOI, 1, "quan-sat");
    expect(sap.map((b) => b.id)).toEqual([cu.id]);

    expect(await donBaiThanhVien("tv-be", GIOI_HAN_BAI_MOI_NGUOI, 1, "quan-sat")).toEqual([cu.id]);

    const con = await docTatCa();
    expect(con.filter((b) => b.boDe === "THCS")).toHaveLength(2);
    expect(con.filter((b) => b.boDe === "QS")).toHaveLength(1);
  });

  it("người khác không bị ảnh hưởng", async () => {
    await luuBai(bai("THCS", "2026-01-01T00:00:00Z", "tv-khac"));
    await luuBai(bai("THCS", "2026-02-01T00:00:00Z", "tv-khac"));
    expect(await baiSapMat("tv-be", GIOI_HAN_BAI_MOI_NGUOI, 1, "tu-lam")).toEqual([]);
  });
});
