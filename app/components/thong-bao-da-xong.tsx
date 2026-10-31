"use client";

import { useEffect, useState } from "react";

import { dauVaoDayDu } from "@/app/dau-vao-day-du";
import { GIOI_HAN_BAI_MOI_NGUOI } from "@config/disc-gia-dinh";
import { CHU_DAY_DU } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { MaBoDe } from "@modules/core/bo-de/kieu";
import { loaiCuaBoDe } from "@modules/core/gia-dinh/han-muc";
import { docTatCa, docThanhVien } from "@modules/core/luu-tru/kho-bai";
import { tinhDayDu, tongKetDayDu, type TongKetDayDu } from "@modules/report/do-day-du-bo-test";

import { chuViecConThieu } from "./so-ban-da-lam";

type Doc = {
  /** Bản thứ mấy trong CÙNG LOẠI của người này, tính cả bản vừa làm. */
  readonly banThu: number;
  readonly tongKet: TongKetDayDu | null;
};

/**
 * THÔNG BÁO "ĐÃ XONG" (28.2) — ngay trên đầu màn kết quả của bài VỪA làm.
 *
 * Trước đây làm xong chỉ thấy kết quả; không ai nói bài đã lưu chưa, đây là bản thứ mấy, và
 * cả nhà còn thiếu ai. Thông báo này nói cả ba, ngắn gọn, một khối.
 *
 * Đọc kho SAU khi bài đã lưu (có `idBai`), không cộng dồn trong đầu — kho là nơi duy nhất biết
 * máy này thật sự có mấy bản. `luuHong` (lưu thất bại) ⇒ nói thật, không im lặng; còn `idBai`
 * mới là `null` thì chỉ là đang lưu, nên chưa hiện số bản.
 */
export function ThongBaoDaXong({
  boDe,
  bietDanh,
  idBai,
  luuHong = false,
  hopLe,
  onLamTiep,
}: {
  readonly boDe: MaBoDe;
  readonly bietDanh: string;
  readonly idBai?: string | null;
  /** Lưu THẤT BẠI (không phải đang lưu). `idBai` còn `null` lúc đang lưu nên không dùng được. */
  readonly luuHong?: boolean;
  readonly hopLe: boolean;
  /**
   * Về danh sách cả nhà để làm tiếp. 🔴 KHÔNG nhảy thẳng vào bài của người kế: mọi bài mới phải
   * đi qua cửa hạn mức ở màn Nhà mình (`batDauBaiMoi`) — một lối tắt từ đây là dựng đúng lối vòng
   * mà cửa đó cấm. Nút chỉ đưa người dùng về đúng chỗ và nêu tên người cần làm tiếp.
   */
  readonly onLamTiep?: () => void;
}) {
  const [doc, datDoc] = useState<Doc | null>(null);

  useEffect(() => {
    if (!idBai) return;
    let huy = false;
    void (async () => {
      const [bai, thanhVien] = await Promise.all([docTatCa(), docThanhVien()]);
      if (huy) return;
      const vua = bai.find((b) => b.id === idBai);
      const loai = loaiCuaBoDe(boDe);
      const cungNguoi = vua
        ? bai.filter(
            (b) =>
              loaiCuaBoDe(b.boDe) === loai &&
              (vua.maThanhVien ? b.maThanhVien === vua.maThanhVien : b.maTre === vua.maTre),
          )
        : [];
      const tongKet =
        thanhVien.length > 0
          ? tongKetDayDu(
              thanhVien.map((tv) =>
                tinhDayDu(
                  tv,
                  bai.filter((b) => b.maThanhVien === tv.id),
                  dauVaoDayDu(tv),
                ),
              ),
            )
          : null;
      datDoc({ banThu: cungNguoi.length, tongKet });
    })();
    return () => {
      huy = true;
    };
  }, [idBai, boDe]);

  // Lưu hỏng: nói thật, và báo như một CẢNH BÁO (role=alert), không phải tin vui.
  if (luuHong) {
    return (
      <p
        role="alert"
        data-khong-in
        data-thu="thong-bao-da-xong"
        className="mb-6 rounded-xl px-4 py-3 text-[14px] leading-relaxed"
        style={{ backgroundColor: "#FFF4E6", color: MAU.camDamChoChu }}
      >
        {CHU_DAY_DU.khongLuu}
      </p>
    );
  }

  const loaiChu = loaiCuaBoDe(boDe) === "quan-sat" ? CHU_DAY_DU.loaiQuanSat : CHU_DAY_DU.loaiTuLam;
  const thieu = doc?.tongKet?.conThieu ?? [];

  return (
    <div
      role="status"
      data-khong-in
      data-thu="thong-bao-da-xong"
      className="mb-6 rounded-xl border-l-4 px-4 py-3.5"
      style={{ backgroundColor: MAU.timRatNhat, borderColor: MAU.timCongNghe }}
    >
      <p className="text-[16px] font-bold" style={{ color: MAU.timCongNghe }}>
        ✓ {CHU_DAY_DU.xongTieuDe.replace("{ten}", bietDanh)}
      </p>
      {!hopLe && (
        <p className="mt-1 text-[14px] leading-relaxed" style={{ color: MAU.camDamChoChu }}>
          {CHU_DAY_DU.banChuaDung}
        </p>
      )}
      {doc && doc.banThu > 0 && (
        <p data-thu="ban-thu" className="mt-1 text-[14px] leading-relaxed text-neutral-700">
          {CHU_DAY_DU.banThu
            .replace("{n}", String(doc.banThu))
            .replace("{loai}", loaiChu)
            .replace("{gioiHan}", String(GIOI_HAN_BAI_MOI_NGUOI))}
        </p>
      )}
      {doc?.tongKet && (
        <p data-thu="ca-nha-con-thieu" className="mt-1.5 text-[14px] leading-relaxed text-neutral-800">
          <span className="font-semibold">{CHU_DAY_DU.caNha} </span>
          {CHU_DAY_DU.tongNguoi
            .replace("{du}", String(doc.tongKet.soDu))
            .replace("{tong}", String(doc.tongKet.tong))}
          {thieu.length > 0 &&
            ` · ${CHU_DAY_DU.tomTatThieu.replace(
              "{ds}",
              thieu.map((d) => `${d.ten} (${d.viec ? chuViecConThieu(d.viec).replace(/\.$/u, "") : ""})`).join("; "),
            )}`}
        </p>
      )}
      {onLamTiep && thieu.length > 0 && (
        <button
          type="button"
          onClick={onLamTiep}
          data-thu="nut-lam-tiep"
          className="mt-3 min-h-[44px] rounded-xl border px-4 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
        >
          {CHU_DAY_DU.nutLamTiep.replace("{ten}", thieu[0].ten)}
        </button>
      )}
    </div>
  );
}
