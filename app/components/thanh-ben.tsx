"use client";

import {
  CHU,
  MA_TAB,
  MA_TRUC,
  MO_TA_KHOANG,
  TEN_KHOANG,
  TRUC,
  type MaTab,
} from "@config/disc-tu-dien";
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

function IconTim() {
  return (
    <svg {...CHUNG_ICON} aria-hidden="true">
      <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2Z" />
      <path d="M7.5 12.5h2.2l1.2-2.4 2 4.2 1.3-1.8h2.3" />
    </svg>
  );
}

function IconSach() {
  return (
    <svg {...CHUNG_ICON} aria-hidden="true">
      <path d="M5 4.5h10.5A2.5 2.5 0 0 1 18 7v12.5H7.5A2.5 2.5 0 0 1 5 17V4.5Z" />
      <path d="M5 17a2.5 2.5 0 0 1 2.5-2.5H18" />
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
interface ThanhBenProps {
  readonly tab?: MaTab;
  readonly onChon?: (ma: MaTab) => void;
}

function IconTab({ ma, dangMo }: { readonly ma: MaTab; readonly dangMo: boolean }) {
  if (ma === "disc") return <IconDisc dangMo={dangMo} />;
  return ma === "suc-khoe" ? <IconTim /> : <IconSach />;
}

/**
 * 🔴 BA TAB (04/11/2026, thay quyết định V2.1 "một mục, không phải nút"): DISC · Sức khoẻ cả
 * nhà · Tủ sách gia đình. Bấm tab nào hiện đúng khoang đó. Tab đang mở là `aria-current`.
 * Trên điện thoại ba tab xếp một hàng cuộn ngang dưới logo; từ `md:` xếp dọc ở cột trái.
 */
export function ThanhBen({ tab = "disc", onChon }: ThanhBenProps = {}) {
  return (
    <aside
      className="w-full shrink-0 border-b border-neutral-200 bg-white shadow-noi-1 md:h-dvh md:w-[264px] md:border-r md:border-b-0 md:shadow-none"
      style={{ borderColor: MAU.vienMo }}
    >
      <div className="flex h-full flex-row items-center gap-3 px-4 py-3 md:flex-col md:items-stretch md:gap-0 md:px-3 md:py-6">
        <header className="min-w-0 px-1">
          <p className="text-2xl leading-none font-extrabold tracking-tight">
            <span style={{ color: MAU_LOGO.sata }}>{CHU.tenThuongHieu.truoc}</span>
            <span style={{ color: MAU_LOGO.robo }}>{CHU.tenThuongHieu.sau}</span>
          </p>
          <p className="mt-1.5 hidden text-[11px] tracking-widest text-neutral-600 uppercase md:block">
            {CHU.dongPhuLogo}
          </p>
        </header>

        <nav
          aria-label="Chọn phần ứng dụng"
          className="ml-auto flex min-w-0 flex-row gap-1.5 overflow-x-auto md:mt-7 md:ml-0 md:flex-1 md:flex-col md:gap-1 md:overflow-visible"
        >
          {MA_TAB.map((ma) => {
            const dangMo = ma === tab;
            return (
              <button
                key={ma}
                type="button"
                data-thu="muc-khoang"
                data-ma={ma}
                aria-current={dangMo ? "page" : undefined}
                onClick={() => onChon?.(ma)}
                className="flex shrink-0 items-start gap-2.5 rounded-xl px-2.5 py-1.5 text-left font-semibold transition-colors motion-reduce:transition-none md:w-full md:px-3 md:py-2.5"
                style={
                  dangMo
                    ? { backgroundColor: MAU.timRatNhat, color: MAU.timCongNghe }
                    : { color: "#404040" }
                }
              >
                <span className="mt-px shrink-0">
                  <IconTab ma={ma} dangMo={dangMo} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] whitespace-nowrap md:text-[15px]">
                    {TEN_KHOANG[ma]}
                  </span>
                  <span className="mt-0.5 hidden text-[11px] leading-snug font-normal text-neutral-600 md:block">
                    {MO_TA_KHOANG[ma]}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

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
