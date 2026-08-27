# Cắm khoang DISC vào ứng dụng của bạn

> Dành cho đội dev SATA ROBO. Đọc hết mất khoảng 10 phút. Cắm xong mất khoảng một buổi.
>
> Ứng dụng đích: **Next.js + React + TypeScript**. Không cần backend, không cần cơ sở dữ
> liệu, không cần biến môi trường nào.

---

## 1. Ba nhóm file cần copy

Copy nguyên ba nhóm này vào repo của bạn. Giữ nguyên cấu trúc thư mục.

| # | Nhóm | Là gì | Bê nguyên được không? |
| - | ---- | ----- | --------------------- |
| **1** | `config/disc-*.ts` + `config/disc-checksum.json` + `config/thuong-hieu.ts` | Toàn bộ **nội dung**: 104 câu hỏi, ngưỡng chấm, văn bản báo cáo, từ điển giao diện | ✅ Bê nguyên |
| **2** | `modules/core/` + `modules/report/` + `modules/test/` | Toàn bộ **logic**: chấm điểm, hàng rào hợp lệ, vùng lệch, lưu trữ, vẽ ảnh | ✅ Bê nguyên |
| **3** | `app/components/` + `app/khoang/` | **Giao diện tham chiếu** | ⚠️ Viết lại được — xem mục 4 |

Và **một dòng** thêm vào thanh bên của bạn — xem mục 3.

### Thứ KHÔNG cần copy

- `app/thu-cham/`, `app/thu-nhan-vat/` — trang tạm để nghiệm thu, đã gỡ ở bản bàn giao.
- `public/sw.js` + `app/dang-ky-sw.tsx` + `scripts/sinh-danh-sach-cache.mjs` — service
  worker cho chế độ ngoại tuyến. **Đây là thứ toàn-ứng-dụng, không thuộc module DISC.**
  App của bạn đã có service worker riêng thì bỏ cả ba, đừng để hai cái giành nhau.
- `app/page.tsx`, `app/layout.tsx`, `app/components/thanh-ben.tsx` — khung ngoài của bản
  chạy thử. Bạn đã có khung ngoài của mình.

### Thư viện phải cài

```bash
npm install jszip
```

Đúng một thư viện. `jszip` chỉ dùng cho nút "Sao lưu ra .zip" ở màn *Bài đã làm* — không
làm tính năng đó thì không cần cài.

---

## 2. Hai tầng — và vì sao nó quan trọng với bạn

```
┌─ TẦNG LÕI ──────────────────────────────────────────────┐
│  config/disc-*.ts                                        │
│  modules/core/bo-de/  ·  modules/core/tien-ich/          │
│  modules/core/lien-he/kieu.ts                            │
│  modules/report/cham.ts · kiem-hop-le.ts · dien-giai.ts  │
│  modules/report/doi-chieu.ts · do-chu.ts                 │
│  modules/report/hinh-nhan-vat.ts · thong-ke.ts           │
│                                                          │
│  Hàm THUẦN + dữ liệu. Không React, không DOM.            │
│  ⇒ Chạy được trong Node, trong test, trong bất kỳ khung  │
│    giao diện nào. Kể cả khi bạn vứt hết phần dưới.       │
└──────────────────────────────────────────────────────────┘
┌─ TẦNG GIAO DIỆN THAM CHIẾU ─────────────────────────────┐
│  app/components/  ·  app/khoang/                         │
│  modules/test/lam-bai/                                   │
│  modules/core/luu-tru/ · do-phieu/ · lien-he/luu-tam.ts  │
│  modules/report/xuat-anh.ts                              │
│                                                          │
│  Đụng trình duyệt. Viết lại theo quy ước của bạn cũng    │
│  được — tầng lõi không phụ thuộc ngược lên đây.          │
└──────────────────────────────────────────────────────────┘
```

Ranh giới này có **test canh**: `tests/ranh-gioi-hai-tang.test.ts` sẽ đỏ nếu ai đó nhét
`import react` hay `window.` vào một file tầng lõi.

---

## 3. Một dòng thêm vào thanh bên

Khoang DISC là **một component duy nhất**, không có route riêng, không có tham số bắt buộc:

```tsx
import { KhoangDisc } from "@/app/khoang/disc";

// …trong nơi bạn render nội dung theo mục đang chọn:
{mucDangChon === "disc" && <KhoangDisc />}
```

Muốn có cả màn *Bài đã làm*:

```tsx
import { KhoangLichSu } from "@/app/khoang/lich-su";

{mucDangChon === "lich-su" && <KhoangLichSu />}
```

Cả hai đều là **client component** (`"use client"`). Chúng tự lo trạng thái bên trong —
không cần context, không cần store, không cần provider.

### Alias đường dẫn

Code dùng ba alias. Khai trong `tsconfig.json` của bạn:

```json
{
  "compilerOptions": {
    "paths": {
      "@modules/*": ["./modules/*"],
      "@config/*": ["./config/*"],
      "@/*": ["./*"]
    }
  }
}
```

Không muốn thêm alias thì tìm-thay `@modules/` và `@config/` thành đường dẫn tương đối.

---

## 4. Hai điểm cắm bạn cần nối

### 4.1 Thu liên hệ — `onGuiLienHe`

Bản bàn giao chỉ lưu phiếu vào `localStorage` rồi mở Zalo. Nối vào backend của bạn:

```tsx
// app/khoang/ket-qua.tsx — chỗ <OLienHe onGui={...} />
import type { PhieuLienHe } from "@modules/core/lien-he/kieu";

async function guiLienHe(phieu: PhieuLienHe) {
  await fetch("/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(phieu),
  });
}
```

Hình dạng phiếu — **đúng bốn trường, không hơn**:

```ts
{
  soDienThoai: "0912345678",
  tenGoi?: "Mẹ Bi",
  kenhMuonNhan: "zalo" | "goi-dien",
  nguon: "lop-3a",
  luc: "2026-08-27T07:00:00+07:00"
}
```

> ### 🔴 **PAYLOAD LIÊN HỆ KHÔNG BAO GIỜ ĐƯỢC CHỨA DỮ LIỆU CỦA TRẺ.**
>
> Không câu trả lời, không điểm số, không biệt danh của bé, không mã bộ đề. Số điện thoại
> phụ huynh **cộng** kết quả DISC của con nằm cạnh nhau là một hồ sơ cá nhân theo Nghị
> định 13/2023 — và toàn bộ lợi thế "chúng tôi không giữ dữ liệu trẻ em" biến mất trong
> đúng một dòng code.
>
> `tests/lien-he-sach.test.ts` canh việc này. Nó sẽ đỏ nếu bạn thêm bất kỳ khoá cấm nào.

### 4.2 Đo phễu — `onGhiMoc`

Bốn mốc: `mo` · `batDau` · `xong` · `deLaiSo`. Bản bàn giao ghi vào `localStorage`.

```tsx
// gọi MỘT LẦN lúc khởi động app
import { datCachGhiMoc } from "@modules/core/do-phieu";

datCachGhiMoc((ban) => {
  // ban = { moc: "xong", nguon: "lop-3a", luc: "2026-..." }
  window.gtag?.("event", `disc_${ban.moc}`, { nguon: ban.nguon });
});
```

Bản ghi mốc cũng **không chứa câu trả lời hay điểm số** — đừng thêm vào.

Nguồn đọc từ `?nguon=` trên URL. Ví dụ: `https://app.sataroro.vn/?nguon=lop-3a`.

---

## 5. Sửa nội dung mà không cần dev

Toàn bộ chữ nghĩa nằm trong `config/`, sửa được trên giao diện web của GitHub:

| File | Chứa gì |
| ---- | ------- |
| `disc-cau-hoi.ts` | 104 câu hỏi của 5 bộ đề |
| `disc-dien-giai.ts` | Văn bản báo cáo: 11 kiểu × 4 khối |
| `disc-doi-chieu.ts` | 8 văn bản vùng lệch + câu kết |
| `disc-tu-dien.ts` | Mọi chữ trên giao diện |
| `disc-nguong.ts` | Ngưỡng chấm điểm và ngưỡng hợp lệ |
| `thuong-hieu.ts` | Bộ màu |

### 🔴 Ba luật khi sửa nội dung câu hỏi

1. **Mỗi trục phải giữ ít nhất MỘT câu đảo chiều.** Gỡ câu đảo cuối cùng của một trục là
   gỡ hàng rào chống tick-một-cột — bài vẫn chạy, kết quả vẫn ra, chỉ là **sai**.
2. **Sửa câu ⇒ tăng `PHIEN_BAN_BO_DE`** rồi chạy `node scripts/sinh-checksum.mjs`.
   Không tăng thì `npm run kiem` đỏ — cố ý.
3. **Sửa xong chạy lại `node scripts/sinh-thu-tu.mjs`** để sinh lại thứ tự hiển thị.

⚠️ `config/` đi thẳng ra bundle công khai. **Đừng đặt họ tên, tên cơ sở, số điện thoại
thật vào đó.** Số Zalo trong `disc-tu-dien.ts` (`LIEN_HE_SATA`) là số công khai của doanh
nghiệp — đó là ngoại lệ có chủ đích.

---

## 6. Bộ test — xin đừng xoá

```bash
npm run kiem   # typecheck + lint + test + cấu trúc + semgrep
```

> ### 🔴 **MẤY BÀI TEST NÀY LÀ MỘT PHẦN CỦA SẢN PHẨM. XOÁ LÀ HỎNG SẢN PHẨM.**
>
> Chúng không canh "code có chạy không" — chúng canh những thứ **hỏng im lặng**: bài vẫn
> chạy, kết quả vẫn hiện ra, chỉ là sai. Không có test thì không ai phát hiện.

Bốn bài quan trọng nhất:

| Test | Canh cái gì | Hỏng thì sao |
| ---- | ----------- | ------------ |
| `cau-hoi.test.ts` | Mỗi trục còn ít nhất 1 câu đảo chiều | Mất hàng rào chống tick-một-cột |
| `lien-he-sach.test.ts` | Payload liên hệ không chứa dữ liệu trẻ | Mất lớp phòng vệ NĐ 13/2023 |
| `kiem-hop-le.test.ts` | Bài toàn mức giữa bị chặn (`HL-1`) | Dựng cả hồ sơ trên toàn số 3 |
| `ranh-gioi-hai-tang.test.ts` | Tầng lõi không dính React/DOM | Không bê sang stack khác được nữa |

---

## 7. Trước khi đưa cho phụ huynh thật

Ba việc **không phải việc code**, nhưng phải xong trước ngày chạy quảng cáo:

1. **Người có chuyên môn tâm lý/giáo dục ký duyệt 104 câu hỏi và toàn bộ văn bản báo cáo.**
   Bộ câu hiện do BA soạn, chưa ai làm thử, chưa có con số tin cậy nào. Chạy nội bộ thì
   không sao; nói với người lạ về con của họ thì phải có người chịu trách nhiệm.
2. **Chạy `node scripts/phan-tich-item.mjs` trên 30–50 phản hồi thật.** Nó chỉ ra câu nào
   đang đo sai. Đây là thứ duy nhất biến bộ câu từ *"do BA soạn"* thành *"đã sàng trên
   người Việt"*.
3. **Điền số Zalo/hotline thật** vào `LIEN_HE_SATA` trong `config/disc-tu-dien.ts`.
   Hiện là số giữ chỗ `0900 000 000`.

---

## 8. Ba thứ đừng làm

| Đừng | Vì sao |
| ---- | ------ |
| Thêm tham số lọc vào `saoLuuTatCa()` | Nút Sao lưu sẽ đọc danh sách đang hiển thị thay vì đọc thẳng kho ⇒ file tải về **thiếu** mà trông vẫn đủ. Đã cắn dự án trước một lần. |
| Bỏ hàng rào `HL-1` "cho đỡ phiền" | Đây là thứ duy nhất chặn việc dựng cả một hồ sơ hành vi trên toàn số 3 |
| Gắn Google Analytics / Facebook Pixel lên trang này | Trang có dữ liệu hành vi trẻ em. Bốn bộ đếm ở `do-phieu` đã đủ, và chúng không chạm vào câu trả lời |

---

## 9. Đọc thêm

| Cần hiểu | Đọc |
| -------- | --- |
| Vì sao trẻ dưới 8 tuổi không tự đánh giá | `docs/decisions/ADR-002-tuoi-tu-danh-gia.md` |
| Vì sao không có backend | `docs/decisions/ADR-001-khong-backend.md` |
| Vì sao dùng thang Likert thay vì ép chọn | `docs/decisions/ADR-003-likert-thay-ep-chon.md` |
| Vì sao tách hai tầng | `docs/decisions/ADR-004-tach-hai-tang.md` |
| Đặc tả nghiệp vụ đầy đủ | `docs/BA/DISC_BA.md` |
| Cạm bẫy của từng module | `modules/*/OVERVIEW.md` mục 6 |
