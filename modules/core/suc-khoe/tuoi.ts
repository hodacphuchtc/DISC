/**
 * TUỔI TỪ NGÀY SINH — hàm thuần, thuộc TẦNG LÕI (ADR-004).
 *
 * 🔴 Đếm theo LỊCH (năm/tháng/ngày), không chia số ngày cho 30,4: bảng tăng trưởng WHO
 * tra theo số THÁNG TRỌN, và lệch một tháng ở ranh giới 5 tuổi là đổi sang bảng khác.
 * Mọi chuỗi ngày đi qua `laChuoiIso()` trước (xem bẫy ở `tien-ich/ngay.ts`).
 */

import { laChuoiIso } from "@modules/core/tien-ich/ngay";

function tachNgay(chuoi: string): { y: number; m: number; d: number } | null {
  if (!laChuoiIso(chuoi)) return null;
  const y = Number(chuoi.slice(0, 4));
  const m = Number(chuoi.slice(5, 7));
  const d = Number(chuoi.slice(8, 10));
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  // Bắt ngày không có thật (31/02): dựng lại và so.
  const thu = new Date(Date.UTC(y, m - 1, d));
  if (
    thu.getUTCFullYear() !== y ||
    thu.getUTCMonth() !== m - 1 ||
    thu.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

/**
 * Số THÁNG TRỌN từ ngày sinh đến ngày đo.
 * Trả `null` nếu một trong hai ngày hỏng; trả `-1` nếu ngày đo trước ngày sinh.
 */
export function tuoiTheoThang(ngaySinh: string, ngayDo: string): number | null {
  const s = tachNgay(ngaySinh);
  const o = tachNgay(ngayDo);
  if (!s || !o) return null;
  let thang = (o.y - s.y) * 12 + (o.m - s.m);
  if (o.d < s.d) thang -= 1;
  return thang < 0 ? -1 : thang;
}
