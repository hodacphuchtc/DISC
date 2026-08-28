/**
 * ĐÓNG / MỞ BƯỚC TRONG KHUNG CÁC BƯỚC (`20.1`).
 *
 * 🔴 VÌ SAO CÓ FILE NÀY. `cac-buoc.tsx` là màn ĐẦU TIÊN mọi phụ huynh nhìn thấy, và cho
 * tới hôm nay nó **không có test riêng nào** — chỉ bị `bo-cuc.test.tsx` và
 * `khoi-giu-du-lieu.test.tsx` chạm vào, cả hai đo thứ khác. Nên một lỗi ngay ở thao tác cơ
 * bản nhất (bấm đóng một bước) sống sót qua 1.387 test xanh.
 *
 * LỖI ĐÃ TRẢ GIÁ: effect tự-mở-hộ chốt chặn bằng `dangMo !== null` và để `dangMo` trong
 * mảng phụ thuộc. Người dùng bấm đóng ⇒ `dangMo` về `null` ⇒ effect chạy lại ⇒ thấy `null`
 * ⇒ mở lại ngay. Chú thích tại chỗ ghi *"chỉ chọn hộ MỘT LẦN"*; mã thì chạy mỗi lần đóng.
 *
 * 🔴 Mọi tên là BỊA.
 */

import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { KhoangCacBuoc } from "../app/khoang/cac-buoc";
import {
  luuBai,
  luuThanhVien,
  xoaSachTatCa,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import type { ThanhVien } from "../modules/core/gia-dinh/kieu";
import { buocDangMo, tamBuoc } from "./duong-vao-bai";

const LUC = "2026-08-29T09:00:00+07:00";

const nguoi = (i: number, ten: string, vaiTro: ThanhVien["vaiTro"]): ThanhVien => ({
  id: `tv-${i}`,
  ten,
  vaiTro,
  thuTu: i,
  taoLuc: LUC,
  suaLuc: LUC,
});

const bai = (id: string, tv: number): BaiLamLuu =>
  ({
    id,
    boDe: "PH",
    maTre: `nguoi-${tv}`,
    maThanhVien: `tv-${tv}`,
    nguoiTraLoi: "nguoi-lon",
    batDau: LUC,
    ketThuc: LUC,
    traLoi: { "PH-D1": 4 },
    ketQua: {
      hopLe: true,
      diem: { D: 80, I: 30, S: 40, C: 55 },
      xepHang: ["D", "C", "S", "I"],
      kieu: { loai: "don", truc: "D" },
      canhBao: [],
    },
    phienBanBoDe: "1.0",
  }) as unknown as BaiLamLuu;

/**
 * Nút TIÊU ĐỀ của một bước — nút duy nhất trong tấm đó mang `aria-expanded`.
 *
 * 🔴 KHÔNG hỏi bằng `getByRole("button", { name: /<tên bước>/ })`. Bước 2 mở ra thì bên
 * trong thân nó cũng có nút mang đúng chữ ấy, và câu hỏi khớp trúng hai nút rồi ném. Cùng
 * họ với bẫy `17.7` (`endsWith` bắt trúng cả tên dài hơn) và `11.6` (biệt danh `"Bi"` nằm
 * gọn trong chữ `"Biệt danh"`): **hỏi đúng phần tử, đừng hỏi cả trang rồi lọc bằng chữ.**
 */
const tieuDe = (ma: "nha-minh" | "phan-tich"): HTMLElement => {
  const nut = tamBuoc(ma)?.querySelector("button[aria-expanded]");
  if (!nut) throw new Error(`không tìm thấy nút tiêu đề của bước "${ma}"`);
  return nut as HTMLElement;
};

/**
 * Nhường một lượt cho mọi effect còn treo chạy xong.
 *
 * 🔴 Không có dòng này thì cửa ② vẫn XANH trên mã hỏng: `waitFor` dừng ngay lượt đầu tiên
 * thấy điều kiện đúng, mà effect mở lại chạy Ở LƯỢT SAU. Cửa phải nhìn được cái lượt đó.
 */
const nhuongMotLuot = () => new Promise((xong) => setTimeout(xong, 0));

beforeEach(async () => {
  await xoaSachTatCa();
  window.localStorage.clear();
});
afterEach(async () => {
  cleanup();
  window.localStorage.clear();
  await xoaSachTatCa();
});

describe("khung các bước — bước đang mở phải ĐÓNG lại được", () => {
  it("① chưa ai làm xong thì bước 1 TỰ MỞ", async () => {
    render(<KhoangCacBuoc />);

    await waitFor(() => expect(tamBuoc("nha-minh")).toBeTruthy());
    await waitFor(() => expect(buocDangMo("nha-minh")).toBe(true));
    expect(buocDangMo("phan-tich"), "bước 2 chưa mở được khi chưa đủ hai người").toBe(false);
  });

  it("🔴 ② bấm đóng bước 1 thì nó Ở YÊN ĐÓNG, không tự bật lại", async () => {
    render(<KhoangCacBuoc />);
    await waitFor(() => expect(buocDangMo("nha-minh")).toBe(true));

    fireEvent.click(tieuDe("nha-minh"));

    await waitFor(() => expect(buocDangMo("nha-minh")).toBe(false));
    await nhuongMotLuot();
    expect(
      buocDangMo("nha-minh"),
      "effect tự-mở-hộ chạy lại và mở lại ⇒ người dùng không đóng được bước nào",
    ).toBe(false);
  });

  it("🔴 ③ đủ hai người thì bước 2 tự mở, và đóng nó cũng Ở YÊN ĐÓNG", async () => {
    await luuThanhVien(nguoi(0, "Zozo", "me"));
    await luuThanhVien(nguoi(1, "Kiki", "bo"));
    await luuBai(bai("b0", 0));
    await luuBai(bai("b1", 1));

    render(<KhoangCacBuoc />);
    await waitFor(() => expect(buocDangMo("phan-tich")).toBe(true));

    fireEvent.click(tieuDe("phan-tich"));

    await waitFor(() => expect(buocDangMo("phan-tich")).toBe(false));
    await nhuongMotLuot();
    expect(buocDangMo("phan-tich")).toBe(false);
    expect(
      buocDangMo("nha-minh"),
      "đóng bước 2 không được kéo bước 1 bật lên thế chỗ",
    ).toBe(false);
  });
});
