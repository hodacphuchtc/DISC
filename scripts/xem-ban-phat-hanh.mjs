/**
 * CHẠY THỬ BẢN PHÁT HÀNH TRÊN MÁY MÌNH.
 *
 * Chạy:  npm run xem-thu          (build lại rồi phục vụ)
 *        npm start               (phục vụ thư mục `out/` đang có)
 *        npm start -- 4000       (đổi cổng)
 *
 * 🔴 VÌ SAO CẦN FILE NÀY. Dự án dùng `output: "export"` nên `next start` KHÔNG chạy được —
 * script `start` cũ trỏ vào đó và chỉ ném lỗi. Mà `next dev` thì không phải thứ sẽ phát
 * hành: nó không có service worker thật, không có danh sách nạp sẵn, và Next 16 chặn mở
 * dev server thứ hai cho cùng một dự án nên không thể chạy song song hai bản.
 *
 * 🔴 KIỂU MIME PHẢI ĐÚNG — cạm bẫy đã trả giá ở GĐ7: trả vỏ trang HTML cho một request
 * `.js` thì trình duyệt nhận HTML ở chỗ đang đợi JavaScript. Trang vẫn hiện lên, nhưng
 * không bấm được gì, và `requestfailed` báo 0 nên không ai biết là đã hỏng.
 *
 * Không thêm phụ thuộc nào: chỉ dùng `node:http` (ADR-001 — thư viện ngoài duy nhất là jszip).
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const GOC = resolve(process.cwd(), "out");
const CONG = Number(process.argv[2] ?? process.env.CONG ?? 3100);

const KIEU_MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

if (!(await stat(GOC).catch(() => null))) {
  console.error(`Chưa có thư mục "out/". Chạy \`npm run build\` trước, hoặc dùng \`npm run xem-thu\`.`);
  process.exit(1);
}

createServer(async (yeuCau, traLoi) => {
  try {
    const duongDan = decodeURIComponent(new URL(yeuCau.url ?? "/", "http://x").pathname);
    // Chặn đi ngược lên trên thư mục `out/`.
    let tep = join(GOC, normalize(duongDan).replace(/^(\.\.[/\\])+/u, ""));
    if (!tep.startsWith(GOC)) {
      traLoi.writeHead(403).end("403");
      return;
    }

    let thongTin = await stat(tep).catch(() => null);
    if (thongTin?.isDirectory()) {
      tep = join(tep, "index.html");
      thongTin = await stat(tep).catch(() => null);
    }
    if (!thongTin && !extname(tep)) {
      // Đường dẫn không đuôi: thử `<đường-dẫn>.html`, rồi mới tới trang 404 tĩnh.
      const thuHtml = `${tep}.html`;
      if (await stat(thuHtml).catch(() => null)) {
        tep = thuHtml;
      } else {
        // Trả ĐÚNG mã 404 kèm trang 404 tĩnh. Trả 200 cho một đường dẫn không tồn tại là
        // nói dối trình duyệt, và làm mọi công cụ soi liên kết hỏng báo là mọi thứ vẫn ổn.
        const trang404 = join(GOC, "404.html");
        const co404 = await stat(trang404).catch(() => null);
        traLoi.writeHead(404, { "content-type": "text/html; charset=utf-8" });
        traLoi.end(co404 ? await readFile(trang404) : "404");
        return;
      }
      thongTin = await stat(tep).catch(() => null);
    }
    if (!thongTin) {
      traLoi.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("404");
      return;
    }

    traLoi.writeHead(200, {
      "content-type": KIEU_MIME[extname(tep)] ?? "application/octet-stream",
      // Không nhớ đệm: đang chạy thử thì lần build sau phải thấy ngay.
      "cache-control": "no-store",
    });
    traLoi.end(await readFile(tep));
  } catch (loi) {
    traLoi.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    traLoi.end(`500 ${loi instanceof Error ? loi.message : "lỗi không rõ"}`);
  }
}).listen(CONG, () => {
  console.log(`\n  Bản phát hành đang chạy:  http://localhost:${CONG}`);
  console.log(`  Thư mục phục vụ:          ${GOC}`);
  console.log(`  Dừng lại:                 Ctrl-C\n`);
  console.log(`  Nạp 8 bài mẫu: mở DevTools → Console → dán trọn`);
  console.log(`  tests/DATA_TEST/nap-vao-trinh-duyet.js\n`);
});
