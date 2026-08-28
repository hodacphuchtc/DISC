import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { KhoangPhanTich } from "../app/khoang/phan-tich";
import { GIOI_HAN_THU_MUC } from "../config/disc-gia-dinh";
import { CHU_TONG_HOP } from "../config/disc-tu-dien";
import {
  laBanPhanTichHopLe,
  type BanPhanTich,
} from "../modules/report/phan-tich-gia-dinh";
import { luuPhanTich, xoaSachTatCa } from "../modules/core/luu-tru/kho-bai";

/**
 * DANH SÁCH CÁC LẦN ĐÃ PHÂN TÍCH (V3.1).
 *
 * 🔴 VÌ SAO CÓ FILE NÀY. Ba thứ đã dựng xong từ GĐ14 mà **chưa nối vào đâu**:
 *   - `CHU_TONG_HOP.nhomThuMuc` / `moTaThuMuc` / `nutMoThuMuc` nằm trong `config/`, không
 *     component nào vẽ;
 *   - `docPhanTich()` nằm trong kho, không ai gọi;
 *   - hạn mức 5 thư mục chạy được, nhưng bản đã lưu thì không có đường nào mở lại.
 *
 * Nghĩa là mỗi lần chạy phân tích được ghi vào IndexedDB rồi nằm đó vĩnh viễn. Không test
 * nào đỏ, vì chẳng ai hỏi *"lưu rồi thì mở lại bằng đường nào"*.
 */

/** Một bản phân tích BỊA, đúng hình dạng thật. */
function ban(ten: string, tenNguoiKia: string): BanPhanTich {
  return {
    toiId: `tv-${ten}`,
    tenLuc: ten,
    latCat: [
      {
        toiId: `tv-${ten}`,
        nguoiKiaId: `tv-${tenNguoiKia}`,
        tenNguoiKia,
        theQuyen: "ngang-vai",
        trucLech: [],
      },
    ],
  };
}

async function themThuMuc(id: string, taoLuc: string, noiDung: unknown = [ban("Zozo", "Kiki")]) {
  await luuPhanTich({ id, maBai: ["bai-1"], taoLuc, noiDung });
}

const dong = () => Array.from(document.querySelectorAll('[data-thu="thu-muc"]'));

async function moKhoang() {
  render(<KhoangPhanTich />);
  await waitFor(() => expect(screen.getByText(CHU_TONG_HOP.nutPhanTich)).toBeTruthy());
}

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  cleanup();
  await xoaSachTatCa();
});

describe("danh sách thư mục", () => {
  it("chưa chạy lần nào thì KHÔNG bày danh sách rỗng ra", async () => {
    await moKhoang();
    expect(document.querySelector('[data-thu="danh-sach-thu-muc"]')).toBeNull();
  });

  it("chạy rồi thì hiện đúng số dòng", async () => {
    await themThuMuc("pt-1", "2026-08-20T02:15:00.000Z");
    await themThuMuc("pt-2", "2026-08-21T09:40:00.000Z");
    await moKhoang();
    await waitFor(() => expect(dong()).toHaveLength(2));
  });

  it("🔴 mỗi dòng có NGÀY VÀ GIỜ, không chỉ ngày", async () => {
    // Hai lần chạy CÙNG MỘT NGÀY, cách nhau vài giờ. Chỉ hiện ngày thì hai dòng giống hệt
    // nhau và không ai phân biệt được mình đang mở cái nào — đúng thứ yêu cầu đòi.
    await themThuMuc("pt-1", "2026-08-20T02:15:00.000Z");
    await themThuMuc("pt-2", "2026-08-20T07:40:00.000Z");
    await moKhoang();
    await waitFor(() => expect(dong()).toHaveLength(2));

    const chu = dong().map((d) => d.textContent ?? "");
    expect(chu[0]).not.toBe(chu[1]);
    // Có dấu hai chấm của giờ, và có dấu gạch chéo của ngày.
    for (const c of chu) {
      expect(c).toMatch(/\d{2}:\d{2}/u);
      expect(c).toMatch(/\d{2}\/\d{2}\/\d{4}/u);
    }
  });

  it("mới nhất đứng trước", async () => {
    await themThuMuc("pt-cu", "2026-08-01T02:00:00.000Z");
    await themThuMuc("pt-moi", "2026-08-25T02:00:00.000Z");
    await moKhoang();
    await waitFor(() => expect(dong()).toHaveLength(2));
    expect(dong()[0]!.textContent).toContain("25/08/2026");
  });

  it("nói rõ máy giữ lại mấy lần — con số lấy từ config, không gõ cứng", async () => {
    await themThuMuc("pt-1", "2026-08-20T02:15:00.000Z");
    await moKhoang();
    await waitFor(() => expect(dong()).toHaveLength(1));
    // Neo vào ĐÚNG chuỗi đã thay số, không neo vào mỗi con số — chữ "5" xuất hiện ở
    // nhiều chỗ khác trên màn (giờ, ngày), và một cửa kiểm bắt nhầm chỗ thì vô nghĩa.
    expect(
      screen.getByText(CHU_TONG_HOP.moTaThuMuc.replace("{so}", String(GIOI_HAN_THU_MUC))),
    ).toBeTruthy();
  });
});

describe("mở lại một lần chạy cũ", () => {
  it("bấm Mở ⇒ hiện đúng nội dung đã lưu, KHÔNG chạy lại engine", async () => {
    await themThuMuc("pt-1", "2026-08-20T02:15:00.000Z", [ban("Zozo", "Kiki")]);
    await moKhoang();
    await waitFor(() => expect(dong()).toHaveLength(1));

    fireEvent.click(screen.getByRole("button", { name: CHU_TONG_HOP.nutMoThuMuc }));

    await waitFor(() =>
      expect(screen.getByText(CHU_TONG_HOP.tieuDeBan.replace("{ten}", "Zozo"))).toBeTruthy(),
    );
  });

  it("đóng bản cũ ⇒ về lại danh sách", async () => {
    await themThuMuc("pt-1", "2026-08-20T02:15:00.000Z");
    await moKhoang();
    await waitFor(() => expect(dong()).toHaveLength(1));
    fireEvent.click(screen.getByRole("button", { name: CHU_TONG_HOP.nutMoThuMuc }));

    // Nút đóng là `← Đóng`, chữ nằm ở HAI nút văn bản khác nhau nên `getByText` không thấy.
    // Hỏi theo VAI TRÒ thì tên ghép lại đủ, và cũng đúng cách trình đọc màn hình đọc nó.
    const nutDong = () =>
      screen.getByRole("button", { name: new RegExp(CHU_TONG_HOP.nutDong, "u") });
    await waitFor(() => expect(nutDong()).toBeTruthy());

    fireEvent.click(nutDong());
    await waitFor(() => expect(dong()).toHaveLength(1));
  });

  it("🔴 bản ghi HỎNG HÌNH DẠNG ⇒ nói ra, KHÔNG trả về trang trắng", async () => {
    // Bản ghi từ một phiên bản nội dung khác. Ép kiểu bừa thì React đọc `undefined.latCat`
    // và cho ra một trang trắng — người dùng chỉ thấy sản phẩm hỏng mà không biết vì sao,
    // và cũng không biết là mình còn chạy lại được.
    await themThuMuc("pt-hong", "2026-08-20T02:15:00.000Z", [{ toiId: "tv-1" }]);
    await moKhoang();
    await waitFor(() => expect(dong()).toHaveLength(1));

    fireEvent.click(screen.getByRole("button", { name: CHU_TONG_HOP.nutMoThuMuc }));

    expect(screen.getByRole("alert")).toHaveTextContent(CHU_TONG_HOP.thuMucHong);
    // Và danh sách vẫn còn đó để bấm cái khác.
    expect(dong()).toHaveLength(1);
  });
});

describe("laBanPhanTichHopLe", () => {
  it("nhận bản đúng hình dạng", () => {
    expect(laBanPhanTichHopLe([ban("Zozo", "Kiki")])).toBe(true);
  });

  it("từ chối mọi thứ khác — kể cả mảng rỗng và thứ trông gần giống", () => {
    for (const rac of [
      null,
      undefined,
      "chuỗi",
      7,
      {},
      [],
      [{ toiId: "tv-1" }],
      [{ toiId: "tv-1", tenLuc: "Zozo" }],
      [{ toiId: "tv-1", tenLuc: "Zozo", latCat: "không phải mảng" }],
      [{ toiId: "tv-1", tenLuc: "Zozo", latCat: [{ toiId: "tv-1" }] }],
    ]) {
      expect(laBanPhanTichHopLe(rac), JSON.stringify(rac)).toBe(false);
    }
  });
});
