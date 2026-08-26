# DISC

## GUARDRAILS (tuân thủ tuyệt đối)

1. KHÔNG đọc/ghi/in `.env*`, `secrets/**`, token, key, password.
2. Dữ liệu cá nhân/nhạy cảm của người dùng cuối: không đưa vào prompt/log/seed/output.
   🔴 Với DISC, người làm bài gồm **trẻ em mầm non/tiểu học/THCS** — họ tên, trường lớp,
   ngày sinh, câu trả lời và kết quả DISC đều là dữ liệu cá nhân của trẻ (Nghị định
   13/2023). Cần ví dụ để test thì BỊA dữ liệu, không lấy bài làm thật.
3. Không chạy production/migration/deploy khi chưa duyệt.
4. Tuân thủ `.claude/rules/module-boundaries.md` — vi phạm ranh giới module là lỗi
   nghiêm trọng, dừng lại và hỏi.
5. Ngôn ngữ giao diện/tài liệu: Tiếng Việt (chi tiết: `.claude/rules/ngon-ngu-ui.md`).

## DỰ ÁN

Ứng dụng trắc nghiệm DISC dành cho phụ huynh và học sinh mầm non, tiểu học, THCS: người làm bài nhập thông tin đầu vào tương ứng với từng đối tượng, hệ thống chấm và trả về một bản báo cáo kết quả chính xác, đọc được ngay.
Nguồn yêu cầu: `docs/brd/`. Lộ trình thi công: `PLAN.md` gốc dự án (checkbox, khuôn 4 dòng).
Repo: https://github.com/hodacphuchtc/DISC (chưa push — `/B5_luu_code` mới đẩy lên).
Kiến trúc module: `core` (nền tảng) · `test` (bộ câu hỏi + luồng làm bài) · `report`
(chấm điểm + sinh báo cáo) — ranh giới do `.semgrep/ranh-gioi-module.yml` canh.
Quyết định kiến trúc: `docs/decisions/ADR-*`. Stack: Next.js (App Router) + TypeScript + Tailwind · Supabase (DB/Auth) · Vercel (deploy).

## QUYỀN TỰ CHỦ (đã được cấp)

- Mọi thao tác TRONG thư mục dự án (chạy lệnh, sửa file, test/build): tự làm, KHÔNG hỏi lại.
- NGOẠI LỆ = DỪNG BẮT BUỘC (mọi mode): commit/push · deploy · migration production ·
  ghi/xóa DỮ LIỆU THẬT · tác động ra ngoài thư mục dự án · việc ngoài plan đã duyệt —
  và phải nói rõ làm gì, vì sao cần duyệt. Chi tiết: `.claude/rules/workflow.md`.

## XỬ LÝ MÂU THUẪN CHỈ DẪN

- Một skill/rule nói khác plan hiện hành hoặc CLAUDE.md → DỪNG, trình bày cả hai phía,
  hỏi tôi. Không tự chọn, không tự hoà giải, không "tổng hợp cả hai".

## QUY TẮC LÀM VIỆC

- Trước khi sửa code trong module nào: ĐỌC `OVERVIEW.md` của module đó.
- Mode do máy tự phân tích rồi báo 1 dòng `Mode: <plan|tự chạy|hỏi> — vì <lý do>`;
  ma trận R-cao/C-cao ở `.claude/rules/workflow.md`.
- Hằng số/ngưỡng nghiệp vụ: đọc từ `config/`, không hardcode.
- Sau build: chạy test/build thật, không xác nhận suông.
- Thi công theo PLAN.md kiểu GÓI: xong MỘT hạng mục → tick checkbox (CHỈ khi đã kiểm
  chứng) → báo cáo 3 dòng (đã làm / kiểm chứng / tiếp theo) → đi tiếp, KHÔNG dừng chờ;
  báo cáo tổng hợp cuối gói; chỉ dừng ở điểm DỪNG BẮT BUỘC.
- Quy trình 6 bước theo handle: `/B1_y_tuong` → `/B2_lo_trinh` → `/B3_thi_cong` →
  `/B4_nghiem_thu` → `/B5_luu_code` → `/B6_trien_khai` + `/B6_xuat_ban`.
  Phát triển & test trên LOCAL; chỉ `/B6_xuat_ban` mới đưa lên môi trường thật (cổng
  2 lớp qua Preview).
- Đầu phiên dùng `/mo_session`, cuối phiên dùng `/dong_session`.
- Chi tiết: `.claude/rules/` (workflow, security, module-boundaries, tech-defaults,
  ngon-ngu-ui).

## TRẠNG THÁI (cập nhật 26/08/2026)

### ĐÃ XONG

- Khởi tạo bộ khung dự án (skill `khoi-tao-du-an`): CLAUDE.md, PLAN.md, `.claude/`,
  docs/, config/, `scripts/check-structure.mjs` — `node scripts/check-structure.mjs` xanh.

### ĐANG DỞ

- Chưa có — dự án vừa khởi tạo, chưa bắt đầu hạng mục nào.

### BƯỚC TIẾP THEO (theo thứ tự)

1. Viết BRD vào `docs/brd/` (bài toán, người dùng, phạm vi, yêu cầu).
2. Lập PLAN.md chi tiết: chia giai đoạn, mỗi hạng mục đủ 4 dòng (a)(b)(c)(d).
3. Chốt stack vào `.claude/rules/tech-defaults.md` + ADR-001 nếu là quyết định lớn.

### CHỜ NGOÀI (thiếu key/env/dịch vụ — ghi vào đây rồi làm tiếp, đừng dừng)

- **Quyền ghi vào repo https://github.com/hodacphuchtc/DISC** — để `/B5_luu_code` push
  được (kiểm tra bằng `gh auth status`; repo đã khai remote `origin`, chưa push lần nào).
- **Project Supabase + key** (URL, anon, service_role, DATABASE_URL) — để dựng DB bài
  làm và auth. Lấy ở `/B6_trien_khai`, khai tên biến vào `docs/architecture/env-vars.md`.
- **Tài khoản Vercel nối repo** — để có Preview URL làm cổng duyệt trước production.

## QUYẾT ĐỊNH QUAN TRỌNG

| Ngày | Quyết định | Lý do |
| ---- | ---------- | ----- |
| 26/08/2026 | Dùng bộ khung chuẩn từ skill `khoi-tao-du-an` | Tái dùng hệ điều hành đã kiểm chứng: não 4 tầng, nghiệm thu bằng DEMO, decision log, sổ sẹo |

## CẢNH BÁO / CẠM BẪY (đã trả giá, đừng lặp lại)

- (chưa có — mỗi lần trả giá, ghi 1 dòng: **bài học in đậm** + vì sao, để session sau
  không lặp lại)
