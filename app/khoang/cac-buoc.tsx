"use client";

/**
 * KHUNG CÁC BƯỚC (V2.1, gộp còn hai ở 16.2) — khai người và làm bài → đọc về nhau.
 *
 * 🔴 VÌ SAO HAI CHỨ KHÔNG BA. Bước *Làm bài* cũ hiện đúng cái lưới thẻ của bước 1, chỉ
 * khác bộ nút. Người dùng vừa khai tên xong phải đóng bước 1, mở bước 2, rồi tìm lại đúng
 * người mình vừa gõ tên. Nay nút *Làm bài* nằm ngay trên thẻ vừa tạo.
 *
 * 🔴 VÌ SAO KHOÁ MỀM, KHÔNG GIẤU. Bước chưa mở được vẫn hiện ra, mờ đi kèm một câu nói rõ
 * còn thiếu gì. Giấu hẳn thì người dùng không biết phía trước còn gì — mà chính cái "phía
 * trước còn gì" mới là thứ khiến họ đi thêm một bước nữa. Đây cũng là điều ADR-007 lo khi
 * bác wizard ba bước, và là lý do bảng gia đình được GIỮ NGUYÊN bên trong bước 1.
 *
 * 🔴 SỐ LIỆU ĐỌC Ở ĐÂY CHỈ ĐỂ VẼ DÒNG TRẠNG THÁI VÀ MỞ/KHOÁ. Các bước con vẫn tự đọc kho
 * của chúng. Hai chỗ đọc cùng một kho thì phải cùng nghe kho báo (`useKhoDoi`), nếu không
 * thì xoá một người ở bước 1 xong quay lên thấy tiêu đề vẫn đếm người đó.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { KhoangDisc } from "./disc";
import { KhoangNhaMinh } from "./nha-minh";
import { KhoangPhanTich } from "./phan-tich";
import { useKhoDoi } from "@/app/dung-kho-doi";
import { MinhHoa } from "@/app/components/nhan-vat";
import { KhoiGiuDuLieu } from "@/app/components/khoi-giu-du-lieu";
import { NutQuayLai } from "@/app/components/nut-quay-lai";
import { NhacSaoLuu, daNhacSaoLuu } from "@/app/components/nhac-sao-luu";
import { KHUNG } from "@config/bo-cuc";
import { CHU_BUOC, MA_BUOC, type MaBuoc } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { docTatCa, docThanhVien } from "@modules/core/luu-tru/kho-bai";
import type { ThanhVien } from "@modules/core/gia-dinh/kieu";

/** Đủ ngần này người có bài hợp lệ thì bước 3 mở. Dưới mức đó không có gì để so. */
const TOI_THIEU_DE_PHAN_TICH = 2;

type Dem = {
  readonly soNguoi: number;
  readonly soDaLam: number;
};

export function KhoangCacBuoc() {
  const [dem, datDem] = useState<Dem | null>(null);
  const [dangMo, datDangMo] = useState<MaBuoc | null>(null);
  /**
   * Kho vừa bị THAY TRỌN từ khối giữ dữ liệu ở chân trang ⇒ dựng lại bước 1 từ đầu.
   *
   * 🔴 KHÔNG phải để nạp lại dữ liệu (bảng gia đình đã tự nghe kho qua `useKhoDoi`). Việc
   * của nó là ĐÓNG màn kết quả đang mở: trước 18.2, ba nút nằm trong `KhoangNhaMinh` vốn
   * `return` sớm khi mở màn kết quả, nên bấm *Xoá sạch* lúc đó là bất khả thi. Nay chúng ở
   * ngoài, nên có thể xoá sạch trong lúc đang đọc kết quả — và nếu không dựng lại thì người
   * dùng ngồi đọc kết quả của một bài vừa bị xoá. Cùng họ với lỗi `V3.1`.
   */
  const [lanDonKho, datLanDonKho] = useState(0);
  /** Người đang làm bài — có giá trị thì khoang DISC chiếm trọn màn, không hiện ba tấm. */
  const [dangLamCho, datDangLamCho] = useState<{
    tv: ThanhVien;
    cheDo?: "quan-sat";
  } | null>(null);
  /**
   * Có nhắc sao lưu không. Đọc localStorage trong `useEffect` — đọc lúc dựng HTML tĩnh thì
   * máy chủ không có `localStorage` và lần dựng đầu sẽ khác lần dựng lại (lệch hydration).
   */
  const [choNhac, datChoNhac] = useState(false);

  const dem2 = useCallback(async () => {
    const [tv, bai] = await Promise.all([docThanhVien(), docTatCa()]);
    // Đếm người CÓ HỒ SƠ ĐỌC ĐƯỢC: bài hợp lệ trên máy này, hoặc hồ sơ nhận qua mã mời.
    // Bài bị hàng rào HL-1 chặn thì không tính — nó không có điểm để đưa vào phân tích.
    const soDaLam = tv.filter(
      (t) =>
        bai.some((b) => b.maThanhVien === t.id && b.ketQua.hopLe) || Boolean(t.nhanQuaMa),
    ).length;
    datDem({ soNguoi: tv.length, soDaLam });

    // 🔴 Khoảnh khắc ĐẦU TIÊN gia đình có thứ đáng để mất: hai người trở lên đã làm xong.
    // Một bài lẻ thì làm lại mất tám phút; hai bài là một bức tranh không dựng lại được.
    if (soDaLam >= TOI_THIEU_DE_PHAN_TICH && !daNhacSaoLuu()) datChoNhac(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void dem2();
  }, [dem2]);

  // Bước con vừa đổi kho (thêm người, xoá người, làm xong bài) ⇒ đếm lại.
  useKhoDoi(dem2);

  /**
   * Bước nào tự mở khi vào: đủ người đã xong → bước 2; còn lại → bước 1.
   *
   * 🔴 Chỉ chọn hộ MỘT LẦN, lúc đếm xong lần đầu. Chọn lại mỗi lần số đổi thì người dùng
   * đang xem bước 1 mà vừa có ai đó làm xong bài sẽ bị bật sang bước 2 giữa chừng.
   *
   * 🔴 "MỘT LẦN" PHẢI NHỚ BẰNG `ref`, KHÔNG SUY TỪ `dangMo === null` (lỗi đã trả giá,
   * `20.1`). Bản cũ chốt chặn bằng `dangMo !== null` và để `dangMo` trong mảng phụ thuộc:
   * người dùng bấm đóng bước ⇒ `dangMo` về `null` ⇒ effect chạy lại ⇒ thấy `null` ⇒ **mở
   * lại ngay**. Chú thích thì ghi "một lần", mã thì chạy mỗi lần đóng. `null` ở đây mang
   * HAI nghĩa — *chưa chọn hộ* và *người dùng vừa đóng* — và effect không phân biệt được.
   * Cùng họ với bài học *"trạng thái chưa biết phải khác trạng thái biết rồi và bằng
   * không"* của `V2.1`.
   *
   * Xoá sạch kho thì bước 1 mở lại qua `datDangMo("nha-minh")` gọi thẳng ở khối giữ dữ
   * liệu — không nhờ effect này, nên nó không cần biết chuyện đó.
   */
  const daChonHoBuoc = useRef(false);
  useEffect(() => {
    if (!dem || daChonHoBuoc.current) return;
    daChonHoBuoc.current = true;
    datDangMo(dem.soDaLam >= TOI_THIEU_DE_PHAN_TICH ? "phan-tich" : "nha-minh");
  }, [dem]);

  // Đang làm bài thì khoang DISC chiếm trọn màn — ba tấm lùi đi, không để người ta vừa
  // trả lời câu 7 vừa nhìn thấy nút "Phân tích cả nhà" nhấp nháy bên dưới.
  if (dangLamCho) {
    return (
      <KhoangDangLamBai
        dangLamCho={dangLamCho}
        onXong={() => {
          datDangLamCho(null);
          void dem2();
        }}
      />
    );
  }

  const khoa = (ma: MaBuoc): string | null => {
    if (!dem) return null;
    // Bước 1 KHÔNG bao giờ khoá — nó là chỗ duy nhất để bắt đầu.
    if (ma === "phan-tich" && dem.soDaLam < TOI_THIEU_DE_PHAN_TICH) {
      return dem.soNguoi === 0 ? CHU_BUOC.khoaChuaCoAi : CHU_BUOC.khoaChuaDuHaiNguoi;
    }
    return null;
  };

  /**
   * Bước 1 nay gánh cả hai tin cũ: có mấy người, VÀ còn ai chưa làm. Bỏ vế thứ hai đi là
   * đánh rơi đúng thứ khiến phụ huynh đi nhắc người còn lại — thứ mà cả GĐ14 đặt cược vào.
   */
  const trangThai = (ma: MaBuoc): string => {
    if (!dem) return "…";
    if (ma === "nha-minh") {
      if (dem.soNguoi === 0) return CHU_BUOC.chuaCoAi;
      const con = dem.soNguoi - dem.soDaLam;
      const veSau =
        dem.soDaLam === 0
          ? CHU_BUOC.chuaAiLam
          : con === 0
            ? CHU_BUOC.taCaDaLam
            : CHU_BUOC.conChuaLam.replace("{so}", String(con));
      return CHU_BUOC.noiTrangThai
        .replace("{a}", CHU_BUOC.demNguoi.replace("{so}", String(dem.soNguoi)))
        .replace("{b}", veSau);
    }
    return dem.soDaLam >= TOI_THIEU_DE_PHAN_TICH
      ? CHU_BUOC.sanSangPhanTich.replace("{so}", String(dem.soDaLam))
      : CHU_BUOC.khoaChuaDuHaiNguoi;
  };

  return (
    <div data-thu="khung-buoc" className={`${KHUNG.trang} ${KHUNG.dem}`}>
      <p className="text-[11px] tracking-widest text-neutral-600 uppercase">
        {CHU_BUOC.nhanTren}
      </p>
      <h1 className="mt-2 text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900 md:text-[30px]">
        {CHU_BUOC.tieuDe}
      </h1>
      {/* 🔴 Dòng mô tả giữ KHUNG ĐỌC dù khung ngoài đã nới — nó là chữ, và chữ dài
          hết bề ngang màn 1920px thì mắt lạc dòng. Nới cái cần nới, giữ cái cần giữ. */}
      <p className={`mt-1.5 text-[15px] text-neutral-600 ${KHUNG.doc}`}>{CHU_BUOC.moTa}</p>

      {/* 🔴 NHỊP CHÚC MỪNG chỉ hiện khi MỌI người trong sổ đã xong, và nhà có ít nhất
          hai người — một nhà một người thì "cả nhà đã làm xong" là một câu nói dối nhỏ,
          và nó cũng chẳng mở được bước 2. */}
      {dem !== null && dem.soNguoi >= TOI_THIEU_DE_PHAN_TICH && dem.soDaLam === dem.soNguoi && (
        <div
          data-thu="chuc-mung"
          className="mt-5 flex items-center gap-4 rounded-2xl border px-4 py-4"
          style={{ borderColor: MAU.timCongNghe, backgroundColor: MAU.timRatNhat }}
        >
          <MinhHoa ma="chuc-mung" kichThuoc={96} />
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-bold" style={{ color: MAU.timCongNghe }}>
              {CHU_BUOC.chucMungTieuDe}
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-neutral-700">
              {CHU_BUOC.chucMungPhu}
            </p>
          </div>
        </div>
      )}

      {choNhac && (
        <div className="mt-5">
          <NhacSaoLuu hien onDong={() => datChoNhac(false)} />
        </div>
      )}

      {/* 🔴 CHƯA ĐẾM XONG THÌ CHƯA VẼ BƯỚC NÀO.
          Vẽ sớm thì có một khoảnh khắc `dem` còn `null`, và lúc đó "đang tải" trông y hệt
          "đã mở" — bước 3 hiện ra sáng trưng rồi tắt đi khi số liệu về. Người dùng thấy
          một nút nhấp nháy; test thì xanh trên máy rảnh và đỏ khi máy tải nặng. */}
      {dem === null ? (
        <p className="mt-7 text-[15px] text-neutral-500">…</p>
      ) : (
      <ol className="mt-7 space-y-3">
        {MA_BUOC.map((ma, i) => {
          const lyDoKhoa = khoa(ma);
          const mo = dangMo === ma && !lyDoKhoa;
          return (
            <li
              key={ma}
              data-thu="tam-buoc"
              data-buoc={ma}
              data-khoa={lyDoKhoa ? "1" : undefined}
              className="rounded-2xl border transition-colors duration-200 motion-reduce:transition-none"
              style={{ borderColor: mo ? MAU.timCongNghe : MAU.vienMo }}
            >
              <button
                type="button"
                disabled={Boolean(lyDoKhoa)}
                aria-expanded={mo}
                onClick={() => datDangMo(mo ? null : ma)}
                className={[
                  "flex w-full items-start gap-3.5 rounded-2xl px-4 py-4 text-left",
                  lyDoKhoa ? "cursor-not-allowed opacity-55" : "hover:bg-neutral-50",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
                  style={{ backgroundColor: lyDoKhoa ? "#B8B8C0" : MAU.timCongNghe }}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[17px] font-bold text-neutral-900">
                    {CHU_BUOC.ten[ma]}
                  </span>
                  <span className="mt-0.5 block text-[14px] text-neutral-600">
                    {CHU_BUOC.moTaBuoc[ma]}
                  </span>
                  {/* 🔴 Bước bị khoá nói CÒN THIẾU GÌ, không nói "chưa đủ điều kiện".
                      Một câu nêu đích danh việc phải làm mới dẫn được người ta đi tiếp. */}
                  <span
                    data-thu="trang-thai-buoc"
                    className="mt-1.5 block text-[13px] font-semibold"
                    style={{ color: lyDoKhoa ? MAU.camDamChoChu : MAU.timCongNghe }}
                  >
                    {lyDoKhoa ?? trangThai(ma)}
                  </span>
                </span>
              </button>

              {mo && (
                <div
                  data-thu="than-buoc"
                  /* 🔴 Hiện dần khi mở bước — và `motion-reduce` tắt hẳn. Người bật
                     *Giảm chuyển động* thường có lý do sức khoẻ (chóng mặt, tiền đình);
                     với họ một hiệu ứng "nhẹ" không nhẹ. */
                  className="animate-[hien-dan_220ms_ease-out] border-t motion-reduce:animate-none"
                  style={{ borderColor: MAU.vienMo }}
                >
                  {ma === "nha-minh" && (
                    <KhoangNhaMinh
                      key={lanDonKho}
                      onLamBai={(tv, cheDo) => datDangLamCho({ tv, ...(cheDo ? { cheDo } : {}) })}
                    />
                  )}
                  {ma === "phan-tich" && (
                    <KhoangPhanTich
                      onLamNgay={() => {
                        // 🔴 Mở BƯỚC 1, không nhảy thẳng vào bài. Thẻ mới là chỗ chọn được
                        // "em tự làm" hay "bố mẹ trả lời hộ" — nhảy thẳng là chọn hộ người
                        // dùng một trong hai, và chọn sai thì bài về sai loại.
                        datDangMo("nha-minh");
                      }}
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      )}

      {/* 🔴 BA NÚT GIỮ DỮ LIỆU NẰM NGOÀI CẢ HAI BƯỚC — và đó là cả ý đồ (18.2).
          Chúng không thuộc riêng bước *Nhà mình*: bản sao lưu gói TRỌN máy (tên từng
          người, mọi bài, mọi bản phân tích), và nút *Khôi phục* là thứ người ta đi tìm
          vào đúng ngày họ đã mất dữ liệu — ngày tệ nhất để phải mở đúng bước 1 rồi cuộn
          hết bảng gia đình mới thấy.

          🔴 ĐẶT SAU DẤU `)}` , ngoài toán tử ba ngôi. Nhét vào trong nhánh có `<ol>` là để
          ba nút biến mất lúc `dem === null` , và biến mất HẲN nếu việc đếm kho hỏng — đúng
          lúc người ta cần nút *Khôi phục* nhất. Sao lưu không được phụ thuộc dữ liệu. */}
      <KhoiGiuDuLieu onDonKho={() => datLanDonKho((n) => n + 1)} />
    </div>
  );
}

/**
 * Tách riêng vì `KhoangDisc` phải được dựng LẠI TỪ ĐẦU cho mỗi người.
 *
 * 🔴 `key` đổi theo người VÀ theo chế độ. Thiếu nó thì bấm *Làm bài* cho người thứ hai sẽ
 * rơi vào một khoang đang giữ trạng thái của người thứ nhất, và bài về nhầm chỗ.
 */
function KhoangDangLamBai({
  dangLamCho,
  onXong,
}: {
  readonly dangLamCho: { tv: ThanhVien; cheDo?: "quan-sat" };
  readonly onXong: () => void;
}) {
  return (
    <div>
      <div data-khong-in className="px-5 pt-8 md:px-12">
        <NutQuayLai nhan={CHU_BUOC.ten["nha-minh"]} onBam={onXong} />
      </div>
      <KhoangDisc
        key={`${dangLamCho.tv.id}:${dangLamCho.cheDo ?? "tu-lam"}`}
        vaoTuThanhVien={dangLamCho.tv}
        onThoat={onXong}
        {...(dangLamCho.cheDo ? { cheDo: dangLamCho.cheDo } : {})}
      />
    </div>
  );
}
