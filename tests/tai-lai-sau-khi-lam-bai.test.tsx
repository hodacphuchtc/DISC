/**
 * CỬA KIỂM CỦA `16.1`, PHÍA GIAO DIỆN — thẻ phải đổi số bài mà KHÔNG dựng lại component.
 *
 * 🔴 Đây là chỗ lỗi thật từng sống. Người dùng làm xong một bài rồi bấm quay lại; component
 * bảng gia đình chưa hề bị gỡ, nên không có lượt `useEffect` nạp lần đầu nào chạy lại. Cách
 * duy nhất để nó biết là được KHO BÁO. Mà bản cũ báo bằng `BroadcastChannel`, thứ không bao
 * giờ gửi về chính tab đã đăng tin ⇒ thẻ đứng im tới khi bấm F5.
 *
 * Vậy test này cố ý KHÔNG gọi `rerender()` và KHÔNG dựng lại cây — dựng lại là tự tay làm
 * cái việc mà sản phẩm đang thiếu, và cửa kiểm sẽ xanh trên đúng con mã hỏng.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CHU_BANG_GIA_DINH } from "../config/disc-tu-dien";
import { KhoangBangGiaDinh } from "../app/khoang/bang-gia-dinh";
import {
  luuBai,
  luuThanhVien,
  xoaSachTatCa,
  xoaThanhVien,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import type { ThanhVien } from "../modules/core/gia-dinh/kieu";

const LUC = "2026-08-28T09:00:00+07:00";

const nguoi = (ghiDe: Partial<ThanhVien> = {}): ThanhVien => ({
  id: "tv-zozo",
  ten: "Zozo",
  vaiTro: "con",
  lop: "7",
  thuTu: 0,
  taoLuc: LUC,
  suaLuc: LUC,
  ...ghiDe,
});

const bai = (ghiDe: Partial<BaiLamLuu> = {}): BaiLamLuu => ({
  id: "bai-1",
  boDe: "THCS",
  maTre: "Zozo",
  maThanhVien: "tv-zozo",
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

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  await xoaSachTatCa();
});

describe("thẻ tự cập nhật, không cần F5", () => {
  it("làm xong một bài ⇒ số bài trên thẻ đổi ngay, KHÔNG dựng lại component", async () => {
    await luuThanhVien(nguoi());
    render(<KhoangBangGiaDinh />);

    await screen.findByText("Zozo");
    expect(await screen.findByText(CHU_BANG_GIA_DINH.chuaLamBai)).toBeInTheDocument();

    // Chuyện xảy ra ở NƠI KHÁC trong cùng tab: khoang làm bài vừa ghi xong.
    await luuBai(bai());

    await waitFor(() => {
      expect(screen.getByText("1/2 bài")).toBeInTheDocument();
    });
  });

  it("thêm một người ở nơi khác ⇒ thẻ mới hiện ra, không cần dựng lại", async () => {
    await luuThanhVien(nguoi());
    render(<KhoangBangGiaDinh />);
    await screen.findByText("Zozo");
    expect(screen.queryByText("Kiki")).not.toBeInTheDocument();

    await luuThanhVien(nguoi({ id: "tv-kiki", ten: "Kiki", thuTu: 1 }));

    expect(await screen.findByText("Kiki")).toBeInTheDocument();
  });

  it("xoá một người ở nơi khác ⇒ thẻ biến mất, không cần dựng lại", async () => {
    await luuThanhVien(nguoi());
    await luuThanhVien(nguoi({ id: "tv-kiki", ten: "Kiki", thuTu: 1 }));
    render(<KhoangBangGiaDinh />);
    await screen.findByText("Kiki");

    await xoaThanhVien("tv-kiki", "xoa-bai");

    await waitFor(() => {
      expect(screen.queryByText("Kiki")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Zozo")).toBeInTheDocument();
  });
});
