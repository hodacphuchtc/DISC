/**
 * `28.3` — chọn bản để phân tích. Tên bịa.
 */

import { describe, expect, it } from "vitest";

import type { MaBoDe } from "../modules/core/bo-de/kieu";
import { banUuTien, nhanCuaBan } from "../modules/report/chon-ban";

const b = (id: string, boDe: MaBoDe, ketThuc: string, hopLe = true) => ({
  id,
  boDe,
  ketThuc,
  ketQua: { hopLe },
});

describe("banUuTien", () => {
  it("lấy bản HỢP LỆ mới nhất", () => {
    const ds = [b("moi", "PH", "2026-09-01"), b("cu", "PH", "2026-01-01")];
    expect(banUuTien(ds)?.id).toBe("moi");
  });

  it("🔴 bản mới nhất bị hỏng ⇒ lùi về bản hợp lệ gần nhất, không loại cả người", () => {
    const ds = [b("hong", "PH", "2026-09-01", false), b("tot", "PH", "2026-01-01")];
    expect(banUuTien(ds)?.id).toBe("tot");
  });

  it("không có bản hợp lệ nào ⇒ null", () => {
    expect(banUuTien([b("h", "PH", "2026-09-01", false)])).toBeNull();
    expect(banUuTien([])).toBeNull();
  });

  it("🔴 lấy bản MỚI NHẤT bất kể loại (đúng lời chủ dự án), không ưu tiên loại nào", () => {
    const ds = [b("qs-moi", "QS", "2026-09-01"), b("th-cu", "TH", "2026-03-01")];
    expect(banUuTien(ds)?.id).toBe("qs-moi");
    const nguoc = [b("th-moi", "TH", "2026-09-01"), b("qs-cu", "QS", "2026-03-01")];
    expect(banUuTien(nguoc)?.id).toBe("th-moi");
  });

  it("bản mới nhất hỏng ⇒ lùi về bản hợp lệ gần nhất dù khác loại", () => {
    const ds = [b("th-hong", "TH", "2026-09-01", false), b("qs", "QS", "2026-03-01")];
    expect(banUuTien(ds)?.id).toBe("qs");
  });

  it("hai bản cùng giờ ⇒ chọn cố định theo id (không phụ thuộc thứ tự mảng)", () => {
    const x = [b("a", "PH", "2026-01-01"), b("b", "PH", "2026-01-01")];
    expect(banUuTien(x)?.id).toBe(banUuTien([...x].reverse())?.id);
  });

  it("không đụng mảng gốc", () => {
    const ds = [b("a", "PH", "2026-01-01"), b("b", "PH", "2026-05-01")];
    const goc = [...ds];
    banUuTien(ds);
    expect(ds).toEqual(goc);
  });
});

describe("nhanCuaBan", () => {
  const ds = [
    b("th-moi", "TH", "2026-09-01"),
    b("th-cu", "TH", "2026-03-01"),
    b("qs-moi", "QS", "2026-08-01"),
    b("hong", "TH", "2026-10-01", false),
  ];
  it("mới nhất được tính THEO TỪNG LOẠI", () => {
    expect(nhanCuaBan(ds, ds[0])).toBe("moi-nhat");
    expect(nhanCuaBan(ds, ds[2])).toBe("moi-nhat");
    expect(nhanCuaBan(ds, ds[1])).toBe("ban-cu");
  });
  it("bản hỏng ⇒ không dùng được, dù ngày mới nhất", () => {
    expect(nhanCuaBan(ds, ds[3])).toBe("khong-dung-duoc");
  });
});
