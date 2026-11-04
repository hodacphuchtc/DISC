/**
 * CỬA KIỂM của sổ sức khoẻ (ADR-010, 30.2): hạn mức 6 người × 3 bản, kho IndexedDB,
 * khứ hồi sao lưu → khôi phục, và hàng rào an toàn của nội dung lời khuyên.
 *
 * 🔴 Mọi người ở đây là BỊA (repo công khai, dữ liệu trẻ em).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { KHUON_LOI_KHUYEN, type MaKhuon } from "../config/suc-khoe-noi-dung";
import {
  TOI_DA_BAN_MOI_NGUOI,
  TOI_DA_NGUOI_SUC_KHOE,
} from "../config/suc-khoe-nguong";
import { CHU_SK } from "../config/suc-khoe-tu-dien";
import { docTuZip, ghiDeKho } from "../modules/core/luu-tru/khoi-phuc";
import { xoaSachTatCa } from "../modules/core/luu-tru/kho-bai";
import { khoSucKhoeIndexedDB } from "../modules/core/luu-tru/kho-suc-khoe-idb";
import {
  saoLuuTatCa,
  taoNoiDungZip,
  TEP_SUC_KHOE,
} from "../modules/core/luu-tru/sao-luu";
import { chonKhuon } from "../modules/core/suc-khoe/chon-khuon";
import type {
  DauVaoSucKhoe,
  NguoiSucKhoe,
} from "../modules/core/suc-khoe/kieu";
import { phanTichSucKhoe } from "../modules/core/suc-khoe/phan-tich";
import {
  laNguoiSucKhoeHopLe,
  themMocDo,
  timNguoiTheoTen,
  xoaMocDo,
  xoaNguoi,
  type YeuCauThemMoc,
} from "../modules/core/suc-khoe/so-suc-khoe";

const LUC = "2026-11-03T09:00:00+07:00";
let dem = 0;
const taoId = () => `id-${++dem}`;

const yc = (
  ten: string,
  ngayDo = "2026-11-03",
  canNangKg = 28,
): YeuCauThemMoc => ({
  ten,
  ngaySinh: "2017-02-20",
  gioiTinh: "nu",
  moc: { ngayDo, canNangKg, chieuCaoCm: 132 },
});

function themNhieu(...ten: string[]): readonly NguoiSucKhoe[] {
  let ds: readonly NguoiSucKhoe[] = [];
  for (const t of ten) {
    const r = themMocDo(ds, yc(t), LUC, taoId);
    if (r.kq !== "ok") throw new Error("phải thêm được");
    ds = r.ds;
  }
  return ds;
}

describe("hạn mức: mỗi người giữ 3 bản mới nhất", () => {
  it("bản thứ 4 thay bản cũ nhất, báo đúng bản bị thay", () => {
    let ds: readonly NguoiSucKhoe[] = [];
    for (const [i, ngay] of [
      "2026-05-03",
      "2026-08-03",
      "2026-10-03",
    ].entries()) {
      const r = themMocDo(ds, yc("Bé Bông", ngay, 25 + i), LUC, taoId);
      if (r.kq !== "ok") throw new Error("phải ok");
      expect(r.mocBiThay).toBeUndefined();
      ds = r.ds;
    }
    const r4 = themMocDo(ds, yc("bé  bông", "2026-11-03", 29), LUC, taoId);
    if (r4.kq !== "ok") throw new Error("phải ok");
    expect(r4.laNguoiMoi).toBe(false); // cùng tên (không phân biệt hoa/thường, dấu cách thừa)
    expect(r4.nguoi.moc).toHaveLength(TOI_DA_BAN_MOI_NGUOI);
    expect(r4.mocBiThay?.ngayDo).toBe("2026-05-03"); // bản cũ nhất
    expect(r4.nguoi.moc[0]?.ngayDo).toBe("2026-11-03"); // mới nhất đứng đầu
    expect(r4.ds).toHaveLength(1);
  });

  it("người vừa cập nhật nhảy lên đầu danh sách", () => {
    const ds = themNhieu("A", "B", "C");
    const r = themMocDo(ds, yc("A", "2026-12-01"), LUC, taoId);
    if (r.kq !== "ok") throw new Error("phải ok");
    expect(r.ds.map((n) => n.ten)).toEqual(["A", "C", "B"]);
  });
});

describe("hạn mức: tối đa 6 người, người thứ 7 KHÔNG tự xoá ai", () => {
  it("đủ 6 người, người mới ⇒ cần xoá; sổ giữ nguyên", () => {
    const ds = themNhieu("A", "B", "C", "D", "E", "F");
    expect(ds).toHaveLength(TOI_DA_NGUOI_SUC_KHOE);
    const r = themMocDo(ds, yc("G"), LUC, taoId);
    expect(r.kq).toBe("can-xoa-nguoi");
    expect(ds).toHaveLength(6);
  });

  it("đủ 6 người nhưng thêm bản cho người đã có ⇒ vẫn được", () => {
    const ds = themNhieu("A", "B", "C", "D", "E", "F");
    expect(themMocDo(ds, yc("C", "2026-12-01"), LUC, taoId).kq).toBe("ok");
  });

  it("sau khi xoá một người thì thêm được người thứ 7", () => {
    const ds = themNhieu("A", "B", "C", "D", "E", "F");
    const sau = xoaNguoi(ds, timNguoiTheoTen(ds, "A")!.id);
    expect(themMocDo(sau, yc("G"), LUC, taoId).kq).toBe("ok");
  });

  it("tên rỗng bị từ chối", () => {
    expect(themMocDo([], yc("   "), LUC, taoId).kq).toBe("ten-rong");
  });
});

describe("xoá bản / xoá người", () => {
  it("xoá bản cuối cùng ⇒ người đó rời sổ", () => {
    const r = themMocDo([], yc("A"), LUC, taoId);
    if (r.kq !== "ok") throw new Error("phải ok");
    const sau = xoaMocDo(r.ds, r.nguoi.id, r.nguoi.moc[0]!.id);
    expect(sau).toHaveLength(0);
  });
  it("xoá một trong nhiều bản ⇒ người còn, bản kia còn", () => {
    let ds = themNhieu("A");
    const r = themMocDo(ds, yc("A", "2026-12-01"), LUC, taoId);
    if (r.kq !== "ok") throw new Error("phải ok");
    ds = xoaMocDo(r.ds, r.nguoi.id, r.nguoi.moc[0]!.id);
    expect(ds[0]?.moc).toHaveLength(1);
  });
});

describe("kiểm hình dạng dữ liệu đọc từ ngoài", () => {
  it("chấp nhận bản ghi đúng, từ chối bản ghi hỏng hoặc quá 3 bản", () => {
    const r = themMocDo([], yc("A"), LUC, taoId);
    if (r.kq !== "ok") throw new Error("phải ok");
    expect(laNguoiSucKhoeHopLe(r.nguoi)).toBe(true);
    expect(laNguoiSucKhoeHopLe({ ...r.nguoi, moc: [] })).toBe(false);
    expect(
      laNguoiSucKhoeHopLe({ ...r.nguoi, moc: Array(4).fill(r.nguoi.moc[0]) }),
    ).toBe(false);
    expect(laNguoiSucKhoeHopLe({ ...r.nguoi, gioiTinh: "khac" })).toBe(false);
    expect(laNguoiSucKhoeHopLe(null)).toBe(false);
  });
});

/* ── Kho IndexedDB ─────────────────────────────────────────────────────────── */

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  await xoaSachTatCa();
});

describe("kho IndexedDB của sổ sức khoẻ", () => {
  it("ghi rồi đọc lại đủ, người mới cập nhật đứng đầu", async () => {
    const ds = themNhieu("A", "B");
    expect(await khoSucKhoeIndexedDB.ghiSo(ds, [])).toBe(true);
    const doc = await khoSucKhoeIndexedDB.docSo();
    expect(doc.map((n) => n.ten).sort()).toEqual(["A", "B"]);
  });

  it("ghiSo nguyên tử: lưu người mới và xoá người cũ cùng lúc", async () => {
    const ds = themNhieu("A", "B", "C", "D", "E", "F");
    await khoSucKhoeIndexedDB.ghiSo(ds, []);
    const bo = ds[0]!;
    const r = themMocDo(xoaNguoi(ds, bo.id), yc("G"), LUC, taoId);
    if (r.kq !== "ok") throw new Error("phải ok");
    expect(await khoSucKhoeIndexedDB.ghiSo([r.nguoi], [bo.id])).toBe(true);
    const doc = await khoSucKhoeIndexedDB.docSo();
    expect(doc).toHaveLength(6);
    expect(doc.some((n) => n.id === bo.id)).toBe(false);
    expect(doc.some((n) => n.ten === "G")).toBe(true);
  });

  it("🔴 'Xoá sạch tất cả' dọn cả sổ sức khoẻ", async () => {
    await khoSucKhoeIndexedDB.ghiSo(themNhieu("A"), []);
    await xoaSachTatCa();
    expect(await khoSucKhoeIndexedDB.docSo()).toEqual([]);
  });
});

describe("🔴 sao lưu → xoá sạch → khôi phục mang theo sổ sức khoẻ", () => {
  it("khứ hồi đủ cả người lẫn bản đo", async () => {
    const ds = themNhieu("A", "B");
    await khoSucKhoeIndexedDB.ghiSo(ds, []);
    const { duLieu } = await saoLuuTatCa(LUC);

    await xoaSachTatCa();
    expect(await khoSucKhoeIndexedDB.docSo()).toEqual([]);

    const kq = await docTuZip(duLieu);
    expect(kq.ok).toBe(true);
    if (!kq.ok) return;
    expect(kq.so.sucKhoe).toHaveLength(2);
    await ghiDeKho(kq.so);
    const doc = await khoSucKhoeIndexedDB.docSo();
    expect(doc.map((n) => n.ten).sort()).toEqual(["A", "B"]);
    expect(doc[0]?.moc[0]?.canNangKg).toBe(28);
  });

  it("tệp sao lưu đời trước (không có sổ sức khoẻ) vẫn nạp được, sổ để trống", async () => {
    const cu = await taoNoiDungZip([], LUC, [], [], []); // không truyền sổ sức khoẻ
    const kq = await docTuZip(cu);
    expect(kq.ok).toBe(true);
    if (!kq.ok) return;
    expect(kq.so.sucKhoe).toBeUndefined();
  });

  it("tệp sức khoẻ hỏng ⇒ báo du-lieu-hong, KHÔNG ghi gì", async () => {
    const zip = await taoNoiDungZip([], LUC, [], [], [], []);
    const JSZip = (await import("jszip")).default;
    const z = await JSZip.loadAsync(zip);
    z.file(TEP_SUC_KHOE, JSON.stringify([{ id: "x" }]));
    const hong = await z.generateAsync({ type: "uint8array" });
    const kq = await docTuZip(hong);
    expect(kq.ok).toBe(false);
    if (!kq.ok) expect(kq.loi).toBe("du-lieu-hong");
  });
});

/* ── Chọn khuôn + hàng rào an toàn của NỘI DUNG ───────────────────────────── */

const nl = (v: Partial<DauVaoSucKhoe>): DauVaoSucKhoe => ({
  ngaySinh: "1990-05-10",
  gioiTinh: "nam",
  ngayDo: "2026-11-03",
  canNangKg: 70,
  chieuCaoCm: 175,
  ...v,
});
const khuonCua = (v: DauVaoSucKhoe) => chonKhuon(v, phanTichSucKhoe(v));

describe("chọn khuôn lời khuyên", () => {
  it("theo nhóm tuổi và chỉ số", () => {
    expect(khuonCua(nl({ ngaySinh: "2024-01-01" }))).toBe("tre-nho");
    expect(khuonCua(nl({ ngaySinh: "2017-02-20" }))).toBe("tre");
    expect(khuonCua(nl({}))).toBe("nl-binh-thuong");
    expect(khuonCua(nl({ canNangKg: 50 }))).toBe("nl-nhe-can");
    expect(khuonCua(nl({ canNangKg: 85 }))).toBe("nl-can-chu-y");
  });
  it("🔴 mang thai / bệnh nền thắng mọi thứ: BMI cao vẫn KHÔNG nhận khuôn điều chỉnh cân nặng", () => {
    expect(khuonCua(nl({ canNangKg: 95, mangThaiHoacChoBu: true }))).toBe(
      "dac-biet",
    );
    expect(khuonCua(nl({ canNangKg: 95, coBenhNen: true }))).toBe("dac-biet");
  });
  it("🔴 trẻ em cân nặng cực lớn vẫn là khuôn trẻ, không bao giờ khuôn người lớn", () => {
    expect(khuonCua(nl({ ngaySinh: "2017-02-20", canNangKg: 80 }))).toBe("tre");
  });
  it("số đo vô lý ⇒ không có khuôn", () => {
    expect(khuonCua(nl({ canNangKg: 900 }))).toBeNull();
  });
});

function toanBoChu(k: (typeof KHUON_LOI_KHUYEN)[MaKhuon]): string {
  const nhom = [k.anUong, k.vanDong, k.nghiNgoi];
  return [
    k.giaiThich,
    ...k.thuThach,
    ...nhom.flatMap((g) => [
      g.tieuDe,
      g.tomTat,
      g.luuY ?? "",
      ...g.muc.map((m) => m[1]),
    ]),
  ].join(" ");
}

describe("🔴 hàng rào nội dung (ADR-010 mục 5)", () => {
  const CHU_GIAM_CAN =
    /giảm cân|giảm mỡ|ăn kiêng|hạn chế (?:calo|kcal)|đếm calo|béo phì|thừa cân/iu;
  const KHUON_DUOI_19: MaKhuon[] = ["tre-nho", "tre"];

  it.each(KHUON_DUOI_19)(
    "khuôn %s: không nói tới giảm cân, ăn kiêng hay thừa cân",
    (ma) => {
      const chu = toanBoChu(KHUON_LOI_KHUYEN[ma]);
      // Ngoại lệ DUY NHẤT: câu dặn "không cần đếm calo cho bé" — lời CẤM, không phải lời khuyên.
      const sauKhiBoCauDan = chu.replace(/Không cần đếm calo cho bé\./u, "");
      expect(sauKhiBoCauDan).not.toMatch(CHU_GIAM_CAN);
    },
  );

  it("khuôn đặc biệt (mang thai, bệnh nền) không đưa lời khuyên giảm cân và luôn nhắc bác sĩ", () => {
    // Ngoại lệ DUY NHẤT: câu CẤM tự ý ăn kiêng — lời cấm, không phải lời khuyên.
    const chu = toanBoChu(KHUON_LOI_KHUYEN["dac-biet"]).replace(
      /Không tự ý ăn kiêng/u,
      "",
    );
    expect(chu).not.toMatch(/giảm cân|ăn kiêng/iu);
    expect(chu).toMatch(/bác sĩ/iu);
  });

  it("mọi khuôn có đủ 3 nhóm và 3 thử thách", () => {
    for (const k of Object.values(KHUON_LOI_KHUYEN)) {
      expect(k.thuThach).toHaveLength(3);
      for (const g of [k.anUong, k.vanDong, k.nghiNgoi]) {
        expect(g.muc.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("khuôn giảm cân của người lớn có kèm hàng rào bác sĩ / bệnh nền", () => {
    expect(toanBoChu(KHUON_LOI_KHUYEN["nl-can-chu-y"])).toMatch(/bác sĩ/iu);
  });
});

describe("🔴 hồ sơ ký duyệt Gói C phủ ĐỦ mọi câu sẽ hiện ra (30.4)", () => {
  const hoSo = readFileSync(
    join(process.cwd(), "docs/noi-dung-cho-ky-duyet-goi-c.md"),
    "utf8",
  );
  const chuan = (s: string) =>
    s.replace(/\*\*/gu, "").replace(/\s+/gu, " ").trim();
  const hoSoChuan = chuan(hoSo);

  it("mọi mục lời khuyên, lưu ý và thử thách đều có mặt trong hồ sơ", () => {
    const thieu: string[] = [];
    for (const k of Object.values(KHUON_LOI_KHUYEN)) {
      const cau = [
        k.giaiThich,
        ...k.thuThach,
        ...[k.anUong, k.vanDong, k.nghiNgoi].flatMap((g) => [
          g.tieuDe,
          g.tomTat,
          g.luuY ?? "",
          ...g.muc.map((m) => m[1]),
        ]),
      ];
      for (const c of cau)
        if (c && !hoSoChuan.includes(chuan(c))) thieu.push(c.slice(0, 60));
    }
    expect(
      thieu,
      "chạy lại: node scripts/xuat-noi-dung-ky-duyet-goi-c.mjs",
    ).toEqual([]);
  });

  it("lời nhắn miễn trừ cũng nằm trong hồ sơ", () => {
    expect(hoSoChuan).toContain(chuan(CHU_SK.mienTru.moDau));
    for (const d of CHU_SK.mienTru.dieu) expect(hoSoChuan).toContain(chuan(d));
  });
});
