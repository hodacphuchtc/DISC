/**
 * CỬA KIỂM CỦA `17.3` — nội dung tệp PDF cá nhân.
 *
 * 🔴 Hai luật nặng nhất, cả hai đều là lỗi ĐÃ TRẢ GIÁ ở GĐ9/GĐ10:
 *
 *  1. **Đủ BỐN trục, không bao giờ ít hơn.** Bản dựng cũ làm theo KIỂU (11 kiểu) chứ không
 *     theo TRỤC (4 trục), nên phụ huynh nhìn biểu đồ bốn cột có số đầy đủ mà chỉ đọc được
 *     chữ về MỘT nhóm. Test khi đó kiểm 11 kiểu nên xanh suốt bốn giai đoạn.
 *  2. **Nhãn ba câu hỏi đổi theo AI TỰ LÀM BÀI.** Bộ THCS từng hiện *"3 câu để tự hỏi
 *     mình"* mà ruột là câu viết cho phụ huynh hỏi con — lỗi chỉ lộ ra khi NHÌN ảnh chụp.
 *
 * 🔴 Mọi tên là BỊA.
 */

import { describe, expect, it } from "vitest";

import { TIEU_DE_KHOI } from "../config/disc-dien-giai";
import { TRUC } from "../config/disc-tu-dien";
import { MA_TRUC, type MaBoDe, type MaTruc } from "../modules/core/bo-de/kieu";
import { dongChoBai, type BaiDeDoc } from "../modules/report/noi-dung-ket-qua";

/** Mốc cố định — không phụ thuộc múi giờ máy chạy test. */
const hienNgayGio = () => "28/08/2026 19:30";

const DIEM: Record<MaTruc, number> = { D: 78, I: 41, S: 33, C: 62 };
const XEP: readonly MaTruc[] = ["D", "C", "I", "S"];

const bai = (ghiDe: Partial<BaiDeDoc> = {}): BaiDeDoc => ({
  ten: "Zozo",
  boDe: "THCS",
  ketThuc: "2026-08-28T19:30:00+07:00",
  diem: DIEM,
  xepHang: XEP,
  ...ghiDe,
});

const chuCua = (b: BaiDeDoc) => dongChoBai(b, hienNgayGio).map((d) => d.chu);

describe("hình dạng bản đọc", () => {
  it("mở đầu bằng tên người, rồi bộ đề và mốc thời gian", () => {
    const chu = chuCua(bai());
    expect(chu[0]).toContain("Zozo");
    expect(chu[1]).toContain("THCS");
    expect(chu[1]).toContain("28/08/2026 19:30");
  });

  it("có dòng bốn điểm, đọc cùng thứ tự với biểu đồ D-I-S-C", () => {
    const chu = chuCua(bai()).join("\n");
    for (const t of MA_TRUC) {
      expect(chu).toContain(`${TRUC[t].ten} ${DIEM[t]}`);
    }
    const dong = chuCua(bai()).find((c) => c.includes(TRUC.D.ten) && c.includes(TRUC.C.ten))!;
    // Thứ tự trong dòng phải là D → I → S → C, không phải theo xếp hạng.
    const viTri = MA_TRUC.map((t) => dong.indexOf(TRUC[t].ten));
    expect(viTri).toEqual([...viTri].sort((a, b) => a - b));
  });

  it("🔴 nêu ĐỦ BỐN TRỤC — mỗi trục có tên và có chữ", () => {
    const chu = chuCua(bai()).join("\n");
    for (const t of MA_TRUC) {
      expect(chu, `thiếu trục ${t}`).toContain(`${TRUC[t].ten} — ${DIEM[t]}`);
    }
  });

  it("mọi dòng đều có chữ thật, không dòng rỗng", () => {
    for (const d of dongChoBai(bai(), hienNgayGio)) {
      expect(d.chu.trim().length, `dòng kiểu ${d.kieu} rỗng`).toBeGreaterThan(0);
    }
  });
});

describe("🔴 nhãn ba câu hỏi đổi theo AI TỰ LÀM BÀI", () => {
  for (const bo of ["TH", "THCS", "PH"] as const) {
    it(`bộ ${bo} (người tự đánh giá) ⇒ "tự hỏi mình"`, () => {
      const chu = chuCua(bai({ boDe: bo })).join("\n");
      expect(chu).toContain(TIEU_DE_KHOI.cauHoiToiNayTuMinh);
      expect(chu).not.toContain(TIEU_DE_KHOI.cauHoiToiNay);
    });
  }

  for (const bo of ["MN", "QS"] as const) {
    it(`bộ ${bo} (người lớn trả lời hộ) ⇒ "hỏi con tối nay"`, () => {
      const chu = chuCua(bai({ boDe: bo, tuoi: 10 })).join("\n");
      expect(chu).toContain(TIEU_DE_KHOI.cauHoiToiNay);
      expect(chu).not.toContain(TIEU_DE_KHOI.cauHoiToiNayTuMinh);
    });
  }
});

describe("🔴 ba bản, mỗi bản một người đọc — không lẫn", () => {
  it("bộ PH (người lớn tự đánh giá) có bản TỰ ĐỌC, KHÔNG có bản cho bố mẹ về con", () => {
    const chu = chuCua(bai({ boDe: "PH" })).join("\n");
    expect(chu).toContain("bản tự đọc");
    expect(chu).not.toContain("phần dành cho bố mẹ");
  });

  it("bộ MN (bố mẹ trả lời về bé) có phần cho BỐ MẸ, KHÔNG có bản của em", () => {
    const chu = chuCua(bai({ boDe: "MN" })).join("\n");
    expect(chu).toContain("phần dành cho bố mẹ");
    expect(chu).not.toContain("bản của em");
  });

  it("bộ THCS (em tự làm) có CẢ bản của em LẪN phần cho bố mẹ", () => {
    const chu = chuCua(bai({ boDe: "THCS" })).join("\n");
    // 🔴 Phụ huynh của học sinh TH/THCS từng KHÔNG nhận được một chữ lời khuyên nào,
    // suốt từ GĐ9, vì bảng đại từ khoá một chiều theo bộ đề. Cửa này canh chỗ đó.
    expect(chu).toContain("bản của em");
    expect(chu).toContain("phần dành cho bố mẹ");
  });
});

describe("hồ sơ nhận qua mã mời", () => {
  it("🔴 nói RÕ nguồn ở đầu tờ — máy này không có bài gốc", () => {
    const chu = chuCua(bai({ nhanQuaMa: true })).join("\n");
    expect(chu).toContain("mã mời");
    expect(chu).toContain("máy khác");
  });

  it("bài làm trên máy này thì KHÔNG có câu đó", () => {
    expect(chuCua(bai()).join("\n")).not.toContain("mã mời");
  });
});

describe("bài của mỗi bộ đề đều dựng được, không bộ nào ném", () => {
  for (const bo of ["MN", "TH", "THCS", "PH", "QS"] as const) {
    it(`bộ ${bo}`, () => {
      const dong = dongChoBai(bai({ boDe: bo as MaBoDe, tuoi: 10 }), hienNgayGio);
      expect(dong.length).toBeGreaterThan(15);
    });
  }
});
