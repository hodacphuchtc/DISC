import { describe, expect, it } from "vitest";

import { napBoDe } from "../modules/core/bo-de/nap";
import {
  NHIP_DONG_VIEN,
  chiaTrang,
  nenDongVien,
  phanTramXong,
  soCauDaTraLoi,
  trangDaXong,
  trangDangDo,
} from "../modules/test/lam-bai/tien-trinh";

const TH = napBoDe("TH"); // 20 câu, 1 câu/màn
const THCS = napBoDe("THCS"); // 24 câu, 5 câu/màn

describe("chia trang", () => {
  it("bộ trẻ nhỏ: NĂM câu một màn từ 11.3 (ADR-006 lật §5.2)", () => {
    expect(TH.cauMoiMan).toBe(5);
    expect(chiaTrang(TH)).toHaveLength(4); // 20 câu ÷ 5 = 4 trang chẵn
    expect(chiaTrang(TH)[0]).toHaveLength(5);
  });

  it("bộ tuổi lớn: năm câu một màn, trang cuối nhận phần dư", () => {
    const trang = chiaTrang(THCS);
    expect(trang).toHaveLength(5); // 24 = 5+5+5+5+4
    expect(trang.at(-1)).toHaveLength(4);
  });

  it("chia trang phủ đúng mọi câu, đúng thứ tự hiển thị", () => {
    expect(chiaTrang(THCS).flat().map((c) => c.ma)).toEqual(THCS.cau.map((c) => c.ma));
  });
});

describe("tiến trình", () => {
  it("đếm đúng số câu đã trả lời", () => {
    expect(soCauDaTraLoi(THCS, {})).toBe(0);
    expect(soCauDaTraLoi(THCS, { [THCS.cau[0].ma]: 3, [THCS.cau[9].ma]: 1 })).toBe(2);
  });

  it("bỏ qua giá trị không phải số", () => {
    const traLoi = { [THCS.cau[0].ma]: undefined } as unknown as Record<string, number>;
    expect(soCauDaTraLoi(THCS, traLoi)).toBe(0);
  });

  it("phần trăm xong: rỗng ⇒ 0, đủ ⇒ 100", () => {
    expect(phanTramXong(THCS, {})).toBe(0);
    const day = Object.fromEntries(THCS.cau.map((c) => [c.ma, 3]));
    expect(phanTramXong(THCS, day)).toBe(100);
  });

  it("quay lại đúng TRANG đang dở — làm dở 8 câu thì về trang thứ 2 (chỉ số 1)", () => {
    const traLoi: Record<string, number> = {};
    THCS.cau.slice(0, 8).forEach((c) => (traLoi[c.ma] = 3));
    expect(trangDangDo(THCS, traLoi)).toBe(1); // trang 0 xong, trang 1 còn câu 9,10
  });

  it("làm dở 8 câu ở bộ 5 câu/màn thì về ĐÚNG trang chứa câu thứ 9 (trang 1)", () => {
    const traLoi: Record<string, number> = {};
    TH.cau.slice(0, 8).forEach((c) => (traLoi[c.ma] = 2));
    // Câu thứ 9 là chỉ số 8 ⇒ nằm ở trang 1 (trang 0 giữ câu 1–5, trang 1 giữ câu 6–10).
    expect(trangDangDo(TH, traLoi)).toBe(1);
  });

  it("xong hết thì dừng ở trang cuối, không vượt ra ngoài", () => {
    const day = Object.fromEntries(THCS.cau.map((c) => [c.ma, 3]));
    expect(trangDangDo(THCS, day)).toBe(chiaTrang(THCS).length - 1);
  });

  it("trang đã xong hay chưa", () => {
    const trang = chiaTrang(THCS)[0];
    expect(trangDaXong(trang, {})).toBe(false);
    const day = Object.fromEntries(trang.map((c) => [c.ma, 4]));
    expect(trangDaXong(trang, day)).toBe(true);
  });
});

describe("động viên", () => {
  it("hiện đúng ở mốc 5, 10, 15", () => {
    expect(NHIP_DONG_VIEN).toBe(5);
    for (const n of [5, 10, 15]) expect(nenDongVien(n, 20)).toBe(true);
  });

  it("KHÔNG hiện ở câu chưa tới mốc", () => {
    for (const n of [1, 4, 6, 9]) expect(nenDongVien(n, 20)).toBe(false);
  });

  it("KHÔNG hiện ở câu cuối — lúc đó đã có kết quả rồi", () => {
    expect(nenDongVien(20, 20)).toBe(false);
  });

  it("KHÔNG hiện khi chưa làm câu nào", () => {
    expect(nenDongVien(0, 20)).toBe(false);
  });
});
