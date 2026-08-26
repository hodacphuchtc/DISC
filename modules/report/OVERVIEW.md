# OVERVIEW — Module report

## 1. Mục đích

Biến bài làm thành KẾT QUẢ ĐỌC ĐƯỢC: chấm điểm 4 nhóm D–I–S–C, phân loại theo ngưỡng,
và sinh bản báo cáo diễn giải đúng đối tượng — báo cáo cho phụ huynh đọc khác báo cáo
cho học sinh THCS đọc. Đây là thứ người dùng thực sự nhận được, nên độ chính xác của
nó là tiêu chí nghiệm thu chính của dự án.

## 2. Phạm vi (In / Out)

- **In:** thuật toán chấm DISC, ngưỡng phân loại, nội dung diễn giải theo cấp học,
  kết xuất báo cáo (màn hình / PDF / chia sẻ link).
- **Out:** thu thập câu trả lời → `modules/test`; lưu trữ và quyền xem → `modules/core`.
  Thang điểm và ngưỡng đọc từ `config/`; đổi ngưỡng phải kèm ADR vì nó đổi KẾT QUẢ trả
  cho phụ huynh.
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
