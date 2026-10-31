"use client";

import { LopSau } from "@/app/khoang/lop-sau";
import { type HuongLechCap, type KieuTrungKhop, type MoiQuanHeCap } from "@config/disc-lech-cap";
import { CUNG_NHIP } from "@config/disc-noi-dung-cung-nhip";
import {
  KE_HOACH_BAY_NGAY,
  TINH_HUONG_DOI,
  type MoiQuanHe,
  type TinhHuongDoi,
} from "@config/disc-noi-dung-doi";
import {
  CHU_AN_TOAN_TRE,
  KE_HOACH_TRE_VOI_NL,
  TINH_HUONG_TRE_VOI_NL,
} from "@config/disc-noi-dung-tre-voi-nl";
import { KE_HOACH_VOI_TRE, TINH_HUONG_VOI_TRE } from "@config/disc-noi-dung-voi-tre";
import { CHU_NOI_DUNG_DOI, TRUC } from "@config/disc-tu-dien";
import type { VaiGiaDinh } from "@config/disc-gia-dinh";
import { thayXungHo } from "@config/disc-xung-ho";
import type { MaTruc } from "@modules/core/bo-de/kieu";
import type { BacTre } from "@modules/core/gia-dinh/bac-hoc";

import { KhoiGap } from "./khoi-gap";

/**
 * NỘI DUNG THEO MỐI QUAN HỆ — ba khối dùng ở lát cắt của bản tổng hợp cả nhà (27.5, mở cho
 * MỌI cặp ở 29.6): tình huống hằng ngày, bảy ngày thử, và "hai người cùng nhịp".
 *
 * 🔴 NẠP LƯỜI (`React.lazy` ở `ban-tong-hop.tsx`) và là nơi DUY NHẤT import các file nội dung —
 * hơn 300 chuỗi này không được vào gói nạp ngay (còn dư rất ít so với trần 300 KB).
 *
 * 🔴 LUÔN NÓI RÕ AI ĐANG ĐỌC VÀ AI ĐƯỢC KHUYÊN: tiêu đề gọi đích danh `tenToi` và `tenNguoiKia`.
 * 🔴 CẶP CÓ TRẺ CẦN BẬC HỌC CỦA BÉ. Chưa có lớp ⇒ không đoán: tình huống ẩn đi, kế hoạch được
 * thay bằng một dòng nhắc thêm lớp.
 */

const thayTen = (chu: string, tenToi: string, tenNguoiKia: string) =>
  chu.split("{tenToi}").join(tenToi).split("{nguoiKia}").join(tenNguoiKia);

/** Thế quyền suy từ mối quan hệ — để `thayXungHo` xưng hô đúng. */
const theQuyenCua = (q: MoiQuanHeCap) =>
  q === "nguoi-lon-voi-tre" ? "nguoi-lon-voi-tre" : q === "tre-voi-nguoi-lon" ? "tre-voi-nguoi-lon" : "ngang-vai";

type Ngucanh = {
  readonly moiQuanHe: MoiQuanHeCap;
  readonly bacTre?: BacTre;
  readonly vaiNguoiKia?: VaiGiaDinh;
  readonly tenToi: string;
  readonly tenNguoiKia: string;
};

/** Ô tình huống cho (mối quan hệ, bậc, trục, hướng); `"can-lop"` nếu cặp có trẻ mà chưa biết bậc. */
function layTinhHuong(
  q: MoiQuanHeCap,
  bac: BacTre | undefined,
  truc: MaTruc,
  huong: HuongLechCap,
): TinhHuongDoi | "can-lop" {
  if (q === "nguoi-lon-voi-tre") return bac ? TINH_HUONG_VOI_TRE[truc][huong][bac] : "can-lop";
  if (q === "tre-voi-nguoi-lon") return bac ? TINH_HUONG_TRE_VOI_NL[truc][huong][bac] : "can-lop";
  return TINH_HUONG_DOI[truc][huong][q as MoiQuanHe];
}

function layKeHoach(q: MoiQuanHeCap, bac: BacTre | undefined): readonly string[] | "can-lop" {
  if (q === "nguoi-lon-voi-tre") return bac ? KE_HOACH_VOI_TRE[bac] : "can-lop";
  if (q === "tre-voi-nguoi-lon") return bac ? KE_HOACH_TRE_VOI_NL[bac] : "can-lop";
  return KE_HOACH_BAY_NGAY[q as MoiQuanHe];
}

/** Tên ĐỨA TRẺ trong cặp — để nhắc thêm lớp đúng người. */
const tenTreTrongCap = (n: Ngucanh) => (n.moiQuanHe === "nguoi-lon-voi-tre" ? n.tenNguoiKia : n.tenToi);

/** Một cảnh hằng ngày + câu nên nói / nên tránh, cho MỘT trục lệch. Gập sẵn. */
export function TinhHuongHangNgay({
  truc,
  huong,
  moiQuanHe,
  bacTre,
  vaiNguoiKia,
  tenToi,
  tenNguoiKia,
}: Ngucanh & { readonly truc: MaTruc; readonly huong: HuongLechCap }) {
  const nd = layTinhHuong(moiQuanHe, bacTre, truc, huong);
  // Cặp có trẻ mà chưa biết bậc: để KeHoachBayNgay nhắc thêm lớp MỘT lần, không lặp ở từng trục.
  if (nd === "can-lop") return null;
  const thay = (c: string) =>
    thayXungHo(thayTen(c, tenToi, tenNguoiKia), theQuyenCua(moiQuanHe), tenNguoiKia, { vaiNguoiKia });

  return (
    <div data-thu="tinh-huong-doi" className="mt-3">
      <KhoiGap
        tieuDe={thay(CHU_NOI_DUNG_DOI.tieuDeTinhHuong)}
        tomTat={`${CHU_NOI_DUNG_DOI.nhanNenNoi} · ${CHU_NOI_DUNG_DOI.nhanNenTranh}`}
      >
        <p className="text-[16px] leading-relaxed text-neutral-800">{thay(nd.tinhHuong)}</p>
        <p className="mt-2.5 rounded-lg bg-emerald-50 px-3 py-2 text-[15px] leading-relaxed text-emerald-950">
          <strong className="font-semibold">{CHU_NOI_DUNG_DOI.nhanNenNoi}: </strong>
          {thay(nd.nenNoi)}
        </p>
        <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-[15px] leading-relaxed text-rose-950">
          <strong className="font-semibold">{CHU_NOI_DUNG_DOI.nhanNenTranh}: </strong>
          {thay(nd.nenTranh)}
        </p>
      </KhoiGap>
    </div>
  );
}

/** Bảy ngày thử — khối gập (mở sẵn khi in). Tiêu đề nêu đích danh ai được khuyên. */
export function KeHoachBayNgay(n: Ngucanh) {
  const { moiQuanHe, bacTre, vaiNguoiKia, tenToi, tenNguoiKia } = n;
  const ds = layKeHoach(moiQuanHe, bacTre);

  if (ds === "can-lop") {
    return (
      <p
        data-thu="can-them-lop"
        role="note"
        className="mt-4 rounded-lg bg-amber-50 px-3.5 py-3 text-[15px] leading-relaxed text-amber-950"
      >
        {CHU_NOI_DUNG_DOI.canThemLop.replace("{ten}", tenTreTrongCap(n))}
      </p>
    );
  }

  const laTre = moiQuanHe === "tre-voi-nguoi-lon";
  const thay = (c: string) =>
    thayXungHo(thayTen(c, tenToi, tenNguoiKia), theQuyenCua(moiQuanHe), tenNguoiKia, { vaiNguoiKia });
  return (
    <div data-thu="ke-hoach-bay-ngay" className="mt-4">
      <LopSau tieuDe={thay(CHU_NOI_DUNG_DOI.tieuDeKeHoach)}>
        <p className="text-[15px] leading-relaxed text-neutral-600">
          {thay(laTre ? CHU_NOI_DUNG_DOI.moTaKeHoachTre : CHU_NOI_DUNG_DOI.moTaKeHoach)}
        </p>
        <ol className="mt-3 space-y-2.5">
          {ds.map((ngay) => (
            <li key={ngay.slice(0, 10)} className="khoi-in text-[16px] leading-relaxed text-neutral-800">
              {thay(ngay)}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[14px] text-neutral-600">
          {thay(laTre ? CHU_NOI_DUNG_DOI.ghiChuTre : CHU_NOI_DUNG_DOI.ghiChu)}
        </p>
        {laTre && (
          <p data-thu="dong-an-toan-tre" className="mt-2 rounded-lg bg-sky-50 px-3 py-2 text-[15px] font-semibold text-sky-950">
            {thay(CHU_AN_TOAN_TRE)}
          </p>
        )}
      </LopSau>
    </div>
  );
}

/** Khi hai người cùng nhịp ở một vài nhóm: điểm mạnh chung, chỗ dễ trượt và việc nuôi tiếp. */
export function CungNhipHangNgay({
  ds,
  moiQuanHe,
  vaiNguoiKia,
  tenToi,
  tenNguoiKia,
}: Omit<Ngucanh, "bacTre"> & {
  readonly ds: readonly { readonly truc: MaTruc; readonly kieu: KieuTrungKhop }[];
}) {
  const thay = (c: string) =>
    thayXungHo(thayTen(c, tenToi, tenNguoiKia), theQuyenCua(moiQuanHe), tenNguoiKia, { vaiNguoiKia });
  return (
    <div data-thu="cung-nhip-hang-ngay" className="mt-4">
      <KhoiGap
        tieuDe={thay(CHU_NOI_DUNG_DOI.tieuDeCungNhip)}
        tomTat={CHU_NOI_DUNG_DOI.tomTatCungNhip}
      >
        <ul className="space-y-4">
          {ds.map(({ truc, kieu }) => {
            const o = CUNG_NHIP[moiQuanHe][truc][kieu];
            return (
              <li key={truc} className="khoi-in text-[16px] leading-relaxed text-neutral-800">
                <span className="font-semibold" style={{ color: TRUC[truc].mau }}>
                  ■ {TRUC[truc].ten}.{" "}
                </span>
                {thay(o.tinhHuong)}{" "}
                <strong className="font-semibold">{CHU_NOI_DUNG_DOI.nhanNuoiTiep}: </strong>
                {thay(o.nuoiTiep)}
              </li>
            );
          })}
        </ul>
      </KhoiGap>
    </div>
  );
}
