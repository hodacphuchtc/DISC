# DISC

Ứng dụng trắc nghiệm DISC dành cho phụ huynh và học sinh mầm non, tiểu học, THCS: người làm bài nhập thông tin đầu vào tương ứng với từng đối tượng, hệ thống chấm và trả về một bản báo cáo kết quả chính xác, đọc được ngay.

## Bắt đầu đọc từ đâu

| File | Vai trò |
| ---- | ------- |
| `CLAUDE.md` | Hiến pháp dự án: guardrails, quy tắc làm việc, trạng thái hiện tại, decision log, sổ cạm bẫy |
| `PLAN.md` | Lộ trình thi công dạng checklist — nguồn lộ trình DUY NHẤT |
| `docs/brd/` | Tài liệu yêu cầu nghiệp vụ |
| `docs/decisions/` | Các quyết định kiến trúc (ADR) |
| `*/OVERVIEW.md` | Não của từng thư mục/module: mục đích, phạm vi, trạng thái, quyết định |

## Chạy thử trên máy mình

```bash
npm run dev        # bản đang phát triển — http://localhost:3000
npm run xem-thu    # build rồi chạy BẢN PHÁT HÀNH — http://localhost:3100
```

Hai lệnh này chạy được **song song** (khác cổng), và nên dùng cả hai:

- `npm run dev` nạp lại ngay khi sửa code, nhưng nó **không phải thứ sẽ phát hành** — không
  có service worker thật, không có danh sách nạp sẵn cho lúc mất mạng.
- `npm run xem-thu` phục vụ đúng thư mục `out/` sẽ đem đi đăng. Đây là bản phải soi trước
  khi phát hành. Chạy lại `npm start` nếu đã có sẵn `out/`; đổi cổng bằng `npm start -- 4000`.

> ⚠️ `next start` **không** dùng được ở dự án này — `output: "export"` không có máy chủ Next
> để chạy. Script `start` đã trỏ sang máy chủ tĩnh tự viết (`scripts/xem-ban-phat-hanh.mjs`),
> và nó ghim đúng kiểu MIME: trả HTML cho một request `.js` thì trang vẫn lên nhưng không
> bấm được gì, mà không có lỗi nào hiện ra.

**Nạp 8 bài mẫu để có thứ mà xem:** mở trang → DevTools → tab Console → dán trọn nội dung
`tests/DATA_TEST/nap-vao-trinh-duyet.js` → Enter → mở màn *Bài đã làm*.
Xoá đi bằng `tests/DATA_TEST/xoa-du-lieu-mau.js` (chỉ xoá bài mẫu, không đụng bài thật).

## Đóng & mở session (làm đúng để không mất context, tiết kiệm token)

- **Mở mỗi phiên — LỆNH ĐẦU TIÊN: `/mo_session`.** Claude chỉ đọc CLAUDE.md → PLAN.md →
  OVERVIEW.md module (không quét cả codebase) để lấy lại context của phiên trước với ít
  token nhất, tóm tắt trạng thái và gợi ý handle của giai đoạn đang dở. Duyệt rồi làm tiếp.
- **Trước khi đóng phiên: `/dong_session`.** Claude báo cáo tiến độ lên PLAN.md, cập nhật
  TRẠNG THÁI/QUYẾT ĐỊNH/CẢNH BÁO trong CLAUDE.md + OVERVIEW.md module, rồi tắt tài nguyên
  (Supabase local, dev server). Sau đó chạy `/B5_luu_code` để commit + push.
  → Nhờ vậy phiên sau `/mo_session` khôi phục lại đúng chỗ đang dở.

## Nhịp làm việc — quy trình 6 bước (6 số lệnh B1..B6)

| Handle | Khi nào dùng |
| ------ | ------------ |
| `/B1_y_tuong` | Đầu dự án/tính năng: brainstorm 3 hướng + phản biện + chốt MVP/stack (Plan Mode, model cao nhất); `tham-dinh` để chạy riêng phần thẩm định |
| `/B2_lo_trinh` | Viết PLAN.md chi tiết, chờ bạn "DUYỆT" (Plan Mode, model cao nhất) |
| `/B3_thi_cong` | Làm hằng ngày: thi công trên LOCAL theo GÓI, test xanh mới đi tiếp — không dừng chờ từng hạng mục |
| `/B4_nghiem_thu` | Trước khi tin "đã xong": bắt chứng minh bằng bằng chứng; `bao-mat` để soi bảo mật |
| `/B5_luu_code` | Cuối mỗi ngày: commit + push (gitleaks tự chặn lộ key); `quay-dau` để lùi bản |
| `/B6_trien_khai` | Bước 6a — cấu hình GitHub/Vercel/Supabase/R2: làm 1 lần, bổ sung dần |
| `/B6_xuat_ban` | Bước 6b — đưa lên sản phẩm thật: Preview → bạn duyệt → production (cổng 2 lớp) |
| `/reset_db` | Đưa database local về trạng thái sạch có dữ liệu test |

Bước 6 "Ra mắt" có 2 lệnh: `/B6_trien_khai` (cấu hình 1 lần) và `/B6_xuat_ban` (mỗi lần
lên sản phẩm). Hai bước đầu tự chạy ở **model cao nhất** và tự vào **Plan Mode**; mỗi
handle tự phân tích yêu cầu và báo `Mode: <plan|tự chạy|hỏi> — vì <lý do>` trước khi làm.
Muốn thi công chạy tự động không hỏi từng edit: bấm **"Yes, and use auto mode"** khi
duyệt plan ở `/B2_lo_trinh`, hoặc bật bền cho dự án bằng skill `cam_may`.

- Kiểm tra cấu trúc bất kỳ lúc nào: `node scripts/check-structure.mjs`.

Khởi tạo 26/08/2026 bằng skill `khoi-tao-du-an`.
