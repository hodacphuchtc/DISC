/**
 * `27.3` — radar bốn trục trên màn Kết quả.
 *
 * Radar chỉ là bản NHÌN của số liệu đã có ở biểu đồ cột, nên các luật ở đây giữ nó khỏi
 * trở thành nguồn sự thật thứ hai: ẩn khỏi trình đọc màn hình, không chữ tiếng Anh, đa giác
 * khớp điểm, và còn thấy được khi một trục bằng 0.
 */

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { BieuDoRadar } from "../app/components/bieu-do-radar";
import { MA_TRUC, TRUC } from "../config/disc-tu-dien";

afterEach(cleanup);

const DIEM = { D: 80, I: 50, S: 0, C: 100 } as const;

describe("BieuDoRadar", () => {
  it("ẩn khỏi trình đọc màn hình — bốn số đã có ở biểu đồ cột", () => {
    const { container } = render(<BieuDoRadar diem={DIEM} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
  });

  it("nhãn là tên tiếng Việt của bốn trục, không có tên tiếng Anh", () => {
    const { container } = render(<BieuDoRadar diem={DIEM} />);
    const chu = container.textContent ?? "";
    for (const t of MA_TRUC) {
      expect(chu).toContain(TRUC[t].ten);
      expect(chu).not.toContain(TRUC[t].tenTiengAnh);
    }
  });

  it("đa giác có đúng bốn đỉnh và trục bằng 0 vẫn còn cách tâm (thấy được)", () => {
    const { container } = render(<BieuDoRadar diem={DIEM} />);
    const dagGiac = container.querySelector("polygon[data-radar-da]");
    const dinh = (dagGiac?.getAttribute("points") ?? "").trim().split(" ");
    expect(dinh).toHaveLength(4);
    // S = 0 nằm ở đỉnh thứ ba, thẳng dưới tâm (160,130) — không được trùng tâm.
    const [x, y] = dinh[2].split(",").map(Number);
    expect(x).toBe(160);
    expect(y).toBeGreaterThan(130);
  });

  it("trục ngoài nhóm nổi bật được nhạt đi", () => {
    const { container } = render(<BieuDoRadar diem={DIEM} noiBat={["D"]} />);
    const nhan = [...container.querySelectorAll("text")];
    const theoTen = (ten: string) => nhan.find((n) => n.textContent === ten);
    expect(theoTen(TRUC.D.ten)?.getAttribute("font-weight")).toBe("700");
    expect(theoTen(TRUC.I.ten)?.getAttribute("font-weight")).toBe("500");
  });

  it("điểm vượt khoảng 0–100 không làm đỉnh chạy ra ngoài khung", () => {
    const { container } = render(
      <BieuDoRadar diem={{ D: 250, I: -30, S: 100, C: 100 }} />,
    );
    const dinh = (container.querySelector("polygon[data-radar-da]")?.getAttribute("points") ?? "")
      .trim()
      .split(" ")
      .map((p) => p.split(",").map(Number));
    for (const [x, y] of dinh) {
      expect(x).toBeGreaterThanOrEqual(160 - 80);
      expect(x).toBeLessThanOrEqual(160 + 80);
      expect(y).toBeGreaterThanOrEqual(130 - 80);
      expect(y).toBeLessThanOrEqual(130 + 80);
    }
  });
});
