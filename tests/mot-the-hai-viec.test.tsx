/**
 * CỬA KIỂM CỦA `16.2` — ba bước gộp còn HAI, và một thẻ gánh cả hai việc.
 *
 * Ba luật, đọc lên chính là bản đặc tả:
 *
 *  1. Thẻ một người mang CẢ *Làm bài* LẪN *Sửa/Xoá*. Người dùng vừa gõ tên xong là bấm
 *     làm bài được ngay, không phải đóng bước này mở bước kia rồi tìm lại đúng người đó.
 *  2. 🔴 *Xoá* đứng CUỐI cụm nút, xa nhất khỏi *Làm bài*. Một lựa chọn không hoàn tác
 *     được không được nằm ở chỗ ngón tay rơi vào theo phản xạ.
 *  3. N người có hồ sơ ⇒ ĐÚNG N bản phân tích. Kiểm qua giao diện thật, không chỉ qua
 *     hàm engine: engine đúng mà màn nối sai thì người dùng vẫn nhận thiếu bản.
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KhoangBangGiaDinh } from "../app/khoang/bang-gia-dinh";
import { KhoangPhanTich } from "../app/khoang/phan-tich";
import { CHU_BANG_GIA_DINH, CHU_TONG_HOP } from "../config/disc-tu-dien";
import {
  luuBai,
  luuThanhVien,
  xoaSachTatCa,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";

/** Tên bịa KHÔNG đụng chữ nào của giao diện. */
const TEN = ["Zozo", "Kiki", "Momo", "Nono", "Papa", "Quuu"] as const;
const LUC = "2026-08-28T09:00:00+07:00";

/** Một hồ sơ điểm KHÁC NHAU cho mỗi người — hai người y hệt nhau thì lát cắt rỗng. */
const DIEM = [
  { D: 80, I: 30, S: 40, C: 55 },
  { D: 25, I: 75, S: 60, C: 35 },
  { D: 45, I: 40, S: 85, C: 30 },
  { D: 35, I: 55, S: 25, C: 82 },
];

async function themNguoiCoBai(i: number) {
  await luuThanhVien({
    id: `tv-${i}`,
    ten: TEN[i],
    vaiTro: i === 0 ? "me" : "con",
    ...(i === 0 ? {} : { lop: "7" }),
    thuTu: i,
    taoLuc: LUC,
    suaLuc: LUC,
  });
  const diem = DIEM[i % DIEM.length];
  await luuBai({
    id: `bai-${i}`,
    boDe: i === 0 ? "PH" : "THCS",
    maTre: TEN[i],
    maThanhVien: `tv-${i}`,
    nguoiTraLoi: i === 0 ? "phu-huynh" : "tre",
    batDau: "2026-08-28T08:00:00+07:00",
    ketThuc: "2026-08-28T08:08:00+07:00",
    traLoi: {},
    ketQua: {
      hopLe: true,
      diem,
      xepHang: (Object.keys(diem) as Array<keyof typeof diem>).sort(
        (a, b) => diem[b] - diem[a],
      ),
      kieu: { loai: "don", truc: "D" },
      canhBao: [],
    },
    phienBanBoDe: "1.0",
  } as unknown as BaiLamLuu);
}

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  cleanup();
  await xoaSachTatCa();
});

describe("một thẻ, hai việc", () => {
  it("🔴 thẻ mang CẢ nút làm bài LẪN nút sửa/xoá — không phải hai bước riêng", async () => {
    await themNguoiCoBai(0);
    render(<KhoangBangGiaDinh onLamBai={vi.fn()} onXemBai={vi.fn()} />);
    await screen.findByText(TEN[0]);

    expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeTruthy();
    expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutSua })).toBeTruthy();
    expect(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutXoa })).toBeTruthy();
  });

  it("🔴 nút XOÁ đứng CUỐI cụm — xa nhất khỏi nút bấm hàng ngày", async () => {
    await themNguoiCoBai(0);
    render(<KhoangBangGiaDinh onLamBai={vi.fn()} onXemBai={vi.fn()} />);
    await screen.findByText(TEN[0]);

    const the = screen.getByText(TEN[0]).closest("li")!;
    const ten = [...the.querySelectorAll("button")].map((b) => b.textContent?.trim());
    expect(ten.at(-1)).toBe(CHU_BANG_GIA_DINH.nutXoa);
    // Và nó phải đứng SAU nút làm bài, không chỉ đứng cuối một cụm nào đó.
    expect(ten.indexOf(CHU_BANG_GIA_DINH.nutXoa)).toBeGreaterThan(
      ten.indexOf(CHU_BANG_GIA_DINH.nutLamBai),
    );
  });

  it("thêm một người xong là bấm làm bài được ngay trên thẻ vừa tạo", async () => {
    render(<KhoangBangGiaDinh onLamBai={vi.fn()} />);
    await waitFor(() =>
      expect(screen.getByText(CHU_BANG_GIA_DINH.trong)).toBeTruthy(),
    );

    // Người dùng khai một người ở CHÍNH màn này…
    await themNguoiCoBai(1);

    // …và nút làm bài mọc ra ngay trên thẻ đó, không cần mở bước khác.
    expect(await screen.findByText(TEN[1])).toBeTruthy();
    const the = screen.getByText(TEN[1]).closest("li")!;
    expect(
      [...the.querySelectorAll("button")].some(
        (b) => b.textContent?.trim() === CHU_BANG_GIA_DINH.nutLamBai,
      ),
    ).toBe(true);
  });
});

describe("🔴 N người có hồ sơ ⇒ ĐÚNG N bản phân tích", () => {
  for (const N of [2, 3, 4]) {
    it(`${N} người ⇒ ${N} bản`, async () => {
      for (let i = 0; i < N; i += 1) await themNguoiCoBai(i);

      render(<KhoangPhanTich />);
      const nutPhanTich = await waitFor(() => {
        const el = document.querySelector('[data-thu="nut-phan-tich"]');
        expect(el).toBeTruthy();
        return el as HTMLElement;
      });
      fireEvent.click(nutPhanTich);

      // Màn giữa: chọn bài cho mỗi người, rồi bấm chạy.
      const nutChay = await screen.findByRole("button", { name: CHU_TONG_HOP.nutChay });
      fireEvent.click(nutChay);

      await waitFor(() => {
        expect(document.querySelectorAll('[data-thu="ban-tong-hop"]')).toHaveLength(N);
      });
    });
  }
});
