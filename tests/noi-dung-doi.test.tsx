/**
 * `27.5` — nội dung theo mối quan hệ (vợ ↔ chồng, anh/chị ↔ em) + cách suy ra mối quan hệ.
 *
 * Bản nháp thuộc Gói B, nên test canh các luật mà người ký sẽ hỏi: lật khung, không so hơn
 * kém, không khuyết thiếu, không giới tính, không đoán nguyên nhân, đủ ô và đủ bảy ngày.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { KeHoachBayNgay, TinhHuongHangNgay } from "../app/components/noi-dung-doi";
import { HUONG_LECH_CAP, MOI_QUAN_HE_CAP, thayDaiTuCap } from "../config/disc-lech-cap";
import {
  KE_HOACH_BAY_NGAY,
  MOI_QUAN_HE,
  TINH_HUONG_DOI,
} from "../config/disc-noi-dung-doi";
import { CHU_NOI_DUNG_DOI } from "../config/disc-tu-dien";
import { MA_TRUC } from "../modules/core/bo-de/kieu";
import {
  laBanPhanTichHopLe,
  moiQuanHeCua,
  phanTichGiaDinh,
} from "../modules/report/phan-tich-gia-dinh";

afterEach(cleanup);

const O = MA_TRUC.flatMap((t) =>
  HUONG_LECH_CAP.flatMap((h) =>
    MOI_QUAN_HE.map((q) => ({ nhan: `${t}/${h}/${q}`, o: TINH_HUONG_DOI[t][h][q] })),
  ),
);
const MOI_CHU = [
  ...O.flatMap((x) => [x.o.tinhHuong, x.o.nenNoi]),
  ...MOI_QUAN_HE.flatMap((q) => KE_HOACH_BAY_NGAY[q]),
];

describe("TINH_HUONG_DOI — đủ ô, đủ chữ", () => {
  it("có đúng 24 ô (4 trục × 2 hướng × 3 mối quan hệ), ô nào cũng đủ ba phần", () => {
    expect(O).toHaveLength(24);
    for (const { nhan, o } of O) {
      expect(o.tinhHuong.length, nhan).toBeGreaterThan(120);
      expect(o.nenNoi.length, nhan).toBeGreaterThan(30);
      expect(o.nenTranh.length, nhan).toBeGreaterThan(10);
    }
  });

  it("tình huống nhắc tới CẢ HAI phía (bên nào cũng có lý do)", () => {
    for (const { nhan, o } of O) {
      expect(o.tinhHuong, nhan).toMatch(/\{toi\}|\{Toi\}/u);
      expect(o.tinhHuong, nhan).toMatch(/\{nguoiKia\}|\{NguoiKia\}/u);
    }
  });

  it("câu nên nói xưng 'mình' — không anh/chị/em/vợ/chồng (sản phẩm không thu giới tính)", () => {
    for (const { nhan, o } of O) {
      expect(o.nenNoi, nhan).toMatch(/mình/iu);
    }
    const gioiTinh = /(^|[\s“"(])(anh|chị|em|vợ|chồng)([\s,.?!”")]|$)/iu;
    for (const c of MOI_CHU) expect(c).not.toMatch(gioiTinh);
  });
});

describe("🔴 luật ngôn ngữ giữ nguyên từ nội dung cặp", () => {
  const tatCa = MOI_CHU.join("\n");
  it("không so hơn kém", () => {
    expect(tatCa).not.toMatch(/tốt hơn|giỏi hơn|đúng hơn|hợp lý hơn|khá hơn|thông minh hơn/iu);
  });
  it("không từ khuyết thiếu hay chẩn đoán", () => {
    expect(tatCa).not.toMatch(/khiếm khuyết|điểm yếu|cần bổ sung|khắc phục|rối loạn|bệnh|chứng/iu);
  });
  it("không tiên đoán nghề, không gắn học lực", () => {
    expect(tatCa).not.toMatch(/hợp làm|nghề|học giỏi|học lực|điểm số ở lớp/iu);
  });
  it("không đoán nguyên nhân bên trong (chỉ mô tả vòng phản ứng nhìn thấy được)", () => {
    expect(tatCa).not.toMatch(/vì (tính cách|bản chất)|do (tính cách|bản chất)|bẩm sinh/iu);
  });
});

describe("KE_HOACH_BAY_NGAY", () => {
  it("mỗi mối quan hệ đủ bảy ngày, đánh số 1→7, ngày 7 là ngồi lại", () => {
    for (const q of MOI_QUAN_HE) {
      const ngay = KE_HOACH_BAY_NGAY[q];
      expect(ngay, q).toHaveLength(7);
      ngay.forEach((c, i) => expect(c, `${q} ngày ${i + 1}`).toMatch(new RegExp(`^Ngày ${i + 1} —`, "u")));
      expect(ngay[6], q).toMatch(/Ngồi lại/u);
    }
  });
});

describe("moiQuanHeCua — luôn trả một giá trị (29.0)", () => {
  const L = (vaiTro: string) => ({ laTre: false, vaiTro }) as never;
  const T = (vaiTro: string) => ({ laTre: true, vaiTro }) as never;
  it("hai trẻ ⇒ anh-chi-em", () => {
    expect(moiQuanHeCua(T("con"), T("con"))).toBe("anh-chi-em");
  });
  it("mẹ + bố ⇒ vo-chong (thứ tự nào cũng được)", () => {
    expect(moiQuanHeCua(L("me"), L("bo"))).toBe("vo-chong");
    expect(moiQuanHeCua(L("bo"), L("me"))).toBe("vo-chong");
  });
  it("🔴 ông + bà ⇒ vo-chong; còn mẹ + BÀ KHÔNG phải vợ chồng (ba là Bà, không phải bố)", () => {
    expect(moiQuanHeCua(L("ong"), L("ba"))).toBe("vo-chong");
    expect(moiQuanHeCua(L("me"), L("ba"))).toBe("nguoi-lon-khac");
    expect(moiQuanHeCua(L("bo"), L("ba"))).toBe("nguoi-lon-khac");
  });
  it("🔴 hai người LỚN cùng khai anh/chị/em ⇒ nguoi-lon-khac (nội dung anh-chi-em viết cho trẻ: chơi, đồ chơi)", () => {
    expect(moiQuanHeCua(L("anh-chi-em"), L("anh-chi-em"))).toBe("nguoi-lon-khac");
  });
  it("người lớn khác (ông với mẹ, người thân, khác, hai mẹ) ⇒ nguoi-lon-khac", () => {
    expect(moiQuanHeCua(L("ong"), L("me"))).toBe("nguoi-lon-khac");
    expect(moiQuanHeCua(L("me"), L("me"))).toBe("nguoi-lon-khac");
    expect(moiQuanHeCua(L("khac"), L("bo"))).toBe("nguoi-lon-khac");
    expect(moiQuanHeCua(L("nguoi-than"), L("me"))).toBe("nguoi-lon-khac");
  });
  it("người lớn ↔ trẻ ⇒ đúng hướng, kể cả ông bà ↔ cháu", () => {
    expect(moiQuanHeCua(L("me"), T("con"))).toBe("nguoi-lon-voi-tre");
    expect(moiQuanHeCua(T("con"), L("me"))).toBe("tre-voi-nguoi-lon");
    expect(moiQuanHeCua(L("ong"), T("con"))).toBe("nguoi-lon-voi-tre");
    expect(moiQuanHeCua(T("con"), L("ba"))).toBe("tre-voi-nguoi-lon");
  });
  it("🔴 MA TRẬN: mọi vai × mọi vai × (trẻ|lớn) đều ra một mối quan hệ hợp lệ, không bao giờ rỗng", () => {
    const vai = ["con", "me", "bo", "ba", "ong", "anh-chi-em", "nguoi-than", "khac"];
    for (const x of vai)
      for (const y of vai)
        for (const tx of [true, false])
          for (const ty of [true, false]) {
            const kq = moiQuanHeCua({ laTre: tx, vaiTro: x } as never, { laTre: ty, vaiTro: y } as never);
            expect(MOI_QUAN_HE_CAP).toContain(kq);
          }
  });
});

describe("phanTichGiaDinh gắn moiQuanHe vào lát cắt ngang vai", () => {
  const diem = (d: number) => ({ D: d, I: 50, S: 50, C: 50 });
  it("mẹ ↔ bố là vo-chong; mẹ ↔ con là nguoi-lon-voi-tre kèm bậc của BÉ", () => {
    const k = phanTichGiaDinh([
      { id: "a", ten: "Mẹ Mai", laTre: false, vaiTro: "me", diem: diem(80) },
      { id: "b", ten: "Bố Bình", laTre: false, vaiTro: "bo", diem: diem(30) },
      { id: "c", ten: "Bé Cúc", laTre: true, vaiTro: "con", lop: "4", diem: diem(50) },
    ]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    const banMe = k.ban.find((b) => b.toiId === "a")!;
    expect(banMe.latCat.find((l) => l.nguoiKiaId === "b")?.moiQuanHe).toBe("vo-chong");
    const veCon = banMe.latCat.find((l) => l.nguoiKiaId === "c")!;
    expect(veCon).toMatchObject({
      moiQuanHe: "nguoi-lon-voi-tre",
      bacTre: "tieu-hoc",
      vaiToi: "me",
      vaiNguoiKia: "con",
    });
    // Chiều ngược lại: bé đọc về mẹ — bậc là của CHÍNH bé (người đọc).
    const banBe = k.ban.find((b) => b.toiId === "c")!;
    expect(banBe.latCat.find((l) => l.nguoiKiaId === "a")).toMatchObject({
      moiQuanHe: "tre-voi-nguoi-lon",
      bacTre: "tieu-hoc",
      vaiToi: "con",
      vaiNguoiKia: "me",
    });
  });

  it("🔴 bé CHƯA có lớp ⇒ không có bacTre (không đoán), nhưng vẫn có moiQuanHe", () => {
    const k = phanTichGiaDinh([
      { id: "a", ten: "Mẹ Mai", laTre: false, vaiTro: "me", diem: diem(80) },
      { id: "c", ten: "Bé Cúc", laTre: true, vaiTro: "con", diem: diem(30) },
    ]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    const l = k.ban[0].latCat[0];
    expect(l.moiQuanHe).toBe("nguoi-lon-voi-tre");
    expect(l.bacTre).toBeUndefined();
  });

  it("ông bà với cháu cũng ra bậc và vai đúng (xưng hô cháu sẽ lấy từ vai)", () => {
    const k = phanTichGiaDinh([
      { id: "o", ten: "Ông Sáu", laTre: false, vaiTro: "ong", diem: diem(80) },
      { id: "c", ten: "Bé Na", laTre: true, vaiTro: "con", lop: "mam-non", diem: diem(30) },
    ]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    expect(k.ban[0].latCat[0]).toMatchObject({
      moiQuanHe: "nguoi-lon-voi-tre",
      bacTre: "nho",
      vaiToi: "ong",
      vaiNguoiKia: "con",
    });
  });

  it("thiếu vaiTro ⇒ lát cắt vẫn chạy và vẫn có moiQuanHe (người lớn khác), không có vai", () => {
    const k = phanTichGiaDinh([
      { id: "a", ten: "An", laTre: false, diem: diem(80) },
      { id: "b", ten: "Bình", laTre: false, diem: diem(30) },
    ]);
    if (!k.phanTichDuoc) throw new Error("phải phân tích được");
    const l = k.ban[0].latCat[0];
    expect(l.moiQuanHe).toBe("nguoi-lon-khac");
    expect(l.vaiToi).toBeUndefined();
  });

  it("🔴 bản lưu CŨ (không có moiQuanHe/bacTre/vai) vẫn được nhận là hợp lệ để mở lại", () => {
    const cu = [
      {
        toiId: "a",
        tenLuc: "Mai",
        latCat: [
          { toiId: "a", nguoiKiaId: "b", tenNguoiKia: "Bình", theQuyen: "ngang-vai", trucLech: [] },
        ],
      },
    ];
    expect(laBanPhanTichHopLe(cu)).toBe(true);
  });
});

describe("hai component", () => {
  it("TinhHuongHangNgay thay tên, không sót chỗ giữ, có đủ nên nói / nên tránh", () => {
    render(<TinhHuongHangNgay
        truc="D"
        huong="toi-cao-hon"
        moiQuanHe="vo-chong"
        tenToi="Mai"
        tenNguoiKia="Bình"
      />);
    const khoi = document.querySelector('[data-thu="tinh-huong-doi"]')!;
    expect(khoi.textContent).toContain("Bình");
    expect(khoi.textContent).not.toMatch(/[{}]/u);
    expect(khoi.textContent).toContain(CHU_NOI_DUNG_DOI.nhanNenNoi);
    expect(khoi.textContent).toContain(CHU_NOI_DUNG_DOI.nhanNenTranh);
  });

  it("KeHoachBayNgay có đủ bảy ngày trong DOM (cả khi khối gập, để bản in mở được)", () => {
    render(<KeHoachBayNgay moiQuanHe="anh-chi-em" tenToi="Mai" tenNguoiKia="Cúc" />);
    // 🔴 Tiêu đề nêu đích danh AI được khuyên và làm cùng ai (chủ dự án: "đang khuyên ai?").
    const tieuDe = CHU_NOI_DUNG_DOI.tieuDeKeHoach.replace("{tenToi}", "Mai").replace("{nguoiKia}", "Cúc");
    expect(screen.getAllByText(tieuDe).length).toBeGreaterThan(0);
    expect(document.body.textContent).toContain("“bạn” là Mai");
    const dong = document.querySelectorAll('[data-thu="ke-hoach-bay-ngay"] li');
    expect(dong).toHaveLength(7);
    for (const li of dong) expect(li.textContent).not.toMatch(/[{}]/u);
  });

  it("🔴 bé đọc kế hoạch có DÒNG AN TOÀN; người lớn đọc thì KHÔNG", () => {
    render(<KeHoachBayNgay moiQuanHe="tre-voi-nguoi-lon" bacTre="tieu-hoc" vaiNguoiKia="me" tenToi="Bé Na" tenNguoiKia="Mẹ Lan" />);
    expect(document.querySelector('[data-thu="dong-an-toan-tre"]')?.textContent).toContain("đau hoặc sợ");
    cleanup();
    render(<KeHoachBayNgay moiQuanHe="nguoi-lon-voi-tre" bacTre="tieu-hoc" tenToi="Mẹ Lan" tenNguoiKia="Bé Na" />);
    expect(document.querySelector('[data-thu="dong-an-toan-tre"]')).toBeNull();
  });

  it("thayDaiTuCap ngang-vai xưng 'bạn' và gọi người kia bằng tên", () => {
    expect(thayDaiTuCap("{Toi} nói với {nguoiKia}", "ngang-vai", "Bình")).toBe("Bạn nói với Bình");
  });
});
