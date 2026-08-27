import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HopThoaiHanMuc } from "../app/components/hop-thoai-han-muc";
import { GIOI_HAN_BAI_MOI_NGUOI } from "../config/disc-gia-dinh";
import { CHU_HAN_MUC } from "../config/disc-tu-dien";
import {
  baiSapMat,
  docTatCa,
  donBaiThanhVien,
  luuBai,
  xoaSach,
  xoaSachThanhVien,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";

/**
 * 🔴 HẠN MỨC KHÔNG BAO GIỜ ĐƯỢC XOÁ IM LẶNG.
 *
 * `han-muc.test.ts` đã chứng minh phép CHỌN nạn nhân đúng. File này canh hai chuyện khác,
 * và cả hai đều là chuyện mất dữ liệu thật:
 *  1. Việc thi hành chỉ chạy khi được gọi RÕ RÀNG — không lẻn vào bất kỳ đường ghi nào.
 *  2. Người dùng được nêu đích danh bài sắp mất, được tải về, và huỷ thì không mất gì.
 *
 * 🔴 Mọi tên là BỊA.
 */

let dem = 0;
const bai = (ghiDe: Partial<BaiLamLuu> = {}): BaiLamLuu => {
  dem += 1;
  return {
    id: `bai-${dem}`,
    boDe: "THCS",
    maTre: "Zozo",
    maThanhVien: "tv-1",
    nguoiTraLoi: "tre",
    batDau: "2026-08-27T06:00:00+07:00",
    // 🔴 Bộ đếm chạy XUYÊN các test trong file, nên đừng nhét nó vào ngày tháng: tới test
    // thứ tư nó thành "2026-08" và cửa kiểm đọc lên như hỏng trong khi mã vẫn đúng.
    // Test nào cần một mốc cụ thể thì truyền `ketThuc` vào thẳng.
    ketThuc: "2026-01-01T06:00:00+07:00",
    traLoi: { "THCS-D1": 4 },
    ketQua: {
      hopLe: true,
      diem: { D: 62.5, I: 41.7, S: 33.3, C: 70.8 },
      xepHang: ["C", "D", "I", "S"],
      kieu: { loai: "don", truc: "C" },
      canhBao: [],
    },
    phienBanBoDe: "1.1",
    ...ghiDe,
  };
};

beforeEach(async () => {
  await xoaSach();
  await xoaSachThanhVien();
  window.localStorage.clear();
});
afterEach(async () => {
  cleanup();
  vi.restoreAllMocks();
  await xoaSach();
});

describe("🔴 thi hành hạn mức — chỉ chạy khi được gọi rõ ràng", () => {
  it("baiSapMat CHỈ ĐỌC — gọi xong không mất bài nào", async () => {
    await luuBai(bai());
    await luuBai(bai());

    const sap = await baiSapMat("tv-1", GIOI_HAN_BAI_MOI_NGUOI);

    expect(sap).toHaveLength(1);
    expect(await docTatCa(), "baiSapMat mà xoá thì nó không còn là 'chỉ đọc'").toHaveLength(2);
  });

  it("🔴 luuBai KHÔNG tự dọn — bài thứ ba vẫn nằm đó cho tới khi có người hỏi", async () => {
    // Đây là cạm bẫy cả repo đang cảnh báo: xoá im lặng bên trong một hàm ghi. Nếu hạn
    // mức nằm trong `luuBai` thì `ghiBanKhoan` — vốn chỉ đính một mã vào bài cũ — cũng
    // sẽ âm thầm xoá bài của người khác.
    await luuBai(bai());
    await luuBai(bai());
    await luuBai(bai());

    expect(await docTatCa()).toHaveLength(3);
  });

  it("donBaiThanhVien xoá đúng bài cũ nhất, giữ đúng số còn lại", async () => {
    await luuBai(bai({ ketThuc: "2026-01-01T06:00:00+07:00" })); // cũ nhất
    await luuBai(bai({ ketThuc: "2026-02-01T06:00:00+07:00" }));
    const daXoa = await donBaiThanhVien("tv-1", GIOI_HAN_BAI_MOI_NGUOI);

    expect(daXoa).toHaveLength(1);
    const con = await docTatCa();
    expect(con).toHaveLength(1);
    expect(con[0].ketThuc).toContain("2026-02");
  });

  it("🔴 KHÔNG đụng vào bài của thành viên KHÁC", async () => {
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await luuBai(bai({ maThanhVien: "tv-1" }));
    await luuBai(bai({ maThanhVien: "tv-2", maTre: "Kiki" }));
    await luuBai(bai({ maThanhVien: "tv-2", maTre: "Kiki" }));

    await donBaiThanhVien("tv-1", GIOI_HAN_BAI_MOI_NGUOI);

    const con = await docTatCa();
    expect(con.filter((b) => b.maThanhVien === "tv-2")).toHaveLength(2);
  });

  it("chưa chạm trần thì dọn xong không mất gì", async () => {
    await luuBai(bai());
    expect(await donBaiThanhVien("tv-1", GIOI_HAN_BAI_MOI_NGUOI)).toEqual([]);
    expect(await docTatCa()).toHaveLength(1);
  });
});

describe("🔴 hộp thoại — ba thứ bắt buộc", () => {
  const SAP_MAT = [bai({ id: "sap-mat", ketThuc: "2026-03-15T06:00:00+07:00" })];

  it("NÊU ĐÍCH DANH bài nào sắp mất: bộ nào, ngày nào", () => {
    render(<HopThoaiHanMuc sapMat={SAP_MAT} onHuy={() => {}} onTiepTuc={() => {}} />);
    const ds = document.querySelector('[data-thu="bai-sap-mat"]');
    expect(ds?.textContent).toContain("THCS");
    expect(ds?.textContent, "phải nói NGÀY, không chỉ nói 'bài cũ nhất'").toContain("15/03/2026");
  });

  it("có nút tải về giữ lại", () => {
    render(<HopThoaiHanMuc sapMat={SAP_MAT} onHuy={() => {}} onTiepTuc={() => {}} />);
    expect(screen.getByRole("button", { name: CHU_HAN_MUC.nutTaiVe })).toBeTruthy();
  });

  it("🔴 chưa tick xác nhận thì KHÔNG cho đi tiếp", () => {
    const tiep = vi.fn();
    render(<HopThoaiHanMuc sapMat={SAP_MAT} onHuy={() => {}} onTiepTuc={tiep} />);

    fireEvent.click(screen.getByRole("button", { name: CHU_HAN_MUC.nutTiepTuc }));

    expect(tiep).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(CHU_HAN_MUC.chuaTick);
  });

  it("tick rồi mới đi tiếp được", () => {
    const tiep = vi.fn();
    render(<HopThoaiHanMuc sapMat={SAP_MAT} onHuy={() => {}} onTiepTuc={tiep} />);

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: CHU_HAN_MUC.nutTiepTuc }));

    expect(tiep).toHaveBeenCalledOnce();
  });

  it("🔴 bấm Huỷ thì gọi onHuy và KHÔNG gọi onTiepTuc — huỷ là không mất gì", () => {
    const huy = vi.fn();
    const tiep = vi.fn();
    render(<HopThoaiHanMuc sapMat={SAP_MAT} onHuy={huy} onTiepTuc={tiep} />);

    fireEvent.click(screen.getByRole("button", { name: CHU_HAN_MUC.nutHuy }));

    expect(huy).toHaveBeenCalledOnce();
    expect(tiep).not.toHaveBeenCalled();
  });

  it("bấm tải về thì báo lại kết quả cho người dùng biết", async () => {
    render(<HopThoaiHanMuc sapMat={SAP_MAT} onHuy={() => {}} onTiepTuc={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: CHU_HAN_MUC.nutTaiVe }));

    // jsdom không có createObjectURL ⇒ đi nhánh báo lỗi. Điều cần canh là nó NÓI RA.
    await waitFor(() => expect(screen.getByRole("status")).toBeTruthy());
    expect([CHU_HAN_MUC.daTaiVe, CHU_HAN_MUC.loiTaiVe]).toContain(
      screen.getByRole("status").textContent,
    );
  });

  it("hộp thoại là dialog thật, có nhãn cho người đọc màn hình", () => {
    render(<HopThoaiHanMuc sapMat={SAP_MAT} onHuy={() => {}} onTiepTuc={() => {}} />);
    const hop = screen.getByRole("dialog");
    expect(hop.getAttribute("aria-modal")).toBe("true");
    expect(hop.getAttribute("aria-label")).toBe(CHU_HAN_MUC.tieuDe);
  });
});
