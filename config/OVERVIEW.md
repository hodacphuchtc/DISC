# OVERVIEW — config/

## 1. Mục đích

Nơi DUY NHẤT chứa hằng số và ngưỡng nghiệp vụ của DISC: thang điểm, ngưỡng phân loại
nhóm D–I–S–C, bộ câu hỏi theo từng cấp học, quy tắc sinh báo cáo, từ điển thuật ngữ UI.
Code ĐỌC từ đây, không hardcode (rule 4 — `.claude/rules/module-boundaries.md`).

## 2. Quy ước

- Một chủ đề một file `kebab-case.(json|ts)`; tên khóa tiếng Anh, giá trị hiển thị
  tiếng Việt theo `.claude/rules/ngon-ngu-ui.md`.
- Đổi ngưỡng chấm điểm = đổi file ở đây + ghi 1 dòng lý do; ngưỡng ảnh hưởng kết quả
  trả cho phụ huynh thì phải kèm ADR — không sửa lặng lẽ.
- KHÔNG để secret/key trong `config/` (đã commit lên git) — secret đi qua `.env*`.

## 3. Trạng thái & bước tiếp theo

- **Trạng thái (26/08/2026):** vừa khởi tạo.
- **Tiếp theo:** (điền khi có nội dung đầu tiên.)

## 4. Quyết định quan trọng

| Ngày | Quyết định | Lý do |
| ---- | ---------- | ----- |
