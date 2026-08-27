/**
 * NGƯỠNG NGHIỆP VỤ — mọi con số quyết định kết quả nằm ở đây, không hardcode trong code
 * (rule 4 của `.claude/rules/module-boundaries.md`).
 *
 * Nguồn: `docs/BA/DISC_BA.md` §7.3 và §7.4.
 * Thuộc TẦNG LÕI: không React, không DOM.
 */

/**
 * Khoảng cách tối thiểu (trên thang 0–100) để coi một trục là TRỘI RÕ so với trục kế.
 * `d1 − d2 ≥ NGUONG_PHA` ⇒ kiểu đơn. Nhỏ hơn ⇒ kiểu pha.
 */
export const NGUONG_PHA = 8;

/**
 * Điểm tối thiểu (thang 0–100) để được nói thêm MỘT mệnh đề "nhóm này nổi rất rõ".
 *
 * 🔴 ĐỌC KỸ TRƯỚC KHI ĐỔI — vì sao chỉ có MỘT nấc chứ không phải thang cao/vừa/thấp:
 *
 * Phép đo quá thô để đỡ một thang nhiều nấc. Một nấc trả lời dịch điểm chuẩn hoá đi:
 *   bộ TH   5 câu/trục, thang 3 mức → 10,0 điểm
 *   bộ QS   4 câu/trục, thang 5 mức →  6,25 điểm
 *   bộ MN   5 câu/trục, thang 5 mức →  5,0 điểm
 *   THCS/PH 6 câu/trục, thang 5 mức →  4,17 điểm
 * Đặt lằn ranh ở 45 và 65 nghĩa là CÙNG MỘT ĐỨA TRẺ làm lại sau năm phút rơi sang nhóm
 * khác và đọc được một bản báo cáo khác nghĩa. Đó là ảnh chụp màn hình sẽ dùng để chê
 * sản phẩm, và người chê sẽ đúng.
 *
 * Nên cách xử lý KHÔNG phải là cố chỉnh ngưỡng cho chính xác — mà là CHẶN THIỆT HẠI khi
 * ngưỡng đoán sai: cường độ chỉ được thêm/bớt đúng một mệnh đề, không bao giờ đổi mạch
 * văn. Sai bên nào cũng chỉ mất một câu. Mọi nội dung khác khoá theo THỨ HẠNG (nổi nhất /
 * giữa / nhẹ nhất) vốn ổn định hơn nhiều.
 *
 * Và phải thoả CẢ HAI điều kiện (xem `noiRo` ở `modules/report/muc-do.ts`): điểm tuyệt đối
 * đạt ngưỡng này VÀ cách trục kế ít nhất `NGUONG_PHA`. Một mình điểm cao không đủ — bốn
 * trục cùng cao thì chẳng có trục nào nổi cả.
 *
 * ⚠️ Con số 70 là phán đoán chuyên môn, CHƯA có chuẩn Việt Nam. Chốt được nó cần bộ
 * 30–50 phản hồi thật ở mục CHỜ NGOÀI của `CLAUDE.md`.
 */
export const NGUONG_NOI_RO = 70;

export const NGUONG_HOP_LE = {
  /**
   * HL-1 — TRẢ LỜI PHẲNG. Tỷ lệ câu chọn đúng mức giữa vượt ngưỡng này ⇒ KHÔNG trả kết quả.
   *
   * 🔴 Đây là hàng rào quan trọng nhất, và là thứ hầu hết test miễn phí ngoài kia không có.
   * Dựng một hồ sơ hành vi trên toàn số 3 là dựng lâu đài trên cát. Đừng nới "cho đỡ phiền".
   *
   * ⚠️ Chỉ áp cho thang LẺ (3 và 5 mức — có mức giữa thật). Đổi sang thang chẵn thì phải
   * TẮT kiểm này, không phải để nó chạy vào khoảng trống.
   */
  tyLePhangToiDa: 0.4,

  /** HL-2 — TICK MỘT CỘT. Số câu LIÊN TIẾP cùng một đáp án từ ngưỡng này trở lên ⇒ cảnh báo. */
  soCauLienTiepCanhBao: 8,

  /**
   * HL-3 — MÂU THUẪN THUẬN/ĐẢO. Trung bình 4 trục của |TB(câu thuận) − TB(câu đảo đã đảo)|
   * vượt ngưỡng ⇒ cảnh báo. Ngưỡng theo SỐ MỨC của thang.
   */
  nguongMauThuanTheoThang: { 3: 0.9, 5: 1.5 } as Readonly<Record<number, number>>,

  /** HL-4 — BẤM BỪA. Thời gian trung bình mỗi câu dưới ngưỡng (giây) ⇒ cảnh báo. */
  giayMoiCauToiThieu: 2.5,
} as const;

/** Ngưỡng "vùng lệch" con ↔ cha mẹ (§8.3), tính trên thang 0–100. */
export const NGUONG_VUNG_LECH = {
  trungKhopToiDa: 10,
  hoiKhacToiDa: 25,
  /** Hai bài cách nhau quá số ngày này thì không ghép cặp nữa. */
  soNgayToiDa: 60,
  /** Chỉ diễn giải tối đa bấy nhiêu trục lệch lớn nhất — nói ít mà trúng. */
  soTrucDienGiaiToiDa: 2,
} as const;
