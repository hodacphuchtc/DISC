import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ManKetQua } from "../app/khoang/ket-qua";
import { MoiLamNot } from "../app/khoang/vung-lech";
import { TUOI_VAO_THCS } from "../config/disc-nguong";
import { LECH_PHONG_CACH } from "../config/disc-loi-khuyen";
import { CHU_KET_QUA, CHU_PHONG_CACH } from "../config/disc-tu-dien";
import { MA_TRUC } from "../modules/core/bo-de/kieu";
import { napBoDe } from "../modules/core/bo-de/nap";
import type { KetQua, MaBoDe } from "../modules/core/bo-de/kieu";
import { luuBai, xoaSach, type BaiLamLuu } from "../modules/core/luu-tru/kho-bai";
import { doiChieu, type BaiDeGhep } from "../modules/report/doi-chieu";
import { TUOI_TU_DANH_GIA_TOI_THIEU, boDeConTuLam } from "../modules/test/dinh-tuyen";

/**
 * 🔴 BỐN LỖI SAI NGƯỜI ĐỌC / SAI ĐỊNH TUYẾN, tìm được khi khảo sát cho GĐ10.
 *
 * Cả bốn đều im lặng: không lỗi nào làm test đỏ, không lỗi nào làm trang vỡ. Chúng chỉ
 * hiện ra khi ngồi đọc xem AI đang cầm máy và người đó nhìn thấy chữ gì.
 */

const KQ: KetQua = {
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

const hien = (ma: MaBoDe) =>
  render(<ManKetQua boDe={napBoDe(ma)} bietDanh="Bin" ketQua={KQ} onLamLai={() => {}} />);

const choXong = () =>
  waitFor(() => expect(screen.getAllByRole("button").length).toBeGreaterThan(0));

beforeEach(async () => {
  await xoaSach();
});
afterEach(async () => {
  cleanup();
  await xoaSach();
});

describe("🔴 LỖI 1 — mời con làm SAI BỘ ĐỀ vì gõ cứng 'THCS'", () => {
  /**
   * Màn vùng lệch gõ cứng `thieuBaiCon ? "THCS" : "QS"`. Bộ QS trải 8–15 tuổi, bắc qua CẢ
   * hai bộ con tự làm — nên một em lớp 3 bị mời làm bộ dành cho lớp 9.
   */
  it("boDeConTuLam chọn theo tuổi, bám ngưỡng trong config", () => {
    expect(boDeConTuLam(TUOI_TU_DANH_GIA_TOI_THIEU)).toBe("TH");
    expect(boDeConTuLam(TUOI_VAO_THCS - 1)).toBe("TH");
    expect(boDeConTuLam(TUOI_VAO_THCS)).toBe("THCS");
    expect(boDeConTuLam(15)).toBe("THCS");
  });

  it("dưới sàn tự đánh giá thì KHÔNG mời — không đi vòng qua ADR-002", () => {
    expect(boDeConTuLam(TUOI_TU_DANH_GIA_TOI_THIEU - 1)).toBeNull();
    expect(boDeConTuLam(5)).toBeNull();
  });

  it("không biết tuổi thì chọn lứa NHỎ hơn, không phải lứa lớn hơn", () => {
    // Bản ghi cũ (trước khi có trường `tuoi`) có thể là của bé vừa tròn 8.
    expect(boDeConTuLam(undefined)).toBe("TH");
  });

  it("doiChieu chuyền TUỔI ra ngoài để lời mời chọn đúng bộ", () => {
    const baiQS: BaiDeGhep = {
      id: "qs-1",
      boDe: "QS",
      maTre: "Tí Nị",
      ketThuc: "2026-08-24T13:40:00.000Z",
      tuoi: 9,
      ketQua: KQ,
      phienBanBoDe: "1.0",
    };
    const kq = doiChieu([baiQS], "Tí Nị");
    expect(kq.ghepDuoc).toBe(false);
    if (kq.ghepDuoc) return;
    expect(kq.lyDo.ma).toBe("THIEU_BAI_CON");
    expect(kq.lyDo.ma === "THIEU_BAI_CON" && kq.lyDo.tuoi).toBe(9);
  });

  it("🔴 con 9 tuổi được mời làm bộ TIỂU HỌC, không phải THCS", () => {
    const bam = vi.fn();
    render(<MoiLamNot lyDo={{ ma: "THIEU_BAI_CON", tuoi: 9 }} onLamBo={bam} />);
    fireEvent.click(screen.getByRole("button"));
    expect(bam).toHaveBeenCalledWith("TH");
  });

  it("con 13 tuổi vẫn được mời làm bộ THCS", () => {
    const bam = vi.fn();
    render(<MoiLamNot lyDo={{ ma: "THIEU_BAI_CON", tuoi: 13 }} onLamBo={bam} />);
    fireEvent.click(screen.getByRole("button"));
    expect(bam).toHaveBeenCalledWith("THCS");
  });
});

describe("🔴 LỖI 2 — câu rào gọi một em lớp 4 là 'con'", () => {
  /**
   * §9.2 luật 6 đòi bộ MN và TH đều mở đầu bằng câu rào, và bản cũ dùng CHUNG một câu.
   * Nhưng bộ MN là bố mẹ trả lời hộ, còn bộ TH là chính em học sinh cầm máy.
   */
  it("bộ MN (bố mẹ đọc) dùng câu rào nói với phụ huynh", async () => {
    hien("MN");
    await choXong();
    expect(screen.getByText(CHU_KET_QUA.cauRaoTre)).toBeInTheDocument();
    expect(screen.queryByText(CHU_KET_QUA.cauRaoTuMinh)).toBeNull();
  });

  it("🔴 bộ TH (em học sinh đọc) dùng câu rào nói với chính em", async () => {
    hien("TH");
    await choXong();
    expect(screen.getByText(CHU_KET_QUA.cauRaoTuMinh)).toBeInTheDocument();
    expect(screen.queryByText(CHU_KET_QUA.cauRaoTre)).toBeNull();
  });

  it("§9.2 luật 6 vẫn được giữ: CẢ HAI bộ đều có câu rào", async () => {
    for (const ma of ["MN", "TH"] as const) {
      cleanup();
      hien(ma);
      await choXong();
      const co =
        screen.queryByText(CHU_KET_QUA.cauRaoTre) ?? screen.queryByText(CHU_KET_QUA.cauRaoTuMinh);
      expect(co, `bộ ${ma} mất câu rào bắt buộc`).not.toBeNull();
    }
  });

  it("bộ THCS, PH, QS không có câu rào của bộ trẻ nhỏ", async () => {
    for (const ma of ["THCS", "PH", "QS"] as const) {
      cleanup();
      hien(ma);
      await choXong();
      expect(screen.queryByText(CHU_KET_QUA.cauRaoTre), ma).toBeNull();
      expect(screen.queryByText(CHU_KET_QUA.cauRaoTuMinh), ma).toBeNull();
    }
  });
});

describe("🔴 LỖI 3 — học sinh đọc được đoạn viết cho bố mẹ", () => {
  /**
   * Khối "Phong cách của bạn và của con" viết cho PHỤ HUYNH ("bạn" = bố mẹ, "con" = trẻ),
   * nhưng không lọc bộ đề. Máy nào có bài bộ PH thì học sinh THCS cuộn xuống là đọc được.
   *
   * 🔴 GĐ10 CHẶNG 2 ĐỔI CÁCH CHẶN, KHÔNG NỚI LUẬT. Bản vá đầu tiên chặn thẳng cả khối khỏi
   * bộ TH/THCS. An toàn cho đứa trẻ, nhưng nó cũng có nghĩa là đứa trẻ không được nói gì về
   * chính chỗ nó đang va hằng ngày — nó chỉ được người lớn nhận xét. Nay mỗi người đọc có
   * bản riêng nằm trong dải riêng, nên phép kiểm chuyển từ *"khối này có tồn tại không"*
   * sang *"CHỮ CỦA BỐ MẸ có lọt sang chỗ đứa trẻ đọc không"* — đó mới là điều luật muốn.
   */
  const daiCua = (c: HTMLElement, ten: string) => c.querySelector(`[data-ban="${ten}"]`);

  it.each(["MN", "QS"] as const)("bộ %s (bố mẹ đọc): CÓ khối so phong cách", async (ma) => {
    await luuBai(baiPH());
    hien(ma);
    // Tiêu đề mỗi lớp xuất hiện HAI lần trong DOM: bản trong nút bấm (màn hình) và bản
    // `.chi-in` (chỉ hiện khi in) — nút thì mang `data-khong-in` nên giấy sẽ mất tiêu đề
    // nếu không có bản thứ hai. Đếm ≥1 thay vì đòi duy nhất.
    await waitFor(() => {
      expect(screen.getAllByText(CHU_PHONG_CACH.tieuDe).length).toBeGreaterThan(0);
    });
  });

  it("bộ PH: KHÔNG ghép cặp với chính mình nên không có khối nào", async () => {
    await luuBai(baiPH());
    hien("PH");
    await choXong();
    expect(screen.queryAllByText(CHU_PHONG_CACH.tieuDe)).toHaveLength(0);
  });

  it.each(["TH", "THCS"] as const)(
    "🔴 bộ %s: chữ viết cho BỐ MẸ nằm trong dải bố mẹ, KHÔNG lọt sang dải của em",
    async (ma) => {
      await luuBai(baiPH());
      const { container } = hien(ma);
      // Chờ kho đọc xong THẬT — `choXong()` chỉ chờ có nút, mà M4 có nút ngay từ đầu, nên
      // nó về trước khi `usePhongCach` kịp chạy. Kiểm lúc đó là kiểm một trang chưa dựng
      // xong, và sẽ xanh vì lý do sai.
      await waitFor(() => {
        expect(daiCua(container, "boMe")?.textContent).toContain(CHU_PHONG_CACH.tieuDe);
      });

      const chuBoMe = daiCua(container, "boMe")!.textContent ?? "";
      const chuCuaEm =
        (daiCua(container, "con")?.textContent ?? "") +
        (daiCua(container, "chung")?.textContent ?? "");

      // Mọi câu viết cho bố mẹ đều phải nằm ở dải bố mẹ, và KHÔNG câu nào lọt sang chỗ em đọc.
      let daKiem = 0;
      for (const t of MA_TRUC) {
        for (const h of ["bo-me-cao-hon", "bo-me-thap-hon"] as const) {
          for (const f of ["choBoMe", "boMeTuNhin"] as const) {
            const cau = LECH_PHONG_CACH[t][h][f];
            if (!chuBoMe.includes(cau)) continue;
            daKiem += 1;
            expect(
              chuCuaEm.includes(cau),
              `${t}.${h}.${f} lọt sang chỗ em học sinh đọc`,
            ).toBe(false);
          }
        }
      }
      expect(daKiem, "không câu nào của bố mẹ được dựng — phép kiểm rỗng").toBeGreaterThan(0);
    },
  );

  it.each(["TH", "THCS"] as const)(
    "🔴 bộ %s: dải bố mẹ ĐÓNG SẴN, em không cuộn tới được",
    async (ma) => {
      await luuBai(baiPH());
      const { container } = hien(ma);
      await waitFor(() => {
        expect(daiCua(container, "boMe")?.textContent).toContain(CHU_PHONG_CACH.tieuDe);
      });
      expect(daiCua(container, "boMe")!.className).toContain("hidden");
    },
  );
});

describe("🔴 LỖI 4 — mời người vừa làm xong bộ Phụ huynh đi làm bộ Phụ huynh", () => {
  it("bộ PH: KHÔNG hiện lời mời làm bộ Phụ huynh", async () => {
    hien("PH");
    await choXong();
    expect(screen.queryByRole("button", { name: CHU_PHONG_CACH.moiNut })).toBeNull();
    expect(screen.queryAllByText(CHU_PHONG_CACH.moiTieuDe)).toHaveLength(0);
  });

  it("bộ QS chưa có bài bộ PH: VẪN mời — đây là lời mời đúng chỗ", async () => {
    render(
      <ManKetQua
        boDe={napBoDe("QS")}
        bietDanh="Bin"
        ketQua={KQ}
        onLamLai={() => {}}
        onLamBoConThieu={() => {}}
        onXemDoiChieu={() => {}}
      />,
    );
    await waitFor(() => {
      expect(screen.getAllByText(CHU_PHONG_CACH.moiTieuDe).length).toBeGreaterThan(0);
    });
  });
});
