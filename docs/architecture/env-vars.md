# Biến môi trường — DISC

> 🔴 **DỰ ÁN NÀY KHÔNG CÓ BIẾN MÔI TRƯỜNG NÀO.** Cập nhật 29/08/2026 (`25.2`).

## Không có, và đó là chủ ý

ADR-001 chốt **không backend, không CSDL, không API**. Sản phẩm là một trang tĩnh
(`output: 'export'`) chạy 100% trong trình duyệt người dùng; dữ liệu nằm ở IndexedDB +
localStorage của chính máy đó. Không có gì để cấu hình lúc chạy, nên không có `.env`, không
có `.env.local`, không có `.env.example`.

**Hệ quả cần biết:**

- Không cần điền gì trước khi chạy. `npm install && npm run xem-thu` là đủ.
- `.gitignore` vẫn chặn `.env*` — giữ nguyên. Nó là lớp phòng vệ cho ngày ai đó thêm một
  biến, không phải mô tả hiện trạng.
- Guardrail *"Claude KHÔNG đọc/ghi `.env*`"* vẫn có hiệu lực nguyên vẹn.

## Nếu sau này CÓ biến

Ngày đó gần như chắc chắn là ngày app chủ nhúng khoang DISC vào và cần một điểm cắm dữ
liệu (xem `16.4` — tầng lưu trữ đã tách sẵn). Khi đó:

1. Ghi **TÊN** biến vào bảng dưới, kèm mô tả và nơi lấy. **Không bao giờ ghi GIÁ TRỊ thật
   vào file này** — repo là PUBLIC.
2. Thêm `.env.example` chỉ chứa tên biến và giá trị giả.
3. Đọc lại `.claude/rules/security.md` trước khi đụng tới bất cứ thứ gì nhạy cảm.

| Biến | Mô tả | Bắt buộc | Nhạy cảm |
| ---- | ----- | -------- | -------- |
| *(chưa có biến nào)* | | | |

## Xem thêm

- `docs/decisions/ADR-001-khong-backend.md` — vì sao không có backend
- `.claude/rules/security.md` — luật xử lý secret
- `docs/sop/SU-CO-LO-KEY.md` — làm gì khi nghi một key đã lộ
