#!/usr/bin/env node
/**
 * CỬA CANH CỠ GÓI CHÍNH — chạy SAU `npm run build` (16.6).
 *
 * 🔴 VÌ SAO PHẢI CÓ CỬA NÀY. Từ 16.6 sản phẩm có `jspdf`, và nó nặng hơn cả phần còn lại
 * cộng lại. Nó chỉ được vào bằng `await import()`, nên nằm ở một chunk riêng và chỉ tải
 * khi người dùng bấm *Sao lưu*. Nhưng một `import` tĩnh lỡ tay ở bất kỳ file nào sẽ kéo
 * nó vào gói chính — và **không cửa nào khác bắt được**: typecheck xanh, lint xanh, test
 * xanh, build xanh. Chỉ điện thoại 3G của phụ huynh là chịu, và không ai biết cho tới lúc
 * có người phàn nàn.
 *
 * 🔴 ĐO ĐÚNG THỨ NGƯỜI DÙNG PHẢI TẢI: chỉ những tệp `.js` mà `out/index.html` tham chiếu
 * trực tiếp. Cộng cả `out/_next/static` là đếm luôn các chunk nạp lười — tức là đo sai
 * theo hướng bi quan, rồi ngưỡng phải nới ra, rồi cửa hết tác dụng.
 *
 * Chạy: `npm run check:goi` (cần `out/` — tức là phải build trước).
 */

import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";

/** Mốc đo được ngày 28/08/2026 sau khi thêm jspdf nạp lười: 287 KB gzip. */
const TRAN_KB_GZIP = 300;

/** Dấu vết nhận ra thư viện PDF trong một tệp đã nén tên biến. */
const DAU_VET_PDF = "jsPDF";

if (!existsSync("out/index.html")) {
  console.error("❌ Chưa có out/index.html. Chạy `npm run build` trước đã.");
  process.exit(1);
}

const html = readFileSync("out/index.html", "utf8");
const duong = [
  ...new Set([...html.matchAll(/\/_next\/static\/[^"'\s>]+\.js/gu)].map((m) => m[0])),
];

if (duong.length === 0) {
  console.error("❌ Không thấy tệp .js nào trong out/index.html — cửa này đang đo hụt.");
  process.exit(1);
}

let nen = 0;
let tho = 0;
const dinhPdf = [];
for (const d of duong) {
  const b = readFileSync(`out${d}`);
  tho += b.length;
  nen += gzipSync(b).length;
  if (b.toString("utf8").includes(DAU_VET_PDF)) dinhPdf.push(d);
}

const kb = nen / 1024;
console.log(
  `Gói chính (${duong.length} tệp nạp ngay): ${(tho / 1024).toFixed(0)} KB thô / ` +
    `${kb.toFixed(0)} KB gzip — trần ${TRAN_KB_GZIP} KB`,
);

let hong = false;

if (dinhPdf.length > 0) {
  console.error(
    `❌ Thư viện PDF lọt vào GÓI CHÍNH: ${dinhPdf.join(", ")}\n` +
      `   Ai đó vừa import tĩnh nó. Phải là \`await import("jspdf")\`.`,
  );
  hong = true;
}

if (kb > TRAN_KB_GZIP) {
  console.error(
    `❌ Gói chính ${kb.toFixed(0)} KB gzip, vượt trần ${TRAN_KB_GZIP} KB.\n` +
      `   Tìm thứ vừa thêm vào, hoặc nạp lười nó. Nâng trần là lựa chọn CUỐI CÙNG,\n` +
      `   và phải nói rõ trong commit vì sao người dùng 3G nên chịu thêm.`,
  );
  hong = true;
}

if (hong) process.exit(1);
console.log("✅ Gói chính trong giới hạn, và không dính thư viện PDF.");
