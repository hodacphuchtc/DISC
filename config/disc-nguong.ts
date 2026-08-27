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

/**
 * Tuổi từ mốc này trở lên thì dùng bộ đề / nội dung của lứa THCS.
 *
 * 🔴 Dùng ở HAI chỗ và bắt buộc là CÙNG một con số: chọn lứa nội dung (`luaTuoiTu` ở
 * `modules/report/dien-giai.ts`) và chọn bộ đề mời con tự làm ở màn vùng lệch
 * (`boDeConTuLam` ở `modules/test/dinh-tuyen.ts`). Trước đây nó là hằng CỤC BỘ nằm trong
 * `dien-giai.ts`, nên chỗ thứ hai không có gì bảo đảm dùng chung một mốc — và thực tế chỗ
 * đó đã gõ cứng "THCS" cho mọi lứa tuổi.
 */
export const TUOI_VAO_THCS = 12;

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

/**
 * Lớp cuối cấp tiểu học. Trên mốc này là THCS.
 *
 * 🔴 Sinh ra ở GĐ10 hạng mục 10.6, khi màn 1 đổi sang hỏi "em học lớp mấy" MỘT lần cho cả
 * hai cấp thay vì bắt người dùng tự chọn cấp trước rồi mới chọn lớp. Chỗ duy nhất biết
 * lớp 5 và lớp 6 khác cấp là con số này — gõ cứng `lop <= 5` trong `chon-doi-tuong.tsx`
 * là dựng nguồn sự thật thứ hai, đúng vết xe của `TUOI_VAO_THCS` đã trả giá.
 */
export const LOP_CUOI_TIEU_HOC = 5;

/**
 * Lớp nhỏ nhất và lớn nhất mà khoang này nhận.
 *
 * 🔴 11.5 nới trần từ 9 lên 12. Trước đó một em lớp 10 mở khoang ra là không thấy lớp
 * của mình đâu — và đó không phải "ngoài phạm vi sản phẩm", đó là con của đúng tệp gia
 * đình mà cả GĐ11–14 sinh ra để giữ chân.
 */
export const LOP_NHO_NHAT = 1;
export const LOP_LON_NHAT = 12;

/**
 * Từ lớp này trở lên, người làm bài dùng bộ PHỤ HUYNH (tự đánh giá, thang 5 mức, câu chữ
 * người lớn) và đọc nội dung ở tầng `NGUOI_LON`.
 *
 * Vì sao không dựng bộ đề thứ sáu cho cấp ba: bộ PH vốn là bản TỰ ĐÁNH GIÁ cho người lớn,
 * đúng thứ một em lớp 11 cần. Thêm một bộ 24 câu nữa là thêm một bộ phải soạn, phải sàng,
 * phải bảo trì — trong khi cái sẵn có đã vừa. Bao giờ có 30–50 phản hồi thật của lứa này
 * mà thấy nó chệch thì hẵng tách.
 */
export const LOP_DAU_CAP_BA = 10;

/* ── Cỡ chữ và cỡ nút theo lứa (11.3) ────────────────────────────────────── */

/**
 * Những bộ đề mà NGƯỜI BẤM LÀ TRẺ NHỎ ⇒ chữ ≥ 18px, nút cao ≥ 56px, cách nhau ≥ 12px.
 *
 * 🔴 VÌ SAO PHẢI LÀ MỘT HẰNG RIÊNG, KHÔNG SUY TỪ `cauMoiMan`.
 *
 * Trước 11.3, màn làm bài quyết định cỡ chữ bằng `boDe.cauMoiMan === 1` — tiện, vì lúc đó
 * đúng hai bộ MN và TH có một câu một màn. Nhưng đó là suy từ MỘT THỨ KHÁC HẲN: số câu
 * trên màn nói về mật độ trình bày, còn cỡ nút nói về ngón tay của một đứa bé sáu tuổi.
 * Hai khái niệm chỉ TÌNH CỜ trùng nhau.
 *
 * 11.3 đổi `cauMoiMan` của MN và TH sang 5. Nếu cứ để suy như cũ thì ngay lúc đó cả hai
 * bộ dành cho trẻ nhỏ nhất lặng lẽ tụt xuống chữ 14px và nút 44px — không test nào đỏ,
 * không ai thấy, đúng vết xe của bảng đại từ một chiều đã trả giá ở GĐ10.
 */
export const BO_DE_TRE_NHO = ["MN", "TH"] as const;

/** Bộ đề này có phải trẻ nhỏ tự bấm không ⇒ dùng cỡ chữ và cỡ nút to. */
export function canNutTo(maBoDe: string): boolean {
  return (BO_DE_TRE_NHO as readonly string[]).includes(maBoDe);
}

/* ── So sánh theo thời gian (13.2) ───────────────────────────────────────── */

/**
 * Hai bài phải cách nhau ÍT NHẤT bấy nhiêu ngày thì mới đem so.
 *
 * 🔴 VÌ SAO CÓ SÀN NÀY, VÀ VÌ SAO NÓ CAO.
 *
 * Phép đo này thô. Một nấc trả lời dịch điểm chuẩn hoá đi 4–10 điểm tuỳ bộ đề — nghĩa là
 * cùng một đứa trẻ, cùng một tuần, đổi ý ở hai câu là hồ sơ đã khác. Đem hai bài cách nhau
 * ba tuần ra so thì thứ hiện lên KHÔNG phải là thay đổi của đứa trẻ, mà là nhiễu của phép
 * đo — và nó vẫn đọc lên đầy thuyết phục vì có số kèm theo.
 *
 * 90 ngày không phải con số thần kỳ; nó là mốc mà một học kỳ đã trôi qua, tức là có thứ
 * ngoài đời đủ lớn để giải thích một thay đổi. Dưới mốc đó thì im lặng còn hơn.
 */
export const NGAY_TOI_THIEU_DE_SO_SANH = 90;
