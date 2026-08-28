import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { KhoangLichSu } from "../cu/lich-su";
import { CHU_M6 } from "../config/disc-tu-dien";
import { luuBai, xoaSach, type BaiLamLuu } from "../modules/core/luu-tru/kho-bai";

const bai = (ghiDe: Partial<BaiLamLuu> = {}): BaiLamLuu => ({
  id: "id-1",
  boDe: "THCS",
  maTre: "Bi",
  nguoiTraLoi: "tre",
  batDau: "2026-08-27T06:00:00+07:00",
  ketThuc: "2026-08-27T06:08:00+07:00",
  traLoi: { "THCS-D1": 4 },
  ketQua: {
    hopLe: true,
    diem: { D: 70, I: 30, S: 25, C: 40 },
    xepHang: ["D", "C", "I", "S"],
    kieu: { loai: "don", truc: "D" },
    canhBao: [],
  },
  phienBanBoDe: "1.0",
  ...ghiDe,
});

beforeEach(async () => {
  await xoaSach();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
});

describe("M6 — bài đã làm", () => {
  it("kho rỗng ⇒ hiện lời mời làm bài, KHÔNG hiện màn hình trắng", async () => {
    render(<KhoangLichSu />);
    expect(await screen.findByText(CHU_M6.trong)).toBeInTheDocument();
    expect(screen.getByText(CHU_M6.trongMoi)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: CHU_M6.nutSaoLuu })).toBeNull();
  });

  it("liệt kê bài theo bộ đề và biệt danh, ngày dạng dd/mm/yyyy", async () => {
    await luuBai(bai());
    render(<KhoangLichSu />);
    expect(await screen.findByText(/Trung học cơ sở · Bi/u)).toBeInTheDocument();
    expect(screen.getByText(/27\/08\/2026/u)).toBeInTheDocument();
  });

  it("bài mới nhất lên đầu", async () => {
    await luuBai(bai({ id: "cu", maTre: "Cũ", ketThuc: "2026-08-20T06:00:00+07:00" }));
    await luuBai(bai({ id: "moi", maTre: "Mới", ketThuc: "2026-08-27T06:00:00+07:00" }));
    render(<KhoangLichSu />);
    await screen.findByText(/Mới/u);
    const dong = screen.getAllByRole("listitem").map((n) => n.textContent ?? "");
    expect(dong[0]).toContain("Mới");
    expect(dong[1]).toContain("Cũ");
  });

  it("tóm tắt đúng kiểu: đơn, pha, đều, và bài không hợp lệ", async () => {
    await luuBai(bai({ id: "a", maTre: "A" }));
    await luuBai(
      bai({
        id: "b",
        maTre: "B",
        ketQua: {
          hopLe: true,
          diem: { D: 60, I: 58, S: 20, C: 20 },
          xepHang: ["D", "I", "S", "C"],
          kieu: { loai: "pha", cap: ["D", "I"] },
          canhBao: [],
        },
      }),
    );
    await luuBai(bai({ id: "c", maTre: "C", ketQua: { hopLe: false, lyDo: "PHANG" } }));

    render(<KhoangLichSu />);
    await screen.findByText(/· A/u);
    expect(screen.getByText(/^Chủ động ·/u)).toBeInTheDocument();
    expect(screen.getByText(/^Chủ động \+ Ảnh hưởng ·/u)).toBeInTheDocument();
    expect(screen.getByText(/^Chưa kết luận được ·/u)).toBeInTheDocument();
  });

  it("🔴 QĐ7: quá 3 biệt danh khác nhau ⇒ nhắc máy dùng chung", async () => {
    for (const [i, ten] of ["Bi", "Bống", "Cún", "Tí"].entries()) {
      await luuBai(bai({ id: `id-${i}`, maTre: ten }));
    }
    render(<KhoangLichSu />);
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(/4 người khác nhau/u),
    );
  });

  it("đúng 3 biệt danh thì CHƯA nhắc — ngưỡng là 'quá 3'", async () => {
    for (const [i, ten] of ["Bi", "Bống", "Cún"].entries()) {
      await luuBai(bai({ id: `id-${i}`, maTre: ten }));
    }
    render(<KhoangLichSu />);
    await screen.findByText(/· Cún/u);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("có nút sao lưu và nút xoá sạch khi kho có bài", async () => {
    await luuBai(bai());
    render(<KhoangLichSu />);
    expect(await screen.findByRole("button", { name: CHU_M6.nutSaoLuu })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: CHU_M6.nutXoaSach })).toBeInTheDocument();
  });

  it("luôn nhắc rằng xoá dữ liệu duyệt web là mất", async () => {
    await luuBai(bai());
    render(<KhoangLichSu />);
    expect(await screen.findByText(CHU_M6.nhacMatDuLieu)).toBeInTheDocument();
  });
});
