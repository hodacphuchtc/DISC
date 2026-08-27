"use client";

import { useState } from "react";

import { CHU_LIEN_HE, LIEN_HE_SATA } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import {
  soDienThoaiHopLe,
  taoPhieu,
  type GuiLienHe,
  type KenhLienHe,
} from "@modules/core/lien-he/kieu";

/**
 * Ô để lại liên hệ ở cuối báo cáo.
 *
 * 🔴 BA LUẬT:
 *  1. KHÔNG bắt buộc, KHÔNG chặn xem kết quả. Người bỏ qua vẫn xem và tải được đủ.
 *  2. Ô đồng ý phải nói rõ CÁI GÌ được gửi đi và cái gì KHÔNG.
 *  3. Chỉ gửi đi phiếu do `taoPhieu` dựng — hàm đó không có đường nào nhận dữ liệu trẻ.
 */
export function OLienHe({
  nguon,
  onGui,
}: {
  readonly nguon: string;
  readonly onGui: GuiLienHe;
}) {
  const [so, datSo] = useState("");
  const [ten, datTen] = useState("");
  const [kenh, datKenh] = useState<KenhLienHe>("zalo");
  const [dongY, datDongY] = useState(false);
  const [daThu, datDaThu] = useState(false);
  const [dangGui, datDangGui] = useState(false);
  const [daGui, datDaGui] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);

  const soDung = soDienThoaiHopLe(so);

  async function gui(e: React.FormEvent) {
    e.preventDefault();
    datDaThu(true);
    if (!soDung || !dongY || dangGui) return;
    datDangGui(true);
    datLoi(null);
    try {
      await onGui(
        taoPhieu({
          soDienThoai: so,
          tenGoi: ten,
          kenhMuonNhan: kenh,
          nguon,
          luc: new Date().toISOString(),
        }),
      );
      datDaGui(true);
    } catch {
      datLoi(CHU_LIEN_HE.loiGui);
    } finally {
      datDangGui(false);
    }
  }

  if (daGui) {
    return (
      <div
        data-khong-in
        role="status"
        className="mt-12 rounded-xl border-l-4 px-4 py-4"
        style={{ backgroundColor: MAU.timRatNhat, borderColor: MAU.timCongNghe }}
      >
        <p className="text-[15px] font-semibold" style={{ color: MAU.timCongNghe }}>
          {CHU_LIEN_HE.daGui}
        </p>
        <a
          href={`https://zalo.me/${LIEN_HE_SATA.soZalo}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-[14px] text-neutral-700 underline underline-offset-4"
        >
          {CHU_LIEN_HE.nutMoZalo} · {LIEN_HE_SATA.hienThi}
        </a>
      </div>
    );
  }

  return (
    <form
      data-khong-in
      onSubmit={gui}
      className="mt-12 rounded-xl border border-neutral-300 px-4 py-5 md:px-5"
    >
      <h2 className="text-[17px] font-extrabold tracking-tight text-neutral-900">
        {CHU_LIEN_HE.tieuDe}
      </h2>
      <p className="mt-1.5 text-[14px] leading-relaxed text-neutral-600">{CHU_LIEN_HE.moTa}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[13px] font-semibold text-neutral-800">
            {CHU_LIEN_HE.nhanSo}
          </span>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={so}
            onChange={(e) => datSo(e.target.value)}
            aria-invalid={daThu && !soDung}
            className="mt-1 min-h-[48px] w-full rounded-xl border border-neutral-300 px-3.5 text-[16px] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: MAU.timCongNghe }}
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-neutral-800">
            {CHU_LIEN_HE.nhanTen}
          </span>
          <input
            type="text"
            value={ten}
            maxLength={24}
            onChange={(e) => datTen(e.target.value)}
            className="mt-1 min-h-[48px] w-full rounded-xl border border-neutral-300 px-3.5 text-[16px] focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: MAU.timCongNghe }}
          />
        </label>
      </div>

      <fieldset className="mt-4">
        <legend className="text-[13px] font-semibold text-neutral-800">
          {CHU_LIEN_HE.nhanKenh}
        </legend>
        <div className="mt-2 flex gap-2">
          {(
            [
              ["zalo", CHU_LIEN_HE.kenhZalo],
              ["goi-dien", CHU_LIEN_HE.kenhGoi],
            ] as const
          ).map(([ma, nhan]) => (
            <button
              key={ma}
              type="button"
              role="radio"
              aria-checked={kenh === ma}
              onClick={() => datKenh(ma)}
              className={`min-h-[44px] rounded-xl border px-4 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 ${
                kenh === ma ? "border-transparent font-semibold text-white" : "border-neutral-300"
              }`}
              style={{
                backgroundColor: kenh === ma ? MAU.timCongNghe : undefined,
                outlineColor: MAU.timCongNghe,
              }}
            >
              {nhan}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 flex items-start gap-2.5">
        <input
          type="checkbox"
          checked={dongY}
          onChange={(e) => datDongY(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-neutral-400"
        />
        <span className="text-[13px] leading-relaxed text-neutral-700">
          {CHU_LIEN_HE.oDongY}
        </span>
      </label>

      {daThu && !soDung && (
        <p role="alert" className="mt-3 text-[13px] text-red-700">
          {CHU_LIEN_HE.soSai}
        </p>
      )}
      {daThu && soDung && !dongY && (
        <p role="alert" className="mt-3 text-[13px] text-red-700">
          {CHU_LIEN_HE.chuaDongY}
        </p>
      )}
      {loi && (
        <p role="alert" className="mt-3 text-[13px] text-red-700">
          {loi}
        </p>
      )}

      <button
        type="submit"
        disabled={dangGui}
        className="mt-5 min-h-[48px] rounded-xl px-5 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
        style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
      >
        {dangGui ? CHU_LIEN_HE.dangGui : CHU_LIEN_HE.nutGui}
      </button>
    </form>
  );
}
