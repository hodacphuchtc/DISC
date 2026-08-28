# ADR-009 — Thêm một thư viện PDF, và nạp lười là điều kiện kèm theo

- **Ngày:** 28/08/2026
- **Trạng thái:** Đã chốt
- **Bối cảnh:** hạng mục `16.6` của `PLAN_V2.md`
- **Lật một phần:** ràng buộc *"thư viện ngoài duy nhất: `jszip`"* (ADR-001, `tech-defaults.md`)

## Vấn đề

Bản phân tích cả nhà hiện chỉ đọc được **trên màn hình** hoặc qua `window.print()`. Cả hai
đều gắn với đúng cái máy đang mở. Nhưng thứ gia đình muốn giữ là *tờ giấy của mình* — gửi
cho bạn đời, mở lại sau ba tháng, in ở tiệm. Một tệp `.zip` chứa toàn JSON không làm được
việc đó: nó cứu được **dữ liệu**, không cứu được **thứ đọc được**.

Và `window.print()` không thay thế được, vì nó cần trình duyệt, cần đúng máy đó, cần người
dùng biết chọn "Save as PDF" trong hộp thoại in của hệ điều hành.

## Vì sao lật ràng buộc một-thư-viện

Ràng buộc đó không phải luật đạo đức — nó là một cách kiểm soát **rủi ro chuỗi cung ứng**
và **cỡ gói tải về**. Nên câu hỏi đúng không phải *"có được thêm không"* mà *"hai rủi ro
đó trả bằng gì"*:

| Rủi ro | Trả bằng |
| --- | --- |
| Chuỗi cung ứng | Cài `--ignore-scripts`, rồi quét tĩnh bằng skill `quet-ma-doc` **trước khi import một dòng nào**. Kết quả 28/08/2026: verdict 🟢 XANH — 0 kênh gửi ra ngoài, 0 `child_process`, 0 `process.env`, 0 hook cài đặt. Ứng viên "ĐỎ" duy nhất (ký tự vô hình) là trọn bộ ký tự khoảng trắng Unicode trong một polyfill `trim()` — báo nhầm, đã đọc tận dòng |
| Cỡ gói | **Nạp lười, và có cửa canh.** Xem dưới |

## Quyết định

1. Thêm **`jspdf`** (MIT) làm thư viện ngoài thứ hai.
2. Thêm **Be Vietnam Pro Regular** (SIL OFL 1.1) ở `public/fonts/`, kèm nguyên văn giấy
   phép ở `public/fonts/OFL.txt`. Đã kiểm: TrueType hợp lệ, phủ đủ 56/56 ký tự tiếng Việt
   thử, 133 KB.
3. 🔴 **Nạp lười là ĐIỀU KIỆN KÈM THEO, không phải một tối ưu tuỳ chọn.** `jspdf` chỉ được
   vào bằng `await import("jspdf")`, ở đúng một file: `modules/report/xuat-pdf.ts`.
4. Font **không nhúng base64 vào JS**. Đặt ở `public/fonts/` để trình duyệt cache riêng và
   chỉ tải một lần trong đời máy. Đổi lại: xuất PDF cần một lượt `fetch` cùng nguồn.

## Vì sao điều kiện (3) phải có cửa canh

Một `import` tĩnh lỡ tay kéo `jspdf` vào gói chính, và **không cửa nào sẵn có bắt được**:
typecheck xanh, lint xanh, test xanh, build xanh. Chỉ điện thoại 3G của phụ huynh là chịu,
và không ai biết cho tới lúc có người phàn nàn.

Nên có **hai** cửa, canh hai chuyện khác nhau:

| Cửa | Canh gì | Chạy khi nào |
| --- | --- | --- |
| `tests/co-goi-chinh.test.ts` | **Cách viết**: không file nào import tĩnh `jspdf` hay `xuat-pdf`; đúng một file được nhắc tên nó | Mỗi lượt `npm test` — kể cả trên CI, nơi test chạy TRƯỚC build |
| `scripts/kiem-co-goi.mjs` | **Kết quả thật** sau khi bundler gộp xong: cỡ gói chính và dấu vết `jsPDF` trong đó | Nối vào `npm run build` |

Cửa byte chỉ đo những tệp `.js` mà `out/index.html` tham chiếu trực tiếp — cộng cả
`out/_next/static` là đếm luôn chunk nạp lười, tức đo sai theo hướng bi quan, rồi phải nới
trần, rồi cửa hết tác dụng.

## Số đo ngày chốt (28/08/2026)

| | Trước 16.6 | Sau 16.6 |
| --- | --- | --- |
| **Gói chính** (tải ngay) | 282 KB gzip | **287 KB gzip** (trần đặt 300) |
| Chunk PDF (chỉ tải khi bấm *Sao lưu*) | — | 131 KB gzip |
| Font | — | 133 KB, cache riêng, tải một lần |

Người không bao giờ bấm *Sao lưu* trả thêm **5 KB**.

## Hệ quả

- `tech-defaults.md` phải sửa dòng *"Thư viện ngoài: chỉ `jszip`"* thành `jszip` + `jspdf`
  (nạp lười).
- Thêm thư viện thứ ba cần một ADR mới. Ba câu hỏi bắt buộc trả lời: quét sạch chưa · nạp
  lười được không · cửa nào canh.
- PDF là phần **đọc-cho-vui**; JSON mới là phần cứu dữ liệu. Sinh PDF hỏng (font tải lỗi,
  thư viện nạp lỗi) **không được kéo đổ nút Sao lưu** — vẫn phải ra một tệp `.zip` đầy đủ.
