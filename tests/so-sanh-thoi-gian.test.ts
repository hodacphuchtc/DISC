import { describe, expect, it } from "vitest";

import { NGAY_TOI_THIEU_DE_SO_SANH } from "../config/disc-nguong";
import { CHU_SO_SANH } from "../config/disc-tu-dien";
import { MA_TRUC, type MaTruc } from "../modules/core/bo-de/kieu";
import { soSanhTheoThoiGian } from "../modules/report/so-sanh-thoi-gian";

/**
 * 🔴 13.2 — "BIN HỒI THÁNG 3 ↔ BIN BÂY GIỜ".
 *
 * Hai cửa kiểm nặng nhất ở đây KHÔNG phải phép tính (không có toán mới — dùng lại
 * `mucLechTu()` của vùng lệch). Chúng là:
 *
 *  1. **Sàn 90 ngày.** Phép đo này thô: một nấc trả lời dịch điểm chuẩn hoá 4–10 điểm.
 *     Đem hai bài cách nhau ba tuần ra so thì thứ hiện lên là nhiễu, không phải thay đổi
 *     của một con người — và nó vẫn đọc lên đầy thuyết phục vì có số kèm theo.
 *
 *  2. 🔴 **Giọng văn: cấm "tiến bộ", cấm "cải thiện".** DISC không có chiều tốt/xấu nên
 *     KHÔNG CÓ GÌ ĐỂ TIẾN BỘ. Một câu khen ở đây biến bản mô tả hành vi thành bảng điểm
 *     mà đứa trẻ phải leo, và phụ huynh đọc xong sẽ đi khen hoặc đi thúc.
 */

const DIEM_A: Record<MaTruc, number> = { D: 40, I: 50, S: 70, C: 45 };
const DIEM_B: Record<MaTruc, number> = { D: 68, I: 52, S: 55, C: 47 };

const bai = (id: string, ketThuc: string, diem: Record<MaTruc, number>) => ({
  id,
  ketThuc,
  diem,
});

describe("🔴 sàn thời gian — gần quá thì IM LẶNG", () => {
  it("chưa có bài nào ⇒ thiếu bài", () => {
    expect(soSanhTheoThoiGian([])).toEqual({ soSanhDuoc: false, lyDo: { ma: "THIEU_BAI" } });
  });

  it("chỉ một bài ⇒ thiếu bài", () => {
    const k = soSanhTheoThoiGian([bai("a", "2026-01-01T00:00:00Z", DIEM_A)]);
    expect(k.soSanhDuoc).toBe(false);
    if (!k.soSanhDuoc) expect(k.lyDo.ma).toBe("THIEU_BAI");
  });

  it("🔴 hai bài cách 30 ngày ⇒ KHÔNG so, và nói rõ là gần quá", () => {
    const k = soSanhTheoThoiGian([
      bai("a", "2026-01-01T00:00:00Z", DIEM_A),
      bai("b", "2026-01-31T00:00:00Z", DIEM_B),
    ]);
    expect(k.soSanhDuoc).toBe(false);
    if (!k.soSanhDuoc) {
      expect(k.lyDo.ma).toBe("QUA_GAN");
      if (k.lyDo.ma === "QUA_GAN") expect(k.lyDo.soNgay).toBe(30);
    }
  });

  it("đúng 89 ngày vẫn từ chối, đúng 90 ngày thì nhận — biên rõ ràng", () => {
    const goc = Date.UTC(2026, 0, 1);
    const sau = (n: number) => new Date(goc + n * 86_400_000).toISOString();

    const gan = soSanhTheoThoiGian([
      bai("a", sau(0), DIEM_A),
      bai("b", sau(NGAY_TOI_THIEU_DE_SO_SANH - 1), DIEM_B),
    ]);
    expect(gan.soSanhDuoc).toBe(false);

    const du = soSanhTheoThoiGian([
      bai("a", sau(0), DIEM_A),
      bai("b", sau(NGAY_TOI_THIEU_DE_SO_SANH), DIEM_B),
    ]);
    expect(du.soSanhDuoc).toBe(true);
  });
});

describe("so được rồi thì trả đúng trục lệch", () => {
  const K = soSanhTheoThoiGian([
    bai("cu", "2026-01-01T00:00:00Z", DIEM_A),
    bai("moi", "2026-06-01T00:00:00Z", DIEM_B),
  ]);

  it("nhận đúng bài nào trước, bài nào sau — không phụ thuộc thứ tự truyền vào", () => {
    expect(K.soSanhDuoc).toBe(true);
    if (!K.soSanhDuoc) return;
    expect(K.baiTruoc.id).toBe("cu");
    expect(K.baiSau.id).toBe("moi");

    const daoThuTu = soSanhTheoThoiGian([
      bai("moi", "2026-06-01T00:00:00Z", DIEM_B),
      bai("cu", "2026-01-01T00:00:00Z", DIEM_A),
    ]);
    expect(daoThuTu.soSanhDuoc && daoThuTu.baiTruoc.id).toBe("cu");
  });

  it("bảng đủ bốn trục, giữ thứ tự cố định D-I-S-C", () => {
    if (!K.soSanhDuoc) throw new Error("phải so được");
    expect(K.bang.map((b) => b.truc)).toEqual([...MA_TRUC]);
  });

  it("🔴 nêu tối đa HAI trục đổi rõ, và đúng hai trục đổi nhiều nhất", () => {
    if (!K.soSanhDuoc) throw new Error("phải so được");
    // D: 40→68 (+28), S: 70→55 (−15), I: +2, C: +2.
    expect(K.trucDoiRo).toHaveLength(2);
    expect([...K.trucDoiRo].sort()).toEqual(["D", "S"]);
  });

  it("trục nhích vài điểm KHÔNG được nêu — đó là nhiễu, không phải thay đổi", () => {
    if (!K.soSanhDuoc) throw new Error("phải so được");
    expect(K.trucDoiRo).not.toContain("I");
    expect(K.trucDoiRo).not.toContain("C");
  });

  it("bốn trục giữ nguyên ⇒ không nêu trục nào", () => {
    const yNguyen = soSanhTheoThoiGian([
      bai("a", "2026-01-01T00:00:00Z", DIEM_A),
      bai("b", "2026-06-01T00:00:00Z", DIEM_A),
    ]);
    expect(yNguyen.soSanhDuoc && yNguyen.trucDoiRo).toEqual([]);
  });

  it("KHÔNG đụng vào mảng gốc", () => {
    const ds = [bai("a", "2026-01-01T00:00:00Z", DIEM_A), bai("b", "2026-06-01T00:00:00Z", DIEM_B)];
    const ban = [...ds];
    soSanhTheoThoiGian(ds);
    expect(ds).toEqual(ban);
  });
});

describe("🔴🔴 GIỌNG VĂN — cấm tuyệt đối từ đánh giá tốt/xấu", () => {
  const MOI_CHUOI = Object.values(CHU_SO_SANH).join("\n");

  it("KHÔNG có 'tiến bộ' ở bất kỳ chuỗi nào", () => {
    // DISC không có chiều tốt/xấu nên không có gì để tiến bộ. Nói vậy là ngầm khẳng định
    // một trục cao thì tốt hơn — sai về mô hình, và biến báo cáo thành bảng điểm.
    expect(MOI_CHUOI).not.toMatch(/tiến bộ/iu);
  });

  it("KHÔNG có 'cải thiện'", () => {
    expect(MOI_CHUOI).not.toMatch(/cải thiện/iu);
  });

  it("🔴 KHÔNG có bất kỳ từ đánh giá nào khác cùng họ", () => {
    expect(MOI_CHUOI).not.toMatch(
      /tốt hơn|khá hơn|giỏi hơn|tệ hơn|kém hơn|thụt lùi|đi xuống|tụt|xuất sắc|đáng khen|chúc mừng|thành tích/iu,
    );
  });

  it("KHÔNG dùng từ khuyết thiếu", () => {
    // 🔴 Cửa này CỐ Ý soi chuỗi con, không soi ranh giới từ — nên nó bắt nhầm cả những từ
    // ghép vô hại như "chủ yếu". Đó là đánh đổi có chủ ý: ở đây một lần báo nhầm chỉ tốn
    // công đổi một chữ, còn một lần bỏ sót là để chữ "điểm yếu" đi thẳng tới một phụ
    // huynh đang đọc về con mình. Dính cửa này thì viết lại câu, đừng nới cửa.
    expect(MOI_CHUOI).not.toMatch(/thiếu|yếu|kém|khiếm khuyết|cần bổ sung|khắc phục/iu);
  });

  it("🔴 câu diễn giải MỞ MỘT CÂU HỎI, không phát một bằng khen", () => {
    expect(CHU_SO_SANH.coDoi).toMatch(/\?/u);
    expect(CHU_SO_SANH.coDoi).toMatch(/điều gì đã đổi/iu);
  });

  it("hướng thay đổi nói bằng từ TRUNG TÍNH, không nói lên/xuống theo nghĩa hơn/kém", () => {
    expect(CHU_SO_SANH.huongLen).toBe("hiện rõ hơn");
    expect(CHU_SO_SANH.huongXuong).toBe("nhẹ đi");
    for (const c of [CHU_SO_SANH.huongLen, CHU_SO_SANH.huongXuong]) {
      expect(c).not.toMatch(/tăng|giảm|cao hơn|thấp hơn/iu);
    }
  });

  it("câu mở đầu nói RÕ không có lần nào đúng hơn lần nào", () => {
    expect(CHU_SO_SANH.moDau).toMatch(/không có lần nào đúng hơn lần nào/iu);
  });

  it("lý do 'gần quá' nói thẳng đó là sai số phép đo, không đổ cho người dùng", () => {
    expect(CHU_SO_SANH.quaGan).toMatch(/sai số/iu);
    expect(CHU_SO_SANH.quaGan).toMatch(/\{toiThieu\}/u);
  });
});
