/**
 * KHO SỨC KHOẺ — GIAO DIỆN của tầng lưu trữ sổ sức khoẻ (ADR-004, ADR-010).
 *
 * 🔴 SẠCH DOM. Không `indexedDB`, không `localStorage`, không `window` — cùng luật với
 * `luu-tru/kho-disc.ts`: đây là BẢN HỢP ĐỒNG, đội dev app chủ cắm bản dựng gọi server của
 * họ qua `datKhoSucKhoe()` mà không sửa giao diện. `tests/ranh-gioi-hai-tang.test.ts` canh.
 *
 * Bản dựng mặc định (IndexedDB) nằm ở `luu-tru/kho-suc-khoe-idb.ts` và tự đăng ký lúc nạp.
 *
 * Luật cho mọi bản dựng:
 *  1. **Không bao giờ ném.** Kho hỏng ⇒ trả giá trị rỗng / `false`.
 *  2. **`ghiSo` NGUYÊN TỬ**: các bản ghi cần lưu và các id cần xoá đi cùng một giao dịch.
 *     Thêm người thứ 7 = lưu người mới + xoá một người cũ; chỉ làm được một nửa là phá hạn
 *     mức hoặc mất dữ liệu.
 */

import type { NguoiSucKhoe } from "./kieu";

export type KhoSucKhoe = {
  /** Toàn bộ sổ, người vừa cập nhật đứng đầu. */
  readonly docSo: () => Promise<NguoiSucKhoe[]>;
  /** Lưu (ghi đè theo `id`) và xoá, trong MỘT giao dịch. `false` nếu không ghi được. */
  readonly ghiSo: (
    luu: readonly NguoiSucKhoe[],
    xoaId: readonly string[],
  ) => Promise<boolean>;
  /** Dọn trọn sổ sức khoẻ. */
  readonly xoaSach: () => Promise<void>;
};

let dangDung: KhoSucKhoe | null = null;

/** Cắm một bản dựng vào. Trả về hàm trả lại bản cũ — test dùng để dọn sau mình. */
export function datKhoSucKhoe(kho: KhoSucKhoe): () => void {
  const cu = dangDung;
  dangDung = kho;
  return () => {
    dangDung = cu;
  };
}

/** 🔴 Ném khi chưa ai đăng ký — cố ý, cùng lý do với `khoDangDung()`. */
export function khoSucKhoeDangDung(): KhoSucKhoe {
  if (!dangDung) {
    throw new Error(
      "Chưa có bản dựng kho sức khoẻ nào được đăng ký. Gọi datKhoSucKhoe().",
    );
  }
  return dangDung;
}

export function daCoKhoSucKhoe(): boolean {
  return dangDung !== null;
}
