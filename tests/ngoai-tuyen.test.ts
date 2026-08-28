import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { banBuild, dungTheGioi, yeuCauDieuHuong, yeuCauTaiSan } from "./the-gioi-sw";

const GOC = process.cwd();
const SW = join(GOC, "public/sw.js");
const RA = join(GOC, "out");
const DANH_SACH = join(RA, "danh-sach-cache.json");

/** Mã nguồn service worker — dùng chung cho cả cửa đọc-nguồn lẫn cửa hiện vật. */
const nguon = readFileSync(SW, "utf8");

/**
 * Canh service worker. Hai lỗi đã trả giá 27/08/2026 và cả hai đều IM LẶNG:
 *  1. Chỉ cache "thứ tình cờ thấy" ⇒ mất mạng thì trang lên mà không bấm được gì.
 *  2. Trả vỏ trang cho request .js ⇒ trình duyệt nhận HTML ở chỗ đợi JS, cũng không
 *     bấm được gì, và `requestfailed` báo 0 nên chẳng ai biết hỏng.
 */
describe("service worker — ngoại tuyến", () => {
  it("có file public/sw.js", () => {
    expect(existsSync(SW)).toBe(true);
  });

  it("chỉ nhận GET cùng nguồn — không đụng thứ đi ra ngoài", () => {
    expect(nguon).toMatch(/yc\.method !== "GET"/u);
    expect(nguon).toMatch(/origin !== self\.location\.origin/u);
  });

  it("dọn kho cũ khi đổi phiên bản", () => {
    expect(nguon).toMatch(/caches\.delete/u);
  });

  it("🔴 nạp sẵn theo DANH SÁCH sinh sau build, không dựa vào 'thứ tình cờ thấy'", () => {
    expect(nguon).toMatch(/danh-sach-cache\.json/u);
  });

  it("🔴 CHỈ điều hướng mới được nhận vỏ trang khi mất mạng", () => {
    expect(nguon).toMatch(/yc\.mode === "navigate"/u);
  });

  it("nạp từng mục một — một đường dẫn hỏng không làm hỏng cả mẻ", () => {
    expect(nguon).toMatch(/kho\.add\(d\)\.catch/u);
    // Kiểm LỜI GỌI, không kiểm chữ: chính bình luận cảnh báo trong sw.js có chứa từ này.
    expect(nguon, "addAll ném cả cụm khi một mục hỏng").not.toMatch(/\.addAll\(/u);
  });

  it("chỉ đăng ký ở bản production", () => {
    expect(readFileSync(join(GOC, "app/dang-ky-sw.tsx"), "utf8")).toMatch(
      /NODE_ENV !== "production"/u,
    );
  });

  it("nói rõ với đội dev rằng đây là thứ TOÀN-ỨNG-DỤNG, không thuộc module DISC", () => {
    expect(nguon).toMatch(/TOÀN-ỨNG-DỤNG/u);
    expect(readFileSync(join(GOC, "app/dang-ky-sw.tsx"), "utf8")).toMatch(/TOÀN-ỨNG-DỤNG/u);
  });
});

describe("danh sách nạp sẵn — sinh sau build", () => {
  it("🔴 mọi đường dẫn trong danh sách đều CÓ THẬT trong out/", () => {
    if (!existsSync(DANH_SACH)) return; // chưa build thì bỏ qua
    const ds: string[] = JSON.parse(readFileSync(DANH_SACH, "utf8"));
    expect(ds.length).toBeGreaterThan(3);
    for (const d of ds) {
      // Dạng thư mục (`/khoang/nha-minh/`) phải quy về đúng `index.html` của nó — kiểm
      // `existsSync` trên thư mục thì một thư mục rỗng cũng lọt.
      const tep = d.endsWith("/") ? `${d.replace(/^\//u, "")}index.html` : d.replace(/^\//u, "");
      expect(existsSync(join(RA, tep)), `danh sách trỏ tới "${d}" nhưng out/${tep} không có`).toBe(
        true,
      );
    }
  });

  it("🔴 mỗi trang con có CẢ dạng thư mục — trailingSlash làm trình duyệt xin dạng đó", () => {
    if (!existsSync(DANH_SACH)) return;
    const ds: string[] = JSON.parse(readFileSync(DANH_SACH, "utf8"));

    const thieu = ds
      .filter((d) => d.endsWith("/index.html"))
      .map((d) => d.slice(0, -"index.html".length))
      .filter((d) => !ds.includes(d));

    expect(thieu, "thiếu dạng thư mục ⇒ mất mạng thì trang con rơi về trang chủ").toEqual([]);
    expect(ds.filter((d) => d.endsWith("/") && d !== "/").length).toBeGreaterThan(0);
  });

  it("có đủ HTML, JS và CSS — thiếu một loại là mất mạng không dùng được", () => {
    if (!existsSync(DANH_SACH)) return;
    const ds: string[] = JSON.parse(readFileSync(DANH_SACH, "utf8"));
    expect(ds.some((d) => d.endsWith(".js")), "không có JS nào").toBe(true);
    expect(ds.some((d) => d.endsWith(".css")), "không có CSS nào").toBe(true);
    expect(ds).toContain("/");
  });

  it("KHÔNG nạp sẵn trang tạm — chúng bị gỡ ở hạng mục 8.3", () => {
    if (!existsSync(DANH_SACH)) return;
    const ds: string[] = JSON.parse(readFileSync(DANH_SACH, "utf8"));
    expect(ds.filter((d) => d.includes("/thu-"))).toEqual([]);
  });
});

/**
 * ═══════════════════════════════════════════════════════════════════════════════════
 * CỬA HÀNH VI — chạy THẬT ba trình xử lý của `public/sw.js` trong một thế giới giả.
 *
 * 🔴 Chín cửa dưới đây tồn tại vì tám cửa phía trên KHÔNG đủ: chúng đọc mã nguồn bằng
 * biểu thức chính quy, nên chúng xanh y nguyên trên một service worker trả bản cũ cho
 * tới hết đời máy — đúng bệnh mà bài học `16.9` đã cảnh báo.
 * ═══════════════════════════════════════════════════════════════════════════════════
 */
describe("service worker — HÀNH VI THẬT", () => {
  it("① install nạp đủ danh sách vào kho MANG TÊN THẾ HỆ NÀY", async () => {
    const tg = dungTheGioi({ mayChu: banBuild("v1") });
    await tg.chayInstall();

    const kho = tg.docKho();
    expect(Object.keys(kho).sort()).toEqual(["/", "/_next/static/v1.js", "/nen.css"]);
    expect(kho["/"]).toBe("<html>v1</html>");
  });

  it("② activate xoá kho của thế hệ khác nhưng GIỮ kho của mình", async () => {
    const tg = dungTheGioi({
      mayChu: banBuild("v2"),
      khoCoSan: { "disc-vo-doi-truoc": { "/": "<html>đời trước</html>" } },
    });
    await tg.chayInstall();
    await tg.chayActivate();

    expect(tg.tenCacKho()).toEqual([tg.tenKho]);
  });

  it("🔴 ②b hai bản build khác nhau phải cho HAI TÊN KHO khác nhau", () => {
    // Đây là hình hài hành vi của lỗi gốc B: tên kho gõ cứng ⇒ `activate` ở trên không
    // bao giờ có kho nào để xoá, vì mọi bản build đều dùng đúng một cái tên.
    const a = dungTheGioi({ vanTay: "aaaaaaaaaaaa" });
    const b = dungTheGioi({ vanTay: "bbbbbbbbbbbb" });

    expect(
      b.tenKho,
      "tên kho không đổi theo bản build ⇒ máy người dùng kẹt ở bản đầu tiên vĩnh viễn",
    ).not.toBe(a.tenKho);
  });

  it("🔴 ③ install KHÔNG gọi skipWaiting — tab đang mở phải giữ nguyên kho cũ", async () => {
    const tg = dungTheGioi({ mayChu: banBuild("v1") });
    await tg.chayInstall();

    expect(
      tg.dem.skipWaiting,
      "chiếm quyền ngay rồi xoá kho cũ ⇒ phiên đang mở bấm Sao lưu thì await import(jspdf) xin một chunk không còn tồn tại",
    ).toBe(0);
  });

  it("🔴 ④ điều hướng khi mạng SỐNG phải ra bản MỚI của máy chủ, không ra bản trong kho", async () => {
    const tg = dungTheGioi({ mayChu: banBuild("cu") });
    await tg.chayInstall();
    await tg.chayActivate();

    // Máy chủ đã có bản mới; kho vẫn giữ bản cũ vừa nạp ở trên.
    tg.datMayChu(banBuild("moi"));
    const tl = await tg.chayFetch(yeuCauDieuHuong("/"));

    expect(
      tl?.noiDung,
      "vỏ trang cũ trong kho trỏ tới tên tệp JS băm cũ ⇒ khoá người dùng vào nguyên bản cũ",
    ).toBe("<html>moi</html>");
  });

  it("⑤ điều hướng khi mạng CHẾT phải ra vỏ trang trong kho", async () => {
    const tg = dungTheGioi({ mayChu: banBuild("v1") });
    await tg.chayInstall();
    await tg.chayActivate();

    tg.datMang("chet");
    const tl = await tg.chayFetch(yeuCauDieuHuong("/"));

    expect(tl?.noiDung).toBe("<html>v1</html>");
  });

  it("🔴 ⑥ request .js khi mạng CHẾT phải NÉM, tuyệt đối không trả HTML", async () => {
    const tg = dungTheGioi({ mayChu: banBuild("v1") });
    await tg.chayInstall();
    await tg.chayActivate();

    tg.datMang("chet");

    // Trình duyệt nhận HTML ở chỗ đang đợi JavaScript thì trang LÊN nhưng không bấm được
    // gì, và `requestfailed` báo 0 nên không ai biết là đã hỏng (bài học GĐ7).
    await expect(tg.chayFetch(yeuCauTaiSan("/chua-tung-thay.js"))).rejects.toThrow();
  });

  it("⑦ request .js đã có trong kho thì KHÔNG đụng mạng", async () => {
    const tg = dungTheGioi({ mayChu: banBuild("v1") });
    await tg.chayInstall();
    await tg.chayActivate();

    const truoc = tg.dem.fetch;
    const tl = await tg.chayFetch(yeuCauTaiSan("/_next/static/v1.js"));

    expect(tl?.noiDung).toBe('console.log("v1")');
    expect(tg.dem.fetch, "tài sản đã băm tên là bất biến — hỏi lại mạng là phí").toBe(truoc);
  });

  it("⑧ khác nguồn hoặc không phải GET thì KHÔNG đụng vào", async () => {
    const tg = dungTheGioi({ mayChu: banBuild("v1") });
    await tg.chayInstall();

    const ngoai = await tg.chayFetch({
      url: "https://mot-noi-khac.example/theo-doi.js",
      method: "GET",
      mode: "no-cors",
    });
    const ghi = await tg.chayFetch({
      url: "https://disc.thu/gui",
      method: "POST",
      mode: "cors",
    });

    expect(ngoai, "service worker không được xen vào thứ đi ra ngoài").toBeUndefined();
    expect(ghi).toBeUndefined();
  });

  it("🔴 ⑨ hai thế hệ kho cùng tồn tại thì phải trả bản của THẾ HỆ MÌNH", async () => {
    // Kho đời trước được tạo TRƯỚC ⇒ `caches.match` toàn cục duyệt trúng nó trước và trả
    // về bản cũ. Phải tra đúng kho của thế hệ này thì mới ra bản đúng.
    const tg = dungTheGioi({
      mayChu: banBuild("v1"),
      khoCoSan: { "disc-vo-doi-truoc": { "/_next/static/v1.js": 'console.log("CŨ")' } },
    });
    await tg.chayInstall();

    tg.datMang("chet");
    const tl = await tg.chayFetch(yeuCauTaiSan("/_next/static/v1.js"));

    expect(tl?.noiDung).toBe('console.log("v1")');
  });
});

/**
 * CỬA HIỆN VẬT — soi thứ `npm run build` thật sự sinh ra trong `out/`.
 * Chưa build thì bỏ qua (guard `existsSync`), vì `npm run kiem` chạy test mà không build.
 */
describe("vân tay bản build — tên kho phải đổi theo nội dung", () => {
  it("🔴 public/sw.js chừa MỐC, không gõ cứng tên kho", () => {
    expect(nguon).toContain("__VAN_TAY__");
    expect(
      nguon,
      "tên kho gõ cứng ⇒ trình duyệt không bao giờ thấy có bản mới",
    ).not.toMatch(/const TEN_KHO = "disc-vo-v\d+"/u);
  });

  it("🔴 out/sw.js đã được vá — hết mốc, tên kho là 12 ký tự hex", () => {
    if (!existsSync(join(RA, "sw.js"))) return;
    const raSw = readFileSync(join(RA, "sw.js"), "utf8");

    expect(raSw, "mốc còn nguyên ⇒ script vá đã không chạy").not.toContain("__VAN_TAY__");
    expect(/const TEN_KHO = "(disc-vo-[0-9a-f]{12})"/u.exec(raSw)?.[1]).toMatch(
      /^disc-vo-[0-9a-f]{12}$/u,
    );
  });

  it("🔴 vân tay KHỚP hash tính lại từ danh sách — đổi theo nội dung, không phải số ngẫu nhiên", () => {
    if (!existsSync(DANH_SACH) || !existsSync(join(RA, "sw.js"))) return;
    const raSw = readFileSync(join(RA, "sw.js"), "utf8");
    const trongSw = /const TEN_KHO = "disc-vo-([0-9a-f]{12})"/u.exec(raSw)?.[1];

    const tinhLai = createHash("sha256")
      .update(readFileSync(DANH_SACH, "utf8"), "utf8")
      .digest("hex")
      .slice(0, 12);

    expect(trongSw).toBe(tinhLai);
  });

  it("danh sách nạp sẵn KHÔNG chứa /sw.js — nó là bộ máy nạp, không phải hàng để nạp", () => {
    if (!existsSync(DANH_SACH)) return;
    const ds = JSON.parse(readFileSync(DANH_SACH, "utf8"));
    expect(ds).not.toContain("/sw.js");
    expect(ds).not.toContain("/danh-sach-cache.json");
  });
});

/**
 * 🔴 CỬA CUỐI — chạy đúng BẢN SẼ SHIP (`out/sw.js`), không phải bản nguồn.
 *
 * `out/sw.js` do một phép thay chuỗi sinh ra. Thay chuỗi làm hỏng file thì `public/sw.js`
 * vẫn xanh ở mọi cửa trên, build vẫn xanh, và chỉ trình duyệt của phụ huynh là chịu.
 */
describe("bản sẽ ship — out/sw.js", () => {
  const TEP = join(RA, "sw.js");

  it("🔴 chạy được, và điều hướng vẫn ra bản MỚI của máy chủ", async () => {
    if (!existsSync(TEP)) return;
    const tg = dungTheGioi({ tepSw: TEP, mayChu: banBuild("cu") });
    await tg.chayInstall();
    await tg.chayActivate();

    tg.datMayChu(banBuild("moi"));
    const tl = await tg.chayFetch(yeuCauDieuHuong("/"));

    expect(tl?.noiDung).toBe("<html>moi</html>");
    expect(tg.tenKho).toMatch(/^disc-vo-[0-9a-f]{12}$/u);
  });

  it("🔴 vẫn NÉM cho request .js khi mất mạng — không trả vỏ trang", async () => {
    if (!existsSync(TEP)) return;
    const tg = dungTheGioi({ tepSw: TEP, mayChu: banBuild("v1") });
    await tg.chayInstall();
    await tg.chayActivate();

    tg.datMang("chet");
    await expect(tg.chayFetch(yeuCauTaiSan("/chua-tung-thay.js"))).rejects.toThrow();
  });
});
