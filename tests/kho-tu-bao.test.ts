/**
 * CỬA KIỂM CỦA `16.1` — kho phải tự báo mọi thay đổi, KỂ CẢ trong cùng một tab.
 *
 * 🔴 Vì sao cửa này tồn tại. Bản cũ báo bằng `BroadcastChannel.postMessage` — mà spec loại
 * trừ chính ngữ cảnh đã đăng tin. Nên tab người dùng đang nhìn không bao giờ nghe thấy
 * thay đổi do chính nó gây ra: làm xong bài, bấm quay lại, thẻ vẫn hiện số cũ tới khi F5.
 * Test dưới đây đứng ở phía NGƯỜI ĐĂNG KÝ TRONG CÙNG TAB, đúng chỗ lỗi từng lọt qua.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  baoDoi,
  dangKyDoiKho,
  ghiBanKhoan,
  luuBai,
  luuPhanTich,
  luuThanhVien,
  xoaBai,
  xoaSach,
  xoaSachPhanTich,
  xoaSachTatCa,
  xoaSachThanhVien,
  xoaThanhVien,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import type { PhanTichGiaDinh, ThanhVien } from "../modules/core/gia-dinh/kieu";

const LUC = "2026-08-28T09:00:00+07:00";

const bai = (ghiDe: Partial<BaiLamLuu> = {}): BaiLamLuu => ({
  id: "bai-1",
  boDe: "THCS",
  maTre: "Zozo",
  nguoiTraLoi: "tre",
  batDau: "2026-08-28T08:00:00+07:00",
  ketThuc: "2026-08-28T08:08:00+07:00",
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

const nguoi = (ghiDe: Partial<ThanhVien> = {}): ThanhVien => ({
  id: "tv-1",
  ten: "Zozo",
  vaiTro: "con",
  lop: "7",
  thuTu: 0,
  taoLuc: LUC,
  suaLuc: LUC,
  ...ghiDe,
});

const thuMuc = (ghiDe: Partial<PhanTichGiaDinh> = {}): PhanTichGiaDinh => ({
  id: "pt-1",
  taoLuc: LUC,
  nguoi: [],
  ...ghiDe,
}) as PhanTichGiaDinh;

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  await xoaSachTatCa();
});

describe("kho tự báo — người đăng ký trong CÙNG tab", () => {
  it("mỗi lệnh ghi gọi người đăng ký đúng MỘT lần", async () => {
    const cac: Array<[string, () => Promise<unknown>]> = [
      ["luuBai", () => luuBai(bai())],
      ["ghiBanKhoan", () => ghiBanKhoan("bai-1", "lo con it noi")],
      ["xoaBai", () => xoaBai("bai-1")],
      ["luuThanhVien", () => luuThanhVien(nguoi())],
      ["luuPhanTich", () => luuPhanTich(thuMuc())],
      ["xoaSach", () => xoaSach()],
      ["xoaSachThanhVien", () => xoaSachThanhVien()],
      ["xoaSachPhanTich", () => xoaSachPhanTich()],
    ];

    for (const [ten, chay] of cac) {
      const nghe = vi.fn();
      const huy = dangKyDoiKho(nghe);
      await chay();
      huy();
      expect(nghe, `${ten} phải báo đúng một lần`).toHaveBeenCalledTimes(1);
    }
  });

  it("lệnh ghi GỘP nhiều bảng vẫn chỉ báo MỘT lần, không phải mỗi bảng một lần", async () => {
    await luuBai(bai());
    await luuThanhVien(nguoi());
    await luuPhanTich(thuMuc());

    const nghe = vi.fn();
    const huy = dangKyDoiKho(nghe);
    await xoaSachTatCa();
    huy();

    // Ba bảng bị dọn, nhưng người dùng chỉ bấm MỘT nút.
    expect(nghe).toHaveBeenCalledTimes(1);
  });

  it("xoá một thành viên có nhiều bài cũng chỉ báo MỘT lần", async () => {
    await luuThanhVien(nguoi());
    await luuBai(bai({ id: "b1", maThanhVien: "tv-1" }));
    await luuBai(bai({ id: "b2", maThanhVien: "tv-1" }));
    await luuBai(bai({ id: "b3", maThanhVien: "tv-1" }));

    const nghe = vi.fn();
    const huy = dangKyDoiKho(nghe);
    await xoaThanhVien("tv-1", "xoa-bai");
    huy();

    expect(nghe).toHaveBeenCalledTimes(1);
  });

  it("huỷ đăng ký thì thôi nhận", async () => {
    const nghe = vi.fn();
    const huy = dangKyDoiKho(nghe);
    await luuBai(bai());
    expect(nghe).toHaveBeenCalledTimes(1);

    huy();
    await luuBai(bai({ id: "bai-2" }));
    expect(nghe).toHaveBeenCalledTimes(1);
  });

  it("nhiều người nghe cùng lúc thì ai cũng được gọi", async () => {
    const a = vi.fn();
    const b = vi.fn();
    const huyA = dangKyDoiKho(a);
    const huyB = dangKyDoiKho(b);
    await luuBai(bai());
    huyA();
    huyB();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("một người nghe ném lỗi KHÔNG kéo theo những người còn lại", async () => {
    const hong = vi.fn(() => {
      throw new Error("mot component vua go giua chung");
    });
    const lanh = vi.fn();
    const huy1 = dangKyDoiKho(hong);
    const huy2 = dangKyDoiKho(lanh);

    await expect(luuBai(bai())).resolves.toBe(true);
    huy1();
    huy2();
    expect(lanh).toHaveBeenCalledTimes(1);
  });

  it("KHÔNG có BroadcastChannel (trình duyệt cũ) vẫn báo được trong tab", async () => {
    const gocBC = globalThis.BroadcastChannel;
    // @ts-expect-error — cố ý gỡ hẳn để giả lập trình duyệt cũ.
    delete globalThis.BroadcastChannel;
    try {
      const nghe = vi.fn();
      const huy = dangKyDoiKho(nghe);
      await luuBai(bai());
      huy();
      expect(nghe).toHaveBeenCalledTimes(1);
    } finally {
      // 🔴 Phải trả lại: vá thẳng lên globalThis mà quên gỡ thì bản vá sống sang mọi
      // file test chạy sau — đã trả giá 28/08/2026 với `Element.prototype`.
      globalThis.BroadcastChannel = gocBC;
    }
  });

  it("baoDoi() gọi tay cũng báo được — dùng cho lối ghi ngoài kho", () => {
    const nghe = vi.fn();
    const huy = dangKyDoiKho(nghe);
    baoDoi();
    huy();
    expect(nghe).toHaveBeenCalledTimes(1);
  });
});
