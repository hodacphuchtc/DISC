import { describe, expect, it } from "vitest";

import { goiHoSo } from "../modules/core/gia-dinh/ma-moi";
import { veLuoiQr } from "../modules/core/gia-dinh/qr";
import { SO_O, docDinhDang, docO, giaiMaQr, luyThua, nhanBit } from "./giai-ma-qr";

/**
 * Cửa kiểm cho bộ vẽ mã QR. Bộ giải mã ngược nằm ở `tests/giai-ma-qr.ts` — viết riêng
 * từ hình học của chuẩn, không gọi lại hàm nào của bộ mã hoá, để hai bên phải gặp nhau
 * ở giữa thì mới tính là đúng.
 *
 * Cửa kiểm CUỐI CÙNG vẫn là NGƯỜI cầm điện thoại quét (DEMO GĐ11 mục 6). Test không thay
 * được việc đó, chỉ làm cho nó nhiều khả năng thành công ngay lần đầu.
 */

/* ── Test ─────────────────────────────────────────────────────────────────── */

const MA_MAU = goiHoSo({
  boDe: "TH",
  vai: "con",
  diem: { D: 72.4, I: 55.1, S: 38.9, C: 61.7 },
  ngayPhat: "2026-08-27",
});

describe("veLuoiQr — khứ hồi qua bộ giải mã viết riêng", () => {
  it("🔴 giải ngược ra ĐÚNG chuỗi mã mời", () => {
    expect(giaiMaQr(veLuoiQr(MA_MAU))).toBe(MA_MAU);
  });

  it("mã mời vừa phiên bản 1 — lưới 21×21, không cần to hơn", () => {
    const luoi = veLuoiQr(MA_MAU);
    expect(luoi.length).toBe(21);
    expect(luoi[0].length).toBe(21);
  });

  it("giải ngược đúng với đủ mọi độ dài từ 1 tới 61 ký tự", () => {
    const nguon = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-ABCDEFGHIJKLMNOPQRSTUVWXY";
    for (let n = 1; n <= 61; n += 1) {
      const chuoi = nguon.slice(0, n);
      expect(giaiMaQr(veLuoiQr(chuoi)), `dài ${n}`).toBe(chuoi);
    }
  });

  it("nở lưới đúng lúc: 21 → 25 → 29 ô theo độ dài chuỗi", () => {
    expect(veLuoiQr("A".repeat(20)).length).toBe(21);
    expect(veLuoiQr("A".repeat(38)).length).toBe(25);
    expect(veLuoiQr("A".repeat(61)).length).toBe(29);
  });
});

describe("🔴 Reed–Solomon — kiểm bằng số học GF(256) viết theo lối khác", () => {
  it("mọi hội chứng của từ mã đều bằng 0, tức là phần sửa lỗi đúng thật", () => {
    // Một từ mã Reed–Solomon hợp lệ chia hết cho đa thức sinh, nên khi thay x = alpha^i
    // (i chạy hết số ô sửa lỗi) thì đa thức phải ra 0. Sai một chút ở bảng log, ở đa thức
    // sinh, hay ở phép chia đều làm hội chứng khác 0 — không có cách nào lọt.
    for (const chuoi of [MA_MAU, "A".repeat(38), "A".repeat(61)]) {
      const luoi = veLuoiQr(chuoi);
      const { matNa } = docDinhDang(luoi);
      const thongSo = SO_O[luoi.length];
      const tuMa = docO(luoi, matNa).slice(0, thongSo.duLieu + thongSo.suaLoi);

      for (let i = 0; i < thongSo.suaLoi; i += 1) {
        const x = luyThua(i);
        let giaTri = 0;
        for (const byte of tuMa) giaTri = nhanBit(giaTri, x) ^ byte;
        expect(giaTri, `hội chứng ${i} của chuỗi dài ${chuoi.length}`).toBe(0);
      }
    }
  });
});

describe("ô chức năng — thứ máy quét bám vào để bắt được mã", () => {
  const luoi = veLuoiQr(MA_MAU);
  const canh = luoi.length;

  it("ba hoa tiêu đủ và đúng hình, kèm dải phân cách trắng", () => {
    for (const [h0, c0] of [
      [0, 0],
      [0, canh - 7],
      [canh - 7, 0],
    ]) {
      for (let dh = 0; dh < 7; dh += 1) {
        for (let dc = 0; dc < 7; dc += 1) {
          const vien = dh === 0 || dh === 6 || dc === 0 || dc === 6;
          const nhan = dh >= 2 && dh <= 4 && dc >= 2 && dc <= 4;
          expect(luoi[h0 + dh][c0 + dc], `hoa tiêu (${h0},${c0}) ô ${dh},${dc}`).toBe(vien || nhan);
        }
      }
    }
  });

  it("🔴 hàng nhịp và cột nhịp kẻ sọc liền mạch — chỗ đã suýt vẽ hỏng", () => {
    // Vòng giữ chỗ cho bit định dạng ban đầu quét cả i = 6, tức là xoá trắng ô (cột 8,
    // hàng 6) và (cột 6, hàng 8) — hai ô NHỊP mà vùng định dạng không hề chạm tới, và
    // `veBitDinhDang()` cũng không bao giờ ghi đè lại. Mã vẫn vẽ ra trông rất đẹp.
    for (let i = 8; i <= canh - 9; i += 1) {
      expect(luoi[6][i], `nhịp ngang tại cột ${i}`).toBe(i % 2 === 0);
      expect(luoi[i][6], `nhịp dọc tại hàng ${i}`).toBe(i % 2 === 0);
    }
  });

  it("ô luôn đen ở đúng chỗ chuẩn quy định", () => {
    expect(luoi[canh - 8][8]).toBe(true);
  });
});

describe("vượt tầm thì NÉM LỖI, không cắt bớt", () => {
  it("chuỗi 62 ký tự trở lên bị từ chối thẳng", () => {
    expect(veLuoiQr("A".repeat(61)).length).toBe(29);
    expect(() => veLuoiQr("A".repeat(62))).toThrow(/vượt tầm mã QR/u);
  });

  it("ký tự ngoài chế độ chữ-số bị từ chối", () => {
    expect(() => veLuoiQr("MÃ MỜI")).toThrow(/không nằm trong chế độ chữ-số/u);
    expect(() => veLuoiQr("abc_def")).toThrow(/không nằm trong chế độ chữ-số/u);
  });
});
