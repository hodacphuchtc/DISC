# PLAN_V3.md — Lộ trình đang có hiệu lực

## BÀN GIAO PHIÊN GẦN NHẤT

> 🔴 **GHI ĐÈ mỗi phiên** — khối mới THAY khối cũ, không xếp chồng. Trần 40 dòng.

**29/08/2026 — GĐ19 + GĐ20 xong trọn. Sổ HẾT VIỆC MÁY: 7/10 ô ✅.**

**1. Vừa xong.** `V3.0` · GĐ19 `19.1`–`19.5` · `20.1`. **1.407 test xanh** (+20),
`npm run kiem` + `npm run build` xanh, gói chính **vẫn 290 KB gzip** (trần 300).
Service worker nay mang vân tay bản build ⇒ bản vá tới được máy đã từng mở trang.

**2. Đang dở.** Không còn hạng mục máy nào. Việc gần nhất: **chủ dự án bấm 5 bước ở
*DEMO CUỐI GĐ19*** — nhất là bước 2 (sửa một chữ → build → **F5 thường** → thấy chữ mới
ngay lượt đầu). Lệch chỗ nào thì mở hạng mục MỚI, đừng bỏ tick.

**3. Chặn ở NGƯỜI / NGOÀI.** `21.1` Cloudflare + tên miền (**chặn cứng ngày phát**) ·
`22.1` hai điện thoại quét QR · `22.2` bảy việc bấm mắt GĐ18 · hai chữ ký chuyên môn.

**4. ĐÃ ĐO, ĐỪNG ĐO LẠI.**
- Máy chủ chạy thử **đã gửi `cache-control: no-store`** ⇒ bộ nhớ đệm HTTP **không liên
  quan**. Hướng đó đã loại, đừng soi lại.
- 🔴 **Vân tay ĐỔI mỗi lần build kể cả khi mã không đổi** — Next đúc `buildId` ngẫu nhiên.
  KHÔNG phải lỗi, và **đừng ghim `generateBuildId`** để "chữa": ghim vào hằng số thì hai
  bản build khác nội dung dùng chung `/_next/static/<hằng số>/…`, và cache-first phục vụ
  bản cũ trên một đường dẫn trông như bất biến.
- 🔴 **App chỉ có MỘT route** (`app/page.tsx`); mọi "khoang" là trạng thái phía client. Cả
  `out/` chỉ có `index.html` · `404.html` · `404/index.html` · `_not-found/index.html`.
  Đừng suy cấu trúc URL từ tên thư mục component.
- **`tests/the-gioi-sw.ts` chạy được CẢ `out/sw.js`** (tuỳ chọn `tepSw`) — dùng nó khi nghi
  phép thay chuỗi làm hỏng bản sẽ ship.

**5. Cạm bẫy vừa trả giá** — ghi ở `CLAUDE.md` mục CẢNH BÁO, **đừng chép lại vào đây**:
tên kho gõ cứng · regex-trên-nguồn không phải cửa kiểm cho thứ có hành vi · suy route từ
tên thư mục mã nguồn.

**6. 🔴 CHƯA PUSH.** `2447261` (GĐ18) và commit của phiên này đều mới ở local.

**7. Lệnh phiên sau nên chạy.**
```bash
npm run kiem      # 1.407 test; máy tải nặng thì npx vitest run --maxWorkers=2
npm run xem-thu   # bản phát hành thật, cổng 3100 (?so-lieu=1 để đọc phễu)
```

---

> **Sổ này thay `PLAN_V2.md`** (GĐ15–GĐ18 + luồng ba bước). Sổ V2 và `PLAN_V1_LUU.md`
> (GĐ0–GĐ14) chỉ còn để tra *vì sao* các hạng mục cũ làm như vậy — **không tick thêm ô nào
> ở hai sổ đó**.
>
> **Nguyên tắc đọc:** mỗi Giai đoạn kết thúc bằng một thứ chủ dự án **tự bấm thấy được**,
> không nghiệm thu bằng câu "đã viết xong module". Mỗi hạng mục có 4 dòng: **(a)** làm gì ·
> **(b)** kiểm chứng bằng thao tác nào · **(c)** test tự động nào chạy · **(d)** ước lượng.
> Hạng mục bị người/dịch vụ ngoài chặn thì có thêm dòng **(e) chặn:**.
> **Luật tick:** chỉ tick ✅ khi (b) đã bấm thật **và** (c) đã xanh.
> 🔴 = rủi ro cao, **cố ý xếp sớm nhất**.

**Mục tiêu sổ này:** đi từ *"sửa xong rồi mà máy người dùng không nhận được"* tới **phát
được cho 30 gia đình thật, và vá được cho họ sau khi phát**.

**Đích đo được duy nhất:** sửa một chữ trong `config/disc-tu-dien.ts`, build, **bấm F5
thường** ở tab đang mở — thấy chữ mới **ngay lượt đầu**. Hôm nay việc đó bất khả thi.

---

## RÀNG BUỘC TOÀN DỰ ÁN (mọi hạng mục đều phải tuân)

- **Không backend, không CSDL, không API** (ADR-001). Dữ liệu ở IndexedDB + localStorage
  của chính máy người dùng.
- **Thư viện ngoài:** `jszip` + `jspdf` (ADR-009, chỉ nạp lười). **Không thêm gì khác** nếu
  chưa có ADR — riêng sổ này: **không Workbox, không thư viện service worker nào.**
- **Tầng lõi** (`modules/**`, `config/**`) = hàm thuần, không React không DOM (ADR-004).
  `public/sw.js` **không thuộc tầng nào** — nó là thứ TOÀN-ỨNG-DỤNG, đội dev app chủ có
  quyền bỏ đi; giữ nguyên khối chú thích đang nói điều đó.
- **Hằng nghiệp vụ đọc từ `config/`**, không hardcode.
- **Chữ hiển thị gom ở `config/disc-tu-dien.ts`**, không gõ thẳng vào component.
- **Trần gói chính 300 KB gzip** — `scripts/kiem-co-goi.mjs` canh. Sổ này **không được làm
  gói chính to thêm một byte nào**: mọi thay đổi nằm trong `public/sw.js`, vốn không phải
  chunk JS của trang.

---

## TRƯỚC KHI BẮT ĐẦU (5 phút, làm một lần)

- [x] **V3.0 — Chuyển quyền sở hữu hai ô còn mở của sổ V2**
  - **(a)** Thêm một dòng ở đầu `PLAN_V2.md`: *"ĐÓNG SỔ 28/08/2026. Hai ô `V0.1`/`V0.2`
    chuyển sang `PLAN_V3.md` thành `21.1`/`22.1` — không tick ở đây nữa."* Cập nhật
    `CLAUDE.md` mục TRẠNG THÁI trỏ sang sổ V3. **Chuyển, không chép** — hai bản danh sách
    chỉ lệch vào đúng ngày ai đó sửa một bên.
  - **(b)** Mở `PLAN_V2.md`, thấy dòng đóng sổ ở đầu; mở `CLAUDE.md`, thấy nó trỏ sang V3.
  - **(c)** `npm run check:structure` (cửa cấu trúc file não).
  - **(d)** 0,05 ngày.

---

## 🔴 GIAI ĐOẠN 19 — Service worker chịu cập nhật

> **Vì sao xếp ĐẦU TIÊN.** Đây không phải chuyện phiền lúc dev. Sau khi phát cho 30 gia
> đình, **mọi bản vá đẩy lên sẽ không tới được máy nào đã từng mở trang** — họ chạy mãi bản
> đầu tiên, và không ai bảo phụ huynh mở DevTools đi bỏ đăng ký service worker được. Mọi
> giai đoạn sau đều xây trên giả định *"vá được thì vá tới nơi"*. Giả định đó hôm nay SAI.
>
> **Toàn bộ GĐ19 là việc MÁY** — không hạng mục nào chờ người hay dịch vụ ngoài.
>
> **Ba quyết định đã chốt 28/08/2026, đừng mở lại:** bỏ `skipWaiting` · cửa canh là harness
> hành vi chứ không phải regex trên mã nguồn · vá kèm lỗ ngoại tuyến `trailingSlash`.

- [x] 🔴 **19.1 — Dựng thế giới giả cho service worker, và CHỨNG MINH NÓ ĐỎ**
  - **(a)** Tạo `tests/the-gioi-sw.ts` (helper dùng chung, theo tiền lệ
    `tests/duong-vao-bai.ts`): dựng `self` / `caches` / `fetch` giả rồi **chạy thật** ba
    trình xử lý của `public/sw.js` bằng `new Function(...)`. Thế giới giả có công tắc
    *mạng sống / mạng chết*, bảng nội dung theo URL, bộ đếm lượt `fetch`, và bộ nhớ kho
    dạng `Map<tên kho, Map<url, nội dung>>`. Rồi viết **chín cửa hành vi** vào
    `tests/ngoai-tuyen.test.ts`. **Chưa sửa một dòng nào của `public/sw.js`** ở hạng mục này.
    🔴 Dùng `new Function`, **KHÔNG dùng `node:vm`** — `vm` tạo realm riêng, đúng cái bẫy
    hai realm đã cắn ở `17.4` (`instanceof` trượt, và câu báo lỗi không hề nhắc tới realm).
  - **(b)** Chủ dự án chạy `npx vitest run tests/ngoai-tuyen.test.ts`. **Kết quả thật:
    4 ĐỎ / 17 xanh** — cửa ②b (hai bản build ra cùng một tên kho) · ③ (`skipWaiting` bị
    gọi) · ④ (điều hướng ra bản cũ) · ⑨ (`caches.match` toàn cục trả bản đời trước). Sổ
    dự đoán 2 cửa, thực tế 4: cửa ② như viết ban đầu **xanh** trên mã cũ, vì harness tự
    gieo một kho tên khác nên `activate` xoá được — hình hài thật của lỗi B là *tên kho
    không đổi theo bản build*, nên đã tách thành cửa **②b**. Câu lỗi của cửa ④ đọc lên
    đúng triệu chứng trên trình duyệt: `expected '<html>cu</html>' to be '<html>moi</html>'`.
    **Đây là bằng chứng cửa canh đo thứ thật, không phải cửa trang trí** — đúng bài học
    `16.9`, nơi một cửa chạy trong jsdom luôn xanh kể cả trên trang tràn ngang thảm hại.
  - **(c)** `tests/ngoai-tuyen.test.ts` — 9 cửa hành vi: ① `install` nạp đủ danh sách vào
    kho mang tên thế hệ này · ② `activate` xoá kho tên khác nhưng **giữ** kho tên mình ·
    ③ `install` **không** gọi `skipWaiting` · ④ điều hướng + mạng **sống** ⇒ ra bản của máy
    chủ, không ra bản trong kho · ⑤ điều hướng + mạng **chết** ⇒ ra vỏ trang trong kho ·
    ⑥ request `.js` + mạng **chết** ⇒ **ném**, tuyệt đối không trả HTML · ⑦ request `.js`
    đã có trong kho ⇒ không đụng mạng (đếm lượt `fetch` = 0) · ⑧ khác nguồn hoặc không phải
    GET ⇒ không `respondWith` · ⑨ hai thế hệ kho cùng tồn tại, cùng một URL nội dung khác
    ⇒ phải ra bản **mới**. Tám test cũ trong file giữ nguyên, không được đỏ.
  - **(d)** 0,5 ngày.

- [x] 🔴 **19.2 — Vân tay bản build vào tên kho, và bỏ `skipWaiting`**
  - **(a)** `public/sw.js`: đổi `const TEN_KHO = "disc-vo-v2"` thành
    `const TEN_KHO = "disc-vo-__VAN_TAY__"` kèm chú thích nói thẳng hậu quả của việc gõ
    cứng. Bỏ `await self.skipWaiting()` trong `install` — tab đang mở giữ nguyên bản cũ +
    kho cũ tới khi đóng hết, đó là bảo hiểm cho `await import("jspdf")` của ADR-009 (chiếm
    quyền ngay rồi xoá kho cũ có thể làm một phiên đang mở bấm *Sao lưu* rồi xin một tên
    tệp băm không còn tồn tại ở đâu cả). `scripts/sinh-danh-sach-cache.mjs`: tính
    `createHash("sha256")` của **chính nội dung danh sách** — danh sách chứa tên tệp đã băm
    nên nó đổi khi và chỉ khi có tài sản đổi, không đẻ ra bản cập nhật giả — lấy 12 ký tự
    hex, đọc `out/sw.js`, thay mốc, ghi lại. 🔴 **Không tìm thấy mốc thì `process.exit(1)`**
    kèm câu lỗi nói rõ hậu quả: vá hụt thì build vẫn xanh, test vẫn xanh, chỉ máy người
    dùng là đứng yên vĩnh viễn. Thêm `/sw.js` và `/danh-sach-cache.json` vào `BO_QUA`.
  - **(b)** Chủ dự án chạy `npm run build`, thấy dòng mới `✅ out/sw.js — tên kho
    disc-vo-<12 ký tự>`. Chạy `grep TEN_KHO out/sw.js` → thấy 12 ký tự hex, không còn chữ
    `__VAN_TAY__`. Sửa một chữ trong `config/disc-tu-dien.ts`, build lại, grep lại → **12
    ký tự đó phải KHÁC**.
    🔴 **ĐÃ ĐO 29/08/2026, kết quả khác dự đoán của sổ.** Sổ ban đầu còn đòi *"build lại
    mà không sửa gì thì vân tay phải GIỐNG"* — **không đạt, và đó không phải lỗi.** Next
    đúc một `buildId` **ngẫu nhiên mỗi lần build**, nên danh sách khác đi giữa hai lần
    build giống hệt nhau (`JVJ80qGW2eD5…` → `p-mxLbw2EKfk…`). Hệ quả duy nhất: mỗi lần
    deploy máy người dùng nạp lại kho — chấp nhận được, vì tính chất BẮT BUỘC là *"không
    bao giờ bỏ sót một thay đổi thật"* và tính chất đó đạt. **Đừng ghim
    `generateBuildId` vào hằng số để "chữa"**: khi đó hai bản build khác nội dung dùng
    chung đường dẫn `/_next/static/<hằng số>/_buildManifest.js` và `taiSan()` cache-first
    phục vụ bản cũ trên một đường dẫn trông như bất biến — đúng loại lỗi cả GĐ19 sinh ra
    để chữa. Yêu cầu "phải GIỐNG" đã **gỡ khỏi hạng mục này**.
  - **(c)** Cửa ② và ③ của `19.1` chuyển sang XANH. Thêm 4 cửa hiện vật vào
    `tests/ngoai-tuyen.test.ts` (guard `existsSync`, chưa build thì bỏ qua): `public/sw.js`
    có mốc và **không** còn tên kho gõ cứng · `out/sw.js` **hết** mốc và tên khớp
    `/^disc-vo-[0-9a-f]{12}$/` · vân tay trong `out/sw.js` **khớp hash tính lại** từ
    `out/danh-sach-cache.json` · danh sách nạp sẵn **không** chứa `/sw.js`.
  - **(d)** 0,3 ngày.

- [x] 🔴 **19.3 — Điều hướng đi MẠNG trước, tài sản băm đi KHO trước**
  - **(a)** Tách thân `fetch` của `public/sw.js` thành hai hàm, mỗi hàm một luật.
    `dieuHuong(yc)` — **mạng trước**: HTML là thứ trỏ tới tên tệp JS đã băm, lấy HTML cũ
    trong kho là khoá người dùng vào nguyên bản cũ kể cả khi máy chủ đã có bản mới; mạng
    hỏng thì rơi về kho (chính URL đó, rồi tới vỏ `/`). `taiSan(yc)` — **kho trước**: tên
    có mã băm nên nội dung bất biến, có trong kho là chắc chắn đúng; **mạng hỏng thì NÉM**,
    tuyệt đối không trả vỏ trang. 🔴 Luật GĐ7 (*request `.js` nhận HTML thì trang lên mà
    không bấm được gì, và `requestfailed` báo 0 nên không ai biết hỏng*) nay được giữ bằng
    **cấu trúc** — hàm `taiSan` không có nhánh nào trả HTML — chứ không bằng một câu `if`
    dễ sửa nhầm. 🔴 Cả hai hàm tra cứu bằng `kho.match(...)` trên **đúng kho của thế hệ
    mình**, không dùng `caches.match(...)` toàn cục: lúc giao ca có hai kho cùng tồn tại và
    `caches.match` duyệt theo thứ tự tạo, nên nó trả về bản **cũ** trước — đúng cái bẫy
    đang đi chữa.
  - **(b)** 🔴 **Đây là cửa nghiệm thu chính của cả sổ.** `npm run xem-thu`, mở
    `localhost:3100`, DevTools ▸ Application ▸ Cache storage — ghi lại tên kho. Sửa một chữ
    hiển thị trong `config/disc-tu-dien.ts`. `npm run xem-thu` lại. **Bấm F5 thường ở chính
    tab cũ** (không `Cmd+Shift+R`) → **phải thấy chữ mới ngay lượt đầu**. Rồi đóng hết tab
    của cổng 3100, mở lại → Cache storage chỉ còn **một** kho, tên đã đổi. Rồi DevTools ▸
    Network ▸ Offline → F5 → trang vẫn lên **và bấm được** (không phải chỉ hiện ra).
  - **(c)** Cả 9 cửa hành vi của `19.1` xanh, đặc biệt ④ ⑥ ⑦ ⑨. `npm run kiem` toàn bộ xanh.
  - **(d)** 0,3 ngày.

- [x] **19.4 — Bịt lỗ ngoại tuyến của `trailingSlash`**
  - **(a)** `next.config.mjs` bật `trailingSlash: true` nên trình duyệt xin `/duong/dan/`,
    còn danh sách nạp sẵn chỉ ghi `/duong/dan/index.html` — hai URL khác nhau, kho không
    khớp. Trong `scripts/sinh-danh-sach-cache.mjs`, mỗi `.../index.html` sinh thêm dạng thư
    mục tương ứng. **Siết** (không nới) test *"mọi đường dẫn đều có thật trong out/"*: dạng
    thư mục phải quy về đúng `index.html` của nó, vì `existsSync` trên một thư mục thì thư
    mục RỖNG cũng lọt.
  - **(b)** 🔴 **ĐÃ ĐO 29/08/2026 — LỖ NÀY KHÔNG TỒN TẠI NHƯ SỔ ĐÃ TẢ.** App chỉ có **một**
    route (`app/page.tsx`); mọi "khoang" là trạng thái phía client, **không phải trang**.
    Cả `out/` chỉ có `index.html` · `404.html` · `404/index.html` · `_not-found/index.html`.
    `/khoang/nha-minh/` là thứ **tôi suy ra nhầm từ tên thư mục component** lúc viết sổ.
    Nghiệm thu thay bằng: mở `out/danh-sach-cache.json`, thấy `/404/` và `/_not-found/` nằm
    cạnh dạng `.../index.html` của chúng. **Không có thao tác nào cho anh bấm ở hạng mục
    này** — đừng đi tìm một trang con để gõ địa chỉ, không có trang nào cả.
    Ba dòng sinh dạng thư mục vẫn giữ: chúng đúng, tốn 2 mục, và phủ sẵn cho ngày ai đó
    thêm route thật.
  - **(c)** `tests/ngoai-tuyen.test.ts` — hai cửa hiện vật: mỗi `.../index.html` phải có
    dạng thư mục đi kèm · mọi đường dẫn phải quy về một TỆP có thật.
  - **(d)** 0,15 ngày.

- [x] **19.5 — Ghi lại bài học vào đúng chỗ**
  - **(a)** `CLAUDE.md` mục **CẢNH BÁO / CẠM BẪY**: *"Tên kho cache gõ cứng = service worker
    không bao giờ tự cập nhật, và nó im lặng tuyệt đối — build xanh, test xanh, chỉ máy
    người dùng là đứng yên."* `CLAUDE.md` bảng **QUYẾT ĐỊNH**: một dòng cho *bỏ
    `skipWaiting`* + *điều hướng đi mạng trước*. **Không viết ADR mới** — đây là sửa lỗi
    trong ranh giới ADR-001, không lật quyết định nào.
  - **(b)** Mở `CLAUDE.md`, đọc hai mục đó, thấy nó giải thích được cho một người chưa biết
    gì về phiên này *vì sao* lại bỏ `skipWaiting`.
  - **(c)** `npm run check:structure`.
  - **(d)** 0,1 ngày.

### DEMO CUỐI GĐ19 — chủ dự án tự bấm

1. `npm run xem-thu` → `localhost:3100` → DevTools ▸ Application ▸ Cache storage: **một**
   kho tên `disc-vo-<12 ký tự hex>`.
2. Sửa một chữ trong `config/disc-tu-dien.ts` → `npm run xem-thu` → **F5 thường** ở tab cũ
   → **thấy chữ mới ngay lượt đầu**. 🔴 Đây là thứ hôm nay bất khả thi.
3. Đóng hết tab cổng 3100, mở lại → Cache storage vẫn chỉ **một** kho, tên đã đổi.
4. Network ▸ Offline → F5 → trang lên **và bấm vào một bộ đề được**.
5. ~~Vẫn offline, gõ thẳng địa chỉ một trang con chưa từng mở~~ — **bỏ bước này**: app chỉ
   có một route, không có trang con nào để gõ (xem `19.4` (b)).
6. `npm run kiem` xanh, `npm run build` xanh, gói chính **vẫn ≤ 300 KB gzip**.

> **Máy anh đang kẹt sẵn `disc-vo-v2`:** không cần vào DevTools xoá tay. `sw.js` mới khác
> byte nên trình duyệt tự cài bản mới; do đã bỏ `skipWaiting` nên nó **đợi** — chỉ cần đóng
> hết tab của cổng đó rồi mở lại (xấu nhất là hai lượt) là kho cũ bị dọn.

---

## GIAI ĐOẠN 20 — Bước đang mở phải đóng lại được

> Lỗi này `PLAN_V2.md` đã **tìm thấy và cố ý không sửa** (ngoài phạm vi GĐ18), ghi ở mục 6
> khối bàn giao của sổ đó. Đưa sang đây vì nó nằm ở màn đầu tiên mọi phụ huynh nhìn thấy.

- [x] **20.1 — `cac-buoc.tsx`: `useEffect` tự-mở-hộ mở lại ngay sau khi người dùng đóng**
  - **(a)** [app/khoang/cac-buoc.tsx:100-103](app/khoang/cac-buoc.tsx#L100-L103): `useEffect`
    có `dangMo` trong mảng phụ thuộc và chốt chặn `if (!dem || dangMo !== null) return`.
    Người dùng đóng bước ⇒ `dangMo` về `null` ⇒ effect chạy lại ⇒ thấy `null` ⇒ mở lại ngay.
    Chú thích tại chỗ ghi *"chỉ chọn hộ MỘT LẦN"*; mã không làm vậy. Sửa bằng một `ref` nhớ
    *"đã chọn hộ rồi"*, **không** bằng cách bỏ `dangMo` khỏi mảng phụ thuộc (bỏ đi là để lại
    một lời nói dối với ESLint và người đọc sau).
  - **(b)** Mở `localhost:3100` ▸ khoang *Các bước*. Bước 1 tự mở (đúng). Bấm vào tiêu đề
    bước 1 để đóng → **nó phải đóng và ở yên đó**. Bấm mở bước 2, rồi đóng bước 2 → cũng ở
    yên. Tải lại trang → bước đầu chưa xong lại tự mở (hành vi tự-mở-hộ vẫn còn).
  - **(c)** File mới `tests/cac-buoc-dong-mo.test.tsx` (hôm nay chưa có test riêng cho màn
    này — `cac-buoc.tsx` chỉ được `tests/bo-cuc.test.tsx` và `tests/khoi-giu-du-lieu.test.tsx`
    chạm tới, cả hai đo thứ khác). Ba cửa: ① chưa xong bước nào ⇒ bước 1 tự mở · ② bấm đóng
    bước đang mở ⇒ nội dung bước **không** còn trên màn **sau khi effect chạy xong** (dùng
    `waitFor`, vì lỗi này chính là một effect chạy ở lượt sau) · ③ mở bước 2 rồi đóng ⇒ cũng
    ở yên đóng, và bước 1 **không** tự bật lên thế chỗ.
  - **(d)** 0,25 ngày.
  - **(e) chặn:** NGƯỜI — chủ dự án quyết có sửa ở sổ này không. `PLAN_V2.md` ghi *"Chủ dự
    án quyết"*. Nếu để lại thì bỏ cả GĐ20, đừng để ô treo.

### DEMO CUỐI GĐ20

Vào khoang *Các bước*, đóng bước đang mở, **nó ở yên đóng**. Tải lại trang thì hành vi
tự-mở-hộ vẫn còn nguyên.

---

## 🔴 GIAI ĐOẠN 21 — Lên host thật

> Nguyên là `V0.1` của `PLAN_V2.md`. **Chặn cứng ngày phát, và không code nào cứu được.**

- [ ] 🔴 **21.1 — Đưa bản hiện tại lên host thật**
  - **(a)** Deploy `out/` lên Cloudflare Pages (trang tĩnh, gói miễn phí dùng thương mại
    được — Vercel Hobby thì không). Nối repo GitHub → Pages, hoặc thêm `wrangler.toml`.
    **Cố ý deploy bản đang có, chưa đụng gì vào giao diện** — để tách rủi ro hạ tầng khỏi
    rủi ro code. Ghi cấu hình vào `.claude/infra.json`.
  - **(b)** Chủ dự án mở link trên **điện thoại của mình, dùng 4G không dùng wifi nhà**,
    thấy màn DISC lên; bấm được vào một bộ đề bất kỳ; tắt mạng rồi mở lại vẫn vào được.
    Gửi link đó cho một người khác, họ mở được. 🔴 **Rồi đẩy một bản vá nhỏ lên và bấm F5
    trên chính điện thoại đó — phải thấy bản mới.** Đây là lần đầu tiên GĐ19 được chứng
    minh trên hạ tầng thật thay vì trên `localhost`.
  - **(c)** `.github/workflows/kiem.yml` chạy `npm run kiem` trước khi build. Không có test
    tự động nào thay được bước (b) — đây là hạng mục hạ tầng.
  - **(d)** 0,5 ngày máy (sau khi đã có tài khoản).
  - **(e) chặn:** NGOÀI — cần **tài khoản Cloudflare** + **một tên miền**. Chưa có
    `infra.json`, chưa có cấu hình host nào trong repo, chưa ai bấm deploy lần nào.

### DEMO CUỐI GĐ21

Một cái link công khai, mở được trên 4G, gửi cho người khác họ mở được — **và đẩy được bản
vá tới nó**.

---

## 🔴 GIAI ĐOẠN 22 — Kiểm chứng trên thiết bị thật

- [ ] 🔴 **22.1 — Quét thử mã mời bằng HAI điện thoại thật**
  - **(a)** Máy A tạo mã mời QR sau khi làm xong một bài. Máy B mở camera quét. Không cần
    viết code — đây là phép đo, không phải hạng mục dựng.
  - **(b)** Hai điện thoại khác nhau, 30 phút. Máy B quét được mã trên màn máy A ở khoảng
    cách cầm tay bình thường, dưới ánh sáng phòng bình thường; hồ sơ hiện ra đúng người.
    Thử thêm: màn giảm độ sáng, và chụp màn hình rồi gửi qua tin nhắn.
  - **(c)** Đã có sẵn từ `11.1`: test dựng lại lưới từ nét vẽ Canvas rồi giải mã ngược, cộng
    phép thử hội chứng Reed–Solomon. **Ống kính, ánh sáng và độ tương phản thì không mô
    phỏng được** — đó chính là lý do hạng mục này tồn tại.
  - **(d)** 0 ngày máy.
  - **(e) chặn:** NGƯỜI — hai điện thoại thật, 30 phút. Hỏng thì phải ẩn nút QR trước khi
    phát, và nói thẳng với sale là *"cả nhà dùng chung một máy"*.

- [ ] **22.2 — Bấm mắt bảy việc còn nợ của GĐ18**
  - **(a)** Không code. `PLAN_V2.md` tick 9/9 ô GĐ18 dựa trên test xanh, nhưng bảy việc ở
    ba mục *DEMO CUỐI 18A/18B/18C* thì **chưa ai bấm bằng mắt**. Lệch chỗ nào thì mở hạng
    mục MỚI ở sổ này, **đừng bỏ tick ở sổ V2**.
  - **(b)** Mở `PLAN_V2.md`, làm lần lượt bảy việc ở ba mục DEMO CUỐI của GĐ18 — trên host
    thật của `21.1`, không trên `localhost`.
  - **(c)** Không có. Đây đúng là loại việc test không thay được — bài học đã trả giá:
    *"Viết xong giao diện thì phải NHÌN, không chỉ chạy test."*
  - **(d)** 0 ngày máy.
  - **(e) chặn:** NGƯỜI — chủ dự án bấm. Phụ thuộc `21.1` xong trước.

### DEMO CUỐI GĐ22

Hai điện thoại, một mã QR quét được thật. Và bảy việc GĐ18 đã có người nhìn tận mắt trên
bản chạy ở host thật.

---

## TỔNG ƯỚC LƯỢNG

| Giai đoạn | Máy | Người / Ngoài |
| --- | --- | --- |
| V3.0 — chuyển sổ | 0,05 ngày | — |
| 🔴 **19 — service worker chịu cập nhật** | **1,35 ngày** | không có |
| 20 — bước đóng lại được | 0,25 ngày | 1 quyết định |
| 🔴 21 — lên host thật | 0,5 ngày | **tài khoản Cloudflare + tên miền** |
| 🔴 22 — thiết bị thật | 0 ngày | 2 điện thoại · 30 phút + 1 lượt bấm mắt |
| **Tổng** | **~2,15 ngày máy** | **3 việc người, 1 việc mua ngoài** |

🔴 **Chỉ GĐ19 là chạy được ngay hôm nay.** GĐ20 chờ một câu trả lời của anh; GĐ21 chờ tài
khoản; GĐ22 chờ GĐ21. Nghĩa là: **duyệt GĐ19 xong thì máy chạy liền một mạch tới hết**, rồi
dừng lại chờ người.

---

## THỨ TỰ RỦI RO — vì sao xếp như vậy

| Hạng mục | Rủi ro nếu làm sai | Xếp ở đâu |
| --- | --- | --- |
| `19.1` harness | **Cửa canh giả.** Nếu harness không tái hiện được lỗi thì cả GĐ19 thành đoán, và ta tự tay dựng đúng loại cửa mà bài học `16.9` đã cảnh báo | **Đầu tiên**, và bắt buộc phải ĐỎ trước khi sửa |
| `19.2` vân tay | Vá hụt thì **build xanh, test xanh, máy người dùng đứng yên vĩnh viễn** — im lặng tuyệt đối. Chính vì thế mới có cửa `process.exit(1)` | Thứ hai |
| `19.3` hai luật fetch | Đụng thẳng luật GĐ7 đã trả giá: trả vỏ trang cho request `.js` thì trang lên mà **không bấm được gì**, và không lỗi nào hiện ra | Thứ ba, ngay sau khi đã có cửa canh thật |
| `21.1` host | **Chặn cứng ngày phát.** Không có code nào gỡ được | Ngay khi có tài khoản — đừng đợi GĐ20 |
| `22.1` QR | Hỏng thì mất một tính năng đã bán trong lời chào hàng, và chỉ biết vào phút chót | Ngay khi mượn được hai máy |

---

## ❌ KHÔNG LÀM Ở PHIÊN BẢN NÀY

| Không làm | Vì sao |
| --- | --- |
| **Tự tải lại trang khi có bản mới** (`controllerchange` → `location.reload()`) | Là cướp bài của người đang làm dở. Một phụ huynh vừa trả lời 18/20 câu mà trang tự nhảy thì mất niềm tin nhiều hơn là được một bản vá sớm 5 phút. `19.3` đã khiến bản mới tới ở lần tải trang kế tiếp — đủ rồi |
| **Thanh báo "Có bản mới, bấm để cập nhật"** | Thêm giao diện, thêm chữ vào `disc-tu-dien.ts`, thêm test, thêm một trạng thái nữa phải nghĩ. Chưa ai yêu cầu. Mở ra nếu sau khi phát có người thật kêu |
| **Đổi sang Workbox hay bất kỳ thư viện service worker nào** | `public/sw.js` đang 80 dòng và đội dev app chủ có quyền bỏ nguyên nó đi. Thêm một phụ thuộc vào thứ sắp bị bỏ là trả giá hai lần. Đụng cả ràng buộc thư viện ngoài của ADR-009 |
| **Kho có hạn dùng / dọn theo dung lượng** | Chưa có một số đo nào nói kho đang phình. `19.2` đã khiến mỗi lúc chỉ còn một thế hệ. Tối ưu trước khi đo là đoán — đúng bài học `17.1` |
| **Nạp sẵn font PDF 133 KB** | Nó chỉ dùng khi bấm *Sao lưu*, và ADR-009 chốt nạp lười. Nạp sẵn là bắt mọi phụ huynh tải một thứ phần lớn không bao giờ chạm |
| **Backend + đăng nhập + đồng bộ** | Giữ ADR-001. Làm ngay thì **công ty thành bên xử lý dữ liệu cá nhân TRẺ EM** (NĐ 13/2023) — thứ ADR-001 đã cố ý mua đường tránh — và cần đội dev app chủ, những người **chưa ai hỏi họ có nhận không**. `16.4` đã tách tầng sẵn để cắm vào sau |
| **Sửa câu chữ nội dung** | Không đụng `config/disc-noi-dung-cap.ts` và họ hàng — phần đang chờ ký duyệt. Đổi lúc này là làm hai hồ sơ ký duyệt lỗi thời thêm một lần nữa |
| **Xoá thật thư mục `cu/`** | Chờ tới khi đã phát cho gia đình thật và chắc chắn không quay lại. Xoá sớm tiết kiệm vài KB mà mất một bản dựng đã chạy đúng |
| **So sánh "hồi đó ↔ bây giờ"** | Sàn 90 ngày vẫn giữ. Sớm nhất **cuối tháng 11/2026** mới có gia đình đầu tiên đủ hai bài cách 90 ngày |
| **Đo lại bộ nhớ đệm HTTP** | Đã đo: `scripts/xem-ban-phat-hanh.mjs` gửi `cache-control: no-store`. Hướng đó đã loại, đừng quay lại |

---

## 🏁 ĐIỀU KIỆN DỪNG

**Không chép lại ở đây.** Hai con số `?so-lieu=1` và cách đọc chúng nằm nguyên ở mục
*ĐIỀU KIỆN DỪNG* cuối `PLAN_V2.md` — nó không đổi vì sổ V3 không đụng gì tới phễu mời.

Riêng sổ này có thêm **một điều kiện dừng của chính nó**: nếu sau `19.3` mà thao tác
*"sửa một chữ → build → F5 thường → thấy chữ mới"* **vẫn không chạy**, thì dừng, đừng sửa
tiếp `public/sw.js` theo cảm tính. Quay lại đọc cửa nào trong 9 cửa đang đỏ — cửa đó biết
câu trả lời, và nó đã được dựng ở `19.1` đúng để trả lời câu này.
