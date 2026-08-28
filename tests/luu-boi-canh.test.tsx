import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CHU_LAM_BAI, CHU_TRUOC_KHI_BAT_DAU } from "../config/disc-tu-dien";
import type { BaiLamLuu } from "../modules/core/luu-tru/kho-bai";
import { nguoiChoBoDe, type MaBoDeThu } from "./duong-vao-bai";

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

/** Đi trọn một lượt làm bài, từ lúc mở khoang tới lúc bản ghi được lưu. */
function lamTronBai(ma: MaBoDeThu, cheDo?: "quan-sat") {
  render(
    <KhoangDisc
      vaoTuThanhVien={nguoiChoBoDe(ma, "Zozo")}
      onThoat={() => {}}
      {...(cheDo ? { cheDo } : {})}
    />,
  );
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

describe("🔴 bối cảnh của người trong sổ phải THEO ĐƯỢC vào bản ghi đã lưu", () => {
  it("bộ Tiểu học: bậc học trong sổ phải nằm trong bản ghi", () => {
    lamTronBai("TH");

    expect(daLuu).toHaveLength(1);
    expect(daLuu[0].boDe).toBe("TH");
    expect(daLuu[0].lop).toBe("4");
  });

  it("bộ THCS: bậc học theo được, và bài đóng dấu ĐÚNG người trong sổ", () => {
    lamTronBai("THCS");

    expect(daLuu).toHaveLength(1);
    expect(daLuu[0].boDe).toBe("THCS");
    expect(daLuu[0].lop).toBe("7");
    // 🔴 Gắn thành viên NGAY LÚC LƯU. Gán sau bằng cách dò tên là dựng lại đúng cái mơ hồ
    // mà sổ gia đình sinh ra để dẹp: hai người trùng tên là bài về nhầm chỗ.
    expect(daLuu[0].maThanhVien).toBe(nguoiChoBoDe("THCS").id);
  });

  it("🔴 mầm non: bậc \"mam-non\" theo được nguyên dạng CHUỖI, không hoá NaN", () => {
    // Đây chính là chỗ trẻ mầm non từng bị đá khỏi luồng làm bài: `Number("mam-non")`
    // ra NaN, và NaN lọt qua mọi phép so sánh mà không ai biết.
    lamTronBai("MN");

    expect(daLuu).toHaveLength(1);
    expect(daLuu[0].boDe).toBe("MN");
    expect(daLuu[0].lop).toBe("mam-non");
  });

  it("🔴 TUỔI KHÔNG BAO GIỜ được lưu — không ai hỏi nữa thì không được bịa", () => {
    // Trước V2.2, màn 1 hỏi tuổi con ở nhánh bộ QS. Màn đó đã bị xoá, nên nay tuổi hoàn
    // toàn không có nguồn. Suy nó từ lớp là bịa dữ liệu cá nhân của trẻ — lớp 7 có cả bé
    // 12 lẫn bé 13. Cửa này canh cho không ai lặng lẽ thêm một phép suy như vậy.
    for (const ma of ["TH", "THCS", "MN", "PH"] as const) {
      daLuu.length = 0;
      cleanup();
      lamTronBai(ma);
      expect(daLuu[0]?.tuoi, `bộ ${ma} lưu tuổi mà không ai hỏi`).toBeUndefined();
    }
  });

  it("bộ quan sát: người lớn trả lời về trẻ, bản ghi vẫn thuộc về trẻ đó", () => {
    lamTronBai("QS", "quan-sat");

    expect(daLuu).toHaveLength(1);
    expect(daLuu[0].boDe).toBe("QS");
    expect(daLuu[0].nguoiTraLoi).toBe("nguoi-lon");
    expect(daLuu[0].maThanhVien).toBe(nguoiChoBoDe("QS").id);
  });
});
