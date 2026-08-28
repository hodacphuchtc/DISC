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
import { hienNgayGio } from "@modules/core/tien-ich/ngay";
import {
  laBanPhanTichHopLe,
  type BanPhanTich,
} from "@modules/report/phan-tich-gia-dinh";
import type { PhanTichGiaDinh } from "@modules/core/gia-dinh/kieu";
import {
  KENH_KHO,
  docTatCa,
  docPhanTich,
  docThanhVien,
  donThuMucPhanTich,
  thuMucSapMat,
} from "@modules/core/luu-tru/kho-bai";

export function KhoangPhanTich() {
  const [dangPhanTich, datDangPhanTich] = useState<readonly NguoiCoBai[] | null>(null);
  const [choThuMuc, datChoThuMuc] = useState<readonly PhanTichGiaDinh[] | null>(null);
  const [soNguoiCoHoSo, datSoNguoiCoHoSo] = useState<number | null>(null);
  /** Các lần đã chạy, mới nhất trước. Tối đa `GIOI_HAN_THU_MUC`. */
  const [thuMuc, datThuMuc] = useState<readonly PhanTichGiaDinh[]>([]);
  /** Bản cũ đang mở lại — `null` = đang chạy bản mới. */
  const [banCu, datBanCu] = useState<readonly BanPhanTich[] | null>(null);
  const [loi, datLoi] = useState<string | null>(null);

  const demLai = useCallback(async () => {
    const [tv, bai, pt] = await Promise.all([docThanhVien(), docTatCa(), docPhanTich()]);
    datSoNguoiCoHoSo(
      tv.filter(
        (t) =>
          bai.some((b) => b.maThanhVien === t.id && b.ketQua.hopLe) || Boolean(t.nhanQuaMa),
      ).length,
    );
    // Mới nhất lên trước: người ta tìm lần vừa chạy nhiều hơn tìm lần đầu tiên.
    datThuMuc([...pt].sort((a, b) => b.taoLuc.localeCompare(a.taoLuc)));
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

  /**
   * Mở lại một lần chạy cũ.
   *
   * 🔴 KIỂM HÌNH DẠNG TRƯỚC KHI VẼ. `noiDung` khai kiểu `unknown`, và bản ghi từ phiên bản
   * trước có thể thiếu trường. Ép kiểu bừa thì React đọc `undefined.latCat` và trả về một
   * trang TRẮNG — không phải một lời báo lỗi, nên người dùng chỉ thấy sản phẩm hỏng mà
   * không biết vì sao.
   */
  function moThuMuc(pt: PhanTichGiaDinh) {
    datLoi(null);
    if (!laBanPhanTichHopLe(pt.noiDung)) {
      datLoi(CHU_TONG_HOP.thuMucHong);
      return;
    }
    datBanCu(pt.noiDung);
  }

  if (banCu) {
    return <ManBanTongHop nguoi={[]} banCoSan={banCu} onDong={() => datBanCu(null)} />;
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

      {loi && (
        <p role="alert" className="mt-3 text-[14px]" style={{ color: MAU.camDamChoChu }}>
          {loi}
        </p>
      )}

      {/* 🔴 DANH SÁCH CÁC LẦN ĐÃ CHẠY. Chữ cho khối này đã nằm trong `config/` từ GĐ14 mà
          KHÔNG component nào vẽ, và `docPhanTich()` cũng chưa ai gọi — nghĩa là bản phân
          tích được lưu vào kho rồi không có đường nào mở lại. Đây là chỗ nối nó vào. */}
      {thuMuc.length > 0 && (
        <section data-thu="danh-sach-thu-muc" className="mt-8">
          <h3 className="text-[15px] font-semibold text-neutral-900">
            {CHU_TONG_HOP.nhomThuMuc}
          </h3>
          <p className="mt-1 text-[13px] text-neutral-600">
            {CHU_TONG_HOP.moTaThuMuc.replace("{so}", String(GIOI_HAN_THU_MUC))}
          </p>
          <ul className="mt-3 space-y-2">
            {thuMuc.map((t) => (
              <li
                key={t.id}
                data-thu="thu-muc"
                className="flex flex-wrap items-center gap-2 rounded-xl border p-3"
                style={{ borderColor: MAU.vienMo }}
              >
                {/* 🔴 NGÀY VÀ GIỜ. Hai lần chạy cùng một buổi mà chỉ hiện ngày thì hai
                    dòng giống hệt nhau, và không ai phân biệt được mình đang mở cái nào. */}
                <span className="text-[14px] text-neutral-800">
                  {hienNgayGio(t.taoLuc)}
                </span>
                <button
                  type="button"
                  onClick={() => moThuMuc(t)}
                  className="ml-auto min-h-[44px] rounded-xl border px-4 text-[14px] font-semibold"
                  style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
                >
                  {CHU_TONG_HOP.nutMoThuMuc}
                </button>
              </li>
            ))}
          </ul>
        </section>
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
