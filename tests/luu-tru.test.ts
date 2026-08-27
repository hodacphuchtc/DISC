import JSZip from "jszip";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  demBietDanh,
  docTatCa,
  luuBai,
  xoaBai,
  xoaSach,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import { saoLuuTatCa, taoNoiDungZip } from "../modules/core/luu-tru/sao-luu";

const LUC = "2026-08-27T06:30:00+07:00";

const bai = (ghiDe: Partial<BaiLamLuu> = {}): BaiLamLuu => ({
  id: `id-${Math.round(Number(ghiDe.ketThuc?.slice(-5).replace(/\D/gu, "") ?? 0))}-${ghiDe.boDe ?? "THCS"}-${ghiDe.maTre ?? "Bi"}`,
  boDe: "THCS",
  maTre: "Bi",
  nguoiTraLoi: "tre",
  batDau: "2026-08-27T06:00:00+07:00",
  ketThuc: "2026-08-27T06:08:00+07:00",
  traLoi: { "THCS-D1": 4 },
  ketQua: {
    hopLe: true,
    diem: { D: 62.5, I: 41.7, S: 33.3, C: 70.8 },
    xepHang: ["C", "D", "I", "S"],
    kieu: { loai: "don", truc: "C" },
    canhBao: [],
  },
  phienBanBoDe: "1.0",
  ...ghiDe,
});

beforeEach(async () => {
  await xoaSach();
});
afterEach(async () => {
  await xoaSach();
});

describe("kho bài đã làm", () => {
  it("lưu rồi đọc lại được", async () => {
    expect(await luuBai(bai())).toBe(true);
    const ds = await docTatCa();
    expect(ds).toHaveLength(1);
    expect(ds[0].maTre).toBe("Bi");
  });

  it("kho rỗng thì trả mảng rỗng, không nổ", async () => {
    expect(await docTatCa()).toEqual([]);
  });

  it("sắp xếp bài mới nhất lên đầu", async () => {
    await luuBai(bai({ id: "a", ketThuc: "2026-08-25T10:00:00+07:00" }));
    await luuBai(bai({ id: "b", ketThuc: "2026-08-27T10:00:00+07:00" }));
    expect((await docTatCa()).map((b) => b.id)).toEqual(["b", "a"]);
  });

  it("🔴 xoá MỘT bài không đụng bài khác", async () => {
    await luuBai(bai({ id: "a" }));
    await luuBai(bai({ id: "b", boDe: "QS" }));
    await luuBai(bai({ id: "c", boDe: "MN" }));

    await xoaBai("b");

    const con = await docTatCa();
    expect(con.map((x) => x.id).sort()).toEqual(["a", "c"]);
  });

  it("xoá sạch thì hết", async () => {
    await luuBai(bai({ id: "a" }));
    await xoaSach();
    expect(await docTatCa()).toEqual([]);
  });

  it("đếm đúng số biệt danh khác nhau — phục vụ cảnh báo máy dùng chung", async () => {
    await luuBai(bai({ id: "a", maTre: "Bi" }));
    await luuBai(bai({ id: "b", maTre: "Bi", boDe: "QS" }));
    await luuBai(bai({ id: "c", maTre: "Bống" }));
    await luuBai(bai({ id: "d", maTre: "Cún" }));
    expect(demBietDanh(await docTatCa())).toBe(3);
  });
});

describe("sao lưu .zip", () => {
  it("🔴 LẤY ĐỦ MỌI BỘ ĐỀ, không chỉ bộ đang mở", async () => {
    await luuBai(bai({ id: "a", boDe: "THCS" }));
    await luuBai(bai({ id: "b", boDe: "QS" }));
    await luuBai(bai({ id: "c", boDe: "MN" }));

    const { duLieu, soBai } = await saoLuuTatCa(LUC);
    expect(soBai).toBe(3);

    const zip = await JSZip.loadAsync(duLieu);
    const tep = Object.keys(zip.files).filter((t) => t.endsWith(".json") && t !== "ban-ke.json");
    expect(tep).toHaveLength(3);

    const banKe = JSON.parse(await zip.file("ban-ke.json")!.async("string"));
    expect([...banKe.boDe].sort()).toEqual(["MN", "QS", "THCS"]);
  });

  it("🔴 saoLuuTatCa KHÔNG nhận tham số lọc — chữ ký hàm là hàng rào", () => {
    // Đúng một tham số: thời điểm tạo. Thêm `boDe?` vào đây là mở lại cái bẫy cũ.
    expect(saoLuuTatCa).toHaveLength(1);
  });

  it("bản kê ghi đủ số bài và có dòng nhắc về dữ liệu cá nhân", async () => {
    await luuBai(bai({ id: "a" }));
    const zip = await JSZip.loadAsync((await saoLuuTatCa(LUC)).duLieu);
    const banKe = JSON.parse(await zip.file("ban-ke.json")!.async("string"));
    expect(banKe.soBai).toBe(1);
    expect(banKe.taoLuc).toBe(LUC);
    expect(banKe.ghiChu).toMatch(/dữ liệu cá nhân/u);
  });

  it("nội dung từng bài giữ nguyên vẹn sau khi nén và giải nén", async () => {
    const goc = bai({ id: "a", traLoi: { "THCS-D1": 4, "THCS-I6": 2 } });
    await luuBai(goc);
    const zip = await JSZip.loadAsync((await saoLuuTatCa(LUC)).duLieu);
    // Bỏ mục THƯ MỤC "bai/": nó cũng nằm trong zip.files nhưng zip.file() trả null.
    const ten = Object.keys(zip.files).find((t) => t.startsWith("bai/") && !zip.files[t].dir)!;
    expect(JSON.parse(await zip.file(ten)!.async("string"))).toEqual(goc);
  });

  it("🔴 trả về Uint8Array chứ KHÔNG phải Blob — chạy được cả ngoài trình duyệt", async () => {
    const { duLieu } = await saoLuuTatCa(LUC);
    expect(duLieu).toBeInstanceOf(Uint8Array);
  });

  it("kho rỗng vẫn sao lưu được, ra file chỉ có bản kê", async () => {
    const { duLieu, soBai } = await saoLuuTatCa(LUC);
    expect(soBai).toBe(0);
    const zip = await JSZip.loadAsync(duLieu);
    expect(Object.keys(zip.files).filter((t) => t.endsWith(".json"))).toEqual(["ban-ke.json"]);
  });

  it("tên tệp không lộ biệt danh ra ngoài tên file", async () => {
    await luuBai(bai({ id: "a", maTre: "Nguyễn Văn An" }));
    const zip = await JSZip.loadAsync((await saoLuuTatCa(LUC)).duLieu);
    // Kiểm cả tên đầy đủ lẫn từng thành phần có nghĩa. KHÔNG kiểm chuỗi con quá ngắn
    // như "an" — chính "ban-ke.json" cũng chứa nó.
    for (const ten of Object.keys(zip.files)) {
      const t = ten.toLowerCase();
      expect(t).not.toContain("nguyễn văn an");
      expect(t).not.toContain("nguyễn");
      expect(t).not.toContain("nguyen");
    }
  });

  it("taoNoiDungZip nhận thẳng danh sách — dùng được không cần IndexedDB", async () => {
    const duLieu = await taoNoiDungZip([bai({ id: "x" })], LUC);
    expect(duLieu).toBeInstanceOf(Uint8Array);
    expect((await JSZip.loadAsync(duLieu)).file("ban-ke.json")).not.toBeNull();
  });
});
