import { fireEvent, screen, waitFor } from "@testing-library/react";

import { CHU_BANG_GIA_DINH, CHU_BUOC } from "../config/disc-tu-dien";

/**
 * ĐƯỜNG ĐI VÀO MỘT BÀI — nguồn DUY NHẤT cho mọi test cần làm bài.
 *
 * 🔴 VÌ SAO GOM VỀ ĐÂY. Thay `tests/duong-m1.ts` của GĐ10. Bài học thì y hệt và đã trả giá
 * hai lần: 10.6 sắp lại màn 1 làm **34 cửa đỏ ở bốn file**, chỉ vì mỗi file tự gõ lại chuỗi
 * thao tác của riêng nó. Bản thân việc đỏ là ĐÚNG — đặc tả đổi thật. Cái sai là phải sửa
 * bốn chỗ cho MỘT thay đổi, và lần sau vẫn thế.
 *
 * Từ V2.1, đường vào bài đổi lần nữa: không còn "bấm mục DISC trên thanh bên rồi chọn đối
 * tượng", mà là **mở bước 2 rồi bấm nút trên thẻ của đúng người đó**. Đường đó chỉ được
 * mô tả ở file này.
 */

/** Nút *Làm bài* trên thẻ một người (bài của chính họ). */
export const nutLamBai = () =>
  screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLamBai });

/** Nút phụ *Bố mẹ trả lời về {tên}* trên thẻ một đứa trẻ từ lớp 3. */
export const nutTraLoiHo = (ten: string) =>
  screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutTraLoiHo.replace("{ten}", ten) });

/** Tấm của một bước trong khung ba bước. */
export const tamBuoc = (ma: string) =>
  document.querySelector(`[data-thu="tam-buoc"][data-buoc="${ma}"]`);

/** Bước đó đã mở thân ra chưa. */
export const buocDangMo = (ma: string) =>
  Boolean(tamBuoc(ma)?.querySelector('[data-thu="than-buoc"]'));

/**
 * Mở BƯỚC 2 và chờ lưới thẻ hiện ra.
 *
 * Khung ba bước tự mở bước hợp lý nhất khi vào: chưa có ai → bước 1; có người chưa làm →
 * bước 2. Nên với một sổ đã có người, bước 2 thường đã mở sẵn — hàm này chỉ bấm khi cần,
 * để test không phụ thuộc vào việc đoán đúng bước nào đang mở.
 */
export async function moBuocLamBai(): Promise<void> {
  await waitFor(() => expect(tamBuoc("lam-bai")).toBeTruthy());
  if (!buocDangMo("lam-bai")) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(CHU_BUOC.ten["lam-bai"], "u") }));
  }
  await waitFor(() => expect(buocDangMo("lam-bai")).toBe(true));
  await waitFor(() => expect(document.querySelector('[data-thu="luoi-thanh-vien"]')).toBeTruthy());
}

/** Mở bước 1 (quản lý người) và chờ bảng hiện ra. */
export async function moBuocNhaMinh(): Promise<void> {
  await waitFor(() => expect(tamBuoc("nha-minh")).toBeTruthy());
  if (!buocDangMo("nha-minh")) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(CHU_BUOC.ten["nha-minh"], "u") }));
  }
  await waitFor(() => expect(buocDangMo("nha-minh")).toBe(true));
}

/** Mở bước 3 (phân tích cả nhà). Chỉ mở được khi ≥ 2 người đã có hồ sơ. */
export async function moBuocPhanTich(): Promise<void> {
  await waitFor(() => expect(tamBuoc("phan-tich")).toBeTruthy());
  if (!buocDangMo("phan-tich")) {
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(CHU_BUOC.ten["phan-tich"], "u") }),
    );
  }
  await waitFor(() => expect(buocDangMo("phan-tich")).toBe(true));
}

/* ── Dựng thẳng khoang DISC cho một bộ đề (thay `DUONG_M1` cũ) ───────────── */

/**
 * 🔴 KHÔNG CÒN CHUỖI THAO TÁC NÀO ĐỂ ĐI. Bản cũ phải bấm qua màn *"Ai đang cầm máy?"* rồi
 * chọn lớp / mục tiêu / tuổi con. Từ V2.2 màn đó không còn: bộ đề suy thẳng từ VAI + BẬC
 * HỌC của người trong sổ, nên "đi tới bộ đề X" chỉ còn là "dựng khoang cho một người mà
 * vai + bậc của họ ra bộ X".
 *
 * Bảng dưới đây vì thế cũng là bản đặc tả đọc được: mỗi bộ đề ĐÚNG MỘT hồ sơ dẫn tới.
 * Thêm một cửa thứ hai vào bộ nào là thấy ngay ở đây.
 */
export const HO_SO_CHO_BO_DE = {
  /** Người lớn tự đánh giá — vai không đi học nên không có bậc. */
  PH: { vaiTro: "me", lop: undefined },
  /** Mầm non: người lớn trả lời hộ. */
  MN: { vaiTro: "con", lop: "mam-non" },
  TH: { vaiTro: "con", lop: "4" },
  THCS: { vaiTro: "con", lop: "7" },
  /** Bộ quan sát: cùng hồ sơ trẻ từ lớp 3, nhưng vào bằng `cheDo: "quan-sat"`. */
  QS: { vaiTro: "con", lop: "7" },
} as const;

export type MaBoDeThu = keyof typeof HO_SO_CHO_BO_DE;

/** Một hồ sơ thành viên BỊA, đủ để dẫn tới đúng bộ đề cần thử. */
export function nguoiChoBoDe(ma: MaBoDeThu, ten = "Zozo") {
  const h = HO_SO_CHO_BO_DE[ma];
  return {
    id: `tv-thu-${ma}`,
    ten,
    vaiTro: h.vaiTro,
    ...(h.lop ? { lop: h.lop } : {}),
    thuTu: 0,
    taoLuc: "2026-08-01T00:00:00.000Z",
    suaLuc: "2026-08-01T00:00:00.000Z",
  } as const;
}
