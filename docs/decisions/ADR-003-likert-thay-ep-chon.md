# ADR-003 — Dùng thang Likert có câu đảo chiều, không dùng ép chọn

**Ngày:** 27/08/2026 · **Trạng thái:** ĐÃ CHỐT · **Nguồn:** `docs/BA/DISC_BA.md` §3.4

## Quyết định

Dùng **thang Likert** (3 mức cho tiểu học, 5 mức cho các bộ còn lại), **mỗi trục có ít
nhất một câu đảo chiều**. KHÔNG dùng dạng ép chọn nhất/nhì của "DISC Classic".

## Lý do — bốn điểm chống lại dạng ép chọn

1. **Điểm ipsative:** chỉ so được trong nội bộ một người, không so được giữa người với
   người. Mà "so con mình với các bạn" đúng là thứ phụ huynh sẽ làm — và cũng là thứ
   **vùng lệch con ↔ cha mẹ** bắt buộc phải làm được.
2. **Không đo được độ tin cậy** theo cách thông thường, vì bốn mục trong một nhóm phụ
   thuộc nhau.
3. **Nghiên cứu chỉ thẳng vào ca của ta:** dạng ép chọn cho độ tin cậy thấp ở *bài thiết
   kế đơn giản — ít nhân tố hoặc bài ngắn*. DISC có đúng 4 nhân tố và ta muốn bài ngắn.
4. **~25 phút**, và bắt trẻ cân bốn tính từ trừu tượng cùng lúc 28 lần.

Nhược điểm duy nhất của Likert — thiên vị "trả lời cho đẹp" và tật tick một cột — được
**câu đảo chiều** giải quyết, và câu đảo chiều không tốn thêm câu nào.

## Hệ quả

- Chấm bằng phép cộng: **ai cũng kiểm lại bằng tay được**.
- Chuẩn hoá về thang 0–100 nên năm bộ đề khác số câu, khác số mức vẫn so được với nhau —
  điều kiện bắt buộc để có vùng lệch.
- 🔴 **Mỗi trục phải giữ ít nhất một câu đảo chiều.** `tests/cau-hoi.test.ts` canh.
- Hàng rào `HL-3` (mâu thuẫn thuận/đảo) chỉ hoạt động khi còn câu đảo.

## Chưa làm

Dạng **hỗn hợp** (Likert + vài nhóm ép chọn) tốt hơn ép chọn thuần ở thiết kế đơn giản.
Để dành bản 2, **nếu dữ liệu thật cho thấy có tô hồng**.
