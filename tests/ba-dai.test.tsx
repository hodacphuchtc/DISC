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

describe("🔴 11.4 — hai tờ in ra phải nhận ra ngay là của ai", () => {
  const tieuDeCua = (c: HTMLElement, ban: string) =>
    dai(c, ban)?.querySelector('[data-thu="ten-dai"]')?.textContent?.trim() ?? "";

  it("mỗi dải mở đầu bằng một TIÊU ĐỀ mang tên người", async () => {
    const { container } = hien("TH");
    await choXong();

    expect(tieuDeCua(container, "con")).toBe("Bin — bản của em");
    expect(tieuDeCua(container, "boMe")).toBe("Bin — phần dành cho bố mẹ");
  });

  it("tiêu đề là thẻ heading thật, không phải nhãn nhỏ — người đọc màn hình nhảy được", async () => {
    const { container } = hien("TH");
    await choXong();
    const t = dai(container, "con")?.querySelector('[data-thu="ten-dai"]');
    expect(t?.tagName).toBe("H2");
  });

  it("🔴 bộ PH nói 'bản tự đọc', không nói 'bản của bạn'", async () => {
    const { container } = hien("PH");
    await choXong();
    expect(tieuDeCua(container, "tuMinh")).toBe("Bin — bản tự đọc");
  });

  it("🔴 dải bố mẹ MỞ ĐẦU bằng một việc làm được ngay, không bằng biểu đồ", async () => {
    // Trước 11.4 câu này nằm CUỐI dải, lọt trong một lớp bóc sâu đang đóng: thứ duy nhất
    // bố mẹ làm được tối nay lại là thứ phải bấm mở rồi cuộn hết mới thấy.
    const { container } = hien("QS");
    await choXong();

    const d = dai(container, "boMe");
    const viec = d?.querySelector('[data-thu="mot-viec"]');
    expect(viec, "dải bố mẹ phải có khối việc làm được ngay").toBeTruthy();

    // Nó phải đứng TRƯỚC mọi lớp bóc sâu của dải này.
    const lopDau = d?.querySelector("[data-lop-sau]");
    expect(viec!.compareDocumentPosition(lopDau!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("việc làm được ngay KHÔNG bị bọc trong lớp bấm mở", async () => {
    const { container } = hien("QS");
    await choXong();
    const viec = dai(container, "boMe")?.querySelector('[data-thu="mot-viec"]');
    expect(viec?.closest("[data-lop-sau]")).toBeNull();
  });

  it("câu việc-làm-được-ngay chỉ xuất hiện MỘT lần, không nhân đôi khi dời chỗ", async () => {
    const { container } = hien("QS");
    await choXong();
    expect(container.querySelectorAll('[data-thu="mot-viec"]')).toHaveLength(1);
  });
});

describe("🔴 12.5 — chú giải bốn nhóm hiện ra thật trên màn kết quả", () => {
  it("có đủ bốn mục trục, mỗi mục đủ bốn khối", async () => {
    const { container } = hien("TH");
    await choXong();

    const muc = container.querySelectorAll('[data-thu="chu-giai-truc"]');
    expect(muc).toHaveLength(4);
    for (const m of muc) {
      for (const khoi of ["dam", "gia", "nhat", "muon"]) {
        expect(
          m.querySelector(`[data-thu="khoi-${khoi}"]`),
          `trục ${m.getAttribute("data-truc")} thiếu khối ${khoi}`,
        ).toBeTruthy();
      }
    }
  });

  it("bốn trục hiện bốn câu 'mượn cách' KHÁC NHAU trên màn, không lặp", async () => {
    const { container } = hien("TH");
    await choXong();

    const cau = Array.from(container.querySelectorAll('[data-thu="khoi-muon"] p')).map(
      (n) => n.textContent,
    );
    expect(cau).toHaveLength(4);
    expect(new Set(cau).size).toBe(4);
  });

  it("🔴 TÌM CHỮ 'điểm yếu' TRONG CẢ TRANG — không được có", async () => {
    // Đây đúng là câu chủ dự án sẽ tự làm khi nghiệm thu. Làm sẵn.
    hien("TH");
    await choXong();
    expect(document.body.textContent).not.toMatch(/điểm yếu|khuyết điểm|khiếm khuyết/iu);
  });

  it("khối dẫn nguồn có mặt và nói đủ ba điều khó chịu", async () => {
    const { container } = hien("QS");
    await choXong();

    const nguon = container.querySelector('[data-thu="dan-nguon"]');
    expect(nguon).toBeTruthy();
    expect(nguon?.textContent).toMatch(/không tạo ra bài trắc nghiệm nào/iu);
    expect(nguon?.textContent).toMatch(/chưa được chuẩn hoá trên dữ liệu người Việt/iu);
    expect(nguon?.textContent).toMatch(/trò chuyện/iu);
  });
});
