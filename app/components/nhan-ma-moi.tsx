"use client";

/**
 * NHẬN MỘT MÃ MỜI (13.1) — đầu bên kia của khối phát mã.
 *
 * 🔴 MÁY NHẬN TỰ HỎI TÊN. Mã cố ý KHÔNG mang tên theo (xem `ma-moi.ts`): nó đi qua tin
 * nhắn và ảnh chụp màn hình, nên nhét tên vào là phá hai trong bốn hàng rào của ADR-005.
 * Đổi lại, người nhận gõ tên ngay trên máy mình — tên đó không bao giờ rời khỏi đó.
 *
 * 🔴 Hồ sơ nhận qua mã KHÔNG có câu trả lời, nên nó KHÔNG dựng ra một `BaiLamLuu` giả.
 * Nó dựng một THÀNH VIÊN kèm điểm. Bịa một bảng câu trả lời khớp với bốn con số là tạo ra
 * dữ liệu chưa ai từng nhập — và sáu tháng sau không ai phân biệt được thật với bịa.
 */

import { useState } from "react";

import { CHU_VAI } from "@config/disc-gia-dinh";
import { CHU_MA_HONG, CHU_MA_MOI } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { MA_TRUC } from "@modules/core/bo-de/kieu";
import type { HoSoMoi } from "@modules/core/gia-dinh/ma-moi";
import { moHoSo } from "@modules/core/gia-dinh/ma-moi";

export function NhanMaMoi({
  homNay,
  onThem,
}: {
  /** `yyyy-mm-dd` — nơi gọi đưa vào, khối này không đọc đồng hồ. */
  readonly homNay: string;
  /** Trả `false` khi sổ đã có hồ sơ này rồi. */
  readonly onThem: (ten: string, hoSo: HoSoMoi) => Promise<boolean> | boolean;
}) {
  const [oNhap, datONhap] = useState("");
  const [hoSo, datHoSo] = useState<HoSoMoi | null>(null);
  const [ten, datTen] = useState("");
  const [loi, datLoi] = useState<string | null>(null);
  const [xong, datXong] = useState<string | null>(null);

  function mo() {
    datXong(null);
    const ket = moHoSo(oNhap, homNay);
    if (!ket.ok) {
      datHoSo(null);
      datLoi(CHU_MA_HONG[ket.lyDo] ?? ket.lyDo);
      return;
    }
    datLoi(null);
    datHoSo(ket.hoSo);
  }

  async function luu() {
    if (!hoSo) return;
    const sach = ten.trim();
    if (!sach) return;
    const daThem = await onThem(sach, hoSo);
    datHoSo(null);
    datONhap("");
    datTen("");
    datXong(daThem ? CHU_MA_MOI.daThem.replace("{ten}", sach) : CHU_MA_MOI.daCo);
  }

  return (
    <section data-thu="nhan-ma-moi" className="mt-10">
      <h2 className="text-[15px] font-semibold text-neutral-900">{CHU_MA_MOI.nhanNhap}</h2>
      <p className="mt-1 text-[14px] text-neutral-600">{CHU_MA_MOI.moTaNhap}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <input
          type="text"
          value={oNhap}
          placeholder={CHU_MA_MOI.oNhap}
          aria-label={CHU_MA_MOI.oNhap}
          onChange={(e) => {
            datONhap(e.target.value);
            datLoi(null);
          }}
          className="min-h-[44px] flex-1 rounded-xl border px-3 font-mono text-[16px]"
          style={{ borderColor: MAU.vienMo }}
        />
        <button
          type="button"
          onClick={mo}
          className="min-h-[44px] rounded-xl px-4 text-[15px] font-semibold text-white shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
          style={{ backgroundColor: MAU.timCongNghe }}
        >
          {CHU_MA_MOI.nutMo}
        </button>
      </div>

      {loi && (
        <p data-thu="loi-ma" role="alert" className="mt-2 text-[14px]" style={{ color: MAU.camDamChoChu }}>
          {loi}
        </p>
      )}
      {xong && (
        <p data-thu="xong-ma" role="status" className="mt-2 text-[14px] text-neutral-800">
          {xong}
        </p>
      )}

      {hoSo && (
        <div
          data-thu="ho-so-nhan"
          className="mt-4 rounded-xl border p-4"
          style={{ borderColor: MAU.timCongNghe }}
        >
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[14px] tabular-nums text-neutral-800">
            {MA_TRUC.map((t) => (
              <li key={t}>
                <strong>{t}</strong> {hoSo.diem[t].toFixed(1)}
              </li>
            ))}
            <li className="text-neutral-600">{CHU_VAI[hoSo.vai]}</li>
          </ul>

          <label className="mt-4 block text-[14px] font-semibold text-neutral-800">
            {CHU_MA_MOI.hoiTen}
            <input
              type="text"
              value={ten}
              autoFocus
              onChange={(e) => datTen(e.target.value)}
              className="mt-1.5 w-full max-w-xs rounded-xl border px-3 py-2.5 text-[16px]"
              style={{ borderColor: MAU.vienMo }}
            />
          </label>
          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">
            {CHU_MA_MOI.nhacHoiTen}
          </p>

          <button
            type="button"
            onClick={() => void luu()}
            className="mt-3 min-h-[44px] rounded-xl px-4 text-[15px] font-semibold text-white shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
            style={{ backgroundColor: MAU.timCongNghe }}
          >
            {CHU_MA_MOI.nutLuu}
          </button>
        </div>
      )}
    </section>
  );
}
