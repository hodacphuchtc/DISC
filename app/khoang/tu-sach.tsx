"use client";

import { useEffect, useRef, useState } from "react";

import { MO_TA_KHOANG, TEN_KHOANG } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";

/**
 * TAB "TỦ SÁCH GIA ĐÌNH" (04/11/2026) — nhúng ứng dụng KHO_SACH (sách giáo khoa + vở bài
 * tập lớp 1–12) vào khung này, để phụ huynh đọc/tìm/tải ngay trong một ứng dụng.
 *
 * 🔴 KHO_SACH là dự án riêng, KHÔNG nằm trong repo này: nó chứa ảnh bìa có bản quyền NXB và
 * cần cổng `/api/anh` (Cloudflare Functions) để ghép PDF. Hai cách nhúng:
 *   ① CHẠY CỤC BỘ (localhost): dùng máy chủ thử của KHO_SACH ở cổng 4310 — nó có sẵn cổng
 *      ảnh nên nút "Tải PDF" chạy được. Bật bằng `npm run tu-sach` (xem `scripts/chay-tu-sach.mjs`).
 *   ② Bản dựng gắn vào `public/tu-sach/` bằng `scripts/gan-tu-sach.mjs` (gitignore). Đọc sách
 *      chạy được; tải PDF cần cổng ảnh nên chỉ chạy khi deploy có `/api/anh`.
 * Chưa có cách nào thì tab hiện hướng dẫn thay vì khung trắng.
 */
const CONG_THU_CUC_BO = "http://localhost:4310/index.html";
const DUONG_GAN_SAN = "/tu-sach/index.html";

type Nguon = { readonly dia: string; readonly coCongAnh: boolean } | null;

export function KhoangTuSach() {
  // undefined = đang dò; null = không có; còn lại = địa chỉ khung.
  const [nguon, datNguon] = useState<Nguon | undefined>(undefined);
  const khung = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let huy = false;
    const laMayNha = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const dua = (n: Nguon) => {
      if (!huy) datNguon(n);
    };
    const thuGanSan = () =>
      fetch("/tu-sach/phien-ban.txt", { cache: "no-store" })
        .then((r) => dua(r.ok ? { dia: DUONG_GAN_SAN, coCongAnh: false } : null))
        .catch(() => dua(null));
    if (laMayNha) {
      // `no-cors`: chỉ cần biết máy chủ có đang chạy không, không cần đọc nội dung.
      fetch(CONG_THU_CUC_BO, { mode: "no-cors", cache: "no-store" })
        .then(() => dua({ dia: CONG_THU_CUC_BO, coCongAnh: true }))
        .catch(thuGanSan);
    } else {
      void thuGanSan();
    }
    return () => {
      huy = true;
    };
  }, []);

  const toanManHinh = () => {
    const k = khung.current;
    if (!k) return;
    const yc = k.requestFullscreen ?? (k as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen;
    if (yc) void Promise.resolve(yc.call(k)).catch(() => undefined);
  };

  return (
    <section data-thu="khoang-tu-sach" className="px-5 py-6 md:px-12 md:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
            {TEN_KHOANG["tu-sach"]}
          </h1>
          <p className="mt-1.5 text-[14px] text-neutral-600">{MO_TA_KHOANG["tu-sach"]}</p>
        </div>
        {nguon && (
          <button
            type="button"
            data-thu="tu-sach-toan-man-hinh"
            onClick={toanManHinh}
            className="rounded-xl border px-4 py-2 text-[14px] font-semibold"
            style={{ borderColor: MAU.vienMo, color: MAU.timCongNghe }}
          >
            ⛶ Toàn màn hình
          </button>
        )}
      </div>

      {nguon && (
        <iframe
          ref={khung}
          data-thu="khung-tu-sach"
          title={TEN_KHOANG["tu-sach"]}
          src={nguon.dia}
          allow="fullscreen"
          allowFullScreen
          className="mt-4 h-[calc(100dvh-150px)] min-h-[560px] w-full rounded-2xl border bg-white"
          style={{ borderColor: MAU.vienMo }}
        />
      )}

      {nguon && !nguon.coCongAnh && (
        <p
          data-thu="tu-sach-thieu-cong-anh"
          className="mt-3 text-[13px] leading-relaxed text-neutral-600"
        >
          Bản này chưa có cổng ảnh nên nút “Tải PDF” chưa chạy; đọc sách vẫn bình thường. Chạy{" "}
          <code>npm run tu-sach</code> để dùng đầy đủ.
        </p>
      )}

      {nguon === null && (
        <div
          data-thu="tu-sach-chua-gan"
          role="status"
          className="mt-5 rounded-2xl px-5 py-4 text-[14px] leading-relaxed"
          style={{ backgroundColor: "#FFF4E6", color: MAU.camDamChoChu }}
        >
          <p className="font-semibold">Tủ sách chưa được gắn vào bản này.</p>
          <p className="mt-1.5">
            Chạy <code>npm run tu-sach</code> (cần thư mục KHO_SACH đã dựng) rồi tải lại trang.
          </p>
        </div>
      )}
    </section>
  );
}
