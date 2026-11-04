/**
 * CỬA KIỂM GIAO DIỆN thẻ "Sức khoẻ gia đình" (ADR-010, 30.3).
 *
 * 🔴 Mọi người ở đây là BỊA. Hạn mức: 6 người × 3 bản; người thứ 7 buộc chọn xoá một người.
 */

import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CHU_SK } from "../config/suc-khoe-tu-dien";
import { TOI_DA_BAN_MOI_NGUOI, TOI_DA_NGUOI_SUC_KHOE } from "../config/suc-khoe-nguong";
import KhoangSucKhoe from "../app/khoang/suc-khoe/khoang-suc-khoe";
import { xoaSachTatCa } from "../modules/core/luu-tru/kho-bai";
import { khoSucKhoeIndexedDB } from "../modules/core/luu-tru/kho-suc-khoe-idb";

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  cleanup();
  await xoaSachTatCa();
});

function dien(nhan: RegExp | string, giaTri: string) {
  fireEvent.change(screen.getByLabelText(nhan), { target: { value: giaTri } });
}

/** Nhập và lưu một người/một bản qua form thật. */
async function nhapVaLuu(ten: string, canNang: string, ngayDo = "2026-11-03", ngaySinh = "2017-02-20") {
  dien(CHU_SK.form.ten, ten);
  dien(CHU_SK.form.ngaySinh, ngaySinh);
  dien(CHU_SK.form.ngayDo, ngayDo);
  dien(new RegExp(`^${CHU_SK.form.canNang}`), canNang);
  dien(new RegExp(`^${CHU_SK.form.chieuCao}`), "132");
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: CHU_SK.form.luu }));
  });
  // Kho IndexedDB trả lời bất đồng bộ: chờ nút Lưu mở lại (đã xong) rồi mới nhập tiếp,
  // nếu không lần bấm kế tiếp rơi vào lúc nút còn khoá và bị bỏ qua.
  await waitFor(() =>
    expect((screen.getByRole("button", { name: CHU_SK.form.luu }) as HTMLButtonElement).disabled).toBe(false),
  );
}

describe("thẻ sức khoẻ: hiển thị", () => {
  it("có logo, mascot, form, bảng và khung lưu ý; lời lưu ý nằm DƯỚI kết quả", async () => {
    render(<KhoangSucKhoe />);
    expect(screen.getAllByAltText(CHU_SK.hero.altLogo).length).toBeGreaterThan(0);
    expect(screen.getByAltText(CHU_SK.hero.altLinhVat)).toBeTruthy();
    expect(screen.getByRole("heading", { name: CHU_SK.form.tieuDe })).toBeTruthy();
    expect(screen.getByText(CHU_SK.bang.trong)).toBeTruthy();

    const mienTru = screen.getByRole("heading", { name: CHU_SK.mienTru.tieuDe });
    const form = screen.getByRole("heading", { name: CHU_SK.form.tieuDe });
    // Khung lưu ý đứng SAU form trong thứ tự tài liệu (nằm dưới).
    expect(form.compareDocumentPosition(mienTru) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText(/115/u)).toBeTruthy();
  });

  it("Sata Robo xưng là Sata Robo, không còn 'Rô'", () => {
    const { container } = render(<KhoangSucKhoe />);
    expect(container.textContent).toContain("Sata Robo");
    expect(container.textContent).not.toMatch(/\bRô\b/u);
  });
});

describe("thẻ sức khoẻ: nhập và lưu", () => {
  it("lưu một người ⇒ hiện trên bảng, mở sẵn chi tiết bản mới nhất, và nằm trong kho", async () => {
    render(<KhoangSucKhoe />);
    await nhapVaLuu("Bé Bịa", "28");
    await waitFor(() => expect(screen.getByText(CHU_SK.ct.moiNhat)).toBeTruthy());
    expect(screen.getAllByText("Bé Bịa").length).toBeGreaterThan(0);
    const trongKho = await khoSucKhoeIndexedDB.docSo();
    expect(trongKho).toHaveLength(1);
    expect(trongKho[0]!.moc[0]!.canNangKg).toBe(28);
  });

  it("🔴 trẻ em chưa có bảng WHO: KHÔNG bịa 'bình thường', KHÔNG có chữ giảm cân", async () => {
    const { container } = render(<KhoangSucKhoe />);
    await nhapVaLuu("Bé Bịa", "60");
    await waitFor(() => expect(screen.getByText(CHU_SK.ct.moiNhat)).toBeTruthy());
    expect(container.textContent).toContain(CHU_SK.ct.chuaCoBang);
    const chiTiet = container.querySelector('[data-thu="sk-chi-tiet"]')!.textContent ?? "";
    expect(chiTiet).not.toMatch(/giảm cân|béo phì|thừa cân/iu);
  });

  it("số đo vô lý bị từ chối, không lưu gì", async () => {
    render(<KhoangSucKhoe />);
    await nhapVaLuu("Bé Bịa", "900");
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("2–300"));
    expect(await khoSucKhoeIndexedDB.docSo()).toEqual([]);
  });

  it("thiếu tên ⇒ báo lỗi", async () => {
    render(<KhoangSucKhoe />);
    await nhapVaLuu("   ", "28");
    expect(screen.getByRole("alert").textContent).toBe(CHU_SK.loiForm.tenRong);
  });
});

describe("thẻ sức khoẻ: hạn mức", () => {
  it("🔴 bản thứ 4 thay bản cũ nhất của người đó, giữ đúng 3 bản, và BÁO", async () => {
    render(<KhoangSucKhoe />);
    await nhapVaLuu("Bé Bịa", "25", "2026-05-03");
    await nhapVaLuu("Bé Bịa", "26", "2026-08-03");
    await nhapVaLuu("Bé Bịa", "27", "2026-10-03");
    await nhapVaLuu("Bé Bịa", "28", "2026-11-03");
    await waitFor(async () => {
      const k = await khoSucKhoeIndexedDB.docSo();
      expect(k[0]!.moc).toHaveLength(TOI_DA_BAN_MOI_NGUOI);
    });
    const k = await khoSucKhoeIndexedDB.docSo();
    expect(k).toHaveLength(1);
    expect(k[0]!.moc.map((m) => m.canNangKg)).toEqual([28, 27, 26]); // bản 25 kg (cũ nhất) đã mất
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("đã được thay"));
  });

  it("🔴 đủ 6 người, người thứ 7 ⇒ hộp thoại BẮT CHỌN; Huỷ thì không mất gì", async () => {
    render(<KhoangSucKhoe />);
    for (let i = 1; i <= TOI_DA_NGUOI_SUC_KHOE; i++) await nhapVaLuu(`Người ${i}`, "28");
    await waitFor(async () => expect(await khoSucKhoeIndexedDB.docSo()).toHaveLength(6));

    await nhapVaLuu("Người 7", "28");
    const hop = await screen.findByRole("dialog");
    expect(within(hop).getAllByRole("radio")).toHaveLength(6);
    // Chưa ai bị xoá khi hộp thoại còn mở.
    expect(await khoSucKhoeIndexedDB.docSo()).toHaveLength(6);

    fireEvent.click(within(hop).getByRole("button", { name: CHU_SK.hop.huy }));
    expect(screen.queryByRole("dialog")).toBeNull();
    const sau = await khoSucKhoeIndexedDB.docSo();
    expect(sau).toHaveLength(6);
    expect(sau.some((n) => n.ten === "Người 7")).toBe(false);
  });

  it("🔴 chọn một người để xoá rồi xác nhận ⇒ người đó mất, người thứ 7 vào, vẫn đúng 6 người", async () => {
    render(<KhoangSucKhoe />);
    for (let i = 1; i <= TOI_DA_NGUOI_SUC_KHOE; i++) await nhapVaLuu(`Người ${i}`, "28");
    await waitFor(async () => expect(await khoSucKhoeIndexedDB.docSo()).toHaveLength(6));
    await nhapVaLuu("Người 7", "28");
    const hop = await screen.findByRole("dialog");
    const radios = within(hop).getAllByRole("radio");
    fireEvent.click(radios[0]!);
    await act(async () => {
      fireEvent.click(within(hop).getByRole("button", { name: CHU_SK.hop.xoaVaLuu }));
    });
    await waitFor(async () => {
      const k = await khoSucKhoeIndexedDB.docSo();
      expect(k.some((n) => n.ten === "Người 7")).toBe(true);
    });
    const k = await khoSucKhoeIndexedDB.docSo();
    expect(k).toHaveLength(6);
  });
});

describe("thẻ sức khoẻ: bản cũ gập lại, xoá bản / xoá người", () => {
  it("bản mới nhất mở sẵn; bản cũ nằm trong hàng gập đóng sẵn", async () => {
    const { container } = render(<KhoangSucKhoe />);
    await nhapVaLuu("Bé Bịa", "26", "2026-08-03");
    await nhapVaLuu("Bé Bịa", "28", "2026-11-03");
    await waitFor(() => expect(container.querySelectorAll("details.sk-cu-ban").length).toBe(1));
    const cu = container.querySelector("details.sk-cu-ban") as HTMLDetailsElement;
    expect(cu.open).toBe(false);
    expect(screen.getByText(CHU_SK.ct.banCuTieuDe)).toBeTruthy();
  });

  it("xoá người ⇒ hỏi xác nhận rồi xoá khỏi kho", async () => {
    render(<KhoangSucKhoe />);
    await nhapVaLuu("Bé Bịa", "28");
    const nut = await screen.findByRole("button", { name: CHU_SK.ct.xoaNguoi });
    fireEvent.click(nut);
    const hop = await screen.findByRole("dialog");
    await act(async () => {
      fireEvent.click(within(hop).getByRole("button", { name: CHU_SK.hop.xoa }));
    });
    await waitFor(async () => expect(await khoSucKhoeIndexedDB.docSo()).toEqual([]));
  });
});

describe("thẻ sức khoẻ: trích xuất không rò", () => {
  it("không in ra DOM thứ gì ngoài những gì người dùng nhập (không URL ngoài, không script lạ)", async () => {
    const { container } = render(<KhoangSucKhoe />);
    await nhapVaLuu("Bé Bịa", "28");
    await waitFor(() => expect(screen.getByText(CHU_SK.ct.moiNhat)).toBeTruthy());
    expect(container.querySelectorAll("script").length).toBe(0);
    for (const a of Array.from(container.querySelectorAll("a[href]"))) {
      expect(a.getAttribute("href")).toMatch(/^#/u);
    }
  });
});
