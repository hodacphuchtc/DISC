"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ThanhTienTrinh, ThangTraLoi } from "@/app/components/thang-tra-loi";
import { CHU_LAM_BAI } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { BoDe } from "@modules/core/bo-de/kieu";
import { docNhap, ghiNhap, xoaNhap } from "@modules/core/luu-tru/nhap";
import {
  chiaTrang,
  nenDongVien,
  phanTramXong,
  soCauDaTraLoi,
  trangDaXong,
  trangDangDo,
} from "@modules/test/lam-bai/tien-trinh";

/**
 * Chặn trên cho một lần bấm. Người dùng mở tab rồi bỏ đi ăn cơm không được tính là
 * "đã ngồi làm 40 phút" — nếu không, hàng rào HL-4 (bấm bừa) thành vô dụng.
 */
const GIAY_TOI_DA_MOI_CAU = 120;

export function LamBai({
  boDe,
  bietDanh,
  phienBanBoDe,
  onQuayLai,
  onXong,
}: {
  readonly boDe: BoDe;
  readonly bietDanh: string;
  readonly phienBanBoDe: string;
  readonly onQuayLai: () => void;
  readonly onXong: (traLoi: Record<string, number>, giay: number) => void;
}) {
  const trang = chiaTrang(boDe);

  const [traLoi, datTraLoi] = useState<Record<string, number>>({});
  const [chiSoTrang, datChiSoTrang] = useState(0);
  const [daThuTiep, datDaThuTiep] = useState(false);
  const [moLaiNhap, datMoLaiNhap] = useState(false);

  const giayRef = useRef(0);
  // Khởi tạo là null rồi gán trong effect: `new Date()` và `Date.now()` là hàm KHÔNG
  // THUẦN, gọi chúng lúc render làm hai lần render ra hai giá trị khác nhau.
  const batDauRef = useRef<string | null>(null);
  const nhipRef = useRef<number | null>(null);

  // Mở lại bài dở — chỉ khi cùng bộ đề, cùng biệt danh, cùng phiên bản bộ câu.
  useEffect(() => {
    batDauRef.current ??= new Date().toISOString();
    nhipRef.current ??= Date.now();

    const nhap = docNhap(boDe.ma, bietDanh, phienBanBoDe);
    if (!nhap) return;
    // Đọc trạng thái CHỈ CÓ ở trình duyệt sau khi hydrate xong — đọc lúc dựng HTML
    // tĩnh thì máy chủ và trình duyệt ra hai kết quả khác nhau ⇒ lệch hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    datTraLoi({ ...nhap.traLoi });
    giayRef.current = nhap.giayDaLam;
    batDauRef.current = nhap.batDau;
    datChiSoTrang(trangDangDo(boDe, nhap.traLoi));
    datMoLaiNhap(true);
    nhipRef.current = Date.now();
  }, [boDe, bietDanh, phienBanBoDe]);

  const luu = useCallback(
    (moi: Record<string, number>) => {
      ghiNhap({
        boDe: boDe.ma,
        bietDanh,
        traLoi: moi,
        batDau: batDauRef.current ?? new Date().toISOString(),
        giayDaLam: giayRef.current,
        phienBanBoDe,
      });
    },
    [boDe.ma, bietDanh, phienBanBoDe],
  );

  function chon(maCau: string, giaTri: number) {
    // Đây là XỬ LÝ SỰ KIỆN (người dùng bấm), không phải thân render. Đo thời gian
    // thật chính là mục đích của nó — hàng rào HL-4 dựa vào con số này.
    // eslint-disable-next-line react-hooks/purity
    const nay = Date.now();
    nhipRef.current ??= nay;
    giayRef.current += Math.min((nay - nhipRef.current) / 1000, GIAY_TOI_DA_MOI_CAU);
    nhipRef.current = nay;
    datMoLaiNhap(false);

    const moi = { ...traLoi, [maCau]: giaTri };
    datTraLoi(moi);
    luu(moi); // 🔴 lưu sau MỖI câu, không đợi hết trang
  }

  const trangNay = trang[chiSoTrang] ?? [];
  const xongTrang = trangDaXong(trangNay, traLoi);
  const daLam = soCauDaTraLoi(boDe, traLoi);
  const laTrangCuoi = chiSoTrang === trang.length - 1;
  const cauDong = nenDongVien(daLam, boDe.cau.length);

  function tiep() {
    datDaThuTiep(true);
    if (!xongTrang) return;
    datDaThuTiep(false);
    if (laTrangCuoi) {
      xoaNhap(boDe.ma);
      onXong(traLoi, Math.round(giayRef.current));
      return;
    }
    datChiSoTrang((i) => i + 1);
  }

  function lui() {
    datDaThuTiep(false);
    if (chiSoTrang === 0) {
      onQuayLai();
      return;
    }
    datChiSoTrang((i) => i - 1);
  }

  return (
    <section className="max-w-2xl px-5 py-8 md:px-12 md:py-12">
      {/* Máy giáo viên đi qua nhiều gia đình — luôn nói rõ đang làm bài của AI (QĐ7). */}
      <h1 className="mb-5 text-[13px] font-semibold tracking-widest text-neutral-600 uppercase">
        {boDe.ten} · {bietDanh}
      </h1>

      <ThanhTienTrinh
        phanTram={phanTramXong(boDe, traLoi)}
        daLam={daLam}
        tong={boDe.cau.length}
      />

      {moLaiNhap && (
        <p role="status" className="mt-4 rounded-xl px-3.5 py-2.5 text-[13px]"
          style={{ backgroundColor: MAU.timRatNhat, color: MAU.timCongNghe }}>
          {CHU_LAM_BAI.tiepTucNhap}
        </p>
      )}

      <p className="mt-6 text-[14px] leading-relaxed text-neutral-600">{boDe.cauDan}</p>

      <ol className="mt-6 space-y-9">
        {trangNay.map((cau) => {
          const idNhan = `cau-${cau.ma}`;
          return (
            <li key={cau.ma}>
              <p
                id={idNhan}
                className={
                  boDe.cauMoiMan === 1
                    ? "text-[20px] leading-snug font-semibold text-neutral-900"
                    : "text-[16px] leading-snug text-neutral-900"
                }
              >
                {cau.noiDung}
              </p>
              <div className="mt-3.5">
                <ThangTraLoi
                  thang={boDe.thang}
                  daChon={traLoi[cau.ma]}
                  onChon={(v) => chon(cau.ma, v)}
                  kichThuoc={boDe.cauMoiMan === 1 ? "to" : "gon"}
                  moTaBoi={idNhan}
                />
              </div>
            </li>
          );
        })}
      </ol>

      {cauDong && (
        <p role="status" className="mt-7 text-[15px] font-semibold" style={{ color: MAU.camDamChoChu }}>
          {CHU_LAM_BAI.dongVien[
            (Math.floor(daLam / 5) - 1) % CHU_LAM_BAI.dongVien.length
          ]}
        </p>
      )}

      {daThuTiep && !xongTrang && (
        <p role="alert" className="mt-5 text-[13px] text-red-700">
          {CHU_LAM_BAI.conThieu}
        </p>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={lui}
          className="min-h-[48px] rounded-xl border border-neutral-300 px-5 text-[15px] font-medium text-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: MAU.timCongNghe }}
        >
          {CHU_LAM_BAI.nutQuayLai}
        </button>
        <button
          type="button"
          onClick={tiep}
          className="min-h-[48px] flex-1 rounded-xl px-6 text-[16px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-none"
          style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
        >
          {laTrangCuoi ? CHU_LAM_BAI.nutXemKetQua : CHU_LAM_BAI.nutTiep}
        </button>
      </div>
    </section>
  );
}
