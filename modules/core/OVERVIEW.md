# OVERVIEW — Module `core`

> Cập nhật 27/08/2026. Đọc mục 1–4 là đủ cho việc sửa code thường ngày.

## 1. Mục đích

Module **nền tảng**: kiểu dữ liệu dùng chung, cửa nạp bộ đề, và toàn bộ hạ tầng đụng
trình duyệt (lưu trữ, đếm phễu, điểm cắm liên hệ).

🔴 **Không có Supabase, không có API, không có auth.** Bản 1 chạy 100% trong trình duyệt
— xem `docs/decisions/ADR-001-khong-backend.md`. Nếu bạn thấy tài liệu nào còn nhắc
Supabase thì tài liệu đó lỗi thời.

## 2. Phạm vi (In / Out)

- **In:** kiểu `BoDe`/`CauHoi`/`BaiLam`/`KetQua` · nạp bộ đề từ `config/` · IndexedDB ·
  localStorage · sao lưu `.zip` · đếm phễu · điểm cắm thu liên hệ · tiện ích ngày tháng.
- **Out:** luật định tuyến và luồng làm bài → `modules/test`. Chấm điểm, diễn giải,
  vùng lệch, vẽ ảnh → `modules/report`.
- `core` **không được** import sâu vào hai module kia — `.semgrep/ranh-gioi-module.yml` canh.

## 3. Cấu trúc bên trong

| Thư mục | Vai trò | Tầng lõi? |
| ------- | ------- | --------- |
| `bo-de/kieu.ts` | Kiểu dùng chung: `BoDe`, `CauHoi`, `KetQua`, `Kieu`, `BaiLam` | ✅ |
| `bo-de/nap.ts` | Cửa DUY NHẤT lấy bộ đề — ghép nội dung câu với thứ tự đã chốt cứng | ✅ |
| `bo-de/bam.ts` | Băm ngân hàng câu, khoá nội dung vào `PHIEN_BAN_BO_DE` | ✅ |
| `tien-ich/ngay.ts` | ISO ↔ dd/mm/yyyy, đếm ngày. Chặn bẫy `new Date("01/08/2026")` | ✅ |
| `lien-he/kieu.ts` | Kiểu phiếu liên hệ + hàng rào QĐ3 (`timKhoaCam`) | ✅ |
| `luu-tru/nhap.ts` | Nháp bài đang làm (localStorage), gắn theo bộ đề **và** biệt danh | ❌ |
| `luu-tru/kho-bai.ts` | Bản dựng IndexedDB + **mặt tiền** đi qua sổ đăng ký `KhoDisc` (16.4) | ❌ |
| `luu-tru/kho-disc.ts` | 🆕 16.4 — BẢN HỢP ĐỒNG của tầng lưu trữ. **Sạch DOM**, nằm trong tầng lõi và có cửa canh. `datKho()` cắm bản dựng khác vào mà không sửa một dòng giao diện | ✅ |
| `luu-tru/khoi-phuc.ts` | 🆕 16.5 — nạp sổ từ `.zip`; 17.5 đọc được **cả ba đời tệp**. HAI pha: `docTuZip()` chỉ đọc-kiểm, `ghiDeKho()` mới ghi | ❌ |
| `luu-tru/cay-sao-luu.ts` | 🆕 17.4 — đặt tên thư mục trong `.zip`: lọc ký tự cấm (giữ dấu tiếng Việt), tách tên trùng, tên thư mục theo ngày giờ | ✅ |
| `luu-tru/sao-luu.ts` | Xuất `.zip`. 🔴 `saoLuuTatCa()` KHÔNG nhận tham số lọc | ❌ |
| `do-phieu/index.ts` | Bốn mốc phễu + tham số `?nguon=` | ❌ |
| `lien-he/luu-tam.ts` | Bản mặc định của điểm cắm — lưu máy + mở Zalo | ❌ |

**Tầng lõi** = hàm thuần, không React, không DOM ⇒ bê sang stack nào cũng chạy (ADR-004).
`tests/ranh-gioi-hai-tang.test.ts` canh điều này.

## 4. Phụ thuộc

Chỉ đọc `config/`. Không import `modules/test` hay `modules/report`.

## 5. Trạng thái

Xong (28/08/2026, gồm GĐ9 và luồng ba bước). Không còn việc dở.
Tiến độ + bàn giao: **`PLAN_V2.md`** (sổ cũ đổi tên thành `PLAN_V1_LUU.md`).

🔴 **Kho lên v2 BA BẢNG** (`bai-lam` · `thanh-vien` · `phan-tich-gia-dinh`).
`PHIEN_BAN_KHO` nay **xuất ra ngoài** để bộ sinh dữ liệu mẫu mở kho bằng đúng số đó —
gõ lại con số ấy chính là lỗi làm bộ nạp mẫu chết lặng suốt từ GĐ12.
Thêm `xoaSachPhanTich()` và `xoaSachTatCa()` (dọn cả ba bảng).

🔴 **GĐ9 thêm `tuoi`/`banKhoan` vào `BaiLamLuu`, và bắt đầu GHI `lop`** (trường này khai
từ GĐ0 mà chưa từng có nơi nào ghi). Mọi trường mới đều tuỳ chọn và **không nâng version
IndexedDB** — `moKho()` có `onblocked → giaiQuyet(null)`, nên một tab cũ đang mở là mất
im lặng cả tính năng lưu. Thêm trường mới thì PHẢI thêm vào `KHOA_CAM` của
`lien-he/kieu.ts`; `tests/lien-he-sach.test.ts` có hàng rào biên dịch bắt việc này.

## 6. Cạm bẫy đã trả giá

### Tệp sao lưu nay có BA đời, và cả ba phải nạp được (17.5)

| Đời | Bản kê | Bài | Thành viên + phân tích |
| --- | --- | --- | --- |
| v1 | `ban-ke.json` | `bai/` | (không có) |
| v2 | `ban-ke.json` | `bai/` | `du-lieu/` |
| v3 | `_may-doc/ban-ke.json` | `_may-doc/bai/` | `_may-doc/` |

Người dùng có thể đang giữ một tệp tải từ đời trước. **Nút cứu dữ liệu mà từ chối chính bản
sao lưu của họ là kiểu hỏng tệ nhất tính năng này mắc được** — và nó chỉ lộ ra vào đúng ngày
người ta cần đến nó. `docTuZip()` vì thế tìm bản kê ở CẢ HAI chỗ trước khi kết luận "không
phải sổ DISC", và bỏ qua mọi tệp không phải `.json` (từ 17.4 tệp `.zip` còn mang cả PDF).


### Kho ghi xong thì phải TỰ BÁO — và `BroadcastChannel` KHÔNG đủ (16.1)

`baoTabKhac()` cũ chỉ `postMessage`, mà spec loại trừ chính ngữ cảnh đã đăng tin. Nên tab
người dùng đang nhìn là tab **duy nhất** không được báo: làm xong bài, bấm quay lại, thẻ vẫn
hiện số cũ tới khi F5. Nay `baoDoi()` làm hai việc theo đúng thứ tự — gọi người đăng ký
trong tab này, RỒI mới đăng tin cho tab khác — và `gomBao()` gộp lệnh ghi nhiều bảng thành
một lần báo. Kênh nhận và kênh gửi dùng CHUNG một đối tượng, cố ý: mở kênh thứ hai để gửi
thì kênh nhận trong cùng tab vẫn nghe thấy, và người đăng ký bị gọi hai lần cho một lần ghi.

### 🔴 HAI NÚT SAO LƯU RA HAI THỨ KHÁC NHAU — và người dùng bấm đúng cái sai (28/08/2026)

Chủ dự án tải bản sao lưu về, nhận một tệp `.zip` **toàn JSON**: không thư mục tên người,
không PDF. Tệp không hỏng — sản phẩm có **HAI** nút sao lưu và chúng gói ra hai thứ.

Nút trong hộp nhắc (`nhac-sao-luu.tsx`, viết ở `V4.2`) gọi `saoLuuTatCa()`, vốn truyền
mảng rỗng vào chỗ đính PDF. Nút ở bảng gia đình gọi `saoLuuTatCaKemTep()` nên đủ. Hộp nhắc
viết **TRƯỚC** khi PDF vào tệp sao lưu (GĐ16–17), và khi PDF vào thì không ai quay lại hỏi
nó. Đây là lần **THỨ BA** cùng một họ lỗi trong một tuần: nút *Xoá sạch* dọn thiếu (`V3.1`),
`saoLuuTatCa()` đọc thiếu bảng (`16.5`), và lần này.

**Vì sao cửa kiểm không thấy:** `tests/sao-luu-tron-luong.test.tsx` có 9 cửa soi rất kỹ cây
thư mục `.zip` — nhưng chỉ `render(<KhoangNhaMinh />)`. Nó đứng canh **một trong hai cánh
cửa** và im lặng về cánh kia.

**Luật rút ra:** thêm một LỐI VÀO cho một việc thì phải đi hỏi lại MỌI lối vào khác của
việc đó — không chỉ mọi hàm. Và cách chữa đúng là **gộp về một cửa** (`app/tai-sao-luu.ts`
→ `taiBanSaoLuuVeMay()`), không phải chép đoạn sinh PDF sang nút thứ hai: chép là dựng bản
sao thứ hai, và hai bản chỉ lệch vào đúng ngày ai đó sửa một bên. Có cửa đọc mã nguồn cấm
mọi file trong `app/` tự nhập `saoLuuTatCa`.

### Sao lưu phải biết kho có mấy bảng (16.5)

`saoLuuTatCa()` từng chỉ đọc bảng BÀI, suốt từ khi kho lên v2 ba bảng ở GĐ12. Nay bản sao
lưu là v2: thêm `du-lieu/thanh-vien.json` và `du-lieu/phan-tich.json`, **luôn ghi kể cả khi
rỗng** — "vắng mặt" nghĩa là bản sao lưu đời cũ, "có mà rỗng" nghĩa là nhà chưa khai ai, và
gộp hai trạng thái đó lại là để lúc khôi phục không phân biệt được.


- 🔴 **NÚT "XOÁ SẠCH" TỪNG DỌN THIẾU HAI PHẦN BA DỮ LIỆU** (28/08/2026). Nó gọi
  `xoaSach()` — chỉ dọn bảng BÀI. Tên từng người (`thanh-vien`) và các bản phân tích
  (`phan-tich-gia-dinh`) vẫn nằm nguyên, trong khi người bấm tin là mình vừa xoá sạch máy.
  Kho lên v2 ba bảng ở GĐ12 mà nút xoá không ai đụng tới. Đây không phải chuyện dọn dẹp mà
  là chuyện RIÊNG TƯ: kho v2 giữ TÊN THẬT (ADR-005), và luật máy demo của giáo viên/sale
  dựa thẳng vào nút này. **Thêm một bảng thì phải đi hỏi MỌI hàm nói "tất cả" xem chúng có
  biết bảng mới không** — và câu xác nhận cũng phải nói lại đúng thứ sắp mất.
  Nay dùng `xoaSachTatCa()`, có `tests/luu-tru.test.ts` canh.
- 🔴 **Kho ghi xong mà KHÔNG ai được báo** (28/08/2026, đang sửa ở `16.1`). `baoTabKhac()`
  chỉ được gọi từ hai hàm dọn hạn mức; mọi lệnh ghi bình thường đều không phát tín hiệu.
  Và `BroadcastChannel` **không gửi về chính ngữ cảnh đã đăng tin**, nên tab đang mở không
  bao giờ tự biết — người dùng phải F5.
- **`saoLuuTatCa()` không có tham số lọc** — thêm một tham số `boDe?` là mở lại đúng cái
  bẫy đã cắn dự án trước: nút Sao lưu đọc danh sách đang hiển thị, file tải về thiếu mà
  trông vẫn đủ. Có test canh chữ ký hàm.
- **Nháp gắn theo cả biệt danh** — máy giáo viên đi qua nhiều gia đình; trả nháp của bé A
  cho bé B là vừa lộ chéo vừa sai người.
- **`soNgayGiua()` trả `null` khi chuỗi không phải ISO**, không trả 0 — `new Date()` đoán
  bừa theo lối Mỹ và không báo lỗi.
- **`IDBRequest<A>` không gán được cho `IDBRequest<A | null>`** (`onerror` mang `this`
  nghịch biến). Nhận `IDBRequest` không tham số kiểu.
