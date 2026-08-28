"use client";

/**
 * BƯỚC 3 — PHÂN TÍCH CẢ NHÀ (V2.1, mở rộng ở V3.1).
 *
 * Tách khỏi `nha-minh.tsx`: ở luồng ba bước, phân tích là một BƯỚC chứ không còn là một
 * khối nằm nép cuối bảng gia đình. Chính vì nó nằm nép ở đó mà chủ dự án bấm thử cả buổi
 * không tìm ra — tính năng có thật, đường đi thì không.
 *
 * 🔴 Ghi mốc `phanTichGiaDinh` NGAY LÚC MỞ, không đợi bấm *Phân tích*. Cái đáng đo là **có
 * bao nhiêu nhà đi tới được đây**.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useCallback, useEffect, useState } from "react";

import { ManBanTongHop, type NguoiCoBai } from "./ban-tong-hop";
import { HopThoaiThuMuc } from "@/app/components/hop-thoai-han-muc";
import { GIOI_HAN_THU_MUC } from "@config/disc-gia-dinh";
import { CHU_BUOC, CHU_TONG_HOP } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { ghiMoc } from "@modules/core/do-phieu";
import type { PhanTichGiaDinh } from "@modules/core/gia-dinh/kieu";
import {
  KENH_KHO,
  docTatCa,
  docThanhVien,
  donThuMucPhanTich,
  thuMucSapMat,
} from "@modules/core/luu-tru/kho-bai";

export function KhoangPhanTich() {
  const [dangPhanTich, datDangPhanTich] = useState<readonly NguoiCoBai[] | null>(null);
  const [choThuMuc, datChoThuMuc] = useState<readonly PhanTichGiaDinh[] | null>(null);
  const [soNguoiCoHoSo, datSoNguoiCoHoSo] = useState<number | null>(null);

  const demLai = useCallback(async () => {
    const [tv, bai] = await Promise.all([docThanhVien(), docTatCa()]);
    datSoNguoiCoHoSo(
      tv.filter(
        (t) =>
          bai.some((b) => b.maThanhVien === t.id && b.ketQua.hopLe) || Boolean(t.nhanQuaMa),
      ).length,
    );
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void demLai();
  }, [demLai]);

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const kenh = new BroadcastChannel(KENH_KHO);
    kenh.onmessage = () => void demLai();
    return () => kenh.close();
  }, [demLai]);

  /**
   * 🔴 CỬA HẠN MỨC THƯ MỤC. Đã đủ 5 lần chạy thì DỪNG LẠI và hỏi, nêu đích danh lần nào
   * sắp mất. Cùng luật với hạn mức bài: không bao giờ xoá im lặng.
   */
  async function moPhanTich() {
    const sapMat = await thuMucSapMat(GIOI_HAN_THU_MUC);
    if (sapMat.length > 0) {
      datChoThuMuc(sapMat);
      return;
    }
    await moThatSu();
  }

  async function moThatSu() {
    const [tv, ds] = await Promise.all([docThanhVien(), docTatCa()]);
    ghiMoc("phanTichGiaDinh", "ba-buoc", new Date().toISOString());
    datDangPhanTich(
      tv.map((t) => ({ tv: t, bai: ds.filter((b) => b.maThanhVien === t.id && b.ketQua.hopLe) })),
    );
  }

  async function xacNhanThuMuc() {
    await donThuMucPhanTich(GIOI_HAN_THU_MUC);
    datChoThuMuc(null);
    await moThatSu();
  }

  if (dangPhanTich) {
    return <ManBanTongHop nguoi={dangPhanTich} onDong={() => datDangPhanTich(null)} />;
  }

  return (
    <section data-thu="buoc-phan-tich" className="px-4 py-5">
      <p className="text-[14px] leading-relaxed text-neutral-700">{CHU_TONG_HOP.moTa}</p>

      <button
        type="button"
        data-thu="nut-phan-tich"
        onClick={() => void moPhanTich()}
        className="mt-4 min-h-[48px] rounded-xl px-5 text-[16px] font-semibold text-white"
        style={{ backgroundColor: MAU.timCongNghe }}
      >
        {CHU_TONG_HOP.nutPhanTich}
      </button>

      {soNguoiCoHoSo !== null && (
        <p className="mt-2.5 text-[13px] text-neutral-500">
          {CHU_BUOC.sanSangPhanTich.replace("{so}", String(soNguoiCoHoSo))}
        </p>
      )}

      {choThuMuc && (
        <HopThoaiThuMuc
          sapMat={choThuMuc}
          onHuy={() => datChoThuMuc(null)}
          onTiepTuc={() => void xacNhanThuMuc()}
        />
      )}
    </section>
  );
}
