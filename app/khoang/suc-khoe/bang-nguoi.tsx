"use client";

/**
 * BẢNG SỨC KHOẺ CẢ NHÀ — dashboard gọn: 3 số tổng quát + mỗi người một thẻ nhỏ.
 * Bấm thẻ thì chi tiết người đó mở ra bên dưới, bấm lại thì đóng (ADR-010).
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import {
  TOI_DA_BAN_MOI_NGUOI,
  TOI_DA_NGUOI_SUC_KHOE,
} from "@config/suc-khoe-nguong";
import { CHU_SK } from "@config/suc-khoe-tu-dien";
import type { NguoiSucKhoe } from "@modules/core/suc-khoe/kieu";
import { hienNgay } from "@modules/core/tien-ich/ngay";

import { dien, soVN, tomTatMoc, tuoiChu } from "./tien-ich";

function XuHuong({ ds }: { readonly ds: readonly number[] }) {
  if (ds.length < 2) return null;
  // Cũ → mới, trái → phải.
  const v = [...ds].reverse();
  const mn = Math.min(...v);
  const r = Math.max(...v) - mn || 1;
  const diem = v.map(
    (y, i) =>
      [4 + i * (76 / (v.length - 1)), 22 - ((y - mn) / r) * 18] as const,
  );
  const cuoi = diem[diem.length - 1]!;
  return (
    <svg
      className="sk-spark"
      viewBox="0 0 84 26"
      role="img"
      aria-label={CHU_SK.bang.xuHuong}
    >
      <polyline
        points={diem.map((d) => d.join(",")).join(" ")}
        fill="none"
        stroke="#a855d6"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={cuoi[0]} cy={cuoi[1]} r="3.5" fill="#ff8f2d" />
    </svg>
  );
}

export function BangNguoi({
  ds,
  dangMo,
  moiNhatId,
  onChon,
  onThem,
}: {
  readonly ds: readonly NguoiSucKhoe[];
  /** Id người đang mở chi tiết; `null` = đã đóng. */
  readonly dangMo: string | null;
  readonly moiNhatId: string | null;
  readonly onChon: (id: string) => void;
  readonly onThem: () => void;
}) {
  const tongBan = ds.reduce((s, n) => s + n.moc.length, 0);
  const B = CHU_SK.bang;
  return (
    <section
      className="sk-the sk-hien"
      aria-labelledby="sk-h-bang"
      data-thu="sk-bang"
    >
      <div className="sk-the-ten">
        <div className="sk-bieu" aria-hidden="true">
          📊
        </div>
        <h2 id="sk-h-bang">{B.tieuDe}</h2>
      </div>
      <div className="sk-so-lieu">
        <div>
          <small>{B.soNguoi}</small>
          <b>
            {ds.length}/{TOI_DA_NGUOI_SUC_KHOE}
          </b>
        </div>
        <div>
          <small>{B.soBan}</small>
          <b>{tongBan}</b>
        </div>
        <div>
          <small>{B.moiNguoiToiDa}</small>
          <b>
            {TOI_DA_BAN_MOI_NGUOI} {B.banUnit}
          </b>
        </div>
      </div>
      {ds.length === 0 && <p className="sk-trong">{B.trong}</p>}
      <div className="sk-luoi-ng">
        {ds.map((n, i) => {
          const moc = n.moc[0]!;
          const tt = tomTatMoc(n, moc);
          const dangXem = dangMo === n.id;
          return (
            <button
              key={n.id}
              type="button"
              className={`sk-cn sk-c${i % 4}`}
              aria-pressed={dangXem}
              onClick={() => onChon(n.id)}
            >
              {n.id === moiNhatId && (
                <span className="sk-moi-nhan">{B.moi}</span>
              )}
              <span className="sk-hang1">
                <span className="sk-av" aria-hidden="true">
                  {[...n.ten.trim()][0]?.toUpperCase() ?? "?"}
                </span>
                <span>
                  <b>{n.ten}</b>
                  <small>{tuoiChu(n.ngaySinh, moc.ngayDo)}</small>
                </span>
                {tt.kq.hopLe && tt.kq.bmi !== null && (
                  <span className="sk-bmi-nho">
                    {soVN(tt.kq.bmi)}
                    <small>{B.bmi}</small>
                  </span>
                )}
              </span>
              <span>
                <span
                  className={`sk-pill ${tt.muc === "luu-y" ? "sk-luu-y" : tt.muc === "trung" ? "sk-trung" : ""}`}
                >
                  {tt.nhan}
                </span>
              </span>
              <span className="sk-hang3">
                <span>
                  {n.moc.length}/{TOI_DA_BAN_MOI_NGUOI} {B.ban} ·{" "}
                  {hienNgay(moc.ngayDo)}
                </span>
                <XuHuong
                  ds={n.moc.flatMap((m) => {
                    const t = tomTatMoc(n, m);
                    return t.kq.hopLe && t.kq.bmi !== null ? [t.kq.bmi] : [];
                  })}
                />
              </span>
              <span className="sk-xem">{dangXem ? B.dangXem : B.xem}</span>
            </button>
          );
        })}
        {ds.length < TOI_DA_NGUOI_SUC_KHOE && (
          <button type="button" className="sk-cn sk-cn-them" onClick={onThem}>
            <span>
              {B.them}
              <br />
              <small>
                {dien(B.conCho, { so: TOI_DA_NGUOI_SUC_KHOE - ds.length })}
              </small>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
