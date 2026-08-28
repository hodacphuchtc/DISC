# PLAN_V2.md — Luồng 3 bước (MVP phát cho 30 gia đình)

> **Sổ này thay `PLAN.md` làm lộ trình đang có hiệu lực (28/08/2026).** `PLAN.md` giữ lại
> để tra *vì sao* 68 hạng mục cũ được làm như vậy — **không còn là việc đang làm**.
>
> **Nguyên tắc đọc:** mỗi Giai đoạn kết thúc bằng một thứ chủ dự án **tự bấm thấy được**,
> không nghiệm thu bằng câu "đã viết xong module". Mỗi hạng mục có 4 dòng: **(a)** làm gì ·
> **(b)** kiểm chứng bằng thao tác nào · **(c)** test tự động nào chạy · **(d)** ước lượng.
> Hạng mục nào bị người/dịch vụ ngoài chặn thì có thêm dòng **(e) chặn:**.
> **Luật tick:** chỉ tick ✅ khi (b) đã bấm thật **và** (c) đã xanh.
> 🔴 = rủi ro cao, **cố ý xếp sớm nhất**.

**Mục tiêu:** một gia đình đi được từ *"nghe giáo viên nói"* tới *"cả nhà đọc bản phân tích
về nhau"*, và trong lúc đó **rủ được người thứ hai cùng làm**.

**Mốc phát:** 30 gia đình đang học, trong 1–2 tuần (chốt 28/08/2026).

**Đích đo được duy nhất:** phễu mời — *bao nhiêu người bấm mời* / *bao nhiêu người thứ hai
làm xong*. Hai con số này chẩn đoán ngược nhau, xem GĐ V4.

---

## RÀNG BUỘC TOÀN DỰ ÁN (mọi hạng mục đều phải tuân)

- **Không backend, không CSDL, không API** (ADR-001). Dữ liệu ở IndexedDB + localStorage
  của chính máy người dùng. Thư viện ngoài duy nhất: `jszip`.
- **Tầng lõi** (`modules/**`, `config/**`) = hàm thuần, không React không DOM.
  `tests/ranh-gioi-hai-tang.test.ts` canh ranh giới này (ADR-004).
- **Hằng số nghiệp vụ đọc từ `config/`**, không gõ cứng trong component.
- **Chữ hiển thị gom vào `config/disc-tu-dien.ts`**, không gõ thẳng vào JSX.
- **Tiếng Việt 100%** cho mọi chữ người dùng thấy. Tên biến/hàm: tiếng Việt không dấu.
- **Cấm chữ "phi lợi nhuận"** ở mọi chữ mới (`tests/thong-diep.test.tsx` quét cả `config/`).
- **Test dùng tên bịa.** Không bao giờ đưa tên thật của trẻ vào test, seed, log, tài liệu.
- Sau mỗi hạng mục: `npm run kiem` phải xanh mới được đi tiếp. Máy tải nặng thì
  `npx vitest run --maxWorkers=2` — Docker từng làm 19–20 test đỏ giả.

---

## 🔴 BA RỦI RO CAO — XẾP SỚM NHẤT CÓ CHỦ ĐÍCH

| Rủi ro | Vì sao không để cuối |
| --- | --- |
| **Chưa có nơi phát** (`V0.1`) | Chốt phát trong 1–2 tuần mà chưa có host, chưa có tên miền, chưa ai bấm deploy lần nào. DNS có thể mất một buổi. Biết muộn = trượt mốc, không cứu được bằng code. |
| **Quét QR bằng camera thật** (`V0.2`) | Đây là thứ **duy nhất** gỡ trần *"cả nhà xếp hàng trên một điện thoại"*. Hỏng thì cả thiết kế bước 3 đổi. Máy không mô phỏng được ống kính và ánh sáng. |
| **Xoá màn M1 làm test đỏ hàng loạt** (`V2.2`) | Lần trước chỉ *sắp lại* M1 đã gây **34 cửa đỏ ở 4 file**. Lần này M1 biến mất hẳn. Tách thành hạng mục riêng, làm sau khi luồng mới đã chạy được — không gộp. |

---

## GIAI ĐOẠN V0 — Giết ba rủi ro trước khi viết một dòng giao diện

**Ước lượng: 0,5 ngày máy + 1 buổi người**

### DEMO CUỐI GĐ V0
> Chủ dự án mở **link thật trên điện thoại của mình** (không phải `localhost`), thấy khoang
> DISC chạy; rồi lấy **điện thoại thứ hai quét mã QR** trên màn hình máy thứ nhất và thấy
> đúng tên hiện ra.

---

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
  - **(b)** Máy B hiện đúng hồ sơ, hỏi tên, lưu vào sổ. **Nếu một trong ba điều kiện
    hỏng ⇒ ghi lại đúng điều kiện nào, rồi ẩn nút QR ở `V5.1` và nói thẳng với sale là
    "cả nhà dùng chung một máy".** Không phát một tính năng chưa ai xác minh.
  - **(c)** `tests/qr.test.ts` + `tests/ma-moi-hoan-chinh.test.tsx` đã canh phần toán
    (dựng lại lưới từ nét vẽ Canvas + phép thử hội chứng Reed–Solomon). Không thêm test —
    **cửa còn thiếu chính là camera thật, và nó không tự động hoá được.**
  - **(d)** 30 phút.
  - **(e) chặn:** NGƯỜI — cần hai điện thoại thật và một người cầm máy thứ hai.

- [x] **V0.3 — Sửa bộ nạp dữ liệu mẫu cho sale demo được** ✅ (28/08/2026)
  - **(a)** `nap-vao-trinh-duyet.js` mở `indexedDB.open("disc", 1)` trong khi kho thật đã
    là v2 ba bảng ⇒ `VersionError`, lời hứa văng, IIFE **không có `.catch()`** nên chỉ hiện
    một lỗi đỏ lạ. 🔴 File đó **do máy sinh** — sửa **bộ sinh**
    `tests/DATA_TEST/tao-du-lieu-mau.mjs`, sửa tay là mất công lần sau sinh lại.
    Đã làm: xuất `PHIEN_BAN_KHO` từ `kho-bai.ts` và **import tên bảng + số phiên bản từ
    đó**, không gõ lại (chính việc gõ lại đã gây ra lỗi này); dựng đủ ba bảng và index
    `maThanhVien`; thêm `.catch()` + `onblocked`; đặt cờ `disc:da-nhan-nuoi-v2` để
    `nhanNuoiNeuCan()` khỏi đẻ thêm người trùng tên; sửa dòng nhắc cuối (cổng 3100, màn
    *"Bài đã làm"* đã không còn).
    **Danh sách thành viên SUY RA từ chính 8 hồ sơ mẫu, không khai tay** — khai một danh
    sách riêng bên cạnh danh sách bài là dựng nguồn sự thật thứ hai. Ra **7 người**, giữ
    nguyên tên bịa cũ: `Bé Bún` (mầm non) · `Su Kem` (lớp 4) · `Tí Nị` (lớp 7, **2 bài** —
    cặp vùng lệch) · `Mẹ Bống` (mẹ, **không lớp**) · `Kem Bơ` (lớp 8) · `Cà Rốt` (mầm non,
    ca không hợp lệ) · `Nem Rán` (lớp 5).
  - **(b)** Mở bản đang chạy → DevTools → Console → dán trọn file → thấy dòng
    `✅ Đã nạp 7 người và 8 bài mẫu` → tải lại trang → bước 1 có **7 người, mỗi người có bài**.
  - **(c)** `tests/nap-du-lieu-mau.test.ts` — **chạy chính bộ nạp đã sinh** dưới
    `fake-indexeddb` rồi đọc lại bằng đúng hàm kho của sản phẩm: 7 người · 8 bài · **không
    bài nào mồ côi** · hai bài của Tí Nị về cùng một người · người lớn không bị gán lớp ·
    dán hai lần không đẻ người trùng · không tên nào trông như họ tên thật. **8/8 xanh.**
  - **(d)** 1,5 giờ (thực tế ~1 giờ).

---

## GIAI ĐOẠN V1 — Bố mẹ vào được bài của chính mình

**Ước lượng: 1 ngày**

> Đây là **lỗi chặn thật**, không phải chuyện thẩm mỹ: `boDeCuaThanhVien()` ở
> [app/khoang/disc.tsx:70](app/khoang/disc.tsx#L70) chỉ đọc `tv.lop` rồi `Number()`.
> Bố mẹ không có lớp ⇒ trả `null` ⇒ đá về màn *"Ai đang cầm máy?"*. **Bấm "Làm bài" trên
> thẻ của Mẹ thì không vào được bài của Mẹ.** Trẻ mầm non cũng vậy — form còn chẳng cho
> chọn lớp mầm non. Đúng nhóm người mà cả GĐ11–GĐ14 xây cho là nhóm không đi vào được.

### DEMO CUỐI GĐ V1
> Thêm **Mẹ Lan** (vai Mẹ) → form **không hiện ô lớp**. Bấm *Làm bài* trên thẻ Mẹ Lan →
> **vào thẳng câu hỏi đầu tiên, không hỏi lại vai hay lớp**. Thêm **Bé Na** (vai Con, lớp
> *Mầm non*) → bấm *Làm bài* → vào bản người lớn trả lời hộ, có hộp giải thích.

---

- [x] **V1.1 — Lớp lên `config/`, thêm Mầm non và Trên lớp 12** ✅ (28/08/2026 — làm TRƯỚC V0.3 vì bộ sinh dữ liệu mẫu cần hằng `LOP_MAM_NON`)
  - **(a)** Hai sentinel đang nằm cục bộ trong `app/khoang/chon-doi-tuong.tsx` — đúng vết
    xe `TUOI_VAO_THCS` đã trả giá (hằng nghiệp vụ cục bộ là mầm của hai nguồn sự thật).
    Đưa lên `config/disc-nguong.ts`: `LOP_MAM_NON = "mam-non"`, `LOP_TREN_12 = "tren-12"`.
    Thêm hàm thuần `tuyChonLop()` trả **14 mục** theo đúng thứ tự: Mầm non · Lớp 1…Lớp 12 ·
    Trên lớp 12. Chữ hiển thị vào `config/disc-tu-dien.ts`.
  - **(b)** Chưa nhìn thấy gì trên màn — đây là hạng mục nền cho `V1.2`. Kiểm bằng (c).
  - **(c)** Thêm `tests/tuy-chon-lop.test.ts`: `tuyChonLop()` trả đúng 14 mục, mục đầu là
    Mầm non, mục cuối là Trên lớp 12, và **không mục nào có giá trị là số 13** (sentinel
    bằng số sẽ lặng lẽ chui vào dữ liệu như thể có người học lớp 13).
  - **(d)** 1 giờ.

- [x] **V1.2 — Form thành viên: ô lớp chỉ hiện với người đang đi học** ✅ (28/08/2026)
  - **(a)** Sửa `app/components/form-thanh-vien.tsx`: ô lớp **chỉ render khi vai là `con`
    hoặc `anh-chi-em`**. Bố · mẹ · ông · bà · người thân · khác → không có ô lớp. Đổi vai
    đang chọn thì **xoá lớp đã chọn** (đừng để lại lớp mồ côi trên một người lớn). Danh
    sách lớp lấy từ `tuyChonLop()`. Đổi nhãn `CHU_BANG_GIA_DINH.nhanLop` từ
    `"Lớp (nếu đang đi học)"` thành `"Lớp"` — ô này nay chỉ hiện đúng lúc cần.
  - **(b)** Bước 1 → *Thêm người* → chọn vai **Mẹ**: **không thấy ô lớp**. Đổi sang vai
    **Con**: ô lớp hiện ra với **đúng 14 mục**, mục đầu *Mầm non*, mục cuối *Trên lớp 12*.
    Chọn *Lớp 7* rồi đổi vai về **Bố**: ô lớp biến mất, lưu xong mở lại thấy **không còn
    lớp 7 dính trên người đó**.
  - **(c)** Thêm `tests/form-thanh-vien.test.tsx`: (1) vai `me` không render ô lớp;
    (2) vai `con` render 14 mục; (3) chọn lớp rồi đổi vai sang `bo` thì bản ghi lưu ra
    **không có trường `lop`**.
  - **(d)** 3 giờ.

- [x] **V1.3 — Bộ đề suy từ VAI + LỚP, không hỏi lại** ✅ (28/08/2026)
  - **(a)** Đưa `boDeCuaThanhVien()` từ `app/khoang/disc.tsx` **xuống tầng lõi**
    (`modules/test/dinh-tuyen.ts`) và cho nó đọc **cả `vaiTro` lẫn `lop`**. Vẫn gọi xuyên
    qua `dinhTuyen()` — ADR-002 (sàn tự đánh giá 8 tuổi) là thứ đắt nhất trong sản phẩm và
    chỉ được có **một** nơi giữ. Bảng ánh xạ:

    | Thành viên | `doiTuong` truyền vào `dinhTuyen` | Bộ đề | Ai trả lời |
    | --- | --- | --- | --- |
    | Vai không có lớp (bố/mẹ/ông/bà/người thân/khác) | `phu-huynh` + `mucTieu: "toi"` | `PH` | chính họ |
    | Lớp `mam-non` | `mam-non` | `MN` | người lớn trả lời hộ |
    | Lớp 1–2 | `tieu-hoc` | `MN` + hộp giải thích **bắt buộc hiện** | người lớn trả lời hộ |
    | Lớp 3–5 | `tieu-hoc` | `TH` | em tự làm |
    | Lớp 6–9 | `thcs` | `THCS` | em tự làm |
    | Lớp 10–12 · `tren-12` | `cap-ba-tro-len` | `PH` | em tự làm |

    Thêm hàm thuần `boDeQuanSatTheoLop(lop)` cùng file cho nút phụ ở `V1.4`.
    🔴 **Không suy tuổi từ lớp và không lưu tuổi bịa** — gác bằng LỚP. Lớp 4 có cả bé 9
    lẫn bé 10; đoán ra một con số rồi lưu như thể đã hỏi là tự bịa dữ liệu.
  - **(b)** Bấm *Làm bài* trên thẻ **Mẹ Lan** → vào thẳng câu hỏi đầu tiên, **không qua màn
    nào hỏi vai hay lớp**. Bấm trên thẻ **Bé Na** (Mầm non) → vào bản quan sát, có hộp giải
    thích. Bấm trên thẻ **Bin** (Lớp 7) → vào bộ THCS.
  - **(c)** Mở rộng `tests/dinh-tuyen.test.ts`: **một test cho mỗi dòng trong bảng trên**
    (6 dòng). Thêm test `boDeQuanSatTheoLop`: lớp `mam-non` và lớp 1–2 → `MN`;
    lớp 3 trở lên → `QS`. `tests/ranh-gioi-hai-tang.test.ts` phải vẫn xanh (hàm mới ở tầng
    lõi, không được import React).
  - **(d)** 4 giờ.

- [x] **V1.4 — Nút phụ "Bố mẹ trả lời về {tên}" trên thẻ con từ lớp 3** ✅ (28/08/2026)
  - **(a)** `app/khoang/bang-gia-dinh.tsx`: thẻ của người có lớp **từ 3 trở lên** có thêm
    nút phụ mở bộ `QS` qua `boDeQuanSatTheoLop()`, dẫn tới màn **Vùng lệch con ↔ cha mẹ**
    đã có. Thẻ bố mẹ **chỉ có đúng một nút** (bài tự đánh giá). Thẻ mầm non và lớp 1–2 chỉ
    có nút người lớn trả lời hộ — không cần nút phụ vì bài chính đã là bản quan sát.
  - **(b)** Thẻ **Bin** (Lớp 7) có nút chính *Bin tự làm bài* và nút phụ *Bố mẹ trả lời về
    Bin*. Thẻ **Mẹ Lan** chỉ có một nút. Thẻ **Bé Na** chỉ có nút người lớn trả lời hộ.
  - **(c)** Mở rộng `tests/bang-gia-dinh.test.tsx`: đếm số nút trên thẻ theo vai+lớp cho
    bốn trường hợp (mẹ · mầm non · lớp 2 · lớp 7).
  - **(d)** 2 giờ.

---

## GIAI ĐOẠN V2 — Ba bước hiện ra

**Ước lượng: 1,5 ngày**

### DEMO CUỐI GĐ V2
> Thanh bên **chỉ còn một mục**. Bấm vào → **ba bước xếp dọc từ trên xuống**, đánh số
> 1·2·3. Máy trống thì bước 2 và 3 **mờ đi kèm câu nói rõ vì sao** (*"Chưa có ai trong
> sổ"*). Thêm một người → bước 2 sáng lên. **Không còn màn "Ai đang cầm máy?" ở bất kỳ
> đâu.** Gõ `?so-lieu=1` vào cuối địa chỉ thì mở được màn số liệu.

---

- [ ] **V2.1 — Khung ba bước + thanh bên một mục + giấu màn số liệu**
  - **(a)** Thêm `MA_BUOC = ["nha-minh", "lam-bai", "phan-tich"] as const` + `TEN_BUOC` +
    `MO_TA_BUOC` vào `config/disc-tu-dien.ts`. `app/khoang/disc.tsx` thành khung xếp dọc
    ba tấm: mỗi tấm có số thứ tự, tên, **một dòng trạng thái sống** (`3 người trong sổ` ·
    `còn 2 người chưa làm`), mở/gập được. **Khoá mềm:** bước 2 và 3 **luôn nhìn thấy**,
    mờ đi kèm lý do — không giấu. Tự mở bước hợp lý nhất khi vào: chưa có ai → 1; có người
    chưa làm → 2; đủ 2 người có bài → 3.
    `app/components/thanh-ben.tsx` chỉ render `"disc"`. **Giữ nguyên `MA_KHOANG` và
    `chuanHoaMaKhoang()`** — máy người dùng đang có `"lich-su"` trong localStorage và hàm
    đó đã lo đá về mặc định. `app/page.tsx` đọc `?so-lieu=1` **trong `useEffect`**, không
    đọc lúc dựng HTML tĩnh (máy chủ không có `location` ⇒ lệch hydration).
  - **(b)** Mở link → thanh bên có **đúng một mục**. Bấm vào → ba tấm xếp dọc. Trên máy
    trống: bước 2 mờ, ghi *"Chưa có ai trong sổ"*; bước 3 mờ, ghi *"Cần ít nhất 2 người đã
    làm xong"*. Thêm một người → bước 2 sáng và tự mở. Thêm `?so-lieu=1` → thấy màn số
    liệu; bỏ đi → không có đường nào khác tới đó.
  - **(c)** Mở rộng `tests/dieu-huong.test.tsx`: thanh bên render đúng 1 mục; ba tấm có mặt
    cùng lúc; bước 2 mờ khi sổ trống và sáng khi có 1 người; bước 3 mờ khi <2 người có bài.
    Sửa `tests/so-lieu.test.tsx` để vào qua `?so-lieu=1`.
  - **(d)** 6 giờ.

- [ ] 🔴 **V2.2 — Bước 2 là danh sách thành viên; xoá màn "Ai đang cầm máy?"**
  - **(a)** Bước 2 render danh sách thẻ thành viên để chọn (đúng nghĩa *"hãy chọn cá nhân
    thực hiện"*), sổ trống thì chỉ về bước 1. **Xoá `app/khoang/chon-doi-tuong.tsx`** và
    nhánh `{ ten: "chon" }` trong `disc.tsx`. `BoiCanhChon` (lớp/tuổi) nay lấy từ bản ghi
    thành viên, không từ M1. **Mang nguyên hàng rào hạn mức 2 bài** (`baiSapMat` →
    `HopThoaiHanMuc`) sang bước 2 — đây là chỗ **duy nhất** được phép xoá bài vì hạn mức;
    thay một màn mà đánh rơi hàng rào của màn đó là cách mất dữ liệu tốn công nhất.
    Giữ nguyên chữ ký `dinhTuyen()` để `tests/dinh-tuyen.test.ts` khỏi đỏ oan.
  - **(b)** Đi hết luồng: bước 1 thêm người → bước 2 chọn người → làm bài → xem kết quả.
    **Không gặp màn "Ai đang cầm máy?" ở bất kỳ đâu.** Làm **2 bài cho Mẹ Lan** rồi thử
    bài thứ 3 → phải bật hộp thoại **nêu đích danh bài sắp mất**, không xoá im lặng.
  - **(c)** 🔴 Đổi `tests/duong-m1.ts` → `tests/duong-vao-bai.ts` — **một nơi duy nhất**
    biết cách vào một bộ đề (tạo thành viên → bấm *Làm bài* trên thẻ). Bảng ánh xạ ở `V1.3`
    đọc lên chính là bản đặc tả của file này. Rà lại các file gọi nó: `m2-truoc-khi-bat-dau`
    · `m3-lam-bai` · `luu-boi-canh` · `m4-ket-qua` · `m5-vung-lech` · `m6-lich-su` ·
    `moc-bai-thu-hai` · `han-muc-thi-hanh` · `lam-bai-tu-the` · `ba-dai` ·
    `bon-loi-nguoi-doc`. Xoá `tests/m1-chon-doi-tuong.test.tsx`.
    **`tests/han-muc-thi-hanh.test.tsx` phải vẫn xanh** — đó là cửa canh hàng rào hạn mức.
  - **(d)** 6 giờ. **Ước lượng này rộng có chủ đích:** lần trước chỉ *sắp lại* M1 đã gây
    34 cửa đỏ ở 4 file. Làm hạng mục này **sau** khi `V2.1` đã chạy được, không gộp.

---

## GIAI ĐOẠN V3 — Bước 3 mở ra và rủ được người

**Ước lượng: 1,5 ngày**

> Đích của bước 3 đã chốt: **rủ thêm người trong nhà cùng làm** — không phải khoe ra ngoài,
> không phải in ra. Mọi thiết kế ở giai đoạn này xoay quanh **chỗ trống** và **lời mời**.

### DEMO CUỐI GĐ V3
> Hai người làm xong → bước 3 sáng → bấm *Phân tích* → mỗi người một bản đọc riêng, nói rõ
> *tương tác với người kia thế nào*. Trên đầu bản có dòng **"Còn bố Nam và bé Na chưa làm"**
> kèm nút mời từng người. Chạy lần thứ hai → **danh sách thư mục hiện ngày VÀ giờ**, mở lại
> được bản cũ.

---

- [ ] **V3.1 — Nối danh sách 5 thư mục có ngày và giờ**
  - **(a)** Ba thứ đã dựng xong mà **chưa nối vào đâu**: `docPhanTich()` ở
    [modules/core/luu-tru/kho-bai.ts:273](modules/core/luu-tru/kho-bai.ts#L273) không ai
    gọi; chữ `CHU_TONG_HOP.nhomThuMuc` · `moTaThuMuc` · `nutMoThuMuc` nằm trong `config/`
    không component nào vẽ. Dựng danh sách thư mục ở cuối bước 3, đọc từ `docPhanTich()`.
    Tên thư mục dùng **`hienNgayGio()`**
    ([modules/core/tien-ich/ngay.ts:33](modules/core/tien-ich/ngay.ts#L33)), không phải
    `hienNgay()` — yêu cầu là ngày **và** giờ. Sửa `CHU_HAN_MUC_THU_MUC.mauDong` cho khớp.
    Mở lại một thư mục cũ thì hiện đúng N bản đã lưu. 🔴 `PhanTichGiaDinh.noiDung` khai
    kiểu `unknown` — **phải kiểm hình dạng lúc đọc ra, cấm ép kiểu**: bản ghi cũ có thể
    thiếu trường, và một bản phân tích vỡ giữa chừng thì người dùng thấy trang trắng.
  - **(b)** Chạy phân tích 2 lần cách nhau vài phút → cuối bước 3 hiện **2 dòng thư mục,
    mỗi dòng có ngày và giờ khác nhau**. Bấm *Mở* ở dòng cũ → hiện lại đúng bản đã chạy
    lúc đó. Chạy tới lần thứ 6 → hộp thoại hỏi trước, **nêu đích danh lần nào sắp mất**.
  - **(c)** Thêm `tests/thu-muc-phan-tich.test.tsx`: lưu 3 bản phân tích → danh sách hiện
    3 dòng, **mỗi dòng chứa cả ngày lẫn giờ**; bấm *Mở* dòng thứ 2 hiện đúng nội dung của
    bản đó; `noiDung` sai hình dạng thì hiện thông báo, **không làm trắng trang**.
    `tests/han-muc.test.ts` (hạn mức 5 thư mục) phải vẫn xanh.
  - **(d)** 5 giờ.

- [ ] **V3.2 — Bước 3 khoá bằng "CÒN THIẾU AI", kèm nút mời**
  - **(a)** Đây là **đòn bẩy thật sự** của con số `baiThuHai`, không phải màu sắc hay bố
    cục. Thay câu chung chung *"cần ít nhất 2 người"* bằng câu nêu **đích danh người chưa
    làm**: *"Còn bố Nam và bé Na chưa làm — bức tranh cả nhà đang thiếu 2 người"*, kèm nút
    mời cho từng người. Nút mời làm đúng một việc: mở mã mời/QR cho người đó (nếu `V0.2`
    xanh), hoặc chuyển thẳng sang bước 2 với người đó được chọn sẵn (nếu `V0.2` đỏ).
    Khối này hiện ở **cả hai chỗ**: trên tấm bước 3 khi chưa mở được, và trên đầu bản phân
    tích khi đã chạy xong (lúc người ta vừa thấy nó hay).
    Chữ mới đặt trong `CHU_TONG_HOP`. 🔴 **Không bê `CHU_THONG_DIEP` sang** — khối đó có
    luật *"chỉ xuất hiện ở bảng gia đình"* và `tests/thong-diep.test.tsx` canh; rải ra khắp
    nơi thì lần đọc thứ tư nó thành khẩu hiệu quảng cáo.
  - **(b)** Sổ có 4 người, mới 2 người làm xong → tấm bước 3 ghi **đúng tên 2 người còn
    lại**, mỗi tên một nút mời. Bấm nút mời của bố Nam → mở đúng mã mời cho bố Nam. Chạy
    phân tích xong → khối "còn thiếu ai" **vẫn hiện trên đầu bản**.
  - **(c)** Thêm `tests/con-thieu-ai.test.tsx`: sổ 4 người / 2 người có bài → hiện đúng 2
    tên còn lại; đủ cả 4 → khối biến mất; tên hiện ra **khớp đúng tên trong sổ** (dùng tên
    bịa `"Zozo"`, `"Kiki"` — 🔴 tên ngắn như `"Bi"` khớp nhầm vào chữ giao diện
    *"**Bi**ệt danh khác nhau"* và làm test đỏ oan, đã trả giá một lần).
  - **(d)** 5 giờ.

- [ ] **V3.3 — Đo phễu mời: tách "đã bấm mời" khỏi "người thứ hai làm xong"**
  - **(a)** Giá trị trên giờ công cao nhất cả sổ này. Hiện `baiThuHai` chỉ có 0 hoặc 1.
    Nếu ra 0, không ai biết là **chưa ai bấm mời** hay **bấm rồi mà người kia không làm** —
    hai chẩn đoán ngược nhau: một cái là lỗi phần mềm, một cái là lỗi giả định. Thêm mốc
    `"bamMoi"` vào `MOC` ở
    [modules/core/do-phieu/index.ts:18](modules/core/do-phieu/index.ts#L18) (**thêm vào
    cuối mảng**, không chèn giữa) và ghi mốc khi bấm nút mời ở `V3.2`. Hiện cả hai con số
    ở màn `?so-lieu=1`, đặt cạnh nhau kèm một dòng đọc hộ: *"{x} lần bấm mời → {y} người
    thứ hai làm xong"*.
  - **(b)** Bấm nút mời 3 lần, cho 1 người làm xong → mở `?so-lieu=1` thấy **3 lần bấm mời**
    và **1 người thứ hai làm xong**.
  - **(c)** Mở rộng `tests/do-phieu.test.ts`: mốc `bamMoi` đếm đúng số lần bấm (khác
    `baiThuHai` vốn chỉ ghi một lần, đo *"đã từng đạt"*). Mở rộng `tests/so-lieu.test.tsx`
    kiểm hai con số hiện ra đúng.
  - **(d)** 2 giờ.

---

## GIAI ĐOẠN V4 — Bảo hiểm trước ngày phát

**Ước lượng: 1 ngày**

### DEMO CUỐI GĐ V4
> Đổi **một dòng trong `config/`** → toàn bộ nội dung nói về trẻ biến mất khỏi sản phẩm,
> phần dành cho người lớn còn nguyên vẹn và vẫn chạy hết luồng. Làm xong bài của người thứ
> hai → hiện **đúng một lần** lời nhắc tải bản sao lưu về máy.

---

- [ ] 🔴 **V4.1 — Cờ tắt riêng nội dung nói về TRẺ**
  - **(a)** 68KB nội dung nói về trẻ (`docs/noi-dung-cho-ky-duyet.md`) **chưa ai có chuyên
    môn ký duyệt**. Chủ dự án đã chốt ngày 28/08/2026 là **phát đủ cả phần trẻ, chưa ký
    cũng phát**, và chịu trách nhiệm về quyết định đó — ghi lại ở đây để sau còn truy được.
    Bảo hiểm rẻ nhất: `MO_NOI_DUNG_TRE = true` trong `config/disc-nguong.ts`. Đặt `false`
    thì các bộ `MN` · `TH` · `THCS` · `QS` không mở được, thẻ trẻ em nói rõ *"phần dành cho
    trẻ đang tạm đóng"*, và bản phân tích cả nhà chỉ ghép giữa những người lớn. Ngày có
    khiếu nại đầu tiên thì tắt trong 30 giây, thay vì gỡ cả sản phẩm.
  - **(b)** Đổi cờ sang `false`, chạy `npm run build`, mở lại: thẻ **Bé Na** và **Bin**
    không bấm làm bài được và nói rõ lý do; thẻ **Mẹ Lan** và **bố Nam** vẫn làm bài bình
    thường; bước 3 vẫn chạy được với hai người lớn. Đổi lại `true` → mọi thứ trở lại.
  - **(c)** Thêm `tests/co-noi-dung-tre.test.tsx`: cờ `false` thì bốn bộ đề trẻ không mở
    được và phân tích cả nhà vẫn chạy với 2 người lớn; cờ `true` thì mọi thứ như cũ.
  - **(d)** 3 giờ.

- [ ] **V4.2 — Nhắc sao lưu đúng một lần, sau bài của người thứ hai**
  - **(a)** Mọi thứ nằm trong IndexedDB của một trình duyệt: xoá dữ liệu duyệt web, đổi
    điện thoại, chế độ ẩn danh — mất sạch, không khôi phục được. Nút sao lưu `.zip` có sẵn
    nhưng nằm im ở cuối màn. Hiện lời nhắc **đúng một lần**, ngay sau khi mốc `baiThuHai`
    được ghi — đó là khoảnh khắc **đầu tiên** gia đình có thứ đáng để mất. Nhắc sớm hơn thì
    phiền, muộn hơn thì đã mất. Dùng lại `saoLuuTatCa()` + `taiXuong()` đã có.
  - **(b)** Làm bài cho người thứ hai → hiện lời nhắc kèm nút tải về; bấm tải → được file
    `.zip`. Làm bài cho người thứ ba → **không nhắc lại nữa**.
  - **(c)** Thêm `tests/nhac-sao-luu.test.tsx`: nhắc xuất hiện đúng một lần sau bài thứ hai,
    không xuất hiện ở bài thứ nhất và bài thứ ba.
  - **(d)** 3 giờ.

- [ ] **V4.3 — Bộ đồ nghề cho giáo viên và sale (0 dòng code)**
  - **(a)** Kênh phân phối là **con người** — giáo viên và sale trao đổi lúc chăm sóc khách
    hàng — mà hiện **chưa có câu nào soạn sẵn**. Sổ dự án đã ghi: *"Lý do chưa nhà nào làm
    2 bài không phải phần mềm khó dùng — là chưa ai bảo họ làm."* Viết
    `docs/huong-dan-giao-vien-va-sale.md`, đúng một trang A4: nói gì trong 30 giây · nói
    lúc nào trong buổi chăm sóc · **ba câu trả lời cho ba câu hỏi phụ huynh hay hỏi nhất**
    (*"cái này để làm gì?"* · *"có mất tiền không?"* · *"dữ liệu con tôi đi đâu?"*) ·
    🔴 **luật máy demo: dùng tên bịa, bấm Xoá sạch sau mỗi lần demo** — máy công ty đi qua
    nhiều gia đình sẽ tích lại tên thật của nhiều đứa trẻ kèm hồ sơ tính cách, và lúc đó
    công ty đang thật sự xử lý dữ liệu cá nhân của trẻ.
  - **(b)** Chủ dự án đọc hết trong 3 phút và duyệt câu chữ; đưa cho một giáo viên đọc thử,
    họ nói lại được ý chính mà không cần nhìn giấy.
  - **(c)** Không có test tự động — đây là tài liệu cho người.
  - **(d)** 1 giờ.
  - **(e) chặn:** NGƯỜI — cần chủ dự án duyệt câu chữ trước khi đưa cho giáo viên.

---

## GIAI ĐOẠN V5 — Dọn và chốt

**Ước lượng: 0,5 ngày**

### DEMO CUỐI GĐ V5
> Đi hết luồng ba bước một mạch trên **điện thoại thật**, không gặp lối cụt nào, không gặp
> nút nào bấm vào rồi không biết quay ra bằng đường nào.

---

- [ ] **V5.1 — Ẩn đồ cũ khỏi điều hướng (KHÔNG di chuyển file)**
  - **(a)** Ẩn khỏi đường đi những thứ không thuộc luồng mới: so sánh *hồi đó ↔ bây giờ*
    (sớm nhất cuối tháng 11 mới có nhà nào mở được), ảnh PNG chia sẻ ra ngoài (đích đã đổi
    sang *rủ người trong nhà*), và nút QR **nếu `V0.2` đỏ**. 🔴 **Chỉ ẩn khỏi điều hướng,
    không dời file sang thư mục khác ở phiên bản này** — dời file là hàng trăm dòng đổi
    đường dẫn và một đợt test đỏ, đổi lại đúng con số 0 giá trị cho người dùng trước ngày
    phát. Ghi danh sách những thứ đã ẩn vào một mục trong `PLAN_V2.md` để đợt sau dọn thật.
  - **(b)** Đi hết luồng ba bước trên điện thoại thật: mỗi màn đều có đường quay ra, không
    màn nào trống trơn, không nút nào dẫn tới trang trắng.
  - **(c)** `npm run kiem` xanh toàn bộ. `tests/manifest.test.ts` và
    `tests/ngoai-tuyen.test.ts` phải vẫn xanh (service worker + danh sách nạp sẵn).
  - **(d)** 2 giờ.

- [ ] **V5.2 — Ghi lại quyết định để sáu tháng sau còn truy được**
  - **(a)** Viết `docs/decisions/ADR-008-ba-buoc-trong-mot-khoang.md`: luồng ba bước lật
    phần nào của ADR-007, giữ phần nào (bảng gia đình **được giữ nguyên** bên trong bước 1,
    nên điều ADR-007 lo — *"nhìn một cái là biết ai chưa làm"* — vẫn còn), và ghi lại **cả
    phản biện cũ** để đời sau cân lại được. Cập nhật `CLAUDE.md`: bảng quyết định (3 quyết
    định chốt ngày 28/08: luồng ba bước · phát khi chưa có chữ ký · mọi bài phải thuộc một
    người) và mục TRẠNG THÁI trỏ sang `PLAN_V2.md`. Đổi tên `PLAN.md` → `PLAN_V1_LUU.md`
    và thêm một dòng ở đầu: *"Không còn hiệu lực. Giữ để tra lý do của 68 hạng mục cũ.
    Lộ trình đang chạy: `PLAN_V2.md`."*
  - **(b)** Mở `CLAUDE.md` đọc mục TRẠNG THÁI, thấy nó trỏ đúng sang `PLAN_V2.md` và nói
    đúng số hạng mục đã xong.
  - **(c)** `npm run check:structure` xanh.
  - **(d)** 2 giờ.

---

## ❌ KHÔNG LÀM Ở BẢN NÀY — và vì sao

| Không làm | Lý do |
| --- | --- |
| **Làm đẹp sâu bước 3** (bố cục, minh hoạ, hoạt ảnh) | Chưa biết phải đẹp chỗ nào cho tới khi có 30 gia đình thật. Làm trước là đoán; làm sau là sửa đúng chỗ. Riêng phần *"còn thiếu ai"* ở `V3.2` là ngoại lệ — đó là phần duy nhất dám khẳng định có tác dụng, vì nó tác động thẳng vào `baiThuHai`. Tiết kiệm ~3 ngày. |
| **Dời đồ cũ sang thư mục `cu/`** | Chỉ **ẩn khỏi điều hướng** ở `V5.1`. Dời file thật = hàng trăm dòng đổi đường dẫn + một đợt test đỏ, đổi lại 0 giá trị cho người dùng. Dọn sau khi phát xong. |
| **So sánh "hồi đó ↔ bây giờ"** | Cần hai bài cách nhau ≥ 90 ngày. Sớm nhất **cuối tháng 11/2026** mới có gia đình đầu tiên mở được màn này. Giữ mã, ẩn lối vào. |
| **Ảnh PNG chia sẻ ra ngoài** | Đích đã chốt là *rủ người trong nhà*, không phải khoe ra ngoài. Hai đích đòi hai thiết kế; giữ cả hai làm loãng cả hai. |
| **Đầu tư thêm vào bản in tách bản** | Giữ nguyên như đang có (không tốn gì), nhưng không làm thêm: phụ huynh dùng điện thoại, rất ít người in. |
| **Thu 30–50 phản hồi rồi chạy Cronbach's α** | Đây là lúc **duy nhất** được phép nói về độ tin cậy bằng số của chính mình — nhưng phải có dữ liệu thật trước. Sau khi phát. |
| **Dựng lại trọn bộ test một lượt** | Làm cuốn chiếu: đổi luồng ở `V2.1` trước, xoá M1 ở `V2.2` sau như một hạng mục riêng. Gộp lại là mời một đợt đỏ không gỡ nổi. |
| **Bàn giao cho đội dev app chủ** | ADR-004 đã tách mã hai tầng sẵn cho việc này, nhưng **chưa ai hỏi họ có nhận không**. Việc của người, xem mục dưới. |

---

## CHỜ NGOÀI — việc NGƯỜI / NGOÀI, chạy song song, không chặn thi công

| Việc | Nhãn | Chặn cái gì |
| --- | --- | --- |
| **Tài khoản Cloudflare + tên miền** | NGOÀI | 🔴 **Chặn `V0.1`, và `V0.1` chặn cả mốc phát.** Làm đầu tiên. |
| **Hai điện thoại thật để quét QR** | NGƯỜI | 🔴 Chặn `V0.2`. Kết quả quyết định thiết kế nút mời ở `V3.2`. |
| **Gọi 5 phụ huynh vừa nghỉ** | NGƯỜI | Không chặn dòng code nào. **Nhưng mục tiêu cả dự án là giữ chân mà chưa ai đo vì sao họ đi** — lý do có thể chẳng liên quan gì tới thứ đang xây. |
| **Gọi đội dev app chủ 30 phút** | NGƯỜI | Họ sẽ bảo trì hệ này mà chưa ai hỏi họ có nhận không. React bản mấy · có Tailwind không · lead đi vào đâu. |
| **Chữ ký chuyên môn cho nội dung về trẻ** | NGOÀI | Chủ dự án đã chốt phát trước khi có chữ ký (28/08/2026). `V4.1` là bảo hiểm cho quyết định đó. |
| **Duyệt câu chữ trang A4** | NGƯỜI | Chặn `V4.3`. |

---

## 🏁 ĐIỀU KIỆN DỪNG — đặt TRƯỚC khi có dữ liệu

> Đặt bây giờ, lúc chưa ai gắn bó với kết quả. Không có mốc này thì **kết quả nào cũng đọc
> ra được thành "cần làm đẹp thêm chút nữa"**.

Sau khi phát cho 30 gia đình, đọc hai con số ở `?so-lieu=1`:

- **Bấm mời > 0 nhưng người thứ hai làm xong ≈ 0** ⇒ lỗi ở **sản phẩm**. Lời mời tới nơi mà
  người kia không làm được — sửa tiếp, và biết rõ sửa chỗ nào.
- **Bấm mời ≈ 0** ⇒ lỗi ở **giả định**, không phải phần mềm. Giả định đỡ 9,5 ngày của GĐ14
  (*một phụ huynh triệu tập được ≥2 người*) hiện có **0 quan sát ủng hộ và 1 quan sát phản
  bác**. Bằng 0 sau 30 máy thật thì **dừng, đừng tiêu thêm ngày nào** — thứ cần xem lại là
  giả định.

---

## TỔNG ƯỚC LƯỢNG

| Giai đoạn | Máy | Người / Ngoài |
| --- | --- | --- |
| V0 — giết ba rủi ro | 0,5 ngày | 1 buổi (tài khoản host, 2 điện thoại) |
| V1 — bố mẹ vào được bài | 1 ngày | — |
| V2 — ba bước | 1,5 ngày | — |
| V3 — bước 3 + rủ người | 1,5 ngày | — |
| V4 — bảo hiểm | 1 ngày | 1 giờ duyệt câu chữ |
| V5 — dọn và chốt | 0,5 ngày | — |
| **Tổng** | **~6 ngày máy** | **~1 buổi + 1 giờ** |

Kịp mốc 1–2 tuần, với điều kiện **tài khoản host có trong 2 ngày đầu**.
