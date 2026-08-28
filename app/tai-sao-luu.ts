/**
 * CỬA DUY NHẤT ĐỂ TẢI BẢN SAO LƯU VỀ MÁY.
 *
 * 🔴 VÌ SAO FILE NÀY TỒN TẠI — MỘT LỖI ĐÃ RA TỚI TAY NGƯỜI DÙNG (28/08/2026).
 * Sản phẩm có HAI nút sao lưu: nút *Sao lưu ra .zip* ở bước *Nhà mình*, và nút
 * *Tải bản sao lưu về máy* trong hộp nhắc (V4.2). Nút thứ hai viết TRƯỚC khi PDF vào tệp
 * sao lưu (GĐ16–GĐ17), và khi PDF vào thì không ai quay lại hỏi nó. Kết quả: người dùng
 * bấm đúng cái nút tự bật lên trước mặt mình, nhận về một tệp `.zip` **toàn JSON, không
 * một thư mục mang tên người nào** — rồi tưởng tính năng hỏng.
 *
 * Cách chữa không phải là chép đoạn sinh PDF sang nút thứ hai: chép là dựng bản sao thứ
 * hai, và hai bản chỉ lệch vào đúng ngày ai đó sửa một bên. Cả hai nút nay gọi
 * `taiBanSaoLuuVeMay()` — **một cửa, không phải hai**.
 *
 * 🔴 KHÔNG ĐẶT ĐƯỢC FILE NÀY TRONG `modules/core`. Nó phải gọi `modules/report` để sinh
 * PDF, mà `core` → `report` là vi phạm ranh giới module (rule 2, `.semgrep/` canh). Đây
 * cũng chính là lý do `saoLuuTatCaKemTep()` nhận PDF làm THAM SỐ chứ không tự tính.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004): có `fetch`, có nạp lười, không bê sang stack
 * khác được.
 */

import { laTreEm } from "@config/disc-gia-dinh";
import { MO_NOI_DUNG_TRE } from "@config/disc-nguong";
import { MA_TRUC, type MaTruc } from "@modules/core/bo-de/kieu";
import {
  THU_MUC_TONG_HOP,
  tenThuMucLanChay,
  tenThuMucNguoi,
} from "@modules/core/luu-tru/cay-sao-luu";
import { docPhanTich, docTatCa, docThanhVien } from "@modules/core/luu-tru/kho-bai";
import {
  TEN_TEP_SAO_LUU,
  saoLuuTatCaKemTep,
  type TepKem,
} from "@modules/core/luu-tru/sao-luu";
import { taiXuong } from "@modules/core/luu-tru/tai-ve";
import { laBanPhanTichHopLe } from "@modules/report/phan-tich-gia-dinh";

/**
 * Sinh bản PDF cho từng người, để đính vào tệp sao lưu (16.6).
 *
 * 🔴 THẤT BẠI Ở ĐÂY KHÔNG ĐƯỢC KÉO ĐỔ CẢ NÚT SAO LƯU. PDF là phần đọc-cho-vui; JSON mới
 * là phần cứu được dữ liệu. Font tải hỏng hay thư viện nạp lỗi thì vẫn phải ra một tệp
 * .zip đầy đủ — mất bản đẹp còn hơn mất sổ.
 *
 * 🔴 Nạp lười: `xuat-pdf` kéo theo `jspdf`, nên nó chỉ được vào bằng `await import()`.
 */
export async function cayTepDocDuoc(): Promise<TepKem[]> {
  try {
    const [nguoi, ds, thuMuc] = await Promise.all([
      docThanhVien(),
      docTatCa(),
      docPhanTich(),
    ]);
    const { xuatPdfMoiNguoi, xuatPdfMotBai } = await import("@modules/report/xuat-pdf");
    const tep: TepKem[] = [];

    /**
     * 🔴 CHỖ CHẶN THỨ TƯ CỦA CỜ `MO_NOI_DUNG_TRE` (17.4). Ba chỗ trước là thẻ, khoang
     * làm bài, và bản phân tích. Đây là chỗ thứ tư và là chỗ dễ quên nhất: một tệp PDF
     * nằm trong `.zip` sống lâu hơn cả phiên làm việc — tắt cờ mà vẫn xuất là phát nội
     * dung về trẻ ra ngoài máy, đúng thứ cờ đó sinh ra để chặn.
     */
    const choPhep = nguoi.filter((tv) => MO_NOI_DUNG_TRE || !laTreEm(tv.vaiTro, tv.lop));

    /* ── Một thư mục cho mỗi người, bên trong là các bài của họ ───────────── */
    const daDungTen = new Set<string>();
    const tenThuMuc = new Map<string, string>();
    for (const tv of choPhep) {
      const ten = tenThuMucNguoi(tv.ten, daDungTen);
      daDungTen.add(ten);
      tenThuMuc.set(tv.id, ten);

      // Bài của người này, mới trước. Trần 2 bài/người đã do kho canh (GIOI_HAN_BAI_MOI_NGUOI).
      const cuaHo = ds.filter((b) => b.maThanhVien === tv.id && b.ketQua.hopLe);
      for (const b of cuaHo) {
        const mot = await xuatPdfMotBai({
          ten: tv.ten,
          boDe: b.boDe,
          ketThuc: b.ketThuc,
          diem: (b.ketQua as { diem: Record<MaTruc, number> }).diem,
          xepHang: (b.ketQua as { xepHang: readonly MaTruc[] }).xepHang,
          ...(b.tuoi !== undefined ? { tuoi: b.tuoi } : {}),
          ...(b.banKhoan !== undefined ? { banKhoan: b.banKhoan } : {}),
        });
        tep.push({ ten: `${ten}/${mot.ten}`, duLieu: mot.duLieu });
      }

      // 🔴 Hồ sơ nhận qua mã mời KHÔNG có bài trên máy này — nhưng vẫn có bốn con số,
      // nên vẫn ra được một tờ. Cờ `nhanQuaMa` bắt tờ đó tự khai nguồn.
      if (cuaHo.length === 0 && tv.nhanQuaMa) {
        const mot = await xuatPdfMotBai({
          ten: tv.ten,
          boDe: tv.nhanQuaMa.boDe,
          ketThuc: `${tv.nhanQuaMa.ngayPhat}T00:00:00`,
          diem: tv.nhanQuaMa.diem,
          xepHang: [...MA_TRUC].sort(
            (a, b) => tv.nhanQuaMa!.diem[b] - tv.nhanQuaMa!.diem[a],
          ),
          nhanQuaMa: true,
        });
        tep.push({ ten: `${ten}/${mot.ten}`, duLieu: mot.duLieu });
      }
    }

    /* ── Thư mục Tổng hợp: một thư mục con cho mỗi LẦN đã chạy phân tích ──── */
    for (const t of thuMuc) {
      // 🔴 Dùng bản ĐÃ LƯU, không chạy lại engine. Chạy lại là dựng ra một bản khác với
      // bản người ta từng đọc (nội dung ở `config/` có thể đã sửa), rồi gọi nó là "lần
      // chạy ngày hôm đó" — cùng lý do đã ghi ở màn mở lại thư mục.
      if (!laBanPhanTichHopLe(t.noiDung)) continue;
      const thuMucCon = `${THU_MUC_TONG_HOP}/${tenThuMucLanChay(t.taoLuc)}`;
      const lo = await xuatPdfMoiNguoi(t.noiDung, new Date(t.taoLuc));
      for (const mot of lo) tep.push({ ten: `${thuMucCon}/${mot.ten}`, duLieu: mot.duLieu });
    }

    return tep;
  } catch {
    /**
     * 🔴 SINH PDF HỎNG KHÔNG ĐƯỢC KÉO ĐỔ NÚT SAO LƯU. PDF là phần đọc-cho-vui; JSON mới
     * là phần cứu được dữ liệu. Font tải lỗi hay thư viện nạp lỗi thì vẫn phải ra một
     * tệp `.zip` đầy đủ — mất bản đẹp còn hơn mất sổ.
     */
    return [];
  }
}

/**
 * Gói trọn bản sao lưu rồi đẩy xuống máy. Trả `false` khi trình duyệt chặn tải.
 *
 * 🔴 MỌI NÚT SAO LƯU PHẢI ĐI QUA ĐÂY. Thêm một nút mà tự gọi `saoLuuTatCa()` là dựng lại
 * đúng cái lỗi file này sinh ra để chữa. `tests/sao-luu-tron-luong.test.tsx` có một cửa
 * canh đọc thẳng mã nguồn để chặn chuyện đó.
 */
export async function taiBanSaoLuuVeMay(): Promise<boolean> {
  const { duLieu } = await saoLuuTatCaKemTep(
    new Date().toISOString(),
    await cayTepDocDuoc(),
  );
  return taiXuong(duLieu, `${TEN_TEP_SAO_LUU}.zip`);
}
