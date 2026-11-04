"use client";

/**
 * FORM THÊM SỐ ĐO MỚI — nằm TRÊN CÙNG thẻ để dễ thấy (ADR-010).
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useState } from "react";

import { CHU_SK } from "@config/suc-khoe-tu-dien";
import type { GioiTinh, MucVanDong } from "@modules/core/suc-khoe/kieu";

import { homNayIso } from "./tien-ich";

/** Dữ liệu đã kiểm cơ bản từ form — luật nghiệp vụ (khoảng số đo…) do `phanTichSucKhoe` canh. */
export type DuLieuForm = {
  readonly ten: string;
  readonly ngaySinh: string;
  readonly gioiTinh: GioiTinh;
  readonly ngayDo: string;
  readonly canNangKg: number;
  readonly chieuCaoCm: number;
  readonly vongEoCm?: number;
  readonly mucVanDong?: MucVanDong;
  readonly mangThaiHoacChoBu: boolean;
  readonly coBenhNen: boolean;
};

export function FormSoDo({
  onLuu,
  loi,
  dangLuu,
}: {
  /** Trả `true` khi lưu xong thì form dọn số đo (giữ tên/ngày sinh để nhập bản kế tiếp). */
  readonly onLuu: (d: DuLieuForm) => Promise<boolean>;
  readonly loi: string | null;
  readonly dangLuu: boolean;
}) {
  const F = CHU_SK.form;
  const [ten, datTen] = useState("");
  const [ngaySinh, datNgaySinh] = useState("");
  const [gioiTinh, datGioiTinh] = useState<GioiTinh>("nu");
  const [ngayDo, datNgayDo] = useState(homNayIso);
  const [canNang, datCanNang] = useState("");
  const [chieuCao, datChieuCao] = useState("");
  const [vongEo, datVongEo] = useState("");
  const [vanDong, datVanDong] = useState<MucVanDong | "">("");
  const [mangThai, datMangThai] = useState(false);
  const [benhNen, datBenhNen] = useState(false);
  const [loiCucBo, datLoiCucBo] = useState<string | null>(null);

  async function guiDi() {
    datLoiCucBo(null);
    if (ten.trim().length === 0) return datLoiCucBo(CHU_SK.loiForm.tenRong);
    if (!ngaySinh || !ngayDo) return datLoiCucBo(CHU_SK.loiForm.ngayThieu);
    const kg = Number(canNang.replace(",", "."));
    const cm = Number(chieuCao.replace(",", "."));
    if (
      !Number.isFinite(kg) ||
      !Number.isFinite(cm) ||
      canNang === "" ||
      chieuCao === ""
    ) {
      return datLoiCucBo(CHU_SK.loiForm.canNangThieu);
    }
    const eo = vongEo === "" ? undefined : Number(vongEo.replace(",", "."));
    const xong = await onLuu({
      ten,
      ngaySinh,
      gioiTinh,
      ngayDo,
      canNangKg: kg,
      chieuCaoCm: cm,
      vongEoCm: eo !== undefined && Number.isFinite(eo) ? eo : undefined,
      mucVanDong: vanDong === "" ? undefined : vanDong,
      mangThaiHoacChoBu: mangThai,
      coBenhNen: benhNen,
    });
    if (xong) {
      datCanNang("");
      datChieuCao("");
      datVongEo("");
    }
  }

  return (
    <section
      className="sk-the sk-form sk-hien"
      id="sk-form"
      aria-labelledby="sk-h-form"
      data-thu="sk-form"
    >
      <div className="sk-the-ten">
        <div className="sk-bieu" aria-hidden="true">
          📏
        </div>
        <h2 id="sk-h-form">{F.tieuDe}</h2>
        <span className="sk-goi-y">{F.goiY}</span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void guiDi();
        }}
        noValidate
      >
        <div className="sk-luoi3">
          <div>
            <label htmlFor="sk-ten">{F.ten}</label>
            <input
              id="sk-ten"
              type="text"
              autoComplete="off"
              maxLength={40}
              value={ten}
              onChange={(e) => datTen(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sk-ns">{F.ngaySinh}</label>
            <input
              id="sk-ns"
              type="date"
              value={ngaySinh}
              onChange={(e) => datNgaySinh(e.target.value)}
            />
          </div>
          <div>
            <label id="sk-gt-nhan">
              {F.gioiTinh} <small>{F.gioiTinhGoiY}</small>
            </label>
            <div
              className="sk-gt"
              role="radiogroup"
              aria-labelledby="sk-gt-nhan"
            >
              <label>
                <input
                  type="radio"
                  name="sk-gt"
                  checked={gioiTinh === "nu"}
                  onChange={() => datGioiTinh("nu")}
                />
                <span>{F.nu}</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="sk-gt"
                  checked={gioiTinh === "nam"}
                  onChange={() => datGioiTinh("nam")}
                />
                <span>{F.nam}</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="sk-nd">{F.ngayDo}</label>
            <input
              id="sk-nd"
              type="date"
              value={ngayDo}
              onChange={(e) => datNgayDo(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sk-cn">
              {F.canNang} <small>{F.donViKg}</small>
            </label>
            <input
              id="sk-cn"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={canNang}
              onChange={(e) => datCanNang(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sk-cc">
              {F.chieuCao} <small>{F.donViCm}</small>
            </label>
            <input
              id="sk-cc"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={chieuCao}
              onChange={(e) => datChieuCao(e.target.value)}
            />
          </div>
        </div>

        <details className="sk-them">
          <summary>{F.themThongTin}</summary>
          <div className="sk-luoi3" style={{ marginTop: 8 }}>
            <div>
              <label htmlFor="sk-eo">
                {F.vongEo} <small>{F.vongEoGoiY}</small>
              </label>
              <input
                id="sk-eo"
                type="number"
                inputMode="decimal"
                value={vongEo}
                onChange={(e) => datVongEo(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sk-vd">{F.mucVanDong}</label>
              <select
                id="sk-vd"
                value={vanDong}
                onChange={(e) => datVanDong(e.target.value as MucVanDong | "")}
              >
                <option value="">—</option>
                <option value="it">{F.vanDong.it}</option>
                <option value="vua">{F.vanDong.vua}</option>
                <option value="nhieu">{F.vanDong.nhieu}</option>
              </select>
            </div>
          </div>
          <label className="sk-dong-y">
            <input
              type="checkbox"
              checked={mangThai}
              onChange={(e) => datMangThai(e.target.checked)}
            />
            <span>{F.mangThai}</span>
          </label>
          <label className="sk-dong-y">
            <input
              type="checkbox"
              checked={benhNen}
              onChange={(e) => datBenhNen(e.target.checked)}
            />
            <span>{F.benhNen}</span>
          </label>
        </details>

        {(loiCucBo ?? loi) && (
          <p className="sk-loi-form" role="alert">
            {loiCucBo ?? loi}
          </p>
        )}
        <div className="sk-hang-luu">
          <button
            type="submit"
            className="sk-nut sk-nut-cam"
            disabled={dangLuu}
          >
            {F.luu}
          </button>
          <span className="sk-rieng">
            <span aria-hidden="true">🔒</span>
            {F.riengTu}
          </span>
        </div>
      </form>
    </section>
  );
}
