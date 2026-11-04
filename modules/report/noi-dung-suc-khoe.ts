/**
 * NỘI DUNG BẢN PDF SỨC KHOẺ CỦA MỘT NGƯỜI, dạng dòng (30.5, ADR-010).
 *
 * Cùng khuôn với `noi-dung-ban.ts`: hàm THUẦN — vào một `NguoiSucKhoe`, ra danh sách dòng có
 * nhãn kiểu; bộ vẽ chung ở `xuat-pdf.ts` lo phần còn lại.
 *
 * 🔴 CHỈ nhận MỘT người (hàng rào "mỗi người một tờ" của cả dự án). 🔴 Kèm TOÀN VĂN lời nhắn
 * quan trọng — tờ giấy được gửi đi/in ra tách khỏi ứng dụng, nên lời nhắn phải đi theo nó.
 *
 * Thuộc TẦNG LÕI (ADR-004): không React, không DOM.
 */

import {
  KHUON_LOI_KHUYEN,
  type NhomLoiKhuyen,
} from "@config/suc-khoe-noi-dung";
import { TOI_DA_BAN_MOI_NGUOI } from "@config/suc-khoe-nguong";
import { CHU_SK } from "@config/suc-khoe-tu-dien";
import { chonKhuon } from "@modules/core/suc-khoe/chon-khuon";
import type { MocDo, NguoiSucKhoe } from "@modules/core/suc-khoe/kieu";
import { tomTatMoc } from "@modules/core/suc-khoe/tom-tat";
import { hienNgay } from "@modules/core/tien-ich/ngay";

import type { DongBan } from "./noi-dung-ban";

const boDam = (s: string) => s.replace(/\*\*/gu, "");
const soVN = (n: number) => n.toFixed(1).replace(".", ",");
const soGon = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");

function dongMoc(nguoi: NguoiSucKhoe, m: MocDo, ra: DongBan[]): void {
  const t = tomTatMoc(nguoi, m);
  const bmi =
    t.kq.hopLe && t.kq.bmi !== null
      ? `${CHU_SK.ct.bmi} ${soVN(t.kq.bmi)}`
      : CHU_SK.ct.khongApBmi;
  ra.push({
    kieu: "nhanManh",
    chu: `${hienNgay(m.ngayDo)} — ${bmi} · ${t.nhan}`,
  });
  ra.push({
    kieu: "than",
    chu: `${CHU_SK.ct.chieuCao}: ${soGon(m.chieuCaoCm)} cm · ${CHU_SK.ct.canNang}: ${soGon(m.canNangKg)} kg`,
  });
}

function dongNhom(g: NhomLoiKhuyen, ra: DongBan[]): void {
  for (const [, nd] of g.muc) ra.push({ kieu: "than", chu: `• ${boDam(nd)}` });
  if (g.luuY) ra.push({ kieu: "than", chu: `Lưu ý: ${boDam(g.luuY)}` });
  if (g.tuan) {
    ra.push({
      kieu: "than",
      chu: `${CHU_SK.ct.tuan}: ${g.tuan.map(([t, v]) => `${t} ${v}`).join(" · ")}`,
    });
  }
}

export function dongChoSucKhoe(nguoi: NguoiSucKhoe): DongBan[] {
  const ra: DongBan[] = [];
  const moi = nguoi.moc[0];
  ra.push({ kieu: "tieuDe", chu: `${CHU_SK.tieuDeThe} — ${nguoi.ten}` });
  ra.push({
    kieu: "than",
    chu: `SATA ROBO · ${CHU_SK.ct.soBanDaLuu.replace("{so}", String(nguoi.moc.length)).replace("{toiDa}", String(TOI_DA_BAN_MOI_NGUOI))}`,
  });
  if (!moi) return ra;

  ra.push({ kieu: "tieuDeLat", chu: CHU_SK.ct.moiNhat });
  dongMoc(nguoi, moi, ra);

  const t = tomTatMoc(nguoi, moi);
  const ma = chonKhuon(t.dauVao, t.kq);
  const khuon = ma ? KHUON_LOI_KHUYEN[ma] : null;
  if (khuon) {
    ra.push({ kieu: "than", chu: khuon.giaiThich });
    // 🔴 KHÔNG đưa biểu tượng cảm xúc (emoji) vào PDF: font Be Vietnam Pro không có glyph
    // emoji ⇒ ra ô vuông. Biểu tượng chỉ dành cho màn hình.
    ra.push({ kieu: "tieuDeLat", chu: khuon.anUong.tieuDe });
    dongNhom(khuon.anUong, ra);
    ra.push({ kieu: "tieuDeLat", chu: khuon.vanDong.tieuDe });
    dongNhom(khuon.vanDong, ra);
    ra.push({ kieu: "tieuDeLat", chu: khuon.nghiNgoi.tieuDe });
    dongNhom(khuon.nghiNgoi, ra);
  }

  if (nguoi.moc.length > 1) {
    ra.push({
      kieu: "tieuDeLat",
      chu: CHU_SK.ct.banCuTieuDe.replace(/ \(.*\)$/u, ""),
    });
    for (const m of nguoi.moc.slice(1)) dongMoc(nguoi, m, ra);
  }

  ra.push({ kieu: "tieuDeLat", chu: CHU_SK.mienTru.tieuDe });
  ra.push({ kieu: "than", chu: boDam(CHU_SK.mienTru.moDau) });
  ra.push({ kieu: "than", chu: boDam(CHU_SK.mienTru.nenGap) });
  CHU_SK.mienTru.dieu.forEach((d, i) =>
    ra.push({ kieu: "than", chu: `${i + 1}. ${boDam(d)}` }),
  );
  ra.push({ kieu: "nhanManh", chu: CHU_SK.mienTru.chuc.replace(/\s*🌱/u, "") });
  return ra;
}

export function tenTepSucKhoe(nguoi: NguoiSucKhoe): string {
  return `suc-khoe-${nguoi.ten}`;
}
