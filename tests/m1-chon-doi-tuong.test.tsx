import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { KhoangDisc } from "../app/khoang/disc";
import { CHU_CHON } from "../config/disc-tu-dien";

afterEach(cleanup);

const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));

describe("M1 — chọn đối tượng", () => {
  it("chưa chọn gì thì chưa hiện bộ đề nào", () => {
    render(<KhoangDisc />);
    expect(screen.queryByText(/^Bộ đề:/u)).toBeNull();
  });

  it("Tiểu học → Lớp 2 ⇒ HIỆN hộp giải thích và vào bản quan sát", () => {
    render(<KhoangDisc />);
    bam(/^Tiểu học/u);
    bam("Lớp 2");
    expect(screen.getByRole("status")).toHaveTextContent(CHU_CHON.giaiThichLop12.tieuDe);
    expect(screen.getByText(/^Bộ đề: Mầm non/u)).toBeInTheDocument();
    expect(screen.queryByText(/^Bộ đề: Tiểu học/u)).toBeNull();
  });

  it("Tiểu học → Lớp 4 ⇒ vào bộ Tiểu học, KHÔNG có hộp giải thích", () => {
    render(<KhoangDisc />);
    bam(/^Tiểu học/u);
    bam("Lớp 4");
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByText(/^Bộ đề: Tiểu học/u)).toBeInTheDocument();
  });

  it("🔴 HỒI QUY: chọn lớp xong, hàng nút chọn lớp VẪN CÒN để đổi ý được", () => {
    render(<KhoangDisc />);
    bam(/^Tiểu học/u);
    bam("Lớp 2");
    // Lỗi cũ: fieldset chọn lớp biến mất ngay khi đã đủ thông tin định tuyến,
    // người dùng muốn đổi lớp phải bấm lại "Tiểu học" từ đầu.
    expect(screen.getByRole("button", { name: "Lớp 4" })).toBeInTheDocument();
    bam("Lớp 4");
    expect(screen.getByText(/^Bộ đề: Tiểu học/u)).toBeInTheDocument();
  });

  it("Phụ huynh → về chính mình ⇒ bộ Phụ huynh, không hỏi tuổi con", () => {
    render(<KhoangDisc />);
    bam(/^Phụ huynh/u);
    bam(CHU_CHON.mucTieuToi);
    expect(screen.getByText(/^Bộ đề: Phụ huynh/u)).toBeInTheDocument();
    expect(screen.queryByText(CHU_CHON.hoiTuoiCon)).toBeNull();
  });

  it("Phụ huynh → về con → 6 tuổi ⇒ chuyển bản quan sát KÈM giải thích", () => {
    render(<KhoangDisc />);
    bam(/^Phụ huynh/u);
    bam(CHU_CHON.mucTieuCon);
    bam("6");
    expect(screen.getByRole("status")).toHaveTextContent(CHU_CHON.giaiThichConDuoi8.tieuDe);
    expect(screen.getByText(/^Bộ đề: Mầm non/u)).toBeInTheDocument();
  });

  it("Phụ huynh → về con → 10 tuổi ⇒ bộ Bố mẹ nhìn con", () => {
    render(<KhoangDisc />);
    bam(/^Phụ huynh/u);
    bam(CHU_CHON.mucTieuCon);
    bam("10");
    expect(screen.getByText(/^Bộ đề: Bố mẹ nhìn con/u)).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("đổi đối tượng thì XOÁ sạch lựa chọn cũ, không dính lớp của lần trước", () => {
    render(<KhoangDisc />);
    bam(/^Tiểu học/u);
    bam("Lớp 4");
    bam(/^Mầm non/u);
    expect(screen.getByText(/^Bộ đề: Mầm non/u)).toBeInTheDocument();
    bam(/^Tiểu học/u);
    // Quay lại Tiểu học: phải hỏi lớp lại, chưa được ra bộ đề nào.
    expect(screen.queryByText(/^Bộ đề:/u)).toBeNull();
  });
});
