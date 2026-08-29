# SỔ SẸO — bài học TOÀN HỆ đã trả giá

> 🔴 **Tách khỏi `CLAUDE.md` ngày 29/08/2026 (`25.1`), NGUYÊN VĂN, không sửa một câu.**
> Lý do: đây là **kho tra cứu**, không phải luật phải đọc mỗi lượt. Để trong `CLAUDE.md`
> thì nó ngốn ~8.000 token của **mọi** lượt trao đổi, mọi phiên, mãi mãi.
>
> **Luật đọc:** trước khi sửa vùng nào thì `grep` file này theo từ khoá của vùng đó
> (ví dụ `grep -n "service worker" docs/so-seo.md`). Đừng đọc trọn file để trả lời một câu.
>
> **Luật ghi:** cạm bẫy mới ghi vào ĐÂY, không ghi ngược vào `CLAUDE.md`. Bài học riêng
> của một miền thì ghi ở miền đó — LƯU TRỮ → `modules/core/OVERVIEW.md` mục 6 · CÔNG CỤ →
> `.claude/rules/tech-defaults.md` mục cuối · BÁO CÁO → `modules/report/OVERVIEW.md` mục 6.

> Cạm bẫy CÔNG CỤ (Next 16 ghi đè CLAUDE.md · eslint flat config ·
> `eslint-disable-next-line` một dòng · `import.meta.url` dưới jsdom · Node ESM cần đuôi
> `.ts`) nằm ở `.claude/rules/tech-defaults.md` mục cuối — **đừng chép lại vào đây**.

> Bài học riêng của miền BÁO CÁO (chấm điểm · diễn giải · Canvas · bản in) nằm ở
> `modules/report/OVERVIEW.md` mục 6. Dưới đây chỉ giữ bài học TOÀN HỆ.

> Bài học riêng của miền LƯU TRỮ (kho · sao lưu · khôi phục · hạn mức · ba đời tệp `.zip`)
> nằm ở `modules/core/OVERVIEW.md` mục 6 — **đừng chép lại vào đây**.

- 🔴 **RETURN SỚM CỦA MỘT MÀN LÀ TẤM CHẮN TÌNH CỜ — DỜI KHỐI RA NGOÀI LÀ GỠ NÓ**
  (28/08/2026, `18.2`). Ba nút giữ dữ liệu nằm trong `KhoangNhaMinh`, vốn `return` sớm khi
  mở màn kết quả, nên chúng **vắng mặt khỏi DOM** đúng lúc đó. Không ai thiết kế điều ấy —
  nó là hệ quả phụ. Đưa ba nút ra ngoài liền đẻ ra HAI lỗi mới cùng lúc: bấm *Xoá sạch*
  trong lúc đang xem kết quả để lại **màn hình nói dối** (kho trống mà vẫn hiện điểm của
  bài vừa xoá), và ba cái nút bắt đầu **in ra giấy**. **Dời một khối thì phải hỏi: ở chỗ
  cũ, có lúc nào nó KHÔNG được vẽ không, và điều gì đang nhờ vào chuyện đó?**
- 🔴 **SỬA HÀNG LOẠT NEO THEO MỘT ĐẶC ĐIỂM SẼ BỎ SÓT ĐÚNG THỨ KHÁC ĐẶC ĐIỂM ĐÓ**
  (28/08/2026, `18.9`). Script thêm độ nổi neo vào `font-semibold text-white` — nó quét 22
  nút chính rất gọn, và **bỏ qua nút *Quay lại câu trước*** vì nút đó chữ xám. Test vẫn
  xanh (không cửa nào đo độ nổi từng nút), build vẫn xanh. Chỉ lộ ra ở lượt **soát tay
  từng hạng mục trước khi tick**. Cùng họ với `10.7` (dò khoá bằng `indexOf` đổ cả tám câu
  vào một trục). **Sửa hàng loạt xong thì phải liệt kê thứ KHÔNG khớp neo và soi từng cái.**
- 🔴 **CỬA KIỂM SOI CHUỖI CON BẮT TRÚNG CHÍNH BÌNH LUẬN DẶN ĐỪNG LÀM ĐIỀU ĐÓ**
  (28/08/2026, hai lần trong một ngày). Cửa cấm tự gọi `saoLuuTatCa(` bắt trúng dòng chú
  thích *"đừng gọi `saoLuuTatCa()`"*; bộ soát trước khi tick báo đỏ `"Nhà mình"` trong một
  file chỉ nhắc chữ đó ở khối bình luận. **Soi mã thì soi CẤU TRÚC** — câu `import`, hoặc
  bỏ bình luận trước khi khớp — đừng soi văn bản trần. Cùng họ `11.6` (`"Bi"` khớp
  *"**Bi**ệt danh"*) và `17.7` (`endsWith("ket-qua.tsx")` khớp `chon-ban-ket-qua.tsx`).
- 🔴 **TÊN KHO CACHE GÕ CỨNG = SERVICE WORKER KHÔNG BAO GIỜ TỰ CẬP NHẬT, VÀ NÓ IM LẶNG
  TUYỆT ĐỐI** (29/08/2026, GĐ19). `TEN_KHO = "disc-vo-v2"` là hằng số ⇒ `public/sw.js`
  **không đổi byte nào giữa các bản build** ⇒ trình duyệt so byte thấy y hệt nên không bao
  giờ chạy lại `install` ⇒ `activate` cũng không bao giờ có kho tên khác để xoá ⇒ **mọi máy
  đã từng mở trang kẹt ở bản đầu tiên tới hết đời**. Build xanh, test xanh, gói đúng cỡ.
  Triệu chứng lộ ra như một chuyện vặt lúc dev (*"cửa sổ cũ vẫn chạy bản cũ"*), nhưng cùng
  một lỗi đó nghĩa là **sau khi phát, không bản vá nào tới được người dùng**. Nay tên kho
  mang vân tay bản build, và `scripts/sinh-danh-sach-cache.mjs` **dừng build** nếu mốc
  `__VAN_TAY__` biến mất. **Bài học chung: thứ gì quyết định "có phải bản mới không" thì
  phải sinh ra từ NỘI DUNG, không được gõ tay.**
- 🔴 **REGEX TRÊN MÃ NGUỒN KHÔNG PHẢI CỬA KIỂM CHO MỘT THỨ CÓ HÀNH VI** (29/08/2026, `19.1`).
  Tám cửa cũ của `tests/ngoai-tuyen.test.ts` hỏi `expect(nguon).toMatch(/navigate/)` — và
  cả tám **xanh y nguyên** suốt thời gian service worker trả bản cũ cho tới hết đời máy.
  Chúng chứng minh CHỮ có mặt trong file, không chứng minh mã chạy lên thì làm gì. Cùng họ
  với bài học `16.9`. Cách chữa: `tests/the-gioi-sw.ts` dựng `self`/`caches`/`fetch` giả rồi
  **chạy thật** ba trình xử lý — và **bắt buộc chứng minh nó ĐỎ trên mã cũ trước** (4/21 đỏ)
  rồi mới đi sửa. Cửa nào chưa từng đỏ thì chưa ai biết nó có đo gì không.
- **Đọc mã nguồn rồi suy ra cấu trúc route là suy ẩu** (29/08/2026, `19.4`). Thấy
  `app/khoang/nha-minh.tsx` nên tôi viết vào sổ rằng có URL `/khoang/nha-minh/` và cả một
  lỗ ngoại tuyến quanh nó. Sự thật: app có **đúng một** route (`app/page.tsx`), mọi "khoang"
  là trạng thái phía client. `find out -name "*.html"` trả lời câu đó trong 1 giây.
  **Hỏi thư mục build, đừng hỏi thư mục mã nguồn** — và đừng viết bước nghiệm thu bắt người
  ta đi bấm một thứ không tồn tại.
- 🔴 **jsdom CÓ HAI REALM, VÀ CÂU BÁO LỖI KHÔNG HỀ NHẮC TỚI ĐIỀU ĐÓ** (28/08/2026,
  `17.4`). Fixture dựng bằng `new TextEncoder().encode()` cho ra một `Uint8Array` mà phép
  `instanceof Uint8Array` **bên trong JSZip trượt** — JSZip ném *"Can't read the data of
  'x'. Is it in a supported JavaScript type?"*, đọc lên như thể dữ liệu sai kiểu. Sản phẩm
  thật chạy trong trình duyệt một realm nên **không dính**; đây thuần tuý là tật của môi
  trường test. **Dùng `Uint8Array.from()`.** Và bài học chung: trước khi đi sửa sản phẩm vì
  một test đỏ, hỏi xem test có đang chạy trong cùng thế giới với sản phẩm không.
- 🔴 **`endsWith()` TRÊN TÊN TỆP BẮT TRÚNG CẢ TÊN DÀI HƠN** (28/08/2026, `17.7`). Bộ tìm
  file của cửa kiểm bố cục dùng `t.endsWith("ket-qua.tsx")` — và nó khớp `chon-ban-ket-qua.tsx`,
  rồi lặng lẽ đi soi nhầm file. Cùng một họ với bẫy đã cắn ở `11.6`: biệt danh `"Bi"` khớp
  vào chữ `"**Bi**ệt danh"`. **So khớp tên tệp thì so ĐÚNG tên**, không so đuôi.
- **Đo TRƯỚC khi thiết kế thì gỡ được cả một mảng việc** (28/08/2026, `17.1`). Kế hoạch có
  hẳn một thanh tiến trình đếm từng tệp và cơ chế nhường luồng, dựng cho nỗi lo 42 tệp PDF
  làm treo máy. Đo ra **0,48 giây** — vì jsPDF tự cắt font, mỗi tệp chỉ 48 KB, nhỏ hơn cả
  tệp font gốc. Bỏ được cả hai cơ chế. **Một hạng mục ĐO đặt ở đầu gói rẻ hơn nhiều so với
  một hạng mục TỐI ƯU đặt ở cuối** — và nó còn có thể nói cho biết là không cần tối ưu.
- 🔴 **NÚT SAO LƯU CHỈ ĐỌC MỘT TRONG BA BẢNG — LỜI HỨA CỨU DỮ LIỆU LÀ LỜI HỨA SUÔNG**
  (28/08/2026, `16.5`). `saoLuuTatCa()` gọi `docTatCa()` rồi thôi. Kho lên v2 ba bảng từ
  GĐ12 mà hàm sao lưu không ai đụng tới — nên phụ huynh bấm *Sao lưu*, nhận một tệp trông
  như đủ, yên tâm, rồi mất máy là mất **tên của cả nhà và mọi bản phân tích**. Đây là lần
  thứ HAI cùng một lỗi trong một tuần (lần đầu: nút *Xoá sạch*, `V3.1`). **Thêm một bảng
  vào kho thì phải đi hỏi lại MỌI hàm nói "tất cả" xem chúng có biết bảng mới không** — và
  danh sách đó gồm cả hàm ĐỌC, không chỉ hàm XOÁ.
- 🔴 **CỬA KIỂM CHẠY TRONG jsdom KHÔNG ĐO ĐƯỢC LAYOUT, VÀ NÓ IM LẶNG KHI KHÔNG ĐO ĐƯỢC**
  (28/08/2026, `16.9`). jsdom không có bộ dựng layout: `offsetWidth` luôn 0,
  `getBoundingClientRect()` trả về số không. Một test *"không phần tử nào rộng hơn 320px"*
  viết ở đó **luôn xanh, kể cả trên một trang tràn ngang thảm hại** — tệ hơn không có cửa,
  vì nó khiến người ta thôi kiểm bằng mắt. Cửa phải canh thứ jsdom ĐO ĐƯỢC THẬT, và phải
  nói thẳng phần nó không phủ.
- 🔴 **CỬA KIỂM TỰ NÉM CŨNG LÀ ĐỎ — ĐỌC KỸ TRƯỚC KHI ĐI SỬA THỨ ĐANG ĐÚNG** (28/08/2026,
  `16.7`). Cửa đo tràn viewBox báo đỏ ở robot S. Lỗi không ở hình: bộ đọc `path` của chính
  cửa kiểm chưa hiểu lệnh cong `q`. Suýt đi sửa một hình đang đúng. Bản vá đầu tiên còn sai
  theo hướng ngược lại: lớp ký tự phủ định `[^MmLlHhVvQqTtZz]*` **nuốt luôn** chữ `C` của
  lệnh cong bậc ba, nên cửa im lặng đúng lúc cần nó kêu. **Phát hiện lệnh lạ phải soi CHỮ
  CÁI, không soi "phần thừa còn lại sau khi cắt".**
- **Sổ kế hoạch trỏ vào một cửa kiểm KHÔNG làm việc nó tưởng** (28/08/2026, `16.8`). Sổ ghi
  *"mở rộng `tests/do-chu.test.ts` (đo tương phản)"*, nhưng file đó đo **chữ có vừa khung
  không**; còn mã đo tương phản kiểu canvas 1×1 mà mục cạm bẫy này nhắc thì **không còn
  trong repo** — nó là phép đo Playwright thời GĐ7, chỉ còn lại bài học. **Đo trên mã thật
  trước dòng code đầu tiên**, kể cả khi sổ nói rất chắc chắn.
- 🔴 **"ĐANG TẢI" TRÔNG Y HỆT "ĐÃ MỞ" — và đó là một lỗi ĐUA nhìn như lỗi giao diện**
  (28/08/2026, `V2.1`). Khung ba bước dựng xong TRƯỚC khi đếm xong kho, nên có một khoảnh
  khắc `dem` còn `null` và hàm khoá trả `null` cho mọi bước. Người dùng thấy bước 3 sáng
  trưng rồi tắt đi; test thì **xanh trên máy rảnh và đỏ lác đác khi chạy cả bộ, mỗi lượt một
  cửa khác nhau** — kiểu đỏ khó truy nhất. Sửa ở SẢN PHẨM (chưa đếm xong thì chưa vẽ bước
  nào), không sửa ở test. **Trạng thái "chưa biết" phải khác trạng thái "biết rồi và bằng
  không" — gộp hai cái đó là mầm của cả lỗi giao diện lẫn lỗi test.**
- **Bọc IIFE async trong một hàm async khác mà không `await` là dựng một cuộc đua**
  (28/08/2026, `V0.3`). Test đọc ra 7 người nhưng 0 bài — bảng ghi TRƯỚC kịp đáp, bảng ghi
  SAU thì chưa — và nó trông y hệt "bộ nạp hỏng". Suýt đi sửa mã lành.
- **Cửa kiểm hỏi CẢ TRANG thay vì hỏi ĐÚNG VÙNG sẽ cấm luôn thứ nó phải cho phép**
  (28/08/2026, `V2.1`). Cửa "thanh bên không còn mục Nhà mình" hỏi `screen.queryByRole`
  trên toàn trang, và bắt trúng tấm bước 1 — vốn TÊN LÀ "Nhà mình" và nằm đúng chỗ của nó.
  Hỏi trong `<aside>` mới là hỏi đúng câu.
- **Một cờ chỉ được thử ở trạng thái đang bật thì đúng bằng không có cờ** (28/08/2026,
  `V4.1`). Ngày cần tắt là ngày đầu tiên nó chạy thật, và đó là ngày tệ nhất để phát hiện
  nó hỏng. `tests/co-noi-dung-tre.test.tsx` giả lập `config/disc-nguong` để chạy CẢ HAI
  trạng thái.

- 🔴 **MỘT HÀM ĐỌC THIẾU MỘT TRƯỜNG ĐÃ KHOÁ NGUYÊN NHÓM NGƯỜI DÙNG SUỐT BA GIAI ĐOẠN**
  (28/08/2026, `V1.3`). `boDeCuaThanhVien()` định tuyến bộ đề chỉ từ `tv.lop`, **không đọc
  `vaiTro`**. Bố mẹ không có lớp ⇒ `null`; trẻ mầm non ⇒ `Number("mam-non")` ra `NaN` ⇒
  cũng `null`. Cả hai bị đá về màn *"Ai đang cầm máy?"* — nghĩa là **bấm "Làm bài" trên
  thẻ của Mẹ thì không vào được bài của Mẹ**, đúng nhóm người mà GĐ11–GĐ14 xây cho.
  1.115 test xanh không thấy, vì test chỉ hỏi *"form lưu được không"*, chưa ai hỏi
  *"người này rồi có vào được bài của họ không"*. **Cùng vết xe với bảng đại từ khoá một
  chiều ở GĐ10: khi định tuyến theo X, hỏi ngay X có đủ chiều không.**
- 🔴 **`Number()` trên một sentinel bằng CHỮ ra `NaN`, và `NaN` lọt qua mọi phép so sánh
  mà không ai biết** (28/08/2026). Đó là nửa sau của lỗi trên. Nay chỉ `soLopCua()` ở
  `config/disc-nguong.ts` được phép đổi bậc học thành số, và nó trả `undefined` chứ không
  bao giờ trả `NaN`. Gọi `Number(tv.lop)` rải rác là cách lỗi này quay lại.
- 🔴 **SỬA MỘT HÀM MÀ QUÊN THỨ NÓ TRẢ RA CŨNG LÀ MẤT DỮ LIỆU** (28/08/2026, `V1.3`). Cùng
  hàm đó còn **vứt luôn `giaiThich`**: em lớp 1–2 vào bài từ thẻ bị chuyển sang bản người
  lớn trả lời **không một chữ giải thích**, trong khi `DISC_BA.md` §4.2 ghi văn bản đó là
  BẮT BUỘC hiện. Màn 1 có hộp giải thích nên không ai ngờ đường thứ hai lại thiếu.
  **Thêm một lối vào cho một màn thì phải kiểm lối đó có mang đủ thứ màn kia mang không.**
- **Bọc một IIFE async trong một hàm async khác mà không `await` là dựng một cuộc đua**
  (28/08/2026, `V0.3`). Test đọc ra 7 người nhưng 0 bài — bảng ghi TRƯỚC kịp đáp, bảng ghi
  SAU thì chưa — và nó trông y hệt "bộ nạp hỏng". Suýt đi sửa mã lành. `eval` trả về giá
  trị của biểu thức cuối; phải `await` đúng lời hứa đó.
- **Ô thừa trên form đẻ ra dữ liệu mồ côi, và dữ liệu mồ côi thì âm thầm đổi hành vi**
  (28/08/2026, `V1.2`). Bản cũ hỏi lớp cho MỌI vai. Một ông bố từng chọn "Con · Lớp 7" rồi
  đổi vai sẽ mang `lop:"7"` vĩnh viễn — ô đã ẩn nên không ai thấy — mà `laTreEm()` lại suy
  trẻ em từ chính việc CÓ lớp. Kết quả: bản phân tích cả nhà đối xử với ông ấy như một đứa
  trẻ. Phải có **hai** hàng rào: xoá lúc đổi vai, VÀ chặn lại lúc lưu cho hồ sơ cũ.

- 🔴 **KHỨ HỒI KHÔNG ĐỦ ĐỂ CHỨNG MINH MỘT BỘ MÃ HOÁ ĐÚNG** (28/08/2026, `11.1`). Đa thức
  sinh Reed–Solomon của mã QR bị dựng **ngược thứ tự hệ số** (`moi[j] ^= da[j]*α` thay vì
  `moi[j] ^= da[j]`). Hậu quả: mã QR vẫn vẽ ra đẹp, bộ giải mã tự viết vẫn đọc ngược ra đúng
  chuỗi — vì nó chỉ đọc phần dữ liệu, có sửa lỗi đâu mà biết — và **chỉ điện thoại thật là
  chịu**. Cửa duy nhất bắt được là **phép thử hội chứng**: một từ mã hợp lệ chia hết cho đa
  thức sinh, nên thay `x = α^i` phải ra 0. Viết phép thử đó bằng số học GF(256) theo lối
  KHÁC (nhân bit, không tra bảng log) thì nó độc lập thật. **Bài học: kiểm một bộ mã hoá thì
  phải có một cửa nhìn vào phần mà bộ giải mã của mình KHÔNG dùng tới.**
- 🔴 **Vòng giữ chỗ bit định dạng QR quét cả `i = 6`** (28/08/2026) ⇒ xoá trắng hai ô NHỊP ở
  `(cột 8, hàng 6)` và `(cột 6, hàng 8)` mà `veBitDinhDang()` không bao giờ ghi đè lại. Mã
  vẫn vẽ ra rất đẹp. Vùng định dạng CỐ Ý chừa index 6 — nó là hàng/cột nhịp.
- 🔴 **CẮT KHỐI THEO MỐC VĂN BẢN LÀM MẤT BA KHỐI NẰM CÙNG VÙNG** (28/08/2026, `13.1`). Xoá
  `CHU_THU_MA_MOI` bằng `slice(dau, cuoi)` giữa hai tiêu đề đã cuốn theo cả `CHU_MA_HONG`,
  `CHU_SO_LIEU` và `CHU_MOC` — ba khối chèn vào sau, nằm lọt giữa hai mốc. Typecheck bắt
  được ngay, nhưng chỉ vì chúng có người dùng. **Cắt từ mốc A tới mốc B thì phải biết giữa
  A và B hiện còn gì — mốc không tự bảo vệ vùng nằm giữa chúng.**
- **Cửa kiểm soi CHUỖI CON trên tiếng Việt sẽ báo nhầm từ ghép** (28/08/2026, `13.2`). Luật
  cấm `yếu` dính vào "chủ **yếu**". Giữ cửa nghiêm và đổi câu chữ, ĐỪNG nới cửa: ở nội dung
  cho phụ huynh đọc về con, một lần báo nhầm chỉ tốn công đổi một chữ, còn một lần bỏ sót là
  để chữ *"điểm yếu"* đi thẳng tới người đọc.
- **Tên trong test càng NGẮN càng dễ khớp nhầm chữ giao diện** (28/08/2026, `11.6`). Biệt
  danh bịa `"Bi"` nằm gọn trong `"**Bi**ệt danh khác nhau"` ngay trên màn, làm cửa kiểm riêng
  tư đỏ oan. Chọn chuỗi không đụng chữ nào của giao diện (`"Zozo"`, `"Kiki"`).
- **Vá thẳng lên `Element.prototype` mà quên gỡ thì bản vá sống sang mọi file test sau**
  (28/08/2026). `Object.defineProperty(Element.prototype, "scrollIntoView", …)` không gỡ đã
  gây hai lỗi lạ ở một file chẳng liên quan. `vi.spyOn` không bám được vào thuộc tính jsdom
  chưa định nghĩa, nên phải tự gắn — và gỡ trong `finally`.
- **Lời gọi bắn-rồi-quên (`void p.then(async …)`) phải có `.catch()`** (28/08/2026, `11.6`).
  Thêm một `await` vào trong `.then` là biến nó thành nguồn unhandled rejection: người dùng
  vừa làm xong 20 câu thì thấy lỗi đỏ ở màn kết quả. Mất một mốc ĐO là chuyện nhỏ.
- **Suy cỡ chữ/cỡ nút từ `cauMoiMan` là một proxy TÌNH CỜ đúng** (28/08/2026, `11.3`). Số câu
  trên màn nói về mật độ trình bày; cỡ nút nói về ngón tay một đứa bé sáu tuổi. Đổi
  `cauMoiMan` sang 5 mà không đụng gì khác thì hai bộ dành cho trẻ nhỏ nhất lặng lẽ tụt xuống
  chữ 14px và nút 44px — **không một test nào đỏ**. Nay khoá theo `canNutTo()` ở `config/`.
- 🔴 **MÁY TẢI NẶNG LÀM 19–20 TEST ĐỎ GIẢ** (27/08/2026). Docker chiếm ~200% CPU (6 container
  không của dự án), load average 32,6 ⇒ `waitFor` của Testing Library đói CPU, mỗi test mất
  6–23 giây thay vì vài chục mili-giây và hết giờ chờ hàng loạt. Cùng bộ mã đó chạy
  `npx vitest run --maxWorkers=2` ra **805/805 xanh**. **Thấy test đỏ hàng loạt mà lỗi toàn là
  hết giờ chờ ⇒ soi `uptime` và `ps aux | sort -nrk 3` TRƯỚC khi soi code.** Suýt đi sửa mã lành.
- 🔴 **Script sửa hàng loạt dò khoá bằng `indexOf("  D: {")` đã đổ CẢ TÁM câu vào riêng một
  trục** (27/08/2026, `10.7`). `LOI_KHUYEN`, `TU_MINH` và `LECH_PHONG_CACH` **đều** có khoá
  `D:`/`I:`/`S:`/`C:` trong CÙNG một file, nên `indexOf` khớp khối đầu tiên và mọi lần chèn
  rơi về đó; ba trục còn lại không nhận gì. **Không cửa nào bắt được**: độ dài vẫn > 60, và
  luật "không trùng giữa các TRƯỜNG" vẫn thoả vì các câu bị dồn nằm chung một trường. Lỗi
  chỉ lộ ra khi NHÌN ảnh chụp trang — đọc thấy bốn câu *"Dấu hiệu nó có tác dụng"* nối đuôi.
  **Hai bài học:** (1) sửa hàng loạt thì neo vào TÊN HẰNG (`export const X`) rồi cắt khối ra
  trước, đừng neo vào tên khoá — tên khoá trùng nhau khắp file; (2) test trùng lặp phải soi
  ĐỦ HAI CHIỀU: giữa các trường VÀ giữa các khoá. Đã có
  `tests/ba-ban-noi-dung.test.ts` canh chiều thứ hai.
- **Một thay đổi đặc tả làm BỐN file test cùng đỏ, vì mỗi file tự gõ lại đường đi màn 1**
  (27/08/2026, `10.6`). Sắp lại M1 thành hai nhánh làm **34 cửa đỏ** ở `m1-chon-doi-tuong` ·
  `m2-truoc-khi-bat-dau` · `m3-lam-bai` · `luu-boi-canh`. Bản thân việc đỏ là ĐÚNG — đặc tả
  đổi thật. Cái sai là phải sửa BỐN chỗ cho MỘT thay đổi, và lần sau vẫn thế. Đã gom về
  `tests/duong-m1.ts`: một chỗ duy nhất biết cách đi từ M1 vào mỗi bộ đề, và nó đọc lên như
  chính bản đặc tả *"mỗi bộ đề đúng một cửa"*. **Test dùng chung một luồng vào thì luồng đó
  phải là một hàm dùng chung, không phải một đoạn ai cũng chép lại.**
- **Muốn máy tự làm trọn một bài thì phải TRÁNH MỨC GIỮA** (27/08/2026). Trả lời xoay vòng
  đều là ra hồ sơ phẳng, và hàng rào HL-1 từ chối kết luận — ĐÚNG thiết kế, nhưng rất dễ
  đọc nhầm thành "giao diện hỏng" rồi đi sửa nhầm chỗ. Và phải **trả lời TRƯỚC rồi mới bấm
  "Xem kết quả"**: nút đó hiện ra từ màn cuối trong khi câu trên chính màn đó chưa được chọn.
- **Đặt tên hằng mới phải soi TIỀN TỐ của hằng cũ** (27/08/2026). `CHU_BAN` (ba bản báo cáo)
  đụng `CHU_BAN_KHOAN` (ô băn khoăn) đã có. Đổi thành `CHU_BA_BAN`. Rẻ — nhưng không có
  bước kiểm thì hai khái niệm khác hẳn nhau nằm cạnh nhau với cái tên gần y hệt.

- **Bảng đại từ khoá MỘT CHIỀU theo bộ đề đã âm thầm cắt cả một nhóm người dùng khỏi sản
  phẩm** (27/08/2026, GĐ10). `CHU_THE[maBoDe]` ngầm giả định *"một bộ đề = một người đọc"*.
  Giả định đó khiến bộ TH/THCS bị chặn khỏi TOÀN BỘ `LOI_KHUYEN` — nghĩa là **phụ huynh của
  mọi học sinh tiểu học và THCS không nhận được một chữ lời khuyên nào**, suốt từ GĐ9. Không
  test nào thấy vì test chỉ hỏi "bộ này có `tuMinh` không", chưa ai hỏi "phụ huynh của em này
  đọc được gì". **Bài học: khi thêm một trường khoá theo X, hỏi ngay X có đủ chiều không.**
- **`next start` KHÔNG chạy được với `output: "export"`** (27/08/2026). Script `start` trỏ vào
  đó từ GĐ0 và chỉ ném lỗi — không ai phát hiện vì không ai chạy nó. Đã thay bằng
  `scripts/xem-ban-phat-hanh.mjs` (`npm run xem-thu`). **Một script hỏng mà không ai gọi thì
  im lặng y như một tính năng hỏng mà không ai mở.**
- **Hằng nghiệp vụ nằm CỤC BỘ trong một file là mầm của hai nguồn sự thật** (27/08/2026).
  `TUOI_VAO_THCS = 12` từng là `const` trong `dien-giai.ts`; chỗ thứ hai cần đúng con số đó
  (màn vùng lệch) đã gõ cứng `"THCS"` cho mọi lứa tuổi. Ngưỡng đã chuyển lên `config/`.
- **Hạng mục có thể TICK ✅ mà vẫn chưa làm đúng thứ đặc tả đòi** (27/08/2026, GĐ9 — đắt
  nhất phiên). Đặc tả §9.2 luật 2 ghi *"Mỗi trục nêu CẢ mặt mạnh LẪN mặt cần để ý"*, DEMO #5
  đòi *"mỗi trục có ít nhất một dòng chỗ cần để ý"*. Bản dựng làm theo **KIỂU** (11 kiểu) chứ
  không theo **TRỤC** (4 trục), và `tests/dien-giai.test.ts` chỉ kiểm 11 kiểu — nên test xanh,
  DEMO "đạt", hạng mục `4.2` tick ✅ từ GĐ4, trong khi phụ huynh nhìn biểu đồ bốn cột có số
  đầy đủ mà chỉ đọc được chữ về **một** nhóm. **Bài học: viết test theo ĐÚNG DANH TỪ mà đặc
  tả dùng.** "Mỗi trục" mà đi kiểm "mỗi kiểu" là một cửa kiểm nhìn sai chỗ suốt bốn giai đoạn.
- **Tailwind v4 sinh màu dạng `oklch()`** (27/08/2026, GĐ7). Tự viết bộ đo tương phản mà
  phân tích chuỗi theo `rgb()` là **báo nhầm hàng loạt**. Vẽ màu lên canvas 1×1 rồi đọc
  pixel — đổi được mọi định dạng CSS về RGB thật. Và nhớ **trộn nền trong suốt** trước khi
  tính, nếu không `rgba(...,0.09)` bị coi như màu đục.
- **Cam thương hiệu `#FF8F2D` trên nền trắng chỉ đạt 2,28:1** (27/08/2026). Dưới cả ngưỡng
  chữ to (3:1) lẫn chữ thường (4,5:1). Dùng `MAU.camDamChoChu` cho CHỮ; cam thương hiệu
  chỉ dùng cho viền và mảng màu.
- **Service worker cache "thứ tình cờ nhìn thấy" là KHÔNG ĐỦ** (27/08/2026, GĐ7). Lần tải
  đầu tiên diễn ra TRƯỚC khi nó kích hoạt nên nó không thấy JS/CSS nào. Phải nạp sẵn theo
  danh sách sinh sau build. **Và tệ hơn:** trả vỏ trang cho request `.js` thì trình duyệt
  nhận HTML ở chỗ đợi JS — trang lên nhưng không bấm được gì, `requestfailed` báo **0**,
  không ai biết hỏng. Chỉ request `mode === "navigate"` mới được nhận vỏ trang.
- **Trình duyệt thật bắt được thứ test đơn vị mù** (27/08/2026). Ba lỗi nội dung chỉ lộ ra
  khi soi ảnh chụp: bộ THCS hiện "3 câu để tự hỏi mình" mà ruột là câu viết cho phụ huynh
  hỏi con · ảnh PNG có mảng trắng chết khi kiểu "phổ đều" không có nhân vật · bản in bộ QS
  in hai câu lệch nhau về cùng một ý. **Viết xong giao diện thì phải NHÌN, không chỉ chạy test.**
- **CI chạy ở UTC, máy dev ở +07 — ngày gõ cứng trong test là trò may rủi** (27/08/2026,
  lần push đầu tiên). `hienNgay()` đọc ngày theo múi giờ máy đang chạy; đó là hành vi ĐÚNG
  với người dùng, nhưng nó làm test `"27/08/2026"` xanh trên máy và **đỏ trên GitHub**
  (cùng mốc đó ở UTC là 26/08 lúc 23:08). Đã ghim `env: { TZ: "Asia/Ho_Chi_Minh" }` trong
  `vitest.config.mts`, và `tests/ngay.test.ts` có test canh cái ghim đó còn sống.
  **Bài học chung: cửa kiểm chạy trên máy mình không thay được cửa kiểm chạy trên CI.**
- **HAI CỬA CÙNG DẪN TỚI MỘT BỘ ĐỀ THÌ CHẲNG CỬA NÀO HIỂN NHIÊN** (27/08/2026, `10.6`;
  ghi vào đây 29/08/2026 khi xoá mã chết mang nó). Bốn thẻ màn 1 cũ (Mầm non · Tiểu học ·
  THCS · Phụ huynh) **trộn hai câu hỏi khác nhau vào một hàng**: ba thẻ đầu nói về NGƯỜI
  ĐƯỢC ĐÁNH GIÁ, thẻ thứ tư nói về NGƯỜI TRẢ LỜI. Hậu quả đo được: bố mẹ một bé lớp 1 có
  **hai** đường cùng tới bộ Mầm non — *"Tiểu học → Lớp 1"* hoặc *"Phụ huynh → về con → 6
  tuổi"*. Cửa nào cũng đúng, nên chẳng cửa nào hiển nhiên, và người dùng phải đoán. Tách
  theo NGƯỜI CẦM MÁY thì mỗi bộ đề còn đúng một cửa, và tuổi/lớp chỉ hỏi MỘT lần.
  **Bài học chung: một màn chọn mà các lựa chọn trả lời hai câu hỏi khác nhau thì nó không
  phải màn chọn, nó là một câu đố.**
