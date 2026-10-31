/**
 * `28.4` / `28.6` — khung nhắc test lại, bảng kiểm "bộ test đã đủ chưa", sổ bản trên thẻ.
 * Tên người bịa.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BangKiemDayDu } from "../app/components/bang-kiem-day-du";
import { KhungTestLai } from "../app/components/khung-test-lai";
import { SoBanDaLam } from "../app/components/so-ban-da-lam";
import { CHU_BANG_GIA_DINH, CHU_DAY_DU, CHU_TEST_LAI } from "../config/disc-tu-dien";
import { hanCaNha } from "../modules/report/han-test-lai";
import type { DayDuMotNguoi } from "../modules/report/do-day-du-bo-test";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const NGAY = (s: string) => new Date(`${s}T12:00:00+07:00`);
const DS = [
  { id: "a", ten: "Mai", ganNhat: "2026-03-15T09:00:00+07:00" },
  { id: "b", ten: "Bình", ganNhat: "2026-05-01T09:00:00+07:00" },
];

describe("KhungTestLai", () => {
  it("chưa có ai làm ⇒ không bịa ngày, không có nút lịch", () => {
    render(<KhungTestLai han={null} />);
    expect(screen.getByText(CHU_TEST_LAI.chuaCoHan)).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("còn hạn ⇒ ngày cụ thể dd/mm/yyyy, số ngày còn lại, KHÔNG báo đến hạn", () => {
    render(<KhungTestLai han={hanCaNha(DS, NGAY("2026-08-01"))} />);
    const khung = document.querySelector('[data-thu="khung-test-lai"]')!;
    expect(khung.getAttribute("data-den-han")).toBe("0");
    expect(document.querySelector('[data-thu="han-test-lai"]')?.textContent).toContain("15/09/2026");
    expect(document.querySelector('[data-thu="han-test-lai"]')?.textContent).toContain("còn 45 ngày");
    expect(khung.textContent).toContain(CHU_TEST_LAI.tieuDe);
  });

  it("🔴 đến hạn ⇒ đổi trạng thái, nêu TÊN người đến hạn", () => {
    render(<KhungTestLai han={hanCaNha(DS, NGAY("2026-09-20"))} />);
    const khung = document.querySelector('[data-thu="khung-test-lai"]')!;
    expect(khung.getAttribute("data-den-han")).toBe("1");
    expect(khung.textContent).toContain(CHU_TEST_LAI.denHan);
    expect(khung.textContent).toContain("đã quá 5 ngày");
    expect(khung.textContent).toContain("Mai");
    expect(khung.textContent).not.toContain("Bình");
  });

  it("giọng chăm sóc nhau, KHÔNG nói tiến bộ / cải thiện / điểm", () => {
    render(<KhungTestLai han={hanCaNha(DS, NGAY("2026-08-01"))} />);
    expect(document.body.textContent).toMatch(/hiểu, thương và chăm sóc/u);
    expect(document.body.textContent).not.toMatch(/tiến bộ|cải thiện|điểm số/iu);
  });

  it("không in được (data-khong-in) — đây là lời nhắc cho người cầm máy, không phải báo cáo", () => {
    render(<KhungTestLai han={hanCaNha(DS, NGAY("2026-08-01"))} />);
    expect(document.querySelector('[data-thu="khung-test-lai"]')?.hasAttribute("data-khong-in")).toBe(true);
  });

  it("bấm 'Thêm vào lịch' ⇒ tạo tệp .ics và báo đã tải", () => {
    const tao = vi.fn(() => "blob:x");
    Object.defineProperty(URL, "createObjectURL", { value: tao, configurable: true });
    Object.defineProperty(URL, "revokeObjectURL", { value: vi.fn(), configurable: true });
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(<KhungTestLai han={hanCaNha(DS, NGAY("2026-08-01"))} />);
    fireEvent.click(screen.getByRole("button", { name: CHU_TEST_LAI.nutLich }));

    expect(tao).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalled();
    expect(screen.getByRole("status").textContent).toBe(CHU_TEST_LAI.daTaiLich);
  });
});

const dd = (ghiDe: Partial<DayDuMotNguoi>): DayDuMotNguoi => ({
  id: "x",
  ten: "Mai",
  kieu: "nguoi-lon",
  soTuLam: 1,
  soQuanSat: 0,
  coBanHong: false,
  chiCoMaMoi: false,
  daDu: true,
  viec: null,
  ...ghiDe,
});

describe("BangKiemDayDu (chặn MỀM)", () => {
  it("còn thiếu ⇒ tóm tắt NÊU TÊN người thiếu ngay khi gập; bấm mới xổ chi tiết; KHÔNG có nút khoá", () => {
    render(
      <BangKiemDayDu
        ds={[
          dd({ id: "a", ten: "Mai" }),
          dd({ id: "b", ten: "Be", kieu: "tre-lon", daDu: false, viec: { ma: "THIEU_BAN_BO_ME" } }),
        ]}
      />,
    );
    const khung = document.querySelector('[data-thu="bang-kiem-day-du"]')!;
    expect(khung.getAttribute("data-day-du")).toBe("0");
    expect(khung.textContent).toContain("1/2 người đủ bản");
    expect(khung.textContent).toContain("Còn thiếu: Be");
    const nut = screen.getByRole("button", { name: new RegExp(CHU_DAY_DU.tieuDeKiem, "u") });
    // 🔴 Gập sẵn dù còn thiếu — chủ dự án: dashboard gọn, chi tiết bấm mới xổ.
    expect(nut.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(nut);
    expect(nut.getAttribute("aria-expanded")).toBe("true");
    expect(khung.textContent).toContain(CHU_DAY_DU.viec.THIEU_BAN_BO_ME);
    expect(khung.textContent).toContain(CHU_DAY_DU.kiemGoiY);
  });

  it("đã đủ ⇒ gập lại cho gọn, vẫn thấy dòng 'đủ bản'", () => {
    render(<BangKiemDayDu ds={[dd({ id: "a" }), dd({ id: "b", ten: "Bình" })]} />);
    expect(screen.getByRole("button", { name: new RegExp(CHU_DAY_DU.tieuDeKiem, "u") }).getAttribute("aria-expanded")).toBe("false");
    expect(document.body.textContent).toContain("2/2 người đủ bản");
  });

  it("không ai trong sổ ⇒ không vẽ gì", () => {
    const { container } = render(<BangKiemDayDu ds={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("mỗi người một dòng ✓/✗", () => {
    render(<BangKiemDayDu ds={[dd({ id: "a" }), dd({ id: "b", ten: "Be", daDu: false, viec: { ma: "CHUA_LAM" } })]} />);
    const dong = [...document.querySelectorAll('[data-thu="dong-kiem"]')];
    expect(dong.map((d) => d.getAttribute("data-day-du"))).toEqual(["1", "0"]);
  });
});

describe("SoBanDaLam trên thẻ", () => {
  it("chưa làm ⇒ 'Chưa làm bài' (giữ nguyên chữ cũ cho các test hiện có)", () => {
    render(<SoBanDaLam day={dd({ soTuLam: 0, daDu: false, viec: { ma: "CHUA_LAM" } })} />);
    expect(document.body.textContent).toContain(CHU_BANG_GIA_DINH.chuaLamBai);
  });

  it("🔴 bé từ lớp 3 có hai DÒNG: con tự làm và bố mẹ làm cho con, kèm ngày", () => {
    render(
      <SoBanDaLam
        day={dd({
          kieu: "tre-lon",
          soTuLam: 2,
          soQuanSat: 0,
          ganNhatTuLam: "2026-10-12T09:00:00+07:00",
          daDu: false,
          viec: { ma: "THIEU_BAN_BO_ME" },
        })}
      />,
    );
    const dong = [...document.querySelectorAll('[data-thu="dong-loai-ban"]')].map((d) => d.textContent);
    expect(dong).toHaveLength(2);
    expect(dong[0]).toContain(CHU_DAY_DU.nhanTuLam);
    expect(dong[0]).toContain("2 bản");
    expect(dong[0]).toContain("12/10/2026");
    expect(dong[1]).toContain(CHU_DAY_DU.nhanQuanSat);
    expect(dong[1]).toContain(CHU_DAY_DU.chuaLam);
    expect(document.querySelector('[data-thu="trang-thai-day-du"]')?.textContent).toBe(CHU_DAY_DU.viec.THIEU_BAN_BO_ME);
  });

  it("quá hạn 60 ngày ⇒ thẻ nói số ngày, KHÔNG hiện 'Đủ bản'", () => {
    render(
      <SoBanDaLam
        day={dd({ kieu: "tre-lon", soTuLam: 1, soQuanSat: 1, daDu: false, viec: { ma: "QUA_HAN", soNgay: 92 } })}
      />,
    );
    const t = document.querySelector('[data-thu="trang-thai-day-du"]')!.textContent!;
    expect(t).toContain("92 ngày");
    expect(t).toContain("tối đa 60");
    expect(t).not.toContain(CHU_DAY_DU.daDu);
  });

  it("đủ bản ⇒ dấu ✓ và chữ 'Đủ bản'", () => {
    render(<SoBanDaLam day={dd({ ganNhatTuLam: "2026-03-01T00:00:00Z" })} />);
    expect(document.querySelector('[data-thu="trang-thai-day-du"]')?.textContent).toBe(`✓ ${CHU_DAY_DU.daDu}`);
    expect(document.body.textContent).toContain("Đã làm 1 bản");
  });

  it("có bản hỏng ⇒ nói thẳng, để người dùng không tưởng đã đủ", () => {
    render(<SoBanDaLam day={dd({ coBanHong: true, daDu: false, viec: { ma: "CHUA_LAM" } })} />);
    expect(document.body.textContent).toContain(CHU_DAY_DU.banHong);
  });
});

describe("hạn test lại RIÊNG trên thẻ (28.6)", () => {
  it("hiện ngày test lại của riêng người này, tính từ bản hợp lệ gần nhất (bất kể loại)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NGAY("2026-08-01"));
    try {
      render(
        <SoBanDaLam
          day={dd({
            kieu: "tre-lon",
            soTuLam: 1,
            soQuanSat: 1,
            ganNhatTuLam: "2026-03-15T09:00:00+07:00",
            ganNhatQuanSat: "2026-05-01T09:00:00+07:00",
          })}
        />,
      );
      const h = document.querySelector('[data-thu="han-rieng"]')!;
      // Lấy bản gần nhất là 01/05 ⇒ 01/11/2026, còn 92 ngày tính từ 01/08.
      expect(h.textContent).toContain("01/11/2026");
      expect(h.textContent).toContain("còn 92 ngày");
      expect(h.getAttribute("data-den-han")).toBe("0");
    } finally {
      vi.useRealTimers();
    }
  });

  it("quá hạn ⇒ đánh dấu đến hạn, nói đã quá bao nhiêu ngày", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NGAY("2026-12-01"));
    try {
      render(<SoBanDaLam day={dd({ ganNhatTuLam: "2026-03-15T09:00:00+07:00" })} />);
      const h = document.querySelector('[data-thu="han-rieng"]')!;
      expect(h.getAttribute("data-den-han")).toBe("1");
      expect(h.textContent).toContain("đã quá 77 ngày");
    } finally {
      vi.useRealTimers();
    }
  });

  it("chưa có bản hợp lệ nào ⇒ KHÔNG bịa ngày", () => {
    render(<SoBanDaLam day={dd({ soTuLam: 0, daDu: false, viec: { ma: "CHUA_LAM" } })} />);
    expect(document.querySelector('[data-thu="han-rieng"]')).toBeNull();
  });
});
