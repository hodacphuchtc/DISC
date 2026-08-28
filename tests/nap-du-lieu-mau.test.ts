import { readFileSync } from "node:fs";
import { join } from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  docTatCa,
  docThanhVien,
  xoaSach,
  xoaSachThanhVien,
} from "../modules/core/luu-tru/kho-bai";

/**
 * BỘ NẠP DỮ LIỆU MẪU (V0.3).
 *
 * 🔴 VÌ SAO PHẢI CÓ FILE NÀY. Bộ nạp mẫu là thứ giáo viên và sale dán vào Console để có
 * dữ liệu mà demo — máy trống thì không demo được gì. Nó đã HỎNG LẶNG LẼ suốt từ GĐ12:
 * kho lên v2 ba bảng, còn bộ nạp vẫn `indexedDB.open(TEN_KHO, 1)`. Mở kho v1 trên một kho
 * đã v2 là `VersionError`, lời hứa văng, và IIFE async không có `.catch()` nên người dán
 * chỉ thấy một lỗi đỏ lạ; dòng ✅ không bao giờ in ra.
 *
 * Không test nào thấy, vì bộ nạp là "script vặt" chẳng ai gọi trong test.
 * **Một script hỏng mà không ai gọi thì im lặng y như một tính năng hỏng mà không ai mở.**
 *
 * File này chạy CHÍNH bộ nạp đã sinh, dưới `fake-indexeddb`, rồi đọc lại bằng ĐÚNG các hàm
 * kho mà sản phẩm dùng — nên nó bắt được mọi kiểu lệch giữa bộ nạp và kho thật.
 */

/** Chạy bộ nạp đã sinh y như dán vào Console. */
async function chayBoNap(): Promise<void> {
  const ma = readFileSync(
    join(process.cwd(), "tests/DATA_TEST/nap-vao-trinh-duyet.js"),
    "utf8",
  );
  // Bộ nạp là một IIFE async có `.catch()` riêng — nó KHÔNG ném ra ngoài. Gỡ đuôi
  // `.catch(...)` đi để lỗi nổi lên tới test, nếu không thì test xanh trong khi bộ nạp
  // đang nuốt lỗi. Đó đúng là cách nó hỏng lặng lẽ suốt bốn giai đoạn.
  const khongNuot = ma.replace(/\)\(\)\.catch\([\s\S]*\}\);\s*$/u, ")()");
  expect(khongNuot).not.toBe(ma); // đuôi .catch phải tồn tại để gỡ được

  // 🔴 `eval` trả về giá trị của biểu thức CUỐI CÙNG, ở đây chính là lời hứa của IIFE.
  // Phải `await` đúng lời hứa đó. Bọc thêm một hàm async rồi gọi IIFE bên trong mà không
  // await là dựng đúng một cuộc đua: bảng ghi TRƯỚC kịp đáp, bảng ghi SAU thì chưa — và
  // test đọc ra 7 người nhưng 0 bài, trông y như bộ nạp hỏng.
  await (0, eval)(khongNuot);
}

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
});
afterEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
});

describe("bộ nạp dữ liệu mẫu", () => {
  it("🔴 chạy trót lọt trên kho v2 — không VersionError, không nuốt lỗi", async () => {
    await expect(chayBoNap()).resolves.toBeUndefined();
  });

  it("nạp được 7 người vào sổ gia đình", async () => {
    await chayBoNap();
    const tv = await docThanhVien();
    expect(tv).toHaveLength(7);
    expect(tv.map((t) => t.ten)).toContain("Mẹ Bống");
  });

  it("nạp được 8 bài", async () => {
    await chayBoNap();
    expect(await docTatCa()).toHaveLength(8);
  });

  it("🔴 MỌI bài đều trỏ tới một người CÓ THẬT — không bài nào mồ côi", async () => {
    await chayBoNap();
    const [tv, bai] = await Promise.all([docThanhVien(), docTatCa()]);
    const co = new Set(tv.map((t) => t.id));
    for (const b of bai) {
      // Bài không có `maThanhVien` rơi vào nhóm "chưa xếp" và KHÔNG vào được phân tích
      // cả nhà — tức là bộ mẫu sẽ không demo được đúng màn mà sale cần cho xem.
      expect(b.maThanhVien, `bài ${b.id} không gắn thành viên`).toBeTruthy();
      expect(co.has(b.maThanhVien!), `bài ${b.id} trỏ tới thành viên không có thật`).toBe(true);
    }
  });

  it("hai bài của cùng một người về CÙNG một thành viên (cặp vùng lệch)", async () => {
    await chayBoNap();
    const bai = await docTatCa();
    const cuaTiNi = bai.filter((b) => b.maTre === "Tí Nị");
    expect(cuaTiNi).toHaveLength(2);
    expect(new Set(cuaTiNi.map((b) => b.maThanhVien)).size).toBe(1);
  });

  it("người lớn KHÔNG bị gán lớp; trẻ mầm non có bậc mầm non", async () => {
    await chayBoNap();
    const tv = await docThanhVien();
    expect(tv.find((t) => t.ten === "Mẹ Bống")?.lop).toBeUndefined();
    expect(tv.find((t) => t.ten === "Bé Bún")?.lop).toBe("mam-non");
  });

  it("dán hai lần không đẻ ra người trùng", async () => {
    await chayBoNap();
    await chayBoNap();
    expect(await docThanhVien()).toHaveLength(7);
    expect(await docTatCa()).toHaveLength(8);
  });

  it("🔴 không có TÊN THẬT nào lọt vào bộ mẫu — thư mục này nằm trong repo CÔNG KHAI", async () => {
    await chayBoNap();
    const tv = await docThanhVien();
    // Tên bịa của dự án đều là tên món ăn / tên gọi thân mật, không phải họ tên người Việt
    // đầy đủ. Cửa rẻ nhất bắt được sự cố "ai đó thay bằng dữ liệu thật": họ tên đầy đủ
    // tiếng Việt có từ 3 âm tiết trở lên.
    for (const t of tv) {
      expect(t.ten.trim().split(/\s+/u).length, `"${t.ten}" trông như họ tên thật`).toBeLessThan(3);
    }
  });
});
