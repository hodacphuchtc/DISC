import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import Trang from "../app/page";
import { GIOI_HAN_BAI_MOI_NGUOI } from "../config/disc-gia-dinh";
import {
  CHU_BANG_GIA_DINH,
  CHU_HAN_MUC,
  CHU_LAM_BAI,
  CHU_TRUOC_KHI_BAT_DAU,
  KHOA_KHOANG_DANG_MO,
  TEN_KHOANG,
} from "../config/disc-tu-dien";
import {
  docTatCa,
  luuBai,
  luuThanhVien,
  xoaSach,
  xoaSachThanhVien,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";

/**
 * 🔴 12.4 — BẤM *LÀM BÀI* TỪ THẺ THÀNH VIÊN.
 *
 * Đây là chỗ tiết kiệm thao tác lớn nhất của cả gói: một nhà bốn người, mỗi người hai
 * bài, là tám lần gõ lại cùng một cái tên. Hỏi lại thứ mình đã biết không chỉ phiền —
 * nó còn để hai cách viết của cùng một cái tên cùng tồn tại trong sổ.
 *
 * File này cũng là nơi DUY NHẤT canh cửa hạn mức chạy thật (12.2): hộp thoại chỉ bấm tới
 * được từ đây.
 *
 * 🔴 Mọi tên là BỊA.
 */

const LUC = "2026-08-27T06:30:00+07:00";

let dem = 0;
const bai = (ghiDe: Partial<BaiLamLuu> = {}): BaiLamLuu => {
  dem += 1;
  return {
    id: `bai-${dem}`,
    boDe: "TH",
    maTre: "Zozo",
    maThanhVien: "tv-1",
    nguoiTraLoi: "tre",
    batDau: LUC,
    ketThuc: LUC,
    traLoi: { "TH-D1": 2 },
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

async function themNguoi(id: string, ten: string, lop?: string) {
  await luuThanhVien({
    id,
    ten,
    vaiTro: "con",
    ...(lop ? { lop } : {}),
    thuTu: 0,
    taoLuc: LUC,
    suaLuc: LUC,
  });
}

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
  window.localStorage.clear();
  window.localStorage.setItem(KHOA_KHOANG_DANG_MO, "lich-su");
});
afterEach(async () => {
  cleanup();
  await xoaSach();
  await xoaSachThanhVien();
});

async function moNhaMinh() {
  render(<Trang />);
  await waitFor(() =>
    expect(document.querySelector('[data-thu="thong-diep-chinh"]')).toBeTruthy(),
  );
}

const bamLamBai = () =>
  fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai }));

describe("🔴 vào bài từ thẻ — KHÔNG hỏi tên lần nữa", () => {
  it("người có lớp: vào thẳng màn dặn dò, nói rõ đang làm cho ai", async () => {
    await themNguoi("tv-1", "Zozo", "4");
    await moNhaMinh();
    await waitFor(() => expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy());

    bamLamBai();

    await waitFor(() =>
      expect(document.querySelector('[data-thu="ten-co-san"]')).toBeTruthy(),
    );
    expect(document.querySelector('[data-thu="ten-co-san"]')).toHaveTextContent(
      CHU_TRUOC_KHI_BAT_DAU.lamBaiCho.replace("{ten}", "Zozo"),
    );
    // 🔴 KHÔNG còn ô nhập tên.
    expect(screen.queryByLabelText(CHU_TRUOC_KHI_BAT_DAU.nhanO)).toBeNull();
  });

  it("người CHƯA có lớp thì vẫn đi qua màn 1 — không đoán bừa bộ đề cho một đứa trẻ", async () => {
    await themNguoi("tv-1", "Zozo");
    await moNhaMinh();
    await waitFor(() => expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy());

    bamLamBai();

    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Ai đang cầm máy/u),
    );
  });

  it("🔴 làm xong thì bản ghi mang ĐÚNG mã thành viên", async () => {
    await themNguoi("tv-1", "Zozo", "4");
    await moNhaMinh();
    await waitFor(() => expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy());
    bamLamBai();

    await waitFor(() => expect(document.querySelector('[data-thu="ten-co-san"]')).toBeTruthy());
    fireEvent.click(screen.getByRole("button", { name: CHU_TRUOC_KHI_BAT_DAU.nutBatDau }));

    for (let vong = 0; vong < 40; vong += 1) {
      const nhom = screen.getAllByRole("radiogroup");
      nhom.forEach((g, i) => {
        const nut = Array.from(g.querySelectorAll('[role="radio"]')) as HTMLElement[];
        fireEvent.click(nut[(i + vong) % nut.length]);
      });
      const xong = screen.queryByRole("button", { name: CHU_LAM_BAI.nutXemKetQua });
      if (xong) {
        fireEvent.click(xong);
        break;
      }
      fireEvent.click(screen.getByRole("button", { name: CHU_LAM_BAI.nutTiep }));
    }

    await waitFor(async () => {
      const ds = await docTatCa();
      expect(ds).toHaveLength(1);
      expect(ds[0].maThanhVien).toBe("tv-1");
      expect(ds[0].maTre).toBe("Zozo");
    });
  });
});

describe("🔴 cửa hạn mức — chạy thật, từ chỗ người dùng thật sự bấm", () => {
  it("chưa chạm trần thì đi thẳng, KHÔNG hộp thoại nào", async () => {
    await themNguoi("tv-1", "Zozo", "4");
    await luuBai(bai());
    await moNhaMinh();
    await waitFor(() => expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy());

    bamLamBai();

    await waitFor(() => expect(document.querySelector('[data-thu="ten-co-san"]')).toBeTruthy());
    expect(document.querySelector('[data-thu="hop-thoai-han-muc"]')).toBeNull();
  });

  it("🔴 đã đủ 2 bài ⇒ DỪNG LẠI, nêu đích danh bài sắp mất", async () => {
    await themNguoi("tv-1", "Zozo", "4");
    await luuBai(bai({ ketThuc: "2026-01-01T06:00:00+07:00" }));
    await luuBai(bai({ ketThuc: "2026-06-01T06:00:00+07:00" }));
    await moNhaMinh();
    await waitFor(() => expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy());

    bamLamBai();

    await waitFor(() =>
      expect(document.querySelector('[data-thu="hop-thoai-han-muc"]')).toBeTruthy(),
    );
    expect(document.querySelector('[data-thu="bai-sap-mat"]')).toHaveTextContent("01/01/2026");
    // Chưa xác nhận ⇒ chưa mất gì.
    expect(await docTatCa()).toHaveLength(2);
  });

  it("🔴 bấm HUỶ ⇒ không mất bài nào, và không vào bài mới", async () => {
    await themNguoi("tv-1", "Zozo", "4");
    await luuBai(bai({ ketThuc: "2026-01-01T06:00:00+07:00" }));
    await luuBai(bai({ ketThuc: "2026-06-01T06:00:00+07:00" }));
    await moNhaMinh();
    await waitFor(() => expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy());
    bamLamBai();
    await waitFor(() => expect(document.querySelector('[data-thu="hop-thoai-han-muc"]')).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: CHU_HAN_MUC.nutHuy }));

    expect(document.querySelector('[data-thu="hop-thoai-han-muc"]')).toBeNull();
    expect(await docTatCa()).toHaveLength(2);
    expect(document.querySelector('[data-thu="ten-co-san"]')).toBeNull();
  });

  it("xác nhận ⇒ còn đúng hạn mức trừ một, rồi mới vào bài", async () => {
    await themNguoi("tv-1", "Zozo", "4");
    await luuBai(bai({ ketThuc: "2026-01-01T06:00:00+07:00" }));
    await luuBai(bai({ ketThuc: "2026-06-01T06:00:00+07:00" }));
    await moNhaMinh();
    await waitFor(() => expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy());
    bamLamBai();
    await waitFor(() => expect(document.querySelector('[data-thu="hop-thoai-han-muc"]')).toBeTruthy());

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: CHU_HAN_MUC.nutTiepTuc }));

    await waitFor(async () => expect(await docTatCa()).toHaveLength(GIOI_HAN_BAI_MOI_NGUOI - 1));
    await waitFor(() => expect(document.querySelector('[data-thu="ten-co-san"]')).toBeTruthy());
    // Bài còn lại phải là bài MỚI hơn.
    expect((await docTatCa())[0].ketThuc).toContain("2026-06");
  });
});

describe("thoát ra vào lại thì hết dính người cũ", () => {
  it("bấm mục DISC trên thanh bên ⇒ làm bài tự do, hỏi tên như thường", async () => {
    await themNguoi("tv-1", "Zozo", "4");
    await moNhaMinh();
    await waitFor(() => expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy());
    bamLamBai();
    await waitFor(() => expect(document.querySelector('[data-thu="ten-co-san"]')).toBeTruthy());

    // Sang mục khác rồi quay lại DISC bằng thanh bên.
    fireEvent.click(screen.getByRole("button", { name: new RegExp(TEN_KHOANG["lich-su"], "u") }));
    fireEvent.click(screen.getByRole("button", { name: new RegExp(TEN_KHOANG.disc, "u") }));

    await waitFor(() =>
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Ai đang cầm máy/u),
    );
  });
});
