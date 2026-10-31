"use client";

import { CHU_DAY_DU } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { DayDuMotNguoi } from "@modules/report/do-day-du-bo-test";
import { tongKetDayDu } from "@modules/report/do-day-du-bo-test";

import { KhoiGap } from "./khoi-gap";
import { chuViecConThieu } from "./so-ban-da-lam";

/**
 * BẢNG KIỂM "BỘ TEST ĐÃ ĐỦ CHƯA?" (28.4) — đầu bước 3, CHẶN MỀM.
 *
 * Gọn: luôn thấy một dòng tóm tắt ("3/4 người đủ bản · Còn thiếu: Bé X"); bấm mới xổ danh
 * sách từng người. Không khoá nút Phân tích — gia đình đang dùng thử vẫn xem được — nhưng nói
 * thẳng làm đủ bản trước thì lời khuyên sát hơn. LUÔN GẬP sẵn (chủ dự án: dashboard gọn, bấm mới
 * xổ) — dòng tóm tắt đã nêu tên người còn thiếu nên không cần mở để biết.
 */
export function BangKiemDayDu({ ds }: { readonly ds: readonly DayDuMotNguoi[] }) {
  if (ds.length === 0) return null;
  const tk = tongKetDayDu(ds);
  const du = tk.conThieu.length === 0;

  const tomTat = (
    <>
      <span className="font-semibold" style={{ color: du ? MAU.timCongNghe : MAU.camDamChoChu }}>
        {CHU_DAY_DU.tongNguoi.replace("{du}", String(tk.soDu)).replace("{tong}", String(tk.tong))}
      </span>
      {!du && ` · ${CHU_DAY_DU.tomTatThieu.replace("{ds}", tk.conThieu.map((d) => d.ten).join(", "))}`}
    </>
  );

  return (
    <div data-khong-in data-thu="bang-kiem-day-du" data-day-du={du ? "1" : "0"}>
      <KhoiGap tieuDe={CHU_DAY_DU.tieuDeKiem} tomTat={tomTat}>
        <p className="text-[14px] leading-relaxed text-neutral-700">
          {du ? CHU_DAY_DU.kiemDu : CHU_DAY_DU.kiemGoiY}
        </p>
        <ul className="mt-3 space-y-2">
          {ds.map((d) => (
            <li
              key={d.id}
              data-thu="dong-kiem"
              data-day-du={d.daDu ? "1" : "0"}
              className="flex flex-wrap items-baseline gap-x-2 text-[15px]"
            >
              <span aria-hidden="true" style={{ color: d.daDu ? MAU.timCongNghe : MAU.camDamChoChu }}>
                {d.daDu ? "✓" : "✗"}
              </span>
              <span className="font-semibold text-neutral-900">{d.ten}</span>
              <span className="text-neutral-700">
                {d.daDu ? CHU_DAY_DU.daDu : d.viec ? chuViecConThieu(d.viec) : ""}
              </span>
            </li>
          ))}
        </ul>
      </KhoiGap>
    </div>
  );
}
