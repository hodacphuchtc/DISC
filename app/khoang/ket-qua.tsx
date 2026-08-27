"use client";

import { useRef, useState } from "react";

import { BieuDoCot } from "@/app/components/bieu-do-cot";
import { CapNhanVat, NhanVat } from "@/app/components/nhan-vat";
import { TIEU_DE_KHOI } from "@config/disc-dien-giai";
import { CHU_KET_QUA, CHU_M4, CHU_M6, TRUC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { BoDe, MaTruc } from "@modules/core/bo-de/kieu";
import { xoaBai } from "@modules/core/luu-tru/kho-bai";
import { OLienHe } from "@/app/components/o-lien-he";
import { ghiMoc } from "@modules/core/do-phieu";
import { guiLienHeMacDinh } from "@modules/core/lien-he/luu-tam";
import { BO_DE_BO_ME, BO_DE_CON } from "@modules/report/doi-chieu";
import { MoiLamNot, useDoiChieu } from "./vung-lech";
import type { MaBoDe } from "@modules/core/bo-de/kieu";
import type { KetQua } from "@modules/report/cham";
import { layDienGiai, thayChuThe } from "@modules/report/dien-giai";
import { hoFontDangDung, veAnhKetQua } from "@modules/report/xuat-anh";

/** M4 — màn kết quả. Bốn khối văn bản đọc từ `config/disc-dien-giai.ts`. */
export function ManKetQua({
  boDe,
  bietDanh,
  ketQua,
  idBai,
  onLamLai,
  onXemDoiChieu,
  onLamBoConThieu,
  nguon = "truc-tiep",
}: {
  readonly boDe: BoDe;
  readonly bietDanh: string;
  readonly ketQua: KetQua;
  /** Mã bài trong kho. `null` khi bài không lưu được, hoặc khi đang xem lại bài cũ. */
  readonly idBai?: string | null;
  readonly onLamLai: () => void;
  /** Có cặp để đối chiếu ⇒ mở màn M5. Thiếu callback thì khối chuyền tay không hiện. */
  readonly onXemDoiChieu?: (maTre: string) => void;
  readonly onLamBoConThieu?: (ma: MaBoDe, maTre: string) => void;
  /** Kênh người dùng đến từ đâu — đi kèm phiếu liên hệ và mốc phễu, KHÔNG định danh ai. */
  readonly nguon?: string;
}) {
  const laBoTreNho = boDe.ma === "MN" || boDe.ma === "TH";
  const laTuDanhGia = boDe.ma === "TH" || boDe.ma === "THCS" || boDe.ma === "PH";

  if (!ketQua.hopLe) {
    return (
      <section className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
        <p className="text-[11px] tracking-widest text-neutral-600 uppercase">
          {boDe.ten} · {bietDanh}
        </p>
        <h1 className="mt-3 text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900">
          Chưa kết luận được
        </h1>
        <p
          role="status"
          className="mt-5 rounded-xl bg-amber-50 px-4 py-3.5 text-[15px] leading-relaxed text-amber-900"
        >
          {ketQua.lyDo === "PHANG" ? CHU_KET_QUA.phang : CHU_KET_QUA.thieuCau}
        </p>
        <div data-khong-in className="mt-10">
          <NutLamLai onLamLai={onLamLai} />
        </div>
      </section>
    );
  }

  const dienGiai = layDienGiai(ketQua.kieu, boDe.ma);
  const noiBat: MaTruc[] | undefined =
    ketQua.kieu.loai === "don"
      ? [ketQua.kieu.truc]
      : ketQua.kieu.loai === "pha"
        ? [...ketQua.kieu.cap]
        : undefined;

  const tieuDe =
    ketQua.kieu.loai === "don"
      ? thayChuThe(CHU_M4.nghiengVe, boDe.ma).replace(
          "{ten}",
          TRUC[ketQua.kieu.truc].ten.toLowerCase(),
        )
      : ketQua.kieu.loai === "pha"
        ? CHU_M4.phaGiua
            .replace("{a}", TRUC[ketQua.kieu.cap[0]].ten.toLowerCase())
            .replace("{b}", TRUC[ketQua.kieu.cap[1]].ten.toLowerCase())
        : CHU_M4.phoDeu;

  const boDeGhepCapDuoc =
    BO_DE_CON.includes(boDe.ma) || boDe.ma === BO_DE_BO_ME;

  const khoi = [
    { ten: TIEU_DE_KHOI.trongNhuTheNao, than: dienGiai.trongNhuTheNao },
    { ten: TIEU_DE_KHOI.diemManh, than: dienGiai.diemManh },
    { ten: TIEU_DE_KHOI.choCanDeY, than: dienGiai.choCanDeY },
  ];

  return (
    <section className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
      <p className="text-[11px] tracking-widest text-neutral-600 uppercase">
        {boDe.ten} · {bietDanh}
      </p>

      {/* 🔴 Câu rào BẮT BUỘC cho bộ trẻ nhỏ, đặt TRƯỚC kết quả (§9.2). */}
      {laBoTreNho && (
        <p className="mt-3 text-[14px] leading-relaxed font-medium text-neutral-700">
          {CHU_KET_QUA.cauRaoTre}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-5">
        {ketQua.kieu.loai === "don" && <NhanVat truc={ketQua.kieu.truc} />}
        {ketQua.kieu.loai === "pha" && <CapNhanVat cap={ketQua.kieu.cap} />}
        <h1 className="max-w-sm text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900 md:text-[30px]">
          {tieuDe}
        </h1>
      </div>

      {/* Cố ý KHÔNG lặp lại câu "bốn nhóm cân bằng" ở đây: khối "Điều này thường trông
          như thế nào" bên dưới đã nói đúng ý đó, và nói bằng ĐÚNG đại từ của bộ đề.
          Bản cũ gõ cứng "bạn" nên bộ Bố mẹ-nhìn-con đọc ra hai câu lệch nhau. */}

      {ketQua.canhBao.length > 0 && (
        <ul className="mt-6 space-y-2">
          {ketQua.canhBao.map((c) => (
            <li
              key={c}
              role="status"
              className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-900"
            >
              {CHU_KET_QUA.canhBao[c]}
            </li>
          ))}
        </ul>
      )}

      <section aria-label={CHU_M4.nhanBieuDo} className="mt-9">
        <BieuDoCot diem={ketQua.diem} noiBat={noiBat} />
      </section>

      <div className="mt-10 space-y-7">
        {khoi.map((k) => (
          <div key={k.ten}>
            <h2 className="text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
              {k.ten}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-800">{k.than}</p>
          </div>
        ))}

        <div className="rounded-xl border-l-4 px-4 py-4" style={{ borderColor: MAU.camNangLuong }}>
          <h2 className="text-[12px] font-semibold tracking-widest text-neutral-700 uppercase">
            {laTuDanhGia ? TIEU_DE_KHOI.cauHoiToiNayTuMinh : TIEU_DE_KHOI.cauHoiToiNay}
          </h2>
          <ol className="mt-3 space-y-2.5">
            {dienGiai.cauHoiToiNay.map((c, i) => (
              <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-neutral-800">
                <span
                  aria-hidden="true"
                  className="shrink-0 font-semibold tabular-nums"
                  style={{ color: MAU.camDamChoChu }}
                >
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {boDeGhepCapDuoc && onXemDoiChieu && onLamBoConThieu && (
        <div data-khong-in className="mt-10">
          <KhoiChuyenTay
            maTre={bietDanh}
            onXem={onXemDoiChieu}
            onLamBo={(ma) => onLamBoConThieu(ma, bietDanh)}
          />
        </div>
      )}

      <OLienHe
        nguon={nguon}
        onGui={(phieu) => {
          guiLienHeMacDinh(phieu);
          ghiMoc("deLaiSo", nguon, phieu.luc);
        }}
      />

      <div data-khong-in className="mt-10 flex flex-wrap items-center gap-3">
        <NutTaiAnh
          tenTep={`disc-${bietDanh}`}
          noiDung={{
            tieuDeCauHoi: laTuDanhGia
              ? TIEU_DE_KHOI.cauHoiToiNayTuMinh
              : TIEU_DE_KHOI.cauHoiToiNay,
            cauHoi: dienGiai.cauHoiToiNay,
            tieuDe,
            diem: ketQua.diem,
            trucNhanVat: noiBat ?? [],
            chanTrang: CHU_M4.chanTrangAnh,
          }}
        />
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-[48px] rounded-xl border border-neutral-300 px-5 text-[15px] font-medium text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: MAU.timCongNghe }}
        >
          {CHU_M4.nutTaiPdf}
        </button>
        <NutLamLai onLamLai={onLamLai} />
        {idBai && <NutKetThucVaXoa idBai={idBai} onXong={onLamLai} />}
      </div>
    </section>
  );
}

/**
 * 🔴 QĐ7 — MÁY DÙNG CHUNG.
 * Kênh "giáo viên đưa tận tay" nghĩa là một máy đi qua nhiều gia đình. Không có nút này
 * thì hồ sơ hành vi của từng đứa trẻ cứ tích lại trên một cái máy tính bảng đi mượn.
 */
function NutKetThucVaXoa({
  idBai,
  onXong,
}: {
  readonly idBai: string;
  readonly onXong: () => void;
}) {
  const [daXoa, datDaXoa] = useState(false);

  async function xoa() {
    if (!window.confirm(CHU_M6.hoiXoaBai)) return;
    await xoaBai(idBai);
    datDaXoa(true);
    onXong();
  }

  if (daXoa) {
    return (
      <p role="status" className="basis-full text-[13px] text-neutral-600">
        {CHU_M6.daXoaBai}
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void xoa()}
      className="min-h-[48px] rounded-xl px-4 text-[14px] text-neutral-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: MAU.timCongNghe }}
    >
      {CHU_M6.nutKetThucVaXoa}
    </button>
  );
}

function NutTaiAnh({
  noiDung,
  tenTep,
}: {
  readonly noiDung: Parameters<typeof veAnhKetQua>[1];
  readonly tenTep: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dangVe, datDangVe] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [biCat, datBiCat] = useState(false);

  async function taiVe() {
    const canvas = canvasRef.current;
    if (!canvas || dangVe) return;
    datDangVe(true);
    datLoi(null);
    try {
      const { anh, ketQua } = await veAnhKetQua(canvas, noiDung, hoFontDangDung());
      datBiCat(ketQua.biCat);
      const url = URL.createObjectURL(anh);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tenTep}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      datLoi(e instanceof Error ? e.message : CHU_M4.loiVeAnh);
    } finally {
      datDangVe(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void taiVe()}
        disabled={dangVe}
        className="min-h-[48px] rounded-xl px-6 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
        style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
      >
        {dangVe ? CHU_M4.dangVeAnh : CHU_M4.nutTaiAnh}
      </button>
      {/* Canvas ẩn — chỉ là mặt bàn để vẽ, không phải thứ người dùng nhìn. */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      {biCat && (
        <p role="status" className="basis-full text-[13px] text-amber-800">
          {CHU_M4.anhBiCat}
        </p>
      )}
      {loi && (
        <p role="alert" className="basis-full text-[13px] text-red-700">
          {loi}
        </p>
      )}
    </>
  );
}

/**
 * 🔴 QĐ6 — CHUYỀN TAY CHỦ ĐỘNG.
 *
 * Vùng lệch ghép cặp trong IndexedDB CÙNG MỘT TRÌNH DUYỆT. Nếu để phụ huynh tự đi tìm
 * màn đối chiếu thì mũi nhọn của sản phẩm không bao giờ bật lên — và KHÔNG CÓ GÌ BÁO ĐỎ,
 * vì mọi thứ vẫn "chạy đúng". Nên ngay sau kết quả, nói thẳng còn thiếu bài nào.
 */
function KhoiChuyenTay({
  maTre,
  onXem,
  onLamBo,
}: {
  readonly maTre: string;
  readonly onXem: (maTre: string) => void;
  readonly onLamBo: (ma: MaBoDe) => void;
}) {
  const { ketQua } = useDoiChieu(maTre);
  if (!ketQua) return null;

  if (ketQua.ghepDuoc) {
    return (
      <button
        type="button"
        onClick={() => onXem(maTre)}
        className="min-h-[48px] w-full rounded-xl border-l-4 px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ backgroundColor: MAU.timRatNhat, borderColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
      >
        <span className="block text-[15px] font-semibold" style={{ color: MAU.timCongNghe }}>
          Xem hai góc nhìn về {maTre}
        </span>
        <span className="mt-0.5 block text-[13px] text-neutral-700">
          Đã đủ cả bài của con và bài của bố mẹ.
        </span>
      </button>
    );
  }

  return <MoiLamNot lyDo={ketQua.lyDo} onLamBo={onLamBo} />;
}

function NutLamLai({ onLamLai }: { readonly onLamLai: () => void }) {
  return (
    <button
      type="button"
      onClick={onLamLai}
      className="min-h-[48px] rounded-xl border border-neutral-300 px-5 text-[15px] font-medium text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: MAU.timCongNghe }}
    >
      {CHU_M4.nutLamLai}
    </button>
  );
}
