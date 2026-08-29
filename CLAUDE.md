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
thu khách, 27/08/2026). Hướng đang mở: **luồng ba bước** — ADR-008.
Nguồn yêu cầu: `docs/brd/`. 🔴 **Lộ trình đang có hiệu lực: `PLAN_V3.md`** (service worker
chịu cập nhật + đường ra host thật, chốt 28/08/2026). **Hai sổ cũ chỉ còn để TRA CỨU *vì
sao*, đừng tick thêm ô nào ở đó:** `PLAN_V2.md` (GĐ15–GĐ18 + luồng ba bước; hai ô còn mở
`V0.1`/`V0.2` đã chuyển thành `21.1`/`22.1` của sổ V3) · `PLAN_V1_LUU.md` (tên cũ
`PLAN.md`, 68 hạng mục GĐ0–GĐ14).
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

## TRẠNG THÁI (cập nhật 29/08/2026 — GĐ23–GĐ25 xong, sổ V4 HẾT VIỆC MÁY)

> 🔴 **Bàn giao chi tiết cho phiên sau nằm ở ĐẦU `PLAN_V4.md`** (mục *BÀN GIAO PHIÊN GẦN
> NHẤT*): làm tiếp từ file nào · đã đo gì đừng đo lại · lệnh nên chạy. Đọc chỗ đó trước.

### 🟢 ĐÃ XONG

**`PLAN_V4.md`: 8/10 ô ✅** — GĐ23 (mã mời) · GĐ24 (bảo mật) · GĐ25 (context + dọn rác).
Hai ô còn lại chặn bởi NGƯỜI/NGOÀI. Ba sổ cũ (`V3` 7/10 · `V2` 25/27 · `V1_LUU` 68/68) đã
đóng — chỉ để tra *vì sao*, đừng tick thêm.

**1.428 test xanh** · `npm run kiem` + `npm run build` xanh · **gói chính 290 KB gzip**
(trần 300). 🔴 **Chưa push** commit của phiên 29/08.

**Ba thứ vừa đổi:** ① **mã mời TẮT** bằng cờ `MO_MA_MOI` chặn ở ba lớp — nhận lại trần
*"cả nhà dùng chung một máy"*, đổi lấy việc gỡ blocker quét QR hai điện thoại; dữ liệu của
ai đã từng nhận hồ sơ qua mã **không mất một mẩu nào**, có cửa canh riêng. ② **bản deploy
nay có áo giáp** — `out/_headers` sinh CSP theo **băm mỗi bản build**. ③ **dự án nhẹ đi 80%
phần nạp mỗi lượt** — kho tra cứu tách sang `docs/so-seo.md` + `docs/decisions/nhat-ky-quyet-dinh.md`,
không xoá một chữ.

### 🔴 VIỆC NGƯỜI ĐANG CHẶN MỐC PHÁT

0. 🔴 **Bấm DEMO CUỐI của GĐ23 và GĐ25** trong `PLAN_V4.md` — máy không tự bấm được.
1. 🔴 **Tài khoản Cloudflare + một tên miền** (`26.1`) — **blocker cứng của ngày phát, và
   không code nào cứu được**. Chưa có `infra.json`, chưa ai bấm deploy lần nào.
   🔴 Sau khi deploy phải mở DevTools ▸ Console kiểm **không một vi phạm CSP nào** — đây là
   chỗ DUY NHẤT kiểm được `24.1`, vì máy chủ chạy thử không gửi `_headers`.
2. **Bấm thử GĐ18 bằng mắt** (`26.2`) — 7 việc ở *DEMO CUỐI* 18A/18B/18C trong `PLAN_V2.md`.
4. **Gửi hai hồ sơ ký duyệt.** 🔴 Gói B nay RỘNG HƠN (`14.3` thêm nội dung vợ ↔ chồng).
   ⚠️ Chạy lại `scripts/xuat-noi-dung-ky-duyet.mjs` **KHÔNG ĐỦ** — script không import
   `config/disc-noi-dung-cap.ts`, phải MỞ RỘNG nó trước.
5. **Gọi đội dev app chủ 30 phút** · **gọi 5 phụ huynh vừa nghỉ** · **duyệt trang A4**
   (`docs/huong-dan-giao-vien-va-sale.md`).

### CHỜ NGOÀI (ghi vào đây rồi làm tiếp, đừng dừng)

- 🔴 **HAI chữ ký chuyên môn.** **Gói A** `docs/noi-dung-cho-ky-duyet.md` (nội dung về TRẺ,
  *chặn ngày ra người dùng thật*). **Gói B** `docs/noi-dung-cho-ky-duyet-goi-b.md` (người
  lớn về chính họ **và bạn đời**; *chỉ chặn phần của nó*, chưa ký vẫn phát được).
- 🔴 **Đo lý do phụ huynh rời đi** — mục tiêu cả dự án là giữ chân mà **chưa ai đo vì sao
  họ đi**. *Chặn: cả bốn giai đoạn có nhắm đúng chỗ không.*
- **Chốt nghi thức mời của trường** · **thu 30–50 phản hồi thật** rồi chạy
  `node scripts/phan-tich-item.mjs` → Cronbach α (lúc DUY NHẤT được nói về độ tin cậy).

### 🔴 CON SỐ CẦN THEO DÕI SAU KHI PHÁT

**`baiThuHai`** — đọc ở `?so-lieu=1`. Nó là giả định đang đỡ 9,5 ngày của GĐ14: *một phụ
huynh triệu tập được từ hai người trở lên cùng làm bài*. Tới hôm nay giả định đó có **0
quan sát ủng hộ và 1 quan sát phản bác**. **Bằng 0 sau 30 máy thật thì thứ cần xem lại là
giả định, không phải phần mềm.**

Chạy thử: `npm run xem-thu` → http://localhost:3100 (`?so-lieu=1` để đọc phễu).

> Quyền ghi repo: **đã có** (`hodacphuchtc`, token scope `repo` + `workflow`).
> **Không cần Supabase, không cần Vercel** — `docs/decisions/ADR-001-khong-backend.md`.

## KHO TRA CỨU — ĐỌC KHI CẦN, KHÔNG ĐỌC MỖI LƯỢT

> 🔴 Hai kho dưới đây **tách khỏi file này ngày 29/08/2026** (`25.1`), chuyển nguyên văn,
> **không xoá một chữ nào**. Chúng là thứ để TRA, không phải luật phải nạp mỗi lượt trao
> đổi — để trong đây thì chúng ngốn ~13.600 token của **mọi** lượt, mọi phiên, mãi mãi.

| Kho | Ở đâu | Đọc khi nào |
| --- | --- | --- |
| **Sổ sẹo** — 44 bài học TOÀN HỆ đã trả giá | `docs/so-seo.md` | 🔴 **Trước khi sửa vùng nào thì `grep` theo từ khoá vùng đó.** Ví dụ: `grep -n "service worker" docs/so-seo.md` |
| **Nhật ký quyết định** — 52 dòng *vì sao đã chọn như vậy* | `docs/decisions/nhat-ky-quyet-dinh.md` | Khi định lật một quyết định cũ, hoặc khi thấy mã làm một việc trông vô lý |

**Luật ghi:** cạm bẫy mới ghi vào `docs/so-seo.md`, quyết định mới ghi vào
`docs/decisions/nhat-ky-quyet-dinh.md` — **KHÔNG ghi ngược vào file này.** File này là
hiến pháp; hai file kia là kho. Trộn lại là quay về đúng chỗ vừa đi ra.

**Bài học riêng của một miền thì ghi ở miền đó, đừng chép sang kho chung:** LƯU TRỮ →
`modules/core/OVERVIEW.md` mục 6 · BÁO CÁO → `modules/report/OVERVIEW.md` mục 6 ·
CÔNG CỤ → `.claude/rules/tech-defaults.md` mục cuối.
