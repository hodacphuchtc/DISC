/**
 * PHÂN TÍCH MỘT LẦN ĐO — điều phối, hàm thuần, thuộc TẦNG LÕI (ADR-004, ADR-010).
 *
 * Thứ tự cố ý: (1) từ chối số đo vô lý, (2) chọn chuẩn theo tuổi, (3) áp hàng rào an toàn,
 * (4) mới tính. Tính xong rồi mới chặn thì ai đó sẽ hiện nhầm con số đã bị cấm.
 */

import {
  KHOANG_HOP_LY,
  THANG_CHUAN_2006,
  TUOI_NGUOI_LON,
  TUOI_TOI_DA,
  type NhomTuoi,
} from "@config/suc-khoe-nguong";
import {
  eoChieuCaoVuotNguong,
  phanLoaiBmiChauA,
  tiLeEoChieuCao,
  tinhBmi,
  tinhBmr,
  tinhTdee,
  vongEoVuotNguong,
} from "./chi-so";
import type { CanhBao, DauVaoSucKhoe, KetQuaSucKhoe, LyDoTuChoi } from "./kieu";
import { tuoiTheoThang } from "./tuoi";
import { phanLoaiTheoZ, zLms, type TraBang } from "./z-score";

function ngoai(x: number, k: { min: number; max: number }): boolean {
  return !Number.isFinite(x) || x < k.min || x > k.max;
}

/** Kiểm đầu vào; trả lý do từ chối hoặc `null` nếu ổn. */
function kiemDauVao(
  v: DauVaoSucKhoe,
): { lyDo: LyDoTuChoi } | { thang: number } {
  const thang = tuoiTheoThang(v.ngaySinh, v.ngayDo);
  if (thang === null) {
    return {
      lyDo:
        tuoiTheoThang(v.ngaySinh, v.ngaySinh) === null
          ? "ngay-sinh-hong"
          : "ngay-do-hong",
    };
  }
  if (thang < 0) return { lyDo: "do-truoc-khi-sinh" };
  if (thang > TUOI_TOI_DA * 12) return { lyDo: "tuoi-ngoai-khoang" };
  if (ngoai(v.canNangKg, KHOANG_HOP_LY.canNangKg))
    return { lyDo: "can-nang-ngoai-khoang" };
  if (ngoai(v.chieuCaoCm, KHOANG_HOP_LY.chieuCaoCm))
    return { lyDo: "chieu-cao-ngoai-khoang" };
  if (v.vongEoCm !== undefined && ngoai(v.vongEoCm, KHOANG_HOP_LY.vongEoCm)) {
    return { lyDo: "vong-eo-ngoai-khoang" };
  }
  return { thang };
}

export function nhomTuoiCua(tuoiThang: number): NhomTuoi {
  if (tuoiThang < THANG_CHUAN_2006) return "duoi-5";
  return tuoiThang < TUOI_NGUOI_LON * 12 ? "5-19" : "nguoi-lon";
}

/**
 * @param traBang bảng L/M/S của WHO (nạp lười). Không truyền ⇒ trẻ em chỉ nhận BMI thô
 *   kèm cảnh báo "chưa so được với chuẩn tăng trưởng"; KHÔNG bịa phân loại.
 */
export function phanTichSucKhoe(
  v: DauVaoSucKhoe,
  traBang?: TraBang,
): KetQuaSucKhoe {
  const kiem = kiemDauVao(v);
  if ("lyDo" in kiem) return { hopLe: false, lyDo: kiem.lyDo };

  const tuoiThang = kiem.thang;
  const nhomTuoi = nhomTuoiCua(tuoiThang);
  const nguoiLon = nhomTuoi === "nguoi-lon";
  const canhBao: CanhBao[] = ["khong-thay-bac-si"];

  if (v.coBenhNen) canhBao.push("benh-nen-hoi-bac-si");

  // Mang thai / cho bú: cân nặng đổi vì lý do khác, BMI vô nghĩa.
  const khongApBmi = v.mangThaiHoacChoBu === true;
  if (khongApBmi) canhBao.push("mang-thai-khong-ap-bmi");

  const bmi = khongApBmi ? null : tinhBmi(v.canNangKg, v.chieuCaoCm);

  let phanLoaiBmi = null;
  let zBmi: number | null = null;
  let phanLoaiZ = null;

  if (bmi !== null && nguoiLon) {
    phanLoaiBmi = phanLoaiBmiChauA(bmi);
  } else if (bmi !== null) {
    const lms = traBang
      ? traBang("bmi-theo-tuoi", v.gioiTinh, tuoiThang)
      : null;
    if (lms) {
      zBmi = zLms(bmi, lms);
      phanLoaiZ = phanLoaiTheoZ(zBmi);
      if (phanLoaiZ === "thap-nang" || phanLoaiZ === "cao-nang")
        canhBao.push("nen-gap-chuyen-gia");
    } else {
      canhBao.push("chua-co-bang-tang-truong");
    }
  }

  if (phanLoaiBmi === "thieu-can" || phanLoaiBmi === "beo-phi-nang")
    canhBao.push("nen-gap-chuyen-gia");

  // Vòng eo: chỉ từ người lớn. Trẻ em cần bảng riêng nên bỏ qua, không dùng ngưỡng người lớn.
  let tiLeEo: number | null = null;
  let eoVuot: boolean | null = null;
  if (nguoiLon && v.vongEoCm !== undefined) {
    tiLeEo = tiLeEoChieuCao(v.vongEoCm, v.chieuCaoCm);
    eoVuot =
      eoChieuCaoVuotNguong(tiLeEo) || vongEoVuotNguong(v.vongEoCm, v.gioiTinh);
  }

  // Nhu cầu năng lượng: người lớn, không mang thai (nhu cầu khác hẳn).
  let bmrKcal: number | null = null;
  let tdeeKcal: number | null = null;
  if (nguoiLon && !khongApBmi) {
    bmrKcal = tinhBmr(
      v.canNangKg,
      v.chieuCaoCm,
      Math.floor(tuoiThang / 12),
      v.gioiTinh,
    );
    tdeeKcal = v.mucVanDong ? tinhTdee(bmrKcal, v.mucVanDong) : null;
  }

  // Hàng rào cứng (ADR-010 mục 5): dưới 19 tuổi KHÔNG BAO GIỜ được gợi ý giảm cân.
  // Người lớn thừa cân/béo phì mới được; có bệnh nền hoặc mang thai thì không tự gợi ý.
  const duocGoiYGiamCan =
    nguoiLon &&
    !khongApBmi &&
    !v.coBenhNen &&
    (phanLoaiBmi === "thua-can" ||
      phanLoaiBmi === "beo-phi" ||
      phanLoaiBmi === "beo-phi-nang");

  return {
    hopLe: true,
    tuoiThang,
    nhomTuoi,
    bmi,
    phanLoaiBmi,
    zBmi,
    phanLoaiZ,
    tiLeEoChieuCao: tiLeEo,
    eoVuotNguong: eoVuot,
    bmrKcal,
    tdeeKcal,
    duocGoiYGiamCan,
    canhBao,
  };
}
