"use client";

/**
 * KHOANG "NHÀ MÌNH" — bảng gia đình + xem lại kết quả + sao lưu.
 *
 * Thay màn *Bài đã làm* xếp theo thời gian (ADR-007). Bảng nằm ở
 * `bang-gia-dinh.tsx`; file này lo ba việc quanh nó.
 *
 * 🔴 HÀNG RÀO CHỐNG MẤT DỮ LIỆU ĐÃ DỜI RA CHÂN TRANG (18.2), KHÔNG BỊ ĐÁNH RƠI.
 * Ba nút *Sao lưu · Khôi phục · Xoá sạch* nay ở `app/components/khoi-giu-du-lieu.tsx`, cắm
 * ở cuối `cac-buoc.tsx` — ngoài cả hai bước. Lý do: chúng gói TRỌN máy chứ không thuộc
 * riêng bước này, và nút *Khôi phục* là thứ người ta đi tìm vào đúng ngày đã mất dữ liệu,
 * ngày tệ nhất để phải mở đúng bước 1 rồi cuộn hết bảng gia đình mới thấy.
 * **Đừng kéo chúng về đây cho "gọn"** — chúng ở ngoài là có chủ đích, và
 * `tests/khoi-giu-du-lieu.test.tsx` có cửa canh đúng điều đó.
 */

import { NutQuayLai } from "@/app/components/nut-quay-lai";
import { useCallback, useState } from "react";

import { KhoangBangGiaDinh } from "./bang-gia-dinh";
import { ChonBanKetQua } from "@/app/components/chon-ban-ket-qua";
import { ManKetQua } from "./ket-qua";
import { HopThoaiHanMuc } from "@/app/components/hop-thoai-han-muc";
import { KhoiSoSanh } from "@/app/components/khoi-so-sanh";
import { GIOI_HAN_BAI_MOI_NGUOI } from "@config/disc-gia-dinh";
import { CHU_M6 } from "@config/disc-tu-dien";
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
  type BaiLamLuu,
} from "@modules/core/luu-tru/kho-bai";

export function KhoangNhaMinh({
  onLamBai,
}: {
  /** `cheDo` = "quan-sat" ⇒ người lớn trả lời VỀ đứa trẻ này (bộ QS, V1.4). */
  readonly onLamBai?: (tv: ThanhVien, cheDo?: "quan-sat") => void;
}) {
  /**
   * Đang xem kết quả của ai, và ĐANG Ở LẦN ĐO THỨ MẤY (17.2).
   *
   * 🔴 Giữ cả danh sách chứ không chỉ một bài: người dùng phải chuyển qua lại được giữa
   * hai lần đo mà không phải thoát ra rồi vào lại từ thẻ.
   */
  const [dangXem, datDangXem] = useState<{
    cacBan: readonly BaiLamLuu[];
    chon: number;
  } | null>(null);
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

  if (xemSoSanh) {
    return (
      <section className="max-w-2xl px-5 py-8 md:px-12 md:py-12">
        <NutQuayLai nhan={CHU_M6.nutDong} onBam={() => datXemSoSanh(null)} />
        <div className="mt-6">
          <KhoiSoSanh ten={xemSoSanh.ten} ketQua={xemSoSanh.ketQua} />
        </div>
      </section>
    );
  }

  if (dangXem) {
    const ban = dangXem.cacBan[dangXem.chon];
    return (
      <div>
        <div data-khong-in className="px-5 pt-8 md:px-12">
          <NutQuayLai nhan={CHU_M6.nutDong} onBam={() => datDangXem(null)} />
        </div>
        {/* 🔴 Dải chọn nằm NGOÀI `ManKetQua` và ở TRÊN nó — màn kết quả vốn đã là màn
            dài nhất sản phẩm; nhét thêm một dải điều hướng vào giữa ruột nó là chôn dải
            đó xuống dưới nếp gấp, đúng chỗ không ai tìm. */}
        <div className="px-5 pt-6 md:px-12">
          <ChonBanKetQua
            cacBan={dangXem.cacBan}
            dangChon={dangXem.chon}
            onChon={(chon) => datDangXem({ ...dangXem, chon })}
          />
        </div>
        <ManKetQua
          /* 🔴 `key` đổi theo bài: `ManKetQua` giữ trạng thái bên trong (lớp đã bóc, ô
             băn khoăn). Thiếu `key` thì chuyển sang lần đo khác mà màn vẫn mở đúng những
             lớp của lần đo trước — hai bộ số dưới cùng một trạng thái đã mở. */
          key={ban.id}
          boDe={napBoDe(ban.boDe)}
          bietDanh={ban.maTre}
          ketQua={ban.ketQua}
          idBai={ban.id}
          onLamLai={() => datDangXem(null)}
          {...(ban.tuoi !== undefined ? { tuoi: ban.tuoi } : {})}
          {...(ban.banKhoan !== undefined ? { banKhoan: ban.banKhoan } : {})}
        />
      </div>
    );
  }

  return (
    <>
      <KhoangBangGiaDinh
        key={lanNap}
        {...(onLamBai
          ? {
              onLamBai: (tv: ThanhVien) => void batDauBaiMoi(tv),
              onLamBaiQuanSat: (tv: ThanhVien) => void batDauBaiMoi(tv, "quan-sat"),
            }
          : {})}
        onXemBai={(cacBan) => datDangXem({ cacBan, chon: 0 })}
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

    </>
  );
}
