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
Quyết định kiến trúc: `docs/decisions/ADR-*`. Stack: Next.js (App Router, `output:'export'`)
+ TypeScript + Tailwind + Vitest. **KHÔNG backend, KHÔNG cơ sở dữ liệu, KHÔNG Supabase**
(ADR-001) — chạy 100% trong trình duyệt. Thư viện ngoài duy nhất: `jszip`.

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

## TRẠNG THÁI (cập nhật 27/08/2026)

### ĐÃ XONG

Ứng dụng chạy được đầu-cuối trên local. **33/33 hạng mục PLAN.md · 413 test xanh ·
`npm run kiem` và `npm run build` đều xanh · 12/12 DEMO đạt trên bản production.**

- **GĐ0–GĐ1** — khung Next 16 + Tailwind 4 + Vitest 4, thanh bên, hàng rào hai tầng,
  spike Canvas vẽ chữ tiếng Việt vừa khung.
- **GĐ2** — 104 câu hỏi (bóc từ `docs/BA/DISC_BA.md`), thứ tự trộn chốt cứng, lõi chấm
  điểm + năm hàng rào `HL-1..HL-5`, checksum khoá nội dung, script phân tích item.
- **GĐ3** — luồng làm bài 5 bộ đề, hai kiểu trình bày, tự lưu nháp.
- **GĐ4** — màn kết quả đầy đủ, 4 nhân vật SVG, ảnh PNG 1080×1350, in PDF.
- **GĐ5** — IndexedDB, màn *Bài đã làm*, sao lưu `.zip`, **vùng lệch con ↔ cha mẹ**,
  chuyền tay chủ động.
- **GĐ6** — ô thu liên hệ + điểm cắm, bốn mốc phễu.
- **GĐ7** — chạy được khi mất mạng, 0 lỗi tương phản, 0 vùng bấm < 44px, làm trọn bài
  chỉ bằng bàn phím.
- **GĐ8** — `docs/ban-giao/HUONG-DAN-CAM-VAO-APP.md`, 3 OVERVIEW, 4 ADR, manifest thật.

### ĐANG DỞ

Không còn hạng mục nào trong PLAN.md. **Toàn bộ code chưa commit** — 85 mục thay đổi đang
nằm trong cây làm việc, chờ duyệt ở `/B5_luu_code` (commit/push là DỪNG BẮT BUỘC).

### BƯỚC TIẾP THEO (theo thứ tự)

1. **Bấm thử trên điện thoại thật** — phần duy nhất của `7.2` máy không làm được:
   `npm run dev`, mở bằng điện thoại trong cùng mạng WiFi, làm trọn một bài.
2. `/B5_luu_code` để commit + push (cần duyệt).
3. **Gọi đội dev 30 phút** — React bản mấy · có Tailwind không · lead đi vào đâu ·
   nhận dạng nào. Bốn câu này quyết định phần giao diện có dùng lại được không.
4. Ba việc ở mục CHỜ NGOÀI, bắt đầu bằng việc thu 30–50 phản hồi thật.

### CHỜ NGOÀI (thiếu key/env/dịch vụ — ghi vào đây rồi làm tiếp, đừng dừng)

Bốn việc dưới đây **không tốn ngày dev nào**, nhưng cả bốn đều có thể đổi hình dạng bài
toán. Ba việc đầu nên làm ngay tuần này.

- 🔴 **Người có chuyên môn tâm lý/giáo dục KÝ DUYỆT 104 câu hỏi + văn bản báo cáo.**
  Chạy nội bộ thì không sao. Ngày bấm nút chạy quảng cáo là ngày nói với người lạ về con
  của họ — trước ngày đó phải có một người chịu trách nhiệm.
  *Chặn: ngày ra người dùng thật.*
- 🔴 **Thu 30–50 phản hồi thật** (Google Form cũng được), rồi chạy
  `node scripts/phan-tich-item.mjs`. Đây là thứ duy nhất biến bộ 104 câu từ *"do BA soạn"*
  thành *"đã sàng trên người Việt"*. *Chặn: ngày bật quảng cáo.*
- ⚠️ **Nộp 3 mẫu quảng cáo cho Facebook duyệt.** Facebook hạn chế quảng cáo ngụ ý biết đặc
  điểm tâm lý của người xem hoặc người thân. Cần kiểm chứng — chính sách có thể đã đổi.
  *Nếu trượt thì kênh phân phối số 1 chết.*
- **Số Zalo/hotline thật** để điền vào `LIEN_HE_SATA` trong `config/disc-tu-dien.ts`
  (hiện là số giữ chỗ `0900 000 000`).
- **Quyền ghi vào repo https://github.com/hodacphuchtc/DISC** — để `/B5_luu_code` push
  được (kiểm bằng `gh auth status`; repo đã khai remote `origin`, chưa push lần nào).

> **Không cần Supabase và không cần Vercel nữa** — xem `docs/decisions/ADR-001-khong-backend.md`.

## QUYẾT ĐỊNH QUAN TRỌNG

| Ngày | Quyết định | Lý do |
| ---- | ---------- | ----- |
| 26/08/2026 | Dùng bộ khung chuẩn từ skill `khoi-tao-du-an` | Tái dùng hệ điều hành đã kiểm chứng: não 4 tầng, nghiệm thu bằng DEMO, decision log, sổ sẹo |
| 27/08/2026 | **Bỏ Supabase, bản 1 không backend** (ADR-001) | Module sắp bê sang app đã có backend riêng. Và không giữ dữ liệu trẻ thì không phát sinh nghĩa vụ NĐ 13/2023 — lợi thế đó miễn phí |
| 27/08/2026 | **Tách mã nguồn hai tầng** (ADR-004) | Đội dev nhiều khả năng viết lại giao diện. Tách ngay từ đầu tốn 0 ngày; để đến cuối tốn 2 ngày |
| 27/08/2026 | **Payload liên hệ không bao giờ chứa dữ liệu trẻ** | SĐT phụ huynh cộng kết quả DISC của con là một hồ sơ cá nhân. Đây là cái chốt giữ lớp phòng vệ của ADR-001 |
| 27/08/2026 | **Ảnh chia sẻ xoay quanh "3 câu để hỏi con tối nay"**, không phải nhãn của trẻ | Phụ huynh chia sẻ thứ khiến họ trông như cha mẹ tinh tế, không chia sẻ thứ dán nhãn con mình. Hạ luôn rủi ro dán nhãn |
| 27/08/2026 | **Nháp bài gắn theo cả biệt danh**, không chỉ theo bộ đề | Máy giáo viên đi qua nhiều gia đình — trả nháp của bé A cho bé B là vừa lộ chéo vừa sai người |

## CẢNH BÁO / CẠM BẪY (đã trả giá, đừng lặp lại)

- **Next.js 16 TỰ GHI một khối vào `CLAUDE.md` sau mỗi lần `next dev`** (26/08/2026,
  hạng mục 0.4). Nó chỉ chèn thêm chứ không xoá, nên rất dễ lọt — nhưng hiến pháp dự án
  do người viết, không để công cụ build sửa, và nó làm bẩn diff mỗi lần chạy dev. Đã chặn
  bằng `agentRules: false` trong `next.config.mjs`. **Đừng gỡ dòng đó.** Tài liệu Next 16
  vẫn đọc được ở `node_modules/next/dist/docs/` khi cần.
- **`import.meta.url` KHÔNG phải URL `file://` khi test chạy dưới jsdom** (26/08/2026,
  hạng mục 0.5). `fileURLToPath(new URL("..", import.meta.url))` nổ ngay dòng đầu với
  *"TypeError: The URL must be of scheme file"*, và lỗi hiện ra là **cả file test không nạp
  được** chứ không phải một test đỏ — rất dễ đọc nhầm thành lỗi cú pháp. Trong test dùng
  `process.cwd()` làm mốc, Vitest luôn chạy từ gốc dự án.
- **`eslint-config-next` v16 ĐÃ LÀ flat config** (27/08/2026, GĐ6). Bọc thêm `FlatCompat`
  làm ESLint nổ *"Converting circular structure to JSON"* — thông báo chẳng liên quan gì
  tới nguyên nhân. Hậu quả tệ hơn lỗi: **cửa `npm run lint` im lặng không chạy suốt từ
  GĐ0 tới GĐ6**, đúng kiểu "script có mà cửa vẫn không mở". Sửa xong nó lộ ra 9 lỗi thật.
- **`eslint-disable-next-line` chỉ tác dụng lên ĐÚNG dòng kế tiếp** (27/08/2026). Chỉ thị
  viết thành hai dòng thì nó tắt dòng bình luận thứ hai, không tắt câu lệnh — và lint vẫn
  đỏ y nguyên, rất dễ tưởng là quy tắc không tắt được.
- **Tailwind v4 sinh màu dạng `oklch()`** (27/08/2026, GĐ7). Tự viết bộ đo tương phản mà
  phân tích chuỗi theo `rgb()` là **báo nhầm hàng loạt**. Vẽ màu lên canvas 1×1 rồi đọc
  pixel — đổi được mọi định dạng CSS về RGB thật. Và nhớ **trộn nền trong suốt** trước khi
  tính, nếu không `rgba(...,0.09)` bị coi như màu đục.
- **Cam thương hiệu `#FF8F2D` trên nền trắng chỉ đạt 2,28:1** (27/08/2026). Dưới cả ngưỡng
  chữ to (3:1) lẫn chữ thường (4,5:1). Dùng `MAU.camDamChoChu` cho CHỮ; cam thương hiệu
  chỉ dùng cho viền và mảng màu.
- **Service worker cache "thứ tình cờ nhìn thấy" là KHÔNG ĐỦ** (27/08/2026, GĐ7). Lần tải
  đầu tiên diễn ra TRƯỚC khi nó kích hoạt nên nó không thấy JS/CSS nào. Phải nạp sẵn theo
  danh sách sinh sau build. **Và tệ hơn:** trả vỏ trang cho request `.js` thì trình duyệt
  nhận HTML ở chỗ đợi JS — trang lên nhưng không bấm được gì, `requestfailed` báo **0**,
  không ai biết hỏng. Chỉ request `mode === "navigate"` mới được nhận vỏ trang.
- **Trình duyệt thật bắt được thứ test đơn vị mù** (27/08/2026). Ba lỗi nội dung chỉ lộ ra
  khi soi ảnh chụp: bộ THCS hiện "3 câu để tự hỏi mình" mà ruột là câu viết cho phụ huynh
  hỏi con · ảnh PNG có mảng trắng chết khi kiểu "phổ đều" không có nhân vật · bản in bộ QS
  in hai câu lệch nhau về cùng một ý. **Viết xong giao diện thì phải NHÌN, không chỉ chạy test.**
- **CI chạy ở UTC, máy dev ở +07 — ngày gõ cứng trong test là trò may rủi** (27/08/2026,
  lần push đầu tiên). `hienNgay()` đọc ngày theo múi giờ máy đang chạy; đó là hành vi ĐÚNG
  với người dùng, nhưng nó làm test `"27/08/2026"` xanh trên máy và **đỏ trên GitHub**
  (cùng mốc đó ở UTC là 26/08 lúc 23:08). Đã ghim `env: { TZ: "Asia/Ho_Chi_Minh" }` trong
  `vitest.config.mts`, và `tests/ngay.test.ts` có test canh cái ghim đó còn sống.
  **Bài học chung: cửa kiểm chạy trên máy mình không thay được cửa kiểm chạy trên CI.**
