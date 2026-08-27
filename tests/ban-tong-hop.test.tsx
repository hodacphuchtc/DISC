import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ManBanTongHop, type NguoiCoBai } from "../app/khoang/ban-tong-hop";
import { CHU_TONG_HOP } from "../config/disc-tu-dien";
import type { MaTruc } from "../modules/core/bo-de/kieu";
import type { ThanhVien } from "../modules/core/gia-dinh/kieu";
import type { BaiLamLuu } from "../modules/core/luu-tru/kho-bai";

/**
 * 🔴 14.4 — BẢN TỔNG HỢP CẢ NHÀ.
 *
 * Cửa kiểm nặng nhất là IN TÁCH BẢN: tờ giấy của Bin không được có một chữ nào của bản
 * Mẹ Lan. Ở màn kết quả (GĐ10) luật đó khoá cứng hai giá trị "con"/"boMe"; ở đây có N dải
 * và CSS không so được giá trị thuộc tính của tổ tiên với con cháu — nên cách ẩn phải
 * khác, và phải có cửa kiểm riêng chứng minh nó thật sự ẩn đúng chỗ.
 *
 * 🔴 Mọi tên là BỊA.
 */

const LUC = "2026-08-27T06:00:00+07:00";

const diem = (D: number, I: number, S: number, C: number): Record<MaTruc, number> => ({
  D,
  I,
  S,
  C,
});

function tv(id: string, ten: string, vaiTro: ThanhVien["vaiTro"], lop?: string): ThanhVien {
  return { id, ten, vaiTro, ...(lop ? { lop } : {}), thuTu: 0, taoLuc: LUC, suaLuc: LUC };
}

function bai(id: string, d: Record<MaTruc, number>, ketThuc = LUC): BaiLamLuu {
  return {
    id,
    boDe: "THCS",
    maTre: "x",
    nguoiTraLoi: "tre",
    batDau: LUC,
    ketThuc,
    traLoi: { "THCS-D1": 4 },
    ketQua: {
      hopLe: true,
      diem: d,
      xepHang: ["D", "I", "S", "C"],
      kieu: { loai: "don", truc: "D" },
      canhBao: [],
    },
    phienBanBoDe: "1.1",
  };
}

const NHA_BA_NGUOI: NguoiCoBai[] = [
  { tv: tv("me", "Mẹ Lan", "me"), bai: [bai("b-me", diem(75, 50, 40, 55))] },
  { tv: tv("bin", "Bin", "con", "7"), bai: [bai("b-bin", diem(45, 62, 70, 48))] },
  { tv: tv("bo", "Bố Nam", "bo"), bai: [bai("b-bo", diem(52, 40, 58, 80))] },
];

beforeEach(() => {
  vi.spyOn(window, "print").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function chay(nguoi: readonly NguoiCoBai[] = NHA_BA_NGUOI) {
  render(<ManBanTongHop nguoi={nguoi} onDong={() => {}} />);
  fireEvent.click(screen.getByRole("button", { name: CHU_TONG_HOP.nutChay }));
}

const ban = () => Array.from(document.querySelectorAll('[data-thu="ban-tong-hop"]'));

describe("chọn bài rồi chạy", () => {
  it("hiện một dòng chọn cho mỗi người", () => {
    render(<ManBanTongHop nguoi={NHA_BA_NGUOI} onDong={() => {}} />);
    expect(document.querySelectorAll('[data-thu="dong-chon-bai"]')).toHaveLength(3);
  });

  it("🔴 nhà 3 người ⇒ ĐÚNG 3 bản, mỗi bản 2 lát cắt", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));
    for (const b of ban()) {
      expect(b.querySelectorAll('[data-thu="lat-cat"]')).toHaveLength(2);
    }
  });

  it("mỗi bản mang tên đúng người đọc", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));
    const ten = ban().map((b) => b.querySelector("h2")?.textContent);
    expect(ten).toEqual([
      CHU_TONG_HOP.tieuDeBan.replace("{ten}", "Mẹ Lan"),
      CHU_TONG_HOP.tieuDeBan.replace("{ten}", "Bin"),
      CHU_TONG_HOP.tieuDeBan.replace("{ten}", "Bố Nam"),
    ]);
  });

  it("🔴 chỉ MỘT người có hồ sơ ⇒ nói rõ vì sao, KHÔNG sinh bản rỗng", () => {
    chay([NHA_BA_NGUOI[0]]);
    expect(screen.getByRole("alert")).toHaveTextContent(CHU_TONG_HOP.chuaDuHaiNguoi);
    expect(ban()).toHaveLength(0);
  });
});

describe("🔴 thế quyền — ai đang nói với ai", () => {
  it("bản của Bin nói với Bin bằng 'em', gọi mẹ bằng TÊN", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));

    const cuaBin = ban()[1];
    const veMe = cuaBin.querySelector('[data-thu="lat-cat"][data-nguoi-kia="me"]');
    expect(veMe?.textContent).toContain("Mẹ Lan");
    expect(veMe?.textContent).toMatch(/\bem\b/u);
  });

  it("🔴 KHÔNG câu nào bảo Bin đi quản lý mẹ", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));
    const cuaBin = ban()[1].textContent ?? "";
    expect(cuaBin).not.toMatch(/giúp mẹ (bình tĩnh|chậm lại|thay đổi)|nhắc mẹ|dạy mẹ/iu);
  });

  it("bản của Mẹ Lan về Bin dùng chữ KHÁC hẳn bản của Bin về mẹ", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));

    const meVeBin = ban()[0].querySelector('[data-thu="lat-cat"][data-nguoi-kia="bin"]');
    const binVeMe = ban()[1].querySelector('[data-thu="lat-cat"][data-nguoi-kia="me"]');
    expect(meVeBin?.textContent).not.toBe(binVeMe?.textContent);
  });

  const cauTrong = (el: Element | null | undefined) =>
    new Set(
      (el?.textContent ?? "")
        .split(/(?<=\.)\s+/u)
        .map((c) => c.trim())
        .filter((c) => c.length >= 60),
    );

  it("🔴 CÙNG MỘT CẶP nhìn hai chiều: KHÔNG câu dài nào dùng chung", async () => {
    // Đây mới là điều đặc tả đòi. Mẹ đọc về Bin và Bin đọc về Mẹ là CÙNG một chỗ vênh —
    // nếu hai bản dùng chung một câu thì nghĩa là ai đó đang đọc chữ viết cho người kia,
    // đúng lỗi đã trả giá sáng 27/08 (bê chữ viết cho phụ huynh sang bộ THCS).
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));

    const cap: [number, string, number, string][] = [
      [0, "bin", 1, "me"],
      [0, "bo", 2, "me"],
      [1, "bo", 2, "bin"],
    ];
    for (const [i, kiaI, j, kiaJ] of cap) {
      const a = cauTrong(ban()[i].querySelector(`[data-nguoi-kia="${kiaI}"]`));
      const b = cauTrong(ban()[j].querySelector(`[data-nguoi-kia="${kiaJ}"]`));
      const chung = [...a].filter((c) => b.has(c));
      expect(chung, `cặp ${i}↔${j} dùng chung: ${JSON.stringify(chung)}`).toHaveLength(0);
    }
  });

  it("người THỨ BA được tả giống nhau cho hai người đọc — có chủ ý, không phải lỗi", async () => {
    // Mẹ và Bin cùng đọc về Bố Nam, và đoạn tả Bố Nam là như nhau. Đó là ĐÚNG: Bố Nam là
    // một người, không phải hai. Viết hai bản khác nhau cho cùng một sự thật chỉ để hai tờ
    // giấy trông khác nhau là bịa thêm chữ mà không thêm thông tin nào.
    //
    // Ghi lại đây để lần sau ai đó thấy hai tờ có một câu giống nhau thì biết là cố ý —
    // và biết ranh giới nằm ở đâu: cùng CẶP thì phải khác, cùng NGƯỜI THỨ BA thì được giống.
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));

    const meVeBo = cauTrong(ban()[0].querySelector('[data-nguoi-kia="bo"]'));
    const binVeBo = cauTrong(ban()[1].querySelector('[data-nguoi-kia="bo"]'));
    const chung = [...meVeBo].filter((c) => binVeBo.has(c));
    expect(chung.length, "hai người đọc về cùng một người thứ ba mà không chung câu nào").toBeGreaterThan(0);
  });
});

describe("🔴🔴 IN TÁCH BẢN — mỗi người MỘT TỜ", () => {
  it("bấm In phần của Bin ⇒ mọi dải KHÁC bị đánh dấu ẩn, dải của Bin thì không", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));

    // Bắt trạng thái DOM ngay tại thời điểm window.print() được gọi — đó mới là thứ
    // trình duyệt nhìn thấy. Kiểm sau khi print xong thì đã dọn dẹp mất rồi.
    let luc: { ban: string | null; an: string | null }[] = [];
    vi.mocked(window.print).mockImplementation(() => {
      luc = Array.from(document.querySelectorAll("[data-ban]")).map((d) => ({
        ban: d.getAttribute("data-ban"),
        an: d.getAttribute("data-an-khi-in"),
      }));
    });

    fireEvent.click(
      screen.getByRole("button", { name: CHU_TONG_HOP.nutInBan.replace("{ten}", "Bin") }),
    );

    expect(luc).toHaveLength(3);
    for (const d of luc) {
      if (d.ban === "tv-bin") {
        expect(d.an, "dải của Bin bị ẩn — tờ giấy sẽ trắng").toBeNull();
      } else {
        expect(d.an, `dải ${d.ban} không bị ẩn — chữ của người khác lọt vào tờ của Bin`).toBe("1");
      }
    }
  });

  it("🔴 in xong thì TRẢ LẠI nguyên trạng — màn hình không được mất dải nào", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));

    fireEvent.click(
      screen.getByRole("button", { name: CHU_TONG_HOP.nutInBan.replace("{ten}", "Bin") }),
    );

    const conAn = document.querySelectorAll("[data-an-khi-in]");
    expect(conAn, "còn dải bị ẩn sau khi in — màn hình mất nội dung").toHaveLength(0);
  });

  it("có đúng một nút in cho mỗi người", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));
    for (const ten of ["Mẹ Lan", "Bin", "Bố Nam"]) {
      expect(
        screen.getByRole("button", { name: CHU_TONG_HOP.nutInBan.replace("{ten}", ten) }),
      ).toBeTruthy();
    }
  });

  it("nút in KHÔNG lọt vào bản in", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));
    const nhomNut = screen.getByRole("button", {
      name: CHU_TONG_HOP.nutInBan.replace("{ten}", "Bin"),
    }).parentElement;
    expect(nhomNut?.hasAttribute("data-khong-in")).toBe(true);
  });
});

describe("🔴 đổi tên sau đó KHÔNG làm vỡ bản đã chạy", () => {
  it("tên trong bản là tên CHỤP LÚC CHẠY, không đọc lại từ sổ", async () => {
    chay();
    await waitFor(() => expect(ban()).toHaveLength(3));

    // Đổi tên trong sổ SAU khi đã chạy. Bản đang mở phải giữ nguyên tên cũ — nó là ảnh
    // chụp một thời điểm, không phải một khung nhìn sống.
    //
    // Dựng lại mảng thay vì gán đè: `NguoiCoBai.tv` là `readonly`, và cái readonly đó
    // chính là hàng rào ngăn ai đó sửa sổ ngay dưới chân một bản đang hiển thị.
    const daDoiTen: NguoiCoBai[] = [
      { tv: tv("me", "Mẹ", "me"), bai: NHA_BA_NGUOI[0].bai },
      ...NHA_BA_NGUOI.slice(1),
    ];
    expect(daDoiTen[0].tv.ten).toBe("Mẹ");

    expect(ban()[0].querySelector("h2")?.textContent).toBe(
      CHU_TONG_HOP.tieuDeBan.replace("{ten}", "Mẹ Lan"),
    );
  });
});

describe("hai người y hệt nhau ⇒ vẫn có chữ, không màn trắng", () => {
  it("trùng khớp bốn trục thì hiện khối 'cùng nhịp'", async () => {
    chay([
      { tv: tv("a", "An", "bo"), bai: [bai("b-a", diem(60, 55, 50, 45))] },
      { tv: tv("b", "Bảo", "me"), bai: [bai("b-b", diem(62, 53, 52, 47))] },
    ]);
    await waitFor(() => expect(ban()).toHaveLength(2));
    expect(ban()[0].textContent).toContain(CHU_TONG_HOP.nhanTrungKhop);
  });
});
