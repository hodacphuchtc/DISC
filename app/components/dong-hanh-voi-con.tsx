"use client";

import { TRUC } from "@config/disc-tu-dien";
import {
  CHU_DONG_HANH,
  DONG_HANH_CHUNG,
  DONG_HANH_THEO_BAC,
  DONG_HANH_TRUNG_KHOP,
  type BacDongHanh,
  type HuongDongHanh,
} from "@config/disc-dong-hanh";
import { MA_TRUC, type MaTruc } from "@modules/core/bo-de/kieu";

import { KhoiGap } from "./khoi-gap";

/**
 * ĐỒNG HÀNH CÙNG CON (28.5) — "vậy bố mẹ làm gì mỗi ngày?" sau khi thấy hai góc nhìn lệch.
 *
 * 🔴 CHỈ ĐƯỢC NẠP LƯỜI (`React.lazy` ở `vung-lech.tsx`), và là nơi DUY NHẤT import
 * `config/disc-dong-hanh.ts`. Gói chính còn dư rất ít so với trần 300 KB; ~130 chuỗi này chỉ
 * cần khi mở màn đối chiếu. `export default` là điều `React.lazy` đòi.
 *
 * Gọn: mỗi trục lệch là MỘT hàng gập (tóm tắt luôn thấy, bấm mới xổ), cộng một hàng "kế
 * hoạch tuần". Nội dung nằm sẵn trong DOM (KhoiGap) nên bản in mở được hết.
 */

const dien = (chu: string, ten: string) => chu.split("{ten}").join(ten);

export type TrucLechDongHanh = { readonly truc: MaTruc; readonly huong: HuongDongHanh };

export default function DongHanhVoiCon({
  ten,
  bac,
  trucLech,
}: {
  readonly ten: string;
  readonly bac: BacDongHanh;
  /** Tối đa hai trục lệch lớn nhất, đã sắp lớn trước. Rỗng ⇒ hai góc nhìn khớp ở cả bốn. */
  readonly trucLech: readonly TrucLechDongHanh[];
}) {
  const t1 = trucLech[0];
  const t2 = trucLech[1] ?? trucLech[0];
  const bac1 = t1 ? DONG_HANH_THEO_BAC[t1.truc][t1.huong][bac] : null;
  const bac2 = t2 ? DONG_HANH_THEO_BAC[t2.truc][t2.huong][bac] : null;

  return (
    <section data-thu="dong-hanh" className="mt-10" aria-labelledby="dong-hanh-tieu-de">
      {/* Cố ý KHÔNG dùng <h2>: màn Vùng lệch đã dùng h2 cho từng trục diễn giải (và test đếm
          chúng). Các hàng gập bên dưới là h3. */}
      <p id="dong-hanh-tieu-de" className="text-[18px] font-bold text-neutral-900">
        {dien(CHU_DONG_HANH.tieuDeKhoi, ten)}
      </p>
      <p className="mt-1 text-[14px] leading-relaxed text-neutral-600">
        {dien(CHU_DONG_HANH.moTaKhoi, ten)}
      </p>

      <div className="mt-4 space-y-3">
        {trucLech.map(({ truc, huong }) => {
          const chung = DONG_HANH_CHUNG[truc][huong];
          const theoBac = DONG_HANH_THEO_BAC[truc][huong][bac];
          return (
            <div key={truc} data-thu="dong-hanh-truc" data-truc={truc}>
              <KhoiGap
                tieuDe={CHU_DONG_HANH.tieuDeTruc.replace("{ten}", ten).replace("{truc}", TRUC[truc].ten)}
                tomTat={CHU_DONG_HANH.tomTatTruc}
              >
                <h4 className="text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
                  {CHU_DONG_HANH.boMeThay}
                </h4>
                <p className="mt-1 text-[15px] leading-relaxed text-neutral-800">{dien(chung.boMeThay, ten)}</p>
                <h4 className="mt-3 text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
                  {CHU_DONG_HANH.conThay}
                </h4>
                <p className="mt-1 text-[15px] leading-relaxed text-neutral-800">{dien(chung.conThay, ten)}</p>

                <h4 className="mt-4 text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
                  {CHU_DONG_HANH.viecHangNgay}
                </h4>
                <ul className="mt-1 space-y-1.5">
                  {(
                    [
                      [CHU_DONG_HANH.nhanSang, theoBac.sang],
                      [CHU_DONG_HANH.nhanSauHoc, theoBac.sauGioHoc],
                      [CHU_DONG_HANH.nhanTruocNgu, theoBac.truocKhiNgu],
                    ] as const
                  ).map(([nhan, chu]) => (
                    <li key={nhan} className="khoi-in text-[15px] leading-relaxed text-neutral-800">
                      <strong className="font-semibold">{nhan}: </strong>
                      {dien(chu, ten)}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-[14px] leading-relaxed text-emerald-950">
                  <strong className="font-semibold">{CHU_DONG_HANH.nenNoi}: </strong>
                  {dien(theoBac.nenNoi, ten)}
                </p>
                <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[14px] leading-relaxed text-rose-950">
                  <strong className="font-semibold">{CHU_DONG_HANH.nenTranh}: </strong>
                  {dien(theoBac.nenTranh, ten)}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-neutral-800">
                  <strong className="font-semibold">{CHU_DONG_HANH.cauHoi}: </strong>
                  {dien(theoBac.cauHoi, ten)}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-neutral-600">
                  <strong className="font-semibold">{CHU_DONG_HANH.dauHieu}: </strong>
                  {dien(chung.dauHieu, ten)}
                </p>
              </KhoiGap>
            </div>
          );
        })}

        {trucLech.length === 0 && (
          <div data-thu="dong-hanh-trung-khop">
            <KhoiGap tieuDe={CHU_DONG_HANH.tieuDeTrungKhop} tomTat={CHU_DONG_HANH.tomTatTrungKhop}>
              <ul className="space-y-3">
                {MA_TRUC.map((truc) => (
                  <li key={truc} className="khoi-in text-[15px] leading-relaxed text-neutral-800">
                    <span className="font-semibold" style={{ color: TRUC[truc].mau }}>
                      ■ {TRUC[truc].ten}.{" "}
                    </span>
                    {DONG_HANH_TRUNG_KHOP[truc].giu}{" "}
                    <strong className="font-semibold">{CHU_DONG_HANH.nhanNuoi}: </strong>
                    {DONG_HANH_TRUNG_KHOP[truc].nuoiTiep}
                  </li>
                ))}
              </ul>
            </KhoiGap>
          </div>
        )}

        {bac1 && bac2 && t1 && (
          <div data-thu="ke-hoach-tuan">
            <KhoiGap
              tieuDe={dien(CHU_DONG_HANH.tieuDeKeHoach, ten)}
              tomTat={CHU_DONG_HANH.tomTatKeHoach}
            >
              <p className="text-[14px] leading-relaxed text-neutral-600">
                {dien(CHU_DONG_HANH.moTaKeHoach, ten)}
              </p>
              <ol className="mt-3 space-y-2">
                {(
                  [
                    [CHU_DONG_HANH.ngayDauTuan, bac1.sang],
                    [CHU_DONG_HANH.ngayGiuaTuan, bac2.sauGioHoc],
                    [CHU_DONG_HANH.ngayCuoiTuan, bac1.truocKhiNgu],
                    [CHU_DONG_HANH.ngayChuNhat, `${CHU_DONG_HANH.cauHoi}: ${bac1.cauHoi}`],
                  ] as const
                ).map(([nhan, chu]) => (
                  <li key={nhan} className="khoi-in text-[15px] leading-relaxed text-neutral-800">
                    <strong className="font-semibold">{nhan}: </strong>
                    {dien(chu, ten)}
                  </li>
                ))}
              </ol>
            </KhoiGap>
          </div>
        )}
      </div>

      <p className="mt-4 text-[14px] leading-relaxed text-neutral-600">{CHU_DONG_HANH.nhacTestLai}</p>
    </section>
  );
}
