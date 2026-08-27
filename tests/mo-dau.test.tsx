import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ManKetQua } from "../app/khoang/ket-qua";
import { CHU_BANG_TRA, CHU_M4, CHU_MO_DAU, MA_TRUC, TRUC } from "../config/disc-tu-dien";
import { napBoDe } from "../modules/core/bo-de/nap";
import type { KetQua, MaBoDe } from "../modules/core/bo-de/kieu";

/**
 * Ba khối mở đầu bản báo cáo (GĐ10): tóm tắt 30 giây · đoạn giải thích bốn con số ·
 * bảng tra bốn chữ cái. Sinh ra vì chủ dự án nói phụ huynh *"chưa hiểu phần phân tích này"*.
 */

const KQ: KetQua = {
  hopLe: true,
  diem: { D: 90, I: 55, S: 35, C: 45 },
  xepHang: ["D", "I", "C", "S"],
  kieu: { loai: "don", truc: "D" },
  canhBao: [],
};

const hien = (ma: MaBoDe = "QS") =>
  render(<ManKetQua boDe={napBoDe(ma)} bietDanh="Bin" ketQua={KQ} onLamLai={() => {}} />);
const choXong = () =>
  waitFor(() => expect(screen.getAllByRole("button").length).toBeGreaterThan(0));

afterEach(cleanup);

describe("đoạn mở đầu — giải thích bốn con số", () => {
  it("hiện ra trên màn kết quả", async () => {
    hien();
    await choXong();
    for (const d of CHU_MO_DAU.doanVan) {
      expect(screen.getByText(d), d.slice(0, 30)).toBeInTheDocument();
    }
  });

  it("🔴 không quá 200 từ — quá thì không ai đọc, và nó nằm TRƯỚC phần quan trọng", () => {
    const soTu = CHU_MO_DAU.doanVan.join(" ").split(/\s+/u).filter(Boolean).length;
    expect(soTu).toBeLessThanOrEqual(200);
  });

  it("🔴 nói rõ KHÔNG đo cái gì, không chỉ nói đo cái gì", () => {
    const chu = CHU_MO_DAU.doanVan.join(" ");
    expect(chu).toMatch(/không đo/iu);
    expect(chu, "phải nói rõ không so với trẻ khác").toMatch(/không so|không phải phần trăm/iu);
    expect(chu, "phải nói rõ đây không phải kết luận").toMatch(/không phải (một )?kết luận/iu);
  });

  it("🔴 KHÔNG tuyên bố chuẩn hoá — bộ câu hỏi chưa ai ký, chưa sàng dữ liệu Việt", () => {
    const chu = [...CHU_MO_DAU.doanVan, CHU_MO_DAU.nguonGoc, CHU_BANG_TRA.ghiChu].join(" ");
    expect(chu).not.toMatch(/chuẩn quốc tế|đã chuẩn hoá|khoa học chứng minh|độ chính xác \d/iu);
  });

  it("viết DISC in hoa, không viết DiSC (nhãn hiệu của Wiley)", () => {
    const chu = [...CHU_MO_DAU.doanVan, CHU_MO_DAU.nguonGoc, CHU_BANG_TRA.ghiChu].join(" ");
    expect(chu).not.toMatch(/DiSC/u);
  });
});

describe("bảng tra bốn chữ cái", () => {
  it("có đủ bốn từ tiếng Anh và nghĩa", async () => {
    hien();
    await choXong();
    for (const t of MA_TRUC) {
      expect(screen.getByText(TRUC[t].tenTiengAnh), t).toBeInTheDocument();
      expect(screen.getByText(TRUC[t].nghia), t).toBeInTheDocument();
    }
  });

  it("🔴 từ tiếng Anh KHÔNG lọt vào nhãn biểu đồ", async () => {
    // Đặc tả: "Trẻ dưới 12 tuổi không đọc nổi Dominance" — đó là lý do có bốn nhân vật robot.
    // Nhãn dài thêm còn làm tràn khung ảnh PNG.
    hien("MN");
    await choXong();
    const bieuDo = within(screen.getByLabelText(CHU_M4.nhanBieuDo));
    for (const t of MA_TRUC) {
      expect(bieuDo.queryByText(TRUC[t].tenTiengAnh), t).toBeNull();
    }
  });

  it("dùng bộ tên hiện hành, không dùng bộ từ gốc 1928 đã lỗi thời", () => {
    const anh = MA_TRUC.map((t) => TRUC[t].tenTiengAnh);
    expect(anh).toEqual(["Dominance", "Influence", "Steadiness", "Conscientiousness"]);
    expect(anh).not.toContain("Inducement");
    expect(anh).not.toContain("Submission");
  });
});

describe("tóm tắt 30 giây", () => {
  it("nêu kiểu, nhóm nổi nhất, nhóm nhẹ nhất và MỘT việc làm ngay", async () => {
    hien();
    await choXong();
    const tom = within(screen.getByLabelText(CHU_MO_DAU.tomTat.nhan));
    expect(tom.getByText(new RegExp(CHU_MO_DAU.tomTat.manhNhat, "u"))).toBeInTheDocument();
    expect(tom.getByText(new RegExp(CHU_MO_DAU.tomTat.nheNhat, "u"))).toBeInTheDocument();
    expect(tom.getByText(new RegExp(CHU_MO_DAU.tomTat.lamNgay, "u"))).toBeInTheDocument();
  });

  it("🔴 chỉ ra ĐÚNG trục nổi nhất và trục nhẹ nhất của hồ sơ", async () => {
    hien();
    await choXong();
    const tom = screen.getByLabelText(CHU_MO_DAU.tomTat.nhan);
    // D=90 nổi nhất, S=35 nhẹ nhất.
    expect(within(tom).getByText(new RegExp(TRUC.D.ten, "u"))).toBeInTheDocument();
    expect(within(tom).getByText(new RegExp(TRUC.S.ten, "u"))).toBeInTheDocument();
  });

  it("🔴 là CON TRỎ chứ không phải đoạn văn thứ hai — dưới 60 từ", async () => {
    hien();
    await choXong();
    const chu = screen.getByLabelText(CHU_MO_DAU.tomTat.nhan).textContent ?? "";
    expect(chu.split(/\s+/u).filter(Boolean).length).toBeLessThan(60);
  });

  it("mỗi dòng một dòng — bốn dòng tóm tắt đều ngắn", () => {
    for (const t of MA_TRUC) {
      expect(TRUC[t].motDong.split(/\s+/u).length, `trục ${t}`).toBeLessThanOrEqual(12);
    }
  });
});

describe("🔴 chữ trỏ đúng chỗ", () => {
  it("đoạn mở đầu nằm DƯỚI biểu đồ nên phải trỏ lên trên, không nói 'dưới đây'", () => {
    // Lỗi bắt được bằng mắt, không phải bằng test: bản đầu viết "Bốn con số dưới đây" trong
    // khi khối này nằm bên dưới biểu đồ — câu đó trỏ vào chỗ không có gì.
    const chu = CHU_MO_DAU.doanVan.join(" ");
    expect(chu).not.toMatch(/con số dưới đây/iu);
    expect(chu).toMatch(/con số ở trên/iu);
  });
});
