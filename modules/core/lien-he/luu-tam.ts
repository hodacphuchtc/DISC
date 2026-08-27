/**
 * BẢN MẶC ĐỊNH của điểm cắm `onGuiLienHe` — dùng khi CHƯA nối backend.
 *
 * Không có backend nên phiếu chỉ nằm lại trên máy người dùng và mở Zalo cho họ nhắn.
 * Đây KHÔNG phải "cái nút dối": nút có đường đi thành công thật (lưu + mở Zalo), chỉ là
 * chưa gửi tới máy chủ nào.
 *
 * 🔴 ĐỘI DEV: thay hàm này bằng lời gọi API của các anh. Xem
 * `docs/ban-giao/HUONG-DAN-CAM-VAO-APP.md`. Và giữ nguyên luật QĐ3 — payload chỉ có
 * thông tin liên hệ, không bao giờ kèm dữ liệu của trẻ.
 */

import { LIEN_HE_SATA } from "@config/disc-tu-dien";

import type { GuiLienHe, PhieuLienHe } from "./kieu";

const KHOA = "disc:lien-he";

export function docPhieuDaLuu(): PhieuLienHe[] {
  try {
    const tho = window.localStorage.getItem(KHOA);
    const doc: unknown = tho ? JSON.parse(tho) : [];
    return Array.isArray(doc) ? (doc as PhieuLienHe[]) : [];
  } catch {
    return [];
  }
}

export function xoaPhieuDaLuu(): void {
  try {
    window.localStorage.removeItem(KHOA);
  } catch {
    /* không sao */
  }
}

/** Lưu trên máy rồi mở Zalo. Lưu hỏng cũng vẫn mở Zalo — đừng chặn người muốn liên hệ. */
export const guiLienHeMacDinh: GuiLienHe = (phieu) => {
  try {
    window.localStorage.setItem(KHOA, JSON.stringify([...docPhieuDaLuu(), phieu]));
  } catch {
    /* mất khả năng NHỚ, không mất khả năng LIÊN HỆ */
  }
  try {
    window.open(`https://zalo.me/${LIEN_HE_SATA.soZalo}`, "_blank", "noopener");
  } catch {
    /* trình duyệt chặn cửa sổ mới — người dùng vẫn thấy số ở màn cảm ơn */
  }
};
