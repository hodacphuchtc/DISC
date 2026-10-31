/**
 * `29.1` — xưng hô trung tính: bố/mẹ/ông/bà/người thân/khác. Tên bịa.
 */

import { describe, expect, it } from "vitest";

import { VAI_GIA_DINH } from "../config/disc-gia-dinh";
import {
  goiNguoiKiaTheoVai,
  thayXungHo,
  xungTreTheoVai,
} from "../config/disc-xung-ho";

describe("xungTreTheoVai", () => {
  it("bố, mẹ ⇒ con", () => {
    expect(xungTreTheoVai("bo")).toBe("con");
    expect(xungTreTheoVai("me")).toBe("con");
  });
  it("ông, bà ⇒ cháu", () => {
    expect(xungTreTheoVai("ong")).toBe("cháu");
    expect(xungTreTheoVai("ba")).toBe("cháu");
  });
  it("người thân, khác, anh/chị/em, chưa biết vai ⇒ em", () => {
    for (const v of ["nguoi-than", "khac", "anh-chi-em", undefined] as const) {
      expect(xungTreTheoVai(v), String(v)).toBe("em");
    }
  });
});

describe("goiNguoiKiaTheoVai", () => {
  it("bố/mẹ/ông/bà ⇒ chức danh, KHÔNG dùng tên (trẻ không gọi mẹ là 'Mẹ Lan')", () => {
    expect(goiNguoiKiaTheoVai("me", "Mẹ Lan")).toBe("Mẹ");
    expect(goiNguoiKiaTheoVai("bo", "Bố Nam")).toBe("Bố");
    expect(goiNguoiKiaTheoVai("ong", "Ông Sáu")).toBe("Ông");
    expect(goiNguoiKiaTheoVai("ba", "Bà Bảy")).toBe("Bà");
  });
  it("người khác ⇒ tên trong sổ", () => {
    expect(goiNguoiKiaTheoVai("nguoi-than", "Cô Hoa")).toBe("Cô Hoa");
    expect(goiNguoiKiaTheoVai(undefined, "Cô Hoa")).toBe("Cô Hoa");
  });
});

describe("thayXungHo", () => {
  const cau = "“{GoiNguoiKia} ơi, {xungTre} cần nghĩ một chút ạ.” {XungTre} sẽ nói rõ với {nguoiKia}.";

  it("bé nói với mẹ ⇒ 'Mẹ ơi, con …'", () => {
    expect(thayXungHo(cau, "tre-voi-nguoi-lon", "Mẹ Lan", { vaiNguoiKia: "me" })).toBe(
      "“Mẹ ơi, con cần nghĩ một chút ạ.” Con sẽ nói rõ với Mẹ Lan.",
    );
  });
  it("🔴 cháu nói với bà ⇒ 'Bà ơi, cháu …' — cùng một câu, không viết lại", () => {
    expect(thayXungHo(cau, "tre-voi-nguoi-lon", "Bà Bảy", { vaiNguoiKia: "ba" })).toBe(
      "“Bà ơi, cháu cần nghĩ một chút ạ.” Cháu sẽ nói rõ với Bà Bảy.",
    );
  });
  it("với người thân ⇒ gọi bằng tên, xưng em", () => {
    expect(thayXungHo(cau, "tre-voi-nguoi-lon", "Cô Hoa", { vaiNguoiKia: "nguoi-than" })).toContain(
      "“Cô Hoa ơi, em cần",
    );
  });
  it("vẫn thay {toi}/{nguoiKia} như thayDaiTuCap", () => {
    expect(thayXungHo("{Toi} nói với {nguoiKia}", "ngang-vai", "Bình", {})).toBe("Bạn nói với Bình");
  });
  it("🔴 mọi vai ⇒ không sót chỗ giữ nào", () => {
    for (const v of VAI_GIA_DINH) {
      const kq = thayXungHo(cau + " {toi} {Toi} {NguoiKia}", "tre-voi-nguoi-lon", "Tên", { vaiNguoiKia: v });
      expect(kq, v).not.toMatch(/[{}]/u);
    }
  });
});
