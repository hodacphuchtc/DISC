import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KhoangBangGiaDinh } from "../app/khoang/bang-gia-dinh";
import { LOP_MAM_NON, LOP_TREN_12 } from "../config/disc-nguong";
import { CHU_BANG_GIA_DINH } from "../config/disc-tu-dien";
import type { VaiGiaDinh } from "../config/disc-gia-dinh";
import { luuThanhVien, xoaSach, xoaSachThanhVien } from "../modules/core/luu-tru/kho-bai";

/**
 * NÚT TRÊN THẺ THÀNH VIÊN (V1.4).
 *
 * Ba luật, đọc lên chính là bản đặc tả:
 *
 *  1. Thẻ người lớn có ĐÚNG MỘT nút làm bài — bài về chính họ. Bài quan sát về con đã
 *     chuyển sang thẻ của đứa trẻ.
 *  2. Thẻ trẻ MẦM NON / LỚP 1–2 cũng chỉ có một nút, và nút đó nói rõ *bố mẹ trả lời* —
 *     các em chưa tự đánh giá được (ADR-002), nên bài chính của các em vốn đã là bản
 *     quan sát; thêm nút thứ hai làm cùng một việc chỉ tổ gây phân vân.
 *  3. Thẻ trẻ TỪ LỚP 3 có hai nút: em tự làm, và bố mẹ trả lời về em. Hai bài đó ghép
 *     lại mới mở được màn Vùng lệch.
 */

/** Tên bịa KHÔNG đụng chữ nào của giao diện — `"Bi"` từng khớp nhầm vào "**Bi**ệt danh". */
const TEN = "Zozo";

async function dungBang(vaiTro: VaiGiaDinh, lop?: string) {
  await luuThanhVien({
    id: "tv-thu",
    ten: TEN,
    vaiTro,
    ...(lop ? { lop } : {}),
    thuTu: 0,
    taoLuc: "2026-08-01T00:00:00.000Z",
    suaLuc: "2026-08-01T00:00:00.000Z",
  });
  render(
    <KhoangBangGiaDinh onLamBai={vi.fn()} onLamBaiQuanSat={vi.fn()} onXemBai={vi.fn()} />,
  );
  await waitFor(() => expect(screen.getByText(TEN)).toBeTruthy());
}

const nutTraLoiHo = () => CHU_BANG_GIA_DINH.nutTraLoiHo.replace("{ten}", TEN);
const nut = (ten: string) => screen.queryByRole("button", { name: ten });

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
  await xoaSachThanhVien();
});

describe("thẻ người lớn", () => {
  for (const vai of ["me", "bo", "ong", "ba", "nguoi-than"] as const) {
    it(`vai ${vai}: đúng MỘT nút làm bài, và KHÔNG có nút trả lời hộ`, async () => {
      await dungBang(vai);
      expect(nut(CHU_BANG_GIA_DINH.nutLamBai)).not.toBeNull();
      expect(document.querySelector('[data-thu="nut-quan-sat"]')).toBeNull();
      expect(nut(nutTraLoiHo())).toBeNull();
    });
  }
});

describe("thẻ trẻ chưa tự đánh giá được", () => {
  for (const lop of [LOP_MAM_NON, "1", "2"]) {
    it(`lớp ${lop}: nút DUY NHẤT nói rõ bố mẹ trả lời, không ghi trống "Làm bài"`, async () => {
      await dungBang("con", lop);
      expect(nut(nutTraLoiHo())).not.toBeNull();
      // Không được có thêm nút phụ làm đúng cùng một việc.
      expect(document.querySelectorAll('[data-thu="nut-quan-sat"]')).toHaveLength(0);
      // Và nút chính KHÔNG được ghi "Làm bài" trống trơn: bấm vào rồi thấy câu hỏi dành
      // cho bố mẹ là một cú hẫng, nhất là khi người bấm tưởng con mình sắp tự làm.
      expect(nut(CHU_BANG_GIA_DINH.nutLamBai)).toBeNull();
    });
  }
});

describe("thẻ trẻ tự làm được", () => {
  for (const lop of ["3", "5", "7", "9", "12"]) {
    it(`lớp ${lop}: có CẢ nút em tự làm LẪN nút bố mẹ trả lời về em`, async () => {
      await dungBang("con", lop);
      expect(nut(CHU_BANG_GIA_DINH.nutLamBai)).not.toBeNull();
      expect(nut(nutTraLoiHo())).not.toBeNull();
      expect(document.querySelectorAll('[data-thu="nut-quan-sat"]')).toHaveLength(1);
    });
  }

  it("đã qua lớp 12: chỉ tự làm, KHÔNG có ai trả lời hộ nữa", async () => {
    await dungBang("con", LOP_TREN_12);
    expect(nut(CHU_BANG_GIA_DINH.nutLamBai)).not.toBeNull();
    expect(nut(nutTraLoiHo())).toBeNull();
  });
});

describe("nút trả lời hộ gọi đúng tên người", () => {
  it("nhãn nhắc đích danh, không ghi chung chung 'con bạn'", async () => {
    await dungBang("con", "7");
    expect(nut(nutTraLoiHo())!.textContent).toContain(TEN);
    // Chuỗi mẫu phải được thay, không để lọt dấu ngoặc ra màn hình.
    expect(document.body.textContent).not.toContain("{ten}");
  });
});
