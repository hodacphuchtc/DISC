# ADR-008 — Ba bước trong MỘT khoang; mọi bài thuộc một người trong sổ

**Ngày:** 28/08/2026 · **Trạng thái:** ĐÃ CHỐT
**Lật một phần:** [ADR-007](ADR-007-don-vi-du-lieu-la-gia-dinh.md) mục *"bảng gia đình thay
wizard ba bước"*

## Bối cảnh

Ngày 28/08/2026 chủ dự án chạy thử bản phát hành và kết luận: *"luồng thông tin hoàn toàn
không đúng với những gì tôi đã yêu cầu."*

Đối chiếu mã thật thì **gần như mọi tính năng đã có**: engine phân tích cả nhà, 56 đoạn nội
dung cặp, hạn mức 2 bài, hạn mức 5 thư mục — tất cả chạy được. Cái sai là **kiến trúc thông
tin**. Sản phẩm mở ra ở màn *"Ai đang cầm máy?"* rồi hỏi lại vai và lớp — thứ sổ gia đình đã
biết thừa; còn *Nhà mình* và *Phân tích cả nhà* nằm ở khoang khác, phải tự tìm ra. Người dùng
gặp một bài trắc nghiệm lẻ, không gặp một sản phẩm cho gia đình.

Ba thứ đã dựng xong mà **chưa nối vào đâu**, phát hiện khi đọc mã:

| Thứ | Trạng thái trước 28/08 |
| --- | --- |
| Danh sách 5 thư mục phân tích | Chữ nằm trong `config/`, **không component nào vẽ** |
| Đọc lại bản phân tích đã lưu | `docPhanTich()` nằm trong kho, **không ai gọi** |
| Bộ đề Mầm non | `dinhTuyen()` nhận `doiTuong: "mam-non"`, **không cửa nào truyền vào** |

Và một **lỗi chặn thật** tồn từ GĐ12: `boDeCuaThanhVien()` định tuyến bộ đề chỉ từ `tv.lop`
và **không đọc `vaiTro`**. Bố mẹ không có lớp ⇒ `null`; trẻ mầm non ⇒ `Number("mam-non")` ra
`NaN` ⇒ cũng `null`. Cả hai bị đá về màn *"Ai đang cầm máy?"*. Nghĩa là **bấm "Làm bài" trên
thẻ của Mẹ thì không vào được bài của Mẹ** — đúng nhóm người mà cả GĐ11–GĐ14 xây cho.

## Quyết định

**Một khoang, ba bước xếp dọc:** `1 Nhà mình → 2 Làm bài test → 3 Phân tích cả nhà`.
**Mọi bài phải thuộc một người trong sổ.** Màn *"Ai đang cầm máy?"* bị xoá.

Bộ đề suy từ **VAI + BẬC HỌC** của người trong sổ, không hỏi lại câu nào:

| Thành viên | Bộ đề | Ai trả lời |
| --- | --- | --- |
| Vai không đi học (bố/mẹ/ông/bà/người thân/khác) | `PH` | chính họ |
| Lớp Mầm non · Lớp 1–2 | `MN` (kèm hộp giải thích bắt buộc) | người lớn trả lời hộ |
| Lớp 3–5 · Lớp 6–9 | `TH` · `THCS` | em tự làm |
| Lớp 10–12 · Trên lớp 12 | `PH` | em tự làm |

Bậc học có **14 lựa chọn**: Mầm non · Lớp 1–12 · Trên lớp 12. Ô lớp **chỉ hiện với vai còn
đi học**.

## Lý do

**Vì sao lật phần "tuần tự" của ADR-007.** ADR-007 bác wizard ba bước vì *"ba bước tuần tự
bắt người dùng đi hết bước 1 mới thấy bước 2"*, và vì một bảng thì **nhìn một cái là biết ai
chưa làm** — chính thông tin khiến phụ huynh đi nhắc người còn lại.

Điều lo đó **vẫn đúng**, nên nó được giữ bằng hai cách:

1. **Bảng gia đình GIỮ NGUYÊN**, nằm bên trong bước 1. Không có gì bị thay bằng một wizard.
2. **Khoá mềm, không giấu.** Bước chưa mở được vẫn hiện ra, mờ đi kèm câu nói rõ **còn thiếu
   gì** (*"Thêm người ở bước 1 trước đã"*). Người dùng luôn thấy phía trước còn gì — và
   chính cái đó mới khiến họ đi thêm một bước.

Thứ bị lật là *"ba bước không được là khung điều hướng chính"*. Chủ dự án chốt ngược lại, và
lý do đứng vững: thứ tự **khai người → làm bài → đọc về nhau** không phải trình bày, nó là
NỘI DUNG. Không có bước 1 thì bước 2 không có ai để chọn; không có bước 2 thì bước 3 không có
gì để so.

**Vì sao xoá lối làm bài tự do.** Bài không gắn với ai rơi vào nhóm *"chưa xếp"* và **không
bao giờ vào được phân tích cả nhà** — tức là một ngõ cụt. Giữ một lối đi dẫn tới ngõ cụt chỉ
để "cho linh hoạt" là bày ra một lựa chọn mà mình biết trước là tệ hơn.

**Vì sao không đoán bộ đề khi thiếu bậc học.** Người đang đi học mà hồ sơ chưa có lớp thì
màn nói thẳng và chỉ chỗ sửa. Đưa nhầm một em lớp 3 vào bộ THCS là bịa ra một con số mà sáu
tháng sau không ai phân biệt được với số thật.

## Hệ quả

- Thanh bên còn **một mục** và thôi làm điều hướng. `MA_KHOANG`, `chuanHoaMaKhoang()`,
  `KHOA_KHOANG_DANG_MO` đã **gỡ hẳn** — một hàm canh cửa không ai gọi thì im lặng y như một
  cửa canh hỏng.
- Màn *Số liệu máy này* ẩn sau `?so-lieu=1`. Không xoá: `baiThuHai` trên màn đó là con số
  **duy nhất** kiểm chứng được giả định đang đỡ 9,5 ngày công của GĐ14.
- Bài quan sát về trẻ chuyển sang **thẻ của đứa trẻ** (nút phụ, từ lớp 3). Thẻ bố mẹ chỉ còn
  bài về chính họ — đúng yêu cầu — mà mầm non và lớp 1–2 vẫn có đường vào, vì ADR-002 bắt
  buộc người lớn trả lời hộ.
- `app/khoang/chon-doi-tuong.tsx` xoá; `tests/duong-m1.ts` thay bằng `tests/duong-vao-bai.ts`.
- Màn *Bài đã làm* cũ (`lich-su.tsx`) — **đã chết từ GĐ12 mà không ai biết** — chuyển vào
  vùng cách ly `cu/`, có `tests/vung-cach-ly.test.ts` canh luật một chiều.

## Ghi lại để sau còn truy được

Chủ dự án nói rõ: **không hỏi lại vì sao khác luồng cũ.** Bản ADR này ghi cả phản biện của
ADR-007 không phải để mở lại tranh luận, mà để đời sau cân được — nếu ngày nào đó thấy phụ
huynh lạc trong ba bước, thì lý lẽ của ADR-007 vẫn còn nguyên ở đây để đọc lại.
