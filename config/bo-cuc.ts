/**
 * BỀ RỘNG KHUNG MÀN — một chỗ duy nhất để chỉnh (17.6).
 *
 * 🔴 VÌ SAO GOM VỀ ĐÂY. Trước 17.6, `max-w-*` rải khắp 12 file, và không ai đọc được ý đồ
 * từ chúng: `max-w-2xl` ở màn làm bài là một QUYẾT ĐỊNH (giữ dòng chữ ngắn để đọc được),
 * còn `max-w-3xl` ở bảng gia đình là một con số ai đó gõ vào rồi thôi. Hai thứ trông y hệt
 * nhau trong mã, nên khi cần nới thì không biết nới cái nào.
 *
 * 🔴 NỚI THEO LOẠI NỘI DUNG, KHÔNG NỚI ĐỒNG LOẠT. Chủ dự án nêu đúng vấn đề — màn 1920px
 * thừa hai phần ba bên phải — nhưng cách sửa sai là kéo mọi thứ ra full-width. Sản phẩm
 * này nội dung CHÍNH là chữ để phụ huynh đọc, và một dòng dài 200 ký tự khiến mắt lạc dòng
 * khi nhảy xuống dòng dưới. Nới cái cần nới (lưới thẻ, bố cục nhiều cột), giữ cái cần giữ
 * (đoạn văn, câu hỏi).
 *
 * Thuộc TẦNG LÕI: chỉ là hằng chuỗi. Tailwind quét cả `config/` nên các lớp ở đây vẫn được
 * sinh ra bình thường.
 */

export const KHUNG = {
  /**
   * Khung ngoài cùng của một khoang.
   *
   * Không để `max-w-none`: trên màn 4K, kéo hết bề ngang thì mắt phải quét quá xa và khoảng
   * cách giữa thanh bên với nội dung thành một vùng trống vô nghĩa.
   */
  trang: "mx-auto w-full max-w-[1600px]",

  /**
   * 🔴 KHUNG ĐỌC — khoảng 70 ký tự một dòng.
   *
   * Dùng cho MỌI đoạn văn dài, câu hỏi, thang trả lời, và từng cột của bố cục nhiều cột.
   * Đây là con số của ngành in chứ không phải sở thích: dòng quá dài thì mắt mất điểm neo
   * lúc xuống dòng, và người đọc phải đọc lại đầu dòng.
   */
  doc: "max-w-2xl",

  /**
   * Lưới thẻ thành viên. Sáu người (trần `SO_THANH_VIEN_TOI_DA`) vừa một màn ở mốc `xl`.
   */
  luoiThe: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",

  /**
   * Bản phân tích cả nhà: hai cột từ mốc `lg`.
   *
   * 🔴 `items-start` chứ không phải chiều cao bằng nhau — hai bản dài ngắn khác nhau, ép
   * bằng nhau là đẻ ra một mảng trống dưới bản ngắn hơn.
   */
  haiCot: "grid items-start gap-x-10 gap-y-10 lg:grid-cols-2",

  /** Đệm quanh nội dung của một khoang. */
  dem: "px-5 py-8 md:px-12 md:py-12",
} as const;
