# ADR-002 — Trẻ dưới 8 tuổi không tự đánh giá

**Ngày:** 27/08/2026 · **Trạng thái:** ĐÃ CHỐT · **Nguồn:** `docs/BA/DISC_BA.md` §3.2

## Bối cảnh

Đây là chỗ mà một sản phẩm DISC cho trẻ em hoặc đứng vững, hoặc bịa số.

## Quyết định

| Tuổi | Lớp | Ai trả lời | Bộ đề |
| ---- | --- | ---------- | ----- |
| 3–5 | Mầm non | 🔴 Người lớn quan sát | MN |
| 6–7 | Lớp 1–2 | 🔴 Người lớn quan sát | MN |
| 8–11 | Lớp 3–5 | ✅ Bé tự làm, thang **3 mức** | TH |
| 11–15 | Lớp 6–9 | ✅ Tự làm, thang 5 mức | THCS |
| Người lớn | — | ✅ Tự làm, thang 5 mức | PH |

🔴 **Lớp 1–2 không bao giờ được ra bộ TH**, và khi bị chuyển sang bản quan sát thì **phải
hiện hộp giải thích**. Chuyển im lặng là lừa người dùng; không chuyển là bịa số.

## Lý do

- Phương sai do "gật bừa" ở trẻ em **lớn gấp đôi người lớn**.
- Công cụ chuẩn cho lứa 3–7 tuổi trên thế giới (Children's Behavior Questionnaire của
  Rothbart) là bảng do **phụ huynh điền**. Không tồn tại bản trẻ mẫu giáo tự làm — vì lứa
  tuổi đó chưa có khả năng nhìn lại bản thân theo kiểu đặc điểm.
- Số mức trả lời càng ít càng tốt với trẻ nhỏ: khoảng 4 mức là tối ưu, trên 7 mức thì độ
  tin cậy giảm. Bộ TH dùng 3 mức có chủ đích.
- Có hẳn một dòng nghiên cứu chỉ để trả lời câu "từ tuổi nào trẻ tự báo cáo được"
  (Conijn & cs.) — bản thân sự tồn tại của nó là bằng chứng rằng câu trả lời **không phải
  "mọi lứa tuổi đều được"**.

## Hệ quả

- Giao diện **bắt buộc hỏi lớp** khi người dùng chọn "Tiểu học".
- Báo cáo bộ MN và TH **bắt buộc mở đầu bằng câu rào**: *"Đây là gợi ý để trò chuyện với
  con, không phải kết luận về con."*
- Bộ QS (bố mẹ nhìn con) **chỉ mở khi con ≥ 8 tuổi** — nó cần bài con tự làm để đối chiếu.
- `tests/dinh-tuyen.test.ts` quét toàn bộ 9 lớp và mọi đường vào, khẳng định **không
  đường nào** đưa trẻ dưới 8 tuổi vào bộ tự làm.

## Nếu bỏ quyết định này

Cho bé 4 tuổi tick thang Likert tạo ra một hồ sơ **trông rất chuyên nghiệp, đo bằng số
ngẫu nhiên**. Lỗi im lặng tuyệt đối: không có gì báo đỏ, phụ huynh tin, và có thể đối xử
với con theo một cái nhãn sai.
