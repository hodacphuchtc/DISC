import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { KhoangDisc } from "../app/khoang/disc";
import { CHU_CHON, CHU_TRUOC_KHI_BAT_DAU } from "../config/disc-tu-dien";
import { DO_DAI_BIET_DANH_TOI_DA, demKyTu } from "../modules/test/biet-danh";
import { DUONG_M1 } from "./duong-m1";

afterEach(cleanup);

const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));

/** Đi từ M1 tới M2 bằng đường THCS (không có câu hỏi phụ). */
function vaoM2() {
  render(<KhoangDisc />);
  DUONG_M1.THCS();
  bam(CHU_CHON.nutTiepTuc);
}

const oNhap = () => screen.getByLabelText(CHU_TRUOC_KHI_BAT_DAU.nhanO) as HTMLInputElement;
const go = (chu: string) => fireEvent.change(oNhap(), { target: { value: chu } });

describe("M2 — trước khi bắt đầu", () => {
  it("hiện đủ BỐN dòng dặn dò", () => {
    vaoM2();
    for (const d of CHU_TRUOC_KHI_BAT_DAU.danDo) {
      expect(screen.getByText(d.nhan)).toBeInTheDocument();
    }
  });

  it("nói rõ dữ liệu không rời máy — cam kết trung tâm của sản phẩm", () => {
    vaoM2();
    expect(screen.getByText(/không gửi đi đâu/iu)).toBeInTheDocument();
  });

  it("nhập biệt danh rồi bấm Bắt đầu ⇒ sang màn làm bài, mang theo tên", () => {
    vaoM2();
    go("Bi");
    bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bi");
  });

  it("gõ 40 ký tự thì ô chỉ nhận 24", () => {
    vaoM2();
    go("a".repeat(40));
    expect(demKyTu(oNhap().value)).toBe(DO_DAI_BIET_DANH_TOI_DA);
  });

  it("🔴 40 chữ tiếng Việt CÓ DẤU cũng nhận đúng 24, không bị cắt còn 12", () => {
    vaoM2();
    go("ẩ".repeat(40));
    expect(demKyTu(oNhap().value)).toBe(DO_DAI_BIET_DANH_TOI_DA);
  });

  it("toàn khoảng trắng ⇒ KHÔNG đi tiếp, hiện lỗi rõ ràng", () => {
    vaoM2();
    go("      ");
    bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
    expect(screen.getByRole("alert")).toHaveTextContent(CHU_TRUOC_KHI_BAT_DAU.oTrong);
    // Vẫn còn ở M2, chưa sang màn làm bài.
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      CHU_TRUOC_KHI_BAT_DAU.tieuDe,
    );
  });

  it("chưa bấm gì thì CHƯA hiện lỗi — đừng mắng người dùng trước khi họ làm gì", () => {
    vaoM2();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("gõ giống họ tên đầy đủ ⇒ NHẮC nhẹ nhưng KHÔNG chặn", () => {
    vaoM2();
    go("Nguyễn Văn An");
    expect(screen.getByRole("status")).toHaveTextContent(
      CHU_TRUOC_KHI_BAT_DAU.nhacNghiHoTen,
    );
    bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Nguyễn Văn An");
  });

  it("bấm Quay lại ⇒ về màn chọn đối tượng", () => {
    vaoM2();
    bam(new RegExp(CHU_CHON.nutQuayLai, "u"));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(CHU_CHON.tieuDe);
  });

  it("bộ đề đi theo đúng lựa chọn ở M1 — thời gian ước lượng khớp bộ", () => {
    render(<KhoangDisc />);
    DUONG_M1.MN();
    bam(CHU_CHON.nutTiepTuc);
    expect(screen.getByText(/Mầm non · 20 câu/u)).toBeInTheDocument();
    expect(screen.getByText(/Khoảng 5–6 phút/u)).toBeInTheDocument();
  });
});
