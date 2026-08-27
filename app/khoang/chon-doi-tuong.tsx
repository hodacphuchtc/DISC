"use client";

import { useState } from "react";

import { HopGiaiThich, NutVien, TheChon } from "@/app/components/the-doi-tuong";
import {
  CHU_CHON,
  CHU_DISC,
  DOI_TUONG,
  MA_DOI_TUONG,
  MA_TRUC,
  TRUC,
  type MaDoiTuong,
} from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { BoDe } from "@modules/core/bo-de/kieu";
import { napBoDe } from "@modules/core/bo-de/nap";
import { dinhTuyen, type MucTieuPhuHuynh } from "@modules/test/dinh-tuyen";

const LOP_TIEU_HOC = [1, 2, 3, 4, 5];
const TUOI_CON = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export function ManChonDoiTuong({ onXong }: { readonly onXong: (boDe: BoDe) => void }) {
  const [doiTuong, datDoiTuong] = useState<MaDoiTuong | null>(null);
  const [lop, datLop] = useState<number | undefined>();
  const [mucTieu, datMucTieu] = useState<MucTieuPhuHuynh | undefined>();
  const [tuoiCon, datTuoiCon] = useState<number | undefined>();

  function chonDoiTuong(ma: MaDoiTuong) {
    datDoiTuong(ma);
    datLop(undefined);
    datMucTieu(undefined);
    datTuoiCon(undefined);
  }

  const tuyen = doiTuong ? dinhTuyen({ doiTuong, lop, mucTieu, tuoiCon }) : null;
  const boDe = tuyen?.xong ? napBoDe(tuyen.boDe) : null;
  const giaiThich =
    tuyen?.xong && tuyen.giaiThich === "LOP_1_2"
      ? CHU_CHON.giaiThichLop12
      : tuyen?.xong && tuyen.giaiThich === "CON_DUOI_8"
        ? CHU_CHON.giaiThichConDuoi8
        : null;

  return (
    <section className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
      <p className="text-[11px] tracking-widest text-neutral-600 uppercase">
        {CHU_CHON.nhanTren}
      </p>
      <h1 className="mt-3 text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900 md:text-[32px]">
        {CHU_CHON.tieuDe}
      </h1>

      <div className="mt-7 grid gap-2 sm:grid-cols-2">
        {MA_DOI_TUONG.map((ma) => (
          <TheChon
            key={ma}
            ten={DOI_TUONG[ma].ten}
            moTa={DOI_TUONG[ma].moTa}
            dangChon={ma === doiTuong}
            onChon={() => chonDoiTuong(ma)}
          />
        ))}
      </div>

      {doiTuong === "tieu-hoc" && (
        <fieldset className="mt-8">
          <legend className="text-[15px] font-semibold text-neutral-900">{CHU_CHON.hoiLop}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {LOP_TIEU_HOC.map((l) => (
              <NutVien key={l} nhan={`Lớp ${l}`} dangChon={l === lop} onChon={() => datLop(l)} />
            ))}
          </div>
        </fieldset>
      )}

      {doiTuong === "phu-huynh" && (
        <fieldset className="mt-8">
          <legend className="text-[15px] font-semibold text-neutral-900">
            {CHU_CHON.hoiMucTieu}
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <TheChon
              ten={CHU_CHON.mucTieuToi}
              dangChon={mucTieu === "toi"}
              onChon={() => datMucTieu("toi")}
            />
            <TheChon
              ten={CHU_CHON.mucTieuCon}
              dangChon={mucTieu === "con"}
              onChon={() => datMucTieu("con")}
            />
          </div>
        </fieldset>
      )}

      {doiTuong === "phu-huynh" && mucTieu === "con" && (
        <fieldset className="mt-8">
          <legend className="text-[15px] font-semibold text-neutral-900">
            {CHU_CHON.hoiTuoiCon}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {TUOI_CON.map((t) => (
              <NutVien key={t} nhan={`${t}`} dangChon={t === tuoiCon} onChon={() => datTuoiCon(t)} />
            ))}
          </div>
        </fieldset>
      )}

      {giaiThich && (
        <div className="mt-8">
          <HopGiaiThich tieuDe={giaiThich.tieuDe} than={giaiThich.than} />
        </div>
      )}

      {boDe && (
        <div className="mt-6 rounded-xl border border-neutral-300 px-4 py-4">
          <p className="text-[15px] font-semibold text-neutral-900">
            Bộ đề: {boDe.ten} · {boDe.cau.length} câu
          </p>
          <p className="mt-1 text-[13px] leading-snug text-neutral-600">
            {boDe.aiTraLoi} trả lời, về {boDe.veAi.toLowerCase()}.
          </p>
          <button
            type="button"
            onClick={() => onXong(boDe)}
            className="mt-4 min-h-[48px] rounded-xl px-6 text-[16px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
          >
            {CHU_CHON.nutTiepTuc}
          </button>
        </div>
      )}

      <div className="mt-12 border-t border-neutral-200 pt-8">
        <p className="text-[13px] font-semibold tracking-widest text-neutral-600 uppercase">
          {CHU_DISC.nhanTren}
        </p>
        <ul className="mt-3 space-y-px">
          {MA_TRUC.map((ma) => (
            <li key={ma} className="flex items-baseline gap-3 py-1.5">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 translate-y-px rounded-[3px]"
                style={{ backgroundColor: TRUC[ma].mau }}
              />
              <span className="text-[14px] text-neutral-700">
                <span className="font-semibold text-neutral-900">{TRUC[ma].ten}</span>
                <span className="ml-2 text-neutral-600">{TRUC[ma].dauHieuOTre}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
