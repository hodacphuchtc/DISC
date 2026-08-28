"use client";

/**
 * MÀN BẢN TỔNG HỢP CẢ NHÀ (14.4).
 *
 * Ba việc: chọn bài cho mỗi người → chạy engine → hiện N bản, mỗi bản in riêng được.
 *
 * 🔴 MỖI NGƯỜI MỘT TỜ. Bản của Bin in ra không được có một chữ nào của bản Mẹ Lan — đó là
 * cùng một luật đã chạy được ở GĐ10 với ba dải, nay áp cho N dải. Cách ẩn là đánh dấu
 * THẲNG lên DOM ngay trước `window.print()`, không đi qua state React: `window.print()`
 * chặn luồng đồng bộ nên React chưa kịp vẽ lại thì hộp thoại in đã mở với DOM cũ.
 *
 * 🔴 `dienGiai` LƯU MÃ, KHÔNG LƯU CHUỖI ĐÃ DỰNG. Chuỗi dựng sẵn đóng băng cả một phiên bản
 * nội dung vào kho: sửa một câu ở `config/` thì bản cũ vẫn đọc câu cũ, và sáu tháng sau
 * không ai biết vì sao hai bản của cùng một nhà lại nói khác nhau.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useState } from "react";

import {
  SO_THANH_VIEN_TOI_DA,
  laTreEm,
} from "@config/disc-gia-dinh";
import { thayDaiTuCap } from "@config/disc-lech-cap";
import {
  MO_TA_LECH,
  THOA_THUAN,
  TRUNG_KHOP,
  VIEC_CUA_TOI,
} from "@config/disc-noi-dung-cap";
import { CHU_HAN_MUC_THU_MUC, CHU_TONG_HOP, TRUC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { MaTruc } from "@modules/core/bo-de/kieu";
import type { ThanhVien } from "@modules/core/gia-dinh/kieu";
import { luuPhanTich, type BaiLamLuu } from "@modules/core/luu-tru/kho-bai";
import {
  phanTichGiaDinh,
  type BanPhanTich,
  type LatCat,
  type NguoiTrongPhanTich,
} from "@modules/report/phan-tich-gia-dinh";

/** Một người kèm những bài họ có, để người dùng chọn. */
export type NguoiCoBai = {
  readonly tv: ThanhVien;
  readonly bai: readonly BaiLamLuu[];
};

/**
 * Hồ sơ điểm của một người: ưu tiên bài được chọn, không có thì dùng hồ sơ nhận qua mã.
 * Trả `null` khi người này chưa có hồ sơ nào — họ bị loại khỏi lần phân tích này.
 */
function diemCua(
  n: NguoiCoBai,
  idBaiChon: string | undefined,
): Readonly<Record<MaTruc, number>> | null {
  const bai = n.bai.find((b) => b.id === idBaiChon) ?? n.bai[0];
  if (bai?.ketQua.hopLe) return bai.ketQua.diem;
  return n.tv.nhanQuaMa?.diem ?? null;
}

export function ManBanTongHop({
  nguoi,
  banCoSan,
  onDong,
}: {
  readonly nguoi: readonly NguoiCoBai[];
  /**
   * 🔴 MỞ LẠI MỘT LẦN CHẠY CŨ (V3.1). Có giá trị thì bỏ qua bước chọn bài và hiện thẳng
   * bản đã lưu — KHÔNG chạy lại engine. Chạy lại là dựng ra một bản khác với bản người ta
   * từng đọc (nội dung ở `config/` có thể đã sửa), rồi gọi nó là "lần chạy ngày hôm đó".
   */
  readonly banCoSan?: readonly BanPhanTich[];
  readonly onDong: () => void;
}) {
  const [chon, datChon] = useState<Record<string, string>>({});
  const [ketQua, datKetQua] = useState<readonly BanPhanTich[] | null>(banCoSan ?? null);
  const [loi, datLoi] = useState<string | null>(null);

  const coHoSo = nguoi.filter((n) => diemCua(n, chon[n.tv.id]) !== null);

  function chay() {
    const dauVao: NguoiTrongPhanTich[] = coHoSo.map((n) => ({
      id: n.tv.id,
      ten: n.tv.ten,
      laTre: laTreEm(n.tv.vaiTro, n.tv.lop),
      diem: diemCua(n, chon[n.tv.id])!,
    }));

    const k = phanTichGiaDinh(dauVao);
    if (!k.phanTichDuoc) {
      datLoi(
        k.lyDo === "CHUA_DU_HAI_NGUOI"
          ? CHU_TONG_HOP.chuaDuHaiNguoi
          : CHU_TONG_HOP.quaNhieuNguoi.replace("{so}", String(SO_THANH_VIEN_TOI_DA)),
      );
      return;
    }
    datLoi(null);
    void luuVaHien(k.ban);
  }

  /**
   * Lưu thư mục rồi hiện kết quả.
   *
   * 🔴 HIỆN KẾT QUẢ DÙ LƯU HỎNG. Người vừa chờ máy tính xong không nên mất bản của mình
   * chỉ vì kho đầy — nhưng cũng KHÔNG được để họ tưởng là đã lưu. Hiện bản, rồi nói thẳng
   * là chưa giữ lại được và chỉ chỗ dọn.
   */
  async function luuVaHien(ban: readonly BanPhanTich[]) {
    const bayGio = new Date().toISOString();
    datKetQua(ban);

    // 🔴 `dienGiai` LƯU MÃ chứ không lưu chuỗi đã dựng: chuỗi dựng sẵn đóng băng một phiên
    // bản nội dung vào kho, và sáu tháng sau không ai biết vì sao hai bản của cùng một nhà
    // lại nói khác nhau.
    const daLuu = await luuPhanTich({
      id: `pt-${bayGio}`,
      maBai: coHoSo.map((n) => chon[n.tv.id] ?? n.bai[0]?.id).filter(Boolean),
      taoLuc: bayGio,
      noiDung: ban,
    });
    if (!daLuu) datLoi(CHU_HAN_MUC_THU_MUC.hetChoLuu);
  }

  /** In riêng bản của một người: giấu mọi dải khác, in, rồi trả lại nguyên trạng. */
  function inBan(toiId: string) {
    const dai = Array.from(document.querySelectorAll<HTMLElement>("[data-ban]"));
    const daGiau = dai.filter((d) => d.getAttribute("data-ban") !== `tv-${toiId}`);
    for (const d of daGiau) d.setAttribute("data-an-khi-in", "1");

    const donDep = () => {
      for (const d of daGiau) d.removeAttribute("data-an-khi-in");
      window.removeEventListener("afterprint", donDep);
    };
    window.addEventListener("afterprint", donDep);

    try {
      window.print();
    } finally {
      // Trình duyệt không bắn afterprint (hoặc test chạy dưới jsdom) thì vẫn phải trả lại.
      donDep();
    }
  }

  if (ketQua) {
    return (
      <section className="max-w-3xl px-5 py-8 md:px-12 md:py-12">
        <button
          type="button"
          data-khong-in
          onClick={onDong}
          className="inline-flex min-h-[44px] items-center text-[13px] text-neutral-600 underline underline-offset-4"
        >
          ← {CHU_TONG_HOP.nutDong}
        </button>

        <div data-khong-in className="mt-4 flex flex-wrap gap-2">
          <span className="self-center text-[13px] text-neutral-600">
            {CHU_TONG_HOP.nhomNutIn}:
          </span>
          {ketQua.map((b) => (
            <button
              key={b.toiId}
              type="button"
              onClick={() => inBan(b.toiId)}
              className="min-h-[44px] rounded-xl border px-3.5 text-[14px] font-semibold"
              style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
            >
              {CHU_TONG_HOP.nutInBan.replace("{ten}", b.tenLuc)}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-10">
          {ketQua.map((b) => (
            <MotBan key={b.toiId} ban={b} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl px-5 py-8 md:px-12 md:py-12">
      <button
        type="button"
        onClick={onDong}
        className="inline-flex min-h-[44px] items-center text-[13px] text-neutral-600 underline underline-offset-4"
      >
        ← {CHU_TONG_HOP.nutDong}
      </button>

      <h1 className="mt-4 text-[22px] font-bold text-neutral-900">{CHU_TONG_HOP.tieuDeChon}</h1>
      <p className="mt-1.5 text-[14px] text-neutral-600">{CHU_TONG_HOP.moTaChon}</p>

      <ul className="mt-6 space-y-3">
        {nguoi.map((n) => (
          <li
            key={n.tv.id}
            data-thu="dong-chon-bai"
            className="flex flex-wrap items-center gap-3 rounded-xl border p-3.5"
            style={{ borderColor: MAU.vienMo }}
          >
            <span className="font-semibold text-neutral-900">{n.tv.ten}</span>
            {n.bai.length > 0 ? (
              <select
                aria-label={`Chọn bài cho ${n.tv.ten}`}
                value={chon[n.tv.id] ?? n.bai[0].id}
                onChange={(e) => datChon((c) => ({ ...c, [n.tv.id]: e.target.value }))}
                className="ml-auto rounded-lg border px-2 py-1.5 text-[14px]"
                style={{ borderColor: MAU.vienMo }}
              >
                {n.bai.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.boDe} · {b.ketThuc.slice(0, 10)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="ml-auto text-[13px] text-neutral-500">
                {n.tv.nhanQuaMa ? "Hồ sơ nhận qua mã mời" : "Chưa có hồ sơ"}
              </span>
            )}
          </li>
        ))}
      </ul>

      {loi && (
        <p role="alert" className="mt-4 text-[14px] leading-relaxed" style={{ color: MAU.camDamChoChu }}>
          {loi}
        </p>
      )}

      <button
        type="button"
        onClick={chay}
        className="mt-6 min-h-[48px] rounded-xl px-6 text-[16px] font-semibold text-white"
        style={{ backgroundColor: MAU.timCongNghe }}
      >
        {CHU_TONG_HOP.nutChay}
      </button>
    </section>
  );
}

/* ── Một bản: mọi lát cắt của MỘT người đọc ──────────────────────────────── */

function MotBan({ ban }: { readonly ban: BanPhanTich }) {
  return (
    <section data-ban={`tv-${ban.toiId}`} data-thu="ban-tong-hop" className="space-y-4">
      <h2
        className="border-b pb-2 text-[20px] leading-snug font-bold"
        style={{ color: MAU.timCongNghe, borderColor: MAU.vienMo }}
      >
        {CHU_TONG_HOP.tieuDeBan.replace("{ten}", ban.tenLuc)}
      </h2>
      {ban.latCat.map((l) => (
        <MotLatCat key={l.nguoiKiaId} ten={ban.tenLuc} lat={l} />
      ))}
    </section>
  );
}

function MotLatCat({ ten, lat }: { readonly ten: string; readonly lat: LatCat }) {
  const thay = (chu: string) => thayDaiTuCap(chu, lat.theQuyen, lat.tenNguoiKia);

  return (
    <article data-thu="lat-cat" data-nguoi-kia={lat.nguoiKiaId} className="rounded-2xl border p-4 md:p-5" style={{ borderColor: MAU.vienMo }}>
      <h3 className="text-[15px] font-semibold text-neutral-900">
        {CHU_TONG_HOP.nhanLatCat.replace("{ten}", ten).replace("{nguoiKia}", lat.tenNguoiKia)}
      </h3>

      {lat.trucLech.length > 0
        ? lat.trucLech.map((t) => (
            <div key={t.truc} className="mt-4">
              <h4 className="flex items-baseline gap-2 text-[14px] font-semibold text-neutral-800">
                <span aria-hidden="true" style={{ color: TRUC[t.truc].mau }}>
                  ■
                </span>
                {TRUC[t.truc].ten}
              </h4>
              <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-800">
                {thay(MO_TA_LECH[t.truc][t.huong].veToi)}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-800">
                {thay(MO_TA_LECH[t.truc][t.huong].veNguoiKia)}
              </p>
              <p className="mt-3 rounded-lg px-3.5 py-3 text-[15px] leading-relaxed text-neutral-900" style={{ backgroundColor: "#FFF4E6" }}>
                <strong className="font-semibold">
                  {CHU_TONG_HOP.nhanViecCuaToi.replace("{ten}", ten)}:{" "}
                </strong>
                {thay(VIEC_CUA_TOI[t.truc][t.huong][lat.theQuyen])}
              </p>
              <p className="mt-2.5 text-[15px] leading-relaxed text-neutral-700">
                <strong className="font-semibold">{CHU_TONG_HOP.nhanThoaThuan}: </strong>
                {thay(THOA_THUAN[t.truc][t.huong])}
              </p>
            </div>
          ))
        : lat.trungKhop && (
            <div className="mt-4">
              <h4 className="text-[14px] font-semibold text-neutral-800">
                {CHU_TONG_HOP.nhanTrungKhop}
              </h4>
              <ul className="mt-2 space-y-1.5">
                {lat.trungKhop.map((tk) => (
                  <li key={tk.truc} className="text-[15px] leading-relaxed text-neutral-800">
                    <span aria-hidden="true" className="mr-1.5" style={{ color: TRUC[tk.truc].mau }}>
                      ■
                    </span>
                    {TRUNG_KHOP[tk.truc][tk.kieu]}
                  </li>
                ))}
              </ul>
            </div>
          )}
    </article>
  );
}
