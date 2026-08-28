"use client";

/**
 * DẢI CHỌN BẢN Ở MÀN KẾT QUẢ (17.2).
 *
 * 🔴 VÌ SAO CÓ. Mỗi người giữ tối đa 2 bài trên máy (`GIOI_HAN_BAI_MOI_NGUOI`), nhưng màn
 * *Xem kết quả* trước đây chỉ mở được `bai[0]` — bài mới nhất. Làm hai lần đo mà chỉ đọc
 * lại được một thì lần đo kia coi như không tồn tại.
 *
 * 🔴 CHỈ CHO XEM LẦN LƯỢT, KHÔNG SO SÁNH. Đây là ranh giới quan trọng nhất của cả hạng mục.
 * Việc so hai bài với nhau có **sàn 90 ngày** (`so-sanh-thoi-gian.ts`) vì một nấc trả lời
 * dịch điểm 4–10 điểm: hai bài cách nhau ba tuần thì thứ hiện lên là **nhiễu của phép đo**,
 * và nó vẫn đọc lên đầy thuyết phục vì có số kèm theo. Dải này không tính, không trừ,
 * không nói "đã thay đổi" — nó chỉ đổi bài đang xem.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { CHU_CHON_BAN } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { hienNgayGio } from "@modules/core/tien-ich/ngay";

export type BanCoTheXem = {
  readonly id: string;
  /** ISO 8601 — mốc làm xong, dùng làm nhãn. */
  readonly ketThuc: string;
  readonly boDe: string;
};

export function ChonBanKetQua({
  cacBan,
  dangChon,
  onChon,
}: {
  /** Đã sắp MỚI TRƯỚC (đúng thứ tự `docTatCa()` trả về). */
  readonly cacBan: readonly BanCoTheXem[];
  readonly dangChon: number;
  readonly onChon: (chiSo: number) => void;
}) {
  // 🔴 Một bài thì KHÔNG dựng gì. Một dải chọn có đúng một lựa chọn là một nút bấm vào
  // rồi chẳng đi tới đâu — cùng lỗi với nút mục thanh bên đã gỡ ở V2.1.
  if (cacBan.length < 2) return null;

  return (
    <nav
      data-thu="chon-ban-ket-qua"
      data-so-ban={cacBan.length}
      aria-label={CHU_CHON_BAN.nhanVung}
      className="mb-5"
    >
      <p className="text-[13px] text-neutral-600">{CHU_CHON_BAN.moTa}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {cacBan.map((b, i) => {
          const mo = i === dangChon;
          return (
            <button
              key={b.id}
              type="button"
              data-thu="nut-ban"
              aria-current={mo ? "true" : undefined}
              onClick={() => onChon(i)}
              className={[
                "min-h-[44px] rounded-xl border px-3.5 text-[14px] font-semibold",
                "transition-colors duration-150 motion-reduce:transition-none",
              ].join(" ")}
              style={
                mo
                  ? { backgroundColor: MAU.timCongNghe, borderColor: MAU.timCongNghe, color: "#fff" }
                  : { borderColor: MAU.vienMo, color: MAU.timCongNghe }
              }
            >
              {/* 🔴 CÓ GIỜ, KHÔNG CHỈ NGÀY. Hai bài làm cùng một buổi chiều mà chỉ hiện ngày
                  thì ra hai nhãn giống hệt nhau, và người dùng không có cách nào biết mình
                  đang chọn cái nào. Đúng lỗi đã sửa ở 16.3 cho ô chọn bản phân tích. */}
              {hienNgayGio(b.ketThuc)}
              {i === 0 && (
                <span className="ml-1.5 text-[12px] font-normal opacity-80">
                  {CHU_CHON_BAN.nhanMoiNhat}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
