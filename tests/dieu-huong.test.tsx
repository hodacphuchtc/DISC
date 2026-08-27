import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Trang from "../app/page";
import {
  CHU_BANG_GIA_DINH,
  CHU_CHON,
  KHOA_KHOANG_DANG_MO,
  KHOANG_MAC_DINH,
  TEN_KHOANG,
  chuanHoaMaKhoang,
} from "../config/disc-tu-dien";

/**
 * 🔴 Nhãn mục lấy từ `TEN_KHOANG`, KHÔNG gõ cứng chuỗi.
 *
 * Bản trước gõ thẳng chữ "Bài đã làm" vào ba chỗ. Khi 12.3 đổi mục đó thành "Nhà mình"
 * thì ba cửa kiểm đỏ cùng lúc — đỏ ĐÚNG, nhưng phải sửa ba chỗ cho một thay đổi, đúng
 * bài học đã trả giá ở `tests/duong-m1.ts`. Đọc từ config thì lần sau không ai đỏ.
 */
const NHAN_NHA_MINH = new RegExp(TEN_KHOANG["lich-su"], "u");

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("chuanHoaMaKhoang", () => {
  it("giữ nguyên mã hợp lệ", () => {
    expect(chuanHoaMaKhoang("disc")).toBe("disc");
    expect(chuanHoaMaKhoang("lich-su")).toBe("lich-su");
  });

  it("rơi về mặc định với mọi thứ khác — localStorage là nơi ai cũng sửa được", () => {
    for (const rac of ["", "abc", "DISC", "lich_su", " disc", null, undefined, 7, {}, []]) {
      expect(chuanHoaMaKhoang(rac)).toBe(KHOANG_MAC_DINH);
    }
  });
});

describe("khung ngoài", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("mở khoang mặc định khi máy chưa nhớ gì", () => {
    render(<Trang />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(CHU_CHON.tieuDe);
  });

  it("mã khoang lạ trong localStorage KHÔNG làm hỏng trang", () => {
    window.localStorage.setItem(KHOA_KHOANG_DANG_MO, "khoang-khong-co-that");
    render(<Trang />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(CHU_CHON.tieuDe);
  });

  it("mở lại đúng khoang đã nhớ", () => {
    window.localStorage.setItem(KHOA_KHOANG_DANG_MO, "lich-su");
    render(<Trang />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      CHU_BANG_GIA_DINH.tieuDe,
    );
  });

  it("bấm đổi khoang thì đổi nội dung và ghi nhớ lại", () => {
    render(<Trang />);
    fireEvent.click(screen.getByRole("button", { name: NHAN_NHA_MINH }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      CHU_BANG_GIA_DINH.tieuDe,
    );
    expect(window.localStorage.getItem(KHOA_KHOANG_DANG_MO)).toBe("lich-su");
  });

  it("đánh dấu aria-current cho đúng một mục đang mở", () => {
    render(<Trang />);
    const dangMo = screen
      .getAllByRole("button")
      .filter((n) => n.getAttribute("aria-current") === "page");
    expect(dangMo).toHaveLength(1);
    expect(dangMo[0]).toHaveTextContent("DISC");
  });

  it("localStorage bị chặn (cửa sổ ẩn danh) KHÔNG làm hỏng trang", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Chặn bởi chế độ riêng tư", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Chặn bởi chế độ riêng tư", "SecurityError");
    });

    render(<Trang />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(CHU_CHON.tieuDe);

    // Vẫn phải đổi khoang được — chỉ mất khả năng NHỚ, không mất khả năng DÙNG.
    fireEvent.click(screen.getByRole("button", { name: NHAN_NHA_MINH }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      CHU_BANG_GIA_DINH.tieuDe,
    );
  });
});
