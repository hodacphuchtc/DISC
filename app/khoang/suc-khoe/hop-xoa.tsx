"use client";

/**
 * HỘP THOẠI XOÁ (ADR-010). Dùng cho: (1) đủ 6 người mà thêm người mới — người dùng TỰ CHỌN
 * một người để xoá; (2) xác nhận xoá một người; (3) xác nhận xoá một bản.
 *
 * 🔴 Ba thứ bắt buộc, cùng tinh thần `hop-thoai-han-muc.tsx`: nêu đích danh cái sắp mất ·
 * cho tải bản sao lưu trước · cho huỷ mà KHÔNG mất gì.
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useEffect, useRef, useState } from "react";

import { CHU_SK } from "@config/suc-khoe-tu-dien";
import { taiBanSaoLuuVeMay } from "@/app/tai-sao-luu";

import { LinhVatMat } from "./linh-vat";

export type MuaChon = { readonly id: string; readonly chu: string };

export type YeuCauHop = {
  readonly tieuDe: string;
  readonly moTa: string;
  /** Có danh sách ⇒ người dùng phải chọn một mục. Rỗng ⇒ chỉ xác nhận. */
  readonly muaChon: readonly MuaChon[];
  readonly macDinhId?: string;
  readonly nutXoa: string;
  readonly khiXoa: (idDaChon: string | null) => void;
};

export function HopXoa({
  yc,
  onDong,
}: {
  readonly yc: YeuCauHop;
  readonly onDong: () => void;
}) {
  const [chon, datChon] = useState<string | null>(
    yc.macDinhId ?? yc.muaChon.at(-1)?.id ?? null,
  );
  const [nhac, datNhac] = useState<string | null>(null);
  const [dangTai, datDangTai] = useState(false);
  const nutHuy = useRef<HTMLButtonElement>(null);

  // Mở hộp thoại thì đưa tiêu điểm vào nút an toàn nhất (Huỷ); Esc đóng.
  useEffect(() => {
    nutHuy.current?.focus();
    const khiNhan = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDong();
    };
    window.addEventListener("keydown", khiNhan);
    return () => window.removeEventListener("keydown", khiNhan);
  }, [onDong]);

  async function taiSaoLuu() {
    datDangTai(true);
    try {
      datNhac(
        (await taiBanSaoLuuVeMay()) ? CHU_SK.hop.daTai : CHU_SK.hop.loiTai,
      );
    } catch {
      datNhac(CHU_SK.hop.loiTai);
    } finally {
      datDangTai(false);
    }
  }

  return (
    <div className="sk-hop-nen" data-thu="sk-hop-xoa">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sk-hop-tieu-de"
        className="sk-hop"
      >
        <div className="sk-hop-dau">
          <LinhVatMat />
          <h3 id="sk-hop-tieu-de">{yc.tieuDe}</h3>
        </div>
        <p>{yc.moTa}</p>
        {yc.muaChon.length > 0 && (
          <div
            className="sk-lc"
            role="radiogroup"
            aria-label={CHU_SK.hop.nhanDanhSach}
          >
            {yc.muaChon.map((m) => (
              <label key={m.id}>
                <input
                  type="radio"
                  name="sk-xoa"
                  value={m.id}
                  checked={chon === m.id}
                  onChange={() => datChon(m.id)}
                />
                <span>{m.chu}</span>
              </label>
            ))}
          </div>
        )}
        <p className="sk-nho-nhac">{CHU_SK.hop.nenSaoLuu}</p>
        {nhac && (
          <p role="status" className="sk-nho-nhac">
            {nhac}
          </p>
        )}
        <div className="sk-hang">
          <button
            type="button"
            className="sk-nut sk-nut-cam"
            disabled={dangTai}
            onClick={() => void taiSaoLuu()}
          >
            {CHU_SK.hop.taiSaoLuu}
          </button>
          <button
            type="button"
            className="sk-nut sk-nut-phu"
            disabled={yc.muaChon.length > 0 && chon === null}
            onClick={() => {
              yc.khiXoa(chon);
              onDong();
            }}
          >
            {yc.nutXoa}
          </button>
          <button
            ref={nutHuy}
            type="button"
            className="sk-nut-chu"
            onClick={onDong}
          >
            {CHU_SK.hop.huy}
          </button>
        </div>
      </div>
    </div>
  );
}
