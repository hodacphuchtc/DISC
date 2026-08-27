# OVERVIEW — Module `report`

> Cập nhật 27/08/2026.

## 1. Mục đích

Biến câu trả lời thành **kết quả đọc được**: chấm điểm, kiểm tính hợp lệ, xếp kiểu, ghép
văn bản diễn giải, tính vùng lệch con ↔ cha mẹ, và vẽ tấm ảnh chia sẻ.

## 2. Phạm vi (In / Out)

- **In:** thuật toán chấm §7 · năm hàng rào `HL-1..HL-5` · vùng lệch §8 · vẽ Canvas · in PDF.
- **Out:** nội dung văn bản (nằm ở `config/disc-dien-giai.ts`, `config/disc-bieu-hien.ts`,
  `config/disc-loi-khuyen.ts`, `config/disc-doi-chieu.ts`) ·
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
| `muc-do.ts` | Vị trí một trục trong hồ sơ + cường độ (GĐ9) | ✅ |
| `doi-chieu-phong-cach.ts` | Lệch phong cách BỐ MẸ ↔ CON — **khác** `doi-chieu.ts` (GĐ9) | ✅ |
| `xuat-anh.ts` | Vẽ ảnh 1080×1350 bằng Canvas 2D | ❌ |

## 4. Phụ thuộc

Chỉ `@modules/core` và `@config`. **Không** import `@modules/test` — cần biết bộ đề thì
lấy kiểu từ `core/bo-de/kieu.ts` (QĐ5).

## 5. Trạng thái

Xong (27/08/2026, gồm GĐ9). Không còn việc dở. Chi tiết tiến độ: `PLAN.md` mục BÀN GIAO.

**GĐ9 thêm hai đường ra khỏi module này, đừng nhầm chúng với nhau:**
- `layDienGiai(kieu, maBoDe)` — bốn khối mặc định, chữ ký GIỮ NGUYÊN từ GĐ4.
- `layDienGiaiDay({diem, xepHang, maBoDe, tuoi?, banKhoan?})` — bản sâu: đủ bốn trục,
  theo lứa tuổi, cặp pha có thứ tự, tầng lời khuyên. Nhận **record phẳng**, cố ý KHÔNG
  nhận `BaiLamLuu` (kiểu đó ở `core/luu-tru`, không thuộc tầng lõi).

## 6. Cạm bẫy đã trả giá

- 🔴 **Diễn giải theo TRỤC, không theo KIỂU.** Bản GĐ4 làm theo kiểu nên chỉ trục trội có
  chữ; ba trục còn lại im lặng suốt tới GĐ9 dù biểu đồ vẫn hiện đủ bốn cột kèm số. Test cũ
  không bắt được vì nó kiểm "mỗi kiểu" trong khi đặc tả đòi "mỗi trục".
- 🔴 **Hàm diễn giải phải nhận `diem`.** Bản cũ chỉ nhận `kieu` ⇒ hồ sơ D=92 và D=58 ra
  báo cáo giống nhau từng byte.
- 🔴 **KHÔNG đụng `maKieuTu()` hay `xepKieu()` để lấy thứ tự pha.** Chúng cố ý sắp về
  D-I-S-C và `tests/cham-diem.test.ts` khẳng định điều đó. Thứ tự trội/phụ lấy từ
  `xepHang` qua `maPhaCoThuTu()`.
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
