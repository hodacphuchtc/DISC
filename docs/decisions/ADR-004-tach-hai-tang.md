# ADR-004 — Tách mã nguồn thành hai tầng

**Ngày:** 27/08/2026 · **Trạng thái:** ĐÃ CHỐT

## Bối cảnh

Sản phẩm này **không chạy độc lập**. Nó được viết để đội dev SATA ROBO bê vào ứng dụng đã
có sẵn của họ. Kịch bản nhiều khả năng xảy ra nhất: họ nhận phần lõi rồi **viết lại giao
diện theo quy ước của mình**.

## Quyết định

Chia mã nguồn làm hai tầng, và **canh ranh giới bằng test**.

**TẦNG LÕI** — hàm thuần + dữ liệu. Không React, không `window`, không `document`, không
`localStorage`, không `indexedDB`, không `navigator`.

- `config/disc-*.ts`
- `modules/core/bo-de/`, `modules/core/tien-ich/`, `modules/core/lien-he/kieu.ts`
- `modules/report/cham.ts` · `kiem-hop-le.ts` · `dien-giai.ts` · `doi-chieu.ts` ·
  `do-chu.ts` · `hinh-nhan-vat.ts` · `thong-ke.ts`

**TẦNG GIAO DIỆN THAM CHIẾU** — mọi thứ còn lại. Vứt được.

## Lý do

Kể cả khi đội dev từ chối toàn bộ giao diện, tầng lõi vẫn dùng lại **100%**: lõi chấm
điểm, 104 câu hỏi, ngưỡng, và toàn bộ văn bản báo cáo. Đổi kết cục *mất trắng 18 ngày công*
thành *mất 6 ngày giao diện*.

Quyết ngay từ đầu tốn **0 ngày**. Để đến cuối mới tách thì tốn **2 ngày** — vì lúc đó
`ctx`, `localStorage` và React đã ngấm vào khắp nơi.

## Hệ quả

- `do-chu.ts` nhận **một hàm đo bề rộng** thay vì nhận `CanvasRenderingContext2D` — khác
  chữ ký mà `DISC_BA.md` §7.5 gợi ý, nhưng cùng mục đích và test được không cần trình duyệt.
- Kiểu `BoDe`, `KetQua`, `Kieu` **nâng lên `modules/core/bo-de/kieu.ts`**, vì
  `.semgrep/ranh-gioi-module.yml` cấm `report` import `test`.
- Nét vẽ nhân vật nằm ở `hinh-nhan-vat.ts` dưới dạng **dữ liệu**, để cả React lẫn Canvas
  cùng dùng một nguồn — hai bản vẽ riêng chỉ lệch nhau vào đúng ngày ai đó sửa một bên.
- `tests/ranh-gioi-hai-tang.test.ts` quét mọi file tầng lõi. Đã thử phá hai lần, cắn đúng.
