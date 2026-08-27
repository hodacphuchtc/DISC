# ADR-006 — Năm câu một màn cho MỌI bộ đề

**Ngày:** 27/08/2026 · **Trạng thái:** ĐÃ CHỐT · **Lật:** `DISC_BA.md` §5.2

## Bối cảnh

Đặc tả §5.2 chia hai kiểu trình bày: **MN và TH một câu một màn**, các bộ còn lại năm câu.
Lý do ban đầu hợp lý: trẻ nhỏ nhìn thấy 20 câu cùng lúc thì nản trước khi bắt đầu.

Chạy thử GĐ10 cho thấy cái giá của nó ở đầu kia. Bộ Tiểu học 20 câu thành **20 lần bấm
*Tiếp*** — hai mươi lần chuyển màn, hai mươi lần mất chỗ đang đọc, và một thanh tiến trình
nhích từng nấc bé xíu. Chủ dự án làm thử rồi chốt: **5 câu/màn cho mọi bộ**.

## Quyết định

`cauMoiMan` của **MN** và **TH** đổi từ `1` sang `5`. Kiểu của trường nới từ `1 | 5` thành
`number` — con số này là lựa chọn trình bày, không phải luật, nên khoá cứng hai giá trị chỉ
làm lần sau muốn thử 3 hay 4 câu lại phải sửa kiểu.

**Giảm thiệt hại — phần này KHÔNG được bỏ:**

1. **Mỗi câu là một THẺ CÓ KHUNG.** Viền 1px trung tính, viền trái 3px. Không có khung thì
   năm câu nằm trần trên nền trắng và mắt không có gì để bám mà tách chúng ra — chủ dự án
   đã chụp màn hình đúng chỗ này và nói chúng "dính vào nhau".
2. **Viền trái đổi TÍM → CAM khi đã chọn.** Nhìn lướt một cái là biết còn sót câu nào.
3. **Số thứ tự đếm theo CẢ BÀI** (`11`), không theo trang (`1` của trang 3). Người làm bài
   quan tâm còn bao nhiêu câu nữa, không quan tâm mình đang ở trang mấy.
4. **Bấm *Tiếp* khi còn trống thì cuộn tới đúng câu thiếu.** Với màn một câu, "còn câu chưa
   chọn" là đủ. Với màn năm câu, báo mà không chỉ chỗ là bắt người ta tự dò lại.
5. 🔴 **Bộ trẻ nhỏ GIỮ chữ ≥18px và nút ≥56px**, khoá theo `canNutTo()` trong
   `config/disc-nguong.ts`.

## Lý do

Điểm 5 là phần đắt nhất của ADR này, và nó suýt bị bỏ sót.

Trước 11.3, cỡ chữ và cỡ nút được suy từ `boDe.cauMoiMan === 1`. Tiện — vì lúc đó đúng hai
bộ MN và TH có một câu một màn. Nhưng đó là suy từ **một thứ khác hẳn**: số câu trên màn nói
về mật độ trình bày, cỡ nút nói về ngón tay của một đứa bé sáu tuổi. Hai khái niệm chỉ
**tình cờ** trùng nhau.

Đổi `cauMoiMan` sang 5 mà không đụng gì khác thì ngay lúc đó cả hai bộ dành cho trẻ nhỏ nhất
lặng lẽ tụt xuống chữ 14px và nút 44px. **Không một test nào đỏ. Không ai thấy.** Đúng vết
xe của bảng đại từ một chiều ở GĐ10, thứ đã cắt mất lời khuyên của toàn bộ phụ huynh học
sinh tiểu học và THCS suốt một giai đoạn.

## Thời điểm — vì sao đổi bây giờ chứ không phải sau

`cauMoiMan` nằm trong checksum bộ đề (`modules/core/bo-de/bam.ts`), nên **đổi nó huỷ mọi bài
đang làm dở**. Hiện gần như chưa ai có bài dở, nên đây là lúc rẻ nhất. Sáu tháng nữa với
1.000 gia đình thì đắt hơn nhiều.

Kèm theo bắt buộc: `PHIEN_BAN_BO_DE` lên `1.1`, chạy `node scripts/sinh-checksum.mjs`, và
**nói ra tử tế** khi gặp nháp phiên bản cũ. Im lặng vứt bài của người ta rồi hiện màn trắng
tinh là cách nhanh nhất để họ kết luận phần mềm ăn mất bài.

## Hệ quả

- Bộ TH: 20 câu → **4 trang** thay vì 20. Bộ MN: 24 câu → 5 trang.
- `tests/m3-lam-bai.test.tsx` và `tests/tien-trinh.test.ts` đỏ khi đổi — **đúng**, chúng
  đang canh luật cũ. Sửa chúng là ghi nhận đặc tả mới, không phải sửa cho xanh.
- `canNutTo()` là hằng riêng trong `config/`, **không suy từ `cauMoiMan`**. Người sau thêm
  bộ đề cho trẻ nhỏ phải thêm mã bộ đề vào `BO_DE_TRE_NHO`.
