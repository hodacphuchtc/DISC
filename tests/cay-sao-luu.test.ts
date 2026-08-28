/**
 * CỬA KIỂM CỦA `17.4` — tệp `.zip` mở ra là ĐỌC ĐƯỢC.
 *
 * Việc này sinh ra từ đúng một câu của chủ dự án: *"tải về máy và có một số file JSON không
 * đọc được"*. Chúng không hỏng — chúng là phần máy đọc. Cách sửa không phải là bỏ chúng đi
 * (bỏ là giết nút *Khôi phục*), mà là **đưa phần người đọc lên trước** và nói rõ phần còn
 * lại dành cho ai.
 *
 * 🔴 Ba luật dễ sai và khó thấy, mỗi luật một nhóm cửa: tên trùng · ký tự cấm hệ tệp ·
 * cờ tắt nội dung trẻ.
 *
 * 🔴 Mọi tên là BỊA.
 */

import JSZip from "jszip";
import { describe, expect, it } from "vitest";

import {
  CHU_DOC_TRUOC,
  THU_MUC_MAY_DOC,
  THU_MUC_TONG_HOP,
  lamSachTenThuMuc,
  tenThuMucLanChay,
  tenThuMucNguoi,
} from "../modules/core/luu-tru/cay-sao-luu";
import { taoNoiDungZip, type TepKem } from "../modules/core/luu-tru/sao-luu";

describe("làm sạch tên thư mục", () => {
  it("🔴 GIỮ dấu tiếng Việt — cả hạng mục này sinh ra để tệp .zip đọc được", () => {
    expect(lamSachTenThuMuc("Mẹ Lan")).toBe("Mẹ Lan");
    expect(lamSachTenThuMuc("Bé Đường")).toBe("Bé Đường");
  });

  it("🔴 lọc ký tự CẤM hệ tệp — một dấu gạch chéo là thư mục vỡ thành hai cấp", () => {
    expect(lamSachTenThuMuc("Bé/Na")).toBe("Bé Na");
    expect(lamSachTenThuMuc('A\\B:C*D?E"F<G>H|I')).toBe("A B C D E F G H I");
  });

  it("Windows cấm tên kết thúc bằng dấu chấm hoặc khoảng trắng", () => {
    expect(lamSachTenThuMuc("Zozo.")).toBe("Zozo");
    expect(lamSachTenThuMuc("Zozo   ")).toBe("Zozo");
  });

  it("tên rỗng hoặc toàn ký tự cấm ⇒ vẫn ra một cái tên dùng được, KHÔNG ra chuỗi rỗng", () => {
    // Thư mục tên rỗng làm hỏng cả tệp .zip, không chỉ hỏng một thư mục.
    expect(lamSachTenThuMuc("")).toBe("Chưa đặt tên");
    expect(lamSachTenThuMuc("///")).toBe("Chưa đặt tên");
    expect(lamSachTenThuMuc("   ")).toBe("Chưa đặt tên");
  });
});

describe("🔴 tên TRÙNG — một thư mục ghi đè thư mục kia là mất bản của một người", () => {
  it("tên chưa dùng thì giữ nguyên", () => {
    expect(tenThuMucNguoi("Zozo", new Set())).toBe("Zozo");
  });

  it("trùng ⇒ thêm hậu tố (2), (3)…", () => {
    const daDung = new Set(["Zozo"]);
    expect(tenThuMucNguoi("Zozo", daDung)).toBe("Zozo (2)");
    daDung.add("Zozo (2)");
    expect(tenThuMucNguoi("Zozo", daDung)).toBe("Zozo (3)");
  });

  it("🔴 hai tên KHÁC NHAU nhưng dồn về một sau khi lọc ⇒ vẫn phải tách ra", () => {
    // `Bé/Na` và `Bé Na` là hai người khác nhau trong sổ, nhưng sau khi lọc dấu gạch chéo
    // chúng thành một. Không xử lý thì người thứ hai mất sạch bản mà không có gì báo.
    const daDung = new Set<string>();
    const a = tenThuMucNguoi("Bé Na", daDung);
    daDung.add(a);
    const b = tenThuMucNguoi("Bé/Na", daDung);
    expect(a).toBe("Bé Na");
    expect(b).toBe("Bé Na (2)");
    expect(a).not.toBe(b);
  });
});

describe("tên thư mục một lần chạy phân tích", () => {
  it("dạng `yyyy-mm-dd HHhMM`, đọc lướt là biết chạy khi nào", () => {
    expect(tenThuMucLanChay("2026-08-28T20:05:00+07:00")).toBe("2026-08-28 20h05");
  });

  it("hai lần chạy CÙNG NGÀY ra hai tên khác nhau, vì có giờ", () => {
    const a = tenThuMucLanChay("2026-08-28T20:05:00+07:00");
    const b = tenThuMucLanChay("2026-08-28T08:15:00+07:00");
    expect(a).not.toBe(b);
  });

  it("mốc thời gian hỏng ⇒ vẫn ra một cái tên, KHÔNG ra `Invalid Date`", () => {
    expect(tenThuMucLanChay("khong-phai-ngay")).toBe("khong-ro-thoi-diem");
  });
});

describe("🔴 hình dạng tệp .zip", () => {
  /**
   * 🔴 `Uint8Array.from()`, KHÔNG dùng `new TextEncoder().encode()`.
   *
   * Dưới jsdom có HAI realm: `TextEncoder` là của jsdom và trả về một `Uint8Array` mà
   * phép `instanceof Uint8Array` bên trong JSZip **trượt** — JSZip ném "Can't read the data
   * of ...". Sản phẩm thật chạy trong trình duyệt một realm nên không dính; đây thuần tuý
   * là tật của môi trường test, và bẫy nằm ở chỗ câu báo lỗi không hề nhắc tới realm.
   */
  const pdfGia = (ten: string): TepKem => ({
    ten,
    duLieu: Uint8Array.from([...`%PDF-1.4 gia`].map((c) => c.charCodeAt(0))),
  });

  async function goi(tepKem: readonly TepKem[]): Promise<JSZip> {
    const duLieu = await taoNoiDungZip([], "2026-08-28T20:05:00+07:00", [], [], tepKem);
    return JSZip.loadAsync(duLieu);
  }

  it("phần NGƯỜI ĐỌC ở gốc, phần MÁY ĐỌC chìm xuống `_may-doc/`", async () => {
    const zip = await goi([
      pdfGia("Zozo/2026-08-28-19h30.pdf"),
      pdfGia(`${THU_MUC_TONG_HOP}/2026-08-28 20h05/Zozo.pdf`),
    ]);
    const ten = Object.keys(zip.files);

    expect(ten.some((t) => t.startsWith("Zozo/"))).toBe(true);
    expect(ten.some((t) => t.startsWith(`${THU_MUC_TONG_HOP}/`))).toBe(true);
    // Không một tệp .json nào được nằm ở gốc — đó chính là lời phàn nàn đã sinh ra 17.4.
    const jsonOGoc = ten.filter((t) => t.endsWith(".json") && !t.includes("/"));
    expect(jsonOGoc, `còn JSON ở gốc: ${jsonOGoc.join(", ")}`).toEqual([]);
  });

  it("🔴 có tệp ĐỌC TRƯỚC.txt giải thích JSON dùng để làm gì", async () => {
    const zip = await goi([]);
    const tep = Object.keys(zip.files).find((t) => t.includes("ĐỌC TRƯỚC"));
    expect(tep, "thiếu tệp giải thích — người dùng lại tưởng JSON hỏng").toBeTruthy();

    const noiDung = await zip.file(tep!)!.async("string");
    expect(noiDung).toBe(CHU_DOC_TRUOC);
    // Phải nói được hai điều: tệp không hỏng, và đừng xoá.
    expect(noiDung).toContain("không hỏng");
    expect(noiDung).toContain("ĐỪNG XOÁ");
  });

  it("bản kê nằm trong `_may-doc/` và khai đúng phiên bản 3", async () => {
    const zip = await goi([]);
    const banKe = JSON.parse(
      await zip.file(`${THU_MUC_MAY_DOC}/ban-ke.json`)!.async("string"),
    );
    expect(banKe.phienBanSaoLuu).toBe(3);
  });

  it("tên thư mục có DẤU đi qua được vòng nén–giải nén", async () => {
    const zip = await goi([pdfGia("Mẹ Lan/2026-08-28-19h42.pdf")]);
    expect(Object.keys(zip.files)).toContain("Mẹ Lan/2026-08-28-19h42.pdf");
  });
});
