import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { KhoangDisc } from "../app/khoang/disc";
import { CHU_CHON, CHU_LAM_BAI, CHU_TRUOC_KHI_BAT_DAU } from "../config/disc-tu-dien";
import { napBoDe } from "../modules/core/bo-de/nap";
import { DUONG_M1 } from "./duong-m1";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));

/** Vào M3 của một bộ đề. `duong` là chuỗi thao tác ở M1. */
function vaoM3(duong: () => void, bietDanh = "Bi") {
  render(<KhoangDisc />);
  duong();
  bam(CHU_CHON.nutTiepTuc);
  fireEvent.change(screen.getByLabelText(CHU_TRUOC_KHI_BAT_DAU.nhanO), {
    target: { value: bietDanh },
  });
  bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
}

const vaoTHCS = () => vaoM3(DUONG_M1.THCS);
const vaoTieuHoc = () => vaoM3(() => DUONG_M1.TH(4));

/** Trả lời hết các câu đang hiện trên màn, chọn mức thứ `viTri` (đếm từ 0). */
function traLoiTrangNay(viTri: number) {
  const nhom = screen.getAllByRole("radiogroup");
  for (const g of nhom) {
    const nut = Array.from(g.querySelectorAll('[role="radio"]')) as HTMLElement[];
    fireEvent.click(nut[Math.min(viTri, nut.length - 1)]);
  }
}

describe("M3 — hai kiểu trình bày", () => {
  it("bộ Tiểu học: MỘT câu một màn", () => {
    vaoTieuHoc();
    expect(screen.getAllByRole("radiogroup")).toHaveLength(1);
  });

  it("bộ THCS: NĂM câu một màn", () => {
    vaoTHCS();
    expect(screen.getAllByRole("radiogroup")).toHaveLength(5);
  });

  it("bộ Tiểu học dùng thang 3 mức có mặt cười", () => {
    vaoTieuHoc();
    const nut = screen.getAllByRole("radio");
    expect(nut).toHaveLength(3);
    expect(nut.map((n) => n.textContent)).toEqual([
      "🙁Không phải",
      "😐Đôi khi",
      "😀Đúng rồi",
    ]);
  });

  it("có thanh tiến trình, KHÔNG có đồng hồ đếm ngược", () => {
    vaoTHCS();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText(/còn lại|hết giờ|đếm ngược/iu)).toBeNull();
  });

  it("nói rõ đang làm bài của AI — máy dùng chung", () => {
    vaoM3(DUONG_M1.THCS, "Bống");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bống");
  });
});

describe("M3 — điều hướng", () => {
  it("chưa trả lời hết trang thì bấm Tiếp báo thiếu, KHÔNG sang trang", () => {
    vaoTHCS();
    bam(CHU_LAM_BAI.nutTiep);
    expect(screen.getByRole("alert")).toHaveTextContent(CHU_LAM_BAI.conThieu);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("trả lời hết trang rồi bấm Tiếp ⇒ sang trang sau, tiến trình tăng", () => {
    vaoTHCS();
    traLoiTrangNay(3);
    bam(CHU_LAM_BAI.nutTiep);
    // 5/24 ≈ 21%
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "21");
  });

  it("bấm Quay lại ở trang đầu ⇒ về màn dặn dò", () => {
    vaoTHCS();
    bam(CHU_LAM_BAI.nutQuayLai);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      CHU_TRUOC_KHI_BAT_DAU.tieuDe,
    );
  });

  it("dòng động viên hiện sau đúng 5 câu", () => {
    vaoTHCS();
    expect(screen.queryByText(CHU_LAM_BAI.dongVien[0])).toBeNull();
    traLoiTrangNay(3);
    expect(screen.getByText(CHU_LAM_BAI.dongVien[0])).toBeInTheDocument();
  });

  it("trang cuối đổi nút thành Xem kết quả", () => {
    vaoTHCS();
    for (let i = 0; i < 4; i += 1) {
      traLoiTrangNay(3);
      bam(CHU_LAM_BAI.nutTiep);
    }
    expect(screen.getByRole("button", { name: CHU_LAM_BAI.nutXemKetQua })).toBeInTheDocument();
  });
});

describe("M3 → kết quả", () => {
  it("làm trọn bài trả lời thật ⇒ ra bốn con số", () => {
    vaoTHCS();
    const boDe = napBoDe("THCS");
    for (let i = 0; i < 5; i += 1) {
      // Chọn lệch nhau để không rơi vào hàng rào "trả lời phẳng".
      traLoiTrangNay(i % 2 === 0 ? 4 : 0);
      bam(i === 4 ? CHU_LAM_BAI.nutXemKetQua : CHU_LAM_BAI.nutTiep);
    }
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(boDe.ten, { exact: false })).toBeInTheDocument();
  });

  it("🔴 chọn TOÀN MỨC GIỮA cả bài ⇒ KHÔNG ra kết quả, ra lời mời làm lại", () => {
    vaoTHCS();
    for (let i = 0; i < 5; i += 1) {
      traLoiTrangNay(2); // mức 3/5 — mức giữa
      bam(i === 4 ? CHU_LAM_BAI.nutXemKetQua : CHU_LAM_BAI.nutTiep);
    }
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Chưa kết luận được");
    expect(screen.getByText(/hầu hết câu đều ở mức giữa/u)).toBeInTheDocument();
  });
});

describe("M3 — lưu nháp", () => {
  it("làm dở rồi rời trang, quay lại ⇒ mở đúng chỗ đang dở", () => {
    vaoTHCS();
    traLoiTrangNay(3);
    bam(CHU_LAM_BAI.nutTiep);
    traLoiTrangNay(1);
    cleanup();

    vaoTHCS(); // như mở lại tab
    expect(screen.getByText(CHU_LAM_BAI.tiepTucNhap)).toBeInTheDocument();
    // 10/24 ≈ 42%
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
  });

  it("🔴 biệt danh KHÁC ⇒ KHÔNG lấy nháp của người trước", () => {
    vaoTHCS();
    traLoiTrangNay(3);
    cleanup();

    vaoM3(DUONG_M1.THCS, "Bống");
    expect(screen.queryByText(CHU_LAM_BAI.tiepTucNhap)).toBeNull();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
