import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KhoangBangGiaDinh } from "../app/khoang/bang-gia-dinh";
import { CHU_VAI, GIOI_HAN_BAI_MOI_NGUOI } from "../config/disc-gia-dinh";
import { CHU_BANG_GIA_DINH } from "../config/disc-tu-dien";
import {
  docTatCa,
  docThanhVien,
  luuBai,
  luuThanhVien,
  xoaSach,
  xoaSachThanhVien,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";

/**
 * BẢNG GIA ĐÌNH (12.3).
 *
 * 🔴 Cửa kiểm nặng nhất ở đây là **xoá một người mà KHÔNG mất bài**. Đó là đường mất dữ
 * liệu nhanh nhất trong cả sản phẩm: một cú bấm, một câu hỏi trả lời vội, và bài của một
 * đứa trẻ đi mất không lấy lại được.
 *
 * 🔴 Mọi tên là BỊA.
 */

const LUC = "2026-08-27T06:30:00+07:00";

let dem = 0;
const bai = (ghiDe: Partial<BaiLamLuu> = {}): BaiLamLuu => {
  dem += 1;
  return {
    id: `bai-${dem}`,
    boDe: "THCS",
    maTre: "Zozo",
    nguoiTraLoi: "tre",
    batDau: LUC,
    ketThuc: LUC,
    traLoi: { "THCS-D1": 4 },
    ketQua: {
      hopLe: true,
      diem: { D: 62.5, I: 41.7, S: 33.3, C: 70.8 },
      xepHang: ["C", "D", "I", "S"],
      kieu: { loai: "don", truc: "C" },
      canhBao: [],
    },
    phienBanBoDe: "1.1",
    ...ghiDe,
  };
};

const nguoi = (id: string, ten: string, thuTu = 0) => ({
  id,
  ten,
  vaiTro: "con" as const,
  thuTu,
  taoLuc: LUC,
  suaLuc: LUC,
});

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
  window.localStorage.clear();
});
afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  await xoaSach();
  await xoaSachThanhVien();
});

const the = () => Array.from(document.querySelectorAll('[data-thu="the-thanh-vien"]'));
const choXong = () =>
  waitFor(() => expect(document.querySelector('[data-thu="thong-diep-chinh"]')).toBeTruthy());

async function moBang(props: Record<string, unknown> = {}) {
  render(<KhoangBangGiaDinh {...props} />);
  await choXong();
  await waitFor(() =>
    expect(
      document.querySelector('[data-thu="luoi-thanh-vien"]') ??
        document.querySelector('[data-thu="bang-trong"]'),
    ).toBeTruthy(),
  );
}

describe("bảng trống", () => {
  it("mời thêm người đầu tiên, không hiện lưới rỗng", async () => {
    await moBang();
    expect(screen.getByText(CHU_BANG_GIA_DINH.trong)).toBeTruthy();
    expect(the()).toHaveLength(0);
  });
});

describe("thêm / sửa người", () => {
  it("thêm một người thì hiện đúng một thẻ", async () => {
    await moBang();
    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutThem }));
    fireEvent.change(screen.getByLabelText(CHU_BANG_GIA_DINH.nhanTen), {
      target: { value: "Zozo" },
    });
    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLuu }));

    await waitFor(() => expect(the()).toHaveLength(1));
    expect(the()[0].getAttribute("data-ten")).toBe("Zozo");
    expect(await docThanhVien()).toHaveLength(1);
  });

  it("để trống tên thì KHÔNG lưu, và nói ra vì sao", async () => {
    await moBang();
    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutThem }));
    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLuu }));

    expect(screen.getByRole("alert")).toHaveTextContent(CHU_BANG_GIA_DINH.loiThieuTen);
    expect(await docThanhVien()).toHaveLength(0);
  });

  it("🔴 trùng tên trong nhà thì chặn — một bảng hai 'Zozo' là vô dụng", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await moBang();

    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutThem }));
    fireEvent.change(screen.getByLabelText(CHU_BANG_GIA_DINH.nhanTen), {
      target: { value: " zozo " },
    });
    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLuu }));

    expect(screen.getByRole("alert")).toHaveTextContent(CHU_BANG_GIA_DINH.loiTrungTen);
    expect(await docThanhVien()).toHaveLength(1);
  });

  it("sửa tên một người thì thẻ đổi theo, không đẻ thêm thẻ", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await moBang();

    fireEvent.click(screen.getAllByRole("button", { name: CHU_BANG_GIA_DINH.nutSua })[0]);
    fireEvent.change(screen.getByLabelText(CHU_BANG_GIA_DINH.nhanTen), {
      target: { value: "Kiki" },
    });
    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLuu }));

    await waitFor(() => expect(the()[0].getAttribute("data-ten")).toBe("Kiki"));
    expect(await docThanhVien()).toHaveLength(1);
  });
});

describe("🔴 xoá người — GIỮ BÀI là mặc định", () => {
  it("chọn giữ bài: người mất, BÀI CÒN NGUYÊN và về mục chưa xếp", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await moBang();

    fireEvent.click(screen.getAllByRole("button", { name: CHU_BANG_GIA_DINH.nutXoa })[0]);
    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.hoiXoaGiuBai }));

    await waitFor(() => expect(the()).toHaveLength(0));
    const ds = await docTatCa();
    expect(ds, "🔴 xoá người mà mất bài — dừng lại").toHaveLength(1);
    expect(ds[0].maThanhVien).toBeUndefined();
    expect(document.querySelector('[data-thu="chua-xep"]')).toBeTruthy();
  });

  it("nút GIỮ BÀI đứng TRƯỚC nút xoá luôn — thứ tự nút là thiết kế an toàn", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await moBang();

    fireEvent.click(screen.getAllByRole("button", { name: CHU_BANG_GIA_DINH.nutXoa })[0]);
    const nut = Array.from(
      document.querySelectorAll('[data-thu="hoi-xoa-thanh-vien"] button'),
    ).map((n) => n.textContent);
    expect(nut.indexOf(CHU_BANG_GIA_DINH.hoiXoaGiuBai)).toBeLessThan(
      nut.indexOf(CHU_BANG_GIA_DINH.hoiXoaXoaBai),
    );
  });

  it("chọn xoá luôn thì mới mất bài — và phải bấm đúng nút đó", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await moBang();

    fireEvent.click(screen.getAllByRole("button", { name: CHU_BANG_GIA_DINH.nutXoa })[0]);
    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.hoiXoaXoaBai }));

    await waitFor(() => expect(the()).toHaveLength(0));
    expect(await docTatCa()).toHaveLength(0);
  });

  it("bấm Huỷ thì không mất gì cả", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await moBang();

    fireEvent.click(screen.getAllByRole("button", { name: CHU_BANG_GIA_DINH.nutXoa })[0]);
    fireEvent.click(
      screen.getAllByRole("button", { name: CHU_BANG_GIA_DINH.nutHuy })[0],
    );

    expect(the()).toHaveLength(1);
    expect(await docTatCa()).toHaveLength(1);
    expect(await docThanhVien()).toHaveLength(1);
  });

  it("bài chưa xếp XẾP LẠI ĐƯỢC cho người khác", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(bai());
    await moBang();

    const chon = screen.getByRole("combobox", { name: /Xếp về/u });
    fireEvent.change(chon, { target: { value: "tv-1" } });

    await waitFor(async () => expect((await docTatCa())[0].maThanhVien).toBe("tv-1"));
  });
});

describe("sổ tiến độ — nhìn một cái biết ai chưa làm", () => {
  it("đếm đúng số bài của từng người, không lẫn sang người khác", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo", 0));
    await luuThanhVien(nguoi("tv-2", "Kiki", 1));
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await moBang();

    await waitFor(() => expect(the()).toHaveLength(2));
    const theo = Object.fromEntries(
      the().map((t) => [t.getAttribute("data-ten"), t.getAttribute("data-so-bai")]),
    );
    expect(theo).toEqual({ Zozo: "2", Kiki: "0" });
  });

  it("người chưa làm bài thì nói thẳng là chưa làm", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await moBang();
    expect(the()[0].textContent).toContain(CHU_BANG_GIA_DINH.chuaLamBai);
  });

  it("người đã làm thì hiện {so}/{gioiHan}", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await moBang();
    expect(the()[0].textContent).toContain(`1/${GIOI_HAN_BAI_MOI_NGUOI} bài`);
  });

  it("hiện vai của từng người", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await moBang();
    expect(the()[0].textContent).toContain(CHU_VAI.con);
  });
});


describe("nút Làm bài trên thẻ", () => {
  it("không truyền callback thì KHÔNG hiện nút — đừng bày nút không đi đâu", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await moBang();
    expect(screen.queryByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai })).toBeNull();
  });

  it("có callback thì bấm gọi đúng người đó", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    const goi = vi.fn();
    render(<KhoangBangGiaDinh onLamBai={goi} />);
    await waitFor(() => expect(the()).toHaveLength(1));

    fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai }));

    expect(goi).toHaveBeenCalledOnce();
    expect(goi.mock.calls[0][0].ten).toBe("Zozo");
  });
});

describe("🔴 13.2 — nút Xem thay đổi chỉ hiện khi THẬT SỰ so được", () => {
  const CHU_SO_SANH_NUT = "Xem thay đổi";

  const baiNgay = (ngay: string) =>
    bai({ maThanhVien: "tv-1", ketThuc: `${ngay}T06:00:00+07:00` });

  it("🔴 hai bài cách 100 ngày ⇒ CÓ nút", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(baiNgay("2026-01-01"));
    await luuBai(baiNgay("2026-04-11"));
    await moBang({ onXemSoSanh: () => {} });

    await waitFor(() => expect(the()).toHaveLength(1));
    expect(screen.getByRole("button", { name: CHU_SO_SANH_NUT })).toBeTruthy();
  });

  it("🔴 hai bài cách 30 ngày ⇒ KHÔNG có nút", async () => {
    // Gần quá thì thứ hiện lên là nhiễu của phép đo, và nó vẫn đọc lên đầy thuyết phục
    // vì có số kèm theo. Không bày nút thì không ai đọc nhầm.
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(baiNgay("2026-01-01"));
    await luuBai(baiNgay("2026-01-31"));
    await moBang({ onXemSoSanh: () => {} });

    await waitFor(() => expect(the()).toHaveLength(1));
    expect(screen.queryByRole("button", { name: CHU_SO_SANH_NUT })).toBeNull();
  });

  it("chỉ MỘT bài ⇒ không có nút", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(baiNgay("2026-01-01"));
    await moBang({ onXemSoSanh: () => {} });

    await waitFor(() => expect(the()).toHaveLength(1));
    expect(screen.queryByRole("button", { name: CHU_SO_SANH_NUT })).toBeNull();
  });

  it("không truyền callback thì KHÔNG hiện nút, dù dữ liệu đủ", async () => {
    await luuThanhVien(nguoi("tv-1", "Zozo"));
    await luuBai(baiNgay("2026-01-01"));
    await luuBai(baiNgay("2026-04-11"));
    await moBang();

    await waitFor(() => expect(the()).toHaveLength(1));
    expect(screen.queryByRole("button", { name: CHU_SO_SANH_NUT })).toBeNull();
  });
});
