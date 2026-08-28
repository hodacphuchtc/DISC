/**
 * HỆ ĐỘ NỔI (18.5, 18.6) — bóng đổ, nút lún, và hai cửa HAI CHIỀU.
 *
 * 🔴 VÌ SAO CẦN CẢ HAI CHIỀU. Tailwind **im lặng bỏ qua** một class không tồn tại: gõ
 * `shadow-noi-4` hay `shadow-noi1` thì không lỗi biên dịch, không cảnh báo, không bóng —
 * chỉ là cái khối đó phẳng, và không ai biết cho tới khi có người đặt hai màn cạnh nhau.
 * Nên phải soi ngược: mọi class `shadow-<tên>` dùng trong `app/` đều phải có token thật.
 *
 * Chiều còn lại canh thứ đối xứng: token khai ra mà không ai dùng thì gỡ đi. Cùng khuôn
 * cửa `hien-dan` ở `tests/mau-va-chuyen-dong.test.tsx`.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const GOC = process.cwd();
const CSS = readFileSync(join(GOC, "app/globals.css"), "utf8");

/** Mọi file .ts/.tsx trong `app/`, kèm tên tương đối để thông báo lỗi chỉ đúng chỗ. */
function quet(thuMuc: string, ra: Array<[string, string]> = []): Array<[string, string]> {
  for (const ten of readdirSync(join(GOC, thuMuc))) {
    const duong = join(thuMuc, ten);
    if (statSync(join(GOC, duong)).isDirectory()) quet(duong, ra);
    else if (/\.tsx?$/u.test(ten)) ra.push([duong, readFileSync(join(GOC, duong), "utf8")]);
  }
  return ra;
}
const NGUON = quet("app");

/** Tên các token bóng khai trong `@theme`. */
const TOKEN = [...CSS.matchAll(/--shadow-([a-z0-9-]+):/gu)].map((m) => m[1]);

describe("token độ nổi", () => {
  it("khai đủ sáu token, và XOÁ thang bóng mặc định của Tailwind", () => {
    for (const t of ["noi-1", "noi-2", "noi-3", "lun", "nut-chinh"]) {
      expect(TOKEN, `thiếu token --shadow-${t}`).toContain(t);
    }
    // 🔴 Bóng của Tailwind là bóng ĐEN trung tính; sản phẩm này ám tím. Giữ thang mặc định
    // là mở sẵn cửa cho `shadow-lg` lọt vào mà không ai thấy trong diff.
    expect(CSS, "chưa xoá thang bóng mặc định").toContain("--shadow-*: initial");
  });

  it("mỗi nấc có NHIỀU LỚP, không phải một vệt phẳng", () => {
    for (const t of ["noi-1", "noi-2", "noi-3"]) {
      const m = new RegExp(`--shadow-${t}:([^;]+);`, "u").exec(CSS);
      expect(m, `không đọc được --shadow-${t}`).toBeTruthy();
      const soLop = m![1].split(",").length;
      expect(soLop, `--shadow-${t} chỉ có ${soLop} lớp — bóng một lớp trông như viền mờ`)
        .toBeGreaterThanOrEqual(3);
    }
  });

  it("🔴 CHIỀU 1 — token nào khai ra cũng phải có người dùng", () => {
    const daDung = (t: string) =>
      CSS.includes(`var(--shadow-${t})`) || NGUON.some(([, n]) => n.includes(`shadow-${t}`));
    const thua = TOKEN.filter((t) => !daDung(t));
    expect(thua, `Token không ai dùng thì gỡ đi: ${thua.join(", ")}`).toEqual([]);
  });

  it("🔴 CHIỀU 2 — class `shadow-<tên>` nào dùng trong app/ cũng phải có token thật", () => {
    // Tailwind IM LẶNG với class không tồn tại. Đây là cửa duy nhất bắt được lỗi gõ sai.
    const CHUAN = new Set(["none", ...TOKEN]);
    const pham: string[] = [];
    for (const [ten, nguon] of NGUON) {
      for (const m of nguon.matchAll(/(?:^|[\s"'`:])(?:[a-z]+:)*shadow-([a-z0-9-]+)/gu)) {
        if (!CHUAN.has(m[1])) pham.push(`${ten}: shadow-${m[1]}`);
      }
    }
    expect(pham, `Class bóng không có token — Tailwind bỏ qua im lặng:\n${pham.join("\n")}`)
      .toEqual([]);
  });
});

describe("giữ hệ độ nổi khỏi rã ra", () => {
  it("KHÔNG file nào gõ bóng tuỳ ý `shadow-[…]`", () => {
    const pham = NGUON.filter(([, n]) => n.includes("shadow-[")).map(([t]) => t);
    // Đúng bệnh `max-w-*` mà `config/bo-cuc.ts` được lập ra để chữa: mỗi chỗ một giá trị,
    // rồi không ai biết cái nào mới là chuẩn.
    expect(pham, `Dùng token ở @theme, đừng gõ bóng rời: ${pham.join(", ")}`).toEqual([]);
  });

  it("KHÔNG file nào dùng thang bóng mặc định (`shadow-lg`…)", () => {
    const pham: string[] = [];
    for (const [ten, nguon] of NGUON) {
      if (/\bshadow-(sm|md|lg|xl|2xl)\b/u.test(nguon)) pham.push(ten);
    }
    expect(pham, `Bóng đen trung tính làm lệch bộ nhận diện: ${pham.join(", ")}`).toEqual([]);
  });

  it("🔴 nổi lên khi RÊ thì phải lún xuống khi BẤM — cùng một dòng", () => {
    // Nổi khi rê mà không lún khi bấm là nửa vời, và người dùng CẢM ỨNG không thấy gì cả:
    // trên điện thoại không có trạng thái hover.
    const pham: string[] = [];
    for (const [ten, nguon] of NGUON) {
      for (const dong of nguon.split("\n")) {
        if (dong.includes("hover:shadow-") && !dong.includes("active:")) {
          pham.push(`${ten}: ${dong.trim().slice(0, 80)}`);
        }
      }
    }
    expect(pham, `Thiếu phản hồi khi bấm:\n${pham.join("\n")}`).toEqual([]);
  });
});

describe("🔴 bóng không được lọt vào giấy", () => {
  it("khối @media print có `box-shadow: none !important`", () => {
    const i = CSS.indexOf("@media print");
    expect(i, "không tìm thấy khối @media print").toBeGreaterThan(-1);
    const khoiPrint = CSS.slice(i, CSS.indexOf("@media (prefers-reduced-motion", i));
    // `print-color-adjust: exact` ở ngay trên ép trình duyệt in đúng mọi thứ nó thấy, kể
    // cả bóng. Không chặn thì mỗi thẻ ra một vệt xám — tốn mực, và bản PDF gửi phụ huynh
    // trông bẩn. Hỏng theo kiểu không ai thấy tới ngày có người bấm In.
    expect(khoiPrint).toMatch(/box-shadow:\s*none\s*!important/u);
  });
});

describe("🔴 `data-thu` gánh HAI việc — móc CSS và móc cửa kiểm", () => {
  it("mọi `data-thu` mà globals.css móc vào đều còn tồn tại trong app/", () => {
    const mocCss = [...CSS.matchAll(/\[data-thu="([a-z0-9-]+)"\]/gu)].map((m) => m[1]);
    expect(mocCss.length, "không thấy móc data-thu nào trong CSS").toBeGreaterThan(5);

    const chet = [...new Set(mocCss)].filter(
      (t) => !NGUON.some(([, n]) => n.includes(`data-thu="${t}"`)),
    );
    // Đổi tên một `data-thu` là vỡ CẢ HAI: bóng ở CSS và bộ chọn của test. Và vỡ im lặng.
    expect(chet, `CSS móc vào data-thu không còn ai đặt: ${chet.join(", ")}`).toEqual([]);
  });
});
