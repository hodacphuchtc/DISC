"use client";

/**
 * THẺ "SỨC KHOẺ GIA ĐÌNH" (ADR-010) — nằm dưới khoang DISC. NẠP LƯỜI (chunk riêng) để gói
 * chính không phình: gói chính đang sát trần 300 KB.
 *
 * Luồng: form (trên cùng) → bảng cả nhà → chi tiết người đang mở → khung lưu ý (dưới cùng).
 * Hạn mức: 6 người × 3 bản. Bản thứ 4 thay bản cũ nhất (có báo); người thứ 7 buộc chọn
 * một người để xoá. Logic hạn mức nằm ở `modules/core/suc-khoe/so-suc-khoe.ts` (hàm thuần).
 *
 * Thuộc TẦNG GIAO DIỆN THAM CHIẾU (ADR-004).
 */

import { useCallback, useEffect, useRef, useState } from "react";

import {
  TOI_DA_BAN_MOI_NGUOI,
  TOI_DA_NGUOI_SUC_KHOE,
} from "@config/suc-khoe-nguong";
import { CHU_SK } from "@config/suc-khoe-tu-dien";
import { dangKyDoiKho } from "@modules/core/luu-tru/kho-bai";
import "@modules/core/luu-tru/kho-suc-khoe-idb";
import { khoSucKhoeDangDung } from "@modules/core/suc-khoe/kho-suc-khoe";
import type { MocDo, NguoiSucKhoe } from "@modules/core/suc-khoe/kieu";
import { phanTichSucKhoe } from "@modules/core/suc-khoe/phan-tich";
import {
  themMocDo,
  timNguoiTheoTen,
  xoaMocDo,
  xoaNguoi,
} from "@modules/core/suc-khoe/so-suc-khoe";
import { hienNgay } from "@modules/core/tien-ich/ngay";

import "./suc-khoe.css";
import { BangNguoi } from "./bang-nguoi";
import { ChiTietNguoi } from "./chi-tiet-nguoi";
import { FormSoDo, type DuLieuForm } from "./form-so-do";
import { HopXoa, type YeuCauHop } from "./hop-xoa";
import { DUONG_LOGO, LinhVatToanThan } from "./linh-vat";
import { MienTru } from "./mien-tru";
import { dien, taoId, tuoiChu } from "./tien-ich";

function phaoGiay(x: number, y: number): void {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mau = ["#ff8f2d", "#610b8a", "#3dbf9a", "#ffb066", "#a855d6"];
    for (let i = 0; i < 24; i++) {
      const manh = document.createElement("i");
      manh.className = "sk-manh";
      manh.style.left = `${x}px`;
      manh.style.top = `${y}px`;
      manh.style.background = mau[i % mau.length]!;
      manh.style.setProperty(
        "--sk-x",
        `${Math.round(Math.random() * 360 - 180)}px`,
      );
      manh.style.setProperty(
        "--sk-y",
        `${Math.round(Math.random() * -260 - 30)}px`,
      );
      document.body.appendChild(manh);
      window.setTimeout(() => manh.remove(), 1400);
    }
  } catch {
    // Chỉ là trang trí — hỏng thì bỏ qua.
  }
}

export default function KhoangSucKhoe() {
  const [ds, datDs] = useState<readonly NguoiSucKhoe[]>([]);
  const dsRef = useRef<readonly NguoiSucKhoe[]>([]);
  const [dangMo, datDangMo] = useState<string | null>(null);
  const [moiNhatId, datMoiNhatId] = useState<string | null>(null);
  const [loi, datLoi] = useState<string | null>(null);
  const [dangLuu, datDangLuu] = useState(false);
  const [hop, datHop] = useState<YeuCauHop | null>(null);
  const [thongBao, datThongBao] = useState<string | null>(null);
  const daMoMacDinh = useRef(false);
  const hanThongBao = useRef<number | undefined>(undefined);
  const gocBang = useRef<HTMLDivElement>(null);

  const apDung = useCallback((moi: readonly NguoiSucKhoe[]) => {
    dsRef.current = moi;
    datDs(moi);
  }, []);

  // Nạp sổ từ kho, và nạp lại mỗi khi kho đổi (kể cả từ tab khác).
  useEffect(() => {
    let huy = false;
    const nap = () =>
      khoSucKhoeDangDung()
        .docSo()
        .then((d) => {
          if (huy) return;
          apDung(d);
          // Lần đầu có dữ liệu: mở sẵn người VỪA CẬP NHẬT (đứng đầu) — bản mới nhất hiện trước.
          if (!daMoMacDinh.current && d.length > 0) {
            daMoMacDinh.current = true;
            datDangMo(d[0]!.id);
          }
        });
    void nap();
    const boDangKy = dangKyDoiKho(() => void nap());
    return () => {
      huy = true;
      boDangKy();
    };
  }, [apDung]);

  const baoTin = useCallback((chu: string) => {
    datThongBao(chu);
    window.clearTimeout(hanThongBao.current);
    hanThongBao.current = window.setTimeout(() => datThongBao(null), 6000);
  }, []);
  useEffect(() => () => window.clearTimeout(hanThongBao.current), []);

  /** Ghi một lần rồi mới đổi giao diện: ghi hỏng thì giao diện KHÔNG nói dối là đã lưu. */
  const ghi = useCallback(
    async (
      luu: readonly NguoiSucKhoe[],
      xoaId: readonly string[],
      moi: readonly NguoiSucKhoe[],
    ): Promise<boolean> => {
      const ok = await khoSucKhoeDangDung().ghiSo(luu, xoaId);
      if (!ok) {
        datLoi(CHU_SK.loiForm.luuKhongDuoc);
        return false;
      }
      apDung(moi);
      return true;
    },
    [apDung],
  );

  // Hàm thường, KHÔNG bọc useCallback: nó tự gọi lại chính nó (sau khi người dùng chọn xoá ai).
  async function luuMoc(
    d: DuLieuForm,
    nguonDs: readonly NguoiSucKhoe[],
    idXoa?: string,
  ): Promise<boolean> {
    const moc: Omit<MocDo, "id" | "taoLuc"> = {
      ngayDo: d.ngayDo,
      canNangKg: d.canNangKg,
      chieuCaoCm: d.chieuCaoCm,
      ...(d.vongEoCm !== undefined ? { vongEoCm: d.vongEoCm } : {}),
      ...(d.mucVanDong ? { mucVanDong: d.mucVanDong } : {}),
      ...(d.mangThaiHoacChoBu ? { mangThaiHoacChoBu: true } : {}),
      ...(d.coBenhNen ? { coBenhNen: true } : {}),
    };
    const bayGio = new Date().toISOString();
    const kq = themMocDo(
      nguonDs,
      { ten: d.ten, ngaySinh: d.ngaySinh, gioiTinh: d.gioiTinh, moc },
      bayGio,
      taoId,
    );
    if (kq.kq === "ten-rong") {
      datLoi(CHU_SK.loiForm.tenRong);
      return false;
    }
    if (kq.kq === "can-xoa-nguoi") {
      // Đủ 6 người: KHÔNG tự xoá ai — hỏi người dùng chọn.
      datHop({
        tieuDe: dien(CHU_SK.hop.nguoiTieuDe, { toiDa: TOI_DA_NGUOI_SUC_KHOE }),
        moTa: dien(CHU_SK.hop.nguoiMoTa, {
          toiDa: TOI_DA_NGUOI_SUC_KHOE,
          ten: d.ten.trim(),
        }),
        muaChon: [...nguonDs].reverse().map((n) => ({
          id: n.id,
          chu: dien(CHU_SK.hop.nguoiDong, {
            ten: n.ten,
            tuoi: tuoiChu(n.ngaySinh, n.moc[0]!.ngayDo),
            so: n.moc.length,
          }),
        })),
        nutXoa: CHU_SK.hop.xoaVaLuu,
        khiXoa: (id) => {
          if (id) void luuMoc(d, xoaNguoi(nguonDs, id), id);
        },
      });
      return false;
    }
    const ok = await ghi([kq.nguoi], idXoa ? [idXoa] : [], kq.ds);
    if (!ok) return false;
    datLoi(null);
    datDangMo(kq.nguoi.id);
    datMoiNhatId(kq.nguoi.id);
    let tin = dien(CHU_SK.thongBao.daLuu, { ten: kq.nguoi.ten });
    if (kq.mocBiThay) {
      tin += dien(CHU_SK.thongBao.banCuThay, {
        ngay: hienNgay(kq.mocBiThay.ngayDo),
        toiDa: TOI_DA_BAN_MOI_NGUOI,
      });
    }
    baoTin(tin);
    window.setTimeout(
      () => gocBang.current?.scrollIntoView?.({ block: "start" }),
      50,
    );
    return true;
  }

  async function khiLuu(d: DuLieuForm): Promise<boolean> {
    datDangLuu(true);
    try {
      // Kiểm số đo bằng ĐÚNG hàm phân tích — một nơi duy nhất quyết định "vô lý".
      const thu = phanTichSucKhoe({
        ngaySinh: d.ngaySinh,
        gioiTinh: d.gioiTinh,
        ngayDo: d.ngayDo,
        canNangKg: d.canNangKg,
        chieuCaoCm: d.chieuCaoCm,
        vongEoCm: d.vongEoCm,
      });
      if (!thu.hopLe) {
        datLoi(CHU_SK.lyDoTuChoi[thu.lyDo]);
        return false;
      }
      const xong = await luuMoc(d, dsRef.current);
      if (xong) {
        const r = document
          .querySelector("#sk-form button[type=submit]")
          ?.getBoundingClientRect();
        if (r) phaoGiay(r.left + r.width / 2, r.top);
      }
      return xong;
    } finally {
      datDangLuu(false);
    }
  }

  function hoiXoaNguoi(n: NguoiSucKhoe) {
    datHop({
      tieuDe: dien(CHU_SK.hop.xoaNguoiTieuDe, { ten: n.ten }),
      moTa: CHU_SK.hop.xoaNguoiMoTa,
      muaChon: [],
      nutXoa: CHU_SK.hop.xoa,
      khiXoa: () => {
        const moi = xoaNguoi(dsRef.current, n.id);
        void ghi([], [n.id], moi).then((ok) => {
          if (!ok) return;
          datDangMo(null);
          baoTin(dien(CHU_SK.thongBao.daXoaNguoi, { ten: n.ten }));
        });
      },
    });
  }

  function hoiXoaBan(n: NguoiSucKhoe, m: MocDo) {
    datHop({
      tieuDe: dien(CHU_SK.hop.xoaBanTieuDe, { ngay: hienNgay(m.ngayDo) }),
      moTa: CHU_SK.hop.xoaBanMoTa,
      muaChon: [],
      nutXoa: CHU_SK.hop.xoa,
      khiXoa: () => {
        const moi = xoaMocDo(dsRef.current, n.id, m.id);
        const sau = timNguoiTheoTen(moi, n.ten);
        void ghi(sau ? [sau] : [], sau ? [] : [n.id], moi).then((ok) => {
          if (ok)
            baoTin(
              dien(CHU_SK.thongBao.daXoaBan, { ngay: hienNgay(m.ngayDo) }),
            );
        });
      },
    });
  }

  function chuyenToiForm() {
    const o = document.getElementById("sk-ten");
    o?.scrollIntoView?.({ block: "center" });
    (o as HTMLInputElement | null)?.focus();
  }

  const nguoiDangMo = ds.find((n) => n.id === dangMo) ?? null;

  return (
    <section className="sk" aria-label={CHU_SK.tieuDeThe} data-thu="sk-khoang">
      <div className="sk-tronggioi">
        <div className="sk-thanh-dau">
          {/* eslint-disable-next-line @next/next/no-img-element -- xuất tĩnh, ảnh đã nén sẵn */}
          <img
            src={DUONG_LOGO}
            alt={CHU_SK.hero.altLogo}
            width={260}
            height={153}
            decoding="async"
          />
          <span className="sk-chip">
            <i />
            {CHU_SK.tieuDeThe}
          </span>
        </div>

        <div className="sk-hero sk-hien">
          <div>
            <span className="sk-hot">{CHU_SK.huyHieu}</span>
            <h1>
              {CHU_SK.hero.phan1}
              <em>{CHU_SK.hero.nhan}</em>
              {CHU_SK.hero.phan2}
            </h1>
            <p className="sk-mota">{CHU_SK.hero.moTa}</p>
            <button
              type="button"
              className="sk-nut sk-nut-cam"
              onClick={chuyenToiForm}
            >
              {CHU_SK.hero.nut}
            </button>
          </div>
          <div className="sk-san">
            <LinhVatToanThan />
            <span className="sk-bay sk-b1">{CHU_SK.hero.thoiLinhVat[0]}</span>
            <span className="sk-bay sk-b2">{CHU_SK.hero.thoiLinhVat[1]}</span>
            <span className="sk-bay sk-b3">{CHU_SK.hero.thoiLinhVat[2]}</span>
            <span className="sk-tinh sk-t1" aria-hidden="true">
              ✨
            </span>
            <span className="sk-tinh sk-t2" aria-hidden="true">
              ⭐
            </span>
          </div>
        </div>

        <FormSoDo onLuu={khiLuu} loi={loi} dangLuu={dangLuu} />

        <div ref={gocBang}>
          <BangNguoi
            ds={ds}
            dangMo={dangMo}
            moiNhatId={moiNhatId}
            onChon={(id) => datDangMo((truoc) => (truoc === id ? null : id))}
            onThem={chuyenToiForm}
          />
        </div>

        {nguoiDangMo && (
          <ChiTietNguoi
            key={`${nguoiDangMo.id}:${nguoiDangMo.suaLuc}`}
            nguoi={nguoiDangMo}
            onXoaNguoi={() => hoiXoaNguoi(nguoiDangMo)}
            onXoaBan={(m) => hoiXoaBan(nguoiDangMo, m)}
          />
        )}

        <MienTru />
        <div className="sk-chan">
          {/* eslint-disable-next-line @next/next/no-img-element -- xem trên */}
          <img
            src={DUONG_LOGO}
            alt={CHU_SK.hero.altLogo}
            width={260}
            height={153}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      {thongBao && (
        <p className="sk-toast" role="status">
          {thongBao}
        </p>
      )}
      {hop && <HopXoa yc={hop} onDong={() => datHop(null)} />}
    </section>
  );
}
