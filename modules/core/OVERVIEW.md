# OVERVIEW — Module `core`

> Cập nhật 27/08/2026. Đọc mục 1–4 là đủ cho việc sửa code thường ngày.

## 1. Mục đích

Module **nền tảng**: kiểu dữ liệu dùng chung, cửa nạp bộ đề, và toàn bộ hạ tầng đụng
trình duyệt (lưu trữ, đếm phễu, điểm cắm liên hệ).

🔴 **Không có Supabase, không có API, không có auth.** Bản 1 chạy 100% trong trình duyệt
— xem `docs/decisions/ADR-001-khong-backend.md`. Nếu bạn thấy tài liệu nào còn nhắc
Supabase thì tài liệu đó lỗi thời.

## 2. Phạm vi (In / Out)

- **In:** kiểu `BoDe`/`CauHoi`/`BaiLam`/`KetQua` · nạp bộ đề từ `config/` · IndexedDB ·
  localStorage · sao lưu `.zip` · đếm phễu · điểm cắm thu liên hệ · tiện ích ngày tháng.
- **Out:** luật định tuyến và luồng làm bài → `modules/test`. Chấm điểm, diễn giải,
  vùng lệch, vẽ ảnh → `modules/report`.
- `core` **không được** import sâu vào hai module kia — `.semgrep/ranh-gioi-module.yml` canh.

## 3. Cấu trúc bên trong

| Thư mục | Vai trò | Tầng lõi? |
| ------- | ------- | --------- |
| `bo-de/kieu.ts` | Kiểu dùng chung: `BoDe`, `CauHoi`, `KetQua`, `Kieu`, `BaiLam` | ✅ |
| `bo-de/nap.ts` | Cửa DUY NHẤT lấy bộ đề — ghép nội dung câu với thứ tự đã chốt cứng | ✅ |
| `bo-de/bam.ts` | Băm ngân hàng câu, khoá nội dung vào `PHIEN_BAN_BO_DE` | ✅ |
| `tien-ich/ngay.ts` | ISO ↔ dd/mm/yyyy, đếm ngày. Chặn bẫy `new Date("01/08/2026")` | ✅ |
| `lien-he/kieu.ts` | Kiểu phiếu liên hệ + hàng rào QĐ3 (`timKhoaCam`) | ✅ |
| `luu-tru/nhap.ts` | Nháp bài đang làm (localStorage), gắn theo bộ đề **và** biệt danh | ❌ |
| `luu-tru/kho-bai.ts` | Bài đã xong (IndexedDB) | ❌ |
| `luu-tru/sao-luu.ts` | Xuất `.zip`. 🔴 `saoLuuTatCa()` KHÔNG nhận tham số lọc | ❌ |
| `do-phieu/index.ts` | Bốn mốc phễu + tham số `?nguon=` | ❌ |
| `lien-he/luu-tam.ts` | Bản mặc định của điểm cắm — lưu máy + mở Zalo | ❌ |

**Tầng lõi** = hàm thuần, không React, không DOM ⇒ bê sang stack nào cũng chạy (ADR-004).
`tests/ranh-gioi-hai-tang.test.ts` canh điều này.

## 4. Phụ thuộc

Chỉ đọc `config/`. Không import `modules/test` hay `modules/report`.

## 5. Trạng thái

Xong (27/08/2026, gồm GĐ9). Không còn việc dở. Chi tiết tiến độ: `PLAN.md` mục BÀN GIAO.

🔴 **GĐ9 thêm `tuoi`/`banKhoan` vào `BaiLamLuu`, và bắt đầu GHI `lop`** (trường này khai
từ GĐ0 mà chưa từng có nơi nào ghi). Mọi trường mới đều tuỳ chọn và **không nâng version
IndexedDB** — `moKho()` có `onblocked → giaiQuyet(null)`, nên một tab cũ đang mở là mất
im lặng cả tính năng lưu. Thêm trường mới thì PHẢI thêm vào `KHOA_CAM` của
`lien-he/kieu.ts`; `tests/lien-he-sach.test.ts` có hàng rào biên dịch bắt việc này.

## 6. Cạm bẫy đã trả giá

- **`saoLuuTatCa()` không có tham số lọc** — thêm một tham số `boDe?` là mở lại đúng cái
  bẫy đã cắn dự án trước: nút Sao lưu đọc danh sách đang hiển thị, file tải về thiếu mà
  trông vẫn đủ. Có test canh chữ ký hàm.
- **Nháp gắn theo cả biệt danh** — máy giáo viên đi qua nhiều gia đình; trả nháp của bé A
  cho bé B là vừa lộ chéo vừa sai người.
- **`soNgayGiua()` trả `null` khi chuỗi không phải ISO**, không trả 0 — `new Date()` đoán
  bừa theo lối Mỹ và không báo lỗi.
- **`IDBRequest<A>` không gán được cho `IDBRequest<A | null>`** (`onerror` mang `this`
  nghịch biến). Nhận `IDBRequest` không tham số kiểu.
