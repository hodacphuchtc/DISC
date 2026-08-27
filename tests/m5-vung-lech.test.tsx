import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ManVungLech } from "../app/khoang/vung-lech";
import { CHU_DOI_CHIEU } from "../config/disc-doi-chieu";
import { MA_TRUC, type KetQua, type MaTruc } from "../modules/core/bo-de/kieu";
import { xoaSach } from "../modules/core/luu-tru/kho-bai";
import { doiChieu, type BaiDeGhep } from "../modules/report/doi-chieu";

const hopLe = (diem: Record<MaTruc, number>): KetQua => ({
  hopLe: true,
  diem,
  xepHang: [...MA_TRUC],
  kieu: { loai: "deu" },
  canhBao: [],
});

const bai = (boDe: "THCS" | "QS", diem: Record<MaTruc, number>): BaiDeGhep => ({
  id: boDe,
  boDe,
  maTre: "Bi",
  ketThuc: "2026-08-27T06:00:00+07:00",
  ketQua: hopLe(diem),
  phienBanBoDe: "1.0",
});

const capDayDu = [
  bai("THCS", { D: 80, I: 30, S: 40, C: 55 }),
  bai("QS", { D: 35, I: 70, S: 45, C: 52 }),
];

beforeEach(async () => {
  await xoaSach();
});
afterEach(cleanup);

const ve = (ds: BaiDeGhep[]) =>
  render(
    <ManVungLech
      ketQua={doiChieu(ds, "Bi")}
      maTre="Bi"
      onDong={vi.fn()}
      onLamBo={vi.fn()}
    />,
  );

describe("M5 — vùng lệch", () => {
  it("bảng có đủ bốn hàng trục", () => {
    ve(capDayDu);
    expect(screen.getAllByRole("row")).toHaveLength(5); // 1 hàng tiêu đề + 4 trục
  });

  it("hiện cả điểm con lẫn điểm bố mẹ", () => {
    ve(capDayDu);
    expect(screen.getByText(CHU_DOI_CHIEU.cotCon)).toBeInTheDocument();
    expect(screen.getByText(CHU_DOI_CHIEU.cotBoMe)).toBeInTheDocument();
  });

  it("🔴 diễn giải TỐI ĐA hai trục", () => {
    ve(capDayDu);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(2);
  });

  it("🔴 CÂU KẾT bắt buộc luôn có mặt, nguyên văn", () => {
    ve(capDayDu);
    expect(screen.getByText(CHU_DOI_CHIEU.cauKet)).toBeInTheDocument();
  });

  it("hai góc nhìn khớp hết ⇒ nói ra điều đó, KHÔNG để trống phần diễn giải", () => {
    ve([
      bai("THCS", { D: 50, I: 50, S: 50, C: 50 }),
      bai("QS", { D: 52, I: 48, S: 55, C: 45 }),
    ]);
    expect(screen.queryAllByRole("heading", { level: 2 })).toHaveLength(0);
    expect(screen.getByText(/khớp nhau ở cả bốn nhóm/u)).toBeInTheDocument();
    expect(screen.getByText(CHU_DOI_CHIEU.cauKet)).toBeInTheDocument();
  });
});

describe("🔴 M5 — KHÔNG BAO GIỜ hiện màn hình rỗng", () => {
  it("thiếu bài bố mẹ ⇒ mời làm, nói rõ số câu và thời gian", () => {
    ve([bai("THCS", { D: 80, I: 30, S: 40, C: 55 })]);
    expect(screen.getByText(/Còn thiếu bài của bố mẹ/u)).toBeInTheDocument();
    expect(screen.getByText(/16 câu/u)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: CHU_DOI_CHIEU.nutLamBaiBoMe }),
    ).toBeInTheDocument();
  });

  it("thiếu bài con ⇒ mời con làm", () => {
    ve([bai("QS", { D: 35, I: 70, S: 45, C: 52 })]);
    expect(screen.getByText(/Còn thiếu bài của con/u)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: CHU_DOI_CHIEU.nutLamBaiCon }),
    ).toBeInTheDocument();
  });

  it("chưa có bài nào ⇒ vẫn có chữ và có nút, không phải trang trắng", () => {
    ve([]);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bi");
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("khác phiên bản bộ đề ⇒ giải thích vì sao không đối chiếu được", () => {
    const khac = [{ ...bai("QS", { D: 1, I: 1, S: 1, C: 1 }), phienBanBoDe: "9.9" }];
    ve([bai("THCS", { D: 80, I: 30, S: 40, C: 55 }), ...khac]);
    expect(screen.getByRole("status")).toHaveTextContent(CHU_DOI_CHIEU.khacPhienBan);
  });

  it("hai bài cách nhau quá hạn ⇒ giải thích vì sao", () => {
    const cu = { ...bai("THCS", { D: 80, I: 30, S: 40, C: 55 }), ketThuc: "2026-01-01T06:00:00+07:00" };
    ve([cu, bai("QS", { D: 35, I: 70, S: 45, C: 52 })]);
    expect(screen.getByRole("status")).toHaveTextContent(/quá 60 ngày/u);
  });
});
