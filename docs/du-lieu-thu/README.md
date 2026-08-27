# Dữ liệu thử cho `scripts/phan-tich-item.mjs`

## 🔴 `mau-bia.csv` là DỮ LIỆU BỊA

40 dòng trong `mau-bia.csv` do máy sinh ra bằng một hàm ngẫu nhiên tất định. **Không có
một người thật nào trả lời chúng.**

Chúng chỉ để chứng minh **công cụ chạy được**. Con số alpha ~0,97 tính ra từ đó **không
nói gì** về chất lượng bộ 104 câu hỏi — dữ liệu bịa được sinh từ đúng một biến ẩn cho mỗi
trục nên nó nhất quán một cách giả tạo. Dữ liệu người thật luôn thấp hơn nhiều.

Câu `THCS-S5` trong file được cố ý làm hỏng (trả lời ngẫu nhiên, không theo trục) để thấy
công cụ có bắt được câu xấu không. Nó bắt được: `r = 0,26` giữa một rừng `~0,90`.

## Dữ liệu THẬT để ở đâu

🔴 **KHÔNG để bài làm thật trong `docs/`.** Thư mục `docs/` được commit lên GitHub, và câu
trả lời của trẻ là dữ liệu cá nhân theo Nghị định 13/2023.

Đặt file thật ở thư mục `/du-lieu-thu/` tại gốc dự án — đã có trong `.gitignore`:

```
node scripts/phan-tich-item.mjs du-lieu-thu/phan-hoi-thang-9.csv
```

## Định dạng CSV

- Dòng đầu: **mã câu**, cách nhau bằng dấu phẩy — `THCS-D1,THCS-I6,THCS-S1,...`
- Mỗi dòng sau: một người trả lời, giá trị **thô** từ `1` đến số mức của thang.
- Cột không khớp mã câu nào sẽ bị bỏ qua và báo ra màn hình.
- Dòng có giá trị ngoài thang bị loại và đếm riêng.

Script tự đảo chiều các câu đảo trước khi tính — **đừng đảo sẵn trong file**.
