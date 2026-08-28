"use client";

import { MAU } from "@config/thuong-hieu";
import type { MucTraLoi } from "@modules/core/bo-de/kieu";

/**
 * THANG TRẢ LỜI — ba dạng dùng chung một component:
 *  · 3 mức mặt cười (Tiểu học)  · 5 mức đồng ý  · 5 mức tần suất (Mầm non)
 *
 * Kích thước KHÔNG theo loại thang mà theo SỐ CÂU MỘT MÀN:
 *  · "to"  — một câu một màn (trẻ nhỏ): nút cao ≥ 56px, chữ ≥ 18px, cách nhau ≥ 12px.
 *  · "gọn" — năm câu một màn: nút cao ≥ 44px, vẫn đủ cho ngón tay người lớn.
 *
 * 🔴 Nút trả lời là `<button>` thật, không phải `<div onClick>` — bàn phím và trình đọc
 * màn hình phải dùng được.
 */
export function ThangTraLoi({
  thang,
  daChon,
  onChon,
  kichThuoc,
  moTaBoi,
}: {
  readonly thang: readonly MucTraLoi[];
  readonly daChon: number | undefined;
  readonly onChon: (giaTri: number) => void;
  readonly kichThuoc: "to" | "gon";
  readonly moTaBoi: string;
}) {
  const to = kichThuoc === "to";

  return (
    <div
      role="radiogroup"
      aria-labelledby={moTaBoi}
      className={to ? "flex flex-col gap-3" : "flex flex-wrap gap-2"}
    >
      {thang.map((m) => {
        const dangChon = daChon === m.giaTri;
        return (
          <button
            key={m.giaTri}
            type="button"
            role="radio"
            aria-checked={dangChon}
            onClick={() => onChon(m.giaTri)}
            className={[
              "rounded-xl border text-left",
              // 🔴 CHỈ lún khi bấm, KHÔNG bóng tĩnh: năm nút một hàng ngang mà cái nào cũng
              // nổi thì màn làm bài rối — và đó là màn trẻ ngồi trả lời 20 câu.
              "transition-[color,background-color,box-shadow,transform] duration-150 active:translate-y-px active:shadow-lun motion-reduce:transition-none",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              to
                ? "flex min-h-[56px] items-center gap-3 px-4 text-[18px]"
                : "min-h-[44px] px-3.5 text-[14px]",
              dangChon
                ? "border-transparent font-semibold text-white"
                : "border-neutral-300 text-neutral-800 hover:bg-neutral-50",
            ].join(" ")}
            style={{
              backgroundColor: dangChon ? MAU.timCongNghe : undefined,
              outlineColor: MAU.timCongNghe,
            }}
          >
            {m.mat && (
              <span aria-hidden="true" className={to ? "text-[28px]" : "mr-1.5 text-[16px]"}>
                {m.mat}
              </span>
            )}
            <span>{m.nhan}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Thanh tiến trình — có nhãn chữ vì màu một mình không nói được gì cho người mù màu. */
export function ThanhTienTrinh({
  phanTram,
  daLam,
  tong,
}: {
  readonly phanTram: number;
  readonly daLam: number;
  readonly tong: number;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-semibold text-neutral-700 tabular-nums">
          Câu {Math.min(daLam + 1, tong)}/{tong}
        </span>
        <span className="text-[13px] text-neutral-600 tabular-nums">{phanTram}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={phanTram}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Tiến độ làm bài"
        className="mt-1.5 h-2 overflow-hidden rounded-full bg-neutral-200"
      >
        <div
          className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${phanTram}%`, backgroundColor: MAU.timCongNghe }}
        />
      </div>
    </div>
  );
}
