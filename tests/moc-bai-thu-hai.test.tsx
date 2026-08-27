import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { KhoangDisc } from "../app/khoang/disc";
import { CHU_CHON, CHU_LAM_BAI, CHU_TRUOC_KHI_BAT_DAU } from "../config/disc-tu-dien";
import { docPhieu, xoaPhieu } from "../modules/core/do-phieu";
import { docTatCa, xoaSach } from "../modules/core/luu-tru/kho-bai";
import { DUONG_M1 } from "./duong-m1";

/**
 * 🔴 MỐC `baiThuHai` CÓ THẬT SỰ ĐƯỢC GHI KHÔNG.
 *
 * `do-phieu.test.ts` đã chứng minh phép ĐẾM đúng, `so-lieu.test.tsx` đã chứng minh màn
 * hình HIỆN đúng. Cả hai đều vô nghĩa nếu không nơi nào GHI mốc — màn số liệu sẽ hiện số
 * 0 vĩnh viễn và trông y như một kết quả đo thật.
 *
 * Đó đúng là cách bộ đếm phễu GĐ6 đã chết lặng suốt bốn giai đoạn: có hàm, có test, không
 * ai gọi. File này đi TRỌN luồng thật, hai lượt, hai biệt danh, rồi soi sổ phễu.
 *
 * 🔴 Biệt danh dưới đây là BỊA.
 */

const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));

function traLoiTrangNay(lech: number) {
  const nhom = screen.getAllByRole("radiogroup");
  nhom.forEach((g, i) => {
    const nut = Array.from(g.querySelectorAll('[role="radio"]')) as HTMLElement[];
    // 🔴 TRÁNH MỨC GIỮA: trả lời xoay vòng đều ra hồ sơ phẳng, và hàng rào HL-1 từ chối
    // kết luận — bài vẫn lưu, nhưng đó là cạm bẫy đã trả giá một lần rồi.
    fireEvent.click(nut[(i + lech) % nut.length]);
  });
}

/** Đi trọn một lượt làm bài với một biệt danh, tới lúc bài được lưu vào kho. */
async function lamTronBai(bietDanh: string, duongM1: () => void) {
  const man = render(<KhoangDisc />);
  duongM1();
  bam(CHU_CHON.nutTiepTuc);
  fireEvent.change(screen.getByLabelText(CHU_TRUOC_KHI_BAT_DAU.nhanO), {
    target: { value: bietDanh },
  });
  bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);

  for (let vong = 0; vong < 40; vong += 1) {
    traLoiTrangNay(vong);
    const xong = screen.queryByRole("button", { name: CHU_LAM_BAI.nutXemKetQua });
    if (xong) {
      fireEvent.click(xong);
      // Bài lưu ở NỀN (kết quả hiện ngay, IndexedDB ghi sau) — chờ kho nhận xong.
      await waitFor(async () => {
        expect((await docTatCa()).some((b) => b.maTre === bietDanh)).toBe(true);
      });
      man.unmount();
      return;
    }
    bam(CHU_LAM_BAI.nutTiep);
  }
  throw new Error("Không tới được nút Xem kết quả sau 40 màn.");
}

const soLan = (moc: string) => docPhieu().filter((b) => b.moc === moc).length;

beforeEach(async () => {
  await xoaSach();
  xoaPhieu();
  window.localStorage.clear();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
  xoaPhieu();
});

describe("🔴 mốc baiThuHai được ghi ĐÚNG LÚC, ĐÚNG MỘT LẦN", () => {
  it("một biệt danh làm hai bài ⇒ KHÔNG ghi mốc", async () => {
    await lamTronBai("Zozo", () => DUONG_M1.TH(4));
    await lamTronBai("Zozo", () => DUONG_M1.TH(4));

    expect((await docTatCa())).toHaveLength(2);
    expect(soLan("baiThuHai"), "một đứa trẻ làm hai bài không phải là hai người").toBe(0);
  });

  it("🔴 hai biệt danh khác nhau ⇒ ghi mốc", async () => {
    await lamTronBai("Zozo", () => DUONG_M1.TH(4));
    expect(soLan("baiThuHai")).toBe(0);

    await lamTronBai("Kiki", () => DUONG_M1.TH(4));
    expect(soLan("baiThuHai")).toBe(1);
  });

  it("người thứ ba làm tiếp KHÔNG ghi thêm — mốc đo 'đã từng đạt', không đo số lượt", async () => {
    await lamTronBai("Zozo", () => DUONG_M1.TH(4));
    await lamTronBai("Kiki", () => DUONG_M1.TH(4));
    await lamTronBai("Mimi", () => DUONG_M1.TH(4));

    expect(soLan("baiThuHai")).toBe(1);
  });

  it("mốc KHÔNG kèm biệt danh, điểm số hay câu trả lời nào", async () => {
    await lamTronBai("Zozo", () => DUONG_M1.TH(4));
    await lamTronBai("Kiki", () => DUONG_M1.TH(4));

    const ban = docPhieu().find((b) => b.moc === "baiThuHai");
    expect(ban).toBeTruthy();
    expect(Object.keys(ban!).sort()).toEqual(["luc", "moc", "nguon"]);
    expect(JSON.stringify(ban)).not.toMatch(/Zozo|Kiki/u);
  });
});
