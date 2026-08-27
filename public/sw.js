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

const TEN_KHO = "disc-vo-v2";
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
      await self.skipWaiting();
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

  su.respondWith(
    (async () => {
      const daCo = await caches.match(yc, { ignoreSearch: true });
      if (daCo) return daCo;

      try {
        const tl = await fetch(yc);
        if (tl.ok && tl.type === "basic") {
          const ban = tl.clone();
          caches
            .open(TEN_KHO)
            .then((kho) => kho.put(yc, ban))
            .catch(() => undefined);
        }
        return tl;
      } catch (loi) {
        // 🔴 Chỉ điều hướng mới được nhận vỏ trang. Request JS/CSS mà nhận HTML thì
        // trang lên mà không bấm được gì — hỏng im lặng, tệ hơn lỗi mạng thật.
        if (yc.mode === "navigate") {
          const vo = await caches.match("/");
          if (vo) return vo;
        }
        throw loi;
      }
    })(),
  );
});
