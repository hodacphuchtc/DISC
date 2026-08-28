import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TruocKhiBatDau } from "../app/khoang/truoc-khi-bat-dau";
import { CHU_CHON, CHU_TRUOC_KHI_BAT_DAU } from "../config/disc-tu-dien";
import { napBoDe } from "../modules/core/bo-de/nap";
import { DO_DAI_BIET_DANH_TOI_DA, demKyTu } from "../modules/test/biet-danh";
import type { MaBoDe } from "../modules/core/bo-de/kieu";

/**
 * M2 — MÀN DẶN DÒ.
 *
 * 🔴 Từ V2.2 file này dựng THẲNG component, không đi qua `KhoangDisc` nữa. Lý do: màn
 * *"Ai đang cầm máy?"* đã bị xoá, nên không còn chuỗi thao tác nào dẫn tới M2 — vào bài
 * là vào thẳng M2. Dựng thẳng thì cửa kiểm nói đúng thứ nó kiểm, và không đỏ lây mỗi lần
 * luồng bên ngoài đổi.
 *
 * 🔴 Ô NHẬP TÊN VẪN CÒN ĐƯỜNG SỐNG. Vào từ thẻ thành viên thì `tenCoSan` có sẵn và ô biến
 * mất; nhưng đường *"làm nốt bộ còn thiếu"* ở màn kết quả và ở màn Vùng lệch vẫn chuyền
 * `bietDanhGoiY` mà KHÔNG có `tenCoSan` — lúc đó ô hiện ra. Bỏ nhóm test này đi là bỏ
 * canh một đường người dùng vẫn đi được.
 */

const quayLai = vi.fn();
const batDau = vi.fn();

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/** Dựng M2 ở chế độ CÓ ô nhập tên (đường "làm nốt bộ còn thiếu"). */
function dungCoONhap(ma: MaBoDe = "THCS") {
  render(
    <TruocKhiBatDau boDe={napBoDe(ma)} onQuayLai={quayLai} onBatDau={batDau} />,
  );
}

/** Dựng M2 ở chế độ VÀO TỪ THẺ — tên đã biết, không hỏi lại. */
function dungTuThe(ten = "Zozo", ma: MaBoDe = "THCS") {
  render(
    <TruocKhiBatDau
      boDe={napBoDe(ma)}
      tenCoSan={ten}
      onQuayLai={quayLai}
      onBatDau={batDau}
    />,
  );
}

const bam = (ten: string | RegExp) =>
  fireEvent.click(screen.getByRole("button", { name: ten }));
const oNhap = () => screen.getByLabelText(CHU_TRUOC_KHI_BAT_DAU.nhanO) as HTMLInputElement;
const go = (chu: string) => fireEvent.change(oNhap(), { target: { value: chu } });

describe("M2 — nội dung dặn dò", () => {
  it("hiện đủ BỐN dòng dặn dò", () => {
    dungCoONhap();
    for (const d of CHU_TRUOC_KHI_BAT_DAU.danDo) {
      expect(screen.getByText(d.nhan)).toBeInTheDocument();
    }
  });

  it("nói rõ dữ liệu không rời máy — cam kết trung tâm của sản phẩm", () => {
    dungCoONhap();
    expect(screen.getByText(/không gửi đi đâu/iu)).toBeInTheDocument();
  });

  it("bộ đề nào thì thời gian ước lượng theo bộ đó", () => {
    dungCoONhap("MN");
    expect(screen.getByText(/Mầm non · 20 câu/u)).toBeInTheDocument();
    expect(screen.getByText(/Khoảng 5–6 phút/u)).toBeInTheDocument();
  });

  it("bấm Quay lại ⇒ gọi lối thoát, không tự đoán đi đâu", () => {
    dungCoONhap();
    bam(new RegExp(CHU_CHON.nutQuayLai, "u"));
    expect(quayLai).toHaveBeenCalledTimes(1);
  });
});

describe("ô nhập tên — đường 'làm nốt bộ còn thiếu'", () => {
  it("nhập tên rồi bấm Bắt đầu ⇒ chuyền đúng tên đó ra ngoài", () => {
    dungCoONhap();
    go("Zozo");
    bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
    expect(batDau).toHaveBeenCalledWith("Zozo");
  });

  it("gõ 40 ký tự thì ô chỉ nhận 24", () => {
    dungCoONhap();
    go("a".repeat(40));
    expect(demKyTu(oNhap().value)).toBe(DO_DAI_BIET_DANH_TOI_DA);
  });

  it("🔴 40 chữ tiếng Việt CÓ DẤU cũng nhận đúng 24, không bị cắt còn 12", () => {
    dungCoONhap();
    go("ẩ".repeat(40));
    expect(demKyTu(oNhap().value)).toBe(DO_DAI_BIET_DANH_TOI_DA);
  });

  it("toàn khoảng trắng ⇒ KHÔNG đi tiếp, hiện lỗi rõ ràng", () => {
    dungCoONhap();
    go("      ");
    bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
    expect(screen.getByRole("alert")).toHaveTextContent(CHU_TRUOC_KHI_BAT_DAU.oTrong);
    expect(batDau).not.toHaveBeenCalled();
  });

  it("chưa bấm gì thì CHƯA hiện lỗi — đừng mắng người dùng trước khi họ làm gì", () => {
    dungCoONhap();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("🔴 ADR-005: gõ họ tên đầy đủ thì KHÔNG bị nhắc gì nữa, và vẫn vào bài bình thường", () => {
    // Luật cũ nhắc "dùng biệt danh thì an toàn hơn cho con". ADR-005 lật nó: người dùng
    // là phụ huynh đang ngồi trong app của chính trung tâm, dữ liệu không rời máy, và
    // một sổ gia đình toàn "bé A", "bé B" thì vô dụng. Bốn hàng rào thật sự vẫn nguyên —
    // chúng nằm ở chỗ dữ liệu ĐI RA, không nằm ở ô nhập.
    dungCoONhap();
    go("Nguyễn Văn An");
    expect(screen.queryByRole("status")).toBeNull();
    bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
    expect(batDau).toHaveBeenCalledWith("Nguyễn Văn An");
  });
});

describe("vào từ thẻ thành viên — KHÔNG hỏi tên lần nữa", () => {
  it("🔴 không có ô nhập tên", () => {
    dungTuThe();
    expect(screen.queryByLabelText(CHU_TRUOC_KHI_BAT_DAU.nhanO)).toBeNull();
  });

  it("nói rõ đang làm bài cho ai", () => {
    dungTuThe("Kiki");
    expect(document.querySelector('[data-thu="ten-co-san"]')).toHaveTextContent(
      CHU_TRUOC_KHI_BAT_DAU.lamBaiCho.replace("{ten}", "Kiki"),
    );
  });

  it("bấm Bắt đầu ⇒ chuyền thẳng tên trong sổ, không qua ô nào", () => {
    dungTuThe("Kiki");
    bam(CHU_TRUOC_KHI_BAT_DAU.nutBatDau);
    expect(batDau).toHaveBeenCalledWith("Kiki");
  });
});

describe("hộp giải thích chuyển bản (DISC_BA.md §4.2)", () => {
  it("🔴 lớp 1–2 vào từ thẻ VẪN phải thấy lý do bị chuyển sang bản quan sát", () => {
    render(
      <TruocKhiBatDau
        boDe={napBoDe("MN")}
        tenCoSan="Zozo"
        giaiThich="LOP_1_2"
        onQuayLai={quayLai}
        onBatDau={batDau}
      />,
    );
    const hop = document.querySelector('[data-thu="giai-thich-chuyen-ban"]');
    expect(hop, "chuyển im lặng sang bản người lớn trả lời là lừa người dùng").toBeTruthy();
    expect(hop).toHaveTextContent(CHU_CHON.giaiThichLop12.tieuDe);
  });

  it("không có lý do chuyển thì KHÔNG bày hộp ra", () => {
    dungTuThe();
    expect(document.querySelector('[data-thu="giai-thich-chuyen-ban"]')).toBeNull();
  });
});
