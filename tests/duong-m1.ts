import { fireEvent, screen } from "@testing-library/react";

import { CHU_CHON } from "../config/disc-tu-dien";

/**
 * ĐƯỜNG ĐI QUA MÀN 1 — nguồn DUY NHẤT cho mọi test cần vào một bộ đề.
 *
 * 🔴 Vì sao gom về đây. Hạng mục 10.6 sắp lại M1 thành hai nhánh, và bốn file test khác
 * nhau cùng đỏ một lượt (34 cửa) chỉ vì mỗi file tự gõ lại chuỗi thao tác M1 của riêng nó.
 * Bản thân việc đỏ là đúng — đặc tả đổi thật. Cái sai là phải sửa BỐN chỗ cho MỘT thay đổi,
 * và lần sau vẫn thế.
 *
 * Từ đây: M1 đổi thì sửa đúng file này. Test nào hỏng sau đó là hỏng THẬT, không phải hỏng
 * vì đường đi.
 */
const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));

/** Hai thẻ nhánh của M1. Neo vào ĐẦU chuỗi vì nhãn thẻ còn kèm dòng mô tả. */
const NHANH = {
  hocSinh: /^Em học sinh/u,
  nguoiLon: /^Bố mẹ hoặc thầy cô/u,
} as const;

const nhanLop = (lop: number) => CHU_CHON.nhanLop.replace("{so}", String(lop));

/**
 * Mỗi bộ đề ĐÚNG MỘT CỬA — đó là chính thứ 10.6 dựng ra. Danh sách này vì thế cũng là bản
 * đặc tả đọc được: thêm một cửa thứ hai vào bộ nào là thấy ngay ở đây.
 */
export const DUONG_M1 = {
  /** Bộ Mầm non giờ KHÔNG còn cửa trực tiếp — chỉ tới được bằng đường chuyển hướng. */
  MN: (tuoiCon = 5) => {
    bam(NHANH.nguoiLon);
    bam(CHU_CHON.mucTieuCon);
    bam(String(tuoiCon));
  },
  /** Lớp 1–2 sẽ bị chuyển sang bộ Mầm non kèm hộp giải thích — đó là luật ADR-002. */
  TH: (lop = 4) => {
    bam(NHANH.hocSinh);
    bam(nhanLop(lop));
  },
  THCS: (lop = 7) => {
    bam(NHANH.hocSinh);
    bam(nhanLop(lop));
  },
  PH: () => {
    bam(NHANH.nguoiLon);
    bam(CHU_CHON.mucTieuToi);
  },
  /**
   * Cửa THỨ HAI vào bộ PH, mở ở 11.5: học sinh cấp ba trở lên.
   *
   * 🔴 Đây là ngoại lệ DUY NHẤT của luật "mỗi bộ đề đúng một cửa", và cố ý. Bộ PH vốn là
   * bản TỰ ĐÁNH GIÁ cho người lớn — một em lớp 11 cần đúng bản đó, chứ không cần một bộ
   * đề thứ sáu phải soạn và bảo trì riêng. Ghi rõ ở đây để người sau khỏi tưởng là sót.
   */
  PH_CAP_BA: (lop: number | "tren-12" = 11) => {
    bam(NHANH.hocSinh);
    bam(lop === "tren-12" ? CHU_CHON.nhanTren12 : nhanLop(lop));
  },
  QS: (tuoiCon = 10) => {
    bam(NHANH.nguoiLon);
    bam(CHU_CHON.mucTieuCon);
    bam(String(tuoiCon));
  },
} as const;

export { NHANH as NHANH_M1, nhanLop };
