/**
 * GHÉP VĂN BẢN BÁO CÁO với kiểu đã chấm được.
 *
 * Hàm thuần, thuộc TẦNG LÕI (ADR-004): không React, không DOM.
 */

import { CHU_THE, DIEN_GIAI, type KhoiDienGiai, type MaKieu } from "@config/disc-dien-giai";

import { MA_TRUC, type MaBoDe } from "@modules/core/bo-de/kieu";

import type { Kieu } from "./cham";

export class LoiDienGiai extends Error {
  constructor(thongDiep: string) {
    super(thongDiep);
    this.name = "LoiDienGiai";
  }
}

/**
 * Đổi kiểu đã chấm thành khoá văn bản.
 * Cặp pha luôn viết theo thứ tự cố định D-I-S-C ⇒ đúng sáu khoá, không phải mười hai.
 */
export function maKieuTu(kieu: Kieu): MaKieu {
  if (kieu.loai === "deu") return "DEU";
  if (kieu.loai === "don") return kieu.truc;
  const cap = [...kieu.cap].sort((a, b) => MA_TRUC.indexOf(a) - MA_TRUC.indexOf(b));
  return cap.join("") as MaKieu;
}

/** Thay {chuThe} / {ChuThe} bằng đại từ đúng với bộ đề đang đọc. */
export function thayChuThe(chuoi: string, maBoDe: MaBoDe): string {
  const dt = CHU_THE[maBoDe];
  if (!dt) throw new LoiDienGiai(`Bộ đề "${maBoDe}" chưa khai đại từ trong CHU_THE.`);
  return chuoi.split("{ChuThe}").join(dt.hoa).split("{chuThe}").join(dt.thuong);
}

export type DienGiaiDaThay = {
  readonly maKieu: MaKieu;
  readonly trongNhuTheNao: string;
  readonly diemManh: string;
  readonly choCanDeY: string;
  readonly cauHoiToiNay: readonly string[];
};

/** Lấy trọn bốn khối, đã thay đại từ. Thiếu khoá thì NÉM — không trả về khối rỗng. */
export function layDienGiai(kieu: Kieu, maBoDe: MaBoDe): DienGiaiDaThay {
  const maKieu = maKieuTu(kieu);
  const khoi: KhoiDienGiai | undefined = DIEN_GIAI[maKieu];
  if (!khoi) {
    throw new LoiDienGiai(
      `Không có văn bản cho kiểu "${maKieu}". Thêm vào config/disc-dien-giai.ts — ` +
        `một khối trống ở đây nghĩa là người dùng nhận về một màn hình trắng.`,
    );
  }
  return {
    maKieu,
    trongNhuTheNao: thayChuThe(khoi.trongNhuTheNao, maBoDe),
    diemManh: thayChuThe(khoi.diemManh, maBoDe),
    choCanDeY: thayChuThe(khoi.choCanDeY, maBoDe),
    cauHoiToiNay: khoi.cauHoiToiNay.map((c) => thayChuThe(c, maBoDe)),
  };
}
