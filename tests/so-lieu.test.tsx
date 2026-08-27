import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { KhoangSoLieu } from "../app/khoang/so-lieu";
import { CHU_MOC, CHU_SO_LIEU } from "../config/disc-tu-dien";
import { MOC, ghiMoc, xoaPhieu } from "../modules/core/do-phieu";
import { luuBai, xoaSach, type BaiLamLuu } from "../modules/core/luu-tru/kho-bai";

/**
 * MÀN SỐ LIỆU MÁY NÀY (11.6).
 *
 * 🔴 Bộ đếm phễu có từ GĐ6 mà chưa màn nào đọc nó. Cửa kiểm nặng nhất ở đây không phải
 * "con số có hiện ra không" mà là **con số có ĐÚNG không** — nhất là mốc `baiThuHai`,
 * thứ đang đỡ 9,5 ngày của GĐ14. Một màn số liệu đếm sai còn tệ hơn không có màn nào:
 * nó biến một giả định chưa kiểm chứng thành một con số trông như bằng chứng.
 *
 * 🔴 Mọi biệt danh dưới đây là BỊA — và cố ý chọn chuỗi KHÔNG đụng chữ nào của giao diện.
 * Bản đầu dùng "Bi", và cửa kiểm riêng tư đỏ vì "Bi" nằm gọn trong "**Bi**ệt danh khác
 * nhau" ngay trên màn. Cửa kiểm soi chuỗi con thì tên càng ngắn càng dễ báo động giả.
 */

const KQ = {
  hopLe: true as const,
  diem: { D: 70, I: 50, S: 40, C: 60 },
  xepHang: ["D", "I", "C", "S"] as const,
  kieu: { loai: "don" as const, truc: "D" as const },
  canhBao: [] as const,
};

let dem = 0;
function bai(maTre: string): BaiLamLuu {
  dem += 1;
  return {
    id: `bai-${dem}`,
    boDe: "TH",
    maTre,
    nguoiTraLoi: "tre",
    batDau: "2026-08-27T01:00:00+07:00",
    ketThuc: "2026-08-27T01:08:00+07:00",
    traLoi: { "TH-D1": 3 },
    ketQua: KQ,
    phienBanBoDe: "1.1",
  };
}

beforeEach(async () => {
  await xoaSach();
  xoaPhieu();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
  xoaPhieu();
});

const hien = () => render(<KhoangSoLieu />);
const o = (thu: string) => document.querySelector(`[data-thu="${thu}"] dd`)?.textContent ?? "";
const choXong = () => waitFor(() => expect(document.querySelector('[data-thu="so-bai"]')).toBeTruthy());

describe("màn số liệu — đếm trên chính máy này", () => {
  it("máy trắng: 0 bài, 0 biệt danh, chưa đạt", async () => {
    hien();
    await choXong();
    expect(o("so-bai")).toBe("0");
    expect(o("so-biet-danh")).toBe("0");
    expect(o("bai-thu-hai")).toBe(CHU_SO_LIEU.chuaDat);
    expect(screen.getByText(CHU_SO_LIEU.trong)).toBeTruthy();
  });

  it("một bé làm hai bài: 2 bài nhưng 1 biệt danh, VẪN chưa đạt", async () => {
    await luuBai(bai("Zozo"));
    await luuBai(bai("Zozo"));
    hien();
    await choXong();
    expect(o("so-bai")).toBe("2");
    expect(o("so-biet-danh")).toBe("1");
    expect(o("bai-thu-hai")).toBe(CHU_SO_LIEU.chuaDat);
  });

  it("🔴 hai biệt danh khác nhau ⇒ con số quan trọng nhất nhảy lên 'Rồi'", async () => {
    await luuBai(bai("Zozo"));
    await luuBai(bai("Kiki"));
    hien();
    await choXong();
    expect(o("so-bai")).toBe("2");
    expect(o("so-biet-danh")).toBe("2");
    expect(o("bai-thu-hai")).toBe(CHU_SO_LIEU.daDat);
  });

  it("hiện ĐỦ sáu mốc phễu, không sót mốc nào", async () => {
    hien();
    await choXong();
    for (const m of MOC) {
      const hang = document.querySelector(`[data-thu="moc-${m}"]`);
      expect(hang, `thiếu hàng mốc ${m}`).toBeTruthy();
      expect(hang?.textContent).toContain(CHU_MOC[m]);
    }
  });

  it("đếm đúng số lượt từng mốc", async () => {
    const luc = "2026-08-27T01:00:00+07:00";
    ghiMoc("mo", "a", luc);
    ghiMoc("mo", "a", luc);
    ghiMoc("xong", "a", luc);
    hien();
    await choXong();
    expect(document.querySelector('[data-thu="moc-mo"]')?.textContent).toMatch(/2$/u);
    expect(document.querySelector('[data-thu="moc-xong"]')?.textContent).toMatch(/1$/u);
    expect(document.querySelector('[data-thu="moc-baiThuHai"]')?.textContent).toMatch(/0$/u);
  });

  it("🔴 KHÔNG hiện biệt danh, câu trả lời hay điểm số của bất kỳ ai", async () => {
    // Màn đo lường là chỗ dễ nhất để dữ liệu của trẻ rò ra dưới danh nghĩa "thống kê".
    await luuBai(bai("Zozo"));
    await luuBai(bai("Kiki"));
    hien();
    await choXong();

    const chu = document.body.textContent ?? "";
    expect(chu).not.toContain("Zozo");
    expect(chu).not.toContain("Kiki");
    expect(chu).not.toMatch(/\bTH-D1\b/u);
    expect(chu).not.toMatch(/\b70\b/u);
  });

  it("nói rõ màn này chỉ đọc, không gửi đi đâu", async () => {
    hien();
    await choXong();
    expect(screen.getByText(CHU_SO_LIEU.nhacRiengTu)).toBeTruthy();
  });
});
