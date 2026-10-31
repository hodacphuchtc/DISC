"use client";

import { LopSau } from "@/app/khoang/lop-sau";
import { thayDaiTuCap } from "@config/disc-lech-cap";
import {
  KE_HOACH_BAY_NGAY,
  TINH_HUONG_DOI,
  type MoiQuanHe,
} from "@config/disc-noi-dung-doi";
import { CHU_NOI_DUNG_DOI } from "@config/disc-tu-dien";
import type { HuongLechCap } from "@config/disc-lech-cap";
import type { MaTruc } from "@modules/core/bo-de/kieu";

/**
 * NỘI DUNG THEO MỐI QUAN HỆ (27.5) — hai khối dùng ở lát cắt của bản tổng hợp cả nhà.
 *
 * Cả hai chỉ vẽ khi `moiQuanHe` suy ra được; vắng mặt thì nơi gọi không dựng gì và lát cắt
 * giữ nguyên nội dung chung `ngang-vai`. Thuộc GÓI B, bản nháp chưa ký — cờ `MO_NOI_DUNG_DOI`
 * ở nơi gọi tắt được cả hai.
 */

/** Một cảnh hằng ngày + câu nên nói / nên tránh, cho MỘT trục lệch. */
export function TinhHuongHangNgay({
  truc,
  huong,
  moiQuanHe,
  tenNguoiKia,
}: {
  readonly truc: MaTruc;
  readonly huong: HuongLechCap;
  readonly moiQuanHe: MoiQuanHe;
  readonly tenNguoiKia: string;
}) {
  const nd = TINH_HUONG_DOI[truc][huong][moiQuanHe];
  const thay = (c: string) => thayDaiTuCap(c, "ngang-vai", tenNguoiKia);

  return (
    <div data-thu="tinh-huong-doi" className="mt-3 rounded-lg border px-3.5 py-3" style={{ borderColor: "#E5E5E5" }}>
      <h5 className="text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
        {CHU_NOI_DUNG_DOI.tieuDeTinhHuong}
      </h5>
      <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-800">{thay(nd.tinhHuong)}</p>
      <p className="mt-2.5 rounded-lg bg-emerald-50 px-3 py-2 text-[14px] leading-relaxed text-emerald-950">
        <strong className="font-semibold">{CHU_NOI_DUNG_DOI.nhanNenNoi}: </strong>
        {thay(nd.nenNoi)}
      </p>
      <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[14px] leading-relaxed text-rose-950">
        <strong className="font-semibold">{CHU_NOI_DUNG_DOI.nhanNenTranh}: </strong>
        {thay(nd.nenTranh)}
      </p>
    </div>
  );
}

/** Bảy ngày thử — khối gập (mở sẵn khi in). */
export function KeHoachBayNgay({
  moiQuanHe,
  tenNguoiKia,
}: {
  readonly moiQuanHe: MoiQuanHe;
  readonly tenNguoiKia: string;
}) {
  return (
    <div data-thu="ke-hoach-bay-ngay" className="mt-4">
      <LopSau tieuDe={CHU_NOI_DUNG_DOI.tieuDeKeHoach}>
        <p className="text-[14px] leading-relaxed text-neutral-600">
          {thayDaiTuCap(CHU_NOI_DUNG_DOI.moTaKeHoach, "ngang-vai", tenNguoiKia)}
        </p>
        <ol className="mt-3 space-y-2">
          {KE_HOACH_BAY_NGAY[moiQuanHe].map((ngay) => (
            <li key={ngay.slice(0, 10)} className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {thayDaiTuCap(ngay, "ngang-vai", tenNguoiKia)}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[13px] text-neutral-600">
          {thayDaiTuCap(CHU_NOI_DUNG_DOI.ghiChu, "ngang-vai", tenNguoiKia)}
        </p>
      </LopSau>
    </div>
  );
}
