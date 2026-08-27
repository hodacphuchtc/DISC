import { describe, expect, it } from "vitest";

import { MA_TRUC, type MaBoDe, type MaTruc } from "../modules/core/bo-de/kieu";
import {
  layDienGiaiDay,
  luaTuoiTu,
  maPhaCoThuTu,
  type DauVaoDienGiai,
} from "../modules/report/dien-giai";

const XEP = (diem: Record<MaTruc, number>): MaTruc[] =>
  [...MA_TRUC].sort((a, b) => diem[b] - diem[a] || MA_TRUC.indexOf(a) - MA_TRUC.indexOf(b));

function dung(diem: Record<MaTruc, number>, them: Partial<DauVaoDienGiai> = {}) {
  return layDienGiaiDay({ diem, xepHang: XEP(diem), maBoDe: "QS", ...them });
}

describe("🔴 HỒI QUY — lỗi gốc: điểm số không hề chạm vào văn bản", () => {
  /**
   * `layDienGiai(kieu, maBoDe)` cũ không nhận `diem`. Hai hồ sơ cùng thứ hạng nhưng cường
   * độ khác hẳn nhau cho ra báo cáo giống nhau TỪNG BYTE. Đó là lõi của lời chê "sơ sài".
   */
  const manh = { D: 92, I: 40, S: 30, C: 20 };
  const nhe = { D: 58, I: 40, S: 30, C: 20 };

  it("cùng xếp hạng nhưng điểm lệch xa ⇒ văn bản PHẢI khác nhau", () => {
    const a = dung(manh);
    const b = dung(nhe);
    expect(XEP(manh)).toEqual(XEP(nhe)); // cùng thứ hạng, khác cường độ
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });

  it("hồ sơ nổi rõ được thêm ĐÚNG MỘT mệnh đề cường độ", () => {
    const a = dung(manh);
    const noiNhat = a.phoBonNhom.find((t) => t.viTri === "noiNhat");
    expect(noiNhat?.mucDoRo).toBeTruthy();
  });

  it("hồ sơ chưa đủ nổi thì im lặng, không bịa cường độ", () => {
    const b = dung(nhe);
    expect(b.phoBonNhom.find((t) => t.viTri === "noiNhat")?.mucDoRo).toBeUndefined();
  });

  it("🔴 cường độ chỉ đổi MỘT mệnh đề, không xoay mạch văn", () => {
    // Chặn thiệt hại khi ngưỡng đoán sai: ngoài `mucDoRo`, mọi thứ khác phải y hệt.
    const a = dung(manh);
    const b = dung({ ...manh, D: 69.9 });
    const bo = (x: ReturnType<typeof dung>) =>
      JSON.stringify({
        ...x,
        // Bỏ đúng hai thứ được phép khác: mệnh đề cường độ, và con số điểm.
        phoBonNhom: x.phoBonNhom.map((t) => ({
          truc: t.truc,
          viTri: t.viTri,
          bieuHien: t.bieuHien,
          than: t.than,
          choCanDeY: t.choCanDeY,
        })),
      });
    expect(bo(a)).toBe(bo(b));
  });
});

describe("🔴 HỒI QUY — §9.2 luật 2: ĐỦ BỐN TRỤC đều có chữ", () => {
  /**
   * Bản dựng đầu tiên làm theo KIỂU nên chỉ trục trội có chữ. Phụ huynh nhìn biểu đồ bốn
   * cột có số đầy đủ mà chỉ đọc được về một nhóm. Hạng mục đã tick ✅ nhưng nghiệm thu bằng
   * tiêu chí sai.
   */
  const hoSo: Record<string, Record<MaTruc, number>> = {
    "đơn D": { D: 90, I: 55, S: 35, C: 45 },
    "đơn C": { D: 37.5, I: 45.8, S: 54.2, C: 79.2 },
    "pha I-S": { D: 40, I: 70, S: 70, C: 30 },
    "phổ đều": { D: 54.2, I: 54.2, S: 50, C: 50 },
  };

  it.each(Object.entries(hoSo))("%s: cả bốn trục đều có biểu hiện và thân bài", (_ten, diem) => {
    const dg = dung(diem);
    expect(dg.phoBonNhom).toHaveLength(4);
    for (const t of dg.phoBonNhom) {
      expect(t.bieuHien.length, `trục ${t.truc}`).toBeGreaterThan(30);
      expect(t.than.length, `trục ${t.truc}`).toBeGreaterThan(30);
    }
  });

  it.each(Object.entries(hoSo))("%s: đúng một trục nổi nhất và một trục nhẹ nhất", (_ten, diem) => {
    const dg = dung(diem);
    expect(dg.phoBonNhom.filter((t) => t.viTri === "noiNhat")).toHaveLength(1);
    expect(dg.phoBonNhom.filter((t) => t.viTri === "nheNhat")).toHaveLength(1);
  });

  it("trục nhẹ nhất KHÔNG bị chê hai lần", () => {
    // `khiNhe` đã gói cả cái được lẫn cái giá; kèm thêm `choCanDeY` là chê chồng chê.
    const dg = dung(hoSo["đơn D"]);
    expect(dg.phoBonNhom.find((t) => t.viTri === "nheNhat")?.choCanDeY).toBeUndefined();
  });

  it("trục nổi và trục giữa đều có 'chỗ cần để ý' — không khối nào toàn lời khen", () => {
    const dg = dung(hoSo["đơn D"]);
    for (const t of dg.phoBonNhom.filter((x) => x.viTri !== "nheNhat")) {
      expect(t.choCanDeY, `trục ${t.truc}`).toBeTruthy();
    }
  });

  it("chữ đọc cùng thứ tự với bốn cột biểu đồ (D-I-S-C)", () => {
    expect(dung(hoSo["đơn C"]).phoBonNhom.map((t) => t.truc)).toEqual([...MA_TRUC]);
  });
});

describe("🔴 HỒI QUY — cặp pha mất thứ tự: DI đọc y hệt ID", () => {
  it("maPhaCoThuTu lấy thứ tự từ xepHang, không sắp lại D-I-S-C", () => {
    expect(maPhaCoThuTu(["I", "D", "S", "C"])).toBe("ID");
    expect(maPhaCoThuTu(["D", "I", "S", "C"])).toBe("DI");
  });

  it("hai hồ sơ pha ngược chiều nhau cho ra văn bản KHÁC nhau", () => {
    const dTroi = dung({ D: 70, I: 66, S: 30, C: 20 });
    const iTroi = dung({ D: 66, I: 70, S: 30, C: 20 });
    expect(dTroi.pha?.than).toBeTruthy();
    expect(iTroi.pha?.than).toBeTruthy();
    expect(dTroi.pha?.than).not.toBe(iTroi.pha?.than);
  });

  it("kiểu đơn và phổ đều thì không có khối pha", () => {
    expect(dung({ D: 90, I: 40, S: 30, C: 20 }).pha).toBeUndefined();
    expect(dung({ D: 52, I: 51, S: 50, C: 49 }).pha).toBeUndefined();
  });
});

describe("đúng người đọc — lời khuyên không được gửi nhầm", () => {
  /**
   * Lỗi đã trả giá 27/08/2026: khối viết cho phụ huynh hỏi con bị dùng nguyên cho bộ THCS,
   * nơi người đọc là chính học sinh.
   */
  const diem = { D: 80, I: 50, S: 40, C: 30 };

  it.each(["MN", "QS"] as const)("bộ %s: người lớn đọc về trẻ ⇒ có lời khuyên đầy đủ", (ma) => {
    const dg = dung(diem, { maBoDe: ma });
    expect(dg.loiKhuyen).toBeTruthy();
    expect(dg.tuMinh).toBeUndefined();
    expect(dg.loiKhuyen?.cauNenNoi).toHaveLength(3);
    expect(dg.loiKhuyen?.cauNenTranh).toHaveLength(3);
  });

  it.each(["TH", "THCS", "PH"] as const)("bộ %s: tự đọc về mình ⇒ dùng bản tự đọc", (ma) => {
    const dg = dung(diem, { maBoDe: ma });
    expect(dg.tuMinh).toBeTruthy();
    expect(dg.loiKhuyen).toBeUndefined();
  });

  it("🔴 bộ THCS: không một chữ 'con' nào lọt vào bản tự đọc", () => {
    const dg = dung(diem, { maBoDe: "THCS" });
    const chu = [dg.tuMinh?.khiCangThang, dg.tuMinh?.tapThem, dg.tuMinh?.motViecToiNay].join(" ");
    expect(/(?<!\p{L})con(?!\p{L})/iu.test(chu), chu).toBe(false);
  });
});

describe("lứa tuổi", () => {
  it("bốn bộ suy thẳng từ mã bộ đề", () => {
    expect(luaTuoiTu("MN")).toBe("MN");
    expect(luaTuoiTu("TH")).toBe("TH");
    expect(luaTuoiTu("THCS")).toBe("THCS");
    expect(luaTuoiTu("PH")).toBe("NGUOI_LON");
  });

  it("🔴 bộ QS bắc qua hai lứa — chỉ tuổi phân định được", () => {
    expect(luaTuoiTu("QS", 9)).toBe("TH");
    expect(luaTuoiTu("QS", 14)).toBe("THCS");
  });

  it("bài cũ thiếu tuổi thì rơi về bản nhẹ nhàng hơn, không ném", () => {
    expect(luaTuoiTu("QS", undefined)).toBe("TH");
  });

  it("cùng hồ sơ, khác lứa ⇒ biểu hiện viết khác nhau", () => {
    const diem = { D: 80, I: 50, S: 40, C: 30 };
    const be = dung(diem, { maBoDe: "QS", tuoi: 9 });
    const lon = dung(diem, { maBoDe: "QS", tuoi: 14 });
    expect(be.phoBonNhom[0].bieuHien).not.toBe(lon.phoBonNhom[0].bieuHien);
  });
});

describe("🔴 bài lưu từ TRƯỚC khi có trường mới vẫn phải ra báo cáo đầy đủ", () => {
  /**
   * Màn *Bài đã làm* dựng lại kết quả từ bản ghi cũ. Ném ở đây là làm hỏng cả màn lịch sử
   * của những người đã dùng sản phẩm từ trước.
   */
  const cu: DauVaoDienGiai = {
    diem: { D: 70, I: 30, S: 25, C: 40 },
    xepHang: ["D", "C", "I", "S"],
    maBoDe: "QS",
    // không có `tuoi`, không có `banKhoan` — đúng hình dạng bản ghi trước GĐ B
  };

  it("không ném, và vẫn đủ bốn trục", () => {
    const dg = layDienGiaiDay(cu);
    expect(dg.phoBonNhom).toHaveLength(4);
    expect(dg.trongNhuTheNao.length).toBeGreaterThan(0);
  });

  it("mã băn khoăn rác thì bỏ qua, không ném", () => {
    const dg = layDienGiaiDay({ ...cu, banKhoan: "khong-co-that" });
    expect(dg.banKhoan).toBeUndefined();
  });

  it("mã băn khoăn thật thì hiện lời mở đầu", () => {
    const dg = layDienGiaiDay({ ...cu, banKhoan: "hay-cau" });
    expect(dg.banKhoan?.nhan).toBeTruthy();
    expect(dg.banKhoan?.loiMoDau).toContain("không giải thích");
  });
});

describe("🔴 không còn chỗ giữ chỗ nào chưa thay", () => {
  const MOI_BO: readonly MaBoDe[] = ["MN", "TH", "THCS", "PH", "QS"];
  const HO_SO: Record<MaTruc, number>[] = [
    { D: 90, I: 55, S: 35, C: 45 },
    { D: 40, I: 70, S: 70, C: 30 },
    { D: 54.2, I: 54.2, S: 50, C: 50 },
    { D: 20, I: 30, S: 45, C: 85 },
  ];

  it("mọi bộ đề × mọi hồ sơ đều sạch dấu ngoặc nhọn", () => {
    for (const ma of MOI_BO) {
      for (const diem of HO_SO) {
        const dg = layDienGiaiDay({ diem, xepHang: XEP(diem), maBoDe: ma, banKhoan: "le-me" });
        const chu = JSON.stringify(dg);
        expect(chu.match(/\{[A-Za-z]+\}/u), `bộ ${ma}: ${chu.slice(0, 120)}`).toBeNull();
      }
    }
  });
});
