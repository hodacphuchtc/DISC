# OVERVIEW — docs/

## 1. Mục đích

Kho tài liệu của DISC: yêu cầu nghiệp vụ (`brd/`), kiến trúc và biến môi trường
(`architecture/`), quyết định kiến trúc (`decisions/`), quy trình xử lý sự cố (`sop/`).
Đây là nơi trả lời câu hỏi "vì sao" — code trả lời câu hỏi "như thế nào".

## 2. Quy ước

- `brd/` — mỗi tài liệu yêu cầu một file `kebab-case.md`; nêu rõ bài toán, đối tượng
  làm bài (phụ huynh / mầm non / tiểu học / THCS), phạm vi in–out, yêu cầu chính.
- `architecture/env-vars.md` — bảng biến môi trường; CHỈ tên biến + nơi lấy, KHÔNG giá trị.
- `decisions/` — `ADR-00N-<slug>.md`, số tăng liên tục; chốt ADR thật thì tăng
  `adrCount` trong `.claude/scaffold.json`.
- `sop/` — playbook xử lý sự cố, viết dạng các bước bấm được ngay lúc hoảng.
- 🔴 **CẤM để dữ liệu thật của học sinh/phụ huynh trong `docs/`** — dữ liệu cá nhân
  của trẻ em là loại nhạy cảm nhất của dự án này. Cần ví dụ thì dùng dữ liệu bịa.

## 3. Trạng thái & bước tiếp theo

- **Trạng thái (26/08/2026):** vừa khởi tạo.
- **Tiếp theo:** (điền khi có nội dung đầu tiên.)

## 4. Quyết định quan trọng

| Ngày | Quyết định | Lý do |
| ---- | ---------- | ----- |
