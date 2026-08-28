"use client";

import { CHU, MA_TRUC, MO_TA_KHOANG, TEN_KHOANG, TRUC } from "@config/disc-tu-dien";
import { MAU, MAU_LOGO } from "@config/thuong-hieu";

/* ── Icon ─────────────────────────────────────────────────────────────────── */

const CHUNG_ICON = {
  width: 19,
  height: 19,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Vị trí bốn ô, đọc theo thứ tự D-I-S-C — cùng thứ tự dùng ở mọi nơi khác. */
const O_VUONG = [
  { x: 3, y: 3 },
  { x: 13.5, y: 3 },
  { x: 3, y: 13.5 },
  { x: 13.5, y: 13.5 },
] as const;

/**
 * Bốn ô vuông KHÔNG phải trang trí — chúng chính là bốn nhân tố của mô hình.
 * Khi mục đang mở, mỗi ô nhận đúng màu trục của nó; lúc khác thì im lặng đơn sắc.
 */
function IconDisc({ dangMo }: { readonly dangMo: boolean }) {
  return (
    <svg {...CHUNG_ICON} aria-hidden="true">
      {O_VUONG.map((o, i) => (
        <rect
          key={MA_TRUC[i]}
          x={o.x}
          y={o.y}
          width="7.5"
          height="7.5"
          rx="1.5"
          stroke={dangMo ? TRUC[MA_TRUC[i]].mau : "currentColor"}
        />
      ))}
    </svg>
  );
}

function IconKhien() {
  return (
    <svg
      {...CHUNG_ICON}
      width={16}
      height={16}
      strokeWidth={1.6}
      className="mt-px shrink-0"
      aria-hidden="true"
    >
      <path d="M12 3.2 19 6v5.4c0 4.1-2.9 7.5-7 8.4-4.1-.9-7-4.3-7-8.4V6l7-2.8Z" />
      <path d="m9.1 12.1 2 2 3.8-4.1" />
    </svg>
  );
}

/* ── Thanh bên ────────────────────────────────────────────────────────────── */

/**
 * 🔴 THANH BÊN CÒN ĐÚNG MỘT MỤC (V2.1) — và vì thế KHÔNG CÒN LÀ ĐIỀU HƯỚNG.
 *
 * Trước đó nó có ba mục: DISC · Nhà mình · Số liệu. *Nhà mình* nay là bước 1 nằm bên
 * trong DISC, còn *Số liệu* ẩn sau `?so-lieu=1` vì phụ huynh không có việc gì với bộ đếm
 * phễu. Một thanh điều hướng còn đúng một đích thì không điều hướng đi đâu cả — nó là
 * nhãn thương hiệu, nên bỏ luôn `onChon` thay vì để một callback không ai gọi.
 */
export function ThanhBen() {
  return (
    <aside
      className="w-full shrink-0 border-b border-neutral-200 bg-white md:h-dvh md:w-[264px] md:border-r md:border-b-0"
      style={{ borderColor: MAU.vienMo }}
    >
      <div className="flex h-full flex-col gap-6 px-4 py-5 md:gap-0 md:px-3 md:py-6">
        <header className="px-1">
          <p className="text-2xl leading-none font-extrabold tracking-tight">
            <span style={{ color: MAU_LOGO.sata }}>{CHU.tenThuongHieu.truoc}</span>
            <span style={{ color: MAU_LOGO.robo }}>{CHU.tenThuongHieu.sau}</span>
          </p>
          <p className="mt-1.5 text-[11px] tracking-widest text-neutral-600 uppercase">
            {CHU.dongPhuLogo}
          </p>
        </header>

        <div className="md:mt-7 md:flex-1">
          {/* Một mục, đang mở, không bấm được đi đâu — nên là một tấm nhãn, không phải
              một nút. Nút không dẫn tới đâu là lời hứa suông với ngón tay người dùng. */}
          <div
            data-thu="muc-khoang"
            data-ma="disc"
            className="flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 font-semibold"
            style={{ backgroundColor: MAU.timRatNhat, color: MAU.timCongNghe }}
          >
            <span className="mt-px shrink-0">
              <IconDisc dangMo />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] whitespace-nowrap">{TEN_KHOANG.disc}</span>
              <span className="mt-0.5 hidden text-[11px] leading-snug font-normal text-neutral-600 md:block">
                {MO_TA_KHOANG.disc}
              </span>
            </span>
          </div>
        </div>

        <div className="hidden rounded-xl border border-neutral-200 px-3 py-3 md:block">
          <p className="flex items-start gap-2 text-[12px] leading-snug font-semibold text-neutral-700">
            <IconKhien />
            {CHU.camKetDuLieu}
          </p>
          <p className="mt-1.5 text-[11px] leading-snug text-neutral-600">
            {CHU.camKetDuLieuPhu}
          </p>
        </div>
      </div>
    </aside>
  );
}
