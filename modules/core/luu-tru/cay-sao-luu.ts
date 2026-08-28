/**
 * CÂY THƯ MỤC CỦA TỆP SAO LƯU (17.4) — hàm THUẦN, không đụng kho, không đụng PDF.
 *
 * 🔴 VÌ SAO TÁCH RA MỘT FILE RIÊNG. Việc "đặt tên thư mục cho một nhà" nghe như chuyện vặt,
 * nhưng nó gánh ba luật dễ sai và khó thấy: tên trùng, ký tự cấm hệ tệp, và trần số bản.
 * Nhét chúng vào giữa hàm gói `.zip` thì chúng chỉ kiểm được qua một tệp `.zip` thật —
 * đắt, chậm, và mỗi lần đỏ phải đi mò xem hỏng ở khâu nào. Ở đây là hàm thuần: vào một
 * cái tên, ra một cái tên, kiểm bằng số học.
 *
 * Thuộc TẦNG LÕI (ADR-004): không React, không DOM, không IndexedDB.
 */

/** Ký tự mà Windows / macOS / bộ giải nén cấm trong tên tệp và thư mục. */
const KY_TU_CAM = /[/\\:*?"<>|]/gu;

/**
 * Làm sạch một tên để dùng làm THƯ MỤC trong tệp `.zip`.
 *
 * 🔴 GIỮ DẤU TIẾNG VIỆT, cố ý khác `tenTepBan()` vốn bỏ dấu. Lý do khác nhau: tên TỆP đi
 * kèm ngày giờ và người dùng ít khi đọc kỹ; tên THƯ MỤC là thứ họ nhìn đầu tiên khi giải
 * nén, và cả hạng mục này sinh ra để tệp `.zip` **mở ra là đọc được**. "Me-Lan" thì mất
 * đúng thứ đang cần. JSZip ghi cờ UTF-8 nên Windows 10+ và macOS đọc đúng.
 *
 * 🔴 Chấp nhận lật hàng rào *"tên không vào tệp xuất"* của ADR-005 — chủ dự án đã chốt
 * 28/08/2026, và `16.6` đã có tiền lệ đặt tên tệp PDF theo tên người.
 */
export function lamSachTenThuMuc(ten: string): string {
  const sach = ten
    .replace(KY_TU_CAM, " ")
    .replace(/\s+/gu, " ")
    // Windows cấm tên kết thúc bằng dấu chấm hoặc khoảng trắng.
    .replace(/[. ]+$/u, "")
    .trim();
  return sach || "Chưa đặt tên";
}

/**
 * Tên thư mục KHÔNG TRÙNG trong một lượt gói.
 *
 * 🔴 Form thêm người đã chặn trùng tên, nhưng hồ sơ nhận qua mã mời do **máy nhận tự đặt
 * tên** — không đi qua cửa đó. Và sau khi lọc ký tự cấm thì hai tên khác nhau vẫn có thể
 * dồn về một (`Bé/Na` và `Bé Na`). Trùng mà không xử lý thì một thư mục ghi đè thư mục
 * kia, và người dùng mất bản của một người mà không có gì báo.
 */
export function tenThuMucNguoi(ten: string, daDung: ReadonlySet<string>): string {
  const goc = lamSachTenThuMuc(ten);
  if (!daDung.has(goc)) return goc;
  for (let i = 2; i < 100; i += 1) {
    const thu = `${goc} (${i})`;
    if (!daDung.has(thu)) return thu;
  }
  return `${goc} (${daDung.size + 1})`;
}

/**
 * Tên thư mục con của một lần phân tích: `yyyy-mm-dd HHhMM`.
 *
 * Đặt tên theo **ngày giờ tạo bản phân tích**, không theo lúc bấm sao lưu — người dùng cần
 * biết bản đó chạy khi nào, không cần biết họ bấm nút lúc mấy giờ.
 */
export function tenThuMucLanChay(taoLuc: string): string {
  const d = new Date(taoLuc);
  if (Number.isNaN(d.getTime())) return "khong-ro-thoi-diem";
  const hai = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${hai(d.getMonth() + 1)}-${hai(d.getDate())} ` +
    `${hai(d.getHours())}h${hai(d.getMinutes())}`
  );
}

/** Thư mục gốc chứa các lần phân tích cả nhà. */
export const THU_MUC_TONG_HOP = "Tổng hợp";

/**
 * Thư mục chứa phần MÁY đọc.
 *
 * 🔴 Tiền tố gạch dưới để nó chìm xuống cuối danh sách trong mọi trình quản lý tệp — người
 * dùng mở `.zip` ra phải thấy tên người trước, không thấy một thư mục đầy JSON trước.
 */
export const THU_MUC_MAY_DOC = "_may-doc";

/** Tên tệp giải thích đặt trong `_may-doc/`. */
export const TEP_DOC_TRUOC = `${THU_MUC_MAY_DOC}/ĐỌC TRƯỚC.txt`;

/**
 * Nội dung tệp `ĐỌC TRƯỚC.txt`.
 *
 * 🔴 Câu này tồn tại vì chính lời phàn nàn sinh ra hạng mục 17.4: *"có một số file JSON
 * không đọc được"*. Chúng không hỏng — chúng là phần máy đọc. Nói ra một lần ở đúng chỗ
 * người ta gặp chúng thì rẻ hơn nhiều so với để họ tự đoán.
 */
export const CHU_DOC_TRUOC = [
  "THƯ MỤC NÀY DÀNH CHO MÁY, KHÔNG DÀNH ĐỂ ĐỌC.",
  "",
  "Các tệp .json bên trong là bản sao dữ liệu để nút *Khôi phục từ .zip* nạp lại được.",
  "Mở bằng mắt sẽ thấy một mớ ký hiệu — đó là bình thường, tệp không hỏng.",
  "",
  "Phần dành cho bạn đọc nằm ở các thư mục mang tên từng người, và thư mục *Tổng hợp*.",
  "",
  "ĐỪNG XOÁ thư mục này. Xoá đi thì tệp .zip vẫn mở được, nhưng nút Khôi phục sẽ không",
  "còn gì để nạp — và lúc cần đến nó thì đã muộn.",
].join("\n");
