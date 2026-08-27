"use client";

import { useEffect } from "react";

/**
 * Đăng ký service worker.
 *
 * 🔴 ĐỘI DEV: đây là thứ TOÀN-ỨNG-DỤNG, không thuộc module DISC. App của các anh đã có
 * service worker riêng thì bỏ component này và bỏ luôn `public/sw.js`.
 *
 * Chỉ đăng ký ở bản dựng production: ở chế độ dev, service worker giữ lại bản cũ và làm
 * người sửa code tưởng mình sửa không ăn.
 */
export function DangKySW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Trình duyệt chặn thì mất tính năng NGOẠI TUYẾN, không mất gì khác.
    });
  }, []);

  return null;
}
