# OVERVIEW — Module test

## 1. Mục đích

Ngân hàng câu hỏi DISC và luồng làm bài, phân theo ĐỐI TƯỢNG: phụ huynh (làm thay/quan
sát con), học sinh mầm non, tiểu học, THCS. Mỗi cấp học một bộ câu hỏi và cách hỏi
riêng — câu chữ, độ dài, hình ảnh khác nhau. Module này lo tới lúc nộp bài; chấm điểm
là việc của `modules/report`.

> ⚠️ **Tên module `test` dễ nhầm với thư mục `tests/` (test tự động) và với glob của
> test runner.** Vướng thì đổi tên bằng ADR (gợi ý: `khao-sat` / `bai-lam`) — đổi sớm
> rẻ hơn đổi muộn, và phải sửa kèm `.claude/scaffold.json` + `.semgrep/`.

## 2. Phạm vi (In / Out)

- **In:** bộ câu hỏi theo cấp học, màn hình nhập thông tin đầu vào, luồng làm bài,
  lưu bài làm, trạng thái hoàn thành.
- **Out:** chấm điểm và sinh báo cáo → `modules/report`; auth và danh mục người làm bài
  → `modules/core`. Nội dung câu hỏi và ngưỡng đọc từ `config/`, KHÔNG hardcode.
- *(khung khởi tạo — chốt lại ở `/B1_y_tuong` + `/B2_lo_trinh`.)*

## 3. Cấu trúc bên trong

(liệt kê thư mục con/file chính + 1 dòng vai trò mỗi cái. Cập nhật khi bắt đầu code.)

## 4. Phụ thuộc

Chỉ được phụ thuộc module nền tảng (`core`) + giao tiếp qua event/service — xem
`.claude/rules/module-boundaries.md`. Hằng số nghiệp vụ đọc từ `config/`.

## 5. Trạng thái & bước tiếp theo

- **Trạng thái (26/08/2026):** vừa khởi tạo khung, chưa code.
- **Tiếp theo:** (điền khi bắt đầu hạng mục đầu tiên của module trong PLAN.md.)

## 6. Quyết định quan trọng

| Ngày | Quyết định | Lý do |
| ---- | ---------- | ----- |
