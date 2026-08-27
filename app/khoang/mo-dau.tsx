"use client";

/**
 * BA KHỐI ĐẦU BẢN BÁO CÁO (GĐ10) — tách khỏi `ket-qua.tsx` để giữ luật "không file > 500 dòng".
 *
 * Thứ tự người đọc gặp: tóm tắt 30 giây → biểu đồ → đoạn mở đầu → bảng tra bốn chữ cái.
 * Ba khối này trả lời ba câu hỏi mà bản cũ bỏ trống: *đọc nhanh thì biết gì*, *bốn con số
 * này nghĩa là gì*, và *D-I-S-C là chữ viết tắt của cái gì*.
 */

import { DAC_DIEM_TRUC } from "@config/disc-bieu-hien";
import {
  CHU_BANG_TRA,
  CHU_CHU_GIAI,
  CHU_MO_DAU,
  KHOI_DAN_NGUON,
  MA_TRUC,
  TRUC,
} from "@config/disc-tu-dien";
import type { MaTruc } from "@modules/core/bo-de/kieu";

import { LopSau } from "./lop-sau";

/**
 * TÓM TẮT 30 GIÂY — đặt TRÊN biểu đồ.
 *
 * 🔴 Đây là chỗ DUY NHẤT được phép nói lại điều đã có ở dưới, và nó phải là CON TRỎ: mỗi ý
 * một dòng, không câu văn nào. Viết thành đoạn văn là biến "ngắn gọn mà đầy đủ" thành "dài
 * thêm một lần nữa" — đúng thứ khiến bản báo cáo bị chê ngay từ đầu.
 */
export function TomTat30Giay({
  tieuDe,
  trucNoiNhat,
  trucNheNhat,
  motViec,
}: {
  readonly tieuDe: string;
  readonly trucNoiNhat: MaTruc;
  readonly trucNheNhat: MaTruc;
  /** Một việc làm được ngay. Thiếu thì bỏ dòng đó, không độn chữ cho đủ khuôn. */
  readonly motViec?: string;
}) {
  const dong = [
    { nhan: CHU_MO_DAU.tomTat.manhNhat, truc: trucNoiNhat },
    { nhan: CHU_MO_DAU.tomTat.nheNhat, truc: trucNheNhat },
  ];
  return (
    <section
      aria-label={CHU_MO_DAU.tomTat.nhan}
      className="khoi-in mt-6 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-4"
    >
      <h2 className="text-[11px] font-semibold tracking-widest text-neutral-600 uppercase">
        {CHU_MO_DAU.tomTat.nhan}
      </h2>
      <p className="mt-2 text-[17px] leading-snug font-bold text-neutral-900">{tieuDe}</p>
      <ul className="mt-3 space-y-1.5">
        {dong.map((d) => (
          <li key={d.nhan} className="flex gap-2 text-[14px] leading-snug text-neutral-800">
            <span aria-hidden="true" style={{ color: TRUC[d.truc].mau }}>
              ■
            </span>
            <span>
              <span className="font-semibold">{d.nhan}: </span>
              {TRUC[d.truc].ten} — {TRUC[d.truc].motDong.toLowerCase()}
            </span>
          </li>
        ))}
      </ul>
      {motViec && (
        <p className="mt-3 border-t border-neutral-200 pt-3 text-[14px] leading-snug text-neutral-900">
          <span className="font-semibold">{CHU_MO_DAU.tomTat.lamNgay}: </span>
          {motViec}
        </p>
      )}
    </section>
  );
}

/**
 * ĐOẠN MỞ ĐẦU — đặt ngay dưới biểu đồ, giải thích bốn con số vừa nhìn thấy.
 *
 * Giọng cố ý THÀNH THẬT VỀ GIỚI HẠN chứ không nhấn uy tín: đặc tả cấm tuyên bố chuẩn hoá,
 * và bộ câu hỏi tới nay vẫn chưa ai ký duyệt. Xem chú thích ở `CHU_MO_DAU`.
 */
export function MoDauKetQua() {
  return (
    <section
      aria-label={CHU_MO_DAU.nhan}
      className="khoi-in mt-6 border-l-2 border-neutral-200 pl-4"
    >
      <h2 className="text-[11px] font-semibold tracking-widest text-neutral-600 uppercase">
        {CHU_MO_DAU.nhan}
      </h2>
      {CHU_MO_DAU.doanVan.map((d) => (
        <p key={d} className="mt-2 text-[14px] leading-relaxed text-neutral-700">
          {d}
        </p>
      ))}
      <p className="mt-3 text-[12px] leading-snug text-neutral-500">{CHU_MO_DAU.nguonGoc}</p>
    </section>
  );
}

/**
 * BẢNG TRA BỐN CHỮ CÁI — khối gập, đặt dưới đoạn mở đầu.
 *
 * 🔴 Từ tiếng Anh CHỈ sống ở đây. Đặc tả chốt *"Trẻ dưới 12 tuổi không đọc nổi Dominance"*
 * — đó là lý do sản phẩm có bốn nhân vật robot. Nhét chữ tiếng Anh vào nhãn biểu đồ vừa đưa
 * nó ra trước mắt một bé năm tuổi, vừa làm nhãn dài đủ để tràn khung ảnh PNG.
 */
export function BangTraDisc() {
  return (
    <LopSau tieuDe={CHU_BANG_TRA.tieuDe}>
      <ul className="space-y-3.5">
        {MA_TRUC.map((t) => (
          <li key={t} className="khoi-in flex gap-3">
            <span
              aria-hidden="true"
              className="mt-0.5 w-5 shrink-0 text-[17px] font-extrabold"
              style={{ color: TRUC[t].mau }}
            >
              {t}
            </span>
            <span className="text-[15px] leading-snug text-neutral-800">
              <span className="font-semibold">{TRUC[t].tenTiengAnh}</span>
              <span className="text-neutral-500"> — {TRUC[t].ten}</span>
              <br />
              {TRUC[t].nghia}
            </span>
          </li>
        ))}
      </ul>
      <p className="khoi-in mt-4 text-[13px] leading-snug text-neutral-600">
        {CHU_BANG_TRA.ghiChu}
      </p>
    </LopSau>
  );
}

/**
 * CHÚ GIẢI BỐN NHÓM (12.5) — bốn khối mỗi trục, rồi tới khối dẫn nguồn.
 *
 * 🔴 Khối thứ tư (*mượn cách của nhóm khác*) là cách trả lời câu "làm sao cho cân bằng?"
 * mà không đi ngược ADR-002: **thêm một lựa chọn**, không **vá một chỗ hổng**. Xem chú
 * thích dài ở `DacDiemTruc.muonCach`.
 */
export function ChuGiaiBonNhom() {
  return (
    <LopSau tieuDe={CHU_CHU_GIAI.tieuDe}>
      <p className="khoi-in text-[14px] leading-relaxed text-neutral-600">
        {CHU_CHU_GIAI.moTa}
      </p>

      <div className="mt-5 space-y-6">
        {MA_TRUC.map((t) => (
          <section key={t} data-thu="chu-giai-truc" data-truc={t} className="khoi-in">
            <h3 className="flex items-baseline gap-2 text-[15px] font-semibold text-neutral-900">
              <span aria-hidden="true" style={{ color: TRUC[t].mau }}>
                ■
              </span>
              {TRUC[t].ten}
            </h3>
            {(
              [
                ["dam", CHU_CHU_GIAI.nhanDam, DAC_DIEM_TRUC[t].diemManh],
                ["gia", CHU_CHU_GIAI.nhanGia, DAC_DIEM_TRUC[t].choCanDeY],
                ["nhat", CHU_CHU_GIAI.nhanNhat, DAC_DIEM_TRUC[t].khiNhe],
                ["muon", CHU_CHU_GIAI.nhanMuon, DAC_DIEM_TRUC[t].muonCach],
              ] as const
            ).map(([ma, nhan, than]) => (
              <div key={ma} data-thu={`khoi-${ma}`} className="mt-3">
                <h4 className="text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
                  {nhan}
                </h4>
                <p className="mt-1 text-[15px] leading-relaxed text-neutral-800">{than}</p>
              </div>
            ))}
          </section>
        ))}
      </div>

      <div data-thu="dan-nguon" className="khoi-in mt-8 border-t border-neutral-200 pt-4">
        <h3 className="text-[14px] font-semibold text-neutral-900">{KHOI_DAN_NGUON.tieuDe}</h3>
        {KHOI_DAN_NGUON.doan.map((d) => (
          <p key={d.slice(0, 24)} className="mt-2 text-[14px] leading-relaxed text-neutral-600">
            {d}
          </p>
        ))}
      </div>
    </LopSau>
  );
}
