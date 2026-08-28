/**
 * KHỐI GIỮ DỮ LIỆU Ở CHÂN TRANG (18.2, 18.3).
 *
 * 🔴 VÌ SAO CẦN FILE NÀY khi `sao-luu-tron-luong.test.tsx` đã soi rất kỹ. File kia canh
 * thứ NẰM TRONG tệp `.zip` — cây thư mục, tên người, PDF. Nó không nói gì về việc ba cái
 * nút ấy ĐỨNG Ở ĐÂU trên màn hình, trông có ra nút không, và bấm vào thì kho có sạch thật
 * không. Ba câu hỏi đó là của file này.
 *
 * 🔴 Mọi tên là BỊA.
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Trang from "../app/page";
import { KhoiGiuDuLieu } from "../app/components/khoi-giu-du-lieu";
import { CHU_M6 } from "../config/disc-tu-dien";
import { MAU } from "../config/thuong-hieu";
import {
  docPhanTich,
  docTatCa,
  docThanhVien,
  luuBai,
  luuPhanTich,
  luuThanhVien,
  xoaSachTatCa,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import type { PhanTichGiaDinh, ThanhVien } from "../modules/core/gia-dinh/kieu";
import { moBuocNhaMinh } from "./duong-vao-bai";

const LUC = "2026-08-28T09:00:00+07:00";

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

/** Hai người, mỗi người một bài, cộng một bản phân tích đã lưu. */
async function dungNha() {
  await luuThanhVien(nguoi(0, "Zozo", "me"));
  await luuThanhVien(nguoi(1, "Kiki", "bo"));
  await luuBai(bai("b0", 0));
  await luuBai(bai("b1", 1));
  await luuPhanTich({
    id: "pt-1",
    maBai: ["b0", "b1"],
    taoLuc: LUC,
    noiDung: [],
  } as unknown as PhanTichGiaDinh);
}

const khoi = () => document.querySelector('[data-thu="giu-du-lieu"]');

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

describe("🔴 nút Xoá sạch phải TRÔNG như một cái nút", () => {
  it("G1 — là `<button>` có VIỀN, nền trắng, cao ≥44px, viền đỏ cảnh báo", async () => {
    render(<KhoiGiuDuLieu />);
    const nut = await screen.findByRole("button", { name: CHU_M6.nutXoaSach });

    expect(nut.tagName).toBe("BUTTON");
    // 🔴 Đây là cả lý do hạng mục tồn tại: bản cũ là `<button>` KHÔNG viền, không nền, nên
    // đứng cạnh hai nút viền tím thì đọc lên như một dòng chữ chú thích.
    expect(nut.className, "nút không viền thì trông như chữ thường").toMatch(/\bborder-/u);
    expect(nut.className, "nền trắng để tách khỏi chữ trần").toContain("bg-white");
    expect(nut.className, "vùng chạm cho ngón tay").toMatch(/min-h-\[44px\]/u);
    expect(nut).toHaveStyle({ borderColor: MAU.doCanhBao });
  });

  it("G3 — chữ trên nút tự nói XOÁ CÁI GÌ và XOÁ Ở ĐÂU", () => {
    // Nút nay ở chân trang, tách khỏi mọi ngữ cảnh, nên tự nó phải nói đủ. Và "dữ liệu"
    // trơn thì mơ hồ: khoang này sẽ nhúng vào app chủ, người đọc có quyền hiểu là xoá cả
    // dữ liệu của app chủ.
    expect(CHU_M6.nutXoaSach, "phải nói xoá cái GÌ").toContain("DISC");
    expect(CHU_M6.nutXoaSach, "và xoá Ở ĐÂU").toContain("máy này");
  });
});

describe("🔴 đủ BA nút, và bấm Xoá là kho sạch thật", () => {
  it("G2 — hàng nút có đủ Sao lưu · Khôi phục · Xoá sạch", async () => {
    render(<KhoiGiuDuLieu />);
    await waitFor(() => expect(khoi()).toBeTruthy());
    const hang = document.querySelector('[data-thu="hang-nut"]')!;

    // 🔴 Đếm bằng `textContent`, KHÔNG bằng `getAllByRole("button")`. Nút *Khôi phục* cố ý
    // là một `<label>` bọc `<input type="file">` — đếm role sẽ ra 2 và cửa đỏ vì một thiết
    // kế đúng.
    for (const chu of [CHU_M6.nutSaoLuu, CHU_M6.nutKhoiPhuc, CHU_M6.nutXoaSach]) {
      expect(hang.textContent, `thiếu nút "${chu}"`).toContain(chu);
    }
    expect(
      hang.querySelector('input[type="file"]'),
      "nút Khôi phục phải là <label> bọc input file",
    ).toBeTruthy();
  });

  it("🔴 G4 — bấm Xoá sạch ⇒ dọn TRỌN BA BẢNG, không chỉ bảng bài", async () => {
    await dungNha();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<KhoiGiuDuLieu />);

    fireEvent.click(await screen.findByRole("button", { name: CHU_M6.nutXoaSach }));

    await waitFor(async () => expect(await docThanhVien()).toHaveLength(0));
    expect(await docTatCa(), "🔴 còn sót BÀI trong máy").toHaveLength(0);
    expect(await docPhanTich(), "🔴 còn sót BẢN PHÂN TÍCH trong máy").toHaveLength(0);
  });

  it("bấm Xoá sạch rồi bấm Huỷ ⇒ KHÔNG đụng gì vào kho", async () => {
    await dungNha();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<KhoiGiuDuLieu />);

    fireEvent.click(await screen.findByRole("button", { name: CHU_M6.nutXoaSach }));

    await waitFor(async () => expect(await docThanhVien()).toHaveLength(2));
    expect(await docTatCa()).toHaveLength(2);
  });
});

describe("🔴 khối nằm NGOÀI cả hai bước, ở chân trang", () => {
  it("G5 — không nằm trong thân bước nào, và đứng SAU tấm bước cuối", async () => {
    await dungNha();
    render(<Trang />);
    // 🔴 Chờ TẤM BƯỚC, không chờ khối. Khối được vẽ ngay từ lượt đầu, còn tấm bước phải
    // đợi đếm kho xong (`dem === null` thì chưa vẽ bước nào — luật của V2.1). Chờ nhầm mốc
    // thì cửa này xanh trên máy rảnh và đỏ khi chạy cả bộ.
    await waitFor(() => expect(document.querySelector('[data-thu="tam-buoc"]')).toBeTruthy());
    await waitFor(() => expect(khoi()).toBeTruthy());
    const k = khoi()!;

    expect(k.closest('[data-thu="than-buoc"]'), "vẫn nằm trong thân một bước").toBeNull();
    expect(k.closest('[data-thu="tam-buoc"]'), "vẫn nằm trong một tấm bước").toBeNull();

    const tam = [...document.querySelectorAll('[data-thu="tam-buoc"]')];
    expect(tam.length).toBeGreaterThan(0);
    expect(
      tam.at(-1)!.compareDocumentPosition(k) & Node.DOCUMENT_POSITION_FOLLOWING,
      "khối phải đứng SAU tấm bước cuối cùng",
    ).toBeTruthy();
  });

  it("🔴 G5b — CHUYỂN qua lại giữa hai bước, khối vẫn nguyên chỗ", async () => {
    await dungNha();
    render(<Trang />);
    await waitFor(() => expect(document.querySelector('[data-thu="tam-buoc"]')).toBeTruthy());
    await waitFor(() => expect(khoi()).toBeTruthy());

    /**
     * 🔴 VÌ SAO KHÔNG THU CẢ HAI BƯỚC LẠI RỒI ĐO. Bản đầu của cửa này làm đúng thế và đỏ —
     * không phải vì khối biến mất, mà vì **bước đang mở không đóng lại được**: bấm đóng
     * làm `dangMo` về `null`, mà `useEffect` tự-mở-hộ ở `cac-buoc.tsx` có `dangMo` trong
     * mảng phụ thuộc nên nó mở lại ngay. Đó là một lỗi CÓ THẬT của sản phẩm, nằm ngoài
     * phạm vi 18.x, và đã ghi lại để xử lý riêng — đừng sửa nó ở đây.
     *
     * Điều cửa này cần khẳng định vẫn khẳng định được: khối không thuộc về thân bước nào,
     * nên đổi bước đang mở thì nó không nhúc nhích.
     */
    const bam = (ma: string) =>
      fireEvent.click(
        document.querySelector(`[data-thu="tam-buoc"][data-buoc="${ma}"]`)!.querySelector("button")!,
      );

    bam("nha-minh");
    await waitFor(() => expect(khoi(), "đổi sang bước 1 thì mất khối").toBeTruthy());
    expect(khoi()!.closest('[data-thu="than-buoc"]')).toBeNull();

    bam("phan-tich");
    await waitFor(() => expect(khoi(), "đổi sang bước 2 thì mất khối").toBeTruthy());
    expect(khoi()!.closest('[data-thu="than-buoc"]')).toBeNull();
  });

  it("G6 — có `data-khong-in`: ba cái nút không được in ra giấy", async () => {
    render(<KhoiGiuDuLieu />);
    await waitFor(() => expect(khoi()).toBeTruthy());
    // Trước 18.2 khối này tình cờ vắng mặt lúc bấm In (KhoangNhaMinh return sớm ở màn kết
    // quả). Nay nó LUÔN có trong DOM, nên phải tự khai mình không thuộc về giấy.
    expect(khoi()!.hasAttribute("data-khong-in")).toBe(true);
  });
});

describe("🔴 xoá sạch trong lúc đang xem kết quả", () => {
  it("G7 — màn kết quả ĐÓNG lại, không để người ta đọc bài vừa bị xoá", async () => {
    await dungNha();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<Trang />);

    await waitFor(() => expect(khoi()).toBeTruthy());
    // Hai người đã xong bài ⇒ khung tự mở BƯỚC 2. Đi qua đường vào dùng chung thay vì tự
    // gõ lại chuỗi thao tác — đúng lý do `duong-vao-bai.ts` tồn tại (bài học 10.6).
    await moBuocNhaMinh();

    // Mở màn kết quả của một người.
    fireEvent.click(screen.getAllByRole("button", { name: /Xem kết quả/u })[0]);
    await waitFor(() =>
      expect(document.querySelector('[data-thu="luoi-thanh-vien"]')).toBeNull(),
    );

    // Rồi xoá sạch từ chân trang.
    fireEvent.click(screen.getByRole("button", { name: CHU_M6.nutXoaSach }));

    // 🔴 Phải quay về lưới thẻ. Không có `key={lanDonKho}` thì màn kết quả đứng nguyên,
    // hiển thị điểm của một bài không còn tồn tại — màn hình nói dối, họ hàng của V3.1.
    // 🔴 Xoá xong còn 0 người, nên thứ quay lại là BẢNG TRỐNG chứ không phải lưới thẻ.
    // Điều cần khẳng định là *màn kết quả đã đóng*, không phải *lưới thẻ đã về*.
    await waitFor(() =>
      expect(
        document.querySelector('[data-thu="bang-trong"]'),
        "🔴 màn kết quả không đóng — đang đọc bài đã bị xoá",
      ).toBeTruthy(),
    );
  });
});
