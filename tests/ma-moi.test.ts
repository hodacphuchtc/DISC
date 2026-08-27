import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { BANG_CHU_MA, HAN_MA_MOI_NGAY, VAI_GIA_DINH } from "../config/disc-gia-dinh";
import { MA_BO_DE, MA_TRUC } from "../modules/core/bo-de/kieu";
import {
  DO_DAI_MA,
  chuanHoaMa,
  goiHoSo,
  moHoSo,
  type HoSoMoi,
} from "../modules/core/gia-dinh/ma-moi";

/**
 * 🔴 Mọi biệt danh trong file này là BỊA. Người làm bài DISC gồm trẻ mầm non tới THCS;
 * họ tên và kết quả của trẻ là dữ liệu cá nhân (NĐ 13/2023), không bao giờ vào test.
 */

const NGAY_PHAT = "2026-08-27";

function hoSoMau(sua: Partial<HoSoMoi> = {}): HoSoMoi {
  return {
    boDe: "TH",
    vai: "con",
    diem: { D: 72.4, I: 55.1, S: 38.9, C: 61.7 },
    ngayPhat: NGAY_PHAT,
    ...sua,
  };
}

/** Cộng `soNgay` vào một chuỗi yyyy-mm-dd, tính theo UTC cho khỏi dính múi giờ. */
function themNgay(ngay: string, soNgay: number): string {
  const [n, t, d] = ngay.split("-").map(Number);
  const moi = new Date(Date.UTC(n, t - 1, d) + soNgay * 86_400_000);
  const hai = (x: number) => String(x).padStart(2, "0");
  return `${moi.getUTCFullYear()}-${hai(moi.getUTCMonth() + 1)}-${hai(moi.getUTCDate())}`;
}

describe("goiHoSo / moHoSo — khứ hồi", () => {
  it("gói rồi mở ra ĐÚNG bốn con số, không rơi một chữ số thập phân nào", () => {
    const hoSo = hoSoMau();
    const ket = moHoSo(goiHoSo(hoSo), NGAY_PHAT);

    expect(ket.ok).toBe(true);
    if (!ket.ok) return;
    expect(ket.hoSo.diem).toEqual(hoSo.diem);
    expect(ket.hoSo.boDe).toBe("TH");
    expect(ket.hoSo.vai).toBe("con");
    expect(ket.hoSo.ngayPhat).toBe(NGAY_PHAT);
  });

  it("🔴 giữ nguyên điểm cho MỌI bộ đề và MỌI vai — không sót tổ hợp nào", () => {
    for (const boDe of MA_BO_DE) {
      for (const vai of VAI_GIA_DINH) {
        const hoSo = hoSoMau({ boDe, vai });
        const ket = moHoSo(goiHoSo(hoSo), NGAY_PHAT);
        expect(ket.ok, `${boDe}/${vai}`).toBe(true);
        if (!ket.ok) continue;
        expect(ket.hoSo.boDe).toBe(boDe);
        expect(ket.hoSo.vai).toBe(vai);
      }
    }
  });

  it("giữ nguyên điểm ở hai đầu thang và ở mọi nấc 0,1", () => {
    for (const bien of [0, 0.1, 50, 99.9, 100]) {
      const hoSo = hoSoMau({ diem: { D: bien, I: bien, S: bien, C: bien } });
      const ket = moHoSo(goiHoSo(hoSo), NGAY_PHAT);
      expect(ket.ok, `điểm ${bien}`).toBe(true);
      if (ket.ok) for (const truc of MA_TRUC) expect(ket.hoSo.diem[truc]).toBe(bien);
    }
  });

  it("🔴 KHÔNG làm tròn điểm về số nguyên — 62,4 và 62,5 phải ra hai mã khác nhau", () => {
    // Vì sao quan trọng: `xepHangTruc()` xếp bốn trục theo điểm, và toàn bộ nội dung báo
    // cáo khoá theo THỨ HẠNG. Làm tròn hai giá trị này về 62 và 63 là đảo ngược thứ hạng.
    const a = goiHoSo(hoSoMau({ diem: { D: 62.4, I: 62.5, S: 10, C: 10 } }));
    const b = goiHoSo(hoSoMau({ diem: { D: 62.5, I: 62.4, S: 10, C: 10 } }));
    expect(a).not.toBe(b);
  });

  it("mã dài đúng 14 ký tự, hiện theo nhóm 5 cho dễ đọc qua điện thoại", () => {
    const ma = goiHoSo(hoSoMau());
    expect(ma).toMatch(/^[0-9A-Z]{5}-[0-9A-Z]{5}-[0-9A-Z]{4}$/u);
    expect(chuanHoaMa(ma)).toHaveLength(DO_DAI_MA);
    expect(DO_DAI_MA).toBe(14);
  });
});

describe("kiểm tổng", () => {
  it("🔴 bắt được SAI MỘT KÝ TỰ ở mọi vị trí, với mọi ký tự thay thế", () => {
    const chu = chuanHoaMa(goiHoSo(hoSoMau()));
    let daThu = 0;

    for (let vi = 0; vi < chu.length; vi += 1) {
      for (const thay of BANG_CHU_MA) {
        if (thay === chu[vi]) continue;
        const hong = `${chu.slice(0, vi)}${thay}${chu.slice(vi + 1)}`;
        const ket = moHoSo(hong, NGAY_PHAT);
        expect(ket.ok, `đổi vị trí ${vi} thành "${thay}" mà vẫn mở được`).toBe(false);
        daThu += 1;
      }
    }

    expect(daThu).toBe(chu.length * (BANG_CHU_MA.length - 1));
  });

  it("🔴 bắt được ĐẢO HAI KÝ TỰ LIỀN NHAU — kiểu sai hay gặp khi đọc mã cho nhau", () => {
    const chu = chuanHoaMa(goiHoSo(hoSoMau()));
    for (let i = 0; i + 1 < chu.length; i += 1) {
      if (chu[i] === chu[i + 1]) continue; // đảo hai ký tự giống nhau thì có đổi gì đâu
      const dao = `${chu.slice(0, i)}${chu[i + 1]}${chu[i]}${chu.slice(i + 2)}`;
      expect(moHoSo(dao, NGAY_PHAT).ok, `đảo vị trí ${i}`).toBe(false);
    }
  });

  it("nói rõ SAI KIỂM TỔNG chứ không gộp chung một lỗi mơ hồ", () => {
    const chu = chuanHoaMa(goiHoSo(hoSoMau()));
    const hong = `${chu.slice(0, -3)}${chu[chu.length - 3] === "0" ? "1" : "0"}${chu.slice(-2)}`;
    const ket = moHoSo(hong, NGAY_PHAT);
    expect(ket.ok).toBe(false);
    if (!ket.ok) expect(ket.lyDo).toBe("SAI_KIEM_TONG");
  });

  it("phân biệt được mã rỗng, sai độ dài và ký tự lạ", () => {
    expect(moHoSo("", NGAY_PHAT)).toEqual({ ok: false, lyDo: "RONG" });
    expect(moHoSo("ABC", NGAY_PHAT)).toEqual({ ok: false, lyDo: "SAI_DO_DAI" });
    expect(moHoSo("ABCDE-FGHJK-MN@#", NGAY_PHAT)).toEqual({ ok: false, lyDo: "KY_TU_LA" });
  });
});

describe("chuanHoaMa — tha thứ đúng chỗ", () => {
  it("nhận chữ thường, thừa khoảng trắng, thiếu hoặc thừa gạch nối", () => {
    const ma = goiHoSo(hoSoMau());
    const bien = [
      ma.toLowerCase(),
      ma.replace(/-/gu, ""),
      ` ${ma} `,
      ma.replace(/-/gu, " - "),
    ];
    for (const b of bien) expect(moHoSo(b, NGAY_PHAT).ok, b).toBe(true);
  });

  it("kéo I/L về 1 và O về 0 theo lối Crockford", () => {
    expect(chuanHoaMa("il o")).toBe("110");
  });
});

describe("hạn 7 ngày", () => {
  it("mã dùng được trong đúng 7 ngày kể từ ngày phát", () => {
    const ma = goiHoSo(hoSoMau());
    for (let ngay = 0; ngay <= HAN_MA_MOI_NGAY; ngay += 1) {
      const ket = moHoSo(ma, themNgay(NGAY_PHAT, ngay));
      expect(ket.ok, `ngày thứ ${ngay}`).toBe(true);
    }
  });

  it("🔴 sang ngày thứ 8 thì TỪ CHỐI, và nói rõ là quá hạn chứ không phải gõ sai", () => {
    const ma = goiHoSo(hoSoMau());
    const ket = moHoSo(ma, themNgay(NGAY_PHAT, HAN_MA_MOI_NGAY + 1));
    expect(ket.ok).toBe(false);
    if (!ket.ok) expect(ket.lyDo).toBe("QUA_HAN");
  });

  it("mã cũ hàng tháng cũng bị từ chối, không có cửa nào lọt", () => {
    const ma = goiHoSo(hoSoMau());
    for (const cach of [30, 90, 365]) {
      const ket = moHoSo(ma, themNgay(NGAY_PHAT, cach));
      expect(ket.ok, `cách ${cach} ngày`).toBe(false);
    }
  });

  it("cho lệch MỘT ngày về phía tương lai (hai máy hai múi giờ), quá thì thôi", () => {
    const ma = goiHoSo(hoSoMau());
    expect(moHoSo(ma, themNgay(NGAY_PHAT, -1)).ok).toBe(true);
    const xa = moHoSo(ma, themNgay(NGAY_PHAT, -5));
    expect(xa.ok).toBe(false);
    if (!xa.ok) expect(xa.lyDo).toBe("NGAY_TUONG_LAI");
  });

  it("ngày phát ngoài tầm mã thì ném lỗi ngay lúc gói, không phát ra mã rác", () => {
    expect(() => goiHoSo(hoSoMau({ ngayPhat: "2020-01-01" }))).toThrow(/ngoài tầm mã/u);
    expect(() => goiHoSo(hoSoMau({ ngayPhat: "27/08/2026" }))).toThrow(/không đọc được/u);
    expect(() => goiHoSo(hoSoMau({ ngayPhat: "2026-02-31" }))).toThrow(/không đọc được/u);
  });
});

describe("🔴 HÀNG RÀO RIÊNG TƯ — mã mời đi ra khỏi máy nên phải rỗng dữ liệu của trẻ", () => {
  const NGUON = readFileSync(join(process.cwd(), "modules/core/gia-dinh/ma-moi.ts"), "utf8");

  /**
   * Soi theo RANH GIỚI TỪ, không phải chuỗi con: `tuoiMa` là tuổi của MÃ (bao nhiêu ngày
   * rồi), hoàn toàn chính đáng, còn `hoSo.tuoi` là tuổi của TRẺ và phải bị chặn.
   * Không phân biệt được hai thứ đó thì cửa kiểm này chỉ tổ bắt người ta đặt tên né.
   */
  const coTu = (tu: string) =>
    new RegExp(`(?<![A-Za-z])${tu}(?![A-Za-z])`, "iu").test(NGUON);

  it("mã KHÔNG chứa câu trả lời nào — lõi mã mời không hề biết tới khái niệm trả lời", () => {
    // Lời hứa của ADR-001: câu trả lời của trẻ không rời máy. Mã mời không được phép
    // biến lời hứa đó thành lời nói dối, nên cửa kiểm này soi thẳng vào mã nguồn.
    for (const tu of ["traLoi", "cauHoi", "nhap", "diemTho"]) {
      expect(coTu(tu), `ma-moi.ts nhắc tới "${tu}"`).toBe(false);
    }
  });

  it("mã KHÔNG chứa biệt danh, tên, tuổi hay lớp", () => {
    for (const tu of ["bietDanh", "maTre", "hoTen", "tuoi", "lop", "banKhoan"]) {
      expect(coTu(tu), `ma-moi.ts nhắc tới "${tu}"`).toBe(false);
    }
  });

  it("🔴 sức chứa của mã QUÁ NHỎ để nhét lọt một bài làm — 60 bit, hết", () => {
    // Đây mới là bằng chứng cứng, không phải lời hứa: 14 ký tự Base32 = 70 bit, trong đó
    // 10 bit là kiểm tổng ⇒ còn 60 bit. Riêng bốn con số đã ăn 40 bit. Bộ đề ngắn nhất có
    // 20 câu, mỗi câu ít nhất 5 mức ⇒ cần thêm ≥ 46 bit nữa. Không có chỗ, và không thể
    // có chỗ chừng nào mã còn dài 14 ký tự.
    const bitConLai = DO_DAI_MA * 5 - 10 - 40;
    const bitToiThieuChoMotBai = Math.ceil(20 * Math.log2(5));
    expect(bitConLai).toBeLessThan(bitToiThieuChoMotBai);
  });

  it("hai hồ sơ khác nhau ra hai mã khác nhau; hồ sơ y hệt ra mã y hệt", () => {
    const a = goiHoSo(hoSoMau());
    expect(goiHoSo(hoSoMau())).toBe(a);
    expect(goiHoSo(hoSoMau({ vai: "me" }))).not.toBe(a);
    expect(goiHoSo(hoSoMau({ diem: { D: 72.5, I: 55.1, S: 38.9, C: 61.7 } }))).not.toBe(a);
  });
});

describe("dữ liệu vào hỏng thì ném lỗi, không gói bừa", () => {
  it("từ chối mã bộ đề và vai lạ", () => {
    expect(() => goiHoSo(hoSoMau({ boDe: "XX" as never }))).toThrow(/mã bộ đề lạ/u);
    expect(() => goiHoSo(hoSoMau({ vai: "chu-meo" as never }))).toThrow(/vai lạ/u);
  });

  it("từ chối điểm ngoài thang 0–100", () => {
    for (const xau of [-1, 100.1, NaN, Infinity]) {
      expect(() => goiHoSo(hoSoMau({ diem: { D: xau, I: 1, S: 1, C: 1 } }))).toThrow(/ngoài thang/u);
    }
  });
});
