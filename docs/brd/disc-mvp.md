# BRD — Khoang DISC, bản 1

> **Mã:** `DISC-BRD-v1.0` · **Ngày:** 27/08/2026 · **Trạng thái:** phản ánh thứ ĐÃ XÂY XONG
>
> Tài liệu này chốt **phạm vi**. Đặc tả nghiệp vụ chi tiết (104 câu hỏi, thuật toán chấm,
> văn bản báo cáo) nằm ở `docs/BA/DISC_BA.md`. Lộ trình thi công ở `PLAN.md`.

---

## 1. Bài toán

SATA ROBO cần một thứ để phụ huynh **chạm vào trước khi nghĩ đến chuyện đóng tiền**.

Bài trắc nghiệm DISC là cái cớ: phụ huynh bỏ 5–8 phút, nhận về một tấm ảnh nói điều gì đó
thật về con họ, và trong lúc đang cảm động thì thấy một ô *"để lại số, SATA ROBO tư vấn
thêm"*.

## 2. Sản phẩm giao ra là gì

🔴 **Không phải một ứng dụng chạy cho phụ huynh.**

Là một **bản mẫu chạy được trên máy local**, đóng gói để đội dev SATA ROBO bê vào ứng dụng
Next.js đã có sẵn của họ, dưới dạng **một tag ở thanh bên trái**.

Tiêu chí "xong" là *đội dev bê vào mất một buổi*, không phải *phụ huynh dùng được*.

## 3. Người dùng

| Nhóm | Làm gì | Bộ đề |
| ---- | ------ | ----- |
| Phụ huynh / giáo viên | Trả lời về bé 3–7 tuổi | `MN` — 20 câu, thang tần suất 5 mức |
| Học sinh lớp 3–5 | Tự làm | `TH` — 20 câu, 3 mức mặt cười, một câu một màn |
| Học sinh lớp 6–9 | Tự làm | `THCS` — 24 câu, 5 mức |
| Phụ huynh | Tìm hiểu về chính mình | `PH` — 24 câu, 5 mức |
| Phụ huynh | Trả lời về con 8–15 tuổi | `QS` — 16 câu, 5 mức |

## 4. Ba đường phụ huynh đi vào

1. Quảng cáo Fanpage / Zalo OA
2. Giáo viên đưa tận tay ở lớp
3. Mã QR ở sự kiện

Cả ba đường đều mang tham số `?nguon=` để đo phễu riêng từng kênh.

## 5. Bốn quyết định định hình sản phẩm

| # | Quyết định | Ghi ở |
| - | ---------- | ----- |
| 1 | **Trẻ dưới 8 tuổi không tự đánh giá.** Mầm non và lớp 1–2 dùng bộ quan sát do người lớn điền | `ADR-002` |
| 2 | **Thang Likert có câu đảo chiều**, không dùng ép chọn nhất/nhì | `ADR-003` |
| 3 | **Không backend.** Dữ liệu không rời máy người dùng — cũng là lớp phòng vệ pháp lý | `ADR-001` |
| 4 | **Vùng lệch con ↔ cha mẹ là tính năng chủ lực**, không phải phần thưởng thêm | `DISC_BA.md` §8 |

## 6. Phạm vi — LÀM ở bản 1

- ✅ Năm bộ đề, 104 câu, thứ tự trộn chốt cứng
- ✅ Lõi chấm điểm + năm hàng rào hợp lệ `HL-1..HL-5`
- ✅ Màn kết quả: nhân vật + biểu đồ 4 cột + bốn khối diễn giải
- ✅ **Vùng lệch con ↔ cha mẹ** + chuyền tay chủ động
- ✅ Ảnh PNG 1080×1350 để chia sẻ + in PDF
- ✅ Lưu bài trên máy (IndexedDB) + sao lưu `.zip` + xoá được
- ✅ Ô thu liên hệ (có điểm cắm cho backend đội dev) + bốn mốc phễu
- ✅ Chạy được khi mất mạng · điều hướng bằng bàn phím · tương phản đạt chuẩn
- ✅ Gói bàn giao: hướng dẫn cắm, 3 OVERVIEW, 4 ADR

## 7. Phạm vi — KHÔNG LÀM ở bản 1

| Không làm | Vì sao |
| --------- | ------ |
| Backend, cơ sở dữ liệu, Supabase | Module sắp bê sang app đã có backend riêng. Và không giữ dữ liệu thì không phát sinh nghĩa vụ NĐ 13/2023 |
| Đăng nhập, tài khoản, phân quyền | Chưa có câu hỏi nào mà chỉ đăng nhập mới trả lời được |
| Bảng quản trị cho đội sale | Đội dev nối `onGuiLienHe` vào hệ thống họ đã có |
| Gửi kết quả cho giáo viên / so với các bạn cùng lớp | Cần backend ⇒ phá ADR-001; gửi kèm kết quả trẻ ⇒ phá hàng rào dữ liệu |
| Google Analytics, Facebook Pixel | Trang có dữ liệu hành vi trẻ em. Bốn bộ đếm tự viết là đủ |
| Bộ đề cho GIÁO VIÊN quan sát học sinh | Cấu trúc đã sẵn, nhưng đừng mở thêm mặt trận khi bản 1 chưa chạy |
| Tuyên bố "chuẩn quốc tế" | Chưa có bộ dữ liệu chuẩn hoá trên người Việt |

## 8. Nghiệm thu

12 DEMO bấm tay ở `PLAN.md` §4. Ba cái quan trọng nhất:

| # | Thao tác | Phải thấy |
| - | -------- | --------- |
| **4** | Chọn mức giữa cho cả 24 câu | 🔴 **KHÔNG ra kết quả** |
| **10** | Sao lưu `.zip` rồi giải nén | Đủ **mọi** bài của **mọi** bộ đề |
| **12** | Mở tab Network trong lúc làm bài | **Không request nào mang câu trả lời** |

## 9. Điều kiện ra người dùng thật

Ba việc **không phải việc code**, phải xong trước ngày chạy quảng cáo — chi tiết ở mục
"CHỜ NGOÀI" của `CLAUDE.md`:

1. 🔴 Người có chuyên môn tâm lý/giáo dục **ký duyệt** 104 câu hỏi và văn bản báo cáo.
2. 🔴 Chạy `scripts/phan-tich-item.mjs` trên **30–50 phản hồi thật**.
3. ⚠️ Nộp 3 mẫu quảng cáo cho Facebook duyệt — chính sách của họ hạn chế quảng cáo ngụ ý
   biết đặc điểm tâm lý của người thân người xem.

## 10. Rủi ro lớn nhất, nói thẳng

**Bộ 104 câu chưa ai kiểm, nhưng sản phẩm trông rất giống đang đo.**

Năm hàng rào hợp lệ, câu đảo chiều, luật trộn thứ tự — toàn bộ bộ đó làm sản phẩm **trông
nghiêm túc hơn**, trong khi không cái nào làm cho bộ câu hỏi **đo đúng hơn**. Chúng chặn
người trả lời ẩu; chúng không chặn câu hỏi sai.

Đừng nhầm hai chuyện đó với nhau khi đọc kết quả. Mục 9 tồn tại vì lý do này.
