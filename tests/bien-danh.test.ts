import { describe, expect, it } from "vitest";

import {
  DO_DAI_BIET_DANH_TOI_DA,
  bietDanhHopLe,
  chuanHoaBietDanh,
  demKyTu,
  nghiLaHoTen,
} from "../modules/test/biet-danh";

describe("chuanHoaBietDanh", () => {
  it("cắt đúng độ dài tối đa", () => {
    const dai = "a".repeat(40);
    expect(chuanHoaBietDanh(dai)).toHaveLength(DO_DAI_BIET_DANH_TOI_DA);
  });

  it("🔴 đếm ký tự tiếng Việt có dấu là 1, không phải 2", () => {
    // 24 chữ "ẩ" — nếu đếm theo .length của chuỗi NFD thì thành 48 và bị cắt còn 12.
    const viet = "ẩ".repeat(30);
    expect(demKyTu(chuanHoaBietDanh(viet))).toBe(DO_DAI_BIET_DANH_TOI_DA);
  });

  it("chữ gõ kiểu tổ hợp (NFD) và kiểu dựng sẵn (NFC) cho cùng kết quả", () => {
    const ten = "Bé Bơ nhà bác Tư";
    expect(chuanHoaBietDanh(ten.normalize("NFD"))).toBe(chuanHoaBietDanh(ten.normalize("NFC")));
  });

  it("gộp khoảng trắng thừa", () => {
    expect(chuanHoaBietDanh("Bi    lớn\t\tnhà  trên")).toBe("Bi lớn nhà trên");
  });

  it("giữ khoảng trắng CUỐI để người dùng gõ tiếp được từ mới", () => {
    expect(chuanHoaBietDanh("Bi ")).toBe("Bi ");
  });

  it("bỏ khoảng trắng ĐẦU", () => {
    expect(chuanHoaBietDanh("   Bi")).toBe("Bi");
  });
});

describe("bietDanhHopLe", () => {
  it("chuỗi rỗng ⇒ không hợp lệ", () => {
    expect(bietDanhHopLe("")).toBe(false);
  });

  it("toàn khoảng trắng ⇒ không hợp lệ", () => {
    for (const rac of ["   ", "\t\t", "\n \n", "       "]) {
      expect(bietDanhHopLe(rac), `"${rac}" phải bị từ chối`).toBe(false);
    }
  });

  it("một ký tự cũng đủ hợp lệ", () => {
    expect(bietDanhHopLe("B")).toBe(true);
    expect(bietDanhHopLe("Bi")).toBe(true);
  });
});

describe("nghiLaHoTen — chỉ NHẮC, không chặn", () => {
  it("một hoặc hai từ ⇒ không nhắc", () => {
    expect(nghiLaHoTen("Bi")).toBe(false);
    expect(nghiLaHoTen("Bi lớn")).toBe(false);
  });

  it("ba từ trở lên ⇒ nhắc", () => {
    expect(nghiLaHoTen("Nguyễn Văn An")).toBe(true);
    expect(nghiLaHoTen("Trần Thị Bích Ngọc")).toBe(true);
  });

  it("nhắc nhưng VẪN hợp lệ — người dùng có quyền quyết định", () => {
    expect(nghiLaHoTen("Nguyễn Văn An")).toBe(true);
    expect(bietDanhHopLe("Nguyễn Văn An")).toBe(true);
  });
});
