# PLAN_V4.md — Lộ trình đang có hiệu lực

## BÀN GIAO PHIÊN GẦN NHẤT

> 🔴 **GHI ĐÈ mỗi phiên** — khối mới THAY khối cũ, không xếp chồng. Trần 40 dòng.

**31/10/2026 — GĐ29: PHẦN MÁY XONG, ĐÃ PUSH (`7b2f39d`), CHƯA AI BẤM THỬ.**

**1. Vừa xong.** GĐ27 + GĐ28 + **GĐ29** đã push (GĐ29 = 4 commit, đỉnh `7b2f39d`). GĐ29: phân tích sâu cho MỌI
cặp trong nhà (người lớn↔người lớn, người lớn→trẻ, trẻ→người lớn, cùng nhịp) × 3 bậc trẻ, xưng hô
trung tính, giao diện đọc nhanh cho phụ huynh (điện thoại + web). **2.195 test xanh**, gói chính
**~295 KB / 300** (dư ~5 KB). Không ô nào tick (luật dự án: chỉ tick khi có người bấm thử).

**2. Đang dở.** Không còn việc máy ở GĐ29. Việc kế: **chủ dự án BẤM thử** `npm run xem-thu` (cổng 3100)
với dữ liệu bịa. 🔴 Chrome extension chưa kết nối nên **chưa ai nhìn bằng mắt** màn nào của GĐ29.

**2b. Cần anh quyết (không phải việc máy):** khối "Hiểu nhau để thương nhau hơn" ở bước 3 (xung đột với
luật `CHU_THONG_DIEP`) · ưu tiên bản bé TỰ LÀM khi phân tích.

**3. Chặn ở NGƯỜI / NGOÀI.** `26.1` Cloudflare + tên miền · `26.2` bảy việc bấm GĐ18 · hai chữ ký.
🔴 **Hồ sơ ký đổi nội dung LẦN NỮA** (thêm A-NL→TRẺ, A-TRẺ→NL, A-CÙNG-NHỊP, B6) — gửi lại nếu đã gửi.

**4. 🔴 ĐÃ ĐO, ĐỪNG ĐO LẠI.**
- Nạp lười `KhungTestLai`/`ThongBaoDaXong` làm gói chính TĂNG (Next preload khối lười nằm trong cây
  dựng sẵn vào index.html) — đừng thử lại.
- Nạp lười cả màn `ban-tong-hop` hạ ~4 KB — cái này có tác dụng.
- Khối lười dùng cấp tiêu đề khác h2 vì test M5 đếm h2.
- Gói chính: `disc-noi-dung-doi` và `disc-dong-hanh` PHẢI nạp lười; chunk lười nằm trong
  `out/danh-sach-cache.json`, không trong index.html.
- Node v26: `execArgv` trong `vitest.config.mts`; `semgrep` chưa cài ở máy (CI chạy).

**5. Cạm bẫy** — `docs/so-seo.md` (đã thêm 4 bài mới của GĐ29).

**6.** Cây làm việc sạch, `main` khớp `origin/main`.

**7. Lệnh phiên sau.**
```bash
npm run kiem      # 2.195 test (semgrep báo thiếu — bình thường trên máy này)
npm run xem-thu   # cổng 3100
node scripts/xuat-noi-dung-ky-duyet.mjs   # sau mỗi lần sửa nội dung cặp / đồng hành
```

---

> **Sổ này thay `PLAN_V3.md`.** Ba sổ cũ (`V3`, `V2`, `V1_LUU`) chỉ còn để tra *vì sao* các
> hạng mục cũ làm như vậy.
>
> **Nguyên tắc đọc:** mỗi Giai đoạn kết thúc bằng một thứ chủ dự án **tự bấm thấy được**,
> không nghiệm thu bằng câu "đã viết xong module". Mỗi hạng mục có 4 dòng: **(a)** làm gì ·
> **(b)** kiểm chứng bằng thao tác nào · **(c)** test tự động nào chạy · **(d)** ước lượng.
> Hạng mục bị người/dịch vụ ngoài chặn thì có thêm dòng **(e) chặn:**.
> **Luật tick:** chỉ tick ✅ khi (b) đã bấm thật **và** (c) đã xanh.
> 🔴 = rủi ro cao, **cố ý xếp sớm nhất**.

**Mục tiêu sổ này:** sản phẩm **gọn hơn, nhẹ hơn, và mặc áo giáp trước khi ra internet** —
mà không mất một dữ liệu nào của gia đình đã dùng.

**Ba việc chuyển từ sổ V3 sang:** `21.1` → **`26.1`** (host) · `22.2` → **`26.2`** (bấm
mắt GĐ18). 🔴 `22.1` (quét QR hai điện thoại) **HUỶ** — `23.1` tắt mã mời thì không còn gì
để quét. Đây là blocker ngày phát **thứ hai** được gỡ, và gỡ bằng cách bỏ tính năng chứ
không phải bằng cách làm xong.

---

## RÀNG BUỘC TOÀN DỰ ÁN (mọi hạng mục đều phải tuân)

- **Không backend, không CSDL, không API** (ADR-001). Dữ liệu ở IndexedDB + localStorage
  của chính máy người dùng.
- **Thư viện ngoài:** `jszip` + `jspdf` (ADR-009, chỉ nạp lười). **Không thêm gì khác** —
  riêng sổ này: **không công cụ phân tích bundle, không thư viện đo hiệu năng**.
- **Tầng lõi** (`modules/**`, `config/**`) = hàm thuần, không React không DOM (ADR-004).
- **Hằng nghiệp vụ đọc từ `config/`**; **chữ hiển thị gom ở `config/disc-tu-dien.ts`**.
- **Trần gói chính 300 KB gzip** — `scripts/kiem-co-goi.mjs` canh. Mốc hiện tại 290 KB.
- 🔴 **Repo PUBLIC.** Không dữ liệu thật của trẻ, không họ tên, không số điện thoại cá nhân
  vào bất kỳ file nào.

---

## 🔴 GIAI ĐOẠN 23 — Mã mời tắt được, và rút lại được

> **Vì sao xếp ĐẦU TIÊN.** Không phải vì nó khó nhất, mà vì nó **quyết định cái gì là rác**:
> `modules/core/gia-dinh/ma-moi.ts` (294 dòng), `app/components/ma-qr.tsx`, hai component
> mã mời. Dọn rác trước rồi mới tắt tính năng là dọn hai lượt.
>
> 🔴 **Và vì nó là hạng mục DUY NHẤT trong sổ có thể làm MẤT DỮ LIỆU.** Trường `nhanQuaMa`
> có sáu đường đọc; cắt nhầm một đường là làm một thành viên biến mất khỏi bản phân tích cả
> nhà — im lặng, không lỗi, không test nào đỏ. Cùng họ với `16.5`.

**Bối cảnh:** chủ dự án chỉ vào khối *"Nhận một mã mời"* và yêu cầu bỏ. Tính năng có **hai
nửa**: **GỬI** (`KhoiMaMoi`, [ket-qua.tsx:288](app/khoang/ket-qua.tsx#L288) — QR sau khi
làm xong bài) và **NHẬN** (`NhanMaMoi`, [bang-gia-dinh.tsx:221](app/khoang/bang-gia-dinh.tsx#L221)
— đúng khối trong ảnh). Bỏ riêng nửa NHẬN thì nửa GỬI thành ngõ cụt: quét QR xong không còn
chỗ nhập. **Chốt: bỏ CẢ HAI, bằng CỜ.**

**Cái giá, đã nói và đã chốt:** quyết định 27/08 ghi mã mời là cách gỡ trần *"cả nhà dùng
chung một máy"* mà không phá ADR-001. Tắt nó là nhận lại cái trần đó. Đổi lại: gỡ blocker
`22.1`. **Không hỏi lại.**

- [x] 🔴 **23.1 — Cờ `MO_MA_MOI`, chặn ở BA lớp**
  - **(a)** Thêm `export const MO_MA_MOI = false;` vào `config/disc-nguong.ts`, cạnh
    `MO_NOI_DUNG_TRE`, kèm chú thích ghi rõ cái giá. Chặn ở **ba lớp khác nhau** theo bài
    học `V4.1` (*"cờ chặn ở BA chỗ, không phải một"*):
    ① **trình bày, nửa GỬI** — `ket-qua.tsx:288` thành `{MO_MA_MOI && ketQua.hopLe && <KhoiMaMoi …>}`
    ② **trình bày, nửa NHẬN** — `bang-gia-dinh.tsx:221` thành `{MO_MA_MOI && onNhanMa && <NhanMaMoi …>}`
    ③ **đường GHI** — `nhanMa()` ở [nha-minh.tsx:114](app/khoang/nha-minh.tsx#L114) thêm
    `if (!MO_MA_MOI) return false;` ngay đầu hàm. **Lớp ③ quan trọng nhất**: chặn ở trình
    bày mà để đường ghi mở thì vẫn đẻ ra hồ sơ mới khi cờ đã tắt.
    🔴 **TUYỆT ĐỐI KHÔNG đụng sáu đường ĐỌC `nhanQuaMa`:**
    [cac-buoc.tsx:76](app/khoang/cac-buoc.tsx#L76) · [phan-tich.tsx:61](app/khoang/phan-tich.tsx#L61)
    · [bang-gia-dinh.tsx:293](app/khoang/bang-gia-dinh.tsx#L293) · [ban-tong-hop.tsx:65](app/khoang/ban-tong-hop.tsx#L65)
    · [tai-sao-luu.ts:92](app/tai-sao-luu.ts#L92) · [noi-dung-ket-qua.ts:51](modules/report/noi-dung-ket-qua.ts#L51).
  - **(b)** `npm run xem-thu` → `localhost:3100`. Bảng gia đình bước 1: **không còn** khối
    tím *"Nhận một mã mời"*. Làm xong một bài bất kỳ → màn kết quả: **không còn** khối
    *"Gửi kết quả này sang máy khác"*, **không còn mã QR**. Rồi bấm vào khối *"Còn thiếu ai"*
    → nút **mời người trong nhà VẪN CÒN và vẫn bấm được** (nó là thứ khác — nó gửi đường
    dẫn, và nó là thứ nuôi con số `bamMoi`).
  - **(c)** `tests/ma-moi-hoan-chinh.test.tsx` — 6 test mục *"đầu NHẬN"* render
    `KhoangNhaMinh` nên phải giả lập cờ BẬT (`vi.mock` `config/disc-nguong`, khuôn
    `tests/co-noi-dung-tre.test.tsx`). 6 test *"đầu PHÁT"* render thẳng `KhoiMaMoi`, không
    đụng cờ. `tests/ma-moi.test.ts` (25 cửa) + `tests/qr.test.ts` kiểm bộ mã hoá, không đụng.
  - **(d)** 0,3 ngày.

- [x] 🔴 **23.2 — Cửa canh chạy CẢ HAI trạng thái cờ**
  - **(a)** File mới `tests/co-ma-moi.test.tsx` theo khuôn `tests/co-noi-dung-tre.test.tsx`.
    **Cờ TẮT:** không còn ô nhận trên bảng gia đình · không còn khối QR ở màn kết quả ·
    `nhanMa()` từ chối và kho **không mọc thêm** thành viên nào.
    🔴 **Cửa quan trọng nhất của cả sổ:** dựng sẵn một thành viên có `nhanQuaMa` rồi khẳng
    định — khi cờ TẮT, người đó **vẫn hiện đủ trên thẻ, vẫn tính vào mở khoá bước 2, vẫn
    vào bản phân tích, vẫn có trong tệp sao lưu**. Đây là cửa chặn đúng kiểu mất dữ liệu im
    lặng mà `16.5` đã trả giá.
    **Cờ BẬT:** hai khối hiện lại, nhận mã vào sổ chạy đúng.
  - **(b)** Chạy `npx vitest run tests/co-ma-moi.test.tsx` → xanh. Rồi tự tay đổi
    `MO_MA_MOI` thành `true` trong `config/disc-nguong.ts`, `npm run xem-thu`, thấy **cả hai
    khối quay lại đầy đủ**; đổi về `false`, build lại, chúng biến mất. Đây là bằng chứng cờ
    **rút lại được thật**, không phải lời hứa.
  - **(c)** File mới ở trên. 🔴 Một cờ chỉ được thử ở trạng thái đang bật thì **đúng bằng
    không có cờ** — ngày cần bật lại là ngày đầu tiên nó chạy thật, và đó là ngày tệ nhất
    để phát hiện nó hỏng (bài học `V4.1`).
  - **(d)** 0,4 ngày.

### DEMO CUỐI GĐ23 — chủ dự án tự bấm

1. Bảng gia đình: **không còn** khối *"Nhận một mã mời"*.
2. Làm xong một bài → màn kết quả: **không còn** khối gửi, **không còn** mã QR.
3. Nút **mời người trong nhà** vẫn còn, vẫn bấm được.
4. 🔴 Nếu máy anh từng nhận một hồ sơ qua mã: người đó **vẫn còn đủ** trên thẻ, vẫn tính
   vào mở khoá bước 2, vẫn có trong bản phân tích và trong tệp `.zip` sao lưu.
5. Đổi `MO_MA_MOI = true` → build → **cả hai khối quay lại**. Đổi về `false`.

---

## 🔴 GIAI ĐOẠN 24 — Áo giáp cho bản sắp ra internet

> **Vì sao xếp thứ HAI, trước cả dọn rác.** Đây là loại lỗi **chỉ lộ ra sau khi deploy**:
> CSP sai thì local vẫn xanh, test vẫn xanh, **chỉ trang thật là trắng**. Để nó đến cuối là
> để nó nổ đúng lúc `26.1` đang chạy và không ai còn thời gian.

- [x] 🔴 **24.1 — Sinh `out/_headers` với CSP theo băm mỗi bản build**
  - **(a)** Hiện **không có** `public/_headers`. Deploy lên Cloudflare Pages ở `26.1` là ra
    một trang **không CSP, không `X-Frame-Options`, không `Referrer-Policy`** — trong khi
    trang này giữ dữ liệu DISC của trẻ trong IndexedDB. Mở rộng
    `scripts/sinh-danh-sach-cache.mjs` (đã có tiền lệ vá `out/` sau build ở `19.2`): đọc
    `out/*.html`, băm SHA-256 **từng `<script>` nội tuyến**, sinh `out/_headers` với
    `Content-Security-Policy` · `X-Content-Type-Options: nosniff` · `Referrer-Policy:
    no-referrer` · `Permissions-Policy` (tắt camera/mic/định vị — sản phẩm không dùng cái nào).
    🔴 **Ba điều phải viết thẳng vào chú thích của script, không để người sau đoán:**
    ① `script-src` dùng **băm**, không dùng `'unsafe-inline'` — nhưng **băm đổi mỗi bản
    build**, nên file này bắt buộc phải sinh tự động; gõ tay là hỏng ở lần deploy sau.
    ② `style-src` **buộc phải có `'unsafe-inline'`**: đã đo, có **8 thuộc tính `style="..."`**
    do React đặt từ `MAU.*`, và thuộc tính style thì **không băm được**. Ghi rõ là **cố ý**,
    không phải bỏ sót — người sau đọc thấy sẽ tưởng là lỗi rồi đi "sửa".
    ③ `frame-ancestors`: ADR-004 nói khoang này **sẽ được nhúng vào app chủ**. Đặt `'self'`
    là **chặn đúng thứ sắp phải cho phép**. Để một hằng `NGUON_NHUNG_CHO_PHEP` ở đầu script,
    mặc định `'self'`, kèm chú thích chỉ cho đội dev app chủ biết đổi ở đâu.
  - **(b)** 🔴 **Không bấm được ở local** — `scripts/xem-ban-phat-hanh.mjs` không gửi
    `_headers`, và nói dối về điều đó thì tệ hơn không có. Nghiệm thu bằng mắt: `npm run build`
    rồi mở `out/_headers`, đếm số `'sha256-...'` trong `script-src` — phải **đúng bằng 2**
    (số script nội tuyến đã đo). **Nghiệm thu thật nằm ở `26.1`**: sau khi deploy, mở
    DevTools ▸ Console trên trang thật — **không được có một dòng vi phạm CSP nào**, và mọi
    nút phải bấm được.
  - **(c)** File mới `tests/dau-header.test.ts`: `out/_headers` tồn tại · **số băm
    `sha256-` trong `script-src` khớp đúng số `<script>` không có `src` trong `out/index.html`**
    · có đủ bốn header · `frame-ancestors` có mặt. Guard `existsSync` để chưa build thì bỏ qua.
  - **(d)** 0,5 ngày.

- [x] **24.2 — Siết `.gitignore`, và dọn phần đã chết của nó**
  - **(a)** ① Luật `/du-lieu-thu/` chỉ chặn ở **gốc**; `docs/du-lieu-thu/` **không** bị chặn
    (đã kiểm bằng `git check-ignore`). Hôm nay trong đó là dữ liệu bịa có README khai rõ nên
    **không có sự cố** — nhưng repo là **PUBLIC**, và một lần ai đó bỏ nhầm bài làm thật vào
    đúng thư mục tên *"dữ liệu thử"* là lộ dữ liệu trẻ em (NĐ 13/2023). Đổi thành
    `du-lieu-thu/` (khớp mọi cấp) + một dòng phủ định `!docs/du-lieu-thu/` để mẫu bịa đang
    có vẫn ở lại. ② Xoá các khối `.gitignore` đã chết theo ADR-001: `.vercel/` · `.supabase/`
    · `supabase/.branches/` · `supabase/.temp/`.
  - **(b)** Chạy `git check-ignore -v du-lieu-thu/x.csv` → **bị chặn**; chạy
    `git check-ignore -v docs/du-lieu-thu/mau-bia.csv` → **không bị chặn** (mẫu bịa vẫn ở lại,
    đúng ý). Mở `.gitignore` đọc một mạch, không còn dòng nào nói về thứ dự án không dùng.
  - **(c)** `npm run check:sast` + hook `pre-commit` (gitleaks) như cũ — cả hai đang chạy thật.
  - **(d)** 0,15 ngày.

### DEMO CUỐI GĐ24 — chủ dự án tự bấm

1. `npm run build` → mở `out/_headers`, thấy `Content-Security-Policy` và **đúng 2** chuỗi
   `'sha256-...'` trong `script-src`.
2. Đọc chú thích trong `scripts/sinh-danh-sach-cache.mjs`: hiểu được vì sao `style-src` có
   `'unsafe-inline'` và đổi `frame-ancestors` ở đâu khi app chủ nhúng vào.
3. `git check-ignore -v du-lieu-thu/thu.csv` → bị chặn.

---

## 🔴 GIAI ĐOẠN 25 — Dự án nhẹ đi, tài liệu hết dạy sai

> Nạp cố định mỗi lượt trao đổi hiện là **74.549 byte ≈ 23.300 token** — trả cho **mọi**
> lượt, mọi phiên, mãi mãi. Đây đúng thứ `~/.claude/CLAUDE.md` mục *Ngân sách context*
> cảnh báo.

- [x] 🔴 **25.1 — Tách KHO ra khỏi LUẬT, không xoá một chữ nào**
  - **(a)** `CLAUDE.md` đang **53.593 byte**, trong đó hai mục chiếm **80%**: *CẢNH BÁO /
    CẠM BẪY* (25 KB, 247 dòng) và *QUYẾT ĐỊNH QUAN TRỌNG* (18 KB, 58 dòng). Cả hai là **kho
    tra cứu**, không phải luật phải đọc mỗi lượt. Chuyển **nguyên văn, không sửa một câu**:
    mục CẢNH BÁO → `docs/so-seo.md`; bảng QUYẾT ĐỊNH → `docs/decisions/nhat-ky-quyet-dinh.md`.
    `CLAUDE.md` để lại **con trỏ + luật đọc** (*"trước khi sửa vùng nào thì `grep` sổ sẹo
    theo từ khoá vùng đó"*). Giữ nguyên trong `CLAUDE.md`: GUARDRAILS · DỰ ÁN · QUYỀN TỰ CHỦ
    · XỬ LÝ MÂU THUẪN · QUY TẮC LÀM VIỆC · TRẠNG THÁI.
    🔴 **Cắt theo TÊN MỤC, không cắt theo `slice(mốc-A, mốc-B)`** — bài học `13.1`: cắt giữa
    hai tiêu đề đã cuốn theo **ba khối** chèn vào sau nằm lọt ở giữa, và không cửa nào bắt được.
  - **(b)** Chạy `wc -c CLAUDE.md` → từ **53.593** xuống **~10.000 byte**. Rồi đếm hai đầu:
    `docs/so-seo.md` phải có **đúng 44** dòng bắt đầu bằng `- `, và
    `nhat-ky-quyet-dinh.md` phải có **đúng 52** dòng quyết định — đây là số đã đếm hôm nay,
    **trước** khi tách. Lệch một dòng là rơi mất một bài học đã trả giá bằng một lỗi thật.
    Cuối cùng mở `CLAUDE.md` đọc một mạch: vẫn hiểu được dự án là gì, luật là gì, đang ở đâu.
  - **(c)** File mới `tests/ngan-sach-context.test.ts`: `CLAUDE.md` ≤ **16 KB** · hai file
    kho tồn tại và không rỗng · tổng `CLAUDE.md` + `.claude/rules/*.md` ≤ **36 KB**.
    🔴 **Cửa này là thứ giữ cho nó không phình lại sau ba phiên** — không có cửa thì mỗi
    phiên thêm vài dòng, sáu tháng sau lại 53 KB.
  - **(d)** 0,4 ngày. **Ước giảm ~13.600 token mỗi lượt** (23.300 → ~9.700).

- [x] **25.2 — Sửa tài liệu đang dạy sai (nó dạy MỖI phiên)**
  - **(a)** ① `.claude/rules/workflow.md` trỏ vào **4 lệnh `npm` không tồn tại**:
    `check:plan` · `gop:kien-truc` · `plan:phu-thuoc` · `plan:tien-do`. `package.json` chỉ
    có 12 script, không có cái nào trong đó — phiên sau gõ theo là gặp lỗi. Bỏ/sửa chúng, và
    cắt phần nói về **migration CSDL** và **worktree nhiều session**: dự án này không có CSDL
    và không có thư mục `Plan/`. ② Xoá `.claude/commands/reset_db.md`, `B5_luu_code.md`,
    `B6_trien_khai.md` — **chính `workflow.md` dòng 10–12 nói dự án "CỐ Ý bỏ" ba handle này**;
    giữ chúng lại là để tài liệu tự mâu thuẫn với chính nó. ③ `docs/architecture/env-vars.md`:
    dự án **không có biến môi trường nào** (ADR-001) — ghi thẳng điều đó thay cho hướng dẫn
    cũ. ④ Rà 14 file còn nhắc Supabase/Vercel: chỗ nào là **lịch sử** (`ADR-001`, `docs/BA`)
    thì **giữ**; chỗ nào là **chỉ dẫn đang có hiệu lực** thì sửa. ⑤ Xoá
    `scripts/dong-bo-kaneo.ts` — script của **một dự án khác**: nó đọc `Plan/TIEN_DO.md` (dự
    án này không có `Plan/`), đẩy thẻ lên một bảng Kaneo ở `localhost:5173`, nhắc tên một
    người cụ thể, và **không ai gọi nó**. Nó cũng là đoạn mã duy nhất trong repo mở một
    đường đẩy dữ liệu ra ngoài — chết, nhưng vẫn là bề mặt.
  - **(b)** Chạy `grep -oh "npm run [a-z:-]*" .claude/rules/*.md CLAUDE.md | sort -u` rồi
    đối chiếu với `npm run` (danh sách script) — **mọi lệnh in ra đều phải có thật**. Chạy
    `ls .claude/commands/` → còn đúng **5** handle.
  - **(c)** Thêm vào `tests/ngan-sach-context.test.ts`: **mọi `npm run <x>` xuất hiện trong
    `.claude/**` và `CLAUDE.md` phải có mặt trong `package.json`**. Cửa này bắt đúng loại
    lỗi vừa tìm ra, và nó rẻ.
  - **(d)** 0,3 ngày.

- [x] **25.3 — Dọn 30 export không ai dùng**
  - **(a)** Xoá theo **TÊN từng export**, **không cắt theo vùng** (`13.1`). Nhóm rõ ràng
    nhất là cụm điều hướng cũ còn sót từ trước luồng ba bước, nằm trong
    `config/disc-tu-dien.ts`: `MA_DOI_TUONG` · `MaDoiTuong` · `DOI_TUONG` · `MA_NHANH` ·
    `MaNhanh` · `NHANH_CAM_MAY` · `CHU_LICH_SU` · `CHU_DISC` · `MoTaTruc`.
    🔴 **BA trường hợp KHÔNG xoá, kiểm từng cái trước khi đụng:** `khoIndexedDB` (được dùng
    ngay trong file nó ở `datKho(khoIndexedDB)` — đó là ổ cắm `KhoDisc`) · `LyDoMaHong` và
    `KetQuaMoMa` (nằm trong chữ ký trả về của `moHoSo()`).
    Với **mỗi** export còn lại: chạy `grep -rw` toàn repo **kể cả `cu/` và `docs/`** trước
    khi xoá — bộ dò ban đầu bỏ sót `cu/` và suýt báo nhầm.
  - **(b)** Không có gì để bấm — đây là **vệ sinh mã, không phải tối ưu ứng dụng**. Nghiệm
    thu bằng `npm run kiem` xanh và `wc -l config/disc-tu-dien.ts` giảm so với 1.104 dòng.
  - **(c)** `npm run typecheck` là cửa thật ở đây: xoá nhầm một export còn người dùng thì nó
    đỏ ngay lập tức. Rồi `npm run kiem` đầy đủ.
  - **(d)** 0,3 ngày.

- [x] **25.4 — ĐO lại và chốt bằng số**
  - **(a)** Không viết mã. Chạy `npm run build` đọc dòng của `scripts/kiem-co-goi.mjs`; chạy
    lại phép đếm byte `CLAUDE.md` + `.claude/rules/`. Ghi **số thật** vào khối bàn giao đầu
    sổ này, **kể cả khi nó không đổi**.
  - **(b)** So với mốc hôm nay: gói chính **290 KB gzip**, context **74.549 byte ≈ 23.300
    token**, `config/disc-tu-dien.ts` **1.104 dòng**.
  - **(c)** `scripts/kiem-co-goi.mjs` (trần 300 KB) + `tests/ngan-sach-context.test.ts`.
  - **(d)** 0,1 ngày. 🔴 Đặt ĐO ở **cuối** và **không tối ưu thêm gì** nếu số đã đạt — tối
    ưu trước khi đo là đoán (`17.1`).

### DEMO CUỐI GĐ25 — chủ dự án tự bấm

1. `wc -c CLAUDE.md` → **~10 KB** (từ 53,6 KB). Mở ra đọc một mạch: vẫn đủ hiểu dự án là
   gì, luật là gì, đang ở đâu.
2. Mở `docs/so-seo.md` → đếm dòng bắt đầu bằng `- ` phải ra **44** (số đã đếm hôm nay
   trước khi tách); mở `docs/decisions/nhat-ky-quyet-dinh.md` → **52** dòng quyết định.
   Lệch một dòng là rơi mất một bài học đã trả giá bằng một lỗi thật.
3. Mọi lệnh `npm run ...` xuất hiện trong tài liệu đều gõ được và chạy được.
4. `ls .claude/commands/` → còn 5 handle, không còn `reset_db`.
5. `npm run kiem` xanh · `npm run build` xanh · gói chính ≤ 300 KB gzip.

---

## 🔴 GIAI ĐOẠN 26 — Ra internet thật

> Thừa kế từ `PLAN_V3.md` (`21.1` → `26.1`, `22.2` → `26.2`). **Không code nào gỡ được hai
> ô này.**

- [ ] 🔴 **26.1 — Đưa bản hiện tại lên host thật**
  - **(a)** Deploy `out/` lên Cloudflare Pages (trang tĩnh, gói miễn phí dùng thương mại
    được — Vercel Hobby thì không). Nối repo GitHub → Pages. **Cố ý deploy bản đang có,
    chưa đụng gì vào giao diện** — để tách rủi ro hạ tầng khỏi rủi ro code. Ghi cấu hình vào
    `.claude/infra.json`. Kiểm Pages có đọc `out/_headers` không (nó nằm ở gốc thư mục xuất).
  - **(b)** Mở link trên **điện thoại của mình, dùng 4G không dùng wifi nhà**: màn DISC lên,
    bấm được vào một bộ đề, tắt mạng rồi mở lại vẫn vào được. Gửi link cho một người khác,
    họ mở được. 🔴 **Rồi hai phép thử của các giai đoạn trước, lần đầu chạy trên hạ tầng
    thật:** ① đẩy một bản vá nhỏ lên và bấm F5 → **phải thấy bản mới** (GĐ19); ② mở
    DevTools ▸ Console → **không một dòng vi phạm CSP nào**, và mọi nút vẫn bấm được (`24.1`).
  - **(c)** `.github/workflows/kiem.yml` chạy `npm run kiem` trước khi build — đã có sẵn.
    Không test tự động nào thay được bước (b): đây là hạng mục hạ tầng.
  - **(d)** 0,5 ngày máy (sau khi đã có tài khoản).
  - **(e) chặn:** NGOÀI — cần **tài khoản Cloudflare** + **một tên miền**. Chưa có
    `infra.json`, chưa ai bấm deploy lần nào.

- [ ] **26.2 — Bấm mắt bảy việc còn nợ của GĐ18**
  - **(a)** Không code. `PLAN_V2.md` tick 9/9 ô GĐ18 dựa trên test xanh, nhưng bảy việc ở ba
    mục *DEMO CUỐI 18A/18B/18C* thì **chưa ai bấm bằng mắt**. Lệch chỗ nào thì mở hạng mục
    MỚI ở sổ này, **đừng bỏ tick ở sổ V2**.
  - **(b)** Mở `PLAN_V2.md`, làm lần lượt bảy việc ở ba mục DEMO CUỐI của GĐ18 — **trên host
    thật của `26.1`**, không trên `localhost`.
  - **(c)** Không có. Đây đúng loại việc test không thay được — bài học đã trả giá: *"Viết
    xong giao diện thì phải NHÌN, không chỉ chạy test."*
  - **(d)** 0 ngày máy.
  - **(e) chặn:** NGƯỜI — chủ dự án bấm. Phụ thuộc `26.1` xong trước.

### DEMO CUỐI GĐ26

Một cái link công khai, mở được trên 4G, gửi cho người khác họ mở được — **và đẩy được bản
vá tới nó, và Console sạch không một vi phạm CSP**.

---

## 🔴 GIAI ĐOẠN 27 — Giao diện "Aurora công nghệ" + nội dung gia đình sâu hơn

> Chốt 30/10/2026: chủ dự án chọn **phương án 2** trong ba bản vẽ (hero/thẻ kết quả nền
> tím đậm + lưới mạch điện + kính mờ + radar bốn trục; thân trang vẫn sáng). Bản vẽ gốc
> chưa lưu trong repo. Ranh giới: **không đổi màu logo**, tối chỉ ở mảng nhấn (ADR trong
> `nhat-ky-quyet-dinh.md`), **CSS thuần + SVG nội tuyến** (gói chính còn dư ~10 KB gzip),
> mọi hiệu ứng có `motion-reduce:`, tương phản ≥ 4,5:1, in/PDF không mất nội dung.
> 🔴 `26.1` cố ý deploy bản CŨ để tách rủi ro hạ tầng khỏi rủi ro code — GĐ27 đi sau nó
> khi có host, nhưng làm được trên local ngay.

- [ ] **27.1 — Nền tảng: token aurora + khối nhấn tối dùng chung**
  - **(a)** `@theme` thêm token nền tím đậm, gradient mesh, lưới mạch, viền kính, glow cam.
    Một lớp dùng chung `data-nhan-toi` (hero/thẻ kết quả) để chữ trên nền tối có bảng màu
    riêng đạt tương phản. Cập nhật `config/thuong-hieu.ts` cho khớp.
  - **(b)** `npm run xem-thu`, nhìn ở 320/390 px và bật giảm chuyển động.
  - **(c)** `tests/do-noi`, `mau-va-chuyen-dong`, `be-ngang` xanh; thêm test đo tương phản
    chữ trên nền tối.
  - **(d)** 0,4 ngày.
  - **(e) chặn:** MÁY.
  - **Tiến độ 30/10/2026:** code + `tests/nen-toi.test.ts` xanh, build 289 KB. **CHƯA tick** —
    (b) chưa ai nhìn bằng mắt (tiện ích Chrome không kết nối được lúc đó).

- [ ] **27.2 — Màn Chào và Làm bài**
  - **(a)** Hero tối ở khung `cac-buoc.tsx`, `truoc-khi-bat-dau.tsx` và đầu `lam-bai.tsx`; nút
    trả lời đang chọn nổi hẳn (`thang-tra-loi.tsx`); thanh tiến độ phân đoạn mười ô.
    🔴 LỆCH BẢN VẼ: bản vẽ có thang 5 ô vuông phát sáng, bản làm giữ nút dọc/ngang cũ + viền cam
    (không đổi bố cục thang để khỏi vỡ test cho trẻ nhỏ). `mo-dau.tsx` KHÔNG phải màn chào.
  - **(b)** Làm trọn một bài trên `xem-thu` ở 390 px.
  - **(c)** Test hiện có xanh; chữ mới chỉ vào `config/disc-tu-dien.ts`.
  - **(d)** 0,5 ngày.
  - **(e) chặn:** MÁY (sau 27.1).
  - **Tiến độ 31/10/2026:** HOÀN TẤT PHẦN MÁY — hero ở khung "DISC gia đình" + "Trước khi bắt đầu" + đầu màn làm bài; nút đang chọn có viền cam. Chờ chủ dự án bấm thử rồi tick.

- [ ] **27.3 — Màn Kết quả: radar bốn trục + chip DISC**
  - **(a)** `ket-qua.tsx`, `bieu-do-cot.tsx`: radar SVG có vẽ vào, chip D/I/S/C phát sáng.
    Giữ bản in/PDF/ảnh chia sẻ đúng như cũ (không bóng, không nền tối khi in).
  - **(b)** In thử + xuất ảnh + xuất PDF một kết quả mẫu.
  - **(c)** `ban-in`, `hinh-minh-hoa`, test xuất ảnh/PDF xanh.
  - **(d)** 0,5 ngày.
  - **(e) chặn:** MÁY (sau 27.1).
  - **Tiến độ 31/10/2026:** HOÀN TẤT PHẦN MÁY — radar + chip điểm trong thẻ tối; xuất ảnh/PDF không đọc DOM nên không ảnh hưởng. Chờ chủ dự án bấm In thử rồi tick.

- [ ] **27.4 — Màn Cả nhà + mở rộng hồ sơ ký duyệt**
  - **(a)** `ban-tong-hop.tsx`: tiêu đề mỗi bản là mảng tối + khối nội dung mối quan hệ.
    🔴 LỆCH BẢN VẼ: `phan-tich.tsx` CHƯA đổi, và chip cặp (H ⇄ N) trong bản vẽ CHƯA làm. Mở rộng
    `scripts/xuat-noi-dung-ky-duyet.mjs` để đọc cả `config/disc-noi-dung-cap.ts`
    (56 đoạn hiện KHÔNG nằm trong hồ sơ ký nào).
  - **(b)** Chạy script: 16 đoạn (có trẻ) vào Gói A, 40 đoạn vào Gói B.
  - **(c)** Test hiện có xanh + test canh script phủ đủ file nội dung.
  - **(d)** 0,4 ngày.
  - **(e) chặn:** MÁY.
  - **Tiến độ 30/10/2026:** PHẦN SCRIPT XONG — `scripts/xuat-noi-dung-ky-duyet.mjs` nay đọc
    `disc-noi-dung-cap.ts` (16 đoạn vào Gói A mục *A-CẶP*, 40 đoạn vào Gói B mục *B4*), kèm
    `tests/ho-so-ky-duyet-phu-du.test.ts`. Sửa luôn lỗi cũ in "undefined" 33 chỗ trong Gói A.
    **Hai hồ sơ ĐÃ ĐỔI NỘI DUNG — nếu đã gửi ký bản cũ thì phải gửi lại.** Chưa làm: màn Cả
    nhà theo bản vẽ. Chưa tick.
  - **31/10/2026:** tiêu đề mỗi bản ở Cả nhà đã là mảng tối; mục B5 vào hồ sơ. HOÀN TẤT PHẦN MÁY.

- [ ] **27.5 — Nội dung gia đình sâu hơn (bản NHÁP)**
  - **(a)** Tách `ngang-vai` thành vợ↔chồng và anh↔chị↔em; tình huống hằng ngày; mẫu câu
    nên nói/nên tránh; vòng xung đột; kế hoạch 7 ngày. Vào Gói B, có test như các đoạn cũ.
  - **(b)** Đọc thử các tình huống trên màn Cả nhà.
  - **(c)** `lech-cap`, `noi-dung-moi`, `ba-ban-noi-dung` mở rộng cho khuôn mới.
  - **(d)** 1,5 ngày.
  - **(e) chặn:** NGƯỜI — viết được ngay nhưng **chỉ phát cho khách thật sau khi chuyên
    môn ký Gói B**; trước đó tắt khối này ở bản phát.

---

## 🔴 GIAI ĐOẠN 28 — Bộ test hoàn chỉnh trước, phân tích sau; hai góc nhìn về con; nhắc test lại

> Chốt 31/10/2026 từ lời chủ dự án: làm bài xong phải có thông báo và đếm bản · rõ ai chưa
> làm, làm mấy bản, loại nào · bé có HAI góc nhìn (con tự làm / bố mẹ làm cho con) phải so
> được và bố mẹ biết làm gì mỗi ngày · phân tích chỉ nên vào sau khi bộ test đã đủ · nhắc test
> lại mỗi 6 tháng thật to và rõ · dashboard gọn, chi tiết bấm mới xổ. Quyết định đã hỏi:
> **chặn MỀM** · **khung nhắc + tệp lịch .ics** · **2 bản MỖI LOẠI** (không còn gộp).
> 🔴 Không ô nào tick: (b) của mọi ô là *bấm thật trên máy*, chưa ai bấm.

- [ ] **28.0 — Hạn mức 2 bản MỖI LOẠI**
  - **(a)** `LoaiBai` suy từ bộ đề (`han-muc.ts`), `baiSapMat/donBaiThanhVien` nhận `loai`; hộp
    thoại nói đúng góc nhìn đang đầy. Không thêm trường, không tăng `PHIEN_BAN_KHO`.
  - **(b)** Bé lớp 3+ làm đủ 4 bản, làm thêm bản bố mẹ ⇒ chỉ bản bố mẹ cũ nhất bị hỏi xoá.
  - **(c)** `tests/han-muc-theo-loai.test.tsx` (kể cả fake-indexeddb). **(d)** 0,4 ngày.
  - **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **28.1 — Sổ bản đã làm trên thẻ + dòng tóm tắt bước 1**
  - **(a)** `do-day-du-bo-test.ts` (đủ/thiếu LẤY TỪ `doiChieu`, không dựng luật thứ hai) · thẻ hiện
    "Con tự làm … / Bố mẹ làm cho con …" kèm ngày · bước 1 hiện "3/4 người đủ bản · Còn thiếu: …".
  - **(c)** `do-day-du-bo-test.test.ts` (có test nhất quán với `doiChieu` mọi tổ hợp), `khung-test-lai.test.tsx`.
  - **Tiến độ 31/10:** PHẦN MÁY XONG. Đổi chữ "n/2 bài" cũ (sai với bé có 4 bản).

- [ ] **28.2 — Thông báo "đã xong, đây là bản thứ N"**
  - **(a)** `thong-bao-da-xong.tsx` ở đầu màn kết quả của bài VỪA làm: bản thứ mấy của loại nào,
    cả nhà còn thiếu ai; lưu hỏng thì báo thật (cờ `luuHong` tách khỏi "đang lưu").
    Nút **"Về danh sách để làm tiếp cho {tên}"** đưa về màn Nhà mình, nêu đích danh người thiếu.
    🔴 CỐ Ý KHÔNG nhảy thẳng vào bài của người kế: mọi bài mới phải qua cửa hạn mức ở `nha-minh.tsx`.
    Đã dọn `module.config.json` (hết trỏ tới `lich-su.tsx` đã mất).
  - **(c)** `thong-bao-da-xong.test.tsx`. **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **28.3 — Sửa lỗ hổng chọn bản**
  - **(a)** `chon-ban.ts`: mặc định bản HỢP LỆ MỚI NHẤT bất kể loại (đúng lời chủ dự án); ô chọn ghi
    loại + "(mới nhất)/(bản cũ)/(không dùng được)"; thẻ thành viên dùng CÙNG bộ chọn. Trước đó bản
    mới nhất hỏng ⇒ cả người bị loại. ❓ **Câu hỏi mở cho chủ dự án:** với bé có cả hai góc nhìn, phân
    tích cả nhà nên ưu tiên bản bé TỰ LÀM hơn bản mới nhất không? (Từng làm rồi gỡ vì ngoài kế hoạch.)
  - **(c)** `chon-ban.test.ts`, `ban-tong-hop.test.tsx`. **Tiến độ 31/10:** PHẦN MÁY XONG.
  - 🔴 Đổi hành vi mặc định của phân tích với bé có cả hai loại bài (trước: bản mới nhất bất kể loại).

- [ ] **28.4 — Cổng phân tích MỀM + giao diện gập**
  - **(a)** `bang-kiem-day-du.tsx` ("Bộ test đã đủ chưa?") đầu bước 3, nhãn "chưa đủ bản" ở cặp
    thiếu; `khoi-gap.tsx`; tiêu đề đổi thành **"Lời khuyên dành cho {tên}"**; mỗi người và mỗi cặp là
    MỘT hàng gập có tóm tắt. "Bảy ngày thử" nêu đích danh ai được khuyên.
  - **(c)** `khoi-gap.test.tsx`, `khung-test-lai.test.tsx`, `ban-tong-hop.test.tsx`. **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **28.5 — Hai góc nhìn về con: lời khuyên ĐỒNG HÀNH hằng ngày**
  - **(a)** `config/disc-dong-hanh.ts` (128 chuỗi: 8 ô chung + 16 ô theo bậc TH/THCS + 4 trùng khớp) ·
    `dong-hanh-voi-con.tsx` NẠP LƯỜI trong `vung-lech.tsx` · kế hoạch tuần 4 việc · hồ sơ Gói A mục A-ĐỒNG-HÀNH.
  - Bảng hai góc nhìn nay có **câu chữ hướng lệch** ("Con tự thấy cao hơn bố mẹ thấy 22 điểm").
  - **(c)** `dong-hanh.test.tsx` (24 test: đủ ô, luật ngôn ngữ, lazy). **(e) chặn:** NGƯỜI — bản NHÁP Gói A, chưa ai ký.
  - **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **28.6 — Nhắc test lại mỗi 6 tháng**
  - **(a)** `han-test-lai.ts` + `lich-nhac.ts` (.ics theo RFC 5545, KHÔNG chứa tên ai) + `khung-test-lai.tsx`
    ở đầu bảng gia đình, đầu bước 3 và màn kết quả; đổi cam khi đến hạn; nút "Thêm vào lịch điện thoại".
  - **(c)** `han-test-lai.test.ts` (31/08+6 tháng = 28/02, quá hạn, gập dòng theo byte UTF-8). **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **28.7 — Sổ + hồ sơ**
  - **(a)** Hồ sơ ký đổi nội dung LẦN NỮA (thêm A-CẶP, A-ĐỒNG-HÀNH, B4, B5) · nhật ký · sổ sẹo · bàn giao.
    🔴 **KHÔNG làm, cần chủ dự án quyết:** khối "Hiểu nhau để thương nhau hơn" ở đầu bước 3 — chú thích
    `CHU_THONG_DIEP` ghi thông điệp nhân văn CHỈ ở bảng gia đình (rải nhiều chỗ thành khẩu hiệu).
  - **Tiến độ 31/10:** XONG.

---

## 🔴 GIAI ĐOẠN 29 — Phân tích sâu cho MỌI cặp trong nhà

> Chốt 31/10/2026: GĐ27 chỉ có nội dung sâu cho vợ↔chồng và anh-chị↔em. Gia đình thật còn bố mẹ↔con,
> con↔bố mẹ, ông bà↔cháu. Phân tích phải sâu cho mọi cặp, theo bậc của bé, và đọc nhanh được trên
> điện thoại. 🔴 Không ô nào tick: (b) của mọi ô là *bấm thật trên máy*, chưa ai bấm.

- [ ] **29.0 — Ống dẫn dữ liệu cho mọi cặp**
  - **(a)** `modules/core/gia-dinh/bac-hoc.ts`: bậc `nho`/`tieu-hoc`/`lon`, KHÔNG đoán khi chưa có lớp ·
    `MoiQuanHeCap` 5 loại, luôn suy được · `LatCat` thêm `bacTre`/`vaiToi`/`vaiNguoiKia`.
    🔴 Sửa lỗi: `ba` là **Bà** (không phải bố) nên mẹ+bà KHÔNG phải vợ chồng; ông+bà mới là cặp.
  - **(b)** Nhà có bà + mẹ ⇒ cặp đó không ra nội dung "vợ chồng". **(c)** `tests/bac-hoc.test.ts`,
    `tests/noi-dung-moi-quan-he.test.ts`. **(d)** 0,5 ngày. **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **29.1 — Xưng hô trung tính**
  - **(a)** `config/disc-xung-ho.ts`: `{xungTre}` = con/cháu/em theo vai người kia · `{goiNguoiKia}` =
    Bố/Mẹ/Ông/Bà. Người lớn nói "mình" + tên bé; bé xưng theo vai người kia.
  - **(c)** `tests/xung-ho.test.ts`. **(d)** 0,3 ngày. **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **29.2 — Nội dung người lớn khác ↔ người lớn**
  - **(a)** 8 ô + 7 ngày thử, cho cặp người lớn không phải vợ chồng (Gói B).
  - **(c)** `tests/noi-dung-moi-quan-he.test.ts`. **(d)** 0,4 ngày.
  - **(e) chặn:** NGƯỜI — nội dung Gói B chưa ai ký. **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **29.3 — Người lớn → trẻ × 3 bậc**
  - **(a)** `config/disc-noi-dung-voi-tre.ts`: 24 ô + 21 ngày thử (Gói A). Ông bà↔cháu dùng CHUNG nội
    dung bố mẹ↔con.
  - **(c)** `tests/noi-dung-moi-quan-he.test.ts`. **(d)** 0,8 ngày.
  - **(e) chặn:** NGƯỜI — nội dung về TRẺ, Gói A chưa ai ký. **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **29.4 — Trẻ → người lớn × 3 bậc**
  - **(a)** `config/disc-noi-dung-tre-voi-nl.ts`. 🔴 Luật HẸP: chỉ là cách NÓI RA điều mình cần; KHÔNG
    giao trẻ việc điều chỉnh người lớn.
  - **(c)** `tests/noi-dung-moi-quan-he.test.ts` (kể cả test cấm câu giao việc cho trẻ). **(d)** 0,6 ngày.
  - **(e) chặn:** NGƯỜI — Gói A chưa ai ký. **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **29.5 — Cùng nhịp**
  - **(a)** `config/disc-noi-dung-cung-nhip.ts`: 40 ô cho cặp có phong cách trùng khớp (A + B).
  - **(c)** `tests/noi-dung-moi-quan-he.test.ts`. **(d)** 0,4 ngày.
  - **(e) chặn:** NGƯỜI — Gói A + B chưa ai ký. **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **29.6 — Giao diện tổng quát hoá cho mọi cặp**
  - **(a)** `app/components/noi-dung-doi.tsx` chạy cho mọi cặp; bé chưa có lớp thì nhắc **thêm lớp**,
    KHÔNG đoán bậc.
  - **(c)** `tests/phu-moi-cap.test.tsx`, `tests/noi-dung-doi.test.tsx`. **(d)** 0,5 ngày.
  - **Tiến độ 31/10:** PHẦN MÁY XONG.

- [ ] **29.7 — Hồ sơ ký đổi nội dung**
  - **(a)** Thêm A-NL→TRẺ, A-TRẺ→NL, A-CÙNG-NHỊP, B6 vào `scripts/xuat-noi-dung-ky-duyet.mjs`; test phủ
    544 chuỗi (gồm dòng an toàn của bé) (`tests/ho-so-ky-duyet-phu-du.test.ts`). 🔴 Gửi lại hồ sơ nếu đã gửi.
  - **(d)** 0,3 ngày. **Tiến độ 31/10:** XONG.

- [ ] **29.8 — Giao diện đọc cho phụ huynh (điện thoại + web)**
  - **(a)** "Hôm nay thử" nổi ở tiêu đề từng người và từng cặp · thanh chọn người dính trên đầu · nút
    Mở hết/Gập hết · chữ ≥16px · vùng chạm ≥56px · màn `ban-tong-hop` NẠP LƯỜI để hạ gói chính.
  - **(b)** Mở trên điện thoại thật: đọc được một người trong ≤ 2 lần chạm.
  - **(c)** `tests/khoi-gap.test.tsx`, `tests/ban-tong-hop.test.tsx`, cổng chunk lười. **(d)** 0,5 ngày.
  - **(e) chặn:** NGƯỜI — chưa ai nhìn bằng mắt (Chrome extension chưa kết nối).
  - **Tiến độ 31/10:** PHẦN MÁY XONG.

---

## TỔNG ƯỚC LƯỢNG

| Giai đoạn | Máy | Người / Ngoài |
| --- | --- | --- |
| 🔴 **23 — mã mời tắt được, rút lại được** | **0,7 ngày** | không có |
| 🔴 **24 — áo giáp trước khi ra internet** | **0,65 ngày** | không có |
| 🔴 **25 — nhẹ đi, tài liệu hết dạy sai** | **1,1 ngày** | không có |
| 🔴 26 — ra internet thật | 0,5 ngày | **tài khoản Cloudflare + tên miền** · 1 lượt bấm mắt |
| **Tổng** | **~2,95 ngày máy** | **1 việc mua ngoài, 1 việc người** |

🔴 **GĐ23–GĐ25 chạy được ngay hôm nay, không gì chặn.** Duyệt xong thì máy đi một mạch tới
hết GĐ25 rồi dừng chờ tài khoản Cloudflare.

---

## THỨ TỰ RỦI RO — vì sao xếp như vậy

| Hạng mục | Rủi ro nếu làm sai | Xếp ở đâu |
| --- | --- | --- |
| `23.1` sáu đường đọc `nhanQuaMa` | **Mất dữ liệu im lặng.** Cắt nhầm một đường là một thành viên biến mất khỏi bản phân tích cả nhà — không lỗi, không test đỏ, không ai biết. Cùng họ `16.5` | **Đầu tiên**, và có `23.2` canh riêng chuyện này |
| `24.1` CSP | **Chỉ lộ sau khi deploy.** Băm sai thì local xanh, test xanh, **trang thật trắng**. Để đến cuối là để nó nổ đúng lúc `26.1` đang chạy | Thứ hai, **trước cả dọn rác** |
| `25.1` tách `CLAUDE.md` | Cắt theo mốc văn bản làm **rơi mất bài học** đã trả giá bằng lỗi thật — và không cửa nào bắt được (`13.1`) | Thứ ba, có phép đếm hai đầu ở (b) |
| `23.1` lớp chặn ③ | Chặn ở trình bày mà quên đường GHI thì cờ tắt rồi vẫn đẻ ra hồ sơ mới (`V4.1`) | Trong `23.1` |
| `26.1` host | **Chặn cứng ngày phát.** Không code nào gỡ được | Ngay khi có tài khoản — đừng đợi GĐ25 |

---

## ❌ KHÔNG LÀM Ở PHIÊN BẢN NÀY

| Không làm | Vì sao |
| --- | --- |
| **Tách `config/disc-tu-dien.ts` (1.104 dòng) và `kho-bai.ts` (732 dòng)** | Cả hai vượt trần 500 dòng của `tech-defaults`. Nhưng tách file từ điển là **hàng trăm dòng đổi `import`**, một đợt test đỏ, và **0 giá trị cho người dùng** — đúng lý lẽ dự án đã dùng ngày 28/08 khi giữ mặt tiền `kho-bai.ts`. `25.3` làm nó ngắn bớt; tách hẳn thì mở hạng mục riêng |
| **Xoá `ma-moi.ts` · `ma-qr.tsx` · `nhan-ma-moi.tsx` · `khoi-ma-moi.tsx`** | Cả lý do chọn **cờ** thay vì gỡ là để bật lại trong 30 giây. Xoá mã là vứt luôn đường lùi — và ngày muốn bật lại thì phải viết lại 294 dòng bộ mã hoá Reed–Solomon đã có cửa kiểm |
| **Xoá thư mục `cu/`** | Quyết định 28/08: **cách ly, không xoá**. Nó 12 KB và có `tests/vung-cach-ly.test.ts` canh luật một chiều |
| **Bán việc xoá 30 export chết thành "tối ưu ứng dụng"** | Đã đo: bộ đóng gói **đã rung cây bỏ chúng rồi**, xoá **không giảm một byte nào** của gói chính. Đó là vệ sinh mã. Nói khác đi là nói sai |
| **Thêm công cụ phân tích bundle / thư viện đo hiệu năng** | Ràng buộc thư viện ngoài (ADR-009). `kiem-co-goi.mjs` đang đo đúng thứ cần đo, và gói còn **10 KB dưới trần** |
| **`'unsafe-inline'` cho `script-src`** | Băm được thì không có lý do gì hạ xuống. Băm hỏng thì **sửa băm**, đừng nới cửa |
| **Cắt chữ trong sổ sẹo / nhật ký quyết định** | Chủ dự án chốt: **tách kho, giữ nguyên chữ**. Mỗi dòng ở đó đổi bằng một lỗi thật đã trả giá |
| **Sửa câu chữ nội dung** | Vẫn không đụng `config/disc-noi-dung-cap.ts` và họ hàng — phần đang chờ ký duyệt |
| **Backend + đăng nhập + đồng bộ** | Giữ ADR-001. Làm ngay thì công ty thành bên xử lý dữ liệu cá nhân **TRẺ EM** (NĐ 13/2023) — thứ ADR-001 đã cố ý mua đường tránh |

---

## 🏁 ĐIỀU KIỆN DỪNG

**Không chép lại ở đây.** Hai con số `?so-lieu=1` và cách đọc chúng nằm nguyên ở mục
*ĐIỀU KIỆN DỪNG* cuối `PLAN_V2.md`. 🔴 **Và sổ này KHÔNG đụng tới chúng:** nút ghi mốc
`bamMoi` nằm ở `KhoiConThieuAi` — nó gửi một **đường dẫn**, không phải mã QR, nên tắt mã
mời ở `23.1` không suy suyển phễu. Đã kiểm, đừng lo lại.

Riêng sổ này có **một điều kiện dừng của chính nó**: nếu sau `23.2` mà cửa *"thành viên có
sẵn `nhanQuaMa` vẫn hiện đủ khi cờ TẮT"* không xanh được, thì **dừng, đừng tắt mã mời**.
Thà giữ một tính năng thừa còn hơn làm biến mất một người khỏi bản phân tích của gia đình họ.
