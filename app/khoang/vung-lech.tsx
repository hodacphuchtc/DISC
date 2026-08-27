"use client";

import { useCallback, useEffect, useState } from "react";

import { CHU_DOI_CHIEU } from "@config/disc-doi-chieu";
import { NGUONG_VUNG_LECH } from "@config/disc-nguong";
import { PHUT_UOC_LUONG, TRUC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { MaBoDe } from "@modules/core/bo-de/kieu";
import { napBoDe } from "@modules/core/bo-de/nap";
import { docTatCa } from "@modules/core/luu-tru/kho-bai";
import { doiChieu, type KetQuaDoiChieu, type LyDoChuaGhep } from "@modules/report/doi-chieu";
import { boDeConTuLam } from "@modules/test/dinh-tuyen";

/** Tính vùng lệch cho một biệt danh, đọc thẳng từ kho. */
export function useDoiChieu(maTre: string | null) {
  const [kq, datKq] = useState<KetQuaDoiChieu | null>(null);

  const tinhLai = useCallback(async () => {
    if (!maTre) return datKq(null);
    datKq(doiChieu(await docTatCa(), maTre));
  }, [maTre]);

  useEffect(() => {
    // Đọc trạng thái CHỈ CÓ ở trình duyệt sau khi hydrate xong — đọc lúc dựng HTML
    // tĩnh thì máy chủ và trình duyệt ra hai kết quả khác nhau ⇒ lệch hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void tinhLai();
  }, [tinhLai]);

  return { ketQua: kq, tinhLai };
}

/**
 * Lời mời làm nốt bài còn thiếu.
 * 🔴 KHÔNG BAO GIỜ hiện màn hình rỗng — luôn nói rõ còn thiếu gì và mất bao lâu (§8.2).
 */
export function MoiLamNot({
  lyDo,
  onLamBo,
}: {
  readonly lyDo: LyDoChuaGhep;
  readonly onLamBo: (ma: MaBoDe) => void;
}) {
  if (lyDo.ma === "KHAC_PHIEN_BAN") {
    return <ThongBao than={CHU_DOI_CHIEU.khacPhienBan} />;
  }
  if (lyDo.ma === "QUA_HAN") {
    return (
      <ThongBao
        than={CHU_DOI_CHIEU.quaHan.replace("{soNgay}", String(NGUONG_VUNG_LECH.soNgayToiDa))}
      />
    );
  }

  // 🔴 Bộ QS trải 8–15 tuổi, bắc qua CẢ hai bộ con tự làm. Gõ cứng "THCS" ở đây là mời một
  // em lớp 3 làm bộ dành cho lớp 9 — lỗi đã tồn tại từ GĐ5 và không test nào bắt được.
  const boDeCon = lyDo.ma === "THIEU_BAI_CON" ? boDeConTuLam(lyDo.tuoi) : "QS";
  // Dưới sàn tự đánh giá thì KHÔNG mời — đi vòng qua ADR-002 còn tệ hơn là không mời.
  // Không xảy ra trên thực tế vì bộ QS chỉ mở khi con ≥ 8 tuổi; đây là chốt chặn.
  if (boDeCon === null) return null;
  const thieuBaiCon = lyDo.ma === "THIEU_BAI_CON";
  const ma: MaBoDe = boDeCon;
  const bo = napBoDe(ma);
  const than = (thieuBaiCon ? CHU_DOI_CHIEU.thieuBaiCon : CHU_DOI_CHIEU.thieuBaiBoMe)
    .replace("{soCau}", String(bo.cau.length))
    .replace("{phut}", PHUT_UOC_LUONG[ma] ?? "4–5");

  return (
    <div
      className="rounded-xl border-l-4 px-4 py-4"
      style={{ backgroundColor: MAU.timRatNhat, borderColor: MAU.timCongNghe }}
    >
      <p className="text-[15px] leading-relaxed text-neutral-800">{than}</p>
      <button
        type="button"
        onClick={() => onLamBo(ma)}
        className="mt-4 min-h-[48px] rounded-xl px-5 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
      >
        {thieuBaiCon ? CHU_DOI_CHIEU.nutLamBaiCon : CHU_DOI_CHIEU.nutLamBaiBoMe}
      </button>
    </div>
  );
}

function ThongBao({ than }: { readonly than: string }) {
  return (
    <p role="status" className="rounded-xl bg-amber-50 px-4 py-3.5 text-[15px] leading-relaxed text-amber-900">
      {than}
    </p>
  );
}

/** M5 — bảng đối chiếu hai góc nhìn. */
export function ManVungLech({
  ketQua,
  maTre,
  onLamBo,
  onDong,
}: {
  readonly ketQua: KetQuaDoiChieu;
  readonly maTre: string;
  readonly onLamBo: (ma: MaBoDe) => void;
  readonly onDong: () => void;
}) {
  return (
    <section className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
      <button
        type="button"
        onClick={onDong}
        data-khong-in
        className="inline-flex min-h-[44px] items-center text-[13px] text-neutral-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: MAU.timCongNghe }}
      >
        ← Quay lại
      </button>

      <p className="mt-6 text-[11px] tracking-widest text-neutral-600 uppercase">
        {CHU_DOI_CHIEU.nhanTren}
      </p>
      <h1 className="mt-2 text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900 md:text-[32px]">
        {CHU_DOI_CHIEU.tieuDe.replace("{ten}", maTre)}
      </h1>

      {!ketQua.ghepDuoc ? (
        <div className="mt-8">
          <MoiLamNot lyDo={ketQua.lyDo} onLamBo={onLamBo} />
        </div>
      ) : (
        <>
          <table className="mt-9 w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-neutral-300 text-left">
                <th scope="col" className="py-2 font-semibold text-neutral-900">
                  Nhóm
                </th>
                <th scope="col" className="py-2 text-right font-normal text-neutral-600">
                  {CHU_DOI_CHIEU.cotCon}
                </th>
                <th scope="col" className="py-2 text-right font-normal text-neutral-600">
                  {CHU_DOI_CHIEU.cotBoMe}
                </th>
                <th scope="col" className="py-2 text-right font-semibold text-neutral-900">
                  {CHU_DOI_CHIEU.cotLech}
                </th>
              </tr>
            </thead>
            <tbody>
              {ketQua.bang.map((h) => (
                <tr key={h.truc} className="border-b border-neutral-200">
                  <th scope="row" className="py-3 text-left font-semibold text-neutral-900">
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                        style={{ backgroundColor: TRUC[h.truc].mau }}
                      />
                      {TRUC[h.truc].ten}
                    </span>
                  </th>
                  <td className="py-3 text-right text-neutral-700 tabular-nums">
                    {h.diemCon.toFixed(0)}
                  </td>
                  <td className="py-3 text-right text-neutral-700 tabular-nums">
                    {h.diemBoMe.toFixed(0)}
                  </td>
                  <td className="py-3 text-right">
                    <span
                      className="inline-block rounded-full px-2.5 py-1 text-[12px] font-semibold text-white"
                      style={{ backgroundColor: h.mau }}
                    >
                      {h.lech > 0 ? "+" : ""}
                      {h.lech.toFixed(0)} · {h.nhan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ketQua.dienGiai.length > 0 ? (
            <div className="mt-9 space-y-6">
              {ketQua.dienGiai.map((d) => (
                <div key={d.truc}>
                  <h2 className="text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
                    {TRUC[d.truc].ten}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-800">{d.than}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-9 text-[15px] leading-relaxed text-neutral-800">
              Hai góc nhìn khớp nhau ở cả bốn nhóm. Cách {maTre} tự thấy mình và cách bố mẹ
              nhìn thấy đang rất gần nhau.
            </p>
          )}

          {/* 🔴 CÂU KẾT BẮT BUỘC (§8.4). Không được rút gọn, không được bỏ. */}
          <p
            className="mt-10 rounded-xl border-l-4 px-4 py-4 text-[15px] leading-relaxed text-neutral-800"
            style={{ borderColor: MAU.camNangLuong }}
          >
            {CHU_DOI_CHIEU.cauKet}
          </p>
        </>
      )}
    </section>
  );
}
