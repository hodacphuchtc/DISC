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

import { taiBanSaoLuuVeMay } from "@/app/tai-sao-luu";
import { KhoangBangGiaDinh } from "./bang-gia-dinh";
import { ChonBanKetQua } from "@/app/components/chon-ban-ket-qua";
import { ManKetQua } from "./ket-qua";
import { HopThoaiHanMuc } from "@/app/components/hop-thoai-han-muc";
import { KhoiSoSanh } from "@/app/components/khoi-so-sanh";
import { GIOI_HAN_BAI_MOI_NGUOI } from "@config/disc-gia-dinh";
import { CHU_M6 } from "@config/disc-tu-dien";
import { KHUNG } from "@config/bo-cuc";
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
  xoaSachTatCa,
  type BaiLamLuu,
} from "@modules/core/luu-tru/kho-bai";
import { docTuZip, ghiDeKho, type SoTuTep } from "@modules/core/luu-tru/khoi-phuc";

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
  const [dangSaoLuu, datDangSaoLuu] = useState(false);
  const [dangDocTep, datDangDocTep] = useState(false);
  /** Đã khôi phục xong bao nhiêu — hiện một dòng xác nhận, không hiện hộp thoại nữa. */
  const [daKhoiPhuc, datDaKhoiPhuc] = useState<{ nguoi: number; bai: number } | null>(null);
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

  /**
   * Người dùng vừa chọn một tệp .zip.
   *
   * 🔴 ĐỌC TRƯỚC, HỎI SAU, GHI CUỐI. Ba bước tách bạch, và bước GHI chỉ chạy khi người
   * dùng đã nhìn thấy cả hai con số rồi bấm đồng ý. Mọi nhánh thất bại đều thoát ra mà
   * KHÔNG đụng vào kho — đó là điều kiện để nút này không trở thành nút mất dữ liệu.
   */
  async function chonTepKhoiPhuc(tep: File | null | undefined) {
    if (!tep || dangDocTep) return;
    datDangDocTep(true);
    datLoi(null);
    datDaKhoiPhuc(null);
    try {
      const kq = await docTuZip(await tep.arrayBuffer());
      if (!kq.ok) {
        datLoi(
          kq.loi === "khong-mo-duoc"
            ? CHU_M6.loiKhongMoDuoc
            : kq.loi === "khong-phai-so-disc"
              ? CHU_M6.loiKhongPhaiSo
              : CHU_M6.loiDuLieuHong,
        );
        return;
      }
      await hoiRoiGhiDe(kq.so);
    } catch {
      datLoi(CHU_M6.loiKhongMoDuoc);
    } finally {
      datDangDocTep(false);
    }
  }

  async function hoiRoiGhiDe(so: SoTuTep) {
    const [nguoiCu, baiCu] = await Promise.all([docThanhVien(), docTatCa()]);
    const cau = CHU_M6.hoiGhiDe
      .replace("{cu}", String(nguoiCu.length))
      .replace("{baiCu}", String(baiCu.length))
      .replace("{moi}", String(so.thanhVien.length))
      .replace("{baiMoi}", String(so.bai.length));
    const themNhac = so.banCu ? `\n\n${CHU_M6.nhacBanCu}` : "";
    if (!window.confirm(cau + themNhac)) return;

    await ghiDeKho(so);
    datDaKhoiPhuc({ nguoi: so.thanhVien.length, bai: so.bai.length });
    napLai();
  }

  async function taiSaoLuu() {
    if (dangSaoLuu) return;
    datDangSaoLuu(true);
    datLoi(null);
    try {
      if (!(await taiBanSaoLuuVeMay())) datLoi(CHU_M6.loiSaoLuu);
    } catch {
      datLoi(CHU_M6.loiSaoLuu);
    } finally {
      datDangSaoLuu(false);
    }
  }

  /**
   * 🔴 DỌN TRỌN BA BẢNG, không chỉ bảng bài.
   *
   * Bản trước gọi `xoaSach()` — chỉ dọn BÀI, để nguyên tên từng người và các bản phân
   * tích đã chạy. Người bấm tin là mình vừa xoá sạch máy, mà tên thật của cả nhà vẫn còn
   * đó. Luật máy demo của giáo viên/sale dựa thẳng vào nút này.
   */
  async function xoaTatCa() {
    if (!window.confirm(CHU_M6.hoiXoaSach)) return;
    await xoaSachTatCa();
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
    const ban = dangXem.cacBan[dangXem.chon];
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

      <div data-thu="giu-du-lieu" className={`${KHUNG.trang} px-5 pb-12 md:px-12`}>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => void taiSaoLuu()}
            className="min-h-[44px] rounded-xl border px-4 text-[14px] font-semibold"
            style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
          >
            {CHU_M6.nutSaoLuu}
          </button>
          {/* 🔴 Ô chọn tệp ẩn sau một nhãn trông như nút: `<input type="file">` không
              tạo kiểu được cho tử tế, mà đây là nút người ta chỉ bấm vào ngày họ đã mất
              dữ liệu — ngày tệ nhất để phải đoán xem cái gì bấm được. */}
          <label
            className="inline-flex min-h-[44px] cursor-pointer items-center rounded-xl border px-4 text-[14px] font-semibold"
            style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
          >
            {dangDocTep ? CHU_M6.dangDocTep : CHU_M6.nutKhoiPhuc}
            <input
              type="file"
              accept=".zip,application/zip"
              className="sr-only"
              onChange={(e) => {
                const tep = e.target.files?.[0];
                // Xoá giá trị để chọn LẠI CÙNG một tệp vẫn kích hoạt được onChange.
                e.target.value = "";
                void chonTepKhoiPhuc(tep);
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => void xoaTatCa()}
            className="min-h-[44px] rounded-xl px-3 text-[14px] text-neutral-600"
          >
            {CHU_M6.nutXoaSach}
          </button>
        </div>

        {daKhoiPhuc && (
          <p data-thu="da-khoi-phuc" role="status" className="mt-2 text-[13px] font-semibold" style={{ color: MAU.timCongNghe }}>
            {CHU_M6.daKhoiPhuc
              .replace("{nguoi}", String(daKhoiPhuc.nguoi))
              .replace("{bai}", String(daKhoiPhuc.bai))}
          </p>
        )}
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
