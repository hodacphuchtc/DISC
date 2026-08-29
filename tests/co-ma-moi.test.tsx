/**
 * CỜ TẮT TÍNH NĂNG MÃ MỜI (`23.1`, `23.2`).
 *
 * 🔴 CỬA KIỂM PHẢI CHẠY ĐƯỢC Ở CẢ HAI TRẠNG THÁI. Một cờ chỉ được thử ở trạng thái đang
 * bật thì đúng bằng không có cờ: ngày cần bật lại là ngày đầu tiên nó chạy thật, và đó là
 * ngày tệ nhất để phát hiện nó hỏng (bài học `V4.1`). Nên file này giả lập
 * `config/disc-nguong` để bật/tắt.
 *
 * 🔴 CỬA QUAN TRỌNG NHẤT KHÔNG PHẢI "Ô NHẬP CÓ BIẾN MẤT KHÔNG". Nó là khối *"dữ liệu cũ
 * còn nguyên"* ở dưới: máy nào đã từng nhận một hồ sơ qua mã thì hồ sơ đó VẪN nằm trong
 * kho, và tắt tính năng KHÔNG được đụng tới sáu đường đọc `nhanQuaMa`. Cắt nhầm một đường
 * là làm một thành viên biến mất khỏi bản phân tích của chính gia đình họ — không lỗi,
 * không test đỏ, không ai biết. Cùng họ với `16.5` (nút sao lưu đọc thiếu một bảng).
 *
 * 🔴 Mọi tên là BỊA.
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CHU_MA_MOI } from "../config/disc-tu-dien";
import { goiHoSo } from "../modules/core/gia-dinh/ma-moi";
import {
  docThanhVien,
  luuBai,
  luuThanhVien,
  xoaSachTatCa,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import type { ThanhVien } from "../modules/core/gia-dinh/kieu";
import { buocDangMo, tamBuoc } from "./duong-vao-bai";

const LUC = "2026-08-29T09:00:00+07:00";
const DIEM = { D: 82, I: 34, S: 41, C: 57 } as const;

const nguoi = (i: number, ten: string, vaiTro: ThanhVien["vaiTro"]): ThanhVien => ({
  id: `tv-${i}`,
  ten,
  vaiTro,
  thuTu: i,
  taoLuc: LUC,
  suaLuc: LUC,
});

/** Người CHỈ có hồ sơ nhận qua mã — không có bài nào trên máy này. */
const nguoiNhanQuaMa = (i: number, ten: string): ThanhVien => ({
  ...nguoi(i, ten, "bo"),
  nhanQuaMa: { boDe: "PH", diem: { ...DIEM }, ngayPhat: "2026-08-25" },
});

const bai = (id: string, tv: number): BaiLamLuu =>
  ({
    id,
    boDe: "PH",
    maTre: `nguoi-${tv}`,
    maThanhVien: `tv-${tv}`,
    nguoiTraLoi: "nguoi-lon",
    batDau: LUC,
    ketThuc: LUC,
    traLoi: { "PH-D1": 4 },
    ketQua: {
      hopLe: true,
      diem: { ...DIEM },
      xepHang: ["D", "C", "S", "I"],
      kieu: { loai: "don", truc: "D" },
      canhBao: [],
    },
    phienBanBoDe: "1.0",
  }) as unknown as BaiLamLuu;

/** Dựng bảng gia đình với cờ ở trạng thái cho trước. Import LƯỜI để `doMock` kịp ăn. */
async function dungBang(moMaMoi: boolean) {
  vi.resetModules();
  vi.doMock("@config/disc-nguong", async (goc) => ({
    ...(await goc<typeof import("../config/disc-nguong")>()),
    MO_MA_MOI: moMaMoi,
  }));
  const { KhoangBangGiaDinh } = await import("../app/khoang/bang-gia-dinh");
  render(<KhoangBangGiaDinh onLamBai={vi.fn()} onXemBai={vi.fn()} onNhanMa={vi.fn()} />);
  await waitFor(() => expect(document.querySelector('[data-thu="luoi-thanh-vien"]')).toBeTruthy());
}

/** Dựng khoang Nhà mình (chứa bảng gia đình + đường GHI `nhanMa`). */
async function dungNhaMinh(moMaMoi: boolean) {
  vi.resetModules();
  vi.doMock("@config/disc-nguong", async (goc) => ({
    ...(await goc<typeof import("../config/disc-nguong")>()),
    MO_MA_MOI: moMaMoi,
  }));
  const { KhoangNhaMinh } = await import("../app/khoang/nha-minh");
  render(<KhoangNhaMinh />);
  // 🔴 KHÔNG chờ gì ở đây. Sổ rỗng thì lưới thẻ không dựng ra, và một `waitFor` đặt sai chỗ
  // sẽ hết giờ ở một thứ chẳng liên quan tới cửa đang kiểm — rồi đọc lên như thể sản phẩm
  // hỏng. Mỗi cửa tự chờ đúng thứ nó cần.
}

const the = (ten: string) =>
  document.querySelector(`[data-thu="the-thanh-vien"][data-ten="${ten}"]`);

beforeEach(async () => {
  await xoaSachTatCa();
  window.localStorage.clear();
});
afterEach(async () => {
  cleanup();
  vi.doUnmock("@config/disc-nguong");
  vi.resetModules();
  window.localStorage.clear();
  await xoaSachTatCa();
});

describe("🔴 cờ TẮT — mã mời biến khỏi sản phẩm", () => {
  it("bảng gia đình KHÔNG còn ô nhận mã", async () => {
    await luuThanhVien(nguoi(0, "Zozo", "me"));
    await dungBang(false);

    expect(screen.queryByLabelText(CHU_MA_MOI.oNhap)).toBeNull();
    expect(screen.queryByText(CHU_MA_MOI.nhanNhap)).toBeNull();
    expect(
      screen.queryByRole("button", { name: CHU_MA_MOI.nutMo }),
      "nút Thêm vào sổ vẫn còn ⇒ nửa NHẬN chưa tắt hẳn",
    ).toBeNull();
  });

  it("🔴 đường GHI cũng bị chặn — kho KHÔNG mọc thêm hồ sơ nào", async () => {
    await luuThanhVien(nguoi(0, "Zozo", "me"));
    await dungNhaMinh(false);
    await waitFor(() =>
      expect(document.querySelector('[data-thu="luoi-thanh-vien"]')).toBeTruthy(),
    );

    // Không còn ô nào để gõ — đó chính là điều phải khẳng định — nên sổ không thể mọc thêm.
    // Lớp ③ (`if (!MO_MA_MOI) return false`) giữ điều đó ngay cả khi có ai gọi `nhanMa()`
    // bằng một đường khác.
    expect(screen.queryByLabelText(CHU_MA_MOI.oNhap)).toBeNull();
    expect(await docThanhVien()).toHaveLength(1);
  });

  it("khối GỬI ở màn kết quả cũng không còn — không để lại nút dẫn tới hư không", async () => {
    // Nửa GỬI nằm sau `MO_MA_MOI` ở `ket-qua.tsx`. Kiểm ở mức mã nguồn là đủ và đúng chỗ:
    // dựng cả màn kết quả ở đây đòi một bài hợp lệ đầy đủ, và cửa đó đã có ở file khác.
    const { readFileSync } = await import("node:fs");
    const nguon = readFileSync(`${process.cwd()}/app/khoang/ket-qua.tsx`, "utf8");
    expect(nguon).toMatch(/\{MO_MA_MOI && ketQua\.hopLe && \(/u);
  });
});

describe("🔴 cờ TẮT — DỮ LIỆU CŨ KHÔNG ĐƯỢC MẤT MỘT MẨU NÀO", () => {
  it("🔴 người nhận qua mã VẪN hiện trên thẻ, kèm điểm của họ", async () => {
    await luuThanhVien(nguoi(0, "Zozo", "me"));
    await luuThanhVien(nguoiNhanQuaMa(1, "Kiki"));
    await dungBang(false);

    expect(the("Kiki"), "thẻ của người nhận qua mã biến mất ⇒ mất dữ liệu im lặng").toBeTruthy();
    expect(the("Kiki")?.textContent ?? "").toContain(String(DIEM.D));
  });

  it("🔴 người nhận qua mã VẪN tính vào mở khoá bước 2", async () => {
    await luuThanhVien(nguoi(0, "Zozo", "me"));
    await luuBai(bai("b0", 0));
    await luuThanhVien(nguoiNhanQuaMa(1, "Kiki")); // người thứ hai, chỉ có mã

    vi.resetModules();
    vi.doMock("@config/disc-nguong", async (goc) => ({
      ...(await goc<typeof import("../config/disc-nguong")>()),
      MO_MA_MOI: false,
    }));
    const { KhoangCacBuoc } = await import("../app/khoang/cac-buoc");
    render(<KhoangCacBuoc />);

    await waitFor(() => expect(tamBuoc("phan-tich")).toBeTruthy());
    await waitFor(() =>
      expect(
        tamBuoc("phan-tich")?.getAttribute("data-khoa"),
        "bước 2 bị khoá ⇒ hồ sơ nhận qua mã đã thôi được tính là một người",
      ).toBeNull(),
    );
    await waitFor(() => expect(buocDangMo("phan-tich")).toBe(true));
  });

  it("🔴 tệp sao lưu VẪN dựng được tờ PDF cho hồ sơ chỉ có mã", async () => {
    await luuThanhVien(nguoiNhanQuaMa(0, "Zozo"));

    vi.resetModules();
    vi.doMock("@config/disc-nguong", async (goc) => ({
      ...(await goc<typeof import("../config/disc-nguong")>()),
      MO_MA_MOI: false,
    }));
    const { docThanhVien: doc } = await import("../modules/core/luu-tru/kho-bai");
    const tv = await doc();

    // Đường đọc ở `tai-sao-luu.ts:92` dựa vào đúng trường này. Còn trường thì còn tờ giấy.
    expect(tv[0].nhanQuaMa?.diem).toEqual(DIEM);
    expect(tv[0].nhanQuaMa?.boDe).toBe("PH");
  });
});

describe("cờ BẬT — rút lại được trong 30 giây", () => {
  it("ô nhận mã quay lại đầy đủ", async () => {
    await luuThanhVien(nguoi(0, "Zozo", "me"));
    await dungBang(true);

    expect(screen.getByLabelText(CHU_MA_MOI.oNhap)).toBeTruthy();
    expect(screen.getByRole("button", { name: CHU_MA_MOI.nutMo })).toBeTruthy();
  });

  it("🔴 và nhận một mã thật vào sổ vẫn chạy đúng", async () => {
    await dungNhaMinh(true);
    await screen.findByLabelText(CHU_MA_MOI.oNhap);
    const ma = goiHoSo({ boDe: "PH", vai: "bo", diem: { ...DIEM }, ngayPhat: "2026-08-29" });

    fireEvent.change(screen.getByLabelText(CHU_MA_MOI.oNhap), { target: { value: ma } });
    fireEvent.click(screen.getByRole("button", { name: CHU_MA_MOI.nutMo }));

    await waitFor(() => expect(document.querySelector('[data-thu="ho-so-nhan"]')).toBeTruthy());
    fireEvent.change(screen.getByLabelText(CHU_MA_MOI.hoiTen), { target: { value: "Kiki" } });
    fireEvent.click(screen.getByRole("button", { name: CHU_MA_MOI.nutLuu }));

    await waitFor(async () => {
      const tv = await docThanhVien();
      expect(tv).toHaveLength(1);
      expect(tv[0].nhanQuaMa?.diem).toEqual(DIEM);
    });
  });
});
