/**
 * `28.6` — hạn test lại 6 tháng và tệp lịch .ics. Hàm thuần; tên bịa. TZ ghim +07 trong
 * vitest.config nên ngày theo máy ổn định.
 */

import { describe, expect, it } from "vitest";

import { THANG_NHAC_LAI } from "../config/disc-nguong";
import { congThang, hanCaNha, hanCuaMotNguoi } from "../modules/report/han-test-lai";
import { gapDong, taoLichNhac, tenTepLich } from "../modules/report/lich-nhac";

const NGAY = (s: string) => new Date(`${s}T12:00:00+07:00`);

describe("congThang", () => {
  it("cộng tháng theo lịch", () => {
    expect(congThang(NGAY("2026-03-15"), 6).getMonth()).toBe(8); // tháng 9
  });
  it("🔴 31/08 + 6 tháng ⇒ 28/02, không tràn sang tháng 3", () => {
    const d = congThang(NGAY("2026-08-31"), 6);
    expect([d.getFullYear(), d.getMonth() + 1, d.getDate()]).toEqual([2027, 2, 28]);
  });
  it("năm nhuận: 31/08/2027 + 6 ⇒ 29/02/2028", () => {
    const d = congThang(NGAY("2027-08-31"), 6);
    expect([d.getFullYear(), d.getMonth() + 1, d.getDate()]).toEqual([2028, 2, 29]);
  });
  it("qua năm", () => {
    const d = congThang(NGAY("2026-10-30"), 6);
    expect([d.getFullYear(), d.getMonth() + 1, d.getDate()]).toEqual([2027, 4, 30]);
  });
});

describe("hanCuaMotNguoi", () => {
  const nguoi = { id: "a", ten: "Mai" };
  it("mặc định đúng THANG_NHAC_LAI = 6", () => {
    expect(THANG_NHAC_LAI).toBe(6);
    const h = hanCuaMotNguoi(nguoi, "2026-03-15T09:00:00+07:00", NGAY("2026-03-16"))!;
    expect(h.ngayDen).toBe("2026-09-15");
  });
  it("còn bao nhiêu ngày", () => {
    const h = hanCuaMotNguoi(nguoi, "2026-03-15T09:00:00+07:00", NGAY("2026-09-10"))!;
    expect(h.conNgay).toBe(5);
    expect(h.denHan).toBe(false);
  });
  it("đúng hôm đến hạn ⇒ denHan, conNgay = 0", () => {
    const h = hanCuaMotNguoi(nguoi, "2026-03-15T09:00:00+07:00", NGAY("2026-09-15"))!;
    expect(h).toMatchObject({ conNgay: 0, denHan: true });
  });
  it("🔴 quá hạn ⇒ conNgay ÂM", () => {
    const h = hanCuaMotNguoi(nguoi, "2026-03-15T09:00:00+07:00", NGAY("2026-09-20"))!;
    expect(h).toMatchObject({ conNgay: -5, denHan: true });
  });
  it("chưa làm bài ⇒ null, không bịa hạn", () => {
    expect(hanCuaMotNguoi(nguoi, undefined, NGAY("2026-09-20"))).toBeNull();
  });
  it("ngày hỏng ⇒ null", () => {
    expect(hanCuaMotNguoi(nguoi, "không-phải-ngày", NGAY("2026-09-20"))).toBeNull();
  });
});

describe("hanCaNha", () => {
  const ds = [
    { id: "a", ten: "Mai", ganNhat: "2026-03-01T09:00:00+07:00" },
    { id: "b", ten: "Bình", ganNhat: "2026-06-01T09:00:00+07:00" },
    { id: "c", ten: "Cúc" },
  ];
  it("lấy hạn SỚM NHẤT của nhà, bỏ qua người chưa làm", () => {
    const h = hanCaNha(ds, NGAY("2026-08-01"))!;
    expect(h.som.ten).toBe("Mai");
    expect(h.som.ngayDen).toBe("2026-09-01");
    expect(h.tatCa.map((x) => x.ten)).toEqual(["Mai", "Bình"]);
  });
  it("liệt kê đúng những người đã đến hạn", () => {
    const h = hanCaNha(ds, NGAY("2026-09-05"))!;
    expect(h.nguoiDenHan.map((x) => x.ten)).toEqual(["Mai"]);
  });
  it("không ai có bản hợp lệ ⇒ null", () => {
    expect(hanCaNha([{ id: "c", ten: "Cúc" }], NGAY("2026-09-05"))).toBeNull();
  });
});

describe("tệp lịch .ics", () => {
  const ics = taoLichNhac("2027-04-30", new Date("2026-10-30T03:00:00Z"));

  it("đúng khung VCALENDAR/VEVENT, dòng kết thúc CRLF", () => {
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics.replace(/\r\n/gu, "").includes("\n")).toBe(false);
  });

  it("sự kiện cả ngày đúng ngày, có báo thức một ngày trước", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20270430");
    expect(ics).toContain("TRIGGER:-P1D");
    expect(ics).toContain("DTSTAMP:20261030T030000Z");
  });

  it("🔴 KHÔNG chứa tên ai hay điểm số — chỉ nói chung 'cả nhà'", () => {
    const bung = ics.replace(/\r\n /gu, "");
    expect(bung).toContain("Test lại DISC cả nhà");
    expect(bung).not.toMatch(/[Mm]ai|Bình|Cúc|\bD\s*[:=]\s*\d|điểm/u);
  });

  it("🔴 mỗi dòng ≤ 75 byte UTF-8 (tiếng Việt nặng hơn 1 byte/ký tự)", () => {
    const m = new TextEncoder();
    for (const dong of ics.split("\r\n")) expect(m.encode(dong).length, dong).toBeLessThanOrEqual(75);
  });

  it("gập dòng rồi ghép lại ra đúng chuỗi gốc, không cắt giữa ký tự", () => {
    const goc = "DESCRIPTION:" + "Việt Nam đẹp lắm, đất nước ta tươi xanh ".repeat(8);
    const gap = gapDong(goc);
    expect(gap.replace(/\r\n /gu, "")).toBe(goc);
    expect(gap).not.toContain("�");
  });

  it("escape dấu phẩy và chấm phẩy trong văn bản", () => {
    expect(ics).toContain("để hiểu\\, thương và chăm sóc nhau hơn");
  });

  it("ngày sai định dạng ⇒ ném lỗi, không sinh tệp hỏng", () => {
    expect(() => taoLichNhac("30/04/2027", new Date())).toThrow();
  });

  it("tên tệp theo ngày, không theo tên người", () => {
    expect(tenTepLich("2027-04-30")).toBe("disc-test-lai-2027-04-30.ics");
  });
});
