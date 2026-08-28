/**
 * CỬA KIỂM CỦA `16.4` — bản hợp đồng `KhoDisc` có thật sự CẮM ĐƯỢC không.
 *
 * 🔴 Vì sao cửa này là cửa quan trọng nhất của hạng mục. Viết một `type` rồi bảo *"đã tách
 * tầng"* là chuyện dễ nhất trên đời: TypeScript gật đầu, test xanh, và không có gì chứng
 * minh là đội dev app chủ cắm bản dựng của họ vào được. Chứng minh duy nhất đáng tin là
 * **dựng một bản GIẢ, lưu trong bộ nhớ, không đụng một dòng IndexedDB nào — rồi cho cả
 * sản phẩm chạy trên nó**. Bản giả cắm được thì bản gọi server cũng cắm được; đó chính là
 * điều cần chứng minh.
 *
 * 🔴 Mọi tên trong file này là BỊA.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { chonBaiPhaiXoa, chonThuMucPhaiXoa } from "../modules/core/gia-dinh/han-muc";
import type {
  CheDoXoaThanhVien,
  PhanTichGiaDinh,
  ThanhVien,
} from "../modules/core/gia-dinh/kieu";
import {
  datKho,
  khoDangDung,
  type BaiLamLuu,
  type KhoDisc,
  type NgheKhoDoi,
} from "../modules/core/luu-tru/kho-disc";
// 🔴 Nhập qua ĐÚNG những cái tên mà 13 file giao diện đang gọi. Kiểm bản giả bằng cách gọi
// thẳng vào nó thì chẳng chứng minh được gì — thứ phải chứng minh là MẶT TIỀN có thật sự
// đi qua bản dựng đang đăng ký hay không.
import {
  baiSapMat,
  docPhanTich,
  docTatCa,
  docThanhVien,
  donBaiThanhVien,
  ghiBanKhoan,
  luuBai,
  luuPhanTich,
  luuThanhVien,
  xoaBai,
  xoaSach,
  xoaSachTatCa,
  xoaThanhVien,
} from "../modules/core/luu-tru/kho-bai";

const LUC = "2026-08-28T09:00:00+07:00";

/* ── Bản dựng GIẢ: chỉ ba cái Map, không một dòng IndexedDB ───────────────── */

function taoKhoGia(): KhoDisc & { readonly soLanGhi: () => number } {
  const bang = new Map<string, BaiLamLuu>();
  const nguoi = new Map<string, ThanhVien>();
  const thuMuc = new Map<string, PhanTichGiaDinh>();
  const nghe = new Set<NgheKhoDoi>();
  let soGhi = 0;

  const bao = () => {
    soGhi += 1;
    for (const f of [...nghe]) f();
  };

  const docBai = async () =>
    [...bang.values()].sort((a, b) => b.ketThuc.localeCompare(a.ketThuc));

  const kho: KhoDisc = {
    docBai,
    luuBai: async (b) => {
      bang.set(b.id, b);
      bao();
      return true;
    },
    ghiBanKhoan: async (id, banKhoan) => {
      const b = bang.get(id);
      if (!b) return false;
      bang.set(id, { ...b, banKhoan });
      bao();
      return true;
    },
    xoaBai: async (id) => {
      bang.delete(id);
      bao();
    },
    xoaSachBai: async () => {
      bang.clear();
      bao();
    },

    docThanhVien: async () =>
      [...nguoi.values()].sort((a, b) => a.thuTu - b.thuTu || a.taoLuc.localeCompare(b.taoLuc)),
    luuThanhVien: async (tv) => {
      nguoi.set(tv.id, tv);
      bao();
      return true;
    },
    xoaThanhVien: async (id, cheDo: CheDoXoaThanhVien) => {
      for (const b of [...bang.values()].filter((x) => x.maThanhVien === id)) {
        if (cheDo === "xoa-bai") {
          bang.delete(b.id);
        } else {
          const conLai: Record<string, unknown> = { ...b };
          delete conLai.maThanhVien;
          bang.set(b.id, conLai as unknown as BaiLamLuu);
        }
      }
      nguoi.delete(id);
      bao();
    },
    xoaSachThanhVien: async () => {
      nguoi.clear();
      bao();
    },

    docPhanTich: async () =>
      [...thuMuc.values()].sort((a, b) => b.taoLuc.localeCompare(a.taoLuc)),
    luuPhanTich: async (pt) => {
      thuMuc.set(pt.id, pt);
      bao();
      return true;
    },
    xoaSachPhanTich: async () => {
      thuMuc.clear();
      bao();
    },

    xoaSachTatCa: async () => {
      bang.clear();
      nguoi.clear();
      thuMuc.clear();
      bao();
    },

    donBaiThanhVien: async (ma, gioiHan, soThem = 1) => {
      const cua = [...bang.values()].filter((b) => b.maThanhVien === ma);
      const daXoa = chonBaiPhaiXoa(cua, gioiHan, soThem).map((b) => b.id);
      for (const id of daXoa) bang.delete(id);
      if (daXoa.length > 0) bao();
      return daXoa;
    },
    baiSapMat: async (ma, gioiHan, soThem = 1) =>
      chonBaiPhaiXoa(
        [...bang.values()].filter((b) => b.maThanhVien === ma),
        gioiHan,
        soThem,
      ),
    donThuMucPhanTich: async (gioiHan, soThem = 1) => {
      const daXoa = chonThuMucPhaiXoa([...thuMuc.values()], gioiHan, soThem).map((t) => t.id);
      for (const id of daXoa) thuMuc.delete(id);
      if (daXoa.length > 0) bao();
      return daXoa;
    },
    thuMucSapMat: async (gioiHan, soThem = 1) =>
      chonThuMucPhaiXoa([...thuMuc.values()], gioiHan, soThem),

    dangKyDoiKho: (f) => {
      nghe.add(f);
      return () => nghe.delete(f);
    },
  };

  return { ...kho, soLanGhi: () => soGhi };
}

/* ── Dữ liệu bịa ──────────────────────────────────────────────────────────── */

const nguoiBia = (i: number, ten: string): ThanhVien => ({
  id: `tv-${i}`,
  ten,
  vaiTro: "con",
  lop: "7",
  thuTu: i,
  taoLuc: LUC,
  suaLuc: LUC,
});

const baiBia = (id: string, maThanhVien: string, ketThuc = LUC): BaiLamLuu => ({
  id,
  boDe: "THCS",
  maTre: "Zozo",
  maThanhVien,
  nguoiTraLoi: "tre",
  batDau: LUC,
  ketThuc,
  traLoi: { "THCS-D1": 4 },
  ketQua: {
    hopLe: true,
    diem: { D: 62.5, I: 41.7, S: 33.3, C: 70.8 },
    xepHang: ["C", "D", "I", "S"],
    kieu: { loai: "don", truc: "C" },
    canhBao: [],
  },
  phienBanBoDe: "1.0",
});

let traLai: (() => void) | null = null;
let gia: ReturnType<typeof taoKhoGia>;

beforeEach(() => {
  gia = taoKhoGia();
  traLai = datKho(gia);
});
afterEach(() => {
  traLai?.();
  traLai = null;
});

describe("🔴 bản dựng GIẢ cắm vào chạy được TRỌN luồng", () => {
  it("khai người → làm bài → đọc lại → chạy phân tích → xoá sạch", async () => {
    // Khai hai người.
    expect(await luuThanhVien(nguoiBia(0, "Zozo"))).toBe(true);
    expect(await luuThanhVien(nguoiBia(1, "Kiki"))).toBe(true);
    expect((await docThanhVien()).map((t) => t.ten)).toEqual(["Zozo", "Kiki"]);

    // Mỗi người một bài.
    await luuBai(baiBia("b0", "tv-0", "2026-08-28T08:00:00+07:00"));
    await luuBai(baiBia("b1", "tv-1", "2026-08-28T09:30:00+07:00"));
    // Mới nhất đứng đầu — luật của bản hợp đồng, bản dựng nào cũng phải giữ.
    expect((await docTatCa()).map((b) => b.id)).toEqual(["b1", "b0"]);

    // Đính băn khoăn vào bài đã lưu.
    expect(await ghiBanKhoan("b0", "lo con it noi")).toBe(true);
    expect((await docTatCa()).find((b) => b.id === "b0")?.banKhoan).toBe("lo con it noi");
    // Bài không còn thì KHÔNG được tạo mới.
    expect(await ghiBanKhoan("khong-co", "gi do")).toBe(false);

    // Lưu một thư mục phân tích.
    await luuPhanTich({ id: "pt-1", taoLuc: LUC, noiDung: [] } as unknown as PhanTichGiaDinh);
    expect(await docPhanTich()).toHaveLength(1);

    // Xoá sạch dọn CẢ BA bảng.
    await xoaSachTatCa();
    expect(await docTatCa()).toEqual([]);
    expect(await docThanhVien()).toEqual([]);
    expect(await docPhanTich()).toEqual([]);
  });

  it("🔴 KHÔNG một dòng nào chạm IndexedDB — bản giả nhận trọn lưu lượng", async () => {
    const doThamIdb = vi.fn();
    const goc = globalThis.indexedDB;
    Object.defineProperty(globalThis, "indexedDB", {
      configurable: true,
      get() {
        doThamIdb();
        return goc;
      },
    });
    try {
      await luuThanhVien(nguoiBia(0, "Zozo"));
      await luuBai(baiBia("b0", "tv-0"));
      await docTatCa();
      await xoaSachTatCa();
    } finally {
      // 🔴 Phải trả lại. Vá lên globalThis mà quên gỡ thì bản vá sống sang mọi file test
      // chạy sau — đã trả giá 28/08/2026 với `Element.prototype`.
      Object.defineProperty(globalThis, "indexedDB", { configurable: true, value: goc });
    }
    expect(doThamIdb).not.toHaveBeenCalled();
  });

  it("xoá người có bài: giữ bài thì bài rơi về 'chưa xếp', không mất", async () => {
    await luuThanhVien(nguoiBia(0, "Zozo"));
    await luuBai(baiBia("b0", "tv-0"));
    await xoaThanhVien("tv-0", "giu-bai");

    expect(await docThanhVien()).toEqual([]);
    const conLai = await docTatCa();
    expect(conLai).toHaveLength(1);
    expect(conLai[0].maThanhVien).toBeUndefined();
  });

  it("hạn mức: hỏi trước bằng baiSapMat, rồi dọn bằng donBaiThanhVien", async () => {
    await luuThanhVien(nguoiBia(0, "Zozo"));
    await luuBai(baiBia("b0", "tv-0", "2026-08-20T08:00:00+07:00"));
    await luuBai(baiBia("b1", "tv-0", "2026-08-24T08:00:00+07:00"));

    // Chỉ ĐỌC — không được đụng vào kho.
    const sapMat = await baiSapMat("tv-0", 2);
    expect(await docTatCa()).toHaveLength(2);
    expect(sapMat.map((b) => b.id)).toEqual(["b0"]);

    expect(await donBaiThanhVien("tv-0", 2)).toEqual(["b0"]);
    expect((await docTatCa()).map((b) => b.id)).toEqual(["b1"]);
  });

  it("báo đổi vẫn chạy trên bản giả — giao diện không cần biết mình đang cắm vào đâu", async () => {
    const nghe = vi.fn();
    const huy = khoDangDung().dangKyDoiKho(nghe);
    await luuBai(baiBia("b0", "tv-0"));
    expect(nghe).toHaveBeenCalledTimes(1);
    huy();
    await xoaBai("b0");
    expect(nghe).toHaveBeenCalledTimes(1);
  });
});

describe("cắm vào rồi rút ra", () => {
  it("datKho() trả về hàm khôi phục bản dựng cũ", async () => {
    const khac = taoKhoGia();
    const veCu = datKho(khac);
    await luuBai(baiBia("chi-o-ban-khac", "tv-0"));
    expect(await docTatCa()).toHaveLength(1);

    veCu();
    // Bản giả của beforeEach chưa hề thấy bài đó.
    expect(await docTatCa()).toEqual([]);
  });

  it("🔴 mặt tiền đi qua bản dựng ĐANG ĐĂNG KÝ, không ghim vào bản mặc định", async () => {
    await luuBai(baiBia("b0", "tv-0"));
    await xoaSach();
    // Nếu mặt tiền còn trỏ cứng vào IndexedDB thì bộ đếm của bản giả sẽ đứng im.
    expect(gia.soLanGhi()).toBeGreaterThan(0);
  });
});
