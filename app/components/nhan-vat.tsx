"use client";

import { TRUC, type MaTruc } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import {
  KHUNG_MINH_HOA,
  KHUNG_NHAN_VAT,
  netMinhHoa,
  netNhanVat,
  type MaMinhHoa,
} from "@modules/report/hinh-nhan-vat";

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
      className="max-w-full shrink-0"
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

/**
 * MỘT CẢNH MINH HOẠ (16.7) — màn trống, màn chờ, nhịp chúc mừng, huy hiệu.
 *
 * Cùng nguồn nét với bốn robot (`hinh-nhan-vat.ts`), nên không bao giờ lệch lối vẽ.
 *
 * 🔴 `aria-hidden` chứ không phải `role="img"`: mọi cảnh ở đây đều đứng CẠNH một câu chữ
 * nói đúng việc phải làm. Đọc lại lần thứ hai bằng một nhãn hình là bắt người dùng trình
 * đọc màn hình nghe hai lần một nội dung.
 */
export function MinhHoa({
  ma,
  mau,
  kichThuoc = 160,
}: {
  readonly ma: MaMinhHoa;
  /** Mặc định tím công nghệ. Truyền màu trục vào khi cảnh gắn với một nhóm cụ thể. */
  readonly mau?: string;
  readonly kichThuoc?: number;
}) {
  return (
    <svg
      width={kichThuoc}
      height={(kichThuoc / KHUNG_MINH_HOA.rong) * KHUNG_MINH_HOA.cao}
      viewBox={`0 0 ${KHUNG_MINH_HOA.rong} ${KHUNG_MINH_HOA.cao}`}
      aria-hidden="true"
      fill="none"
      stroke={mau ?? MAU.timCongNghe}
      strokeWidth={KHUNG_MINH_HOA.doDamNet}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="max-w-full"
    >
      {netMinhHoa(ma).map((n, i) => {
        if (n.loai === "path") return <path key={i} d={n.d} />;
        if (n.loai === "circle") return <circle key={i} cx={n.cx} cy={n.cy} r={n.r} />;
        return <rect key={i} x={n.x} y={n.y} width={n.rong} height={n.cao} rx={n.rx} />;
      })}
    </svg>
  );
}
