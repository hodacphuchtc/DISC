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

import { KhoiGap } from "./khoi-gap";

/**
 * NỘI DUNG THEO MỐI QUAN HỆ (27.5) — hai khối dùng ở lát cắt của bản tổng hợp cả nhà.
 *
 * Cả hai chỉ vẽ khi `moiQuanHe` suy ra được; vắng mặt thì nơi gọi không dựng gì và lát cắt
 * giữ nguyên nội dung chung `ngang-vai`. Thuộc GÓI B, bản nháp chưa ký — cờ `MO_NOI_DUNG_DOI`
 * ở nơi gọi tắt được cả hai.
 *
 * 🔴 LUÔN NÓI RÕ AI ĐANG ĐỌC VÀ AI ĐƯỢC KHUYÊN. Trong nội dung, "bạn" là người đang đọc;
 * nếu tiêu đề không nêu tên thì người đọc một trang có nhiều người sẽ không biết lời khuyên
 * đang dành cho ai. Vì vậy tiêu đề và mô tả đều gọi đích danh `tenToi` và `tenNguoiKia`.
 */
const thayTen = (chu: string, tenToi: string, tenNguoiKia: string) =>
  chu.split("{tenToi}").join(tenToi).split("{nguoiKia}").join(tenNguoiKia);

/** Một cảnh hằng ngày + câu nên nói / nên tránh, cho MỘT trục lệch. Gập sẵn. */
export function TinhHuongHangNgay({
  truc,
  huong,
  moiQuanHe,
  tenToi,
  tenNguoiKia,
}: {
  readonly truc: MaTruc;
  readonly huong: HuongLechCap;
  readonly moiQuanHe: MoiQuanHe;
  readonly tenToi: string;
  readonly tenNguoiKia: string;
}) {
  const nd = TINH_HUONG_DOI[truc][huong][moiQuanHe];
  const thay = (c: string) => thayDaiTuCap(c, "ngang-vai", tenNguoiKia);

  return (
    <div data-thu="tinh-huong-doi" className="mt-3">
      <KhoiGap
        tieuDe={thayTen(CHU_NOI_DUNG_DOI.tieuDeTinhHuong, tenToi, tenNguoiKia)}
        tomTat={`${CHU_NOI_DUNG_DOI.nhanNenNoi} · ${CHU_NOI_DUNG_DOI.nhanNenTranh}`}
      >
        <p className="text-[15px] leading-relaxed text-neutral-800">{thay(nd.tinhHuong)}</p>
        <p className="mt-2.5 rounded-lg bg-emerald-50 px-3 py-2 text-[14px] leading-relaxed text-emerald-950">
          <strong className="font-semibold">{CHU_NOI_DUNG_DOI.nhanNenNoi}: </strong>
          {thay(nd.nenNoi)}
        </p>
        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[14px] leading-relaxed text-rose-950">
          <strong className="font-semibold">{CHU_NOI_DUNG_DOI.nhanNenTranh}: </strong>
          {thay(nd.nenTranh)}
        </p>
      </KhoiGap>
    </div>
  );
}

/** Bảy ngày thử — khối gập (mở sẵn khi in). Tiêu đề nêu đích danh ai được khuyên. */
export function KeHoachBayNgay({
  moiQuanHe,
  tenToi,
  tenNguoiKia,
}: {
  readonly moiQuanHe: MoiQuanHe;
  readonly tenToi: string;
  readonly tenNguoiKia: string;
}) {
  const thay = (c: string) => thayDaiTuCap(thayTen(c, tenToi, tenNguoiKia), "ngang-vai", tenNguoiKia);
  return (
    <div data-thu="ke-hoach-bay-ngay" className="mt-4">
      <LopSau tieuDe={thayTen(CHU_NOI_DUNG_DOI.tieuDeKeHoach, tenToi, tenNguoiKia)}>
        <p className="text-[14px] leading-relaxed text-neutral-600">
          {thay(CHU_NOI_DUNG_DOI.moTaKeHoach)}
        </p>
        <ol className="mt-3 space-y-2">
          {KE_HOACH_BAY_NGAY[moiQuanHe].map((ngay) => (
            <li key={ngay.slice(0, 10)} className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {thay(ngay)}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[13px] text-neutral-600">{thay(CHU_NOI_DUNG_DOI.ghiChu)}</p>
      </LopSau>
    </div>
  );
}
