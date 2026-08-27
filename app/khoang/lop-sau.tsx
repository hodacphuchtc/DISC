"use client";

/**
 * LỚP BÓC SÂU của màn kết quả — tách khỏi `ket-qua.tsx` để giữ luật "không file > 500 dòng".
 *
 * Màn hình giữ ngắn y như trước; ai muốn đào thì bấm mở. Bản in mở sẵn tất cả.
 * Đây là chỗ trả lời câu "đọc xong rồi tôi phải làm gì?" — xem `config/disc-loi-khuyen.ts`.
 */

import { useState, type ReactNode } from "react";

import { TIEU_DE_LOP } from "@config/disc-bieu-hien";
import { CHU_PHONG_CACH, TRUC } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import type { MaBoDe } from "@modules/core/bo-de/kieu";
import { thayChuThe, type DienGiaiDay } from "@modules/report/dien-giai";
import type { KetQuaPhongCach } from "@modules/report/doi-chieu-phong-cach";

export function LopSauKetQua({
  sau,
  maBoDe,
  phongCach,
  onLamBoPhuHuynh,
}: {
  readonly sau: DienGiaiDay;
  readonly maBoDe: MaBoDe;
  /** `null` khi còn đang đọc kho. Không dựng khối nào cho tới lúc biết chắc. */
  readonly phongCach?: KetQuaPhongCach | null;
  /** Thiếu callback thì không mời làm bộ Phụ huynh. */
  readonly onLamBoPhuHuynh?: () => void;
}) {
  // Chỉ bộ người lớn đọc về trẻ mới hiện bản của bố mẹ ở bước này. Bộ TH/THCS cũng đã CÓ
  // `sau.banBoMe`, nhưng đứa trẻ đang cầm máy — dải riêng có chắn là việc của hạng mục 1.4.
  const banBoMeHienDuoc = maBoDe === "MN" || maBoDe === "QS" ? sau.banBoMe : undefined;
  const banTuDoc = sau.banCon ?? sau.banTuMinh;

  return (
    <>
    {/* ── LỚP BÓC SÂU ─────────────────────────────────────────────────────
        Màn hình giữ ngắn y như cũ; ai muốn đào thì bấm mở. Bản in mở sẵn tất cả.
        🔴 Nội dung LUÔN nằm trong DOM, chỉ ẩn bằng CSS — viết {mo && <div/>} thì lúc in
        nội dung không tồn tại và bản PDF mất đúng phần sâu nhất. */}
    <div className="mt-10 space-y-3">
      <LopSau tieuDe={TIEU_DE_LOP.phoBonNhom}>
        {sau.banKhoan && (
          <p className="khoi-in mb-5 rounded-lg bg-neutral-50 px-3.5 py-3 text-[14px] leading-relaxed text-neutral-700">
            {sau.banKhoan.loiMoDau}
          </p>
        )}
        <ul className="space-y-6">
          {sau.phoBonNhom.map((t) => (
            <li key={t.truc} className="khoi-in">
              <h3 className="flex items-baseline gap-2 text-[15px] font-semibold text-neutral-900">
                <span aria-hidden="true" style={{ color: TRUC[t.truc].mau }}>
                  ■
                </span>
                {TRUC[t.truc].ten}
                <span className="text-[13px] font-normal tabular-nums text-neutral-600">
                  {t.diem}
                  {t.viTri === "noiNhat" && " · nổi nhất"}
                  {t.viTri === "nheNhat" && " · nhẹ nhất"}
                </span>
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-800">{t.bieuHien}</p>
              {t.mucDoRo && (
                <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-800">{t.mucDoRo}</p>
              )}
              <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-800">{t.than}</p>
              {t.choCanDeY && (
                <p className="mt-1.5 text-[15px] leading-relaxed text-neutral-700">
                  {t.choCanDeY}
                </p>
              )}
            </li>
          ))}
        </ul>
        {sau.pha && (
          <p className="khoi-in mt-6 border-t border-neutral-200 pt-4 text-[15px] leading-relaxed text-neutral-800">
            <strong className="font-semibold">{sau.pha.tieuDe}.</strong> {sau.pha.than}
          </p>
        )}
      </LopSau>

      {banBoMeHienDuoc && (
        <>
          <LopSau tieuDe={thayChuThe(TIEU_DE_LOP.noiChuyen, maBoDe)}>
            <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {banBoMeHienDuoc.noiTheNao}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="khoi-in">
                <h3
                  className="text-[12px] font-semibold tracking-widest uppercase"
                  style={{ color: MAU.camDamChoChu }}
                >
                  {TIEU_DE_LOP.cauNenNoi}
                </h3>
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-neutral-800">
                  {banBoMeHienDuoc.cauNenNoi.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="khoi-in">
                <h3 className="text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
                  {TIEU_DE_LOP.cauNenTranh}
                </h3>
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-neutral-600">
                  {banBoMeHienDuoc.cauNenTranh.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="khoi-in mt-5 text-[15px] leading-relaxed text-neutral-800">
              {banBoMeHienDuoc.cungHocTheNao}
            </p>
          </LopSau>

          <LopSau tieuDe={thayChuThe(TIEU_DE_LOP.cangThang, maBoDe)}>
            <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {banBoMeHienDuoc.khiCangThang}
            </p>
          </LopSau>

          <LopSau tieuDe={TIEU_DE_LOP.linhHoat}>
            {/* 🔴 HAI VẾ PHẢI ĐI CÙNG NHAU. Bỏ vế bố mẹ tự chỉnh là biến lời khuyên thành
                "sửa đứa trẻ" — đúng thứ ADR-002 dựng ra để chặn. */}
            <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {banBoMeHienDuoc.kyNangThem}
            </p>
            <p className="khoi-in mt-3 text-[15px] leading-relaxed text-neutral-800">
              {banBoMeHienDuoc.boMeChinh}
            </p>
            <p className="khoi-in mt-5 rounded-lg bg-amber-50 px-3.5 py-3 text-[15px] leading-relaxed text-neutral-900">
              <strong className="font-semibold">{TIEU_DE_LOP.motViec} </strong>
              {banBoMeHienDuoc.motViecToiNay}
            </p>
          </LopSau>
        </>
      )}

      {banTuDoc && (
        <>
          <LopSau tieuDe={thayChuThe(TIEU_DE_LOP.cangThang, maBoDe)}>
            <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {banTuDoc.khiCangThang}
            </p>
          </LopSau>
          <LopSau tieuDe={TIEU_DE_LOP.linhHoat}>
            <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {banTuDoc.tapThem}
            </p>
            <p className="khoi-in mt-5 rounded-lg bg-amber-50 px-3.5 py-3 text-[15px] leading-relaxed text-neutral-900">
              <strong className="font-semibold">{TIEU_DE_LOP.motViec} </strong>
              {banTuDoc.motViecToiNay}
            </p>
          </LopSau>
        </>
      )}

      {phongCach?.ghepDuoc && (
        <LopSau tieuDe={CHU_PHONG_CACH.tieuDe}>
          <p className="khoi-in text-[14px] leading-relaxed text-neutral-600">
            {CHU_PHONG_CACH.moTa}
          </p>
          <ul className="mt-4 space-y-1.5">
            {phongCach.bang.map((r) => (
              <li
                key={r.truc}
                className="khoi-in flex items-baseline gap-2 text-[14px] text-neutral-800"
              >
                <span aria-hidden="true" style={{ color: TRUC[r.truc].mau }}>
                  ■
                </span>
                <span className="min-w-[86px] font-medium">{TRUC[r.truc].ten}</span>
                <span className="tabular-nums text-neutral-600">
                  {CHU_PHONG_CACH.nhanBoMe} {r.diemBoMe} · {CHU_PHONG_CACH.nhanCon}{" "}
                  {r.diemCon}
                </span>
                <span className="text-[13px]" style={{ color: r.mau }}>
                  {r.nhan}
                </span>
              </li>
            ))}
          </ul>
          {phongCach.dienGiai.length > 0 ? (
            <div className="mt-5 space-y-3">
              {phongCach.dienGiai.map((d) => (
                <p
                  key={d.truc}
                  className="khoi-in text-[15px] leading-relaxed text-neutral-800"
                >
                  {d.than}
                </p>
              ))}
            </div>
          ) : (
            <p className="khoi-in mt-5 text-[15px] leading-relaxed text-neutral-800">
              {CHU_PHONG_CACH.ratGiongNhau}
            </p>
          )}
        </LopSau>
      )}

      {phongCach && !phongCach.ghepDuoc && phongCach.lyDo === "THIEU_BAI_BO_ME" && onLamBoPhuHuynh && (
        <section
          data-khong-in
          className="rounded-xl border border-dashed border-neutral-300 px-4 py-4"
        >
          <h2 className="text-[15px] font-semibold text-neutral-900">
            {CHU_PHONG_CACH.moiTieuDe}
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-neutral-600">
            {CHU_PHONG_CACH.moiMoTa}
          </p>
          <button
            type="button"
            onClick={onLamBoPhuHuynh}
            className="mt-3 min-h-[44px] rounded-xl px-4 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
          >
            {CHU_PHONG_CACH.moiNut}
          </button>
        </section>
      )}
    </div>
    </>
  );
}

/**
 * Một lớp bóc sâu: màn hình đóng sẵn, bản in mở sẵn.
 *
 * 🔴 Ba chỗ dễ làm hỏng bản in, đã tránh sẵn:
 *  1. Nội dung LUÔN render, chỉ ẩn bằng class. Viết `{mo && …}` thì lúc in nó không tồn
 *     tại trong DOM, và bản PDF mất đúng phần sâu nhất.
 *  2. KHÔNG dùng `<details>`: trình duyệt ẩn phần thân qua `::details-content`, CSS in
 *     không đè chắc được.
 *  3. Tiêu đề nằm trong nút bấm, mà nút thì `data-khong-in` — nên có thêm bản `.chi-in`
 *     để trên giấy vẫn biết đoạn văn này thuộc mục nào.
 *
 * Trạng thái mở mặc định là HẰNG SỐ `false`, không đọc localStorage lúc render — trang
 * dựng tĩnh (`output: 'export'`) mà đọc trạng thái lúc render là lệch hydrate.
 */
export function LopSau({
  tieuDe,
  children,
}: {
  readonly tieuDe: string;
  readonly children: ReactNode;
}) {
  const [mo, datMo] = useState(false);
  return (
    <section className="rounded-xl border border-neutral-200">
      <button
        type="button"
        data-khong-in
        aria-expanded={mo}
        onClick={() => datMo(!mo)}
        className="flex min-h-[48px] w-full items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ outlineColor: MAU.timCongNghe }}
      >
        <span className="text-[15px] font-semibold text-neutral-900">{tieuDe}</span>
        <span aria-hidden="true" className="shrink-0 text-[18px] text-neutral-500">
          {mo ? "−" : "+"}
        </span>
      </button>
      <div data-lop-sau className={mo ? "px-4 pb-4" : "hidden"}>
        <h2 className="chi-in mb-2 text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
          {tieuDe}
        </h2>
        {children}
      </div>
    </section>
  );
}
