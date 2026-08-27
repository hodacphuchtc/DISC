"use client";

/**
 * HỘP THOẠI "BÀI NÀY SẮP MẤT" (12.2).
 *
 * 🔴 Ba thứ bắt buộc, thiếu một là quay về xoá im lặng:
 *  1. **Nêu đích danh** bài nào — bộ nào, ngày nào. "Bài cũ nhất" là không đủ; người dùng
 *     không nhớ bài nào cũ nhất, và họ có quyền biết chính xác cái gì sắp mất.
 *  2. **Cho tải về trước.** Không có nút này thì hạn mức chỉ là một cái nút xoá kèm lời
 *     xin lỗi.
 *  3. **Cho huỷ, và huỷ thì KHÔNG mất gì.**
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useState } from "react";

import { GIOI_HAN_BAI_MOI_NGUOI, GIOI_HAN_THU_MUC } from "@config/disc-gia-dinh";
import { CHU_HAN_MUC, CHU_HAN_MUC_THU_MUC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { hienNgay } from "@modules/core/tien-ich/ngay";
import type { PhanTichGiaDinh } from "@modules/core/gia-dinh/kieu";
import type { BaiLamLuu } from "@modules/core/luu-tru/kho-bai";
import { goiCacBai, taiXuong, tenTepThuMuc } from "@modules/core/luu-tru/tai-ve";

export function HopThoaiHanMuc({
  sapMat,
  onHuy,
  onTiepTuc,
}: {
  readonly sapMat: readonly BaiLamLuu[];
  readonly onHuy: () => void;
  readonly onTiepTuc: () => void;
}) {
  const [daTick, datDaTick] = useState(false);
  const [nhac, datNhac] = useState<string | null>(null);
  const [dangTai, datDangTai] = useState(false);

  async function taiVe() {
    datDangTai(true);
    try {
      const luc = new Date().toISOString();
      const { duLieu } = await goiCacBai(sapMat, luc);
      datNhac(taiXuong(duLieu, tenTepThuMuc(luc)) ? CHU_HAN_MUC.daTaiVe : CHU_HAN_MUC.loiTaiVe);
    } catch {
      datNhac(CHU_HAN_MUC.loiTaiVe);
    } finally {
      datDangTai(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={CHU_HAN_MUC.tieuDe}
      data-thu="hop-thoai-han-muc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="max-h-[90dvh] w-full max-w-md overflow-auto rounded-2xl bg-white p-5 md:p-6">
        <h2 className="text-[18px] leading-snug font-bold text-neutral-900">
          {CHU_HAN_MUC.tieuDe}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-700">
          {CHU_HAN_MUC.moTa.replace("{gioiHan}", String(GIOI_HAN_BAI_MOI_NGUOI))}
        </p>

        <h3 className="mt-5 text-[12px] font-semibold tracking-widest uppercase" style={{ color: MAU.camDamChoChu }}>
          {CHU_HAN_MUC.nhanDanhSach}
        </h3>
        <ul data-thu="bai-sap-mat" className="mt-2 space-y-1.5">
          {sapMat.map((b) => (
            <li
              key={b.id}
              className="rounded-lg px-3 py-2 text-[15px] text-neutral-900"
              style={{ backgroundColor: "#FFF4E6" }}
            >
              {CHU_HAN_MUC.mauDong.replace("{boDe}", b.boDe).replace("{ngay}", hienNgay(b.ketThuc))}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => void taiVe()}
          disabled={dangTai}
          className="mt-4 min-h-[44px] w-full rounded-xl border px-4 text-[15px] font-semibold"
          style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
        >
          {CHU_HAN_MUC.nutTaiVe}
        </button>
        {nhac && (
          <p role="status" className="mt-2 text-[13px] text-neutral-700">
            {nhac}
          </p>
        )}

        <label className="mt-5 flex items-start gap-2.5 text-[14px] leading-relaxed text-neutral-800">
          <input
            type="checkbox"
            checked={daTick}
            onChange={(e) => {
              datDaTick(e.target.checked);
              datNhac(null);
            }}
            className="mt-1 h-4 w-4 shrink-0"
          />
          {CHU_HAN_MUC.oXacNhan}
        </label>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (!daTick) {
                datNhac(CHU_HAN_MUC.chuaTick);
                return;
              }
              onTiepTuc();
            }}
            className="min-h-[44px] flex-1 rounded-xl px-4 text-[15px] font-semibold text-white"
            style={{ backgroundColor: MAU.timCongNghe }}
          >
            {CHU_HAN_MUC.nutTiepTuc}
          </button>
          <button
            type="button"
            onClick={onHuy}
            className="min-h-[44px] rounded-xl border px-5 text-[15px] font-semibold text-neutral-700"
            style={{ borderColor: MAU.vienMo }}
          >
            {CHU_HAN_MUC.nutHuy}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * HỘP THOẠI "LẦN PHÂN TÍCH NÀY SẮP MẤT" (14.5).
 *
 * Cùng ba luật với `HopThoaiHanMuc`: nêu đích danh · cho tải về · cho huỷ. Khác một chỗ:
 * thứ sắp mất là một THƯ MỤC phân tích chứ không phải một bài, nên dòng mô tả nói theo
 * ngày chạy và số người — đó là thứ người dùng nhớ được về một lần chạy.
 */
export function HopThoaiThuMuc({
  sapMat,
  onHuy,
  onTiepTuc,
}: {
  readonly sapMat: readonly PhanTichGiaDinh[];
  readonly onHuy: () => void;
  readonly onTiepTuc: () => void;
}) {
  const [daTick, datDaTick] = useState(false);
  const [nhac, datNhac] = useState<string | null>(null);

  function taiVe() {
    const luc = new Date().toISOString();
    const duLieu = new TextEncoder().encode(JSON.stringify(sapMat, null, 2));
    datNhac(
      taiXuong(duLieu, `disc-phan-tich-${luc.slice(0, 10)}.json`)
        ? CHU_HAN_MUC.daTaiVe
        : CHU_HAN_MUC.loiTaiVe,
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={CHU_HAN_MUC_THU_MUC.tieuDe}
      data-thu="hop-thoai-thu-muc"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="max-h-[90dvh] w-full max-w-md overflow-auto rounded-2xl bg-white p-5 md:p-6">
        <h2 className="text-[18px] leading-snug font-bold text-neutral-900">
          {CHU_HAN_MUC_THU_MUC.tieuDe}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-700">
          {CHU_HAN_MUC_THU_MUC.moTa.replace("{gioiHan}", String(GIOI_HAN_THU_MUC))}
        </p>

        <ul data-thu="thu-muc-sap-mat" className="mt-4 space-y-1.5">
          {sapMat.map((t) => (
            <li
              key={t.id}
              className="rounded-lg px-3 py-2 text-[15px] text-neutral-900"
              style={{ backgroundColor: "#FFF4E6" }}
            >
              {CHU_HAN_MUC_THU_MUC.mauDong
                .replace("{ngay}", hienNgay(t.taoLuc))
                .replace("{so}", String(t.maBai.length))}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={taiVe}
          className="mt-4 min-h-[44px] w-full rounded-xl border px-4 text-[15px] font-semibold"
          style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
        >
          {CHU_HAN_MUC.nutTaiVe}
        </button>
        {nhac && (
          <p role="status" className="mt-2 text-[13px] text-neutral-700">
            {nhac}
          </p>
        )}

        <label className="mt-5 flex items-start gap-2.5 text-[14px] leading-relaxed text-neutral-800">
          <input
            type="checkbox"
            checked={daTick}
            onChange={(e) => {
              datDaTick(e.target.checked);
              datNhac(null);
            }}
            className="mt-1 h-4 w-4 shrink-0"
          />
          {CHU_HAN_MUC.oXacNhan}
        </label>

        <div className="mt-5 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (!daTick) {
                datNhac(CHU_HAN_MUC.chuaTick);
                return;
              }
              onTiepTuc();
            }}
            className="min-h-[44px] flex-1 rounded-xl px-4 text-[15px] font-semibold text-white"
            style={{ backgroundColor: MAU.timCongNghe }}
          >
            {CHU_HAN_MUC.nutTiepTuc}
          </button>
          <button
            type="button"
            onClick={onHuy}
            className="min-h-[44px] rounded-xl border px-5 text-[15px] font-semibold text-neutral-700"
            style={{ borderColor: MAU.vienMo }}
          >
            {CHU_HAN_MUC.nutHuy}
          </button>
        </div>
      </div>
    </div>
  );
}
