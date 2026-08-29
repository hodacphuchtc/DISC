"use client";

/**
 * BẢNG GIA ĐÌNH (12.3) — thay màn *Bài đã làm* xếp theo thời gian.
 *
 * 🔴 VÌ SAO MỘT BẢNG, KHÔNG PHẢI WIZARD BA BƯỚC.
 * Ba bước tuần tự bắt người dùng đi hết bước 1 mới thấy bước 2. Một bảng thì mỗi việc
 * đúng một cú chạm, và — quan trọng hơn — **nhìn một cái là biết ai chưa làm**. Chính
 * thông tin đó khiến phụ huynh đi nhắc người còn lại, và đó là hành vi mà cả GĐ14 đang
 * đặt cược vào.
 *
 * 🔴 XOÁ NGƯỜI LÀ ĐƯỜNG MẤT DỮ LIỆU NHANH NHẤT. `xoaThanhVien` ở tầng lưu trữ cố ý không
 * có chế độ mặc định; ở đây mặc định là "giữ bài" — bài rơi về mục *chưa xếp* và xếp lại
 * được. Người dùng phải chủ động chọn "xoá luôn cả bài" thì mới mất.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useCallback, useEffect, useState } from "react";

import { CHU_VAI, GIOI_HAN_BAI_MOI_NGUOI } from "@config/disc-gia-dinh";
import {
  CHU_BANG_GIA_DINH,
  CHU_MA_MOI,
  CHU_SO_SANH,
  CHU_THONG_DIEP,
  CHU_TRE_TAM_DONG,
  TRUC,
} from "@config/disc-tu-dien";
import { KHUNG } from "@config/bo-cuc";
import { MAU } from "@config/thuong-hieu";
import { useKhoDoi } from "@/app/dung-kho-doi";
import { FormThanhVien, HoiXoa } from "@/app/components/form-thanh-vien";
import { MinhHoa, NhanVat } from "@/app/components/nhan-vat";
import { NhanMaMoi } from "@/app/components/nhan-ma-moi";
import type { HoSoMoi } from "@modules/core/gia-dinh/ma-moi";
import { MA_TRUC, type MaTruc as MaTrucKieu } from "@modules/core/bo-de/kieu";
import { soSanhTheoThoiGian } from "@modules/report/so-sanh-thoi-gian";
import { boDeChoThanhVien, boDeQuanSatTheoLop } from "@modules/test/dinh-tuyen";
import { MO_MA_MOI, MO_NOI_DUNG_TRE, laBoDeTre } from "@config/disc-nguong";
import type { CheDoXoaThanhVien, ThanhVien } from "@modules/core/gia-dinh/kieu";
import {
  docTatCa,
  docThanhVien,
  luuBai,
  luuThanhVien,
  xoaThanhVien,
  type BaiLamLuu,
} from "@modules/core/luu-tru/kho-bai";

/** Ngày hôm nay theo giờ MÁY, dạng `yyyy-mm-dd`. Cùng lối với mọi chỗ khác trong khoang. */
function homNay(): string {
  const d = new Date();
  const hai = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${hai(d.getMonth() + 1)}-${hai(d.getDate())}`;
}

export function KhoangBangGiaDinh({
  onLamBai,
  onLamBaiQuanSat,
  onXemBai,
  onNhanMa,
  onXemSoSanh,
}: {
  /** Bấm *Làm bài* trên thẻ một người. Thiếu callback thì nút không hiện. */
  readonly onLamBai?: (tv: ThanhVien) => void;
  /** Người lớn trả lời VỀ đứa trẻ này (bộ QS, V1.4). Nút chỉ mọc trên thẻ trẻ từ lớp 3. */
  readonly onLamBaiQuanSat?: (tv: ThanhVien) => void;
  /**
   * Bấm *Xem kết quả* trên thẻ.
   *
   * 🔴 Trao CẢ danh sách bài của người đó, không phải mỗi bài mới nhất (17.2). Màn kết quả
   * cần đủ danh sách mới dựng được dải chọn lần đo; trao một bài rồi bắt màn kia đi đọc kho
   * lần nữa là đọc hai lần cùng một thứ, và hai lượt đọc đó lệch nhau được.
   */
  readonly onXemBai?: (cacBan: readonly BaiLamLuu[]) => void;
  /** Nhận một mã mời (13.1). Trả `false` khi sổ đã có hồ sơ đó rồi. */
  readonly onNhanMa?: (ten: string, hoSo: HoSoMoi) => Promise<boolean> | boolean;
  /** Bấm *Xem thay đổi* trên thẻ (13.2). Nút chỉ hiện khi thật sự so được. */
  readonly onXemSoSanh?: (tv: ThanhVien) => void;
}) {
  const [nguoi, datNguoi] = useState<ThanhVien[] | null>(null);
  const [bai, datBai] = useState<BaiLamLuu[]>([]);
  const [dangSua, datDangSua] = useState<ThanhVien | "moi" | null>(null);
  const [hoiXoa, datHoiXoa] = useState<ThanhVien | null>(null);

  const napLai = useCallback(async () => {
    const [tv, ds] = await Promise.all([docThanhVien(), docTatCa()]);
    datNguoi(tv);
    datBai(ds);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void napLai();
  }, [napLai]);

  // Kho vừa đổi — do chính tab này hay do tab khác — ⇒ nạp lại, đừng hiện số liệu cũ.
  useKhoDoi(napLai);

  const baiCua = (id: string) => bai.filter((b) => b.maThanhVien === id);
  const chuaXep = bai.filter((b) => !b.maThanhVien);

  async function luu(tv: ThanhVien) {
    await luuThanhVien(tv);
    datDangSua(null);
    await napLai();
  }

  async function xoa(tv: ThanhVien, cheDo: CheDoXoaThanhVien) {
    await xoaThanhVien(tv.id, cheDo);
    datHoiXoa(null);
    await napLai();
  }

  async function xepVe(b: BaiLamLuu, maThanhVien: string) {
    await luuBai({ ...b, maThanhVien });
    await napLai();
  }

  return (
    <section className={`${KHUNG.trang} px-4 py-5 md:px-5`}>
          {/* 🔴 THÔNG ĐIỆP NHÂN VĂN — dòng đầu tiên, trước mọi thứ khác, và CHỈ ở đây.
              Rải sang bước 2 và bước 3 là biến sự chân thành thành khẩu hiệu: đọc lần
              đầu thấy tử tế, đọc lần thứ tư thấy như quảng cáo. */}
          <p
            data-thu="thong-diep-chinh"
            className="text-[19px] leading-snug font-bold md:text-[22px]"
            style={{ color: MAU.timCongNghe }}
          >
            {CHU_THONG_DIEP.chinh}
          </p>
          <p className={`mt-1.5 text-[15px] text-neutral-600 ${KHUNG.doc}`}>
            {CHU_THONG_DIEP.phu}
          </p>
          {/* 🔴 LÝ DO QUAY LẠI (13.2). Không có dòng này thì sản phẩm chỉ được dùng một
              lần rồi thôi — mà mục tiêu của cả gói là GIỮ CHÂN, không phải đo một lần. */}
          <p data-thu="nhac-lam-lai" className="mt-1 text-[14px] text-neutral-500">
            {CHU_SO_SANH.nhacLamLai}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[16px] font-bold text-neutral-900">{CHU_BANG_GIA_DINH.tieuDe}</h2>
            <button
              type="button"
              onClick={() => datDangSua("moi")}
              className="min-h-[44px] rounded-xl px-4 text-[15px] font-semibold text-white shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
              style={{ backgroundColor: MAU.timCongNghe }}
            >
              {CHU_BANG_GIA_DINH.nutThem}
            </button>
          </div>
      <p className="mt-1.5 text-[14px] text-neutral-600">{CHU_BANG_GIA_DINH.moTa}</p>

      {nguoi === null ? (
        <p className="text-[15px] text-neutral-500">…</p>
      ) : nguoi.length === 0 ? (
        // 🔴 Màn trống là màn NHIỀU NGƯỜI THẤY NHẤT — nó là màn đầu tiên của mọi gia đình.
        // Một dòng chữ trần ở đây đọc lên như một lỗi; một hình vẽ nói rằng chỗ này VỐN
        // trống lúc bắt đầu, và việc tiếp theo là thêm người.
        <div data-thu="bang-trong" className="flex flex-col items-center py-4 text-center">
          <MinhHoa ma="moi-them-nguoi" />
          <p className="mt-3 text-[15px] text-neutral-600">{CHU_BANG_GIA_DINH.trong}</p>
        </div>
      ) : (
        <ul data-thu="luoi-thanh-vien" className={`mt-5 ${KHUNG.luoiThe}`}>
          {nguoi.map((tv) => (
            <TheThanhVien
              key={tv.id}
              tv={tv}
              bai={baiCua(tv.id)}
              onLamBai={onLamBai}
              onLamBaiQuanSat={onLamBaiQuanSat}
              onXemBai={onXemBai}
              onXemSoSanh={onXemSoSanh}
              onSua={() => datDangSua(tv)}
              onXoa={() => datHoiXoa(tv)}
            />
          ))}
        </ul>
      )}

      {chuaXep.length > 0 && (
        <section data-thu="chua-xep" className="mt-10">
          <h2 className="text-[15px] font-semibold text-neutral-900">
            {CHU_BANG_GIA_DINH.nhomChuaXep}
          </h2>
          <p className="mt-1 text-[14px] text-neutral-600">{CHU_BANG_GIA_DINH.moTaChuaXep}</p>
          <ul className="mt-3 space-y-2">
            {chuaXep.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center gap-2 rounded-xl border p-3 text-[14px]"
                style={{ borderColor: MAU.vienMo }}
              >
                <span className="text-neutral-800">
                  {b.boDe} · {b.ketThuc.slice(0, 10)}
                </span>
                {(nguoi ?? []).length > 0 && (
                  <select
                    aria-label={`${CHU_BANG_GIA_DINH.nutXepVe} ${b.boDe}`}
                    defaultValue=""
                    onChange={(e) => e.target.value && void xepVe(b, e.target.value)}
                    className="ml-auto rounded-lg border px-2 py-1.5"
                    style={{ borderColor: MAU.vienMo }}
                  >
                    <option value="">{CHU_BANG_GIA_DINH.nutXepVe}…</option>
                    {(nguoi ?? []).map((tv) => (
                      <option key={tv.id} value={tv.id}>
                        {tv.ten}
                      </option>
                    ))}
                  </select>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* LỚP ② của cờ MO_MA_MOI (23.1) — nửa NHẬN. Lớp ① ở màn kết quả (nửa GỬI),
          lớp ③ ở đường GHI trong nha-minh.tsx. Ba lớp, ba tầng khác nhau. */}
      {MO_MA_MOI && onNhanMa && <NhanMaMoi homNay={homNay()} onThem={onNhanMa} />}

      <p
        data-thu="thong-diep-chan"
        className={`mt-10 text-[13px] leading-relaxed text-neutral-500 ${KHUNG.doc}`}
      >
        {CHU_THONG_DIEP.chan}
      </p>

      {dangSua && (
        <FormThanhVien
          tv={dangSua === "moi" ? null : dangSua}
          daCo={nguoi ?? []}
          onLuu={luu}
          onHuy={() => datDangSua(null)}
        />
      )}

      {hoiXoa && (
        <HoiXoa
          tv={hoiXoa}
          soBai={baiCua(hoiXoa.id).length}
          onHuy={() => datHoiXoa(null)}
          onXoa={(cheDo) => void xoa(hoiXoa, cheDo)}
        />
      )}
    </section>
  );
}

/* ── Thẻ một người ───────────────────────────────────────────────────────── */

function TheThanhVien({
  tv,
  bai,
  onLamBai,
  onLamBaiQuanSat,
  onXemBai,
  onXemSoSanh,
  onSua,
  onXoa,
}: {
  readonly tv: ThanhVien;
  readonly bai: readonly BaiLamLuu[];
  readonly onLamBai?: (tv: ThanhVien) => void;
  /** Người lớn ngồi trả lời VỀ đứa trẻ này (bộ QS) — mở màn Vùng lệch. */
  readonly onLamBaiQuanSat?: (tv: ThanhVien) => void;
  readonly onXemBai?: (cacBan: readonly BaiLamLuu[]) => void;
  readonly onXemSoSanh?: (tv: ThanhVien) => void;
  readonly onSua: () => void;
  readonly onXoa: () => void;
}) {
  // Bộ đề của chính người này — dùng để gọi tên nút chính cho đúng việc sắp xảy ra.
  // Mầm non bấm vào một nút ghi "Làm bài" rồi thấy câu hỏi dành cho bố mẹ là một cú hẫng.
  const tuyen = boDeChoThanhVien(tv.vaiTro, tv.lop);
  /**
   * 🔴 CỜ TẮT NỘI DUNG TRẺ (V4.1). Tắt thì thẻ của trẻ KHÔNG bày nút làm bài — bày ra rồi
   * bấm vào mới báo "đang đóng" là để người ta thất vọng thêm một nhịp không cần thiết.
   */
  const treDangDong = !MO_NOI_DUNG_TRE && Boolean(tuyen && laBoDeTre(tuyen.boDe));
  // 🔴 Nút *Xem thay đổi* CHỈ hiện khi hai bài cách nhau đủ xa (13.2). Gần hơn thì thứ
  // hiện lên là nhiễu của phép đo chứ không phải thay đổi của con người — và nó vẫn đọc
  // lên đầy thuyết phục vì có số kèm theo. Không bày nút thì không ai đọc nhầm.
  const soSanh = soSanhTheoThoiGian(
    bai.filter((b) => b.ketQua.hopLe).map((b) => ({
      id: b.id,
      ketThuc: b.ketThuc,
      diem: (b.ketQua as { diem: Record<MaTrucKieu, number> }).diem,
    })),
  );
  const moiNhat = bai[0];
  // Ưu tiên bài làm THẬT trên máy này; không có thì dùng hồ sơ nhận qua mã mời (13.1).
  const diem = moiNhat?.ketQua.hopLe ? moiNhat.ketQua.diem : (tv.nhanQuaMa?.diem ?? null);
  const chiCoMa = bai.length === 0 && Boolean(tv.nhanQuaMa);

  /**
   * Nhóm nổi trội của người này — quyết định màu viền và con robot nhỏ trên thẻ (16.8).
   *
   * 🔴 CHƯA CÓ HỒ SƠ THÌ KHÔNG CÓ MÀU. Đoán một nhóm cho người chưa làm bài là dán nhãn
   * họ bằng một con số chưa từng tồn tại — đúng thứ ADR-002 cấm. Thẻ trung tính là câu
   * trả lời đúng: *chưa biết*.
   */
  const trucNoiTroi: MaTrucKieu | null = diem
    ? MA_TRUC.reduce((a, b) => (diem[b] > diem[a] ? b : a))
    : null;
  const mauThe = trucNoiTroi ? TRUC[trucNoiTroi].mau : MAU.vienMo;

  return (
    <li
      data-thu="the-thanh-vien"
      data-ten={tv.ten}
      data-so-bai={bai.length}
      data-truc={trucNoiTroi ?? undefined}
      className="rounded-2xl border border-l-4 p-4 transition-colors duration-200 motion-reduce:transition-none"
      style={{ borderColor: MAU.vienMo, borderLeftColor: mauThe }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Robot nhỏ theo nhóm nổi trội. Bốn con này trước đây chỉ xuất hiện ở ĐÚNG màn
              kết quả — cả chặng còn lại là chữ đen trên nền trắng. */}
          {trucNoiTroi && <NhanVat truc={trucNoiTroi} kichThuoc={34} />}
          <h3 className="truncate text-[16px] font-semibold text-neutral-900">{tv.ten}</h3>
        </div>
        <span className="shrink-0 text-[13px] text-neutral-500">{CHU_VAI[tv.vaiTro]}</span>
      </div>

      {/* Sổ tiến độ: một chấm đầy cho mỗi bài đã làm. Nhìn lướt là biết ai chưa xong. */}
      <p data-thu="so-tien-do" className="mt-2 text-[14px] text-neutral-600">
        <span
          aria-hidden="true"
          className="mr-1.5 tracking-widest"
          style={{ color: trucNoiTroi ? TRUC[trucNoiTroi].mau : MAU.camNangLuong }}
        >
          {"●".repeat(bai.length)}
          {"○".repeat(Math.max(GIOI_HAN_BAI_MOI_NGUOI - bai.length, 0))}
        </span>
        {chiCoMa
          ? CHU_MA_MOI.nhanNhanQuaMa
          : bai.length === 0
          ? CHU_BANG_GIA_DINH.chuaLamBai
          : CHU_BANG_GIA_DINH.demBai
              .replace("{so}", String(bai.length))
              .replace("{gioiHan}", String(GIOI_HAN_BAI_MOI_NGUOI))}
      </p>

      {diem && (
        <ul className="mt-2.5 flex gap-3" aria-label="Bốn nhóm">
          {MA_TRUC.map((t) => (
            <li key={t} className="text-[13px] tabular-nums text-neutral-700">
              <span aria-hidden="true" style={{ color: TRUC[t].mau }}>
                ■
              </span>{" "}
              {t} {diem[t]}
            </li>
          ))}
        </ul>
      )}

      {treDangDong && (
        <p
          data-thu="tre-tam-dong"
          className="mt-3 rounded-xl px-3 py-2.5 text-[13px] leading-snug"
          style={{ backgroundColor: "#FFF4E6", color: MAU.camDamChoChu }}
        >
          <strong className="font-semibold">{CHU_TRE_TAM_DONG.nhan}.</strong>{" "}
          {CHU_TRE_TAM_DONG.than}
        </p>
      )}

      <div className="mt-3.5 flex flex-wrap gap-2">
        {onLamBai && !treDangDong && (
          <button
            type="button"
            onClick={() => onLamBai(tv)}
            className="min-h-[44px] max-w-full rounded-xl px-3.5 py-1.5 text-left text-[14px] font-semibold break-words text-white"
            style={{ backgroundColor: MAU.timCongNghe }}
          >
            {tuyen?.nguoiLonTraLoiHo
              ? CHU_BANG_GIA_DINH.nutTraLoiHo.replace("{ten}", tv.ten)
              : CHU_BANG_GIA_DINH.nutLamBai}
          </button>
        )}
        {/* 🔴 Nút PHỤ chỉ mọc trên thẻ của trẻ TỪ LỚP 3 — dưới mốc đó bài chính đã là bản
            quan sát rồi, thêm nút thứ hai làm cùng một việc chỉ tổ gây phân vân. Hai bài
            (em tự làm + bố mẹ trả lời) ghép lại mới mở được màn Vùng lệch. */}
        {onLamBaiQuanSat && !treDangDong && boDeQuanSatTheoLop(tv.lop) === "QS" && (
          <button
            type="button"
            data-thu="nut-quan-sat"
            onClick={() => onLamBaiQuanSat(tv)}
            className="min-h-[44px] max-w-full rounded-xl border px-3.5 py-1.5 text-left text-[14px] font-semibold break-words"
            style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
          >
            {CHU_BANG_GIA_DINH.nutTraLoiHo.replace("{ten}", tv.ten)}
          </button>
        )}
        {onXemSoSanh && soSanh?.soSanhDuoc && (
          <button
            type="button"
            data-thu="nut-xem-thay-doi"
            onClick={() => onXemSoSanh(tv)}
            className="min-h-[44px] rounded-xl border px-3.5 text-[14px] font-semibold"
            style={{ borderColor: MAU.camNangLuong, color: MAU.camDamChoChu }}
          >
            {CHU_SO_SANH.nutXem}
          </button>
        )}
        {onXemBai && moiNhat && (
          <button
            type="button"
            onClick={() => onXemBai(bai)}
            className="min-h-[44px] rounded-xl border px-3.5 text-[14px] font-semibold"
            style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
          >
            {CHU_BANG_GIA_DINH.nutXemKetQua}
          </button>
        )}
        {/* 🔴 THỨ TỰ AN TOÀN (16.2). Nay một thẻ mang cả *Làm bài* lẫn *Xoá*, nên *Xoá*
            phải đứng CUỐI CÙNG — xa nhất khỏi nút người dùng bấm hàng ngày. Một lựa chọn
            không hoàn tác được không được nằm ở chỗ ngón tay rơi vào theo phản xạ. */}
        <button
          type="button"
          onClick={onSua}
          className="min-h-[44px] rounded-xl px-2.5 text-[14px] text-neutral-600"
        >
          {CHU_BANG_GIA_DINH.nutSua}
        </button>
        <button
          type="button"
          onClick={onXoa}
          className="min-h-[44px] rounded-xl px-2.5 text-[14px] text-neutral-600"
        >
          {CHU_BANG_GIA_DINH.nutXoa}
        </button>
      </div>
    </li>
  );
}
