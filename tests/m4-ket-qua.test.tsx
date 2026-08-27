import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ManKetQua } from "../app/khoang/ket-qua";
import { CHU_M4, MA_TRUC, TRUC } from "../config/disc-tu-dien";
import { napBoDe } from "../modules/core/bo-de/nap";
import type { KetQua, MaBoDe, MaTruc } from "../modules/core/bo-de/kieu";
import { luuBai, xoaSach, type BaiLamLuu } from "../modules/core/luu-tru/kho-bai";

/**
 * 🔴 LƯỚI AN TOÀN CHO MÀN KẾT QUẢ.
 *
 * Trước file này, KHÔNG một test nào render `ManKetQua` — màn quan trọng nhất sản phẩm,
 * 485 dòng, hai chủ gọi (`disc.tsx` và `lich-su.tsx`), và sắp bị tách thành ba bản. Cả
 * cuộc tái cấu trúc đang không có gì đỡ.
 *
 * File này chốt HÀNH VI ĐANG ĐÚNG để việc tách ba bản không âm thầm đánh rơi thứ gì.
 * Nó CỐ Ý KHÔNG khẳng định bốn lỗi đã biết (câu rào sai người đọc, khối phong cách không
 * lọc bộ đề, lời mời sai ở bộ PH, định tuyến sai ở màn vùng lệch) — bốn lỗi đó có test
 * riêng ở hạng mục 1.2, và khẳng định chúng ở đây là đóng dấu cho cái sai.
 */

const KQ_HOP_LE: KetQua = {
  hopLe: true,
  diem: { D: 90, I: 55, S: 35, C: 45 },
  xepHang: ["D", "I", "C", "S"],
  kieu: { loai: "don", truc: "D" },
  canhBao: [],
};

const baiPH = (): BaiLamLuu => ({
  id: "ph-1",
  boDe: "PH",
  maTre: "Mẹ Bống",
  nguoiTraLoi: "nguoi-lon",
  batDau: "2026-08-24T14:00:00.000Z",
  ketThuc: "2026-08-24T14:10:00.000Z",
  traLoi: { "PH-D1": 3 },
  ketQua: {
    hopLe: true,
    diem: { D: 29.2, I: 45.8, S: 75, C: 54.2 },
    xepHang: ["S", "C", "I", "D"],
    kieu: { loai: "don", truc: "S" },
    canhBao: [],
  },
  phienBanBoDe: "1.0",
});

function hien(ma: MaBoDe, ketQua: KetQua = KQ_HOP_LE) {
  return render(
    <ManKetQua boDe={napBoDe(ma)} bietDanh="Bin" ketQua={ketQua} onLamLai={() => {}} />,
  );
}

/** Chờ hook đọc kho xong — `usePhongCach` chạy hiệu ứng bất đồng bộ. */
const choDocKhoXong = () => waitFor(() => expect(screen.getAllByRole("button").length).toBeGreaterThan(0));

beforeEach(async () => {
  await xoaSach();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
});

describe("nhánh KHÔNG hợp lệ — hàng rào phải chặn sạch", () => {
  const chan: KetQua = { hopLe: false, lyDo: "PHANG" };

  it("hiện lý do, KHÔNG hiện điểm số nào", () => {
    hien("MN", chan);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Chưa kết luận được");
    for (const t of MA_TRUC) {
      expect(screen.queryByText(TRUC[t].ten), `trục ${t} lọt vào nhánh bị chặn`).toBeNull();
    }
  });

  it("🔴 KHÔNG có lớp bóc sâu nào ở nhánh bị chặn", () => {
    // Bài phẳng mà vẫn đưa ra lời khuyên là dựng lâu đài trên cát.
    hien("MN", chan);
    expect(screen.queryAllByRole("button", { expanded: false })).toHaveLength(0);
  });
});

describe("nhánh hợp lệ — bốn cột và ba khối văn xuôi", () => {
  it("biểu đồ hiện đủ bốn nhóm kèm điểm", async () => {
    hien("QS");
    await choDocKhoXong();
    // Khoanh vùng vào ĐÚNG biểu đồ: tên trục còn xuất hiện ở lớp bóc sâu, vốn luôn nằm
    // trong DOM (chỉ ẩn bằng CSS) để bản in mở được — nên tìm toàn trang sẽ trúng nhiều chỗ.
    const bieuDo = within(screen.getByLabelText(CHU_M4.nhanBieuDo));
    for (const t of MA_TRUC) {
      expect(bieuDo.getByText(TRUC[t].ten), TRUC[t].ten).toBeInTheDocument();
    }
    for (const d of ["90.0", "55.0", "35.0", "45.0"]) {
      expect(bieuDo.getByText(d), `thiếu điểm ${d}`).toBeInTheDocument();
    }
  });

  it("ba khối văn xuôi và ô ba câu hỏi luôn có mặt", async () => {
    hien("QS");
    await choDocKhoXong();
    for (const ten of [
      "Điều này thường trông như thế nào",
      "Điểm mạnh khi ở đúng chỗ",
      "Chỗ cần để ý",
    ]) {
      expect(screen.getByText(ten), ten).toBeInTheDocument();
    }
    expect(screen.getByText(/3 câu để/u)).toBeInTheDocument();
  });

  it("cảnh báo hiện ra khi bài có cảnh báo", async () => {
    hien("TH", { ...KQ_HOP_LE, canhBao: ["MOT_COT"] } as KetQua);
    await choDocKhoXong();
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });

  it("có đủ nút hành động", async () => {
    hien("QS");
    await choDocKhoXong();
    for (const ten of [/Tải ảnh/u, /In \/ Tải PDF/u, /Làm bài khác/u]) {
      expect(screen.getByRole("button", { name: ten }), String(ten)).toBeInTheDocument();
    }
  });
});

describe("🔴 lớp bóc sâu — số lớp và trạng thái mặc định", () => {
  /**
   * Đây là phần dễ vỡ nhất khi tách ba bản: một khối bị rơi mất sẽ không làm test nào đỏ
   * nếu không có chỗ nào đếm.
   */
  const soLop = () => screen.queryAllByRole("button", { expanded: false }).length;

  // 🔴 HAI LỚP DÙNG CHUNG CHO MỌI BỘ ĐỀ, cộng dần theo giai đoạn:
  //  · GĐ10 — "Bốn chữ D-I-S-C nghĩa là gì"
  //  · 12.5  — "Đọc kỹ hơn về bốn nhóm" (bốn khối mỗi trục + khối dẫn nguồn)
  // Mỗi lần con số dưới đây tăng là một ĐẶC TẢ ĐỔI, không phải chỉnh test cho vừa code.
  // Vẫn giữ phép đếm vì nó là thứ duy nhất bắt được việc một khối bị rơi mất khi tách bản.
  const LOP_DUNG_CHUNG = 2;

  it.each([
    ["MN", 4 + LOP_DUNG_CHUNG],
    ["QS", 4 + LOP_DUNG_CHUNG],
  ] as const)("bộ %s (người lớn đọc về trẻ): %i lớp", async (ma, mong) => {
    hien(ma);
    await choDocKhoXong();
    await waitFor(() => expect(soLop()).toBe(mong));
  });

  it.each([
    ["TH", 7 + LOP_DUNG_CHUNG],
    ["THCS", 7 + LOP_DUNG_CHUNG],
  ] as const)("bộ %s (em học sinh cầm máy): %i lớp — có CẢ phần của bố mẹ", async (ma, mong) => {
    // 🔴 GĐ10 hạng mục 10.4: 4 → 8. Bốn lớp mới KHÔNG phải nội dung mới, mà là phần của
    // bố mẹ trước đây bị chặn thẳng khỏi bộ TH/THCS — ba lớp lời khuyên cộng nút dải chắn.
    // Đây là đặc tả đổi (phụ huynh của học sinh TH/THCS từ nay đọc được), không phải chỉnh
    // test cho vừa code. Con số tụt lại về 4 nghĩa là cả nhóm người dùng đó lại bị cắt.
    hien(ma);
    await choDocKhoXong();
    await waitFor(() => expect(soLop()).toBe(mong));
  });

  it.each([["PH", 3 + LOP_DUNG_CHUNG]] as const)(
    "bộ %s (người lớn tự đọc về mình): %i lớp",
    async (ma, mong) => {
      hien(ma);
      await choDocKhoXong();
      await waitFor(() => expect(soLop()).toBe(mong));
    },
  );

  it("🔴 mọi lớp ĐÓNG SẴN — màn hình phải ngắn như trước", async () => {
    hien("QS");
    await choDocKhoXong();
    await waitFor(() => expect(soLop()).toBeGreaterThan(0));
    expect(screen.queryAllByRole("button", { expanded: true })).toHaveLength(0);
  });

  it("có bài bộ Phụ huynh trên máy ⇒ thêm BA lớp về chỗ vênh phong cách", async () => {
    // 🔴 GĐ10 chặng 2: 6 → 8. Một chỗ vênh nay kể thành ba khối cho ba người đọc —
    // "so phong cách" (bố mẹ đọc về con) · "Nhìn về phía bố mẹ" (Gói B, bố mẹ đọc về
    // chính mình) · "Thoả thuận hai chiều" (dải chung, cả hai cùng đọc).
    // Con số tụt về 6 nghĩa là hai khối mới của chặng 2 đã rơi mất.
    await luuBai(baiPH());
    hien("QS");
    await waitFor(() => expect(soLop()).toBe(7 + LOP_DUNG_CHUNG));
  });
});

describe("ô 'điều đang băn khoăn' chỉ dành cho người lớn đọc về trẻ", () => {
  it.each(["MN", "QS"] as const)("bộ %s: có ô băn khoăn", async (ma) => {
    hien(ma);
    await choDocKhoXong();
    expect(screen.getByRole("button", { name: "Hay cáu, hay ăn vạ" })).toBeInTheDocument();
  });

  it.each(["TH", "THCS", "PH"] as const)("bộ %s: KHÔNG có ô băn khoăn", async (ma) => {
    hien(ma);
    await choDocKhoXong();
    expect(screen.queryByRole("button", { name: "Hay cáu, hay ăn vạ" })).toBeNull();
  });
});

describe("đại từ đúng theo bộ đề", () => {
  it.each([
    ["QS", /Con /u],
    ["THCS", /Bạn /u],
    ["MN", /Bé /u],
  ] as const)("bộ %s dùng đúng đại từ", async (ma, mau) => {
    hien(ma as MaBoDe);
    await choDocKhoXong();
    expect(document.body.textContent ?? "").toMatch(mau);
  });
});

describe("tiêu đề kiểu", () => {
  it("kiểu đơn nêu tên nhóm trội", async () => {
    hien("QS");
    await choDocKhoXong();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/chủ động/iu);
  });

  it("phổ đều KHÔNG ép nhãn nhóm nào", async () => {
    const deu: KetQua = {
      hopLe: true,
      diem: { D: 54.2, I: 54.2, S: 50, C: 50 } as Record<MaTruc, number>,
      xepHang: ["D", "I", "S", "C"],
      kieu: { loai: "deu" },
      canhBao: [],
    };
    hien("QS", deu);
    await choDocKhoXong();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/cân bằng/iu);
  });
});

describe("🔴 màn kết quả KHÔNG còn ô thu liên hệ (11.2)", () => {
  /**
   * Mục tiêu kinh doanh đổi ngày 27/08/2026: từ *mồi thu khách* sang *giữ chân hơn 1.000
   * gia đình đang học*. Với 1.000 nhà đang trả tiền thì xin thêm số điện thoại của chính
   * họ vừa thừa vừa làm màn kết quả nặng thêm một khối.
   *
   * Cửa kiểm này canh SỰ VẮNG MẶT. Nghe thì lạ, nhưng ô đó từng có thật và ai đó sẽ dựng
   * lại nó bằng phản xạ. Bỏ một thứ mà không cắm cọc thì nó mọc lại.
   */
  it("không còn ô nhập số điện thoại nào", async () => {
    hien("TH");
    await choDocKhoXong();
    expect(screen.queryByLabelText(/số điện thoại/iu)).toBeNull();
    expect(document.querySelector('input[type="tel"]')).toBeNull();
  });

  it("không còn nút gửi số, và không còn chữ nào mời để lại số", async () => {
    hien("TH");
    await choDocKhoXong();
    expect(screen.queryByRole("button", { name: /gửi số|để lại số/iu })).toBeNull();
    expect(document.body.textContent).not.toMatch(/để lại số|gửi số cho/iu);
  });

  it("các nút Tải ảnh / In / Làm bài khác vẫn còn nguyên", async () => {
    hien("TH");
    await choDocKhoXong();
    expect(screen.getByRole("button", { name: /tải ảnh/iu })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /làm lại|làm bài/iu })).toBeInTheDocument();
  });
});
