import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { KhoangDisc } from "../app/khoang/disc";
import { LOP_CUOI_TIEU_HOC, LOP_LON_NHAT, LOP_NHO_NHAT } from "../config/disc-nguong";
import { CHU_CHON, NHANH_CAM_MAY } from "../config/disc-tu-dien";
import { TUOI_TU_DANH_GIA_TOI_THIEU } from "../modules/test/dinh-tuyen";
import { DUONG_M1, NHANH_M1, nhanLop } from "./duong-m1";

afterEach(cleanup);

const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));

const moM1 = () => render(<KhoangDisc />);
const boDeDangHien = () => screen.queryByText(/^Bộ đề:/u)?.textContent ?? null;

/**
 * 🔴 HẠNG MỤC 10.6 — MÀN 1 HỎI "AI ĐANG CẦM MÁY".
 *
 * Bản cũ bày bốn thẻ trộn hai câu hỏi: ba thẻ nói về NGƯỜI ĐƯỢC ĐÁNH GIÁ (Mầm non · Tiểu
 * học · THCS), thẻ thứ tư nói về NGƯỜI TRẢ LỜI (Phụ huynh). Bố mẹ của một bé lớp 1 vì thế
 * có HAI cửa cùng dẫn tới bộ Mầm non, và phải đoán xem cửa nào là cửa dành cho mình.
 *
 * `dinhTuyen()` KHÔNG đổi một dòng nào — `tests/dinh-tuyen.test.ts` vẫn canh nguyên luật
 * ADR-002. Đổi ở đây chỉ là cách THU THẬP đầu vào.
 */
describe("M1 — hai nhánh theo người cầm máy", () => {
  it("chưa chọn gì thì chưa hiện bộ đề nào", () => {
    moM1();
    expect(boDeDangHien()).toBeNull();
  });

  it("chỉ có ĐÚNG HAI thẻ nhánh, không còn bày bộ đề ra chọn", () => {
    moM1();
    for (const ma of ["hoc-sinh", "nguoi-lon"] as const) {
      expect(screen.getByRole("button", { name: new RegExp("^" + NHANH_CAM_MAY[ma].ten, "u") }))
        .toBeInTheDocument();
    }
    // Cách hỏng cũ: tên bộ đề nằm ngay trên thẻ chọn, nên người dùng phải tự biết con mình
    // "thuộc bộ nào" trước khi máy kịp hỏi gì.
    for (const cu of [/^Mầm non/u, /^Trung học cơ sở/u]) {
      expect(screen.queryByRole("button", { name: cu }), String(cu)).toBeNull();
    }
  });
});

describe("nhánh em học sinh — lớp hỏi ĐÚNG MỘT LẦN cho cả hai cấp", () => {
  it("hàng lớp trải trọn " + LOP_NHO_NHAT + "–" + LOP_LON_NHAT + ", không bắt chọn cấp trước", () => {
    moM1();
    bam(NHANH_M1.hocSinh);
    for (const l of [LOP_NHO_NHAT, LOP_CUOI_TIEU_HOC, LOP_CUOI_TIEU_HOC + 1, LOP_LON_NHAT]) {
      expect(screen.getByRole("button", { name: nhanLop(l) }), nhanLop(l)).toBeInTheDocument();
    }
    // Em lớp 5 và em lớp 6 không phải tự phân loại mình trước khi máy hỏi.
    expect(screen.queryByText(CHU_CHON.hoiMucTieu)).toBeNull();
  });

  it.each([1, 2])("lớp %i ⇒ chuyển bản quan sát KÈM giải thích, không im lặng", (l) => {
    moM1();
    DUONG_M1.TH(l);
    expect(screen.getByRole("status")).toHaveTextContent(CHU_CHON.giaiThichLop12.tieuDe);
    expect(boDeDangHien()).toMatch(/^Bộ đề: Mầm non/u);
  });

  it.each([3, 4, 5])("lớp %i ⇒ bộ Tiểu học, KHÔNG hộp giải thích", (l) => {
    moM1();
    DUONG_M1.TH(l);
    expect(screen.queryByRole("status")).toBeNull();
    expect(boDeDangHien()).toMatch(/^Bộ đề: Tiểu học/u);
  });

  it.each([6, 7, 8, 9])("lớp %i ⇒ bộ THCS", (l) => {
    moM1();
    DUONG_M1.THCS(l);
    expect(boDeDangHien()).toMatch(/^Bộ đề: Trung học cơ sở/u);
  });

  it("🔴 HỒI QUY: chọn lớp xong, hàng nút chọn lớp VẪN CÒN để đổi ý được", () => {
    moM1();
    DUONG_M1.TH(2);
    // Lỗi cũ: fieldset chọn lớp biến mất ngay khi đã đủ thông tin định tuyến.
    expect(screen.getByRole("button", { name: nhanLop(4) })).toBeInTheDocument();
    bam(nhanLop(4));
    expect(boDeDangHien()).toMatch(/^Bộ đề: Tiểu học/u);
  });

  it("nhánh học sinh KHÔNG bao giờ hỏi tuổi — lớp 4 có cả bé 9 lẫn bé 10", () => {
    moM1();
    DUONG_M1.TH(4);
    expect(screen.queryByText(CHU_CHON.hoiTuoiCon)).toBeNull();
  });
});

describe("nhánh bố mẹ / thầy cô", () => {
  it("về chính mình ⇒ bộ Phụ huynh, không hỏi tuổi con", () => {
    moM1();
    DUONG_M1.PH();
    expect(boDeDangHien()).toMatch(/^Bộ đề: Phụ huynh/u);
    expect(screen.queryByText(CHU_CHON.hoiTuoiCon)).toBeNull();
  });

  it.each([3, 5, 7])("về con %i tuổi ⇒ bản quan sát KÈM giải thích", (t) => {
    moM1();
    DUONG_M1.MN(t);
    expect(screen.getByRole("status")).toHaveTextContent(CHU_CHON.giaiThichConDuoi8.tieuDe);
    expect(boDeDangHien()).toMatch(/^Bộ đề: Mầm non/u);
  });

  it.each([TUOI_TU_DANH_GIA_TOI_THIEU, 10, 15])("về con %i tuổi ⇒ bộ Bố mẹ nhìn con", (t) => {
    moM1();
    DUONG_M1.QS(t);
    expect(boDeDangHien()).toMatch(/^Bộ đề: Bố mẹ nhìn con/u);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("nhánh bố mẹ KHÔNG bao giờ hỏi lớp — chỉ hỏi tuổi, và hỏi một lần", () => {
    moM1();
    DUONG_M1.QS(10);
    expect(screen.queryByText(CHU_CHON.hoiLop)).toBeNull();
    expect(screen.getByText(CHU_CHON.hoiTuoiCon)).toBeInTheDocument();
  });
});

describe("🔴 mỗi bộ đề ĐÚNG MỘT CỬA — đây là cả lý do 10.6 tồn tại", () => {
  it("bộ Mầm non KHÔNG còn cửa trực tiếp nào để bấm vào", () => {
    moM1();
    // Trước 10.6: thẻ "Mầm non" bấm phát ra ngay bộ MN. Nay bộ này chỉ tới được bằng
    // đường CHUYỂN HƯỚNG, và mọi chuyển hướng đều kèm hộp giải thích — không có cửa nào
    // đưa một đứa trẻ vào bản quan sát mà không nói vì sao.
    bam(NHANH_M1.hocSinh);
    expect(boDeDangHien()).toBeNull();
    bam(nhanLop(1));
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("hai đường tới bộ Mầm non đều là chuyển hướng, và mỗi đường nói một lý do khác nhau", () => {
    moM1();
    DUONG_M1.TH(1);
    const lyDoHocSinh = screen.getByRole("status").textContent;
    cleanup();

    moM1();
    DUONG_M1.MN(4);
    const lyDoBoMe = screen.getByRole("status").textContent;

    expect(lyDoHocSinh).not.toBe(lyDoBoMe);
  });

  it("đổi nhánh thì XOÁ sạch lựa chọn cũ, không dính lớp của lần trước", () => {
    moM1();
    DUONG_M1.TH(4);
    expect(boDeDangHien()).toMatch(/^Bộ đề: Tiểu học/u);

    bam(NHANH_M1.nguoiLon);
    expect(boDeDangHien(), "còn dính bộ đề của nhánh trước").toBeNull();

    bam(NHANH_M1.hocSinh);
    expect(boDeDangHien(), "quay lại nhánh học sinh mà lớp cũ vẫn còn").toBeNull();
  });
});
