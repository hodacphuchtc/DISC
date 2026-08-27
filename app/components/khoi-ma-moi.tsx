"use client";

/**
 * KHỐI PHÁT MÃ MỜI (13.1) — hiện ở cuối màn kết quả.
 *
 * 🔴 GỠ ĐÚNG CÁI TRẦN CỦA ADR-001. Không backend nghĩa là mặc định cả nhà xếp hàng trên
 * MỘT điện thoại: bố, mẹ, hai đứa con, mỗi người vài chục câu. Ma sát đó lớn hơn hình
 * dung nhiều, và nó đúng kể cả khi phần mềm hoàn hảo. Bốn con số thì nhét vừa một mã QR.
 *
 * 🔴 `data-khong-in`: mã mời là thứ dùng trên màn hình. In nó ra giấy là để một hồ sơ DISC
 * nằm trên bàn dưới dạng quét được, không hạn không khoá — đúng thứ hạn 7 ngày sinh ra để
 * chặn.
 */

import { useMemo, useState } from "react";

import { MaQr } from "./ma-qr";
import { CHU_VAI, HAN_MA_MOI_NGAY, VAI_GIA_DINH, type VaiGiaDinh } from "@config/disc-gia-dinh";
import { CHU_MA_MOI } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { MaBoDe, MaTruc } from "@modules/core/bo-de/kieu";
import { goiHoSo } from "@modules/core/gia-dinh/ma-moi";

export function KhoiMaMoi({
  boDe,
  diem,
  vaiGoiY = "con",
  homNay,
}: {
  readonly boDe: MaBoDe;
  readonly diem: Readonly<Record<MaTruc, number>>;
  readonly vaiGoiY?: VaiGiaDinh;
  /** `yyyy-mm-dd`. Nơi gọi đưa vào để khối này không phải đọc đồng hồ lúc dựng HTML. */
  readonly homNay: string;
}) {
  const [vai, datVai] = useState<VaiGiaDinh>(vaiGoiY);

  const ma = useMemo(() => {
    try {
      return goiHoSo({ boDe, vai, diem, ngayPhat: homNay });
    } catch {
      return "";
    }
  }, [boDe, vai, diem, homNay]);

  if (!ma) return null;

  return (
    <section
      data-khong-in
      data-thu="khoi-ma-moi"
      className="mt-10 rounded-2xl border p-5"
      style={{ borderColor: MAU.vienMo }}
    >
      <h2 className="text-[16px] font-semibold text-neutral-900">{CHU_MA_MOI.tieuDe}</h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-600">{CHU_MA_MOI.moTa}</p>

      <label className="mt-4 inline-flex items-center gap-2 text-[14px] text-neutral-800">
        {CHU_VAI[vai] && "Vai trong nhà:"}
        <select
          aria-label="Vai trong nhà"
          value={vai}
          onChange={(e) => datVai(e.target.value as VaiGiaDinh)}
          className="rounded-lg border px-2 py-1.5"
          style={{ borderColor: MAU.vienMo }}
        >
          {VAI_GIA_DINH.map((v) => (
            <option key={v} value={v}>
              {CHU_VAI[v]}
            </option>
          ))}
        </select>
      </label>

      <p className="mt-4 text-[14px] text-neutral-600">{CHU_MA_MOI.nhacQuet}</p>
      <div className="mt-3">
        <MaQr chuoi={ma} />
      </div>
      <p
        data-thu="chuoi-ma"
        className="mt-3 font-mono text-[24px] tracking-[0.15em] text-neutral-900"
      >
        {ma}
      </p>

      <p className="mt-3 text-[13px] text-neutral-600">
        {CHU_MA_MOI.nhacHan.replace("{so}", String(HAN_MA_MOI_NGAY))}
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-neutral-500">{CHU_MA_MOI.nhacRiengTu}</p>
    </section>
  );
}
