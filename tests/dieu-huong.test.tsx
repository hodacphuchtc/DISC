import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Trang from "../app/page";
import {
  CHU_CHON,
  CHU_LICH_SU,
  KHOA_KHOANG_DANG_MO,
  KHOANG_MAC_DINH,
  chuanHoaMaKhoang,
} from "../config/disc-tu-dien";

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
      CHU_LICH_SU.tieuDe,
    );
  });

  it("bấm đổi khoang thì đổi nội dung và ghi nhớ lại", () => {
    render(<Trang />);
    fireEvent.click(screen.getByRole("button", { name: /Bài đã làm/u }));

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      CHU_LICH_SU.tieuDe,
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
    fireEvent.click(screen.getByRole("button", { name: /Bài đã làm/u }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      CHU_LICH_SU.tieuDe,
    );
  });
});
