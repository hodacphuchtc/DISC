import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Trang from "../app/page";
import { CHU_BUOC, CHU_SO_LIEU, MA_BUOC, TEN_KHOANG } from "../config/disc-tu-dien";
import {
  luuBai,
  luuThanhVien,
  xoaSach,
  xoaSachThanhVien,
} from "../modules/core/luu-tru/kho-bai";
import type { KetQua } from "../modules/core/bo-de/kieu";

/**
 * KHUNG NGOÀI — một khoang, ba bước (V2.1).
 *
 * 🔴 File này thay hẳn bộ cũ. Bộ cũ kiểm việc ĐỔI KHOANG trên thanh bên (DISC ↔ Nhà mình
 * ↔ Số liệu) — một hành vi nay **không còn tồn tại**. Sáu cửa đỏ lúc đổi luồng là đỏ ĐÚNG:
 * đặc tả đổi thật. Giữ lại chúng bằng cách sửa vặt sẽ là canh một thứ sản phẩm không làm.
 *
 * Ba luật file này canh:
 *   1. Thanh bên còn ĐÚNG MỘT mục, và nó không phải một nút dẫn đi đâu.
 *   2. Ba bước LUÔN HIỆN RA, kể cả khi chưa mở được — khoá mềm, không giấu.
 *   3. Bước bị khoá nói CÒN THIẾU GÌ, chứ không nói "chưa đủ điều kiện".
 */

const KQ: KetQua = {
  hopLe: true,
  diem: { D: 90, I: 55, S: 35, C: 45 },
  xepHang: ["D", "I", "C", "S"],
  kieu: { loai: "don", truc: "D" },
  canhBao: [],
};

/** Tên bịa, không đụng chữ nào của giao diện. */
const TEN = ["Zozo", "Kiki", "Momo"] as const;

async function themNguoi(i: number, coBai: boolean) {
  const id = `tv-${i}`;
  await luuThanhVien({
    id,
    ten: TEN[i]!,
    vaiTro: "me",
    thuTu: i,
    taoLuc: "2026-08-01T00:00:00.000Z",
    suaLuc: "2026-08-01T00:00:00.000Z",
  });
  if (coBai) {
    await luuBai({
      id: `bai-${i}`,
      boDe: "PH",
      maTre: TEN[i]!,
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

const tam = (ma: string) => document.querySelector(`[data-thu="tam-buoc"][data-buoc="${ma}"]`);
/**
 * 🔴 CHỜ ĐÚNG THỨ MÌNH SẮP KHẲNG ĐỊNH.
 *
 * Chờ mỗi `khung-buoc` là chờ hụt: khung ngoài có ngay từ lần dựng đầu, còn CÁC TẤM chỉ
 * hiện sau khi đếm xong kho. Chờ sai chỗ thì test xanh trên máy rảnh và đỏ lác đác khi máy
 * tải nặng — mỗi lượt một cửa khác nhau, kiểu đỏ khó truy nhất.
 */
const moTrang = async () => {
  render(<Trang />);
  await waitFor(() => expect(tam("nha-minh")).toBeTruthy());
};

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
  window.localStorage.clear();
});
afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
  await xoaSach();
  await xoaSachThanhVien();
});

describe("thanh bên", () => {
  it("còn đúng MỘT mục", async () => {
    await moTrang();
    expect(document.querySelectorAll('[data-thu="muc-khoang"]')).toHaveLength(1);
    expect(document.querySelector('[data-thu="muc-khoang"]')).toHaveTextContent(
      TEN_KHOANG.disc,
    );
  });

  it("🔴 mục đó KHÔNG phải nút — một nút không dẫn tới đâu là lời hứa suông", async () => {
    await moTrang();
    expect(document.querySelector('[data-thu="muc-khoang"]')!.tagName).not.toBe("BUTTON");

    // 🔴 Hỏi TRONG THANH BÊN, không hỏi cả trang. "Nhà mình" nay VẪN là một nút — nhưng
    // là tấm bước 1 trong khung các bước, đúng chỗ của nó. Hỏi cả trang thì cửa kiểm này
    // cấm luôn thứ nó lẽ ra phải cho phép.
    const thanhBen = document.querySelector("aside")!;
    expect(thanhBen.querySelectorAll("button")).toHaveLength(0);
    expect(thanhBen.textContent).not.toContain("Số liệu");
  });
});

describe("hai bước", () => {
  it("cả hai tấm LUÔN hiện ra, kể cả trên máy trống", async () => {
    await moTrang();
    for (const ma of MA_BUOC) {
      expect(tam(ma), `thiếu tấm ${ma}`).toBeTruthy();
    }
  });

  it("🔴 máy trống: bước 2 bị khoá và nói rõ CÒN THIẾU GÌ; bước 1 KHÔNG bao giờ khoá", async () => {
    await moTrang();
    // 🔴 PHẢI `waitFor`. Khung dựng xong TRƯỚC khi đọc kho xong, nên có một khoảnh khắc
    // chưa bước nào bị khoá. Khẳng định ngay lúc đó thì test xanh trên máy rảnh và đỏ khi
    // máy tải nặng — đúng kiểu đỏ giả đã trả giá một lần với `waitFor` đói CPU.
    await waitFor(() => expect(tam("phan-tich")!.getAttribute("data-khoa")).toBe("1"));
    // 🔴 Bước 1 là chỗ DUY NHẤT bắt đầu được. Khoá nó là khoá cả sản phẩm.
    expect(tam("nha-minh")!.getAttribute("data-khoa")).toBeNull();
    // Câu nói phải nêu việc phải làm, không phải "chưa đủ điều kiện".
    expect(tam("phan-tich")).toHaveTextContent(CHU_BUOC.khoaChuaCoAi);
  });

  it("có 1 người: bước 2 vẫn khoá và nói cần thêm mấy người", async () => {
    await themNguoi(0, true);
    await moTrang();
    await waitFor(() => expect(tam("phan-tich")!.getAttribute("data-khoa")).toBe("1"));
    expect(tam("nha-minh")!.getAttribute("data-khoa")).toBeNull();
    expect(tam("phan-tich")).toHaveTextContent(CHU_BUOC.khoaChuaDuHaiNguoi);
  });

  it("có 2 người đã làm xong: cả hai bước cùng mở được", async () => {
    await themNguoi(0, true);
    await themNguoi(1, true);
    await moTrang();
    await waitFor(() => expect(tam("phan-tich")!.getAttribute("data-khoa")).toBeNull());
    for (const ma of MA_BUOC) {
      expect(tam(ma)!.getAttribute("data-khoa"), `bước ${ma} còn khoá`).toBeNull();
    }
  });

  it("🔴 người CÓ TÊN mà CHƯA làm bài thì chưa tính vào bước 2", async () => {
    // Hai người trong sổ nhưng chỉ một người có bài ⇒ không có gì để so với nhau.
    await themNguoi(0, true);
    await themNguoi(1, false);
    await moTrang();
    await waitFor(() => expect(tam("nha-minh")!.getAttribute("data-khoa")).toBeNull());
    expect(tam("phan-tich")!.getAttribute("data-khoa")).toBe("1");
  });

  it("🔴 dòng trạng thái bước 1 mang CẢ HAI tin: mấy người, và còn ai chưa làm", async () => {
    await themNguoi(0, true);
    await themNguoi(1, false);
    await themNguoi(2, false);
    await moTrang();
    // Gộp bước làm bài vào bước 1 mà đánh rơi vế "còn ai chưa làm" là đánh rơi đúng thứ
    // khiến phụ huynh đi nhắc người còn lại — đòn bẩy của cả GĐ14.
    await waitFor(() =>
      expect(tam("nha-minh")).toHaveTextContent(CHU_BUOC.conChuaLam.replace("{so}", "2")),
    );
    expect(tam("nha-minh")).toHaveTextContent(CHU_BUOC.demNguoi.replace("{so}", "3"));
  });

  it("máy trống thì mở sẵn bước 1 — chỗ duy nhất làm được việc", async () => {
    await moTrang();
    await waitFor(() =>
      expect(tam("nha-minh")!.querySelector('[data-thu="than-buoc"]')).toBeTruthy(),
    );
  });
});

describe("màn số liệu ẩn khỏi phụ huynh", () => {
  it("không có tham số thì KHÔNG vào được từ bất kỳ đâu", async () => {
    await moTrang();
    expect(screen.queryByText(CHU_SO_LIEU.tieuDe)).toBeNull();
  });

  it("🔴 `?so-lieu=1` vẫn mở được — cửa đọc `baiThuHai` phải còn", async () => {
    const cu = window.location.search;
    window.history.replaceState({}, "", "/?so-lieu=1");
    try {
      render(<Trang />);
      await waitFor(() => expect(screen.getByText(CHU_SO_LIEU.tieuDe)).toBeTruthy());
      // Và khung các bước phải nhường chỗ, không chồng lên nhau.
      expect(document.querySelector('[data-thu="khung-buoc"]')).toBeNull();
    } finally {
      window.history.replaceState({}, "", cu || "/");
    }
  });
});

describe("localStorage bị chặn (cửa sổ ẩn danh)", () => {
  it("KHÔNG làm hỏng trang — mất khả năng NHỚ, không mất khả năng DÙNG", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Chặn bởi chế độ riêng tư", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Chặn bởi chế độ riêng tư", "SecurityError");
    });

    await moTrang();
    for (const ma of MA_BUOC) {
      expect(tam(ma), `thiếu tấm ${ma}`).toBeTruthy();
    }
  });
});
