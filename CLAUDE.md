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
Repo: https://github.com/hodacphuchtc/DISC — **PUBLIC**, đã push (27/08/2026).
🔴 Repo công khai: mọi thứ trong này internet đọc được. Đừng đưa dữ liệu thật của trẻ,
họ tên, hay số điện thoại cá nhân vào bất kỳ file nào.
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

## TRẠNG THÁI (cập nhật 27/08/2026 — tối)

### ĐÃ XONG

Ứng dụng chạy được đầu-cuối trên local. **45/48 hạng mục PLAN.md · 731 test xanh ·
`npm run kiem` và `npm run build` đều xanh · 12/12 DEMO đạt trên bản production.**
Chạy thử bản phát hành: `npm run xem-thu` → http://localhost:3100 (README mục *Chạy thử*).
🔴 **GĐ10 mới xong chặng 1 phần đầu** — còn `10.4`, `10.6`, và trọn chặng 2 (`10.7`).

- **GĐ0–GĐ8** — dựng xong sản phẩm chạy đầu-cuối: khung Next 16 · 104 câu hỏi + lõi chấm
  điểm + năm hàng rào `HL-1..HL-5` · luồng làm bài 5 bộ đề · màn kết quả + ảnh PNG + in PDF ·
  IndexedDB + vùng lệch con↔cha mẹ · thu liên hệ + phễu · ngoại tuyến + tiếp cận · gói bàn giao.
  Chi tiết từng hạng mục: `PLAN.md`.
- **GĐ9** — **làm sâu bản báo cáo**: diễn giải đủ **bốn trục** (trước chỉ trục trội có chữ),
  nội dung theo **lứa tuổi**, 12 cặp pha **có thứ tự**, tầng lời khuyên hành động
  (câu nên nói / nên tránh · khi con căng thẳng · linh hoạt tình huống · một việc tối nay),
  bóc lớp dần + bản in mở sẵn, ô "điều đang băn khoăn", **so sánh phong cách bố mẹ ↔ con**,
  và `docs/noi-dung-cho-ky-duyet.md` để người chuyên môn ký.

- **GĐ10** — **chặng 1 (đang dở)**: sửa bốn lỗi sai người đọc · đại từ hai chiều
  (phụ huynh của học sinh TH/THCS lần đầu nhận được lời khuyên) · tóm tắt 30 giây ·
  bảng tra D-I-S-C có từ tiếng Anh · đoạn mở đầu 136 từ nói thật về giới hạn.

### ĐANG DỞ

**GĐ10** — xong `10.1` `10.2` `10.3` `10.5`. Còn `10.4` (ba dải + in theo từng bản) và
`10.6` (sắp lại màn 1 hai nhánh), cả hai đều giao là làm được ngay. Chặng 2 (`10.7`) chờ
chủ dự án bấm thử chặng 1 trước.

### BƯỚC TIẾP THEO (theo thứ tự)

1. 🔴 **Bấm thử chặng 1 của GĐ10** — `npm run xem-thu`, nạp 8 bài mẫu, soi ba khối mới
   (tóm tắt 30 giây · bảng tra D-I-S-C · đoạn mở đầu). Quyết xong mới chạy chặng 2.
2. **Bấm thử trên điện thoại thật** — phần duy nhất của `7.2` máy không làm được:
   `npm run dev`, mở bằng điện thoại trong cùng mạng WiFi, làm trọn một bài.
3. **Đọc `docs/noi-dung-cho-ky-duyet.md`** rồi đưa cho người có chuyên môn tâm lý/giáo dục.
   Đây là việc gỡ khoá ngày ra người dùng thật.
4. **Gọi đội dev 30 phút** — React bản mấy · có Tailwind không · lead đi vào đâu ·
   nhận dạng nào. Bốn câu này quyết định phần giao diện có dùng lại được không.
5. Ba việc còn lại ở mục CHỜ NGOÀI, bắt đầu bằng việc thu 30–50 phản hồi thật.

### CHỜ NGOÀI (thiếu key/env/dịch vụ — ghi vào đây rồi làm tiếp, đừng dừng)

Bốn việc dưới đây **không tốn ngày dev nào**, nhưng cả bốn đều có thể đổi hình dạng bài
toán. Ba việc đầu nên làm ngay tuần này.

- 🔴 **Người có chuyên môn tâm lý/giáo dục KÝ DUYỆT 104 câu hỏi + văn bản báo cáo.**
  Chạy nội bộ thì không sao. Ngày bấm nút chạy quảng cáo là ngày nói với người lạ về con
  của họ — trước ngày đó phải có một người chịu trách nhiệm.
  ✅ **Nút thắt đã gỡ (GĐ9):** `node scripts/xuat-noi-dung-ky-duyet.mjs` sinh ra
  `docs/noi-dung-cho-ky-duyet.md` — gom trọn chữ, thay sẵn đại từ theo từng bộ đề, kèm
  5 câu người ký cần xác nhận. Đưa thẳng file đó, họ không phải mở file `.ts` nào.
  *Chặn: ngày ra người dùng thật.*
- 🔴 **Thu 30–50 phản hồi thật** (Google Form cũng được), rồi chạy
  `node scripts/phan-tich-item.mjs`. Đây là thứ duy nhất biến bộ 104 câu từ *"do BA soạn"*
  thành *"đã sàng trên người Việt"*. *Chặn: ngày bật quảng cáo.*
- ⚠️ **Nộp 3 mẫu quảng cáo cho Facebook duyệt.** Facebook hạn chế quảng cáo ngụ ý biết đặc
  điểm tâm lý của người xem hoặc người thân. Cần kiểm chứng — chính sách có thể đã đổi.
  *Nếu trượt thì kênh phân phối số 1 chết.*
- **Số Zalo/hotline thật** để điền vào `LIEN_HE_SATA` trong `config/disc-tu-dien.ts`
  (hiện là số giữ chỗ `0900 000 000`).
> Quyền ghi vào repo: **đã có** (tài khoản `hodacphuchtc`, token có scope `repo` +
> `workflow`). Push lần đầu ngày 27/08/2026.

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

| 27/08/2026 | **Bóc lớp dần** thay vì đưa hết ra màn kết quả | Đặc tả đã chốt "nói ít mà trúng"; chủ dự án muốn sâu hơn. Bóc lớp giữ được cả hai — màn hình ngắn như cũ, bản in đầy đủ, không phá bố cục ảnh chia sẻ |
| 27/08/2026 | **"Cân bằng DISC" = LINH HOẠT TÌNH HUỐNG**, không phải nâng trục thấp | DISC không phải mô hình khuyết thiếu. Khuyên "nâng trục thấp" là ngầm nói đứa trẻ đang thiếu — đụng thẳng ADR-002. Thay bằng cặp *kỹ năng dạy con dùng thêm* + *điều bố mẹ tự chỉnh*, luôn đi cùng nhau |
| 27/08/2026 | **Được nói CÁCH học, cấm ĐOÁN năng lực** | Luật §9.2 số 5 cấm gắn học lực. Cách tổ chức việc học cùng con là lời khuyên quy trình, khác hẳn dự đoán môn/năng lực. Ranh giới đặt ở đó và có test canh |
| 27/08/2026 | **Cường độ chỉ đổi MỘT mệnh đề, không bao giờ đổi mạch văn** | Phép đo quá thô để đỡ thang cao/vừa/thấp: một nấc trả lời dịch 4–10 điểm tuỳ bộ. Không cố làm ngưỡng chính xác — mà chặn thiệt hại khi ngưỡng sai. Nội dung khoá theo THỨ HẠNG, vốn ổn định hơn nhiều |
| 27/08/2026 | **Lời khuyên cho người lớn và bản tự đọc là HAI bộ chữ khác nhau** | Không phải bản dịch của nhau. Bê chữ viết cho phụ huynh sang bộ THCS rồi chỉ đổi tiêu đề là đúng lỗi đã trả giá sáng cùng ngày |

## CẢNH BÁO / CẠM BẪY (đã trả giá, đừng lặp lại)

> Bài học riêng của miền BÁO CÁO (chấm điểm · diễn giải · Canvas · bản in) nằm ở
> `modules/report/OVERVIEW.md` mục 6. Dưới đây chỉ giữ bài học TOÀN HỆ.

- **Bảng đại từ khoá MỘT CHIỀU theo bộ đề đã âm thầm cắt cả một nhóm người dùng khỏi sản
  phẩm** (27/08/2026, GĐ10). `CHU_THE[maBoDe]` ngầm giả định *"một bộ đề = một người đọc"*.
  Giả định đó khiến bộ TH/THCS bị chặn khỏi TOÀN BỘ `LOI_KHUYEN` — nghĩa là **phụ huynh của
  mọi học sinh tiểu học và THCS không nhận được một chữ lời khuyên nào**, suốt từ GĐ9. Không
  test nào thấy vì test chỉ hỏi "bộ này có `tuMinh` không", chưa ai hỏi "phụ huynh của em này
  đọc được gì". **Bài học: khi thêm một trường khoá theo X, hỏi ngay X có đủ chiều không.**
- **`next start` KHÔNG chạy được với `output: "export"`** (27/08/2026). Script `start` trỏ vào
  đó từ GĐ0 và chỉ ném lỗi — không ai phát hiện vì không ai chạy nó. Đã thay bằng
  `scripts/xem-ban-phat-hanh.mjs` (`npm run xem-thu`). **Một script hỏng mà không ai gọi thì
  im lặng y như một tính năng hỏng mà không ai mở.**
- **Hằng nghiệp vụ nằm CỤC BỘ trong một file là mầm của hai nguồn sự thật** (27/08/2026).
  `TUOI_VAO_THCS = 12` từng là `const` trong `dien-giai.ts`; chỗ thứ hai cần đúng con số đó
  (màn vùng lệch) đã gõ cứng `"THCS"` cho mọi lứa tuổi. Ngưỡng đã chuyển lên `config/`.
- **Hạng mục có thể TICK ✅ mà vẫn chưa làm đúng thứ đặc tả đòi** (27/08/2026, GĐ9 — đắt
  nhất phiên). Đặc tả §9.2 luật 2 ghi *"Mỗi trục nêu CẢ mặt mạnh LẪN mặt cần để ý"*, DEMO #5
  đòi *"mỗi trục có ít nhất một dòng chỗ cần để ý"*. Bản dựng làm theo **KIỂU** (11 kiểu) chứ
  không theo **TRỤC** (4 trục), và `tests/dien-giai.test.ts` chỉ kiểm 11 kiểu — nên test xanh,
  DEMO "đạt", hạng mục `4.2` tick ✅ từ GĐ4, trong khi phụ huynh nhìn biểu đồ bốn cột có số
  đầy đủ mà chỉ đọc được chữ về **một** nhóm. **Bài học: viết test theo ĐÚNG DANH TỪ mà đặc
  tả dùng.** "Mỗi trục" mà đi kiểm "mỗi kiểu" là một cửa kiểm nhìn sai chỗ suốt bốn giai đoạn.
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
