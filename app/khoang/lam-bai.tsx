"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ThanhTienTrinh, ThangTraLoi } from "@/app/components/thang-tra-loi";
import { CHU_LAM_BAI } from "@config/disc-tu-dien";
import { canNutTo } from "@config/disc-nguong";
import { MAU } from "@config/thuong-hieu";
import type { BoDe } from "@modules/core/bo-de/kieu";
import { coNhapPhienBanCu, docNhap, ghiNhap, xoaNhap } from "@modules/core/luu-tru/nhap";
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
  const [nhapCu, datNhapCu] = useState(false);
  /** Ô DOM của từng câu, để cuộn tới đúng câu còn trống khi người dùng bấm Tiếp. */
  const oCauRef = useRef<Record<string, HTMLLIElement | null>>({});

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
    if (!nhap) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      datNhapCu(coNhapPhienBanCu(boDe.ma, bietDanh, phienBanBoDe));
      return;
    }
    // Đọc trạng thái CHỈ CÓ ở trình duyệt sau khi hydrate xong — đọc lúc dựng HTML
    // tĩnh thì máy chủ và trình duyệt ra hai kết quả khác nhau ⇒ lệch hydration.
    // (Chỉ thị tắt luật nằm ở nhánh trên — nó phủ cả thân effect này.)
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
    if (!xongTrang) {
      // Báo lỗi mà không chỉ chỗ thì với màn 5 câu người ta phải tự dò lại từng câu một.
      const thieu = trangNay.find((c) => typeof traLoi[c.ma] !== "number");
      // scrollIntoView không có dưới jsdom — gọi thủ thế để test không nổ.
      oCauRef.current[thieu?.ma ?? ""]?.scrollIntoView?.({ block: "center" });
      return;
    }
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

      {nhapCu && (
        <p
          role="status"
          data-thu="nhap-cu"
          className="mt-4 rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed"
          style={{ backgroundColor: "#FFF4E6", color: MAU.camDamChoChu }}
        >
          {CHU_LAM_BAI.nhapCuKhongDung}
        </p>
      )}

      <p className="mt-6 text-[14px] leading-relaxed text-neutral-600">{boDe.cauDan}</p>

      {/*
        MỖI CÂU MỘT THẺ CÓ KHUNG (11.3). Trước đây năm câu nằm trần trên nền trắng, chỉ
        cách nhau bằng khoảng trắng — chủ dự án chụp màn hình lại và nói chúng "dính vào
        nhau". Đúng: mắt không có gì để bám mà tách câu này với câu kia.

        Viền trái đổi TÍM → CAM khi đã chọn, nên nhìn lướt một cái là biết còn sót câu nào.
        Số thứ tự đếm THEO CẢ BÀI (câu 11/20) chứ không theo trang (câu 1 của trang 3) —
        người làm bài quan tâm còn bao nhiêu câu nữa, không quan tâm trang mấy.
      */}
      <ol className="mt-6 space-y-5">
        {trangNay.map((cau) => {
          const idNhan = `cau-${cau.ma}`;
          const daChon = typeof traLoi[cau.ma] === "number";
          const soThuTu = boDe.cau.findIndex((c) => c.ma === cau.ma) + 1;
          const to = canNutTo(boDe.ma);
          return (
            <li
              key={cau.ma}
              ref={(o) => {
                oCauRef.current[cau.ma] = o;
              }}
              data-thu="the-cau"
              data-da-chon={daChon ? "1" : "0"}
              className="rounded-2xl border border-l-[3px] p-4 md:p-5"
              style={{
                borderColor: MAU.vienMo,
                borderLeftColor: daChon ? MAU.camNangLuong : MAU.timCongNghe,
              }}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={
                    to
                      ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[16px] font-semibold tabular-nums"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums"
                  }
                  style={{ backgroundColor: MAU.timRatNhat, color: MAU.timCongNghe }}
                >
                  {soThuTu}
                </span>
                <p
                  id={idNhan}
                  className={
                    to
                      ? "text-[18px] leading-snug font-semibold text-neutral-900"
                      : "text-[16px] leading-snug text-neutral-900"
                  }
                >
                  <span className="sr-only">
                    {CHU_LAM_BAI.nhanSoCau} {soThuTu}.{" "}
                  </span>
                  {cau.noiDung}
                </p>
              </div>
              <div className="mt-3.5">
                <ThangTraLoi
                  thang={boDe.thang}
                  daChon={traLoi[cau.ma]}
                  onChon={(v) => chon(cau.ma, v)}
                  kichThuoc={to ? "to" : "gon"}
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
          /* 🔴 GIỮ VIỀN XÁM, KHÔNG cho viền tím như `NutQuayLai` (18.8). Nút này đứng ngay
             cạnh nút *Tiếp* nền tím; cho nó viền tím nữa là hai nút tím sát nhau, và đứa
             trẻ phải ĐỌC CHỮ mới biết cái nào đi tiếp. Nó vẫn được độ nổi và lún khi bấm —
             thứ thiếu là màu, không phải hình khối. */
          className="min-h-[48px] rounded-xl border border-neutral-300 bg-white px-5 text-[15px] font-medium text-neutral-800 shadow-noi-1 transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: MAU.timCongNghe }}
        >
          {CHU_LAM_BAI.nutQuayLai}
        </button>
        <button
          type="button"
          onClick={tiep}
          className="min-h-[48px] flex-1 rounded-xl px-6 text-[16px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex-none shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
          style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
        >
          {laTrangCuoi ? CHU_LAM_BAI.nutXemKetQua : CHU_LAM_BAI.nutTiep}
        </button>
      </div>
    </section>
  );
}
