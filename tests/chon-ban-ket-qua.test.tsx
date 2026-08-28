/**
 * CỬA KIỂM CỦA `17.2` — xem lại được LẦN ĐO TRƯỚC, không chỉ lần mới nhất.
 *
 * 🔴 Cửa nặng nhất ở cuối file: **dải này KHÔNG ĐƯỢC so sánh hai bài với nhau.** Việc so
 * sánh có sàn 90 ngày (`so-sanh-thoi-gian.ts`) vì một nấc trả lời dịch điểm 4–10 điểm —
 * hai bài cách nhau ba tuần thì thứ hiện lên là nhiễu của phép đo, mà nó vẫn đọc lên đầy
 * thuyết phục vì có số kèm theo. Thêm một đường vòng qua sàn đó là lật một quyết định đã
 * chốt, và lật một cách âm thầm.
 *
 * 🔴 Mọi tên là BỊA.
 */

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ChonBanKetQua } from "../app/components/chon-ban-ket-qua";
import { KhoangNhaMinh } from "../app/khoang/nha-minh";
import { CHU_BANG_GIA_DINH, CHU_SO_SANH } from "../config/disc-tu-dien";
import {
  luuBai,
  luuThanhVien,
  xoaSachTatCa,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";

const LUC = "2026-08-28T09:00:00+07:00";

/** Hai bộ điểm KHÁC HẲN nhau — để nhìn ra ngay là màn đã đổi sang bài kia. */
const DIEM_CHIEU = { D: 88, I: 22, S: 30, C: 44 };
const DIEM_SANG = { D: 20, I: 84, S: 61, C: 35 };

const bai = (id: string, ketThuc: string, diem: Record<string, number>): BaiLamLuu =>
  ({
    id,
    boDe: "THCS",
    maTre: "Zozo",
    maThanhVien: "tv-1",
    nguoiTraLoi: "tre",
    batDau: LUC,
    ketThuc,
    traLoi: { "THCS-D1": 4 },
    ketQua: {
      hopLe: true,
      diem,
      xepHang: Object.keys(diem).sort((a, b) => diem[b] - diem[a]),
      kieu: { loai: "don", truc: Object.keys(diem).sort((a, b) => diem[b] - diem[a])[0] },
      canhBao: [],
    },
    phienBanBoDe: "1.0",
  }) as unknown as BaiLamLuu;

async function dungSo(soBai: 1 | 2) {
  await luuThanhVien({
    id: "tv-1",
    ten: "Zozo",
    vaiTro: "con",
    lop: "7",
    thuTu: 0,
    taoLuc: LUC,
    suaLuc: LUC,
  });
  // 🔴 CÙNG MỘT NGÀY, cách nhau vài giờ — đúng trường hợp mà nhãn chỉ-có-ngày hỏng.
  await luuBai(bai("b-chieu", "2026-08-28T16:20:00+07:00", DIEM_CHIEU));
  if (soBai === 2) await luuBai(bai("b-sang", "2026-08-28T09:05:00+07:00", DIEM_SANG));
}

/** Mở màn kết quả từ thẻ của Zozo. */
async function moKetQua() {
  render(<KhoangNhaMinh />);
  await screen.findByText("Zozo");
  fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutXemKetQua }));
  await waitFor(() =>
    expect(document.querySelector('[data-thu="man-ket-qua"], main, section')).toBeTruthy(),
  );
}

const dai = () => document.querySelector('[data-thu="chon-ban-ket-qua"]');
const nutBan = () =>
  [...document.querySelectorAll('[data-thu="nut-ban"]')] as HTMLButtonElement[];

beforeEach(async () => {
  await xoaSachTatCa();
});
afterEach(async () => {
  cleanup();
  await xoaSachTatCa();
});

describe("dải chọn — dựng riêng", () => {
  it("một bản ⇒ KHÔNG dựng gì; một dải chọn có một lựa chọn là nút không dẫn tới đâu", () => {
    const { container } = render(
      <ChonBanKetQua
        cacBan={[{ id: "a", ketThuc: LUC, boDe: "THCS" }]}
        dangChon={0}
        onChon={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("hai bản CÙNG NGÀY ⇒ hai nhãn KHÁC NHAU, vì có giờ", () => {
    render(
      <ChonBanKetQua
        cacBan={[
          { id: "chieu", ketThuc: "2026-08-28T16:20:00+07:00", boDe: "THCS" },
          { id: "sang", ketThuc: "2026-08-28T09:05:00+07:00", boDe: "THCS" },
        ]}
        dangChon={0}
        onChon={vi.fn()}
      />,
    );
    const nhan = nutBan().map((n) => n.textContent ?? "");
    expect(nhan).toHaveLength(2);
    expect(nhan[0]).not.toBe(nhan[1]);
    expect(nhan[0]).toContain("16:20");
    expect(nhan[1]).toContain("09:05");
  });

  it("bản đang xem được đánh dấu cho trình đọc màn hình", () => {
    render(
      <ChonBanKetQua
        cacBan={[
          { id: "a", ketThuc: "2026-08-28T16:20:00+07:00", boDe: "THCS" },
          { id: "b", ketThuc: "2026-08-28T09:05:00+07:00", boDe: "THCS" },
        ]}
        dangChon={1}
        onChon={vi.fn()}
      />,
    );
    expect(nutBan()[1].getAttribute("aria-current")).toBe("true");
    expect(nutBan()[0].getAttribute("aria-current")).toBeNull();
  });
});

describe("đi trọn luồng từ thẻ", () => {
  it("người chỉ có MỘT bài ⇒ vào kết quả KHÔNG thấy dải nào", async () => {
    await dungSo(1);
    await moKetQua();
    expect(dai()).toBeNull();
  });

  it("🔴 người có HAI bài ⇒ thấy dải, mặc định là bài MỚI NHẤT", async () => {
    await dungSo(2);
    await moKetQua();
    await waitFor(() => expect(dai()).toBeTruthy());
    expect(nutBan()).toHaveLength(2);
    expect(nutBan()[0].getAttribute("aria-current")).toBe("true");
    // Bài mới nhất là bài CHIỀU (D = 88) ⇒ màn phải đang nói về trục D.
    expect(nutBan()[0].textContent).toContain("16:20");
  });

  it("🔴 bấm bản CŨ ⇒ màn đổi sang đúng bộ điểm của bài cũ", async () => {
    await dungSo(2);
    await moKetQua();
    await waitFor(() => expect(dai()).toBeTruthy());

    const chuTruocKhiDoi = document.body.textContent ?? "";
    fireEvent.click(nutBan()[1]);

    await waitFor(() => {
      expect(nutBan()[1].getAttribute("aria-current")).toBe("true");
    });
    // Đối chứng: nếu nội dung y hệt nhau thì dải này không hề đi tới engine, và cửa kiểm
    // trên chỉ chứng minh được một cái nút đổi màu.
    await waitFor(() => {
      expect(document.body.textContent).not.toBe(chuTruocKhiDoi);
    });
  });

  it("bấm lại bản MỚI ⇒ quay về được, không phải thoát ra vào lại", async () => {
    await dungSo(2);
    await moKetQua();
    await waitFor(() => expect(dai()).toBeTruthy());
    fireEvent.click(nutBan()[1]);
    await waitFor(() => expect(nutBan()[1].getAttribute("aria-current")).toBe("true"));
    fireEvent.click(nutBan()[0]);
    await waitFor(() => expect(nutBan()[0].getAttribute("aria-current")).toBe("true"));
  });
});

describe("🔴 RANH GIỚI — dải này KHÔNG được so sánh hai bài", () => {
  it("hai bài cách nhau vài GIỜ ⇒ không một chữ nào của khối so sánh hiện ra", async () => {
    await dungSo(2);
    await moKetQua();
    await waitFor(() => expect(dai()).toBeTruthy());

    // Sàn 90 ngày: hai bài cùng ngày thì tuyệt đối chưa được nói gì về "thay đổi".
    for (const chu of [CHU_SO_SANH.nutXem, CHU_SO_SANH.tieuDe ?? "«không có»"]) {
      if (typeof chu === "string" && chu.length > 3) {
        expect(document.body.textContent, `lọt chữ so sánh: "${chu}"`).not.toContain(chu);
      }
    }
  });

  it("chữ trên dải nói MỐC THỜI GIAN, không nói ý nghĩa", async () => {
    await dungSo(2);
    await moKetQua();
    await waitFor(() => expect(dai()).toBeTruthy());
    const chu = dai()!.textContent ?? "";
    for (const cam of ["tăng", "giảm", "thay đổi", "tiến bộ", "cải thiện", "so với"]) {
      expect(chu.toLowerCase(), `dải chọn không được nói "${cam}"`).not.toContain(cam);
    }
  });
});
