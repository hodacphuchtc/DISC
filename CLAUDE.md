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

## TRẠNG THÁI (cập nhật 28/08/2026 — GĐ11→GĐ14 xong trọn)

### ĐÃ XONG

**GĐ0–GĐ14 xong trọn: 68/68 hạng mục · 1.115 test xanh · `npm run kiem` + `npm run build`
xanh.** Chạy thử: `npm run xem-thu` → http://localhost:3100.
🔴 **Đã push tới `f31a3de` (GĐ0–GĐ10). GĐ11–GĐ14 CHƯA PUSH — còn ở local.**

Bốn mốc lớn: **GĐ0–GĐ8** sản phẩm chạy đầu-cuối · **GĐ9** làm sâu báo cáo · **GĐ10** ba bản
báo cáo · **GĐ11–GĐ14 DISC GIA ĐÌNH** — đơn vị dữ liệu đổi từ MỘT BÀI sang MỘT GIA ĐÌNH.

Những gì GĐ11–GĐ14 thêm vào sản phẩm:
- **Bảng gia đình** thay màn *Bài đã làm*: mỗi người một thẻ, nhìn một cái biết ai chưa làm.
  Bấm *Làm bài* từ thẻ thì không bị hỏi tên lần nữa.
- **Mã mời / QR tự viết** (không thêm thư viện): một hồ sơ DISC gói vừa 14 ký tự, hạn 7 ngày,
  kiểm tổng 2 ký tự. Gỡ trần *"cả nhà phải dùng chung một máy"* mà không phá ADR-001.
- **Phân tích cả nhà** tới 6 người: mỗi người một bản đọc riêng, in tách bản mỗi người một tờ.
- **So sánh "hồi đó ↔ bây giờ"**, chỉ mở khi hai bài cách nhau ≥ 90 ngày.
- **Màn *Số liệu máy này*** — mở cửa cho bộ đếm phễu vốn có từ GĐ6 mà chưa màn nào đọc.
- 5 câu/màn cho mọi bộ đề (thẻ có khung, số theo cả bài) · lớp 1–12 + *đã qua lớp 12* ·
  bỏ ô thu liên hệ · chú giải bốn nhóm + khối dẫn nguồn.

### 🔴 CÒN LẠI TOÀN VIỆC NGƯỜI — máy đã hết việc trong phạm vi plan

1. **Quét mã QR bằng điện thoại thật.** DEMO GĐ11 mục 6, và DEMO GĐ13 cần **hai máy**. Test
   đã dựng lại lưới từ chính nét vẽ Canvas rồi giải mã ngược ra đúng chuỗi, cộng phép thử
   hội chứng Reed–Solomon — nhưng ống kính, ánh sáng và độ tương phản thì không mô phỏng được.
2. **Gửi hai hồ sơ ký duyệt.** 🔴 **Gói B nay RỘNG HƠN:** `14.3` thêm nội dung nói về quan hệ
   giữa HAI NGƯỜI LỚN (vợ ↔ chồng). Chạy lại `node scripts/xuat-noi-dung-ky-duyet.mjs` rồi
   mới gửi — bản `.md` đang nằm trong `docs/` là bản CŨ, chưa có phần đó.
3. **Gọi đội dev app chủ 30 phút** — React bản mấy · có Tailwind không · lead đi vào đâu.
4. **Gọi 5 phụ huynh vừa nghỉ** · **chốt nghi thức mời của trường**.
5. **Bấm thử trên điện thoại thật** (phần duy nhất của `7.2` máy không làm được).
6. **Quyết có push GĐ11–GĐ14 lên `origin/main` không.**

### CHỜ NGOÀI (thiếu người/dịch vụ — ghi vào đây rồi làm tiếp, đừng dừng)

- 🔴 **HAI chữ ký chuyên môn, hai mức trách nhiệm khác nhau.** **Gói A**
  `docs/noi-dung-cho-ky-duyet.md` — nội dung nói về TRẺ, *chặn ngày ra người dùng thật*.
  **Gói B** `docs/noi-dung-cho-ky-duyet-goi-b.md` — phản hồi tính cách cho NGƯỜI LỚN về chính
  họ **và về bạn đời của họ** (thêm ở 14.3); *chỉ chặn phần nội dung của chính nó*, chưa ký
  được vẫn phát hành, chỉ cần tắt phần đó đi.
- 🔴 **Đo lý do phụ huynh rời đi** — gọi 5 người vừa nghỉ. Mục tiêu là giữ chân mà **chưa ai
  đo vì sao họ rời**. *Chặn: cả bốn giai đoạn có nhắm đúng chỗ không.*
- 🔴 **Gọi đội dev app chủ 30 phút.** Họ sẽ bảo trì hệ này mà **chưa ai hỏi họ có nhận không**.
- **Chốt nghi thức mời của trường** (ai nói, ở đâu, lúc nào). Lý do chưa nhà nào làm 2 bài
  không phải phần mềm khó dùng — là chưa ai bảo họ làm. *Chặn: GĐ14 có ai dùng không.*
- **Thu 30–50 phản hồi thật** rồi chạy `node scripts/phan-tich-item.mjs` → Cronbach's α. Đây
  là lúc DUY NHẤT được phép nói về độ tin cậy — bằng số của chính mình.

### 🔴 CON SỐ CẦN THEO DÕI SAU KHI PHÁT

**`baiThuHai`** — đọc ở khoang *Số liệu máy này*. Nó chính là giả định đang đỡ 9,5 ngày của
GĐ14: *một phụ huynh sẽ triệu tập được từ hai thành viên trở lên cùng làm bài.* Tính tới hôm
nay giả định đó vẫn có **0 quan sát ủng hộ và 1 quan sát phản bác**.

Ba bảo hiểm đã cài xong và nay chạy được thật: GĐ11 phát được ngay · mốc `baiThuHai` ghi thật
và đọc được · mã mời đã gỡ trần *"cả nhà một máy"*. **Bằng 0 sau 30 máy thật thì thứ cần xem
lại là giả định, không phải phần mềm.**

> Quyền ghi vào repo: **đã có** (tài khoản `hodacphuchtc`, token có scope `repo` +
> `workflow`). Push lần đầu ngày 27/08/2026.

> **Không cần Supabase và không cần Vercel nữa** — xem `docs/decisions/ADR-001-khong-backend.md`.

## QUYẾT ĐỊNH QUAN TRỌNG

| Ngày | Quyết định | Lý do |
| ---- | ---------- | ----- |
| 28/08/2026 | **Mã mời KHÔNG mang tên đi** (hàng rào thứ 5 của ADR-005) | Mã đi qua tin nhắn và ảnh chụp màn hình. Máy nhận tự hỏi tên — vừa giữ được hàng rào, vừa làm hồ sơ vừa đúng 14 ký tự |
| 28/08/2026 | **Hồ sơ nhận qua mã lưu ở trường riêng, KHÔNG dựng bài làm giả** | Mã chỉ mang bốn con số. Bịa một bảng câu trả lời khớp với chúng là tạo dữ liệu chưa ai từng nhập, và sáu tháng sau không ai phân biệt được với dữ liệu thật |
| 28/08/2026 | **Trục quy chiếu nội dung cặp là NGƯỜI ĐỌC, không phải VAI** | Sang phân tích cả nhà thì cặp có thể là con↔anh hay bố↔mẹ, và câu hỏi "ai là bố mẹ?" không còn câu trả lời. Đổi trục giữ được **8 khoá** phủ mọi cặp |
| 28/08/2026 | **Người thứ ba được tả GIỐNG NHAU cho hai người đọc** | Bố Nam là một người, không phải hai. Viết hai bản khác nhau cho cùng một sự thật chỉ để hai tờ giấy trông khác nhau là bịa thêm chữ. Ranh giới: cùng CẶP thì phải khác, cùng NGƯỜI THỨ BA thì được giống |
| 28/08/2026 | **Sàn 90 ngày cho so sánh theo thời gian** | Một nấc trả lời dịch điểm 4–10 điểm. Hai bài cách ba tuần thì thứ hiện lên là nhiễu đo — và nó vẫn đọc lên đầy thuyết phục vì có số kèm theo |
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

- 🔴 **KHỨ HỒI KHÔNG ĐỦ ĐỂ CHỨNG MINH MỘT BỘ MÃ HOÁ ĐÚNG** (28/08/2026, `11.1`). Đa thức
  sinh Reed–Solomon của mã QR bị dựng **ngược thứ tự hệ số** (`moi[j] ^= da[j]*α` thay vì
  `moi[j] ^= da[j]`). Hậu quả: mã QR vẫn vẽ ra đẹp, bộ giải mã tự viết vẫn đọc ngược ra đúng
  chuỗi — vì nó chỉ đọc phần dữ liệu, có sửa lỗi đâu mà biết — và **chỉ điện thoại thật là
  chịu**. Cửa duy nhất bắt được là **phép thử hội chứng**: một từ mã hợp lệ chia hết cho đa
  thức sinh, nên thay `x = α^i` phải ra 0. Viết phép thử đó bằng số học GF(256) theo lối
  KHÁC (nhân bit, không tra bảng log) thì nó độc lập thật. **Bài học: kiểm một bộ mã hoá thì
  phải có một cửa nhìn vào phần mà bộ giải mã của mình KHÔNG dùng tới.**
- 🔴 **Vòng giữ chỗ bit định dạng QR quét cả `i = 6`** (28/08/2026) ⇒ xoá trắng hai ô NHỊP ở
  `(cột 8, hàng 6)` và `(cột 6, hàng 8)` mà `veBitDinhDang()` không bao giờ ghi đè lại. Mã
  vẫn vẽ ra rất đẹp. Vùng định dạng CỐ Ý chừa index 6 — nó là hàng/cột nhịp.
- 🔴 **CẮT KHỐI THEO MỐC VĂN BẢN LÀM MẤT BA KHỐI NẰM CÙNG VÙNG** (28/08/2026, `13.1`). Xoá
  `CHU_THU_MA_MOI` bằng `slice(dau, cuoi)` giữa hai tiêu đề đã cuốn theo cả `CHU_MA_HONG`,
  `CHU_SO_LIEU` và `CHU_MOC` — ba khối chèn vào sau, nằm lọt giữa hai mốc. Typecheck bắt
  được ngay, nhưng chỉ vì chúng có người dùng. **Cắt từ mốc A tới mốc B thì phải biết giữa
  A và B hiện còn gì — mốc không tự bảo vệ vùng nằm giữa chúng.**
- **Cửa kiểm soi CHUỖI CON trên tiếng Việt sẽ báo nhầm từ ghép** (28/08/2026, `13.2`). Luật
  cấm `yếu` dính vào "chủ **yếu**". Giữ cửa nghiêm và đổi câu chữ, ĐỪNG nới cửa: ở nội dung
  cho phụ huynh đọc về con, một lần báo nhầm chỉ tốn công đổi một chữ, còn một lần bỏ sót là
  để chữ *"điểm yếu"* đi thẳng tới người đọc.
- **Tên trong test càng NGẮN càng dễ khớp nhầm chữ giao diện** (28/08/2026, `11.6`). Biệt
  danh bịa `"Bi"` nằm gọn trong `"**Bi**ệt danh khác nhau"` ngay trên màn, làm cửa kiểm riêng
  tư đỏ oan. Chọn chuỗi không đụng chữ nào của giao diện (`"Zozo"`, `"Kiki"`).
- **Vá thẳng lên `Element.prototype` mà quên gỡ thì bản vá sống sang mọi file test sau**
  (28/08/2026). `Object.defineProperty(Element.prototype, "scrollIntoView", …)` không gỡ đã
  gây hai lỗi lạ ở một file chẳng liên quan. `vi.spyOn` không bám được vào thuộc tính jsdom
  chưa định nghĩa, nên phải tự gắn — và gỡ trong `finally`.
- **Lời gọi bắn-rồi-quên (`void p.then(async …)`) phải có `.catch()`** (28/08/2026, `11.6`).
  Thêm một `await` vào trong `.then` là biến nó thành nguồn unhandled rejection: người dùng
  vừa làm xong 20 câu thì thấy lỗi đỏ ở màn kết quả. Mất một mốc ĐO là chuyện nhỏ.
- **Suy cỡ chữ/cỡ nút từ `cauMoiMan` là một proxy TÌNH CỜ đúng** (28/08/2026, `11.3`). Số câu
  trên màn nói về mật độ trình bày; cỡ nút nói về ngón tay một đứa bé sáu tuổi. Đổi
  `cauMoiMan` sang 5 mà không đụng gì khác thì hai bộ dành cho trẻ nhỏ nhất lặng lẽ tụt xuống
  chữ 14px và nút 44px — **không một test nào đỏ**. Nay khoá theo `canNutTo()` ở `config/`.
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
