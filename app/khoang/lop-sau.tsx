"use client";

/**
 * LỚP BÓC SÂU của màn kết quả — tách khỏi `ket-qua.tsx` để giữ luật "không file > 500 dòng".
 *
 * Màn hình giữ ngắn y như trước; ai muốn đào thì bấm mở. Bản in mở sẵn tất cả.
 * Đây là chỗ trả lời câu "đọc xong rồi tôi phải làm gì?" — xem `config/disc-loi-khuyen.ts`.
 *
 * 🔴 GĐ10 — BA DẢI, MỖI DẢI MỘT NGƯỜI ĐỌC.
 * Một trang không có nghĩa là một người đọc. Bộ TH/THCS là chính em học sinh cầm máy, mà
 * trang lại chứa cả phần viết cho bố mẹ. Nên nội dung được gói vào `<section data-ban>`:
 *  · `chung`  — bốn trục, đọc được với mọi người, in kèm ở MỌI bản.
 *  · `con`    — em học sinh đọc về mình (chỉ TH/THCS).
 *  · `boMe`   — người lớn đọc về đứa trẻ (MN, QS, TH, THCS).
 *  · `tuMinh` — người lớn đọc về chính mình (chỉ PH).
 * Dải `boMe` khi trẻ đang cầm máy thì ĐÓNG SẴN sau một dải chắn. `data-ban` cũng là thứ
 * luật in trong `globals.css` bám vào để in tách bản.
 */

import { useState, type ReactNode } from "react";

import { TIEU_DE_LOP } from "@config/disc-bieu-hien";
import { CHU_BA_BAN, CHU_PHONG_CACH, TRUC } from "@config/disc-tu-dien";
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
  const { banCon, banBoMe, banTuMinh } = sau;

  // 🔴 AI ĐANG CẦM MÁY. Có `banCon` nghĩa là trẻ TỰ làm bài (TH/THCS) — đó là trường hợp
  // duy nhất mà một máy vừa có phần của con vừa có phần của bố mẹ, nên cũng là trường hợp
  // duy nhất cần dải chắn. Bộ MN/QS thì người lớn cầm máy từ đầu: chắn ở đó là chắn nhầm
  // người, bắt phụ huynh bấm thêm một nút để đọc thứ vốn viết cho họ.
  const treDangCamMay = Boolean(banCon);
  const [moBoMe, datMoBoMe] = useState(false);
  const hienBoMe = !treDangCamMay || moBoMe;

  const chuThe = (c: string) => thayChuThe(c, maBoDe, banCon ? "con" : "boMe");

  return (
    <div className="mt-10 space-y-3">
      {/* ── DẢI CHUNG ────────────────────────────────────────────────────────
          Bốn trục + pha. Không nói với riêng ai nên đi kèm MỌI bản in. */}
      <section data-ban="chung" className="space-y-3">
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
      </section>

      {/* ── DẢI CỦA CON / DẢI TỰ ĐỌC ─────────────────────────────────────────
          Cùng một khuôn `KhoiTuMinh`, khác người đọc nên khác `data-ban`. */}
      {banCon && (
        <section data-ban="con" className="space-y-3">
          <TenDai>{chuThe(CHU_BA_BAN.tenCon)}</TenDai>
          <KhoiTuDoc ban={banCon} tieuDeCangThang={chuThe(TIEU_DE_LOP.cangThang)} />
        </section>
      )}

      {banTuMinh && (
        <section data-ban="tuMinh" className="space-y-3">
          <TenDai>{chuThe(CHU_BA_BAN.tenTuMinh)}</TenDai>
          <KhoiTuDoc ban={banTuMinh} tieuDeCangThang={chuThe(TIEU_DE_LOP.cangThang)} />
        </section>
      )}

      {/* ── DẢI CHẮN ─────────────────────────────────────────────────────────
          Chỉ dựng khi chính đứa trẻ đang cầm máy. `data-khong-in`: trên giấy nó vô nghĩa,
          và bản in đã tách theo `data-ban` rồi. */}
      {banBoMe && treDangCamMay && (
        <section
          data-khong-in
          className="rounded-xl border border-dashed px-4 py-4"
          style={{ borderColor: MAU.camNangLuong }}
        >
          <h2 className="text-[15px] font-semibold text-neutral-900">
            {CHU_BA_BAN.chanTieuDe}
          </h2>
          <p className="mt-1 text-[14px] leading-relaxed text-neutral-600">
            {chuThe(CHU_BA_BAN.chanMoTa)}
          </p>
          <button
            type="button"
            aria-expanded={moBoMe}
            onClick={() => datMoBoMe(!moBoMe)}
            className="mt-3 min-h-[44px] rounded-xl px-4 text-[15px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: MAU.timCongNghe, outlineColor: MAU.timCongNghe }}
          >
            {moBoMe ? CHU_BA_BAN.chanDong : CHU_BA_BAN.chanNut}
          </button>
        </section>
      )}

      {/* ── DẢI CỦA BỐ MẸ ────────────────────────────────────────────────────
          🔴 LUÔN render, chỉ ẩn bằng CSS. Viết `{hienBoMe && <section/>}` là rơi đúng cạm
          bẫy GĐ9: nội dung không có trong DOM thì KHÔNG IN ĐƯỢC, và bản PDF của bố mẹ mất
          sạch phần lời khuyên. `globals.css` ép mọi `[data-ban]` hiện lại khi in. */}
      {banBoMe && (
        <section data-ban="boMe" className={hienBoMe ? "space-y-3" : "hidden"}>
          <TenDai>{CHU_BA_BAN.tenBoMe}</TenDai>

          <LopSau tieuDe={thayChuThe(TIEU_DE_LOP.noiChuyen, maBoDe, "boMe")}>
            <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {banBoMe.noiTheNao}
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
                  {banBoMe.cauNenNoi.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="khoi-in">
                <h3 className="text-[12px] font-semibold tracking-widest text-neutral-600 uppercase">
                  {TIEU_DE_LOP.cauNenTranh}
                </h3>
                <ul className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-neutral-600">
                  {banBoMe.cauNenTranh.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="khoi-in mt-5 text-[15px] leading-relaxed text-neutral-800">
              {banBoMe.cungHocTheNao}
            </p>
          </LopSau>

          <LopSau tieuDe={thayChuThe(TIEU_DE_LOP.cangThang, maBoDe, "boMe")}>
            <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {banBoMe.khiCangThang}
            </p>
          </LopSau>

          <LopSau tieuDe={TIEU_DE_LOP.linhHoat}>
            {/* 🔴 HAI VẾ PHẢI ĐI CÙNG NHAU. Bỏ vế bố mẹ tự chỉnh là biến lời khuyên thành
                "sửa đứa trẻ" — đúng thứ ADR-002 dựng ra để chặn. */}
            <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
              {banBoMe.kyNangThem}
            </p>
            <p className="khoi-in mt-3 text-[15px] leading-relaxed text-neutral-800">
              {banBoMe.boMeChinh}
            </p>
            <p className="khoi-in mt-5 rounded-lg bg-amber-50 px-3.5 py-3 text-[15px] leading-relaxed text-neutral-900">
              <strong className="font-semibold">{TIEU_DE_LOP.motViec} </strong>
              {banBoMe.motViecToiNay}
            </p>
          </LopSau>

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
        </section>
      )}
    </div>
  );
}

/** Hai lớp bóc sâu dùng chung cho bản của con và bản tự đọc của người lớn. */
function KhoiTuDoc({
  ban,
  tieuDeCangThang,
}: {
  readonly ban: { readonly khiCangThang: string; readonly tapThem: string; readonly motViecToiNay: string };
  readonly tieuDeCangThang: string;
}) {
  return (
    <>
      <LopSau tieuDe={tieuDeCangThang}>
        <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">
          {ban.khiCangThang}
        </p>
      </LopSau>
      <LopSau tieuDe={TIEU_DE_LOP.linhHoat}>
        <p className="khoi-in text-[15px] leading-relaxed text-neutral-800">{ban.tapThem}</p>
        <p className="khoi-in mt-5 rounded-lg bg-amber-50 px-3.5 py-3 text-[15px] leading-relaxed text-neutral-900">
          <strong className="font-semibold">{TIEU_DE_LOP.motViec} </strong>
          {ban.motViecToiNay}
        </p>
      </LopSau>
    </>
  );
}

/**
 * Tên dải — trên giấy nó là thứ cho biết tờ này viết cho ai.
 *
 * Trên màn hình cố ý để nhạt và nhỏ: người dùng đã biết mình là ai, nhãn to chỉ tổ chiếm chỗ.
 */
function TenDai({ children }: { readonly children: ReactNode }) {
  return (
    <p className="px-1 text-[11px] font-semibold tracking-widest text-neutral-500 uppercase">
      {children}
    </p>
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
