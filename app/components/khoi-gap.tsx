"use client";

import { useId, useState, type ReactNode } from "react";

import { MAU } from "@config/thuong-hieu";

/**
 * HÀNG GẬP (28.x) — tiêu đề + tóm tắt luôn thấy, bấm mới xổ chi tiết xuống.
 *
 * Chủ dự án: bảng điều khiển phải GỌN và TÓM TẮT, xem chi tiết thì bấm vào — không xổ hết
 * mọi thông tin ra làm rối. Dùng cho "Lời khuyên dành cho {tên}" và từng cặp "A và B".
 *
 * 🔴 NỘI DUNG LUÔN NẰM TRONG DOM, chỉ ẩn bằng CSS (`hidden`). Bản in phải mở hết
 * (`[data-lop-sau]` ở `globals.css` ép `display:block`) — dựng có điều kiện `{mo && …}` thì
 * nội dung không tồn tại lúc in, đúng cạm bẫy đã trả giá ở lớp bóc sâu.
 *
 * 🔴 Tiêu đề là `<h2|h3><button>…</button></h2>` theo mẫu accordion: trình đọc màn hình đọc
 * được cấu trúc, và chữ tiêu đề KHÔNG nằm trong thứ `data-khong-in` nên vẫn in ra giấy. Chỉ
 * mũi tên (không có chữ) mới ẩn khi in. `textContent` của tiêu đề vì thế chỉ chứa đúng tiêu đề.
 */
export function KhoiGap({
  tieuDe,
  tomTat,
  capTieuDe = 3,
  kieu = "sang",
  moSan = false,
  children,
}: {
  readonly tieuDe: string;
  /** Dòng tóm tắt dưới tiêu đề — luôn hiện, cả khi gập. */
  readonly tomTat?: ReactNode;
  readonly capTieuDe?: 2 | 3;
  /** `toi` = mảng nhấn tối (GĐ27) cho cấp cá nhân; `sang` = thẻ trắng cho cấp cặp. */
  readonly kieu?: "toi" | "sang";
  readonly moSan?: boolean;
  readonly children: ReactNode;
}) {
  const [mo, datMo] = useState(moSan);
  const id = useId();
  const toi = kieu === "toi";
  const Tieu = capTieuDe === 2 ? "h2" : "h3";

  const mui = (
    <span aria-hidden="true" data-khong-in className="shrink-0">
      <svg
        viewBox="0 0 20 20"
        width="20"
        height="20"
        className={`transition-transform duration-200 motion-reduce:transition-none ${mo ? "rotate-180" : ""}`}
      >
        <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );

  return (
    <div
      data-gap={mo ? "mo" : "gap"}
      className={toi ? undefined : "rounded-2xl border"}
      style={toi ? undefined : { borderColor: MAU.vienMo }}
    >
      <div
        {...(toi ? { "data-nhan-toi": "" } : {})}
        className={toi ? "px-5 py-4" : "px-4 py-3.5"}
      >
        <Tieu className="m-0">
          <button
            type="button"
            aria-expanded={mo}
            aria-controls={id}
            onClick={() => datMo(!mo)}
            className={[
              "flex min-h-[44px] w-full items-center justify-between gap-3 text-left leading-snug font-bold focus-visible:outline-2 focus-visible:outline-offset-4",
              toi ? "text-[20px] text-chu-tren-toi" : "text-[16px] text-neutral-900",
            ].join(" ")}
            style={{ outlineColor: toi ? "#FFB067" : MAU.timCongNghe }}
          >
            <span>{tieuDe}</span>
            {mui}
          </button>
        </Tieu>
        {tomTat && (
          <div
            className={`mt-0.5 text-[14px] leading-snug ${toi ? "text-chu-mo-tren-toi" : "text-neutral-600"}`}
          >
            {tomTat}
          </div>
        )}
      </div>
      <div id={id} data-lop-sau className={mo ? (toi ? "mt-3" : "px-4 pb-4") : "hidden"}>
        {children}
      </div>
    </div>
  );
}
