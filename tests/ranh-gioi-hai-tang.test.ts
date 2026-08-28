import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * ADR-004 — HÀNG RÀO HAI TẦNG.
 *
 * Sản phẩm này được viết để ĐỘI DEV KHÁC bê đi. Kịch bản nhiều khả năng xảy ra nhất
 * là họ nhận phần lõi rồi viết lại giao diện theo quy ước của họ. Nếu lõi lỡ dính
 * React hay DOM thì họ không bê được, và cả giai đoạn bàn giao thành vô nghĩa.
 *
 * TẦNG LÕI = hàm thuần + dữ liệu. Không React, không `window`, không `document`,
 * không `localStorage`/`indexedDB`. Chạy được trong Node, trong Deno, trong test,
 * và trong bất kỳ khung giao diện nào.
 *
 * Hạ tầng phụ thuộc trình duyệt (lưu trữ, đếm phễu, vẽ Canvas) nằm NGOÀI tầng lõi —
 * xem `KHONG_THUOC_TANG_LOI` bên dưới.
 */

// Không dùng import.meta.url: dưới môi trường jsdom nó KHÔNG phải URL file://
// (đã trả giá 26/08/2026 — "TypeError: The URL must be of scheme file").
// Vitest luôn chạy từ gốc dự án nên process.cwd() là mốc đúng và ổn định.
const GOC = process.cwd();

/** Thư mục thuộc tầng lõi — quét đệ quy mọi file .ts/.tsx bên trong. */
const THU_MUC_LOI = [
  "modules/core/bo-de",
  "modules/core/tien-ich",
  "modules/core/gia-dinh",
  "config",
] as const;

/** File lẻ thuộc tầng lõi. Chưa tồn tại thì bỏ qua, có mặt là bị quét ngay. */
const FILE_LOI = [
  "modules/report/do-chu.ts",
  "modules/report/thong-ke.ts",
  "modules/report/cham.ts",
  "modules/report/kiem-hop-le.ts",
  "modules/report/doi-chieu.ts",
  "modules/report/dien-giai.ts",
  "modules/report/muc-do.ts",
  "modules/report/doi-chieu-phong-cach.ts",
  "modules/report/hinh-nhan-vat.ts",
  /**
   * 🔴 BẢN HỢP ĐỒNG CỦA TẦNG LƯU TRỮ (16.4) — cố ý xếp vào tầng lõi dù nó nằm trong
   * `luu-tru/`, nơi mọi file khác đều đụng IndexedDB. Một bản hợp đồng dính API trình
   * duyệt thì bản dựng gọi server của đội dev app chủ không thể ký, và cả việc tách tầng
   * thành vô nghĩa. Cửa này là thứ giữ nó sạch.
   */
  "modules/core/luu-tru/kho-disc.ts",
  /** 17.4 — đặt tên thư mục là hàm thuần: vào một cái tên, ra một cái tên. */
  "modules/core/luu-tru/cay-sao-luu.ts",
] as const;

/**
 * CỐ Ý nằm ngoài tầng lõi — đây là hạ tầng buộc phải đụng trình duyệt.
 * Ghi ra đây để người sau khỏi tưởng là bỏ sót.
 */
const KHONG_THUOC_TANG_LOI = [
  /**
   * 🔴 KHÔNG loại trừ CẢ THƯ MỤC `luu-tru` nữa (16.4). Từ khi có `kho-disc.ts` — bản hợp
   * đồng sạch DOM để đội dev app chủ cắm bản dựng gọi server vào — thư mục này có cả file
   * thuộc tầng lõi lẫn file không. Loại trừ cả thư mục là âm thầm miễn kiểm cho mọi file
   * MỚI thêm vào đây sau này, kể cả file lẽ ra phải sạch. Nêu đích danh thì thêm một file
   * bẩn là phải khai ra, và việc khai ra chính là lúc người ta nghĩ lại.
   */
  "modules/core/luu-tru/kho-bai.ts", // IndexedDB
  "modules/core/luu-tru/sao-luu.ts", // đọc kho rồi gói .zip
  "modules/core/luu-tru/nhap.ts", // đọc tệp người dùng chọn
  "modules/core/luu-tru/tai-ve.ts", // tạo thẻ <a> để tải xuống
  "modules/core/do-phieu", // đếm phễu, đọc URL
  "modules/core/lien-he", // mở link Zalo
  "modules/report/xuat-anh.ts", // Canvas 2D
  "modules/report/xuat-pdf.ts", // window.print()
  "modules/test", // toàn bộ luồng làm bài là giao diện
  "app", // giao diện tham chiếu
] as const;

type LuatCam = { readonly ten: string; readonly bieuThuc: RegExp };

const LUAT_CAM: readonly LuatCam[] = [
  { ten: "import react", bieuThuc: /from\s+["']react["']|require\(\s*["']react["']\s*\)/u },
  { ten: "import react-dom", bieuThuc: /from\s+["']react-dom/u },
  { ten: "window.", bieuThuc: /\bwindow\s*\./u },
  { ten: "document.", bieuThuc: /\bdocument\s*\./u },
  { ten: "localStorage", bieuThuc: /\blocalStorage\b/u },
  { ten: "indexedDB", bieuThuc: /\bindexedDB\b/u },
  { ten: "navigator.", bieuThuc: /\bnavigator\s*\./u },
];

/** Bỏ chú thích trước khi quét — nếu không thì chính chú thích này làm test đỏ. */
function boChuThich(nguon: string): string {
  return nguon.replace(/\/\*[\s\S]*?\*\//gu, "").replace(/\/\/[^\n]*/gu, "");
}

function quetDeQuy(duongDan: string, gom: string[]): void {
  if (!existsSync(duongDan)) return;
  for (const ten of readdirSync(duongDan)) {
    const day = join(duongDan, ten);
    if (statSync(day).isDirectory()) {
      quetDeQuy(day, gom);
    } else if (/\.tsx?$/u.test(ten)) {
      gom.push(day);
    }
  }
}

function gomFileTangLoi(): string[] {
  const gom: string[] = [];
  for (const thuMuc of THU_MUC_LOI) quetDeQuy(join(GOC, thuMuc), gom);
  for (const file of FILE_LOI) {
    const day = join(GOC, file);
    if (existsSync(day)) gom.push(day);
  }
  return gom;
}

describe("ranh giới hai tầng (ADR-004)", () => {
  const danhSach = gomFileTangLoi();

  it("khai báo tầng lõi không được rỗng và không chồng lấn phần đã loại trừ", () => {
    expect(THU_MUC_LOI.length + FILE_LOI.length).toBeGreaterThan(0);
    for (const duong of [...THU_MUC_LOI, ...FILE_LOI]) {
      for (const loaiTru of KHONG_THUOC_TANG_LOI) {
        expect(
          duong.startsWith(loaiTru),
          `"${duong}" vừa khai là tầng lõi vừa nằm trong phần loại trừ "${loaiTru}"`,
        ).toBe(false);
      }
    }
  });

  it.each(danhSach.length > 0 ? danhSach : [null])(
    "file tầng lõi không đụng React hay DOM: %s",
    (duongDanDayDu) => {
      // Chưa có file lõi nào (GĐ0–GĐ1) — hàng rào đã dựng, sẽ tự cắn khi GĐ2 sinh file.
      if (duongDanDayDu === null) {
        expect(danhSach).toHaveLength(0);
        return;
      }

      const tenNgan = relative(GOC, duongDanDayDu);
      const nguon = boChuThich(readFileSync(duongDanDayDu, "utf8"));
      const viPham = LUAT_CAM.filter((luat) => luat.bieuThuc.test(nguon)).map((l) => l.ten);

      expect(
        viPham,
        `TẦNG LÕI BỊ Ô NHIỄM — ${tenNgan} đụng: ${viPham.join(", ")}.\n` +
          `Tầng lõi phải bê sang stack nào cũng chạy (ADR-004). Cần trình duyệt thì ` +
          `chuyển sang modules/core/luu-tru, modules/core/do-phieu, hoặc modules/report/xuat-anh.ts.`,
      ).toEqual([]);
    },
  );
});
