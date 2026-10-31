"use client";

import { useCallback, useEffect, useState } from "react";

import { danhSachHanTestLai } from "@/app/dau-vao-day-du";
import { useKhoDoi } from "@/app/dung-kho-doi";
import { CHU_TEST_LAI } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { taiXuongVanBan } from "@modules/core/luu-tru/tai-ve";
import { docTatCa, docThanhVien } from "@modules/core/luu-tru/kho-bai";
import { hanCaNha, type HanCaNha } from "@modules/report/han-test-lai";
import { taoLichNhac, tenTepLich } from "@modules/report/lich-nhac";

/** `yyyy-mm-dd` → `dd/mm/yyyy`. */
const hienNgayDen = (s: string) => s.split("-").reverse().join("/");

function chuConNgay(conNgay: number): string {
  if (conNgay > 0) return CHU_TEST_LAI.conNgay.replace("{so}", String(conNgay));
  if (conNgay === 0) return CHU_TEST_LAI.homNay;
  return CHU_TEST_LAI.quaHan.replace("{so}", String(-conNgay));
}

/**
 * KHUNG NHẮC TEST LẠI MỖI 6 THÁNG (28.6) — to, rõ, đặt ở chỗ ai cũng nhìn thấy.
 *
 * Chủ dự án: lời nhắc này là điều QUAN TRỌNG khiến gia đình quay lại, nên không thể là một
 * dòng chữ xám nhỏ. Hiện ngày cụ thể (tính từ bản hợp lệ gần nhất của từng người, lấy hạn
 * sớm nhất), đổi sang màu cam khi đến hạn, kèm nút thêm vào lịch điện thoại.
 *
 * Không có máy chủ để gửi thông báo, nên tệp lịch .ics là cách duy nhất để điện thoại TỰ nhắc
 * mà không cần mở app. Tệp không chứa tên ai.
 *
 * Không in (`data-khong-in`): đây là lời nhắc cho người đang cầm máy, không phải nội dung báo cáo.
 */
export function KhungTestLai({ han }: { readonly han: HanCaNha | null }) {
  const [thongBao, datThongBao] = useState<string | null>(null);
  const denHan = Boolean(han && han.nguoiDenHan.length > 0);

  function taiLich() {
    if (!han) return;
    const ok = taiXuongVanBan(
      taoLichNhac(han.som.ngayDen, new Date()),
      tenTepLich(han.som.ngayDen),
      "text/calendar",
    );
    datThongBao(ok ? CHU_TEST_LAI.daTaiLich : CHU_TEST_LAI.loiTaiLich);
  }

  return (
    <aside
      data-khong-in
      data-thu="khung-test-lai"
      data-den-han={denHan ? "1" : "0"}
      aria-label={CHU_TEST_LAI.tieuDe}
      className="rounded-2xl border-l-[6px] px-4 py-4 md:px-5"
      style={{
        borderColor: denHan ? MAU.camNangLuong : MAU.timCongNghe,
        backgroundColor: denHan ? "#FFF4E6" : MAU.timRatNhat,
      }}
    >
      <p
        className="text-[18px] leading-snug font-extrabold md:text-[20px]"
        style={{ color: denHan ? MAU.camDamChoChu : MAU.timCongNghe }}
      >
        {denHan ? CHU_TEST_LAI.denHan : CHU_TEST_LAI.tieuDe}
      </p>

      {han ? (
        <p data-thu="han-test-lai" className="mt-1 text-[16px] font-semibold text-neutral-900">
          {CHU_TEST_LAI.lanToi.replace("{ngay}", hienNgayDen(han.som.ngayDen))} (
          {chuConNgay(han.som.conNgay)})
          {denHan && (
            <span className="block text-[14px] font-medium" style={{ color: MAU.camDamChoChu }}>
              {CHU_TEST_LAI.nguoiDenHan.replace("{ds}", han.nguoiDenHan.map((h) => h.ten).join(", "))}
            </span>
          )}
        </p>
      ) : (
        <p className="mt-1 text-[14px] text-neutral-700">{CHU_TEST_LAI.chuaCoHan}</p>
      )}

      <p className="mt-1.5 max-w-prose text-[14px] leading-relaxed text-neutral-700">
        {CHU_TEST_LAI.lyDo}
      </p>

      {han && (
        <div className="mt-3">
          <button
            type="button"
            onClick={taiLich}
            className="min-h-[44px] rounded-xl border px-4 text-[15px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
          >
            {CHU_TEST_LAI.nutLich}
          </button>
          {thongBao && (
            <p role="status" className="mt-2 text-[13px] text-neutral-700">
              {thongBao}
            </p>
          )}
        </div>
      )}
    </aside>
  );
}

/** Bản tự đọc kho: dùng ở màn không sẵn danh sách (kết quả, bước 3). */
export function KhungTestLaiTuKho() {
  const [han, datHan] = useState<HanCaNha | null>(null);
  const [bayGio] = useState(() => new Date());

  const nap = useCallback(async () => {
    const [tv, bai] = await Promise.all([docThanhVien(), docTatCa()]);
    datHan(hanCaNha(danhSachHanTestLai(tv, bai), bayGio));
  }, [bayGio]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void nap();
  }, [nap]);
  useKhoDoi(nap);

  return <KhungTestLai han={han} />;
}
