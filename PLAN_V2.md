# PLAN_V2.md — Lộ trình đang có hiệu lực

## BÀN GIAO PHIÊN GẦN NHẤT

> 🔴 **GHI ĐÈ mỗi phiên** — khối mới THAY khối cũ, không xếp chồng.

**Phiên 28/08/2026 (lượt 3) — GĐ16 VÀ GĐ17 xong trọn. Sổ này HẾT VIỆC MÁY.**

**1. Vừa xong.** GĐ17 `17.1`→`17.7`, ba đợt 17A/17B/17C. **1.366 test xanh** ·
`npm run kiem` + `npm run build` xanh · gói chính **290 KB gzip** (trần 300).
Sổ còn đúng **HAI** ô chưa tick: `V0.1` và `V0.2`, cả hai chặn bởi NGƯỜI/NGOÀI.

**2. Đang dở.** Không còn việc máy nào trong sổ này.

**3. Chặn ở NGƯỜI / NGOÀI.** `V0.1` tài khoản Cloudflare + tên miền (chặn ngày phát) ·
`V0.2` hai điện thoại thật quét QR · hai chữ ký chuyên môn · duyệt câu chữ
`docs/huong-dan-giao-vien-va-sale.md` · gọi đội dev app chủ · gọi 5 phụ huynh vừa nghỉ.

**4. ĐÃ ĐO, ĐỪNG ĐO LẠI.**
- 🔴 **jsPDF TỰ CẮT FONT.** Sinh 42 tệp PDF (trường hợp xấu nhất) mất **0,48 giây**, gói
  `.zip` **2,65 MB**; một tệp chỉ **48 KB — nhỏ hơn chính tệp font gốc 130 KB**. Nỗi lo
  "mỗi tệp cõng trọn 133 KB font" là lo hão. `tests/chi-phi-pdf.test.ts` ghim lại cả hai
  con số. **Đừng thêm thanh tiến trình đếm từng tệp** — nửa giây thì không ai kịp thấy.
- 🔴 **Trần 2 bài/người + hộp thoại cảnh báo ĐÃ CÓ TỪ GĐ12**, đừng xây lại. Ở ý "xem lại
  bản cũ" chỉ thiếu cái NÚT CHUYỂN, và nó đã làm ở `17.2`.
- **Tệp `.zip` nay có BA đời** — v1 (`bai/`), v2 (`du-lieu/`, sinh ngày 28/08 lượt 2),
  v3 (`_may-doc/`). `docTuZip()` đọc được cả ba; `tests/khoi-phuc.test.ts` canh.
- **jsdom có HAI REALM.** `new TextEncoder().encode()` trả một `Uint8Array` mà
  `instanceof` bên trong JSZip **trượt** — JSZip ném *"Can't read the data of …"*, câu báo
  lỗi không hề nhắc tới realm. Fixture phải dùng `Uint8Array.from()`. Sản phẩm thật chạy
  trong trình duyệt một realm nên **không dính**.
- **jsdom KHÔNG có bộ dựng layout** — `offsetWidth` luôn 0. Mọi test đo pixel ở đó là cửa
  kiểm giả. `tests/bo-cuc.test.tsx` và `tests/be-ngang.test.tsx` vì thế soi LỚP CSS.
- **Bề rộng gom hết về `config/bo-cuc.ts`.** Không màn nào còn gõ cứng `max-w-3xl`, và có
  cửa canh chiều ngược lại: bốn màn đọc-và-trả-lời PHẢI giữ khung hẹp.

**5. Cạm bẫy vừa trả giá.** Đã ghi vào mục *CẢNH BÁO / CẠM BẪY* của `CLAUDE.md`.

**6. Lệnh phiên sau nên chạy.**
```bash
npm run kiem            # 1.366 test; máy tải nặng thì npx vitest run --maxWorkers=2
npm run build           # có sẵn cửa canh cỡ gói ở cuối
npm run xem-thu         # bản phát hành thật, cổng 3100 (?so-lieu=1 để đọc phễu)
```

---

> **Sổ này thay `PLAN_V1_LUU.md`** (tên cũ `PLAN.md`, ghi GĐ0–GĐ14). Sổ cũ chỉ còn để tra
> *vì sao* 68 hạng mục cũ được làm như vậy — **không tick thêm ô nào ở đó**.
>
> **Nguyên tắc đọc:** mỗi Giai đoạn kết thúc bằng một thứ chủ dự án **tự bấm thấy được**,
> không nghiệm thu bằng câu "đã viết xong module". Mỗi hạng mục có 4 dòng: **(a)** làm gì ·
> **(b)** kiểm chứng bằng thao tác nào · **(c)** test tự động nào chạy · **(d)** ước lượng.
> Hạng mục bị người/dịch vụ ngoài chặn thì có thêm dòng **(e) chặn:**.
> **Luật tick:** chỉ tick ✅ khi (b) đã bấm thật **và** (c) đã xanh.
> 🔴 = rủi ro cao, **cố ý xếp sớm nhất**.

**Mục tiêu sản phẩm:** một gia đình đi được từ *"nghe giáo viên nói"* tới *"cả nhà đọc bản
phân tích về nhau"*, và trong lúc đó **rủ được người thứ hai cùng làm**.

**Đích đo được duy nhất:** phễu mời — *bao nhiêu người bấm mời* / *bao nhiêu người thứ hai
làm xong*. Hai con số chẩn đoán ngược nhau; đọc ở `?so-lieu=1`.

---

## RÀNG BUỘC TOÀN DỰ ÁN (mọi hạng mục đều phải tuân)

- **Không backend, không CSDL, không API** (ADR-001). Dữ liệu ở IndexedDB + localStorage
  của chính máy người dùng.
- **Thư viện ngoài:** `jszip`, và từ GĐ16 thêm **một** thư viện PDF **chỉ nạp lười**
  (ADR-009). Không thêm gì khác nếu chưa có ADR.
- **Tầng lõi** (`modules/**`, `config/**`) = hàm thuần, không React không DOM
  (`tests/ranh-gioi-hai-tang.test.ts` canh — ADR-004).
- **Hằng số nghiệp vụ đọc từ `config/`**; **chữ hiển thị gom vào `config/disc-tu-dien.ts`**.
- **Tiếng Việt 100%** cho chữ người dùng thấy. Tên biến/hàm: tiếng Việt không dấu.
- **Cấm chữ "phi lợi nhuận"** ở mọi chữ mới (`tests/thong-diep.test.tsx` quét cả `config/`).
- **Test dùng tên bịa.** Không đưa tên thật của trẻ vào test, seed, log, tài liệu.
- **Vùng `cu/` một chiều:** `app`/`modules`/`config` không được import từ đó.
- Sau mỗi hạng mục: `npm run kiem` phải xanh mới đi tiếp. Máy tải nặng thì
  `npx vitest run --maxWorkers=2` — Docker từng làm 19–20 test đỏ giả.

---

## 🔴 HAI HẠNG MỤC ĐANG CHẶN NGÀY PHÁT — không phải việc máy

> Hai việc này **đã nằm trong sổ từ trước GĐ16 và vẫn chưa xong**. Chúng chặn ngày đưa sản
> phẩm tới 30 gia đình, và **không dòng code nào gỡ được**. Giữ ở đầu sổ để không lần nào
> mở sổ ra mà không nhìn thấy chúng.

- [ ] 🔴 **V0.1 — Đưa bản hiện tại lên host thật**
  - **(a)** Deploy `out/` lên Cloudflare Pages (trang tĩnh, gói miễn phí dùng thương mại
    được — Vercel Hobby thì không). Thêm `wrangler.toml` hoặc nối repo GitHub → Pages.
    Chưa đụng gì vào giao diện — **cố ý deploy bản đang có**, để tách rủi ro hạ tầng khỏi
    rủi ro code.
  - **(b)** Chủ dự án mở link trên **điện thoại của mình, dùng 4G không dùng wifi nhà**,
    thấy màn DISC lên; bấm được vào một bộ đề bất kỳ; tắt mạng rồi mở lại vẫn vào được
    (service worker). Gửi link đó cho một người khác, họ mở được.
  - **(c)** `.github/workflows/kiem.yml` chạy `npm run kiem` trước khi build. Thêm bước
    kiểm `out/danh-sach-cache.json` tồn tại và có ≥ 30 mục.
  - **(d)** 0,5 ngày máy (phần lớn là chờ DNS).
  - **(e) chặn:** NGOÀI — cần tài khoản Cloudflare và một tên miền/subdomain.
    **Chưa có cái nào.** Đây là việc phải làm đầu tiên trong tuần.

- [ ] 🔴 **V0.2 — Quét thử mã mời bằng HAI điện thoại thật**
  - **(a)** Không viết code. Dùng bản vừa deploy: máy A tạo một thành viên (tên bịa
    `"Zozo"`), làm xong một bài, phát mã QR. Máy B quét mã đó bằng camera. Thử ở **ba điều
    kiện**: ánh sáng phòng bình thường · ngoài nắng · màn hình máy A giảm độ sáng 30%.
  - **(b)** Máy B hiện đúng hồ sơ, hỏi tên, lưu vào sổ. **Nếu một trong ba điều kiện hỏng ⇒
    ghi lại đúng điều kiện nào, rồi ẩn nút QR và nói thẳng với sale là "cả nhà dùng chung
    một máy".** Không phát một tính năng chưa ai xác minh.
  - **(c)** `tests/qr.test.ts` + `tests/ma-moi-hoan-chinh.test.tsx` đã canh phần toán
    (dựng lại lưới từ nét vẽ Canvas + phép thử hội chứng Reed–Solomon). Không thêm test —
    **cửa còn thiếu chính là camera thật, và nó không tự động hoá được.**
  - **(d)** 30 phút.
  - **(e) chặn:** NGƯỜI — cần hai điện thoại thật và một người cầm máy thứ hai.

---

## ✅ ĐÃ XONG — luồng ba bước (28/08/2026, 15 hạng mục)

> Rút gọn có chủ đích: bốn dòng chi tiết của một hạng mục ĐÃ XONG hết việc của nó. Lý do và
> bài học đã chuyển vào `CLAUDE.md` (bảng quyết định + sổ sẹo) và
> `docs/decisions/ADR-008-ba-buoc-trong-mot-khoang.md`; chi tiết thi công nằm trong thông
> điệp commit. Giữ nguyên bốn dòng ở đây là dựng một bản sao thứ hai để hai bên lệch nhau.

| Mã | Làm gì | Cửa kiểm |
| --- | --- | --- |
| `V0.3` | Bộ nạp dữ liệu mẫu chạy được trên kho v2 (7 người + 8 bài) | `tests/nap-du-lieu-mau.test.ts` |
| `V1.1` | 14 bậc học lên `config/`: Mầm non · Lớp 1–12 · Trên lớp 12 | `tests/tuy-chon-lop.test.ts` |
| `V1.2` | Ô lớp chỉ hiện với vai còn đi học; hai hàng rào chặn lớp mồ côi | `tests/form-thanh-vien.test.tsx` |
| `V1.3` 🔴 | Bộ đề suy từ VAI + BẬC HỌC — **sửa lỗi bố mẹ và mầm non không vào được bài** | `tests/dinh-tuyen.test.ts` |
| `V1.4` | Nút *Bố mẹ trả lời về {tên}* trên thẻ trẻ từ lớp 3 | `tests/nut-tren-the.test.tsx` |
| `V2.1` | Khung ba bước, thanh bên một mục, số liệu ẩn sau `?so-lieu=1` | `tests/dieu-huong.test.tsx` |
| `V2.2` 🔴 | Xoá màn *"Ai đang cầm máy?"*; mọi bài thuộc một người trong sổ | `tests/duong-vao-bai.ts` |
| `V3.1` | Danh sách 5 thư mục có ngày-giờ; **sửa lỗi riêng tư của nút Xoá sạch** | `tests/thu-muc-phan-tich.test.tsx` |
| `V3.2` | Khối *"còn thiếu ai"* nêu đích danh + nút mời | `tests/con-thieu-ai.test.tsx` |
| `V3.3` | Mốc `bamMoi` tách "đã bấm mời" khỏi "người thứ hai làm xong" | `tests/do-phieu.test.ts` |
| `V4.1` 🔴 | Cờ `MO_NOI_DUNG_TRE` chặn ở ba chỗ, test chạy cả hai trạng thái | `tests/co-noi-dung-tre.test.tsx` |
| `V4.2` | Nhắc sao lưu đúng một lần, sau bài của người thứ hai | `tests/nhac-sao-luu.test.tsx` |
| `V4.3` | `docs/huong-dan-giao-vien-va-sale.md` — 0 dòng code | *(chờ duyệt câu chữ)* |
| `V5.1` | Cách ly `cu/lich-su.tsx` + luật một chiều | `tests/vung-cach-ly.test.ts` |
| `V5.2` | ADR-008; `PLAN.md` → `PLAN_V1_LUU.md`; cập nhật `CLAUDE.md` | `npm run check:structure` |

**Trạng thái lúc chốt:** 1.208 test xanh · 61 file test · `npm run kiem` + `npm run build`
xanh · sáu commit của gói này còn ở local.

---

# GĐ16 — Gộp hai bước · PDF · dữ liệu không mất · giao diện sinh động

**Bối cảnh.** Chủ dự án bấm thử bản thật và nêu bảy điểm. Đọc mã thì chúng rơi vào **ba
nhóm khác hẳn nhau về bản chất**, và trộn lại là cách chắc chắn nhất để làm sai thứ tự ưu
tiên:

| Nhóm | Gồm những gì | Cỡ |
| --- | --- | --- |
| **Lỗi thật** | Màn không tự tải lại dữ liệu mới · sổ `.zip` không khôi phục được | Nhỏ, đắt nếu để lại |
| **Sửa luồng** | Gộp 3 bước còn 2 · ô chọn bản thiếu giờ | Nhỏ |
| **Làm mới** | Xuất PDF · bộ minh hoạ · tối ưu di động | Lớn |

**Quyết định đã chốt (28/08/2026):**

1. **PDF bằng thư viện, NẠP LƯỜI** — gói chính giữ nguyên **282 KB nén**. Cần **ADR-009**.
2. **Giữ ADR-001 — không backend.** Tách tầng lưu trữ sau một giao diện để đội dev app chủ
   cắm server của họ vào sau; cộng nút **Khôi phục** từ `.zip` để đổi máy vẫn còn dữ liệu
   **ngay hôm nay**. *Suy ra:* `.zip` chứa **PDF cho người đọc** + **JSON trong `du-lieu/`
   cho máy** — chỉ-PDF thì nút Khôi phục không có gì để đọc.
3. **Vẽ thêm bộ minh hoạ mới cùng lối nét** với bốn robot sẵn có. Không thêm thư viện hình.
4. **Làm trọn ba đợt rồi mới phát.**

**Đã có sẵn, KHÔNG phải làm lại:** hạn mức **2 bài/người** (`GIOI_HAN_BAI_MOI_NGUOI`) và
**5 thư mục phân tích** (`GIOI_HAN_THU_MUC`) đang chạy đúng như vậy.

---

## 🔴 BA HẠNG MỤC RỦI RO CAO — XẾP SỚM NHẤT CÓ CHỦ ĐÍCH

| Rủi ro | Vì sao không để cuối |
| --- | --- |
| **Lỗi không tự tải lại có TẦNG THỨ HAI** (`16.1`) | `BroadcastChannel` **không bao giờ gửi về chính ngữ cảnh vừa đăng tin**. Vá đủ mọi `postMessage` rồi mà **tab đang mở vẫn không biết** — và người dùng chỉ có một tab. Phát hiện muộn thì mọi hạng mục sau đều dựng trên một nền tưởng là đã sửa. |
| **Sổ `.zip` không khôi phục được** (`16.5`) | `JSZip.loadAsync` không có ở `app/` hay `modules/`. Người dùng bấm *Sao lưu*, yên tâm, rồi mất máy là mất sổ. Càng nhiều gia đình dùng thì càng nhiều người tin vào một lời hứa suông. |
| **Thư viện PDF làm phình gói chính** (`16.6`) | Một `import` tĩnh lỡ tay là gói tải về gấp đôi, và **không cửa nào hiện có bắt được** — build vẫn xanh, test vẫn xanh. Chỉ điện thoại 3G của phụ huynh là chịu. |

---

## GIAI ĐOẠN 16A — Lỗi thật + gộp hai bước

**Ước lượng: 1,5 ngày**

### DEMO CUỐI GĐ 16A
> Làm xong một bài → bấm quay lại → **thẻ người đó hiện ngay số bài mới, KHÔNG cần F5**.
> Thanh bên một mục; bấm vào thấy **HAI bước**: *1 Nhà mình* (tạo người **và** làm bài ngay
> tại thẻ) · *2 Phân tích cả nhà* (mở khi ≥2 người xong). 2 người → 2 bản; 4 người → 4 bản.

---

- [x] 🔴 **16.1 — Kho tự báo mọi thay đổi, kể cả trong CÙNG một tab**
  - **(a)** Gốc lỗi đã đo trên mã: `baoTabKhac()` ở
    [kho-bai.ts:316](modules/core/luu-tru/kho-bai.ts#L316) **chỉ được gọi từ hai hàm dọn
    hạn mức**; `luuBai` · `luuThanhVien` · `xoaBai` · `xoaThanhVien` · `luuPhanTich` ·
    `xoaSach*` đều **0 lần**. 🔴 Và tầng thứ hai: `BroadcastChannel` **không gửi về chính
    ngữ cảnh đã đăng tin**, nên vá đủ `postMessage` vẫn không cứu được tab đang mở.
    Dựng bộ đăng ký trong `kho-bai.ts`: `dangKyDoiKho(fn)` trả hàm huỷ đăng ký; `baoDoi()`
    làm **hai việc** — gọi mọi người đăng ký **trong tab này**, rồi mới `postMessage` cho
    tab khác. Gắn `baoDoi()` vào **mọi** lệnh ghi.
    Thêm hook `useKhoDoi(napLai)` ở `app/`: hiện **ba** component tự gõ lại
    `new BroadcastChannel(KENH_KHO)` — ba chỗ để quên.
  - **(b)** Máy trống → thêm một người → **không tải lại trang** → làm xong bài → bấm quay
    lại → thẻ hiện `1/2 bài`, bước 2 sáng lên. Xoá một người ở bước 1 → dòng đếm ở tiêu đề
    bước đổi ngay. **Không bấm F5 lần nào trong suốt bài kiểm tra này.**
  - **(c)** `tests/kho-tu-bao.test.ts` — mỗi lệnh ghi gọi đúng một lần người đăng ký; huỷ
    đăng ký thì thôi nhận; không có `BroadcastChannel` (trình duyệt cũ) vẫn báo trong tab.
    `tests/tai-lai-sau-khi-lam-bai.test.tsx` — đi trọn luồng, khẳng định số bài trên thẻ
    đổi mà **không dựng lại component**.
  - **(d)** 4 giờ.

- [x] **16.2 — Gộp ba bước còn HAI**
  - **(a)** `MA_BUOC` còn `["nha-minh", "phan-tich"]`. Bước 1 hiện **cả hai bộ nút** trên
    một thẻ: *Sửa · Xoá* **và** *Làm bài · Bố mẹ trả lời về…* — tức bỏ tham số `cheDo` của
    [bang-gia-dinh.tsx](app/khoang/bang-gia-dinh.tsx) vừa thêm ở `V2.1`.
    🔴 Giữ thứ tự an toàn: *Xoá* đứng **cuối**, xa nhất khỏi *Làm bài* — lựa chọn không
    hoàn tác được không được nằm ở chỗ ngón tay rơi vào theo phản xạ.
    Sửa `CHU_BUOC` (tên bước · dòng trạng thái · câu khoá) cho khớp hai bước.
  - **(b)** Thêm một người → **nút Làm bài hiện ngay trên thẻ đó**, không phải mở bước khác.
    Cho 2 người làm xong → bước 2 sáng → bấm *Phân tích* → **2 bản**. Thêm 2 người nữa cho
    làm xong rồi chạy lại → **4 bản**.
  - **(c)** Sửa `tests/dieu-huong.test.tsx` (đang khẳng định 3 tấm) · `tests/duong-vao-bai.ts`
    (bỏ `moBuocLamBai`) · `tests/nut-tren-the.test.tsx` · `tests/co-noi-dung-tre.test.tsx`.
    Thêm cửa mới: **N người có hồ sơ ⇒ đúng N bản phân tích** (thử N = 2, 3, 4).
  - **(d)** 5 giờ.

- [x] **16.3 — Ô chọn bản: có TÊN, NGÀY và GIỜ; mặc định bản mới nhất**
  - **(a)** Ô chọn ở [ban-tong-hop.tsx](app/khoang/ban-tong-hop.tsx) đang hiện
    `{boDe} · {ketThuc.slice(0,10)}` — **thiếu giờ**. Đổi sang `hienNgayGio()`
    ([ngay.ts:33](modules/core/tien-ich/ngay.ts#L33)); tên người đã là nhãn của dòng.
    🔴 *Mặc định bản mới nhất* **đã đúng sẵn** — `docTatCa()` sắp giảm dần theo `ketThuc` và
    ô chọn lấy `n.bai[0]`. **Không sửa logic**, chỉ thêm test khoá lại. Thứ khiến chủ dự án
    tưởng nó chọn sai là cái nhãn: hai bài cùng ngày hiện lên hai dòng giống hệt nhau.
  - **(b)** Một người có 2 bài **cùng ngày, cách nhau vài giờ** → ô chọn hiện hai dòng
    **khác nhau có giờ**; dòng đầu là bài mới hơn và được chọn sẵn. Chọn dòng cũ → bản chạy
    ra đúng mốc cũ.
  - **(c)** `tests/ban-tong-hop.test.tsx`: mặc định là bài mới nhất; hai bài cùng ngày ra
    hai nhãn khác nhau; chọn bài cũ thì engine nhận đúng điểm của bài cũ.
  - **(d)** 2 giờ.

---

## GIAI ĐOẠN 16B — PDF · khôi phục · tách tầng kho

**Ước lượng: 2,5 ngày**

### DEMO CUỐI GĐ 16B
> Bấm *Sao lưu* → nhận một `.zip`; mở ra thấy **mỗi người một file PDF** tên dạng
> `Zozo-2026-08-28-16h20.pdf`, mở trên máy khác không cài gì cũng đọc được, **tiếng Việt
> đủ dấu**. Rồi *Xoá sạch* → *Khôi phục* → chọn đúng file `.zip` đó → **cả sổ quay về**.

---

- [x] **16.4 — Tách tầng kho sau một giao diện (`KhoDisc`)**
  - **(a)** Gom mọi lối vào kho thành một giao diện ở tầng lõi
    (`modules/core/luu-tru/kho-disc.ts`): `docThanhVien` · `luuThanhVien` · `docBai` ·
    `luuBai` · `docPhanTich` … Bản dựng mặc định là IndexedDB đang có. Giao diện **không
    React, không DOM**, để đội dev app chủ viết một bản dựng gọi server của họ và cắm vào
    **mà không sửa một dòng giao diện nào**.
    🔴 ADR-004 đã hứa chuyện tách tầng này (*"đội dev nhiều khả năng viết lại giao diện"*)
    nhưng mới làm cho tầng NỘI DUNG, chưa làm cho tầng LƯU TRỮ — mà lưu trữ mới là chỗ
    server sẽ cắm vào.
  - **(b)** Không nhìn thấy gì trên màn; sản phẩm phải chạy **y hệt** trước đó. Đi hết luồng
    một lượt để chắc không rơi mất gì.
  - **(c)** `tests/kho-disc.test.ts` — một bản dựng **GIẢ, lưu trong bộ nhớ** chạy được toàn
    bộ luồng. Bản giả cắm được thì bản server cũng cắm được; đó chính là điều cần chứng
    minh. `tests/ranh-gioi-hai-tang.test.ts` phải vẫn xanh.
  - **(d)** 5 giờ.

- [x] 🔴 **16.5 — Nút KHÔI PHỤC từ `.zip`**
  - **(a)** Sổ `.zip` hiện **không nạp lại được** — `JSZip.loadAsync` chỉ có trong test.
    Thêm nút *Khôi phục* cạnh *Sao lưu*: chọn file → đọc `du-lieu/*.json` → kiểm hình dạng
    → **hỏi trước khi ghi đè**, nêu rõ máy này đang có mấy người và file kia có mấy người.
    🔴 Tuyệt đối không ghi đè im lặng: khôi phục nhầm file là mất sổ đang dùng — kiểu mất
    dữ liệu do chính nút cứu dữ liệu gây ra.
  - **(b)** Máy có 3 người → *Sao lưu* → *Xoá sạch* → *Khôi phục* chọn file vừa tải →
    **3 người và mọi bài quay về đủ**. Thử khôi phục bằng một `.zip` lạ bất kỳ → **báo lỗi
    rõ ràng và KHÔNG xoá gì**.
  - **(c)** `tests/khoi-phuc.test.ts` — khứ hồi sao lưu→khôi phục ra đúng dữ liệu cũ; file
    rác thì từ chối và **không đụng vào kho**; file thiếu trường thì nói rõ thiếu gì.
  - **(d)** 5 giờ.

- [x] 🔴 **16.6 — Xuất PDF chuẩn, nạp lười (ADR-009)**
  - **(a)** Thêm `jspdf` + một font Việt subset (`.ttf`, nhúng được). 🔴 **Chỉ nạp khi
    bấm**: `const { jsPDF } = await import("jspdf")`. Sinh **mỗi người một tệp**, tên
    `{tên}-{yyyy-mm-dd}-{HHhMM}.pdf`, nội dung là bản phân tích của đúng người đó.
    🔴 **Mỗi người một tờ** là luật đã có từ GĐ10/GĐ14: bản của Bin không được có một chữ
    nào của bản Mẹ Lan. PDF phải giữ đúng luật đó.
    Viết `docs/decisions/ADR-009-them-thu-vien-pdf.md`: vì sao lật ràng buộc một-thư-viện,
    và vì sao **nạp lười là điều kiện kèm theo**, không phải một tối ưu tuỳ chọn.
  - **(b)** Bấm *Sao lưu* → mở `.zip` → thấy N file PDF + thư mục `du-lieu/`. Mở một PDF
    **trên máy khác, không cài gì** → chữ tiếng Việt **đủ dấu, không ô vuông**, đầu trang
    có tên người và ngày giờ đánh giá.
  - **(c)** `tests/xuat-pdf.test.ts` — tệp bắt đầu bằng `%PDF-`; tên tệp có đủ tên + ngày +
    giờ; **bản của người A không chứa tên người B**.
    `tests/co-goi-chinh.test.ts` — đọc `out/` sau build và **chặn gói chính phình quá
    ngưỡng** (mốc hiện tại: 282 KB nén). Đây là cửa **duy nhất** bắt được ngày ai đó lỡ
    import tĩnh thư viện PDF: build vẫn xanh, test vẫn xanh, chỉ điện thoại 3G là chịu.
  - **(d)** 1 ngày.

---

## GIAI ĐOẠN 16C — Giao diện sinh động, chạy mượt trên điện thoại

**Ước lượng: 3 ngày**

### DEMO CUỐI GĐ 16C
> Mở trên **điện thoại thật**: mỗi thẻ thành viên có một robot nhỏ theo nhóm nổi trội của
> họ; màn trống có minh hoạ thay vì một dòng chữ; cả nhà xong thì có một nhịp chúc mừng.
> Thu cửa sổ còn **320px** rồi đi hết luồng — **không phải cuộn ngang một lần nào**.

---

- [x] **16.7 — Bộ minh hoạ mới cùng lối nét**
  - **(a)** Vẽ thêm SVG **trong chính `modules/report/hinh-nhan-vat.ts`** (cùng lối nét,
    cùng bảng màu trục với bốn robot sẵn có) cho: màn trống bước 1 · màn chờ người thứ hai ·
    nhịp chúc mừng khi cả nhà xong · huy hiệu tiến độ.
    🔴 Cùng MỘT nguồn nét với bốn robot — hai nguồn hình là hai nơi lệch nhau vào đúng ngày
    ai đó sửa một bên, và ảnh chia sẻ PNG cũng đọc từ nguồn đó.
  - **(b)** Máy trống → bước 1 có minh hoạ mời thêm người, không phải một dòng chữ trần.
    Cho cả nhà làm xong → thấy nhịp chúc mừng.
  - **(c)** `tests/hinh-minh-hoa.test.ts` — mỗi hình trả về nét vẽ khác rỗng và **nằm trọn
    trong khung khai báo**. Tràn viewBox là lỗi chỉ lộ ra khi NHÌN, nên phải có cửa canh.
  - **(d)** 1 ngày.

- [x] **16.8 — Rải màu, nhân vật và chuyển động nhẹ khắp chặng đường**
  - **(a)** Bốn robot hiện **chỉ xuất hiện ở đúng màn kết quả**; cả chặng còn lại là chữ đen
    trên nền trắng. Rải ra: thẻ thành viên mang màu nhóm nổi trội + robot nhỏ; huy hiệu
    `●●` thành vòng tiến độ; nút chính mang màu trục; bước đang mở có dải màu.
    Chuyển động **CSS thuần**: hiện dần khi mở bước, số đếm lên, thanh tiến trình trượt.
    🔴 Bọc mọi chuyển động trong `@media (prefers-reduced-motion: reduce)` — người tắt hiệu
    ứng thường có lý do sức khoẻ.
    🔴 Chữ dùng `MAU.camDamChoChu`, **không dùng cam thương hiệu** — cam trên nền trắng chỉ
    đạt 2,28:1, dưới cả ngưỡng chữ to.
  - **(b)** Đi hết luồng: **không màn nào còn là chữ đen trần**. Bật *Giảm chuyển động*
    trong cài đặt máy → mọi thứ vẫn dùng được bình thường, chỉ hết động.
  - **(c)** Mở rộng `tests/do-chu.test.ts` (đo tương phản bằng cách vẽ màu lên canvas 1×1
    rồi đọc pixel — Tailwind v4 sinh màu `oklch()` nên phân tích chuỗi `rgb()` là báo nhầm
    hàng loạt). Thêm cửa: mọi khối chuyển động đều có nhánh `prefers-reduced-motion`.
  - **(d)** 1 ngày.

- [x] **16.9 — Tối ưu điện thoại**
  - **(a)** Thanh bên nay chỉ còn một mục nhưng trên điện thoại vẫn chiếm một dải ngang đầu
    màn — thu thành một dòng gọn. Rà mọi bảng/lưới ở dải hẹp 320px; **ô chọn 14 bậc học** và
    **cụm nút trên thẻ** là hai chỗ dễ tràn nhất. Nút chạm ≥44px (bộ trẻ nhỏ ≥56px theo
    `canNutTo()` ở `config/`). Ảnh/SVG đặt `max-width:100%`.
  - **(b)** Thu cửa sổ còn **320px** rồi đi hết luồng: **không cuộn ngang một lần nào**.
    Trên điện thoại thật, mọi nút bấm trúng bằng ngón cái, không phải phóng to.
  - **(c)** `tests/be-ngang.test.tsx` — dựng ở 320px, khẳng định không phần tử nào rộng hơn
    khung. `tests/khung.test.ts` (cỡ chữ/nút theo lứa) phải vẫn xanh.
  - **(d)** 1 ngày.

---

## TỔNG ƯỚC LƯỢNG GĐ16

| Giai đoạn | Máy | Người / Ngoài |
| --- | --- | --- |
| 16A — lỗi thật + gộp hai bước | 1,5 ngày | — |
| 16B — PDF · khôi phục · tách tầng | 2,5 ngày | chọn font (SIL OFL) |
| 16C — giao diện + di động | 3 ngày | — |
| **Tổng** | **~7 ngày máy** | |

🔴 **Vẫn chặn ngày phát, không đổi:** `V0.1` tài khoản host + tên miền · `V0.2` hai điện
thoại thật để quét QR · duyệt câu chữ `docs/huong-dan-giao-vien-va-sale.md`.

---

## 🆕 GIAI ĐOẠN 17 — Xem lại bản cũ · Tệp sao lưu đọc được · Bố cục máy tính

> **Chốt 28/08/2026** sau khi chủ dự án bấm thử bản thật vừa dựng xong GĐ16.
> **Toàn bộ GĐ17 là việc MÁY** — không hạng mục nào chờ người hay dịch vụ ngoài, nên không
> hạng mục nào có dòng `(e) chặn:`.

**Ba việc chủ dự án nêu:**

1. Một người làm 2 bài, nhưng màn *Xem kết quả* **chỉ mở được bài mới nhất**.
2. Giải nén tệp sao lưu ra thấy **JSON không đọc được**. Muốn thấy **thư mục theo tên từng
   người**, bên trong là PDF, cộng một thư mục **Tổng hợp** chia theo ngày giờ.
3. **Giao diện máy tính** khoá ở một cột hẹp bên trái; màn 1920px thừa hai phần ba.

### 🔴 MỘT PHẦN YÊU CẦU ĐÃ CÓ SẴN — ĐỪNG XÂY LẠI

Chủ dự án yêu cầu *"tối đa 2 bản; làm bản thứ 3 thì cảnh báo xoá bản cũ hơn"*. Việc đó
**đã chạy đúng từ GĐ12**:

| Thứ | Ở đâu |
| --- | --- |
| Trần **2 bài/người** | `GIOI_HAN_BAI_MOI_NGUOI = 2` — [disc-gia-dinh.ts:109](config/disc-gia-dinh.ts#L109) |
| Chọn ra bài sắp mất (hàm thuần) | `chonBaiPhaiXoa()` — [han-muc.ts](modules/core/gia-dinh/han-muc.ts) |
| Cửa chặn ở lối vào bài mới | `batDauBaiMoi()` — [nha-minh.tsx:100](app/khoang/nha-minh.tsx#L100) |
| Hộp thoại cảnh báo | [hop-thoai-han-muc.tsx](app/components/hop-thoai-han-muc.tsx) |

Hộp thoại đó nêu **đích danh** bài sắp mất, có nút *Tải về giữ lại*, và bắt tick một ô xác
nhận mới cho đi tiếp. Trần **5 thư mục phân tích** cũng đã có, cùng khuôn.
⇒ Ở ý (1) chỉ còn thiếu **cái nút chuyển giữa hai bản**.

### 🔴 BỐN QUYẾT ĐỊNH ĐÃ CHỐT — không hỏi lại

| Điểm | Chốt | Vì sao |
| --- | --- | --- |
| JSON trong `.zip` | **GIỮ**, nhét vào `_may-doc/` kèm `ĐỌC TRƯỚC.txt` | Bỏ hẳn là giết nút *Khôi phục* vừa xây ở `16.5`, và biến bản sao lưu thành bản xuất — mất máy là mất sổ |
| Bề rộng máy tính | Nới theo **LOẠI nội dung**, KHÔNG full-width tất cả | Đoạn văn dài 200 ký tự làm mắt lạc dòng. Sản phẩm này nội dung chính LÀ chữ để phụ huynh đọc |
| Ruột PDF cá nhân | **Bản đầy đủ**, dựng từ `layDienGiaiDay()` | Dùng lại nội dung đã có ⇒ **không viết chữ mới** ⇒ không làm hồ sơ đang chờ ký duyệt lỗi thời thêm lần nữa |
| Tên thật trong `.zip` | **Chấp nhận**, lật hàng rào *"tên không vào tệp xuất"* của ADR-005 | Đã có tiền lệ ở `16.6`. Thư mục tên "Zozo" mà bên trong là PDF ghi rõ tên Zozo thì tên thư mục không lộ thêm gì |

### 🔴 HAI HẠNG MỤC RỦI RO CAO — XẾP SỚM NHẤT CÓ CHỦ ĐÍCH

| Rủi ro | Vì sao không để cuối |
| --- | --- |
| **Chi phí sinh nhiều tệp PDF** (`17.1`) | Trường hợp xấu nhất là **42 tệp** trong một lần bấm (6 người × 2 bản + 5 lần phân tích × 6 người), mỗi tệp nhúng trọn font 133 KB. Có thể ra `.zip` vài MB và treo máy cả chục giây trên điện thoại phổ thông. **Con số này quyết định hình dạng của cả GĐ 17B** — đo muộn thì phải đập đi làm lại. Nên nó là hạng mục ĐẦU TIÊN, trước cả việc dễ. |
| **Khôi phục phải đọc được BA đời tệp** (`17.5`) | Người dùng đang giữ tệp `.zip` tải hôm qua (đời v2) và có thể cả đời v1. Nút cứu dữ liệu mà **từ chối chính bản sao lưu của người dùng** là kiểu hỏng tệ nhất tính năng này mắc được — và nó chỉ lộ ra vào đúng ngày người ta cần nó. |

---

## GIAI ĐOẠN 17A — Đo rủi ro, và gỡ khó chịu lớn nhất

**Ước lượng: 0,75 ngày**

### DEMO CUỐI GĐ 17A
> Một người có **2 bài** → bấm *Xem kết quả* → thấy **dải chọn hai bản, mỗi bản một nhãn có
> NGÀY và GIỜ**; bấm bản cũ thì biểu đồ và chữ đổi theo đúng bài cũ; bấm lại bản mới thì
> quay về. **Không con số so sánh nào tự hiện ra.**
> Và có **một con số thật** trên màn hình terminal: sinh 42 tệp PDF mất bao nhiêu giây,
> ra bao nhiêu MB — đủ để quyết định GĐ 17B làm theo hình dạng nào.

---

- [x] 🔴 **17.1 — ĐO TRƯỚC: chi phí sinh nhiều tệp PDF**
  - **(a)** Chưa sửa sản phẩm. Viết `tests/chi-phi-pdf.test.ts` dựng dữ liệu BỊA ở trường
    hợp xấu nhất (6 người × 2 bài + 5 lần phân tích × 6 bản = 42 tệp), gọi bộ sinh PDF
    hiện có ([xuat-pdf.ts](modules/report/xuat-pdf.ts)) rồi **in ra: tổng giây, tổng byte
    trước nén, tổng byte sau nén `.zip`, byte trung bình mỗi tệp**.
    🔴 Đo cả trường hợp THẬT hay gặp (3 người × 1 bài + 1 lần phân tích = 6 tệp) — con số
    xấu nhất dùng để quyết kiến trúc, con số hay gặp dùng để quyết có cần thanh tiến trình.
    Nếu tổng > 10 giây hoặc `.zip` > 8 MB ⇒ **DỪNG, báo chủ dự án**, kèm ba lối thoát đã
    tính sẵn: gộp 2 bản của một người vào MỘT tệp nhiều trang · chỉ xuất lần phân tích mới
    nhất thay vì cả 5 · cắt font xuống bộ ký tự thật sự dùng.
  - **(b)** Chạy `npx vitest run tests/chi-phi-pdf.test.ts` và **đọc bảng số in ra**. Không
    cần bấm gì trên giao diện — đây là hạng mục lấy SỐ, không lấy tính năng.
  - **(c)** `tests/chi-phi-pdf.test.ts` — khẳng định 42 tệp đều bắt đầu bằng `%PDF-`, và
    ghim hai trần: tổng thời gian và tổng dung lượng. Trần vượt thì test ĐỎ, cố ý.
  - **(d)** 2 giờ.

  > ### ✅ KẾT QUẢ ĐO (28/08/2026) — KHÔNG PHẢI ĐỔI THIẾT KẾ
  >
  > | Trường hợp | Tệp | Giây | Thô | `.zip` | TB/tệp |
  > | --- | --- | --- | --- | --- | --- |
  > | Hay gặp (3 người) | 6 | **0,14 s** | 0,38 MB | 0,38 MB | 64 KB |
  > | 🔴 Xấu nhất (6 người) | 42 | **0,48 s** | 2,64 MB | **2,65 MB** | 64 KB |
  >
  > Trần ghim 10 giây / 8 MB. Thực đo **0,5 giây / 2,65 MB** — dưới trần rất xa.
  >
  > 🔴 **Phát hiện đắt nhất: jsPDF TỰ CẮT FONT.** Một tệp PDF chỉ **48 KB — nhỏ hơn chính
  > tệp font gốc 130 KB**, nghĩa là nó chỉ nhúng những glyph thật sự dùng. Nỗi lo "mỗi tệp
  > cõng trọn 133 KB font" là **lo hão**, và lối thoát *"cắt font xuống bộ ký tự thật dùng"*
  > trong danh sách trên là **thừa — thư viện đã làm sẵn**. Đã khoá phát hiện này bằng một
  > cửa kiểm: ngày nào một tệp PDF phình to hơn font gốc thì cơ chế cắt đã hỏng.
  >
  > **Hệ quả cho `17.4`:** bỏ phần *dòng tiến trình đếm từng tệp* và *nhường luồng giữa mỗi
  > tệp* — nửa giây thì không ai kịp thấy. Giữ nguyên trạng thái `dangSaoLuu` sẵn có
  > (*"Đang nén…"*). Ít mã hơn, và không phải vì lười mà vì **đã đo**.

- [x] **17.2 — Dải chọn bản ở màn Kết quả**
  - **(a)** Component mới `app/components/chon-ban-ket-qua.tsx`: mỗi bản một nút, nhãn dùng
    `hienNgayGio()` ([ngay.ts:33](modules/core/tien-ich/ngay.ts#L33)), bản đang xem được
    đánh dấu, bản mới nhất mở sẵn. **Chỉ hiện khi có từ 2 bài trở lên** — một bài mà bày ra
    một dải chọn một phần tử là bày ra một nút không làm gì.
    [nha-minh.tsx](app/khoang/nha-minh.tsx): `dangXem` đổi từ *một bài* sang
    `{ cacBan: BaiLamLuu[]; dangChon: number }`; nút *Xem kết quả* trên thẻ trao **mọi bài
    của người đó** thay vì mỗi `bai[0]`.
    [bang-gia-dinh.tsx](app/khoang/bang-gia-dinh.tsx): `onXemBai` đổi chữ ký để trao cả
    danh sách — chỗ đó đã sẵn có `bai` của từng người, không phải đọc kho thêm lần nào.
    🔴 **RANH GIỚI PHẢI GIỮ:** dải này chỉ cho XEM LẦN LƯỢT. Tuyệt đối không tự tính
    *"bạn đã đổi bao nhiêu điểm"*. Việc so sánh có **sàn 90 ngày**
    ([so-sanh-thoi-gian.ts:87](modules/report/so-sanh-thoi-gian.ts#L87)) vì hai bài cách
    nhau ba tuần thì thứ hiện lên là **nhiễu đo** — mà nó vẫn đọc rất thuyết phục vì có số
    kèm theo. Nút *Xem thay đổi* hiện có giữ nguyên luật cũ, không đụng vào.
  - **(b)** Cho một người làm **2 bài** (cách nhau vài phút cũng được) → bấm *Xem kết quả*
    trên thẻ của họ → thấy **hai nhãn khác nhau, có giờ**; bản mới nhất đang được chọn.
    Bấm nhãn cũ → **bốn cột điểm đổi** sang bài cũ và chữ diễn giải đổi theo. Bấm lại nhãn
    mới → quay về. Người chỉ có **1 bài** → **không thấy dải nào**.
  - **(c)** `tests/chon-ban-ket-qua.test.tsx`: 1 bài ⇒ không dựng dải · 2 bài ⇒ hai nhãn
    KHÁC NHAU và đều chứa giờ · mặc định chọn bài mới nhất · bấm bản cũ ⇒ điểm nhận được
    đúng của bài cũ · 🔴 **dải này không làm xuất hiện chữ nào của khối so sánh**.
  - **(d)** 3 giờ.

---

## GIAI ĐOẠN 17B — Tệp sao lưu mở ra là đọc được

**Ước lượng: 1,5 ngày**

### DEMO CUỐI GĐ 17B
> Bấm *Sao lưu* → nhận một `.zip` → giải nén thấy:
> **một thư mục cho mỗi người trong nhà**, tên là tên của họ, bên trong 1–2 tệp PDF;
> một thư mục **Tổng hợp** chứa các thư mục con đặt tên theo **ngày giờ** từng lần phân
> tích (tối đa 5); và một thư mục `_may-doc` chứa JSON kèm tệp `ĐỌC TRƯỚC.txt`.
> Rồi *Xoá sạch* → *Khôi phục* chọn đúng tệp đó → **cả sổ quay về**. Thử lại bằng tệp
> `.zip` **tải hôm qua** → **cũng nạp được**.

Hình dạng đích:

```
disc-sao-luu.zip
├── Zozo/
│   ├── 2026-08-28 19h30 — THCS.pdf
│   └── 2026-08-12 08h15 — THCS.pdf        ← tối đa 2, đúng bằng trần đã có
├── Mẹ Lan/
│   └── 2026-08-28 19h42 — PH.pdf
├── Tổng hợp/
│   ├── 2026-08-28 20h05/                  ← MỘT thư mục cho MỘT lần chạy phân tích
│   │   ├── Zozo.pdf
│   │   └── Mẹ Lan.pdf                     ← mỗi người một tờ (luật GĐ10/GĐ14)
│   └── 2026-08-25 08h15/…                 ← tối đa 5, đúng bằng trần đã có
└── _may-doc/
    ├── ĐỌC TRƯỚC.txt
    ├── ban-ke.json · thanh-vien.json · phan-tich.json · bai/…
```

---

- [x] 🔴 **17.3 — PDF cho MỘT bài của MỘT người**
  - **(a)** `modules/report/noi-dung-ket-qua.ts` (mới, **tầng lõi**, hàm thuần): đổi một
    bài thành danh sách dòng, **dùng lại kiểu `DongBan`** của
    [noi-dung-ban.ts](modules/report/noi-dung-ban.ts) đã viết ở `16.6`. Ruột lấy từ
    `layDienGiaiDay()` ([dien-giai.ts:209](modules/report/dien-giai.ts#L209)) — điểm bốn
    nhóm · phổ bốn nhóm (biểu hiện · điểm mạnh · chỗ cần để ý) · lời khuyên cho đúng người
    đọc. 🔴 **KHÔNG viết một chữ nội dung mới nào** — mọi câu đều đã có trong `config/`.
    [xuat-pdf.ts](modules/report/xuat-pdf.ts): tách phần vẽ thành `veTepPdf(dong, tieuDe)`
    dùng chung, rồi thêm `xuatPdfMotBai()`. Font vẫn tải **một lần** cho cả lượt.
    🔴 Người có hồ sơ **nhận qua mã mời** (`nhanQuaMa`, không có bài trên máy) vẫn ra được
    PDF — họ có đủ bốn điểm — nhưng đầu tệp phải ghi rõ *"hồ sơ nhận qua mã mời"*, không
    được để người đọc tưởng bài làm trên máy này.
  - **(b)** Chưa nhìn thấy gì trên màn. Chạy `npx vitest run tests/xuat-pdf.test.ts`, rồi
    mở tệp PDF mà test ghi ra `du-lieu-thu/` (thư mục này đã có trong `.gitignore`) bằng
    trình đọc PDF của máy: thấy **tên người,
    ngày giờ, bốn điểm, và phần chữ** — tiếng Việt đủ dấu.
  - **(c)** `tests/noi-dung-ket-qua.test.ts`: mỗi bộ đề ra đủ **bốn** trục (luật §9.2) ·
    bộ PH ra bản tự đọc, bộ MN/QS ra bản cho người lớn · bài của người nhận qua mã mời có
    dòng ghi rõ nguồn. Mở rộng `tests/xuat-pdf.test.ts`: tệp bắt đầu `%PDF-`, tên tệp có
    đủ ngày + giờ + mã bộ đề.
  - **(d)** 5 giờ.

- [x] 🔴 **17.4 — Cây thư mục mới trong `.zip`**
  - **(a)** `modules/core/luu-tru/sao-luu.ts`: `taoNoiDungZip()` nhận **cây thư mục** thay
    vì mảng phẳng; JSON chuyển xuống `_may-doc/` kèm `ĐỌC TRƯỚC.txt` nói rõ *"đừng mở tay,
    đây là phần nút Khôi phục đọc"*. `saoLuuTatCa()` **giữ nguyên chữ ký một tham số** —
    nó là hàng rào, có test khẳng định `toHaveLength(1)`.
    Hàm mới `tenThuMucNguoi(ten, daDung)` ở tầng lõi: lọc ký tự cấm hệ tệp
    (`/ \\ : * ? " < > |`) nhưng **GIỮ dấu tiếng Việt**; tên trùng thì thêm hậu tố
    `Zozo (2)` — form chặn trùng tên, nhưng hồ sơ nhận qua mã mời do máy nhận tự đặt tên.
    [nha-minh.tsx](app/khoang/nha-minh.tsx): dựng cây. 🔴 **KHÔNG thêm dòng tiến trình
    đếm từng tệp** — `17.1` đo được 42 tệp mất **0,5 giây**, nên trạng thái `dangSaoLuu`
    sẵn có (*"Đang nén…"*) là đủ. Thêm bộ đếm là thêm mã cho một vấn đề không tồn tại.
    🔴 Đây là **chỗ chặn thứ TƯ** của cờ `MO_NOI_DUNG_TRE`: cờ tắt ⇒ không xuất thư mục
    của trẻ, kể cả trẻ có bài từ trước khi tắt cờ.
    🔴 Sinh PDF hỏng (font lỗi, thư viện nạp lỗi) **không được kéo đổ nút Sao lưu** — vẫn
    phải ra `.zip` đủ JSON. Mất bản đẹp còn hơn mất sổ.
  - **(b)** Máy có 3 người, một người 2 bài, đã chạy phân tích 2 lần → bấm *Sao lưu* →
    thấy **dòng tiến trình chạy** → tệp tải về. Giải nén: **đếm được 3 thư mục tên người**,
    thư mục người kia có **2 tệp PDF**, thư mục *Tổng hợp* có **2 thư mục con tên theo ngày
    giờ**, và `_may-doc/` có `ĐỌC TRƯỚC.txt`. Đổi tên một người thành `Bé/Na` rồi sao lưu
    lại → thư mục **không** vỡ thành hai cấp.
  - **(c)** `tests/cay-sao-luu.test.ts`: cây đúng hình dạng · mỗi người ≤2 tệp · ≤5 thư mục
    con trong *Tổng hợp* · tên trùng ra hậu tố `(2)` · ký tự cấm bị lọc mà dấu tiếng Việt
    còn nguyên · **cờ `MO_NOI_DUNG_TRE` tắt ⇒ không có thư mục của trẻ** (thử CẢ HAI trạng
    thái cờ — một cờ chỉ thử lúc đang bật thì đúng bằng không có cờ) · bộ sinh PDF ném lỗi
    ⇒ `.zip` **vẫn** có đủ JSON.
  - **(d)** 5 giờ.

- [x] 🔴 **17.5 — Khôi phục đọc được CẢ BA đời tệp**
  - **(a)** `modules/core/luu-tru/khoi-phuc.ts`: `docTuZip()` phải nhận diện và nạp được
    **v1** (chỉ `bai/`, `ban-ke.json` ở gốc) · **v2** (`du-lieu/` + `ban-ke.json` ở gốc —
    đời sinh ra hôm 28/08) · **v3** (`_may-doc/`). Tìm bản kê ở CẢ HAI chỗ trước khi kết
    luận *"không phải sổ DISC"*.
    🔴 Tệp PDF trong `.zip` **bị bỏ qua khi khôi phục** — chúng là bản đọc, không phải
    nguồn dữ liệu. Nhưng sự có mặt của chúng **không được** làm bộ đọc từ chối tệp.
  - **(b)** Giữ lại tệp `.zip` đã tải **hôm 28/08** (đời v2). *Xoá sạch* → *Khôi phục* chọn
    tệp cũ đó → **cả sổ quay về đủ**. Rồi sao lưu lại (ra đời v3) → *Xoá sạch* → *Khôi phục*
    bằng tệp mới → **cũng quay về đủ**. Thử một `.zip` bất kỳ không phải sổ DISC → báo lỗi
    rõ và **không mất gì**.
  - **(c)** Mở rộng `tests/khoi-phuc.test.ts`: khứ hồi **v3** · nạp được tệp **v2** dựng
    tay · nạp được tệp **v1** dựng tay · tệp v3 có lẫn PDF vẫn nạp đúng · tệp rác vẫn bị
    từ chối và **không đụng vào kho**.
  - **(d)** 2 giờ.

---

## GIAI ĐOẠN 17C — Máy tính hết thừa hai phần ba màn

**Ước lượng: 1 ngày**

### DEMO CUỐI GĐ 17C
> Mở trên màn **1920px**: lưới thẻ gia đình xếp **3–4 cột** (sáu người vừa một màn, không
> phải cuộn); bản phân tích cả nhà xếp **hai cột**; **nhưng đoạn văn vẫn ngắt dòng ở bề
> rộng đọc được**, không chạy hết bề ngang.
> Rồi thu cửa sổ còn **320px** đi lại từ đầu → **không cuộn ngang một lần nào**.

---

- [x] **17.6 — Gom bề rộng về `config/`, nới khung trang và lưới thẻ**
  - **(a)** Gốc vấn đề đã đo: [cac-buoc.tsx:140](app/khoang/cac-buoc.tsx#L140) và
    [bang-gia-dinh.tsx:114](app/khoang/bang-gia-dinh.tsx#L114) khoá `max-w-3xl` (768px),
    lưới thẻ dừng ở `sm:grid-cols-2`. Màn 1920px vì thế dùng đúng một phần ba.
    File mới `config/bo-cuc.ts` giữ các lớp bề rộng — **một chỗ duy nhất để chỉnh**, cùng
    lối với `config/thuong-hieu.ts`, thay vì rải `max-w-*` khắp 12 file như hiện nay:
    khung trang `max-w-[1600px]` căn giữa · lưới thẻ `1 → 2 → 3 → 4` cột · khung đọc
    `max-w-2xl` (~70 ký tự/dòng).
    🔴 **KHÔNG nới đoạn văn và màn làm bài.** [disc.tsx](app/khoang/disc.tsx),
    [lam-bai.tsx](app/khoang/lam-bai.tsx), [truoc-khi-bat-dau.tsx](app/khoang/truoc-khi-bat-dau.tsx),
    [vung-lech.tsx](app/khoang/vung-lech.tsx) giữ nguyên khung hẹp. Nới ra là hại đúng thứ
    đang cần sửa.
  - **(b)** Mở trên màn máy tính rộng nhất anh có: **lưới thẻ xếp 3 hoặc 4 cột**, khoảng
    trắng bên phải co lại rõ rệt. Vào một bài test: **màn câu hỏi vẫn hẹp như cũ** — chữ
    không chạy hết bề ngang.
  - **(c)** `tests/bo-cuc.test.tsx`: không màn nào còn `max-w-3xl` gõ thẳng · lưới thẻ có
    mốc ≥3 cột · **bốn màn đọc-và-trả-lời vẫn giữ khung hẹp** (cửa này chặn việc nới quá
    tay, không phải chặn việc nới) · `tests/be-ngang.test.tsx` (320px) phải vẫn xanh.
  - **(d)** 4 giờ.

- [x] **17.7 — Bản phân tích và màn kết quả xếp hai cột ở màn rộng**
  - **(a)** [ban-tong-hop.tsx](app/khoang/ban-tong-hop.tsx): N bản xếp **hai cột từ mốc
    `lg`**, mỗi cột giữ bề rộng đọc được. Đây là màn chữ nhiều nhất — cũng là chỗ đỡ cuộn
    nhiều nhất. 🔴 **Luật in tách bản không được vỡ:** bấm *In phần của Bin* thì mọi dải
    khác vẫn phải bị ẩn — bố cục hai cột dùng CSS grid, và `display: none` khi in vẫn phải
    thắng. [ket-qua.tsx](app/khoang/ket-qua.tsx): biểu đồ + bốn điểm bên trái, chữ diễn
    giải bên phải, từ mốc `lg`.
  - **(b)** Có 3 người đã làm xong → chạy *Phân tích cả nhà* trên màn rộng → **ba bản xếp
    hai cột**, đỡ cuộn hẳn. Bấm *In phần của Zozo* → xem trước bản in → **chỉ có phần của
    Zozo**, không lẫn một chữ nào của người khác. Thu cửa sổ hẹp lại → **tự về một cột**.
  - **(c)** Mở rộng `tests/bo-cuc.test.tsx`: bản tổng hợp có mốc `lg:grid-cols-2` · màn kết
    quả có mốc hai cột. `tests/ban-tong-hop.test.tsx` (in tách bản) và
    `tests/ban-in.test.ts` phải **vẫn xanh** — đó là cửa canh luật *mỗi người một tờ*.
  - **(d)** 4 giờ.

---

## TỔNG ƯỚC LƯỢNG GĐ17

| Giai đoạn | Máy | Người / Ngoài |
| --- | --- | --- |
| 17A — đo rủi ro + chuyển bản | 0,75 ngày | — |
| 17B — tệp sao lưu đọc được | 1,5 ngày | — |
| 17C — bố cục máy tính | 1 ngày | — |
| **Tổng** | **~3,25 ngày máy** | **không có** |

🔴 **Vẫn chặn ngày phát, không đổi:** `V0.1` tài khoản host + tên miền · `V0.2` hai điện
thoại thật để quét QR · duyệt câu chữ `docs/huong-dan-giao-vien-va-sale.md`.

---

## ❌ KHÔNG LÀM Ở PHIÊN BẢN NÀY

| Không làm | Vì sao |
| --- | --- |
| **So sánh tự động giữa hai bản** ở dải chọn mới (`17.2`) | Sàn **90 ngày** vẫn giữ. Hai bài cách ba tuần thì thứ hiện lên là nhiễu đo, mà nó đọc rất thuyết phục vì có số kèm theo. Dải mới chỉ cho XEM lần lượt |
| **Tăng trần 2 bài/người hay 5 thư mục phân tích** | Chủ dự án xác nhận giữ nguyên. Trần và hộp thoại cảnh báo đã chạy đúng từ GĐ12 |
| **Full-width cho đoạn văn và màn làm bài** (`17.6`) | Dòng 200 ký tự làm mắt lạc dòng. Sản phẩm này nội dung chính LÀ chữ để phụ huynh đọc — nới ra là hại đúng thứ đang cần sửa |
| **Bỏ JSON khỏi tệp sao lưu** | Là giết nút *Khôi phục* vừa xây ở `16.5`. JSON xuống `_may-doc/` kèm tệp giải thích, giữ được cả hai |
| **Cắt font xuống bộ ký tự thật dùng** | Chỉ mở ra nếu `17.1` đo thấy cần. Chưa có số thì chưa tối ưu — tối ưu trước khi đo là đoán |
| **Sửa câu chữ nội dung** | Vẫn không đụng `config/disc-noi-dung-cap.ts` và họ hàng — phần đang chờ ký duyệt. PDF cá nhân dùng lại nguyên văn `layDienGiaiDay()` |
| **Backend + đăng nhập + đồng bộ** | Chủ dự án chốt giữ ADR-001; `16.4` tách tầng sẵn để app chủ cắm vào sau. Làm ngay thì cần đội dev app chủ (**chưa ai hỏi họ có nhận không**), cần máy chủ, và **công ty thành bên xử lý dữ liệu cá nhân TRẺ EM** (NĐ 13/2023) — thứ ADR-001 đã cố ý mua đường tránh. Thêm 2–4 tuần. |
| **Hoạt hình Lottie / video** | Thêm thư viện + 50–200 KB mỗi cảnh, đụng thẳng mục tiêu *chạy mượt trên điện thoại phổ thông*. SVG tự vẽ đủ sinh động mà 0 KB. |
| **PDF cho bản in ba dải của GĐ10** | Gói này chỉ xuất PDF cho **bản phân tích cả nhà**. Bản in cũ vẫn dùng `window.print()` — nó đang chạy đúng, không có lý do đụng vào. |
| **Sửa câu chữ nội dung** | Không đụng `config/disc-noi-dung-cap.ts` và họ hàng — đó là phần đang chờ ký duyệt. Đổi lúc này là làm hồ sơ ký duyệt lỗi thời thêm một lần nữa. |
| **Xoá thật thư mục `cu/`** | Chờ tới khi đã phát cho gia đình thật và chắc chắn không quay lại. Xoá sớm tiết kiệm vài KB mà mất một bản dựng đã chạy đúng. |
| **So sánh "hồi đó ↔ bây giờ"** | Vẫn giữ, nhưng không đầu tư thêm: sớm nhất **cuối tháng 11/2026** mới có gia đình đầu tiên đủ hai bài cách 90 ngày để mở được màn này. |

---

## 🏁 ĐIỀU KIỆN DỪNG — giữ nguyên, không sửa sau khi thấy kết quả

Sau khi phát cho 30 gia đình, đọc hai con số ở `?so-lieu=1`:

- **Bấm mời > 0 nhưng người thứ hai làm xong ≈ 0** ⇒ lỗi ở **sản phẩm**. Lời mời tới nơi mà
  người kia không làm được — sửa tiếp, và biết rõ sửa chỗ nào.
- **Bấm mời ≈ 0** ⇒ lỗi ở **giả định**, không phải phần mềm. Giả định đỡ 9,5 ngày của GĐ14
  (*một phụ huynh triệu tập được ≥2 người*) hiện có **0 quan sát ủng hộ và 1 quan sát phản
  bác**. Bằng 0 sau 30 máy thật thì **dừng, đừng tiêu thêm ngày nào**.

---
