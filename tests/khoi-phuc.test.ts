/**
 * CỬA KIỂM CỦA `16.5` — sổ `.zip` phải NẠP LẠI ĐƯỢC.
 *
 * 🔴 Vì sao hạng mục này xếp vào nhóm rủi ro cao. Nút *Sao lưu* có từ lâu, nhưng
 * `JSZip.loadAsync` chưa từng xuất hiện ngoài test — người dùng bấm sao lưu, yên tâm, rồi
 * mất máy là mất sổ. Và khi mở ra sửa thì lộ thêm một lỗi thứ hai, nặng hơn: bản sao lưu
 * **chỉ chứa bảng BÀI**, không chứa tên từng người lẫn các bản phân tích — cùng một họ
 * hàng với lỗi nút *Xoá sạch* dọn thiếu hai phần ba dữ liệu.
 *
 * 🔴 Mọi tên là BỊA.
 */

import JSZip from "jszip";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { PhanTichGiaDinh, ThanhVien } from "../modules/core/gia-dinh/kieu";
import { docTuZip, ghiDeKho } from "../modules/core/luu-tru/khoi-phuc";
import {
  docPhanTich,
  docTatCa,
  docThanhVien,
  luuBai,
  luuPhanTich,
  luuThanhVien,
  xoaSachTatCa,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import {
  TEP_PHAN_TICH,
  TEP_THANH_VIEN,
  saoLuuTatCa,
  taoNoiDungZip,
} from "../modules/core/luu-tru/sao-luu";

const LUC = "2026-08-28T09:00:00+07:00";

const nguoi = (i: number, ten: string): ThanhVien => ({
  id: `tv-${i}`,
  ten,
  vaiTro: i === 0 ? "me" : "con",
  ...(i === 0 ? {} : { lop: "7" }),
  thuTu: i,
  taoLuc: LUC,
  suaLuc: LUC,
});

const bai = (id: string, maThanhVien: string): BaiLamLuu => ({
  id,
  boDe: "THCS",
  maTre: "Zozo",
  maThanhVien,
  nguoiTraLoi: "tre",
  batDau: LUC,
  ketThuc: LUC,
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

const thuMuc = (id: string): PhanTichGiaDinh => ({
  id,
  maBai: ["b0", "b1"],
  taoLuc: LUC,
  noiDung: [],
});

/** Dựng một nhà ba người, mỗi người một bài, cộng một thư mục phân tích. */
async function dungNhaBaNguoi() {
  for (const [i, ten] of [[0, "Zozo"], [1, "Kiki"], [2, "Momo"]] as const) {
    await luuThanhVien(nguoi(i, ten));
    await luuBai(bai(`b${i}`, `tv-${i}`));
  }
  await luuPhanTich(thuMuc("pt-1"));
}

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  await xoaSachTatCa();
});

describe("🔴 khứ hồi: sao lưu → xoá sạch → khôi phục", () => {
  it("ba người và mọi bài quay về ĐỦ, kể cả bản phân tích", async () => {
    await dungNhaBaNguoi();
    const { duLieu } = await saoLuuTatCa(LUC);

    await xoaSachTatCa();
    expect(await docThanhVien()).toEqual([]);
    expect(await docTatCa()).toEqual([]);

    const kq = await docTuZip(duLieu);
    expect(kq.ok).toBe(true);
    if (!kq.ok) return;
    expect(kq.so.thanhVien).toHaveLength(3);
    expect(kq.so.bai).toHaveLength(3);
    expect(kq.so.phanTich).toHaveLength(1);
    expect(kq.so.banCu).toBe(false);

    await ghiDeKho(kq.so);
    expect((await docThanhVien()).map((t) => t.ten)).toEqual(["Zozo", "Kiki", "Momo"]);
    expect(await docTatCa()).toHaveLength(3);
    expect(await docPhanTich()).toHaveLength(1);
  });

  it("🔴 bài vẫn còn KHOÁ tới đúng người — khôi phục mà đứt khoá thì bài thành mồ côi", async () => {
    await dungNhaBaNguoi();
    const { duLieu } = await saoLuuTatCa(LUC);
    await xoaSachTatCa();

    const kq = await docTuZip(duLieu);
    if (!kq.ok) throw new Error("phải đọc được");
    await ghiDeKho(kq.so);

    const ds = await docTatCa();
    for (const b of ds) {
      expect(b.maThanhVien, `bài ${b.id} mất khoá`).toBeTruthy();
    }
    expect(new Set(ds.map((b) => b.maThanhVien))).toEqual(
      new Set(["tv-0", "tv-1", "tv-2"]),
    );
  });

  it("khôi phục là THAY, không phải nhập thêm — không đẻ ra người trùng", async () => {
    await dungNhaBaNguoi();
    const { duLieu } = await saoLuuTatCa(LUC);

    // KHÔNG xoá sạch: khôi phục đè lên một sổ đang có đủ ba người.
    const kq = await docTuZip(duLieu);
    if (!kq.ok) throw new Error("phải đọc được");
    await ghiDeKho(kq.so);

    expect(await docThanhVien()).toHaveLength(3);
    expect(await docTatCa()).toHaveLength(3);
  });
});

describe("🔴 tệp lạ thì BÁO LỖI RÕ và KHÔNG đụng vào kho", () => {
  it("một .zip bất kỳ (không phải sổ DISC) ⇒ từ chối, dữ liệu còn nguyên", async () => {
    await dungNhaBaNguoi();

    const la = new JSZip();
    la.file("anh.txt", "day khong phai so DISC");
    const kq = await docTuZip(await la.generateAsync({ type: "uint8array" }));

    expect(kq.ok).toBe(false);
    if (kq.ok) return;
    expect(kq.loi).toBe("khong-phai-so-disc");
    // 🔴 Điều quan trọng nhất của cả hạng mục: KHÔNG mất gì.
    expect(await docThanhVien()).toHaveLength(3);
    expect(await docTatCa()).toHaveLength(3);
  });

  it("tệp không phải .zip ⇒ nói không mở được, không nổ", async () => {
    await dungNhaBaNguoi();
    const rac = new TextEncoder().encode("day chi la mot chuoi chu");
    const kq = await docTuZip(rac);

    expect(kq.ok).toBe(false);
    if (!kq.ok) expect(kq.loi).toBe("khong-mo-duoc");
    expect(await docThanhVien()).toHaveLength(3);
  });

  it("thiếu trường bắt buộc ⇒ nói rõ tệp nào hỏng, KHÔNG ghi nửa vời", async () => {
    await dungNhaBaNguoi();

    const hong = new JSZip();
    hong.file("ban-ke.json", JSON.stringify({ phienBanSaoLuu: 2, taoLuc: LUC }));
    // Một thành viên thiếu `ten` — giao diện sẽ vẽ ra một thẻ trống không ai nhận ra.
    hong.file(TEP_THANH_VIEN, JSON.stringify([{ id: "tv-x", vaiTro: "con", thuTu: 0 }]));
    hong.file(TEP_PHAN_TICH, JSON.stringify([]));
    const kq = await docTuZip(await hong.generateAsync({ type: "uint8array" }));

    expect(kq.ok).toBe(false);
    if (!kq.ok) {
      expect(kq.loi).toBe("du-lieu-hong");
      expect(kq.chiTiet).toBe(TEP_THANH_VIEN);
    }
    expect(await docThanhVien()).toHaveLength(3);
  });
});

describe("bản sao lưu ĐỜI CŨ (v1, chỉ có bài)", () => {
  it("vẫn nạp được, và tự nói ra rằng nó không mang tên ai", async () => {
    // Dựng đúng hình dạng bản v1: ban-ke + bai/, KHÔNG có thư mục du-lieu.
    const cu = new JSZip();
    cu.file("ban-ke.json", JSON.stringify({ phienBanSaoLuu: 1, taoLuc: LUC, soBai: 1 }));
    cu.file("bai/001-THCS-2026-08-28.json", JSON.stringify(bai("b-cu", "tv-0")));

    const kq = await docTuZip(await cu.generateAsync({ type: "uint8array" }));
    expect(kq.ok).toBe(true);
    if (!kq.ok) return;
    expect(kq.so.banCu).toBe(true);
    expect(kq.so.bai).toHaveLength(1);
    expect(kq.so.thanhVien).toEqual([]);
  });
});

describe("🔴 sao lưu phải CHỨA cả ba bảng — lỗi mất dữ liệu vừa vá", () => {
  it("tệp .zip có đủ ban-ke, bai/, và hai tệp du-lieu/", async () => {
    await dungNhaBaNguoi();
    const { duLieu, soBai, soThanhVien } = await saoLuuTatCa(LUC);
    expect(soBai).toBe(3);
    expect(soThanhVien).toBe(3);

    const zip = await JSZip.loadAsync(duLieu);
    expect(zip.file("ban-ke.json")).toBeTruthy();
    expect(zip.file(TEP_THANH_VIEN), "sao lưu thiếu bảng thành viên").toBeTruthy();
    expect(zip.file(TEP_PHAN_TICH), "sao lưu thiếu bảng phân tích").toBeTruthy();

    const banKe = JSON.parse(await zip.file("ban-ke.json")!.async("string"));
    expect(banKe.phienBanSaoLuu).toBe(2);
    expect(banKe.soThanhVien).toBe(3);
  });

  it("🔴 nhà chưa khai ai thì hai tệp vẫn PHẢI có mặt, chỉ là rỗng", async () => {
    const duLieu = await taoNoiDungZip([], LUC, [], []);
    const zip = await JSZip.loadAsync(duLieu);
    // "vắng mặt" và "có mà rỗng" là hai chuyện khác nhau lúc khôi phục: một cái nghĩa là
    // bản đời cũ, cái kia nghĩa là nhà chưa khai ai.
    expect(zip.file(TEP_THANH_VIEN)).toBeTruthy();
    const kq = await docTuZip(duLieu);
    expect(kq.ok).toBe(true);
    if (kq.ok) expect(kq.so.banCu).toBe(false);
  });
});
