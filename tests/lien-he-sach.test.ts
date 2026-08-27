import { describe, expect, it } from "vitest";

import {
  KHOA_CAM,
  chuanHoaSoDienThoai,
  soDienThoaiHopLe,
  taoPhieu,
  timKhoaCam,
} from "../modules/core/lien-he/kieu";

const PHIEU = {
  soDienThoai: "0912 345 678",
  tenGoi: "Mẹ Bi",
  kenhMuonNhan: "zalo" as const,
  nguon: "lop-3a",
  luc: "2026-08-27T07:00:00+07:00",
};

/** Một bài làm đầy đủ — thứ TUYỆT ĐỐI không được lọt vào phiếu. */
const BAI_LAM = {
  boDe: "THCS",
  maTre: "Bi",
  lop: "7",
  traLoi: { "THCS-D1": 4, "THCS-I6": 2 },
  ketQua: {
    hopLe: true,
    diem: { D: 70, I: 30, S: 25, C: 40 },
    xepHang: ["D", "C", "I", "S"],
    kieu: { loai: "don", truc: "D" },
    canhBao: [],
  },
};

describe("số điện thoại", () => {
  it("bỏ khoảng trắng và dấu ngăn", () => {
    expect(chuanHoaSoDienThoai("0912 345 678")).toBe("0912345678");
    expect(chuanHoaSoDienThoai("091-234.5678")).toBe("0912345678");
  });

  it("nhận số Việt Nam 10 chữ số bắt đầu bằng 0", () => {
    expect(soDienThoaiHopLe("0912345678")).toBe(true);
    expect(soDienThoaiHopLe("0912 345 678")).toBe(true);
  });

  it("từ chối số sai định dạng", () => {
    for (const rac of ["", "123", "912345678", "09123456789", "abcdefghij", "+84912345678"]) {
      expect(soDienThoaiHopLe(rac), rac).toBe(false);
    }
  });
});

describe("🔴 QĐ3 — phiếu liên hệ KHÔNG được chứa dữ liệu của trẻ", () => {
  it("phiếu chỉ có đúng các trường liên hệ", () => {
    const p = taoPhieu(PHIEU);
    expect(Object.keys(p).sort()).toEqual(
      ["kenhMuonNhan", "luc", "nguon", "soDienThoai", "tenGoi"].sort(),
    );
  });

  it("🔴 phiếu KHÔNG chứa bất kỳ khoá cấm nào", () => {
    expect(timKhoaCam(taoPhieu(PHIEU))).toEqual([]);
  });

  it("bỏ trống tên gọi thì phiếu không có trường đó, không có chuỗi rỗng", () => {
    const p = taoPhieu({ ...PHIEU, tenGoi: "   " });
    expect("tenGoi" in p).toBe(false);
  });

  it("timKhoaCam bắt được khoá cấm ở MỌI độ sâu — hàng rào tự nó phải hoạt động", () => {
    expect(timKhoaCam(BAI_LAM).sort()).toEqual(
      ["boDe", "ketQua", "ketQua.canhBao", "ketQua.diem", "ketQua.kieu", "ketQua.xepHang", "lop", "maTre", "traLoi"].sort(),
    );
    expect(timKhoaCam({ a: { b: { c: { diem: 1 } } } })).toEqual(["a.b.c.diem"]);
  });

  it("🔴 chữ ký taoPhieu KHÔNG có đường nào nhận dữ liệu trẻ", () => {
    // Nhận đúng MỘT tham số là object các trường liên hệ. Không có tham số bài làm.
    expect(taoPhieu).toHaveLength(1);
    // Và dù có cố nhét thêm, phiếu trả về vẫn sạch:
    const p = taoPhieu({ ...PHIEU, ...(BAI_LAM as unknown as object) } as Parameters<typeof taoPhieu>[0]);
    expect(timKhoaCam(p)).toEqual([]);
  });

  it("danh sách khoá cấm phủ đủ mọi trường của bài làm", () => {
    for (const k of Object.keys(BAI_LAM)) {
      expect(KHOA_CAM as readonly string[], `thiếu "${k}"`).toContain(k);
    }
  });
});
