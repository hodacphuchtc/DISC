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

Khoang trắc nghiệm DISC nhúng vào app chủ của SATA ROBO, cho **cả gia đình**: trẻ mầm non
tới lớp 12, và bố mẹ. Hệ thống chấm rồi trả về bản báo cáo đọc được ngay — mỗi người đọc bản
viết cho đúng mình. Mục tiêu kinh doanh: **giữ chân hơn 1.000 gia đình đang học** (đổi từ mồi
thu khách, 27/08/2026). Hướng đang mở: **DISC gia đình** — GĐ11–GĐ14 trong `PLAN.md`.
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

## TRẠNG THÁI (cập nhật 27/08/2026 — tối, chặng 3)

### ĐÃ XONG

**GĐ0–GĐ10 xong trọn: 48/48 hạng mục · 805 test xanh · `npm run kiem` + `npm run build`
xanh · 12/12 DEMO đạt.** Chạy thử: `npm run xem-thu` → http://localhost:3100.
Đã push `origin/main` tới `f31a3de`, CI xanh. Chi tiết từng giai đoạn: `PLAN.md`.

Ba mốc lớn: **GĐ0–GĐ8** sản phẩm chạy đầu-cuối · **GĐ9** làm sâu báo cáo (đủ bốn trục,
theo lứa tuổi, tầng lời khuyên) · **GĐ10** ba bản báo cáo (ba dải + in tách bản, màn 1 hai
nhánh, nội dung ba bản, hai gói ký duyệt).

### ĐANG DỞ — chờ MỘT chữ

🆕 **GĐ11–GĐ14 — DISC GIA ĐÌNH**, 20 hạng mục, **28 ngày**, đã viết vào `PLAN.md` (~dòng
770–1160). **Chủ dự án nói chỉ khi gõ "DUYỆT" mới bắt đầu.** Duyệt rồi thì làm từ `11.1`.
Thiết kế đầy đủ + phần thẩm định đầu tư: `~/.claude/plans/t-i-test-v-purrfect-star.md`.

Mục tiêu kinh doanh đã đổi: từ **mồi thu khách** sang **giữ chân hơn 1.000 gia đình đang học**.

🔴 **GIẢ ĐỊNH ĐANG ĐỠ GĐ14 (9,5 ngày):** *một phụ huynh sẽ triệu tập được từ hai thành viên
trở lên cùng làm bài.* Hiện **0 quan sát ủng hộ, 1 quan sát phản bác** — tính năng ghép 2
người có từ GĐ5 và **chưa lần nào tự kích hoạt ngoài đời**; dưới 10 người ngoài vòng quen
từng làm xong một bài (tiếp cận <1% tệp khách). Chủ dự án đã nghe phản biện và chọn xây trọn.
Bảo hiểm đã cài: phát GĐ11 cho 30 nhà ngay ngày 5 · mốc đo `baiThuHai` ở `11.6` · `13.1`
mã mời gỡ trần "cả nhà một máy" trước GĐ14.

### BƯỚC TIẾP THEO (theo thứ tự)

1. 🔴 **Chủ dự án gõ "DUYỆT"** cho lộ trình GĐ11–GĐ14 → bắt đầu `11.1` (spike mã QR).
2. 🔴 **Gửi hai hồ sơ ký duyệt đi ký** — `docs/noi-dung-cho-ky-duyet.md` (gói A, 11.506 từ)
   và `...-goi-b.md` (gói B, 1.537 từ). Phải gửi **trước** khi viết 3.000 từ của `14.3`.
3. 🔴 **Gọi đội dev app chủ 30 phút** — React bản mấy · có Tailwind không · lead đi vào đâu.
   Họ sẽ ôm hệ 28 ngày này mà **chưa ai hỏi họ có nhận không**; trả lời khác đi thì con số
   28 ngày sai.
4. Hai việc NGƯỜI, 0 ngày dev: chốt **nghi thức mời** của trường (ai nói, ở đâu, lúc nào) ·
   **gọi 5 phụ huynh vừa nghỉ** để biết lý do rời thật (hiện chưa đo).
5. Bấm thử trên điện thoại thật (phần duy nhất của `7.2` máy không làm được).

### CHỜ NGOÀI (thiếu người/dịch vụ — ghi vào đây rồi làm tiếp, đừng dừng)

- 🔴 **HAI chữ ký chuyên môn, hai mức trách nhiệm khác nhau.** Cả hai tệp đã sinh sẵn bằng
  `node scripts/xuat-noi-dung-ky-duyet.mjs` — đưa thẳng cho người ký, họ không phải mở file
  `.ts` nào. **Gói A** `docs/noi-dung-cho-ky-duyet.md` (11.506 từ), nội dung nói về TRẺ,
  *chặn ngày ra người dùng thật*. **Gói B** `docs/noi-dung-cho-ky-duyet-goi-b.md` (1.537 từ),
  phản hồi tính cách cho NGƯỜI LỚN về chính họ — *chỉ chặn phần nội dung của chính nó*, chưa
  ký được vẫn phát hành, chỉ cần tắt khối "Nhìn về phía bố mẹ" + bản tự đọc bộ PH.
  🔴 Gửi **TRƯỚC** khi viết 3.000 từ của `14.3`, không phải sau.
- 🔴 **Gọi đội dev app chủ 30 phút** — React bản mấy · có Tailwind không · lead đi vào đâu.
  Họ sẽ bảo trì hệ 28 ngày này mà **chưa ai hỏi họ có nhận không**. *Chặn: độ chính xác của
  toàn bộ ước lượng GĐ11–14.*
- 🔴 **Đo lý do phụ huynh rời đi** — gọi 5 người vừa nghỉ. Mục tiêu là giữ chân mà **chưa ai
  đo vì sao họ rời**. *Chặn: cả bốn giai đoạn có nhắm đúng chỗ không.*
- **Chốt nghi thức mời của trường** (ai nói, ở đâu, lúc nào). Lý do chưa nhà nào làm 2 bài
  không phải phần mềm khó dùng — là chưa ai bảo họ làm. *Chặn: GĐ14 có ai dùng không.*
- **Thu 30–50 phản hồi thật** rồi chạy `node scripts/phan-tich-item.mjs` → Cronbach's α. Đây
  là thứ duy nhất biến bộ 104 câu từ *"do BA soạn"* thành *"đã sàng trên người Việt"*, và là
  lúc DUY NHẤT được phép nói về độ tin cậy — bằng số của chính mình.
- **Số Zalo/hotline thật** — hiện là số giữ chỗ `0900 000 000`. ⚠️ Sẽ bị gỡ ở `11.2` cùng ô
  liên hệ; chỉ cần lại nếu sau này dựng kênh liên hệ khác.

> Quyền ghi vào repo: **đã có** (tài khoản `hodacphuchtc`, token có scope `repo` +
> `workflow`). Push lần đầu ngày 27/08/2026.

> **Không cần Supabase và không cần Vercel nữa** — xem `docs/decisions/ADR-001-khong-backend.md`.

## QUYẾT ĐỊNH QUAN TRỌNG

| Ngày | Quyết định | Lý do |
| ---- | ---------- | ----- |
| 27/08/2026 | **Mục tiêu kinh doanh = GIỮ CHÂN học viên đang học**, không phải mồi thu khách | 1.000+ gia đình đang trả tiền, app chủ đang sống. Phễu thu số điện thoại thành thừa ⇒ gỡ ở `11.2` |
| 27/08/2026 | **Đơn vị dữ liệu đổi từ MỘT BÀI sang MỘT GIA ĐÌNH** (GĐ11–14, ADR-007 sẽ viết) | Sản phẩm chuyển từ *"đo một đứa trẻ"* sang *"giúp một gia đình hiểu nhau"* |
| 27/08/2026 | **Bảng gia đình thay wizard 3 bước** | Ba bước tuần tự bắt đi hết bước 1 mới thấy bước 2. Một bảng ⇒ mỗi việc đúng một cú chạm, và nhìn một cái biết ai chưa làm |
| 27/08/2026 | **Mã mời/QR ~40 byte thay vì "cả nhà một máy"** | ADR-001 cấm backend ⇒ mặc định cả nhà xếp hàng trên một điện thoại. Hồ sơ DISC chỉ là 4 con số nên nhét vừa một QR — gỡ trần mà không phá ADR-001 |
| 27/08/2026 | **Cho nhập TÊN THẬT** (lật §10.2, ADR-005 sẽ viết) | Chủ dự án chốt. Dữ liệu không rời máy nên rủi ro pháp lý thấp; **giữ nguyên 4 hàng rào**: không rời máy · tên không vào tệp xuất · tên không vào ảnh chia sẻ · test dùng tên bịa |
| 27/08/2026 | **5 câu/màn cho MỌI bộ đề** (lật §5.2, ADR-006 sẽ viết) | Chủ dự án chốt. Giảm thiệt hại: bộ TH giữ cỡ chữ ≥18px và nút ≥56px. Đổi lúc này rẻ nhất vì gần như chưa ai có bài dở |
| 27/08/2026 | **Nội dung cặp N người dùng PA-2** (56 đoạn, không phải 168) | Cơ chế chỗ vênh không đổi theo quan hệ; chỉ đại từ và *thế quyền* đổi. Thêm ông bà/bố dượng sau tốn **+0 đoạn** |
| 27/08/2026 | **Nói "miễn phí cho gia đình đang học", CẤM nói "phi lợi nhuận"** | Mục tiêu là giữ chân khách đang trả tiền — đó là tiện ích miễn phí chính đáng, nhưng gọi là phi lợi nhuận là một tuyên bố sai |
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

> Cạm bẫy CÔNG CỤ (Next 16 ghi đè CLAUDE.md · eslint flat config ·
> `eslint-disable-next-line` một dòng · `import.meta.url` dưới jsdom · Node ESM cần đuôi
> `.ts`) nằm ở `.claude/rules/tech-defaults.md` mục cuối — **đừng chép lại vào đây**.

> Bài học riêng của miền BÁO CÁO (chấm điểm · diễn giải · Canvas · bản in) nằm ở
> `modules/report/OVERVIEW.md` mục 6. Dưới đây chỉ giữ bài học TOÀN HỆ.

- 🔴 **MÁY TẢI NẶNG LÀM 19–20 TEST ĐỎ GIẢ** (27/08/2026). Docker chiếm ~200% CPU (6 container
  không của dự án), load average 32,6 ⇒ `waitFor` của Testing Library đói CPU, mỗi test mất
  6–23 giây thay vì vài chục mili-giây và hết giờ chờ hàng loạt. Cùng bộ mã đó chạy
  `npx vitest run --maxWorkers=2` ra **805/805 xanh**. **Thấy test đỏ hàng loạt mà lỗi toàn là
  hết giờ chờ ⇒ soi `uptime` và `ps aux | sort -nrk 3` TRƯỚC khi soi code.** Suýt đi sửa mã lành.
- 🔴 **Script sửa hàng loạt dò khoá bằng `indexOf("  D: {")` đã đổ CẢ TÁM câu vào riêng một
  trục** (27/08/2026, `10.7`). `LOI_KHUYEN`, `TU_MINH` và `LECH_PHONG_CACH` **đều** có khoá
  `D:`/`I:`/`S:`/`C:` trong CÙNG một file, nên `indexOf` khớp khối đầu tiên và mọi lần chèn
  rơi về đó; ba trục còn lại không nhận gì. **Không cửa nào bắt được**: độ dài vẫn > 60, và
  luật "không trùng giữa các TRƯỜNG" vẫn thoả vì các câu bị dồn nằm chung một trường. Lỗi
  chỉ lộ ra khi NHÌN ảnh chụp trang — đọc thấy bốn câu *"Dấu hiệu nó có tác dụng"* nối đuôi.
  **Hai bài học:** (1) sửa hàng loạt thì neo vào TÊN HẰNG (`export const X`) rồi cắt khối ra
  trước, đừng neo vào tên khoá — tên khoá trùng nhau khắp file; (2) test trùng lặp phải soi
  ĐỦ HAI CHIỀU: giữa các trường VÀ giữa các khoá. Đã có
  `tests/ba-ban-noi-dung.test.ts` canh chiều thứ hai.
- **Một thay đổi đặc tả làm BỐN file test cùng đỏ, vì mỗi file tự gõ lại đường đi màn 1**
  (27/08/2026, `10.6`). Sắp lại M1 thành hai nhánh làm **34 cửa đỏ** ở `m1-chon-doi-tuong` ·
  `m2-truoc-khi-bat-dau` · `m3-lam-bai` · `luu-boi-canh`. Bản thân việc đỏ là ĐÚNG — đặc tả
  đổi thật. Cái sai là phải sửa BỐN chỗ cho MỘT thay đổi, và lần sau vẫn thế. Đã gom về
  `tests/duong-m1.ts`: một chỗ duy nhất biết cách đi từ M1 vào mỗi bộ đề, và nó đọc lên như
  chính bản đặc tả *"mỗi bộ đề đúng một cửa"*. **Test dùng chung một luồng vào thì luồng đó
  phải là một hàm dùng chung, không phải một đoạn ai cũng chép lại.**
- **Muốn máy tự làm trọn một bài thì phải TRÁNH MỨC GIỮA** (27/08/2026). Trả lời xoay vòng
  đều là ra hồ sơ phẳng, và hàng rào HL-1 từ chối kết luận — ĐÚNG thiết kế, nhưng rất dễ
  đọc nhầm thành "giao diện hỏng" rồi đi sửa nhầm chỗ. Và phải **trả lời TRƯỚC rồi mới bấm
  "Xem kết quả"**: nút đó hiện ra từ màn cuối trong khi câu trên chính màn đó chưa được chọn.
- **Đặt tên hằng mới phải soi TIỀN TỐ của hằng cũ** (27/08/2026). `CHU_BAN` (ba bản báo cáo)
  đụng `CHU_BAN_KHOAN` (ô băn khoăn) đã có. Đổi thành `CHU_BA_BAN`. Rẻ — nhưng không có
  bước kiểm thì hai khái niệm khác hẳn nhau nằm cạnh nhau với cái tên gần y hệt.

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
