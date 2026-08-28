"use client";

/**
 * KHỐI GIỮ DỮ LIỆU — Sao lưu · Khôi phục · Xoá sạch.
 *
 * 🔴 VÌ SAO NÓ NẰM Ở CHÂN TRANG, NGOÀI CẢ HAI BƯỚC (18.2). Ba nút này gói TRỌN máy: tên
 * từng người, mọi bài, mọi bản phân tích cả nhà. Chúng không thuộc riêng bước *Nhà mình* —
 * và nút *Khôi phục* là thứ người ta đi tìm vào đúng ngày họ đã mất dữ liệu, ngày tệ nhất
 * để phải mở đúng bước 1 rồi cuộn hết bảng gia đình mới thấy.
 *
 * 🔴 KHỐI NÀY KHÔNG ĐƯỢC MANG CHỮ "NHÀ MÌNH". `tests/duong-vao-bai.ts` tìm nút vào bài bằng
 * `getByRole("button", { name: /Nhà mình/ })`; một nút thứ hai khớp là `getByRole` ném
 * *"found multiple elements"*, và nó kéo đỏ mọi test đi qua bước 1. Tiêu đề khác chữ đó thì
 * được — ràng buộc nằm ở CHỮ, không ở việc có tiêu đề.
 *
 * 🔴 `data-khong-in`: khối này nay LUÔN có trong DOM. Trước 18.2 nó nằm trong
 * `KhoangNhaMinh`, vốn `return` sớm khi mở màn kết quả — nên lúc bấm In nó tình cờ vắng
 * mặt. Đưa ra ngoài là gỡ tấm chắn tình cờ ấy: không đánh dấu thì ba cái nút in ra giấy.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useState } from "react";

import { taiBanSaoLuuVeMay } from "@/app/tai-sao-luu";
import { KHUNG } from "@config/bo-cuc";
import { CHU_M6 } from "@config/disc-tu-dien";
import { MAU } from "@config/thuong-hieu";
import { docTatCa, docThanhVien, xoaSachTatCa } from "@modules/core/luu-tru/kho-bai";
import { docTuZip, ghiDeKho, type SoTuTep } from "@modules/core/luu-tru/khoi-phuc";

export function KhoiGiuDuLieu({
  onDonKho,
}: {
  /**
   * Kho vừa bị THAY TRỌN (khôi phục hoặc xoá sạch).
   *
   * 🔴 KHÔNG phải để nạp lại dữ liệu — `bang-gia-dinh`, `cac-buoc` và `phan-tich` đều đã
   * nghe kho qua `useKhoDoi`, và cả `xoaSachTatCa()` lẫn `ghiDeKho()` đều bắn `baoDoi()`.
   * Dựng thêm một đường báo song song là đúng lỗi mà `app/dung-kho-doi.ts` sinh ra để chữa.
   *
   * Việc của cờ này khác hẳn: **đóng màn kết quả đang mở**. Nếu ai đó đang xem kết quả của
   * một người rồi bấm *Xoá sạch*, kho trống nhưng màn kết quả vẫn giữ bài cũ — người dùng
   * ngồi đọc kết quả của một bài vừa bị xoá. Cùng họ với lỗi `V3.1`.
   */
  readonly onDonKho?: () => void;
}) {
  const [dangSaoLuu, datDangSaoLuu] = useState(false);
  const [dangDocTep, datDangDocTep] = useState(false);
  /** Đã khôi phục xong bao nhiêu — hiện một dòng xác nhận, không hiện hộp thoại nữa. */
  const [daKhoiPhuc, datDaKhoiPhuc] = useState<{ nguoi: number; bai: number } | null>(null);
  const [loi, datLoi] = useState<string | null>(null);

  /**
   * Người dùng vừa chọn một tệp .zip.
   *
   * 🔴 ĐỌC TRƯỚC, HỎI SAU, GHI CUỐI. Ba bước tách bạch, và bước GHI chỉ chạy khi người
   * dùng đã nhìn thấy cả hai con số rồi bấm đồng ý. Mọi nhánh thất bại đều thoát ra mà
   * KHÔNG đụng vào kho — đó là điều kiện để nút này không trở thành nút mất dữ liệu.
   */
  async function chonTepKhoiPhuc(tep: File | null | undefined) {
    if (!tep || dangDocTep) return;
    datDangDocTep(true);
    datLoi(null);
    datDaKhoiPhuc(null);
    try {
      const kq = await docTuZip(await tep.arrayBuffer());
      if (!kq.ok) {
        datLoi(
          kq.loi === "khong-mo-duoc"
            ? CHU_M6.loiKhongMoDuoc
            : kq.loi === "khong-phai-so-disc"
              ? CHU_M6.loiKhongPhaiSo
              : CHU_M6.loiDuLieuHong,
        );
        return;
      }
      await hoiRoiGhiDe(kq.so);
    } catch {
      datLoi(CHU_M6.loiKhongMoDuoc);
    } finally {
      datDangDocTep(false);
    }
  }

  async function hoiRoiGhiDe(so: SoTuTep) {
    const [nguoiCu, baiCu] = await Promise.all([docThanhVien(), docTatCa()]);
    const cau = CHU_M6.hoiGhiDe
      .replace("{cu}", String(nguoiCu.length))
      .replace("{baiCu}", String(baiCu.length))
      .replace("{moi}", String(so.thanhVien.length))
      .replace("{baiMoi}", String(so.bai.length));
    const themNhac = so.banCu ? `\n\n${CHU_M6.nhacBanCu}` : "";
    if (!window.confirm(cau + themNhac)) return;

    await ghiDeKho(so);
    datDaKhoiPhuc({ nguoi: so.thanhVien.length, bai: so.bai.length });
    onDonKho?.();
  }

  async function taiSaoLuu() {
    if (dangSaoLuu) return;
    datDangSaoLuu(true);
    datLoi(null);
    try {
      if (!(await taiBanSaoLuuVeMay())) datLoi(CHU_M6.loiSaoLuu);
    } catch {
      datLoi(CHU_M6.loiSaoLuu);
    } finally {
      datDangSaoLuu(false);
    }
  }

  /**
   * 🔴 DỌN TRỌN BA BẢNG, không chỉ bảng bài.
   *
   * Bản trước gọi `xoaSach()` — chỉ dọn BÀI, để nguyên tên từng người và các bản phân
   * tích đã chạy. Người bấm tin là mình vừa xoá sạch máy, mà tên thật của cả nhà vẫn còn
   * đó. Luật máy demo của giáo viên/sale dựa thẳng vào nút này.
   */
  async function xoaTatCa() {
    if (!window.confirm(CHU_M6.hoiXoaSach)) return;
    await xoaSachTatCa();
    onDonKho?.();
  }

  return (
    <section
      data-thu="giu-du-lieu"
      data-khong-in
      className="mt-14 border-t pt-8"
      style={{ borderColor: MAU.vienMo }}
    >
      {/* 🔴 `data-thu="hang-nut"` để cửa kiểm đếm được ĐỦ BA nút. Không đếm bằng
          `getAllByRole("button")` được: nút Khôi phục cố ý là một `<label>`. */}
      <div data-thu="hang-nut" className="flex flex-wrap items-center gap-2.5">
        {/* 🔴 Nhãn đổi trong lúc nén ⇒ TÊN TRỢ NĂNG của nút đổi theo. Cửa kiểm nào bấm
            xong rồi mới `findByRole({ name: nutSaoLuu })` sẽ không thấy nút nữa; phải giữ
            tham chiếu trước khi bấm. Đổi nhãn là cố ý: từ GĐ16 nút này sinh PDF nên mất
            khoảng nửa giây, mà im lặng nửa giây sau một cú bấm là cảm giác nút hỏng. */}
        <button
          type="button"
          disabled={dangSaoLuu}
          aria-busy={dangSaoLuu}
          onClick={() => void taiSaoLuu()}
          className="min-h-[44px] rounded-xl border-[1.5px] bg-white px-4 text-[14px] font-semibold disabled:opacity-60"
          style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
        >
          {dangSaoLuu ? CHU_M6.dangSaoLuu : CHU_M6.nutSaoLuu}
        </button>

        {/* 🔴 Ô chọn tệp ẩn sau một nhãn trông như nút: `<input type="file">` không tạo
            kiểu được cho tử tế, mà đây là nút người ta chỉ bấm vào ngày họ đã mất dữ
            liệu — ngày tệ nhất để phải đoán xem cái gì bấm được. */}
        <label
          className="inline-flex min-h-[44px] cursor-pointer items-center rounded-xl border-[1.5px] bg-white px-4 text-[14px] font-semibold"
          style={{ borderColor: MAU.timCongNghe, color: MAU.timCongNghe }}
        >
          {dangDocTep ? CHU_M6.dangDocTep : CHU_M6.nutKhoiPhuc}
          <input
            type="file"
            accept=".zip,application/zip"
            className="sr-only"
            onChange={(e) => {
              const tep = e.target.files?.[0];
              // Xoá giá trị để chọn LẠI CÙNG một tệp vẫn kích hoạt được onChange.
              e.target.value = "";
              void chonTepKhoiPhuc(tep);
            }}
          />
        </label>

        {/* 🔴 VIỀN ĐỎ, NỀN TRẮNG — không phải nền đỏ đặc. Viền đỏ nói *"cẩn thận"*; nền đỏ
            đặc nói *"bấm tôi"*, mà đây là nút xoá sạch cả nhà và không lấy lại được.
            🔴 `sm:ml-auto` chứ không `ml-auto`: ở 320px, `ml-auto` trong một hàng
            `flex-wrap` đẩy nút xuống một dòng riêng lệch phải, trông như lỗi bố cục. */}
        <button
          type="button"
          onClick={() => void xoaTatCa()}
          className="min-h-[44px] rounded-xl border-[1.5px] bg-white px-4 text-[14px] font-semibold sm:ml-auto"
          style={{ borderColor: MAU.doCanhBao, color: MAU.doCanhBao }}
        >
          {CHU_M6.nutXoaSach}
        </button>
      </div>

      {daKhoiPhuc && (
        <p
          data-thu="da-khoi-phuc"
          role="status"
          className="mt-2.5 text-[13px] font-semibold"
          style={{ color: MAU.timCongNghe }}
        >
          {CHU_M6.daKhoiPhuc
            .replace("{nguoi}", String(daKhoiPhuc.nguoi))
            .replace("{bai}", String(daKhoiPhuc.bai))}
        </p>
      )}
      {loi && (
        <p role="alert" className="mt-2.5 text-[13px]" style={{ color: MAU.camDamChoChu }}>
          {loi}
        </p>
      )}

      {/* Khung cha ở `cac-buoc.tsx` rộng tới 1600px, nên dòng chữ này cần khung đọc riêng —
          không có nó thì câu nhắc kéo dài hết màn 1920px và mắt lạc dòng. */}
      <p className={`mt-3 text-[13px] leading-relaxed text-neutral-500 ${KHUNG.doc}`}>
        {CHU_M6.nhacMatDuLieu}
      </p>
    </section>
  );
}
