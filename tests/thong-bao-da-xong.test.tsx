/**
 * `28.2` — thông báo "đã xong, đây là bản thứ N" ngay sau khi làm bài.
 * Tên người bịa.
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThongBaoDaXong } from "../app/components/thong-bao-da-xong";
import { CHU_DAY_DU } from "../config/disc-tu-dien";
import type { ThanhVien } from "../modules/core/gia-dinh/kieu";
import {
  luuBai,
  luuThanhVien,
  xoaSach,
  xoaSachThanhVien,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";

const KQ = {
  hopLe: true,
  diem: { D: 60, I: 40, S: 30, C: 70 },
  xepHang: ["C", "D", "I", "S"],
  kieu: { loai: "don", truc: "C" },
  canhBao: [],
} as unknown as BaiLamLuu["ketQua"];

let dem = 0;
const bai = (ghiDe: Partial<BaiLamLuu>): BaiLamLuu => {
  dem += 1;
  return {
    id: `b${dem}`,
    boDe: "PH",
    maTre: "Mai",
    maThanhVien: "tv-mai",
    nguoiTraLoi: "nguoi-lon",
    batDau: "2026-03-01T00:00:00Z",
    ketThuc: "2026-03-01T00:00:00Z",
    traLoi: {},
    ketQua: KQ,
    phienBanBoDe: "1.1",
    ...ghiDe,
  };
};
const tv = (ghiDe: Partial<ThanhVien>): ThanhVien =>
  ({ id: "tv-mai", ten: "Mai", vaiTro: "me", thuTu: 0, ...ghiDe }) as ThanhVien;

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
});

describe("ThongBaoDaXong", () => {
  it("nói đã xong và đây là bản thứ mấy của loại này", async () => {
    await luuThanhVien(tv({}));
    await luuBai(bai({ id: "cu", ketThuc: "2026-01-01T00:00:00Z" }));
    await luuBai(bai({ id: "moi", ketThuc: "2026-09-01T00:00:00Z" }));

    render(<ThongBaoDaXong boDe="PH" bietDanh="Mai" idBai="moi" hopLe />);

    expect(screen.getByText(new RegExp(CHU_DAY_DU.xongTieuDe.replace("{ten}", "Mai"), "u"))).toBeTruthy();
    await waitFor(() => {
      expect(document.querySelector('[data-thu="ban-thu"]')?.textContent).toContain("bản thứ 2");
    });
    expect(document.querySelector('[data-thu="ban-thu"]')?.textContent).toContain("mới nhất");
  });

  it("🔴 đếm theo LOẠI: bản bố mẹ làm cho con không tính vào bản tự làm", async () => {
    await luuThanhVien(tv({ id: "tv-be", ten: "Be", vaiTro: "con", lop: "4" }));
    await luuBai(bai({ id: "tl", boDe: "TH", maThanhVien: "tv-be", maTre: "Be", nguoiTraLoi: "tre" }));
    await luuBai(bai({ id: "qs1", boDe: "QS", maThanhVien: "tv-be", maTre: "Be", ketThuc: "2026-02-01T00:00:00Z" }));
    await luuBai(bai({ id: "qs2", boDe: "QS", maThanhVien: "tv-be", maTre: "Be", ketThuc: "2026-09-01T00:00:00Z" }));

    render(<ThongBaoDaXong boDe="QS" bietDanh="Be" idBai="qs2" hopLe />);
    await waitFor(() => {
      const t = document.querySelector('[data-thu="ban-thu"]')?.textContent ?? "";
      expect(t).toContain("bản thứ 2");
      expect(t).toContain(CHU_DAY_DU.loaiQuanSat);
    });
  });

  it("nói cả nhà còn thiếu ai", async () => {
    await luuThanhVien(tv({}));
    await luuThanhVien(tv({ id: "tv-lan", ten: "Lan", vaiTro: "bo", thuTu: 1 }));
    await luuBai(bai({ id: "m1" }));

    render(<ThongBaoDaXong boDe="PH" bietDanh="Mai" idBai="m1" hopLe />);
    await waitFor(() => {
      const t = document.querySelector('[data-thu="ca-nha-con-thieu"]')?.textContent ?? "";
      expect(t).toContain("1/2 người đủ bản");
      expect(t).toContain("Lan");
    });
  });

  it("🔴 đang lưu (idBai còn null, chưa hỏng) thì KHÔNG cảnh báo lưu hỏng", () => {
    render(<ThongBaoDaXong boDe="PH" bietDanh="Mai" idBai={null} hopLe />);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("status")).toBeTruthy();
  });

  it("lưu thất bại thì nói thật bằng cảnh báo", () => {
    render(<ThongBaoDaXong boDe="PH" bietDanh="Mai" idBai={null} luuHong hopLe />);
    expect(screen.getByRole("alert").textContent).toContain(CHU_DAY_DU.khongLuu);
  });

  it("bản không hợp lệ thì nói chưa dùng được để phân tích", () => {
    render(<ThongBaoDaXong boDe="PH" bietDanh="Mai" idBai={null} hopLe={false} />);
    expect(document.body.textContent).toContain(CHU_DAY_DU.banChuaDung);
  });
});

describe("nút đi tiếp (28.2)", () => {
  it("còn người thiếu ⇒ có nút nêu ĐÍCH DANH người đó, bấm gọi onLamTiep", async () => {
    await luuThanhVien(tv({}));
    await luuThanhVien(tv({ id: "tv-lan", ten: "Lan", vaiTro: "bo", thuTu: 1 }));
    await luuBai(bai({ id: "m1" }));
    const dichVu = vi.fn();

    render(<ThongBaoDaXong boDe="PH" bietDanh="Mai" idBai="m1" hopLe onLamTiep={dichVu} />);
    const nut = await screen.findByRole("button", { name: CHU_DAY_DU.nutLamTiep.replace("{ten}", "Lan") });
    fireEvent.click(nut);
    expect(dichVu).toHaveBeenCalledTimes(1);
  });

  it("cả nhà đã đủ ⇒ KHÔNG có nút (không còn ai để làm tiếp)", async () => {
    await luuThanhVien(tv({}));
    await luuBai(bai({ id: "m1" }));
    render(<ThongBaoDaXong boDe="PH" bietDanh="Mai" idBai="m1" hopLe onLamTiep={vi.fn()} />);
    await waitFor(() => expect(document.querySelector('[data-thu="ca-nha-con-thieu"]')).toBeTruthy());
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("không truyền callback ⇒ không có nút", async () => {
    await luuThanhVien(tv({}));
    await luuThanhVien(tv({ id: "tv-lan", ten: "Lan", vaiTro: "bo", thuTu: 1 }));
    await luuBai(bai({ id: "m1" }));
    render(<ThongBaoDaXong boDe="PH" bietDanh="Mai" idBai="m1" hopLe />);
    await waitFor(() => expect(document.querySelector('[data-thu="ca-nha-con-thieu"]')).toBeTruthy());
    expect(screen.queryByRole("button")).toBeNull();
  });
});
