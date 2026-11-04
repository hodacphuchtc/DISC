# ADR-010 — Thẻ "Sức khoẻ gia đình": chỉ số và gợi ý chung, không chẩn đoán

- **Ngày:** 03/11/2026
- **Trạng thái:** Đã chốt phạm vi và giao diện (chủ dự án duyệt 03/11/2026); nội dung lời khuyên CHỜ chữ ký Gói C
- **Bối cảnh:** `PLAN_V4.md` giai đoạn 30
- **Mở rộng:** phạm vi sản phẩm của ADR-001 (vẫn 100% trong trình duyệt, không backend)

## Vấn đề

Để giữ chân gia đình, ngoài DISC chủ dự án muốn một thẻ nhập ngày sinh, giới tính, cân nặng,
chiều cao rồi ra chỉ số sức khoẻ và gợi ý ăn uống, vận động, nghỉ ngơi theo tuổi. Đây là **dữ liệu
sức khoẻ — loại nhạy cảm theo Nghị định 13/2023**, và của cả trẻ em.

## Quyết định

1. **Thẻ nằm dưới DISC**, nạp lười (chunk riêng), sau cờ `MO_SUC_KHOE` (`config/suc-khoe-nguong.ts`).
   Cờ đang `false`. Trong lúc nội dung còn là bản nháp, xem thử qua `?suc-khoe=1` — 🔴 tham số địa
   chỉ KHÔNG phải hàng rào bảo mật. Tắt cờ = thẻ biến mất, dữ liệu đã nhập vẫn còn.
2. **Không backend, không thư viện mới.** Tính toán thuần ở `modules/core/suc-khoe/` (tầng lõi,
   ADR-004). PDF dùng lại `jspdf` của ADR-009 (nạp lười). Giao diện dùng CSS/SVG thuần, không Lottie.
3. **Hạn mức (chủ dự án chốt 03/11/2026): tối đa 6 người, mỗi người 3 bản mới nhất** — để không
   làm nặng bộ nhớ máy.
   - Bản thứ 4 của một người ⇒ bản cũ nhất của người đó bị THAY, tự động, có báo.
   - Người thứ 7 ⇒ KHÔNG tự xoá ai: hộp thoại bắt người dùng chọn một người để xoá, có nút tải bản
     sao lưu trước và nút huỷ (huỷ thì không mất gì).
4. **Lưu trữ:** bảng IndexedDB riêng `suc-khoe` trong kho `disc` (nâng `PHIEN_BAN_KHO` 2 → 3, chỉ TẠO
   bảng mới). Mỗi bản ghi là MỘT người, tự chứa ngày sinh, giới tính và ≤ 3 mốc đo; KHÔNG gắn vào
   `ThanhVien` của DISC. Hợp đồng sạch DOM ở `modules/core/suc-khoe/kho-suc-khoe.ts`
   (`datKhoSucKhoe()` để đội dev app chủ cắm bản dựng của họ).
5. **Sao lưu/khôi phục:** thêm tệp tuỳ chọn `_may-doc/suc-khoe.json` — chỉ ghi khi có dữ liệu, nên
   KHÔNG tăng `phienBanSaoLuu` và tệp đời trước vẫn nạp được. "Xoá sạch" dọn cả bảng này.
6. **Không chẩn đoán, không kê đơn.** Hiện chỉ số + phân loại + gợi ý chung; ngoài vùng nghi ngờ thì chỉ
   nói *"nên gặp bác sĩ / chuyên gia dinh dưỡng"*.
7. **Hàng rào an toàn cứng (có test):** người dưới 19 tuổi không bao giờ nhận lời khuyên giảm cân/ăn
   kiêng · không gắn nhãn "béo phì/thừa cân" cho trẻ · mang thai/cho con bú không tính BMI · bệnh nền
   chỉ nhắc hỏi bác sĩ · số đo ngoài khoảng hợp lý bị từ chối thay vì tính bừa.
8. **Riêng tư:** dữ liệu sức khoẻ không vào mã mời, ảnh chia sẻ, phiếu liên hệ (`KHOA_CAM` đã thêm
   `ngaySinh`, `gioiTinh`, `canNangKg`, `chieuCaoCm`, `vongEoCm`). Test và dữ liệu mẫu chỉ dùng người bịa.
9. **Lời nhắn miễn trừ** nằm DƯỚI kết quả, trong khung riêng, giọng Sata Robo; đi kèm trong PDF.
   Câu chữ nên được luật sư đọc lại trước khi bật cho người dùng thật.
10. **Nội dung lời khuyên cần chữ ký chuyên môn riêng (Gói C — nhi khoa/dinh dưỡng)**; hồ sơ sinh tự
    động ở `docs/noi-dung-cho-ky-duyet-goi-c.md`. Chưa ký thì cờ giữ TẮT với người dùng thật.
11. **Bảng chuẩn tăng trưởng WHO (30.1) CHƯA nhúng** — chờ xác minh giấy phép; không chép số từ trí
    nhớ. Hàm z-score LMS đã sẵn (`z-score.ts`, tra qua `TraBang`). Chưa có bảng thì trẻ chỉ nhận BMI thô
    kèm câu "chưa so được với bảng chuẩn tăng trưởng" — không bịa phân loại.
12. **Hình ảnh thương hiệu:** dùng ĐÚNG mascot và logo chính thức của SATA ROBO (nguồn:
    `MASTER SATA ROBO/config/brand-assets/`, nén còn ~40 KB + ~45 KB ở `public/brand/`). Không vẽ lại,
    không đổi màu, không méo dáng (Brand DNA §10, §18). 🔴 Repo DISC là CÔNG KHAI — hai tệp này lên
    internet khi push.

## Hệ quả

- Nâng kho v3 là một cuộc di trú nhỏ (chỉ thêm bảng); `tests/di-tru-so-gia-dinh.test.ts` đã canh bản nâng
  thật từ v1.
- Gói chính được canh sát trần: thẻ phải nạp lười, và hằng số dùng ở `app/page.tsx` KHÔNG được import từ
  file từ điển nặng (đã trả giá +6 KB gzip một lần).
