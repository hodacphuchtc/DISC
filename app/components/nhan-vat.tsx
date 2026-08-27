"use client";

import { TRUC, type MaTruc } from "@config/disc-tu-dien";
import { KHUNG_NHAN_VAT, netNhanVat } from "@modules/report/hinh-nhan-vat";

/**
 * BỐN NHÂN VẬT ROBOT trên màn hình.
 *
 * Nét vẽ lấy từ `@modules/report/hinh-nhan-vat` — CÙNG nguồn với tấm ảnh PNG chia sẻ,
 * để hai nơi không bao giờ lệch nhau. Sửa hình thì sửa ở đó, không sửa ở đây.
 */
export function NhanVat({
  truc,
  kichThuoc = 132,
}: {
  readonly truc: MaTruc;
  readonly kichThuoc?: number;
}) {
  return (
    <svg
      width={kichThuoc}
      height={(kichThuoc / KHUNG_NHAN_VAT.rong) * KHUNG_NHAN_VAT.cao}
      viewBox={`0 0 ${KHUNG_NHAN_VAT.rong} ${KHUNG_NHAN_VAT.cao}`}
      role="img"
      aria-label={`${TRUC[truc].nhanVat} — nhóm ${TRUC[truc].ten.toLowerCase()}`}
      fill="none"
      stroke={TRUC[truc].mau}
      strokeWidth={KHUNG_NHAN_VAT.doDamNet}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {netNhanVat(truc).map((n, i) => {
        if (n.loai === "path") return <path key={i} d={n.d} />;
        if (n.loai === "circle") return <circle key={i} cx={n.cx} cy={n.cy} r={n.r} />;
        return <rect key={i} x={n.x} y={n.y} width={n.rong} height={n.cao} rx={n.rx} />;
      })}
    </svg>
  );
}

/** Hai nhân vật đứng cạnh nhau cho kiểu pha. */
export function CapNhanVat({
  cap,
  kichThuoc = 108,
}: {
  readonly cap: readonly [MaTruc, MaTruc];
  readonly kichThuoc?: number;
}) {
  return (
    <div className="flex items-end gap-1">
      <NhanVat truc={cap[0]} kichThuoc={kichThuoc} />
      <NhanVat truc={cap[1]} kichThuoc={kichThuoc} />
    </div>
  );
}
