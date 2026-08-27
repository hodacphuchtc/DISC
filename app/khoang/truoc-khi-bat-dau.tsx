"use client";

import { useState } from "react";

import { CHU_CHON, CHU_TRUOC_KHI_BAT_DAU, PHUT_UOC_LUONG } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { BoDe } from "@modules/core/bo-de/kieu";
import {
  DO_DAI_BIET_DANH_TOI_DA,
  bietDanhHopLe,
  chuanHoaBietDanh,
  demKyTu,
  nghiLaHoTen,
} from "@modules/test/biet-danh";

export function TruocKhiBatDau({
  boDe,
  bietDanhGoiY,
  onQuayLai,
  onBatDau,
}: {
  readonly boDe: BoDe;
  /** Điền sẵn khi chuyền tay từ bài của con sang bài của bố mẹ (QĐ6). */
  readonly bietDanhGoiY?: string;
  readonly onQuayLai: () => void;
  readonly onBatDau: (bietDanh: string) => void;
}) {
  const [tho, datTho] = useState(bietDanhGoiY ?? "");
  const [daThu, datDaThu] = useState(false);

  const bietDanh = chuanHoaBietDanh(tho);
  const hopLe = bietDanhHopLe(tho);
  const nhacHoTen = nghiLaHoTen(tho);
  const soKyTu = demKyTu(bietDanh);

  function guiDi(e: React.FormEvent) {
    e.preventDefault();
    datDaThu(true);
    if (hopLe) onBatDau(bietDanh.trim());
  }

  return (
    <section className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
      <button
        type="button"
        onClick={onQuayLai}
        className="inline-flex min-h-[44px] items-center text-[13px] text-neutral-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: MAU.timCongNghe }}
      >
        ← {CHU_CHON.nutQuayLai}
      </button>

      <p className="mt-6 text-[11px] tracking-widest text-neutral-600 uppercase">
        {boDe.ten} · {boDe.cau.length} câu
      </p>
      <h1 className="mt-2 text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900 md:text-[32px]">
        {CHU_TRUOC_KHI_BAT_DAU.tieuDe}
      </h1>

      <dl className="mt-8 space-y-4">
        {CHU_TRUOC_KHI_BAT_DAU.danDo.map((d) => (
          <div key={d.nhan} className="border-l-2 border-neutral-200 pl-4">
            <dt className="text-[12px] font-semibold tracking-wide text-neutral-900">
              {d.nhan}
            </dt>
            <dd className="mt-0.5 text-[14px] leading-relaxed text-neutral-600">
              {d.than.replace("{phut}", PHUT_UOC_LUONG[boDe.ma] ?? "5–8")}
            </dd>
          </div>
        ))}
      </dl>

      <form onSubmit={guiDi} className="mt-10">
        <label htmlFor="biet-danh" className="block text-[15px] font-semibold text-neutral-900">
          {CHU_TRUOC_KHI_BAT_DAU.nhanO}
        </label>
        <p className="mt-1 text-[13px] text-neutral-600">{CHU_TRUOC_KHI_BAT_DAU.nhacO}</p>

        <div className="mt-3 flex items-center gap-3">
          <input
            id="biet-danh"
            name="biet-danh"
            type="text"
            value={bietDanh}
            onChange={(e) => datTho(e.target.value)}
            maxLength={DO_DAI_BIET_DANH_TOI_DA}
            autoComplete="off"
            aria-describedby="dem-ky-tu"
            aria-invalid={daThu && !hopLe}
            className="min-h-[48px] w-full max-w-xs rounded-xl border border-neutral-300 px-3.5 text-[16px] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: MAU.timCongNghe }}
          />
          <span id="dem-ky-tu" className="text-[13px] whitespace-nowrap text-neutral-600 tabular-nums">
            {CHU_TRUOC_KHI_BAT_DAU.demKyTu
              .replace("{da}", String(soKyTu))
              .replace("{toiDa}", String(DO_DAI_BIET_DANH_TOI_DA))}
          </span>
        </div>

        {nhacHoTen && (
          <p role="status" className="mt-2 text-[13px]" style={{ color: MAU.timCongNghe }}>
            {CHU_TRUOC_KHI_BAT_DAU.nhacNghiHoTen}
          </p>
        )}
        {daThu && !hopLe && (
          <p role="alert" className="mt-2 text-[13px] text-red-700">
            {CHU_TRUOC_KHI_BAT_DAU.oTrong}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 min-h-[48px] rounded-xl px-6 text-[16px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
        >
          {CHU_TRUOC_KHI_BAT_DAU.nutBatDau}
        </button>
      </form>
    </section>
  );
}
