/**
 * Cấu hình ESLint (flat config).
 *
 * ⚠️ KHÔNG dùng `FlatCompat`: từ v16 `eslint-config-next` đã xuất thẳng mảng flat config.
 * Bọc thêm một lớp compat làm ESLint nổ "Converting circular structure to JSON" — lỗi
 * đọc lên chẳng liên quan gì tới nguyên nhân thật (đã trả giá 27/08/2026).
 */

import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const cauHinh = [
  // public/sw.js chạy trong ngữ cảnh Service Worker, không phải trình duyệt —
  // ESLint cấu hình cho web app sẽ báo nhầm về `self`.
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts", "public/**"] },
  ...coreWebVitals,
  ...typescript,
];

export default cauHinh;
