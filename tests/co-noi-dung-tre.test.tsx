import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CHU_BANG_GIA_DINH, CHU_TRE_TAM_DONG } from "../config/disc-tu-dien";
import {
  luuThanhVien,
  xoaSachTatCa,
} from "../modules/core/luu-tru/kho-bai";

/**
 * CỜ TẮT NỘI DUNG NÓI VỀ TRẺ (V4.1).
 *
 * 🔴 ĐÂY LÀ BẢO HIỂM CHO MỘT QUYẾT ĐỊNH ĐÃ GHI VÀO SỔ. Ngày 28/08/2026 chủ dự án chốt phát
 * đủ cả phần trẻ khi chưa có chữ ký chuyên môn, sau khi đã nghe rủi ro. Cờ này không lật
 * quyết định đó — nó chỉ làm cho quyết định đó **rút lại được trong 30 giây**.
 *
 * 🔴 CỬA KIỂM PHẢI CHẠY ĐƯỢC Ở CẢ HAI TRẠNG THÁI. Một cờ chỉ được thử ở trạng thái đang
 * bật thì đúng bằng không có cờ: ngày cần tắt là ngày đầu tiên nó được chạy thật, và đó là
 * ngày tệ nhất để phát hiện nó hỏng. Nên file này giả lập `config/disc-nguong` để bật/tắt.
 */

const TV = {
  me: {
    id: "tv-me",
    ten: "Zozo",
    vaiTro: "me" as const,
    thuTu: 0,
    taoLuc: "2026-08-01T00:00:00.000Z",
    suaLuc: "2026-08-01T00:00:00.000Z",
  },
  con: {
    id: "tv-con",
    ten: "Kiki",
    vaiTro: "con" as const,
    lop: "7",
    thuTu: 1,
    taoLuc: "2026-08-01T00:00:00.000Z",
    suaLuc: "2026-08-01T00:00:00.000Z",
  },
};

/** Dựng bảng gia đình với cờ ở trạng thái cho trước. Import LƯỜI để mock kịp ăn. */
async function dungBang(moNoiDungTre: boolean) {
  vi.resetModules();
  vi.doMock("@config/disc-nguong", async (goc) => ({
    ...(await goc<typeof import("../config/disc-nguong")>()),
    MO_NOI_DUNG_TRE: moNoiDungTre,
  }));
  const { KhoangBangGiaDinh } = await import("../app/khoang/bang-gia-dinh");
  render(<KhoangBangGiaDinh onLamBai={vi.fn()} onLamBaiQuanSat={vi.fn()} />);
  await waitFor(() => expect(screen.getByText(TV.me.ten)).toBeTruthy());
}

const the = (ten: string) =>
  document.querySelector(`[data-thu="the-thanh-vien"][data-ten="${ten}"]`);
const nutTrongThe = (ten: string) =>
  Array.from(the(ten)?.querySelectorAll("button") ?? []).map((b) => b.textContent ?? "");

beforeEach(async () => {
  await xoaSachTatCa();
  await luuThanhVien(TV.me);
  await luuThanhVien(TV.con);
});
afterEach(async () => {
  cleanup();
  vi.doUnmock("@config/disc-nguong");
  vi.resetModules();
  await xoaSachTatCa();
});

describe("cờ BẬT — trạng thái đang phát hành", () => {
  it("thẻ trẻ có nút làm bài như thường", async () => {
    await dungBang(true);
    expect(nutTrongThe("Kiki").join(" ")).toContain(CHU_BANG_GIA_DINH.nutLamBai);
    expect(the("Kiki")!.querySelector('[data-thu="tre-tam-dong"]')).toBeNull();
  });

  it("thẻ người lớn cũng bình thường", async () => {
    await dungBang(true);
    expect(nutTrongThe("Zozo").join(" ")).toContain(CHU_BANG_GIA_DINH.nutLamBai);
  });
});

describe("🔴 cờ TẮT — rút lại trong 30 giây", () => {
  it("thẻ trẻ KHÔNG còn nút làm bài, và nói rõ vì sao", async () => {
    await dungBang(false);
    // Bày nút ra rồi bấm vào mới báo "đang đóng" là để người ta thất vọng thêm một nhịp.
    expect(nutTrongThe("Kiki").join(" ")).not.toContain(CHU_BANG_GIA_DINH.nutLamBai);
    expect(the("Kiki")!.querySelector('[data-thu="tre-tam-dong"]')).toHaveTextContent(
      CHU_TRE_TAM_DONG.than,
    );
  });

  it("nút phụ 'bố mẹ trả lời về trẻ' cũng biến mất", async () => {
    await dungBang(false);
    expect(the("Kiki")!.querySelector('[data-thu="nut-quan-sat"]')).toBeNull();
  });

  it("🔴 PHẦN NGƯỜI LỚN CÒN NGUYÊN — tắt phần trẻ không được kéo theo cả sản phẩm", async () => {
    await dungBang(false);
    expect(nutTrongThe("Zozo").join(" ")).toContain(CHU_BANG_GIA_DINH.nutLamBai);
    expect(the("Zozo")!.querySelector('[data-thu="tre-tam-dong"]')).toBeNull();
  });

  it("câu chữ KHÔNG hạ thấp đứa trẻ — nói về nội dung, không nói về em", async () => {
    await dungBang(false);
    const chu = the("Kiki")!.querySelector('[data-thu="tre-tam-dong"]')!.textContent ?? "";
    // Không được đọc lên như "em này nằm ngoài phạm vi sản phẩm".
    expect(chu).not.toMatch(/không hỗ trợ|chưa hỗ trợ|ngoài phạm vi/iu);
    expect(chu).toMatch(/chuyên môn/u);
  });
});

describe("🔴 cửa chặn CUỐI ở khoang làm bài", () => {
  it("dựng thẳng khoang cho một đứa trẻ khi cờ tắt ⇒ vẫn bị chặn", async () => {
    // Ẩn nút ở thẻ là chuyện TRÌNH BÀY. Cửa này là chuyện NỘI DUNG — ai đó dựng thẳng
    // khoang (test, hoặc một lối vào thêm sau này) cũng không đi vòng qua được.
    vi.resetModules();
    vi.doMock("@config/disc-nguong", async (goc) => ({
      ...(await goc<typeof import("../config/disc-nguong")>()),
      MO_NOI_DUNG_TRE: false,
    }));
    const { KhoangDisc } = await import("../app/khoang/disc");
    render(<KhoangDisc vaoTuThanhVien={TV.con} onThoat={vi.fn()} />);

    expect(document.querySelector('[data-thu="tre-tam-dong"]')).toBeTruthy();
    expect(screen.queryByRole("radiogroup")).toBeNull();
  });

  it("người lớn vẫn vào bài được khi cờ tắt", async () => {
    vi.resetModules();
    vi.doMock("@config/disc-nguong", async (goc) => ({
      ...(await goc<typeof import("../config/disc-nguong")>()),
      MO_NOI_DUNG_TRE: false,
    }));
    const { KhoangDisc } = await import("../app/khoang/disc");
    render(<KhoangDisc vaoTuThanhVien={TV.me} onThoat={vi.fn()} />);

    expect(document.querySelector('[data-thu="tre-tam-dong"]')).toBeNull();
    expect(document.querySelector('[data-thu="ten-co-san"]')).toBeTruthy();
  });
});
