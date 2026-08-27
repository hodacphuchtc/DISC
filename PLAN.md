# PLAN.md — Lộ trình DISC (khởi tạo 26/08/2026 · lộ trình chi tiết 26/08/2026)

> **Nguyên tắc đọc file này:** đây là NGUỒN LỘ TRÌNH DUY NHẤT của dự án — không đẻ file kế
> hoạch riêng; cần mở rộng thì đánh số con ngay tại đây (vd 2.1b, 3B.1). Mỗi Giai đoạn (GĐ)
> kết thúc bằng một DEMO mà người dùng tự bấm thử được — không nghiệm thu bằng lời "đã viết
> xong". Mỗi hạng mục có 4 dòng: (a) làm gì, (b) người dùng kiểm chứng bằng thao tác nào,
> (c) test tự động nào chạy, (d) ước lượng thời gian. Hạng mục 🔴 = rủi ro cao, cố tình xếp
> SỚM. **Luật tick:** chỉ tick ✅ khi (b) đã bấm thật và (c) đã xanh — cấm tick theo cảm
> giác; hạng mục dở ghi `(dở — dừng ở: ...)`. Xong MỘT hạng mục → tick → báo cáo 3 dòng →
> đi tiếp theo GÓI (luật: `.claude/rules/workflow.md`); chỉ dừng ở điểm DỪNG BẮT BUỘC.
>
> **Nguồn thiết kế chi tiết:** `docs/BA/DISC_BA.md` (đặc tả nghiệp vụ, 104 câu hỏi, thuật
> toán chấm, văn bản báo cáo) + `docs/brd/` + `docs/decisions/ADR-*`. Quy tắc bắt buộc:
> `.claude/rules/`.

---

## BÀN GIAO PHIÊN GẦN NHẤT

> 🔴 **GHI ĐÈ mỗi phiên** — ý cũ còn giá trị thì dời về sổ miền rồi trỏ, đừng xếp chồng.

**Phiên 27/08/2026 (tối, chặng 3) — GĐ10 xong trọn · GĐ11–GĐ14 vừa mở, CHỜ DUYỆT**

**1. Vừa xong.** `10.4` `10.6` `10.7` — **48/48 hạng mục GĐ0–GĐ10**. Đã push `origin/main`,
CI xanh: `76d9cde` (ba dải + in tách bản, M1 hai nhánh) · `84c8a23` (nội dung ba bản, hai gói
ký duyệt) · `f31a3de` (sửa lỗi 8 nhịp dồn nhầm trục D). **805 test · `kiem` + `build` xanh.**

**2. ĐANG DỞ — chờ MỘT chữ.** Lộ trình GĐ11–GĐ14 (**DISC GIA ĐÌNH**, 20 hạng mục, 28 ngày)
đã viết xong vào `PLAN.md` dòng ~770–1160. Chủ dự án nói **chỉ khi gõ "DUYỆT" mới bắt đầu**.
Duyệt rồi thì làm từ **`11.1` — spike mã QR**, file mới `modules/core/gia-dinh/ma-moi.ts`
+ trang tạm `app/thu-ma-moi/page.tsx`. Thiết kế đầy đủ (645 dòng, có cả phần thẩm định đầu
tư): `~/.claude/plans/t-i-test-v-purrfect-star.md`.

**3. Chặn ở NGƯỜI / NGOÀI.** (a) **Chữ "DUYỆT"** — chặn toàn bộ GĐ11. (b) Hai hồ sơ ký duyệt
`docs/noi-dung-cho-ky-duyet.md` (gói A, 11.506 từ) + `...-goi-b.md` (gói B, 1.537 từ) **chưa
gửi đi ký** — nên gửi TRƯỚC khi viết 3.000 từ của `14.3`. (c) **Gọi đội dev app chủ 30 phút**
(React bản mấy · có Tailwind không) — họ sẽ ôm hệ 28 ngày này mà chưa ai hỏi họ. (d) Nghi
thức mời của trường + gọi 5 phụ huynh vừa nghỉ.

**4. ĐÃ ĐO ĐƯỢC, ĐỪNG ĐO LẠI.** *(khảo sát sản phẩm 27/08 — phần đắt nhất của phiên)*
- **1.000+ gia đình đang trả tiền · app chủ đang sống, phụ huynh vào thường xuyên.**
- **< 10 người ngoài vòng quen từng làm xong một bài** ⇒ tiếp cận **dưới 1%** tệp khách.
- 🔴 **CHƯA gia đình nào tự làm 2 bài** — dù tính năng ghép 2 người đã có từ GĐ5. Đây là
  giả định đang đỡ 9,5 ngày của GĐ14. Chủ dự án đã nghe và chọn xây trọn.
- **Chưa đo lý do phụ huynh rời đi.** Mục tiêu kinh doanh = **giữ chân**, không phải mồi khách.
- Trần kiến trúc: ADR-001 cấm backend ⇒ cả nhà phải dùng chung một máy. `13.1` (mã mời/QR,
  ~40 byte) gỡ được trần này mà không phá ADR-001.
- Nội dung cặp N người: **PA-2 = 56 đoạn ≈ 3.000 từ** (PA-1 là 168 đoạn ≈ 12.600 từ). Chọn
  PA-2 vì thêm quan hệ mới (ông bà, bố dượng) tốn **+0 đoạn**. Chi tiết ở file thiết kế mục 8.

**5. Cạm bẫy vừa trả giá.** Bốn mục mới đã ghi `CLAUDE.md` mục CẢNH BÁO; bài học miền báo cáo
ở `modules/report/OVERVIEW.md` mục 6. Đắt nhất: **script sửa hàng loạt dò khoá bằng
`indexOf("  D: {")` khớp nhầm khối `LOI_KHUYEN` đứng trước** ⇒ cả 8 câu dồn vào riêng trục D,
không cửa kiểm nào bắt được, **chỉ lộ ra khi NHÌN ảnh chụp trang**.

**6. Lệnh phiên sau nên chạy.**
```bash
npx vitest run --maxWorkers=2   # 805 test — dùng cờ này khi máy đang tải nặng
npm run xem-thu                 # bản phát hành thật, cổng 3100
```

---

## MỤC TIÊU & PHẠM VI

**Xây cái gì:** một khoang DISC tự chứa, chạy trên máy local, để đội dev của chủ dự án bê
vào ứng dụng Next.js + React + TypeScript có sẵn của họ dưới dạng **một tag ở thanh bên
trái**. Người làm bài: phụ huynh và học sinh mầm non / tiểu học / THCS.

**Xong nghĩa là gì:** không phải "phụ huynh dùng được" — mà là **đội dev bê vào mất một
buổi, không phải một tuần**.

**Kiến trúc:** 100% chạy trong trình duyệt. Không backend, không cơ sở dữ liệu, không API
trả phí. Câu trả lời của trẻ không rời khỏi máy người dùng. Chi phí vận hành 0đ/tháng.

**Công nghệ:** Next.js App Router (`output: 'export'`) · TypeScript · Tailwind CSS ·
Vitest · `jszip` (thư viện ngoài **duy nhất**).

**Tổng ước lượng: 18,5 ngày công dev**, chia 9 giai đoạn (GĐ0→GĐ8).

---

## RÀNG BUỘC TOÀN DỰ ÁN (mọi hạng mục đều phải tuân)

| # | Ràng buộc | Giá trị chính xác |
| - | --------- | ----------------- |
| R1 | Dữ liệu không rời máy người dùng | Không `fetch` mang câu trả lời · không analytics trên kết quả · không gửi email |
| R2 | Chi phí vận hành | 0đ/tháng — không backend, không DB, không API trả phí |
| R3 | Hằng số nghiệp vụ nằm trong `config/` | Ngân hàng câu, ngưỡng, văn bản báo cáo — **không hardcode trong code** |
| R4 | `config/` đi thẳng ra bundle công khai | 🔴 Cấm đặt họ tên, tên cơ sở, số điện thoại vào `config/` |
| R5 | Ngôn ngữ hiển thị | Tiếng Việt 100% có dấu · từ điển duy nhất `config/disc-tu-dien.ts` |
| R6 | Ranh giới module | `test` và `report` chỉ được import `@modules/core` — `.semgrep/ranh-gioi-module.yml` canh |
| R7 | Viết "DISC" in hoa toàn bộ | Không dùng *DiSC* (nhãn hiệu của Wiley) · không tuyên bố "chuẩn quốc tế" |
| R8 | Ngày tháng | Lưu ISO 8601 · **hiển thị** `dd/mm/yyyy` · kiểm regex `^\d{4}-\d{2}-\d{2}` trước `new Date()` |
| R9 | Regex đụng chữ Việt | Bắt buộc cờ `u` + `(?!\p{L})` thay `\b` |
| R10 | Script vặt | Viết bằng `node`, **không dùng `python3`** |

---

## 🔴 NĂM HẠNG MỤC RỦI RO CAO — ĐÃ XẾP SỚM CÓ CHỦ ĐÍCH

Xếp sớm không phải để "làm khó trước cho xong". Xếp sớm vì **nếu một trong năm cái này
hỏng, kế hoạch phải đổi** — và biết điều đó ở ngày 3 rẻ hơn biết ở ngày 15.

| Mã | Rủi ro cao vì | Nằm ở |
| -- | ------------- | ----- |
| **0.5** | Tách hai tầng lõi/giao diện — **quyết ngay tốn 0 ngày, để đến cuối tốn 2 ngày**. Đây là bảo hiểm cho kịch bản đội dev từ chối giao diện | GĐ0, ngày 2 |
| **1.1** | Canvas vẽ chữ tiếng Việt — **thứ khó nhất về kỹ thuật trong cả dự án**, và nếu hỏng thì mất luôn động cơ lan truyền. Làm thành spike độc lập, trước khi có báo cáo để vẽ | GĐ1, ngày 3 |
| **2.3** | Hàm chấm + `HL-1` — nếu sai thì mọi thứ phía sau là số bịa, và **không có gì báo đỏ** | GĐ2, ngày 5 |
| **5.3** | Vùng lệch con ↔ cha mẹ — đây **là** sản phẩm; ba bộ đề đầu là hàng chợ | GĐ5, ngày 14 |
| **6.2** | Test canh payload liên hệ không chứa dữ liệu trẻ — hàng rào giữ lớp phòng vệ pháp lý | GĐ6, ngày 16 |

> **Vì sao 5.3 không xếp sớm hơn:** nó buộc phải có lõi chấm (2.3) + lưu trữ (5.1) trước.
> Đã bù bằng cách chốt cứng thiết kế ghép cặp ngay từ 2.2 (kiểu `BaiLam` có `maTre` +
> `phienBanBoDe`), nên đến 5.3 chỉ còn là phép trừ, không còn là ẩn số.

---

## GIAI ĐOẠN 0 — Nền móng + hai lằn ranh (ước lượng: 2 ngày)

**🏁 DEMO kết thúc GĐ0:** chạy `npm run dev`, mở `localhost:3000` → thấy **thanh bên trái
màu trắng rộng 264px** có chữ `SATA` cam và `ROBO` tím, hai mục **DISC** (icon 4 ô vuông)
và **Bài đã làm**. Bấm qua lại hai mục thấy nền tím nhạt di chuyển theo. **Tải lại trang
(F5) vẫn ở đúng mục vừa chọn.**

- [x] **0.1 — Khởi tạo bộ khung chuẩn** ✅ (26/08/2026 — sinh bởi skill `khoi-tao-du-an`)
  - (a) CLAUDE.md + PLAN.md + `.claude/{rules,agents,skills,commands,settings}` + docs/ +
    config/ + `scripts/check-structure.mjs` + scaffold.json.
  - (b) Người dùng mở cây thư mục thấy đủ cấu trúc; đọc được CLAUDE.md bằng Tiếng Việt.
  - (c) `node scripts/check-structure.mjs` in ✅ toàn bộ, exit 0.
  - (d) 0,1 ngày.

- [x] **0.2 — BRD chốt phạm vi bản 1** ✅ (27/08/2026 — viết muộn ở cuối GĐ8 nên nó phản ánh thứ ĐÃ xây xong, không phải thứ định xây; `docs/brd/disc-mvp.md`)
  - (a) Viết `docs/brd/disc-mvp.md`: bài toán, 4 nhóm người dùng, 5 bộ đề, phạm vi
    TRONG/NGOÀI (chép mục "KHÔNG LÀM Ở BẢN NÀY" cuối file này), 12 tiêu chí nghiệm thu.
  - (b) Người dùng mở `docs/brd/disc-mvp.md`, đọc hết trong 10 phút, và **chỉ ra được**
    một thứ có trong bản 1 và một thứ bị hoãn — không cần hỏi lại.
  - (c) (tài liệu — không có test tự động.)
  - (d) 0,25 ngày.

- [x] **0.3 — Bốn bản ADR + sửa lại mục Stack đang sai** ✅ (27/08/2026 — làm muộn ở GĐ8 vì tài liệu bàn giao trỏ tới; ADR-001..004 đã viết, mục Stack trong `CLAUDE.md` và `tech-defaults.md` đã bỏ Supabase)
  - (a) Viết `docs/decisions/ADR-001-khong-backend.md` (vì sao bỏ Supabase — gồm cả lý do
    pháp lý: không giữ dữ liệu thì không phát sinh nghĩa vụ NĐ 13/2023),
    `ADR-002-tuoi-tu-danh-gia.md` (trẻ < 8 tuổi không tự đánh giá — `DISC_BA.md` §3.2),
    `ADR-003-likert-thay-ep-chon.md` (§3.4), `ADR-004-tach-hai-tang.md` (lõi / giao diện).
    Sửa mục **Stack** trong `CLAUDE.md` và `.claude/rules/tech-defaults.md` — hai file này
    đang khai **Supabase (DB/Auth) + Vercel**, mâu thuẫn với ADR-001.
  - (b) Người dùng mở `CLAUDE.md`, tìm chữ "Supabase" → **không còn ở mục Stack**; mở
    `docs/decisions/` thấy đủ 4 file ADR đánh số liền mạch.
  - (c) `node scripts/check-structure.mjs` exit 0.
  - (d) 0,25 ngày.

- [x] **0.4 — Dựng khung Next.js + bộ cổng `npm run kiem`** ✅ (26/08/2026 — Next 16.3.3 · React 19.2.8 · Tailwind 4.3.3 · Vitest 4.1.11)
  - (a) `create-next-app` (App Router, TypeScript, Tailwind) + `output: 'export'` trong
    `next.config.mjs` + Vitest + alias `@modules/*` → `modules/*` trong `tsconfig.json`.
    Khai đủ script trong `package.json` mà rule và hook đang trông chờ — **thiếu cái nào
    thì cửa kiểm đó im lặng không chạy**: `dev` · `build` · `lint` · `test` ·
    `check:structure` · `check:sast` · `kiem` (= typecheck + test + check:structure +
    check:sast).
  - (b) Chạy `npm run dev`, mở `localhost:3000` → thấy trang trắng không lỗi đỏ trong
    Console. Chạy `npm run kiem` → in ra xanh, không đỏ.
  - (c) `npm run kiem` chính nó — bốn cửa đều phải xanh.
  - (d) 0,5 ngày.

- [x] **0.5 🔴 — Hàng rào hai tầng: lõi không được đụng React/DOM** ✅ (26/08/2026 — đã thử phá 2 lần, cắn đúng)
  - (a) Viết `tests/ranh-gioi-hai-tang.test.ts`: quét mọi file trong `modules/core/bo-de/`,
    `modules/report/cham.ts`, `modules/report/kiem-hop-le.ts`, `modules/report/doi-chieu.ts`
    — nếu thấy `from "react"`, `window.`, `document.`, hay `localStorage` thì test đỏ.
    Đây là thứ giữ cho **tầng lõi bê sang stack nào cũng chạy** kể cả khi đội dev vứt toàn
    bộ giao diện.
  - (b) Người dùng tự tay thêm dòng `import { useState } from "react";` vào đầu file
    `modules/report/cham.ts`, chạy `npm run kiem` → **phải ĐỎ** và báo đúng tên file vi
    phạm. Xoá dòng đó đi, chạy lại → xanh.
  - (c) `tests/ranh-gioi-hai-tang.test.ts`.
  - (d) 0,25 ngày.

- [x] **0.6 — Thanh bên + khung ngoài + nhớ mục đang mở** ✅ (27/08/2026 — 8 test điều hướng xanh, đã soi ảnh chụp desktop + điện thoại)
  - (a) Viết `app/components/thanh-ben.tsx` theo đặc tả `DISC_BA.md` §5.1 (viết mới, không
    có repo TAO_ANH để chép): `<aside>` rộng 264px, logo `SATA` `#FF6F00` + `ROBO`
    `#800080`, mỗi mục là `<button>` bo `rounded-xl` có icon SVG 19px, mục đang mở nền
    `rgba(97,11,138,0.09)` + `aria-current="page"`, đáy thanh có thẻ *"Câu trả lời không
    rời máy bạn"*. Icon DISC = 4 ô vuông (mã SVG có sẵn ở §5.1). Tên và mô tả mục khai
    trong `config/disc-tu-dien.ts`, **không gõ chữ thẳng vào component**. Nhớ mục đang mở
    bằng `localStorage` khoá `disc:khoang-dang-mo`, đọc trong `useEffect`.
  - (b) **Chính là DEMO của GĐ0** — xem đầu giai đoạn.
  - (c) `tests/dieu-huong.test.ts` — mã khoang lạ trong localStorage (vd `"abc"`) phải rơi
    về mặc định `"disc"`, **không làm trắng trang**; localStorage bị chặn (cửa sổ ẩn danh)
    cũng không làm hỏng trang.
  - (d) 0,75 ngày.

---

## GIAI ĐOẠN 1 — Đập rủi ro kỹ thuật lớn nhất TRƯỚC (ước lượng: 1 ngày)

> **Vì sao giai đoạn này tồn tại và vì sao nó nằm ở đây.** Xuất ảnh PNG là **động cơ lan
> truyền duy nhất** của sản phẩm — phụ huynh chia sẻ tấm ảnh, không chia sẻ đường link. Nó
> cũng là thứ khó nhất về kỹ thuật: Canvas **không báo lỗi khi chữ tràn khung**, nó vẽ tiếp
> ra ngoài mép, chữ cụt nửa câu, và ảnh vẫn xuất ra bình thường. Chữ tiếng Việt có dấu còn
> rơi về font hệ thống nếu vẽ trước khi font nạp xong. Làm thành **spike độc lập ở ngày 3**,
> không đợi đến ngày 12 mới phát hiện.

**🏁 DEMO kết thúc GĐ1:** mở `localhost:3000/thu-ve-anh` → bấm nút **"Vẽ thử"** → máy tải
về một file PNG. Mở file đó lên: chữ **"Rô Tỉ Mỉ — Bé để ý và nhắc khi có gì đặt sai chỗ"**
hiện **đủ dấu tiếng Việt**, câu dài **tự xuống dòng**, **không có chữ nào bị cụt** hay tràn
ra ngoài mép ảnh.

- [x] **1.1 🔴 — Spike Canvas 2D: vẽ chữ tiếng Việt vừa khung** ✅ (27/08/2026 — 13 test đo chữ xanh; đã soi ảnh cả ca chữ ngắn lẫn ca chữ dài gấp ba)
  - (a) Viết `modules/report/xuat-anh.ts` với ba hàm dùng lại được về sau:
    `doChuVuaKhung(ctx, chuoi, rongToiDa): boolean` · `ngatDong(ctx, chuoi, rongToiDa):
    string[]` · `veTamAnh(duLieu): Promise<Blob>` vẽ khổ `1080×1350`. Bắt buộc `await
    document.fonts.ready` trước khi vẽ dòng đầu tiên; giải phóng bitmap sau khi vẽ xong.
    Thêm trang thử `app/thu-ve-anh/page.tsx` — **trang tạm, gỡ ở hạng mục 8.3**.
  - (b) **Chính là DEMO của GĐ1** — xem đầu giai đoạn. Thử thêm: sửa chuỗi trong trang thử
    thành một câu dài gấp ba, bấm lại → chữ vẫn nằm trong khung, tự xuống dòng, không cụt.
  - (c) `tests/xuat-anh.test.ts` — `doChuVuaKhung` trả `false` khi chuỗi dài hơn khung ·
    chuỗi có dấu tiếng Việt (`"Cẩn trọng"`) đo ra đúng số ký tự, không bị lệch do dấu ·
    `ngatDong` không cắt giữa một từ · chuỗi rỗng không làm hàm nổ.
  - (d) 1 ngày.

---

## GIAI ĐOẠN 2 — Lõi chấm điểm (ước lượng: 3 ngày)

> Làm **trước** giao diện. Lõi sai thì giao diện đẹp cỡ nào cũng chỉ là bao bì cho số bịa.

**🏁 DEMO kết thúc GĐ2:** mở `localhost:3000/thu-cham` → chọn bộ **THCS**, bấm 24 nút trả
lời → thấy ngay **bốn con số D/I/S/C** và tên kiểu (vd *"Kiểu pha: Chủ động + Cẩn trọng"*).
Rồi thử **chọn mức giữa cho cả 24 câu** → **KHÔNG ra bốn con số**, mà ra câu *"Bài này chưa
đủ để kết luận…"*.

- [x] **2.1 — Ngân hàng 104 câu + thứ tự hiển thị chốt cứng** ✅ (27/08/2026 — bóc thẳng từ bảng BA doc, không gõ tay; ⚠️ dòng (b) HOÃN tới GĐ3 vì màn làm bài chưa tồn tại)
  - (a) Đưa trọn 104 câu ở `DISC_BA.md` §6 vào `config/disc-cau-hoi.ts` (5 bộ: MN 20 ·
    TH 20 · THCS 24 · PH 24 · QS 16), mỗi câu có `ma`, `truc`, `dao`, `noiDung`; riêng bộ
    QS thêm `soiGuong`. Chạy một lần `scripts/sinh-thu-tu.mjs` sinh thứ tự theo luật §6.6
    (vòng 4 câu đủ D-I-S-C, trục xoay qua từng vòng, hai câu đảo không đứng cạnh nhau, câu
    đầu bài luôn là câu thuận) rồi **chốt cứng kết quả** vào `config/disc-thu-tu.ts`.
    🔴 **Không random lúc chạy** — random thì hai lần làm bài ra hai thứ tự khác nhau, không
    đối chiếu được và không tái hiện được lỗi.
  - (b) Người dùng mở `config/disc-cau-hoi.ts` **trên web GitHub**, sửa một chữ trong một
    câu bất kỳ, lưu lại; chạy `npm run dev` → thấy chữ mới hiện trên màn hình làm bài.
  - (c) (dữ liệu — test nằm ở 2.4.)
  - (d) 0,5 ngày.

- [x] **2.2 — Kiểu dùng chung + loader bộ đề (nâng lên `core`)** ✅ (27/08/2026 — 8 test; loader ghép nội dung câu với thứ tự đã chốt cứng)
  - (a) Viết `modules/core/bo-de/kieu.ts` khai `MaTruc = "D"|"I"|"S"|"C"`, `MaBoDe =
    "MN"|"TH"|"THCS"|"PH"|"QS"`, `CauHoi`, `BoDe`, `KetQua` (theo hợp đồng `DISC_BA.md`
    §7.5), và `BaiLam` gồm `id`, `boDe`, `maTre?`, `lop?`, `nguoiTraLoi`, `batDau`,
    `ketThuc`, `traLoi`, `ketQua`, `phienBanBoDe`. Viết `modules/core/bo-de/nap.ts` đọc từ
    `config/`. **Nâng lên `core` vì `report` phải biết bộ đề để chấm nhưng semgrep cấm
    `report` import `test`** (R6).
  - (b) (không có giao diện — kiểm qua DEMO của GĐ2.)
  - (c) `tests/nap-bo-de.test.ts` — nạp đủ 5 bộ; mã bộ đề lạ trả về lỗi rõ ràng chứ không
    trả `undefined`.
  - (d) 0,5 ngày.

- [x] **2.3 🔴 — Hàm chấm điểm thuần + năm hàng rào hợp lệ** ✅ (27/08/2026 — 22 test chấm + 18 test hợp lệ; đã soi ảnh DEMO 4: toàn mức giữa ⇒ KHÔNG ra kết quả)
  - (a) Viết `modules/report/cham.ts` (hàm THUẦN — không đụng DOM, không đụng localStorage)
    và `modules/report/kiem-hop-le.ts`. Bốn bước: **đảo chiều**
    `giaTri = dao ? (mucToiDa+1)-raw : raw` → **chuẩn hoá**
    `diem = ((tong - soCau) / (soCau × (mucToiDa-1))) × 100` → **kiểm hợp lệ** `HL-1..HL-5`
    → **xếp kiểu** đơn / pha / phổ đều với `NGUONG_PHA = 8`. Mọi ngưỡng đọc từ
    `config/disc-nguong.ts`, **không hardcode** (R3). Cặp pha luôn viết theo thứ tự cố định
    D-I-S-C (6 cặp, không phải 12).
  - (b) **Chính là DEMO của GĐ2** — xem đầu giai đoạn. Chú ý bấm thử cả hai vế: bài trả lời
    thật ra kết quả, bài toàn mức giữa **không** ra kết quả.
  - (c) `tests/cham-diem.test.ts` ≥ 18 test: đảo chiều đúng ở cả thang 3 và thang 5 · toàn
    mức 1 → 0 điểm · toàn mức 5 → 100 điểm · `d1−d2` **đúng bằng** 8 thì ra **kiểu đơn**
    (kiểm biên trên) · `d1−d2` = 7,9 ra kiểu pha · cặp pha luôn đúng thứ tự D-I-S-C.
    `tests/kiem-hop-le.test.ts` ≥ 10 test: **41% câu ở mức giữa → không hợp lệ, 39% → hợp
    lệ** · 8 câu liên tiếp cùng đáp án → cảnh báo, 7 câu → không cảnh báo · thiếu 1 câu →
    chặn không cho xem kết quả.
  - (d) 1 ngày.

- [x] **2.4 — Test canh cấu trúc ngân hàng câu** ✅ (27/08/2026 — 55 test; đã thử gỡ câu đảo cuối của trục D bộ THCS, cắn đúng)
  - (a) Viết `tests/cau-hoi.test.ts` đọc `config/disc-cau-hoi.ts` và khẳng định các bất
    biến: **mỗi trục có ≥ 1 câu đảo chiều** · số câu mỗi trục bằng nhau trong cùng bộ · mã
    câu không trùng · trong thứ tự hiển thị không có 2 câu cùng trục đứng liền nhau · câu
    đầu bài là câu thuận · **mọi câu bộ QS đều khai `soiGuong` trỏ tới một mã có thật**.
  - (b) Người dùng tự tay xoá dấu `✔` ở cột **Đảo** của câu `THCS-D6` trong
    `config/disc-cau-hoi.ts` (câu đảo cuối cùng của trục D), chạy `npm run kiem` → **phải
    ĐỎ**. Hoàn tác, chạy lại → xanh.
  - (c) `tests/cau-hoi.test.ts`.
  - (d) 0,5 ngày.

- [x] **2.5 — Khoá ngân hàng câu bằng checksum** ✅ (27/08/2026 — 8 test; đã thử sửa 1 chữ không tăng phiên bản ⇒ đỏ, tăng phiên bản + sinh lại ⇒ xanh)
  - (a) Viết `scripts/sinh-checksum.mjs` băm nội dung ngân hàng câu và ghi vào
    `config/disc-checksum.json` cùng `phienBanBoDe`. Viết `tests/checksum.test.ts` so lại.
    Sửa nội dung câu **là đổi ý nghĩa của điểm số** — bài cũ và bài mới không còn so được
    với nhau, mà vùng lệch vẫn sẽ tính và vẫn ra một con số đầy thuyết phục. Test này biến
    luật "sửa câu thì tăng phiên bản" từ kỷ luật con người thành thứ máy bắt được.
  - (b) Người dùng sửa một chữ trong một câu ở `config/disc-cau-hoi.ts` **mà không** tăng
    `phienBanBoDe`, chạy `npm run kiem` → **ĐỎ**, báo "checksum lệch". Tăng `phienBanBoDe`
    lên `1.1` rồi chạy `node scripts/sinh-checksum.mjs`, chạy lại `kiem` → xanh.
  - (c) `tests/checksum.test.ts`.
  - (d) 0,25 ngày.

- [x] **2.6 — Script phân tích item (đầu vào cho việc kiểm chứng bộ câu)** ✅ (27/08/2026 — 16 test thống kê; chạy thật trên 40 dòng dữ liệu BỊA, bắt đúng câu cố tình làm hỏng)
  - (a) Viết `scripts/phan-tich-item.mjs` (bằng `node`, không dùng `python3` — R10): đọc
    file CSV phản hồi thô, in ra cho từng trục — **tương quan của từng câu với tổng trục đã
    trừ chính nó**, hệ số **Cronbach's alpha**, và **danh sách câu đề nghị vứt** (tương quan
    < 0,20). Đây là công cụ biến bộ 104 câu từ *"do BA soạn"* thành *"đã sàng trên người
    Việt"*.
  - (b) Người dùng chạy `node scripts/phan-tich-item.mjs docs/du-lieu-thu/phan-hoi.csv` →
    thấy bảng 4 trục, mỗi trục có alpha và danh sách câu, câu yếu bị đánh dấu `⚠ nên vứt`.
    (Chạy thử được ngay bằng file mẫu bịa 30 dòng — **dữ liệu bịa, không lấy bài làm thật**.)
  - (c) `tests/phan-tich-item.test.ts` — alpha của một bộ dữ liệu đã biết trước kết quả tính
    ra đúng ±0,01 · trục có 1 câu thì báo lỗi rõ ràng chứ không chia cho 0.
  - (d) 0,25 ngày.

---

## GIAI ĐOẠN 3 — Luồng làm bài thật (ước lượng: 3 ngày)

**🏁 DEMO kết thúc GĐ3:** vào khoang DISC → bấm **Tiểu học** → chọn **Lớp 2** → **hiện hộp
giải thích** rồi vào bản **người lớn trả lời** (KHÔNG phải bản bé tự làm). Quay lại, chọn
**Lớp 4** → vào bản bé tự làm, **một câu một màn**, ba nút mặt cười to. Làm dở **8 câu**,
**tắt hẳn tab**, mở lại → quay đúng **câu 9**, 8 câu cũ còn nguyên.

- [x] **3.1 — M1 chọn đối tượng + luật định tuyến** ✅ (27/08/2026 — 22 test luật + 8 test giao diện; đã lái trình duyệt thật bấm Tiểu học→Lớp 2, hộp giải thích hiện đúng)
  - (a) Viết `modules/test/dinh-tuyen.ts` (hàm thuần) theo luật `DISC_BA.md` §4.2 và
    `app/components/the-doi-tuong.tsx` (khai ở **cấp module**, không khai trong thân
    `disc.tsx` — nếu không ô nhập biệt danh sẽ mất chữ mỗi lần gõ). Bốn thẻ lớn. Chọn Tiểu
    học → hỏi lớp mấy; lớp 1–2 → bộ MN **kèm hộp giải thích bắt buộc hiện** (văn bản
    nguyên văn ở §4.2, không được rút gọn). Chọn Phụ huynh → hỏi "cho tôi / cho con"; con
    < 8 tuổi → bộ MN.
  - (b) **Nửa đầu DEMO của GĐ3** — xem đầu giai đoạn.
  - (c) `tests/dinh-tuyen.test.ts` — bảng đầy đủ 4 lựa chọn × 9 lớp → đúng mã bộ đề;
    **lớp 1 và lớp 2 KHÔNG BAO GIỜ ra bộ TH**.
  - (d) 1 ngày.

- [x] **3.2 — M2 màn trước khi bắt đầu + ô biệt danh** ✅ (27/08/2026 — 12 test biệt danh + 10 test giao diện; trình duyệt thật: 40 ký tự→giữ 24, toàn dấu cách→chặn, họ tên→nhắc không chặn)
  - (a) Viết `app/khoang/disc.tsx` phần M2: 4 dòng dặn dò (bao lâu · không có đúng sai ·
    dữ liệu không rời máy · trả lời theo phản xạ đầu tiên) + ô nhập **tên gọi** với
    `maxLength={24}` và dòng nhắc *"Đặt một tên gọi để nhận ra bài này — biệt danh cũng
    được. Đừng ghi họ tên đầy đủ."* (R4 — đây là hàng rào dữ liệu cá nhân trẻ em).
  - (b) Nhập biệt danh `"Bi"`, bấm **Bắt đầu** → vào được màn làm bài. Thử nhập 40 ký tự →
    ô chỉ nhận 24. Thử nhập toàn dấu cách rồi bấm Bắt đầu → **không cho đi tiếp**.
  - (c) `tests/bien-danh.test.ts` — cắt đúng 24 ký tự · chuỗi toàn khoảng trắng bị từ chối ·
    ký tự tiếng Việt có dấu đếm đúng 1 ký tự, không đếm thành 2.
  - (d) 0,5 ngày.

- [x] **3.3 — M3 làm bài, hai kiểu trình bày + tự lưu nháp** ✅ (27/08/2026 — 26 test lưu nháp/tiến trình + 14 test giao diện; trình duyệt thật: làm dở 8 câu → ĐÓNG TAB → mở lại đúng Câu 9/20, 40%)
  - (a) Viết `modules/test/lam-bai/` với hai kiểu trình bày và
    `app/components/thang-tra-loi.tsx` (3 mức mặt cười · 5 mức đồng ý · 5 mức tần suất).
    **MN & TH:** một câu một màn, nút cao ≥ `56px`, chữ ≥ `18px`, cách nhau ≥ `12px`, dòng
    động viên sau mỗi 5 câu, **không có đồng hồ đếm ngược** (áp lực thời gian làm hỏng dữ
    liệu). **THCS/PH/QS:** 5 câu một màn. Thanh tiến trình + nút Quay lại. Tự lưu nháp vào
    `localStorage` sau **mỗi câu**; đo thời gian mỗi câu để phục vụ `HL-4`.
  - (b) **Nửa sau DEMO của GĐ3** — xem đầu giai đoạn.
  - (c) `tests/luu-nhap.test.ts` — nháp ghi và đọc lại đúng · nháp của bộ THCS **không lẫn**
    sang bộ QS · **cửa sổ ẩn danh chặn localStorage thì trang vẫn chạy được**, chỉ mất tính
    năng lưu nháp, không trắng trang.
  - (d) 1,5 ngày.

---

## GIAI ĐOẠN 4 — Báo cáo + tấm ảnh chia sẻ (ước lượng: 3 ngày)

**🏁 DEMO kết thúc GĐ4:** làm trọn một bài THCS trả lời thật → thấy **nhân vật trội**, **4
cột ngang có nhãn số**, và **4 khối diễn giải** trong đó **mỗi trục có ít nhất một dòng
"chỗ cần để ý"** (không phải toàn lời khen). Bấm **Tải ảnh kết quả** → mở file PNG: trên
cùng là **"3 câu để hỏi con tối nay"** kèm 3 câu cụ thể, biểu đồ ở dưới, chữ tiếng Việt
**đủ dấu, không cụt câu nào**.

- [x] **4.1 — M4 màn kết quả** ✅ (27/08/2026 — 39 test diễn giải gồm 4 test canh luật §9.2; trình duyệt thật: bộ MN có câu rào, đại từ đúng theo bộ, không còn chỗ giữ chỗ nào)
  - (a) Viết phần M4 trong `app/khoang/disc.tsx` + `app/components/bieu-do-cot.tsx` (4 cột
    ngang 0–100, vẽ bằng `div`, **không dùng thư viện biểu đồ**) +
    `app/components/the-canh-bao.tsx`. Bốn khối diễn giải đọc từ
    `config/disc-dien-giai.ts`. Bộ MN và TH **mở đầu bằng câu rào bắt buộc**: *"Đây là gợi
    ý để trò chuyện với con, không phải kết luận về con."* Trường hợp **phổ đều** thì
    **không ép nhãn** — hiện câu *"Bốn nhóm hành vi của bạn khá cân bằng…"*.
  - (b) **Nửa đầu DEMO của GĐ4** — xem đầu giai đoạn.
  - (c) `tests/dien-giai.test.ts` — **mọi kiểu đơn (4) + mọi cặp pha (6) + phổ đều (1) đều
    có văn bản**, không khoá nào trỏ vào chỗ trống · mỗi trục có ≥ 1 dòng "chỗ cần để ý".
  - (d) 1 ngày.

- [x] **4.2 — Bốn nhân vật robot bằng SVG inline** ✅ (27/08/2026 — đã soi ảnh 4 nhân vật ở 3 cỡ 132/72/40px, phân biệt được ở cả cỡ nhỏ nhất)
  - (a) Viết `app/components/nhan-vat.tsx`: **Rô Xung Phong** (D, cam `#FF6F00`, cầm cờ) ·
    **Rô Kể Chuyện** (I, vàng `#FFB300`, miệng loa + bong bóng thoại) · **Rô Giữ Nhịp**
    (S, xanh lá `#2E9E6B`, tay đỡ, chân vững) · **Rô Tỉ Mỉ** (C, tím `#610B8A`, kính lúp +
    bảng kiểm). SVG viết tay, **0 file ảnh** — đội dev thay sau bằng một file. Tên nhân vật
    khai trong `config/disc-tu-dien.ts`, đổi tên = sửa một file (R3).
  - (b) Xem lần lượt 4 kết quả khác nhau → thấy **4 nhân vật khác nhau**, đúng màu, phân
    biệt được bằng mắt ở kích thước nhỏ (thu trình duyệt xuống 50% vẫn nhận ra).
  - (c) `tests/nhan-vat.test.ts` — mỗi mã trục trả về đúng một nhân vật; mã lạ không làm nổ
    trang mà trả về nhân vật mặc định.
  - (d) 0,5 ngày.

- [x] **4.3 — Nội dung "3 câu để hỏi con tối nay" (11 bộ × 3 câu)** ✅ (27/08/2026 — 33 câu, đều dùng {chuThe} nên chạy được cho cả người tự đánh giá lẫn người quan sát; ⚠️ dòng (b) CHỜ chủ dự án đọc)
  - (a) Viết vào `config/disc-dien-giai.ts` ba câu hỏi gợi chuyện cho **mỗi kiểu đơn (4) +
    mỗi cặp pha (6) + phổ đều (1)** = 33 câu. Tuân luật viết nội dung §9.2: nói **thiên
    hướng** không nói **bản chất** · không tiên đoán nghề nghiệp · không so sánh với trẻ
    khác · không gắn với học lực.
  - (b) Người dùng đọc 33 câu, **chỉ ra được ít nhất một câu mình sẽ thật sự hỏi con tối
    nay**. Nếu không có câu nào như thế thì viết lại — đây là thứ quyết định tấm ảnh có
    được chia sẻ hay không.
  - (c) `tests/dien-giai.test.ts` (mở rộng) — đủ 11 khoá, mỗi khoá đúng 3 câu, không câu nào
    rỗng.
  - (d) 0,5 ngày.

- [x] **4.4 — Ráp tấm ảnh PNG thật** ✅ (27/08/2026 — trình duyệt thật: làm trọn bài → bấm Tải ảnh → nhận file PNG 1080×1350, chữ Việt đủ dấu, "3 câu để hỏi con tối nay" trên cùng)
  - (a) Nối `veTamAnh` (đã dựng ở 1.1) vào dữ liệu kết quả thật. **Bố cục đảo so với bản
    BA doc**: trên cùng *"3 câu để hỏi con tối nay"* + 3 câu; giữa là nhân vật + 4 cột;
    dưới cùng logo SATA ROBO. Lý do đảo: phụ huynh không chia sẻ thứ dán nhãn con mình, họ
    chia sẻ thứ khiến họ trông như một người cha mẹ tinh tế.
  - (b) **Nửa sau DEMO của GĐ4** — xem đầu giai đoạn. Thử thêm trên điện thoại: gửi tấm ảnh
    qua Zalo cho chính mình, mở ra xem còn đọc được không.
  - (c) `tests/xuat-anh.test.ts` (mở rộng) — hàm dựng dữ liệu vẽ trả về đủ 3 câu hỏi + 4
    điểm + tên nhân vật, không trường nào `undefined`.
  - (d) 0,5 ngày.

- [x] **4.5 — In ra PDF** ✅ (27/08/2026 — chụp ở chế độ media:print: thanh bên và nút bấm ẩn, màu biểu đồ vẫn in, không cắt chữ; xuất PDF A4 36KB)
  - (a) Viết `modules/report/xuat-pdf.ts` dùng `window.print()` + stylesheet
    `@media print` trong `app/globals.css`. **Không thêm thư viện PDF** (R2).
  - (b) Bấm **Tải PDF** → hộp in hiện ra → lưu thành PDF → mở file: không mất chữ, không
    tràn trang, thanh bên và các nút **không** bị in ra.
  - (c) (kiểm bằng mắt — không có test tự động cho bản in.)
  - (d) 0,5 ngày.

---

## GIAI ĐOẠN 5 — Vùng lệch con ↔ cha mẹ (ước lượng: 2,5 ngày)

> **Đây là sản phẩm.** Ba bộ đề đầu ngoài kia có hàng chục trang làm miễn phí rồi. Bộ đối
> chiếu thì gần như không ai làm, và nó có cơ sở học thuật thật (`DISC_BA.md` §8.1).

**🏁 DEMO kết thúc GĐ5:** làm trọn bài **THCS** cho biệt danh **"Bi"** → ngay sau kết quả
hiện nút **"Đến lượt bố mẹ — 16 câu, khoảng 4 phút"** → bấm vào, thấy **biệt danh "Bi" đã
điền sẵn**, làm nốt 16 câu → hiện **bảng đối chiếu 4 trục tô 3 màu**, **diễn giải đúng 2
trục lệch nhiều nhất** (không phải cả 4), và câu kết *"Lệch nhau không có nghĩa là ai đó
sai…"*. Nếu chỉ làm một trong hai bài → hiện **lời mời làm nốt bài kia**, không phải màn
hình rỗng.

- [x] **5.1 — IndexedDB + M6 "Bài đã làm" + sao lưu .zip** ✅ (27/08/2026 — 14 test lưu trữ + 8 test M6; DEMO 10 trong trình duyệt thật: làm 3 bài khác bộ đề → zip tải về có ĐỦ 3 bộ PH/QS/THCS)
  - (a) Viết `modules/core/luu-tru/`: IndexedDB cho bài đã xong, localStorage cho nháp,
    xuất `.zip` bằng `jszip`. Viết `app/khoang/lich-su.tsx` (M6): liệt kê, mở lại, xoá từng
    bài, **xoá sạch có hỏi lại**. 🔴 **Nút sao lưu phải đọc THẲNG IndexedDB**, không đọc
    danh sách đang lọc trên màn hình — bẫy này đã cắn dự án TAO_ANH ngày 24/08: người dùng
    bấm Sao lưu ở một khoang, nhận file trông như đủ, xoá dữ liệu duyệt web, rồi mất sạch
    phần kia.
  - (b) Làm 3 bài khác bộ đề (THCS, PH, QS) → M6 thấy đủ 3 dòng. Bấm **Sao lưu .zip**, giải
    nén → **đủ 3 file JSON**, không thiếu bài nào.
  - (c) `tests/luu-tru.test.ts` — **sao lưu lấy đủ mọi bộ đề, không chỉ bộ đang mở** · xoá
    một bài không đụng bài khác · JSZip nhận `"uint8array"` chứ không nhận `Blob` khi chạy
    ngoài trình duyệt.
  - (d) 1 ngày.

- [x] **5.2 — Chế độ máy dùng chung** ✅ (27/08/2026 — nút “Kết thúc & xoá bài này khỏi máy” ở cuối M4 + cảnh báo khi quá 3 biệt danh, có test biên đúng-3-thì-chưa-nhắc)
  - (a) Thêm nút **"Kết thúc & xoá bài này khỏi máy"** ở cuối màn kết quả, và cảnh báo ở M6
    khi phát hiện **> 3 biệt danh khác nhau** trên cùng máy. Lý do: kênh phân phối "giáo
    viên đưa tận tay" khiến nhiều gia đình làm nối tiếp trên cùng một máy — vừa lộ dữ liệu
    chéo, vừa ghép cặp vùng lệch **sai người**.
  - (b) Làm 4 bài với 4 biệt danh khác nhau → M6 hiện dải cảnh báo. Bấm "Kết thúc & xoá bài
    này" ở một bài → bài đó biến mất khỏi M6, **3 bài kia còn nguyên**.
  - (c) `tests/may-dung-chung.test.ts` — đếm đúng số biệt danh riêng biệt · xoá một bài
    không đụng bài khác.
  - (d) 0,25 ngày.

- [x] **5.3 🔴 — M5 vùng lệch** ✅ (27/08/2026 — 25 test lõi + 10 test giao diện; trình duyệt thật: bảng 4 trục 3 màu, diễn giải đúng 2 trục lệch lớn nhất, câu kết bắt buộc có mặt)
  - (a) Viết `modules/report/doi-chieu.ts` (hàm thuần): ghép cặp theo `maTre` **và** cùng
    `phienBanBoDe` **và** hai bài cách nhau ≤ **60 ngày**. Tính `lech(truc) = diemCon −
    diemBoMe` trên thang 0–100 có dấu. Tô 3 mức: `≤10` Trùng khớp xanh `#2E9E6B` ·
    `10<|lech|≤25` Hơi khác cam `#FF8F2D` · `>25` Khác rõ tím `#610B8A`. 🔴 **Chỉ diễn giải
    tối đa HAI trục lệch lớn nhất** — diễn giải cả bốn là bắt phụ huynh đọc một bài luận và
    không nhớ được gì. Tám văn bản diễn giải đọc từ `config/disc-doi-chieu.ts`. Câu kết bắt
    buộc hiện ở cuối. Chưa đủ điều kiện ⇒ **lời mời cụ thể**, không phải màn hình rỗng.
  - (b) **Chính là DEMO của GĐ5** — xem đầu giai đoạn.
  - (c) `tests/doi-chieu.test.ts` — lệch **đúng bằng 10** và **đúng bằng 25** rơi vào đúng
    nhãn (kiểm biên) · chỉ diễn giải 2 trục dù cả 4 đều lệch · khác `phienBanBoDe` thì
    **từ chối ghép** · cách nhau 61 ngày thì từ chối, 60 ngày thì nhận.
  - (d) 1 ngày.

- [x] **5.4 — Chuyền tay chủ động** ✅ (27/08/2026 — trình duyệt thật: con làm xong THCS → hiện “Còn thiếu bài của bố mẹ, 16 câu (khoảng 4–5 phút)” → bấm → biệt danh “Bi” ĐIỀN SẴN)
  - (a) Ngay sau màn kết quả của bài con (TH/THCS), hiện nút **"Đến lượt bố mẹ — 16 câu,
    khoảng 4 phút"**; bấm vào đi thẳng vào bộ QS với **biệt danh đã điền sẵn**. Lý do: vùng
    lệch ghép cặp trong IndexedDB **cùng một trình duyệt**; nếu để phụ huynh tự đi tìm màn
    M5 thì mũi nhọn sản phẩm không bao giờ bật lên — và **không có gì báo đỏ**.
  - (b) Nằm trong DEMO của GĐ5 — xem đầu giai đoạn.
  - (c) `tests/chuyen-tay.test.ts` — bài MN/PH/QS **không** hiện nút này (chỉ TH và THCS) ·
    biệt danh truyền sang đúng, không bị mất dấu tiếng Việt.
  - (d) 0,25 ngày.

---

## GIAI ĐOẠN 6 — Thu liên hệ + đo phễu (ước lượng: 1 ngày)

**🏁 DEMO kết thúc GĐ6:** mở app bằng `localhost:3000/?nguon=lop-3a`, làm trọn một bài, để
lại số điện thoại → mở tab **Console** của DevTools: thấy 4 mốc `mở / bắt đầu / xong / để
lại số` đều mang nhãn `lop-3a`. Mở tab **Application → Local Storage** xem bản ghi liên hệ:
**chỉ có số điện thoại và biệt danh — KHÔNG có câu trả lời, KHÔNG có điểm số.**

- [x] **6.1 — Ô để lại liên hệ + điểm cắm cho đội dev** ✅ (27/08/2026 — trình duyệt thật: bỏ qua ô vẫn xem và tải được trọn kết quả; số sai bị chặn; chưa tick đồng ý bị chặn)
  - (a) Viết `modules/core/lien-he/`: hàm `onGuiLienHe(payload)` là **một điểm cắm duy
    nhất**, bản mặc định lưu `localStorage` + mở link Zalo. Ô nhập ở cuối màn kết quả:
    **không bắt buộc, không chặn xem kết quả**, có ô đồng ý rõ ràng. Đội dev nối vào backend
    của họ bằng đúng một hàm (ADR-001).
  - (b) Xem xong kết quả → thấy ô "Để lại số để SATA ROBO tư vấn thêm". **Bỏ qua không điền
    → vẫn xem được trọn báo cáo, vẫn tải được ảnh.** Điền số rồi bấm gửi → hiện lời cảm ơn
    và nút mở Zalo.
  - (c) `tests/lien-he.test.ts` — bỏ trống không chặn xem kết quả · số điện thoại sai định
    dạng bị từ chối tại chỗ · chưa tick ô đồng ý thì nút gửi không hoạt động.
  - (d) 0,5 ngày.

- [x] **6.2 🔴 — Hàng rào: payload liên hệ không được chứa dữ liệu trẻ** ✅ (27/08/2026 — 9 test + DEMO 13 soi thẳng localStorage: payload đúng 4 trường, không có traLoi/ketQua/diem/maTre/boDe)
  - (a) Viết `tests/lien-he-sach.test.ts`: dựng một `BaiLam` đầy đủ, gọi hàm tạo payload,
    khẳng định object trả về **không có khoá** `traLoi`, `ketQua`, `diem`, `xepHang` ở bất
    kỳ độ sâu nào. Số điện thoại phụ huynh **cộng** kết quả DISC của con nằm cạnh nhau là
    một hồ sơ cá nhân theo NĐ 13/2023. Đây là **cái chốt giữ lớp phòng vệ pháp lý** của cả
    dự án — nó vỡ ngay khi ai đó "chỉ thêm chút dữ liệu cho tiện".
  - (b) Người dùng tự tay thêm `diem: ketQua.diem` vào object payload trong
    `modules/core/lien-he/`, chạy `npm run kiem` → **phải ĐỎ**. Hoàn tác → xanh.
  - (c) `tests/lien-he-sach.test.ts`.
  - (d) 0,25 ngày.

- [x] **6.3 — Đếm bốn mốc phễu** ✅ (27/08/2026 — 13 test + DEMO 15: bốn mốc mo/batDau/xong/deLaiSo đều mang nguon=lop-3a, không mốc nào chứa câu trả lời)
  - (a) Viết `modules/core/do-phieu/`: đúng **4 bộ đếm** — `mo`, `batDau`, `xong`,
    `deLaiSo` — kèm tham số `?nguon=` đọc từ URL để phân biệt 3 kênh (Fanpage / giáo viên /
    QR sự kiện). Mặc định ghi `localStorage`, để hở điểm cắm `onGhiMoc` cho đội dev nối.
    🔴 **Không đếm câu trả lời, không đếm điểm số** — nên không đụng R1.
  - (b) **Chính là DEMO của GĐ6** — xem đầu giai đoạn.
  - (c) `tests/do-phieu.test.ts` — 4 mốc ghi đúng thứ tự · `?nguon=` lạ hoặc thiếu thì rơi
    về `"truc-tiep"`, không làm nổ trang · **bản ghi mốc không chứa khoá `traLoi` hay
    `diem`**.
  - (d) 0,25 ngày.

---

## GIAI ĐOẠN 7 — Ngoại tuyến + tiếp cận (ước lượng: 1,5 ngày)

**🏁 DEMO kết thúc GĐ7:** mở app, **ngắt mạng hoàn toàn** (bật chế độ máy bay) → vẫn làm
được trọn một bài và vẫn xem được kết quả. Rồi cắm mạng lại, làm **trọn một bài khác chỉ
bằng bàn phím** — không chạm chuột một lần nào.

- [x] **7.1 — Chạy được khi mất mạng** ✅ (27/08/2026 — 11 test; bản production ngắt mạng thật: trang lên VÀ làm được bài; DEMO 12 xanh — không request nào mang câu trả lời)
  - (a) Viết `public/sw.js` tối giản cache app shell (**không thêm thư viện**). 🔴 Tách
    thành file riêng **ngoài hai tầng**, và ghi rõ trong tài liệu bàn giao rằng đây là thứ
    **toàn-app**, không thuộc module DISC — đội dev nên bỏ nếu app của họ đã có service
    worker riêng. Nhét service worker vào gói bàn giao mà không nói gì là gài mìn.
  - (b) **Nửa đầu DEMO của GĐ7** — xem đầu giai đoạn.
  - (c) `tests/ngoai-tuyen.test.ts` — danh sách file cache khớp danh sách file thật sinh ra
    sau `npm run build`, không trỏ vào file không tồn tại.
  - (d) 0,75 ngày.

- [x] **7.2 — Rà tiếp cận + thử trên điện thoại thật** ✅ (27/08/2026 — bộ soát tự động: 0 lỗi tương phản, 0 vùng bấm < 44px, làm TRỌN bài chỉ bằng bàn phím; `npm run lint` sạch. ⚠️ phần **điện thoại thật** CHƯA làm — máy không cầm được điện thoại, cần chủ dự án bấm thử)
  - (a) Rà toàn bộ: tương phản chữ/nền ≥ **4,5:1** · điều hướng được bằng bàn phím ·
    `aria-current` cho mục đang mở · vùng bấm ≥ **44×44px** · nút trả lời là `<button>`
    thật chứ không phải `<div onClick>`. Với dự án này đây không phải yêu cầu trang trí —
    **người bấm là trẻ 8 tuổi và phụ huynh cầm điện thoại một tay**.
  - (b) **Nửa sau DEMO của GĐ7** + làm trọn một bài trên **điện thoại thật** (không phải
    chế độ giả lập của trình duyệt): không phải phóng to để bấm, không có nút nào chạm
    nhầm sang nút bên cạnh.
  - (c) `npm run lint` sạch, không cảnh báo.
  - (d) 0,75 ngày.

---

## GIAI ĐOẠN 8 — Gói bàn giao (ước lượng: 1,5 ngày)

> Đây là **lý do dự án tồn tại**. Nếu tài liệu này viết dở, đội dev đọc không hiểu, họ viết
> lại từ đầu, và 18,5 ngày công thành một bản mô tả yêu cầu.

**🏁 DEMO kết thúc GĐ8:** đưa file `docs/ban-giao/HUONG-DAN-CAM-VAO-APP.md` cho **một người
chưa từng nghe về dự án này**, cho họ 10 phút → họ **chỉ ra được đúng 3 nhóm file cần
copy** và **đúng một dòng cần thêm vào thanh bên**, mà không hỏi lại câu nào.

- [x] **8.1 — Hướng dẫn cắm vào app của đội dev** ✅ (27/08/2026 — `docs/ban-giao/HUONG-DAN-CAM-VAO-APP.md`: 3 nhóm file cần copy ở mục 1, một dòng thêm vào thanh bên ở mục 3, hợp đồng `onGuiLienHe`/`onGhiMoc` ở mục 4, kèm 4 bản ADR được trỏ tới)
  - (a) Viết `docs/ban-giao/HUONG-DAN-CAM-VAO-APP.md`: **hai tầng rõ ràng** — tầng lõi
    (`config/disc-*.ts`, `modules/core/bo-de/`, `modules/report/cham.ts|kiem-hop-le.ts|
    doi-chieu.ts`) bê nguyên sang stack nào cũng chạy; tầng giao diện tham chiếu
    (`app/**`, `modules/test/**`) có thể viết lại theo quy ước của họ. Một dòng cần thêm
    vào thanh bên. Hợp đồng `onGuiLienHe` và `onGhiMoc` kèm ví dụ nối backend. Danh sách
    thứ có thể bỏ (service worker, trang `/thu-ve-anh`, `/thu-cham`).
    🔴 Hai dòng **in đậm** bắt buộc có: *"Payload liên hệ không bao giờ được chứa dữ liệu
    của trẻ"* và *"Mấy bài test này là một phần của sản phẩm — xoá là hỏng sản phẩm"*.
  - (b) **Chính là DEMO của GĐ8** — xem đầu giai đoạn.
  - (c) (tài liệu — không có test tự động.)
  - (d) 0,75 ngày.

- [x] **8.2 — OVERVIEW từng module + manifest thật** ✅ (27/08/2026 — 3 OVERVIEW viết lại theo thực tế (bản cũ còn nhắc Supabase, lỗi thời từ ADR-001) + manifest có entities thật; 9 test canh, gồm test bắt rule semgrep mồ côi)
  - (a) Viết `modules/core/OVERVIEW.md`, `modules/test/OVERVIEW.md`,
    `modules/report/OVERVIEW.md` (mục 1–4: module này làm gì · dùng ra sao · phụ thuộc gì ·
    cạm bẫy đã trả giá). Điền `module.config.json` của cả 3 module bằng dữ liệu **thật**
    (`entities`, `dependencies`, `eventsPublished`, `eventsConsumed`) thay cho mảng rỗng
    đang có.
  - (b) Mở 3 file `OVERVIEW.md`, mỗi file đọc mục 1 trong 30 giây và **nói lại được module
    đó làm gì** bằng một câu.
  - (c) `tests/manifest.test.ts` — `dependencies` của `test` và `report` **chỉ chứa
    `"core"`** (R6) · mọi module có `module.config.json` hợp lệ, không mảng rỗng.
  - (d) 0,5 ngày.

- [x] **8.3 — Bộ cổng cuối + dọn trang tạm** ✅ (27/08/2026 — `npm run kiem` = typecheck + lint + test + cấu trúc + semgrep, exit 0; 2 trang tạm đã gỡ và bản dựng còn đúng 1 route; scaffold.json cập nhật 19 thư mục/45 file; CI `.github/workflows/kiem.yml` chạy trên mỗi push)
  - (a) Hoàn thiện `npm run kiem` = typecheck + Vitest + `check-structure` + semgrep +
    hàng rào hai tầng (0.5). **Gỡ hai trang tạm** `app/thu-ve-anh/` và `app/thu-cham/`.
    Cập nhật `.claude/scaffold.json` cho khớp cây thư mục thật. Thêm CI GitHub Actions chạy
    `npm run kiem` trên mỗi push — *để người sửa `config/` trên GitHub web biết ngay khi gõ
    sai một dấu phẩy, thay vì biết lúc deploy.*
  - (b) Chạy `npm run kiem` → **xanh toàn bộ**. Mở `localhost:3000/thu-cham` →
    **404**, trang tạm đã gỡ. Đẩy một commit lên GitHub → tab Actions hiện dấu ✅ xanh.
  - (c) `npm run kiem` chính nó.
  - (d) 0,25 ngày.

---

## GIAI ĐOẠN 9 — Làm sâu bản báo cáo (ước lượng: 7,5 ngày · 27/08/2026)

> **Vì sao có giai đoạn này.** Chủ dự án chạy thử bản production và chê bản báo cáo
> *"phân tích khá sơ sài, chưa chạm đến cảm xúc của phụ huynh"*. Đo trên mã thật thì lời
> chê có căn cứ kỹ thuật: `layDienGiai(kieu, maBoDe)` **không nhận `diem`**, nên hai hồ sơ
> D=92 và D=58 ra báo cáo giống nhau **từng byte**; diễn giải làm theo KIỂU nên chỉ trục
> trội có chữ còn ba trục kia — nhất là trục thấp nhất — không một dòng nào, dù biểu đồ
> vẫn hiện đủ bốn cột kèm số.
>
> 🔴 **Phần lớn GĐ9 là TRẢ NỢ, không phải mở rộng phạm vi.** Đặc tả §9.2 luật 2 ghi
> *"Mỗi trục nêu CẢ mặt mạnh LẪN mặt cần để ý. Không có ngoại lệ"* và DEMO #5 đòi *"mỗi
> trục có ít nhất một dòng chỗ cần để ý"*. Hạng mục `4.2` đã tick ✅ ở GĐ4 **nhưng nghiệm
> thu bằng tiêu chí sai** — test chỉ kiểm 11 KIỂU, không kiểm 4 TRỤC.
>
> **Bốn quyết định đã chốt với chủ dự án trước khi code:** bóc lớp dần (màn hình ngắn, bản
> in đầy đủ) · khung "linh hoạt tình huống" chứ không phải "nâng trục thấp" · được nói CÁCH
> học, cấm ĐOÁN năng lực · thêm đầu vào không tốn thao tác.

- [x] **9.1 — Dữ liệu mẫu tám hồ sơ** ✅ (27/08/2026)
  - (a) `tests/DATA_TEST/` tự chứa: generator, 8 bản ghi JSON, bộ nạp/xoá qua DevTools,
    README. Xoá cả thư mục không ảnh hưởng gì — không file nào ngoài nó trỏ vào.
  - (b) Dán `nap-vao-trinh-duyet.js` vào Console → màn *Bài đã làm* hiện đủ 8 bài.
  - (c) `ketQua` do chính `cham()` tính, không gõ tay ⇒ đổi ngưỡng là mẫu tự đúng theo.
  - (d) 0,5 ngày.

- [x] **9.2 — Hàng rào riêng tư đi trước, rồi mới thêm trường** ✅ (27/08/2026)
  - (a) `tuoi`/`banKhoan` vào `BaiLamLuu` + `KHOA_CAM`; nối `lop`/`tuoi` từ màn 1 vào bản ghi
    (trường `lop` khai từ GĐ0 mà **chưa từng có nơi nào ghi**).
  - (b) Làm bài bộ QS chọn tuổi 13 → bản ghi có `tuoi: 13`; bộ THCS **không** bịa tuổi.
  - (c) `tests/lien-he-sach.test.ts` thêm hàng rào **biên dịch** `Record<keyof BaiLamLuu, …>`
    — quên khai trường mới là typecheck ĐỎ, không còn im lặng lọt. `tests/luu-boi-canh.test.tsx`.
  - (d) 0,5 ngày.

- [x] **9.3 — Ngưỡng cường độ + vị trí trục** ✅ (27/08/2026)
  - (a) `NGUONG_NOI_RO` + `modules/report/muc-do.ts` (`viTriTrongHoSo`, `noiRo`).
  - (b) Hồ sơ nổi rõ được thêm một câu; hồ sơ chưa đủ nổi thì im lặng.
  - (c) `tests/muc-do.test.ts` — chạy đủ 24 câu × 2 chiều: nhích một nấc **không** xoay
    được trục nổi nhất/nhẹ nhất.
  - (d) 0,5 ngày.

- [x] **9.4 — Viết nội dung theo TRỤC và theo LỨA TUỔI** ✅ (27/08/2026)
  - (a) `config/disc-bieu-hien.ts` + `config/disc-loi-khuyen.ts`: biểu hiện 4 trục × 4 lứa ·
    mạnh/cần để ý/khi nhẹ · 12 cặp pha có thứ tự · lời khuyên cho người lớn · bản tự đọc ·
    5 thẻ băn khoăn · 8 khối lệch phong cách.
  - (b) Bé 3 tuổi và học sinh lớp 9 đọc hai bản khác nhau, không còn chung một đoạn.
  - (c) `tests/noi-dung-moi.test.ts` (194 test) — nối hàng rào §9.2 sang MỌI hằng mới.
  - (d) 2,5 ngày.

- [x] **9.5 — Hàm ghép bản đầy đủ** ✅ (27/08/2026)
  - (a) `layDienGiaiDay()` nhận `diem` + lứa tuổi + băn khoăn. `layDienGiai()` **giữ nguyên
    chữ ký** làm vỏ mỏng — không đụng 9 điểm gọi trong test cũ.
  - (b) Hai hồ sơ cùng thứ hạng khác cường độ ra hai bản khác nhau; đủ 4 trục đều có chữ.
  - (c) `tests/dien-giai-day.test.ts` — cả ba lỗi gốc đều có test hồi quy riêng.
  - (d) 1 ngày.

- [x] **9.6 — Bóc lớp dần + bản in** ✅ (27/08/2026)
  - (a) `app/khoang/lop-sau.tsx`. Nội dung LUÔN trong DOM, ẩn bằng CSS; bản in ép mở hết.
  - (b) Đo bằng Chromium thật: màn hình 0/5 lớp mở · bản in **5/5** lớp mở · bản in có
    tầng lời khuyên · 5 tiêu đề chỉ-in hiện ra · **0** nút bấm lọt vào giấy · PDF 3 trang.
  - (c) `tests/ban-in.test.ts` — đã thử phá luật `section` để chắc test fail được thật.
  - (d) 1 ngày.

- [x] **9.7 — Băn khoăn + so sánh phong cách bố mẹ ↔ con** ✅ (27/08/2026)
  - (a) Ô chọn 1 chạm đặt SAU kết quả (không chèn giữa M1→M2);
    `modules/report/doi-chieu-phong-cach.ts` — **khác** `doiChieu()` vốn so hai góc nhìn.
  - (b) Mở mẫu 04 (QS · Tí Nị) khi máy đã có mẫu 05 (PH · Mẹ Bống) → hiện bảng lệch 4 trục
    + 2 đoạn diễn giải. Chưa có bài PH thì hiện lời mời làm.
  - (c) `tests/doi-chieu-phong-cach.test.ts` (13 test).
  - (d) 1,5 ngày.

- [x] **9.8 — Hồ sơ ký duyệt** ✅ (27/08/2026)
  - (a) `scripts/xuat-noi-dung-ky-duyet.mjs` → `docs/noi-dung-cho-ky-duyet.md` (10.060 từ):
    gom trọn chữ, **thay sẵn đại từ** theo từng bộ đề, xếp theo thứ tự người đọc gặp.
  - (b) Đưa file này cho người có chuyên môn đọc — họ không phải mở file `.ts` nào.
  - (c) Sinh lại được bất cứ lúc nào, không gõ tay nên không lạc hậu.
  - (d) 0,5 ngày.

---

## GIAI ĐOẠN 10 — Ba bản báo cáo + gỡ rối luồng vào (ước lượng: 10,5 ngày · 27/08/2026)

> **Vì sao có giai đoạn này.** Chủ dự án chạy thử GĐ9 và nêu bốn việc: không hiểu D-I-S-C là
> gì · không có gì tạo niềm tin trước khi đọc số · luồng vào rối và trùng lặp · thiếu phần
> áp dụng (*"sau mỗi lần test sẽ có 3 bản: cho con, cho bố mẹ, và bản kết hợp"*).
>
> Khảo sát tìm ra **bốn lỗi im lặng** chưa ai biết: mời con 8–10 tuổi làm sai bộ đề · câu rào
> gọi một em lớp 4 là "con" · học sinh THCS đọc được khối viết cho bố mẹ · bộ PH mời chính
> người vừa làm xong đi làm lại. Không lỗi nào làm test đỏ, không lỗi nào làm trang vỡ.
>
> Và **một tiền đề phải sửa**: bản kết hợp cần HAI bài (hồ sơ con + bài bộ PH của bố mẹ), nên
> sau bài đầu tiên nó tồn tại dưới dạng LỜI MỜI chứ không phải ô trống.
>
> **Sáu quyết định đã chốt:** luồng vào hai nhánh · ba dải luôn hiện · từ tiếng Anh nằm trong
> khối tra cứu riêng (đặc tả: *"trẻ dưới 12 tuổi không đọc nổi Dominance"*) · đoạn mở đầu
> thành thật về giới hạn · hai gói ký duyệt tách rời · hai chặng, duyệt giữa chặng.

- [x] **10.1 — Lưới an toàn cho màn kết quả** ✅ (27/08/2026)
  - (a) `tests/m4-ket-qua.test.tsx` — trước đó **0 test nào render `ManKetQua`**, màn quan
    trọng nhất sản phẩm đang không có gì đỡ trong khi sắp bị tách ba bản.
  - (b) Chốt: nhánh bị chặn không rò lời khuyên · đủ 4 cột · số lớp theo bộ đề · lớp đóng sẵn.
  - (c) 23 test. (d) 0,5 ngày.

- [x] **10.2 — Bốn lỗi sai người đọc / sai định tuyến** ✅ (27/08/2026)
  - (a) `boDeConTuLam(tuoi)` + `TUOI_VAO_THCS` lên `config/` · câu rào tách hai bản theo người
    đọc · khối so phong cách lọc bộ đề · bộ PH hết tự mời chính mình.
  - (b) Đã soi trên Chromium thật: con 9 tuổi được mời bộ **Tiểu học**; bộ TH hiện *"để em
    hiểu mình hơn"*; học sinh không còn đọc được phần của bố mẹ; bộ PH hết lời mời thừa.
  - (c) `tests/bon-loi-nguoi-doc.test.tsx` — 17 test, mỗi lỗi một cụm. (d) 0,5 ngày.

- [x] **10.3 — Trục xoay: đại từ hai chiều** ✅ (27/08/2026)
  - (a) `CHU_THE[maBoDe][banDoc]` thay cho bảng một chiều; `layDienGiaiDay` trả
    `banCon` / `banBoMe` / `banTuMinh` thay cho `loiKhuyen`/`tuMinh` phẳng.
  - (b) 🔴 **Giá trị lớn nhất, hơi ngoài dự kiến:** phụ huynh của học sinh TH/THCS trước đây
    **không nhận được gì cả** — hai bộ đó bị chặn khỏi toàn bộ `LOI_KHUYEN`. Nay họ nhận trọn
    8 trường, gọi đúng "con", trong khi em học sinh vẫn đọc bản của mình gọi "em".
  - (c) `tests/dien-giai-day.test.ts` chỉnh hướng (không xoá): canh "tách đúng người đọc" thay
    cho "chặn". (d) 1 ngày.

- [x] **10.5 — Tóm tắt 30 giây · bảng tra D-I-S-C · đoạn mở đầu** ✅ (27/08/2026)
  - (a) `app/khoang/mo-dau.tsx` + `CHU_MO_DAU`/`CHU_BANG_TRA` + `tenTiengAnh`/`nghia`/`motDong`
    trong `TRUC`. Đoạn mở đầu **136 từ**, dựng quanh hai câu vốn đã viết mà **chưa bao giờ
    được render** (`CHU_DISC.tieuDe`/`.moTa`).
  - (b) Bấm thử: tóm tắt nêu đúng trục nổi nhất/nhẹ nhất + một việc làm ngay; bảng tra có đủ
    bốn từ tiếng Anh; nhãn biểu đồ **không** dính chữ tiếng Anh.
  - (c) `tests/mo-dau.test.tsx` — 13 test, gồm: ≤200 từ · cấm tuyên bố chuẩn hoá · cấm viết
    `DiSC` · tóm tắt dưới 60 từ. (d) 1 ngày.

- [x] **10.4 — Ba dải + in theo từng bản** ✅ (27/08/2026 — soi Chromium thật: tờ của em 2286 ký tự / tờ bố mẹ 3144 ký tự, **0 câu rò rỉ chéo**; dải bố mẹ ẩn trên màn nhưng vẫn 1248 ký tự trong DOM nên in được)
  - (a) Một trang, ba `<section data-ban>`; dải 2/3 đóng sẵn + dải chắn *"đưa máy cho bố mẹ"*;
    luật in tách bản.
  - (b) In bản con KHÔNG ra chữ của bản bố mẹ; trẻ cầm máy không cuộn tới phần của bố mẹ.
  - (c) Mở rộng `tests/ban-in.test.ts` — hiện nó **không** bắt được cơ chế ẩn mới.
  - (d) 1 ngày.

- [x] **10.6 — Sắp lại màn 1 thành hai nhánh** ✅ (27/08/2026 — M1 nay hỏi "Ai đang cầm máy?", 2 thẻ; lớp hỏi MỘT lần trải 1–9; bộ Mầm non không còn cửa trực tiếp; `dinhTuyen()` không đổi một dòng)
  - (a) *"Ai đang cầm máy?"* → học sinh / phụ huynh. Mỗi bộ đề đúng MỘT cửa, tuổi-lớp hỏi một
    lần. `dinhTuyen()` KHÔNG đổi nên `tests/dinh-tuyen.test.ts` vẫn xanh.
  - (b) Bộ Mầm non còn đúng một cửa; bộ Bố mẹ-nhìn-con có cửa riêng; sửa mâu thuẫn nhãn 3–5 ↔ 3–7.
  - (c) `m1-chon-doi-tuong.test.tsx` + `dieu-huong.test.tsx` sẽ đỏ — đặc tả đổi ⇒ sửa test,
    và cập nhật `DISC_BA.md` §5.2.
  - (d) 1 ngày.

- [x] **10.7 — CHẶNG 2: nội dung ba bản** ✅ (27/08/2026 — lời riêng cho con · góp ý cho bố mẹ
      về chính mình · thoả thuận hai chiều · cờ Gói B + hai hồ sơ ký duyệt)
  - (a) **1.934 từ mới** trên 24 đoạn (8 khoá `[trục][hướng lệch]` × 3 trường), KHÔNG phải ma
    trận 16 cặp. ⚠️ Dưới ước lượng 2.400–3.000 của bản kế hoạch — xem ghi chú bên dưới.
  - (b) ✅ Đo trên Chromium thật, một máy có cả bài bộ PH lẫn bài con: dải chung 2.598 ký tự ·
    dải con 1.036 · dải bố mẹ 2.696, và **0 câu ≥60 ký tự dùng chung ở cả ba cặp dải**.
    Ma trận ba bản không ô nào rỗng (`tests/ba-ban-noi-dung.test.ts`).
  - (c) `tests/ba-ban-noi-dung.test.ts` — 24 test: ma trận ba bản · không-trùng-câu · hai gói
    ký duyệt tách rời · `boMeTuNhin` không nhận xét đứa trẻ. (d) 5,5 ngày.

  > ⚠️ **VỀ CON SỐ 1.934 TỪ.** Ước lượng cũ ngầm giả định ~100 từ/đoạn; văn của sản phẩm này
  > vốn gọn hơn (`choBoMe` sẵn có trung bình 44 từ/đoạn), và bản viết ra trung bình 81 từ.
  > Đã rà lại một lượt để tìm chỗ thiếu THẬT chứ không lấp cho đủ số, và tìm được một thiếu
  > sót có thật: `boMeTuNhin` là khối DUY NHẤT trong cả sản phẩm chỉ nêu nhận định rồi dừng,
  > không kết bằng một việc làm được; `choCon` thì không cho đứa trẻ biết thế nào là có tác
  > dụng. Đã bổ sung đúng hai nhịp đó (1.491 → 1.934 từ). Phần chênh còn lại là do văn phong,
  > không phải do thiếu nội dung — nếu chủ dự án đọc thấy mỏng ở đâu thì nói, viết dày thêm
  > đúng chỗ đó rẻ hơn nhiều so với viết dày đều.

---

## 🏠 DISC GIA ĐÌNH — GĐ11 → GĐ14 (ước lượng: 28 ngày · chốt 27/08/2026)

> **Vì sao có bốn giai đoạn này.** Chủ dự án chạy thử GĐ10 và nêu bảy việc. Đọc kỹ thì chúng
> không phải bảy lỗi rời rạc — chúng là một sản phẩm khác: từ *"đo một đứa trẻ"* sang
> *"giúp một gia đình hiểu nhau"*. Mục tiêu kinh doanh: **giữ chân trong hơn 1.000 gia đình
> đang học**. Bản thiết kế đầy đủ: `~/.claude/plans/t-i-test-v-purrfect-star.md`.
>
> 🔴 **GIẢ ĐỊNH ĐANG ĐỠ GĐ14 (9,5 ngày):** *một phụ huynh sẽ triệu tập được từ hai thành
> viên trở lên cùng làm bài.* Giả định này hiện có **0 quan sát ủng hộ và 1 quan sát phản
> bác** — tính năng ghép 2 người đã có từ GĐ5 và **chưa lần nào tự kích hoạt ngoài đời**.
> Chủ dự án đã nghe phản biện và chọn xây trọn. Ghi lại đây để sau còn truy được.
>
> **Ba bảo hiểm đã cài:** GĐ11 phát cho 30 nhà ngay khi xong (ngày 5, không đợi hết gói) ·
> mốc đo `baiThuHai` làm sớm ở `11.6` · `13.1` mã mời gỡ trần "cả nhà một máy" **trước** GĐ14.
>
> **Hai việc NGƯỜI chạy song song, 0 ngày dev:** chốt nghi thức mời của trường (ai nói, ở
> đâu, lúc nào) · gọi 5 phụ huynh vừa nghỉ để biết lý do rời thật.

---

## GIAI ĐOẠN 11 — Gỡ khó chịu + giết rủi ro kỹ thuật sớm (ước lượng: 5 ngày)

> **Xong giai đoạn này là có thứ PHÁT ĐƯỢC cho 30 gia đình thật.** Không đợi GĐ14.

- [ ] 🔴 **11.1 — SPIKE: nhét một hồ sơ DISC vào mã QR**
  - (a) Chứng minh 4 điểm số + biệt danh + vai + mã bộ đề + ngày phát gói vừa một mã QR vẽ
    bằng Canvas 2D **không thêm thư viện nào**. File mới `modules/core/gia-dinh/ma-moi.ts`
    (tầng lõi, hàm thuần): `goiHoSo()` → chuỗi ~12 ký tự có kiểm tổng 2 ký tự, và `moHoSo()`
    giải ngược. Trang tạm `app/thu-ma-moi/page.tsx` để nhìn bằng mắt.
  - (b) Mở `/thu-ma-moi`, thấy một mã QR trên màn. **Lấy điện thoại quét nó** — điện thoại
    phải hiện ra đúng chuỗi mã. Gõ chuỗi đó vào ô bên dưới, bấm *Mở* → hiện lại đúng 4 con
    số ban đầu. Sửa một ký tự trong chuỗi → phải báo lỗi, không ra hồ sơ rác.
  - (c) `tests/ma-moi.test.ts` — gói/mở khứ hồi giữ nguyên điểm · kiểm tổng bắt lỗi 1 ký tự ·
    mã quá 7 ngày bị từ chối · **chuỗi mã KHÔNG chứa câu trả lời nào**.
  - (d) 0,5 ngày.
  - (e) chặn: MÁY.
  - 🔴 **LÀM ĐẦU TIÊN, TRƯỚC MỌI THỨ KHÁC.** Đây là thứ duy nhất trong cả gói chưa từng
    chứng minh chạy được, và nó gỡ trần *"cả nhà phải dùng chung một máy"* — cái trần quyết
    định GĐ14 có bao giờ được kích hoạt hay không. Hỏng ở đây thì GĐ13 và GĐ14 đổi hình dạng,
    và biết điều đó ở ngày 1 rẻ hơn biết ở ngày 18.

- [ ] **11.2 — Bỏ ô thu liên hệ**
  - (a) Xoá `app/components/o-lien-he.tsx` và `modules/core/lien-he/luu-tam.ts`; gỡ 3 chỗ ở
    `app/khoang/ket-qua.tsx` (import dòng 11, 13 và khối JSX ~266–272); gỡ `LIEN_HE_SATA` +
    `CHU_LIEN_HE` khỏi `config/disc-tu-dien.ts`. Gỡ mốc chết `deLaiSo` khỏi
    `modules/core/do-phieu/index.ts`.
    🔴 **GIỮ NGUYÊN** `modules/core/lien-he/kieu.ts` và `tests/lien-he-sach.test.ts` — đó là
    hàng rào biên dịch cấm dữ liệu trẻ lọt ra ngoài, và `tests/do-phieu.test.ts` đang dùng
    `timKhoaCam` từ đó. Xoá nhầm là gỡ mất một lớp phòng vệ.
  - (b) Làm trọn một bài, cuộn xuống hết màn kết quả: **không còn ô xin số điện thoại**, không
    còn nút *Gửi số cho SATA ROBO*. Các nút Tải ảnh / In / Làm bài khác vẫn còn nguyên.
  - (c) `tests/do-phieu.test.ts` sửa còn 3 mốc · `tests/lien-he-sach.test.ts` vẫn xanh nguyên ·
    `tests/m4-ket-qua.test.tsx` xanh.
  - (d) 0,5 ngày. — (e) chặn: MÁY.

- [ ] 🔴 **11.3 — Màn làm bài: 5 câu/màn, đánh số, có khung**
  - (a) `config/disc-cau-hoi.ts`: `cauMoiMan` → `5` cho MN và TH. Nới kiểu `1 | 5` →
    `number` ở `modules/core/bo-de/kieu.ts:50`. `app/khoang/lam-bai.tsx` (~147–174): mỗi câu
    thành **thẻ có khung** — viền 1px trung tính, **viền trái 3px tím thương hiệu**, số thứ
    tự **theo cả bài** (`11`, không phải `1` của trang) trong vòng tròn nhạt góc trái. Câu đã
    trả lời → viền trái đổi sang **cam**. Bộ TH giữ cỡ chữ ≥18px và nút ≥56px.
    🔴 Kèm bắt buộc: `PHIEN_BAN_BO_DE` "1.0"→"1.1" ở `config/disc-cau-hoi.ts:26`, chạy
    `node scripts/sinh-checksum.mjs`, và thêm dòng báo tử tế khi phát hiện nháp phiên bản cũ.
  - (b) Vào bài bộ **Tiểu học**: thấy **5 câu một màn**, mỗi câu có số thứ tự và khung riêng,
    **không còn dính vào nhau** như ảnh đã chụp. Chọn một câu → viền trái đổi màu cam. Bấm
    *Tiếp* khi còn câu trống → báo lỗi **và cuộn tới đúng câu còn thiếu**. Làm dở rồi tải lại
    trang → thấy dòng báo nháp cũ không dùng được nữa, không im lặng mất bài.
  - (c) `tests/m3-lam-bai.test.tsx` sửa số radiogroup mỗi màn · `tests/tien-trinh.test.ts` sửa
    số trang (TH 20 câu → 4 trang) · `tests/checksum.test.ts` xanh lại sau khi sinh checksum.
  - (d) 1,5 ngày.
  - (e) chặn: MÁY.
  - 🔴 **Rủi ro: đổi `cauMoiMan` HUỶ MỌI BÀI ĐANG LÀM DỞ** của người dùng, vì nó nằm trong
    checksum bộ đề (`modules/core/bo-de/bam.ts:37`). Hiện gần như chưa ai có bài dở nên **đây
    là thời điểm rẻ nhất để đổi** — sáu tháng nữa với 1.000 nhà thì đắt hơn nhiều.
  - 🔴 Đi ngược đặc tả §5.2 *"MN & TH: một câu một màn"*. Chủ dự án đã chốt lật luật này; phải
    viết `ADR-006` ghi rõ vì sao và cách giảm thiệt hại (giữ cỡ chữ + nút to cho bộ TH).

- [ ] **11.4 — Tách rõ bản của con và bản của bố mẹ**
  - (a) Chủ dự án nói *"hai bản in thấy thông tin giống nhau"*. Đo lại: hai tờ **không dùng
    chung câu nào**, nhưng **nhìn thì giống** vì cùng mở đầu bằng biểu đồ và bốn khối trục.
    Sửa để khác nhau **ngay dòng đầu**: `TenDai` ở `app/khoang/lop-sau.tsx` thành **tiêu đề
    trang thật sự** (không phải nhãn nhỏ) — *"Bin — bản của em"* vs *"Bin — phần dành cho bố
    mẹ"*; đảo thứ tự khối trong dải bố mẹ để **"một việc làm được ngay" lên đầu** thay vì cuối.
  - (b) Làm một bài bộ TH, bấm *In phần của em* rồi *In phần của bố mẹ*. Đặt hai tờ cạnh nhau:
    **dòng đầu tiên phải khác nhau**, và tờ bố mẹ mở đầu bằng việc làm được chứ không bằng
    biểu đồ. Đưa tờ của em cho một người lạ đọc — họ phải nói được ngay tờ này viết cho ai.
  - (c) `tests/ban-in.test.ts` mở rộng: hai dải có tiêu đề khác nhau · `tests/ba-dai.test.tsx`
    xanh nguyên · `tests/ba-ban-noi-dung.test.ts` giữ luật 0 câu trùng.
  - (d) 1 ngày. — (e) chặn: MÁY.

- [ ] **11.5 — Lớp 1–12 và "trên lớp 12"**
  - (a) `config/disc-nguong.ts`: `LOP_LON_NHAT` 9 → 12, thêm mục *"Trên lớp 12"*.
    `modules/test/dinh-tuyen.ts` thêm nhánh: **lớp 10–12 và trên 12 → bộ PH** (tự đánh giá,
    thang 5 mức, câu chữ người lớn), lứa nội dung dùng tầng `NGUOI_LON` sẵn có.
    🔴 **ADR-002 GIỮ NGUYÊN, không đụng:** lớp 1–2 vẫn ra bộ MN kèm hộp giải thích.
  - (b) Ở màn 1 chọn *Em học sinh* → thấy đủ **lớp 1 tới lớp 12** và một ô *Trên lớp 12*.
    Bấm lớp 11 → ra *Bộ đề: Phụ huynh*. Bấm lớp 1 → vẫn ra *Bộ đề: Mầm non* **kèm hộp giải
    thích màu tím** (đây là luật ADR-002, bấm thử để chắc nó chưa bị phá).
  - (c) `tests/dinh-tuyen.test.ts` mở rộng quét đủ 12 lớp + "trên 12" · `tests/m1-chon-doi-tuong.test.tsx` ·
    `tests/duong-m1.ts` cập nhật đường đi chung.
  - (d) 0,5 ngày. — (e) chặn: MÁY.

- [ ] **11.6 — Đo hành vi: mốc `baiThuHai`**
  - (a) `modules/core/do-phieu/index.ts` thêm 3 mốc: `themThanhVien` · **`baiThuHai`** ·
    `phanTichGiaDinh`. Màn mới `app/khoang/so-lieu.tsx` (chỉ đọc localStorage, **không gửi đi
    đâu**): máy này có mấy bài, mấy biệt danh khác nhau, đã đạt ≥2 bài chưa.
    Mốc `baiThuHai` ở GĐ11 định nghĩa là *"máy này đã lưu ≥2 bài với biệt danh khác nhau"* —
    đo được ngay mà chưa cần sổ gia đình.
  - (b) Làm 2 bài với 2 biệt danh khác nhau trên cùng máy, mở màn *Số liệu máy này* → thấy
    con số nhảy lên 1. Đây là **con số quan trọng nhất của cả gói** — nó chính là giả định
    đang đỡ GĐ14.
  - (c) `tests/do-phieu.test.ts` mở rộng 3 mốc mới · `tests/so-lieu.test.tsx` mới.
  - (d) 0,5 ngày. — (e) chặn: MÁY.
  - 🔴 Bộ đếm phễu đã có từ GĐ6 nhưng **không màn nào đọc nó** — chỉ test dùng. Không sửa
    chỗ này thì phát hành xong vẫn mù đúng như hôm nay.

- [ ] **11.7 — Ba ADR + sửa đặc tả cho khớp**
  - (a) Ba quyết định của GĐ11 lật luật cũ nên phải có ADR, nếu không sáu tháng nữa không ai
    truy được vì sao: `docs/decisions/ADR-005-cho-nhap-ten-that.md` (lật §10.2 — bối cảnh, cái
    giá, **bốn hàng rào vẫn giữ**) · `ADR-006-nam-cau-moi-man.md` (lật §5.2 — vì sao, và cách
    giảm thiệt hại cho bộ TH) · `ADR-007-don-vi-du-lieu-la-gia-dinh.md` (3 bảng, hạn mức, vì
    sao không tách bảng nối). Sửa `docs/BA/DISC_BA.md` §5.2 (sơ đồ màn hình: bảng gia đình
    thay wizard) · §9.2 (thêm luật **được nói KHÁC CÁCH, cấm nói AI HƠN AI**) · §10.1–10.2
    (lược đồ mới + hàng rào tên thật). Cập nhật `docs/ban-giao/HUONG-DAN-CAM-VAO-APP.md` và
    `modules/core/module.config.json` sau khi gỡ ô liên hệ.
  - (b) Mở `docs/decisions/` thấy đủ 7 ADR. Đọc `ADR-005` trong 2 phút phải trả lời được:
    *vì sao cho nhập tên thật, và cái gì vẫn được bảo vệ*. Mở `DISC_BA.md` §5.2 → sơ đồ đã là
    bảng gia đình, **không còn dòng "một câu một màn"**.
  - (c) `npm run check:structure` xanh (nó đếm ADR khai báo trong `.claude/scaffold.json`).
  - (d) 0,5 ngày. — (e) chặn: MÁY.

### 🎬 DEMO GĐ11 — chủ dự án tự bấm, ~10 phút
1. Vào bài bộ **Tiểu học**: 5 câu/màn, mỗi câu có số và khung, **không dính nhau**.
2. Bỏ trống một câu rồi bấm *Tiếp* → báo lỗi và **cuộn tới đúng câu thiếu**.
3. Cuộn hết màn kết quả → **không còn ô xin số điện thoại**.
4. In hai tờ → **dòng đầu khác nhau ngay**.
5. Màn 1 → chọn lớp 11 → ra bộ Phụ huynh; chọn lớp 1 → ra Mầm non **kèm hộp giải thích**.
6. Mở `/thu-ma-moi`, **lấy điện thoại quét mã QR** → ra đúng chuỗi mã.
7. Làm 2 bài 2 biệt danh → mở *Số liệu máy này* → thấy đếm.

🔴 **XONG BƯỚC NÀY LÀ PHÁT CHO 30 GIA ĐÌNH.** Không đợi GĐ14. Tới giữa GĐ12 đã có số thật.

---

## GIAI ĐOẠN 12 — Sổ gia đình (ước lượng: 9,5 ngày)

- [ ] 🔴 **12.1 — Lược đồ dữ liệu v2 + di trú không mất một bài nào**
  - (a) `modules/core/luu-tru/kho-bai.ts`: `PHIEN_BAN_KHO` 1 → 2. **Giữ nguyên bảng `bai-lam`**,
    thêm đúng một trường `maThanhVien?: string` (uuid) + index cùng tên. Hai bảng mới:
    `thanh-vien` (`{ id, ten, vaiTro, lop?, thuTu, ghiChu, taoLuc, suaLuc }` — **ghi chú nằm
    ngay trong bản ghi thành viên**, không bảng phụ) và `phan-tich-gia-dinh`.
    🔴 `onupgradeneeded` **CHỈ** tạo store + index. **KHÔNG ghi lại bài cũ trong transaction
    versionchange** — cursor rewrite cả bảng ở đó là chỗ mất dữ liệu kinh điển nếu abort.
    Gán bài cũ bằng **"nhận nuôi" lười** sau khi mở kho, transaction thường, chạy một lần, có
    mốc `daNhanNuoi`, idempotent: gom bài theo `maTre` ⇒ mỗi `maTre` thành một thành viên.
    🔴 `onblocked` hiện `giaiQuyet(null)` **im lặng** — phải trả mã lỗi riêng để giao diện nói
    *"Đóng các tab DISC khác rồi tải lại"*.
  - (b) **Trước khi sửa: làm 3 bài với 3 biệt danh, bấm *Sao lưu ra .zip* giữ lại.** Sau khi
    sửa, mở lại app → **cả 3 bài vẫn còn nguyên** trong màn *Bài đã làm*, và mỗi biệt danh cũ
    đã thành một thành viên trong sổ. Mở app ở 2 tab cùng lúc → tab cũ báo *"Đóng các tab
    khác"* chứ không im lặng hỏng.
  - (c) `tests/luu-tru.test.ts` mở rộng: di trú v1→v2 giữ đủ bài · nhận nuôi idempotent ·
    `tests/lien-he-sach.test.ts` thêm `maThanhVien` vào `PHAN_LOAI_TRUONG` (đỏ typecheck nếu
    quên) · `modules/core/lien-he/kieu.ts` `KHOA_CAM` thêm `maThanhVien`/`ten`/`ghiChu`.
  - (d) 2,5 ngày.
  - (e) chặn: MÁY.
  - 🔴 **Rủi ro cao nhất của cả gói: mất dữ liệu người dùng.** Làm sớm trong GĐ12, và làm khi
    số người dùng thật còn gần bằng 0 — đây là thời điểm rẻ nhất có thể.

- [ ] 🔴 **12.2 — Hạn mức 2 bài/người, không bao giờ xoá im lặng**
  - (a) File mới `modules/core/gia-dinh/han-muc.ts` (**tầng lõi, hàm thuần**):
    `chonBaiPhaiXoa(ds, gioiHan = 2)` và `chonThuMucPhaiXoa(ds, gioiHan = 5)` → trả **danh
    sách nạn nhân**. Thi hành ở tầng lưu trữ: `donBaiThanhVien()`. File mới
    `modules/core/luu-tru/tai-ve.ts`: `taiVeThuMucThanhVien()`.
    🔴 **KHÔNG đặt hạn mức trong `luuBai`** — `ghiBanKhoan` cũng gọi `luuBai`, và xoá im lặng
    bên trong hàm ghi đúng là cái bẫy cả repo đang cảnh báo. Chỉ chạy khi người dùng bấm
    *Bắt đầu bài mới* cho người đã có 2 bài. Quyết định nạn nhân **bên trong chính transaction
    readwrite** đã thi hành xoá. Thêm `BroadcastChannel("disc:kho")` cho tab kia nạp lại.
  - (b) Cho một thành viên làm **bài thứ 3**: phải hiện hộp thoại **nêu đích danh bài nào sắp
    mất** (ngày nào, kiểu gì) + nút **Tải xuống** + ô xác nhận. Bấm *Tải xuống* → có file về
    máy. Bấm huỷ → **bài cũ còn nguyên**. Xác nhận → còn đúng 2 bài mới nhất.
  - (c) `tests/han-muc.test.ts` mới (thuần, không cần trình duyệt): chọn đúng nạn nhân, giữ
    2 bài mới nhất, danh sách rỗng khi chưa đầy · `tests/luu-tru.test.ts` cho phần thi hành.
  - (d) 1,5 ngày. — (e) chặn: MÁY.

- [ ] **12.3 — Màn BẢNG GIA ĐÌNH (thay màn *Bài đã làm*)**
  - (a) File mới `app/khoang/bang-gia-dinh.tsx`. Bỏ khuôn wizard, dùng **một bảng**: thông
    điệp nhân văn trên cùng · lưới thẻ thành viên có sổ tiến độ `●●` và bốn cột mini · nút
    thêm/sửa/xoá người · khối *Phân tích cả nhà* (mờ cho tới GĐ14) · danh sách thư mục.
    🔴 `xoaThanhVien(id, cheDo)` **bắt buộc truyền chế độ, không mặc định**; giao diện mặc
    định `"giu-bai"` (bài rơi về *chưa xếp*) — xoá dây chuyền là đường mất dữ liệu nhanh nhất.
  - (b) Tạo nhà 4 người, đặt tên. Xoá một người → hỏi *"giữ bài hay xoá bài"*, chọn **giữ** →
    bài vẫn còn ở mục *chưa xếp*. Thêm lại người đó → xếp bài về được. Nhìn một cái biết ngay
    ai đã làm, ai chưa.
  - (c) `tests/bang-gia-dinh.test.tsx` mới: thêm/sửa/xoá thành viên · xoá giữ bài không mất
    bài · sổ tiến độ đúng số bài.
  - (d) 2,5 ngày. — (e) chặn: MÁY.

- [ ] **12.4 — Bấm *Làm bài* từ thẻ thành viên**
  - (a) `app/khoang/disc.tsx`: vào bài từ thẻ thành viên ⇒ **bỏ luôn màn hỏi biệt danh** (M2
    chỉ còn phần dặn dò), vì tên đã có ở sổ. `maThanhVien` đóng dấu vào bản ghi lúc lưu.
  - (b) Bấm *Làm bài* trên thẻ **Bin** → vào thẳng phần dặn dò rồi vào câu hỏi, **không bị hỏi
    tên lần nữa**. Xong bài → thẻ Bin hiện `●○ 1 bài`. **Đây là chỗ tiết kiệm thao tác lớn
    nhất của cả gói.**
  - (c) `tests/luu-boi-canh.test.tsx` mở rộng: `maThanhVien` phải vào bản ghi ·
    `tests/dieu-huong.test.tsx` cập nhật luồng.
  - (d) 1 ngày. — (e) chặn: MÁY.

- [ ] **12.5 — Chú giải DISC + khối trích dẫn**
  - (a) Mỗi trục bốn khối: *khi nhóm này đậm* · *cái giá đi kèm* · *khi nhóm này nhạt* (nêu
    cái ĐƯỢC trước) · **mượn cách của nhóm khác**. Khối thứ tư chính là "cân bằng" theo nghĩa
    **thêm một lựa chọn**, không phải **vá một chỗ hổng**. Cấm từ khuyết thiếu.
    Khối kết dẫn nguồn: mô hình DISC do W.M. Marston mô tả (1928) — Marston **không** tạo bài
    trắc nghiệm nào, bộ công cụ đầu tiên là của Walter Clarke (1956); bộ câu hỏi này **chưa
    chuẩn hoá trên dữ liệu người Việt**; chỉ để mở một cuộc trò chuyện.
    🔴 **CẤM:** con số tin cậy/hiệu lực cụ thể · "đã được khoa học chứng minh" · bất kỳ trích
    dẫn nghiên cứu nào không kiểm chứng được. Luật *KHÔNG LÀM* của dự án vẫn nguyên hiệu lực.
  - (b) Mở khối chú giải, đọc trục **Ổn định**: phải thấy cả mặt mạnh lẫn chỗ cần để ý, và một
    đoạn nói *khi nào nên mượn cách của nhóm khác*. Đọc khối kết: phải thấy câu *"chưa chuẩn
    hoá trên dữ liệu người Việt"*. **Tìm chữ "điểm yếu" trong cả trang — không được có.**
  - (c) `tests/noi-dung-moi.test.ts` mở rộng: cấm từ khuyết thiếu · cấm tuyên bố chuẩn hoá ·
    mỗi trục đủ bốn khối.
  - (d) 2 ngày. — (e) chặn: MÁY *(nhưng nội dung nên gửi người ký duyệt ngay khi viết xong)*.

- [ ] **12.6 — Thông điệp nhân văn trên bảng**
  - (a) Thêm vào `config/disc-tu-dien.ts`. Bản khuyến nghị: **"Không ai trong nhà sai. Chỉ là
    mỗi người quen một nhịp."** / *Làm cùng nhau, mỗi người mười phút.* Chân bảng, chữ nhỏ,
    một lần: *"Phần này miễn phí và không bán gì cả. Câu trả lời của cả nhà không rời khỏi
    máy này."*
    🔴 **Dùng "miễn phí cho gia đình đang học", KHÔNG dùng "phi lợi nhuận"** — mục tiêu là giữ
    chân khách đang trả tiền; đó là tiện ích miễn phí chính đáng nhưng không phải phi lợi nhuận.
    🔴 Thông điệp **chỉ xuất hiện ở bảng gia đình**. Rải vào màn kết quả và bản in là biến sự
    chân thành thành khẩu hiệu.
  - (b) Mở khoang DISC → thấy câu đó ngay dòng đầu, trước mọi thứ khác. Vào màn kết quả và bản
    in → **không thấy nó lặp lại**. Tìm chữ *"phi lợi nhuận"* trong cả app → không được có.
  - (c) `tests/thong-diep.test.tsx` mới: có ở bảng, vắng ở M4 và bản in, không có chuỗi
    "phi lợi nhuận" trong `config/`.
  - (d) 0,5 ngày. — (e) chặn: NGƯỜI — chủ dự án chọn 1 trong 3 bản nháp ở file thiết kế mục 4.

### 🎬 DEMO GĐ12 — ~15 phút
1. Tạo nhà 4 người: **Mẹ Lan · Bố Nam · Bin lớp 4 · Bống lớp 1**.
2. Bấm *Làm bài* trên thẻ **Bin** → **không bị hỏi tên**, vào thẳng bài.
3. Xong → thẻ Bin hiện `●○ 1 bài`. Nhìn bảng biết ngay ai chưa làm.
4. Cho Bin làm **bài thứ 3** → hộp thoại nêu đích danh bài sắp mất + nút *Tải xuống*.
5. Xoá **Bố Nam**, chọn *giữ bài* → bài vẫn còn ở mục *chưa xếp*.
6. Mở khối chú giải DISC → đọc trục Ổn định, thấy đủ bốn khối và câu *"chưa chuẩn hoá"*.
7. 🔴 **Kiểm di trú:** trước GĐ12 sao lưu .zip 3 bài; giờ mở lại → **cả 3 vẫn còn**.

---

## GIAI ĐOẠN 13 — Mã mời + so sánh 6 tháng (ước lượng: 4 ngày)

> Hai hạng mục này **cố ý xếp TRƯỚC GĐ14**. `13.1` gỡ trần "cả nhà một máy" — cái trần quyết
> định GĐ14 có bao giờ được kích hoạt hay không. Làm GĐ14 trước là xây tầng ba khi chưa biết
> cầu thang lên được tầng hai.

- [ ] 🔴 **13.1 — Mã mời / QR hoàn chỉnh**
  - (a) Dựng trên spike `11.1`. Làm bài xong → hiện **mã QR** (Canvas, không thêm thư viện)
    **và** chuỗi ~12 ký tự gõ tay được. Máy khác quét/gõ ⇒ tạo một thành viên trong sổ với hồ
    sơ đó, đánh dấu *"nhận qua mã mời"*.
    🔴 **Mã chỉ chứa ĐIỂM, tuyệt đối không chứa câu trả lời.** Câu trả lời của trẻ không bao
    giờ rời máy — mã mời không được phép làm lời hứa ADR-001 thành lời nói dối.
    Mã có **hạn 7 ngày**; kiểm tổng 2 ký tự.
  - (b) 🔴 **Dùng HAI máy thật.** Máy A làm bài của Mẹ → hiện QR. **Máy B quét QR đó** → sổ gia
    đình máy B có thêm thành viên *Mẹ* với đúng 4 con số. Thử cả đường gõ tay 12 ký tự. Gõ sai
    một chữ → **báo lỗi, không dựng hồ sơ rác**. Mở mã ra xem → **chỉ có điểm, không có câu
    trả lời nào**.
  - (c) `tests/ma-moi.test.ts` mở rộng: nhận mã tạo đúng thành viên · mã hết hạn bị từ chối ·
    mã cùng người hai lần không tạo trùng.
  - (d) 2 ngày. — (e) chặn: MÁY.

- [ ] **13.2 — So sánh 6 tháng: "Bin hồi tháng 3 ↔ Bin bây giờ"**
  - (a) Hai bài lưu sẵn của cùng một người chính là dữ liệu trước/sau. Dùng lại `mucLechTu()`
    và `NGUONG_VUNG_LECH` — **không toán mới**. Chỉ hiện khi hai bài cách nhau **≥ 90 ngày**
    (gần hơn thì chênh lệch là nhiễu đo, xem cạm bẫy *"phép đo quá thô"*).
    🔴 **Giọng văn:** cấm tuyệt đối *"đã tiến bộ"* / *"đã cải thiện"* — DISC không có chiều
    tốt/xấu nên **không có gì để tiến bộ**. Câu đúng: *"Sáu tháng trước Bin nghiêng về Ổn định
    rõ hơn. Giờ Chủ động lên gần bằng. Điều gì đã đổi ở lớp hay ở nhà?"* — mở một câu hỏi,
    không phát một bằng khen. Nhắc làm lại sau 6 tháng ngay trên bảng ⇒ **lý do quay lại**.
  - (b) Nạp hai bài của Bin cách nhau **100 ngày** → thẻ Bin hiện nút *Xem thay đổi*, bấm vào
    ra màn trước/sau. Nạp hai bài cách nhau **30 ngày** → **không** hiện nút đó. Đọc kỹ chữ:
    **tìm "tiến bộ" và "cải thiện" — không được có chữ nào.**
  - (c) `tests/so-sanh-thoi-gian.test.ts` mới: <90 ngày không trả kết quả · ≥90 ngày trả đúng
    trục lệch · văn bản không chứa từ đánh giá tốt/xấu.
  - (d) 2 ngày. — (e) chặn: MÁY.

### 🎬 DEMO GĐ13 — ~10 phút, **cần hai điện thoại**
1. Máy A: Mẹ làm bài → hiện QR. **Máy B quét** → sổ máy B có thành viên *Mẹ* đủ 4 số.
2. Gõ tay chuỗi 12 ký tự trên máy thứ ba → cũng ra đúng hồ sơ.
3. Sửa một ký tự → báo lỗi.
4. Nạp 2 bài của Bin cách 100 ngày → *Xem thay đổi* hiện ra; cách 30 ngày → không hiện.
5. Đọc màn thay đổi: **không có chữ "tiến bộ" nào.**

---

## GIAI ĐOẠN 14 — Phân tích cả gia đình (ước lượng: 9,5 ngày)

- [ ] 🔴 **14.1 — Đổi trục quy chiếu: từ VAI sang NGƯỜI ĐỌC**
  - (a) Thay `"bo-me-cao-hon" | "bo-me-thap-hon"` bằng `"toi-cao-hon" | "toi-thap-hon"`. Cùng
    một chỗ vênh: A đọc khoá `toi-cao-hon`, B đọc `toi-thap-hon` ⇒ **vẫn chỉ 8 khoá** phủ cả
    hai chiều mọi cặp. File mới `config/disc-lech-cap.ts`.
    🔴 **GIỮ NGUYÊN `LECH_PHONG_CACH` cho màn 1-1 cũ, dựng bảng mới cạnh nó — đừng sửa tại chỗ.**
  - (b) Màn *so phong cách* của bộ QS (2 người) phải chạy **y hệt như trước**, không đổi một
    chữ. Đây là bài kiểm hồi quy: đổi trục quy chiếu mà làm hỏng màn cũ là hỏng thứ đang chạy.
  - (c) `tests/doi-chieu-phong-cach.test.ts` xanh nguyên · `tests/ba-ban-noi-dung.test.ts` xanh.
  - (d) 1 ngày. — (e) chặn: MÁY.

- [ ] **14.2 — Engine phân tích N người**
  - (a) File mới `modules/report/phan-tich-gia-dinh.ts` (tầng lõi, hàm thuần). Cặp **có hướng**:
    N bản × (N−1) lát cắt, nhưng `lech` tính **một lần** cho cặp vô hướng rồi **soi gương**
    (`lech(B→A) = −lech(A→B)`). `soTrucTheoN`: N≤3 → 2 trục/cặp; **N≥4 → 1 trục/cặp** (nhà 5
    người mà 2 trục là 120 đoạn, không ai đọc hết). `soThanhVienToiDa = 6`.
    Trùng khớp cả 4 trục → trả khối `diemChung`, **không để trống**. N≤1 → union
    `{ phanTichDuoc: false, lyDo: "CHUA_DU_HAI_NGUOI" }`, chặn ở nút, **không sinh thư mục rỗng**.
  - (b) Nhà 3 người đã test → bấm *Phân tích cả nhà* → ra **đúng 3 bản tổng hợp**, mỗi bản có
    **2 lát cắt**. Nhà chỉ 1 người đã test → nút mờ, kèm câu giải thích và lời mời, **không
    phải màn trống**.
  - (c) `tests/phan-tich-gia-dinh.test.ts` mới: N=1 trả đúng lý do · N=3 ra 3 bản × 2 lát ·
    soi gương đúng dấu · trùng khớp 4 trục vẫn có chữ · N=7 bị chặn.
  - (d) 2 ngày. — (e) chặn: MÁY.

- [ ] **14.3 — Nội dung 56 đoạn (~3.000 từ)**
  - (a) `MO_TA_LECH[truc][huong]` 16 đoạn (~85 từ) · `THOA_THUAN[truc][huong]` 8 đoạn (~60 từ) ·
    `VIEC_CUA_TOI[truc][huong][theQuyen]` 24 đoạn (~40 từ) · `TRUNG_KHOP[truc][cung-noi|cung-nhe]`
    8 đoạn (~25 từ). `theQuyen = "nguoi-lon-voi-tre" | "tre-voi-nguoi-lon" | "ngang-vai"`.
    Token `{toi}`/`{Toi}` và `{nguoiKia}`/`{NguoiKia}`; hàm `thayDaiTuCap()`.
    🔴 **`{nguoiKia}` = BIỆT DANH đã lưu** ("Mẹ Bống") — tự nhiên trong tiếng Việt và né được
    việc phải suy giới tính, thứ app cố ý không thu. Bảng xưng hô co từ 49 ô xuống 7 phần tử.
    🔴 **KHÔNG mở rộng `CHU_THE[maBoDe]`** — bảng đó khoá theo bộ đề, và chính giả định *"một
    bộ đề = một người đọc"* đã cắt phụ huynh TH/THCS khỏi sản phẩm suốt GĐ9.
  - (b) Đọc bản tổng hợp của **Bin (con) về Mẹ Lan**: phải nói với Bin bằng "em", gọi mẹ bằng
    biệt danh, và **không có câu nào bảo Bin đi quản lý mẹ**. Đọc bản của **Mẹ Lan về Bin**:
    khác hẳn chữ, cùng chỗ vênh. **Không câu ≥60 ký tự nào xuất hiện ở hai bản.**
  - (c) `tests/lech-cap.test.ts` mới: duyệt **mọi cặp vai có hướng** UI sinh ra được, khẳng
    định có `{toi}` và có `theQuyen` · **khẳng định dương** — mọi `veNguoiKia` phải chứa một
    dấu hiệu lật khung (`không phải…mà` · `thật ra` · `dễ bị đọc thành` · `nhìn từ ngoài`) ·
    regex mới chặn `tốt hơn|giỏi hơn|đúng hơn|hợp lý hơn`.
  - (d) 4 ngày.
  - (e) chặn: MÁY *(nhưng phần `theQuyen="ngang-vai"` — vợ↔chồng, hai người lớn nói về nhau —
    thuộc **GÓI KÝ DUYỆT B**, phải khai vào `GOI_KY_DUYET` ngay khi dựng bảng)*.
  - 🔴 **Nguy cơ số 1: `{nguoiKia}` là biệt danh một đứa trẻ thật, và người đọc có thể là anh
    chị nó.** *"Tí Nị chậm hơn em"* là đúng thứ không bao giờ được sinh ra. Dùng test khẳng
    định dương chứ không dùng regex cấm — regex cấm sẽ báo nhầm chính các câu lật khung, đúng
    bài học *"bạn"* vừa là đại từ vừa là danh từ.

- [ ] **14.4 — Màn chọn bài + bản tổng hợp + thư mục**
  - (a) File mới `app/khoang/ban-tong-hop.tsx`. Bấm *Phân tích cả nhà* → bảng chọn mỗi thành
    viên **một** bài (mặc định bài mới nhất) → bấm *Phân tích* → sinh N bản, lưu thành **một
    thư mục theo ngày chạy**.
    🔴 Mỗi bản gói trong `<section data-ban="tv-{id}">`, dùng lại luật in `data-in-ban` đã
    chạy được ở GĐ10. **In tách bản = mỗi thành viên MỘT TỜ**, không phải một tờ chung.
    🔴 **Chụp `tenLuc` vào bản phân tích** — đổi tên hay xoá thành viên sau đó thì bản cũ vẫn
    đọc được. `dienGiai` **lưu MÃ, không lưu chuỗi đã dựng**.
  - (b) Nhà 3 người → *Phân tích cả nhà* → chọn bài → ra 3 bản. **In riêng bản của Bin** → tờ
    giấy **không có chữ nào của bản Mẹ Lan**. Đổi tên *Mẹ Lan* thành *Mẹ* → mở lại bản cũ,
    **vẫn đọc được** và vẫn ghi tên lúc chạy.
  - (c) `tests/ban-tong-hop.test.tsx` mới: 3 người ra 3 bản · in tách bản 0 câu rò rỉ · đổi
    tên không vỡ bản cũ.
  - (d) 2 ngày. — (e) chặn: MÁY.

- [ ] **14.5 — Hạn mức 5 thư mục + tải xuống**
  - (a) `chonThuMucPhaiXoa(ds, 5)` (đã viết ở `12.2`) + `donThuMucPhanTich()` +
    `taiVeThuMucPhanTich()`. Chỉ chạy khi bấm *Phân tích* lúc đã có 5 thư mục.
    Khi `luuBanPhanTich` trả `false` (hết quota trình duyệt) → **mời tải xuống + xoá thư mục
    cũ, không được im lặng**.
  - (b) Chạy phân tích **6 lần** → lần thứ 6 hiện hộp thoại nêu đích danh thư mục sắp mất +
    nút *Tải xuống*. Xác nhận → còn đúng **5 thư mục**, thư mục cũ nhất đã mất.
  - (c) `tests/han-muc.test.ts` mở rộng cho thư mục phân tích.
  - (d) 0,5 ngày. — (e) chặn: MÁY.

### 🎬 DEMO GĐ14 — ~15 phút
1. Nhà 4 người, 3 người đã test → *Phân tích cả nhà* → ra **đúng 3 bản**, mỗi bản 2 lát cắt.
2. Đọc bản của **Bin về Mẹ**: gọi Bin là "em", gọi mẹ bằng biệt danh, **không bảo Bin quản lý mẹ**.
3. So bản của Bin và bản của Mẹ về cùng chỗ vênh → **khác chữ hoàn toàn**.
4. **In riêng bản của Bin** → không có chữ nào của bản Mẹ.
5. Chạy phân tích 6 lần → còn 5 thư mục, có nhắc tải xuống trước khi xoá.
6. Đổi tên một thành viên → bản phân tích cũ **vẫn đọc được**.
7. Mở *Số liệu máy này* → mốc `phanTichGiaDinh` đã nhảy.

---

## ❌ KHÔNG LÀM Ở GĐ11–GĐ14

| Không làm | Vì sao |
| --------- | ------ |
| **Đồng bộ nhiều thiết bị qua máy chủ** | Phá ADR-001. Mã mời (`13.1`) giải được 90% nhu cầu với 0đ/tháng |
| **Tài khoản, đăng nhập trong module DISC** | App chủ đã có. Dựng lần hai là dựng bản sao |
| **Bảng theo dõi cho giáo viên (gộp nhiều gia đình)** | Cần máy chủ ⇒ phá ADR-001, và gom dữ liệu hành vi trẻ em vào một chỗ là đúng thứ ADR-001 tránh |
| **Gửi bản phân tích qua email / Zalo tự động** | Cần máy chủ. Người dùng tự tải xuống rồi tự gửi |
| **Nâng trục thấp / "khắc phục điểm yếu"** | ADR-002. "Cân bằng" = **mở rộng vốn hành vi**, không phải vá chỗ hổng |
| **Con số độ tin cậy, "đã được khoa học chứng minh"** | Chưa có chuẩn hoá trên người Việt. Chỉ được nói: *"Bộ câu hỏi do SATA ROBO biên soạn theo mô hình DISC"* |
| **Ông bà / cô dì / bố dượng thành loại quan hệ riêng** | Kiến trúc `theQuyen` đã phủ sẵn — thêm sau tốn **+0 đoạn nội dung**, chỉ một dòng xưng hô |
| **Hơn 6 thành viên một nhà** | N=7 là 42 lát cắt, không ai đọc hết. Chặn ở `soThanhVienToiDa` |
| **Ghi chú tự do dài cho từng bài** | Chưa ai xin. Ghi chú thành viên ở `12.1` là đủ |

---

## 🏁 MỐC LỚN

| Mốc | Hết GĐ | Tiêu chí đo được |
| --- | ------ | ---------------- |
| **MỐC 1 — Rủi ro kỹ thuật đã chết** | GĐ1 | Tải về một PNG có chữ tiếng Việt đủ dấu, không cụt câu |
| **MỐC 2 — Lõi không bịa số** | GĐ2 | Bài toàn mức giữa **không** ra kết quả; bài thật ra 4 số đúng |
| **MỐC 3 — Làm được bài thật** | GĐ3 | Lớp 2 vào bản người lớn; làm dở 8 câu tắt tab mở lại đúng câu 9 |
| **MỐC 4 — Có thứ để chia sẻ** | GĐ4 | Tấm PNG "3 câu để hỏi con tối nay" gửi Zalo đọc được |
| **MỐC 5 — Sản phẩm có mũi nhọn** | GĐ5 | Bảng đối chiếu con ↔ mẹ hiện ra, diễn giải đúng 2 trục |
| **MỐC 6 — Bàn giao được** | GĐ8 | Người lạ đọc 10 phút chỉ ra đúng 3 nhóm file cần copy |
| **MỐC 7 — Báo cáo đủ sâu** | GĐ9 | Cả bốn nhóm đều có chữ; phụ huynh đọc xong biết tối nay làm gì |
| **MỐC 8 — Phát được cho người thật** | GĐ11 | 30 gia đình bấm thử; 5 câu/màn không dính nhau; quét được mã QR bằng điện thoại |
| **MỐC 9 — Nhà mình có sổ** | GĐ12 | Tạo nhà 4 người, bấm Làm bài từ thẻ mà KHÔNG bị hỏi tên lần nữa |
| **MỐC 10 — Mỗi người một máy** | GĐ13 | Máy A hiện QR, máy B quét xong có đủ hai hồ sơ để ghép |
| **MỐC 11 — Cả nhà hiểu nhau hơn** | GĐ14 | 3 người ra 3 bản tổng hợp; in riêng bản của con, 0 chữ của bố mẹ lọt sang |

---

## ❌ KHÔNG LÀM Ở BẢN NÀY

Ghi rõ để không ai âm thầm thêm vào, và để đội dev biết đâu là ranh giới.

| Không làm | Vì sao |
| --------- | ------ |
| **Backend, cơ sở dữ liệu, Supabase** | Module này sắp bị bê sang app đã có backend riêng — dựng DB bây giờ là dựng thứ chắc chắn bị vứt. Và quan trọng hơn: **không giữ dữ liệu thì không phát sinh nghĩa vụ NĐ 13/2023**. Lợi thế đó miễn phí (ADR-001) |
| **Đăng nhập, tài khoản, phân quyền** | Chưa có câu hỏi nào mà chỉ đăng nhập mới trả lời được |
| **Bảng quản trị cho đội sale** | Đội dev nối `onGuiLienHe` vào hệ thống họ đã có; dựng bảng riêng là dựng bản sao thứ hai |
| **Gửi kết quả cho giáo viên / so với các bạn cùng lớp** | Cần backend ⇒ phá ADR-001; gửi kèm kết quả trẻ ⇒ phá luôn hàng rào dữ liệu. Dựng nút mà chưa có đường đi là **cái nút dối** |
| **Google Analytics, Facebook Pixel** | Gắn công cụ theo dõi bên thứ ba lên trang có dữ liệu hành vi trẻ em. 4 bộ đếm tự viết (6.3) là đủ |
| **Bộ đề cho GIÁO VIÊN quan sát học sinh** | Cấu trúc đã sẵn (chỉ đổi ngôi xưng), nhưng đừng mở thêm mặt trận khi bản 1 chưa chạy |
| **Dạng câu hỏi ép chọn nhất/nhì** | Cho điểm không so được giữa người với người, mất ~25 phút, và không đo được độ tin cậy (ADR-003) |
| **Tuyên bố "chuẩn quốc tế" hoặc bất kỳ con số chính xác nào** | Chưa có bộ dữ liệu chuẩn hoá trên người Việt. Câu được phép dùng: *"Bộ câu hỏi do SATA ROBO biên soạn theo mô hình DISC."* |
| **Đa ngôn ngữ (i18n)** | Chỉ có tiếng Việt. i18n là giải pháp cho vấn đề chưa tồn tại |
| **Thư viện biểu đồ, thư viện PDF** | 4 cột ngang vẽ bằng `div`; PDF dùng `window.print()`. Thư viện ngoài duy nhất: `jszip` |

---

## AI ĐANG CHẶN — việc NGƯỜI / NGOÀI chạy song song

Bốn việc này **không tốn ngày dev nào** và **không chặn thi công**, nhưng cả bốn đều có thể
đổi hình dạng bài toán. Làm song song từ tuần đầu.

| Việc | Ai làm | Để làm gì | Chặn cái gì |
| ---- | ------ | --------- | ----------- |
| Thu **30–50 phản hồi** bộ THCS bằng Google Form | NGƯỜI | Đầu vào cho `scripts/phan-tich-item.mjs` (2.6) | Không chặn dev · **chặn ngày bật quảng cáo** |
| Nộp **3 mẫu quảng cáo** cho Facebook duyệt | NGƯỜI | Facebook hạn chế quảng cáo ngụ ý biết đặc điểm tâm lý của người xem hoặc người thân. **Cần kiểm chứng — chính sách có thể đã đổi** | Không chặn dev · nếu trượt thì **kênh phân phối số 1 chết** |
| **Gọi đội dev 30 phút** — React bản mấy · có Tailwind không · lead đi vào đâu · nhận dạng nào | NGƯỜI | Quyết định ~40% khối lượng có dùng được không | Không chặn GĐ0–GĐ2 · **chặn chất lượng GĐ3–GĐ4** |
| **Người chuyên môn tâm lý/giáo dục ký duyệt** 104 câu + văn bản báo cáo | NGOÀI | Chạy nội bộ thì không sao. Ngày bấm nút quảng cáo là ngày nói với người lạ về con của họ | Không chặn dev · **chặn ngày ra người dùng thật** |

---

## ⚠️ CẠM BẪY — đã trả giá ở dự án trước, đừng lặp lại

| 🔴 | Cạm bẫy | Chặn ở đâu |
| -- | ------- | ---------- |
| 🔴 | Cho trẻ mầm non tự tick — tạo hồ sơ trông chuyên nghiệp, đo bằng số ngẫu nhiên. **Lỗi im lặng tuyệt đối** | 3.1 định tuyến + ADR-002 |
| 🔴 | Gỡ câu đảo chiều cuối cùng của một trục — bài vẫn chạy, chỉ mất hàng rào chống tick một cột | 2.4 · **đừng gỡ test đó** |
| 🔴 | Sửa nội dung câu mà quên tăng `phienBanBoDe` | 2.5 checksum |
| 🔴 | Bỏ kiểm `HL-1` "cho đỡ phiền" — hàng rào duy nhất chặn dựng cả hồ sơ trên toàn số 3 | 2.3 |
| 🔴 | Ép nhãn cứng khi bốn điểm sát nhau — phụ huynh đọc xong nói "không đúng con tôi" và mất niềm tin vào cả sản phẩm | 2.3 (phổ đều) + 4.1 |
| 🔴 | Nút Sao lưu đọc danh sách đã lọc thay vì đọc thẳng nguồn | 5.1 |
| 🔴 | `config/` đi thẳng ra bundle công khai | R4 · 3.2 |
| 🔴 | Rule semgrep mồ côi im lặng cho cảm giác đang được canh | 8.2 — xoá module thì xoá rule, thêm module thì thêm rule |
| ⚠️ | Random hoá thứ tự câu lúc chạy — hai lần làm ra hai thứ tự, không đối chiếu được | 2.1 |
| ⚠️ | Báo cáo toàn lời khen — ai đọc cũng thấy đúng, dấu hiệu công cụ không đo gì cả | 4.1 test |
| ⚠️ | `new Date("01/08/2026")` ra 8 tháng 1 theo lối Mỹ, **không báo lỗi** | R8 |
| ⚠️ | Regex `\b` không khớp sau ký tự tiếng Việt nếu thiếu cờ `u` | R9 |
| ⚠️ | Component khai trong thân component cha ⇒ ô biệt danh **mất chữ mỗi lần gõ** | 3.1 — khai ở cấp module |
| ⚠️ | Chạy `npm run build` khi `npm run dev` đang chạy làm hỏng `.next` | Dừng dev trước khi build |
| ⚠️ | **Next 16 tự ghi một khối vào `CLAUDE.md` sau mỗi `next dev`** — chèn thêm, không xoá, nên rất dễ lọt | 0.4 — `agentRules: false` trong `next.config.mjs`, **đừng gỡ** |
| ⚠️ | JSZip trong Node nhận `uint8array`, **không nhận `Blob`** | 5.1 |

---

## ĐIỂM DỪNG BẮT BUỘC

Trong phạm vi lộ trình này: tự chạy liền theo GÓI, mỗi hạng mục xong phải `npm run kiem`
xanh mới đi tiếp, báo cáo 3 dòng từng mục, **không dừng chờ**.

**Dừng hỏi người dùng khi:** commit/push lên GitHub · deploy · ghi/xoá dữ liệu thật · tác
động ra ngoài thư mục dự án · **việc phát sinh ngoài phạm vi lộ trình này**.
