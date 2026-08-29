# PLAN_V4.md — Lộ trình đang có hiệu lực

## BÀN GIAO PHIÊN GẦN NHẤT

> 🔴 **GHI ĐÈ mỗi phiên** — khối mới THAY khối cũ, không xếp chồng. Trần 40 dòng.

**29/08/2026 — GĐ23 + GĐ24 + GĐ25 xong trọn. Sổ HẾT VIỆC MÁY: 8/10 ô ✅.**

**1. Vừa xong.** Mã mời tắt bằng cờ · CSP theo băm cho bản deploy · `.gitignore` siết ·
`CLAUDE.md` tách kho · tài liệu hết dạy sai · 26 export chết dọn xong.
**1.428 test xanh** (+21), `kiem` + `build` xanh, gói chính **vẫn 290 KB gzip**.

**2. Đang dở.** Không còn hạng mục máy nào. Việc gần nhất: **chủ dự án bấm DEMO CUỐI của
GĐ23 và GĐ25** (xem hai mục *DEMO CUỐI* trong sổ này).

**3. Chặn ở NGƯỜI / NGOÀI.** `26.1` Cloudflare + tên miền (**chặn cứng ngày phát**) ·
`26.2` bảy việc bấm mắt GĐ18 · hai chữ ký chuyên môn (xem `CLAUDE.md` mục TRẠNG THÁI).

**4. 🔴 ĐÃ ĐO, ĐỪNG ĐO LẠI.**
- `npm audit` **0 lỗ hổng** · không `eval`/`innerHTML`/`dangerouslySetInnerHTML` · **không
  một lời gọi mạng nào** rời máy · không `console.log` sót. ADR-001 đang được giữ thật.
- **Ngân sách context:** `CLAUDE.md` 53.593 → **10.983 byte** (−80%); nạp cố định 74.549 →
  **31.524 byte ≈ 9.851 token/lượt** (giảm ~13.400). Kho tra cứu nay ở `docs/so-seo.md`
  (45 bài học) và `docs/decisions/nhat-ky-quyet-dinh.md` (52 quyết định).
  `tests/ngan-sach-context.test.ts` canh trần để nó không phình lại.
- **CSP dùng BĂM, sinh mỗi bản build.** `style-src` **buộc phải** có `'unsafe-inline'` (8
  thuộc tính `style=` do React đặt, không băm được) — **cố ý, đừng "sửa"**.
  `frame-ancestors 'self'` **sẽ phải đổi** khi app chủ nhúng: sửa `NGUON_NHUNG_CHO_PHEP`
  ở `scripts/sinh-danh-sach-cache.mjs`.
- **Vân tay service worker đổi mỗi lần build** kể cả khi mã không đổi (Next đúc `buildId`
  ngẫu nhiên). KHÔNG phải lỗi, và **đừng ghim `generateBuildId`**.
- **App chỉ có MỘT route** (`app/page.tsx`). Đừng suy cấu trúc URL từ tên thư mục component.
- Xoá export chết **KHÔNG giảm byte nào** của gói chính — đó là vệ sinh mã, không phải tối ưu.

**5. Cạm bẫy** — nay ở `docs/so-seo.md` (grep theo từ khoá vùng đang sửa), **đừng chép vào đây**.

**6. 🔴 CHƯA PUSH.** Commit của phiên này còn ở local.

**7. Lệnh phiên sau nên chạy.**
```bash
npm run kiem      # 1.428 test; máy tải nặng thì npx vitest run --maxWorkers=2
npm run xem-thu   # bản phát hành thật, cổng 3100 (?so-lieu=1 để đọc phễu)
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
