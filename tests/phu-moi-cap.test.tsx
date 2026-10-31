/**
 * `29.6` — MA TRẬN PHỦ: mọi lát cắt của một nhà đủ loại người đều ra phân tích sâu, hoặc nói
 * thẳng vì sao chưa (thiếu lớp của bé). Không còn cặp nào im lặng rơi về chữ chung chung.
 *
 * Nhà bịa 6 người: bố, mẹ, ông, bé lớp 4, bé mầm non, bé CHƯA có lớp.
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ManBanTongHop, type NguoiCoBai } from "../app/khoang/ban-tong-hop";
import { CHU_NOI_DUNG_DOI, CHU_TONG_HOP } from "../config/disc-tu-dien";
import type { MaTruc } from "../modules/core/bo-de/kieu";
import type { ThanhVien } from "../modules/core/gia-dinh/kieu";
import type { BaiLamLuu } from "../modules/core/luu-tru/kho-bai";

const LUC = "2026-08-27T06:00:00+07:00";
const diem = (D: number, I: number, S: number, C: number): Record<MaTruc, number> => ({ D, I, S, C });
const tv = (id: string, ten: string, vaiTro: ThanhVien["vaiTro"], lop?: string): ThanhVien => ({
  id, ten, vaiTro, ...(lop ? { lop } : {}), thuTu: 0, taoLuc: LUC, suaLuc: LUC,
});
const bai = (id: string, d: Record<MaTruc, number>): BaiLamLuu => ({
  id, boDe: "THCS", maTre: "x", nguoiTraLoi: "tre", batDau: LUC, ketThuc: LUC, traLoi: {},
  ketQua: { hopLe: true, diem: d, xepHang: ["D", "I", "S", "C"], kieu: { loai: "don", truc: "D" }, canhBao: [] },
  phienBanBoDe: "1.1",
});

const NHA: NguoiCoBai[] = [
  { tv: tv("bo", "Bố Hùng", "bo"), bai: [bai("b1", diem(80, 50, 40, 55))] },
  { tv: tv("me", "Mẹ Trang", "me"), bai: [bai("b2", diem(78, 49, 44, 53))] }, // gần bố ⇒ nhiều trục cùng nhịp
  { tv: tv("ong", "Ông Sáu", "ong"), bai: [bai("b3", diem(40, 60, 70, 50))] },
  { tv: tv("c4", "Bé Na", "con", "4"), bai: [bai("b4", diem(45, 62, 70, 48))] },
  { tv: tv("mn", "Bé Bi", "con", "mam-non"), bai: [bai("b5", diem(50, 50, 50, 50))] },
  { tv: tv("kl", "Bé Cúc", "con"), bai: [bai("b6", diem(82, 30, 35, 70))] }, // CHƯA có lớp
];

beforeEach(() => vi.spyOn(window, "print").mockImplementation(() => {}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const lat = () => [...document.querySelectorAll('[data-thu="lat-cat"]')];

async function chayNha() {
  render(<ManBanTongHop nguoi={NHA} onDong={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: CHU_TONG_HOP.nutChay }));
  await waitFor(() => expect(lat()).toHaveLength(30)); // 6 người × 5 người còn lại
  // Chờ mọi khối nạp lười hiện hết: mỗi lát cắt có kế hoạch bảy ngày HOẶC dòng nhắc thêm lớp.
  await waitFor(
    () => {
      const xong = lat().filter((l) => l.querySelector('[data-thu="ke-hoach-bay-ngay"], [data-thu="can-them-lop"]'));
      expect(xong).toHaveLength(30);
    },
    { timeout: 5000 },
  );
}

describe("🔴 ma trận phủ — 6 người, 30 lát cắt", () => {
  it("MỌI lát cắt có bảy ngày thử hoặc dòng nhắc thêm lớp (không còn cặp im lặng)", async () => {
    await chayNha();
    for (const l of lat()) {
      const coKeHoach = l.querySelector('[data-thu="ke-hoach-bay-ngay"]');
      const canLop = l.querySelector('[data-thu="can-them-lop"]');
      expect(Boolean(coKeHoach) !== Boolean(canLop), l.getAttribute("data-nguoi-kia") ?? "").toBe(true);
    }
  });

  it("dòng nhắc thêm lớp CHỈ xuất hiện ở cặp có bé chưa có lớp, và gọi đúng tên bé", async () => {
    await chayNha();
    const canLop = lat().filter((l) => l.querySelector('[data-thu="can-them-lop"]'));
    // Bé Cúc (chưa có lớp) với 3 người LỚN, ở cả hai chiều = 6 lát cắt. Với hai bé kia là
    // anh/chị/em nên KHÔNG cần bậc.
    expect(canLop).toHaveLength(6);
    for (const l of canLop) {
      expect(l.querySelector('[data-thu="can-them-lop"]')?.textContent).toBe(
        CHU_NOI_DUNG_DOI.canThemLop.replace("{ten}", "Bé Cúc"),
      );
    }
  });

  it("mọi lát cắt có chỗ lệch đều có 'Chuyện hằng ngày' cho từng trục lệch (trừ bé chưa có lớp)", async () => {
    await chayNha();
    for (const l of lat()) {
      if (l.querySelector('[data-thu="can-them-lop"]')) continue;
      const coLech = !l.querySelector('[data-thu="cung-nhip-hang-ngay"]') && l.querySelectorAll("h4").length > 0;
      if (coLech) expect(l.querySelectorAll('[data-thu="tinh-huong-doi"]').length, l.textContent?.slice(0, 40) ?? "").toBeGreaterThan(0);
    }
  });

  it("mọi lát cắt trùng khớp có khối 'cùng nhịp' (kể cả cặp có trẻ)", async () => {
    await chayNha();
    const trungKhop = lat().filter((l) => l.textContent?.includes(CHU_TONG_HOP.nhanTrungKhop));
    expect(trungKhop.length).toBeGreaterThan(0);
    // Chờ khối nạp lười của cùng nhịp.
    await waitFor(() => {
      for (const l of trungKhop) expect(l.querySelector('[data-thu="cung-nhip-hang-ngay"]')).toBeTruthy();
    });
  });

  it("🔴 không sót chỗ giữ {…} ở bất kỳ đâu trong cả trang", async () => {
    await chayNha();
    expect(document.body.textContent).not.toMatch(/[{}]/u);
  });

  it("xưng hô đúng vai: ông ⇒ bé gọi 'Ông', xưng 'cháu'; bố mẹ ⇒ 'con'", async () => {
    await chayNha();
    const veBeNaVeOng = lat().find(
      (l) => l.closest('[data-thu="ban-tong-hop"]')?.querySelector("h2")?.textContent?.includes("Bé Na") && l.getAttribute("data-nguoi-kia") === "ong",
    )!;
    const kh = veBeNaVeOng.querySelector('[data-thu="ke-hoach-bay-ngay"]')!.textContent!;
    expect(kh).toMatch(/Ông/u);
    expect(kh).toMatch(/cháu/u);
    expect(kh).not.toMatch(/\bcon\b/u);

    const veBeNaVeMe = lat().find(
      (l) => l.closest('[data-thu="ban-tong-hop"]')?.querySelector("h2")?.textContent?.includes("Bé Na") && l.getAttribute("data-nguoi-kia") === "me",
    )!;
    expect(veBeNaVeMe.querySelector('[data-thu="ke-hoach-bay-ngay"]')!.textContent).toMatch(/\bcon\b/u);
  });

  it("🔴 hai chiều của cùng một cặp không dùng chung câu dài (cả phần nạp lười)", async () => {
    await chayNha();
    const cau = (l: Element) => new Set((l.textContent ?? "").split(/(?<=[.?!”])\s+/u).map((s) => s.trim()).filter((s) => s.length >= 60));
    const ban = [...document.querySelectorAll('[data-thu="ban-tong-hop"]')];
    const tim = (tenNguoi: string, kia: string) =>
      ban
        .find((b) => b.querySelector("h2")?.textContent?.includes(tenNguoi))!
        .querySelector(`[data-thu="lat-cat"][data-nguoi-kia="${kia}"]`)!;
    const CAP: [string, string, string, string][] = [
      ["Bố Hùng", "ong", "Ông Sáu", "bo"],
      ["Bố Hùng", "c4", "Bé Na", "bo"],
      ["Ông Sáu", "c4", "Bé Na", "ong"],
      ["Bé Na", "mn", "Bé Bi", "c4"],
      ["Mẹ Trang", "ong", "Ông Sáu", "me"],
    ];
    let soSanh = 0;
    for (const [ten1, kia1, ten2, kia2] of CAP) {
      const l1 = tim(ten1, kia1);
      const l2 = tim(ten2, kia2);
      // Hai tờ CÙNG ở trạng thái "cùng nhịp" thì giống nhau là đương nhiên (TRUNG_KHOP vốn là một
      // câu chung); luật chỉ áp cho cặp có chỗ LỆCH, nơi hai chiều đọc hai ô đối nhau.
      if (l1.querySelector('[data-thu="cung-nhip-hang-ngay"]')) continue;
      soSanh += 1;
      const a = cau(l1);
      const b = cau(l2);
      const chung = [...a].filter((c) => b.has(c));
      expect(chung, `${ten1}↔${ten2}: ${JSON.stringify(chung)}`).toHaveLength(0);
    }
    expect(soSanh, "phải còn ít nhất vài cặp lệch để so").toBeGreaterThanOrEqual(3);
  });
});
