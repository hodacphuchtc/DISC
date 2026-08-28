# OVERVIEW — Module `test`

> Cập nhật 27/08/2026.

## 1. Mục đích

Quyết định **ai làm bộ đề nào**, và lo phần **logic của luồng làm bài** (chia trang, tiến
độ, mốc động viên, biệt danh).

## 2. Phạm vi (In / Out)

- **In:** luật định tuyến §4.2 · chuẩn hoá biệt danh · chia trang và tiến độ.
- **Out:** nội dung câu hỏi (nằm ở `config/`) · nạp bộ đề (`core/bo-de/nap.ts`) ·
  chấm điểm (`modules/report`) · giao diện (`app/khoang/`).

## 3. Cấu trúc bên trong

| File | Vai trò |
| ---- | ------- |
| `dinh-tuyen.ts` | 🔴 Quyết định chuyên môn quan trọng nhất: trẻ dưới 8 tuổi KHÔNG tự đánh giá |
| `biet-danh.ts` | Chuẩn hoá tên gọi, đếm ký tự tiếng Việt đúng, nhắc khi nghe như họ tên |
| `lam-bai/tien-trinh.ts` | Chia trang theo `cauMoiMan`, tìm trang đang dở, mốc động viên |

## 4. Phụ thuộc

Chỉ `@modules/core` và `@config`. **Không** import `@modules/report`.

## 5. Trạng thái

Xong (28/08/2026). Không còn việc dở. Tiến độ + bàn giao: **`PLAN_V2.md`**.

🔴 **Định tuyến nay đi từ SỔ GIA ĐÌNH, không từ một màn hỏi.** `boDeChoThanhVien(vai, lop)`
suy bộ đề từ vai + bậc học của người trong sổ; `boDeQuanSatTheoLop(lop)` cho nút *bố mẹ
trả lời về trẻ*. Màn *"Ai đang cầm máy?"* đã bị xoá (ADR-008). Cả hai hàm vẫn đi xuyên qua
`dinhTuyen()` — luật ADR-002 chỉ được có MỘT nơi giữ.

## 6. Cạm bẫy đã trả giá

- 🔴 **Lớp 1–2 không bao giờ được ra bộ TH.** Đọc được chữ nhưng vẫn gật bừa nặng.
  `tests/dinh-tuyen.test.ts` quét toàn bộ 9 lớp để canh, và có một test riêng khẳng định
  KHÔNG đường nào đưa trẻ dưới 8 tuổi vào bộ tự làm.
- 🔴 **Chuyển sang bản quan sát phải KÈM giải thích hiện ra.** Chuyển im lặng là lừa người
  dùng; không chuyển là bịa số.
- 🔴 **MỘT HÀM ĐỌC THIẾU MỘT TRƯỜNG ĐÃ KHOÁ NGUYÊN NHÓM NGƯỜI DÙNG SUỐT BA GIAI ĐOẠN**
  (28/08/2026). `boDeCuaThanhVien()` cũ định tuyến chỉ từ `tv.lop`, **không đọc `vaiTro`**.
  Bố mẹ không có lớp ⇒ `null`; trẻ mầm non ⇒ `Number("mam-non")` ra `NaN` ⇒ cũng `null`.
  Cả hai bị đá về màn hỏi lại — tức là **bấm "Làm bài" trên thẻ của Mẹ thì không vào được
  bài của Mẹ**. 1.115 test xanh không thấy, vì test chỉ hỏi *"form lưu được không"*, chưa
  ai hỏi *"người này rồi có vào được bài của họ không"*.
- 🔴 **Gác cửa ADR-002 bằng LỚP, không bằng tuổi suy ra.** Sổ gia đình chỉ có lớp; suy tuổi
  từ lớp rồi chuyền vào `dinhTuyen()` là bịa một con số chưa ai nhập (lớp 4 có cả bé 9 lẫn
  bé 10). `boDeQuanSatTheoLop()` phát biểu lại hàng rào bằng lớp, và có test canh cho hai
  cách phát biểu không bao giờ lệch nhau.
- **`.length` đếm sai chữ tiếng Việt gõ kiểu tổ hợp** (NFD): `"ẩ"` thành 2. Chuẩn hoá NFC
  rồi đếm bằng `[...chuoi]`.
- **Câu hỏi phụ (lớp mấy / tuổi con) phải Ở LẠI sau khi chọn** — bản đầu tôi ẩn chúng ngay
  khi đủ thông tin định tuyến, người dùng muốn đổi ý phải bấm lại từ đầu. Có test hồi quy.
