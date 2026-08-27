import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  BANG_THANH_VIEN,
  TEN_BANG,
  TEN_KHO,
  daNhanNuoi,
  docTatCa,
  docPhanTich,
  docThanhVien,
  donThuMucPhanTich,
  luuBai,
  luuPhanTich,
  luuThanhVien,
  nhanNuoiBaiCu,
  nhanNuoiNeuCan,
  thuMucSapMat,
  xoaSach,
  xoaSachThanhVien,
  xoaThanhVien,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";

/**
 * 🔴 RỦI RO CAO NHẤT CỦA CẢ GÓI GĐ11–GĐ14: MẤT DỮ LIỆU NGƯỜI DÙNG.
 *
 * Nâng kho từ v1 lên v2 là lúc duy nhất bài của người ta có thể biến mất hàng loạt. Cả
 * file này chỉ hỏi một câu, hỏi bằng nhiều cách: **có bài nào mất không.**
 *
 * Hai luật thiết kế mà test này canh:
 *  1. `onupgradeneeded` CHỈ tạo bảng và index — không đọc–ghi lại bài cũ ở đó. Viết lại
 *     cả bảng trong transaction `versionchange` mà abort là mất trắng.
 *  2. Việc gán bài cũ về thành viên làm LƯỜI, ở transaction thường, và **chạy lại được
 *     không hỏng gì**. Mốc trong localStorage chỉ để đỡ tốn công, không phải để đảm bảo
 *     tính đúng — mất mốc thì chạy lại vẫn ra đúng kết quả.
 *
 * 🔴 Mọi tên trong file này là BỊA.
 */

const LUC = "2026-08-27T06:30:00+07:00";

let dem = 0;
const bai = (ghiDe: Partial<BaiLamLuu> = {}): BaiLamLuu => {
  dem += 1;
  return {
    id: `bai-${dem}`,
    boDe: "THCS",
    maTre: "Zozo",
    nguoiTraLoi: "tre",
    batDau: "2026-08-27T06:00:00+07:00",
    ketThuc: `2026-08-27T06:${String(dem).padStart(2, "0")}:00+07:00`,
    traLoi: { "THCS-D1": 4 },
    ketQua: {
      hopLe: true,
      diem: { D: 62.5, I: 41.7, S: 33.3, C: 70.8 },
      xepHang: ["C", "D", "I", "S"],
      kieu: { loai: "don", truc: "C" },
      canhBao: [],
    },
    phienBanBoDe: "1.1",
    ...ghiDe,
  };
};

async function donSach() {
  await xoaSach();
  await xoaSachThanhVien();
  for (const t of await docPhanTich()) await donThuMucPhanTich(0, 0).catch(() => void t);
  window.localStorage.clear();
}

beforeEach(donSach);
afterEach(donSach);

describe("🔴 kho v2 — ba bảng, không mất bảng cũ", () => {
  it("mở được và có đủ ba bảng", async () => {
    await luuBai(bai());
    const db = await new Promise<IDBDatabase>((ok) => {
      const yc = indexedDB.open(TEN_KHO);
      yc.onsuccess = () => ok(yc.result);
    });
    expect(db.version).toBe(2);
    expect([...db.objectStoreNames].sort()).toEqual([
      "bai-lam",
      "phan-tich-gia-dinh",
      "thanh-vien",
    ]);
    db.close();
  });

  it("bảng bài làm giữ nguyên tên và có index maThanhVien mới", async () => {
    await luuBai(bai());
    const db = await new Promise<IDBDatabase>((ok) => {
      const yc = indexedDB.open(TEN_KHO);
      yc.onsuccess = () => ok(yc.result);
    });
    const bang = db.transaction(TEN_BANG, "readonly").objectStore(TEN_BANG);
    expect([...bang.indexNames].sort()).toEqual(["ketThuc", "maThanhVien", "maTre"]);
    db.close();
  });
});

describe("🔴 nhận nuôi bài cũ — KHÔNG mất một bài nào", () => {
  it("ba bài ba tên ⇒ ba thành viên, và vẫn đủ ba bài", async () => {
    await luuBai(bai({ maTre: "Zozo" }));
    await luuBai(bai({ maTre: "Kiki" }));
    await luuBai(bai({ maTre: "Mimi" }));

    const themMoi = await nhanNuoiBaiCu(LUC);

    expect(themMoi).toBe(3);
    expect(await docTatCa()).toHaveLength(3);
    expect((await docThanhVien()).map((t) => t.ten).sort()).toEqual(["Kiki", "Mimi", "Zozo"]);
  });

  it("một tên làm nhiều bài ⇒ MỘT thành viên, mọi bài trỏ về đúng người đó", async () => {
    await luuBai(bai({ maTre: "Zozo" }));
    await luuBai(bai({ maTre: "Zozo" }));

    await nhanNuoiBaiCu(LUC);

    const tv = await docThanhVien();
    expect(tv).toHaveLength(1);
    const ds = await docTatCa();
    expect(ds).toHaveLength(2);
    expect(ds.every((b) => b.maThanhVien === tv[0].id)).toBe(true);
  });

  it("🔴 gom theo tên KHÔNG phân biệt hoa thường và khoảng trắng thừa", async () => {
    await luuBai(bai({ maTre: "Zozo" }));
    await luuBai(bai({ maTre: " zozo " }));

    await nhanNuoiBaiCu(LUC);

    expect(await docThanhVien()).toHaveLength(1);
    expect(await docTatCa()).toHaveLength(2);
  });

  it("🔴 CHẠY LẠI KHÔNG ĐẺ THÊM AI, không mất bài nào (idempotent)", async () => {
    await luuBai(bai({ maTre: "Zozo" }));
    await luuBai(bai({ maTre: "Kiki" }));

    await nhanNuoiBaiCu(LUC);
    await nhanNuoiBaiCu(LUC);
    await nhanNuoiBaiCu(LUC);

    expect(await docThanhVien()).toHaveLength(2);
    expect(await docTatCa()).toHaveLength(2);
  });

  it("mất mốc trong localStorage cũng không sao — chạy lại vẫn ra đúng", async () => {
    await luuBai(bai({ maTre: "Zozo" }));
    await nhanNuoiBaiCu(LUC);

    window.localStorage.clear();
    expect(daNhanNuoi()).toBe(false);

    await nhanNuoiNeuCan(LUC);
    expect(await docThanhVien()).toHaveLength(1);
    expect(await docTatCa()).toHaveLength(1);
  });

  it("bài đã có thành viên thì để yên, không gán lại", async () => {
    await luuThanhVien({
      id: "tv-co-san",
      ten: "Zozo",
      vaiTro: "con",
      thuTu: 0,
      taoLuc: LUC,
      suaLuc: LUC,
    });
    await luuBai(bai({ maTre: "Zozo", maThanhVien: "tv-co-san" }));

    const themMoi = await nhanNuoiBaiCu(LUC);

    expect(themMoi).toBe(0);
    expect(await docThanhVien()).toHaveLength(1);
    expect((await docTatCa())[0].maThanhVien).toBe("tv-co-san");
  });

  it("dùng lại thành viên ĐÃ CÓ nếu trùng tên, không dựng bản sao", async () => {
    await luuThanhVien({
      id: "tv-co-san",
      ten: "Zozo",
      vaiTro: "con",
      thuTu: 0,
      taoLuc: LUC,
      suaLuc: LUC,
    });
    await luuBai(bai({ maTre: "Zozo" }));

    await nhanNuoiBaiCu(LUC);

    expect(await docThanhVien()).toHaveLength(1);
    expect((await docTatCa())[0].maThanhVien).toBe("tv-co-san");
  });

  it("🔴 KHÔNG đoán vai — bài cũ không có thông tin đó", async () => {
    // Đoán rồi ghi như thể đã hỏi chính là bịa dữ liệu. Người dùng sửa vai trên bảng.
    await luuBai(bai({ maTre: "Zozo" }));
    await nhanNuoiBaiCu(LUC);
    expect((await docThanhVien())[0].vaiTro).toBe("khac");
  });

  it("giữ lại lớp và tuổi nếu bài cũ có, không bịa nếu không có", async () => {
    await luuBai(bai({ maTre: "Zozo", lop: "7" }));
    await luuBai(bai({ maTre: "Kiki" }));
    await nhanNuoiBaiCu(LUC);

    const tv = await docThanhVien();
    expect(tv.find((t) => t.ten === "Zozo")?.lop).toBe("7");
    expect(tv.find((t) => t.ten === "Kiki")?.lop).toBeUndefined();
    expect(tv.find((t) => t.ten === "Kiki")?.tuoi).toBeUndefined();
  });

  it("kho rỗng thì đánh dấu xong luôn, không nổ", async () => {
    expect(await nhanNuoiBaiCu(LUC)).toBe(0);
    expect(daNhanNuoi()).toBe(true);
  });
});

describe("🔴 xoá thành viên — chế độ BẮT BUỘC nói ra", () => {
  it("giữ bài: người biến mất, bài rơi về 'chưa xếp' và VẪN CÒN", async () => {
    await luuBai(bai({ maTre: "Zozo" }));
    await nhanNuoiBaiCu(LUC);
    const tv = (await docThanhVien())[0];

    await xoaThanhVien(tv.id, "giu-bai");

    expect(await docThanhVien()).toHaveLength(0);
    const ds = await docTatCa();
    expect(ds, "🔴 xoá người mà mất bài là đường mất dữ liệu nhanh nhất").toHaveLength(1);
    expect(ds[0].maThanhVien).toBeUndefined();
  });

  it("bài rơi về 'chưa xếp' thì XẾP LẠI ĐƯỢC cho người mới", async () => {
    await luuBai(bai({ maTre: "Zozo" }));
    await nhanNuoiBaiCu(LUC);
    const cu = (await docThanhVien())[0];
    await xoaThanhVien(cu.id, "giu-bai");

    // Thêm lại người đó rồi chạy nhận nuôi — bài chưa xếp phải về đúng chỗ.
    window.localStorage.clear();
    await nhanNuoiBaiCu(LUC);

    const moi = await docThanhVien();
    expect(moi).toHaveLength(1);
    expect((await docTatCa())[0].maThanhVien).toBe(moi[0].id);
  });

  it("xoá bài: chọn rõ ràng thì mới mất, và chỉ mất bài của ĐÚNG người đó", async () => {
    await luuBai(bai({ maTre: "Zozo" }));
    await luuBai(bai({ maTre: "Kiki" }));
    await nhanNuoiBaiCu(LUC);
    const tv = (await docThanhVien()).find((t) => t.ten === "Zozo")!;

    await xoaThanhVien(tv.id, "xoa-bai");

    const ds = await docTatCa();
    expect(ds).toHaveLength(1);
    expect(ds[0].maTre).toBe("Kiki");
  });

  it("bảng thành viên có index thuTu để xếp hàng trên bảng gia đình", async () => {
    await luuBai(bai());
    const db = await new Promise<IDBDatabase>((ok) => {
      const yc = indexedDB.open(TEN_KHO);
      yc.onsuccess = () => ok(yc.result);
    });
    const bang = db.transaction(BANG_THANH_VIEN, "readonly").objectStore(BANG_THANH_VIEN);
    expect([...bang.indexNames]).toContain("thuTu");
    db.close();
  });
});

describe("🔴🔴 NÂNG THẬT TỪ v1 LÊN v2 — cửa kiểm đắt nhất của 12.1", () => {
  /**
   * Mọi test bên trên đều bắt đầu ở kho v2, nên chúng KHÔNG chạm vào rủi ro thật: cuộc
   * nâng cấp. Ở đây kho v1 được dựng bằng tay, đúng hình dạng nó đã có ngoài đời từ GĐ0,
   * nạp dữ liệu vào, rồi mới mở bằng mã v2.
   *
   * Đây là mô phỏng gần nhất với chuyện sẽ xảy ra trên máy của một phụ huynh thật vào
   * sáng mai. Nếu có chỗ nào làm mất bài, nó lộ ra ở đây.
   */

  /** Dựng đúng kho v1 như bản GĐ0: một bảng, hai index, không có gì khác. */
  async function dungKhoV1(banGhi: readonly BaiLamLuu[]): Promise<void> {
    await new Promise<void>((xong) => {
      const yc = indexedDB.open(TEN_KHO, 1);
      yc.onupgradeneeded = () => {
        const db = yc.result;
        const bang = db.createObjectStore(TEN_BANG, { keyPath: "id" });
        bang.createIndex("maTre", "maTre", { unique: false });
        bang.createIndex("ketThuc", "ketThuc", { unique: false });
      };
      yc.onsuccess = () => {
        const db = yc.result;
        const gd = db.transaction(TEN_BANG, "readwrite");
        for (const b of banGhi) gd.objectStore(TEN_BANG).put(b);
        gd.oncomplete = () => {
          db.close();
          xong();
        };
      };
    });
  }

  async function xoaKhoHan(): Promise<void> {
    await new Promise<void>((xong) => {
      const yc = indexedDB.deleteDatabase(TEN_KHO);
      yc.onsuccess = () => xong();
      yc.onerror = () => xong();
      yc.onblocked = () => xong();
    });
  }

  beforeEach(xoaKhoHan);
  afterEach(xoaKhoHan);

  it("🔴 nâng v1 → v2: KHÔNG MẤT MỘT BÀI NÀO, và giữ nguyên từng trường", async () => {
    const cu = [
      bai({ id: "cu-1", maTre: "Zozo", lop: "7" }),
      bai({ id: "cu-2", maTre: "Kiki" }),
      bai({ id: "cu-3", maTre: "Zozo", banKhoan: "hay-cau" }),
    ];
    await dungKhoV1(cu);

    // Lời gọi đầu tiên bằng mã v2 chính là thứ kích hoạt onupgradeneeded.
    const sau = await docTatCa();

    expect(sau, "🔴 MẤT BÀI khi nâng kho — dừng lại, đừng phát hành").toHaveLength(3);
    for (const b of cu) {
      const con = sau.find((x) => x.id === b.id);
      expect(con, `mất bài ${b.id}`).toBeTruthy();
      expect(con?.traLoi).toEqual(b.traLoi);
      expect(con?.ketQua).toEqual(b.ketQua);
      expect(con?.maTre).toBe(b.maTre);
    }
    expect(sau.find((x) => x.id === "cu-1")?.lop).toBe("7");
    expect(sau.find((x) => x.id === "cu-3")?.banKhoan).toBe("hay-cau");
  });

  it("🔴 nâng xong rồi nhận nuôi: 3 bài của 2 tên ⇒ 2 thành viên, vẫn đủ 3 bài", async () => {
    await dungKhoV1([
      bai({ id: "cu-1", maTre: "Zozo" }),
      bai({ id: "cu-2", maTre: "Kiki" }),
      bai({ id: "cu-3", maTre: "Zozo" }),
    ]);

    await nhanNuoiNeuCan(LUC);

    const tv = await docThanhVien();
    const ds = await docTatCa();
    expect(tv).toHaveLength(2);
    expect(ds).toHaveLength(3);
    expect(ds.every((b) => b.maThanhVien), "còn bài chưa được xếp về ai").toBeTruthy();
  });

  it("bảng mới rỗng sau khi nâng, không có bản ghi ma", async () => {
    await dungKhoV1([bai({ id: "cu-1" })]);
    expect(await docThanhVien()).toHaveLength(0);
  });
});

describe("🔴 14.5 — thi hành hạn mức thư mục trên kho thật", () => {
  const pt = (id: string, taoLuc: string) => ({ id, maBai: ["b1", "b2"], taoLuc, noiDung: {} });

  it("chưa đầy thì dọn xong không mất gì", async () => {
    await luuPhanTich(pt("t1", "2026-01-01T00:00:00Z"));
    expect(await donThuMucPhanTich(5)).toEqual([]);
    expect(await docPhanTich()).toHaveLength(1);
  });

  it("🔴 đủ 5 rồi ⇒ dọn đúng cái cũ nhất, còn lại 4", async () => {
    for (let i = 1; i <= 5; i += 1) {
      await luuPhanTich(pt(`t${i}`, `2026-0${i}-01T00:00:00Z`));
    }
    const daXoa = await donThuMucPhanTich(5);

    expect(daXoa).toEqual(["t1"]);
    const con = await docPhanTich();
    expect(con).toHaveLength(4);
    expect(con.map((t) => t.id).sort()).toEqual(["t2", "t3", "t4", "t5"]);
  });

  it("thuMucSapMat CHỈ ĐỌC — gọi xong không mất gì", async () => {
    for (let i = 1; i <= 5; i += 1) {
      await luuPhanTich(pt(`t${i}`, `2026-0${i}-01T00:00:00Z`));
    }
    const sap = await thuMucSapMat(5);
    expect(sap.map((t) => t.id)).toEqual(["t1"]);
    expect(await docPhanTich(), "thuMucSapMat mà xoá thì nó không còn là 'chỉ đọc'").toHaveLength(5);
  });

  it("bản phân tích đọc lại được nguyên vẹn — dienGiai lưu MÃ, không lưu chuỗi dựng sẵn", async () => {
    await luuPhanTich({
      id: "t1",
      maBai: ["b-me", "b-bin"],
      taoLuc: "2026-01-01T00:00:00Z",
      noiDung: [{ toiId: "me", tenLuc: "Mẹ Lan", latCat: [] }],
    });
    const doc = await docPhanTich();
    expect(doc[0].maBai).toEqual(["b-me", "b-bin"]);
    expect((doc[0].noiDung as { tenLuc: string }[])[0].tenLuc).toBe("Mẹ Lan");
  });
});
