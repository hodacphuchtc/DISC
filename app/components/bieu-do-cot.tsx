"use client";

import { MA_TRUC, TRUC, type MaTruc } from "@config/disc-tu-dien";

/**
 * BIỂU ĐỒ BỐN CỘT NGANG 0–100.
 *
 * Vẽ bằng `div`, KHÔNG dùng thư viện biểu đồ — bốn thanh ngang không đáng để thêm một
 * phụ thuộc mà đội dev sau này phải nâng cấp.
 *
 * Luôn có NHÃN SỐ bên cạnh: người mù màu không đọc được biểu đồ chỉ phân biệt bằng màu.
 */
export function BieuDoCot({
  diem,
  noiBat,
}: {
  readonly diem: Readonly<Record<MaTruc, number>>;
  /** Trục được tô đậm — thường là trục trội. Rỗng thì cả bốn ngang nhau. */
  readonly noiBat?: readonly MaTruc[];
}) {
  return (
    <ul className="space-y-3.5">
      {MA_TRUC.map((t) => {
        const dam = !noiBat || noiBat.includes(t);
        return (
          <li key={t} className="flex items-center gap-3">
            <span
              className={`w-[74px] shrink-0 text-[13px] sm:w-[86px] sm:text-[14px] ${dam ? "font-semibold text-neutral-900" : "text-neutral-600"}`}
            >
              {TRUC[t].ten}
            </span>
            <span className="h-3.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${Math.max(diem[t], 1.5)}%`,
                  backgroundColor: TRUC[t].mau,
                  opacity: dam ? 1 : 0.38,
                }}
              />
            </span>
            <span
              className={`w-11 shrink-0 text-right text-[14px] tabular-nums ${dam ? "font-semibold text-neutral-900" : "text-neutral-600"}`}
            >
              {diem[t].toFixed(1)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
