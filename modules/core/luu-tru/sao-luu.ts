/**
 * SAO LƯU BÀI ĐÃ LÀM RA FILE .ZIP.
 *
 * 🔴 `saoLuuTatCa()` gọi thẳng `docTatCa()` và KHÔNG nhận tham số lọc nào. Đây là hàng
 * rào chống đúng cái bẫy đã cắn dự án trước: nút Sao lưu đọc danh sách đang hiển thị
 * (đã lọc theo khoang) nên file tải về THIẾU, mà trông thì vẫn đủ.
 *
 * ⚠️ JSZip chạy được ở cả trình duyệt lẫn Node, nhưng kiểu đầu ra khác nhau: trong Node
 * nó KHÔNG dựng được `Blob`. Hàm này luôn trả `Uint8Array` — nơi gọi tự bọc thành `Blob`
 * khi cần tải về. Nhờ vậy test chạy được mà không cần trình duyệt thật.
 */

import JSZip from "jszip";

import type { PhanTichGiaDinh, ThanhVien } from "@modules/core/gia-dinh/kieu";

import {
  CHU_DOC_TRUOC,
  TEP_DOC_TRUOC,
  THU_MUC_MAY_DOC,
} from "./cay-sao-luu";

import { docPhanTich, docTatCa, docThanhVien, type BaiLamLuu } from "./kho-bai";

export const TEN_TEP_SAO_LUU = "disc-sao-luu";

/**
 * Nơi để phần MÁY đọc.
 *
 * 🔴 ĐỜI THỨ BA CỦA TỆP SAO LƯU (17.4). v1 để bài ở gốc `bai/`; v2 (28/08) thêm
 * `du-lieu/`; v3 dồn tất cả xuống `_may-doc/` để chỗ dễ thấy nhất dành cho thư mục mang
 * TÊN NGƯỜI. `docTuZip()` phải đọc được **cả ba** — người dùng có thể đang giữ một tệp
 * tải từ đời trước, và nút cứu dữ liệu mà từ chối chính bản sao lưu của họ là kiểu hỏng
 * tệ nhất tính năng này mắc được.
 */
export const THU_MUC_DU_LIEU = THU_MUC_MAY_DOC;
export const TEP_THANH_VIEN = `${THU_MUC_DU_LIEU}/thanh-vien.json`;
export const TEP_PHAN_TICH = `${THU_MUC_DU_LIEU}/phan-tich.json`;

/**
 * 🔴 PHIÊN BẢN 2 — VÀ ĐÂY LÀ MỘT BẢN VÁ MẤT DỮ LIỆU, KHÔNG PHẢI MỘT TÍNH NĂNG.
 *
 * Kho lên v2 với BA bảng ở GĐ12, nhưng `saoLuuTatCa()` vẫn chỉ đọc bảng BÀI. Nghĩa là
 * người dùng bấm *Sao lưu*, nhận một tệp trông như đủ, yên tâm — rồi mất máy là mất sạch
 * TÊN CỦA CẢ NHÀ và mọi bản phân tích đã chạy. Đúng một họ hàng với lỗi nút *Xoá sạch*
 * dọn thiếu hai phần ba dữ liệu (V3.1): thêm một bảng thì phải đi hỏi lại mọi hàm nói
 * "tất cả" xem chúng có biết bảng mới không.
 *
 * Bản kê v1 vẫn đọc được — trường mới là trường THÊM, không đổi trường cũ.
 */
export type BanKe = {
  readonly phienBanSaoLuu: 1 | 2 | 3;
  readonly taoLuc: string;
  readonly soBai: number;
  readonly boDe: readonly string[];
  readonly ghiChu: string;
  /** 🆕 v2. Bản kê v1 không có — nơi đọc phải chịu được `undefined`. */
  readonly soThanhVien?: number;
  /** 🆕 v2. */
  readonly soThuMucPhanTich?: number;
};

/**
 * Tên tệp an toàn cho mọi hệ điều hành, và không lộ biệt danh ra tên tệp.
 *
 * 🔴 Ở ĐÂY vẫn KHÔNG có tên người, dù thư mục PDF thì có. Hai chỗ, hai lý do khác nhau:
 * thư mục PDF tồn tại để người dùng ĐỌC, còn tệp JSON này người dùng không bao giờ mở —
 * bỏ tên ra khỏi nó là miễn phí, nên vẫn bỏ.
 */
function tenTepCuaBai(bai: BaiLamLuu, thuTu: number): string {
  const ngay = bai.ketThuc.slice(0, 10);
  return `${THU_MUC_MAY_DOC}/bai/${String(thuTu + 1).padStart(3, "0")}-${bai.boDe}-${ngay}.json`;
}

/** Một tệp đọc-được-bằng-mắt đi kèm bản sao lưu (bản PDF của từng người, 16.6). */
export type TepKem = {
  readonly ten: string;
  readonly duLieu: Uint8Array;
};

export async function taoNoiDungZip(
  ds: readonly BaiLamLuu[],
  taoLuc: string,
  nguoi: readonly ThanhVien[] = [],
  thuMuc: readonly PhanTichGiaDinh[] = [],
  tepKem: readonly TepKem[] = [],
): Promise<Uint8Array> {
  const zip = new JSZip();

  const banKe: BanKe = {
    phienBanSaoLuu: 3,
    taoLuc,
    soBai: ds.length,
    boDe: [...new Set(ds.map((b) => b.boDe))].sort(),
    soThanhVien: nguoi.length,
    soThuMucPhanTich: thuMuc.length,
    ghiChu:
      "Bản sao lưu DISC: tên từng người, bài đã làm, và các bản phân tích. Tệp này chứa " +
      "dữ liệu cá nhân — giữ trong máy, đừng gửi qua nhóm chat.",
  };
  // 🔴 Bản kê xuống `_may-doc/` cùng phần còn lại. `docTuZip()` tìm nó ở CẢ HAI chỗ.
  zip.file(`${THU_MUC_MAY_DOC}/ban-ke.json`, JSON.stringify(banKe, null, 2));
  zip.file(TEP_DOC_TRUOC, CHU_DOC_TRUOC);

  ds.forEach((bai, i) => zip.file(tenTepCuaBai(bai, i), JSON.stringify(bai, null, 2)));

  // 🔴 LUÔN ghi hai tệp này, kể cả khi rỗng. Vắng mặt và "có mà rỗng" là hai chuyện khác
  // nhau lúc khôi phục: một cái nghĩa là bản sao lưu đời cũ, cái kia nghĩa là nhà chưa
  // khai ai. Gộp hai trạng thái đó là mầm của đúng loại lỗi mà cả repo này đang cảnh báo.
  zip.file(TEP_THANH_VIEN, JSON.stringify(nguoi, null, 2));
  zip.file(TEP_PHAN_TICH, JSON.stringify(thuMuc, null, 2));

  // 🔴 PHẦN ĐỌC ĐƯỢC nằm ở GỐC tệp .zip, JSON thì chìm xuống `_may-doc/`. Người mở tệp này
  // thường là một phụ huynh vừa mất máy — thứ họ cần thấy đầu tiên là thư mục mang tên
  // mình, không phải một thư mục mở ra toàn ký hiệu. `t.ten` đã mang sẵn đường dẫn thư
  // mục (`Zozo/…`, `Tổng hợp/2026-08-28 20h05/…`) do nơi gọi dựng.
  for (const t of tepKem) zip.file(t.ten, t.duLieu);

  // "uint8array" chứ không phải "blob": chạy được cả trong Node lẫn trình duyệt.
  return zip.generateAsync({ type: "uint8array" });
}

/**
 * 🔴 CỬA DUY NHẤT để sao lưu. Không có tham số. Đừng thêm.
 */
export async function saoLuuTatCa(
  taoLuc: string,
): Promise<{ duLieu: Uint8Array; soBai: number; soThanhVien: number }> {
  return saoLuuTatCaKemTep(taoLuc, []);
}

/**
 * Cùng một cửa, nhưng cho phép đính kèm những tệp đọc-được-bằng-mắt (PDF của từng người).
 *
 * 🔴 VÌ SAO TÁCH LÀM HAI HÀM thay vì thêm tham số vào `saoLuuTatCa`. Chữ ký một-tham-số
 * của `saoLuuTatCa` LÀ một hàng rào, và `tests/luu-tru.test.ts` khẳng định
 * `toHaveLength(1)` để chặn đúng cái bẫy cũ: một ngày nào đó ai đó thêm `boDe?` vào và
 * nút sao lưu lại chỉ lấy một phần. Nới cửa đó ra cho một lý do chính đáng hôm nay là
 * mở sẵn nó cho một lý do không chính đáng ngày mai.
 *
 * 🔴 Và bộ sinh PDF KHÔNG được gọi từ đây: `modules/core` không được import
 * `modules/report` (rule 2 ranh giới module, `.semgrep/` canh). Tầng giao diện sinh PDF
 * rồi đưa xuống — đó cũng là lý do PDF là tham số chứ không phải một lượt tính bên trong.
 */
export async function saoLuuTatCaKemTep(
  taoLuc: string,
  tepKem: readonly TepKem[],
): Promise<{ duLieu: Uint8Array; soBai: number; soThanhVien: number }> {
  const [ds, nguoi, thuMuc] = await Promise.all([
    docTatCa(),
    docThanhVien(),
    docPhanTich(),
  ]);
  return {
    duLieu: await taoNoiDungZip(ds, taoLuc, nguoi, thuMuc, tepKem),
    soBai: ds.length,
    soThanhVien: nguoi.length,
  };
}
