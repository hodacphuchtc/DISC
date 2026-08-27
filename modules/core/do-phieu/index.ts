/**
 * ĐO PHỄU — bốn mốc, không hơn (QĐ9).
 *
 * KHÔNG thuộc tầng lõi: đọc `location` và ghi `localStorage`.
 *
 * 🔴 Đếm ĐÚNG BỐN MỐC và KHÔNG BAO GIỜ kèm câu trả lời hay điểm số. Nhờ vậy nó không đụng
 * ràng buộc "dữ liệu không rời máy" — nó không biết gì về nội dung bài làm.
 *
 * Vì sao cần: không có nó thì sau ba tháng, câu hỏi "cái này có đáng làm không" KHÔNG CÓ
 * câu trả lời — chỉ có cảm giác. Phễu này dài bất thường (mở → làm 24 câu → đưa máy cho
 * người khác làm tiếp → để lại số), nên phải biết người ta rơi ở đâu.
 */

export const MOC = ["mo", "batDau", "xong", "deLaiSo"] as const;
export type MaMoc = (typeof MOC)[number];

export const NGUON_MAC_DINH = "truc-tiep";
const KHOA = "disc:phieu";
const THAM_SO_NGUON = "nguon";

/** Nguồn chỉ chứa chữ, số và gạch — chặn cả rác lẫn thứ trông như định danh cá nhân. */
export function chuanHoaNguon(tho: unknown): string {
  if (typeof tho !== "string") return NGUON_MAC_DINH;
  const sach = tho.trim().toLowerCase().replace(/[^a-z0-9-]/gu, "");
  return sach.length > 0 && sach.length <= 32 ? sach : NGUON_MAC_DINH;
}

export function docNguonTuUrl(timKiem?: string): string {
  try {
    const chuoi = timKiem ?? (typeof window !== "undefined" ? window.location.search : "");
    return chuanHoaNguon(new URLSearchParams(chuoi).get(THAM_SO_NGUON));
  } catch {
    return NGUON_MAC_DINH;
  }
}

export type BanGhiMoc = {
  readonly moc: MaMoc;
  readonly nguon: string;
  /** ISO 8601. */
  readonly luc: string;
};

/** Điểm cắm cho đội dev: nối vào hệ thống đo của họ. Mặc định chỉ ghi trên máy. */
export type GhiMoc = (ban: BanGhiMoc) => void;

function docKho(): BanGhiMoc[] {
  try {
    const tho = window.localStorage.getItem(KHOA);
    const doc: unknown = tho ? JSON.parse(tho) : [];
    return Array.isArray(doc) ? (doc as BanGhiMoc[]) : [];
  } catch {
    return [];
  }
}

/** Mặc định: ghi vào localStorage, giữ tối đa 500 bản ghi gần nhất. */
export const ghiMocTrenMay: GhiMoc = (ban) => {
  try {
    const ds = [...docKho(), ban].slice(-500);
    window.localStorage.setItem(KHOA, JSON.stringify(ds));
  } catch {
    // Bị chặn thì mất khả năng ĐO, không mất khả năng DÙNG.
  }
};

let ghiHienTai: GhiMoc = ghiMocTrenMay;

/** Đội dev gọi hàm này một lần lúc khởi động để nối vào backend của họ. */
export function datCachGhiMoc(ham: GhiMoc): void {
  ghiHienTai = ham;
}

export function ghiMoc(moc: MaMoc, nguon: string, luc: string): void {
  ghiHienTai({ moc, nguon, luc });
}

export function docPhieu(): BanGhiMoc[] {
  return docKho();
}

export function xoaPhieu(): void {
  try {
    window.localStorage.removeItem(KHOA);
  } catch {
    /* không sao */
  }
}

/** Đếm số lượt mỗi mốc — để xem phễu rơi ở đâu. */
export function demTheoMoc(ds: readonly BanGhiMoc[]): Record<MaMoc, number> {
  const dem = { mo: 0, batDau: 0, xong: 0, deLaiSo: 0 };
  for (const b of ds) if (b.moc in dem) dem[b.moc] += 1;
  return dem;
}
