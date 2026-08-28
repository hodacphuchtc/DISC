"use client";

/**
 * HAI HỘP THOẠI CỦA BẢNG GIA ĐÌNH — thêm/sửa một người, và hỏi trước khi xoá.
 *
 * Tách khỏi `app/khoang/bang-gia-dinh.tsx` để giữ luật "không file > 500 dòng".
 *
 * 🔴 `HoiXoa` là chỗ nhạy nhất: xoá một người là đường mất dữ liệu nhanh nhất trong cả
 * sản phẩm. Thứ tự nút ở đó là một thiết kế an toàn, không phải một lựa chọn thẩm mỹ —
 * đọc chú thích tại chỗ trước khi sắp lại.
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useState } from "react";

import { CHU_VAI, VAI_GIA_DINH, coHoiLop, type VaiGiaDinh } from "@config/disc-gia-dinh";
import { CHU_BANG_GIA_DINH, nhanLopCua } from "@config/disc-tu-dien";
import { tuyChonLop } from "@config/disc-nguong";
import { MAU } from "@config/thuong-hieu";
import type { CheDoXoaThanhVien, ThanhVien } from "@modules/core/gia-dinh/kieu";

/** 14 bậc: Mầm non · Lớp 1…12 · Trên lớp 12. Danh sách ở `config/`, không dựng tại chỗ. */
const LOP = tuyChonLop();

function maMoi(): string {
  return `tv-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

/* ── Form thêm / sửa ─────────────────────────────────────────────────────── */

export function FormThanhVien({
  tv,
  daCo,
  onLuu,
  onHuy,
}: {
  readonly tv: ThanhVien | null;
  readonly daCo: readonly ThanhVien[];
  readonly onLuu: (tv: ThanhVien) => void | Promise<void>;
  readonly onHuy: () => void;
}) {
  const [ten, datTen] = useState(tv?.ten ?? "");
  const [vai, datVai] = useState<VaiGiaDinh>(tv?.vaiTro ?? "con");
  const [lop, datLop] = useState(tv?.lop ?? "");
  const [ghiChu, datGhiChu] = useState(tv?.ghiChu ?? "");
  const [loi, datLoi] = useState<string | null>(null);

  const hoiLop = coHoiLop(vai);

  /**
   * 🔴 ĐỔI VAI THÌ XOÁ LỚP ĐANG CHỌN.
   *
   * Không xoá thì một người chọn "Con · Lớp 7" rồi đổi sang "Bố" sẽ được lưu kèm `lop: "7"`
   * — ô lớp đã ẩn đi nên không ai nhìn thấy, mà `laTreEm()` lại suy trẻ em từ chính việc
   * CÓ lớp. Kết quả: ông bố đó bị bản phân tích cả nhà đối xử như một đứa trẻ, và không
   * màn nào cho biết vì sao.
   */
  function doiVai(moi: VaiGiaDinh) {
    datVai(moi);
    if (!coHoiLop(moi)) datLop("");
  }

  function gui() {
    const sach = ten.trim();
    if (!sach) return datLoi(CHU_BANG_GIA_DINH.loiThieuTen);
    const trung = daCo.some(
      (x) => x.id !== tv?.id && x.ten.trim().toLowerCase() === sach.toLowerCase(),
    );
    if (trung) return datLoi(CHU_BANG_GIA_DINH.loiTrungTen);

    const bayGio = new Date().toISOString();
    void onLuu({
      id: tv?.id ?? maMoi(),
      ten: sach,
      vaiTro: vai,
      // 🔴 `hoiLop &&` là hàng rào THỨ HAI, không thừa. `doiVai()` lo trường hợp người
      // dùng đổi vai ngay tại form; dòng này lo trường hợp mở form SỬA một hồ sơ cũ vốn
      // đã mang lớp mồ côi (bản trước hỏi lớp cho mọi vai). Ô đã ẩn nên không ai thấy giá
      // trị đó, và lưu lại im lặng là cách nó sống thêm một vòng nữa.
      ...(hoiLop && lop ? { lop } : {}),
      ...(tv?.tuoi !== undefined ? { tuoi: tv.tuoi } : {}),
      ...(ghiChu.trim() ? { ghiChu: ghiChu.trim() } : {}),
      thuTu: tv?.thuTu ?? daCo.length,
      taoLuc: tv?.taoLuc ?? bayGio,
      suaLuc: bayGio,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tv ? CHU_BANG_GIA_DINH.nutSua : CHU_BANG_GIA_DINH.nutThem}
      data-thu="form-thanh-vien"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="max-h-[90dvh] w-full max-w-sm overflow-auto rounded-2xl bg-white p-5">
        <label className="block text-[14px] font-semibold text-neutral-800">
          {CHU_BANG_GIA_DINH.nhanTen}
          <input
            type="text"
            value={ten}
            autoFocus
            onChange={(e) => {
              datTen(e.target.value);
              datLoi(null);
            }}
            className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-[16px]"
            style={{ borderColor: MAU.vienMo }}
          />
        </label>

        <label className="mt-4 block text-[14px] font-semibold text-neutral-800">
          {CHU_BANG_GIA_DINH.nhanVai}
          <select
            value={vai}
            onChange={(e) => doiVai(e.target.value as VaiGiaDinh)}
            className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-[16px]"
            style={{ borderColor: MAU.vienMo }}
          >
            {VAI_GIA_DINH.map((v) => (
              <option key={v} value={v}>
                {CHU_VAI[v]}
              </option>
            ))}
          </select>
        </label>

        {/* Ô lớp CHỈ hiện với vai còn đi học. Bố mẹ ông bà không phải nhìn một ô không
            dành cho mình, và không thể vô tình để lại một số lớp trên hồ sơ của họ. */}
        {hoiLop && (
          <label className="mt-4 block text-[14px] font-semibold text-neutral-800">
            {CHU_BANG_GIA_DINH.nhanLop}
            <select
              value={lop}
              onChange={(e) => datLop(e.target.value)}
              className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-[16px]"
              style={{ borderColor: MAU.vienMo }}
            >
              <option value="">{CHU_BANG_GIA_DINH.chuaChonLop}</option>
              {LOP.map((l) => (
                <option key={l.gia} value={l.gia}>
                  {nhanLopCua(l.gia)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="mt-4 block text-[14px] font-semibold text-neutral-800">
          {CHU_BANG_GIA_DINH.nhanGhiChu}
          <textarea
            value={ghiChu}
            rows={2}
            onChange={(e) => datGhiChu(e.target.value)}
            className="mt-1.5 w-full rounded-xl border px-3 py-2.5 text-[15px]"
            style={{ borderColor: MAU.vienMo }}
          />
        </label>

        {loi && (
          <p role="alert" className="mt-3 text-[14px]" style={{ color: MAU.camDamChoChu }}>
            {loi}
          </p>
        )}

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={gui}
            className="min-h-[44px] flex-1 rounded-xl px-4 text-[15px] font-semibold text-white shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
            style={{ backgroundColor: MAU.timCongNghe }}
          >
            {CHU_BANG_GIA_DINH.nutLuu}
          </button>
          <button
            type="button"
            onClick={onHuy}
            className="min-h-[44px] rounded-xl border px-5 text-[15px] font-semibold text-neutral-700"
            style={{ borderColor: MAU.vienMo }}
          >
            {CHU_BANG_GIA_DINH.nutHuy}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Hỏi trước khi xoá người ─────────────────────────────────────────────── */

export function HoiXoa({
  tv,
  soBai,
  onHuy,
  onXoa,
}: {
  readonly tv: ThanhVien;
  readonly soBai: number;
  readonly onHuy: () => void;
  readonly onXoa: (cheDo: CheDoXoaThanhVien) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={CHU_BANG_GIA_DINH.hoiXoaTieuDe.replace("{ten}", tv.ten)}
      data-thu="hoi-xoa-thanh-vien"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-5">
        <h2 className="text-[17px] font-bold text-neutral-900">
          {CHU_BANG_GIA_DINH.hoiXoaTieuDe.replace("{ten}", tv.ten)}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-700">
          {soBai === 0
            ? CHU_BANG_GIA_DINH.hoiXoaKhongCoBai.replace("{ten}", tv.ten)
            : CHU_BANG_GIA_DINH.hoiXoaMoTa
                .replace("{ten}", tv.ten)
                .replace("{so}", String(soBai))}
        </p>

        <div className="mt-5 space-y-2.5">
          {/* 🔴 GIỮ BÀI đứng TRƯỚC và là nút chính. Thứ tự nút là một thiết kế an toàn:
              lựa chọn không thể hoàn tác không được đặt ở chỗ ngón tay rơi vào theo phản xạ. */}
          <button
            type="button"
            onClick={() => onXoa("giu-bai")}
            className="min-h-[44px] w-full rounded-xl px-4 text-[15px] font-semibold text-white shadow-nut-chinh transition-[box-shadow,transform] duration-150 hover:shadow-noi-2 active:translate-y-px active:shadow-lun motion-reduce:transition-none disabled:shadow-none"
            style={{ backgroundColor: MAU.timCongNghe }}
          >
            {soBai === 0 ? CHU_BANG_GIA_DINH.nutXoa : CHU_BANG_GIA_DINH.hoiXoaGiuBai}
          </button>
          {soBai > 0 && (
            <button
              type="button"
              onClick={() => onXoa("xoa-bai")}
              className="min-h-[44px] w-full rounded-xl border px-4 text-[15px]"
              style={{ borderColor: MAU.vienMo, color: MAU.camDamChoChu }}
            >
              {CHU_BANG_GIA_DINH.hoiXoaXoaBai}
            </button>
          )}
          <button
            type="button"
            onClick={onHuy}
            className="min-h-[44px] w-full rounded-xl px-4 text-[15px] text-neutral-600"
          >
            {CHU_BANG_GIA_DINH.nutHuy}
          </button>
        </div>
      </div>
    </div>
  );
}
