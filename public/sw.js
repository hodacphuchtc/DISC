/**
 * Service worker tối giản — cho phép làm bài khi mất mạng.
 *
 * 🔴 ĐỘI DEV ĐỌC KỸ: đây là thứ TOÀN-ỨNG-DỤNG, KHÔNG thuộc module DISC.
 * App của các anh đã có service worker riêng thì BỎ file này, bỏ `app/dang-ky-sw.tsx`,
 * và bỏ `scripts/sinh-danh-sach-cache.mjs` khỏi script `build`. Hai service worker trên
 * cùng một phạm vi sẽ giành nhau.
 *
 * 🔴 HAI LỖI ĐÃ TRẢ GIÁ (27/08/2026), đừng lặp lại:
 *  1. Chỉ cache "thứ tình cờ nhìn thấy" là KHÔNG ĐỦ: lần tải đầu tiên diễn ra TRƯỚC khi
 *     service worker kích hoạt, nên nó không thấy JS/CSS nào cả. Phải nạp sẵn theo danh
 *     sách sinh ra sau khi build (`/danh-sach-cache.json`).
 *  2. Mất mạng mà trả VỎ TRANG cho request `.js` thì trình duyệt nhận HTML ở chỗ đợi JS —
 *     trang lên nhưng KHÔNG BẤM ĐƯỢC GÌ, và không có lỗi nào hiện ra. Chỉ được trả vỏ
 *     trang cho request ĐIỀU HƯỚNG (`mode === "navigate"`).
 */

/**
 * 🔴 KHÔNG GÕ CỨNG TÊN KHO. `scripts/sinh-danh-sach-cache.mjs` thay mốc `__VAN_TAY__` bằng
 * vân tay của bản build sau mỗi `next build`, nên BYTE của file này đổi theo mỗi bản có
 * nội dung khác — và đó là thứ DUY NHẤT khiến trình duyệt chịu cài lại service worker.
 *
 * Gõ cứng thì ba thứ hỏng cùng lúc, và cả ba đều IM LẶNG: `install` không bao giờ chạy
 * lại · `activate` không bao giờ có kho nào để xoá · máy nào đã mở trang là kẹt ở bản đầu
 * tiên tới hết đời. Build vẫn xanh, test vẫn xanh, chỉ người dùng là đứng yên.
 */
const TEN_KHO = "disc-vo-__VAN_TAY__";
const DANH_SACH = "/danh-sach-cache.json";

self.addEventListener("install", (su) => {
  su.waitUntil(
    (async () => {
      const kho = await caches.open(TEN_KHO);
      try {
        const tl = await fetch(DANH_SACH, { cache: "no-store" });
        const duong = tl.ok ? await tl.json() : ["/"];
        // Nạp từng cái: một đường dẫn hỏng không được làm hỏng cả mẻ (addAll ném cả cụm).
        await Promise.all(duong.map((d) => kho.add(d).catch(() => undefined)));
      } catch {
        await kho.add("/").catch(() => undefined);
      }
      // 🔴 CỐ Ý KHÔNG GỌI `self.skipWaiting()`. Chiếm quyền ngay là xoá kho của thế hệ cũ
      // ngay dưới chân một tab đang mở — và tab đó, khi người dùng bấm *Sao lưu*, sẽ chạy
      // `await import("jspdf")` (ADR-009) xin một tên tệp băm không còn ở kho lẫn ở máy
      // chủ. Hỏng giữa phiên, im lặng. Đợi tới khi đóng hết tab thì không ai mất gì, và
      // người dùng vẫn thấy bản mới ngay lần tải trang kế tiếp vì điều hướng đi mạng trước.
    })(),
  );
});

self.addEventListener("activate", (su) => {
  su.waitUntil(
    (async () => {
      const ten = await caches.keys();
      await Promise.all(ten.filter((t) => t !== TEN_KHO).map((t) => caches.delete(t)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (su) => {
  const yc = su.request;

  // Chỉ lo GET cùng nguồn. Tuyệt đối không đụng thứ đi ra ngoài.
  if (yc.method !== "GET" || new URL(yc.url).origin !== self.location.origin) return;

  // HAI LOẠI YÊU CẦU, HAI LUẬT NGƯỢC NHAU — xem chú thích của từng hàm.
  su.respondWith(yc.mode === "navigate" ? dieuHuong(yc) : taiSan(yc));
});

/**
 * Ghi vào kho của ĐÚNG thế hệ này, bắn-rồi-quên.
 *
 * 🔴 Phải `clone()` NGAY, đồng bộ, trước khi thân bản trả lời bị đọc — đọc rồi thì clone
 * ném. Đó là lý do dòng clone không nằm trong `.then`.
 */
function ghiKho(yc, tl) {
  if (!tl.ok || tl.type !== "basic") return;
  const ban = tl.clone();
  caches
    .open(TEN_KHO)
    .then((kho) => kho.put(yc, ban))
    .catch(() => undefined);
}

/**
 * ĐIỀU HƯỚNG (vỏ trang HTML) — **MẠNG TRƯỚC**.
 *
 * 🔴 VÌ SAO KHÔNG KHO-TRƯỚC. HTML là thứ trỏ tới tên tệp JS đã băm. Lấy vỏ trang cũ trong
 * kho là khoá người dùng vào NGUYÊN một bản cũ — cả HTML lẫn đúng bộ chunk nó gọi — kể cả
 * khi máy chủ đã có bản mới. Đó chính là lỗi đã làm cả GĐ19 phải tồn tại: bản vá đẩy lên
 * mà không tới được máy nào đã từng mở trang.
 *
 * HTML ở đây là trang tĩnh vài chục KB; một lượt mạng cho nó không đáng kể. Mất mạng thì
 * rơi về kho y như cũ, nên khả năng ngoại tuyến không mất gì.
 */
async function dieuHuong(yc) {
  const kho = await caches.open(TEN_KHO);
  try {
    const tl = await fetch(yc);
    ghiKho(yc, tl);
    return tl;
  } catch (loi) {
    // Đúng trang đó trước; không có thì tới vỏ gốc, vì app điều hướng phía client.
    const vo = (await kho.match(yc, { ignoreSearch: true })) ?? (await kho.match("/"));
    if (vo) return vo;
    throw loi;
  }
}

/**
 * TÀI SẢN (JS/CSS/font đã băm tên) — **KHO TRƯỚC**.
 *
 * Tên có mã băm nội dung nên bất biến: đã nằm trong kho là chắc chắn đúng, hỏi lại mạng
 * chỉ tốn thời gian. Bản build mới sinh TÊN mới, nên nó tự nhiên là một lượt tải mới —
 * không cần cơ chế làm mới nào ở đây.
 *
 * 🔴 HÀM NÀY KHÔNG BAO GIỜ TRẢ VỎ TRANG. Mất mạng thì NÉM. Trả HTML cho một request `.js`
 * thì trình duyệt nhận HTML ở chỗ đang đợi JavaScript: trang LÊN nhưng không bấm được gì,
 * và `requestfailed` báo 0 nên không ai biết là đã hỏng (đã trả giá ở GĐ7). Luật đó nay
 * được giữ bằng CẤU TRÚC — hàm này không có nhánh nào trả HTML — chứ không bằng một câu
 * `if` mà lần sửa sau dễ nới ra.
 *
 * 🔴 TRA `kho.match` CHỨ KHÔNG `caches.match`. `caches.match` toàn cục duyệt MỌI kho theo
 * thứ tự tạo; lúc giao ca có hai thế hệ cùng tồn tại, nên nó trả về bản của thế hệ CŨ.
 */
async function taiSan(yc) {
  const kho = await caches.open(TEN_KHO);
  const daCo = await kho.match(yc, { ignoreSearch: true });
  if (daCo) return daCo;

  const tl = await fetch(yc);
  ghiKho(yc, tl);
  return tl;
}
