import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FormThanhVien } from "../app/components/form-thanh-vien";
import { CHU_VAI, VAI_GIA_DINH, coHoiLop } from "../config/disc-gia-dinh";
import { LOP_MAM_NON, LOP_TREN_12, tuyChonLop } from "../config/disc-nguong";
import { CHU_BANG_GIA_DINH } from "../config/disc-tu-dien";
import type { ThanhVien } from "../modules/core/gia-dinh/kieu";

/**
 * FORM THÊM / SỬA NGƯỜI — ô lớp theo vai (V1.2).
 *
 * 🔴 VÌ SAO FILE NÀY TỒN TẠI. Bản trước hỏi lớp cho MỌI vai, nhãn ghi
 * *"Lớp (nếu đang đi học)"*. Bố mẹ để trống ⇒ `ThanhVien.lop` là `undefined` ⇒
 * `boDeCuaThanhVien()` trả `null` ⇒ bấm *Làm bài* trên thẻ của Mẹ thì bị đá về màn
 * *"Ai đang cầm máy?"* và bị hỏi lại đúng những gì sổ đã biết.
 *
 * **Một ô thừa trên form đã chặn nguyên nhóm người lớn khỏi sản phẩm, và không test nào
 * đỏ** — vì mọi test đều hỏi "form có lưu được không", chưa ai hỏi "người này rồi có vào
 * được bài của họ không".
 */

/** Tên bịa KHÔNG đụng chữ nào của giao diện — `"Bi"` từng khớp nhầm vào "**Bi**ệt danh". */
const TEN = "Zozo";

function dungForm(tv: ThanhVien | null = null) {
  const onLuu = vi.fn();
  render(<FormThanhVien tv={tv} daCo={[]} onLuu={onLuu} onHuy={() => {}} />);
  return { onLuu };
}

const oVai = () => screen.getByRole("combobox", { name: CHU_BANG_GIA_DINH.nhanVai });
const oLop = () => screen.queryByRole("combobox", { name: CHU_BANG_GIA_DINH.nhanLop });
const doiVai = (v: string) => fireEvent.change(oVai(), { target: { value: v } });
const luu = () => fireEvent.click(screen.getByRole("button", { name: CHU_BANG_GIA_DINH.nutLuu }));
const goTen = (t: string) =>
  fireEvent.change(screen.getByRole("textbox", { name: CHU_BANG_GIA_DINH.nhanTen }), {
    target: { value: t },
  });

afterEach(cleanup);

describe("ô lớp hiện theo vai", () => {
  it("vai Con thì CÓ ô lớp", () => {
    dungForm();
    doiVai("con");
    expect(oLop()).not.toBeNull();
  });

  it("🔴 vai Mẹ / Bố / Ông / Bà / Người thân thì KHÔNG có ô lớp", () => {
    dungForm();
    for (const v of ["me", "bo", "ba", "ong", "nguoi-than", "khac"]) {
      doiVai(v);
      expect(oLop(), `vai ${CHU_VAI[v as keyof typeof CHU_VAI]} vẫn còn ô lớp`).toBeNull();
    }
  });

  it("mọi vai đều khớp đúng luật `coHoiLop()` ở config — không có luật thứ hai trong component", () => {
    dungForm();
    for (const v of VAI_GIA_DINH) {
      doiVai(v);
      expect(oLop() !== null, `vai ${v} lệch khỏi coHoiLop()`).toBe(coHoiLop(v));
    }
  });
});

describe("danh sách bậc học", () => {
  it("có đúng 14 mục cộng dòng 'chưa chọn'", () => {
    dungForm();
    doiVai("con");
    expect(oLop()!.querySelectorAll("option")).toHaveLength(tuyChonLop().length + 1);
  });

  it("có Mầm non ở đầu và Trên lớp 12 ở cuối", () => {
    dungForm();
    doiVai("con");
    const gia = [...oLop()!.querySelectorAll("option")].map((o) => o.getAttribute("value"));
    expect(gia[1]).toBe(LOP_MAM_NON);
    expect(gia.at(-1)).toBe(LOP_TREN_12);
  });

  it("Mầm non hiện ra bằng chữ, không phải mã 'mam-non'", () => {
    dungForm();
    doiVai("con");
    const nhan = [...oLop()!.querySelectorAll("option")].map((o) => o.textContent);
    expect(nhan).toContain(CHU_BANG_GIA_DINH.nhanMamNon);
    expect(nhan).toContain(CHU_BANG_GIA_DINH.nhanTren12);
    expect(nhan.join(" ")).not.toContain(LOP_MAM_NON);
  });
});

describe("lớp mồ côi trên người lớn", () => {
  it("🔴 chọn lớp rồi đổi vai sang Bố thì bản ghi lưu ra KHÔNG có trường lop", () => {
    const { onLuu } = dungForm();
    goTen(TEN);
    doiVai("con");
    fireEvent.change(oLop()!, { target: { value: "7" } });
    doiVai("bo");
    luu();
    expect(onLuu).toHaveBeenCalledTimes(1);
    expect(onLuu.mock.calls[0]![0]).not.toHaveProperty("lop");
  });

  it("🔴 SỬA một hồ sơ cũ vốn mang lớp mồ côi thì lớp đó bị gỡ, không sống thêm vòng nữa", () => {
    // Bản trước hỏi lớp cho mọi vai, nên trong kho thật có thể đang có đúng hồ sơ này.
    const cu: ThanhVien = {
      id: "tv-cu",
      ten: TEN,
      vaiTro: "bo",
      lop: "7",
      thuTu: 0,
      taoLuc: "2026-08-01T00:00:00.000Z",
      suaLuc: "2026-08-01T00:00:00.000Z",
    };
    const { onLuu } = dungForm(cu);
    expect(oLop()).toBeNull(); // ô đã ẩn — người dùng không thấy giá trị cũ
    luu();
    expect(onLuu.mock.calls[0]![0]).not.toHaveProperty("lop");
  });

  it("vai còn đi học thì lớp vẫn được giữ nguyên", () => {
    const { onLuu } = dungForm();
    goTen(TEN);
    doiVai("con");
    fireEvent.change(oLop()!, { target: { value: LOP_MAM_NON } });
    luu();
    expect(onLuu.mock.calls[0]![0]).toMatchObject({ vaiTro: "con", lop: LOP_MAM_NON });
  });
});
