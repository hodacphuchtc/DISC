# OVERVIEW — Module `report`

> Cập nhật 27/08/2026.

## 1. Mục đích

Biến câu trả lời thành **kết quả đọc được**: chấm điểm, kiểm tính hợp lệ, xếp kiểu, ghép
văn bản diễn giải, tính vùng lệch con ↔ cha mẹ, và vẽ tấm ảnh chia sẻ.

## 2. Phạm vi (In / Out)

- **In:** thuật toán chấm §7 · năm hàng rào `HL-1..HL-5` · vùng lệch §8 · vẽ Canvas · in PDF.
- **Out:** nội dung văn bản (nằm ở `config/disc-dien-giai.ts`, `config/disc-doi-chieu.ts`) ·
  lưu trữ (`core/luu-tru`).

## 3. Cấu trúc bên trong

| File | Vai trò | Tầng lõi? |
| ---- | ------- | --------- |
| `cham.ts` | Đảo chiều → chuẩn hoá 0–100 → xếp kiểu đơn/pha/đều | ✅ |
| `kiem-hop-le.ts` | Năm hàng rào `HL-1..HL-5` | ✅ |
| `dien-giai.ts` | Ghép văn bản với kiểu, thay đại từ `{chuThe}` | ✅ |
| `doi-chieu.ts` | Vùng lệch con ↔ cha mẹ, bốn điều kiện ghép cặp | ✅ |
| `do-chu.ts` | Đo và ngắt chữ cho Canvas (nhận hàm đo, không nhận `ctx`) | ✅ |
| `hinh-nhan-vat.ts` | Nét vẽ bốn robot — NGUỒN DUY NHẤT cho cả màn hình lẫn ảnh PNG | ✅ |
| `thong-ke.ts` | Cronbach's alpha, tương quan item–tổng (sàng bộ câu bằng dữ liệu thật) | ✅ |
| `xuat-anh.ts` | Vẽ ảnh 1080×1350 bằng Canvas 2D | ❌ |

## 4. Phụ thuộc

Chỉ `@modules/core` và `@config`. **Không** import `@modules/test` — cần biết bộ đề thì
lấy kiểu từ `core/bo-de/kieu.ts` (QĐ5).

## 5. Trạng thái

Xong `CH.*`, `KQ.*`, `DC.*` / `2.*`, `4.*`, `5.*` trong `PLAN.md`.

## 6. Cạm bẫy đã trả giá

- 🔴 **Hỏi "phổ đều" TRƯỚC "pha".** Bốn điểm sát nhau thì `d1−d2` cũng nhỏ; hỏi ngược thứ
  tự sẽ ép một nhãn pha lên một phổ thực chất là đều.
- 🔴 **Canvas KHÔNG báo lỗi khi chữ tràn khung** — vẽ tiếp ra ngoài mép, ảnh vẫn xuất ra
  bình thường. Mọi chuỗi phải qua `do-chu.ts` trước.
- 🔴 **Vẽ trước khi font nạp xong** thì dấu tiếng Việt rơi về font hệ thống. Luôn
  `await document.fonts.ready`.
- **Chuẩn hoá NFC trước khi đo chữ**: `"Cẩn"` gõ kiểu tổ hợp là 2 mã ký tự, kiểu dựng sẵn
  là 1 — cùng một câu đo ra hai bề rộng khác nhau tuỳ nguồn gõ.
- **Nhân vật chỉ có MỘT bản vẽ** (`hinh-nhan-vat.ts`). Vẽ hai bản cho màn hình và cho ảnh
  thì hai bản chỉ lệch nhau vào đúng ngày ai đó sửa một bên.
- **Cam thương hiệu `#FF8F2D` làm màu CHỮ chỉ đạt 2,28:1.** Dùng `MAU.camDamChoChu`.
