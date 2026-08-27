/**
 * TIẾN TRÌNH LÀM BÀI — logic thuần, không React, không DOM.
 *
 * Hai kiểu trình bày (DISC_BA.md §5.2):
 *  · MN và TH: MỘT câu một màn. Trẻ nhìn thấy 20 câu cùng lúc là nản trước khi bắt đầu.
 *  · THCS, PH, QS: năm câu một màn.
 */

import type { BoDe, CauHoi } from "@modules/core/bo-de/kieu";

/** Sau mỗi bấy nhiêu câu thì chèn một dòng động viên nhẹ. */
export const NHIP_DONG_VIEN = 5;

/** Chia câu thành các trang theo `cauMoiMan` của bộ đề. */
export function chiaTrang(boDe: BoDe): CauHoi[][] {
  const trang: CauHoi[][] = [];
  for (let i = 0; i < boDe.cau.length; i += boDe.cauMoiMan) {
    trang.push([...boDe.cau.slice(i, i + boDe.cauMoiMan)]);
  }
  return trang;
}

export function soCauDaTraLoi(boDe: BoDe, traLoi: Readonly<Record<string, number>>): number {
  return boDe.cau.filter((c) => typeof traLoi[c.ma] === "number").length;
}

/** Chỉ số TRANG đầu tiên còn câu chưa trả lời. Xong hết thì trả số trang cuối. */
export function trangDangDo(boDe: BoDe, traLoi: Readonly<Record<string, number>>): number {
  const trang = chiaTrang(boDe);
  const i = trang.findIndex((t) => t.some((c) => typeof traLoi[c.ma] !== "number"));
  return i === -1 ? Math.max(0, trang.length - 1) : i;
}

/** Trang này đã trả lời hết chưa — dùng để mở nút đi tiếp. */
export function trangDaXong(
  trang: readonly CauHoi[],
  traLoi: Readonly<Record<string, number>>,
): boolean {
  return trang.every((c) => typeof traLoi[c.ma] === "number");
}

/**
 * Có nên hiện dòng động viên sau khi trả lời câu thứ `soCauDaXong` không?
 * Chỉ hiện đúng ở các mốc 5, 10, 15… và KHÔNG hiện ở câu cuối (lúc đó có kết quả rồi).
 */
export function nenDongVien(soCauDaXong: number, tongSoCau: number): boolean {
  if (soCauDaXong <= 0 || soCauDaXong >= tongSoCau) return false;
  return soCauDaXong % NHIP_DONG_VIEN === 0;
}

/** Phần trăm hoàn thành, làm tròn về số nguyên. */
export function phanTramXong(boDe: BoDe, traLoi: Readonly<Record<string, number>>): number {
  if (boDe.cau.length === 0) return 0;
  return Math.round((soCauDaTraLoi(boDe, traLoi) / boDe.cau.length) * 100);
}
