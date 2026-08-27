# ADR-007 — Đơn vị dữ liệu là MỘT GIA ĐÌNH, không phải một bài

**Ngày:** 27/08/2026 · **Trạng thái:** ĐÃ CHỐT

## Bối cảnh

Từ GĐ0 tới GĐ10, đơn vị dữ liệu là **một bài làm**: `BaiLamLuu` gồm bộ đề, biệt danh, câu
trả lời, kết quả. Màn *Bài đã làm* liệt kê chúng theo thời gian. Ghép hai người để đối chiếu
là một thao tác phụ, tìm theo biệt danh.

Ngày 27/08/2026 mục tiêu kinh doanh đổi: từ *mồi thu khách lạ* sang **giữ chân hơn 1.000 gia
đình đang học**. Sản phẩm đi cùng: từ *"đo một đứa trẻ"* sang *"giúp một gia đình hiểu nhau"*.

Danh sách bài xếp theo thời gian không trả lời được câu hỏi mà sản phẩm mới đặt ra: **nhà
này gồm những ai, ai đã làm, ai chưa.**

## Quyết định

**Đơn vị dữ liệu là một GIA ĐÌNH.** Ba bảng:

| Bảng | Giữ gì | Ghi chú |
| ---- | ------ | ------- |
| `giaDinh` | một máy = một nhà | id, ngày lập |
| `thanhVien` | tên, vai, ngày thêm | 🔴 tên thật, xem ADR-005 |
| `baiLam` | như `BaiLamLuu` cũ, thêm khoá tới thành viên | dữ liệu cũ di trú vào đây |

**Hạn mức: 2 bài mỗi thành viên.** Bài thứ ba đẩy bài cũ nhất ra — nhưng **không bao giờ
xoá im lặng**, phải hỏi.

**KHÔNG tách bảng nối** giữa gia đình và thành viên. Một máy là một nhà; một thành viên
thuộc đúng một nhà. Bảng nối chỉ có nghĩa khi quan hệ là nhiều-nhiều, và ở đây nó không
phải — dựng sẵn "cho tương lai" là trả giá bảo trì hôm nay cho một thứ có thể không bao
giờ tới.

## Lý do

**Vì sao bảng gia đình thay wizard ba bước.** Ba bước tuần tự bắt người dùng đi hết bước 1
mới thấy bước 2. Một bảng thì mỗi việc đúng một cú chạm, và **nhìn một cái là biết ai chưa
làm** — đó chính là thông tin khiến phụ huynh đi nhắc người còn lại.

**Vì sao hạn mức 2 bài.** Đủ để so *"Bin hồi tháng 3 ↔ Bin bây giờ"*, và đủ ít để bảng
không thành một danh sách dài. Con số nằm trong `config/`, không gõ cứng.

**Vì sao mã mời ~40 byte thay vì "cả nhà một máy".** ADR-001 cấm backend, nên mặc định cả
nhà phải xếp hàng trên một điện thoại — ma sát lớn hơn hình dung nhiều, và đúng kể cả khi
phần mềm hoàn hảo. Một hồ sơ DISC chỉ là bốn con số, nên nhét vừa một mã QR. Gỡ được trần
đó mà không phá ADR-001. Chi tiết ở `modules/core/gia-dinh/ma-moi.ts`.

## 🔴 Giả định đang đỡ toàn bộ GĐ14 — ghi lại để sau còn truy được

GĐ14 (9,5 ngày) đứng trên một giả định: *một phụ huynh sẽ triệu tập được từ hai thành viên
trở lên cùng làm bài.*

Tính tới 27/08/2026, giả định này có **0 quan sát ủng hộ và 1 quan sát phản bác**: tính năng
ghép hai người đã có từ GĐ5 và **chưa lần nào tự kích hoạt ngoài đời**. Dưới 10 người ngoài
vòng quen từng làm xong một bài — tiếp cận dưới 1% tệp khách.

Chủ dự án đã nghe phản biện và chọn xây trọn. **Ba bảo hiểm đã cài:**

1. GĐ11 phát cho 30 gia đình ngay khi xong (ngày 5), không đợi hết gói.
2. Mốc `baiThuHai` làm sớm ở 11.6 — biến giả định thành con số đo được.
3. `13.1` mã mời gỡ trần "cả nhà một máy" **trước** GĐ14.

Nếu tới giữa GĐ12 mà `baiThuHai` vẫn bằng 0 trên 30 máy, thì thứ cần xem lại là giả định,
không phải phần mềm.

## Hệ quả

- Di trú dữ liệu cũ: mỗi biệt danh đang có thành một thành viên. **Không mất một bài nào** —
  đó là điều kiện nghiệm thu của `12.1`.
- Màn *Bài đã làm* bị thay bằng **Bảng gia đình** (`12.3`).
- `DISC_BA.md` §10.1–10.2 phải sửa theo lược đồ mới.
- Ba mốc đo mới: `themThanhVien` · `baiThuHai` · `phanTichGiaDinh`.
