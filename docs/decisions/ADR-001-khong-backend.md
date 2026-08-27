# ADR-001 — Bản 1 không có backend

**Ngày:** 27/08/2026 · **Trạng thái:** ĐÃ CHỐT · **Thay thế:** mục Stack cũ trong `CLAUDE.md`

## Bối cảnh

`CLAUDE.md` lúc khởi tạo khai stack là **Next.js + Supabase (DB/Auth) + Vercel**.
`docs/BA/DISC_BA.md` §2 lại khai **không backend, không cơ sở dữ liệu, 0đ/tháng**.
Hai bản này không thể cùng đúng.

Thêm một dữ kiện quyết định: sản phẩm này **không chạy độc lập**. Nó được viết để đội dev
SATA ROBO bê vào ứng dụng Next.js đã có sẵn của họ — ứng dụng đó đã có backend riêng.

## Quyết định

**Bản 1 chạy 100% trong trình duyệt. Không backend, không cơ sở dữ liệu, không Supabase.**

Thu liên hệ đi qua **một điểm cắm** `onGuiLienHe(payload)`; bản mặc định chỉ lưu
`localStorage` và mở Zalo. Đội dev nối vào backend của họ bằng đúng một hàm.

## Lý do

1. **Dựng thứ sẽ bị vứt.** Module sắp được bê sang một app đã có backend. Dựng một
   Supabase riêng bây giờ là dựng thêm một hoá đơn, một bộ khoá phải canh, và một thứ đội
   dev sẽ gỡ ngay ngày đầu tiên.
2. **Lớp phòng vệ pháp lý — lý do mạnh hơn cả chi phí.** Câu trả lời của trẻ không rời máy
   người dùng ⇒ SATA ROBO gần như không nắm giữ dữ liệu cá nhân của trẻ ⇒ phần lớn nghĩa
   vụ theo Nghị định 13/2023 không phát sinh. Lợi thế đó **miễn phí**, và nó vỡ ngay khi
   có một cái bảng lưu kết quả.
3. **Chi phí biên bằng 0.** Trang tĩnh: 100 lượt xem hay 50.000 lượt đều 0đ.

## Hệ quả

- ✅ 0đ/tháng thật, không phải "0đ cho đến khi có người dùng".
- ✅ Không có máy chủ để sập, không có khoá để lộ, không có bản sao lưu để quên.
- ❌ **Không bao giờ biết được số liệu tổng hợp** ("trung bình học sinh lớp 5 điểm D bao
   nhiêu"). Chấp nhận: đây là mồi thu khách, không phải nghiên cứu.
- ❌ Phụ huynh xoá dữ liệu duyệt web là mất bài. Đã bù bằng nút sao lưu `.zip` và dòng
   nhắc ở đáy thanh bên.
- 🔴 **Ràng buộc kèm theo (QĐ3):** payload liên hệ TUYỆT ĐỐI không chứa dữ liệu của trẻ.
   `tests/lien-he-sach.test.ts` canh.

## Khi nào xem lại

Ba ngưỡng đo được, chưa chạm thì chưa mở lại:

1. Đội sale phải chép tay số điện thoại từ chỗ khác → thêm bảng **lead** (chỉ lead).
2. Trên 200 người/tháng làm xong và cần biết họ rơi ở đâu → phân tích phễu sâu hơn.
3. Trường/trung tâm khác hỏi mua → tài khoản, phân quyền — và đó là **một dự án khác**.
