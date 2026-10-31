/**
 * Hàng gập: gọn trước, chi tiết sau — và KHÔNG làm mất nội dung khi in.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { KhoiGap } from "../app/components/khoi-gap";

afterEach(cleanup);

describe("KhoiGap", () => {
  it("mặc định GẬP: nút aria-expanded=false, tóm tắt vẫn thấy", () => {
    render(
      <KhoiGap tieuDe="Lời khuyên dành cho Mai" tomTat="Khi ở cạnh Bình">
        <p>Chi tiết rất dài</p>
      </KhoiGap>,
    );
    expect(screen.getByRole("button", { name: /Lời khuyên dành cho Mai/u }).getAttribute("aria-expanded")).toBe("false");
    expect(screen.getByText("Khi ở cạnh Bình")).toBeTruthy();
  });

  it("🔴 nội dung LUÔN nằm trong DOM khi gập (bản in mở được), chỉ bị ẩn bằng CSS", () => {
    const { container } = render(
      <KhoiGap tieuDe="T">
        <p>Chi tiết rất dài</p>
      </KhoiGap>,
    );
    const noiDung = container.querySelector("[data-lop-sau]")!;
    expect(noiDung.textContent).toContain("Chi tiết rất dài");
    expect(noiDung.className).toContain("hidden");
  });

  it("bấm ⇒ xổ xuống; bấm lần nữa ⇒ gập lại", () => {
    const { container } = render(
      <KhoiGap tieuDe="T">
        <p>Chi tiết</p>
      </KhoiGap>,
    );
    const nut = screen.getByRole("button", { name: "T" });
    fireEvent.click(nut);
    expect(nut.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector("[data-lop-sau]")!.className).not.toContain("hidden");
    fireEvent.click(nut);
    expect(nut.getAttribute("aria-expanded")).toBe("false");
  });

  it("nút trỏ đúng vùng nội dung bằng aria-controls", () => {
    const { container } = render(
      <KhoiGap tieuDe="T">
        <p>x</p>
      </KhoiGap>,
    );
    const nut = screen.getByRole("button", { name: "T" });
    expect(container.querySelector(`#${CSS.escape(nut.getAttribute("aria-controls")!)}`)).toBeTruthy();
  });

  it("🔴 tiêu đề là heading chứa nút, và textContent của heading chỉ có đúng tiêu đề", () => {
    render(
      <KhoiGap tieuDe="Lời khuyên dành cho Mai" capTieuDe={2}>
        <p>x</p>
      </KhoiGap>,
    );
    const h = screen.getByRole("heading", { level: 2 });
    expect(h.textContent).toBe("Lời khuyên dành cho Mai");
    expect(h.querySelector("button")).toBeTruthy();
  });

  it("kiểu tối dùng mảng nhấn tối; mũi tên ẩn khi in (data-khong-in) nhưng chữ thì không", () => {
    const { container } = render(
      <KhoiGap tieuDe="T" kieu="toi">
        <p>x</p>
      </KhoiGap>,
    );
    expect(container.querySelector("[data-nhan-toi]")).toBeTruthy();
    expect(container.querySelector("svg")?.parentElement?.hasAttribute("data-khong-in")).toBe(true);
    expect(container.querySelector("h3 [data-khong-in], h2 [data-khong-in]")?.textContent).toBe("");
  });

  it("moSan ⇒ mở sẵn", () => {
    const { container } = render(
      <KhoiGap tieuDe="T" moSan>
        <p>x</p>
      </KhoiGap>,
    );
    expect(container.querySelector("[data-lop-sau]")!.className).not.toContain("hidden");
  });
});
