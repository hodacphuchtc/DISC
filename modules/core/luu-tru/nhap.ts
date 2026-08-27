/**
 * LƯU NHÁP BÀI ĐANG LÀM — localStorage.
 *
 * KHÔNG thuộc tầng lõi (ADR-004): file này buộc phải đụng `localStorage`.
 *
 * 🔴 Ba luật:
 *  1. localStorage bị chặn (cửa sổ ẩn danh, trình duyệt cấm site data) thì MẤT tính năng
 *     nhớ, KHÔNG được làm hỏng bài đang làm. Mọi lời gọi bọc try/catch.
 *  2. Nháp của bộ đề này không được lẫn sang bộ kia.
 *  3. Nháp gắn với BIỆT DANH. Máy giáo viên đi qua nhiều gia đình — trả nháp của bé A cho
 *     bé B là vừa lộ dữ liệu chéo vừa ra kết quả sai người (QĐ7).
 */

import type { MaBoDe } from "@modules/core/bo-de/kieu";

export type Nhap = {
  readonly boDe: MaBoDe;
  readonly bietDanh: string;
  readonly traLoi: Readonly<Record<string, number>>;
  /** ISO 8601. Luôn lưu ISO, chỉ HIỂN THỊ mới dùng dd/mm/yyyy. */
  readonly batDau: string;
  /** Tổng số giây đã thật sự ngồi làm, dùng cho hàng rào HL-4. */
  readonly giayDaLam: number;
  readonly phienBanBoDe: string;
};

const TIEN_TO = "disc:nhap:";

export function khoaNhap(maBoDe: MaBoDe): string {
  return `${TIEN_TO}${maBoDe}`;
}

/** Trả về kho localStorage, hoặc `null` nếu trình duyệt chặn. */
function kho(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function laNhapHopLe(x: unknown): x is Nhap {
  if (typeof x !== "object" || x === null) return false;
  const n = x as Record<string, unknown>;
  return (
    typeof n.boDe === "string" &&
    typeof n.bietDanh === "string" &&
    typeof n.batDau === "string" &&
    typeof n.giayDaLam === "number" &&
    typeof n.phienBanBoDe === "string" &&
    typeof n.traLoi === "object" &&
    n.traLoi !== null
  );
}

/**
 * Đọc nháp. Trả `null` khi: chưa có · JSON hỏng · khác bộ đề · **khác biệt danh** ·
 * khác phiên bản bộ đề (câu hỏi đã đổi thì đáp án cũ không còn nghĩa).
 */
export function docNhap(
  maBoDe: MaBoDe,
  bietDanh: string,
  phienBanBoDe: string,
): Nhap | null {
  const k = kho();
  if (!k) return null;
  try {
    const tho = k.getItem(khoaNhap(maBoDe));
    if (!tho) return null;
    const doc: unknown = JSON.parse(tho);
    if (!laNhapHopLe(doc)) return null;
    if (doc.boDe !== maBoDe) return null;
    if (doc.bietDanh !== bietDanh) return null;
    if (doc.phienBanBoDe !== phienBanBoDe) return null;
    return doc;
  } catch {
    return null;
  }
}

/**
 * Có nháp của ĐÚNG bộ đề và ĐÚNG biệt danh này, nhưng thuộc phiên bản bộ câu KHÁC không?
 *
 * `docNhap()` cố ý trả `null` cho trường hợp đó — đáp án cũ không còn nghĩa khi câu hỏi
 * đã đổi. Nhưng "không dùng được" và "chưa từng có" là hai chuyện khác nhau với người
 * dùng, và chỉ một trong hai đáng được xin lỗi. Hàm này phân biệt chúng.
 */
export function coNhapPhienBanCu(
  maBoDe: MaBoDe,
  bietDanh: string,
  phienBanHienTai: string,
): boolean {
  const k = kho();
  if (!k) return false;
  try {
    const tho = k.getItem(khoaNhap(maBoDe));
    if (!tho) return false;
    const doc: unknown = JSON.parse(tho);
    if (!laNhapHopLe(doc)) return false;
    return (
      doc.boDe === maBoDe && doc.bietDanh === bietDanh && doc.phienBanBoDe !== phienBanHienTai
    );
  } catch {
    return false;
  }
}

export function ghiNhap(nhap: Nhap): void {
  const k = kho();
  if (!k) return;
  try {
    k.setItem(khoaNhap(nhap.boDe), JSON.stringify(nhap));
  } catch {
    // Hết dung lượng hoặc bị chặn — mất khả năng NHỚ, không mất khả năng LÀM.
  }
}

export function xoaNhap(maBoDe: MaBoDe): void {
  const k = kho();
  if (!k) return;
  try {
    k.removeItem(khoaNhap(maBoDe));
  } catch {
    /* không sao */
  }
}
