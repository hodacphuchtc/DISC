# OVERVIEW — Module core

## 1. Mục đích

Module NỀN TẢNG của DISC: những thứ mọi module khác đều cần và chỉ được tồn tại MỘT
nơi — kết nối/truy vấn Supabase, xác thực & phân quyền, danh mục dùng chung (người
làm bài, cấp học, trường/lớp), kiểu dữ liệu chung, event bus, tiện ích UI dùng lại.
Không chứa nghiệp vụ chấm điểm hay nội dung câu hỏi.

## 2. Phạm vi (In / Out)

- **In:** truy cập dữ liệu, auth, danh mục dùng chung, kiểu chung, event bus, UI kit.
- **Out:** ngân hàng câu hỏi và luồng làm bài → `modules/test`; thuật toán chấm DISC và
  sinh báo cáo → `modules/report`. Core KHÔNG import sâu vào hai module đó — chỉ được
  đọc `<mod>/module.config` (rule canh bằng `.semgrep/ranh-gioi-module.yml`).
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
