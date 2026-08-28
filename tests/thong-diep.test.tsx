import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { KhoangBangGiaDinh } from "../app/khoang/bang-gia-dinh";
import { ManKetQua } from "../app/khoang/ket-qua";
import { CHU_THONG_DIEP } from "../config/disc-tu-dien";
import { napBoDe } from "../modules/core/bo-de/nap";
import type { KetQua } from "../modules/core/bo-de/kieu";
import { luuThanhVien, xoaSach, xoaSachThanhVien } from "../modules/core/luu-tru/kho-bai";

/**
 * THÔNG ĐIỆP NHÂN VĂN (12.6).
 *
 * 🔴 Hai luật, và luật thứ hai quan trọng hơn luật thứ nhất:
 *
 * 1. **Chỉ xuất hiện ở bảng gia đình.** Rải vào màn kết quả và bản in là biến sự chân
 *    thành thành khẩu hiệu — đọc lần đầu thấy tử tế, lần thứ tư thấy như quảng cáo.
 *
 * 2. 🔴 **CẤM chữ "phi lợi nhuận".** Khoang này sinh ra để giữ chân hơn 1.000 gia đình
 *    đang trả học phí. Đó là một tiện ích miễn phí hoàn toàn chính đáng — nhưng gọi nó là
 *    phi lợi nhuận là một tuyên bố SAI, và sai theo hướng có lợi cho mình thì càng không
 *    được. Cửa kiểm này quét toàn bộ `config/`, chỗ mọi chữ hiển thị phải nằm.
 */

const GOC = process.cwd();

const KQ: KetQua = {
  hopLe: true,
  diem: { D: 90, I: 55, S: 35, C: 45 },
  xepHang: ["D", "I", "C", "S"],
  kieu: { loai: "don", truc: "D" },
  canhBao: [],
};

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
  await xoaSachThanhVien();
});

describe("🔴 CẤM tuyên bố 'phi lợi nhuận'", () => {
  const tepConfig = readdirSync(join(GOC, "config")).filter((t) => t.endsWith(".ts"));

  /**
   * Soi CHỮ HIỂN THỊ, không soi chú thích.
   *
   * 🔴 Bản đầu quét cả file và đỏ ngay — vì chỗ duy nhất nói "phi lợi nhuận" trong toàn
   * repo lại chính là lời chú thích CẤM nó. Một cửa kiểm bắt người ta không được viết ra
   * lý do của chính cửa kiểm đó thì tự nó vô lý. Nên: rút hết chuỗi ký tự trong mã ra rồi
   * mới soi — đúng thứ người dùng đọc được, và cũng đúng thứ đáng cấm.
   */
  const chuHienThi = (nguon: string): string => {
    const khongChuThich = nguon
      // Khối /* … */ — nơi mọi lời giải thích dài nằm, kể cả lời giải thích cấm câu này.
      .replace(/\/\*[\s\S]*?\*\//gu, "")
      // Dòng chỉ có chú thích. CỐ Ý không đụng `//` giữa dòng: một `https://` nằm trong
      // chuỗi mà bị cắt thì cửa kiểm âm thầm soi thiếu, và soi thiếu tệ hơn báo thừa.
      .replace(/^[ \t]*\/\/.*$/gmu, "");
    return (
      khongChuThich.match(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/gu) ?? []
    ).join("\n");
  };

  it("không một chữ hiển thị nào trong config nói 'phi lợi nhuận'", () => {
    expect(tepConfig.length).toBeGreaterThan(5);
    for (const t of tepConfig) {
      const chu = chuHienThi(readFileSync(join(GOC, "config", t), "utf8"));
      expect(
        /phi\s*lợi\s*nhuận/iu.test(chu),
        `${t} nói "phi lợi nhuận" với người dùng — đó là tuyên bố sai`,
      ).toBe(false);
    }
  });

  it("🔴 chính cửa kiểm này bắt được vi phạm thật — thử phá xem nó có cắn không", () => {
    // Không có bước này thì không ai biết cửa kiểm còn sống hay đã thành một dòng xanh
    // vô nghĩa. Dựng một mẩu mã vi phạm rồi soi bằng đúng hàm ở trên.
    const viPham = 'export const X = { chan: "Đây là dự án phi lợi nhuận" };';
    expect(/phi\s*lợi\s*nhuận/iu.test(chuHienThi(viPham))).toBe(true);

    // Và chú thích thì KHÔNG bị coi là vi phạm — cả hai kiểu chú thích.
    const dongChuThich = '// cấm nói "phi lợi nhuận" ở đây\nexport const Y = 1;';
    expect(/phi\s*lợi\s*nhuận/iu.test(chuHienThi(dongChuThich))).toBe(false);

    const khoiChuThich = '/** Cấm chữ "phi lợi nhuận". */\nexport const Z = 1;';
    expect(/phi\s*lợi\s*nhuận/iu.test(chuHienThi(khoiChuThich))).toBe(false);
  });

  it("thông điệp chân bảng nói 'miễn phí cho gia đình đang học' — đúng và đủ", () => {
    expect(CHU_THONG_DIEP.chan).toMatch(/miễn phí cho gia đình đang học/u);
    expect(CHU_THONG_DIEP.chan).not.toMatch(/phi lợi nhuận/iu);
  });
});

describe("thông điệp CHỈ ở bảng gia đình", () => {
  it("bảng gia đình hiện thông điệp ngay dòng đầu, trước mọi thứ khác", async () => {
    render(<KhoangBangGiaDinh />);
    await waitFor(() =>
      expect(document.querySelector('[data-thu="thong-diep-chinh"]')).toBeTruthy(),
    );

    const chinh = document.querySelector('[data-thu="thong-diep-chinh"]');
    expect(chinh).toHaveTextContent(CHU_THONG_DIEP.chinh);

    // "Trước mọi thứ khác": không có tiêu đề nào đứng trên nó.
    // 🔴 Từ V2.1 bảng gia đình là BƯỚC 1 nằm trong khung ba bước, nên `h1` của trang đã
    // lên khung; tiêu đề của bảng là `h2`. Neo vào "tiêu đề đầu tiên bất kỳ" thay vì gõ
    // cứng một cấp — luật cần canh là THỨ TỰ, không phải cấp thẻ.
    const tieuDe = document.querySelector("h1, h2, h3");
    expect(tieuDe, "bảng gia đình phải có ít nhất một tiêu đề").toBeTruthy();
    const truoc = chinh?.compareDocumentPosition(tieuDe!);
    expect(truoc! & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("có cả dòng phụ và dòng chân bảng", async () => {
    render(<KhoangBangGiaDinh />);
    await waitFor(() => expect(screen.getByText(CHU_THONG_DIEP.phu)).toBeTruthy());
    expect(document.querySelector('[data-thu="thong-diep-chan"]')).toHaveTextContent(
      CHU_THONG_DIEP.chan,
    );
  });

  it("🔴 màn KẾT QUẢ KHÔNG lặp lại thông điệp — một lần, đúng chỗ, rồi im", async () => {
    render(<ManKetQua boDe={napBoDe("TH")} bietDanh="Zozo" ketQua={KQ} onLamLai={() => {}} />);
    await waitFor(() => expect(screen.getAllByRole("button").length).toBeGreaterThan(0));

    const chu = document.body.textContent ?? "";
    expect(chu).not.toContain(CHU_THONG_DIEP.chinh);
    expect(chu).not.toContain(CHU_THONG_DIEP.phu);
    expect(chu).not.toContain(CHU_THONG_DIEP.chan);
  });

  it("thông điệp không lọt vào bản in (nó thuộc bảng, bảng không in)", async () => {
    render(<ManKetQua boDe={napBoDe("QS")} bietDanh="Zozo" ketQua={KQ} onLamLai={() => {}} />);
    await waitFor(() => expect(screen.getAllByRole("button").length).toBeGreaterThan(0));
    expect(document.querySelectorAll("[data-ban]").length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toContain(CHU_THONG_DIEP.chinh);
  });

  it("thẻ thành viên không nhắc lại thông điệp lần nữa", async () => {
    await luuThanhVien({
      id: "tv-1",
      ten: "Zozo",
      vaiTro: "con",
      thuTu: 0,
      taoLuc: "2026-08-27T06:00:00+07:00",
      suaLuc: "2026-08-27T06:00:00+07:00",
    });
    render(<KhoangBangGiaDinh />);
    await waitFor(() =>
      expect(document.querySelectorAll('[data-thu="the-thanh-vien"]')).toHaveLength(1),
    );

    const the = document.querySelector('[data-thu="the-thanh-vien"]');
    expect(the?.textContent).not.toContain(CHU_THONG_DIEP.chinh);
    // Và cả trang chỉ có ĐÚNG MỘT chỗ nói câu đó.
    expect(document.querySelectorAll('[data-thu="thong-diep-chinh"]')).toHaveLength(1);
  });
});
