/**
 * BẢN DỰNG INDEXEDDB của kho sức khoẻ (ADR-010). KHÔNG thuộc tầng lõi: đụng IndexedDB.
 *
 * Dùng chung kho `disc` với bài làm (bảng `suc-khoe`, thêm ở v3) để "Xoá sạch" và sao lưu đi
 * cùng một lối. Tự đăng ký làm bản dựng mặc định lúc nạp — ai cần kho này phải import file
 * này (xem `sao-luu.ts`, `khoi-phuc.ts`, khoang sức khoẻ).
 */

import {
  laNguoiSucKhoeHopLe,
  sapTheoMoiNhat,
} from "@modules/core/suc-khoe/so-suc-khoe";
import {
  datKhoSucKhoe,
  type KhoSucKhoe,
} from "@modules/core/suc-khoe/kho-suc-khoe";
import type { NguoiSucKhoe } from "@modules/core/suc-khoe/kieu";

import { BANG_SUC_KHOE, baoDoi, chayTren, moKho } from "./kho-bai";

async function docSoIdb(): Promise<NguoiSucKhoe[]> {
  const tho = await chayTren<unknown[]>(
    BANG_SUC_KHOE,
    "readonly",
    (b) => b.getAll(),
    [],
  );
  // Không tin dữ liệu đã nằm trong kho: bản ghi hỏng hình dạng bị bỏ qua chứ không làm sập.
  return sapTheoMoiNhat(tho.filter(laNguoiSucKhoeHopLe));
}

/** Một giao dịch, hai việc: lưu và xoá. Hỏng giữa chừng thì cả giao dịch bị huỷ. */
async function ghiSoIdb(
  luu: readonly NguoiSucKhoe[],
  xoaId: readonly string[],
): Promise<boolean> {
  const db = await moKho();
  if (!db) return false;
  const xong = await new Promise<boolean>((giaiQuyet) => {
    try {
      const gd = db.transaction(BANG_SUC_KHOE, "readwrite");
      const bang = gd.objectStore(BANG_SUC_KHOE);
      for (const id of xoaId) bang.delete(id);
      for (const n of luu) bang.put(n);
      gd.oncomplete = () => giaiQuyet(true);
      gd.onerror = () => giaiQuyet(false);
      gd.onabort = () => giaiQuyet(false);
    } catch {
      giaiQuyet(false);
    }
  });
  db.close();
  if (xong) baoDoi();
  return xong;
}

async function xoaSachIdb(): Promise<void> {
  await chayTren<undefined>(
    BANG_SUC_KHOE,
    "readwrite",
    (b) => b.clear(),
    undefined,
  );
  baoDoi();
}

export const khoSucKhoeIndexedDB: KhoSucKhoe = {
  docSo: docSoIdb,
  ghiSo: ghiSoIdb,
  xoaSach: xoaSachIdb,
};

datKhoSucKhoe(khoSucKhoeIndexedDB);
