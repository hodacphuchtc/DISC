# Stack & convention mặc định

## Stack (chốt 27/08/2026 — ADR-001)

| Lớp | Chọn | Ghi chú |
| --- | ---- | ------- |
| Ngôn ngữ | TypeScript | `strict: true` |
| Khung web | Next.js App Router, `output: 'export'` | Không SSR, không API route, không middleware |
| Giao diện | Tailwind CSS v4 | Màu sinh ra ở dạng `oklch()` — nhớ điều này khi tự đo tương phản |
| Kiểm thử | Vitest + Testing Library + jsdom | `fake-indexeddb` cho test lưu trữ |
| Lưu dữ liệu | **Trình duyệt người dùng** — IndexedDB + localStorage | Không backend, không CSDL |
| Thư viện ngoài | **`jszip`** + **`jspdf`** (ADR-009) | `jszip` cho nút sao lưu. `jspdf` cho bản PDF của từng người — 🔴 **chỉ được vào bằng `await import()`**, hai cửa canh: `tests/co-goi-chinh.test.ts` và `scripts/kiem-co-goi.mjs`. Không thêm gì khác nếu chưa có ADR |
| Nơi chạy | Trang tĩnh (`out/`) | Cloudflare Pages cho dùng thương mại ở gói miễn phí; Vercel Hobby thì KHÔNG |

🔴 **Không có Supabase, không có auth, không có API.** Mọi tài liệu còn nhắc chúng là lỗi
thời — xem `docs/decisions/ADR-001-khong-backend.md`.

## Kiến trúc hai tầng (ADR-004)

**Tầng lõi** = hàm thuần + dữ liệu, không React, không DOM ⇒ bê sang stack nào cũng chạy.
**Tầng giao diện tham chiếu** = phần còn lại, đội dev viết lại được.
`tests/ranh-gioi-hai-tang.test.ts` canh ranh giới này.

## Convention đặt tên

- Thư mục/file: `kebab-case`, **đặt tên tiếng Việt không dấu** (`disc-cau-hoi.ts`,
  `truoc-khi-bat-dau.tsx`).
- Biến/hàm: **tiếng Việt không dấu** (`napBoDe`, `chuanHoaBietDanh`) — đọc cùng ngôn ngữ
  với nghiệp vụ thì bớt một lần dịch trong đầu.
- Chữ hiển thị: gom hết vào `config/disc-tu-dien.ts`, **không gõ thẳng vào component**.
- Hằng số nghiệp vụ: `config/disc-nguong.ts`, không hardcode.

## Nguyên tắc code

- Validate input tại biên; escape output khi render.
- Không file > 500 dòng — tách nhỏ.
- Sau thay đổi có ý nghĩa: chạy `npm run kiem` thật (typecheck + lint + test + cấu trúc
  + semgrep).

## Cạm bẫy công cụ đã trả giá

- **Next 16 tự ghi một khối vào `CLAUDE.md` sau mỗi `next dev`** — chặn bằng
  `agentRules: false`.
- **`eslint-config-next` v16 đã là flat config** — bọc thêm `FlatCompat` làm ESLint nổ
  *"Converting circular structure to JSON"*.
- **`eslint-disable-next-line` chỉ tác dụng lên ĐÚNG dòng kế tiếp** — chỉ thị viết thành
  hai dòng thì nó tắt dòng bình luận thứ hai, không tắt câu lệnh.
- **`import.meta.url` không phải URL `file://` dưới jsdom** — trong test dùng `process.cwd()`.
- **Node ESM cần đuôi `.ts` khi import giá trị**; import KIỂU thì bị xoá lúc chạy nên không sao.
