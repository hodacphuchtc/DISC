/**
 * BỘ GIẢI MÃ QR DÙNG CHUNG CHO TEST — viết riêng, KHÔNG gọi lại hàm nào của bộ mã hoá.
 *
 * Vì sao là file dùng chung chứ không chép: bài học 27/08/2026 — bốn file test cùng gõ
 * lại một luồng vào, đổi đặc tả một lần thì phải sửa bốn chỗ. Ở đây có HAI nơi cần giải
 * mã ngược (`qr.test.ts` soi lưới, `thu-ma-moi.test.tsx` soi nét vẽ Canvas), nên nó
 * là một hàm dùng chung ngay từ đầu.
 *
 * Toàn bộ vị trí ô dựng lại từ hình học của chuẩn ISO/IEC 18004. Hai bên phải gặp nhau
 * ở giữa thì mới tính là đúng.
 */

import { expect } from "vitest";

/**
 * 🔴 VÌ SAO FILE NÀY DÀI HƠN BÌNH THƯỜNG.
 *
 * Một mã QR vẽ sai vẫn TRÔNG như một mã QR. Nhìn bằng mắt không phân biệt được, và cửa
 * kiểm kiểu "có đủ ba hoa tiêu không" thì mã hỏng nào cũng qua. Dự án này đã trả giá đúng
 * một lần cho kiểu cửa kiểm nhìn sai chỗ (GĐ9: test kiểm 11 KIỂU trong khi đặc tả nói 4
 * TRỤC — xanh suốt bốn giai đoạn mà sản phẩm vẫn sai).
 *
 * Nên ở đây có một BỘ GIẢI MÃ VIẾT RIÊNG, dựng lại từ hình học của chuẩn ISO/IEC 18004
 * chứ KHÔNG gọi lại hàm nào của bộ mã hoá. Hai bên phải gặp nhau ở giữa thì mới tính là
 * đúng. Kèm theo là phép thử hội chứng Reed–Solomon dùng số học GF(256) viết theo lối
 * khác hẳn (nhân bit, không tra bảng log) — nếu bảng log của bộ mã hoá sai thì phép thử
 * này thấy ngay.
 *
 * Cửa kiểm cuối cùng vẫn là NGƯỜI cầm điện thoại quét (DEMO GĐ11 mục 6). Test không thay
 * được việc đó, chỉ làm cho việc đó nhiều khả năng thành công ngay lần đầu.
 */

const BANG_CHU_SO = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";

/** Ô dữ liệu / ô sửa lỗi ở mức M, theo phiên bản. */
const SO_O: Readonly<Record<number, { duLieu: number; suaLoi: number; canChinh: number[] }>> = {
  21: { duLieu: 16, suaLoi: 10, canChinh: [] },
  25: { duLieu: 28, suaLoi: 16, canChinh: [18] },
  29: { duLieu: 44, suaLoi: 26, canChinh: [22] },
};

/* ── Số học GF(256) viết ĐỘC LẬP: nhân theo lối bit, không tra bảng ───────── */

function nhanBit(a: number, b: number): number {
  let ket = 0;
  let x = a;
  let y = b;
  while (y > 0) {
    if (y & 1) ket ^= x;
    y >>= 1;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  return ket;
}

/** alpha^n với alpha = 2. */
function luyThua(n: number): number {
  let ket = 1;
  for (let i = 0; i < n; i += 1) ket = nhanBit(ket, 2);
  return ket;
}

/* ── Hình học: ô nào là ô chức năng ───────────────────────────────────────── */

/**
 * Dựng lại từ MÔ TẢ HÌNH HỌC của chuẩn, không chép từ bộ mã hoá:
 * ba góc chứa hoa tiêu + dải phân cách + vùng định dạng (9 ô mỗi chiều), hàng 6 và cột 6
 * là nhịp, và phiên bản 2 trở lên có một hình căn chỉnh 5×5 ở góc dưới phải.
 */
function laOChucNang(canh: number, hang: number, cot: number): boolean {
  if (hang <= 8 && cot <= 8) return true;
  if (hang <= 8 && cot >= canh - 8) return true;
  if (hang >= canh - 8 && cot <= 8) return true;
  if (hang === 6 || cot === 6) return true;
  for (const tam of SO_O[canh].canChinh) {
    if (Math.abs(hang - tam) <= 2 && Math.abs(cot - tam) <= 2) return true;
  }
  return false;
}

/* ── Bộ giải mã ───────────────────────────────────────────────────────────── */

function docDinhDang(luoi: readonly boolean[][]): { mucSuaLoi: number; matNa: number } {
  const canh = luoi.length;
  // CỐ Ý đọc BẢN SAO THỨ HAI của 15 bit định dạng (bản nằm rải ở hai mép kia), để không
  // đi lại đúng đường mà bộ mã hoá ghi bản thứ nhất.
  let bit = 0;
  for (let i = 0; i <= 7; i += 1) if (luoi[8][canh - 1 - i]) bit |= 1 << i;
  for (let i = 8; i <= 14; i += 1) if (luoi[canh - 15 + i][8]) bit |= 1 << i;

  const thoat = bit ^ 0x5412;

  let du = thoat;
  for (let i = 14; i >= 10; i -= 1) if (du & (1 << i)) du ^= 0x537 << (i - 10);
  expect(du, "15 bit định dạng không thoả mã BCH — máy quét sẽ vứt cả mã").toBe(0);

  return { mucSuaLoi: (thoat >>> 13) & 0b11, matNa: (thoat >>> 10) & 0b111 };
}

function boMatNa(hang: number, cot: number, matNa: number): boolean {
  switch (matNa) {
    case 0: return (cot + hang) % 2 === 0;
    case 1: return hang % 2 === 0;
    case 2: return cot % 3 === 0;
    case 3: return (cot + hang) % 3 === 0;
    case 4: return (Math.floor(cot / 3) + Math.floor(hang / 2)) % 2 === 0;
    case 5: return ((cot * hang) % 2) + ((cot * hang) % 3) === 0;
    case 6: return (((cot * hang) % 2) + ((cot * hang) % 3)) % 2 === 0;
    default: return (((cot + hang) % 2) + ((cot * hang) % 3)) % 2 === 0;
  }
}

/** Lưới ⇒ dãy ô (byte), đã bỏ mặt nạ. Gồm cả phần dữ liệu lẫn phần sửa lỗi. */
function docO(luoi: readonly boolean[][], matNa: number): number[] {
  const canh = luoi.length;
  const bit: number[] = [];
  for (let phai = canh - 1; phai >= 1; phai -= 2) {
    if (phai === 6) phai = 5;
    for (let doc = 0; doc < canh; doc += 1) {
      for (let j = 0; j < 2; j += 1) {
        const cot = phai - j;
        const diLen = ((phai + 1) & 2) === 0;
        const hang = diLen ? canh - 1 - doc : doc;
        if (laOChucNang(canh, hang, cot)) continue;
        const den = luoi[hang][cot] !== boMatNa(hang, cot, matNa);
        bit.push(den ? 1 : 0);
      }
    }
  }

  const o: number[] = [];
  for (let i = 0; i + 7 < bit.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j += 1) byte = (byte << 1) | bit[i + j];
    o.push(byte);
  }
  return o;
}

/** Dãy ô dữ liệu ⇒ chuỗi gốc, theo chế độ chữ-số. */
function giaiChuoi(o: readonly number[]): string {
  const bit: number[] = [];
  for (const byte of o) for (let i = 7; i >= 0; i -= 1) bit.push((byte >>> i) & 1);

  let tu = 0;
  const doc = (soBit: number) => {
    let v = 0;
    for (let i = 0; i < soBit; i += 1) v = v * 2 + bit[tu + i];
    tu += soBit;
    return v;
  };

  expect(doc(4), "chỉ báo chế độ phải là chữ-số (0010)").toBe(0b0010);
  const soKyTu = doc(9);

  let chuoi = "";
  for (let i = 0; i + 1 < soKyTu; i += 2) {
    const cap = doc(11);
    chuoi += BANG_CHU_SO[Math.floor(cap / 45)] + BANG_CHU_SO[cap % 45];
  }
  if (soKyTu % 2 === 1) chuoi += BANG_CHU_SO[doc(6)];
  return chuoi;
}

function giaiMaQr(luoi: readonly boolean[][]): string {
  const { mucSuaLoi, matNa } = docDinhDang(luoi);
  expect(mucSuaLoi, "mức sửa lỗi phải là M (00)").toBe(0);
  const o = docO(luoi, matNa);
  return giaiChuoi(o.slice(0, SO_O[luoi.length].duLieu));
}


export { BANG_CHU_SO, SO_O, docDinhDang, docO, giaiChuoi, giaiMaQr, laOChucNang, luyThua, nhanBit };
