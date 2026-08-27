# DATA_TEST — dữ liệu mẫu để bấm thử

> 🗑️ **Xoá cả thư mục này lúc nào cũng được.** Không file nào ngoài thư mục trỏ vào đây:
> không test nào import, `npm run kiem` / `npm run build` không đụng tới. Xoá xong ứng dụng
> chạy y nguyên.

> 🔴 **Mọi biệt danh trong này là BỊA.** Không có một mẩu dữ liệu thật nào của trẻ, và đừng
> bao giờ thay bằng dữ liệu thật — repo này **CÔNG KHAI** (guardrail 2 của `CLAUDE.md`,
> Nghị định 13/2023).

## Dùng thế nào

```bash
npm run dev                                  # để app chạy ở localhost:3000
node tests/DATA_TEST/tao-du-lieu-mau.mjs     # sinh lại dữ liệu (không bắt buộc, đã sinh sẵn)
```

**Nạp:** mở `http://localhost:3000` → DevTools (⌥⌘I) → tab **Console** → dán trọn nội dung
`nap-vao-trinh-duyet.js` → Enter → mở màn **Bài đã làm**.

**Xoá:** dán trọn `xoa-du-lieu-mau.js` vào Console. Nó chỉ xoá bản ghi có id bắt đầu bằng
`mau-disc-`; **bài thật trên máy không bị đụng**.

> ℹ️ Vì sao phải dán vào Console chứ không có nút bấm: repo **không có hàm nhập**.
> `app/khoang/lich-su.tsx` chỉ có nút *tải xuống*, `JSZip.loadAsync` chỉ xuất hiện trong test.
> Đường duy nhất để đưa dữ liệu vào là ghi thẳng IndexedDB (kho `disc`, bảng `bai-lam`).

## Tám mẫu

| # | Bộ đề | Biệt danh | Kết quả chấm được | Dùng để thử |
| --- | --- | --- | --- | --- |
| 01 | MN | Bé Bún | đơn **D** · D=90 I=55 S=35 C=45 | Mầm non, phụ huynh trả lời hộ. Một trục nổi rất rõ |
| 02 | TH | Su Kem | pha **I-S** · D=40 I=70 S=70 C=30 | Tiểu học tự làm, **thang 3 mức** — chỗ thô nhất của phép đo |
| 03 | THCS | Tí Nị | đơn **C** · D=37,5 I=45,8 S=54,2 C=79,2 | THCS tự làm. Ghép cặp với 04 |
| 04 | QS | Tí Nị | đơn **D** · D=68,8 I=43,8 S=31,3 C=56,3 | Bố mẹ nhìn **đúng đứa trẻ ở 03** → mở khoá màn **Vùng lệch** |
| 05 | PH | Mẹ Bống | đơn **S** · D=29,2 I=45,8 S=75 C=54,2 | Phụ huynh tự đánh giá. Đặt cạnh 03 (con nhóm C) để thử phần so sánh phong cách bố mẹ ↔ con |
| 06 | THCS | Kem Bơ | **phổ đều** · D=54,2 I=54,2 S=50 C=50 | Bốn nhóm sát nhau — màn kết quả **không được ép nhãn** |
| 07 | MN | Cà Rốt | ❌ **CHẶN: PHANG** | 80% câu chọn mức giữa. Hàng rào HL-1 phải chặn, **không** trả kết quả |
| 08 | TH | Nem Rán | đơn **S** + ⚠️ `MOT_COT` | 9 câu liên tiếp cùng đáp án. Vẫn trả kết quả nhưng kèm cảnh báo |

**Cặp 03 + 04 cho ra vùng lệch có đủ ba mức** (đã chạy `doiChieu()` thật để kiểm):

| Trục | Con tự thấy | Bố mẹ thấy | Lệch | Mức |
| --- | --- | --- | --- | --- |
| D | 37,5 | 68,8 | −31,3 | **Khác rõ** |
| I | 45,8 | 43,8 | +2,0 | Trùng khớp |
| S | 54,2 | 31,3 | +22,9 | Hơi khác |
| C | 79,2 | 56,3 | +22,9 | Hơi khác |

Hai ca biên cũng trả đúng lý do: *Kem Bơ* → `THIEU_BAI_BO_ME`, *Cà Rốt* → `THIEU_BAI_CON`.

## Dữ liệu được dựng thế nào

`tao-du-lieu-mau.mjs` khai mỗi trục một **bộ giá trị sau-đảo-chiều**, rồi quy ngược thành giá
trị thô cho câu `dao: true`. `ketQua` **do chính `cham()` của tầng lõi tính**, không gõ tay —
đổi ngưỡng trong `config/disc-nguong.ts` rồi chạy lại script là dữ liệu mẫu tự đúng theo.

**Hai cái bẫy đã trả giá khi dựng bộ này** (đừng lặp lại nếu sửa các bộ giá trị):

1. **Câu ĐẢO phải nhận giá trị sát trung bình của trục.** Mỗi trục chỉ có 0–1 câu đảo, nên nếu
   nó vớ phải giá trị ở rìa (vd `1` trong `[3,3,3,2,1]`) thì một mình nó thành cả "trung bình
   câu đảo", lệch xa trung bình câu thuận và ăn cảnh báo `MAU_THUAN` — **dù hồ sơ hoàn toàn
   nhất quán**. Mẫu 02 và 04 đều đỏ vì chuyện này ở lần sinh đầu.
2. **Bốn trục cùng dáng phân bố thì dễ ăn `MOT_COT` oan.** Thứ tự hiển thị trộn các trục, nên
   bốn trục cùng dùng nhiều `4` và `2` sẽ tạo ra chuỗi ≥8 câu liền nhau cùng đáp án. Mẫu 06
   (phổ đều) dính đúng cái này ở lần sinh thứ hai — phải rải giá trị đa dạng hơn.

Ngoài ra: thời gian làm bài đặt **8 giây/câu** để không dính cảnh báo `BAM_BUA` (ngưỡng 2,5).
