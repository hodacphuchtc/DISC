import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CHU_CHON, CHU_LAM_BAI, CHU_TRUOC_KHI_BAT_DAU } from "../config/disc-tu-dien";
import type { BaiLamLuu } from "../modules/core/luu-tru/kho-bai";

/**
 * 🔴 VÌ SAO CÓ FILE NÀY.
 *
 * Trường `lop` được khai trong `BaiLamLuu` ngay từ đầu, màn 1 đã hỏi lớp thật, vậy mà
 * KHÔNG NƠI NÀO GHI nó — `disc.tsx` dựng bản ghi mà không truyền. Type xanh, test xanh,
 * lint xanh, và cái trường đó chết lặng suốt từ GĐ0. Kiểu lỗi này không có cửa nào bắt
 * được ngoài một test đi trọn luồng rồi soi ĐÚNG bản ghi đã lưu.
 */

const daLuu: BaiLamLuu[] = [];

vi.mock("@modules/core/luu-tru/kho-bai", async (goc) => {
  const that = await goc<typeof import("../modules/core/luu-tru/kho-bai")>();
  return {
    ...that,
    luuBai: (bai: BaiLamLuu) => {
      daLuu.push(bai);
      return Promise.resolve(true);
    },
  };
});

const { KhoangDisc } = await import("../app/khoang/disc");

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  daLuu.length = 0;
});

const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));

/** Trả lời hết câu đang hiện trên màn, mỗi câu nhích một mức khác nhau cho khỏi phẳng. */
function traLoiTrangNay(lech: number) {
  const nhom = screen.getAllByRole("radiogroup");
  nhom.forEach((g, i) => {
    const nut = Array.from(g.querySelectorAll('[role="radio"]')) as HTMLElement[];
    fireEvent.click(nut[(i + lech) % nut.length]);
  });
}

/** Đi trọn một lượt làm bài, từ M1 tới lúc bản ghi được lưu. */
function lamTronBai(duongM1: () => void) {
  render(<KhoangDisc />);
  duongM1();
  bam(CHU_CHON.nutTiepTuc);
  fireEvent.change(screen.getByLabelText(CHU_TRUOC_KHI_BAT_DAU.nhanO), {
    target: { value: "Bi" },
  });
  bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);

  // Bấm cho tới khi hết câu. Chặn trên để test không treo nếu luồng đổi.
  for (let vong = 0; vong < 40; vong += 1) {
    traLoiTrangNay(vong);
    const xong = screen.queryByRole("button", { name: CHU_LAM_BAI.nutXemKetQua });
    if (xong) {
      fireEvent.click(xong);
      return;
    }
    bam(CHU_LAM_BAI.nutTiep);
  }
  throw new Error("Không tới được nút Xem kết quả sau 40 màn.");
}

describe("🔴 bối cảnh màn 1 phải THEO ĐƯỢC vào bản ghi đã lưu", () => {
  it("bộ QS: tuổi con đã hỏi thì phải nằm trong bản ghi", () => {
    lamTronBai(() => {
      bam(/^Phụ huynh/u);
      bam(CHU_CHON.mucTieuCon);
      bam("13");
    });

    expect(daLuu).toHaveLength(1);
    expect(daLuu[0].boDe).toBe("QS");
    // Chính con số này phân định lứa nội dung: bộ QS trải 8–15 tuổi, bắc qua cả tiểu học
    // lẫn THCS, nên mã bộ đề một mình KHÔNG suy ra lứa được.
    expect(daLuu[0].tuoi).toBe(13);
  });

  it("bộ Tiểu học: lớp đã hỏi thì phải nằm trong bản ghi", () => {
    lamTronBai(() => {
      bam(/^Tiểu học/u);
      bam("Lớp 4");
    });

    expect(daLuu).toHaveLength(1);
    expect(daLuu[0].boDe).toBe("TH");
    expect(daLuu[0].lop).toBe("4");
  });

  it("không hỏi thì KHÔNG bịa: bộ THCS không có lớp lẫn tuổi", () => {
    // Cố ý không suy tuổi từ lớp hay từ mã bộ đề. Đoán ra một con số rồi lưu như thể đã
    // hỏi là tự bịa dữ liệu cá nhân của trẻ.
    lamTronBai(() => bam(/^Trung học cơ sở/u));

    expect(daLuu).toHaveLength(1);
    expect(daLuu[0].boDe).toBe("THCS");
    expect(daLuu[0].tuoi).toBeUndefined();
    expect(daLuu[0].lop).toBeUndefined();
  });
});
