/**
 * KHO BÀI ĐÃ LÀM — IndexedDB.
 *
 * KHÔNG thuộc tầng lõi (ADR-004): buộc phải đụng `indexedDB`.
 *
 * 🔴 Cạm bẫy đã trả giá ở dự án trước (24/08): nút Sao lưu đọc DANH SÁCH ĐANG LỌC trên
 * màn hình thay vì đọc thẳng kho. Người dùng bấm sao lưu ở một khoang, nhận về một file
 * trông như đủ, yên tâm xoá dữ liệu duyệt web, rồi mất sạch phần kia.
 * ⇒ `docTatCa()` là cửa duy nhất để sao lưu, và nó KHÔNG nhận tham số lọc nào.
 *
 * Trình duyệt chặn IndexedDB (cửa sổ ẩn danh nghiêm ngặt) thì MẤT tính năng lưu, KHÔNG
 * được làm hỏng bài đang làm — mọi hàm trả về giá trị rỗng thay vì ném.
 */

import type { KetQua, MaBoDe } from "@modules/core/bo-de/kieu";

export const TEN_KHO = "disc";
export const TEN_BANG = "bai-lam";
const PHIEN_BAN_KHO = 1;

export type BaiLamLuu = {
  readonly id: string;
  readonly boDe: MaBoDe;
  /** 🔴 BIỆT DANH do người dùng tự đặt — KHÔNG phải họ tên (NĐ 13/2023). */
  readonly maTre: string;
  /** Chỉ để định tuyến lúc làm bài. Không đưa vào báo cáo. */
  readonly lop?: string;
  readonly nguoiTraLoi: "tre" | "nguoi-lon";
  /** ISO 8601. Hiển thị mới dùng dd/mm/yyyy. */
  readonly batDau: string;
  readonly ketThuc: string;
  readonly traLoi: Readonly<Record<string, number>>;
  readonly ketQua: KetQua;
  readonly phienBanBoDe: string;
};

function moKho(): Promise<IDBDatabase | null> {
  return new Promise((giaiQuyet) => {
    try {
      if (typeof indexedDB === "undefined") return giaiQuyet(null);
      const yeuCau = indexedDB.open(TEN_KHO, PHIEN_BAN_KHO);
      yeuCau.onupgradeneeded = () => {
        const db = yeuCau.result;
        if (!db.objectStoreNames.contains(TEN_BANG)) {
          const bang = db.createObjectStore(TEN_BANG, { keyPath: "id" });
          bang.createIndex("maTre", "maTre", { unique: false });
          bang.createIndex("ketThuc", "ketThuc", { unique: false });
        }
      };
      yeuCau.onsuccess = () => giaiQuyet(yeuCau.result);
      yeuCau.onerror = () => giaiQuyet(null);
      yeuCau.onblocked = () => giaiQuyet(null);
    } catch {
      giaiQuyet(null);
    }
  });
}

// Nhận `IDBRequest` không tham số kiểu: `IDBRequest<A>` không gán được cho
// `IDBRequest<A | null>` vì `onerror` mang `this` nghịch biến.
function chay<T>(
  cheDo: IDBTransactionMode,
  viec: (bang: IDBObjectStore) => IDBRequest,
  khiHong: T,
): Promise<T> {
  return moKho().then(
    (db) =>
      new Promise<T>((giaiQuyet) => {
        if (!db) return giaiQuyet(khiHong);
        try {
          const gd = db.transaction(TEN_BANG, cheDo);
          const yc = viec(gd.objectStore(TEN_BANG));
          yc.onsuccess = () => giaiQuyet(yc.result as T);
          yc.onerror = () => giaiQuyet(khiHong);
          gd.oncomplete = () => db.close();
        } catch {
          giaiQuyet(khiHong);
        }
      }),
  );
}

export function luuBai(bai: BaiLamLuu): Promise<boolean> {
  return chay<IDBValidKey | null>("readwrite", (b) => b.put(bai), null).then((k) => k !== null);
}

/**
 * 🔴 CỬA DUY NHẤT ĐỂ SAO LƯU. Cố ý KHÔNG nhận tham số lọc nào — thêm một tham số
 * `boDe?` vào đây là mở lại đúng cái bẫy đã cắn dự án trước.
 */
export function docTatCa(): Promise<BaiLamLuu[]> {
  return chay<BaiLamLuu[]>("readonly", (b) => b.getAll(), []).then(
    (ds) => [...ds].sort((a, b) => b.ketThuc.localeCompare(a.ketThuc)),
  );
}

export function xoaBai(id: string): Promise<void> {
  return chay<undefined>("readwrite", (b) => b.delete(id), undefined).then(() => undefined);
}

export function xoaSach(): Promise<void> {
  return chay<undefined>("readwrite", (b) => b.clear(), undefined).then(() => undefined);
}

/** Đếm số biệt danh KHÁC NHAU đang có trên máy — phục vụ cảnh báo máy dùng chung (QĐ7). */
export function demBietDanh(ds: readonly BaiLamLuu[]): number {
  return new Set(ds.map((b) => b.maTre)).size;
}
