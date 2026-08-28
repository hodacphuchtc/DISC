/**
 * XUẤT BẢN PHÂN TÍCH RA PDF — mỗi người MỘT TỆP (16.6, ADR-009).
 *
 * 🔴 NẠP LƯỜI LÀ ĐIỀU KIỆN KÈM THEO, KHÔNG PHẢI MỘT TỐI ƯU TUỲ CHỌN. `jspdf` nặng hơn cả
 * phần còn lại của sản phẩm cộng lại. Một `import` tĩnh lỡ tay là gói tải về gấp đôi cho
 * MỌI người dùng — kể cả người không bao giờ bấm xuất PDF — và **không cửa nào hiện có bắt
 * được**: build vẫn xanh, test vẫn xanh, chỉ điện thoại 3G của phụ huynh là chịu. Vì thế
 * `jspdf` chỉ được vào đây qua `await import()`, và `tests/co-goi-chinh.test.ts` canh cỡ
 * gói chính sau mỗi lần build.
 *
 * 🔴 FONT KHÔNG NHÚNG BASE64 VÀO JS. Nhúng thì +33% cỡ và nằm trong chunk JS; đặt ở
 * `public/fonts/` thì trình duyệt cache riêng, và tệp `.ttf` chỉ tải đúng một lần trong
 * đời máy đó. Đổi lại: xuất PDF cần một lượt `fetch` cùng nguồn — nói ra ở đây để người
 * sau khỏi tưởng là bỏ sót.
 *
 * KHÔNG thuộc tầng lõi (ADR-004): `fetch` + một thư viện chỉ chạy trong trình duyệt.
 */

import { dongChoBan, tenTepBan, type DongBan } from "@modules/report/noi-dung-ban";
import { dongChoBai, type BaiDeDoc } from "@modules/report/noi-dung-ket-qua";
import type { BanPhanTich } from "@modules/report/phan-tich-gia-dinh";
import { hienNgayGio } from "@modules/core/tien-ich/ngay";

/** Font Việt SIL OFL 1.1 — giấy phép kèm theo ở `public/fonts/OFL.txt`. */
export const DUONG_FONT = "/fonts/BeVietnamPro-Regular.ttf";
const TEN_FONT_TRONG_PDF = "BeVietnamPro";

export type TepPdf = {
  readonly ten: string;
  readonly duLieu: Uint8Array;
};

/* ── Bố cục, gom về một chỗ để khỏi rải số ma khắp hàm vẽ ─────────────────── */

const TRANG = { rong: 210, cao: 297, le: 18 } as const;

const CO_CHU: Record<DongBan["kieu"], number> = {
  tieuDe: 18,
  tieuDeLat: 13,
  tieuDeTruc: 11,
  than: 10.5,
  nhanManh: 10.5,
};

const CACH_TREN: Record<DongBan["kieu"], number> = {
  tieuDe: 0,
  tieuDeLat: 9,
  tieuDeTruc: 6,
  than: 3,
  nhanManh: 4,
};

function base64Tu(bytes: Uint8Array): string {
  let s = "";
  // Cắt khúc: `String.fromCharCode(...mảng 130k phần tử)` làm tràn ngăn xếp lời gọi.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

let fontDaTai: string | null = null;

/**
 * Tải font một lần rồi giữ lại.
 *
 * 🔴 Không nuốt lỗi. Font hỏng thì chữ Việt ra ô vuông — một tệp PDF trông như thành công
 * nhưng không đọc được còn tệ hơn một câu báo lỗi, vì người dùng chỉ phát hiện ra sau khi
 * đã gửi nó cho người khác.
 */
async function taiFont(): Promise<string> {
  if (fontDaTai) return fontDaTai;
  const ph = await fetch(DUONG_FONT);
  if (!ph.ok) throw new Error(`Không tải được font Việt (${ph.status})`);
  fontDaTai = base64Tu(new Uint8Array(await ph.arrayBuffer()));
  return fontDaTai;
}

/** Chỉ dùng trong test — xoá bộ nhớ đệm font giữa các lượt. */
export function quenFontDaTai(): void {
  fontDaTai = null;
}

/**
 * Sinh MỘT tệp PDF cho MỘT người.
 *
 * 🔴 Nhận đúng một `BanPhanTich`. Luật *"mỗi người một tờ"* có từ GĐ10/GĐ14 và PDF không
 * được phép là ngoại lệ: tờ của Bin không được mang phần Mẹ Lan đọc về cả nhà. Chữ ký hàm
 * chính là hàng rào — không có cách nào truyền hai bản vào đây.
 */
/**
 * Vẽ một danh sách dòng thành MỘT tệp PDF.
 *
 * 🔴 MỘT BỘ VẼ DUY NHẤT cho cả bản phân tích cả nhà lẫn bản cá nhân (17.3). Hai bộ vẽ là
 * hai cách xuống dòng, hai cỡ chữ, hai cách ngắt trang — và chúng chỉ lệch nhau vào đúng
 * ngày ai đó sửa một bên.
 */
async function veTepPdf(dongCanVe: readonly DongBan[]): Promise<Uint8Array> {
  const [{ jsPDF }, font] = await Promise.all([import("jspdf"), taiFont()]);

  const tep = new jsPDF({ unit: "mm", format: "a4" });
  tep.addFileToVFS(`${TEN_FONT_TRONG_PDF}.ttf`, font);
  tep.addFont(`${TEN_FONT_TRONG_PDF}.ttf`, TEN_FONT_TRONG_PDF, "normal");
  tep.setFont(TEN_FONT_TRONG_PDF, "normal");

  const rongChu = TRANG.rong - TRANG.le * 2;
  let y = TRANG.le + 6;

  for (const d of dongCanVe) {
    tep.setFontSize(CO_CHU[d.kieu]);
    y += CACH_TREN[d.kieu];
    const dong = tep.splitTextToSize(d.chu, rongChu) as string[];
    const cao = CO_CHU[d.kieu] * 0.42;
    for (const mot of dong) {
      if (y > TRANG.cao - TRANG.le) {
        tep.addPage();
        // 🔴 Đặt lại font sau mỗi trang mới. jsPDF không mang font đang chọn sang trang
        // sau, và hậu quả là trang 2 trở đi ra ô vuông — thứ chỉ lộ ra khi NHÌN tệp thật.
        tep.setFont(TEN_FONT_TRONG_PDF, "normal");
        tep.setFontSize(CO_CHU[d.kieu]);
        y = TRANG.le + 6;
      }
      tep.text(mot, TRANG.le, y);
      y += cao;
    }
  }

  return new Uint8Array(tep.output("arraybuffer"));
}

export async function xuatPdfMotBan(ban: BanPhanTich, luc: Date): Promise<TepPdf> {
  return {
    ten: tenTepBan(ban.tenLuc, luc),
    duLieu: await veTepPdf(dongChoBan(ban)),
  };
}

/**
 * Sinh MỘT tệp PDF cho MỘT bài đã làm của MỘT người (17.3).
 *
 * Tên tệp lấy theo **mốc làm xong bài**, không theo lúc bấm sao lưu: hai lần đo của cùng
 * một người phải ra hai tên khác nhau, và tên phải nói đúng bài đó làm khi nào.
 */
export async function xuatPdfMotBai(bai: BaiDeDoc): Promise<TepPdf> {
  const luc = new Date(bai.ketThuc);
  return {
    ten: tenTepBan(`${bai.ten}-${bai.boDe}`, luc),
    duLieu: await veTepPdf(dongChoBai(bai, hienNgayGio)),
  };
}

/**
 * Sinh N tệp cho N người.
 *
 * Chạy TUẦN TỰ có chủ đích: `jsPDF` dựng một máy ảo font cho mỗi tệp, và bốn tệp cùng lúc
 * trên một điện thoại phổ thông là bốn lần dựng chồng nhau.
 */
export async function xuatPdfMoiNguoi(
  ban: readonly BanPhanTich[],
  luc: Date,
): Promise<TepPdf[]> {
  const ra: TepPdf[] = [];
  for (const b of ban) ra.push(await xuatPdfMotBan(b, luc));
  return ra;
}
