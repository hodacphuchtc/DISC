import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { KhoangDisc } from "../app/khoang/disc";
import { CHU_LAM_BAI, CHU_TRUOC_KHI_BAT_DAU } from "../config/disc-tu-dien";
import { napBoDe } from "../modules/core/bo-de/nap";
import { nguoiChoBoDe, type MaBoDeThu } from "./duong-vao-bai";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
});

const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));

/**
 * Vào M3 của một bộ đề.
 *
 * 🔴 Từ V2.2 không còn chuỗi thao tác nào: dựng khoang cho một người mà vai + bậc của họ
 * ra đúng bộ đề cần, rồi bấm Bắt đầu. Tên lấy từ sổ nên KHÔNG có ô nhập nữa.
 * Tên bịa `"Zozo"` — `"Bi"` cũ nằm gọn trong chữ "**Bi**ệt danh" trên màn và từng làm
 * một cửa kiểm đỏ oan.
 */
function vaoM3(ma: MaBoDeThu, ten = "Zozo") {
  render(
    <KhoangDisc vaoTuThanhVien={nguoiChoBoDe(ma, ten)} onThoat={() => {}} />,
  );
  bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
}

const vaoTHCS = () => vaoM3("THCS");
const vaoTieuHoc = () => vaoM3("TH");

/** Trả lời hết các câu đang hiện trên màn, chọn mức thứ `viTri` (đếm từ 0). */
function traLoiTrangNay(viTri: number) {
  const nhom = screen.getAllByRole("radiogroup");
  for (const g of nhom) {
    const nut = Array.from(g.querySelectorAll('[role="radio"]')) as HTMLElement[];
    fireEvent.click(nut[Math.min(viTri, nut.length - 1)]);
  }
}

describe("M3 — trình bày", () => {
  /**
   * 🔴 ĐỔI ĐẶC TẢ, KHÔNG PHẢI SỬA TEST CHO XANH (ADR-006, 11.3).
   *
   * §5.2 cũ ghi "MN và TH: một câu một màn". Chủ dự án chốt lật luật đó: 5 câu/màn cho
   * MỌI bộ đề. Bốn cửa kiểm đỏ khi đổi là ĐÚNG — chúng đang canh luật cũ. Cái được giữ
   * lại nguyên vẹn là phần bảo vệ trẻ nhỏ: cỡ chữ và cỡ nút, xem `canNutTo()`.
   */
  it("bộ Tiểu học: NĂM câu một màn (ADR-006 lật §5.2)", () => {
    vaoTieuHoc();
    expect(screen.getAllByRole("radiogroup")).toHaveLength(5);
  });

  it("bộ THCS: NĂM câu một màn", () => {
    vaoTHCS();
    expect(screen.getAllByRole("radiogroup")).toHaveLength(5);
  });

  it("bộ Tiểu học dùng thang 3 mức có mặt cười", () => {
    vaoTieuHoc();
    const nut = screen.getAllByRole("radio");
    expect(nut).toHaveLength(3 * 5);
    expect(nut.slice(0, 3).map((n) => n.textContent)).toEqual([
      "🙁Không phải",
      "😐Đôi khi",
      "😀Đúng rồi",
    ]);
  });

  it("có thanh tiến trình, KHÔNG có đồng hồ đếm ngược", () => {
    vaoTHCS();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText(/còn lại|hết giờ|đếm ngược/iu)).toBeNull();
  });

  it("nói rõ đang làm bài của AI — máy dùng chung", () => {
    vaoM3("THCS", "Bống");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Bống");
  });
});

describe("M3 — điều hướng", () => {
  it("chưa trả lời hết trang thì bấm Tiếp báo thiếu, KHÔNG sang trang", () => {
    vaoTHCS();
    bam(CHU_LAM_BAI.nutTiep);
    expect(screen.getByRole("alert")).toHaveTextContent(CHU_LAM_BAI.conThieu);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("trả lời hết trang rồi bấm Tiếp ⇒ sang trang sau, tiến trình tăng", () => {
    vaoTHCS();
    traLoiTrangNay(3);
    bam(CHU_LAM_BAI.nutTiep);
    // 5/24 ≈ 21%
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "21");
  });

  it("bấm Quay lại ở trang đầu ⇒ về màn dặn dò", () => {
    vaoTHCS();
    bam(CHU_LAM_BAI.nutQuayLai);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      CHU_TRUOC_KHI_BAT_DAU.tieuDe,
    );
  });

  it("dòng động viên hiện sau đúng 5 câu", () => {
    vaoTHCS();
    expect(screen.queryByText(CHU_LAM_BAI.dongVien[0])).toBeNull();
    traLoiTrangNay(3);
    expect(screen.getByText(CHU_LAM_BAI.dongVien[0])).toBeInTheDocument();
  });

  it("trang cuối đổi nút thành Xem kết quả", () => {
    vaoTHCS();
    for (let i = 0; i < 4; i += 1) {
      traLoiTrangNay(3);
      bam(CHU_LAM_BAI.nutTiep);
    }
    expect(screen.getByRole("button", { name: CHU_LAM_BAI.nutXemKetQua })).toBeInTheDocument();
  });
});

describe("M3 → kết quả", () => {
  it("làm trọn bài trả lời thật ⇒ ra bốn con số", () => {
    vaoTHCS();
    const boDe = napBoDe("THCS");
    for (let i = 0; i < 5; i += 1) {
      // Chọn lệch nhau để không rơi vào hàng rào "trả lời phẳng".
      traLoiTrangNay(i % 2 === 0 ? 4 : 0);
      bam(i === 4 ? CHU_LAM_BAI.nutXemKetQua : CHU_LAM_BAI.nutTiep);
    }
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(boDe.ten, { exact: false })).toBeInTheDocument();
  });

  it("🔴 chọn TOÀN MỨC GIỮA cả bài ⇒ KHÔNG ra kết quả, ra lời mời làm lại", () => {
    vaoTHCS();
    for (let i = 0; i < 5; i += 1) {
      traLoiTrangNay(2); // mức 3/5 — mức giữa
      bam(i === 4 ? CHU_LAM_BAI.nutXemKetQua : CHU_LAM_BAI.nutTiep);
    }
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Chưa kết luận được");
    expect(screen.getByText(/hầu hết câu đều ở mức giữa/u)).toBeInTheDocument();
  });
});

describe("M3 — lưu nháp", () => {
  it("làm dở rồi rời trang, quay lại ⇒ mở đúng chỗ đang dở", () => {
    vaoTHCS();
    traLoiTrangNay(3);
    bam(CHU_LAM_BAI.nutTiep);
    traLoiTrangNay(1);
    cleanup();

    vaoTHCS(); // như mở lại tab
    expect(screen.getByText(CHU_LAM_BAI.tiepTucNhap)).toBeInTheDocument();
    // 10/24 ≈ 42%
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
  });

  it("🔴 biệt danh KHÁC ⇒ KHÔNG lấy nháp của người trước", () => {
    vaoTHCS();
    traLoiTrangNay(3);
    cleanup();

    vaoM3("THCS", "Bống");
    expect(screen.queryByText(CHU_LAM_BAI.tiepTucNhap)).toBeNull();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});

describe("🔴 mỗi câu một THẺ CÓ KHUNG (11.3)", () => {
  /**
   * Chủ dự án chụp màn hình và nói năm câu "dính vào nhau". Đúng: chúng nằm trần trên
   * nền trắng, chỉ cách nhau bằng khoảng trắng, mắt không có gì để bám mà tách câu này
   * với câu kia. Cả nhóm cửa kiểm dưới đây canh phần sửa đó.
   */
  const the = () => Array.from(document.querySelectorAll('[data-thu="the-cau"]'));

  it("năm câu là năm thẻ riêng, không phải một khối liền", () => {
    vaoTieuHoc();
    expect(the()).toHaveLength(5);
  });

  it("số thứ tự đếm THEO CẢ BÀI, không đếm lại từ 1 ở mỗi trang", () => {
    vaoTieuHoc();
    expect(the()[0].textContent).toMatch(/^\s*1/u);

    traLoiTrangNay(1);
    bam(CHU_LAM_BAI.nutTiep);

    // Sang trang 2 phải là câu 6–10, KHÔNG phải câu 1–5 của trang 2.
    expect(the()[0].textContent).toMatch(/^\s*6/u);
    expect(the()[4].textContent).toMatch(/^\s*10/u);
  });

  it("🔴 viền trái đổi màu khi đã chọn — nhìn lướt là biết còn sót câu nào", () => {
    vaoTieuHoc();
    expect(the().every((t) => t.getAttribute("data-da-chon") === "0")).toBe(true);

    const nhom = screen.getAllByRole("radiogroup")[2];
    fireEvent.click(nhom.querySelectorAll('[role="radio"]')[0]);

    const sau = the().map((t) => t.getAttribute("data-da-chon"));
    expect(sau).toEqual(["0", "0", "1", "0", "0"]);
  });

  it("mỗi câu vẫn có nhãn đọc màn hình riêng, không gộp năm câu làm một", () => {
    vaoTieuHoc();
    expect(screen.getAllByRole("radiogroup")).toHaveLength(5);
    const nhan = screen
      .getAllByRole("radiogroup")
      .map((g) => g.getAttribute("aria-labelledby"));
    expect(nhan.every(Boolean)).toBe(true);
    // Năm nhãn phải TRỎ VÀO NĂM CÂU KHÁC NHAU — trỏ chung một chỗ thì người dùng đọc
    // màn hình nghe năm lần cùng một câu hỏi mà vẫn tưởng mình đang trả lời năm câu.
    expect(new Set(nhan).size).toBe(5);
  });
});

describe("🔴 bộ trẻ nhỏ GIỮ chữ to và nút to dù đã 5 câu/màn", () => {
  /**
   * ĐÂY LÀ CỬA KIỂM QUAN TRỌNG NHẤT CỦA 11.3.
   *
   * Trước 11.3, cỡ chữ và cỡ nút được suy từ `boDe.cauMoiMan === 1`. Đổi `cauMoiMan` của
   * MN và TH sang 5 mà không đụng gì khác thì cả hai bộ dành cho trẻ NHỎ NHẤT lặng lẽ
   * tụt xuống chữ 14px và nút 44px — không một test nào đỏ, không ai thấy. Đúng vết xe
   * của bảng đại từ một chiều đã cắt mất lời khuyên của cả nhóm phụ huynh ở GĐ10.
   *
   * Nay cỡ chữ khoá theo `canNutTo(boDe.ma)`, và cửa kiểm này canh đúng con số mà
   * `.claude/rules` đòi: chữ ≥ 18px, nút cao ≥ 56px.
   */
  it("bộ Tiểu học: chữ câu hỏi ≥ 18px", () => {
    vaoTieuHoc();
    const cauDau = document.querySelectorAll('[data-thu="the-cau"] p')[0];
    expect(cauDau.className).toMatch(/text-\[18px\]/u);
  });

  it("bộ Tiểu học: nút trả lời cao ≥ 56px", () => {
    vaoTieuHoc();
    const nut = screen.getAllByRole("radio")[0];
    expect(nut.className).toMatch(/min-h-\[56px\]/u);
  });

  it("bộ THCS vẫn dùng cỡ gọn — luật này chỉ dành cho trẻ nhỏ", () => {
    vaoTHCS();
    expect(screen.getAllByRole("radio")[0].className).toMatch(/min-h-\[44px\]/u);
  });
});

describe("bỏ trống rồi bấm Tiếp", () => {
  it("báo lỗi và KHÔNG sang trang", () => {
    vaoTieuHoc();
    const nhom = screen.getAllByRole("radiogroup")[0];
    fireEvent.click(nhom.querySelectorAll('[role="radio"]')[0]);

    bam(CHU_LAM_BAI.nutTiep);

    expect(screen.getByRole("alert")).toHaveTextContent(CHU_LAM_BAI.conThieu);
    // Vẫn ở trang 1: câu đầu vẫn là câu số 1.
    expect(document.querySelectorAll('[data-thu="the-cau"]')[0].textContent).toMatch(/^\s*1/u);
  });

  it("🔴 cuộn tới ĐÚNG câu còn thiếu, không bắt người ta tự dò lại", () => {
    vaoTieuHoc();
    const daCuon: Element[] = [];

    // jsdom KHÔNG định nghĩa `scrollIntoView`, nên `vi.spyOn` không bám vào được — phải
    // tự gắn. 🔴 Và phải GỠ trong `finally`: vá thẳng lên prototype mà quên gỡ thì bản vá
    // sống tiếp sang mọi file test chạy sau trong cùng tiến trình, rồi lộ ra dưới dạng
    // một lỗi lạ ở một file chẳng liên quan gì tới màn làm bài.
    const proto = Element.prototype as unknown as { scrollIntoView?: () => void };
    proto.scrollIntoView = function (this: Element) {
      daCuon.push(this);
    };

    try {
      const nhom = screen.getAllByRole("radiogroup");
      for (const i of [0, 1, 3, 4]) {
        fireEvent.click(nhom[i].querySelectorAll('[role="radio"]')[0]);
      }

      bam(CHU_LAM_BAI.nutTiep);

      expect(daCuon).toHaveLength(1);
      // Câu thứ 3 (chỉ số 2) là câu duy nhất còn trống.
      expect(daCuon[0]).toBe(document.querySelectorAll('[data-thu="the-cau"]')[2]);
    } finally {
      delete proto.scrollIntoView;
    }
  });
});

describe("🔴 nháp của phiên bản bộ câu CŨ — nói ra, không im lặng vứt", () => {
  it("hiện dòng báo tử tế thay vì màn trắng tinh", () => {
    // Dựng đúng cảnh đã xảy ra thật khi 11.3 đổi `cauMoiMan`: người dùng có bài làm dở
    // từ bộ câu bản 1.0, mở lại sau khi bộ câu lên 1.1.
    window.localStorage.setItem(
      "disc:nhap:TH",
      JSON.stringify({
        boDe: "TH",
        // 🔴 Nháp gắn theo CẢ biệt danh, không chỉ theo bộ đề (quyết định 27/08/2026):
        // máy giáo viên đi qua nhiều gia đình, trả nháp của bé A cho bé B là vừa lộ chéo
        // vừa sai người. Nên tên ở đây phải khớp tên người mà `vaoTieuHoc()` dựng ra.
        bietDanh: "Zozo",
        traLoi: { "TH-D1": 2 },
        batDau: "2026-08-27T01:20:00+07:00",
        giayDaLam: 30,
        phienBanBoDe: "1.0",
      }),
    );

    vaoTieuHoc();

    expect(document.querySelector('[data-thu="nhap-cu"]')).toHaveTextContent(
      CHU_LAM_BAI.nhapCuKhongDung,
    );
    // Và KHÔNG được đồng thời khoe "đã mở lại bài dở" — hai câu chỏi nhau.
    expect(screen.queryByText(CHU_LAM_BAI.tiepTucNhap)).toBeNull();
  });

  it("không có nháp cũ thì KHÔNG hiện dòng đó — đừng doạ người chưa làm gì", () => {
    vaoTieuHoc();
    expect(document.querySelector('[data-thu="nhap-cu"]')).toBeNull();
  });
});
