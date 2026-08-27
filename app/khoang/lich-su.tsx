"use client";

import { useCallback, useEffect, useState } from "react";

import { ManKetQua } from "./ket-qua";
import { CHU_M6, TRUC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { napBoDe } from "@modules/core/bo-de/nap";
import {
  demBietDanh,
  docTatCa,
  xoaBai,
  xoaSach,
  type BaiLamLuu,
} from "@modules/core/luu-tru/kho-bai";
import { TEN_TEP_SAO_LUU, saoLuuTatCa } from "@modules/core/luu-tru/sao-luu";
import { hienNgayGio } from "@modules/core/tien-ich/ngay";

/** 🔴 QĐ7: quá số này thì nhắc — nhiều khả năng là máy dùng chung. */
const NGUONG_NHIEU_BIET_DANH = 3;

function tomTatKieu(bai: BaiLamLuu): string {
  if (!bai.ketQua.hopLe) return "Chưa kết luận được";
  const k = bai.ketQua.kieu;
  if (k.loai === "don") return TRUC[k.truc].ten;
  if (k.loai === "pha") return `${TRUC[k.cap[0]].ten} + ${TRUC[k.cap[1]].ten}`;
  return "Bốn nhóm cân bằng";
}

export function KhoangLichSu() {
  const [ds, datDs] = useState<BaiLamLuu[] | null>(null);
  const [dangXem, datDangXem] = useState<BaiLamLuu | null>(null);
  const [dangSaoLuu, datDangSaoLuu] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);

  const napLai = useCallback(async () => {
    datDs(await docTatCa());
  }, []);

  useEffect(() => {
    // Đọc trạng thái CHỈ CÓ ở trình duyệt sau khi hydrate xong — đọc lúc dựng HTML
    // tĩnh thì máy chủ và trình duyệt ra hai kết quả khác nhau ⇒ lệch hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void napLai();
  }, [napLai]);

  async function xoaMot(id: string) {
    if (!window.confirm(CHU_M6.hoiXoaBai)) return;
    await xoaBai(id);
    await napLai();
  }

  async function xoaTatCa() {
    if (!window.confirm(CHU_M6.hoiXoaSach)) return;
    await xoaSach();
    await napLai();
  }

  async function taiSaoLuu() {
    if (dangSaoLuu) return;
    datDangSaoLuu(true);
    datLoi(null);
    try {
      const { duLieu } = await saoLuuTatCa(new Date().toISOString());
      const url = URL.createObjectURL(
        new Blob([duLieu as unknown as ArrayBuffer], { type: "application/zip" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `${TEN_TEP_SAO_LUU}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      datLoi(CHU_M6.loiSaoLuu);
    } finally {
      datDangSaoLuu(false);
    }
  }

  if (dangXem) {
    return (
      <div>
        <div data-khong-in className="px-5 pt-8 md:px-12">
          <button
            type="button"
            onClick={() => datDangXem(null)}
            className="inline-flex min-h-[44px] items-center text-[13px] text-neutral-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: MAU.timCongNghe }}
          >
            ← {CHU_M6.nutDong}
          </button>
        </div>
        <ManKetQua
          boDe={napBoDe(dangXem.boDe)}
          bietDanh={dangXem.maTre}
          ketQua={dangXem.ketQua}
          onLamLai={() => datDangXem(null)}
        />
      </div>
    );
  }

  const soBietDanh = ds ? demBietDanh(ds) : 0;

  return (
    <section className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
      <p className="text-[11px] tracking-widest text-neutral-600 uppercase">
        {ds ? CHU_M6.demBai.replace("{so}", String(ds.length)) : "…"}
      </p>
      <h1 className="mt-3 text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900 md:text-[32px]">
        {CHU_M6.tieuDe}
      </h1>
      <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-neutral-600">
        {CHU_M6.moTa}
      </p>

      {soBietDanh > NGUONG_NHIEU_BIET_DANH && (
        <p
          role="status"
          className="mt-6 rounded-xl border-l-4 px-4 py-3 text-[14px] leading-relaxed text-neutral-800"
          style={{ backgroundColor: MAU.timRatNhat, borderColor: MAU.timCongNghe }}
        >
          {CHU_M6.canhBaoNhieuBietDanh.replace("{so}", String(soBietDanh))}
        </p>
      )}

      {ds && ds.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 px-5 py-8 text-center">
          <p className="text-[15px] font-semibold text-neutral-800">{CHU_M6.trong}</p>
          <p className="mt-1 text-[14px] text-neutral-600">{CHU_M6.trongMoi}</p>
        </div>
      )}

      {ds && ds.length > 0 && (
        <>
          <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
            {ds.map((bai) => (
              <li key={bai.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-neutral-900">
                    {napBoDe(bai.boDe).ten} · {bai.maTre}
                  </p>
                  <p className="mt-0.5 text-[13px] text-neutral-600">
                    {tomTatKieu(bai)} · {hienNgayGio(bai.ketThuc)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => datDangXem(bai)}
                  className="min-h-[44px] rounded-xl border border-neutral-300 px-4 text-[14px] font-medium text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: MAU.timCongNghe }}
                >
                  {CHU_M6.nutMoLai}
                </button>
                <button
                  type="button"
                  onClick={() => void xoaMot(bai.id)}
                  className="min-h-[44px] rounded-xl px-3 text-[14px] text-neutral-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ outlineColor: MAU.timCongNghe }}
                >
                  {CHU_M6.nutXoa}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void taiSaoLuu()}
              disabled={dangSaoLuu}
              className="min-h-[48px] rounded-xl px-5 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
              style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
            >
              {dangSaoLuu ? CHU_M6.dangSaoLuu : CHU_M6.nutSaoLuu}
            </button>
            <button
              type="button"
              onClick={() => void xoaTatCa()}
              className="min-h-[48px] rounded-xl border border-neutral-300 px-5 text-[15px] font-medium text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ outlineColor: MAU.timCongNghe }}
            >
              {CHU_M6.nutXoaSach}
            </button>
          </div>

          {loi && (
            <p role="alert" className="mt-3 text-[13px] text-red-700">
              {loi}
            </p>
          )}

          <p className="mt-6 text-[13px] leading-relaxed text-neutral-600">
            {CHU_M6.nhacMatDuLieu}
          </p>
        </>
      )}
    </section>
  );
}
