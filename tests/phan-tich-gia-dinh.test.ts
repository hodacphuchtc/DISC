import { describe, expect, it } from "vitest";

import { SO_THANH_VIEN_TOI_DA, soTrucTheoN } from "../config/disc-gia-dinh";
import { MA_TRUC, type MaTruc } from "../modules/core/bo-de/kieu";
import {
  phanTichGiaDinh,
  theQuyenCua,
  type NguoiTrongPhanTich,
} from "../modules/report/phan-tich-gia-dinh";

/**
 * 🔴 14.2 — ENGINE PHÂN TÍCH N NGƯỜI.
 *
 * Cửa kiểm nặng nhất là SOI GƯƠNG: chênh lệch giữa A và B là MỘT con số, không phải hai.
 * Nếu tính hai lần thì hai lần đó lệch nhau vì làm tròn, và bản của A nói một chuyện còn
 * bản của B nói chuyện khác — về đúng cùng một chỗ vênh. Trong một sản phẩm mà cả nhà đọc
 * chung, đó là kiểu sai người ta phát hiện ngay lập tức và không bao giờ tin lại.
 *
 * 🔴 Mọi tên là BỊA.
 */

const diem = (D: number, I: number, S: number, C: number): Record<MaTruc, number> => ({
  D,
  I,
  S,
  C,
});

const nguoi = (
  id: string,
  ten: string,
  laTre: boolean,
  d: Record<MaTruc, number>,
): NguoiTrongPhanTich => ({ id, ten, laTre, diem: d });

const ME = nguoi("me", "Mẹ Lan", false, diem(75, 50, 40, 55));
const BIN = nguoi("bin", "Bin", true, diem(45, 62, 70, 48));
const BO = nguoi("bo", "Bố Nam", false, diem(52, 40, 58, 80));

describe("chặn ở đầu vào — KHÔNG sinh thư mục rỗng", () => {
  it("0 người ⇒ chưa đủ hai người", () => {
    expect(phanTichGiaDinh([])).toEqual({ phanTichDuoc: false, lyDo: "CHUA_DU_HAI_NGUOI" });
  });

  it("🔴 1 người ⇒ chưa đủ hai người, KHÔNG trả về bản rỗng", () => {
    const k = phanTichGiaDinh([ME]);
    expect(k.phanTichDuoc).toBe(false);
    if (!k.phanTichDuoc) expect(k.lyDo).toBe("CHUA_DU_HAI_NGUOI");
  });

  it("7 người ⇒ quá nhiều, chặn trước khi sinh 42 lát cắt không ai đọc", () => {
    const dong = Array.from({ length: SO_THANH_VIEN_TOI_DA + 1 }, (_, i) =>
      nguoi(`n${i}`, `Người ${i}`, false, diem(50 + i, 50, 50, 50)),
    );
    const k = phanTichGiaDinh(dong);
    expect(k.phanTichDuoc).toBe(false);
    if (!k.phanTichDuoc) expect(k.lyDo).toBe("QUA_NHIEU_NGUOI");
  });

  it("đúng trần 6 người thì vẫn chạy", () => {
    const vua = Array.from({ length: SO_THANH_VIEN_TOI_DA }, (_, i) =>
      nguoi(`n${i}`, `Người ${i}`, false, diem(30 + i * 12, 50, 50, 50)),
    );
    expect(phanTichGiaDinh(vua).phanTichDuoc).toBe(true);
  });
});

describe("hình dạng kết quả — N bản × (N−1) lát cắt", () => {
  it("🔴 nhà 3 người ⇒ ĐÚNG 3 bản, mỗi bản 2 lát cắt", () => {
    const k = phanTichGiaDinh([ME, BIN, BO]);
    expect(k.phanTichDuoc).toBe(true);
    if (!k.phanTichDuoc) return;
    expect(k.ban).toHaveLength(3);
    for (const b of k.ban) expect(b.latCat).toHaveLength(2);
  });

  it("không ai tự soi mình — lát cắt luôn trỏ sang người KHÁC", () => {
    const k = phanTichGiaDinh([ME, BIN, BO]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    for (const b of k.ban) {
      for (const l of b.latCat) expect(l.nguoiKiaId).not.toBe(b.toiId);
    }
  });

  it("🔴 CHỤP TÊN lúc chạy — đổi tên sau đó thì bản cũ vẫn đọc được", () => {
    const k = phanTichGiaDinh([ME, BIN]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    expect(k.ban.find((b) => b.toiId === "me")?.tenLuc).toBe("Mẹ Lan");
    expect(k.ban.find((b) => b.toiId === "bin")?.latCat[0].tenNguoiKia).toBe("Mẹ Lan");
  });

  it("nhà 2 người ⇒ 2 bản, mỗi bản 1 lát cắt", () => {
    const k = phanTichGiaDinh([ME, BIN]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    expect(k.ban).toHaveLength(2);
    for (const b of k.ban) expect(b.latCat).toHaveLength(1);
  });
});

describe("🔴 SOI GƯƠNG — cùng một chỗ vênh, hai người đọc hai chiều", () => {
  it("lech(B→A) = −lech(A→B), đúng dấu, đúng độ lớn", () => {
    const k = phanTichGiaDinh([ME, BIN]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");

    const cuaMe = k.ban.find((b) => b.toiId === "me")!.latCat[0];
    const cuaBin = k.ban.find((b) => b.toiId === "bin")!.latCat[0];

    expect(cuaMe.trucLech.length).toBeGreaterThan(0);
    expect(cuaBin.trucLech).toHaveLength(cuaMe.trucLech.length);

    for (const t of cuaMe.trucLech) {
      const nguoc = cuaBin.trucLech.find((x) => x.truc === t.truc);
      expect(nguoc, `trục ${t.truc} chỉ có ở một bản`).toBeTruthy();
      expect(nguoc!.lech).toBe(-t.lech);
    }
  });

  it("🔴 hướng cũng lật theo — A đọc 'tôi cao hơn' thì B đọc 'tôi thấp hơn'", () => {
    const k = phanTichGiaDinh([ME, BIN]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    const cuaMe = k.ban.find((b) => b.toiId === "me")!.latCat[0];
    const cuaBin = k.ban.find((b) => b.toiId === "bin")!.latCat[0];

    for (const t of cuaMe.trucLech) {
      const nguoc = cuaBin.trucLech.find((x) => x.truc === t.truc)!;
      expect(nguoc.huong).not.toBe(t.huong);
    }
  });

  it("HAI người đọc về CÙNG những trục — không ai được nói về trục người kia không thấy", () => {
    const k = phanTichGiaDinh([ME, BIN, BO]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    for (const b of k.ban) {
      for (const l of b.latCat) {
        const nguoc = k.ban
          .find((x) => x.toiId === l.nguoiKiaId)!
          .latCat.find((x) => x.nguoiKiaId === b.toiId)!;
        expect(l.trucLech.map((t) => t.truc).sort()).toEqual(
          nguoc.trucLech.map((t) => t.truc).sort(),
        );
      }
    }
  });
});

describe("số trục theo N — nhà đông thì nói ít lại", () => {
  it("N ≤ 3 ⇒ 2 trục mỗi lát; N ≥ 4 ⇒ 1 trục", () => {
    expect(soTrucTheoN(2)).toBe(2);
    expect(soTrucTheoN(3)).toBe(2);
    expect(soTrucTheoN(4)).toBe(1);
    expect(soTrucTheoN(6)).toBe(1);
  });

  it("🔴 nhà 4 người: mỗi lát cắt nêu tối đa MỘT trục", () => {
    // Nhà 5 người với 2 trục mỗi cặp là 120 đoạn — dài hơn một chương sách.
    const bon = [ME, BIN, BO, nguoi("chi", "Chị Mi", true, diem(20, 80, 30, 70))];
    const k = phanTichGiaDinh(bon);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    for (const b of k.ban) {
      for (const l of b.latCat) expect(l.trucLech.length).toBeLessThanOrEqual(1);
    }
  });
});

describe("🔴 TRÙNG KHỚP CẢ BỐN TRỤC — vẫn phải có chữ, không để trống", () => {
  const GIONG_HET = nguoi("a", "An", false, diem(60, 55, 50, 45));
  const GAN_GIONG = nguoi("b", "Bảo", false, diem(62, 53, 52, 47));

  it("hai người gần như y hệt ⇒ trucLech rỗng nhưng CÓ khối trùng khớp", () => {
    const k = phanTichGiaDinh([GIONG_HET, GAN_GIONG]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    const l = k.ban[0].latCat[0];
    expect(l.trucLech).toHaveLength(0);
    expect(l.trungKhop, "trùng khớp mà để trống là một màn hình trắng").toBeTruthy();
    expect(l.trungKhop).toHaveLength(MA_TRUC.length);
  });

  it("phân loại đúng cùng-nổi và cùng-nhẹ", () => {
    const k = phanTichGiaDinh([GIONG_HET, GAN_GIONG]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    const tk = k.ban[0].latCat[0].trungKhop!;
    expect(tk.find((x) => x.truc === "D")?.kieu).toBe("cung-noi");
    expect(tk.find((x) => x.truc === "C")?.kieu).toBe("cung-nhe");
  });

  it("có trục lệch rõ thì KHÔNG kèm khối trùng khớp — hai thứ loại trừ nhau", () => {
    const k = phanTichGiaDinh([ME, BIN]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    expect(k.ban[0].latCat[0].trungKhop).toBeUndefined();
  });
});

describe("🔴 THẾ QUYỀN — ai đang nói với ai", () => {
  it("trẻ đọc về người lớn ⇒ tre-voi-nguoi-lon", () => {
    expect(theQuyenCua(true, false)).toBe("tre-voi-nguoi-lon");
  });

  it("người lớn đọc về trẻ ⇒ nguoi-lon-voi-tre", () => {
    expect(theQuyenCua(false, true)).toBe("nguoi-lon-voi-tre");
  });

  it("hai người lớn, hoặc hai anh em ⇒ ngang-vai", () => {
    // Cái quyết định không phải TUỔI mà là chênh lệch QUYỀN trong nhà.
    expect(theQuyenCua(false, false)).toBe("ngang-vai");
    expect(theQuyenCua(true, true)).toBe("ngang-vai");
  });

  it("engine gán đúng thế quyền cho từng lát cắt", () => {
    const k = phanTichGiaDinh([ME, BIN, BO]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    const binVeMe = k.ban.find((b) => b.toiId === "bin")!.latCat.find((l) => l.nguoiKiaId === "me")!;
    const meVeBin = k.ban.find((b) => b.toiId === "me")!.latCat.find((l) => l.nguoiKiaId === "bin")!;
    const meVeBo = k.ban.find((b) => b.toiId === "me")!.latCat.find((l) => l.nguoiKiaId === "bo")!;

    expect(binVeMe.theQuyen).toBe("tre-voi-nguoi-lon");
    expect(meVeBin.theQuyen).toBe("nguoi-lon-voi-tre");
    expect(meVeBo.theQuyen).toBe("ngang-vai");
  });
});
