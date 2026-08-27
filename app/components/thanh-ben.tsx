"use client";

import {
  CHU,
  KHOANG_DANG_DUNG,
  MA_KHOANG,
  MA_TRUC,
  MO_TA_KHOANG,
  TEN_KHOANG,
  TRUC,
  type MaKhoang,
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

/** Bài đã lưu = một tấm báo cáo có biểu đồ cột bên trong. */
function IconLichSu() {
  return (
    <svg {...CHUNG_ICON} aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M7 9.5h6" />
      <path d="M7 13h9" />
      <path d="M7 16.5h4" />
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

/** Số liệu máy này = một biểu đồ cột đơn sơ. Đúng nghĩa đen thứ mục này chứa. */
function IconSoLieu() {
  return (
    <svg {...CHUNG_ICON} aria-hidden="true">
      <path d="M4 20V10" />
      <path d="M10 20V4" />
      <path d="M16 20v-7" />
      <path d="M3 20h18" />
    </svg>
  );
}

function icon(ma: MaKhoang, dangMo: boolean) {
  if (ma === "disc") return <IconDisc dangMo={dangMo} />;
  if (ma === "so-lieu") return <IconSoLieu />;
  return <IconLichSu />;
}

/* ── Thanh bên ────────────────────────────────────────────────────────────── */

export type ThanhBenProps = {
  readonly khoangDangMo: MaKhoang;
  readonly onChon: (ma: MaKhoang) => void;
};

export function ThanhBen({ khoangDangMo, onChon }: ThanhBenProps) {
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

        <nav aria-label={CHU.dieuHuongChinh} className="md:mt-7 md:flex-1">
          <ul className="-mx-1 flex flex-row gap-1 overflow-x-auto px-1 md:mx-0 md:flex-col md:overflow-visible md:px-0">
            {MA_KHOANG.map((ma) => {
              const dangMo = ma === khoangDangMo;
              const dangDung = KHOANG_DANG_DUNG.includes(ma);
              return (
                <li key={ma} className="shrink-0 md:w-full">
                  <button
                    type="button"
                    onClick={() => onChon(ma)}
                    aria-current={dangMo ? "page" : undefined}
                    className={[
                      "flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left",
                      "transition-colors duration-150 motion-reduce:transition-none",
                      "focus-visible:outline-2 focus-visible:outline-offset-2",
                      dangMo ? "font-semibold" : "text-neutral-700 hover:bg-neutral-50",
                    ].join(" ")}
                    style={{
                      backgroundColor: dangMo ? MAU.timRatNhat : undefined,
                      color: dangMo ? MAU.timCongNghe : undefined,
                      outlineColor: MAU.timCongNghe,
                    }}
                  >
                    <span className="mt-px shrink-0">{icon(ma, dangMo)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[15px] whitespace-nowrap">{TEN_KHOANG[ma]}</span>
                        {dangDung && (
                          <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-normal text-neutral-600">
                            {CHU.nhanDangDung}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 hidden text-[11px] leading-snug font-normal text-neutral-600 md:block">
                        {MO_TA_KHOANG[ma]}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
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
