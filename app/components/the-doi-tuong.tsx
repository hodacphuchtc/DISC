"use client";

import { MAU } from "@config/thuong-hieu";

/**
 * Hộp giải thích khi người dùng bị chuyển sang bản quan sát.
 *
 * 🔴 BẮT BUỘC HIỆN, không được thu nhỏ thành ghi chú mờ ở góc. Chuyển im lặng là lừa
 * người dùng; không chuyển là bịa số (DISC_BA.md §3.2). Đây là lúc sản phẩm nói thật
 * về giới hạn của chính nó — nó xứng đáng có trọng lượng trên màn hình.
 */
export function HopGiaiThich({
  tieuDe,
  than,
}: {
  readonly tieuDe: string;
  readonly than: string;
}) {
  return (
    <div
      role="status"
      className="rounded-xl border-l-4 px-4 py-4"
      style={{ backgroundColor: MAU.timRatNhat, borderColor: MAU.timCongNghe }}
    >
      <p className="text-[15px] font-semibold" style={{ color: MAU.timCongNghe }}>
        {tieuDe}
      </p>
      <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-700">{than}</p>
    </div>
  );
}
