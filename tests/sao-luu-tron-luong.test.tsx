/**
 * CỬA KIỂM ĐI TRỌN LUỒNG CỦA `17.4` — bấm *Sao lưu* thật, rồi soi cây bên trong tệp `.zip`.
 *
 * 🔴 VÌ SAO CẦN CỬA NÀY KHI ĐÃ CÓ `cay-sao-luu.test.ts`. File kia kiểm các hàm THUẦN: đặt
 * tên, lọc ký tự, gói `.zip`. Nhưng thứ người dùng nhận được là kết quả của một chuỗi dài
 * hơn thế — đọc ba bảng từ kho, lọc theo cờ nội dung trẻ, sinh PDF cho từng bài, ghép
 * đường dẫn, rồi mới gói. Mỗi khâu đúng mà nối sai thì tệp `.zip` vẫn ra sai, và không cửa
 * đơn vị nào thấy. Đây là cửa duy nhất đứng ở chỗ người dùng đứng.
 *
 * 🔴 Mọi tên là BỊA.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import JSZip from "jszip";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KhoangNhaMinh } from "../app/khoang/nha-minh";
import { CHU_M6 } from "../config/disc-tu-dien";
import { THU_MUC_MAY_DOC, THU_MUC_TONG_HOP } from "../modules/core/luu-tru/cay-sao-luu";
import { DUONG_FONT, quenFontDaTai } from "../modules/report/xuat-pdf";
import {
  luuBai,
  luuPhanTich,
  luuThanhVien,
  xoaSachTatCa,
  type BaiLamLuu,
} from "../modules/core/luu-tru/kho-bai";
import type { PhanTichGiaDinh, ThanhVien } from "../modules/core/gia-dinh/kieu";
import { phanTichGiaDinh } from "../modules/report/phan-tich-gia-dinh";

const LUC = "2026-08-28T09:00:00+07:00";

/** Tệp .zip mà nút *Sao lưu* vừa đẩy xuống — chặn lại thay vì để trình duyệt tải. */
let daTai: { ten: string; duLieu: Uint8Array } | null = null;

vi.mock("../modules/core/luu-tru/tai-ve", async (goc) => {
  const that = await goc<typeof import("../modules/core/luu-tru/tai-ve")>();
  return {
    ...that,
    taiXuong: (duLieu: Uint8Array, tenTep: string) => {
      daTai = { ten: tenTep, duLieu };
      return true;
    },
  };
});

const nguoi = (i: number, ten: string, vaiTro: ThanhVien["vaiTro"], lop?: string): ThanhVien => ({
  id: `tv-${i}`,
  ten,
  vaiTro,
  ...(lop ? { lop } : {}),
  thuTu: i,
  taoLuc: LUC,
  suaLuc: LUC,
});

const DIEM = [
  { D: 80, I: 30, S: 40, C: 55 },
  { D: 25, I: 78, S: 62, C: 33 },
  { D: 45, I: 40, S: 85, C: 28 },
];

const bai = (id: string, tv: number, ketThuc: string): BaiLamLuu =>
  ({
    id,
    boDe: tv === 0 ? "PH" : "THCS",
    maTre: `nguoi-${tv}`,
    maThanhVien: `tv-${tv}`,
    nguoiTraLoi: tv === 0 ? "nguoi-lon" : "tre",
    batDau: LUC,
    ketThuc,
    traLoi: { "THCS-D1": 4 },
    ketQua: {
      hopLe: true,
      diem: DIEM[tv],
      xepHang: (Object.keys(DIEM[tv]) as Array<keyof (typeof DIEM)[0]>).sort(
        (a, b) => DIEM[tv][b] - DIEM[tv][a],
      ),
      kieu: { loai: "don", truc: "D" },
      canhBao: [],
    },
    phienBanBoDe: "1.0",
  }) as unknown as BaiLamLuu;

/**
 * Nhà ba người: Mẹ Lan (1 bài), Zozo (2 bài — chạm trần), Momo (1 bài).
 * Cộng HAI lần đã chạy phân tích cả nhà.
 */
async function dungNha() {
  await luuThanhVien(nguoi(0, "Mẹ Lan", "me"));
  await luuThanhVien(nguoi(1, "Zozo", "con", "7"));
  await luuThanhVien(nguoi(2, "Momo", "con", "9"));

  await luuBai(bai("b0", 0, "2026-08-28T08:00:00+07:00"));
  await luuBai(bai("b1a", 1, "2026-08-28T09:30:00+07:00"));
  await luuBai(bai("b1b", 1, "2026-08-12T14:05:00+07:00"));
  await luuBai(bai("b2", 2, "2026-08-28T10:00:00+07:00"));

  const kq = phanTichGiaDinh([
    { id: "tv-0", ten: "Mẹ Lan", laTre: false, diem: DIEM[0] },
    { id: "tv-1", ten: "Zozo", laTre: true, diem: DIEM[1] },
    { id: "tv-2", ten: "Momo", laTre: true, diem: DIEM[2] },
  ]);
  if (!kq.phanTichDuoc) throw new Error("dữ liệu bịa phải phân tích được");

  for (const [id, taoLuc] of [
    ["pt-1", "2026-08-28T20:05:00+07:00"],
    ["pt-2", "2026-08-25T08:15:00+07:00"],
  ] as const) {
    await luuPhanTich({
      id,
      maBai: ["b0", "b1a"],
      taoLuc,
      noiDung: kq.ban,
    } as PhanTichGiaDinh);
  }
}

/**
 * Bấm nút *Sao lưu* và chờ tệp .zip rơi ra.
 *
 * 🔴 Chờ chính NÚT SAO LƯU, không chờ tên một người: nhà trống cũng phải sao lưu được, và
 * một helper chỉ chạy được khi có sẵn dữ liệu thì không kiểm được trường hợp trống.
 */
async function bamSaoLuu(): Promise<JSZip> {
  render(<KhoangNhaMinh />);
  const nut = await screen.findByRole("button", { name: CHU_M6.nutSaoLuu });
  fireEvent.click(nut);
  await waitFor(() => expect(daTai).not.toBeNull(), { timeout: 30_000 });
  return JSZip.loadAsync(daTai!.duLieu);
}

const duong = (zip: JSZip) => Object.keys(zip.files).filter((t) => !zip.files[t].dir);

beforeEach(async () => {
  daTai = null;
  quenFontDaTai();
  await xoaSachTatCa();
  const ttf = readFileSync(join(process.cwd(), "public/fonts/BeVietnamPro-Regular.ttf"));
  vi.stubGlobal(
    "fetch",
    vi.fn(async (d: string) => {
      if (String(d) !== DUONG_FONT) throw new Error(`không mong đợi fetch ${d}`);
      return {
        ok: true,
        status: 200,
        arrayBuffer: async () =>
          ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength),
      };
    }),
  );
});
afterEach(async () => {
  cleanup();
  vi.unstubAllGlobals();
  quenFontDaTai();
  await xoaSachTatCa();
});

describe("🔴 bấm Sao lưu ⇒ cây thư mục đọc được", () => {
  it("mỗi người MỘT thư mục mang TÊN của họ", async () => {
    await dungNha();
    const zip = await bamSaoLuu();
    const ds = duong(zip);

    for (const ten of ["Mẹ Lan", "Zozo", "Momo"]) {
      expect(
        ds.some((t) => t.startsWith(`${ten}/`)),
        `thiếu thư mục của ${ten}`,
      ).toBe(true);
    }
  }, 60_000);

  it("🔴 người có HAI bài ⇒ thư mục có ĐÚNG hai tệp PDF, tên khác nhau", async () => {
    await dungNha();
    const zip = await bamSaoLuu();
    const cuaZozo = duong(zip).filter((t) => t.startsWith("Zozo/"));

    expect(cuaZozo).toHaveLength(2);
    expect(new Set(cuaZozo).size).toBe(2);
    for (const t of cuaZozo) expect(t.endsWith(".pdf")).toBe(true);
  }, 60_000);

  it("người có MỘT bài ⇒ đúng một tệp", async () => {
    await dungNha();
    const zip = await bamSaoLuu();
    expect(duong(zip).filter((t) => t.startsWith("Mẹ Lan/"))).toHaveLength(1);
  }, 60_000);

  it("🔴 thư mục Tổng hợp có MỘT thư mục con cho MỖI lần đã chạy, tên theo ngày giờ", async () => {
    await dungNha();
    const zip = await bamSaoLuu();
    const con = new Set(
      duong(zip)
        .filter((t) => t.startsWith(`${THU_MUC_TONG_HOP}/`))
        .map((t) => t.split("/")[1]),
    );

    expect(con.size, "hai lần chạy phải ra hai thư mục con").toBe(2);
    for (const c of con) {
      // Dạng `yyyy-mm-dd HHhMM` — có GIỜ, để hai lần chạy cùng ngày không trùng tên.
      expect(c, `tên thư mục con sai khuôn: ${c}`).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}h\d{2}$/u);
    }
  }, 60_000);

  it("mỗi thư mục con của Tổng hợp có MỖI NGƯỜI MỘT TỜ", async () => {
    await dungNha();
    const zip = await bamSaoLuu();
    const theoLan = new Map<string, string[]>();
    for (const t of duong(zip).filter((x) => x.startsWith(`${THU_MUC_TONG_HOP}/`))) {
      const lan = t.split("/")[1];
      theoLan.set(lan, [...(theoLan.get(lan) ?? []), t]);
    }
    for (const [lan, tep] of theoLan) {
      // 🔴 Luật "mỗi người một tờ" có từ GĐ10/GĐ14 — PDF không được là ngoại lệ.
      expect(tep, `lần ${lan} thiếu tờ`).toHaveLength(3);
    }
  }, 60_000);

  it("🔴 JSON chìm xuống `_may-doc/`, KHÔNG còn tệp .json nào ở gốc", async () => {
    await dungNha();
    const zip = await bamSaoLuu();
    const jsonOGoc = duong(zip).filter((t) => t.endsWith(".json") && !t.includes("/"));
    expect(jsonOGoc, `còn JSON ở gốc: ${jsonOGoc.join(", ")}`).toEqual([]);
    expect(duong(zip).some((t) => t.startsWith(`${THU_MUC_MAY_DOC}/`))).toBe(true);
  }, 60_000);

  it("🔴 tệp .zip vẫn KHÔI PHỤC được — thêm PDF không làm hỏng phần dữ liệu", async () => {
    await dungNha();
    const zip = await bamSaoLuu();
    const { docTuZip } = await import("../modules/core/luu-tru/khoi-phuc");
    const kq = await docTuZip(daTai!.duLieu);

    expect(kq.ok).toBe(true);
    if (!kq.ok) return;
    expect(kq.so.thanhVien).toHaveLength(3);
    expect(kq.so.bai).toHaveLength(4);
    expect(kq.so.phanTich).toHaveLength(2);
    void zip;
  }, 60_000);

  it("🔴 cờ MO_NOI_DUNG_TRE TẮT ⇒ KHÔNG xuất thư mục của trẻ", async () => {
    /**
     * 🔴 CHỖ CHẶN THỨ TƯ CỦA CỜ. Ba chỗ trước là thẻ, khoang làm bài, bản phân tích. Đây
     * là chỗ dễ quên nhất và cũng nguy nhất: một tệp PDF trong `.zip` **sống lâu hơn cả
     * phiên làm việc** — nó nằm trong máy người dùng, gửi qua chat được. Tắt cờ mà vẫn
     * xuất là phát nội dung về trẻ ra ngoài đúng lúc đang muốn thu lại.
     *
     * Thử ở CẢ HAI trạng thái: một cờ chỉ được thử lúc đang bật thì đúng bằng không có cờ.
     */
    vi.resetModules();
    vi.doMock("@config/disc-nguong", async (goc) => ({
      ...(await goc<typeof import("../config/disc-nguong")>()),
      MO_NOI_DUNG_TRE: false,
    }));
    try {
      await dungNha();
      const { KhoangNhaMinh: Tat } = await import("../app/khoang/nha-minh");
      render(<Tat />);
      fireEvent.click(await screen.findByRole("button", { name: CHU_M6.nutSaoLuu }));
      await waitFor(() => expect(daTai).not.toBeNull(), { timeout: 30_000 });
      const ds = duong(await JSZip.loadAsync(daTai!.duLieu));

      // Zozo (lớp 7) và Momo (lớp 9) là trẻ ⇒ không có thư mục.
      expect(ds.some((t) => t.startsWith("Zozo/")), "cờ tắt mà vẫn xuất bản của trẻ").toBe(false);
      expect(ds.some((t) => t.startsWith("Momo/"))).toBe(false);
      // Mẹ Lan là người lớn ⇒ vẫn có. Tắt cờ không được tắt luôn cả người lớn.
      expect(ds.some((t) => t.startsWith("Mẹ Lan/"))).toBe(true);
      // Và phần dữ liệu vẫn đủ — cờ chặn NỘI DUNG, không chặn sao lưu.
      expect(ds.some((t) => t.startsWith(`${THU_MUC_MAY_DOC}/`))).toBe(true);
    } finally {
      vi.doUnmock("@config/disc-nguong");
      vi.resetModules();
    }
  }, 60_000);

  it("nhà TRỐNG ⇒ vẫn ra tệp .zip, chỉ là không có thư mục người nào", async () => {
    const zip = await bamSaoLuu();
    expect(duong(zip).some((t) => t.startsWith(`${THU_MUC_MAY_DOC}/`))).toBe(true);
    expect(duong(zip).filter((t) => t.endsWith(".pdf"))).toEqual([]);
  }, 60_000);
});
