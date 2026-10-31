import { MA_TRUC, TRUC, type MaTruc } from "@config/disc-tu-dien";

/**
 * BỐN CHIP D / I / S / C kiểu vi mạch (GĐ27) — CHỈ TRANG TRÍ, nên `aria-hidden`.
 *
 * Dùng trong mảng `data-nhan-toi`. Khi in, `globals.css` ẩn `[data-chip-disc]` (giấy không
 * có nền tối để chip phát sáng). Truyền `diem` để chip kèm số làm tròn dưới mỗi chữ — chỉ
 * là bản nhìn, bốn số thật nằm ở biểu đồ cột.
 */
export function ChipBonTruc({
  className = "",
  diem,
}: {
  readonly className?: string;
  readonly diem?: Readonly<Record<MaTruc, number>>;
}) {
  return (
    <div aria-hidden="true" className={`flex gap-3 ${className}`}>
      {MA_TRUC.map((t) => (
        <div key={t} className="flex flex-col items-center gap-1">
          <span data-chip-disc style={{ "--chip-mau": TRUC[t].mau } as React.CSSProperties}>
            {t}
          </span>
          {diem && (
            <span className="text-[12px] font-semibold text-chu-mo-tren-toi tabular-nums">
              {Math.round(diem[t])}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
