"use client";

import { MA_TRUC, TRUC, type MaTruc } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";

/**
 * RADAR BỐN TRỤC (GĐ27.3) — đặt trong mảng `data-nhan-toi`, phía trên `BieuDoCot`.
 *
 * 🔴 Chỉ là bản NHÌN của số liệu đã có ở `BieuDoCot` ngay bên dưới, nên ẩn khỏi trình đọc
 * màn hình (`aria-hidden`): đọc cả hai là đọc bốn con số hai lần. Bốn số vẫn nằm trong DOM
 * qua biểu đồ cột, người mù màu và bản in không mất gì.
 *
 * Màu nét/chữ dùng `currentColor`: trên màn hình là chữ sáng của mảng tối, khi in
 * `[data-nhan-toi] * { color: inherit !important }` kéo nó về đen — nên radar in ra vẫn thấy.
 *
 * Thứ tự trục: D trên, I phải, S dưới, C trái — cố định như mọi nơi khác (DISC_BA.md §7.4).
 * Nhãn là tên TIẾNG VIỆT của trục; tiếng Anh chỉ sống ở bảng tra.
 */
const TAM = { x: 160, y: 130 } as const;
const BAN_KINH = 80;
/** Trục nhỏ mấy cũng phải còn thấy một chấm trên đa giác, không dồn hết về tâm. */
const DIEM_TOI_THIEU = 4;

const HUONG: Readonly<Record<MaTruc, { dx: number; dy: number }>> = {
  D: { dx: 0, dy: -1 },
  I: { dx: 1, dy: 0 },
  S: { dx: 0, dy: 1 },
  C: { dx: -1, dy: 0 },
};

function diemTai(t: MaTruc, phanTram: number): readonly [number, number] {
  const k = (BAN_KINH * Math.min(Math.max(phanTram, 0), 100)) / 100;
  return [TAM.x + HUONG[t].dx * k, TAM.y + HUONG[t].dy * k];
}

export function BieuDoRadar({
  diem,
  noiBat,
}: {
  readonly diem: Readonly<Record<MaTruc, number>>;
  readonly noiBat?: readonly MaTruc[];
}) {
  const dagGiac = MA_TRUC.map((t) => diemTai(t, Math.max(diem[t], DIEM_TOI_THIEU)).join(",")).join(" ");
  const vong = (ti: number) =>
    MA_TRUC.map((t) => diemTai(t, ti).join(",")).join(" ");

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 320 260"
      className="mx-auto block w-full max-w-xs"
    >
      <g fill="none" stroke="currentColor" strokeOpacity="0.25">
        <polygon points={vong(100)} />
        <polygon points={vong(50)} />
        <line x1={TAM.x} y1={TAM.y - BAN_KINH} x2={TAM.x} y2={TAM.y + BAN_KINH} />
        <line x1={TAM.x - BAN_KINH} y1={TAM.y} x2={TAM.x + BAN_KINH} y2={TAM.y} />
      </g>

      <polygon
        data-radar-da
        points={dagGiac}
        fill={MAU.camNangLuong}
        fillOpacity="0.35"
        stroke={MAU.camNangLuong}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {MA_TRUC.map((t) => {
        const [x, y] = diemTai(t, Math.max(diem[t], DIEM_TOI_THIEU));
        const dam = !noiBat || noiBat.includes(t);
        const h = HUONG[t];
        const nhanX = TAM.x + h.dx * (BAN_KINH + 12);
        const nhanY = TAM.y + h.dy * (BAN_KINH + 14) + (h.dy === 0 ? 4 : h.dy > 0 ? 6 : -2);
        return (
          <g key={t}>
            <circle cx={x} cy={y} r="5" fill={TRUC[t].mau} stroke="#fff" strokeWidth="1.5" />
            <text
              x={nhanX}
              y={nhanY}
              textAnchor={h.dx > 0 ? "start" : h.dx < 0 ? "end" : "middle"}
              fontSize="12"
              fontWeight={dam ? 700 : 500}
              fill="currentColor"
              fillOpacity={dam ? 1 : 0.7}
            >
              {TRUC[t].ten}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
