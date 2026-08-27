# ADR-005 — Cho phép nhập tên thật

**Ngày:** 27/08/2026 · **Trạng thái:** ĐÃ CHỐT · **Lật:** `DISC_BA.md` §10.2

## Bối cảnh

Đặc tả §10.2 cấm nhập họ tên: ô định danh chỉ nhận **biệt danh**, và giao diện chủ động
nhắc người dùng đừng gõ tên thật. Lý do ban đầu đúng và vẫn đúng: người làm bài gồm trẻ
mầm non tới THCS, nên họ tên trẻ là dữ liệu cá nhân theo Nghị định 13/2023.

Điều đã đổi là **ai dùng sản phẩm này**. Ngày 27/08/2026 mục tiêu kinh doanh chuyển từ
*mồi thu khách lạ* sang *giữ chân hơn 1.000 gia đình đang học*. Người mở khoang không còn
là người lạ trên internet — là phụ huynh đã ký hợp đồng, đang ngồi trong app của chính
trung tâm, làm bài cho con mình.

Với họ, ô "đừng gõ tên thật" tạo ra ba chuyện cùng lúc:

1. **Một câu đố.** Nhà có hai đứa con thì đặt biệt danh gì cho khỏi lẫn? Người dùng phải
   nghĩ ra một hệ định danh — việc mà chính sản phẩm đáng lẽ lo.
2. **Một lời cảnh báo lạc chỗ.** Câu nhắc bảo mật đọc lên như thể sản phẩm sắp gửi tên
   con họ đi đâu đó, trong khi ADR-001 đã cấm backend: dữ liệu không rời máy.
3. **Sổ gia đình vô nghĩa.** GĐ12 dựng một bảng liệt kê cả nhà. Một bảng mà mọi hàng đều
   là *"bé A"*, *"bé B"* thì chính là thứ nó sinh ra để chống.

## Quyết định

**Cho nhập tên thật.** Bỏ câu nhắc "đừng gõ tên thật". Trường vẫn tên là `maTre` /
`bietDanh` ở tầng dữ liệu — đổi tên trường là một cuộc di trú không mua thêm gì.

**Bốn hàng rào GIỮ NGUYÊN, không thương lượng:**

| # | Hàng rào | Canh bằng |
| - | -------- | --------- |
| 1 | Tên **không rời máy người dùng** | ADR-001 (không backend) · `tests/lien-he-sach.test.ts` |
| 2 | Tên **không vào tệp xuất** | Cửa kiểm ở `tests/luu-tru.test.ts` |
| 3 | Tên **không vào ảnh chia sẻ** | `modules/report/xuat-anh.ts` không nhận trường tên |
| 4 | Test **luôn dùng tên bịa** | Luật trong `CLAUDE.md`; mọi test hiện có tuân thủ |

Hàng rào thứ 5, thêm ở 11.1: **tên không vào mã mời**. Mã mời là một hồ sơ DISC đi ra
khỏi máy qua tin nhắn và ảnh chụp màn hình — nhét tên vào là phá thẳng hàng rào 1 và 3.
Máy nhận mã tự hỏi *"đây là ai trong nhà?"* và người dùng gõ tên ngay trên máy mình.

## Lý do

Rủi ro pháp lý thật sự nằm ở chỗ **ai giữ dữ liệu**, không ở chỗ **người dùng gõ gì vào
máy của chính họ**. Chừng nào ADR-001 còn đứng, SATA ROBO không giữ một byte nào của trẻ,
nên nghĩa vụ theo NĐ 13/2023 gần như không phát sinh — và lợi thế đó **miễn phí**.

Nó vỡ đúng vào ngày ai đó dựng đường gửi dữ liệu đi. Vì thế bốn hàng rào trên không phải
lời hứa mà là **cửa kiểm chạy trong CI**.

## Hệ quả

- Câu nhắc "đừng gõ tên thật" ở màn *Trước khi bắt đầu* bị gỡ.
- Sổ gia đình (GĐ12) hiển thị tên thật — đúng thứ làm nó đọc được.
- 🔴 Người sau muốn thêm bất kỳ đường gửi dữ liệu nào ra ngoài **phải đọc ADR này trước**.
  Cho nhập tên thật và dựng backend là hai quyết định an toàn khi đứng riêng, và nguy hiểm
  khi đứng cạnh nhau.
- Mọi test vẫn dùng tên bịa. Không lấy bài làm thật làm dữ liệu mẫu, kể cả một lần.
