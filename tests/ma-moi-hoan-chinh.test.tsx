import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KhoiMaMoi } from "../app/components/khoi-ma-moi";
import { KhoangNhaMinh } from "../app/khoang/nha-minh";
import { HAN_MA_MOI_NGAY } from "../config/disc-gia-dinh";
import { CHU_MA_HONG, CHU_MA_MOI } from "../config/disc-tu-dien";
import { chuanHoaMa, goiHoSo, moHoSo } from "../modules/core/gia-dinh/ma-moi";
import { docThanhVien, xoaSach, xoaSachThanhVien } from "../modules/core/luu-tru/kho-bai";
import { giaiMaQr } from "./giai-ma-qr";

/**
 * 🔴 13.1 — MÃ MỜI HOÀN CHỈNH, hai đầu: PHÁT và NHẬN.
 *
 * Đây là hạng mục gỡ trần "cả nhà một máy" — cái trần quyết định GĐ14 có bao giờ được
 * kích hoạt hay không. Cửa kiểm nặng nhất không phải "mã có hiện ra không" mà là:
 *  · quét lại chính nét vẽ trên màn có ra ĐÚNG chuỗi bên dưới không (vẽ lộn chiều thì
 *    mã trông y hệt mã thật và điện thoại thì chịu);
 *  · mã có RỖNG dữ liệu của trẻ không;
 *  · nhận hai lần có đẻ ra hai hồ sơ không.
 *
 * 🔴 Mọi tên là BỊA.
 */

const DIEM = { D: 72.4, I: 55.1, S: 38.9, C: 61.7 };
const HOM_NAY = "2026-08-27";

function luiNgay(soNgay: number): string {
  const d = new Date(Date.UTC(2026, 7, 27) - soNgay * 86_400_000);
  const hai = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${hai(d.getUTCMonth() + 1)}-${hai(d.getUTCDate())}`;
}

let net: { x: number; y: number; w: number; h: number; mau: string }[] = [];

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
  window.localStorage.clear();
  net = [];
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(function () {
    const but = {
      fillStyle: "#000000",
      fillRect(x: number, y: number, w: number, h: number) {
        net.push({ x, y, w, h, mau: but.fillStyle });
      },
    };
    return but as unknown as CanvasRenderingContext2D;
  } as unknown as typeof HTMLCanvasElement.prototype.getContext);
});
afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  await xoaSach();
  await xoaSachThanhVien();
});

/** Dựng lại lưới từ chính các lệnh fillRect mà trang đã gọi. */
function luoiTuNetVe(): boolean[][] {
  const nen = net[0];
  const canhO = net[1]?.w ?? 8;
  const canhLuoi = nen.w / canhO - 8;
  const luoi: boolean[][] = Array.from({ length: canhLuoi }, () =>
    new Array<boolean>(canhLuoi).fill(false),
  );
  for (const o of net.slice(1)) luoi[o.y / canhO - 4][o.x / canhO - 4] = true;
  return luoi;
}

const chuoiTrenMan = () =>
  (document.querySelector('[data-thu="chuoi-ma"]')?.textContent ?? "").trim();

describe("🔴 đầu PHÁT — khối mã mời ở màn kết quả", () => {
  const phat = () => render(<KhoiMaMoi boDe="TH" diem={DIEM} homNay={HOM_NAY} />);

  it("hiện cả mã QR lẫn chuỗi gõ tay được", () => {
    phat();
    expect(document.querySelector('[data-thu="ma-qr"]')).toBeTruthy();
    expect(chuoiTrenMan()).toMatch(/^[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{4}$/u);
  });

  it("🔴 quét lại chính nét vẽ trên màn ⇒ ra ĐÚNG chuỗi hiện bên dưới", () => {
    phat();
    expect(giaiMaQr(luoiTuNetVe())).toBe(chuoiTrenMan());
  });

  it("mã mở ra đúng bốn con số ban đầu", () => {
    phat();
    const ket = moHoSo(chuoiTrenMan(), HOM_NAY);
    expect(ket.ok).toBe(true);
    if (ket.ok) expect(ket.hoSo.diem).toEqual(DIEM);
  });

  it("đổi vai thì mã đổi theo", () => {
    phat();
    const truoc = chuoiTrenMan();
    fireEvent.change(screen.getByLabelText("Vai trong nhà"), { target: { value: "me" } });
    expect(chuoiTrenMan()).not.toBe(truoc);
    const ket = moHoSo(chuoiTrenMan(), HOM_NAY);
    expect(ket.ok && ket.hoSo.vai).toBe("me");
  });

  it("🔴 NÓI THẲNG cái gì đang đi ra khỏi máy", () => {
    phat();
    const chu = document.body.textContent ?? "";
    expect(chu).toContain(CHU_MA_MOI.nhacRiengTu);
    expect(chu).toMatch(new RegExp(`${HAN_MA_MOI_NGAY} ngày`, "u"));
  });

  it("🔴 KHÔNG in ra giấy — mã trên giấy là một hồ sơ quét được, không hạn", () => {
    const { container } = phat();
    expect(
      container.querySelector('[data-thu="khoi-ma-moi"]')?.hasAttribute("data-khong-in"),
    ).toBe(true);
  });
});

describe("🔴 đầu NHẬN — máy kia gõ mã vào sổ", () => {
  async function moNhaMinh() {
    render(<KhoangNhaMinh />);
    await waitFor(() => expect(screen.getByLabelText(CHU_MA_MOI.oNhap)).toBeTruthy());
  }

  const goMa = (ma: string) => {
    fireEvent.change(screen.getByLabelText(CHU_MA_MOI.oNhap), { target: { value: ma } });
    fireEvent.click(screen.getByRole("button", { name: CHU_MA_MOI.nutMo }));
  };

  async function nhanVao(ma: string, ten: string) {
    goMa(ma);
    await waitFor(() => expect(document.querySelector('[data-thu="ho-so-nhan"]')).toBeTruthy());
    fireEvent.change(screen.getByLabelText(CHU_MA_MOI.hoiTen), { target: { value: ten } });
    fireEvent.click(screen.getByRole("button", { name: CHU_MA_MOI.nutLuu }));
  }

  it("🔴 mã hợp lệ ⇒ thêm ĐÚNG một thành viên với đúng bốn con số", async () => {
    const ma = goiHoSo({ boDe: "TH", vai: "con", diem: DIEM, ngayPhat: new Date().toISOString().slice(0, 10) });
    await moNhaMinh();
    await nhanVao(ma, "Zozo");

    await waitFor(async () => {
      const tv = await docThanhVien();
      expect(tv).toHaveLength(1);
      expect(tv[0].ten).toBe("Zozo");
      expect(tv[0].nhanQuaMa?.diem).toEqual(DIEM);
      expect(tv[0].vaiTro).toBe("con");
    });
  });

  it("🔴 hồ sơ nhận qua mã KHÔNG dựng ra bài làm giả", async () => {
    // Bịa một bảng câu trả lời khớp với bốn con số là tạo dữ liệu chưa ai từng nhập.
    const ma = goiHoSo({ boDe: "TH", vai: "con", diem: DIEM, ngayPhat: new Date().toISOString().slice(0, 10) });
    await moNhaMinh();
    await nhanVao(ma, "Zozo");

    await waitFor(async () => expect(await docThanhVien()).toHaveLength(1));
    const { docTatCa } = await import("../modules/core/luu-tru/kho-bai");
    expect(await docTatCa(), "mã mời không được đẻ ra bài làm").toHaveLength(0);
  });

  it("🔴 nhận CÙNG một mã hai lần ⇒ vẫn chỉ MỘT hồ sơ", async () => {
    const ma = goiHoSo({ boDe: "TH", vai: "con", diem: DIEM, ngayPhat: new Date().toISOString().slice(0, 10) });
    await moNhaMinh();
    await nhanVao(ma, "Zozo");
    await waitFor(async () => expect(await docThanhVien()).toHaveLength(1));

    await nhanVao(ma, "Zozo lần hai");

    await waitFor(() =>
      expect(document.querySelector('[data-thu="xong-ma"]')).toHaveTextContent(CHU_MA_MOI.daCo),
    );
    expect(await docThanhVien()).toHaveLength(1);
  });

  it("🔴 gõ SAI một ký tự ⇒ báo lỗi, KHÔNG dựng hồ sơ rác", async () => {
    const ma = chuanHoaMa(
      goiHoSo({ boDe: "TH", vai: "con", diem: DIEM, ngayPhat: new Date().toISOString().slice(0, 10) }),
    );
    const hong = `${ma.slice(0, 3)}${ma[3] === "7" ? "8" : "7"}${ma.slice(4)}`;
    await moNhaMinh();

    goMa(hong);

    expect(document.querySelector('[data-thu="loi-ma"]')).toHaveTextContent(
      CHU_MA_HONG.SAI_KIEM_TONG,
    );
    expect(document.querySelector('[data-thu="ho-so-nhan"]')).toBeNull();
    expect(await docThanhVien()).toHaveLength(0);
  });

  it("🔴 mã QUÁ HẠN bị từ chối, và nói đúng là quá hạn", async () => {
    const cu = goiHoSo({
      boDe: "TH",
      vai: "con",
      diem: DIEM,
      ngayPhat: luiNgay(HAN_MA_MOI_NGAY + 30),
    });
    await moNhaMinh();

    goMa(cu);

    // Ngày hôm nay thật của máy chạy test luôn muộn hơn mốc 2026-08-27 rất nhiều.
    expect(document.querySelector('[data-thu="loi-ma"]')).toHaveTextContent(
      CHU_MA_HONG.QUA_HAN,
    );
    expect(await docThanhVien()).toHaveLength(0);
  });

  it("máy nhận TỰ HỎI TÊN — mã cố ý không mang tên đi", async () => {
    const ma = goiHoSo({ boDe: "TH", vai: "con", diem: DIEM, ngayPhat: new Date().toISOString().slice(0, 10) });
    await moNhaMinh();
    goMa(ma);

    await waitFor(() => expect(screen.getByLabelText(CHU_MA_MOI.hoiTen)).toBeTruthy());
    expect(document.body.textContent).toContain(CHU_MA_MOI.nhacHoiTen);
  });
});
