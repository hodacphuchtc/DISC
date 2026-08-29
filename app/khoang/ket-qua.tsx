"use client";

import { useEffect, useState } from "react";

import { BieuDoCot } from "@/app/components/bieu-do-cot";
import { KhoiMaMoi } from "@/app/components/khoi-ma-moi";
import { MO_MA_MOI } from "@config/disc-nguong";
import { CapNhanVat, NhanVat } from "@/app/components/nhan-vat";
import { TIEU_DE_KHOI } from "@config/disc-dien-giai";
import { CHU_BA_BAN, CHU_BAN_KHOAN, CHU_KET_QUA, CHU_M4, TRUC } from "@config/disc-tu-dien";
import { KHUNG } from "@config/bo-cuc";
import { MAU } from "@config/thuong-hieu";
import type { BoDe, MaTruc } from "@modules/core/bo-de/kieu";
import { BO_DE_BO_ME, BO_DE_CON } from "@modules/report/doi-chieu";
import type { MaBoDe } from "@modules/core/bo-de/kieu";
import type { KetQua } from "@modules/report/cham";
import { layDienGiai, layDienGiaiDay, thayChuThe } from "@modules/report/dien-giai";
import { LopSauKetQua } from "./lop-sau";
import { BangTraDisc, ChuGiaiBonNhom, MoDauKetQua, TomTat30Giay } from "./mo-dau";
import {
  KhoiChuyenTay,
  NutIn,
  NutKetThucVaXoa,
  NutLamLai,
  NutTaiAnh,
} from "./nut-ket-qua";
import { BAN_KHOAN, MA_BAN_KHOAN, type MaBanKhoan } from "@config/disc-loi-khuyen";
import { docTatCa, ghiBanKhoan } from "@modules/core/luu-tru/kho-bai";
import { doiChieuPhongCach, type KetQuaPhongCach } from "@modules/report/doi-chieu-phong-cach";

/** M4 — màn kết quả. Bốn khối văn bản đọc từ `config/disc-dien-giai.ts`. */
/** Ngày hôm nay theo giờ MÁY, dạng yyyy-mm-dd. Mã mời nhúng ngày phát để tính hạn 7 ngày. */
function homNayChuoi(): string {
  const d = new Date();
  const hai = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${hai(d.getMonth() + 1)}-${hai(d.getDate())}`;
}

export function ManKetQua({
  boDe,
  bietDanh,
  ketQua,
  idBai,
  onLamLai,
  onXemDoiChieu,
  onLamBoConThieu,
  tuoi,
  banKhoan,
}: {
  readonly boDe: BoDe;
  readonly bietDanh: string;
  readonly ketQua: KetQua;
  /** Mã bài trong kho. `null` khi bài không lưu được, hoặc khi đang xem lại bài cũ. */
  readonly idBai?: string | null;
  readonly onLamLai: () => void;
  /** Có cặp để đối chiếu ⇒ mở màn M5. Thiếu callback thì khối chuyền tay không hiện. */
  readonly onXemDoiChieu?: (maTre: string) => void;
  readonly onLamBoConThieu?: (ma: MaBoDe, maTre: string) => void;
  /** Tuổi người được đánh giá. Chỉ bộ QS cần — nó bắc qua cả lứa tiểu học lẫn THCS. */
  readonly tuoi?: number;
  /** Mã điều phụ huynh đang băn khoăn, nếu đã chọn. */
  readonly banKhoan?: string;
}) {
  // §9.2 luật 6: bộ MN và TH đều PHẢI mở đầu bằng câu rào. Nhưng hai bộ có hai người đọc
  // khác nhau — bộ MN là bố mẹ trả lời hộ, bộ TH là chính em học sinh cầm máy — nên hai câu
  // rào khác nhau. Dùng chung một câu là gọi một em lớp 4 là "con".
  const cauRao =
    boDe.ma === "MN"
      ? CHU_KET_QUA.cauRaoTre
      : boDe.ma === "TH"
        ? CHU_KET_QUA.cauRaoTuMinh
        : null;
  const laTuDanhGia = boDe.ma === "TH" || boDe.ma === "THCS" || boDe.ma === "PH";
  const laNguoiLonDocVeTre = boDe.ma === "MN" || boDe.ma === "QS";

  // 🔴 Hai hook phải gọi TRƯỚC nhánh return sớm ngay bên dưới, nếu không thứ tự hook đổi
  // giữa hai lần render và React vỡ. Bài không hợp lệ vẫn đi qua đây — `usePhongCach` tự
  // trả về lý do "bài con không hợp lệ" nên không cần chặn ở ngoài.
  const [banKhoanChon, datBanKhoanChon] = useState(banKhoan);
  const phongCach = usePhongCach(ketQua, boDe.ma);

  if (!ketQua.hopLe) {
    return (
      <section className="max-w-2xl px-5 py-10 md:px-12 md:py-16">
        <p className="text-[11px] tracking-widest text-neutral-600 uppercase">
          {boDe.ten} · {bietDanh}
        </p>
        <h1 className="mt-3 text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900">
          Chưa kết luận được
        </h1>
        <p
          role="status"
          className="mt-5 rounded-xl bg-amber-50 px-4 py-3.5 text-[15px] leading-relaxed text-amber-900"
        >
          {ketQua.lyDo === "PHANG" ? CHU_KET_QUA.phang : CHU_KET_QUA.thieuCau}
        </p>
        <div data-khong-in className="mt-10">
          <NutLamLai onLamLai={onLamLai} />
        </div>
      </section>
    );
  }

  const dienGiai = layDienGiai(ketQua.kieu, boDe.ma);
  const sau = layDienGiaiDay({
    diem: ketQua.diem,
    xepHang: ketQua.xepHang,
    maBoDe: boDe.ma,
    tuoi,
    banKhoan: banKhoanChon,
  });
  const noiBat: MaTruc[] | undefined =
    ketQua.kieu.loai === "don"
      ? [ketQua.kieu.truc]
      : ketQua.kieu.loai === "pha"
        ? [...ketQua.kieu.cap]
        : undefined;

  const tieuDe =
    ketQua.kieu.loai === "don"
      ? thayChuThe(CHU_M4.nghiengVe, boDe.ma).replace(
          "{ten}",
          TRUC[ketQua.kieu.truc].ten.toLowerCase(),
        )
      : ketQua.kieu.loai === "pha"
        ? CHU_M4.phaGiua
            .replace("{a}", TRUC[ketQua.kieu.cap[0]].ten.toLowerCase())
            .replace("{b}", TRUC[ketQua.kieu.cap[1]].ten.toLowerCase())
        : CHU_M4.phoDeu;

  // Tóm tắt 30 giây lấy từ thứ ĐÃ CÓ, không viết mới: trục nổi nhất / nhẹ nhất do
  // `viTriTrongHoSo` xếp, và "một việc làm ngay" là trường đã có sẵn ở cả ba bản.
  const trucNoiNhat = sau.phoBonNhom.find((t) => t.viTri === "noiNhat")?.truc ?? ketQua.xepHang[0];
  const trucNheNhat = sau.phoBonNhom.find((t) => t.viTri === "nheNhat")?.truc ?? ketQua.xepHang[3];
  const motViecNgay =
    sau.banBoMe?.motViecToiNay ?? sau.banCon?.motViecToiNay ?? sau.banTuMinh?.motViecToiNay;

  // Trang này có HAI người đọc không? Chỉ bộ TH/THCS: em học sinh tự làm bài, nên máy vừa
  // giữ phần của em vừa giữ phần của bố mẹ. Đó cũng là điều kiện dựng dải chắn ở lớp sâu.
  const coHaiBan = Boolean(sau.banCon && sau.banBoMe);

  const boDeGhepCapDuoc =
    BO_DE_CON.includes(boDe.ma) || boDe.ma === BO_DE_BO_ME;

  const khoi = [
    { ten: TIEU_DE_KHOI.trongNhuTheNao, than: dienGiai.trongNhuTheNao },
    { ten: TIEU_DE_KHOI.diemManh, than: dienGiai.diemManh },
    { ten: TIEU_DE_KHOI.choCanDeY, than: dienGiai.choCanDeY },
  ];

  return (
    /**
     * 🔴 BỐ CỤC HAI CỘT CHỈ Ở NỬA TRÊN, và chỉ từ mốc `xl` (17.7).
     *
     * Nửa trên là BẢNG SỐ: biểu đồ, tóm tắt 30 giây, bảng tra bốn nhóm — những khối cao mà
     * hẹp, xếp dọc thì đẩy phần chữ xuống tận dưới nếp gấp. Nửa dưới là ĐOẠN VĂN, và nó ở
     * lại một cột: kéo prose ra hai cột trên màn 1920px thì mắt phải nhảy lên đầu cột hai,
     * còn kéo nó ra full-width thì lạc dòng. Cả hai đều tệ hơn hiện tại.
     *
     * 🔴 `print:block` gỡ grid khi in. Hợp đồng `@media print` của màn này có năm lớp và
     * `tests/ban-in.test.ts` canh nó — một bố cục grid lọt vào bản in là thứ chỉ lộ ra khi
     * xem trước bản in, tức là muộn.
     */
    <section className={`${KHUNG.trang} px-5 py-10 md:px-12 md:py-16`}>
      <div className="grid gap-x-12 xl:grid-cols-2 xl:items-start print:block">
      <div className={KHUNG.doc}>
      <p className="text-[11px] tracking-widest text-neutral-600 uppercase">
        {boDe.ten} · {bietDanh}
      </p>

      {/* 🔴 Câu rào BẮT BUỘC cho bộ trẻ nhỏ, đặt TRƯỚC kết quả (§9.2). */}
      {cauRao && (
        <p className="mt-3 text-[14px] leading-relaxed font-medium text-neutral-700">
          {cauRao}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-5">
        {ketQua.kieu.loai === "don" && <NhanVat truc={ketQua.kieu.truc} />}
        {ketQua.kieu.loai === "pha" && <CapNhanVat cap={ketQua.kieu.cap} />}
        <h1 className="max-w-sm text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900 md:text-[30px]">
          {tieuDe}
        </h1>
      </div>

      {/* Cố ý KHÔNG lặp lại câu "bốn nhóm cân bằng" ở đây: khối "Điều này thường trông
          như thế nào" bên dưới đã nói đúng ý đó, và nói bằng ĐÚNG đại từ của bộ đề.
          Bản cũ gõ cứng "bạn" nên bộ Bố mẹ-nhìn-con đọc ra hai câu lệch nhau. */}

      {ketQua.canhBao.length > 0 && (
        <ul className="mt-6 space-y-2">
          {ketQua.canhBao.map((c) => (
            <li
              key={c}
              role="status"
              className="rounded-xl bg-amber-50 px-3.5 py-2.5 text-[13px] text-amber-900"
            >
              {CHU_KET_QUA.canhBao[c]}
            </li>
          ))}
        </ul>
      )}

      <TomTat30Giay
        tieuDe={tieuDe}
        trucNoiNhat={trucNoiNhat}
        trucNheNhat={trucNheNhat}
        motViec={motViecNgay}
      />

      <section aria-label={CHU_M4.nhanBieuDo} className="mt-9">
        <BieuDoCot diem={ketQua.diem} noiBat={noiBat} />
      </section>

      <MoDauKetQua />

      <div className="mt-4">
        <BangTraDisc />
        <ChuGiaiBonNhom />
      </div>
      </div>

      <div className={`mt-10 space-y-7 xl:mt-0 ${KHUNG.doc}`}>
        {khoi.map((k) => (
          <div key={k.ten}>
            <h2 className="text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
              {k.ten}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-neutral-800">{k.than}</p>
          </div>
        ))}

        <div className="rounded-xl border-l-4 px-4 py-4" style={{ borderColor: MAU.camNangLuong }}>
          <h2 className="text-[12px] font-semibold tracking-widest text-neutral-700 uppercase">
            {laTuDanhGia ? TIEU_DE_KHOI.cauHoiToiNayTuMinh : TIEU_DE_KHOI.cauHoiToiNay}
          </h2>
          <ol className="mt-3 space-y-2.5">
            {dienGiai.cauHoiToiNay.map((c, i) => (
              <li key={c} className="flex gap-3 text-[15px] leading-relaxed text-neutral-800">
                <span
                  aria-hidden="true"
                  className="shrink-0 font-semibold tabular-nums"
                  style={{ color: MAU.camDamChoChu }}
                >
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ol>
        </div>
      </div>

      </div>

      {laNguoiLonDocVeTre && (
        <OBanKhoan
          dangChon={banKhoanChon}
          onChon={(ma) => {
            datBanKhoanChon(ma);
            if (idBai) void ghiBanKhoan(idBai, ma);
          }}
        />
      )}

      <LopSauKetQua
        sau={sau}
        bietDanh={bietDanh}
        maBoDe={boDe.ma}
        // 🔴 GĐ10 chặng 2: KHÔNG còn lọc theo bộ đề ở đây nữa. Trước đây phải chặn thẳng
        // bộ TH/THCS vì cả khối viết bằng giọng nói với phụ huynh, nên học sinh cuộn
        // xuống là đọc nhầm phần của người lớn. Nay mỗi trường có dải riêng: em học sinh
        // đọc `choCon` trong dải của mình, còn `choBoMe`/`boMeTuNhin` nằm trong dải bố mẹ,
        // đóng sau dải chắn. Chặn bằng CẤU TRÚC chứ không bằng một câu điều kiện.
        phongCach={phongCach}
        onLamBoPhuHuynh={onLamBoConThieu ? () => onLamBoConThieu("PH", "") : undefined}
      />

      {boDeGhepCapDuoc && onXemDoiChieu && onLamBoConThieu && (
        <div data-khong-in className="mt-10">
          <KhoiChuyenTay
            maTre={bietDanh}
            onXem={onXemDoiChieu}
            onLamBo={(ma) => onLamBoConThieu(ma, bietDanh)}
          />
        </div>
      )}

      {/* LỚP ① của cờ MO_MA_MOI (23.1) — nửa GỬI. Nửa NHẬN ở bang-gia-dinh.tsx (lớp ②),
          đường GHI ở nha-minh.tsx (lớp ③). Tắt riêng một nửa là bày ra một mã QR mà máy
          nhận không còn chỗ nào để nhập. */}
      {MO_MA_MOI && ketQua.hopLe && (
        <KhoiMaMoi
          boDe={boDe.ma}
          diem={ketQua.diem}
          vaiGoiY={boDe.ma === "PH" ? "me" : "con"}
          homNay={homNayChuoi()}
        />
      )}

      <div data-khong-in className="mt-10 flex flex-wrap items-center gap-3">
        <NutTaiAnh
          tenTep={`disc-${bietDanh}`}
          noiDung={{
            tieuDeCauHoi: laTuDanhGia
              ? TIEU_DE_KHOI.cauHoiToiNayTuMinh
              : TIEU_DE_KHOI.cauHoiToiNay,
            cauHoi: dienGiai.cauHoiToiNay,
            // 🔴 Ảnh dùng nhan đề NGẮN: Canvas không báo lỗi khi chữ tràn khung — nhan đề
            // dài làm cỡ chữ tụt xuống rồi bị cắt, và khối kết quả cao cố định nên dòng
            // thứ ba đè lên biểu đồ. Bản ngắn cũng giữ đúng thứ tự trội/phụ, thứ mà
            // "Pha giữa … và …" làm mất.
            tieuDe: sau.pha?.tieuDeNgan ?? tieuDe,
            diem: ketQua.diem,
            trucNhanVat: noiBat ?? [],
            chanTrang: CHU_M4.chanTrangAnh,
          }}
        />
        {/* 🔴 Trang có HAI người đọc thì phải có HAI nút in. Một nút "In / Tải PDF" duy
            nhất buộc bố mẹ đưa cho con tờ giấy có cả phần người lớn bàn về con — đúng thứ
            việc tách dải sinh ra để chặn, mà chặn trên màn hình rồi lại hở ở máy in. */}
        {coHaiBan ? (
          <>
            <NutIn ban="con" nhan={thayChuThe(CHU_BA_BAN.nutInCon, boDe.ma, "con")} />
            <NutIn ban="boMe" nhan={CHU_BA_BAN.nutInBoMe} />
          </>
        ) : (
          <NutIn nhan={CHU_M4.nutTaiPdf} />
        )}
        <NutLamLai onLamLai={onLamLai} />
        {idBai && <NutKetThucVaXoa idBai={idBai} onXong={onLamLai} />}
      </div>
    </section>
  );
}

/**
 * Ô chọn "điều đang băn khoăn" — MỘT chạm, đặt ở màn kết quả.
 *
 * 🔴 ĐẶT SAU KẾT QUẢ, KHÔNG chèn vào giữa M1→M2. `tests/m1-chon-doi-tuong.test.tsx` và
 * `tests/dieu-huong.test.tsx` bấm xuyên luồng, chèn thêm một màn vào giữa là đỏ hàng loạt
 * mà chẳng đổi được gì về giá trị. Đặt ở đây còn đúng hơn về nghiệp vụ: phụ huynh vừa đọc
 * xong kết quả mới là lúc họ biết mình muốn hỏi gì.
 *
 * 🔴 CHỈ hiện cho bộ MN và QS — hai bộ mà người đọc là NGƯỜI LỚN nói về một đứa trẻ. Bộ tự
 * đánh giá thì "con ngại giao tiếp" là câu hỏi sai người.
 */
function OBanKhoan({
  dangChon,
  onChon,
}: {
  readonly dangChon?: string;
  readonly onChon: (ma: MaBanKhoan) => void;
}) {
  return (
    <section data-khong-in className="mt-10 rounded-xl border border-neutral-200 px-4 py-4">
      <h2 className="text-[15px] font-semibold text-neutral-900">{CHU_BAN_KHOAN.tieuDe}</h2>
      <p className="mt-1 text-[13px] leading-snug text-neutral-600">{CHU_BAN_KHOAN.moTa}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {MA_BAN_KHOAN.map((ma) => {
          const chon = ma === dangChon;
          return (
            <button
              key={ma}
              type="button"
              aria-pressed={chon}
              onClick={() => onChon(ma)}
              className="min-h-[44px] rounded-xl border px-3.5 text-[14px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: chon ? MAU.timCongNghe : "#d4d4d4",
                backgroundColor: chon ? "#F5F3FF" : "transparent",
                color: chon ? MAU.timCongNghe : "#404040",
                outlineColor: MAU.timCongNghe,
              }}
            >
              {BAN_KHOAN[ma].nhan}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Tìm hồ sơ phong cách của bố mẹ trên máy này.
 *
 * 🔴 Đọc kho ở tầng giao diện, KHÔNG đọc trong `modules/report` — tầng lõi không được đụng
 * IndexedDB (ADR-004). Đúng khuôn `useDoiChieu` ở `vung-lech.tsx`.
 */
function usePhongCach(ketQua: KetQua, maBoDe: MaBoDe) {
  const [kq, datKq] = useState<KetQuaPhongCach | null>(null);
  useEffect(() => {
    let con = true;
    void docTatCa().then((ds) => {
      if (con) datKq(doiChieuPhongCach(ds, ketQua, maBoDe));
    });
    return () => {
      con = false;
    };
  }, [ketQua, maBoDe]);
  return kq;
}
