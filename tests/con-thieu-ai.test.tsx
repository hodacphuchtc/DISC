import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KhoiConThieuAi, noiTen } from "../app/components/con-thieu-ai";
import { KhoangPhanTich } from "../app/khoang/phan-tich";
import { CHU_MOI, CHU_TONG_HOP } from "../config/disc-tu-dien";
import { demTheoMoc, docPhieu, xoaPhieu } from "../modules/core/do-phieu";
import {
  luuBai,
  luuThanhVien,
  xoaSachTatCa,
} from "../modules/core/luu-tru/kho-bai";
import type { KetQua } from "../modules/core/bo-de/kieu";

/**
 * "CÒN THIẾU AI" + PHỄU MỜI (V3.2 · V3.3).
 *
 * 🔴 ĐÂY LÀ ĐÒN BẨY CỦA `baiThuHai`, KHÔNG PHẢI MÀU SẮC. Câu cũ — *"cần ít nhất 2 người"* —
 * là một điều kiện kỹ thuật, chẳng gợi ai làm gì. Câu mới nêu ĐÍCH DANH người còn thiếu và
 * đặt nút mời ngay cạnh tên họ.
 *
 * 🔴 VÀ PHẢI ĐO ĐƯỢC. `baiThuHai` chỉ có 0 hoặc 1, nên khi nó bằng 0 thì không ai biết là
 * *chưa ai bấm mời* hay *bấm rồi mà người kia không làm* — hai chẩn đoán ngược hẳn nhau.
 * Mốc `bamMoi` tách hai ca đó ra. Không có cặp số này thì kết quả nào cũng đọc ra được
 * thành "cần làm đẹp thêm chút nữa".
 */

const KQ: KetQua = {
  hopLe: true,
  diem: { D: 90, I: 55, S: 35, C: 45 },
  xepHang: ["D", "I", "C", "S"],
  kieu: { loai: "don", truc: "D" },
  canhBao: [],
};

async function them(id: string, ten: string, coBai: boolean, thuTu = 0) {
  await luuThanhVien({
    id,
    ten,
    vaiTro: "me",
    thuTu,
    taoLuc: "2026-08-01T00:00:00.000Z",
    suaLuc: "2026-08-01T00:00:00.000Z",
  });
  if (coBai) {
    await luuBai({
      id: `bai-${id}`,
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
}

const khoi = () => document.querySelector('[data-thu="con-thieu-ai"]');
const nutMoi = () => Array.from(document.querySelectorAll('[data-thu="nut-moi"]'));

beforeEach(async () => {
  await xoaSachTatCa();
  xoaPhieu();
});
afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  await xoaSachTatCa();
  xoaPhieu();
});

describe("noiTen — đọc lên như người nói", () => {
  it("một tên thì để trần", () => {
    expect(noiTen(["Zozo"])).toBe("Zozo");
  });

  it("hai tên nối bằng 'và'", () => {
    expect(noiTen(["Zozo", "Kiki"])).toBe("Zozo và Kiki");
  });

  it("ba tên trở lên: phẩy ở giữa, 'và' ở cuối", () => {
    expect(noiTen(["Zozo", "Kiki", "Momo"])).toBe("Zozo, Kiki và Momo");
  });

  it("rỗng thì trả chuỗi rỗng, không ném", () => {
    expect(noiTen([])).toBe("");
  });
});

describe("khối còn thiếu ai", () => {
  it("không thiếu ai thì KHÔNG bày khối ra", () => {
    render(<KhoiConThieuAi thieu={[]} daDuNguoi />);
    expect(khoi()).toBeNull();
  });

  it("🔴 nêu ĐÍCH DANH người còn thiếu, không nói 'chưa đủ điều kiện'", () => {
    render(
      <KhoiConThieuAi thieu={[{ id: "tv-2", ten: "Kiki" }]} daDuNguoi={false} />,
    );
    expect(khoi()).toHaveTextContent(CHU_MOI.conThieuMot.replace("{ten}", "Kiki"));
    // Và tuyệt đối không còn câu điều kiện kỹ thuật cũ.
    expect(khoi()!.textContent).not.toMatch(/ít nhất 2 người/u);
  });

  it("mỗi người còn thiếu có một nút mời riêng, gọi đúng tên họ", () => {
    render(
      <KhoiConThieuAi
        thieu={[
          { id: "tv-2", ten: "Kiki" },
          { id: "tv-3", ten: "Momo" },
        ]}
        daDuNguoi={false}
      />,
    );
    expect(nutMoi()).toHaveLength(2);
    expect(nutMoi()[0]).toHaveTextContent(CHU_MOI.nutMoi.replace("{ten}", "Kiki"));
    expect(nutMoi()[1]).toHaveTextContent(CHU_MOI.nutMoi.replace("{ten}", "Momo"));
    expect(document.body.textContent).not.toContain("{ten}");
  });

  it("đã đủ người thì đổi giọng — mời cho ĐỦ nhà, không phải mở khoá tính năng", () => {
    render(<KhoiConThieuAi thieu={[{ id: "tv-3", ten: "Momo" }]} daDuNguoi />);
    expect(khoi()).toHaveTextContent(CHU_MOI.themNguaCon.replace("{ds}", "Momo"));
  });
});

describe("🔴 phễu mời — mốc `bamMoi`", () => {
  it("bấm mời ⇒ ghi mốc, ĐẾM SỐ LẦN chứ không phải 'đã từng'", () => {
    render(<KhoiConThieuAi thieu={[{ id: "tv-2", ten: "Kiki" }]} daDuNguoi={false} />);

    fireEvent.click(nutMoi()[0]!);
    fireEvent.click(screen.getByRole("button", { name: CHU_MOI.nutDongHop }));
    fireEvent.click(nutMoi()[0]!);
    fireEvent.click(screen.getByRole("button", { name: CHU_MOI.nutDongHop }));
    fireEvent.click(nutMoi()[0]!);

    // Khác `baiThuHai` vốn chỉ ghi MỘT lần: mốc này phải đếm được cả ba lần bấm.
    expect(demTheoMoc(docPhieu()).bamMoi).toBe(3);
  });

  it("chưa bấm thì mốc bằng 0 — không tự cộng khi chỉ NHÌN thấy khối", () => {
    render(<KhoiConThieuAi thieu={[{ id: "tv-2", ten: "Kiki" }]} daDuNguoi={false} />);
    expect(demTheoMoc(docPhieu()).bamMoi).toBe(0);
  });

  it("ghi mốc NGAY LÚC BẤM, không đợi chép link xong", () => {
    render(<KhoiConThieuAi thieu={[{ id: "tv-2", ten: "Kiki" }]} daDuNguoi={false} />);
    fireEvent.click(nutMoi()[0]!);
    // Cái đáng đo là có bao nhiêu phụ huynh THẬT SỰ ĐỊNH RỦ ai đó, không phải bao nhiêu
    // người bấm trót lọt tới cuối hộp thoại.
    expect(demTheoMoc(docPhieu()).bamMoi).toBe(1);
  });
});

describe("hộp mời", () => {
  it("nói rõ cách người kia gửi kết quả về", () => {
    render(<KhoiConThieuAi thieu={[{ id: "tv-2", ten: "Kiki" }]} daDuNguoi={false} />);
    fireEvent.click(nutMoi()[0]!);
    expect(document.querySelector('[data-thu="hop-moi"]')).toHaveTextContent(
      CHU_MOI.hopThan.replaceAll("{ten}", "Kiki"),
    );
  });

  it("chép link được thì báo đã chép", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
    render(<KhoiConThieuAi thieu={[{ id: "tv-2", ten: "Kiki" }]} daDuNguoi={false} />);
    fireEvent.click(nutMoi()[0]!);
    fireEvent.click(screen.getByRole("button", { name: CHU_MOI.nutChepLink }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        CHU_MOI.daChepLink.replace("{ten}", "Kiki"),
      ),
    );
  });

  it("🔴 trình duyệt CHẶN clipboard ⇒ nói thẳng, không im lặng để họ dán ra rỗng", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("chặn")) },
      configurable: true,
    });
    render(<KhoiConThieuAi thieu={[{ id: "tv-2", ten: "Kiki" }]} daDuNguoi={false} />);
    fireEvent.click(nutMoi()[0]!);
    fireEvent.click(screen.getByRole("button", { name: CHU_MOI.nutChepLink }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(CHU_MOI.loiChepLink),
    );
  });

  it("có lối 'làm ngay trên máy này' khi được cấp", () => {
    const lamNgay = vi.fn();
    render(
      <KhoiConThieuAi
        thieu={[{ id: "tv-2", ten: "Kiki" }]}
        daDuNguoi={false}
        onLamNgay={lamNgay}
      />,
    );
    fireEvent.click(nutMoi()[0]!);
    fireEvent.click(screen.getByRole("button", { name: CHU_MOI.nutLamHo.replace("{ten}", "Kiki") }));
    expect(lamNgay).toHaveBeenCalledWith("tv-2");
  });
});

describe("nối vào bước 3", () => {
  it("🔴 bước 3 nêu đích danh người chưa làm, ngay cạnh nút Phân tích", async () => {
    await them("tv-1", "Zozo", true, 0);
    await them("tv-2", "Kiki", true, 1);
    await them("tv-3", "Momo", false, 2);

    render(<KhoangPhanTich />);
    await waitFor(() => expect(screen.getByText(CHU_TONG_HOP.nutPhanTich)).toBeTruthy());
    await waitFor(() => expect(khoi()).toBeTruthy());

    expect(khoi()).toHaveTextContent("Momo");
    expect(khoi()!.textContent).not.toContain("Zozo");
    expect(khoi()!.getAttribute("data-so-thieu")).toBe("1");
  });

  it("cả nhà làm xong thì khối biến mất — không mời người không tồn tại", async () => {
    await them("tv-1", "Zozo", true, 0);
    await them("tv-2", "Kiki", true, 1);

    render(<KhoangPhanTich />);
    await waitFor(() => expect(screen.getByText(CHU_TONG_HOP.nutPhanTich)).toBeTruthy());
    expect(khoi()).toBeNull();
  });
});
