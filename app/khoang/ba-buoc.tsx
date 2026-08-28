"use client";

/**
 * KHUNG BA BƯỚC (V2.1) — khai người → làm bài → đọc về nhau.
 *
 * 🔴 VÌ SAO KHOÁ MỀM, KHÔNG GIẤU. Bước chưa mở được vẫn hiện ra, mờ đi kèm một câu nói rõ
 * còn thiếu gì. Giấu hẳn thì người dùng không biết phía trước còn gì — mà chính cái "phía
 * trước còn gì" mới là thứ khiến họ đi thêm một bước nữa. Đây cũng là điều ADR-007 lo khi
 * bác wizard ba bước, và là lý do bảng gia đình được GIỮ NGUYÊN bên trong bước 1.
 *
 * 🔴 SỐ LIỆU ĐỌC Ở ĐÂY CHỈ ĐỂ VẼ DÒNG TRẠNG THÁI VÀ MỞ/KHOÁ. Ba bước con vẫn tự đọc kho
 * của chúng. Hai chỗ đọc cùng một kho thì phải cùng nghe `KENH_KHO`, nếu không thì xoá một
 * người ở bước 1 xong quay lên thấy tiêu đề vẫn đếm người đó.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useCallback, useEffect, useState } from "react";

import { KhoangDisc } from "./disc";
import { KhoangNhaMinh } from "./nha-minh";
import { KhoangPhanTich } from "./phan-tich";
import { NhacSaoLuu, daNhacSaoLuu } from "@/app/components/nhac-sao-luu";
import { CHU_BUOC, MA_BUOC, type MaBuoc } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { KENH_KHO, docTatCa, docThanhVien } from "@modules/core/luu-tru/kho-bai";
import type { ThanhVien } from "@modules/core/gia-dinh/kieu";

/** Đủ ngần này người có bài hợp lệ thì bước 3 mở. Dưới mức đó không có gì để so. */
const TOI_THIEU_DE_PHAN_TICH = 2;

type Dem = {
  readonly soNguoi: number;
  readonly soDaLam: number;
};

export function KhoangBaBuoc() {
  const [dem, datDem] = useState<Dem | null>(null);
  const [dangMo, datDangMo] = useState<MaBuoc | null>(null);
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
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const kenh = new BroadcastChannel(KENH_KHO);
    kenh.onmessage = () => void dem2();
    return () => kenh.close();
  }, [dem2]);

  /**
   * Bước nào tự mở khi vào: chưa có ai → 1; có người chưa làm → 2; đủ để đọc → 3.
   *
   * 🔴 Chỉ chọn hộ MỘT LẦN, lúc đếm xong lần đầu. Chọn lại mỗi lần số đổi thì người dùng
   * đang xem bước 1 mà vừa có ai đó làm xong bài sẽ bị bật sang bước 3 giữa chừng.
   */
  useEffect(() => {
    if (!dem || dangMo !== null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    datDangMo(
      dem.soNguoi === 0
        ? "nha-minh"
        : dem.soDaLam >= TOI_THIEU_DE_PHAN_TICH
          ? "phan-tich"
          : "lam-bai",
    );
  }, [dem, dangMo]);

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
    if (ma === "lam-bai" && dem.soNguoi === 0) return CHU_BUOC.khoaChuaCoAi;
    if (ma === "phan-tich" && dem.soDaLam < TOI_THIEU_DE_PHAN_TICH) {
      return dem.soNguoi === 0 ? CHU_BUOC.khoaChuaCoAi : CHU_BUOC.khoaChuaDuHaiNguoi;
    }
    return null;
  };

  const trangThai = (ma: MaBuoc): string => {
    if (!dem) return "…";
    if (ma === "nha-minh") {
      return dem.soNguoi === 0
        ? CHU_BUOC.chuaCoAi
        : CHU_BUOC.demNguoi.replace("{so}", String(dem.soNguoi));
    }
    if (ma === "lam-bai") {
      const con = dem.soNguoi - dem.soDaLam;
      if (dem.soNguoi === 0) return CHU_BUOC.chuaCoAi;
      if (dem.soDaLam === 0) return CHU_BUOC.chuaAiLam;
      return con === 0
        ? CHU_BUOC.taCaDaLam
        : CHU_BUOC.conChuaLam.replace("{so}", String(con));
    }
    return dem.soDaLam >= TOI_THIEU_DE_PHAN_TICH
      ? CHU_BUOC.sanSangPhanTich.replace("{so}", String(dem.soDaLam))
      : CHU_BUOC.khoaChuaDuHaiNguoi;
  };

  return (
    <div data-thu="khung-ba-buoc" className="max-w-3xl px-5 py-8 md:px-12 md:py-12">
      <p className="text-[11px] tracking-widest text-neutral-600 uppercase">
        {CHU_BUOC.nhanTren}
      </p>
      <h1 className="mt-2 text-[26px] leading-[1.15] font-extrabold tracking-tight text-neutral-900 md:text-[30px]">
        {CHU_BUOC.tieuDe}
      </h1>
      <p className="mt-1.5 text-[15px] text-neutral-600">{CHU_BUOC.moTa}</p>

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
              className="rounded-2xl border"
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
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
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
                <div data-thu="than-buoc" className="border-t" style={{ borderColor: MAU.vienMo }}>
                  {ma === "nha-minh" && <KhoangNhaMinh cheDo="quan-ly" />}
                  {ma === "lam-bai" && (
                    <KhoangNhaMinh
                      cheDo="lam-bai"
                      onLamBai={(tv, cheDo) => datDangLamCho({ tv, ...(cheDo ? { cheDo } : {}) })}
                    />
                  )}
                  {ma === "phan-tich" && (
                    <KhoangPhanTich
                      onLamNgay={() => {
                        // 🔴 Mở BƯỚC 2, không nhảy thẳng vào bài. Thẻ mới là chỗ chọn được
                        // "em tự làm" hay "bố mẹ trả lời hộ" — nhảy thẳng là chọn hộ người
                        // dùng một trong hai, và chọn sai thì bài về sai loại.
                        datDangMo("lam-bai");
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
        <button
          type="button"
          onClick={onXong}
          className="inline-flex min-h-[44px] items-center text-[13px] text-neutral-600 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: MAU.timCongNghe }}
        >
          ← {CHU_BUOC.ten["lam-bai"]}
        </button>
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
