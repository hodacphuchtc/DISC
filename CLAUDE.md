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
thu khách, 27/08/2026). Hướng đang mở: **luồng ba bước** — `PLAN_V2.md`, ADR-008.
Nguồn yêu cầu: `docs/brd/`. 🔴 **Lộ trình đang có hiệu lực: `PLAN_V2.md`** (luồng 3 bước,
chốt 28/08/2026, ADR-008). `PLAN_V1_LUU.md` (tên cũ `PLAN.md`) chỉ còn để TRA CỨU *vì sao*
68 hạng mục GĐ0–GĐ14 làm như vậy — **không còn là việc đang làm, đừng tick thêm ô nào ở đó**.
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
- Thi công theo `PLAN_V2.md` kiểu GÓI: xong MỘT hạng mục → tick checkbox (CHỈ khi đã kiểm
  chứng) → báo cáo 3 dòng (đã làm / kiểm chứng / tiếp theo) → đi tiếp, KHÔNG dừng chờ;
  báo cáo tổng hợp cuối gói; chỉ dừng ở điểm DỪNG BẮT BUỘC.
- Quy trình 6 bước theo handle: `/B1_y_tuong` → `/B2_lo_trinh` → `/B3_thi_cong` →
  `/B4_nghiem_thu` → `/B5_luu_code` → `/B6_trien_khai` + `/B6_xuat_ban`.
  Phát triển & test trên LOCAL; chỉ `/B6_xuat_ban` mới đưa lên môi trường thật (cổng
  2 lớp qua Preview).
- Đầu phiên dùng `/mo_session`, cuối phiên dùng `/dong_session`.
- Chi tiết: `.claude/rules/` (workflow, security, module-boundaries, tech-defaults,
  ngon-ngu-ui).

## TRẠNG THÁI (cập nhật 28/08/2026, lượt 3 — `PLAN_V2.md` HẾT VIỆC MÁY)

> 🔴 **Bàn giao chi tiết cho phiên sau nằm ở ĐẦU `PLAN_V2.md`** (mục *BÀN GIAO PHIÊN GẦN
> NHẤT*): làm tiếp từ file nào · đã đo gì đừng đo lại · lệnh nên chạy. Đọc chỗ đó trước.

### 🟢 HẾT VIỆC MÁY — luồng ba bước (15) · GĐ16 (9) · GĐ17 (7)

**1.366 test xanh** · `npm run kiem` + `npm run build` xanh · **gói chính 290 KB gzip**
(trần 300; nền cũ 282). Đã push `814cb40`, CI xanh.

Sổ `PLAN_V2.md` còn đúng **HAI** ô chưa tick — `V0.1` (host + tên miền) và `V0.2` (hai
điện thoại quét QR) — **cả hai chặn bởi NGƯỜI/NGOÀI, không phải bởi máy.**

🔴 **Danh sách tính năng KHÔNG chép vào đây** — nó nằm nguyên ở các ô ✅ của `PLAN_V2.md`
(luồng ba bước · GĐ16 · GĐ17) và `PLAN_V1_LUU.md` (GĐ0–GĐ14). Chép sang đây là dựng bản
sao thứ hai, và hai bản chỉ lệch vào đúng ngày ai đó sửa một bên.

**Ba việc GĐ17 vừa gỡ**, để người đọc biết sản phẩm hôm nay khác hôm qua chỗ nào: xem lại
được **lần đo trước** · tệp `.zip` **mở ra là đọc được** (thư mục theo tên người + *Tổng
hợp*, JSON chìm xuống `_may-doc/`) · **máy tính hết thừa hai phần ba màn**.

### ĐÃ XONG TRƯỚC ĐÓ — GĐ0–GĐ14, 68/68 hạng mục

Bốn mốc: **GĐ0–GĐ8** sản phẩm chạy đầu-cuối · **GĐ9** làm sâu báo cáo · **GĐ10** ba bản
báo cáo · **GĐ11–GĐ14 DISC GIA ĐÌNH** (đơn vị dữ liệu đổi từ MỘT BÀI sang MỘT GIA ĐÌNH).

🔴 **Danh sách tính năng KHÔNG chép lại ở đây** — nó nằm nguyên trong `PLAN_V1_LUU.md`
(GĐ0–GĐ14) và bảng ✅ đầu `PLAN_V2.md` (luồng ba bước). Chép sang đây là dựng bản sao thứ
hai, và hai bản chỉ lệch vào đúng ngày ai đó sửa một bên.

Chạy thử bản phát hành: `npm run xem-thu` → http://localhost:3100 (thêm `?so-lieu=1` để
đọc bộ đếm phễu).

### 🔴 VIỆC NGƯỜI ĐANG CHẶN MỐC PHÁT

1. 🔴 **Tài khoản Cloudflare + một tên miền** (`V0.1`). Chốt phát cho 30 gia đình trong
   1–2 tuần mà **chưa có host, chưa có tên miền, chưa ai bấm deploy lần nào** — không
   `infra.json`, không cấu hình host nào trong repo. Sản phẩm mới chỉ chạy trên
   `localhost:3100`. **Đây là blocker cứng của mốc phát, và không code nào cứu được.**
2. 🔴 **Hai điện thoại thật, 30 phút** (`V0.2`) — quét thử mã QR bằng camera. Test đã dựng
   lại lưới từ nét vẽ Canvas rồi giải mã ngược, cộng phép thử hội chứng Reed–Solomon; ống
   kính, ánh sáng và độ tương phản thì không mô phỏng được. Hỏng thì phải ẩn nút QR trước
   khi phát, và nói thẳng với sale là *"cả nhà dùng chung một máy"*.
3. **Gửi hai hồ sơ ký duyệt.** 🔴 Gói B nay RỘNG HƠN: `14.3` thêm nội dung về quan hệ giữa
   HAI NGƯỜI LỚN (vợ ↔ chồng). ⚠️ **Chạy lại `scripts/xuat-noi-dung-ky-duyet.mjs` KHÔNG
   ĐỦ** — script đó không hề import `config/disc-noi-dung-cap.ts` (nơi chứa 56 đoạn nội
   dung cặp), nên phải MỞ RỘNG script trước rồi mới sinh lại.
4. **Gọi đội dev app chủ 30 phút** — React bản mấy · có Tailwind không · lead đi vào đâu.
5. **Gọi 5 phụ huynh vừa nghỉ** — mục tiêu cả dự án là giữ chân mà **chưa ai đo vì sao họ
   đi**; lý do có thể chẳng liên quan gì tới thứ đang xây.
6. **Duyệt câu chữ trang A4** — bản nháp đã có ở `docs/huong-dan-giao-vien-va-sale.md`
   (nói gì trong 30 giây · ba điều CẤM nói · ba câu hỏi hay gặp · 🔴 luật máy demo). Đọc
   hết mất 3 phút; duyệt xong là đưa được cho giáo viên.

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
| 28/08/2026 | **JSON Ở LẠI trong tệp sao lưu, chỉ chìm xuống `_may-doc/`** kèm tệp *ĐỌC TRƯỚC.txt* | Chủ dự án phàn nàn "một số file JSON không đọc được" và muốn chỉ còn PDF. Bỏ hẳn JSON là **giết nút Khôi phục vừa xây hôm qua**, và biến bản sao lưu thành bản xuất — mất máy là mất sổ, không cứu được. Giữ cả hai: phần người đọc ở gốc, phần máy đọc chìm xuống dưới và tự khai mình là gì |
| 28/08/2026 | **Nới bề rộng theo LOẠI nội dung, KHÔNG full-width tất cả** | Chủ dự án nêu đúng vấn đề (màn 1920px thừa hai phần ba) nhưng cách sửa hiển nhiên lại hại đúng thứ cần sửa: sản phẩm này nội dung chính LÀ chữ để phụ huynh đọc, và dòng 200 ký tự làm mắt lạc dòng. Lưới thẻ và bố cục nhiều cột thì nới; đoạn văn và màn làm bài giữ ~70 ký tự/dòng, **có cửa canh chiều giữ** |
| 28/08/2026 | **Thư mục trong `.zip` mang TÊN THẬT**, lật hàng rào *"tên không vào tệp xuất"* của ADR-005 | Chủ dự án chốt. Cả hạng mục sinh ra để tệp `.zip` mở ra là đọc được — `Nguoi-1/`, `Nguoi-2/` thì mất đúng thứ đang cần. Và đã có tiền lệ: `16.6` đặt tên tệp PDF theo tên người. Tên tệp JSON thì VẪN không mang tên, vì ở đó bỏ tên đi là miễn phí |
| 28/08/2026 | **Dải chọn bản chỉ cho XEM lần lượt, KHÔNG so sánh** | Việc so hai bài có sàn 90 ngày vì một nấc trả lời dịch điểm 4–10 điểm. Thêm một đường vòng qua sàn đó là lật một quyết định đã chốt, và lật một cách âm thầm. Có cửa canh: dải này cấm cả các chữ *tăng · giảm · thay đổi · tiến bộ* |
| 28/08/2026 | **Đo TRƯỚC khi thiết kế cho việc sinh nhiều tệp PDF** (`17.1`) | Lo 42 tệp × font 133 KB thành vài chục MB và treo máy. Đo thật: **0,48 giây / 2,65 MB**, vì jsPDF tự cắt font. Nhờ đo trước mà **bỏ được** thanh tiến trình đếm từng tệp và cơ chế nhường luồng — ít mã hơn, và vì đã đo chứ không phải vì lười |
| 28/08/2026 | **Thêm `jspdf` — nhưng NẠP LƯỜI là ĐIỀU KIỆN KÈM THEO** (ADR-009) | Ràng buộc *"chỉ `jszip`"* không phải luật đạo đức; nó là cách kiểm soát hai rủi ro. Rủi ro chuỗi cung ứng trả bằng `quet-ma-doc` **trước khi import một dòng nào** (verdict 🟢 XANH). Rủi ro cỡ gói trả bằng `await import()` **cộng hai cửa canh**. Người không bấm *Sao lưu* trả thêm đúng **5 KB** |
| 28/08/2026 | **Mặt tiền kho giữ NGUYÊN tên hàm cũ, không đổi 13 file giao diện** | `kho-bai.ts` thành mặt tiền đi qua sổ đăng ký `KhoDisc`. Đổi 13 file sang `kho().luuBai(...)` là hàng trăm dòng đổi, một đợt test đỏ, và **0 giá trị** cho người dùng trước ngày phát — trong khi `datKho()` vẫn thay được toàn bộ. Bản dựng GIẢ trong test chứng minh ổ cắm là ổ cắm thật |
| 28/08/2026 | **`saoLuuTatCa()` giữ chữ ký MỘT tham số; PDF đi qua hàm thứ hai** | Chữ ký một-tham-số LÀ một hàng rào, có test khẳng định `toHaveLength(1)` để chặn đúng cái bẫy cũ (thêm `boDe?` rồi nút sao lưu chỉ lấy một phần). Nới cửa cho một lý do chính đáng hôm nay là mở sẵn nó cho một lý do không chính đáng ngày mai |
| 28/08/2026 | **Thẻ của người CHƯA có hồ sơ thì KHÔNG mang màu nhóm** | Đoán một nhóm cho người chưa làm bài là dán nhãn họ bằng một con số chưa từng tồn tại — đúng thứ ADR-002 cấm. Thẻ trung tính là câu trả lời đúng: *chưa biết* |
| 28/08/2026 | **Font PDF để ở `public/`, KHÔNG nhúng base64 vào JS** | Nhúng thì +33% cỡ và nằm trong chunk JS; đặt ở `public/` thì trình duyệt cache riêng, tệp `.ttf` chỉ tải một lần trong đời máy đó. Đổi lại: xuất PDF cần một lượt `fetch` cùng nguồn — đã ghi rõ trong mã để người sau khỏi tưởng là bỏ sót |
| 28/08/2026 | **GIỮ ADR-001 — không backend.** Dữ liệu lên server là việc của app chủ, khoang DISC chỉ **tách tầng lưu trữ sẵn** (`16.4`) | Chủ dự án muốn "đăng nhập máy khác vẫn thấy". Làm ngay thì công ty thành bên xử lý dữ liệu cá nhân TRẺ EM (NĐ 13/2023) — đúng thứ ADR-001 đã cố ý mua đường tránh — và cần đội dev app chủ, những người **chưa ai hỏi họ có nhận không**. Tách tầng tốn 5 giờ, cắm server sau không phải sửa một dòng giao diện |
| 28/08/2026 | **Thêm thư viện PDF, nhưng NẠP LƯỜI là điều kiện kèm theo** (ADR-009 sẽ viết) | Sinh PDF có dấu tiếng Việt buộc phải nhúng font. `await import()` giữ gói chính ở **282 KB nén**; ai không sao lưu thì không trả đồng nào. Kèm cửa kiểm cỡ gói vì một `import` tĩnh lỡ tay thì build vẫn xanh, test vẫn xanh, chỉ điện thoại 3G là chịu |
| 28/08/2026 | **Sao lưu `.zip` giữ CẢ PDF lẫn JSON** | Chủ dự án muốn "chỉ PDF", nhưng nút Khôi phục cần thứ máy đọc được. PDF nằm ngoài cho người, JSON trong `du-lieu/` cho máy — mở zip vẫn thấy PDF trước |
| 28/08/2026 | **Đồ cũ không dùng thì CÁCH LY vào `cu/`, không xoá** | Chủ dự án chốt. Xoá sớm tiết kiệm vài KB mà mất một bản dựng đã chạy đúng. Luật MỘT CHIỀU (`app`/`modules`/`config` không được import từ `cu/`) có `tests/vung-cach-ly.test.ts` canh — một thư mục tên "cũ" mà không có cửa canh thì chỉ là một cái tên |
| 28/08/2026 | **Cờ `MO_NOI_DUNG_TRE` chặn ở BA chỗ, không phải một** | Ẩn nút ở thẻ là chuyện TRÌNH BÀY; khoang làm bài là cửa chặn NỘI DUNG; bản phân tích là chỗ thứ ba vì một lát cắt "Mẹ ↔ bé" LÀ nội dung nói về bé, dù bé có bài từ trước khi tắt cờ |
| 28/08/2026 | **Nút mời gửi ĐƯỜNG DẪN, không phải mã QR** | Mã mời mang một hồ sơ ĐÃ LÀM XONG đi ra; người chưa làm thì chưa có gì để gói. Lẫn hai chiều là bày ra một nút bấm vào rồi chẳng dẫn tới đâu |
| 28/08/2026 | 🔴 **PHÁT ĐỦ CẢ PHẦN TRẺ KHI CHƯA CÓ CHỮ KÝ CHUYÊN MÔN** — chủ dự án chốt và chịu trách nhiệm | Máy đã trình bày rủi ro: 68KB nội dung nói về trẻ chưa ai chuyên môn duyệt, và người đọc là khách ĐANG TRẢ HỌC PHÍ nên thiệt hại rơi vào uy tín app chủ chứ không riêng khoang DISC. Chủ dự án nghe và vẫn chọn phát. **Không hỏi lại.** Bảo hiểm: cờ `V4.1` tắt riêng phần nội dung trẻ trong 30 giây khi cần |
| 28/08/2026 | **Luồng 3 bước trong MỘT mục thanh bên**, lật phần "tuần tự" của ADR-007 | Chủ dự án chốt; **không hỏi lại vì sao khác luồng cũ**. Bảng gia đình GIỮ NGUYÊN bên trong bước 1, nên điều ADR-007 lo — *"nhìn một cái biết ai chưa làm"* — vẫn còn. Sổ mới `PLAN_V2.md`, sổ cũ `PLAN.md` chỉ để tra cứu |
| 28/08/2026 | **Mọi bài phải thuộc một người trong sổ** · **bài quan sát chuyển sang thẻ của CON** · **màn Số liệu ẩn sau `?so-lieu=1`** | Thẻ bố mẹ chỉ còn bài về chính họ — đúng yêu cầu. Nhưng mầm non và lớp 1–2 BẮT BUỘC có người lớn trả lời hộ (ADR-002), nên nút đó chuyển về thẻ đứa trẻ chứ không xoá. Màn Số liệu ẩn khỏi phụ huynh nhưng giữ cửa sau, vì nó là chỗ DUY NHẤT đọc được `baiThuHai` |
| 28/08/2026 | **Đồ cũ không dùng trong luồng mới thì CÁCH LY, không xoá** | Chủ dự án chốt. Ở `V5.1` chỉ **ẩn khỏi điều hướng**, chưa dời file: dời là hàng trăm dòng đổi đường dẫn + một đợt test đỏ, đổi lại 0 giá trị cho người dùng trước ngày phát |
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

> Bài học riêng của miền LƯU TRỮ (kho · sao lưu · khôi phục · hạn mức · ba đời tệp `.zip`)
> nằm ở `modules/core/OVERVIEW.md` mục 6 — **đừng chép lại vào đây**.

- 🔴 **jsdom CÓ HAI REALM, VÀ CÂU BÁO LỖI KHÔNG HỀ NHẮC TỚI ĐIỀU ĐÓ** (28/08/2026,
  `17.4`). Fixture dựng bằng `new TextEncoder().encode()` cho ra một `Uint8Array` mà phép
  `instanceof Uint8Array` **bên trong JSZip trượt** — JSZip ném *"Can't read the data of
  'x'. Is it in a supported JavaScript type?"*, đọc lên như thể dữ liệu sai kiểu. Sản phẩm
  thật chạy trong trình duyệt một realm nên **không dính**; đây thuần tuý là tật của môi
  trường test. **Dùng `Uint8Array.from()`.** Và bài học chung: trước khi đi sửa sản phẩm vì
  một test đỏ, hỏi xem test có đang chạy trong cùng thế giới với sản phẩm không.
- 🔴 **`endsWith()` TRÊN TÊN TỆP BẮT TRÚNG CẢ TÊN DÀI HƠN** (28/08/2026, `17.7`). Bộ tìm
  file của cửa kiểm bố cục dùng `t.endsWith("ket-qua.tsx")` — và nó khớp `chon-ban-ket-qua.tsx`,
  rồi lặng lẽ đi soi nhầm file. Cùng một họ với bẫy đã cắn ở `11.6`: biệt danh `"Bi"` khớp
  vào chữ `"**Bi**ệt danh"`. **So khớp tên tệp thì so ĐÚNG tên**, không so đuôi.
- **Đo TRƯỚC khi thiết kế thì gỡ được cả một mảng việc** (28/08/2026, `17.1`). Kế hoạch có
  hẳn một thanh tiến trình đếm từng tệp và cơ chế nhường luồng, dựng cho nỗi lo 42 tệp PDF
  làm treo máy. Đo ra **0,48 giây** — vì jsPDF tự cắt font, mỗi tệp chỉ 48 KB, nhỏ hơn cả
  tệp font gốc. Bỏ được cả hai cơ chế. **Một hạng mục ĐO đặt ở đầu gói rẻ hơn nhiều so với
  một hạng mục TỐI ƯU đặt ở cuối** — và nó còn có thể nói cho biết là không cần tối ưu.
- 🔴 **NÚT SAO LƯU CHỈ ĐỌC MỘT TRONG BA BẢNG — LỜI HỨA CỨU DỮ LIỆU LÀ LỜI HỨA SUÔNG**
  (28/08/2026, `16.5`). `saoLuuTatCa()` gọi `docTatCa()` rồi thôi. Kho lên v2 ba bảng từ
  GĐ12 mà hàm sao lưu không ai đụng tới — nên phụ huynh bấm *Sao lưu*, nhận một tệp trông
  như đủ, yên tâm, rồi mất máy là mất **tên của cả nhà và mọi bản phân tích**. Đây là lần
  thứ HAI cùng một lỗi trong một tuần (lần đầu: nút *Xoá sạch*, `V3.1`). **Thêm một bảng
  vào kho thì phải đi hỏi lại MỌI hàm nói "tất cả" xem chúng có biết bảng mới không** — và
  danh sách đó gồm cả hàm ĐỌC, không chỉ hàm XOÁ.
- 🔴 **CỬA KIỂM CHẠY TRONG jsdom KHÔNG ĐO ĐƯỢC LAYOUT, VÀ NÓ IM LẶNG KHI KHÔNG ĐO ĐƯỢC**
  (28/08/2026, `16.9`). jsdom không có bộ dựng layout: `offsetWidth` luôn 0,
  `getBoundingClientRect()` trả về số không. Một test *"không phần tử nào rộng hơn 320px"*
  viết ở đó **luôn xanh, kể cả trên một trang tràn ngang thảm hại** — tệ hơn không có cửa,
  vì nó khiến người ta thôi kiểm bằng mắt. Cửa phải canh thứ jsdom ĐO ĐƯỢC THẬT, và phải
  nói thẳng phần nó không phủ.
- 🔴 **CỬA KIỂM TỰ NÉM CŨNG LÀ ĐỎ — ĐỌC KỸ TRƯỚC KHI ĐI SỬA THỨ ĐANG ĐÚNG** (28/08/2026,
  `16.7`). Cửa đo tràn viewBox báo đỏ ở robot S. Lỗi không ở hình: bộ đọc `path` của chính
  cửa kiểm chưa hiểu lệnh cong `q`. Suýt đi sửa một hình đang đúng. Bản vá đầu tiên còn sai
  theo hướng ngược lại: lớp ký tự phủ định `[^MmLlHhVvQqTtZz]*` **nuốt luôn** chữ `C` của
  lệnh cong bậc ba, nên cửa im lặng đúng lúc cần nó kêu. **Phát hiện lệnh lạ phải soi CHỮ
  CÁI, không soi "phần thừa còn lại sau khi cắt".**
- **Sổ kế hoạch trỏ vào một cửa kiểm KHÔNG làm việc nó tưởng** (28/08/2026, `16.8`). Sổ ghi
  *"mở rộng `tests/do-chu.test.ts` (đo tương phản)"*, nhưng file đó đo **chữ có vừa khung
  không**; còn mã đo tương phản kiểu canvas 1×1 mà mục cạm bẫy này nhắc thì **không còn
  trong repo** — nó là phép đo Playwright thời GĐ7, chỉ còn lại bài học. **Đo trên mã thật
  trước dòng code đầu tiên**, kể cả khi sổ nói rất chắc chắn.
- 🔴 **"ĐANG TẢI" TRÔNG Y HỆT "ĐÃ MỞ" — và đó là một lỗi ĐUA nhìn như lỗi giao diện**
  (28/08/2026, `V2.1`). Khung ba bước dựng xong TRƯỚC khi đếm xong kho, nên có một khoảnh
  khắc `dem` còn `null` và hàm khoá trả `null` cho mọi bước. Người dùng thấy bước 3 sáng
  trưng rồi tắt đi; test thì **xanh trên máy rảnh và đỏ lác đác khi chạy cả bộ, mỗi lượt một
  cửa khác nhau** — kiểu đỏ khó truy nhất. Sửa ở SẢN PHẨM (chưa đếm xong thì chưa vẽ bước
  nào), không sửa ở test. **Trạng thái "chưa biết" phải khác trạng thái "biết rồi và bằng
  không" — gộp hai cái đó là mầm của cả lỗi giao diện lẫn lỗi test.**
- **Bọc IIFE async trong một hàm async khác mà không `await` là dựng một cuộc đua**
  (28/08/2026, `V0.3`). Test đọc ra 7 người nhưng 0 bài — bảng ghi TRƯỚC kịp đáp, bảng ghi
  SAU thì chưa — và nó trông y hệt "bộ nạp hỏng". Suýt đi sửa mã lành.
- **Cửa kiểm hỏi CẢ TRANG thay vì hỏi ĐÚNG VÙNG sẽ cấm luôn thứ nó phải cho phép**
  (28/08/2026, `V2.1`). Cửa "thanh bên không còn mục Nhà mình" hỏi `screen.queryByRole`
  trên toàn trang, và bắt trúng tấm bước 1 — vốn TÊN LÀ "Nhà mình" và nằm đúng chỗ của nó.
  Hỏi trong `<aside>` mới là hỏi đúng câu.
- **Một cờ chỉ được thử ở trạng thái đang bật thì đúng bằng không có cờ** (28/08/2026,
  `V4.1`). Ngày cần tắt là ngày đầu tiên nó chạy thật, và đó là ngày tệ nhất để phát hiện
  nó hỏng. `tests/co-noi-dung-tre.test.tsx` giả lập `config/disc-nguong` để chạy CẢ HAI
  trạng thái.

- 🔴 **MỘT HÀM ĐỌC THIẾU MỘT TRƯỜNG ĐÃ KHOÁ NGUYÊN NHÓM NGƯỜI DÙNG SUỐT BA GIAI ĐOẠN**
  (28/08/2026, `V1.3`). `boDeCuaThanhVien()` định tuyến bộ đề chỉ từ `tv.lop`, **không đọc
  `vaiTro`**. Bố mẹ không có lớp ⇒ `null`; trẻ mầm non ⇒ `Number("mam-non")` ra `NaN` ⇒
  cũng `null`. Cả hai bị đá về màn *"Ai đang cầm máy?"* — nghĩa là **bấm "Làm bài" trên
  thẻ của Mẹ thì không vào được bài của Mẹ**, đúng nhóm người mà GĐ11–GĐ14 xây cho.
  1.115 test xanh không thấy, vì test chỉ hỏi *"form lưu được không"*, chưa ai hỏi
  *"người này rồi có vào được bài của họ không"*. **Cùng vết xe với bảng đại từ khoá một
  chiều ở GĐ10: khi định tuyến theo X, hỏi ngay X có đủ chiều không.**
- 🔴 **`Number()` trên một sentinel bằng CHỮ ra `NaN`, và `NaN` lọt qua mọi phép so sánh
  mà không ai biết** (28/08/2026). Đó là nửa sau của lỗi trên. Nay chỉ `soLopCua()` ở
  `config/disc-nguong.ts` được phép đổi bậc học thành số, và nó trả `undefined` chứ không
  bao giờ trả `NaN`. Gọi `Number(tv.lop)` rải rác là cách lỗi này quay lại.
- 🔴 **SỬA MỘT HÀM MÀ QUÊN THỨ NÓ TRẢ RA CŨNG LÀ MẤT DỮ LIỆU** (28/08/2026, `V1.3`). Cùng
  hàm đó còn **vứt luôn `giaiThich`**: em lớp 1–2 vào bài từ thẻ bị chuyển sang bản người
  lớn trả lời **không một chữ giải thích**, trong khi `DISC_BA.md` §4.2 ghi văn bản đó là
  BẮT BUỘC hiện. Màn 1 có hộp giải thích nên không ai ngờ đường thứ hai lại thiếu.
  **Thêm một lối vào cho một màn thì phải kiểm lối đó có mang đủ thứ màn kia mang không.**
- **Bọc một IIFE async trong một hàm async khác mà không `await` là dựng một cuộc đua**
  (28/08/2026, `V0.3`). Test đọc ra 7 người nhưng 0 bài — bảng ghi TRƯỚC kịp đáp, bảng ghi
  SAU thì chưa — và nó trông y hệt "bộ nạp hỏng". Suýt đi sửa mã lành. `eval` trả về giá
  trị của biểu thức cuối; phải `await` đúng lời hứa đó.
- **Ô thừa trên form đẻ ra dữ liệu mồ côi, và dữ liệu mồ côi thì âm thầm đổi hành vi**
  (28/08/2026, `V1.2`). Bản cũ hỏi lớp cho MỌI vai. Một ông bố từng chọn "Con · Lớp 7" rồi
  đổi vai sẽ mang `lop:"7"` vĩnh viễn — ô đã ẩn nên không ai thấy — mà `laTreEm()` lại suy
  trẻ em từ chính việc CÓ lớp. Kết quả: bản phân tích cả nhà đối xử với ông ấy như một đứa
  trẻ. Phải có **hai** hàng rào: xoá lúc đổi vai, VÀ chặn lại lúc lưu cho hồ sơ cũ.

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
