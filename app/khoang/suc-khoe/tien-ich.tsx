/**
 * Tiện ích dùng chung của thẻ sức khoẻ: chữ đậm `**…**`, định dạng số, phân tích một mốc.
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { Fragment, type ReactNode } from "react";

import { tuoiTheoThang } from "@modules/core/suc-khoe/tuoi";

/** Thay `{ten}` `{ngay}`… trong một câu của từ điển. */
export function dien(
  mau: string,
  giaTri: Readonly<Record<string, string | number>>,
): string {
  return mau.replace(/\{(\w+)\}/gu, (_, k: string) => String(giaTri[k] ?? ""));
}

/**
 * Chữ có `**đậm**` → React, KHÔNG dùng `dangerouslySetInnerHTML`: chữ này đi cùng tên người
 * dùng nhập (tên thật), nên không được phép biến thành HTML.
 */
export function DongChu({ chu }: { readonly chu: string }): ReactNode {
  const manh = chu.split("**");
  return (
    <>
      {manh.map((m, i) => (
        <Fragment key={i}>{i % 2 === 1 ? <b>{m}</b> : m}</Fragment>
      ))}
    </>
  );
}

/** 16,1 thay vì 16.1 — người Việt đọc dấu phẩy. */
export function soVN(n: number, soLe = 1): string {
  return n.toFixed(soLe).replace(".", ",");
}

/** Số đo gọn: 28 → "28", 28.5 → "28,5". */
export function soGon(n: number): string {
  return String(Math.round(n * 10) / 10).replace(".", ",");
}

export function homNayIso(): string {
  const d = new Date();
  const hai = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${hai(d.getMonth() + 1)}-${hai(d.getDate())}`;
}

export function tuoiChu(ngaySinh: string, ngayDo: string): string {
  const m = tuoiTheoThang(ngaySinh, ngayDo);
  if (m === null || m < 0) return "";
  if (m < 24) return `${m} tháng`;
  const nam = Math.floor(m / 12);
  const du = m % 12;
  return m < 12 * 19 && du > 0 ? `${nam} tuổi ${du} tháng` : `${nam} tuổi`;
}

export {
  dauVaoCua,
  tomTatMoc,
  type TomTat,
} from "@modules/core/suc-khoe/tom-tat";

/** Phần vòng tròn tô (0–1) theo BMI — chỉ để TRỰC QUAN, không phải ngưỡng y khoa. */
export function phanVong(bmi: number | null): number {
  if (bmi === null) return 0.05;
  return Math.max(0.05, Math.min(1, (bmi - 12) / 20));
}

export function taoId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto)
      return crypto.randomUUID();
  } catch {
    // rơi xuống dưới
  }
  return `sk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
