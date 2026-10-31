/**
 * Đầu vào cho `tinhDayDu()` của MỘT thành viên: là trẻ hay không, và bộ quan sát của bé.
 *
 * Nằm ở tầng giao diện vì `boDeQuanSatTheoLop` thuộc module test, mà `modules/report` không
 * được import module test (semgrep canh). Một chỗ tính duy nhất — thẻ, bước 1 và cổng phân
 * tích đều đi qua đây nên không thể lệch nhau.
 *
 * 🔴 Người có bộ đề là PH (cấp ba trở lên) được coi là NGƯỜI LỚN dù có "lớp" — đúng cách
 * `boDeChoThanhVien` đã định tuyến cho họ.
 */

import { laTreEm } from "@config/disc-gia-dinh";
import type { MaBoDe } from "@modules/core/bo-de/kieu";
import type { ThanhVien } from "@modules/core/gia-dinh/kieu";
import type { BaiLamLuu } from "@modules/core/luu-tru/kho-bai";
import { tinhDayDu, type DayDuMotNguoi } from "@modules/report/do-day-du-bo-test";
import { boDeChoThanhVien, boDeQuanSatTheoLop } from "@modules/test/dinh-tuyen";

export function dauVaoDayDu(tv: Pick<ThanhVien, "vaiTro" | "lop">): {
  readonly laTre: boolean;
  readonly boDeQuanSat: MaBoDe | null;
} {
  const tuyen = boDeChoThanhVien(tv.vaiTro, tv.lop);
  const laTre = laTreEm(tv.vaiTro, tv.lop) && tuyen?.boDe !== "PH";
  return { laTre, boDeQuanSat: laTre ? boDeQuanSatTheoLop(tv.lop) : null };
}

/** Độ đầy đủ của CẢ NHÀ — một chỗ tính cho thẻ, bước 1, bước 3 và thông báo "đã xong". */
export function dayDuCaNha(
  thanhVien: readonly ThanhVien[],
  bai: readonly BaiLamLuu[],
): DayDuMotNguoi[] {
  return thanhVien.map((tv) =>
    tinhDayDu(
      tv,
      bai.filter((b) => b.maThanhVien === tv.id),
      dauVaoDayDu(tv),
    ),
  );
}

/**
 * Danh sách (người, ngày bản HỢP LỆ gần nhất) để tính hạn test lại.
 *
 * Bài chưa gắn người nào trong sổ (làm ở chế độ cũ, không qua thẻ) được gom theo biệt danh
 * như một "người" riêng — nếu không, một máy chưa lập sổ gia đình sẽ chẳng bao giờ được nhắc.
 */
export function danhSachHanTestLai(
  thanhVien: readonly ThanhVien[],
  bai: readonly BaiLamLuu[],
): { id: string; ten: string; ganNhat?: string }[] {
  const moiNhat = (ds: readonly BaiLamLuu[]) =>
    ds
      .filter((b) => b.ketQua.hopLe)
      .map((b) => b.ketThuc)
      .sort((a, b) => b.localeCompare(a))[0];

  const trongSo = thanhVien.map((tv) => {
    const g = moiNhat(bai.filter((b) => b.maThanhVien === tv.id));
    return { id: tv.id, ten: tv.ten, ...(g ? { ganNhat: g } : {}) };
  });
  const chuaXep = bai.filter((b) => !b.maThanhVien);
  const theoTen = [...new Set(chuaXep.map((b) => b.maTre))].map((ten) => {
    const g = moiNhat(chuaXep.filter((b) => b.maTre === ten));
    return { id: `ten:${ten}`, ten, ...(g ? { ganNhat: g } : {}) };
  });
  return [...trongSo, ...theoTen];
}
