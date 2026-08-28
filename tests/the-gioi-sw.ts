/**
 * THẾ GIỚI GIẢ CHO SERVICE WORKER — dựng `self` / `caches` / `fetch` rồi **chạy thật** ba
 * trình xử lý `install` · `activate` · `fetch` của `public/sw.js`.
 *
 * 🔴 VÌ SAO PHẢI LÀ HARNESS, KHÔNG PHẢI REGEX TRÊN MÃ NGUỒN. Bài học `16.9`: một cửa kiểm
 * không đo được thứ nó tưởng mình đo thì TỆ HƠN không có cửa, vì nó khiến người ta thôi
 * kiểm bằng mắt. `expect(nguon).toMatch(/navigate/)` chỉ chứng minh CHỮ có mặt trong file
 * — nó xanh y nguyên trên một service worker trả bản cũ cho tới hết đời máy.
 *
 * 🔴 DÙNG `new Function`, KHÔNG DÙNG `node:vm`. `vm` dựng realm riêng — đúng cái bẫy đã
 * cắn ở `17.4`, nơi `instanceof` trượt giữa hai realm và câu báo lỗi không hề nhắc tới
 * realm. `new Function` chạy cùng realm với test, nên thứ test cầm trên tay đúng là thứ
 * `sw.js` vừa tạo ra.
 *
 * 🔴 ĐỌC FILE BẰNG `process.cwd()`, không bằng `import.meta.url` — dưới jsdom nó không
 * phải URL `file://` (đã ghi ở `.claude/rules/tech-defaults.md`).
 *
 * File này KHÔNG có đuôi `.test.` nên Vitest không gom nó thành bộ test — nó là helper
 * dùng chung, theo đúng tiền lệ `tests/duong-vao-bai.ts` và `tests/giai-ma-qr.ts`.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const TEP_NGUON = join(process.cwd(), "public/sw.js");

const GOC_MAC_DINH = "https://disc.thu";

/** Bản trả lời giả. `sw.js` chỉ đụng tới `ok` · `type` · `clone()` · `json()`. */
export interface BanTraLoi {
  ok: boolean;
  type: string;
  noiDung: string;
  clone(): BanTraLoi;
  json(): Promise<unknown>;
  text(): Promise<string>;
}

/** Yêu cầu giả. `sw.js` chỉ đụng tới `url` · `method` · `mode`. */
export interface YeuCauGia {
  url: string;
  method: string;
  mode: string;
}

export interface TuyChonTheGioi {
  /** Nội dung máy chủ đang phục vụ, khoá theo đường dẫn (`"/"`, `"/a.js"`…). */
  mayChu?: Record<string, string>;
  /** Kho đã nằm sẵn trên máy trước khi service worker chạy, khoá theo TÊN KHO. */
  khoCoSan?: Record<string, Record<string, string>>;
  /** `"chet"` = mọi lượt `fetch` đều ném, mô phỏng mất mạng. */
  mang?: "song" | "chet";
  goc?: string;
  /** Giá trị thay cho mốc `__VAN_TAY__` trong mã nguồn. */
  vanTay?: string;
  /**
   * Đường dẫn tệp service worker cần nạp. Mặc định là `public/sw.js` (bản nguồn).
   *
   * 🔴 Truyền `out/sw.js` để chạy đúng BẢN SẼ SHIP — bản đã bị `sinh-danh-sach-cache.mjs`
   * thay chuỗi. Một phép thay chuỗi làm hỏng file thì nguồn vẫn xanh, và chỉ trình duyệt
   * của phụ huynh là chịu.
   */
  tepSw?: string;
}

export interface TheGioiSW {
  /** Tên kho mà bản `sw.js` vừa nạp đang dùng — đọc ra từ chính mã nguồn. */
  tenKho: string;
  /** Bộ đếm sống: đọc SAU khi đã chạy xong trình xử lý. */
  dem: { fetch: number; skipWaiting: number; claim: number };
  chayInstall(): Promise<void>;
  chayActivate(): Promise<void>;
  /** Trả `undefined` nghĩa là `sw.js` KHÔNG gọi `respondWith` — tức nó không đụng vào. */
  chayFetch(yc: YeuCauGia): Promise<BanTraLoi | undefined>;
  /** Nội dung một kho, khoá theo đường dẫn. Bỏ trống thì đọc kho của thế hệ này. */
  docKho(ten?: string): Record<string, string>;
  tenCacKho(): string[];
  datMang(trangThai: "song" | "chet"): void;
  datMayChu(bang: Record<string, string>): void;
}

export function taoBanTraLoi(
  noiDung: string,
  tuyChon: { ok?: boolean; type?: string } = {},
): BanTraLoi {
  const ban: BanTraLoi = {
    ok: tuyChon.ok ?? true,
    type: tuyChon.type ?? "basic",
    noiDung,
    clone: () => taoBanTraLoi(noiDung, tuyChon),
    json: async () => JSON.parse(noiDung) as unknown,
    text: async () => noiDung,
  };
  return ban;
}

/** Yêu cầu ĐIỀU HƯỚNG — thứ trình duyệt gửi khi người dùng mở/tải lại một trang. */
export function yeuCauDieuHuong(duong: string, goc = GOC_MAC_DINH): YeuCauGia {
  return { url: new URL(duong, goc).href, method: "GET", mode: "navigate" };
}

/** Yêu cầu TÀI SẢN — thứ trang gửi để lấy JS/CSS/font. */
export function yeuCauTaiSan(duong: string, goc = GOC_MAC_DINH): YeuCauGia {
  return { url: new URL(duong, goc).href, method: "GET", mode: "no-cors" };
}

export function dungTheGioi(tuyChon: TuyChonTheGioi = {}): TheGioiSW {
  const goc = tuyChon.goc ?? GOC_MAC_DINH;
  let mang: "song" | "chet" = tuyChon.mang ?? "song";
  let mayChu: Record<string, string> = { ...tuyChon.mayChu };
  const dem = { fetch: 0, skipWaiting: 0, claim: 0 };

  /** Khoá kho = href đầy đủ. `duongCua` rút lại thành `pathname + search` để tra bảng. */
  const khoaCua = (dv: string | YeuCauGia): string =>
    new URL(typeof dv === "string" ? dv : dv.url, goc).href;
  const duongCua = (href: string): string => {
    const u = new URL(href);
    return `${u.pathname}${u.search}`;
  };
  const boQuery = (href: string): string => {
    const u = new URL(href);
    u.search = "";
    return u.href;
  };

  async function fetchGia(dv: string | YeuCauGia): Promise<BanTraLoi> {
    dem.fetch += 1;
    if (mang === "chet") throw new TypeError("Failed to fetch");
    const noiDung = mayChu[duongCua(khoaCua(dv))];
    if (noiDung === undefined) return taoBanTraLoi("404", { ok: false });
    return taoBanTraLoi(noiDung);
  }

  class KhoGia {
    readonly muc = new Map<string, BanTraLoi>();

    async add(duong: string): Promise<void> {
      const tl = await fetchGia(duong);
      // Cache.add thật NÉM khi bản trả lời không ok — giữ đúng để nhánh `.catch` của
      // `sw.js` được thử thật, chứ không phải được cho qua vì fake dễ tính.
      if (!tl.ok) throw new TypeError(`Request for ${duong} failed`);
      this.muc.set(khoaCua(duong), tl);
    }

    async put(dv: string | YeuCauGia, tl: BanTraLoi): Promise<void> {
      this.muc.set(khoaCua(dv), tl);
    }

    async match(
      dv: string | YeuCauGia,
      tc: { ignoreSearch?: boolean } = {},
    ): Promise<BanTraLoi | undefined> {
      const can = khoaCua(dv);
      if (!tc.ignoreSearch) return this.muc.get(can);
      const canGon = boQuery(can);
      for (const [khoa, tl] of this.muc) if (boQuery(khoa) === canGon) return tl;
      return undefined;
    }
  }

  // Map giữ thứ tự chèn — và đó chính là thứ cửa ⑨ đo: `caches.match` toàn cục duyệt kho
  // theo THỨ TỰ TẠO, nên kho cũ (tạo trước) trả lời trước kho mới.
  const cacKho = new Map<string, KhoGia>();
  for (const [ten, muc] of Object.entries(tuyChon.khoCoSan ?? {})) {
    const kho = new KhoGia();
    for (const [duong, noiDung] of Object.entries(muc)) {
      kho.muc.set(khoaCua(duong), taoBanTraLoi(noiDung));
    }
    cacKho.set(ten, kho);
  }

  const cachesGia = {
    async open(ten: string): Promise<KhoGia> {
      let kho = cacKho.get(ten);
      if (!kho) {
        kho = new KhoGia();
        cacKho.set(ten, kho);
      }
      return kho;
    },
    async keys(): Promise<string[]> {
      return [...cacKho.keys()];
    },
    async delete(ten: string): Promise<boolean> {
      return cacKho.delete(ten);
    },
    async match(
      dv: string | YeuCauGia,
      tc: { ignoreSearch?: boolean } = {},
    ): Promise<BanTraLoi | undefined> {
      for (const kho of cacKho.values()) {
        const tl = await kho.match(dv, tc);
        if (tl) return tl;
      }
      return undefined;
    },
  };

  type SuKien = {
    request?: YeuCauGia;
    waitUntil?: (p: Promise<unknown>) => void;
    respondWith?: (p: Promise<unknown>) => void;
  };
  const trinhXuLy: Record<string, ((su: SuKien) => void) | undefined> = {};

  const selfGia = {
    addEventListener(ten: string, ham: (su: SuKien) => void) {
      trinhXuLy[ten] = ham;
    },
    location: { origin: goc },
    async skipWaiting(): Promise<void> {
      dem.skipWaiting += 1;
    },
    clients: {
      async claim(): Promise<void> {
        dem.claim += 1;
      },
    },
  };

  const nguon = readFileSync(tuyChon.tepSw ?? TEP_NGUON, "utf8")
    .split("__VAN_TAY__")
    .join(tuyChon.vanTay ?? "thu");
  const tenKho = /const TEN_KHO = "([^"]+)"/u.exec(nguon)?.[1];
  if (!tenKho) throw new Error("Không đọc được TEN_KHO từ public/sw.js");

  const nap = new Function("self", "caches", "fetch", nguon) as (
    s: typeof selfGia,
    c: typeof cachesGia,
    f: typeof fetchGia,
  ) => void;
  nap(selfGia, cachesGia, fetchGia);

  async function chay(ten: "install" | "activate"): Promise<void> {
    const ham = trinhXuLy[ten];
    if (!ham) throw new Error(`public/sw.js chưa đăng ký trình xử lý "${ten}"`);
    let cho: Promise<unknown> | undefined;
    ham({
      waitUntil: (p) => {
        cho = p;
      },
    });
    await cho;
  }

  return {
    tenKho,
    dem,
    chayInstall: () => chay("install"),
    chayActivate: () => chay("activate"),
    async chayFetch(yc) {
      const ham = trinhXuLy.fetch;
      if (!ham) throw new Error('public/sw.js chưa đăng ký trình xử lý "fetch"');
      let cho: Promise<unknown> | undefined;
      ham({
        request: yc,
        respondWith: (p) => {
          cho = p;
        },
      });
      return cho === undefined ? undefined : ((await cho) as BanTraLoi);
    },
    docKho(ten = tenKho) {
      const kho = cacKho.get(ten);
      if (!kho) return {};
      const ra: Record<string, string> = {};
      for (const [khoa, tl] of kho.muc) ra[duongCua(khoa)] = tl.noiDung;
      return ra;
    },
    tenCacKho: () => [...cacKho.keys()],
    datMang(trangThai) {
      mang = trangThai;
    },
    datMayChu(bang) {
      mayChu = { ...bang };
    },
  };
}

/** Bộ tài sản tối thiểu của một "bản build" — dùng chung cho các cửa dưới. */
export function banBuild(nhan: string): Record<string, string> {
  return {
    "/": `<html>${nhan}</html>`,
    "/danh-sach-cache.json": JSON.stringify(["/", `/_next/static/${nhan}.js`, "/nen.css"]),
    [`/_next/static/${nhan}.js`]: `console.log("${nhan}")`,
    "/nen.css": `body{content:"${nhan}"}`,
  };
}
