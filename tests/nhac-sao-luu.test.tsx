import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Trang from "../app/page";
import { CHU_NHAC_SAO_LUU, KHOA_DA_NHAC_SAO_LUU } from "../config/disc-tu-dien";
import {
  luuBai,
  luuThanhVien,
  xoaSachTatCa,
} from "../modules/core/luu-tru/kho-bai";
import type { KetQua } from "../modules/core/bo-de/kieu";

/**
 * NHẮC SAO LƯU (V4.2).
 *
 * 🔴 VÌ SAO NHẮC LÚC NGƯỜI THỨ HAI LÀM XONG. Mọi thứ nằm trong IndexedDB của một trình
 * duyệt: xoá dữ liệu duyệt web, đổi điện thoại, chế độ ẩn danh — mất sạch. Nút sao lưu có
 * từ GĐ8 nhưng nằm im ở cuối màn và chưa bao giờ chủ động nhắc.
 *
 * Người thứ hai làm xong là khoảnh khắc ĐẦU TIÊN gia đình có thứ đáng để mất: một bài lẻ
 * thì làm lại mất tám phút, hai bài trở lên là một bức tranh không dựng lại được.
 *
 * 🔴 VÀ NHẮC ĐÚNG MỘT LẦN. Nhắc mãi thì nó thành nền, và cái gì thành nền thì không ai
 * đọc — kể cả lần nó quan trọng thật.
 */

const KQ: KetQua = {
  hopLe: true,
  diem: { D: 90, I: 55, S: 35, C: 45 },
  xepHang: ["D", "I", "C", "S"],
  kieu: { loai: "don", truc: "D" },
  canhBao: [],
};

async function nguoiCoBai(i: number, ten: string) {
  const id = `tv-${i}`;
  await luuThanhVien({
    id,
    ten,
    vaiTro: "me",
    thuTu: i,
    taoLuc: "2026-08-01T00:00:00.000Z",
    suaLuc: "2026-08-01T00:00:00.000Z",
  });
  await luuBai({
    id: `bai-${i}`,
    boDe: "PH",
    maTre: ten,
    maThanhVien: id,
    nguoiTraLoi: "nguoi-lon",
    batDau: "2026-08-02T00:00:00.000Z",
    ketThuc: "2026-08-02T00:05:00.000Z",
    traLoi: {},
    ketQua: KQ,
    phienBanBoDe: "1.0",
  });
}

const nhac = () => document.querySelector('[data-thu="nhac-sao-luu"]');
const moTrang = async () => {
  render(<Trang />);
  await waitFor(() =>
    expect(document.querySelector('[data-thu="tam-buoc"]')).toBeTruthy(),
  );
};

beforeEach(async () => {
  await xoaSachTatCa();
  window.localStorage.clear();
});
afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
  await xoaSachTatCa();
});

describe("thời điểm nhắc", () => {
  it("máy trống ⇒ KHÔNG nhắc", async () => {
    await moTrang();
    expect(nhac()).toBeNull();
  });

  it("mới MỘT người làm xong ⇒ CHƯA nhắc — làm lại mất tám phút, chưa đáng phiền", async () => {
    await nguoiCoBai(1, "Zozo");
    await moTrang();
    // Chờ đủ lâu để bộ đếm chạy xong rồi mới khẳng định là không có.
    await waitFor(() =>
      expect(document.querySelector('[data-thu="trang-thai-buoc"]')).toBeTruthy(),
    );
    expect(nhac()).toBeNull();
  });

  it("🔴 người THỨ HAI làm xong ⇒ nhắc", async () => {
    await nguoiCoBai(1, "Zozo");
    await nguoiCoBai(2, "Kiki");
    await moTrang();
    await waitFor(() => expect(nhac()).toBeTruthy());
    expect(nhac()).toHaveTextContent(CHU_NHAC_SAO_LUU.than);
  });
});

describe("🔴 nhắc đúng MỘT lần", () => {
  it("đã nhắc rồi thì lần mở sau KHÔNG nhắc lại", async () => {
    await nguoiCoBai(1, "Zozo");
    await nguoiCoBai(2, "Kiki");

    await moTrang();
    await waitFor(() => expect(nhac()).toBeTruthy());
    cleanup();

    // Mở lại trang y như người dùng quay lại hôm sau.
    await moTrang();
    await waitFor(() =>
      expect(document.querySelector('[data-thu="trang-thai-buoc"]')).toBeTruthy(),
    );
    expect(nhac()).toBeNull();
  });

  it("đánh dấu đã nhắc NGAY LÚC HIỆN, không đợi họ bấm gì", async () => {
    await nguoiCoBai(1, "Zozo");
    await nguoiCoBai(2, "Kiki");
    await moTrang();
    await waitFor(() => expect(nhac()).toBeTruthy());

    // Người đóng đi mà không tải cũng là ĐÃ ĐƯỢC NHẮC. Hỏi lại lần nữa là không nghe
    // câu trả lời của họ.
    expect(window.localStorage.getItem(KHOA_DA_NHAC_SAO_LUU)).toBe("1");
  });

  it("bấm 'Để sau' ⇒ khối biến mất ngay", async () => {
    await nguoiCoBai(1, "Zozo");
    await nguoiCoBai(2, "Kiki");
    await moTrang();
    await waitFor(() => expect(nhac()).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: CHU_NHAC_SAO_LUU.nutBoQua }));
    expect(nhac()).toBeNull();
  });
});

describe("localStorage bị chặn (cửa sổ ẩn danh)", () => {
  it("vẫn nhắc — thà nhắc thừa còn hơn để mất dữ liệu vì im lặng", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Chặn bởi chế độ riêng tư", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Chặn bởi chế độ riêng tư", "SecurityError");
    });

    await nguoiCoBai(1, "Zozo");
    await nguoiCoBai(2, "Kiki");
    await moTrang();
    await waitFor(() => expect(nhac()).toBeTruthy());
  });
});
