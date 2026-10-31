/**
 * ĐỌC NHANH — thanh chọn người, Mở hết / Gập hết, "Hôm nay thử" ở màn bản tổng hợp cả nhà.
 * Mọi tên là BỊA.
 */

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ManBanTongHop, type NguoiCoBai } from "../app/khoang/ban-tong-hop";
import { CHU_TONG_HOP } from "../config/disc-tu-dien";
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
  { tv: tv("me", "Mẹ Lan", "me"), bai: [bai("b-me", diem(75, 50, 40, 55))] },
  { tv: tv("bin", "Bin", "con", "7"), bai: [bai("b-bin", diem(45, 62, 70, 48))] },
  { tv: tv("bo", "Bố Nam", "bo"), bai: [bai("b-bo", diem(52, 40, 58, 80))] },
];
const TEN = ["Mẹ Lan", "Bin", "Bố Nam"];
/** Hai người GIỐNG HỆT nhau ⇒ không có lát cắt lệch nào. */
const NHA_GIONG: NguoiCoBai[] = [
  { tv: tv("a", "Cô Hoa", "me"), bai: [bai("b-a", diem(60, 60, 60, 60))] },
  { tv: tv("b", "Chú Tín", "bo"), bai: [bai("b-b", diem(60, 60, 60, 60))] },
];

let cuon: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.spyOn(window, "print").mockImplementation(() => {});
  cuon = vi.fn();
  Element.prototype.scrollIntoView = cuon as unknown as typeof Element.prototype.scrollIntoView;
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const ban = () => [...document.querySelectorAll<HTMLElement>('[data-thu="ban-tong-hop"]')];
const thanhChon = () => document.querySelector<HTMLElement>('[data-thu="chon-nguoi"]');
const nutTieuDe = (b: Element) => b.querySelector<HTMLButtonElement>("h2 button")!;
const moRong = (b: Element) => [...b.querySelectorAll("[aria-expanded]")];

async function chay(nguoi: readonly NguoiCoBai[] = NHA, soBan = nguoi.length) {
  render(<ManBanTongHop nguoi={nguoi} onDong={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: CHU_TONG_HOP.nutChay }));
  await waitFor(() => expect(ban()).toHaveLength(soBan));
}

describe("thanh chọn người", () => {
  it("có thanh [data-thu=chon-nguoi] (data-khong-in), mỗi người một nút, đứng trước các bản", async () => {
    await chay();
    const thanh = thanhChon()!;
    expect(thanh).toBeTruthy();
    expect(thanh.hasAttribute("data-khong-in")).toBe(true);
    const nut = [...thanh.querySelectorAll("button")].filter((n) => TEN.includes(n.textContent?.trim() ?? ""));
    expect(nut.map((n) => n.textContent?.trim())).toEqual(TEN);
    // thứ tự DOM: thanh đứng trước bản đầu tiên
    expect(thanh.compareDocumentPosition(ban()[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("bấm nút một người ⇒ mở bản của người đó và cuộn tới [data-ban=tv-<id>]", async () => {
    await chay();
    const nutBin = within_(thanhChon()!, "Bin");
    fireEvent.click(nutBin);
    const banBin = document.querySelector('[data-ban="tv-bin"]')!;
    await waitFor(() => expect(nutTieuDe(banBin).getAttribute("aria-expanded")).toBe("true"));
    expect(cuon).toHaveBeenCalled();
    expect(cuon.mock.instances.some((el: unknown) => el === banBin)).toBe(true);
  });

  it("bản đang gập ⇒ bấm tên mở ra; bấm lần nữa KHÔNG gập lại", async () => {
    await chay();
    const banMe = document.querySelector('[data-ban="tv-me"]')!;
    if (nutTieuDe(banMe).getAttribute("aria-expanded") === "true") fireEvent.click(nutTieuDe(banMe));
    expect(nutTieuDe(banMe).getAttribute("aria-expanded")).toBe("false");
    const nut = within_(thanhChon()!, "Mẹ Lan");
    fireEvent.click(nut);
    await waitFor(() => expect(nutTieuDe(banMe).getAttribute("aria-expanded")).toBe("true"));
    fireEvent.click(nut);
    expect(nutTieuDe(banMe).getAttribute("aria-expanded")).toBe("true");
  });
});

function within_(thanh: HTMLElement, ten: string): HTMLButtonElement {
  return [...thanh.querySelectorAll("button")].find((b) => b.textContent?.trim() === ten) as HTMLButtonElement;
}

describe("Mở hết / Gập hết", () => {
  const moHet = () => screen.getByRole("button", { name: CHU_TONG_HOP.nutMoHet });
  const gapHet = () => screen.getByRole("button", { name: CHU_TONG_HOP.nutGapHet });

  it("hai nút có data-khong-in", async () => {
    await chay();
    // data-khong-in đặt trên chính nút hoặc trên tổ tiên gần nhất (thanh chứa chúng)
    expect(moHet().closest("[data-khong-in]")).toBeTruthy();
    expect(gapHet().closest("[data-khong-in]")).toBeTruthy();
  });

  it("Mở hết ⇒ MỌI nút aria-expanded trong mọi bản đều 'true'; Gập hết ⇒ đều 'false'", async () => {
    await chay();
    fireEvent.click(moHet());
    await waitFor(() => {
      const tatCa = ban().flatMap(moRong);
      expect(tatCa.length).toBeGreaterThan(3); // có cả cấp người lẫn cấp cặp
      expect(tatCa.every((n) => n.getAttribute("aria-expanded") === "true")).toBe(true);
    });
    fireEvent.click(gapHet());
    await waitFor(() => {
      const tatCa = ban().flatMap(moRong);
      expect(tatCa.every((n) => n.getAttribute("aria-expanded") === "false")).toBe(true);
    });
  });

  it("Mở hết hai lần liên tiếp sau khi tự tay gập một hàng ⇒ hàng đó mở lại", async () => {
    await chay();
    fireEvent.click(moHet());
    await waitFor(() => expect(nutTieuDe(ban()[0]).getAttribute("aria-expanded")).toBe("true"));
    fireEvent.click(nutTieuDe(ban()[0]));
    expect(nutTieuDe(ban()[0]).getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(moHet());
    await waitFor(() => expect(nutTieuDe(ban()[0]).getAttribute("aria-expanded")).toBe("true"));
  });

  it("khi gập, nội dung chi tiết VẪN nằm trong DOM", async () => {
    await chay();
    const truoc = ban().map((b) => b.textContent ?? "");
    fireEvent.click(gapHet());
    await waitFor(() => expect(nutTieuDe(ban()[0]).getAttribute("aria-expanded")).toBe("false"));
    const sau = ban().map((b) => b.textContent ?? "");
    // không mất chữ nào đáng kể: mỗi bản gập vẫn dài ≥ 90% bản mở
    sau.forEach((s, i) => expect(s.length).toBeGreaterThanOrEqual(truoc[i].length * 0.9));
    for (const b of ban()) {
      const lat = b.querySelector('[data-thu="lat-cat"]')!;
      expect(lat.textContent!.length).toBeGreaterThan(100);
    }
  });
});

describe("Hôm nay thử", () => {
  it("mỗi bản có 'hom-nay-thu' đúng mẫu, gọi tên MỘT người khác, kèm câu việc cụ thể", async () => {
    await chay();
    for (const b of ban()) {
      const chu = b.querySelector('[data-thu="hom-nay-thu"]');
      expect(chu, "thiếu hom-nay-thu").toBeTruthy();
      const tenToi = b.querySelector("h2")!.textContent!;
      const text = chu!.textContent!.replace(/\s+/gu, " ").trim();
      const [dau] = CHU_TONG_HOP.homNayThuVoi.split("{nguoiKia}");
      expect(text.startsWith(dau)).toBe(true);
      const tenKia = TEN.find((t) => text.includes(t) && !tenToi.includes(t));
      expect(tenKia, text).toBeTruthy();
      const viec = text.slice(text.indexOf(tenKia!) + tenKia!.length).replace(/^[\s:–—-]+/u, "");
      expect(viec.length).toBeGreaterThan(20);
      expect(text).not.toMatch(/[{}]/u);
    }
  });

  it("hom-nay-thu nằm trong tiêu đề (nút h2 button) hoặc dòng tóm tắt ngay dưới", async () => {
    await chay();
    for (const b of ban()) {
      const chu = b.querySelector('[data-thu="hom-nay-thu"]')!;
      const o = chu.closest("h2") ?? chu.closest("header") ?? chu.parentElement;
      expect(b.contains(o)).toBe(true);
    }
  });

  it("lát cắt có chỗ lệch có 'hom-nay-thu-cap' chứa nhãn; lát cắt trùng khớp thì không", async () => {
    await chay();
    const lat = [...document.querySelectorAll('[data-thu="lat-cat"]')];
    const lech = lat.filter((l) => l.querySelector("h4"));
    const khop = lat.filter((l) => !l.querySelector("h4"));
    expect(lech.length).toBeGreaterThan(0);
    for (const l of lech) {
      const cap = l.querySelector('[data-thu="hom-nay-thu-cap"]');
      expect(cap).toBeTruthy();
      expect(cap!.textContent).toContain(CHU_TONG_HOP.homNayThu);
    }
    for (const l of khop) expect(l.querySelector('[data-thu="hom-nay-thu-cap"]')).toBeNull();
  });

  it("người không có lát cắt lệch nào ⇒ không có 'hom-nay-thu'", async () => {
    await chay(NHA_GIONG);
    for (const b of ban()) {
      const lech = [...b.querySelectorAll('[data-thu="lat-cat"]')].some((l) => l.querySelector("h4"));
      if (!lech) expect(b.querySelector('[data-thu="hom-nay-thu"]')).toBeNull();
    }
  });
});

describe("toàn trang", () => {
  it("không sót chỗ giữ {…}", async () => {
    await chay();
    await act(async () => {
      await new Promise((r) => setTimeout(r, 300));
    });
    expect(document.body.textContent).not.toMatch(/[{}]/u);
  });

  it("nút chọn người và hai nút mở/gập là <button type=button>, tab được", async () => {
    await chay();
    const nut = [
      ...[...thanhChon()!.querySelectorAll("button")].filter((n) => TEN.includes(n.textContent?.trim() ?? "")),
      screen.getByRole("button", { name: CHU_TONG_HOP.nutMoHet }),
      screen.getByRole("button", { name: CHU_TONG_HOP.nutGapHet }),
    ];
    expect(nut.length).toBe(5);
    for (const n of nut) {
      expect(n.tagName).toBe("BUTTON");
      expect(n.getAttribute("type")).toBe("button");
      expect(n.getAttribute("tabindex")).not.toBe("-1");
    }
  });
});
