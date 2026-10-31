/**
 * TỆP LỊCH (.ics) NHẮC TEST LẠI (28.6) — hàm thuần, chỉ sinh chuỗi.
 *
 * 🔴 KHÔNG CHỨA TÊN AI (ADR-005). Tệp này đi vào ứng dụng lịch của điện thoại, có thể được
 * đồng bộ lên đám mây của hãng khác — nên tiêu đề và mô tả chỉ nói chung "cả nhà", không tên
 * người, không điểm số. Ngày nhắc là thông tin duy nhất.
 *
 * Theo RFC 5545: xuống dòng CRLF; mỗi dòng gập ở 75 byte UTF-8 (tiếng Việt có dấu nặng hơn
 * 1 byte/ký tự nên PHẢI gập theo byte, không theo ký tự); escape `\`, `;`, `,` và xuống dòng.
 * Sự kiện cả ngày, có báo thức một ngày trước.
 */

const CRLF = "\r\n";
const BYTE_TOI_DA = 75;

const MA_HOA = new TextEncoder();

function thoat(chu: string): string {
  return chu
    .replace(/\\/gu, "\\\\")
    .replace(/;/gu, "\;")
    .replace(/,/gu, "\\,")
    .replace(/\r?\n/gu, "\\n");
}

/** Gập một dòng ở 75 byte; dòng tiếp bắt đầu bằng một dấu cách. Không cắt giữa ký tự. */
export function gapDong(dong: string): string {
  if (MA_HOA.encode(dong).length <= BYTE_TOI_DA) return dong;
  const ra: string[] = [];
  let hien = "";
  let byte = 0;
  // Dòng tiếp mất 1 byte cho dấu cách đầu, nên ngưỡng của chúng thấp hơn 1.
  let tran = BYTE_TOI_DA;
  for (const kyTu of dong) {
    const b = MA_HOA.encode(kyTu).length;
    if (byte + b > tran) {
      ra.push(hien);
      hien = "";
      byte = 0;
      tran = BYTE_TOI_DA - 1;
    }
    hien += kyTu;
    byte += b;
  }
  if (hien) ra.push(hien);
  return ra.join(CRLF + " ");
}

const TIEU_DE = "Test lại DISC cả nhà";
const MO_TA =
  "Mỗi 6 tháng cả nhà cùng làm lại bài DISC để xem điều gì đã đổi, rồi cùng điều chỉnh cách " +
  "ứng xử — để hiểu, thương và chăm sóc nhau hơn.";

/**
 * @param ngayDen `yyyy-mm-dd`
 * @param bayGio  thời điểm tạo, để đóng dấu DTSTAMP (nhận từ ngoài để hàm thuần)
 */
export function taoLichNhac(ngayDen: string, bayGio: Date): string {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(ngayDen)) throw new Error(`Ngày không hợp lệ: "${ngayDen}"`);
  const ngay = ngayDen.replace(/-/gu, "");
  const dau = bayGio.toISOString().replace(/[-:]/gu, "").replace(/\.\d{3}/u, "");

  const dong = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SATA ROBO//DISC gia dinh//VI",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:disc-test-lai-${ngay}@disc.local`,
    `DTSTAMP:${dau}`,
    `DTSTART;VALUE=DATE:${ngay}`,
    `SUMMARY:${thoat(TIEU_DE)}`,
    `DESCRIPTION:${thoat(MO_TA)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${thoat(TIEU_DE)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return dong.map(gapDong).join(CRLF) + CRLF;
}

/** Tên tệp theo NGÀY, không theo tên người. */
export function tenTepLich(ngayDen: string): string {
  return `disc-test-lai-${ngayDen}.ics`;
}
