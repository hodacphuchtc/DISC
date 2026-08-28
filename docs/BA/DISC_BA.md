# DISC — TÀI LIỆU PHÂN TÍCH NGHIỆP VỤ & ĐẶC TẢ THI CÔNG

> **Mã tài liệu:** `DISC-BA-v1.0` · **Ngày:** 26/08/2026 · **Trạng thái:** ĐỀ XUẤT, chưa duyệt
> **Mục đích:** đủ để mở một repo mới và dev trọn tính năng DISC mà không cần hỏi lại.
> **Người đọc:** BA, dev, chủ dự án, người soạn nội dung câu hỏi.

---

## 0. CÁCH DÙNG TÀI LIỆU NÀY

| Bạn là | Đọc mục |
| ------ | ------- |
| Chủ dự án — cần quyết | 1, 3.2, 3.3, 17 |
| BA / người soạn nội dung | 3, 4, 6, 9 |
| Dev | 5, 6, 7, 8, 10, 11, 12, 13, 14 |
| Người nghiệm thu | 14, 15, 16 |

🔴 **Ba mục KHÔNG được bỏ qua, đọc trước khi viết dòng code đầu tiên:**
**3.2** (ranh giới tuổi tự đánh giá) · **3.3** (cạm bẫy bản quyền) · **11** (dữ liệu trẻ em).
Sai một trong ba là phải đập đi làm lại, không phải sửa.

---

## 1. TÓM TẮT ĐIỀU HÀNH

Dựng một khoang **DISC** trong ứng dụng nội bộ SATA ROBO: bốn nhóm người dùng
(mầm non · tiểu học · THCS · phụ huynh) làm bài trắc nghiệm hành vi DISC ngay trong trình
duyệt, nhận báo cáo đọc được, và — điểm khác biệt lớn nhất — **đối chiếu cách con tự nhìn
mình với cách cha mẹ nhìn con**.

**Bốn quyết định chuyên môn định hình toàn bộ thiết kế:**

1. **Trẻ dưới 8 tuổi không tự đánh giá được.** Mầm non và lớp 1–2 dùng **bộ quan sát do
   người lớn điền**, không phải bé tự trả lời. Đây không phải lựa chọn thẩm mỹ — cho bé 4
   tuổi tick thang Likert là tạo ra một hồ sơ đẹp mắt đo bằng số ngẫu nhiên. (Mục 3.2)
2. **Không dùng dạng ép chọn nhất/nhì của "DISC Classic".** Nó là dạng cho độ tin cậy *thấp
   nhất* ở bài ngắn chỉ đo 4 nhân tố, mất ~25 phút, và cho điểm không so được giữa người với
   người. Dùng **thang Likert có câu đảo chiều**. (Mục 3.4)
3. **Bộ từ của DISC bản thương mại có bản quyền — phải tự viết tiếng Việt.** Mục 6 của tài
   liệu này đã viết sẵn **104 câu**, đủ để chạy. (Mục 3.3)
4. **"Vùng lệch" con ↔ cha mẹ là tính năng chủ lực, không phải phần thưởng thêm.** Có cơ sở
   học thuật vững (informant discrepancies — De Los Reyes): chênh lệch giữa hai người đánh
   giá **là tín hiệu về sự khác nhau của hành vi theo ngữ cảnh**, không phải sai số đo.
   (Mục 8)

**Quy mô:** ~12–16 ngày công dev cho bản 1 đầy đủ · 0đ/tháng vận hành · không backend.

---

## 2. BỐI CẢNH & BA RÀNG BUỘC KẾ THỪA

Sản phẩm này **không phải khoang thứ tư của TAO_ANH** — TAO_ANH sinh ảnh marketing, DISC là
công cụ đánh giá hành vi. Hai nghiệp vụ khác nhau ⇒ **repo riêng**.

Nhưng kiến trúc trùng khít, nên **kế thừa nguyên bộ khung** (mục 12) và **kế thừa nguyên ba
ràng buộc bất di bất dịch**:

| # | Ràng buộc | Nghĩa với DISC |
| - | --------- | -------------- |
| ① | **Dữ liệu không rời máy người dùng** | Câu trả lời và kết quả của trẻ là dữ liệu cá nhân theo NĐ 13/2023. Xử lý 100% client-side, lưu localStorage/IndexedDB, xuất PDF/PNG tại máy. **Không gửi đi đâu, kể cả để "thống kê nội bộ".** |
| ② | **Chi phí vận hành 0đ/tháng** | Next.js static export, không backend, không cơ sở dữ liệu, không API trả phí. |
| ③ | **Hằng số nghiệp vụ nằm trong `config/`** | Toàn bộ ngân hàng câu hỏi, ngưỡng chấm điểm, văn bản báo cáo nằm trong `config/` dạng file text — người không biết code sửa được trên web GitHub. |

⚠️ Ràng buộc ③ có mặt trái đã kiểm chứng: **mọi file trong `config/` đi thẳng ra bundle công
khai.** Bộ câu hỏi công khai thì không sao (đề thi không phải bí mật), nhưng **tuyệt đối
không đặt họ tên học sinh, tên cơ sở, số điện thoại vào `config/`**.

---

## 3. NỀN TẢNG CHUYÊN MÔN DISC

### 3.1 Bốn nhân tố — ở người lớn và ở trẻ em

DISC đo **thiên hướng hành vi trong một ngữ cảnh**. Không đo năng lực, không đo trí thông
minh, không tiên đoán nghề nghiệp. Ở trẻ em còn thay đổi theo tuổi.

| Trục | Tên tiếng Việt dùng trong app | Biểu hiện ở NGƯỜI LỚN | Biểu hiện ở TRẺ EM |
| ---- | ----------------------------- | --------------------- | ------------------ |
| **D** | **Chủ động** (Dominance) | Ra quyết định nhanh, nói thẳng, hướng kết quả, chịu được xung đột | Bày cách chơi, đòi tự làm, thích thắng, phản ứng ngay khi bị cản, không ngại thử cái mới |
| **I** | **Ảnh hưởng** (Influence) | Thuyết phục bằng quan hệ và cảm xúc, hoạt ngôn, lạc quan, thích đám đông | Kể chuyện, kết bạn nhanh, thích được chú ý, biểu cảm phong phú, pha trò |
| **S** | **Ổn định** (Steadiness) | Kiên nhẫn, giữ nếp, tránh xung đột, trung thành, cần thời gian với thay đổi | Nhường bạn, thích nếp quen, chờ được lâu, an ủi bạn, khó chịu khi đổi lịch đột ngột |
| **C** | **Cẩn trọng** (Conscientiousness) | Đòi dữ liệu, theo quy trình, để ý chi tiết, sợ sai | Làm theo hướng dẫn, soát lại, hỏi "vì sao", để ý đồ đặt sai chỗ, thích đúng luật |

**Nhân vật cho trẻ.** Trẻ dưới 12 tuổi không đọc nổi "Dominance". Cần bốn nhân vật.
Khuyến nghị **bốn bạn robot** thay vì bốn con vật — hợp thương hiệu SATA ROBO, và tránh
đụng bất kỳ bộ nhân vật nào của bên bán:

| Trục | Nhân vật | Dấu hiệu nhận ra | Màu |
| ---- | -------- | ---------------- | --- |
| D | **Rô Xung Phong** | Luôn giơ tay trước, tay cầm cờ | Cam `#FF6F00` |
| I | **Rô Kể Chuyện** | Miệng loa, xung quanh có bong bóng thoại | Vàng `#FFB300` |
| S | **Rô Giữ Nhịp** | Tay đỡ, chân đứng vững, mắt hiền | Xanh lá `#2E9E6B` |
| C | **Rô Tỉ Mỉ** | Kính lúp, bảng kiểm trên tay | Tím `#610B8A` |

> Tên nhân vật nằm trong `config/disc-tu-dien.ts`. Đổi tên = sửa một file, không đụng code.
> Phương án dự phòng nếu chủ dự án muốn quen thuộc hơn: Đại bàng (D) · Chim công (I) ·
> Bồ câu (S) · Cú mèo (C) — bộ này đã phổ biến trong nội dung DISC tiếng Việt.

### 3.2 🔴 RANH GIỚI TUỔI TỰ ĐÁNH GIÁ — quyết định chuyên môn quan trọng nhất

Đây là chỗ mà một sản phẩm DISC cho trẻ em hoặc là đứng vững, hoặc là bịa số.

**Bằng chứng:**

- **Phương sai do "gật bừa" (acquiescence) ở trẻ em lớn gấp đôi người lớn.** Trẻ có xu hướng
  trả lời "đúng/có" bất kể nội dung câu hỏi.
- **Công cụ chuẩn cho lứa 3–7 tuổi là bảng do PHỤ HUYNH điền, không phải trẻ tự điền.**
  Children's Behavior Questionnaire (Rothbart) — công cụ đo khí chất trẻ 3–7 tuổi được dùng
  rộng rãi nhất thế giới — là **parent-report**, bản rất ngắn 36 mục. Không tồn tại bản trẻ
  mẫu giáo tự làm, vì lứa tuổi đó chưa có khả năng nhìn lại bản thân theo kiểu đặc điểm.
- **Số mức trả lời càng ít càng tốt với trẻ nhỏ:** khoảng 4 mức là tối ưu, trên 7 mức thì độ
  tin cậy giảm.
- **Có cả một dòng nghiên cứu chỉ để trả lời câu "từ tuổi nào trẻ tự báo cáo được"**
  (validity-index approach, Conijn & cs.) — bản thân sự tồn tại của dòng nghiên cứu này là
  bằng chứng rằng câu trả lời **không phải "mọi lứa tuổi đều được"**.

**Kết luận áp vào sản phẩm:**

| Tuổi | Lớp | Ai trả lời | Vì sao |
| ---- | --- | ---------- | ------ |
| **3–5** | Mầm non | 🔴 **Người lớn quan sát** | Chưa có khả năng tự nhìn lại bản thân. Trẻ tự tick = số ngẫu nhiên có hình dạng đẹp |
| **6–7** | Lớp 1–2 | 🔴 **Người lớn quan sát** | Đọc được chữ nhưng vẫn gật bừa nặng. 8 tuổi là sàn thực dụng cho tự đánh giá |
| **8–11** | Lớp 3–5 | ✅ Bé tự làm, **3 mức**, có người lớn ngồi cạnh đọc hộ nếu cần | Đã tự báo cáo được với câu ngắn, cụ thể, thang ít mức |
| **11–15** | Lớp 6–9 | ✅ Tự làm, **5 mức** | Tự báo cáo ổn định |
| Người lớn | — | ✅ Tự làm, **5 mức** | — |

⚠️ **Hệ quả giao diện bắt buộc:** người dùng chọn "Tiểu học" thì app phải **hỏi lớp mấy**, và
lớp 1–2 được chuyển sang bản quan sát **kèm một câu giải thích hiện ra**. Chuyển im lặng là
lừa người dùng; không chuyển là bịa số. (Chi tiết mục 4.2)

⚠️ **Hệ quả nội dung bắt buộc:** báo cáo của bộ mầm non và tiểu học phải mở đầu bằng câu
*"Đây là gợi ý để trò chuyện với con, không phải kết luận về con."* Tính cách trẻ em còn đang
hình thành — nói chắc nịch về một đứa trẻ 5 tuổi là vượt quá thứ công cụ này đo được.

### 3.3 🔴 CẠM BẪY BẢN QUYỀN

Marston công bố mô hình DISC năm 1928 và **không đăng ký bản quyền bài test** ⇒ lý thuyết
bốn nhân tố thuộc phạm vi công cộng, ai cũng được dựng bài đánh giá dựa trên nó.

**Nhưng bộ 28 nhóm từ của "DISC Classic" và toàn bộ hệ thống "Everything DiSC®" là tài sản
của John Wiley & Sons** — có bản quyền nội dung, có nhãn hiệu đăng ký. Chi tiết đáng nhớ:
*chữ "i" viết thường trong DiSC® chính là dấu hiệu nhãn hiệu của Wiley.*

**Bằng chứng tìm thấy ngay trong mã nguồn mở:** repo `cahyadsn/disc` (57★, MIT, còn cập nhật
8/2026) ship trọn bộ máy chấm điểm DISC Classic — bảng cường độ → phân khúc 1–7, ba đồ thị,
15 kiểu hành vi cổ điển — **nhưng 112 từ trong `db/disc.sql` đều để trống**: `'term1'`,
`'term2'` … `'term112'`. Tác giả cố ý không đóng gói bộ từ.

⇒ **Bộ máy chấm lấy được hợp pháp. Bộ TỪ thì không.**

**Ba luật bắt buộc:**

1. **Tự viết bộ câu tiếng Việt.** Không dịch bộ từ của bên bán; không chép từ các trang test
   miễn phí trong nước (phần lớn cũng đang chép của nhau). → Mục 6 đã viết sẵn.
2. **Viết "DISC" in hoa toàn bộ.** Không dùng *DiSC*. Không mượn màu, biểu đồ, tên báo cáo,
   hay tên kiểu hành vi của Wiley.
3. **Không tuyên bố "chuẩn quốc tế" hay bất kỳ con số chính xác nào.** Chưa có bộ dữ liệu
   chuẩn hoá trên người Việt thì lời hứa đó là **một cái nút dối**. Câu được phép dùng:
   *"Bộ câu hỏi do SATA ROBO biên soạn theo mô hình DISC."*

### 3.4 Chọn dạng câu hỏi — và vì sao "chuẩn cổ điển" lại là dạng sai

| Dạng | Điểm mạnh | Vì sao KHÔNG chọn / CHỌN |
| ---- | --------- | ------------------------ |
| **Ép chọn nhất/nhì**<br>24–28 nhóm × 4 tính từ | Chống thiên vị "trả lời cho đẹp" tốt nhất — bốn lựa chọn đều nghe tích cực như nhau | ❌ **① Điểm ipsative** — chỉ so được trong nội bộ một người, không so được giữa người với người, mà "so con mình với các bạn" đúng là thứ phụ huynh sẽ làm.<br>❌ **② Không đo được độ tin cậy** theo cách thông thường, vì bốn mục trong một nhóm phụ thuộc nhau.<br>❌ **③ Nghiên cứu chỉ thẳng vào ca của ta:** dạng ép chọn cho độ tin cậy thấp ở *bài thiết kế đơn giản — ít nhân tố hoặc bài ngắn*. DISC có đúng 4 nhân tố và ta muốn bài ngắn.<br>❌ **④ ~25 phút**, và bắt trẻ cân bốn tính từ trừu tượng cùng lúc 28 lần |
| **Likert + câu đảo chiều** | Nội quán đo được (thường 0,85–0,95) · so sánh được giữa người với người · một câu một lần · chấm bằng phép cộng, ai cũng kiểm lại bằng tay được | ✅ **CHỌN.** Nhược điểm duy nhất — thiên vị "trả lời cho đẹp" và tật tick một cột — được **câu đảo chiều** giải quyết, và câu đảo chiều không tốn thêm câu nào |
| **Hỗn hợp** | Tốt hơn ép chọn thuần ở thiết kế đơn giản | ⏳ Để dành bản 2, nếu dữ liệu thật cho thấy có tô hồng |

---

## 4. ĐỐI TƯỢNG & BỘ ĐỀ

### 4.1 Năm bộ đề

> Bốn nhóm người dùng, **năm** bộ đề — vì phụ huynh làm hai việc khác nhau: tự đánh giá mình,
> và quan sát con.

| Mã bộ | Tên hiển thị | Ai trả lời | Về ai | Số câu | Thang | Thời gian |
| ----- | ------------ | ---------- | ----- | ------ | ----- | --------- |
| **MN** | Mầm non | Phụ huynh / giáo viên | Bé 3–7 tuổi | 20 (5/trục) | 5 mức **tần suất** | 5–6′ |
| **TH** | Tiểu học | **Học sinh** lớp 3–5 | Chính mình | 20 (5/trục) | 3 mức có mặt cười | 5–7′ |
| **THCS** | Trung học cơ sở | **Học sinh** lớp 6–9 | Chính mình | 24 (6/trục) | 5 mức **đồng ý** | 6–8′ |
| **PH** | Phụ huynh | Phụ huynh | Chính mình | 24 (6/trục) | 5 mức **đồng ý** | 6–8′ |
| **QS** | Bố mẹ nhìn con | Phụ huynh | Con 8–15 tuổi | 16 (4/trục) | 5 mức **đồng ý** | 4–5′ |

**Vì sao thang khác nhau:**

- **MN dùng thang TẦN SUẤT** ("Hầu như luôn → Hầu như không"), không dùng thang đồng ý. Người
  quan sát đếm được số lần thấy hành vi; họ không "đồng ý" hay "không đồng ý" với một câu mô
  tả con mình. Đây cũng là cách CBQ làm.
- **TH dùng 3 mức**, không dùng 5. Trẻ 8–11 phân biệt tin cậy được ba mức; năm mức chỉ tạo ra
  ảo giác về độ mịn. Ba mức kèm mặt cười: 😀 *Đúng rồi* · 😐 *Đôi khi* · 🙁 *Không phải*.
- **QS chỉ 16 câu** và **chỉ hỏi hành vi quan sát được**. Không hỏi cảm xúc bên trong của con
  — cha mẹ không quan sát được thứ đó, hỏi là mời họ đoán.

### 4.2 Luật định tuyến

```
Vào khoang DISC
  │
  ├─ [Mầm non]  ──────────────────────────────────► bộ MN  (người lớn điền)
  │
  ├─ [Tiểu học] ──► Hỏi: "Bé đang học lớp mấy?"
  │                   ├─ Lớp 1 · Lớp 2 ──► bộ MN  ⚠️ HIỆN GIẢI THÍCH
  │                   └─ Lớp 3 · 4 · 5 ──► bộ TH  (bé tự làm)
  │
  ├─ [THCS] ──────────────────────────────────────► bộ THCS (tự làm)
  │
  └─ [Phụ huynh] ──► Hỏi: "Bạn muốn làm gì?"
                      ├─ "Tìm hiểu về chính tôi" ──► bộ PH
                      └─ "Trả lời về con tôi"    ──► bộ QS
                                                     (⚠️ chỉ mở khi con ≥ 8 tuổi;
                                                      con < 8 → chuyển sang bộ MN)
```

**Văn bản giải thích khi chuyển lớp 1–2 sang bản quan sát** (bắt buộc hiện, không được bỏ):

> **Lớp 1–2 dùng bản dành cho người lớn trả lời.**
> Trẻ dưới 8 tuổi chưa tự nhìn lại được tính cách của mình, nên kết quả bé tự tick sẽ không
> đáng tin. Bố mẹ hoặc thầy cô trả lời giúp — dựa trên những gì thật sự nhìn thấy trong
> khoảng hai tuần gần đây.

---

## 5. KIẾN TRÚC THÔNG TIN & GIAO DIỆN

### 5.1 Thanh bên trái — thêm mục DISC

Giữ **nguyên concept giao diện hiện tại** (`app/components/thanh-ben.tsx` của TAO_ANH):

| Thành phần | Đặc tả kế thừa |
| ---------- | -------------- |
| Khung ngoài | `<aside>` rộng `264px`, `shrink-0`, nền trắng, viền phải `border-neutral-200` |
| Đầu thanh | Logo chữ `SATA` (cam `#FF6F00`) + `ROBO` (tím `#800080`), `text-2xl font-extrabold`. Dòng phụ chữ hoa nhỏ `text-[11px] uppercase tracking-widest text-neutral-400` — đổi từ *"Xưởng tạo ảnh"* thành **"Xưởng khám phá"** hoặc tên mới |
| Mỗi mục | `<button>` bo `rounded-xl`, `px-3 py-2.5`, icon SVG 19px bên trái, tên `text-[15px]`, mô tả `text-[11px] text-neutral-500` bên dưới |
| Mục đang mở | Nền `rgba(97,11,138,0.09)`, chữ `#610B8A`, `font-semibold`, `aria-current="page"` |
| Mục chưa xong | Nhãn xám tròn bên phải tên (`"đang dựng"`) — **đừng để bấm vào rồi mới ngã ngửa** |
| Đáy thanh | Thẻ cam kết: icon khiên + *"Câu trả lời không rời máy bạn"* |
| Nhớ chỗ đang mở | `localStorage` khoá `disc:khoang-dang-mo`, đọc trong `useEffect` (không đọc lúc dựng HTML tĩnh — sẽ lệch hydration) |

**Icon cho mục DISC** — bốn ô vuông chia bốn góc (gợi ma trận 4 nhân tố), nét
`stroke-width 1.7`, `strokeLinecap="round"`, khớp bộ icon hiện có:

```
<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
  <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
  <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
  <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
  <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
</svg>
```

**Khai báo mục** — vào `config/tu-dien.ts` theo đúng khuôn đang có, KHÔNG gõ chữ thẳng vào
component:

```ts
export type MaKhoang = "disc" | "lich-su" | /* ...các khoang khác... */;

export const TEN_KHOANG: Record<MaKhoang, string> = {
  disc: "DISC",
  "lich-su": "Bài đã làm",
};

export const MO_TA_KHOANG: Record<MaKhoang, string> = {
  disc: "Trắc nghiệm hành vi cho học sinh và phụ huynh",
  "lich-su": "Kết quả đã lưu trên máy này",
};
```

### 5.2 Sơ đồ màn hình

```
DISC (khoang)
 │
 ├── M1  Ai đang cầm máy?          2 thẻ: Em học sinh (tự làm) · Bố mẹ hoặc thầy cô
 │        ├─ nhánh HỌC SINH        hỏi lớp MỘT lần, trải lớp 1–12 + ô "Đã qua lớp 12"
 │        │     lớp 1–2 → bộ MN kèm hộp giải thích (ADR-002) · lớp 3–5 → TH
 │        │     lớp 6–9 → THCS · lớp 10–12 và đã-qua-lớp-12 → PH (ADR-005 §11.5)
 │        └─ nhánh NGƯỜI LỚN       "làm cho ai?" → về mình = PH
 │                                 → về con: hỏi tuổi · dưới 8 → MN kèm giải thích · từ 8 → QS
 │
 ├── M2  Trước khi bắt đầu       4 dòng: bao lâu · không có đúng sai · dữ liệu không rời máy
 │                                · trả lời theo phản xạ đầu tiên
 │        └─ Ô nhập TÊN (tên thật được phép — ADR-005 lật §10.2)
 │
 ├── M3  Làm bài                 MỌI bộ đề: 5 câu/màn (ADR-006 lật luật cũ)
 │                               mỗi câu một THẺ CÓ KHUNG, số thứ tự theo cả bài,
 │                               viền trái tím → cam khi đã chọn
 │        · thanh tiến trình · nút Quay lại · tự lưu nháp sau mỗi câu
 │        · bấm Tiếp khi còn trống ⇒ báo lỗi VÀ cuộn tới đúng câu thiếu
 │
 ├── M4  Kết quả                 biểu đồ 4 cột + nhân vật trội + phổ + 3 khối diễn giải
 │        └─ ba dải theo người đọc (chung · con · bố mẹ / tự đọc), in tách bản
 │        └─ nút Tải ảnh kết quả (PNG) · nút Tải PDF · nút Làm lại
 │
 ├── M5  Vùng lệch               CHỈ hiện khi có đủ bài của con + bài QS của bố mẹ
 │                               (mục 8) — nếu chưa đủ thì hiện lời mời làm nốt bài kia
 │
 ├── M6  Bảng gia đình           một bảng liệt kê cả nhà: ai đã làm, ai chưa (ADR-007)
 │                               thay màn "Bài đã làm" xếp theo thời gian
 │        · mở lại · xoá · xuất .zip sao lưu
 │
 └── M7  Số liệu máy này         số bài · số người khác nhau · đã đạt 2 người chưa · phễu
                                 CHỈ ĐỌC, không gửi đi đâu (§11.6)
```

> **Cập nhật 27/08/2026 (GĐ10, hạng mục 10.6).** M1 trước đây bày bốn thẻ trộn hai câu
> hỏi khác nhau: ba thẻ nói về NGƯỜI ĐƯỢC ĐÁNH GIÁ, một thẻ nói về NGƯỜI TRẢ LỜI. Hậu quả
> đo được là bố mẹ của một bé lớp 1 có HAI cửa cùng dẫn tới bộ Mầm non (bấm *Tiểu học →
> Lớp 1*, hoặc *Phụ huynh → về con → 6 tuổi*) — cửa nào cũng đúng nên chẳng cửa nào hiển
> nhiên. Tách theo NGƯỜI CẦM MÁY thì mỗi bộ đề còn đúng một cửa, và tuổi/lớp chỉ hỏi một
> lần. **`dinhTuyen()` không đổi một dòng** — chỉ đổi cách màn 1 thu thập đầu vào.

**Quy tắc màn hình M3 với trẻ nhỏ (MN, TH):**

> 🔴 **Cập nhật 27/08/2026 — ADR-006 lật luật "một câu một màn".** Luật cũ ghi *MN và TH:
> một câu một màn*. Chạy thử GĐ10 cho thấy cái giá ở đầu kia: bộ TH 20 câu thành **20 lần
> bấm *Tiếp***. Nay **mọi bộ đề đều 5 câu/màn**, và phần bảo vệ trẻ nhỏ chuyển sang khung
> thẻ + cỡ chữ + cỡ nút. Đọc ADR-006 trước khi đụng vào con số này.

- **Năm câu một màn**, mỗi câu là một **thẻ có khung** — không có khung thì năm câu dính
  vào nhau và mắt không có gì để bám mà tách chúng ra.
- **Số thứ tự đếm theo CẢ BÀI** (`11`), không theo trang. **Viền trái đổi tím → cam** khi
  câu đã được chọn.
- 🔴 Nút trả lời cao tối thiểu `56px`, chữ tối thiểu `18px`, khoảng cách giữa các nút ≥
  `12px` — ngón tay trẻ con và ngón tay phụ huynh cầm điện thoại. **Luật này khoá theo
  `canNutTo()` trong `config/disc-nguong.ts`, KHÔNG suy từ số câu trên màn.** Suy từ số câu
  là đúng lỗi ADR-006 mục "Lý do" mô tả.
- **Không có đồng hồ đếm ngược.** Áp lực thời gian làm hỏng dữ liệu.
- Sau mỗi 5 câu: một dòng động viên nhẹ (*"Xong 5 câu rồi, giỏi lắm!"*).
- Bấm *Tiếp* khi còn câu trống ⇒ báo lỗi **và cuộn tới đúng câu còn thiếu**.

### 5.3 Quy ước giao diện kế thừa

| Hạng mục | Giá trị | Nguồn |
| -------- | ------- | ----- |
| Tím công nghệ | `#610B8A` | `config/thuong-hieu.ts` → `MAU.timCongNghe` |
| Tím phụ | `#6B21A8` | `MAU.timCongNghePhu` |
| Cam năng lượng | `#FF8F2D` | `MAU.camNangLuong` |
| Logo SATA / ROBO | `#FF6F00` / `#800080` | `MAU_LOGO` — **Brand DNA cấm đổi, kể cả sang màu gần giống** |
| Tỷ lệ màu | trắng 55–65% · tím 20–30% · cam 10–15% | `TY_LE_MAU` |
| Font | Be Vietnam Pro (Regular + Bold) | `FONT` — ⚠️ lựa chọn TẠM theo ADR-004 |
| Nền tối | **Cấm** — Brand DNA cấm "nền tối nặng" | Brand DNA |
| Bo góc | `rounded-xl` cho thẻ và nút điều hướng | thanh-ben.tsx |
| Chữ tiếng Việt | 100% có dấu, từ điển duy nhất ở `config/` | `.claude/rules/ngon-ngu-ui.md` |

---

## 6. NGÂN HÀNG CÂU HỎI

> **Toàn bộ 104 câu dưới đây là nội dung mới, viết cho tài liệu này.** Đưa vào
> `config/disc-cau-hoi.ts`. Cột **Đảo** = câu đảo chiều (đồng ý cao ⇒ điểm THẤP cho trục đó).
>
> 🔴 **Luật khi sửa nội dung câu:** mỗi trục phải giữ **ít nhất một câu đảo chiều**. Gỡ câu
> đảo cuối cùng của một trục là gỡ hàng rào chống tick-một-cột — lỗi **im lặng**, bài vẫn
> chạy, chỉ sai kết quả.

### 6.1 Bộ MN — Mầm non & lớp 1–2 (người lớn quan sát) — 20 câu

**Thang tần suất 5 mức:** `1` Hầu như không · `2` Hiếm khi · `3` Thỉnh thoảng ·
`4` Thường xuyên · `5` Hầu như luôn.

**Câu dẫn hiện trên đầu mỗi trang:** *"Nghĩ về hai tuần gần đây. Bé thường…"*

| Mã | Trục | Đảo | Nội dung |
| -- | ---- | --- | -------- |
| `MN-D1` | D | | Tự chọn trò chơi rồi rủ bạn chơi theo cách của mình |
| `MN-D2` | D | | Đòi tự làm, không muốn người lớn làm giúp |
| `MN-D3` | D | | Phản ứng ngay khi bị lấy mất đồ chơi |
| `MN-D4` | D | | Không ngại thử trò chơi mới mà bé chưa biết |
| `MN-D5` | D | ✔ | Chờ người lớn bảo mới bắt đầu làm |
| `MN-I1` | I | | Kể lại chuyện ở lớp ngay khi về đến nhà |
| `MN-I2` | I | | Bắt chuyện với người lạ mà không nép |
| `MN-I3` | I | | Thích hát, múa, diễn trước mọi người |
| `MN-I4` | I | | Nét mặt và cử chỉ rất phong phú khi nói |
| `MN-I5` | I | ✔ | Chơi một mình rất lâu mà không cần bạn |
| `MN-S1` | S | | Nhường đồ chơi cho bạn |
| `MN-S2` | S | | Cần biết trước sắp làm gì thì mới yên tâm |
| `MN-S3` | S | | An ủi khi thấy bạn hoặc người nhà buồn |
| `MN-S4` | S | | Giữ một thói quen (ăn, ngủ, cất đồ) rất đều |
| `MN-S5` | S | ✔ | Thích đổi chỗ, đổi trò, đổi việc liên tục |
| `MN-C1` | C | | Để ý và nhắc khi có gì đặt sai chỗ |
| `MN-C2` | C | | Làm theo đúng thứ tự người lớn dặn |
| `MN-C3` | C | | Ngồi lâu với một việc cần tỉ mỉ (xếp hình, tô màu) |
| `MN-C4` | C | | Hỏi "vì sao" rất nhiều |
| `MN-C5` | C | ✔ | Làm cho xong rồi bỏ đó, không quan tâm gọn hay không |

### 6.2 Bộ TH — Tiểu học lớp 3–5, bé tự làm — 20 câu

**Thang 3 mức:** `1` 🙁 Không phải · `2` 😐 Đôi khi · `3` 😀 Đúng rồi.

**Câu dẫn:** *"Đọc từng câu và chọn cái giống em nhất. Không có câu nào đúng hay sai cả."*

| Mã | Trục | Đảo | Nội dung |
| -- | ---- | --- | -------- |
| `TH-D1` | D | | Khi chơi trò mới, em thường là người bày cách chơi |
| `TH-D2` | D | | Em xung phong lên bảng |
| `TH-D3` | D | | Em nói ra khi thấy bạn làm chưa đúng |
| `TH-D4` | D | | Em thích thi xem ai nhanh hơn |
| `TH-D5` | D | ✔ | Trong nhóm, em thường để bạn khác chọn giúp |
| `TH-I1` | I | | Em thích kể chuyện cho các bạn nghe |
| `TH-I2` | I | | Em làm quen với bạn mới rất nhanh |
| `TH-I3` | I | | Em thích được cô khen trước lớp |
| `TH-I4` | I | | Em hay pha trò cho các bạn cười |
| `TH-I5` | I | ✔ | Em thích chơi một mình hơn chơi với nhóm đông |
| `TH-S1` | S | | Em chờ đến lượt mình mà không sốt ruột |
| `TH-S2` | S | | Em cho bạn mượn đồ của em |
| `TH-S3` | S | | Em thấy vui khi mọi việc giống hôm qua |
| `TH-S4` | S | | Em dỗ bạn khi bạn khóc |
| `TH-S5` | S | ✔ | Đổi chỗ ngồi hay đổi lịch học không làm em thấy khó chịu |
| `TH-C1` | C | | Em xếp đồ của em theo đúng chỗ |
| `TH-C2` | C | | Em soát lại bài trước khi nộp |
| `TH-C3` | C | | Em làm đúng như cô dặn |
| `TH-C4` | C | | Em hỏi lại cho rõ trước khi làm |
| `TH-C5` | C | ✔ | Em làm nhanh cho xong, sai chỗ nào sửa sau |

### 6.3 Bộ THCS — Lớp 6–9, tự làm — 24 câu

**Thang 5 mức:** `1` Rất không giống mình · `2` Không giống lắm · `3` Nửa nọ nửa kia ·
`4` Khá giống mình · `5` Rất giống mình.

| Mã | Trục | Đảo | Nội dung |
| -- | ---- | --- | -------- |
| `THCS-D1` | D | | Khi cả nhóm còn đang bàn, mình là người nói "thôi cứ làm cách này đi" |
| `THCS-D2` | D | | Mình xung phong nhận phần khó nhất của bài nhóm |
| `THCS-D3` | D | | Mình nói thẳng khi thấy bạn làm sai, dù bạn có thể phật lòng |
| `THCS-D4` | D | | Mình thích những việc có thắng thua rõ ràng |
| `THCS-D5` | D | | Bị phản đối không làm mình bỏ ý kiến của mình |
| `THCS-D6` | D | ✔ | Trong nhóm, mình thường để bạn khác quyết rồi làm theo |
| `THCS-I1` | I | | Mình bắt chuyện được với bạn mới mà không thấy ngại |
| `THCS-I2` | I | | Mình thuyết phục bạn bằng cách kể chuyện hơn là đưa số liệu |
| `THCS-I3` | I | | Mình thích đứng trước lớp trình bày |
| `THCS-I4` | I | | Bạn bè hay tìm mình khi muốn rủ đi đâu đó |
| `THCS-I5` | I | | Mình dễ làm không khí nhóm vui lên |
| `THCS-I6` | I | ✔ | Mình thấy mệt sau khi ở chỗ đông người |
| `THCS-S1` | S | | Mình làm xong việc đang dở rồi mới bắt việc mới |
| `THCS-S2` | S | | Bạn bè hay kể chuyện buồn cho mình nghe |
| `THCS-S3` | S | | Mình nhường phần mình thích để nhóm khỏi tranh cãi |
| `THCS-S4` | S | | Mình thấy yên tâm khi biết trước hôm nay sẽ làm gì |
| `THCS-S5` | S | | Mình chờ được lâu mà không sốt ruột |
| `THCS-S6` | S | ✔ | Lịch sinh hoạt cứ lặp lại mãi một kiểu làm mình thấy bí bách |
| `THCS-C1` | C | | Mình dò lại bài một lượt nữa dù đã làm xong |
| `THCS-C2` | C | | Mình đọc kỹ hướng dẫn trước khi bắt tay vào làm |
| `THCS-C3` | C | | Mình khó chịu khi việc làm ẩu mà vẫn được cho qua |
| `THCS-C4` | C | | Mình hay hỏi lại "vì sao lại làm thế" trước khi đồng ý |
| `THCS-C5` | C | | Mình ghi chép lại để khỏi quên |
| `THCS-C6` | C | ✔ | Mình bắt tay vào làm trước rồi tính sau |

### 6.4 Bộ PH — Phụ huynh tự đánh giá — 24 câu

**Thang 5 mức:** `1` Rất không đúng với tôi → `5` Rất đúng với tôi.

| Mã | Trục | Đảo | Nội dung |
| -- | ---- | --- | -------- |
| `PH-D1` | D | | Trong nhà, tôi là người ra quyết định cuối cùng |
| `PH-D2` | D | | Tôi nói thẳng vấn đề thay vì vòng vo |
| `PH-D3` | D | | Khi có việc gấp, tôi làm luôn chứ không đợi bàn thêm |
| `PH-D4` | D | | Tôi đặt mục tiêu cao cho bản thân và cho con |
| `PH-D5` | D | | Tôi giữ lập trường ngay cả khi bị phản đối |
| `PH-D6` | D | ✔ | Tôi thường để người khác quyết cho nhanh việc |
| `PH-I1` | I | | Tôi dễ bắt chuyện với phụ huynh khác |
| `PH-I2` | I | | Tôi thuyết phục con bằng cách kể chuyện hơn là ra lệnh |
| `PH-I3` | I | | Người khác nói tôi là người vui vẻ, dễ gần |
| `PH-I4` | I | | Tôi thích tham gia hoạt động tập thể của lớp con |
| `PH-I5` | I | | Tôi hay động viên, khen ngợi thành tiếng |
| `PH-I6` | I | ✔ | Tôi ngại nói trước đông người |
| `PH-S1` | S | | Tôi giữ nếp sinh hoạt gia đình đều đặn |
| `PH-S2` | S | | Tôi nhường để nhà cửa êm ấm |
| `PH-S3` | S | | Tôi kiên nhẫn nghe con nói hết |
| `PH-S4` | S | | Tôi cần thời gian để quen với thay đổi lớn |
| `PH-S5` | S | | Người thân hay tìm tôi để tâm sự |
| `PH-S6` | S | ✔ | Tôi thích xáo trộn, thay đổi cho mới mẻ |
| `PH-C1` | C | | Tôi tìm hiểu kỹ trước khi chọn lớp học cho con |
| `PH-C2` | C | | Tôi giữ giấy tờ, hoá đơn, sổ sách ngăn nắp |
| `PH-C3` | C | | Tôi khó chịu khi việc làm qua loa |
| `PH-C4` | C | | Tôi muốn có số liệu rõ ràng rồi mới quyết |
| `PH-C5` | C | | Tôi lên kế hoạch trước cho các việc lớn |
| `PH-C6` | C | ✔ | Tôi quyết theo cảm giác nhiều hơn theo cân nhắc |

### 6.5 Bộ QS — Bố mẹ nhìn con (con 8–15 tuổi) — 16 câu

🔴 **Luật thiết kế riêng của bộ này: mỗi câu phải SOI GƯƠNG một câu cụ thể trong bộ con làm.**
Cột `soi-guong` là bắt buộc — nó là thứ làm cho "vùng lệch" ở mục 8 so được ở mức từng câu,
chứ không chỉ ở mức điểm tổng. Thêm câu vào bộ QS mà không khai `soi-guong` là làm hỏng
tính năng chủ lực.

**Thang 5 mức:** `1` Rất không đúng với con tôi → `5` Rất đúng với con tôi.

| Mã | Trục | Đảo | Nội dung | soi-gương |
| -- | ---- | --- | -------- | --------- |
| `QS-D1` | D | | Con tôi tự quyết rồi mới báo, hơn là hỏi ý trước | `THCS-D1` / `TH-D1` |
| `QS-D2` | D | | Con tôi nhận phần khó về mình | `THCS-D2` / `TH-D2` |
| `QS-D3` | D | | Con tôi nói thẳng khi thấy điều gì chưa đúng | `THCS-D3` / `TH-D3` |
| `QS-D4` | D | ✔ | Con tôi thường đợi người khác quyết rồi làm theo | `THCS-D6` / `TH-D5` |
| `QS-I1` | I | | Về đến nhà, con kể ngay chuyện xảy ra ở lớp | `THCS-I2` / `TH-I1` |
| `QS-I2` | I | | Con tôi làm quen với bạn mới rất nhanh | `THCS-I1` / `TH-I2` |
| `QS-I3` | I | | Con tôi thích trình bày, biểu diễn trước mọi người | `THCS-I3` / `TH-I3` |
| `QS-I4` | I | ✔ | Con tôi thích ở một mình sau khi đi chơi về | `THCS-I6` / `TH-I5` |
| `QS-S1` | S | | Con tôi nhường bạn để khỏi tranh cãi | `THCS-S3` / `TH-S2` |
| `QS-S2` | S | | Con tôi cần biết trước lịch thì mới yên tâm | `THCS-S4` / `TH-S3` |
| `QS-S3` | S | | Con tôi chờ được lâu mà không sốt ruột | `THCS-S5` / `TH-S1` |
| `QS-S4` | S | ✔ | Đổi lịch đột ngột không làm con tôi khó chịu | `THCS-S6` / `TH-S5` |
| `QS-C1` | C | | Con tôi soát lại bài trước khi nộp | `THCS-C1` / `TH-C2` |
| `QS-C2` | C | | Con tôi hỏi lại cho rõ trước khi bắt tay vào làm | `THCS-C4` / `TH-C4` |
| `QS-C3` | C | | Con tôi khó chịu khi đồ đạc lộn xộn | `THCS-C3` / `TH-C1` |
| `QS-C4` | C | ✔ | Con tôi làm trước rồi tính sau | `THCS-C6` / `TH-C5` |

### 6.6 Thứ tự hiển thị — luật trộn

🔴 **Không hiển thị theo thứ tự trong bảng.** Bốn câu cùng đo một trục nằm liền nhau thì
người làm đọc ra ngay bài đang đo gì, và bắt đầu trả lời cho hình ảnh mình muốn có.

**Luật sinh thứ tự** (chạy một lần, kết quả chốt cứng vào `config/`, KHÔNG random lúc chạy —
random thì hai lần làm bài ra hai thứ tự khác nhau, không đối chiếu được):

1. Chia thành các **vòng 4 câu**, mỗi vòng đủ D–I–S–C.
2. Thứ tự trục trong vòng **xoay** qua từng vòng: `D I S C` → `I S C D` → `S C D I` →
   `C D I S` → `D S I C` → `S I C D`.
3. **Hai câu đảo của hai trục khác nhau không được đứng cạnh nhau**, và mỗi câu đảo nằm ở
   một vòng khác nhau.
4. Câu đầu tiên của bài luôn là câu **thuận**, dễ, không nhạy cảm — để người làm vào nhịp.

⚠️ Có test tự động canh ba luật này (mục 14, hạng mục `CH.3`). Đừng gỡ.

---

## 7. THUẬT TOÁN CHẤM ĐIỂM

> Toàn bộ ngưỡng nằm trong `config/disc-nguong.ts`. Không hardcode.

### 7.1 Bước 1 — đảo chiều

```
giaTri(cau) = cau.dao ? (mucToiDa + 1) - raw : raw
```
Thang 5: `5→1, 4→2, 3→3, 2→4, 1→5`. Thang 3: `3→1, 2→2, 1→3`.

### 7.2 Bước 2 — chuẩn hoá về thang 0–100

```
tong(truc)   = Σ giaTri(cau) với cau.truc === truc
diem(truc)   = ((tong - soCau) / (soCau × (mucToiDa - 1))) × 100
```

Ví dụ THCS, trục D, 6 câu, thang 5: tổng thấp nhất `6`, cao nhất `30`, biên độ `24`.
Tổng `21` ⇒ `((21-6)/24)×100 = 62,5`.

**Vì sao chuẩn hoá:** năm bộ đề có số câu và số mức khác nhau. Không quy về cùng thang thì
không bao giờ đối chiếu được bài của con với bài của bố mẹ — tức là mất tính năng chủ lực.

### 7.3 Bước 3 — kiểm tính hợp lệ (chạy TRƯỚC khi trả kết quả)

| Mã | Kiểm gì | Ngưỡng gợi ý | Xử lý |
| -- | ------- | ------------ | ----- |
| `HL-1` | **Trả lời phẳng** — tỷ lệ câu chọn đúng mức giữa | `> 40%` | 🔴 **KHÔNG trả kết quả.** Hiện: *"Bài này chưa đủ để kết luận — hầu hết câu đều ở mức giữa. Làm lại và chọn ngả về một bên nhé."* |
| `HL-2` | **Tick một cột** — số câu liên tiếp cùng một đáp án | `≥ 8` | ⚠️ Trả kết quả kèm cảnh báo trên đầu báo cáo |
| `HL-3` | **Mâu thuẫn thuận/đảo** — trung bình 4 trục của `\|TB(câu thuận) − TB(câu đảo, sau khi đảo)\|` | `> 1,5` (thang 5)<br>`> 0,9` (thang 3) | ⚠️ Trả kết quả kèm cảnh báo *"Có vài câu bạn trả lời ngược nhau"* |
| `HL-4` | **Bấm bừa** — thời gian trung bình mỗi câu | `< 2,5 giây` | ⚠️ Cảnh báo |
| `HL-5` | **Bỏ trống** — số câu chưa trả lời | `≥ 1` | 🔴 Không cho bấm Xem kết quả; chỉ vào đúng câu còn thiếu |

`HL-1` là hàng rào quan trọng nhất và cũng là thứ hầu hết test miễn phí ngoài kia không có.
Trả một hồ sơ dựng trên toàn số 3 là dựng lâu đài trên cát.

> ⚠️ `HL-1` chỉ áp cho thang **lẻ** (3 và 5 mức, có mức giữa thật). Nếu có ngày đổi sang thang
> chẵn thì phải tắt kiểm này, không phải để nó chạy vào khoảng trống.

### 7.4 Bước 4 — xác định kiểu

Xếp bốn điểm giảm dần `d1 ≥ d2 ≥ d3 ≥ d4`. Đặt `NGUONG_PHA = 8` (điểm trên thang 100).

| Điều kiện | Kết luận | Cách viết |
| --------- | -------- | --------- |
| `d1 − d2 ≥ NGUONG_PHA` | **Kiểu đơn** | Một nhân vật trội: *"Rô Xung Phong"* |
| `d1 − d2 < NGUONG_PHA` | **Kiểu pha** | Hai nhân vật, viết theo **thứ tự cố định D-I-S-C**: `DI`, `DS`, `DC`, `IS`, `IC`, `SC` — sáu cặp, không phải mười hai |
| `d1 − d4 < NGUONG_PHA` | **Phổ đều** | 🔴 **Không ép kiểu.** Hiện: *"Bốn nhóm hành vi của bạn khá cân bằng — chưa có nhóm nào nổi rõ. Điều này bình thường, nhất là với trẻ đang lớn."* |

🔴 **Luật viết báo cáo:** trả về **phổ**, không trả về một chữ cái. Ép nhãn cứng là cách
nhanh nhất để một phụ huynh đọc xong rồi nói *"không đúng con tôi"* — và mất luôn niềm tin
vào cả sản phẩm.

### 7.5 Hợp đồng hàm (để dev viết test trước)

```ts
// modules/disc-cham-diem/cham.ts — hàm THUẦN, không đụng DOM, không đụng localStorage
export type MaTruc = "D" | "I" | "S" | "C";

export type KetQua =
  | { hopLe: false; lyDo: "PHANG" | "THIEU_CAU"; thongDiep: string }
  | {
      hopLe: true;
      diem: Record<MaTruc, number>;        // 0–100, làm tròn 1 chữ số thập phân
      xepHang: MaTruc[];                    // giảm dần
      kieu: { loai: "don"; truc: MaTruc }
          | { loai: "pha"; cap: [MaTruc, MaTruc] }
          | { loai: "deu" };
      canhBao: Array<"MOT_COT" | "MAU_THUAN" | "BAM_BUA">;
    };

export function cham(boDe: BoDe, traLoi: Record<string, number>, giay: number): KetQua;
```

---

## 8. VÙNG LỆCH — CON ↔ CHA MẸ

### 8.1 Vì sao đây là tính năng chủ lực

Ba bộ đầu, ngoài kia có hàng chục trang làm miễn phí rồi. Bộ đối chiếu thì gần như không ai
làm — và nó có **cơ sở học thuật thật**, không phải mẹo bán hàng:

> Chênh lệch giữa hai người đánh giá (*informant discrepancies*) từng bị coi là sai số đo.
> Dòng nghiên cứu của De Los Reyes và cộng sự đã đảo lại: chênh lệch đó **là tín hiệu về sự
> khác nhau của hành vi trẻ theo NGỮ CẢNH**, và về góc nhìn của người đánh giá. Trẻ hành xử
> khác ở nhà và ở lớp là chuyện bình thường; đo được sự khác nhau đó có giá trị riêng.

Đó là câu chuyện phụ huynh chịu đọc hết, chịu chụp màn hình gửi cho nhau, và chịu để lại
thông tin liên hệ.

### 8.2 Điều kiện tính

| Điều kiện | Giá trị |
| --------- | ------- |
| Có bài của con | bộ `TH` hoặc `THCS`, hợp lệ |
| Có bài của bố mẹ về con | bộ `QS`, hợp lệ |
| Cùng một mã trẻ | trùng `maTre` (biệt danh — mục 10) |
| Khoảng cách hai bài | `≤ 60 ngày` |

Chưa đủ điều kiện ⇒ **không hiện màn hình rỗng**. Hiện lời mời cụ thể: *"Còn thiếu bài của
bố mẹ. Làm 16 câu (khoảng 4 phút) để xem hai góc nhìn có khớp nhau không."*

### 8.3 Cách tính và ngưỡng

```
lech(truc) = diemCon(truc) − diemBoMe(truc)      // thang 0–100, có dấu
```

| `|lech|` | Nhãn | Màu |
| -------- | ---- | --- |
| `≤ 10` | Trùng khớp | Xanh `#2E9E6B` |
| `10 < |lech| ≤ 25` | Hơi khác | Cam `#FF8F2D` |
| `> 25` | Khác rõ | Tím `#610B8A` |

🔴 **Chỉ diễn giải cho tối đa HAI trục lệch lớn nhất.** Diễn giải cả bốn là bắt phụ huynh đọc
một bài luận và không nhớ được gì. Nói ít mà trúng.

### 8.4 Bảng văn bản diễn giải

`lech > 0` = con tự thấy mình cao hơn cha mẹ thấy · `lech < 0` = ngược lại.
Đưa vào `config/disc-doi-chieu.ts`.

| Trục | Hướng | Văn bản gợi ý |
| ---- | ----- | ------------- |
| **D** | con > bố mẹ | Con tự thấy mình chủ động hơn bố mẹ nhìn thấy. Ở nhà con có thể đang giữ hoà khí; ở lớp hoặc chỗ bạn bè, con có thể đang là người cầm trịch mà bố mẹ chưa thấy. |
| **D** | con < bố mẹ | Bố mẹ thấy con mạnh mẽ hơn con tự thấy. Có thể con quyết đoán ở nhà nhưng ra ngoài thì dè dặt hơn — đáng để hỏi con xem ở lớp con thấy thế nào. |
| **I** | con > bố mẹ | Con thấy mình cởi mở hơn bố mẹ nhìn thấy. Trẻ hay ít nói ở nhà mà rất rôm rả với bạn — không phải chuyện lạ. |
| **I** | con < bố mẹ | Bố mẹ thấy con hoạt bát hơn con tự thấy. Có thể con vui vẻ ở nhà nhưng đang ngại ở chỗ đông người. |
| **S** | con > bố mẹ | Con thấy mình nhường nhịn và kiên nhẫn hơn bố mẹ nhìn thấy. Điều con nhường ở ngoài, về nhà chưa chắc kể lại. |
| **S** | con < bố mẹ | Bố mẹ thấy con điềm đạm hơn con tự thấy. Bên trong con có thể đang thấy sốt ruột nhiều hơn vẻ ngoài. |
| **C** | con > bố mẹ | Con thấy mình cẩn thận hơn bố mẹ nhìn thấy. Có thể con kỹ ở việc con quan tâm, còn việc nhà thì không — hai chuyện khác nhau. |
| **C** | con < bố mẹ | Bố mẹ thấy con chỉn chu hơn con tự thấy. Con có thể đang khắt khe với chính mình. |

**Câu kết bắt buộc ở cuối màn hình đối chiếu:**

> Lệch nhau không có nghĩa là ai đó sai. Trẻ hành xử khác nhau ở nhà, ở lớp, ở chỗ bạn bè —
> và đó chính là thứ bảng này cho thấy. Hãy dùng nó để **hỏi con**, đừng dùng để kết luận về
> con.

---

## 9. BÁO CÁO KẾT QUẢ — NỘI DUNG & GIỌNG

### 9.1 Bố cục màn hình M4

```
┌──────────────────────────────────────────────────────┐
│  [Nhân vật trội — hình lớn]                          │
│  Bạn nghiêng về nhóm CHỦ ĐỘNG                        │
│  (hoặc: pha giữa CHỦ ĐỘNG và CẨN TRỌNG)              │
├──────────────────────────────────────────────────────┤
│  Biểu đồ 4 cột ngang, 0–100, có nhãn số              │
│  D ████████████████░░░░  72                          │
│  I ██████████░░░░░░░░░░  48                          │
│  S ████████░░░░░░░░░░░░  39                          │
│  C ██████████████░░░░░░  65                          │
├──────────────────────────────────────────────────────┤
│  KHỐI 1 — Điều này thường trông như thế nào           │
│  KHỐI 2 — Điểm mạnh khi ở đúng chỗ                    │
│  KHỐI 3 — Chỗ cần để ý                                │
│  KHỐI 4 — (bộ MN/TH) 3 câu để bố mẹ hỏi con           │
├──────────────────────────────────────────────────────┤
│  [Tải ảnh kết quả] [Tải PDF] [Đối chiếu với bố mẹ]   │
└──────────────────────────────────────────────────────┘
```

### 9.2 🔴 Luật viết nội dung — không thương lượng

| Luật | Đúng | Sai |
| ---- | ---- | --- |
| Nói thiên hướng, không nói bản chất | "Con **có thiên hướng** chủ động" | "Con **LÀ** người chủ động" |
| Mỗi trục nêu CẢ mặt mạnh lẫn mặt cần để ý | "Quyết nhanh — nhưng đôi khi quyết trước khi nghe hết" | Chỉ liệt kê điểm mạnh |
| Không tiên đoán nghề nghiệp | — | "Con hợp làm lãnh đạo / kế toán" |
| Không so sánh với trẻ khác | — | "Con chủ động hơn 80% các bạn" |
| Không gắn với học lực | — | "Nhóm C thường học giỏi Toán" |
| Bộ MN/TH mở đầu bằng câu rào | "Đây là gợi ý để trò chuyện với con, không phải kết luận về con." | Vào thẳng kết quả |
| 🔴 **Được nói KHÁC CÁCH, cấm nói AI HƠN AI** | "Mẹ quyết nhanh, con cần thời gian nghĩ — hai nhịp khác nhau" | "Mẹ quyết đoán hơn con" · "Con cần học cách quyết nhanh như mẹ" |

> 🔴 **Luật cuối thêm ngày 27/08/2026 (11.7), và nó là luật khó giữ nhất khi bước sang phần
> gia đình.** Từ GĐ12 trở đi, báo cáo đặt hai hồ sơ CẠNH NHAU — và đặt cạnh nhau là lời mời
> xếp hạng. Một câu vô hại như *"bố kiên nhẫn hơn con"* biến một bản mô tả hành vi thành một
> bảng điểm gia đình, và biến DISC thành thứ nó không phải.
>
> Ranh giới đặt ở đây: nói **chỗ vênh** và **hệ quả của chỗ vênh** thì được; nói **ai tốt
> hơn ai** thì không. Cùng một sự thật, hai cách viết, và chỉ một cách còn dùng được ở bữa
> cơm tối. Điều này nối thẳng với ADR-002 — DISC không phải mô hình khuyết thiếu, nên không
> có trục nào "cần nâng lên cho bằng" ai cả.

> **Một báo cáo toàn lời khen thì phụ huynh nào đọc cũng thấy đúng — và đó chính là dấu hiệu
> nó không đo gì cả.** Mỗi trục bắt buộc có ít nhất một dòng "chỗ cần để ý".

### 9.3 Xuất ảnh kết quả

Dùng lại **Canvas 2D** đúng như TAO_ANH đang làm: vẽ một tấm PNG dọc (khổ `1080×1350`, tỷ lệ
`4:5`) gồm biểu đồ + nhân vật + 3 dòng tóm tắt + logo. Phụ huynh tự chia sẻ — đây là kênh
phân phối mạnh nhất, đã ghi trong sổ quyết định của TAO_ANH.

⚠️ Kèm nguyên hai bẫy đã trả giá bên TAO_ANH:
- **Canvas KHÔNG báo lỗi khi chữ tràn khung** — nó vẽ tiếp ra ngoài mép, chữ cụt nửa câu, ảnh
  vẫn xuất ra bình thường. Phải có hàm đo chữ vừa khung trước khi vẽ.
- **Chặn render khi font chưa nạp xong** (`document.fonts.ready`), nếu không chữ tiếng Việt
  rơi về font hệ thống và dấu bị lệch.

---

## 10. MÔ HÌNH DỮ LIỆU & LƯU TRỮ

### 10.1 Kiểu dữ liệu

```ts
export type MaBoDe = "MN" | "TH" | "THCS" | "PH" | "QS";

export type BaiLam = {
  id: string;                    // uuid sinh tại máy
  boDe: MaBoDe;
  maTre?: string;                // TÊN người làm — tên thật được phép (ADR-005)
  lop?: string;                  // "1".."12" — chỉ để định tuyến, không đưa vào kết quả
  nguoiTraLoi: "tre" | "nguoi-lon";
  batDau: string;                // ISO 8601: "2026-08-26T14:03:00+07:00"
  ketThuc: string;
  traLoi: Record<string, number>; // { "THCS-D1": 4, ... }
  ketQua: KetQua;                // mục 7.5
  phienBanBoDe: string;          // "1.1" — xem 10.3
  thanhVienId?: string;          // 🆕 ADR-007 — khoá tới thành viên trong sổ gia đình
};
```

**🆕 Từ GĐ12 — đơn vị dữ liệu là MỘT GIA ĐÌNH (ADR-007), không phải một bài.**

```ts
export type GiaDinh = {
  id: string;
  lapLuc: string;                // ISO 8601
};

export type ThanhVien = {
  id: string;
  giaDinhId: string;
  ten: string;                   // 🔴 tên thật được phép — bốn hàng rào ở ADR-005
  vai: VaiGiaDinh;               // "con" | "me" | "bo" | "ba" | "ong" | … (8 vai)
  themLuc: string;
};
```

Hạn mức **2 bài mỗi thành viên** (đủ để so *"Bin hồi tháng 3 ↔ Bin bây giờ"*, đủ ít để bảng
không thành danh sách dài). Con số nằm trong `config/`, không gõ cứng. Bài thứ ba đẩy bài cũ
nhất ra — **và không bao giờ xoá im lặng, phải hỏi**.

**KHÔNG có bảng nối** giữa gia đình và thành viên: một máy là một nhà, một thành viên thuộc
đúng một nhà. Bảng nối chỉ có nghĩa với quan hệ nhiều-nhiều.

### 10.2 🔴 Hàng rào dữ liệu cá nhân (NĐ 13/2023)

> 🔴 **LẬT NGÀY 27/08/2026 — ADR-005 cho phép nhập TÊN THẬT.** Luật "không thu họ tên" bên
> dưới đã được thay. Lý do đầy đủ ở `docs/decisions/ADR-005-cho-nhap-ten-that.md`; tóm tắt:
> người dùng nay là phụ huynh đã ký hợp đồng, đang ngồi trong app của chính trung tâm, và
> một sổ gia đình mà mọi hàng đều là *"bé A"*, *"bé B"* thì vô dụng.
>
> **Rủi ro pháp lý thật sự nằm ở chỗ AI GIỮ dữ liệu, không ở chỗ người dùng gõ gì vào máy
> của chính họ.** Chừng nào ADR-001 còn đứng, SATA ROBO không giữ một byte nào của trẻ. Nó
> vỡ đúng vào ngày ai đó dựng đường gửi dữ liệu đi — nên **năm hàng rào dưới đây là cửa kiểm
> chạy trong CI, không phải lời hứa.**

| Luật | Chi tiết |
| ---- | -------- |
| **Tên thật được phép** | Ô nhập ở M2 nhận tên thật. Câu nhắc "đừng ghi họ tên" đã gỡ. Trường vẫn tên `maTre`/`bietDanh` ở tầng dữ liệu — đổi tên trường là một cuộc di trú không mua thêm gì. |
| 🔴 **Tên KHÔNG rời máy** | ADR-001 (không backend) · `tests/lien-he-sach.test.ts`. |
| 🔴 **Tên KHÔNG vào tệp xuất** | Cửa kiểm ở `tests/luu-tru.test.ts`. |
| 🔴 **Tên KHÔNG vào ảnh chia sẻ** | `modules/report/xuat-anh.ts` không nhận trường tên. |
| 🔴 **Tên KHÔNG vào mã mời** | Hàng rào thứ 5, thêm ở 11.1. Mã mời đi ra khỏi máy qua tin nhắn và ảnh chụp màn hình. Máy nhận tự hỏi *"đây là ai trong nhà?"*. `tests/ma-moi.test.ts` soi thẳng mã nguồn. |
| 🔴 **Test luôn dùng tên BỊA** | Luật trong `CLAUDE.md`. Không lấy bài làm thật làm dữ liệu mẫu, kể cả một lần. |
| **Không thu ngày sinh** | Chỉ hỏi **lớp** (1–12) và tuổi con ở nhánh QS, đều chỉ dùng để định tuyến và phân lứa nội dung. Tuổi **không bao giờ suy từ lớp** — lớp 7 có cả bé 12 lẫn bé 13, suy ra rồi lưu như thể đã hỏi là bịa dữ liệu. |
| **Không rời máy** | Lưu `localStorage` (bài đang làm dở) + `IndexedDB` (bài đã xong). Không fetch, không analytics trên câu trả lời, không gửi email. |
| **Xoá được** | Màn M6 có nút xoá từng bài và nút **"Xoá sạch DISC trên máy này"**, có hỏi lại. |
| **Sao lưu đọc thẳng nguồn** | Nút xuất `.zip` phải đọc **thẳng IndexedDB**, không đọc danh sách đang lọc trên màn hình. *(Bẫy này đã cắn TAO_ANH ngày 24/08: người dùng bấm Sao lưu ở một khoang, nhận file trông như đủ, xoá dữ liệu duyệt web, rồi mất sạch phần kia.)* |
| **Cảnh báo mất dữ liệu** | Thẻ ở đáy thanh bên: *"Xoá dữ liệu duyệt web là mất. Sao lưu ra .zip trước khi dọn máy."* |

### 10.3 Đánh phiên bản bộ đề

`phienBanBoDe` là bắt buộc. Sửa nội dung một câu là **đổi ý nghĩa của điểm số** — bài cũ và
bài mới không còn so được với nhau nữa.

**Luật:** sửa/thêm/bớt câu ⇒ tăng phiên bản. Đối chiếu vùng lệch (mục 8) **chỉ chạy khi hai
bài cùng phiên bản**; khác phiên bản thì hiện: *"Hai bài này dùng hai bộ câu hỏi khác nhau
nên không đối chiếu được. Làm lại bài cũ để so."*

---

## 11. YÊU CẦU PHI CHỨC NĂNG

| Nhóm | Yêu cầu |
| ---- | ------- |
| **Nền tảng** | Next.js App Router, `output: 'export'`. Không SSR, không API route, không middleware |
| **Ngôn ngữ** | TypeScript · Tailwind CSS · Vitest |
| **Thư viện ngoài** | Giữ tối thiểu. Cần: `jszip` (sao lưu). Không cần thư viện biểu đồ — bốn cột ngang vẽ bằng `div` hoặc SVG tay |
| **Hosting** | Cloudflare Pages (hoặc Vercel nếu tổ chức đã có Pro — Vercel Hobby cấm dùng thương mại) |
| **Tốc độ** | Bài 24 câu tải xong dưới 2 giây trên 3G mô phỏng. Toàn bộ ngân hàng câu ~30KB, gói thẳng vào bundle |
| **Ngoại tuyến** | Làm được bài khi mất mạng (trang tĩnh + dữ liệu đã tải). Nên có, không bắt buộc bản 1 |
| **Thiết bị** | Ưu tiên điện thoại — phụ huynh làm trên điện thoại. Vùng bấm ≥ 44×44px |
| **Tiếp cận** | Tương phản chữ/nền ≥ 4,5:1 · điều hướng được bằng bàn phím · `aria-current` cho mục đang mở · nút trả lời là `<button>` thật, không phải `<div onClick>` |
| **Ngôn ngữ hiển thị** | Tiếng Việt 100%, có dấu. Thuật ngữ lấy từ `config/disc-tu-dien.ts` |
| **Hoa–thường tên file** | Mọi thứ suy từ tên file phải `toUpperCase()` trước khi so. *(macOS coi `Nu_1.png` và `NU_1.png` là một, Linux thì không — bom hẹn giờ chỉ nổ trên máy dựng.)* |

---

## 12. TÁI DÙNG GÌ TỪ TAO_ANH

Chép sang repo mới, sửa nội dung chứ không viết lại:

| Tài sản | Đường dẫn ở TAO_ANH | Sửa gì |
| ------- | ------------------- | ------ |
| Bộ khung "não dự án" | `CLAUDE.md` · `PLAN.md` · `.claude/{rules,agents,commands,settings}` | Đổi phần DỰ ÁN và TRẠNG THÁI |
| Thanh bên | `app/components/thanh-ben.tsx` | Đổi danh sách khoang + icon |
| Khung ngoài + nhớ tab | `app/page.tsx` | Đổi khoá localStorage |
| Bộ nhận diện | `config/thuong-hieu.ts` | Chép nguyên, **không đổi màu logo** |
| Khuôn từ điển UI | `config/tu-dien.ts` | Chép cấu trúc, thay nội dung |
| Xuất ảnh Canvas 2D | logic vẽ trong `modules/sinh-anh/` | Viết lại phần vẽ, giữ khung: đo chữ vừa khung, chờ font, giải phóng bitmap |
| Xuất ZIP | `modules/thu-vien/xuat-zip.ts` | ⚠️ File này **không nạp được từ Node** (dùng alias `@modules/...`). Script `.mjs` thì dùng thẳng `jszip` |
| Lớp chặn lộ secrets | `.gitignore` · `.gitleaks.toml` · `.githooks/pre-commit` | Chép nguyên |
| Nghiệm thu cấu trúc | `scripts/check-structure.mjs` · `.claude/scaffold.json` | Cập nhật danh sách file bắt buộc |
| Ranh giới module | `.semgrep/ranh-gioi-module.yml` | 🔴 **Xoá module = xoá rule của nó; thêm module = thêm rule.** Rule mồ côi không bao giờ báo lỗi, nên nó im lặng cho cảm giác đang được canh |
| Đồ thị phụ thuộc sổ | `scripts/plan-phu-thuoc.ts` | Chép nguyên. ⚠️ Mã hạng mục đặt **không dấu** (`QD.1` chứ không `QĐ.1`) — chữ có dấu bị parser nuốt im lặng |

---

## 13. CẤU TRÚC THƯ MỤC REPO MỚI

```
disc/
├── CLAUDE.md
├── PLAN.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx                       khung ngoài + nhớ khoang đang mở
│   ├── globals.css
│   ├── components/
│   │   ├── thanh-ben.tsx              ◄ chép từ TAO_ANH
│   │   ├── the-doi-tuong.tsx          thẻ chọn Mầm non / Tiểu học / THCS / Phụ huynh
│   │   ├── thang-tra-loi.tsx          3 mức mặt cười · 5 mức đồng ý · 5 mức tần suất
│   │   ├── bieu-do-cot.tsx            4 cột ngang 0–100
│   │   └── the-canh-bao.tsx           dải cảnh báo tính hợp lệ
│   └── khoang/
│       ├── disc.tsx                   điều phối M1→M5
│       └── lich-su.tsx                M6
├── config/                            🔴 ĐI THẲNG RA BUNDLE CÔNG KHAI
│   ├── thuong-hieu.ts                 ◄ chép từ TAO_ANH
│   ├── disc-tu-dien.ts                mọi chữ hiện trên màn hình
│   ├── disc-cau-hoi.ts                5 ngân hàng câu (mục 6)
│   ├── disc-thu-tu.ts                 thứ tự hiển thị đã chốt cứng (mục 6.6)
│   ├── disc-nguong.ts                 NGUONG_PHA, ngưỡng HL-1..HL-5, ngưỡng vùng lệch
│   ├── disc-dien-giai.ts              văn bản 4 khối báo cáo cho từng trục & từng cặp pha
│   └── disc-doi-chieu.ts              8 văn bản vùng lệch (mục 8.4)
├── modules/
│   ├── disc-cham-diem/                hàm THUẦN — đảo chiều, chuẩn hoá, kiểm hợp lệ, xếp kiểu
│   │   └── OVERVIEW.md
│   ├── disc-doi-chieu/                tính vùng lệch
│   │   └── OVERVIEW.md
│   ├── disc-luu-tru/                  IndexedDB + localStorage + sao lưu .zip
│   │   └── OVERVIEW.md
│   └── disc-xuat-anh/                 Canvas 2D → PNG kết quả
│       └── OVERVIEW.md
├── tests/
│   ├── cham-diem.test.ts
│   ├── kiem-hop-le.test.ts
│   ├── cau-hoi.test.ts                canh cấu trúc ngân hàng câu (mục 14 · CH.3)
│   ├── doi-chieu.test.ts
│   └── luu-tru.test.ts
├── docs/
│   ├── brd/disc-mvp.md
│   ├── decisions/ADR-001-khong-backend.md
│   ├── decisions/ADR-002-tuoi-tu-danh-gia.md      ◄ mục 3.2
│   ├── decisions/ADR-003-likert-thay-ep-chon.md   ◄ mục 3.4
│   └── DISC/DISC_BA.md                            ◄ tài liệu này
└── scripts/
    ├── check-structure.mjs
    └── plan-phu-thuoc.ts
```

---

## 14. BACKLOG THI CÔNG

> Khuôn 6 dòng của dự án: **(a)** làm gì · **(b)** người dùng kiểm chứng bằng thao tác nào ·
> **(c)** test tự động nào chạy · **(d)** ước lượng · **(e) chặn: MÁY|NGƯỜI|NGOÀI** ·
> **(f) phụ-thuộc**. Dán thẳng vào `PLAN.md` của repo mới.
>
> **Luật tick:** chỉ tick ✅ khi (b) đã bấm thật và (c) đã xanh.

### GĐ1 — Nền

- [ ] **NEN.1 — Dựng khung dự án + chép bộ khung từ TAO_ANH**
  - (a) `create-next-app` + `output:'export'` + Tailwind + Vitest. Chép `CLAUDE.md`,
    `.claude/`, `.gitignore`, `.gitleaks.toml`, `.githooks/pre-commit`, `check-structure.mjs`,
    `config/thuong-hieu.ts`.
  - (b) `npm run dev` mở được trang trắng có logo SATA ROBO đúng màu.
  - (c) `node scripts/check-structure.mjs` exit 0.
  - (d) 0,5 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: không

- [ ] **NEN.2 — Thanh bên + khung ngoài + mục DISC**
  - (a) Chép `thanh-ben.tsx`, thay danh sách khoang thành `disc` + `lich-su`, thêm icon 4 ô,
    khai tên/mô tả trong `config/disc-tu-dien.ts`, nhớ khoang đang mở bằng localStorage.
  - (b) Mở trang: thấy thanh bên trái, bấm qua lại 2 mục, tải lại trang vẫn ở đúng mục.
  - (c) `tests/dieu-huong.test.ts` — mã khoang không hợp lệ trong localStorage rơi về mặc
    định, không làm hỏng trang.
  - (d) 0,5 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: NEN.1

### GĐ2 — Lõi chấm điểm (làm TRƯỚC giao diện)

- [ ] **CH.1 — Ngân hàng câu hỏi vào `config/`**
  - (a) 104 câu ở mục 6 vào `config/disc-cau-hoi.ts`; thứ tự hiển thị sinh theo luật 6.6 rồi
    chốt cứng vào `config/disc-thu-tu.ts`.
  - (b) Mở file trên GitHub web, sửa một câu, thấy đổi trên màn hình sau khi dựng lại.
  - (c) (dữ liệu — test ở CH.3.)
  - (d) 0,5 ngày.
  - (e) chặn: NGƯỜI — chủ dự án duyệt nội dung 104 câu trước khi khoá.
  - (f) phụ-thuộc: NEN.1

- [ ] **CH.2 — Hàm chấm điểm thuần**
  - (a) `modules/disc-cham-diem/cham.ts` theo hợp đồng mục 7.5: đảo chiều → chuẩn hoá 0–100 →
    kiểm `HL-1..HL-5` → xếp kiểu đơn/pha/đều.
  - (b) (không có giao diện — kiểm bằng test.)
  - (c) `tests/cham-diem.test.ts` ≥ 18 test: đảo chiều đúng ở cả thang 3 và 5 · chuẩn hoá
    biên (toàn 1 → 0 điểm, toàn 5 → 100 điểm) · `d1−d2` đúng bằng ngưỡng thì ra **kiểu đơn**
    (biên trên) · cặp pha luôn viết theo thứ tự D-I-S-C.
    `tests/kiem-hop-le.test.ts` ≥ 10 test: 41% mức giữa → **không hợp lệ**, 39% → hợp lệ ·
    8 câu liên tiếp cùng đáp án → cảnh báo, 7 câu → không · thiếu 1 câu → chặn.
  - (d) 1 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: CH.1

- [ ] **CH.3 — Test canh cấu trúc ngân hàng câu**
  - (a) Test đọc `config/disc-cau-hoi.ts` và khẳng định các bất biến.
  - (b) Thử gỡ câu đảo cuối cùng của một trục ⇒ test phải đỏ.
  - (c) `tests/cau-hoi.test.ts`: mỗi trục có **≥ 1 câu đảo** · số câu mỗi trục bằng nhau
    trong cùng bộ · mã câu không trùng · thứ tự hiển thị không có 2 câu cùng trục liền nhau ·
    câu đầu bài là câu thuận · **mọi câu bộ QS đều khai `soi-guong` trỏ tới mã có thật**.
  - (d) 0,5 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: CH.1

### GĐ3 — Luồng làm bài

- [ ] **BAI.1 — M1 chọn đối tượng + luật định tuyến**
  - (a) 4 thẻ lớn; hỏi lớp khi chọn Tiểu học; hỏi "cho tôi / cho con" khi chọn Phụ huynh;
    lớp 1–2 chuyển sang bộ MN **kèm hộp giải thích** (văn bản ở mục 4.2).
  - (b) Chọn Tiểu học → lớp 2 → thấy hộp giải thích và vào bộ quan sát, KHÔNG vào bộ bé tự làm.
  - (c) `tests/dinh-tuyen.test.ts` — bảng đầy đủ: 4 lựa chọn × các lớp → đúng mã bộ đề;
    lớp 1–2 **không bao giờ** ra bộ TH.
  - (d) 1 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: NEN.2, CH.1

- [ ] **BAI.2 — M2 trước khi bắt đầu + ô biệt danh**
  - (a) 4 dòng dặn dò; ô nhập tên gọi kèm nhắc "đừng ghi họ tên đầy đủ"; `maxLength` 24.
  - (b) Nhập biệt danh, bấm Bắt đầu, vào được màn làm bài.
  - (c) `tests/bien-danh.test.ts` — cắt đúng độ dài, không cho chuỗi rỗng toàn khoảng trắng.
  - (d) 0,5 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: BAI.1

- [ ] **BAI.3 — M3 làm bài, hai kiểu trình bày**
  - (a) MN & TH: 1 câu/màn, nút ≥ 56px. THCS/PH/QS: 5 câu/màn. Thanh tiến trình, nút Quay
    lại, tự lưu nháp sau mỗi câu vào localStorage, đo thời gian cho `HL-4`.
  - (b) Làm dở 8 câu, tắt tab, mở lại → quay đúng câu 9 với 8 câu cũ còn nguyên.
  - (c) `tests/luu-nhap.test.ts` — nháp ghi/đọc đúng; nháp của bộ đề này không lẫn sang bộ kia;
    cửa sổ ẩn danh chặn localStorage thì **không làm hỏng trang**.
  - (d) 2 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: BAI.2, CH.2

### GĐ4 — Kết quả

- [ ] **KQ.1 — M4 màn kết quả**
  - (a) Nhân vật trội + biểu đồ 4 cột + 4 khối diễn giải đọc từ `config/disc-dien-giai.ts` +
    dải cảnh báo khi có `canhBao`. Bộ MN/TH mở đầu bằng câu rào (mục 9.2).
  - (b) Làm trọn một bài THCS → thấy đúng nhân vật, đúng 4 số. Làm một bài toàn mức giữa →
    **KHÔNG ra kết quả**, ra lời mời làm lại.
  - (c) `tests/dien-giai.test.ts` — mọi kiểu đơn (4), mọi cặp pha (6), và "phổ đều" đều có
    văn bản; **không có khoá nào trỏ vào chỗ trống**.
  - (d) 1,5 ngày.
  - (e) chặn: NGƯỜI — chủ dự án duyệt văn bản diễn giải.
  - (f) phụ-thuộc: CH.2

- [ ] **KQ.2 — Xuất ảnh kết quả PNG bằng Canvas 2D**
  - (a) Vẽ tấm `1080×1350`: biểu đồ + nhân vật + 3 dòng tóm tắt + logo. Chờ
    `document.fonts.ready`; đo chữ vừa khung trước khi vẽ; giải phóng bitmap sau khi vẽ.
  - (b) Bấm Tải ảnh → mở file PNG ra, **chữ tiếng Việt đủ dấu và không cụt câu nào**.
  - (c) `tests/xuat-anh.test.ts` — hàm đo chữ trả về `false` khi chuỗi dài hơn khung; chuỗi
    tiếng Việt có dấu đo đúng.
  - (d) 1,5 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: KQ.1

- [ ] **KQ.3 — Xuất PDF**
  - (a) In ra PDF bằng `window.print()` + stylesheet `@media print` — không thêm thư viện PDF.
  - (b) Bấm Tải PDF → xem file, không mất chữ, không tràn trang.
  - (c) (kiểm bằng mắt — không có test tự động cho bản in.)
  - (d) 0,5 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: KQ.1

### GĐ5 — Vùng lệch & lưu trữ

- [ ] **LT.1 — IndexedDB + M6 bài đã làm + sao lưu .zip**
  - (a) Lưu bài xong vào IndexedDB; M6 liệt kê, mở lại, xoá từng bài, xoá sạch (có hỏi lại);
    nút sao lưu `.zip` **đọc thẳng IndexedDB**.
  - (b) Làm 3 bài khác bộ đề → M6 thấy đủ 3. Bấm sao lưu → giải nén ra đủ 3 file JSON.
  - (c) `tests/luu-tru.test.ts` — **sao lưu lấy đủ mọi bộ đề, không chỉ bộ đang mở** (bẫy đã
    cắn TAO_ANH 24/08) · xoá một bài không đụng bài khác · JSZip nhận `ArrayBuffer`, không
    nhận `Blob` khi chạy ngoài trình duyệt.
  - (d) 1,5 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: KQ.1

- [ ] **DC.1 — M5 vùng lệch con ↔ cha mẹ**
  - (a) Ghép cặp theo `maTre` + `phienBanBoDe` + cách nhau ≤ 60 ngày; tính lệch 4 trục; tô
    màu theo 3 mức; diễn giải **tối đa 2 trục lệch lớn nhất**; câu kết bắt buộc.
  - (b) Làm bài THCS cho biệt danh "Bi", rồi làm bài QS cho "Bi" → M5 hiện bảng đối chiếu.
    Chỉ làm một trong hai → hiện lời mời, **không hiện màn hình rỗng**.
  - (c) `tests/doi-chieu.test.ts` — lệch đúng bằng 10 và 25 rơi vào đúng nhãn (biên) ·
    chỉ diễn giải 2 trục · khác `phienBanBoDe` thì từ chối ghép · quá 60 ngày thì từ chối.
  - (d) 1,5 ngày.
  - (e) chặn: NGƯỜI — chủ dự án duyệt 8 văn bản diễn giải vùng lệch.
  - (f) phụ-thuộc: LT.1

### GĐ6 — Hoàn thiện

- [ ] **HT.1 — Rà tiếp cận + điện thoại thật**
  - (a) Tương phản ≥ 4,5:1 toàn bộ · điều hướng bàn phím · vùng bấm ≥ 44px · thử trên điện
    thoại thật.
  - (b) Làm trọn một bài bằng **chỉ bàn phím**; làm trọn một bài trên điện thoại thật.
  - (c) `npm run lint` sạch.
  - (d) 1 ngày.
  - (e) chặn: NGƯỜI — cần một điện thoại thật.
  - (f) phụ-thuộc: DC.1

- [ ] **HT.2 — Bộ cổng trước khi phát hành**
  - (a) `npm run kiem` = typecheck + test + check-structure + semgrep. Rà `.semgrep/` khớp
    đúng danh sách module thật.
  - (b) Chạy `npm run kiem`, xanh toàn bộ.
  - (c) chính nó.
  - (d) 0,5 ngày.
  - (e) chặn: MÁY.
  - (f) phụ-thuộc: HT.1

**Tổng ước lượng: ~15 ngày công dev** + thời gian chủ dự án duyệt nội dung (CH.1, KQ.1, DC.1).

---

## 15. DEMO NGHIỆM THU

Chạy tuần tự trên `npm run dev`. Không có DEMO nào xanh thì không được tick hạng mục.

| # | Thao tác | Phải thấy |
| - | -------- | --------- |
| 1 | Mở app, nhìn thanh bên trái | Mục **DISC** với icon 4 ô, mục đang mở nền tím nhạt |
| 2 | Vào DISC → chọn **Tiểu học** → **Lớp 2** | Hộp giải thích hiện ra, vào bộ **quan sát** (người lớn điền), KHÔNG phải bộ bé tự làm |
| 3 | Quay lại → **Tiểu học** → **Lớp 4** | Bộ bé tự làm, 3 mức mặt cười, **một câu một màn**, nút to |
| 4 | Làm bộ THCS, **chọn mức giữa cho tất cả 24 câu** | 🔴 **KHÔNG ra kết quả.** Ra lời mời làm lại |
| 5 | Làm lại bộ THCS trả lời thật | Biểu đồ 4 cột + nhân vật trội + 4 khối diễn giải; **mỗi trục có ít nhất một dòng "chỗ cần để ý"** |
| 6 | Làm dở 8 câu, tắt tab, mở lại | Quay đúng câu 9, 8 câu cũ còn nguyên |
| 7 | Bấm **Tải ảnh kết quả** | PNG mở ra, chữ tiếng Việt **đủ dấu, không cụt câu** |
| 8 | Làm bài THCS cho biệt danh "Bi" → làm bài QS cho "Bi" | M5 hiện bảng đối chiếu, tô màu 3 mức, **diễn giải đúng 2 trục**, có câu kết |
| 9 | Chỉ làm một trong hai bài | Lời mời làm nốt bài kia — **không phải màn hình rỗng** |
| 10 | Bấm **Sao lưu .zip** rồi giải nén | Đủ **mọi** bài của mọi bộ đề, không chỉ bộ đang mở |
| 11 | Ngắt mạng, làm một bài | Vẫn làm được trọn bài |
| 12 | Mở tab mạng của DevTools trong lúc làm bài | **Không có một request nào mang theo câu trả lời** |

DEMO **4**, **10** và **12** là ba cái quan trọng nhất — chúng canh đúng ba thứ dễ hỏng im
lặng nhất: bịa kết quả từ dữ liệu rác, sao lưu bỏ sót, và dữ liệu trẻ em rời máy.

---

## 16. RỦI RO & CẠM BẪY

### 16.1 Riêng của DISC

| 🔴 | Cạm bẫy | Vì sao nguy hiểm |
| -- | ------- | ---------------- |
| 🔴 | **Cho trẻ mầm non tự tick** | Tạo ra hồ sơ trông chuyên nghiệp, đo bằng số ngẫu nhiên. Lỗi **im lặng tuyệt đối** — không có gì báo đỏ, phụ huynh tin và có thể đối xử với con theo một cái nhãn sai |
| 🔴 | **Gỡ câu đảo chiều cuối cùng của một trục** | Bài vẫn chạy, kết quả vẫn ra, chỉ là hàng rào chống tick-một-cột biến mất. `tests/cau-hoi.test.ts` canh việc này — **đừng gỡ test** |
| 🔴 | **Sửa nội dung câu mà không tăng `phienBanBoDe`** | Điểm của bài cũ và bài mới không còn cùng nghĩa, nhưng vùng lệch vẫn tính và vẫn ra một con số đầy thuyết phục |
| 🔴 | **Bỏ kiểm `HL-1` "cho đỡ phiền"** | Đây là hàng rào duy nhất chặn việc dựng cả một hồ sơ trên toàn số 3 |
| 🔴 | **Ép nhãn cứng khi bốn điểm sát nhau** | Phụ huynh đọc xong nói "không đúng con tôi" và mất niềm tin vào cả sản phẩm |
| ⚠️ | **Random hoá thứ tự câu lúc chạy** | Hai lần làm bài ra hai thứ tự khác nhau ⇒ không đối chiếu được, và không tái hiện được lỗi |
| ⚠️ | **Báo cáo toàn lời khen** | Ai đọc cũng thấy đúng — dấu hiệu công cụ không đo gì cả |

### 16.2 Kế thừa từ sổ sẹo TAO_ANH (áp thẳng vào repo mới)

| 🔴 | Cạm bẫy | Áp vào DISC ở đâu |
| -- | ------- | ----------------- |
| 🔴 | **Cái nút dối** — nút bấm được rồi báo lỗi, vì đường đi thành công của nó chưa tồn tại | Đừng dựng nút "Gửi kết quả cho giáo viên" hay "So với các bạn cùng lớp" khi chưa có đường đi |
| 🔴 | **Nút Sao lưu đọc danh sách đã lọc thay vì đọc thẳng nguồn** | `LT.1` — đọc thẳng IndexedDB |
| 🔴 | **`config/` đi thẳng ra bundle công khai** | Không đặt họ tên, tên cơ sở, số điện thoại vào `config/` |
| 🔴 | **`new Date("01/08/2026")` ra 8 tháng 1 theo lối Mỹ, không báo lỗi** | Mọi chuỗi ngày kiểm regex `^\d{4}-\d{2}-\d{2}` trước khi đưa cho `new Date()`. Ngày lưu ở ISO 8601, ngày **hiển thị** mới là `dd/mm/yyyy` |
| 🔴 | **Regex `\b` không khớp sau ký tự tiếng Việt nếu thiếu cờ `u`** | Mọi regex đụng chữ Việt: cờ `u` + `(?!\p{L})` thay `\b` |
| 🔴 | **Canvas không báo lỗi khi chữ tràn khung** | `KQ.2` — đo chữ vừa khung trước khi vẽ |
| 🔴 | **Rule semgrep mồ côi im lặng cho cảm giác đang được canh** | Xoá module = xoá rule; thêm module = thêm rule |
| 🔴 | **Mã hạng mục có dấu tiếng Việt biến mất khỏi đồ thị phụ thuộc** | Đặt mã không dấu: `CH.1`, `DC.1` |
| 🔴 | **Tên file lệch hoa-thường chỉ nổ trên máy dựng Linux** | Mọi thứ suy từ tên file phải `toUpperCase()` trước khi so |
| ⚠️ | **Component khai bên trong thân component cha là kiểu mới sau mỗi render** | Khai `TheDoiTuong`, `ThangTraLoi` ở **cấp module**, không khai trong thân `disc.tsx` — nếu không, ô nhập biệt danh mất chữ mỗi lần gõ |
| ⚠️ | **Chạy `npm run build` khi `npm run dev` đang chạy làm hỏng `.next`** | Dừng dev trước khi build |
| ⚠️ | **JSZip trong Node nhận `nodebuffer`, không nhận `Blob`** | `LT.1` — `"uint8array"` cho code chạy hai nơi |
| ⚠️ | **File trông như file thật vẫn có thể 0 byte** | `wc -c` trước khi tin một file có nội dung |

### 16.3 Luật toàn cục phải nhớ

🔴 **Mọi repo / package / skill bundle tải từ ngoài về phải qua `/quet-ma-doc` quét tĩnh
TRƯỚC khi cài, mở, import hay chạy bất cứ thứ gì.** Tài liệu này chỉ *đọc mã nguồn mở để học
kiến trúc*, không nhập mã — nhưng nếu có lúc quyết định nhập, bước quét là bắt buộc.

---

## 17. CÂU HỎI CHỜ CHỦ DỰ ÁN CHỐT

| # | Câu hỏi | Vì sao cần trả lời trước khi dev | Khuyến nghị |
| - | ------- | -------------------------------- | ----------- |
| 1 | **Repo riêng hay module trong TAO_ANH?** | Quyết định cấu trúc thư mục và cách chép bộ khung | **Repo riêng** — hai nghiệp vụ khác nhau, dùng chung hệ điều hành dự án |
| 2 | **Mục tiêu chính: mồi thu thông tin phụ huynh, hay công cụ cho giáo viên hiểu học sinh?** | Hai mục tiêu cho ra hai báo cáo cuối rất khác nhau, và quyết định bộ QS có cần thiết không | Mồi thu thông tin — bộ QS là mũi nhọn |
| 3 | **Duyệt 104 câu ở mục 6?** | Chặn `CH.1`, mà `CH.1` chặn gần như mọi thứ | Duyệt nguyên, sửa dần sau khi có dữ liệu thật |
| 4 | **Bốn bạn robot hay bốn con vật?** | Chặn phần thiết kế nhân vật | **Bốn bạn robot** — hợp thương hiệu, tránh mọi câu hỏi về IP |
| 5 | **Ai vẽ 4 nhân vật?** | Cần 4 file PNG/SVG trước `KQ.1` | Có thể dùng hình khối đơn giản cho bản 1 |
| 6 | **Có cần bản cho GIÁO VIÊN quan sát học sinh không?** | Bộ QS đã có sẵn cấu trúc, thêm bộ GV chỉ là đổi ngôi xưng | Để bản 2 — đừng mở thêm mặt trận khi bản 1 chưa chạy |
| 7 | **Có thu thông tin liên hệ ở cuối bài không?** | Nếu có thì phải thiết kế cả cơ chế nhận — mà **backend là thứ ràng buộc ② cấm** | Bản 1: **không thu**. Thay bằng nút Zalo/gọi có sẵn số hotline |

⚠️ Câu **7** là chỗ dễ vô tình phá kiến trúc nhất: một ô "để lại số điện thoại" trông vô hại,
nhưng nó cần một nơi để gửi tới ⇒ cần backend ⇒ phá ràng buộc ②, và nếu gửi kèm kết quả của
trẻ thì phá luôn ràng buộc ①. Muốn thu thật thì phải có ADR riêng.

---

## 18. NGUỒN THAM KHẢO

**Mã nguồn mở đã soi**

| Repo | Ghi chú |
| ---- | ------- |
| [SauerNinja/DiSC-Compass](https://github.com/SauerNinja/DiSC-Compass) | MIT · HTML/JS thuần · 24 câu Likert, 6 câu/trục, 1 câu đảo/trục, chấm theo Lý thuyết Trắc nghiệm Cổ điển, có sẵn kiểm "trả lời phẳng", chạy 100% trong trình duyệt. **Kiến trúc tham chiếu chính của tài liệu này** |
| [cahyadsn/disc](https://github.com/cahyadsn/disc) | MIT · PHP+MySQL · DISC Classic đầy đủ bộ máy chấm, **112 từ để trống `term1..term112`** — bằng chứng về bản quyền bộ từ |
| [dyaskur/disc-assessment-test](https://github.com/dyaskur/disc-assessment-test) | MIT · SvelteKit · khung đa ngôn ngữ theo thư mục JSON · 19 nhóm từ (dưới sàn tin cậy) |
| [dzyla/disc-personality-assessment](https://github.com/dzyla/disc-personality-assessment) | MIT · Streamlit — cần máy chủ Python, loại theo ràng buộc ② |
| [teofiluscandra/disc-assessment](https://github.com/teofiluscandra/disc-assessment) | **Không khai giấy phép ⇒ mặc định giữ toàn quyền, không được dùng lại** |

**Pháp lý**

- [Thông báo nhãn hiệu & bản quyền của Wiley](https://www.discprofile.com/legal-trademark-copyright-notice) — chữ "i" thường trong DiSC® là dấu hiệu nhãn hiệu

**Khoa học đo lường**

- [Cloverleaf — DISC Assessment Construct Validity](https://cloverleaf.me/blog/disc-assessment-construct-validity/) — vì sao dạng ép chọn không đo được độ tin cậy theo cách thông thường
- [Integration of the Forced-Choice Questionnaire and the Likert Scale](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5435816/) — dạng ép chọn cho độ tin cậy thấp ở thiết kế đơn giản, ít nhân tố, bài ngắn
- [Controlling for Response Biases in Self-Report Scales](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6803422/) — nội quán 0,85–0,95 của thang Likert 5 mức

**Trẻ em & đo lường**

- [Children's Behavior Questionnaire (Rothbart)](https://research.bowdoin.edu/rothbart-temperament-questionnaires/instrument-descriptions/the-childrens-behavior-questionnaire/) — công cụ chuẩn cho lứa 3–7 tuổi, **do phụ huynh điền**, bản rất ngắn 36 mục
- [Conijn, Smits & Hartman — Determining at What Age Children Provide Sound Self-Reports](https://pubmed.ncbi.nlm.nih.gov/30829047/) — phương pháp xác định tuổi tối thiểu tự báo cáo được
- [Vicentini & cs. — Self-Report Questionnaires to Measure Big Five in Children and Adolescents](https://pmc.ncbi.nlm.nih.gov/articles/PMC12423744/) — tổng quan hệ thống
- [Acquiescence in personality questionnaires](https://www.sciencedirect.com/science/article/abs/pii/S0092656615000495) — phương sai do gật bừa ở trẻ lớn gấp đôi người lớn

**Vùng lệch giữa hai người đánh giá**

- [De Los Reyes — Informant Discrepancies in the Assessment of Childhood Psychopathology](https://www.researchgate.net/publication/7686359_Informant_Discrepancies_in_the_Assessment_of_Childhood_Psychopathology_A_Critical_Review_Theoretical_Framework_and_Recommendations_for_Further_Study) — khung lý thuyết
- [Linking informant discrepancies to observed variations in young children's disruptive behavior](https://pubmed.ncbi.nlm.nih.gov/19247829/) — chênh lệch phản ánh sự khác nhau của hành vi theo ngữ cảnh, không phải sai số đo

**Nội bộ (repo TAO_ANH)**

- `CLAUDE.md` — ba ràng buộc bất di bất dịch, sổ quyết định, sổ sẹo
- `.claude/rules/tech-defaults.md` · `security.md` · `ngon-ngu-ui.md` · `workflow.md` · `module-boundaries.md`
- `config/thuong-hieu.ts` — bộ nhận diện SATA ROBO
- `app/components/thanh-ben.tsx` — concept thanh bên kế thừa

---

*Hết tài liệu. Sửa gì thì tăng số phiên bản ở đầu file và ghi lý do vào `docs/decisions/`.*
