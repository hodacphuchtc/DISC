"use client";

import { NutQuayLai } from "@/app/components/nut-quay-lai";
import { useState } from "react";

import { HopGiaiThich } from "@/app/components/the-doi-tuong";
import { CHU_CHON, CHU_TRUOC_KHI_BAT_DAU, PHUT_UOC_LUONG } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { BoDe } from "@modules/core/bo-de/kieu";
import type { MaGiaiThich } from "@modules/test/dinh-tuyen";

/**
 * Mã lý do chuyển bản → khoá trong `CHU_CHON`.
 *
 * 🔴 Bảng này là chỗ DUY NHẤT nối hai thứ đó. Màn 1 trước đây tự viết một chuỗi `? :`
 * lồng nhau ngay tại chỗ; thêm một mã thứ ba là phải nhớ sửa cả hai nơi — và nơi quên sửa
 * sẽ im lặng không hiện gì, đúng kiểu hỏng mà không ai biết.
 */
const GIAI_THICH: Readonly<Record<MaGiaiThich, "giaiThichLop12" | "giaiThichConDuoi8">> = {
  LOP_1_2: "giaiThichLop12",
  CON_DUOI_8: "giaiThichConDuoi8",
};
import {
  DO_DAI_BIET_DANH_TOI_DA,
  bietDanhHopLe,
  chuanHoaBietDanh,
  demKyTu,
} from "@modules/test/biet-danh";

export function TruocKhiBatDau({
  boDe,
  bietDanhGoiY,
  tenCoSan,
  giaiThich,
  onQuayLai,
  onBatDau,
}: {
  readonly boDe: BoDe;
  /** Điền sẵn khi chuyền tay từ bài của con sang bài của bố mẹ (QĐ6). */
  readonly bietDanhGoiY?: string;
  /**
   * 🔴 12.4 — vào bài từ THẺ THÀNH VIÊN thì tên đã có trong sổ, KHÔNG hỏi lại.
   *
   * Đây là chỗ tiết kiệm thao tác lớn nhất của cả gói: một gia đình bốn người, mỗi người
   * hai bài, là tám lần gõ lại cùng một cái tên. Hỏi lại thứ mình đã biết không phải chỉ
   * là phiền — nó còn mở đường cho hai cách viết cùng một cái tên cùng tồn tại trong sổ.
   */
  readonly tenCoSan?: string;
  /**
   * 🔴 VĂN BẢN BẮT BUỘC HIỆN khi người làm bị chuyển sang bản quan sát (DISC_BA.md §4.2).
   *
   * Trước V1.3, hộp này CHỈ hiện ở màn 1. Vào bài từ thẻ thành viên thì `boDeCuaThanhVien()`
   * trả về mỗi bộ đề và vứt luôn lý do chuyển — nên một em lớp 1–2 vào từ thẻ sẽ lặng lẽ
   * nhận bản dành cho người lớn trả lời, không một chữ giải thích. Chuyển im lặng là lừa
   * người dùng; không chuyển là bịa số. Phải làm cả hai: chuyển VÀ nói ra.
   */
  readonly giaiThich?: MaGiaiThich;
  readonly onQuayLai: () => void;
  readonly onBatDau: (bietDanh: string) => void;
}) {
  const [tho, datTho] = useState(bietDanhGoiY ?? "");
  const [daThu, datDaThu] = useState(false);

  const bietDanh = chuanHoaBietDanh(tho);
  const hopLe = bietDanhHopLe(tho);
  const soKyTu = demKyTu(bietDanh);

  function guiDi(e: React.FormEvent) {
    e.preventDefault();
    datDaThu(true);
    if (hopLe) onBatDau(bietDanh.trim());
  }

  const coSan = tenCoSan?.trim();

  return (
    <section className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
      <NutQuayLai nhan={CHU_CHON.nutQuayLai} onBam={onQuayLai} />

      {/* 🔴 Đặt TRƯỚC tên bộ đề, không nhét xuống cuối trang: người đọc phải biết vì sao
          mình đang nhìn một bản khác với thứ mình bấm, ngay lúc nhìn thấy nó. */}
      {giaiThich && (
        <div className="mt-6" data-thu="giai-thich-chuyen-ban">
          <HopGiaiThich
            tieuDe={CHU_CHON[GIAI_THICH[giaiThich]].tieuDe}
            than={CHU_CHON[GIAI_THICH[giaiThich]].than}
          />
        </div>
      )}

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

      {coSan ? (
        <div data-thu="ten-co-san" className="mt-10">
          <p className="text-[16px] font-semibold text-neutral-900">
            {CHU_TRUOC_KHI_BAT_DAU.lamBaiCho.replace("{ten}", coSan)}
          </p>
          <button
            type="button"
            onClick={() => onBatDau(coSan)}
            className="mt-5 min-h-[48px] rounded-xl px-6 text-[16px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
            style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
          >
            {CHU_TRUOC_KHI_BAT_DAU.nutBatDau}
          </button>
        </div>
      ) : (
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


        {daThu && !hopLe && (
          <p role="alert" className="mt-2 text-[13px] text-red-700">
            {CHU_TRUOC_KHI_BAT_DAU.oTrong}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 min-h-[48px] rounded-xl px-6 text-[16px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
          style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
        >
          {CHU_TRUOC_KHI_BAT_DAU.nutBatDau}
        </button>
      </form>
      )}
    </section>
  );
}
