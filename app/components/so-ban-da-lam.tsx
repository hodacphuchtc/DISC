"use client";

import { GIOI_HAN_BAI_MOI_NGUOI } from "@config/disc-gia-dinh";
import { NGUONG_VUNG_LECH } from "@config/disc-nguong";
import { useState } from "react";

import { CHU_BANG_GIA_DINH, CHU_DAY_DU, CHU_MA_MOI, CHU_TEST_LAI } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { hienNgay } from "@modules/core/tien-ich/ngay";
import type { DayDuMotNguoi, ViecConThieu } from "@modules/report/do-day-du-bo-test";
import { hanCuaMotNguoi } from "@modules/report/han-test-lai";

/** Câu đầy đủ cho một lý do còn thiếu. Dùng ở thẻ, bước 1 và cổng phân tích. */
export function chuViecConThieu(v: ViecConThieu): string {
  const mau = CHU_DAY_DU.viec[v.ma];
  return v.ma === "QUA_HAN"
    ? mau
        .replace("{soNgay}", String(v.soNgay))
        .replace("{toiDa}", String(NGUONG_VUNG_LECH.soNgayToiDa))
    : mau;
}

function Cham({ so, mau }: { readonly so: number; readonly mau: string }) {
  const tran = GIOI_HAN_BAI_MOI_NGUOI;
  return (
    <span aria-hidden="true" className="mr-1.5 tracking-widest" style={{ color: mau }}>
      {"●".repeat(Math.min(so, tran))}
      {"○".repeat(Math.max(tran - so, 0))}
    </span>
  );
}

function DongLoai({
  nhan,
  so,
  ganNhat,
  mau,
}: {
  readonly nhan: string;
  readonly so: number;
  readonly ganNhat?: string;
  readonly mau: string;
}) {
  return (
    <li className="text-[14px] text-neutral-700" data-thu="dong-loai-ban">
      <Cham so={so} mau={mau} />
      <span className="font-semibold">{nhan}: </span>
      {so === 0
        ? CHU_DAY_DU.chuaLam
        : [
            CHU_DAY_DU.soBan.replace("{so}", String(so)),
            ganNhat ? CHU_DAY_DU.ganNhat.replace("{ngay}", hienNgay(ganNhat)) : null,
          ]
            .filter(Boolean)
            .join(" · ")}
    </li>
  );
}

/**
 * SỔ BẢN ĐÃ LÀM trên thẻ thành viên (28.1): mấy bản, loại nào, ngày nào, đủ chưa.
 *
 * Người lớn và bé nhỏ: một dòng. Bé từ lớp 3: HAI dòng (con tự làm / bố mẹ làm cho con) —
 * đúng hai góc nhìn mà màn đối chiếu cần.
 */
export function SoBanDaLam({
  day,
  mauNoiTroi,
}: {
  readonly day: DayDuMotNguoi;
  readonly mauNoiTroi?: string;
}) {
  const mau = mauNoiTroi ?? MAU.camNangLuong;
  const tong = day.soTuLam + day.soQuanSat;
  const [bayGio] = useState(() => new Date());
  // 28.6 — hạn test lại của RIÊNG người này: bản hợp lệ gần nhất (bất kể loại) + 6 tháng.
  const ganNhat = [day.ganNhatTuLam, day.ganNhatQuanSat].filter(Boolean).sort().pop();
  const han = hanCuaMotNguoi({ id: day.id, ten: day.ten }, ganNhat, bayGio);
  const haiLoai = day.kieu === "tre-lon" || day.kieu === "chua-biet-bac";

  return (
    <div data-thu="so-tien-do" data-day-du={day.daDu ? "1" : "0"} className="mt-2">
      {day.chiCoMaMoi ? (
        <p className="text-[14px] text-neutral-600">{CHU_MA_MOI.nhanNhanQuaMa}</p>
      ) : tong === 0 ? (
        <p className="text-[14px] text-neutral-600">
          <Cham so={0} mau={mau} />
          {CHU_BANG_GIA_DINH.chuaLamBai}
        </p>
      ) : haiLoai ? (
        <ul className="space-y-0.5">
          <DongLoai nhan={CHU_DAY_DU.nhanTuLam} so={day.soTuLam} ganNhat={day.ganNhatTuLam} mau={mau} />
          <DongLoai nhan={CHU_DAY_DU.nhanQuanSat} so={day.soQuanSat} ganNhat={day.ganNhatQuanSat} mau={mau} />
        </ul>
      ) : day.kieu === "tre-nho" ? (
        <ul>
          <DongLoai nhan={CHU_DAY_DU.nhanQuanSat} so={day.soQuanSat} ganNhat={day.ganNhatQuanSat} mau={mau} />
        </ul>
      ) : (
        <p className="text-[14px] text-neutral-700">
          <Cham so={day.soTuLam} mau={mau} />
          {[
            CHU_DAY_DU.daLamNguoiLon.replace("{so}", String(day.soTuLam)),
            day.ganNhatTuLam ? CHU_DAY_DU.ganNhat.replace("{ngay}", hienNgay(day.ganNhatTuLam)) : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      )}

      {day.coBanHong && (
        <p className="mt-0.5 text-[13px]" style={{ color: MAU.camDamChoChu }}>
          {CHU_DAY_DU.banHong}
        </p>
      )}

      {han && (
        <p
          data-thu="han-rieng"
          data-den-han={han.denHan ? "1" : "0"}
          className="mt-0.5 text-[13px]"
          style={{ color: han.denHan ? MAU.camDamChoChu : "#525252", fontWeight: han.denHan ? 600 : 400 }}
        >
          {CHU_TEST_LAI.theRieng
            .replace("{ngay}", han.ngayDen.split("-").reverse().join("/"))
            .replace(
              "{con}",
              han.conNgay > 0
                ? CHU_TEST_LAI.conNgay.replace("{so}", String(han.conNgay))
                : han.conNgay === 0
                  ? CHU_TEST_LAI.homNay
                  : CHU_TEST_LAI.quaHan.replace("{so}", String(-han.conNgay)),
            )}
        </p>
      )}

      <p
        data-thu="trang-thai-day-du"
        className="mt-1 text-[13px] font-semibold"
        style={{ color: day.daDu ? MAU.timCongNghe : MAU.camDamChoChu }}
      >
        {day.daDu ? `✓ ${CHU_DAY_DU.daDu}` : day.viec ? chuViecConThieu(day.viec) : ""}
      </p>
    </div>
  );
}
