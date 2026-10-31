/**
 * `28.5` — đồng hành cùng con khi hai góc nhìn lệch: nội dung, thành phần, và nạp lười.
 * Tên bịa.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import DongHanhVoiCon from "../app/components/dong-hanh-voi-con";
import { ManVungLech } from "../app/khoang/vung-lech";
import {
  BAC_DONG_HANH,
  CHU_DONG_HANH,
  DONG_HANH_CHUNG,
  DONG_HANH_THEO_BAC,
  DONG_HANH_TRUNG_KHOP,
  HUONG_DONG_HANH,
} from "../config/disc-dong-hanh";
import { MA_TRUC, type KetQua, type MaTruc } from "../modules/core/bo-de/kieu";
import { doiChieu, type BaiDeGhep } from "../modules/report/doi-chieu";

afterEach(cleanup);

/* ── Nội dung ─────────────────────────────────────────────────────────────── */

const MOI_CHUOI: { nhan: string; chu: string }[] = [];
for (const t of MA_TRUC) {
  for (const h of HUONG_DONG_HANH) {
    for (const [k, v] of Object.entries(DONG_HANH_CHUNG[t][h])) MOI_CHUOI.push({ nhan: `chung.${t}.${h}.${k}`, chu: v });
    for (const b of BAC_DONG_HANH) {
      for (const [k, v] of Object.entries(DONG_HANH_THEO_BAC[t][h][b])) {
        MOI_CHUOI.push({ nhan: `bac.${t}.${h}.${b}.${k}`, chu: v });
      }
    }
  }
  MOI_CHUOI.push({ nhan: `trungKhop.${t}.giu`, chu: DONG_HANH_TRUNG_KHOP[t].giu });
  MOI_CHUOI.push({ nhan: `trungKhop.${t}.nuoiTiep`, chu: DONG_HANH_TRUNG_KHOP[t].nuoiTiep });
}

describe("config/disc-dong-hanh — đủ ô, đủ chữ", () => {
  it("đúng 8 ô chung + 16 ô theo bậc + 4 ô trùng khớp = 128 chuỗi", () => {
    expect(MOI_CHUOI).toHaveLength(8 * 3 + 16 * 6 + 4 * 2);
  });

  it("chuỗi nào cũng có chữ thật, không rỗng", () => {
    for (const { nhan, chu } of MOI_CHUOI) expect(chu.trim().length, nhan).toBeGreaterThan(20);
  });

  it("chỗ giữ duy nhất là {ten}", () => {
    for (const { nhan, chu } of MOI_CHUOI) {
      const dư = chu.replace(/\{ten\}/gu, "").match(/[{}]/u);
      expect(dư, nhan).toBeNull();
    }
  });

  it("câu 'nên nói' và 'nên tránh' là LỜI NÓI: nằm trong dấu ngoặc kép cong", () => {
    for (const t of MA_TRUC)
      for (const h of HUONG_DONG_HANH)
        for (const b of BAC_DONG_HANH) {
          const o = DONG_HANH_THEO_BAC[t][h][b];
          for (const c of [o.nenNoi, o.nenTranh, o.cauHoi]) {
            expect(c.startsWith("“") && c.endsWith("”"), `${t}/${h}/${b}: ${c}`).toBe(true);
          }
        }
  });

  it("mỗi ô nói đủ ba thời điểm trong ngày và khác nhau giữa hai bậc học", () => {
    for (const t of MA_TRUC)
      for (const h of HUONG_DONG_HANH) {
        const th = DONG_HANH_THEO_BAC[t][h].TH;
        const thcs = DONG_HANH_THEO_BAC[t][h].THCS;
        expect(th.sang).not.toBe(thcs.sang);
        expect(th.nenNoi, `${t}/${h}`).not.toBe(thcs.nenNoi);
      }
  });
});

describe("🔴 luật ngôn ngữ (§9.2, ADR-002) cho toàn bộ chuỗi", () => {
  const tatCa = MOI_CHUOI.map((x) => x.chu).join("\n");
  it("không so hơn kém", () => {
    expect(tatCa).not.toMatch(/tốt hơn|giỏi hơn|đúng hơn|hợp lý hơn|khá hơn|thông minh hơn/iu);
  });
  it("không từ khuyết thiếu hay chẩn đoán", () => {
    expect(tatCa).not.toMatch(/khiếm khuyết|điểm yếu|cần bổ sung|khắc phục|rối loạn|bệnh|chứng/iu);
  });
  it("không tiên đoán nghề, không gắn học lực", () => {
    expect(tatCa).not.toMatch(/hợp làm|nghề|học giỏi|học lực|điểm số ở lớp/iu);
  });
  it("không so với trẻ khác", () => {
    expect(tatCa).not.toMatch(/hơn (các )?bạn|bằng bạn|như các bạn|con nhà người ta/iu);
  });
  it("không nói bản chất ('con LÀ người…')", () => {
    // Hẹp có chủ ý: "ở lớp con là người nghĩ ra cách" mô tả một TÌNH HUỐNG, không phải bản chất.
    expect(tatCa).not.toMatch(/bản chất|vốn là|sinh ra đã|con là (một )?đứa/iu);
  });
  it("🔴 việc là của BỐ MẸ: không giao con 'sửa mình'", () => {
    const viec = MOI_CHUOI.filter((x) => /\.(sang|sauGioHoc|truocKhiNgu)$/u.test(x.nhan)).map((x) => x.chu).join("\n");
    expect(viec).not.toMatch(/con (phải|cần) (sửa|thay đổi|cố gắng hơn|bớt)/iu);
  });
  it("dấu hiệu / mô tả hai phía không đổ lỗi cho ai", () => {
    expect(tatCa).not.toMatch(/lỗi của|tại con|tại bố mẹ|con hư|con hỗn/iu);
  });
});

/* ── Thành phần ───────────────────────────────────────────────────────────── */

describe("DongHanhVoiCon", () => {
  it("mỗi trục lệch là MỘT hàng gập, tóm tắt thấy ngay, bấm mới xổ", () => {
    render(
      <DongHanhVoiCon
        ten="Bi"
        bac="TH"
        trucLech={[
          { truc: "D", huong: "con-cao-hon" },
          { truc: "I", huong: "con-thap-hon" },
        ]}
      />,
    );
    const hang = document.querySelectorAll('[data-thu="dong-hanh-truc"]');
    expect(hang).toHaveLength(2);
    const nut = hang[0].querySelector("h3 button")!;
    expect(nut.getAttribute("aria-expanded")).toBe("false");
    expect(hang[0].textContent).toContain(CHU_DONG_HANH.tomTatTruc);
    fireEvent.click(nut);
    expect(nut.getAttribute("aria-expanded")).toBe("true");
  });

  it("🔴 điền tên con vào mọi chỗ, không sót {ten}", () => {
    render(
      <DongHanhVoiCon ten="Bi" bac="THCS" trucLech={[{ truc: "S", huong: "con-cao-hon" }]} />,
    );
    expect(document.body.textContent).toContain("Bi");
    expect(document.body.textContent).not.toMatch(/[{}]/u);
  });

  it("nội dung nằm sẵn trong DOM khi gập (để bản in có đủ)", () => {
    render(<DongHanhVoiCon ten="Bi" bac="TH" trucLech={[{ truc: "C", huong: "con-thap-hon" }]} />);
    const o = DONG_HANH_THEO_BAC.C["con-thap-hon"].TH;
    expect(document.body.textContent).toContain(o.nenNoi);
    expect(document.body.textContent).toContain(o.nenTranh);
  });

  it("khác bậc ⇒ khác lời: THCS không nhận câu viết cho học sinh tiểu học", () => {
    render(<DongHanhVoiCon ten="Bi" bac="THCS" trucLech={[{ truc: "D", huong: "con-cao-hon" }]} />);
    expect(document.body.textContent).toContain(DONG_HANH_THEO_BAC.D["con-cao-hon"].THCS.nenNoi);
    expect(document.body.textContent).not.toContain(DONG_HANH_THEO_BAC.D["con-cao-hon"].TH.nenNoi);
  });

  it("kế hoạch tuần gom hai trục lệch thành bốn việc, nói rõ là việc của BỐ MẸ", () => {
    render(
      <DongHanhVoiCon
        ten="Bi"
        bac="TH"
        trucLech={[
          { truc: "D", huong: "con-cao-hon" },
          { truc: "S", huong: "con-thap-hon" },
        ]}
      />,
    );
    const kh = document.querySelector('[data-thu="ke-hoach-tuan"]')!;
    expect(kh.querySelectorAll("ol li")).toHaveLength(4);
    expect(kh.textContent).toContain("BỐ MẸ");
    expect(kh.textContent).toContain(DONG_HANH_THEO_BAC.D["con-cao-hon"].TH.sang);
    expect(kh.textContent).toContain(DONG_HANH_THEO_BAC.S["con-thap-hon"].TH.sauGioHoc);
  });

  it("chỉ MỘT trục lệch ⇒ kế hoạch vẫn đủ bốn việc (lấy trục đó cho cả hai chỗ)", () => {
    render(<DongHanhVoiCon ten="Bi" bac="TH" trucLech={[{ truc: "I", huong: "con-cao-hon" }]} />);
    expect(document.querySelectorAll('[data-thu="ke-hoach-tuan"] ol li')).toHaveLength(4);
  });

  it("hai góc nhìn khớp cả bốn ⇒ khối 'giữ và nuôi tiếp' cho đủ bốn trục, KHÔNG có kế hoạch sửa", () => {
    render(<DongHanhVoiCon ten="Bi" bac="TH" trucLech={[]} />);
    expect(document.querySelectorAll('[data-thu="dong-hanh-trung-khop"] li')).toHaveLength(4);
    expect(document.querySelector('[data-thu="ke-hoach-tuan"]')).toBeNull();
    expect(document.querySelector('[data-thu="dong-hanh-truc"]')).toBeNull();
  });

  it("nhắc test lại sau khoảng 6 tháng", () => {
    render(<DongHanhVoiCon ten="Bi" bac="TH" trucLech={[]} />);
    expect(document.body.textContent).toContain(CHU_DONG_HANH.nhacTestLai);
    expect(document.body.textContent).toMatch(/6 tháng/u);
  });
});

/* ── Tích hợp: màn Vùng lệch nạp lười khối này ────────────────────────────── */

const hopLe = (diem: Record<MaTruc, number>): KetQua =>
  ({ hopLe: true, diem, xepHang: [...MA_TRUC], kieu: { loai: "deu" }, canhBao: [] }) as KetQua;
const bai = (boDe: "TH" | "THCS" | "QS", diem: Record<MaTruc, number>): BaiDeGhep => ({
  id: boDe,
  boDe,
  maTre: "Bi",
  ketThuc: "2026-08-27T06:00:00+07:00",
  ketQua: hopLe(diem),
  phienBanBoDe: "1.0",
});
const ve = (con: "TH" | "THCS", dCon: Record<MaTruc, number>, dBoMe: Record<MaTruc, number>) =>
  render(
    <ManVungLech
      ketQua={doiChieu([bai(con, dCon), bai("QS", dBoMe)], "Bi")}
      maTre="Bi"
      onDong={vi.fn()}
      onLamBo={vi.fn()}
    />,
  );

describe("ManVungLech + đồng hành (React.lazy)", () => {
  it("lệch rõ ⇒ khối đồng hành hiện ra (sau khi nạp), đúng hai trục lệch lớn nhất", async () => {
    ve("TH", { D: 80, I: 30, S: 40, C: 55 }, { D: 35, I: 70, S: 45, C: 52 });
    expect(await screen.findByText(CHU_DONG_HANH.tieuDeKhoi.replace("{ten}", "Bi"))).toBeTruthy();
    const trucs = [...document.querySelectorAll('[data-thu="dong-hanh-truc"]')].map((e) => e.getAttribute("data-truc"));
    expect(trucs.sort()).toEqual(["D", "I"]);
  });

  it("bậc lấy từ bài của con: bài THCS ⇒ lời lẽ THCS", async () => {
    ve("THCS", { D: 80, I: 30, S: 40, C: 55 }, { D: 35, I: 70, S: 45, C: 52 });
    await screen.findByText(CHU_DONG_HANH.tieuDeKhoi.replace("{ten}", "Bi"));
    // D: con tự thấy cao hơn ⇒ "con-cao-hon", bậc THCS
    expect(document.body.textContent).toContain(DONG_HANH_THEO_BAC.D["con-cao-hon"].THCS.nenNoi);
  });

  it("câu kết bắt buộc 'lệch không có nghĩa là ai sai' vẫn còn nguyên", async () => {
    ve("TH", { D: 80, I: 30, S: 40, C: 55 }, { D: 35, I: 70, S: 45, C: 52 });
    await screen.findByText(CHU_DONG_HANH.tieuDeKhoi.replace("{ten}", "Bi"));
    expect(document.body.textContent).toContain("Lệch nhau không có nghĩa là ai đó sai");
  });

  it("chưa đủ cặp ⇒ KHÔNG hiện khối đồng hành (màn mời làm nốt như cũ)", () => {
    render(
      <ManVungLech
        ketQua={doiChieu([bai("TH", { D: 80, I: 30, S: 40, C: 55 })], "Bi")}
        maTre="Bi"
        onDong={vi.fn()}
        onLamBo={vi.fn()}
      />,
    );
    expect(document.querySelector('[data-thu="dong-hanh"]')).toBeNull();
  });
});
