/**
 * HẠN MỨC LƯU TRỮ — chọn ra thứ PHẢI XOÁ, và chỉ có thế.
 *
 * 🔴 FILE NÀY KHÔNG XOÁ GÌ CẢ. Nó trả về **danh sách nạn nhân** để nơi gọi đem hỏi người
 * dùng. Tách như vậy là cố ý và là phần quan trọng nhất của thiết kế:
 *
 * Cạm bẫy mà cả repo này đang cảnh báo là *xoá im lặng bên trong một hàm ghi*. Nếu hạn mức
 * được thi hành ngay trong `luuBai()` thì `ghiBanKhoan()` — vốn chỉ đính một mã băn khoăn
 * vào bài cũ — cũng gọi `luuBai()`, và một thao tác vô hại như thế sẽ âm thầm xoá mất bài
 * của người khác. Không ai bấm gì, không ai được hỏi, và không có cách nào lấy lại.
 *
 * Nên: chọn nạn nhân là hàm THUẦN ở đây · hỏi người dùng là việc của giao diện · thi hành
 * là việc của tầng lưu trữ, và chỉ chạy khi người dùng đã bấm xác nhận.
 *
 * Thuộc TẦNG LÕI (ADR-004): hàm thuần, không React, không DOM, không IndexedDB.
 */

import { GIOI_HAN_BAI_MOI_NGUOI, GIOI_HAN_THU_MUC } from "@config/disc-gia-dinh";

/** Chỉ cần bấy nhiêu để xếp thứ tự. Nhận `BaiLamLuu` thật cũng vừa. */
export type BaiCoThoiDiem = {
  readonly id: string;
  /** ISO 8601. */
  readonly ketThuc: string;
};

export type ThuMucCoThoiDiem = {
  readonly id: string;
  /** ISO 8601. */
  readonly taoLuc: string;
};

/**
 * Sắp xếp MỚI TRƯỚC. Bằng thời điểm thì lấy `id` phân định — không có bước đó thì thứ tự
 * phụ thuộc vào thứ tự kho trả về, và "bài nào bị xoá" thành ra ngẫu nhiên giữa hai lần
 * chạy. Với một hộp thoại nêu đích danh bài sắp mất, ngẫu nhiên là không chấp nhận được.
 */
function xepMoiTruoc<T extends { readonly id: string }>(
  ds: readonly T[],
  moc: (x: T) => string,
): T[] {
  return [...ds].sort((a, b) => moc(b).localeCompare(moc(a)) || a.id.localeCompare(b.id));
}

/**
 * Những bài phải xoá để một thành viên còn đúng `gioiHan` bài, KỂ CẢ bài sắp thêm.
 *
 * `soBaiSapThem` mặc định 1: hàm này gần như luôn được gọi ngay trước khi người dùng bắt
 * đầu một bài mới, và câu hỏi thật là *"thêm bài này vào thì cái gì phải đi?"*. Truyền 0
 * để hỏi câu khác: *"hiện đang thừa cái gì?"*.
 */
export function chonBaiPhaiXoa<T extends BaiCoThoiDiem>(
  ds: readonly T[],
  gioiHan: number = GIOI_HAN_BAI_MOI_NGUOI,
  soBaiSapThem = 1,
): T[] {
  if (gioiHan <= 0) return [...ds];
  const giuLai = Math.max(gioiHan - soBaiSapThem, 0);
  return xepMoiTruoc(ds, (x) => x.ketThuc).slice(giuLai);
}

/** Cùng luật, cho thư mục phân tích cả nhà. */
export function chonThuMucPhaiXoa<T extends ThuMucCoThoiDiem>(
  ds: readonly T[],
  gioiHan: number = GIOI_HAN_THU_MUC,
  soSapThem = 1,
): T[] {
  if (gioiHan <= 0) return [...ds];
  const giuLai = Math.max(gioiHan - soSapThem, 0);
  return xepMoiTruoc(ds, (x) => x.taoLuc).slice(giuLai);
}

/** Người này đã chạm trần chưa — thêm một bài nữa là có thứ phải mất. */
export function daChamTran(
  soBaiHienCo: number,
  gioiHan: number = GIOI_HAN_BAI_MOI_NGUOI,
): boolean {
  return soBaiHienCo >= gioiHan;
}
