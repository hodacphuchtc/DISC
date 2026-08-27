"use client";

import { MAU } from "@config/thuong-hieu";

/** Thẻ chọn lớn — dùng cho cả chọn đối tượng lẫn các câu hỏi phụ. */
export function TheChon({
  ten,
  moTa,
  dangChon,
  onChon,
}: {
  readonly ten: string;
  readonly moTa?: string;
  readonly dangChon: boolean;
  readonly onChon: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChon}
      aria-pressed={dangChon}
      className={[
        "w-full rounded-xl border px-4 py-3.5 text-left",
        "transition-colors duration-150 motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        dangChon ? "border-transparent" : "border-neutral-300 hover:bg-neutral-50",
      ].join(" ")}
      style={{
        backgroundColor: dangChon ? MAU.timRatNhat : undefined,
        color: dangChon ? MAU.timCongNghe : undefined,
        outlineColor: MAU.timCongNghe,
        boxShadow: dangChon ? `inset 0 0 0 1.5px ${MAU.timCongNghe}` : undefined,
      }}
    >
      <span className={`block text-[16px] ${dangChon ? "font-semibold" : "font-medium"}`}>
        {ten}
      </span>
      {moTa && (
        <span className="mt-0.5 block text-[13px] leading-snug font-normal text-neutral-600">
          {moTa}
        </span>
      )}
    </button>
  );
}

/** Nút nhỏ dạng viên — dùng cho chọn lớp và chọn tuổi. Cao ≥ 44px cho ngón tay. */
export function NutVien({
  nhan,
  dangChon,
  onChon,
}: {
  readonly nhan: string;
  readonly dangChon: boolean;
  readonly onChon: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChon}
      aria-pressed={dangChon}
      className={[
        "min-h-[44px] min-w-[56px] rounded-xl border px-3 text-[15px]",
        "transition-colors duration-150 motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        dangChon ? "border-transparent font-semibold text-white" : "border-neutral-300 hover:bg-neutral-50",
      ].join(" ")}
      style={{
        backgroundColor: dangChon ? MAU.timCongNghe : undefined,
        outlineColor: MAU.timCongNghe,
      }}
    >
      {nhan}
    </button>
  );
}

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
