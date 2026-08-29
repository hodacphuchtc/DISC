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

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const RA = "out";
const DUOI_NAP_SAN = [".html", ".js", ".css", ".woff2", ".woff"];

/**
 * Không nạp sẵn thứ chỉ dùng cho một trang tạm, quá nặng, hoặc tự nó là bộ máy nạp.
 *
 * `sw.js` và `danh-sach-cache.json` bị loại vì chính service worker nạp danh sách rồi tự
 * đi cache — cho nó cache luôn bản thân mình là vô nghĩa, và khi soi kho thì gây hiểu
 * nhầm rằng bản `sw.js` cũ đang được phục vụ từ kho (nó không — trình duyệt luôn lấy
 * script service worker thẳng từ mạng khi kiểm tra cập nhật).
 */
const BO_QUA = [/^thu-/u, /\.map$/u, /^sw\.js$/u, /^danh-sach-cache\.json$/u];

/** Mốc mà `public/sw.js` chừa sẵn cho vân tay bản build. */
const MOC_VAN_TAY = "__VAN_TAY__";

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

/**
 * DẠNG THƯ MỤC — `next.config.mjs` bật `trailingSlash: true`, nên trình duyệt xin
 * `/duong/dan/` chứ KHÔNG xin `/duong/dan/index.html`. Hai URL khác nhau ⇒ kho không khớp
 * ⇒ trang nào chưa từng mở thì mất mạng sẽ rơi về vỏ trang gốc.
 *
 * 🔴 ĐÃ ĐO 29/08/2026 — HÔM NAY ĐIỀU ĐÓ CHƯA HẠI AI. App chỉ có **một** route
 * (`app/page.tsx`); mọi "khoang" là trạng thái phía client, không phải trang. Nên dạng thư
 * mục duy nhất sinh ra là `/404/` và `/_not-found/`. Giữ ba dòng này vì chúng đúng và
 * miễn phí: ngày ai đó thêm route thật, kho phủ luôn mà không cần nhớ ra chuyện này.
 * **Đừng viết vào tài liệu rằng nó vá một lỗ người dùng đang gặp** — nó không.
 */
const dangThuMuc = tatCa
  .filter((d) => d.endsWith("/index.html"))
  .map((d) => d.slice(0, -"index.html".length));

// "/" là chính index.html ở gốc — trình duyệt xin đường dẫn này khi mở trang chủ.
const danhSach = [...new Set(["/", ...tatCa, ...dangThuMuc])].sort();

const noiDung = `${JSON.stringify(danhSach, null, 2)}\n`;
writeFileSync(join(RA, "danh-sach-cache.json"), noiDung);
console.log(`✅ out/danh-sach-cache.json — ${danhSach.length} mục`);

/**
 * VÂN TAY = băm của CHÍNH danh sách.
 *
 * Danh sách chứa tên tệp đã băm nội dung ⇒ **không bao giờ bỏ sót một thay đổi thật**. Đó
 * là tính chất bắt buộc: bỏ sót nghĩa là một bản vá không tới được máy người dùng.
 *
 * 🔴 ĐÃ ĐO 29/08/2026 — vân tay ĐỔI cả khi mã nguồn không đổi, và đó KHÔNG phải lỗi.
 * Next đúc một `buildId` ngẫu nhiên mỗi lần build (`/_next/static/<buildId>/…`), nên danh
 * sách khác đi giữa hai lần build giống hệt nhau. Hệ quả: mỗi lần deploy, máy người dùng
 * nạp lại kho. Chấp nhận được — sản phẩm ~1 MB thô và deploy thì hiếm.
 *
 * ĐỪNG "chữa" bằng `generateBuildId: () => "<hằng số>"`. Ghim vào hằng số thì hai bản
 * build KHÁC nội dung dùng chung đường dẫn `/_next/static/<hằng số>/_buildManifest.js`, và
 * `taiSan()` cache-first sẽ phục vụ bản cũ trên một đường dẫn trông như bất biến — đúng
 * loại lỗi mà cả GĐ19 sinh ra để chữa. Build ID ngẫu nhiên đang làm việc của nó.
 */
const vanTay = createHash("sha256").update(noiDung, "utf8").digest("hex").slice(0, 12);

const tepSw = join(RA, "sw.js");
const swNguon = readFileSync(tepSw, "utf8");

// 🔴 CỬA DỪNG BUILD. Vá hụt là loại lỗi im lặng tuyệt đối: build xanh, test xanh, gói vẫn
// đúng cỡ — chỉ máy người dùng là kẹt ở bản cũ tới hết đời, và không ai biết cho tới khi
// một bản vá quan trọng không tới nơi. Thà đỏ ở đây.
if (!swNguon.includes(MOC_VAN_TAY)) {
  console.error(
    `❌ out/sw.js không còn mốc "${MOC_VAN_TAY}".\n` +
      `   Tên kho sẽ đứng yên giữa các bản build ⇒ trình duyệt không bao giờ cài lại\n` +
      `   service worker ⇒ MỌI máy đã từng mở trang kẹt ở bản cũ vĩnh viễn.\n` +
      `   Sửa: trả lại 'const TEN_KHO = "disc-vo-${MOC_VAN_TAY}";' trong public/sw.js.`,
  );
  process.exit(1);
}

writeFileSync(tepSw, swNguon.split(MOC_VAN_TAY).join(vanTay));
console.log(`✅ out/sw.js — tên kho disc-vo-${vanTay}`);

/* ════════════════════════════════════════════════════════════════════════════════════
 * ĐẦU HTTP CHO HOST TĨNH — `out/_headers` (24.1)
 *
 * 🔴 VÌ SAO CẦN. Trước hạng mục này, bản deploy ra internet KHÔNG có một đầu bảo mật nào:
 * không CSP, không `X-Frame-Options`, không `Referrer-Policy`. Trang này giữ hồ sơ DISC
 * của trẻ trong IndexedDB, nên thiếu `frame-ancestors` là mở cửa cho clickjacking.
 * Cloudflare Pages đọc tệp `_headers` ở gốc thư mục xuất — đó là lý do nó sinh vào `out/`.
 *
 * 🔴 BA ĐIỀU PHẢI BIẾT TRƯỚC KHI SỬA FILE NÀY:
 *
 * ① `script-src` DÙNG BĂM, KHÔNG DÙNG `'unsafe-inline'`. Next nhét 2 khối `<script>` nội
 *    tuyến (payload hydration) vào mỗi trang, nên `script-src 'self'` trơn sẽ làm TRẮNG
 *    TRANG. Băm giải được chuyện đó — nhưng **băm đổi theo mỗi bản build**, nên tệp này
 *    BẮT BUỘC phải sinh tự động. Gõ tay một lần là lần deploy sau trang trắng.
 *
 * ② `style-src` BUỘC PHẢI CÓ `'unsafe-inline'`, và đó là CỐ Ý. Đã đo: có 8 thuộc tính
 *    `style="..."` do React đặt từ `MAU.*`. Thuộc tính style **không băm được** (băm chỉ
 *    áp cho phần tử `<style>`, không áp cho thuộc tính). Đừng "sửa" dòng này — nó không
 *    phải chỗ bỏ sót.
 *
 * ③ `frame-ancestors` MẶC ĐỊNH `'self'`, VÀ NÓ SẼ PHẢI ĐỔI. ADR-004 nói khoang DISC sẽ
 *    được **nhúng vào app chủ của SATA ROBO**. Ngày đó tới, `'self'` chính là thứ chặn
 *    đúng cái đang cần cho phép — trang sẽ hiện ra trắng trơn trong iframe và không ai
 *    hiểu tại sao. Đổi ở hằng `NGUON_NHUNG_CHO_PHEP` ngay dưới đây, không đổi chỗ khác.
 * ════════════════════════════════════════════════════════════════════════════════════ */

/**
 * 🔴 ĐỘI DEV APP CHỦ ĐỌC CHỖ NÀY. Thêm nguồn của app chủ vào đây khi nhúng khoang DISC
 * vào iframe, ví dụ: `["'self'", "https://app.satarobo.vn"]`. Để nguyên `'self'` thì
 * trang từ chối bị nhúng bởi bất kỳ nguồn nào khác — an toàn, nhưng nhúng không được.
 */
const NGUON_NHUNG_CHO_PHEP = ["'self'"];

/** Băm SHA-256 theo dạng CSP (`'sha256-<base64>'`) cho một đoạn script nội tuyến. */
function bamCsp(than) {
  return `'sha256-${createHash("sha256").update(than, "utf8").digest("base64")}'`;
}

const HTML = quet(RA).filter((d) => d.endsWith(".html"));

// Gom băm của MỌI script nội tuyến trong MỌI trang — Cloudflare `_headers` áp theo đường
// dẫn, và gom chung vào `/*` thì một trang không bị chặn bởi băm của trang khác.
const bam = new Set();
for (const tep of HTML) {
  const trang = readFileSync(tep, "utf8");
  for (const m of trang.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gu)) {
    bam.add(bamCsp(m[1]));
  }
}

if (bam.size === 0) {
  console.error(
    `❌ Không tìm thấy script nội tuyến nào trong ${HTML.length} trang HTML.\n` +
      `   Hoặc Next đã đổi cách dựng trang, hoặc biểu thức tìm script đã hỏng.\n` +
      `   Sinh CSP thiếu băm ⇒ trang TRẮNG sau khi deploy, mà local vẫn xanh.`,
  );
  process.exit(1);
}

const CSP = [
  "default-src 'self'",
  `script-src 'self' ${[...bam].join(" ")}`,
  // ② — xem chú thích trên. Cố ý, không phải bỏ sót.
  "style-src 'self' 'unsafe-inline'",
  // `data:` cho ảnh chia sẻ vẽ từ canvas; `blob:` cho tệp .zip và PDF tải về.
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // ADR-001: sản phẩm không gọi ra ngoài. `'self'` đủ cho service worker và tệp font.
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  `frame-ancestors ${NGUON_NHUNG_CHO_PHEP.join(" ")}`,
].join("; ");

const dauTrang = [
  "/*",
  `  Content-Security-Policy: ${CSP}`,
  "  X-Content-Type-Options: nosniff",
  "  Referrer-Policy: no-referrer",
  // Sản phẩm không dùng camera/mic/định vị. Tắt hẳn thì một thư viện lỡ tay cũng không xin được.
  "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()",
  "",
].join("\n");

writeFileSync(join(RA, "_headers"), dauTrang);
console.log(`✅ out/_headers — CSP với ${bam.size} băm script nội tuyến, ${HTML.length} trang`);
