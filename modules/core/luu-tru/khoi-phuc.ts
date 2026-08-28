/**
 * KHÔI PHỤC SỔ TỪ MỘT TỆP `.zip`.
 *
 * 🔴 VÌ SAO HẠNG MỤC NÀY LÀ RỦI RO CAO. Nút *Sao lưu* đã có từ lâu, nhưng `JSZip.loadAsync`
 * **không hề xuất hiện ở `app/` hay `modules/`** — chỉ có trong test. Nghĩa là người dùng
 * bấm *Sao lưu*, yên tâm, rồi mất máy là mất sổ: tệp `.zip` kia không có đường nào nạp
 * lại. Càng nhiều gia đình dùng thì càng nhiều người tin vào một lời hứa suông.
 *
 * 🔴 HAI PHA, KHÔNG PHẢI MỘT. `docTuZip()` chỉ ĐỌC và KIỂM — không đụng vào kho. Giao diện
 * cầm kết quả đó đi hỏi người dùng ("máy này đang có 3 người, tệp kia có 5 người"), có
 * đồng ý rồi mới gọi `ghiDeKho()`. Gộp hai pha thành một là dựng đúng cái kiểu mất dữ liệu
 * tệ nhất: mất vì chính nút cứu dữ liệu.
 *
 * KHÔNG thuộc tầng lõi (ADR-004): đọc tệp và ghi kho.
 */

import JSZip from "jszip";

import type { PhanTichGiaDinh, ThanhVien } from "@modules/core/gia-dinh/kieu";

import { THU_MUC_MAY_DOC } from "./cay-sao-luu";
import { khoDangDung, type BaiLamLuu } from "./kho-disc";
import { TEP_PHAN_TICH, TEP_THANH_VIEN } from "./sao-luu";

/**
 * 🔴 BA ĐỜI TỆP SAO LƯU, VÀ CẢ BA PHẢI NẠP ĐƯỢC (17.5).
 *
 * | Đời | Bản kê | Bài | Thành viên + phân tích |
 * | --- | --- | --- | --- |
 * | v1 | `ban-ke.json` | `bai/` | (không có) |
 * | v2 (28/08) | `ban-ke.json` | `bai/` | `du-lieu/` |
 * | v3 (17.4) | `_may-doc/ban-ke.json` | `_may-doc/bai/` | `_may-doc/` |
 *
 * Người dùng có thể đang giữ một tệp tải từ đời trước. Nút cứu dữ liệu mà **từ chối chính
 * bản sao lưu của họ** là kiểu hỏng tệ nhất tính năng này mắc được — và nó chỉ lộ ra vào
 * đúng ngày người ta cần đến nó.
 */
const CHO_TIM = {
  banKe: [`${THU_MUC_MAY_DOC}/ban-ke.json`, "ban-ke.json"],
  thanhVien: [`${THU_MUC_MAY_DOC}/thanh-vien.json`, "du-lieu/thanh-vien.json"],
  phanTich: [`${THU_MUC_MAY_DOC}/phan-tich.json`, "du-lieu/phan-tich.json"],
  thuMucBai: [`${THU_MUC_MAY_DOC}/bai`, "bai"],
} as const;

/** Sổ đọc được từ tệp — đã kiểm hình dạng, CHƯA ghi vào kho. */
export type SoTuTep = {
  readonly bai: readonly BaiLamLuu[];
  readonly thanhVien: readonly ThanhVien[];
  readonly phanTich: readonly PhanTichGiaDinh[];
  /** Bản sao lưu đời cũ (v1) không có hai bảng kia — nói ra để giao diện báo cho đúng. */
  readonly banCu: boolean;
};

export type LoiKhoiPhuc =
  | "khong-mo-duoc"
  | "khong-phai-so-disc"
  | "du-lieu-hong";

export type KetQuaDoc =
  | { readonly ok: true; readonly so: SoTuTep }
  | { readonly ok: false; readonly loi: LoiKhoiPhuc; readonly chiTiet?: string };

/* ── Kiểm hình dạng ───────────────────────────────────────────────────────── */

function laChuoi(x: unknown): x is string {
  return typeof x === "string" && x.length > 0;
}

/**
 * 🔴 KIỂM TỐI THIỂU NHƯNG ĐÚNG CHỖ. Chỉ đòi những trường mà nếu thiếu thì giao diện sẽ
 * đọc `undefined.gi-do` và trả về một trang TRẮNG — không phải một lời báo lỗi, nên người
 * dùng chỉ thấy sản phẩm hỏng mà không biết vì sao. Đòi nhiều hơn thế là từ chối những
 * bản sao lưu hoàn toàn dùng được chỉ vì chúng thiếu một trường tuỳ chọn.
 */
function laBaiHopLe(x: unknown): x is BaiLamLuu {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  return (
    laChuoi(b.id) &&
    laChuoi(b.boDe) &&
    laChuoi(b.ketThuc) &&
    typeof b.ketQua === "object" &&
    b.ketQua !== null &&
    typeof b.traLoi === "object" &&
    b.traLoi !== null
  );
}

function laThanhVienHopLe(x: unknown): x is ThanhVien {
  if (typeof x !== "object" || x === null) return false;
  const t = x as Record<string, unknown>;
  return laChuoi(t.id) && laChuoi(t.ten) && laChuoi(t.vaiTro) && typeof t.thuTu === "number";
}

function laPhanTichHopLe(x: unknown): x is PhanTichGiaDinh {
  if (typeof x !== "object" || x === null) return false;
  const p = x as Record<string, unknown>;
  return laChuoi(p.id) && laChuoi(p.taoLuc);
}

async function docJson(zip: JSZip, ten: string): Promise<unknown> {
  const tep = zip.file(ten);
  if (!tep) return undefined;
  return JSON.parse(await tep.async("string"));
}

/** Đọc tệp JSON đầu tiên tìm thấy trong danh sách chỗ có thể nằm. Trả cả đường dẫn đã dùng. */
async function docJsonODau(
  zip: JSZip,
  cho: readonly string[],
): Promise<{ gia: unknown; duong: string } | undefined> {
  for (const duong of cho) {
    const gia = await docJson(zip, duong);
    if (gia !== undefined) return { gia, duong };
  }
  return undefined;
}

/* ── Pha 1: ĐỌC và KIỂM, tuyệt đối không ghi ──────────────────────────────── */

/**
 * Đọc một tệp `.zip` thành sổ. **Không đụng vào kho.**
 *
 * @param duLieu nội dung tệp người dùng vừa chọn.
 */
export async function docTuZip(duLieu: ArrayBuffer | Uint8Array): Promise<KetQuaDoc> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(duLieu);
  } catch {
    return { ok: false, loi: "khong-mo-duoc" };
  }

  try {
    const kho = await docJsonODau(zip, CHO_TIM.banKe);
    const banKe = kho?.gia;
    // 🔴 Hàng rào NHẬN DẠNG. Một tệp `.zip` bất kỳ (ảnh, tài liệu) mở được nhưng KHÔNG
    // phải sổ DISC — ghi đè bằng nó là xoá sổ đang dùng để lấy về con số không.
    if (typeof banKe !== "object" || banKe === null || !("phienBanSaoLuu" in banKe)) {
      return { ok: false, loi: "khong-phai-so-disc" };
    }

    const bai: BaiLamLuu[] = [];
    for (const goc of CHO_TIM.thuMucBai) {
      const tepBai = zip.folder(goc);
      if (!tepBai) continue;
      const ten: string[] = [];
      tepBai.forEach((duong) => {
        // 🔴 CHỈ nhận `.json`. Từ 17.4 tệp .zip còn mang cả PDF; chúng là bản ĐỌC, không
        // phải nguồn dữ liệu — nhưng sự có mặt của chúng KHÔNG được làm bộ đọc từ chối tệp.
        if (duong.endsWith(".json")) ten.push(`${goc}/${duong}`);
      });
      if (ten.length === 0) continue;
      for (const t of ten.sort()) {
        const doc = await docJson(zip, t);
        if (!laBaiHopLe(doc)) return { ok: false, loi: "du-lieu-hong", chiTiet: t };
        bai.push(doc);
      }
      break;
    }

    const tv = await docJsonODau(zip, CHO_TIM.thanhVien);
    const pt = await docJsonODau(zip, CHO_TIM.phanTich);
    const thoTv = tv?.gia;
    const thoPt = pt?.gia;
    const banCu = thoTv === undefined && thoPt === undefined;

    if (thoTv !== undefined && !Array.isArray(thoTv)) {
      return { ok: false, loi: "du-lieu-hong", chiTiet: tv?.duong ?? TEP_THANH_VIEN };
    }
    if (thoPt !== undefined && !Array.isArray(thoPt)) {
      return { ok: false, loi: "du-lieu-hong", chiTiet: pt?.duong ?? TEP_PHAN_TICH };
    }

    const thanhVien = (thoTv ?? []) as unknown[];
    const phanTich = (thoPt ?? []) as unknown[];
    if (!thanhVien.every(laThanhVienHopLe)) {
      return { ok: false, loi: "du-lieu-hong", chiTiet: tv?.duong ?? TEP_THANH_VIEN };
    }
    if (!phanTich.every(laPhanTichHopLe)) {
      return { ok: false, loi: "du-lieu-hong", chiTiet: pt?.duong ?? TEP_PHAN_TICH };
    }

    return {
      ok: true,
      so: {
        bai,
        thanhVien: thanhVien as ThanhVien[],
        phanTich: phanTich as PhanTichGiaDinh[],
        banCu,
      },
    };
  } catch {
    return { ok: false, loi: "du-lieu-hong" };
  }
}

/* ── Pha 2: GHI ĐÈ — chỉ gọi sau khi người dùng đã bấm đồng ý ─────────────── */

/**
 * Ghi sổ vừa đọc vào kho, THAY cho sổ đang có.
 *
 * 🔴 Dọn trước rồi mới ghi, và dọn CẢ BA bảng. Trộn sổ cũ với sổ mới thì được một nhà lai
 * hai nguồn: hai người trùng tên, bài mồ côi trỏ tới người không còn. Khôi phục nghĩa là
 * *"trả máy về đúng lúc sao lưu"*, không phải *"nhập thêm"*.
 */
export async function ghiDeKho(so: SoTuTep): Promise<void> {
  const kho = khoDangDung();
  await kho.xoaSachTatCa();
  for (const tv of so.thanhVien) await kho.luuThanhVien(tv);
  for (const b of so.bai) await kho.luuBai(b);
  for (const pt of so.phanTich) await kho.luuPhanTich(pt);
}
