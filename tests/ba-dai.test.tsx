import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ManKetQua } from "../app/khoang/ket-qua";
import { CHU_BA_BAN, CHU_M4 } from "../config/disc-tu-dien";
import { napBoDe } from "../modules/core/bo-de/nap";
import type { KetQua, MaBoDe } from "../modules/core/bo-de/kieu";
import { xoaSach } from "../modules/core/luu-tru/kho-bai";
import { thayChuThe } from "../modules/report/dien-giai";

/**
 * 🔴 HẠNG MỤC 10.4 — BA DẢI, MỖI DẢI MỘT NGƯỜI ĐỌC.
 *
 * Bộ TH/THCS là chính em học sinh cầm máy làm bài, mà trang kết quả lại chứa cả phần viết
 * cho bố mẹ. Trước GĐ10 phần đó bị CHẶN THẲNG cho bộ TH/THCS — an toàn cho đứa trẻ, nhưng
 * đổi lại phụ huynh của mọi học sinh tiểu học/THCS không đọc được một chữ lời khuyên nào.
 *
 * Cách gỡ: vẫn dựng phần của bố mẹ, nhưng ĐÓNG SẴN sau một dải chắn. Bộ kiểm này canh cả
 * hai phía của cái đánh đổi đó — phần của bố mẹ phải CÓ, và trẻ không được vô tình đọc.
 */

const KQ: KetQua = {
  hopLe: true,
  diem: { D: 90, I: 55, S: 35, C: 45 },
  xepHang: ["D", "I", "C", "S"],
  kieu: { loai: "don", truc: "D" },
  canhBao: [],
};

function hien(ma: MaBoDe) {
  return render(
    <ManKetQua boDe={napBoDe(ma)} bietDanh="Bin" ketQua={KQ} onLamLai={() => {}} />,
  );
}

const choXong = () =>
  waitFor(() => expect(screen.getAllByRole("button").length).toBeGreaterThan(0));

const dai = (c: HTMLElement, ten: string) => c.querySelector(`[data-ban="${ten}"]`);

beforeEach(async () => {
  await xoaSach();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
});

describe("ma trận ba dải — đúng như modules/report/OVERVIEW.md chốt", () => {
  it.each([
    ["MN", { con: false, boMe: true, tuMinh: false }],
    ["QS", { con: false, boMe: true, tuMinh: false }],
    ["TH", { con: true, boMe: true, tuMinh: false }],
    ["THCS", { con: true, boMe: true, tuMinh: false }],
    ["PH", { con: false, boMe: false, tuMinh: true }],
  ] as const)("bộ %s dựng đúng các dải đã khai", async (ma, mong) => {
    const { container } = hien(ma);
    await choXong();
    for (const [ten, phaiCo] of Object.entries(mong)) {
      expect(Boolean(dai(container, ten)), `bộ ${ma} — dải "${ten}"`).toBe(phaiCo);
    }
  });

  it("dải chung luôn có: bốn trục không nói với riêng ai", async () => {
    for (const ma of ["MN", "QS", "TH", "THCS", "PH"] as const) {
      cleanup();
      const { container } = hien(ma);
      await choXong();
      expect(dai(container, "chung"), `bộ ${ma} mất dải chung`).not.toBeNull();
    }
  });
});

describe("🔴 dải chắn — chỉ dựng khi chính đứa trẻ đang cầm máy", () => {
  it.each(["TH", "THCS"] as const)("bộ %s: phần của bố mẹ ĐÓNG SẴN", async (ma) => {
    const { container } = hien(ma);
    await choXong();
    const boMe = dai(container, "boMe");
    expect(boMe, "phụ huynh của em này lại không nhận được gì").not.toBeNull();
    expect(
      boMe!.className,
      "trẻ cầm máy mà cuộn xuống là đọc được đoạn người lớn bàn về mình",
    ).toContain("hidden");
    expect(screen.getByText(CHU_BA_BAN.chanTieuDe)).toBeInTheDocument();
  });

  it("🔴 đóng nhưng VẪN nằm trong DOM — nếu không thì không in được", async () => {
    // Cạm bẫy đã trả giá ở GĐ9: `{mo && <div/>}` làm bản PDF mất đúng phần sâu nhất.
    const { container } = hien("TH");
    await choXong();
    const boMe = dai(container, "boMe");
    expect(boMe!.textContent?.length ?? 0).toBeGreaterThan(200);
  });

  it("bấm qua dải chắn thì phần của bố mẹ mở ra", async () => {
    const { container } = hien("THCS");
    await choXong();
    fireEvent.click(screen.getByRole("button", { name: CHU_BA_BAN.chanNut }));
    expect(dai(container, "boMe")!.className).not.toContain("hidden");
    expect(screen.getByRole("button", { name: CHU_BA_BAN.chanDong })).toBeInTheDocument();
  });

  it.each(["MN", "QS"] as const)(
    "bộ %s: KHÔNG chắn — người lớn cầm máy từ đầu, chắn là chắn nhầm người",
    async (ma) => {
      const { container } = hien(ma);
      await choXong();
      expect(screen.queryByText(CHU_BA_BAN.chanTieuDe)).toBeNull();
      expect(dai(container, "boMe")!.className).not.toContain("hidden");
    },
  );

  it("bộ PH: người lớn đọc về chính mình, không có gì để chắn", async () => {
    hien("PH");
    await choXong();
    expect(screen.queryByText(CHU_BA_BAN.chanTieuDe)).toBeNull();
  });
});

describe("🔴 nút in phải tách theo bản", () => {
  it.each(["TH", "THCS"] as const)("bộ %s: HAI nút in riêng, không còn nút gộp", async (ma) => {
    hien(ma);
    await choXong();
    const nhanCon = thayChuThe(CHU_BA_BAN.nutInCon, ma, "con");
    expect(screen.getByRole("button", { name: nhanCon })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: CHU_BA_BAN.nutInBoMe }),
    ).toBeInTheDocument();
    // Cách hỏng: giữ lại nút gộp thì bố mẹ vẫn in ra tờ giấy có cả hai phần.
    expect(screen.queryByRole("button", { name: CHU_M4.nutTaiPdf })).toBeNull();
  });

  it.each(["MN", "QS", "PH"] as const)(
    "bộ %s: một người đọc thì một nút in",
    async (ma) => {
      hien(ma);
      await choXong();
      expect(screen.getByRole("button", { name: CHU_M4.nutTaiPdf })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: CHU_BA_BAN.nutInBoMe })).toBeNull();
    },
  );
});
