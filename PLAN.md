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

- [ ] **0.2 — BRD chốt phạm vi bản 1**
  - (a) Viết `docs/brd/disc-mvp.md`: bài toán, 4 nhóm người dùng, 5 bộ đề, phạm vi
    TRONG/NGOÀI (chép mục "KHÔNG LÀM Ở BẢN NÀY" cuối file này), 12 tiêu chí nghiệm thu.
  - (b) Người dùng mở `docs/brd/disc-mvp.md`, đọc hết trong 10 phút, và **chỉ ra được**
    một thứ có trong bản 1 và một thứ bị hoãn — không cần hỏi lại.
  - (c) (tài liệu — không có test tự động.)
  - (d) 0,25 ngày.

- [ ] **0.3 — Bốn bản ADR + sửa lại mục Stack đang sai**
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

- [ ] **0.4 — Dựng khung Next.js + bộ cổng `npm run kiem`**
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

- [ ] **0.5 🔴 — Hàng rào hai tầng: lõi không được đụng React/DOM**
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

- [ ] **0.6 — Thanh bên + khung ngoài + nhớ mục đang mở**
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

- [ ] **1.1 🔴 — Spike Canvas 2D: vẽ chữ tiếng Việt vừa khung**
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

- [ ] **2.1 — Ngân hàng 104 câu + thứ tự hiển thị chốt cứng**
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

- [ ] **2.2 — Kiểu dùng chung + loader bộ đề (nâng lên `core`)**
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

- [ ] **2.3 🔴 — Hàm chấm điểm thuần + năm hàng rào hợp lệ**
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

- [ ] **2.4 — Test canh cấu trúc ngân hàng câu**
  - (a) Viết `tests/cau-hoi.test.ts` đọc `config/disc-cau-hoi.ts` và khẳng định các bất
    biến: **mỗi trục có ≥ 1 câu đảo chiều** · số câu mỗi trục bằng nhau trong cùng bộ · mã
    câu không trùng · trong thứ tự hiển thị không có 2 câu cùng trục đứng liền nhau · câu
    đầu bài là câu thuận · **mọi câu bộ QS đều khai `soiGuong` trỏ tới một mã có thật**.
  - (b) Người dùng tự tay xoá dấu `✔` ở cột **Đảo** của câu `THCS-D6` trong
    `config/disc-cau-hoi.ts` (câu đảo cuối cùng của trục D), chạy `npm run kiem` → **phải
    ĐỎ**. Hoàn tác, chạy lại → xanh.
  - (c) `tests/cau-hoi.test.ts`.
  - (d) 0,5 ngày.

- [ ] **2.5 — Khoá ngân hàng câu bằng checksum**
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

- [ ] **2.6 — Script phân tích item (đầu vào cho việc kiểm chứng bộ câu)**
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

- [ ] **3.1 — M1 chọn đối tượng + luật định tuyến**
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

- [ ] **3.2 — M2 màn trước khi bắt đầu + ô biệt danh**
  - (a) Viết `app/khoang/disc.tsx` phần M2: 4 dòng dặn dò (bao lâu · không có đúng sai ·
    dữ liệu không rời máy · trả lời theo phản xạ đầu tiên) + ô nhập **tên gọi** với
    `maxLength={24}` và dòng nhắc *"Đặt một tên gọi để nhận ra bài này — biệt danh cũng
    được. Đừng ghi họ tên đầy đủ."* (R4 — đây là hàng rào dữ liệu cá nhân trẻ em).
  - (b) Nhập biệt danh `"Bi"`, bấm **Bắt đầu** → vào được màn làm bài. Thử nhập 40 ký tự →
    ô chỉ nhận 24. Thử nhập toàn dấu cách rồi bấm Bắt đầu → **không cho đi tiếp**.
  - (c) `tests/bien-danh.test.ts` — cắt đúng 24 ký tự · chuỗi toàn khoảng trắng bị từ chối ·
    ký tự tiếng Việt có dấu đếm đúng 1 ký tự, không đếm thành 2.
  - (d) 0,5 ngày.

- [ ] **3.3 — M3 làm bài, hai kiểu trình bày + tự lưu nháp**
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

- [ ] **4.1 — M4 màn kết quả**
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

- [ ] **4.2 — Bốn nhân vật robot bằng SVG inline**
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

- [ ] **4.3 — Nội dung "3 câu để hỏi con tối nay" (11 bộ × 3 câu)**
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

- [ ] **4.4 — Ráp tấm ảnh PNG thật**
  - (a) Nối `veTamAnh` (đã dựng ở 1.1) vào dữ liệu kết quả thật. **Bố cục đảo so với bản
    BA doc**: trên cùng *"3 câu để hỏi con tối nay"* + 3 câu; giữa là nhân vật + 4 cột;
    dưới cùng logo SATA ROBO. Lý do đảo: phụ huynh không chia sẻ thứ dán nhãn con mình, họ
    chia sẻ thứ khiến họ trông như một người cha mẹ tinh tế.
  - (b) **Nửa sau DEMO của GĐ4** — xem đầu giai đoạn. Thử thêm trên điện thoại: gửi tấm ảnh
    qua Zalo cho chính mình, mở ra xem còn đọc được không.
  - (c) `tests/xuat-anh.test.ts` (mở rộng) — hàm dựng dữ liệu vẽ trả về đủ 3 câu hỏi + 4
    điểm + tên nhân vật, không trường nào `undefined`.
  - (d) 0,5 ngày.

- [ ] **4.5 — In ra PDF**
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

- [ ] **5.1 — IndexedDB + M6 "Bài đã làm" + sao lưu .zip**
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

- [ ] **5.2 — Chế độ máy dùng chung**
  - (a) Thêm nút **"Kết thúc & xoá bài này khỏi máy"** ở cuối màn kết quả, và cảnh báo ở M6
    khi phát hiện **> 3 biệt danh khác nhau** trên cùng máy. Lý do: kênh phân phối "giáo
    viên đưa tận tay" khiến nhiều gia đình làm nối tiếp trên cùng một máy — vừa lộ dữ liệu
    chéo, vừa ghép cặp vùng lệch **sai người**.
  - (b) Làm 4 bài với 4 biệt danh khác nhau → M6 hiện dải cảnh báo. Bấm "Kết thúc & xoá bài
    này" ở một bài → bài đó biến mất khỏi M6, **3 bài kia còn nguyên**.
  - (c) `tests/may-dung-chung.test.ts` — đếm đúng số biệt danh riêng biệt · xoá một bài
    không đụng bài khác.
  - (d) 0,25 ngày.

- [ ] **5.3 🔴 — M5 vùng lệch**
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

- [ ] **5.4 — Chuyền tay chủ động**
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

- [ ] **6.1 — Ô để lại liên hệ + điểm cắm cho đội dev**
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

- [ ] **6.2 🔴 — Hàng rào: payload liên hệ không được chứa dữ liệu trẻ**
  - (a) Viết `tests/lien-he-sach.test.ts`: dựng một `BaiLam` đầy đủ, gọi hàm tạo payload,
    khẳng định object trả về **không có khoá** `traLoi`, `ketQua`, `diem`, `xepHang` ở bất
    kỳ độ sâu nào. Số điện thoại phụ huynh **cộng** kết quả DISC của con nằm cạnh nhau là
    một hồ sơ cá nhân theo NĐ 13/2023. Đây là **cái chốt giữ lớp phòng vệ pháp lý** của cả
    dự án — nó vỡ ngay khi ai đó "chỉ thêm chút dữ liệu cho tiện".
  - (b) Người dùng tự tay thêm `diem: ketQua.diem` vào object payload trong
    `modules/core/lien-he/`, chạy `npm run kiem` → **phải ĐỎ**. Hoàn tác → xanh.
  - (c) `tests/lien-he-sach.test.ts`.
  - (d) 0,25 ngày.

- [ ] **6.3 — Đếm bốn mốc phễu**
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

- [ ] **7.1 — Chạy được khi mất mạng**
  - (a) Viết `public/sw.js` tối giản cache app shell (**không thêm thư viện**). 🔴 Tách
    thành file riêng **ngoài hai tầng**, và ghi rõ trong tài liệu bàn giao rằng đây là thứ
    **toàn-app**, không thuộc module DISC — đội dev nên bỏ nếu app của họ đã có service
    worker riêng. Nhét service worker vào gói bàn giao mà không nói gì là gài mìn.
  - (b) **Nửa đầu DEMO của GĐ7** — xem đầu giai đoạn.
  - (c) `tests/ngoai-tuyen.test.ts` — danh sách file cache khớp danh sách file thật sinh ra
    sau `npm run build`, không trỏ vào file không tồn tại.
  - (d) 0,75 ngày.

- [ ] **7.2 — Rà tiếp cận + thử trên điện thoại thật**
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

- [ ] **8.1 — Hướng dẫn cắm vào app của đội dev**
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

- [ ] **8.2 — OVERVIEW từng module + manifest thật**
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

- [ ] **8.3 — Bộ cổng cuối + dọn trang tạm**
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

## 🏁 MỐC LỚN

| Mốc | Hết GĐ | Tiêu chí đo được |
| --- | ------ | ---------------- |
| **MỐC 1 — Rủi ro kỹ thuật đã chết** | GĐ1 | Tải về một PNG có chữ tiếng Việt đủ dấu, không cụt câu |
| **MỐC 2 — Lõi không bịa số** | GĐ2 | Bài toàn mức giữa **không** ra kết quả; bài thật ra 4 số đúng |
| **MỐC 3 — Làm được bài thật** | GĐ3 | Lớp 2 vào bản người lớn; làm dở 8 câu tắt tab mở lại đúng câu 9 |
| **MỐC 4 — Có thứ để chia sẻ** | GĐ4 | Tấm PNG "3 câu để hỏi con tối nay" gửi Zalo đọc được |
| **MỐC 5 — Sản phẩm có mũi nhọn** | GĐ5 | Bảng đối chiếu con ↔ mẹ hiện ra, diễn giải đúng 2 trục |
| **MỐC 6 — Bàn giao được** | GĐ8 | Người lạ đọc 10 phút chỉ ra đúng 3 nhóm file cần copy |

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
| ⚠️ | JSZip trong Node nhận `uint8array`, **không nhận `Blob`** | 5.1 |

---

## ĐIỂM DỪNG BẮT BUỘC

Trong phạm vi lộ trình này: tự chạy liền theo GÓI, mỗi hạng mục xong phải `npm run kiem`
xanh mới đi tiếp, báo cáo 3 dòng từng mục, **không dừng chờ**.

**Dừng hỏi người dùng khi:** commit/push lên GitHub · deploy · ghi/xoá dữ liệu thật · tác
động ra ngoài thư mục dự án · **việc phát sinh ngoài phạm vi lộ trình này**.
