"use client";

/**
 * CHI TIẾT MỘT NGƯỜI — bản MỚI NHẤT mở sẵn; các bản cũ gập lại, bấm xổ ra / đóng lại.
 * Lời khuyên (ăn uống, vận động, nghỉ ngơi, thử thách) là hàng gập, bấm mới xổ (ADR-010).
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useEffect, useState } from "react";

import {
  KHUON_LOI_KHUYEN,
  type NhomLoiKhuyen,
} from "@config/suc-khoe-noi-dung";
import { TOI_DA_BAN_MOI_NGUOI } from "@config/suc-khoe-nguong";
import { CHU_SK } from "@config/suc-khoe-tu-dien";
import { chonKhuon } from "@modules/core/suc-khoe/chon-khuon";
import type { MocDo, NguoiSucKhoe } from "@modules/core/suc-khoe/kieu";
import { taiXuong } from "@modules/core/luu-tru/tai-ve";
import { hienNgay } from "@modules/core/tien-ich/ngay";

import { LinhVatMat } from "./linh-vat";
import {
  DongChu,
  dien,
  phanVong,
  soGon,
  soVN,
  tomTatMoc,
  tuoiChu,
} from "./tien-ich";

const R = 62;
const CHU_VI = 2 * Math.PI * R;

function daTatChuyenDong(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function Vong({ bmi }: { readonly bmi: number | null }) {
  // Tiến độ 0→1 của hiệu ứng "số chạy lên + vòng tô dần". Chỉ đổi BÊN TRONG callback
  // requestAnimationFrame (không đổi đồng bộ trong effect). Bật "giảm chuyển động" ⇒ nhảy
  // thẳng tới đích ở khung hình đầu.
  const [tienDo, datTienDo] = useState(0);

  useEffect(() => {
    const tat = daTatChuyenDong();
    const batDau = performance.now();
    let khung = 0;
    const chay = (t: number) => {
      const x = tat ? 1 : Math.min((t - batDau) / 1000, 1);
      datTienDo(1 - Math.pow(1 - x, 3));
      if (x < 1) khung = requestAnimationFrame(chay);
    };
    khung = requestAnimationFrame(chay);
    return () => cancelAnimationFrame(khung);
  }, [bmi]);

  const phan = phanVong(bmi) * tienDo;
  return (
    <div
      className="sk-vong"
      role="img"
      aria-label={
        bmi === null ? CHU_SK.ct.khongApBmi : `${CHU_SK.ct.bmi} ${soVN(bmi)}`
      }
    >
      <svg viewBox="0 0 150 150" aria-hidden="true">
        <defs>
          <linearGradient id="sk-gr" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffb066" />
            <stop offset="1" stopColor="#c58cf0" />
          </linearGradient>
        </defs>
        <circle
          cx="75"
          cy="75"
          r={R}
          fill="none"
          stroke="rgba(255,255,255,.14)"
          strokeWidth="12"
        />
        <circle
          className="sk-gt-v"
          cx="75"
          cy="75"
          r={R}
          fill="none"
          strokeWidth="12"
          strokeDasharray={`${CHU_VI * phan} 999`}
        />
      </svg>
      <div className="sk-so">
        <b>{bmi === null ? "—" : soVN(bmi * tienDo)}</b>
        <small>{CHU_SK.ct.bmi}</small>
      </div>
    </div>
  );
}

function MucLoiKhuyen({
  nhom,
  bieuTuong,
  extra,
}: {
  readonly nhom: NhomLoiKhuyen;
  readonly bieuTuong: string;
  readonly extra?: React.ReactNode;
}) {
  return (
    <details className="sk-acc">
      <summary>
        <span className="sk-ic" aria-hidden="true">
          {bieuTuong}
        </span>
        <span className="sk-t">
          <b>{nhom.tieuDe}</b>
          <small>{nhom.tomTat}</small>
        </span>
        <span className="sk-mui" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="sk-nd">
        <ul className="sk-muc">
          {nhom.muc.map(([ic, chu]) => (
            <li key={chu}>
              <span className="sk-ic2" aria-hidden="true">
                {ic}
              </span>
              <span>
                <DongChu chu={chu} />
              </span>
            </li>
          ))}
        </ul>
        {nhom.luuY && (
          <div className="sk-luu-y-hop">
            💡 <DongChu chu={nhom.luuY} />
          </div>
        )}
        {nhom.tuan && (
          <>
            <div style={{ margin: "12px 0 0", fontWeight: 700 }}>
              {CHU_SK.ct.tuan}
            </div>
            <div className="sk-tuan">
              {nhom.tuan.map(([thu, viec]) => (
                <div key={thu}>
                  <b>{thu}</b>
                  {viec}
                </div>
              ))}
            </div>
          </>
        )}
        {extra}
      </div>
    </details>
  );
}

function ThuThach({ viec }: { readonly viec: readonly string[] }) {
  function khiTick(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.checked || daTatChuyenDong()) return;
    const sao = e.target.parentElement?.querySelector<HTMLElement>(".sk-sao");
    if (!sao) return;
    sao.style.setProperty(
      "--sk-dx",
      `${Math.round(Math.random() * 40 - 10)}px`,
    );
    sao.classList.remove("sk-bay-sao");
    void sao.offsetWidth;
    sao.classList.add("sk-bay-sao");
  }
  return (
    <details className="sk-acc">
      <summary>
        <span className="sk-ic" aria-hidden="true">
          ⭐
        </span>
        <span className="sk-t">
          <b>{CHU_SK.ct.thuThach}</b>
          <small>{CHU_SK.ct.thuThachTomTat}</small>
        </span>
        <span className="sk-mui" aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className="sk-nd sk-thu">
        {viec.map((v) => (
          <label key={v}>
            <input type="checkbox" onChange={khiTick} />
            <span>{v}</span>
            <span className="sk-sao" aria-hidden="true">
              ⭐
            </span>
          </label>
        ))}
      </div>
    </details>
  );
}

function ThayDoi({
  moi,
  cu,
}: {
  readonly moi: MocDo;
  readonly cu: MocDo | undefined;
}) {
  if (!cu) return null;
  const C = CHU_SK.ct;
  const nhan = (x: number) => (x > 0 ? C.tang : x < 0 ? C.giam : C.khongDoi);
  const dk = Math.round((moi.canNangKg - cu.canNangKg) * 10) / 10;
  const dc = Math.round((moi.chieuCaoCm - cu.chieuCaoCm) * 10) / 10;
  return (
    <p className="sk-delta">
      {dien(C.soVoi, { ngay: hienNgay(cu.ngayDo) })} {C.canNangLabel}{" "}
      <b>
        {nhan(dk)}
        {dk ? ` ${soGon(Math.abs(dk))} kg` : ""}
      </b>
      , {C.chieuCaoLabel}{" "}
      <b>
        {nhan(dc)}
        {dc ? ` ${soGon(Math.abs(dc))} cm` : ""}
      </b>
      .
    </p>
  );
}

function ChiSo({
  nguoi,
  moc,
}: {
  readonly nguoi: NguoiSucKhoe;
  readonly moc: MocDo;
}) {
  const C = CHU_SK.ct;
  const tt = tomTatMoc(nguoi, moc);
  const nangLuong = tt.kq.hopLe ? (tt.kq.tdeeKcal ?? tt.kq.bmrKcal) : null;
  const laNghi = tt.kq.hopLe && tt.kq.tdeeKcal === null;
  return (
    <div className="sk-chi-so">
      <div>
        <small>{C.chieuCao}</small>
        <b>{soGon(moc.chieuCaoCm)} cm</b>
      </div>
      <div>
        <small>{C.canNang}</small>
        <b>{soGon(moc.canNangKg)} kg</b>
      </div>
      <div>
        <small>{C.bmi}</small>
        <b>{tt.kq.hopLe && tt.kq.bmi !== null ? soVN(tt.kq.bmi) : "—"}</b>
      </div>
      {nangLuong !== null && (
        <div>
          <small>{laNghi ? C.nangLuongNghi : C.nangLuong}</small>
          <b>
            {Math.round(nangLuong).toLocaleString("vi-VN")} {C.kcalNgay}
          </b>
        </div>
      )}
    </div>
  );
}

export function ChiTietNguoi({
  nguoi,
  onXoaNguoi,
  onXoaBan,
}: {
  readonly nguoi: NguoiSucKhoe;
  readonly onXoaNguoi: () => void;
  readonly onXoaBan: (moc: MocDo) => void;
}) {
  const C = CHU_SK.ct;
  const [dangTaoPdf, datDangTaoPdf] = useState(false);
  const [nhacPdf, datNhacPdf] = useState<string | null>(null);
  const moi = nguoi.moc[0]!;

  /**
   * 🔴 jsPDF CHỈ được vào bằng `await import()` (ADR-009): nạp lười, gói chính không phình.
   * Gọi qua `@modules/report/xuat-pdf` — nơi DUY NHẤT nhắc tới `jspdf`.
   */
  async function taiPdf() {
    datDangTaoPdf(true);
    datNhacPdf(null);
    try {
      const { xuatPdfSucKhoe } = await import("@modules/report/xuat-pdf");
      const tep = await xuatPdfSucKhoe(nguoi, new Date());
      datNhacPdf(taiXuong(tep.duLieu, tep.ten) ? C.daTaiPdf : C.loiTaiPdf);
    } catch {
      datNhacPdf(C.loiTaiPdf);
    } finally {
      datDangTaoPdf(false);
    }
  }
  const tt = tomTatMoc(nguoi, moi);
  const ma = chonKhuon(tt.dauVao, tt.kq);
  const khuon = ma ? KHUON_LOI_KHUYEN[ma] : null;
  const canhBaoHienThi = tt.kq.hopLe
    ? tt.kq.canhBao.filter((c) => c !== "khong-thay-bac-si")
    : [];
  const moTaNhan =
    tt.kq.hopLe && tt.kq.bmi === null
      ? C.khongApBmiMoTa
      : tt.kq.hopLe && tt.kq.phanLoaiZ === null && tt.kq.phanLoaiBmi === null
        ? C.chuaCoBangMoTa
        : (khuon?.giaiThich ?? "");

  return (
    <section className="sk-ct" aria-live="polite" data-thu="sk-chi-tiet">
      <div>
        <h2>{dien(C.tieuDe, { ten: nguoi.ten })}</h2>
        <p className="sk-tuoi">
          {tuoiChu(nguoi.ngaySinh, moi.ngayDo)} ·{" "}
          {dien(C.soBanDaLuu, {
            so: nguoi.moc.length,
            toiDa: TOI_DA_BAN_MOI_NGUOI,
          })}
        </p>
        <div className="sk-moi-hdr">
          <span className="sk-nhan">{C.moiNhat}</span>
          <b>{dien(C.doNgay, { ngay: hienNgay(moi.ngayDo) })}</b>
        </div>
        <div className="sk-dau-kq">
          <Vong bmi={tt.kq.hopLe ? tt.kq.bmi : null} />
          <div>
            <div
              className={`sk-tag ${tt.muc === "luu-y" ? "sk-luu-y" : tt.muc === "trung" ? "sk-trung" : ""}`}
            >
              {tt.nhan}
            </div>
            <p className="sk-ghichu">{moTaNhan}</p>
            {canhBaoHienThi.length > 0 && (
              <ul
                className="sk-ghichu"
                style={{ margin: "8px 0 0", paddingLeft: 18 }}
              >
                {canhBaoHienThi
                  .filter(
                    (c) =>
                      c !== "chua-co-bang-tang-truong" &&
                      c !== "mang-thai-khong-ap-bmi",
                  )
                  .map((c) => (
                    <li key={c}>{CHU_SK.canhBao[c]}</li>
                  ))}
              </ul>
            )}
          </div>
        </div>
        <ChiSo nguoi={nguoi} moc={moi} />
        <ThayDoi moi={moi} cu={nguoi.moc[1]} />

        {khuon && (
          <>
            <div className="sk-noi-lo">
              <LinhVatMat />
              <div className="sk-bong">
                <DongChu chu={khuon.loiChao(nguoi.ten)} />
              </div>
            </div>
            <MucLoiKhuyen
              nhom={khuon.anUong}
              bieuTuong={CHU_SK.nhomLoiKhuyen.an}
            />
            <MucLoiKhuyen
              nhom={khuon.vanDong}
              bieuTuong={CHU_SK.nhomLoiKhuyen.vd}
            />
            <MucLoiKhuyen
              nhom={khuon.nghiNgoi}
              bieuTuong={CHU_SK.nhomLoiKhuyen.ng}
            />
            <ThuThach viec={khuon.thuThach} />
          </>
        )}

        {nguoi.moc.length > 1 && (
          <>
            <div className="sk-cu-tieu">{C.banCuTieuDe}</div>
            {nguoi.moc.slice(1).map((m, i) => {
              const t = tomTatMoc(nguoi, m);
              return (
                <details key={m.id} className="sk-cu-ban">
                  <summary>
                    <span className="sk-nd-ng">
                      <b>{dien(C.banNgay, { ngay: hienNgay(m.ngayDo) })}</b>
                      <small>{t.nhan}</small>
                    </span>
                    <span className="sk-bmi-c">
                      {t.kq.hopLe && t.kq.bmi !== null ? soVN(t.kq.bmi) : "—"}
                    </span>
                    <span className="sk-mui" aria-hidden="true">
                      ▾
                    </span>
                  </summary>
                  <div className="sk-noi-dung">
                    <ChiSo nguoi={nguoi} moc={m} />
                    <ThayDoi moi={m} cu={nguoi.moc[i + 2]} />
                    <div className="sk-bao-cao">
                      <button
                        type="button"
                        className="sk-nut"
                        onClick={() => onXoaBan(m)}
                      >
                        {C.xoaBan}
                      </button>
                    </div>
                  </div>
                </details>
              );
            })}
          </>
        )}

        <div className="sk-bao-cao">
          <button
            type="button"
            className="sk-nut sk-nut-cam"
            disabled={dangTaoPdf}
            onClick={() => void taiPdf()}
          >
            {dien(C.taiPdf, { ten: nguoi.ten })}
          </button>
          <button type="button" className="sk-nut" onClick={onXoaNguoi}>
            {C.xoaNguoi}
          </button>
        </div>
        {nhacPdf && (
          <p role="status" className="sk-ghichu" style={{ marginTop: 8 }}>
            {nhacPdf}
          </p>
        )}
      </div>
    </section>
  );
}
