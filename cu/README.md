# `cu/` — vùng cách ly đồ đã thôi dùng

> Chốt 28/08/2026: *"những cái cũ đã dev nhưng không dùng trong luồng mới thì tạm cách ly
> ra một vùng, đặt tên là cũ, và có thể sau này sẽ xoá — làm sao không ảnh hưởng đến hệ
> thống hoặc có thể dùng lại sau này."*

## Luật của thư mục này

1. **Không file nào trong `app/`, `modules/`, `config/` được import từ đây.** Nhập một
   chiều: đồ ở đây được phép đọc `config/` và `modules/`, không chiều ngược lại. Vi phạm
   là kéo đồ đã nghỉ quay lại đường chạy chính mà không ai chủ ý.
2. **Test của đồ ở đây vẫn chạy.** Không xoá test cùng lúc với việc cách ly: test là thứ
   duy nhất còn mô tả được đồ này từng làm gì, và nếu ngày mai cần dùng lại thì nó là bản
   đặc tả sẵn có.
3. **Xoá thật khi nào?** Khi đã phát cho gia đình thật và chắc chắn không quay lại. Xoá
   sớm thì tiết kiệm được vài KB, mà mất một bản dựng đã chạy đúng.

## Đang cách ly

| File | Vốn là gì | Thay bằng |
| --- | --- | --- |
| `lich-su.tsx` | Màn *Bài đã làm* — danh sách bài xếp theo thời gian | **Bảng gia đình** (`app/khoang/bang-gia-dinh.tsx`, GĐ12/ADR-007). Mỗi người một thẻ, nhìn một cái biết ai chưa làm |

🔴 `lich-su.tsx` thật ra **đã chết từ GĐ12** — không component nào import nó suốt từ đó,
chỉ có test giữ nó sống. Đúng kiểu code chết mà không ai biết là chết: nó vẫn nằm trong
`app/khoang/` cạnh các màn đang chạy, nên người đọc sau tưởng nó còn hiệu lực.
