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


🔴 **Cập nhật 28/08/2026.** Thêm `laBanPhanTichHopLe()` — kiểm hình dạng một bản phân tích
ĐÃ LƯU trước khi vẽ lại. `PhanTichGiaDinh.noiDung` khai kiểu `unknown` có chủ đích (kho
không biết gì về hình dạng nội dung, và đó là điều đúng), nên ép kiểu bừa lúc mở lại thư
mục cũ là đường thẳng tới một TRANG TRẮNG: bản ghi từ phiên bản trước có thể thiếu trường,
và React đọc `undefined.latCat` không phải là một lời báo lỗi.
Xong GĐ9. **GĐ10 chặng 1 đang dở** — xem `PLAN.md` mục BÀN GIAO. Chi tiết tiến độ: `PLAN.md` mục BÀN GIAO.

**GĐ9 thêm hai đường ra khỏi module này, đừng nhầm chúng với nhau:**
- `layDienGiai(kieu, maBoDe)` — bốn khối mặc định, chữ ký GIỮ NGUYÊN từ GĐ4.
- `layDienGiaiDay({diem, xepHang, maBoDe, tuoi?, banKhoan?})` — bản sâu: đủ bốn trục,
  theo lứa tuổi, cặp pha có thứ tự, tầng lời khuyên. Nhận **record phẳng**, cố ý KHÔNG
  nhận `BaiLamLuu` (kiểu đó ở `core/luu-tru`, không thuộc tầng lõi).

**GĐ10 — BA BẢN, mỗi bản một người đọc.** `layDienGiaiDay` trả `banCon` / `banBoMe` /
`banTuMinh` thay cho `loiKhuyen`/`tuMinh` phẳng. Tách bằng CẤU TRÚC chứ không bằng kỷ luật:
giao diện không có đường nào đổ chữ của bố mẹ vào mục của con nếu chúng không chung một trường.

| Bộ đề | `banCon` | `banBoMe` | `banTuMinh` |
| --- | --- | --- | --- |
| MN, QS | — | ✅ | — |
| TH, THCS | ✅ | ✅ | — |
| PH | — | — | ✅ |

🔴 `thayChuThe(chuoi, maBoDe, banDoc)` — mặc định `banDoc = "con"` giữ nguyên hành vi cũ.
Cùng một bài TH: con đọc "em", bố mẹ đọc "con".

**GĐ10 `10.4` — ba bản đó đã RA TỚI MÀN HÌNH, gói trong `<section data-ban>`** (`chung` ·
`con` · `boMe` · `tuMinh`, dựng ở `app/khoang/lop-sau.tsx`). Hai hệ quả cần nhớ:

- Bộ **TH/THCS** nay hiện CẢ `banBoMe`, nhưng ĐÓNG SẴN sau một **dải chắn** — vì chính đứa
  trẻ đang cầm máy. Trước đó phần này bị chặn thẳng, nghĩa là phụ huynh của mọi học sinh
  tiểu học/THCS không đọc được chữ nào.
- Bản in **tách theo dải**: cờ `data-in-ban` trên `<html>` + luật trong `app/globals.css`.
  Đo trên Chromium thật (27/08/2026): tờ của em 2286 ký tự · tờ bố mẹ 3144 ký tự ·
  **0 câu rò rỉ chéo**. Dải bố mẹ ẩn trên màn mà vẫn giữ 1248 ký tự trong DOM ⇒ in được.

## 6. Cạm bẫy đã trả giá

- 🔴 **`!important` KHÔNG phân định được ai thắng khi CẢ HAI luật cùng `!important`** — độ
  ĐẶC HIỆU mới phân định (27/08/2026, `10.4`). Bản in tách theo dải dựa trên hai luật nằm
  cạnh nhau trong `@media print`: luật ép dải hiện (`[data-ban]`, 0-1-0) và luật loại trừ
  (`[data-in-ban="con"] [data-ban="boMe"]`, 0-2-0). Rút gọn bộ chọn thứ hai xuống một thuộc
  tính là mọi bản in lại dính chữ của cả hai người đọc — im lặng, không lỗi nào.
  `tests/ban-in.test.ts` đếm số bộ chọn thuộc tính của hai luật để canh đúng quan hệ đó.
- 🔴 **`window.print()` chặn luồng đồng bộ ⇒ KHÔNG đặt cờ in qua state React** (27/08/2026).
  Đặt state rồi gọi `print()` ngay thì React chưa kịp vẽ lại và hộp thoại in mở với DOM cũ:
  in nhầm bản, không lỗi nào. `NutIn` gắn `data-in-ban` thẳng lên `<html>` bằng DOM rồi gỡ ở
  `afterprint`.
- 🔴 **Ẩn ở ANCESTOR, đừng đi gỡ từng khối bên trong.** Con cháu của một khối `display:none`
  thì không dựng, kể cả khi chính chúng mang `display:block !important` như `[data-lop-sau]`.
  Nhờ vậy luật tách bản không cần biết bên trong mỗi dải có gì — thêm khối mới vào dải không
  làm hở bản in.

- 🔴 **Bảng đại từ một chiều đã cắt cả một nhóm người dùng khỏi sản phẩm.** `CHU_THE[maBoDe]`
  ngầm giả định "một bộ đề = một người đọc" ⇒ bộ TH/THCS bị chặn khỏi TOÀN BỘ `LOI_KHUYEN`,
  nghĩa là phụ huynh của mọi học sinh tiểu học/THCS không nhận được chữ nào, suốt từ GĐ9.
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

<!-- Chuyển từ CLAUDE.md ngày 27/08/2026: bài học theo MIỀN thì ở sổ miền, CLAUDE.md chỉ trỏ tới. -->
- **Bốn lỗi "sai người đọc" cùng một họ, không lỗi nào làm test đỏ** (27/08/2026, GĐ10):
  câu rào gọi em lớp 4 là "con" · học sinh THCS đọc được khối viết cho bố mẹ · bộ PH mời
  chính người vừa làm xong đi làm lại · con 8–10 tuổi bị mời sai bộ đề vì `vung-lech.tsx` gõ
  cứng `"THCS"` thay vì gọi `dinhTuyen`. Cả bốn chỉ lộ ra khi ngồi hỏi *ai đang cầm máy và
  người đó nhìn thấy chữ gì* — không có cửa kiểm tự động nào thay được câu hỏi đó.
- **`layDienGiai(kieu, maBoDe)` không nhận `diem`** (27/08/2026). Hồ sơ D=92 và D=58 ra báo
  cáo giống nhau **từng byte**. Không test nào bắt được vì không test nào từng hỏi *"hai hồ sơ
  khác nhau có ra hai bản khác nhau không"*. Đã có `tests/dien-giai-day.test.ts` canh.
- **Phép đo DISC ở đây quá thô để đỡ thang cao/vừa/thấp** (27/08/2026). Một nấc trả lời dịch
  điểm chuẩn hoá đi: **TH 10,0 · QS 6,25 · MN 5,0 · THCS/PH 4,17**. Đặt lằn ranh band ở 45/65
  nghĩa là cùng một đứa trẻ làm lại sau năm phút rơi sang band khác và đọc một bản khác nghĩa.
  Cách xử lý KHÔNG phải chỉnh ngưỡng cho chuẩn, mà là **chặn thiệt hại**: cường độ chỉ đổi
  một mệnh đề, mọi nội dung khác khoá theo THỨ HẠNG.
- **Nội dung không có trong DOM thì không in được** (27/08/2026, GĐ9). `{mo && <div/>}` làm
  bản PDF mất đúng phần sâu nhất. Phải render luôn rồi ẩn bằng CSS. Và **`<details>` cũng
  không dùng được**: trình duyệt ẩn thân qua `::details-content`, CSS in không đè chắc.
  Thêm nữa: tiêu đề nằm trong nút bấm mà nút thì `data-khong-in` ⇒ in ra mất tiêu đề, phải
  có bản `.chi-in` thế chỗ.
- **`break-inside: avoid-page` áp cho MỌI `section` là quả mìn hẹn giờ** (27/08/2026). Chạy
  tốt suốt GĐ4–GĐ8 vì màn kết quả còn ngắn. Thêm lớp bóc sâu vào là một `section` cao hơn
  một trang giấy mà lại cấm tách ⇒ in ra một trang gần trắng rồi mới tới nội dung. Đã thu
  luật về mức khối nhỏ (`.khoi-in`).
- **Tiếng Việt: "bạn" vừa là đại từ vừa là danh từ chỉ bạn bè** (27/08/2026). Hàng rào cấm
  gõ cứng đại từ báo nhầm hàng loạt ở "kết bạn nhanh", "phân vai cho các bạn". Phải gỡ nghĩa
  danh từ ra trước khi soi — hàng rào báo nhầm nhiều thì người sau sẽ tắt nó đi, và mất luôn
  phần canh thật.
