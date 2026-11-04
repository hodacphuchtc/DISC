/**
 * TÓM TẮT MỘT MỐC ĐO — phân tích + nhãn hiển thị, hàm thuần, thuộc TẦNG LÕI (ADR-004).
 * Dùng chung cho màn hình (`app/khoang/suc-khoe/`) và PDF (`modules/report/`), để hai nơi
 * không bao giờ nói hai điều khác nhau về cùng một số đo.
 *
 * 🔴 Trẻ em CHƯA có bảng WHO ⇒ KHÔNG bịa "bình thường": nhãn là "Chưa so được với bảng chuẩn".
 * Khi có bảng (`traBang`), nhãn theo z-score bằng ngôn từ nhẹ — không gắn nhãn "béo/gầy" cho bé.
 */

import { CHU_SK } from "@config/suc-khoe-tu-dien";

import type { DauVaoSucKhoe, KetQuaSucKhoe, MocDo, NguoiSucKhoe } from "./kieu";
import { phanTichSucKhoe } from "./phan-tich";
import type { TraBang } from "./z-score";

export function dauVaoCua(nguoi: NguoiSucKhoe, moc: MocDo): DauVaoSucKhoe {
  return {
    ngaySinh: nguoi.ngaySinh,
    gioiTinh: nguoi.gioiTinh,
    ngayDo: moc.ngayDo,
    canNangKg: moc.canNangKg,
    chieuCaoCm: moc.chieuCaoCm,
    vongEoCm: moc.vongEoCm,
    mucVanDong: moc.mucVanDong,
    mangThaiHoacChoBu: moc.mangThaiHoacChoBu,
    coBenhNen: moc.coBenhNen,
  };
}

export type TomTat = {
  readonly dauVao: DauVaoSucKhoe;
  readonly kq: KetQuaSucKhoe;
  /** Nhãn phân loại và mức nhấn: `luu-y` (cam), `trung` (trung tính), `tot` (mặc định). */
  readonly nhan: string;
  readonly muc: "tot" | "luu-y" | "trung";
};

export function tomTatMoc(
  nguoi: NguoiSucKhoe,
  moc: MocDo,
  traBang?: TraBang,
): TomTat {
  const dauVao = dauVaoCua(nguoi, moc);
  const kq = phanTichSucKhoe(dauVao, traBang);
  if (!kq.hopLe)
    return { dauVao, kq, nhan: CHU_SK.ct.chuaCoBang, muc: "trung" };
  if (kq.bmi === null)
    return { dauVao, kq, nhan: CHU_SK.ct.khongApBmi, muc: "trung" };
  if (kq.phanLoaiBmi) {
    const luuY = kq.phanLoaiBmi !== "binh-thuong";
    return {
      dauVao,
      kq,
      nhan: CHU_SK.phanLoaiBmi[kq.phanLoaiBmi],
      muc: luuY ? "luu-y" : "tot",
    };
  }
  if (kq.phanLoaiZ) {
    return {
      dauVao,
      kq,
      nhan: CHU_SK.phanLoaiZ[kq.phanLoaiZ],
      muc: kq.phanLoaiZ === "binh-thuong" ? "tot" : "luu-y",
    };
  }
  return { dauVao, kq, nhan: CHU_SK.ct.chuaCoBang, muc: "trung" };
}
