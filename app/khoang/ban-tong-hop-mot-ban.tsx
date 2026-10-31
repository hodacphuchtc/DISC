"use client";

/**
 * MỘT BẢN CỦA MỘT NGƯỜI ĐỌC + TỪNG LÁT CẮT (tách khỏi `ban-tong-hop.tsx` ở 29.8 để giữ luật
 * "không file > 500 dòng"). Mỗi người là một hàng gập "Lời khuyên dành cho {tên}"; mỗi cặp lại
 * là một hàng gập có tóm tắt riêng — kèm MỘT việc "Hôm nay thử" nổi ngay ở dòng tóm tắt.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { Suspense, lazy } from "react";

import { KhoiGap } from "@/app/components/khoi-gap";
import { KHUNG } from "@config/bo-cuc";
import { thayDaiTuCap } from "@config/disc-lech-cap";
import { MO_NOI_DUNG_DOI } from "@config/disc-nguong";
import { MO_TA_LECH, THOA_THUAN, TRUNG_KHOP, VIEC_CUA_TOI } from "@config/disc-noi-dung-cap";
import { CHU_DAY_DU, CHU_TONG_HOP, TRUC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { BanPhanTich, LatCat } from "@modules/report/phan-tich-gia-dinh";

/**
 * 27.5 — nội dung theo mối quan hệ NẠP LƯỜI. `config/disc-noi-dung-doi.ts` (~16 tình huống + 14
 * ngày thử) từng nằm trong gói nạp ngay và đẩy nó lên đúng trần 300 KB gzip. Mỗi lát cắt vẫn
 * gắn nó vào DOM ngay khi mount (hàng gập chỉ ẩn bằng CSS) nên bản in có đủ.
 */
const TinhHuongHangNgay = lazy(() =>
  import("@/app/components/noi-dung-doi").then((m) => ({ default: m.TinhHuongHangNgay })),
);
const KeHoachBayNgay = lazy(() =>
  import("@/app/components/noi-dung-doi").then((m) => ({ default: m.KeHoachBayNgay })),
);
const CungNhipHangNgay = lazy(() =>
  import("@/app/components/noi-dung-doi").then((m) => ({ default: m.CungNhipHangNgay })),
);

/* ── Một bản: mọi lát cắt của MỘT người đọc ──────────────────────────────── */

/**
 * 🔴 GỌN TRƯỚC, CHI TIẾT SAU. Mỗi người là MỘT hàng gập "Lời khuyên dành cho {tên}" (mảng
 * nhấn tối) kèm một dòng tóm tắt; bấm mới xổ ra các cặp, và mỗi cặp lại là một hàng gập có
 * tóm tắt riêng. Bản in mở hết (`[data-lop-sau]`), nên nội dung luôn nằm trong DOM.
 */
/**
 * "HÔM NAY THỬ" (29.8) — MỘT việc cụ thể nổi lên đầu, không cần bấm mới biết làm gì.
 *
 * Chọn từ chỗ lệch LỚN NHẤT của người này (trục lệch đầu của lát cắt có |lệch| lớn nhất), lấy đúng
 * "việc của tôi" đã có sẵn cho trục và thế quyền đó — không thêm nội dung mới nào cần ký duyệt.
 */
function viecHomNay(ban: BanPhanTich): { readonly nguoiKia: string; readonly chu: string } | null {
  let tot: { lat: LatCat; t: BanPhanTich["latCat"][number]["trucLech"][number] } | null = null;
  for (const lat of ban.latCat) {
    const t = lat.trucLech[0];
    if (t && (!tot || Math.abs(t.lech) > Math.abs(tot.t.lech))) tot = { lat, t };
  }
  if (!tot) return null;
  const { lat, t } = tot;
  return {
    nguoiKia: lat.tenNguoiKia,
    chu: thayDaiTuCap(VIEC_CUA_TOI[t.truc][t.huong][lat.theQuyen], lat.theQuyen, lat.tenNguoiKia),
  };
}

export function MotBan({
  ban,
  chuaDuBan,
}: {
  readonly ban: BanPhanTich;
  readonly chuaDuBan?: ReadonlySet<string>;
}) {
  const dsNguoiKia = ban.latCat.map((l) => l.tenNguoiKia).join(", ");
  const viec = viecHomNay(ban);
  return (
    <section data-ban={`tv-${ban.toiId}`} data-thu="ban-tong-hop" className={`scroll-mt-20 ${KHUNG.doc}`}>
      <KhoiGap
        capTieuDe={2}
        kieu="toi"
        tieuDe={CHU_TONG_HOP.tieuDeBan.replace("{ten}", ban.tenLuc)}
        tomTat={
          <>
            {CHU_TONG_HOP.tomTatBan.replace("{ds}", dsNguoiKia)}
            {viec && (
              <span
                data-thu="hom-nay-thu"
                className="mt-2 block rounded-lg bg-white/10 px-3 py-2 text-[16px] leading-snug text-chu-tren-toi"
              >
                <strong className="font-bold">
                  {CHU_TONG_HOP.homNayThuVoi.replace("{nguoiKia}", viec.nguoiKia)}:
                </strong>{" "}
                {viec.chu}
              </span>
            )}
          </>
        }
      >
        <div className="space-y-3">
          {ban.latCat.map((l) => (
            <MotLatCat
              key={l.nguoiKiaId}
              ten={ban.tenLuc}
              lat={l}
              chuaDu={Boolean(chuaDuBan?.has(l.toiId) || chuaDuBan?.has(l.nguoiKiaId))}
            />
          ))}
        </div>
      </KhoiGap>
    </section>
  );
}

function MotLatCat({
  ten,
  lat,
  chuaDu = false,
}: {
  readonly ten: string;
  readonly lat: LatCat;
  /** Một trong hai người chưa đủ bản ⇒ nói thẳng kết quả cặp này có thể đổi khi làm thêm. */
  readonly chuaDu?: boolean;
}) {
  const thay = (chu: string) => thayDaiTuCap(chu, lat.theQuyen, lat.tenNguoiKia);
  // 29.6 — nội dung sâu cho MỌI cặp. Bản đã lưu từ phiên bản cũ không có `moiQuanHe` ⇒ rơi về
  // nội dung chung như trước.
  const moiQuanHe = MO_NOI_DUNG_DOI ? lat.moiQuanHe : undefined;
  const coKeHoach = Boolean(moiQuanHe);
  const ngucanh = {
    tenToi: ten,
    tenNguoiKia: lat.tenNguoiKia,
    ...(lat.bacTre ? { bacTre: lat.bacTre } : {}),
    ...(lat.vaiNguoiKia ? { vaiNguoiKia: lat.vaiNguoiKia } : {}),
  };

  const tomTat =
    lat.trucLech.length > 0
      ? CHU_TONG_HOP.tomTatLechRo.replace("{ds}", lat.trucLech.map((t) => TRUC[t.truc].ten).join(", "))
      : CHU_TONG_HOP.tomTatCungNhip;

  return (
    <article data-thu="lat-cat" data-nguoi-kia={lat.nguoiKiaId}>
      <KhoiGap
        tieuDe={CHU_TONG_HOP.nhanLatCat.replace("{ten}", ten).replace("{nguoiKia}", lat.tenNguoiKia)}
        tomTat={
          <>
            {tomTat}
            {lat.trucLech[0] && (
              <span data-thu="hom-nay-thu-cap" className="mt-1.5 block text-[16px] leading-snug text-neutral-900">
                <strong className="font-bold">{CHU_TONG_HOP.homNayThu}: </strong>
                {thay(VIEC_CUA_TOI[lat.trucLech[0].truc][lat.trucLech[0].huong][lat.theQuyen])}
              </span>
            )}
            {coKeHoach && ` · ${CHU_TONG_HOP.tomTatCoBayNgay}`}
            {chuaDu && (
              <span data-thu="chua-du-ban" className="block font-semibold" style={{ color: MAU.camDamChoChu }}>
                {CHU_DAY_DU.chuaDuBan}
              </span>
            )}
          </>
        }
      >
        {lat.trucLech.length > 0
          ? lat.trucLech.map((t) => (
              <div key={t.truc} className="mt-4 first:mt-0">
                <h4 className="flex items-baseline gap-2 text-[14px] font-semibold text-neutral-800">
                  <span aria-hidden="true" style={{ color: TRUC[t.truc].mau }}>
                    ■
                  </span>
                  {TRUC[t.truc].ten}
                </h4>
                <p className="mt-1.5 text-[16px] leading-relaxed text-neutral-800">
                  {thay(MO_TA_LECH[t.truc][t.huong].veToi)}
                </p>
                <p className="mt-1.5 text-[16px] leading-relaxed text-neutral-800">
                  {thay(MO_TA_LECH[t.truc][t.huong].veNguoiKia)}
                </p>
                <p className="mt-3 rounded-lg px-3.5 py-3 text-[16px] leading-relaxed text-neutral-900" style={{ backgroundColor: "#FFF4E6" }}>
                  <strong className="font-semibold">
                    {CHU_TONG_HOP.nhanViecCuaToi.replace("{ten}", ten)}:{" "}
                  </strong>
                  {thay(VIEC_CUA_TOI[t.truc][t.huong][lat.theQuyen])}
                </p>
                <p className="mt-2.5 text-[16px] leading-relaxed text-neutral-700">
                  <strong className="font-semibold">{CHU_TONG_HOP.nhanThoaThuan}: </strong>
                  {thay(THOA_THUAN[t.truc][t.huong])}
                </p>
                {moiQuanHe && (
                  <Suspense fallback={null}>
                    <TinhHuongHangNgay
                      truc={t.truc}
                      huong={t.huong}
                      moiQuanHe={moiQuanHe}
                      {...ngucanh}
                    />
                  </Suspense>
                )}
              </div>
            ))
          : lat.trungKhop && (
              <div>
                <h4 className="text-[14px] font-semibold text-neutral-800">
                  {CHU_TONG_HOP.nhanTrungKhop}
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {lat.trungKhop.map((tk) => (
                    <li key={tk.truc} className="text-[16px] leading-relaxed text-neutral-800">
                      <span aria-hidden="true" className="mr-1.5" style={{ color: TRUC[tk.truc].mau }}>
                        ■
                      </span>
                      {TRUNG_KHOP[tk.truc][tk.kieu]}
                    </li>
                  ))}
                </ul>
                {moiQuanHe && (
                  <Suspense fallback={null}>
                    <CungNhipHangNgay
                      ds={lat.trungKhop}
                      moiQuanHe={moiQuanHe}
                      {...ngucanh}
                    />
                  </Suspense>
                )}
              </div>
            )}
        {moiQuanHe && (
          <Suspense fallback={null}>
            <KeHoachBayNgay moiQuanHe={moiQuanHe} {...ngucanh} />
          </Suspense>
        )}
      </KhoiGap>
    </article>
  );
}
