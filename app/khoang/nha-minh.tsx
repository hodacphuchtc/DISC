"use client";

/**
 * KHOANG "NHÀ MÌNH" — bảng gia đình + xem lại kết quả + sao lưu.
 *
 * Thay màn *Bài đã làm* xếp theo thời gian (ADR-007). Bảng nằm ở
 * `bang-gia-dinh.tsx`; file này lo ba việc quanh nó.
 *
 * 🔴 NÚT SAO LƯU `.zip` VÀ NÚT XOÁ SẠCH ĐƯỢC MANG NGUYÊN SANG. Chúng là hàng rào chống
 * mất dữ liệu theo `DISC_BA.md` §10.2, không phải tính năng phụ của màn cũ. Thay một màn
 * mà đánh rơi hàng rào của màn đó là cách mất dữ liệu tốn công nhất: không ai thấy cho
 * tới ngày có người cần khôi phục.
 */

import { useCallback, useState } from "react";

import { KhoangBangGiaDinh } from "./bang-gia-dinh";
import { ManKetQua } from "./ket-qua";
import { HopThoaiHanMuc } from "@/app/components/hop-thoai-han-muc";
import { KhoiSoSanh } from "@/app/components/khoi-so-sanh";
import { GIOI_HAN_BAI_MOI_NGUOI } from "@config/disc-gia-dinh";
import { CHU_M6 } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { napBoDe } from "@modules/core/bo-de/nap";
import { MA_TRUC, type MaTruc } from "@modules/core/bo-de/kieu";
import {
  soSanhTheoThoiGian,
  type KetQuaSoSanh,
} from "@modules/report/so-sanh-thoi-gian";
import { ghiMoc } from "@modules/core/do-phieu";
import type { HoSoMoi } from "@modules/core/gia-dinh/ma-moi";
import type { ThanhVien } from "@modules/core/gia-dinh/kieu";
import {
  baiSapMat,
  docTatCa,
  docThanhVien,
  donBaiThanhVien,
  luuThanhVien,
  xoaSach,
  type BaiLamLuu,
} from "@modules/core/luu-tru/kho-bai";
import { TEN_TEP_SAO_LUU, saoLuuTatCa } from "@modules/core/luu-tru/sao-luu";
import { taiXuong } from "@modules/core/luu-tru/tai-ve";

export function KhoangNhaMinh({
  cheDo = "quan-ly",
  onLamBai,
}: {
  /** Bước 1 quản lý người · bước 2 chọn người làm bài. Xem `KhoangBangGiaDinh`. */
  readonly cheDo?: "quan-ly" | "lam-bai";
  /** `cheDo` = "quan-sat" ⇒ người lớn trả lời VỀ đứa trẻ này (bộ QS, V1.4). */
  readonly onLamBai?: (tv: ThanhVien, cheDo?: "quan-sat") => void;
}) {
  const [dangXem, datDangXem] = useState<BaiLamLuu | null>(null);
  const [dangSaoLuu, datDangSaoLuu] = useState(false);
  const [loi, datLoi] = useState<string | null>(null);
  const [lanNap, datLanNap] = useState(0);
  /** Người vừa bấm *Làm bài* mà đã chạm trần — giữ lại để hỏi trước khi xoá gì. */
  const [choHanMuc, datChoHanMuc] = useState<{
    tv: ThanhVien;
    sapMat: BaiLamLuu[];
    cheDo?: "quan-sat";
  } | null>(null);
  const [xemSoSanh, datXemSoSanh] = useState<{ ten: string; ketQua: KetQuaSoSanh } | null>(null);

  /** Mở màn "hồi đó và bây giờ" cho một người (13.2). */
  async function moSoSanh(tv: ThanhVien) {
    const bai = (await docTatCa()).filter((b) => b.maThanhVien === tv.id && b.ketQua.hopLe);
    datXemSoSanh({
      ten: tv.ten,
      ketQua: soSanhTheoThoiGian(
        bai.map((b) => ({
          id: b.id,
          ketThuc: b.ketThuc,
          diem: (b.ketQua as { diem: Record<MaTruc, number> }).diem,
        })),
      ),
    });
  }

  const napLai = useCallback(() => datLanNap((n) => n + 1), []);

  /**
   * 🔴 CỬA HẠN MỨC — chỗ DUY NHẤT trong sản phẩm được phép xoá bài vì lý do hạn mức.
   *
   * Chưa chạm trần thì đi thẳng. Chạm rồi thì DỪNG LẠI và hỏi, nêu đích danh bài nào sắp
   * mất. Không có nhánh nào ở đây đi tắt qua câu hỏi đó — nếu sau này ai đó thêm một lối
   * vào bài mới, họ phải đi qua đúng hàm này.
   */
  async function batDauBaiMoi(tv: ThanhVien, cheDo?: "quan-sat") {
    if (!onLamBai) return;
    const sapMat = await baiSapMat(tv.id, GIOI_HAN_BAI_MOI_NGUOI);
    if (sapMat.length === 0) {
      onLamBai(tv, cheDo);
      return;
    }
    // 🔴 Bài quan sát ĐI CHUNG một hàng rào hạn mức với bài tự làm. Cho nó một lối đi
    // riêng vòng qua đây là dựng đúng cái lối tắt mà chú thích của hàm này cấm.
    datChoHanMuc({ tv, sapMat, cheDo });
  }

  /**
   * Thêm một hồ sơ nhận qua mã mời vào sổ (13.1).
   *
   * 🔴 KHÔNG thêm trùng. Cùng một người phát mã hai lần (hoặc gửi cho cả bố lẫn mẹ rồi cả
   * hai cùng gõ vào một máy) phải ra MỘT hồ sơ, không phải hai. Khoá nhận dạng là bộ đề +
   * bốn con số + ngày phát — không phải tên, vì tên do máy nhận tự đặt.
   */
  async function nhanMa(ten: string, hoSo: HoSoMoi): Promise<boolean> {
    const daCo = await docThanhVien();
    const dauVan = (h: { boDe: string; diem: Record<string, number>; ngayPhat: string }) =>
      `${h.boDe}|${h.ngayPhat}|${MA_TRUC.map((t) => h.diem[t]).join(",")}`;
    if (daCo.some((tv) => tv.nhanQuaMa && dauVan(tv.nhanQuaMa) === dauVan(hoSo))) return false;

    const bayGio = new Date().toISOString();
    await luuThanhVien({
      id: `tv-ma-${bayGio}-${daCo.length}`,
      ten,
      vaiTro: hoSo.vai,
      thuTu: daCo.length,
      nhanQuaMa: { boDe: hoSo.boDe, diem: hoSo.diem, ngayPhat: hoSo.ngayPhat },
      taoLuc: bayGio,
      suaLuc: bayGio,
    });
    ghiMoc("themThanhVien", "ma-moi", bayGio);
    napLai();
    return true;
  }

  async function xacNhanHanMuc() {
    if (!choHanMuc) return;
    await donBaiThanhVien(choHanMuc.tv.id, GIOI_HAN_BAI_MOI_NGUOI);
    const { tv, cheDo } = choHanMuc;
    datChoHanMuc(null);
    napLai();
    onLamBai?.(tv, cheDo);
  }

  async function taiSaoLuu() {
    if (dangSaoLuu) return;
    datDangSaoLuu(true);
    datLoi(null);
    try {
      const { duLieu } = await saoLuuTatCa(new Date().toISOString());
      if (!taiXuong(duLieu, `${TEN_TEP_SAO_LUU}.zip`)) datLoi(CHU_M6.loiSaoLuu);
    } catch {
      datLoi(CHU_M6.loiSaoLuu);
    } finally {
      datDangSaoLuu(false);
    }
  }

  async function xoaTatCa() {
    if (!window.confirm(CHU_M6.hoiXoaSach)) return;
    await xoaSach();
    napLai();
  }

  if (xemSoSanh) {
    return (
      <section className="max-w-2xl px-5 py-8 md:px-12 md:py-12">
        <button
          type="button"
          onClick={() => datXemSoSanh(null)}
          className="inline-flex min-h-[44px] items-center text-[13px] text-neutral-600 underline underline-offset-4"
        >
          ← {CHU_M6.nutDong}
        </button>
        <div className="mt-6">
          <KhoiSoSanh ten={xemSoSanh.ten} ketQua={xemSoSanh.ketQua} />
        </div>
      </section>
    );
  }

  if (dangXem) {
    return (
      <div>
        <div data-khong-in className="px-5 pt-8 md:px-12">
          <button
            type="button"
            onClick={() => datDangXem(null)}
            className="inline-flex min-h-[44px] items-center text-[13px] text-neutral-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ outlineColor: MAU.timCongNghe }}
          >
            ← {CHU_M6.nutDong}
          </button>
        </div>
        <ManKetQua
          boDe={napBoDe(dangXem.boDe)}
          bietDanh={dangXem.maTre}
          ketQua={dangXem.ketQua}
          idBai={dangXem.id}
          onLamLai={() => datDangXem(null)}
          {...(dangXem.tuoi !== undefined ? { tuoi: dangXem.tuoi } : {})}
          {...(dangXem.banKhoan !== undefined ? { banKhoan: dangXem.banKhoan } : {})}
        />
      </div>
    );
  }

  return (
    <>
      <KhoangBangGiaDinh
        key={lanNap}
        cheDo={cheDo}
        {...(onLamBai
          ? {
              onLamBai: (tv: ThanhVien) => void batDauBaiMoi(tv),
              onLamBaiQuanSat: (tv: ThanhVien) => void batDauBaiMoi(tv, "quan-sat"),
            }
          : {})}
        onXemBai={(b) => datDangXem(b)}
        onNhanMa={nhanMa}
        onXemSoSanh={(tv) => void moSoSanh(tv)}
      />

      {choHanMuc && (
        <HopThoaiHanMuc
          sapMat={choHanMuc.sapMat}
          onHuy={() => datChoHanMuc(null)}
          onTiepTuc={() => void xacNhanHanMuc()}
        />
      )}

      <div data-thu="giu-du-lieu" className="max-w-3xl px-5 pb-12 md:px-12">
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => void taiSaoLuu()}
            className="min-h-[44px] rounded-xl border px-4 text-[14px] font-semibold"
            style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
          >
            {CHU_M6.nutSaoLuu}
          </button>
          <button
            type="button"
            onClick={() => void xoaTatCa()}
            className="min-h-[44px] rounded-xl px-3 text-[14px] text-neutral-600"
          >
            {CHU_M6.nutXoaSach}
          </button>
        </div>
        {loi && (
          <p role="alert" className="mt-2 text-[13px]" style={{ color: MAU.camDamChoChu }}>
            {loi}
          </p>
        )}
        <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">{CHU_M6.nhacMatDuLieu}</p>
      </div>
    </>
  );
}
