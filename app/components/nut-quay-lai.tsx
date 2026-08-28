"use client";

/**
 * NÚT LÙI LẠI — một khuôn duy nhất cho bảy chỗ (18.7).
 *
 * 🔴 VÌ SAO GOM. Bảy chỗ trong sản phẩm dùng CHUNG một chuỗi class chép tay
 * (`text-[13px] text-neutral-600 underline`), và chỉ sau vài đợt sửa chúng đã lệch nhau
 * BA lần: 3/7 thiếu vòng focus bàn phím, 4/7 thiếu `data-khong-in`, và một chỗ gõ cứng
 * chữ "Quay lại" thay vì lấy từ từ điển. Đó không phải suy đoán về tương lai — đó là số
 * đếm được trên mã hôm nay. Chuỗi class chép tay thì không giữ được.
 *
 * 🔴 MŨI TÊN `←` PHẢI NẰM TRONG TÊN TRỢ NĂNG — KHÔNG `aria-hidden`, KHÔNG đổi sang SVG.
 * `tests/lam-bai-tu-the.test.tsx` tìm nút bằng chính chuỗi `"← Nhà mình"`. Bọc mũi tên lại
 * cho "sạch DOM" thì tên trợ năng chỉ còn `"Nhà mình"` — test đỏ, **và** người dùng trình
 * đọc màn hình mất luôn dấu hiệu duy nhất phân biệt nút LÙI với nút ĐÓNG.
 *
 * 🔴 VÌ SAO KHÔNG NHẤP NHÁY. Chủ dự án nêu ý đó rồi tự chốt bỏ: làm nổi bằng HÌNH KHỐI.
 * Cái gì nháy mãi thì thành nền và người ta thôi nhìn — đúng lý do `V4.2` chốt "nhắc một
 * lần rồi thôi". Và màn hình này có trẻ mầm non ngồi trước.
 *
 * 🔴 Đặt ở `app/components/` chứ không `config/`: nó có JSX, mà `config/` thuộc TẦNG LÕI
 * và `tests/ranh-gioi-hai-tang.test.ts` cấm React ở đó.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { MAU } from "@config/thuong-hieu";

export function NutQuayLai({
  nhan,
  onBam,
  khongIn = true,
  themLop = "",
}: {
  /** Chữ đứng SAU mũi tên. Component tự gắn `"← "` — nơi gọi KHÔNG tự gõ mũi tên. */
  readonly nhan: string;
  readonly onBam: () => void;
  /** Gắn `data-khong-in`. Mặc định BẬT: giấy không bấm được, in nút ra là in rác. */
  readonly khongIn?: boolean;
  /** Lớp BỐ CỤC đặt thêm (`mt-6`…). Không dùng để đè kiểu dáng. */
  readonly themLop?: string;
}) {
  return (
    <button
      type="button"
      onClick={onBam}
      data-thu="nut-quay-lai"
      {...(khongIn ? { "data-khong-in": "" } : {})}
      /* 🔴 `transition-[…]` và `motion-reduce:` phải nằm CÙNG MỘT DÒNG NGUỒN —
         `tests/mau-va-chuyen-dong.test.tsx` soi theo TỪNG DÒNG, tách ra cho đẹp là đỏ.
         Và `transform` phải có trong danh sách, nếu không nút NHẢY chứ không LÚN. */
      className={`inline-flex min-h-[44px] items-center rounded-xl border-[1.5px] bg-white px-4 text-[14px] font-semibold shadow-noi-1 transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 ${themLop}`}
      style={{
        borderColor: MAU.timCongNghe,
        color: MAU.timCongNghe,
        outlineColor: MAU.timCongNghe,
      }}
    >
      ← {nhan}
    </button>
  );
}
