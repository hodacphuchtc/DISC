"use client";

import { useEffect, useState } from "react";

import { MO_TA_KHOANG, TEN_KHOANG } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";

/**
 * TAB "TỦ SÁCH GIA ĐÌNH" (04/11/2026) — nhúng ứng dụng KHO_SACH (sách giáo khoa + vở bài
 * tập lớp 1–12) vào khung này, để phụ huynh đọc/tìm/tải ngay trong một ứng dụng.
 *
 * 🔴 KHO_SACH là dự án riêng, KHÔNG nằm trong repo này: nó chứa ảnh bìa có bản quyền NXB và
 * cần cổng `/api/anh` của Cloudflare Functions. Bản dựng của nó được gắn vào `public/tu-sach/`
 * lúc build bằng `scripts/gan-tu-sach.mjs` (thư mục đó bị gitignore). Chưa gắn thì tab hiện
 * hướng dẫn thay vì khung trắng.
 */
const DUONG_TU_SACH = "/tu-sach/";

export function KhoangTuSach() {
  // null = đang kiểm; true = có bản dựng; false = chưa gắn.
  const [co, datCo] = useState<boolean | null>(null);

  useEffect(() => {
    let huy = false;
    fetch(`${DUONG_TU_SACH}phien-ban.txt`, { cache: "no-store" })
      .then((r) => {
        if (!huy) datCo(r.ok);
      })
      .catch(() => {
        if (!huy) datCo(false);
      });
    return () => {
      huy = true;
    };
  }, []);

  return (
    <section data-thu="khoang-tu-sach" className="px-5 py-6 md:px-12 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        {TEN_KHOANG["tu-sach"]}
      </h1>
      <p className="mt-1.5 text-[14px] text-neutral-600">{MO_TA_KHOANG["tu-sach"]}</p>

      {co === true && (
        <iframe
          data-thu="khung-tu-sach"
          title={TEN_KHOANG["tu-sach"]}
          src={`${DUONG_TU_SACH}index.html`}
          className="mt-5 h-[78dvh] w-full rounded-2xl border bg-white"
          style={{ borderColor: MAU.vienMo }}
        />
      )}

      {co === false && (
        <div
          data-thu="tu-sach-chua-gan"
          role="status"
          className="mt-5 rounded-2xl px-5 py-4 text-[14px] leading-relaxed"
          style={{ backgroundColor: "#FFF4E6", color: MAU.camDamChoChu }}
        >
          <p className="font-semibold">Tủ sách chưa được gắn vào bản này.</p>
          <p className="mt-1.5">
            Chạy <code>node scripts/gan-tu-sach.mjs</code> để gắn bản dựng của KHO_SACH vào
            ứng dụng, rồi tải lại trang.
          </p>
        </div>
      )}
    </section>
  );
}
