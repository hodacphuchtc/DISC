"use client";

/**
 * MÀN "BIN HỒI ĐÓ VÀ BÂY GIỜ" (13.2).
 *
 * 🔴 KHÔNG có mũi tên lên/xuống màu xanh đỏ, KHÔNG có phần trăm thay đổi, KHÔNG có huy
 * hiệu. Mọi thứ đó đều nói cùng một điều: có một chiều tốt hơn để đi tới. DISC không có
 * chiều đó, nên giao diện cũng không được gợi ý là có.
 *
 * Thứ được phép: hai con số đặt cạnh nhau, và một câu hỏi.
 */

import { CHU_SO_SANH, TRUC } from "@config/disc-tu-dien";
import { NGAY_TOI_THIEU_DE_SO_SANH } from "@config/disc-nguong";
import { MAU } from "@config/thuong-hieu";
import { hienNgay } from "@modules/core/tien-ich/ngay";
import type { KetQuaSoSanh } from "@modules/report/so-sanh-thoi-gian";

export function KhoiSoSanh({
  ten,
  ketQua,
}: {
  readonly ten: string;
  readonly ketQua: KetQuaSoSanh;
}) {
  if (!ketQua.soSanhDuoc) {
    return (
      <p data-thu="chua-so-sanh" className="text-[14px] leading-relaxed text-neutral-600">
        {ketQua.lyDo.ma === "THIEU_BAI"
          ? CHU_SO_SANH.chuaDuBai
          : CHU_SO_SANH.quaGan
              .replace("{so}", String(ketQua.lyDo.soNgay))
              .replace("{toiThieu}", String(NGAY_TOI_THIEU_DE_SO_SANH))}
      </p>
    );
  }

  const { bang, trucDoiRo, baiTruoc, soNgay } = ketQua;

  return (
    <section data-thu="khoi-so-sanh">
      <h2 className="text-[18px] font-bold text-neutral-900">
        {CHU_SO_SANH.tieuDe.replace("{ten}", ten)}
      </h2>
      <p className="mt-1 text-[13px] text-neutral-500">
        {CHU_SO_SANH.cachNhau.replace("{so}", String(soNgay))}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-neutral-800">
        {CHU_SO_SANH.moDau.replace("{ten}", ten)}
      </p>

      <table className="mt-5 w-full max-w-md text-[15px]">
        <thead>
          <tr className="text-left text-[13px] text-neutral-600">
            <th scope="col" className="pb-1.5 font-medium">
              &nbsp;
            </th>
            <th scope="col" className="pb-1.5 font-medium">
              {CHU_SO_SANH.nhanTruoc.replace("{ngay}", hienNgay(baiTruoc.ketThuc))}
            </th>
            <th scope="col" className="pb-1.5 font-medium">
              {CHU_SO_SANH.nhanSau}
            </th>
          </tr>
        </thead>
        <tbody>
          {bang.map((d) => (
            <tr key={d.truc} data-thu="hang-truc" data-truc={d.truc}>
              <th scope="row" className="py-1.5 pr-3 text-left font-medium text-neutral-800">
                <span aria-hidden="true" className="mr-1.5" style={{ color: TRUC[d.truc].mau }}>
                  ■
                </span>
                {TRUC[d.truc].ten}
              </th>
              <td className="py-1.5 tabular-nums text-neutral-600">{d.diemTruoc}</td>
              <td className="py-1.5 tabular-nums text-neutral-900">{d.diemSau}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div data-thu="dien-giai-so-sanh" className="mt-5 space-y-2.5">
        {trucDoiRo.length === 0 ? (
          <p className="text-[15px] leading-relaxed text-neutral-800">{CHU_SO_SANH.khongDoi}</p>
        ) : (
          trucDoiRo.map((t) => {
            const d = bang.find((x) => x.truc === t)!;
            return (
              <p
                key={t}
                className="rounded-lg px-3.5 py-3 text-[15px] leading-relaxed text-neutral-900"
                style={{ backgroundColor: MAU.timRatNhat }}
              >
                {CHU_SO_SANH.coDoi
                  .replace("{truc}", TRUC[t].ten)
                  .replace("{huong}", d.lech > 0 ? CHU_SO_SANH.huongLen : CHU_SO_SANH.huongXuong)}
              </p>
            );
          })
        )}
      </div>
    </section>
  );
}
