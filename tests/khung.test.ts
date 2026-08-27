import { describe, expect, it } from "vitest";

/**
 * Canh chính BỘ CỔNG, không canh nghiệp vụ.
 *
 * Nếu ai đó gỡ jsdom khỏi vitest.config.ts, hoặc gỡ tests/setup.ts, thì mọi test
 * giao diện phía sau sẽ đỏ hàng loạt mà không ai đọc ra nguyên nhân. Hai test này
 * đỏ trước và nói thẳng lý do.
 */
describe("khung kiểm thử", () => {
  it("chạy trong môi trường có DOM (jsdom)", () => {
    expect(typeof document).toBe("object");
    expect(document.createElement("button").tagName).toBe("BUTTON");
  });

  it("đã nạp bộ so khớp của @testing-library/jest-dom", () => {
    const nut = document.createElement("button");
    nut.textContent = "Bắt đầu";
    document.body.appendChild(nut);
    expect(nut).toBeInTheDocument();
    expect(nut).toHaveTextContent("Bắt đầu");
    nut.remove();
  });
});
