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

import { NutQuayLai } from "@/app/components/nut-quay-lai";
import { Suspense, lazy, useState } from "react";

import {
  SO_THANH_VIEN_TOI_DA,
  laTreEm,
} from "@config/disc-gia-dinh";
import { MO_NOI_DUNG_DOI, MO_NOI_DUNG_TRE } from "@config/disc-nguong";
import { KhoiGap } from "@/app/components/khoi-gap";
import { banUuTien, nhanCuaBan } from "@modules/report/chon-ban";
import { loaiCuaBoDe } from "@modules/core/gia-dinh/han-muc";
import { thayDaiTuCap } from "@config/disc-lech-cap";
import {
  MO_TA_LECH,
  THOA_THUAN,
  TRUNG_KHOP,
  VIEC_CUA_TOI,
} from "@config/disc-noi-dung-cap";
import { KHUNG } from "@config/bo-cuc";
import { CHU_DAY_DU, CHU_HAN_MUC_THU_MUC, CHU_TONG_HOP, TRUC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { MaTruc } from "@modules/core/bo-de/kieu";
import type { ThanhVien } from "@modules/core/gia-dinh/kieu";
import { luuPhanTich, type BaiLamLuu } from "@modules/core/luu-tru/kho-bai";
import { hienNgayGio } from "@modules/core/tien-ich/ngay";
import {
  phanTichGiaDinh,
  type BanPhanTich,
  type LatCat,
  type NguoiTrongPhanTich,
} from "@modules/report/phan-tich-gia-dinh";

/** Một người kèm những bài họ có, để người dùng chọn. */
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
  // 28.3 — mặc định là bản HỢP LỆ mới nhất (ưu tiên góc nhìn tự làm). Bản mới nhất mà hỏng
  // không còn đẩy cả người ấy ra khỏi phân tích khi bên dưới còn một bản dùng được.
  const bai = n.bai.find((b) => b.id === idBaiChon) ?? banUuTien(n.bai);
  if (bai?.ketQua.hopLe) return bai.ketQua.diem;
  return n.tv.nhanQuaMa?.diem ?? null;
}

/** Mã bài thật sự được dùng cho một người — một nơi duy nhất, để ô chọn và bản lưu không lệch. */
function idBaiDung(n: NguoiCoBai, idBaiChon: string | undefined): string | undefined {
  return (n.bai.find((b) => b.id === idBaiChon) ?? banUuTien(n.bai))?.id ?? n.bai[0]?.id;
}

export function ManBanTongHop({
  nguoi,
  banCoSan,
  khoiThieu,
  chuaDuBan,
  onDong,
}: {
  readonly nguoi: readonly NguoiCoBai[];
  /**
   * 🔴 MỞ LẠI MỘT LẦN CHẠY CŨ (V3.1). Có giá trị thì bỏ qua bước chọn bài và hiện thẳng
   * bản đã lưu — KHÔNG chạy lại engine. Chạy lại là dựng ra một bản khác với bản người ta
   * từng đọc (nội dung ở `config/` có thể đã sửa), rồi gọi nó là "lần chạy ngày hôm đó".
   */
  readonly banCoSan?: readonly BanPhanTich[];
  /** Id những người CHƯA ĐỦ BẢN (28.4): lát cắt có họ được gắn nhãn "có thể thay đổi khi làm thêm". */
  readonly chuaDuBan?: ReadonlySet<string>;
  /** Khối *còn thiếu ai* — vẽ trên ĐẦU bản, đúng lúc người ta vừa thấy bản này hay. */
  readonly khoiThieu?: React.ReactNode;
  readonly onDong: () => void;
}) {
  const [chon, datChon] = useState<Record<string, string>>({});
  const [ketQua, datKetQua] = useState<readonly BanPhanTich[] | null>(banCoSan ?? null);
  const [loi, datLoi] = useState<string | null>(null);

  /**
   * 🔴 CỜ TẮT NỘI DUNG TRẺ (V4.1) LOẠI TRẺ KHỎI PHÂN TÍCH.
   *
   * Không đủ nếu chỉ chặn ở màn làm bài: bản phân tích cả nhà VIẾT VỀ từng người, và một
   * lát cắt "Mẹ Lan ↔ bé Na" là nội dung nói về bé Na dù bé chưa làm bài hôm nay — bé có
   * thể có bài từ trước khi tắt cờ. Lọc ở ĐÂY mới là lọc đúng chỗ nội dung sinh ra.
   */
  const coHoSo = nguoi.filter(
    (n) =>
      diemCua(n, chon[n.tv.id]) !== null &&
      (MO_NOI_DUNG_TRE || !laTreEm(n.tv.vaiTro, n.tv.lop)),
  );

  function chay() {
    const dauVao: NguoiTrongPhanTich[] = coHoSo.map((n) => ({
      id: n.tv.id,
      ten: n.tv.ten,
      laTre: laTreEm(n.tv.vaiTro, n.tv.lop),
      vaiTro: n.tv.vaiTro,
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
      maBai: coHoSo
        .map((n) => idBaiDung(n, chon[n.tv.id]))
        .filter((x): x is string => Boolean(x)),
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
      <section className={`${KHUNG.trang} ${KHUNG.dem}`}>
        <NutQuayLai nhan={CHU_TONG_HOP.nutDong} onBam={onDong} />

        {/* 🔴 KHỐI "CÒN THIẾU AI" ĐẶT NGAY TRÊN ĐẦU BẢN, và `data-khong-in` để nó KHÔNG
            đi vào bản in. Trên màn hình nó là lời mời đúng lúc — người ta vừa đọc xong
            bản của mình và thấy nó hay. Trên giấy nó chỉ là một lời chào hàng lạc chỗ. */}
        {khoiThieu && (
          <div data-khong-in className="mt-5">
            {khoiThieu}
          </div>
        )}

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

        {/* 🔴 HAI CỘT TỪ MỐC `lg` — đây là màn chữ nhiều nhất sản phẩm, cũng là chỗ
            đỡ cuộn được nhiều nhất. Mỗi cột vẫn giữ KHUNG ĐỌC bên trong `MotBan`, nên
            nới bố cục KHÔNG kéo dài dòng chữ ra.
            🔴 Luật IN TÁCH BẢN không vỡ: `[data-ban][data-an-khi-in] { display: none }`
            ở `globals.css` có độ đặc hiệu 0-2-0 và `display` thắng mọi bố cục grid —
            một ô grid bị `display:none` thì biến mất khỏi luồng, không để lại ô trống. */}
        <div className={`mt-8 ${KHUNG.haiCot}`}>
          {ketQua.map((b) => (
            <MotBan key={b.toiId} ban={b} chuaDuBan={chuaDuBan} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl px-5 py-8 md:px-12 md:py-12">
      <NutQuayLai nhan={CHU_TONG_HOP.nutDong} onBam={onDong} />

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
                value={idBaiDung(n, chon[n.tv.id]) ?? n.bai[0].id}
                onChange={(e) => datChon((c) => ({ ...c, [n.tv.id]: e.target.value }))}
                className="ml-auto rounded-lg border px-2 py-1.5 text-[14px]"
                style={{ borderColor: MAU.vienMo }}
              >
                {n.bai.map((b) => (
                  /* 🔴 CÓ GIỜ, KHÔNG CHỈ NGÀY (16.3). Hai bài cùng một ngày trước đây hiện
                     lên HAI DÒNG GIỐNG HỆT NHAU — và người dùng kết luận là ô chọn đang
                     chọn sai bài, trong khi nó chọn đúng. Thứ hỏng là cái NHÃN.
                     Tên người đã là nhãn của cả dòng nên không lặp lại ở đây. */
                  <option key={b.id} value={b.id}>
                    {loaiCuaBoDe(b.boDe) === "quan-sat"
                      ? CHU_TONG_HOP.loaiQuanSatNgan
                      : CHU_TONG_HOP.loaiTuLamNgan}{" "}
                    · {b.boDe} · {hienNgayGio(b.ketThuc)} (
                    {CHU_TONG_HOP[
                      ({
                        "moi-nhat": "nhanMoiNhat",
                        "ban-cu": "nhanBanCu",
                        "khong-dung-duoc": "nhanKhongDung",
                      } as const)[nhanCuaBan(n.bai, b)]
                    ]}
                    )
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
        className="mt-6 min-h-[48px] rounded-xl px-6 text-[16px] font-semibold text-white shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
        style={{ backgroundColor: MAU.timCongNghe }}
      >
        {CHU_TONG_HOP.nutChay}
      </button>
    </section>
  );
}

/* ── Một bản: mọi lát cắt của MỘT người đọc ──────────────────────────────── */

/**
 * 🔴 GỌN TRƯỚC, CHI TIẾT SAU. Mỗi người là MỘT hàng gập "Lời khuyên dành cho {tên}" (mảng
 * nhấn tối) kèm một dòng tóm tắt; bấm mới xổ ra các cặp, và mỗi cặp lại là một hàng gập có
 * tóm tắt riêng. Bản in mở hết (`[data-lop-sau]`), nên nội dung luôn nằm trong DOM.
 */
function MotBan({
  ban,
  chuaDuBan,
}: {
  readonly ban: BanPhanTich;
  readonly chuaDuBan?: ReadonlySet<string>;
}) {
  const dsNguoiKia = ban.latCat.map((l) => l.tenNguoiKia).join(", ");
  return (
    <section data-ban={`tv-${ban.toiId}`} data-thu="ban-tong-hop" className={KHUNG.doc}>
      <KhoiGap
        capTieuDe={2}
        kieu="toi"
        tieuDe={CHU_TONG_HOP.tieuDeBan.replace("{ten}", ban.tenLuc)}
        tomTat={CHU_TONG_HOP.tomTatBan.replace("{ds}", dsNguoiKia)}
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
  const coKeHoach = MO_NOI_DUNG_DOI && Boolean(lat.moiQuanHe);

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
                {MO_NOI_DUNG_DOI && lat.moiQuanHe && (
                  <Suspense fallback={null}>
                    <TinhHuongHangNgay
                      truc={t.truc}
                      huong={t.huong}
                      moiQuanHe={lat.moiQuanHe}
                      tenToi={ten}
                      tenNguoiKia={lat.tenNguoiKia}
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
        {coKeHoach && lat.moiQuanHe && (
          <Suspense fallback={null}>
            <KeHoachBayNgay moiQuanHe={lat.moiQuanHe} tenToi={ten} tenNguoiKia={lat.tenNguoiKia} />
          </Suspense>
        )}
      </KhoiGap>
    </article>
  );
}
