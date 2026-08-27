/**
 * Sinh `out/danh-sach-cache.json` — danh sách tài sản service worker phải nạp sẵn.
 *
 * 🔴 Vì sao cần: tên tệp bundle có mã băm, không đoán được lúc viết code. Không có danh
 * sách này thì service worker chỉ cache được thứ nó TÌNH CỜ nhìn thấy — mà lần tải đầu
 * tiên diễn ra TRƯỚC khi nó kích hoạt, nên nó chẳng nhìn thấy gì. Kết quả: mất mạng thì
 * vỏ trang lên được nhưng không bấm được gì, và không có lỗi nào hiện ra.
 *
 * Chạy tự động sau `next build` (xem script `build` trong package.json).
 */

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const RA = "out";
const DUOI_NAP_SAN = [".html", ".js", ".css", ".woff2", ".woff"];

/** Không nạp sẵn thứ chỉ dùng cho một trang tạm hoặc quá nặng. */
const BO_QUA = [/^thu-/u, /\.map$/u];

function quet(thuMuc, gom = []) {
  for (const ten of readdirSync(thuMuc)) {
    const day = join(thuMuc, ten);
    if (statSync(day).isDirectory()) quet(day, gom);
    else gom.push(day);
  }
  return gom;
}

const tatCa = quet(RA)
  .map((d) => `/${relative(RA, d).split("\\").join("/")}`)
  .filter((d) => DUOI_NAP_SAN.some((x) => d.endsWith(x)))
  .filter((d) => !BO_QUA.some((r) => r.test(d.replace(/^\//u, ""))))
  .sort();

// "/" là chính index.html — trình duyệt xin đường dẫn này khi mở gốc.
const danhSach = ["/", ...tatCa];

writeFileSync(join(RA, "danh-sach-cache.json"), `${JSON.stringify(danhSach, null, 2)}\n`);
console.log(`✅ out/danh-sach-cache.json — ${danhSach.length} mục`);
